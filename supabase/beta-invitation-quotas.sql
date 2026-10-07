-- Additive upgrade. Existing codes and sessions retain their access and start with zero invitation slots.
alter table aracne_private.beta_invites add column if not exists parent_invite_id uuid references aracne_private.beta_invites(id);
alter table aracne_private.beta_invites add column if not exists invitation_count integer not null default 0 check(invitation_count between 0 and 50);
alter table aracne_private.beta_invites add column if not exists reserve_count integer not null default 0 check(reserve_count between 0 and 10 and invitation_count+reserve_count<=50);
create index if not exists beta_invites_parent_idx on aracne_private.beta_invites(parent_invite_id);
create table if not exists aracne_private.beta_invitation_slots(
 id uuid primary key default gen_random_uuid(),
 organizer_id uuid not null references aracne_private.beta_invites(id),
 ordinal integer not null check(ordinal between 1 and 50),
 generation integer not null default 1,
 invite_id uuid unique references aracne_private.beta_invites(id),
 issued_at timestamptz, expires_at timestamptz,
 trip_name text,
 unique(organizer_id,ordinal)
);
alter table aracne_private.beta_invitation_slots enable row level security;
revoke all on aracne_private.beta_invitation_slots from public,anon,authenticated;
-- Invoker-only helper, callable only by the existing authenticated beta_api definer.
create or replace function aracne_private.beta_invitation_api(p_action text,p_data jsonb default '{}')
returns jsonb language plpgsql security invoker set search_path='' as $$
declare
 token text:=coalesce(nullif(current_setting('request.headers',true),'')::jsonb->>'x-aracne-beta','');
 actor aracne_private.beta_invites%rowtype;
 organizer aracne_private.beta_invites%rowtype;
 slot aracne_private.beta_invitation_slots%rowtype;
 child aracne_private.beta_invites%rowtype;
 result jsonb; target uuid; quantity integer; reserves integer; rawcode text;
begin
 if token !~ '^[a-f0-9]{64}$' then return jsonb_build_object('error','beta_required'); end if;
 select i.* into actor from aracne_private.beta_sessions s join aracne_private.beta_invites i on i.id=s.invite_id where s.token_hash=sha256(convert_to(token,'UTF8')) and not i.revoked;
 if not found then return jsonb_build_object('error','beta_required'); end if;
 if p_action in ('invites_create_group','invites_quota','invites_dashboard') and not actor.is_admin then return jsonb_build_object('error','denied'); end if;
 if p_action='invites_dashboard' then
  return jsonb_build_object('ok',true,'testers',coalesce((select jsonb_agg(jsonb_build_object('id',i.id,'parent_invite_id',i.parent_invite_id,'organizer',ps.nickname,'invitation_count',i.invitation_count,'reserve_count',i.reserve_count,'expires_at',sl.expires_at,'slot',sl.ordinal,'allocated',(select count(*) from aracne_private.beta_invites ch where ch.parent_invite_id=i.id and (not ch.revoked or ch.used_at is not null)))) from aracne_private.beta_invites i left join aracne_private.beta_sessions ps on ps.invite_id=i.parent_invite_id left join aracne_private.beta_invitation_slots sl on sl.invite_id=i.id),'[]'::jsonb));
 end if;
 if p_action in ('invites_create_group','invites_quota') then
  quantity:=(p_data->>'count')::integer;reserves:=(p_data->>'reserve')::integer;
  if quantity is null or reserves is null or quantity not between 0 and 50 or reserves not between 0 and 10 or quantity+reserves>50 then return jsonb_build_object('error','invalid');end if;
  if p_action='invites_create_group' then
   result:=aracne_private.beta_api('create_batch',jsonb_build_object('label',p_data->>'label','count',1));
   if result->>'ok' is distinct from 'true' then return result;end if;
   select id into target from aracne_private.beta_invites where batch_id=(result->>'batch_id')::uuid;
  else target:=(p_data->>'id')::uuid;end if;
  select * into organizer from aracne_private.beta_invites where id=target for update;
  if not found or organizer.revoked or organizer.parent_invite_id is not null then return jsonb_build_object('error','denied');end if;
  if exists(select 1 from aracne_private.beta_invitation_slots where organizer_id=target and ordinal>quantity+reserves and invite_id is not null) then return jsonb_build_object('error','slots_in_use');end if;
  update aracne_private.beta_invites set invitation_count=quantity,reserve_count=reserves where id=target;
  delete from aracne_private.beta_invitation_slots where organizer_id=target and ordinal>quantity+reserves and invite_id is null;
  insert into aracne_private.beta_invitation_slots(organizer_id,ordinal) select target,n from generate_series(1,quantity+reserves) n on conflict(organizer_id,ordinal) do nothing;
  return coalesce(result,'{}'::jsonb)||jsonb_build_object('ok',true,'invitation_count',quantity,'reserve_count',reserves);
 end if;
 if p_action='invites_list' then
  return jsonb_build_object('ok',true,'organizer',actor.parent_invite_id is null,'invitation_count',actor.invitation_count,'reserve_count',actor.reserve_count,'slots',coalesce((select jsonb_agg(jsonb_build_object('id',sl.id,'ordinal',sl.ordinal,'reserve',sl.ordinal>actor.invitation_count,'status',case when i.used_at is not null then 'activated' when i.revoked then 'revoked' when sl.expires_at<now() then 'expired' when i.id is not null then 'issued' else 'available' end,'nickname',s.nickname,'expires_at',sl.expires_at,'trip_name',sl.trip_name) order by sl.ordinal) from aracne_private.beta_invitation_slots sl left join aracne_private.beta_invites i on i.id=sl.invite_id left join aracne_private.beta_sessions s on s.invite_id=i.id where sl.organizer_id=actor.id),'[]'::jsonb));
 end if;
 if p_action not in ('invites_issue','invites_cancel') then return jsonb_build_object('error','invalid');end if;
 -- Serialize quota changes and issuing; always take organizer, slot, then child locks.
 select * into organizer from aracne_private.beta_invites where id=actor.id for update;
 if organizer.revoked or organizer.parent_invite_id is not null then return jsonb_build_object('error','denied');end if;
 select * into slot from aracne_private.beta_invitation_slots where id=(p_data->>'id')::uuid and organizer_id=actor.id for update;
 if not found or slot.ordinal>organizer.invitation_count+organizer.reserve_count then return jsonb_build_object('error','denied');end if;
 if slot.invite_id is not null then
  select * into child from aracne_private.beta_invites where id=slot.invite_id for update;
  if child.used_at is not null then return jsonb_build_object('error','used_code');end if;
 end if;
 if p_action='invites_cancel' then
  update aracne_private.beta_invites set revoked=true where id=slot.invite_id;
  update aracne_private.beta_invitation_slots set invite_id=null,generation=generation+1,issued_at=null,expires_at=null,trip_name=null where id=slot.id;
  return jsonb_build_object('ok',true);
 end if;
 if slot.invite_id is not null and (child.revoked or slot.expires_at<now()) then return jsonb_build_object('error','replace_required');end if;
 -- Reproducible only with the organizer's own browser token; never store plaintext codes.
 rawcode:=upper(left(encode(extensions.hmac(convert_to('aracne-beta-slot-v1:'||slot.id::text||':'||slot.generation::text,'UTF8'),convert_to(token,'UTF8'),'sha256'),'hex'),24));
 if slot.invite_id is null then
  insert into aracne_private.beta_invites(batch_id,code_hash,suffix,parent_invite_id) values(organizer.batch_id,sha256(convert_to(rawcode,'UTF8')),right(rawcode,6),organizer.id) returning * into child;
  update aracne_private.beta_invitation_slots set invite_id=child.id,issued_at=now(),expires_at=now()+interval '14 days',trip_name=left(coalesce(p_data->>'trip_name',''),120) where id=slot.id returning * into slot;
 end if;
 return jsonb_build_object('ok',true,'code',rawcode,'expires_at',slot.expires_at);
exception when invalid_text_representation or numeric_value_out_of_range then return jsonb_build_object('error','invalid');
end $$;
revoke all on function aracne_private.beta_invitation_api(text,jsonb) from public,anon,authenticated;
