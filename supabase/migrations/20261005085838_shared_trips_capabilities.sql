-- Capability-based pilot. Tables are inaccessible to browser roles; only this RPC
-- can read/write them. Raw invitation secrets are never stored in the database.
create schema if not exists aracne_private;
revoke all on schema aracne_private from public, anon, authenticated;
create table aracne_private.trips (
 id uuid primary key default gen_random_uuid(),
 owner_hash bytea not null, edit_hash bytea not null, read_hash bytea not null,
 document jsonb not null, revision bigint not null default 1,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table aracne_private.trips enable row level security;
revoke all on aracne_private.trips from public, anon, authenticated;

create function public.aracne_trip(p_action text, p_id uuid default null,
 p_token text default null, p_document jsonb default null, p_revision bigint default null,
 p_edit text default null, p_read text default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
 t aracne_private.trips%rowtype; h bytea; role_name text; clean jsonb;
begin
 if p_token is null or p_token !~ '^[a-f0-9]{64}$' then
   return jsonb_build_object('error','denied');
 end if;
 h := sha256(convert_to(p_token,'UTF8'));
 if p_action in ('create','write') then
   if p_document is null or jsonb_typeof(p_document) <> 'object'
      or octet_length(p_document::text) > 524288
      or p_document->>'version' is distinct from '1'
      or jsonb_typeof(p_document->'plan') is distinct from 'array'
      or jsonb_typeof(p_document->'notes') is distinct from 'array' then
     return jsonb_build_object('error','invalid');
   end if;
   -- Only explicit group notes may ever enter shared storage.
   clean := jsonb_set(p_document,'{notes}',coalesce((select jsonb_agg(n)
     from jsonb_array_elements(p_document->'notes') n where n->>'privacy'='group'),'[]'::jsonb));
 end if;
 if p_action='create' then
   if p_edit is null or p_read is null or p_edit !~ '^[a-f0-9]{64}$'
      or p_read !~ '^[a-f0-9]{64}$' or p_token=p_edit or p_token=p_read or p_edit=p_read then
     return jsonb_build_object('error','invalid');
   end if;
   -- A bounded pilot, to limit anonymous storage abuse. Serialize count + insert.
   perform pg_advisory_xact_lock(739142510);
   if (select count(*) from aracne_private.trips)>=1000
      or (select count(*) from aracne_private.trips where created_at>now()-interval '1 hour')>=30 then
     return jsonb_build_object('error','quota');
   end if;
   insert into aracne_private.trips(owner_hash,edit_hash,read_hash,document)
     values(h,sha256(convert_to(p_edit,'UTF8')),sha256(convert_to(p_read,'UTF8')),clean) returning * into t;
   return jsonb_build_object('id',t.id,'revision',t.revision,'role','owner');
 end if;
 select * into t from aracne_private.trips where id=p_id for update;
 if not found then return jsonb_build_object('error','denied'); end if;
 role_name := case when h=t.owner_hash then 'owner' when h=t.edit_hash then 'edit'
   when h=t.read_hash then 'read' else null end;
 if role_name is null then return jsonb_build_object('error','denied'); end if;
 if p_action='read' then
   return jsonb_build_object('id',t.id,'revision',t.revision,'role',role_name,'document',t.document);
 elsif p_action='write' and role_name in ('owner','edit') then
   if p_revision is distinct from t.revision then
     return jsonb_build_object('error','conflict','revision',t.revision);
   end if;
   update aracne_private.trips set document=clean, revision=revision+1,updated_at=now()
     where id=p_id returning * into t;
   return jsonb_build_object('revision',t.revision);
 elsif p_action='rotate' and role_name='owner' then
   if p_edit is null or p_read is null or p_edit !~ '^[a-f0-9]{64}$'
      or p_read !~ '^[a-f0-9]{64}$' or p_token=p_edit or p_token=p_read or p_edit=p_read then
     return jsonb_build_object('error','invalid');
   end if;
   update aracne_private.trips set edit_hash=sha256(convert_to(p_edit,'UTF8')),
     read_hash=sha256(convert_to(p_read,'UTF8')) where id=p_id;
   return jsonb_build_object('ok',true);
 elsif p_action='delete' and role_name='owner' then
   delete from aracne_private.trips where id=p_id;
   return jsonb_build_object('ok',true);
 end if;
 return jsonb_build_object('error','denied');
end;
$$;
revoke all on function public.aracne_trip(text,uuid,text,jsonb,bigint,text,text) from public;
grant execute on function public.aracne_trip(text,uuid,text,jsonb,bigint,text,text) to anon, authenticated;
