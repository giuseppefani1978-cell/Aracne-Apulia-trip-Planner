-- Schema-only baseline inspected 2026-11-01. No production rows or credentials.
-- LOCAL LAB ONLY. Not a production migration.
CREATE SCHEMA aracne_private;
CREATE TABLE aracne_private.beta_batches (
 id uuid DEFAULT gen_random_uuid() NOT NULL,
 label text NOT NULL,
 created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE aracne_private.beta_batches ENABLE ROW LEVEL SECURITY;
CREATE TABLE aracne_private.beta_feedback (
 id uuid NOT NULL,
 session_id uuid NOT NULL,
 category text NOT NULL,
 message text NOT NULL,
 image text,
 locale text,
 version text,
 device text,
 status text DEFAULT 'new'::text NOT NULL,
 created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE aracne_private.beta_feedback ENABLE ROW LEVEL SECURITY;
CREATE TABLE aracne_private.beta_invitation_slots (
 id uuid DEFAULT gen_random_uuid() NOT NULL,
 organizer_id uuid NOT NULL,
 ordinal integer NOT NULL,
 generation integer DEFAULT 1 NOT NULL,
 invite_id uuid,
 issued_at timestamp with time zone,
 expires_at timestamp with time zone,
 trip_name text
);
ALTER TABLE aracne_private.beta_invitation_slots ENABLE ROW LEVEL SECURITY;
CREATE TABLE aracne_private.beta_invites (
 id uuid DEFAULT gen_random_uuid() NOT NULL,
 batch_id uuid NOT NULL,
 code_hash bytea NOT NULL,
 suffix text NOT NULL,
 is_admin boolean DEFAULT false NOT NULL,
 revoked boolean DEFAULT false NOT NULL,
 used_at timestamp with time zone,
 created_at timestamp with time zone DEFAULT now() NOT NULL,
 parent_invite_id uuid,
 invitation_count integer DEFAULT 0 NOT NULL,
 reserve_count integer DEFAULT 0 NOT NULL
);
ALTER TABLE aracne_private.beta_invites ENABLE ROW LEVEL SECURITY;
CREATE TABLE aracne_private.beta_sessions (
 id uuid DEFAULT gen_random_uuid() NOT NULL,
 invite_id uuid NOT NULL,
 token_hash bytea NOT NULL,
 nickname text NOT NULL,
 created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE aracne_private.beta_sessions ENABLE ROW LEVEL SECURITY;
CREATE TABLE aracne_private.beta_settings (
 id boolean DEFAULT true NOT NULL,
 enabled boolean DEFAULT false NOT NULL
);
ALTER TABLE aracne_private.beta_settings ENABLE ROW LEVEL SECURITY;
CREATE TABLE aracne_private.trip_events (
 id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
 trip_id uuid NOT NULL,
 revision bigint NOT NULL,
 actor text DEFAULT 'Participant'::text NOT NULL,
 action text NOT NULL,
 detail text DEFAULT ''::text NOT NULL,
 created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE aracne_private.trip_events ENABLE ROW LEVEL SECURITY;
CREATE TABLE aracne_private.trip_versions (
 id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
 trip_id uuid NOT NULL,
 revision bigint NOT NULL,
 name text NOT NULL,
 document jsonb NOT NULL,
 actor text DEFAULT 'Organisateur'::text NOT NULL,
 label text,
 created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE aracne_private.trip_versions ENABLE ROW LEVEL SECURITY;
CREATE TABLE aracne_private.trips (
 id uuid DEFAULT gen_random_uuid() NOT NULL,
 owner_hash bytea NOT NULL,
 edit_hash bytea NOT NULL,
 read_hash bytea NOT NULL,
 document jsonb NOT NULL,
 revision bigint DEFAULT 1 NOT NULL,
 created_at timestamp with time zone DEFAULT now() NOT NULL,
 updated_at timestamp with time zone DEFAULT now() NOT NULL,
 name text NOT NULL,
 workspace_id uuid,
 archived boolean DEFAULT false NOT NULL
);
ALTER TABLE aracne_private.trips ENABLE ROW LEVEL SECURITY;
CREATE TABLE aracne_private.workspaces (
 id uuid DEFAULT gen_random_uuid() NOT NULL,
 owner_hash bytea NOT NULL,
 created_at timestamp with time zone DEFAULT now() NOT NULL,
 updated_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE aracne_private.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE aracne_private.beta_batches ADD CONSTRAINT beta_batches_label_check CHECK (((length(label) >= 1) AND (length(label) <= 80)));
ALTER TABLE aracne_private.beta_feedback ADD CONSTRAINT beta_feedback_status_check CHECK ((status = ANY (ARRAY['new'::text, 'progress'::text, 'resolved'::text])));
ALTER TABLE aracne_private.beta_feedback ADD CONSTRAINT beta_feedback_category_check CHECK ((category = ANY (ARRAY['bug'::text, 'idea'::text, 'place'::text, 'other'::text])));
ALTER TABLE aracne_private.beta_feedback ADD CONSTRAINT beta_feedback_message_check CHECK (((length(message) >= 1) AND (length(message) <= 4000)));
ALTER TABLE aracne_private.beta_invitation_slots ADD CONSTRAINT beta_invitation_slots_ordinal_check CHECK (((ordinal >= 1) AND (ordinal <= 50)));
ALTER TABLE aracne_private.beta_invites ADD CONSTRAINT beta_invites_invitation_count_check CHECK (((invitation_count >= 0) AND (invitation_count <= 50)));
ALTER TABLE aracne_private.beta_invites ADD CONSTRAINT beta_invites_check CHECK ((((reserve_count >= 0) AND (reserve_count <= 10)) AND ((invitation_count + reserve_count) <= 50)));
ALTER TABLE aracne_private.beta_sessions ADD CONSTRAINT beta_sessions_nickname_check CHECK (((length(nickname) >= 1) AND (length(nickname) <= 60)));
ALTER TABLE aracne_private.beta_settings ADD CONSTRAINT beta_settings_id_check CHECK (id);
ALTER TABLE aracne_private.beta_batches ADD CONSTRAINT beta_batches_pkey PRIMARY KEY (id);
ALTER TABLE aracne_private.beta_feedback ADD CONSTRAINT beta_feedback_pkey PRIMARY KEY (id);
ALTER TABLE aracne_private.beta_invitation_slots ADD CONSTRAINT beta_invitation_slots_pkey PRIMARY KEY (id);
ALTER TABLE aracne_private.beta_invites ADD CONSTRAINT beta_invites_pkey PRIMARY KEY (id);
ALTER TABLE aracne_private.beta_sessions ADD CONSTRAINT beta_sessions_pkey PRIMARY KEY (id);
ALTER TABLE aracne_private.beta_settings ADD CONSTRAINT beta_settings_pkey PRIMARY KEY (id);
ALTER TABLE aracne_private.trip_events ADD CONSTRAINT trip_events_pkey PRIMARY KEY (id);
ALTER TABLE aracne_private.trip_versions ADD CONSTRAINT trip_versions_pkey PRIMARY KEY (id);
ALTER TABLE aracne_private.trips ADD CONSTRAINT trips_pkey PRIMARY KEY (id);
ALTER TABLE aracne_private.workspaces ADD CONSTRAINT workspaces_pkey PRIMARY KEY (id);
ALTER TABLE aracne_private.beta_invitation_slots ADD CONSTRAINT beta_invitation_slots_invite_id_key UNIQUE (invite_id);
ALTER TABLE aracne_private.beta_invitation_slots ADD CONSTRAINT beta_invitation_slots_organizer_id_ordinal_key UNIQUE (organizer_id, ordinal);
ALTER TABLE aracne_private.beta_invites ADD CONSTRAINT beta_invites_code_hash_key UNIQUE (code_hash);
ALTER TABLE aracne_private.beta_sessions ADD CONSTRAINT beta_sessions_token_hash_key UNIQUE (token_hash);
ALTER TABLE aracne_private.beta_sessions ADD CONSTRAINT beta_sessions_invite_id_key UNIQUE (invite_id);
ALTER TABLE aracne_private.beta_feedback ADD CONSTRAINT beta_feedback_session_id_fkey FOREIGN KEY (session_id) REFERENCES aracne_private.beta_sessions(id);
ALTER TABLE aracne_private.beta_invitation_slots ADD CONSTRAINT beta_invitation_slots_invite_id_fkey FOREIGN KEY (invite_id) REFERENCES aracne_private.beta_invites(id);
ALTER TABLE aracne_private.beta_invitation_slots ADD CONSTRAINT beta_invitation_slots_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES aracne_private.beta_invites(id);
ALTER TABLE aracne_private.beta_invites ADD CONSTRAINT beta_invites_parent_invite_id_fkey FOREIGN KEY (parent_invite_id) REFERENCES aracne_private.beta_invites(id);
ALTER TABLE aracne_private.beta_invites ADD CONSTRAINT beta_invites_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES aracne_private.beta_batches(id);
ALTER TABLE aracne_private.beta_sessions ADD CONSTRAINT beta_sessions_invite_id_fkey FOREIGN KEY (invite_id) REFERENCES aracne_private.beta_invites(id);
ALTER TABLE aracne_private.trip_events ADD CONSTRAINT trip_events_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES aracne_private.trips(id) ON DELETE CASCADE;
ALTER TABLE aracne_private.trip_versions ADD CONSTRAINT trip_versions_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES aracne_private.trips(id) ON DELETE CASCADE;
ALTER TABLE aracne_private.trips ADD CONSTRAINT aracne_trips_workspace_fk FOREIGN KEY (workspace_id) REFERENCES aracne_private.workspaces(id) ON DELETE SET NULL;
CREATE OR REPLACE FUNCTION aracne_private.beta_invitation_api(p_action text, p_data jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
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
end $function$
;
CREATE OR REPLACE FUNCTION aracne_private.beta_api(p_action text, p_data jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
 token text:=coalesce(nullif(current_setting('request.headers',true),'')::jsonb->>'x-aracne-beta','');
 s aracne_private.beta_sessions%rowtype;
 i aracne_private.beta_invites%rowtype;
 invitation_slot aracne_private.beta_invitation_slots%rowtype;
 code text; bid uuid; sid uuid; rawcode text; result jsonb:='[]'; quantity integer; admin boolean:=false;
begin
 if token !~ '^[a-f0-9]{64}$' then return jsonb_build_object('error','beta_required'); end if;
 select bs.* into s from aracne_private.beta_sessions bs join aracne_private.beta_invites bi on bi.id=bs.invite_id where bs.token_hash=sha256(convert_to(token,'UTF8')) and not bi.revoked;
 if found then select is_admin into admin from aracne_private.beta_invites where id=s.invite_id; end if;
 if p_action='activate' then
   code:=upper(regexp_replace(coalesce(p_data->>'code',''),'[^a-zA-Z0-9]','','g'));
   if code !~ '^[A-F0-9]{24}$' or length(btrim(coalesce(p_data->>'nickname',''))) not between 1 and 60 then return jsonb_build_object('error','invalid_code'); end if;
   select sl.* into invitation_slot from aracne_private.beta_invitation_slots sl join aracne_private.beta_invites bi on bi.id=sl.invite_id where bi.code_hash=sha256(convert_to(code,'UTF8')) for update of sl;
   if found and (invitation_slot.expires_at<now() or not exists(select 1 from aracne_private.beta_invites parent where parent.id=invitation_slot.organizer_id and not parent.revoked)) then return jsonb_build_object('error','invalid_code');end if;
   select * into i from aracne_private.beta_invites where code_hash=sha256(convert_to(code,'UTF8')) for update;
   if not found or i.revoked then return jsonb_build_object('error','invalid_code'); end if;
   if i.used_at is not null then
     if s.invite_id=i.id then return jsonb_build_object('ok',true,'admin',admin,'nickname',s.nickname); end if;
     return jsonb_build_object('error','used_code');
   end if;
   if s.id is not null or exists(select 1 from aracne_private.beta_sessions where token_hash=sha256(convert_to(token,'UTF8'))) then return jsonb_build_object('error','session_exists'); end if;
   insert into aracne_private.beta_sessions(invite_id,token_hash,nickname) values(i.id,sha256(convert_to(token,'UTF8')),btrim(p_data->>'nickname'));
   update aracne_private.beta_invites set used_at=now() where id=i.id;
   return jsonb_build_object('ok',true,'admin',i.is_admin,'nickname',btrim(p_data->>'nickname'));
 end if;
 if s.id is null then return jsonb_build_object('error','beta_required'); end if;
 if p_action in ('invites_list','invites_issue','invites_cancel','invites_create_group','invites_quota','invites_dashboard') then return aracne_private.beta_invitation_api(p_action,p_data);end if;
 if p_action='session' then return jsonb_build_object('ok',true,'admin',admin,'nickname',s.nickname); end if;
 if p_action='feedback' then
   if coalesce(p_data->>'category','') not in ('bug','idea','place','other') or length(btrim(coalesce(p_data->>'message',''))) not between 1 and 4000 or coalesce(length(p_data->>'image'),0)>1400000 or (coalesce(p_data->>'image','')<>'' and p_data->>'image' !~ '^data:image/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$') then return jsonb_build_object('error','invalid'); end if;
   perform 1 from aracne_private.beta_sessions where id=s.id for update;
   if exists(select 1 from aracne_private.beta_feedback where id=(p_data->>'id')::uuid and session_id=s.id) then return jsonb_build_object('ok',true); end if;
   if (select count(*) from aracne_private.beta_feedback where session_id=s.id and created_at>now()-interval '1 hour')>=20 then return jsonb_build_object('error','quota'); end if;
   insert into aracne_private.beta_feedback(id,session_id,category,message,image,locale,version,device) values((p_data->>'id')::uuid,s.id,p_data->>'category',btrim(p_data->>'message'),nullif(p_data->>'image',''),left(p_data->>'locale',5),left(p_data->>'version',40),left(p_data->>'device',200));
   return jsonb_build_object('ok',true);
 end if;
 if not admin then return jsonb_build_object('error','denied'); end if;
 if p_action='create_batch' then
   quantity:=(p_data->>'count')::integer;
   if quantity is null or quantity not between 1 and 50 or length(btrim(coalesce(p_data->>'label',''))) not between 1 and 80 then return jsonb_build_object('error','invalid'); end if;
   perform pg_advisory_xact_lock(739142512);
   if (select count(*) from aracne_private.beta_invites)>10000 then return jsonb_build_object('error','quota'); end if;
   insert into aracne_private.beta_batches(label) values(btrim(p_data->>'label')) returning id into bid;
   for n in 1..quantity loop
     rawcode:=upper(encode(extensions.gen_random_bytes(12),'hex'));
     insert into aracne_private.beta_invites(batch_id,code_hash,suffix) values(bid,sha256(convert_to(rawcode,'UTF8')),right(rawcode,6));
     result:=result||to_jsonb(substr(rawcode,1,6)||'-'||substr(rawcode,7,6)||'-'||substr(rawcode,13,6)||'-'||substr(rawcode,19,6));
   end loop;
   return jsonb_build_object('ok',true,'codes',result,'batch_id',bid);
 elsif p_action='dashboard' then
   return jsonb_build_object('batches',coalesce((select jsonb_agg(x order by x.created_at desc) from (select b.*,count(inv.id) filter(where not inv.revoked and inv.used_at is null) available,count(inv.id) filter(where not inv.revoked and inv.used_at is not null) used,count(inv.id) filter(where inv.revoked) revoked from aracne_private.beta_batches b left join aracne_private.beta_invites inv on inv.batch_id=b.id group by b.id) x),'[]'::jsonb),
   'testers',coalesce((select jsonb_agg(x order by x.created_at desc) from (select inv.id,inv.batch_id,inv.suffix,inv.used_at,inv.revoked,inv.is_admin,inv.created_at,sess.nickname from aracne_private.beta_invites inv left join aracne_private.beta_sessions sess on sess.invite_id=inv.id) x),'[]'::jsonb),
   'feedback',coalesce((select jsonb_agg(x order by x.created_at desc) from (select f.id,f.category,f.message,f.locale,f.version,f.device,f.status,f.created_at,(f.image is not null) has_image,sess.nickname,inv.batch_id from aracne_private.beta_feedback f join aracne_private.beta_sessions sess on sess.id=f.session_id join aracne_private.beta_invites inv on inv.id=sess.invite_id order by f.created_at desc limit 500) x),'[]'::jsonb));
 elsif p_action='revoke' then
   update aracne_private.beta_invites set revoked=true where id=(p_data->>'id')::uuid and not is_admin;
   return jsonb_build_object('ok',true);
 elsif p_action='feedback_status' then
   if coalesce(p_data->>'status','') not in ('new','progress','resolved') then return jsonb_build_object('error','invalid'); end if;
   update aracne_private.beta_feedback set status=p_data->>'status' where id=(p_data->>'id')::uuid;
   return jsonb_build_object('ok',true);
 elsif p_action='feedback_image' then
   return jsonb_build_object('image',(select image from aracne_private.beta_feedback where id=(p_data->>'id')::uuid));
 end if;
 return jsonb_build_object('error','invalid');
end $function$
;
CREATE OR REPLACE FUNCTION aracne_private.beta_allowed()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
 select not (select enabled from aracne_private.beta_settings where id) or exists(
 select 1 from aracne_private.beta_sessions s join aracne_private.beta_invites i on i.id=s.invite_id
 where not i.revoked and s.token_hash=sha256(convert_to(coalesce(nullif(current_setting('request.headers',true),'')::jsonb->>'x-aracne-beta',''),'UTF8')))
$function$
;
CREATE OR REPLACE FUNCTION public.aracne_beta(p_action text, p_data jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE sql
 SET search_path TO ''
AS $function$ select aracne_private.beta_api(p_action,p_data) $function$
;
CREATE OR REPLACE FUNCTION public.aracne_trip_v2(p_action text, p_id uuid DEFAULT NULL::uuid, p_token text DEFAULT NULL::text, p_document jsonb DEFAULT NULL::jsonb, p_revision bigint DEFAULT NULL::bigint, p_edit text DEFAULT NULL::text, p_read text DEFAULT NULL::text, p_name text DEFAULT NULL::text, p_actor text DEFAULT NULL::text, p_events jsonb DEFAULT '[]'::jsonb, p_since_event bigint DEFAULT 0, p_version_id bigint DEFAULT NULL::bigint, p_label text DEFAULT NULL::text, p_workspace_id uuid DEFAULT NULL::uuid, p_workspace_token text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
 t aracne_private.trips%rowtype;
 v aracne_private.trip_versions%rowtype;
 h bytea;
 wh bytea;
 role_name text;
 clean jsonb;
 clean_name text;
 event_row jsonb;
 last_event bigint;
 workspace_ok boolean:=false;
begin
 if not aracne_private.beta_allowed() then return jsonb_build_object('error','beta_required'); end if;
 if p_token is not null and p_token ~ '^[a-f0-9]{64}$' then
   h:=sha256(convert_to(p_token,'UTF8'));
 end if;
 if p_workspace_id is not null and p_workspace_token is not null and p_workspace_token ~ '^[a-f0-9]{64}$' then
   wh:=sha256(convert_to(p_workspace_token,'UTF8'));
   workspace_ok:=exists(select 1 from aracne_private.workspaces w where w.id=p_workspace_id and w.owner_hash=wh);
 end if;

 if p_action in ('create','write') then
   if p_document is null or jsonb_typeof(p_document)<>'object'
      or octet_length(p_document::text)>524288
      or p_document->>'version' is distinct from '1'
      or jsonb_typeof(p_document->'plan') is distinct from 'array'
      or jsonb_typeof(p_document->'notes') is distinct from 'array' then
     return jsonb_build_object('error','invalid');
   end if;
   clean:=jsonb_set(p_document,'{notes}',coalesce((select jsonb_agg(n)
     from jsonb_array_elements(p_document->'notes') n where n->>'privacy'='group'),'[]'::jsonb));
 end if;

 if p_action='create' then
   if h is null or p_edit is null or p_read is null or p_edit !~ '^[a-f0-9]{64}$'
      or p_read !~ '^[a-f0-9]{64}$' or p_token=p_edit or p_token=p_read or p_edit=p_read then
     return jsonb_build_object('error','invalid');
   end if;
   clean_name:=left(btrim(coalesce(nullif(p_name,''),clean->>'name','')),80);
   if clean_name='' then return jsonb_build_object('error','name_required'); end if;
   clean:=jsonb_set(clean,'{name}',to_jsonb(clean_name),true);
   perform pg_advisory_xact_lock(739142510);
   if (select count(*) from aracne_private.trips)>=1000
      or (select count(*) from aracne_private.trips where created_at>now()-interval '1 hour')>=30 then
     return jsonb_build_object('error','quota');
   end if;
   insert into aracne_private.trips(owner_hash,edit_hash,read_hash,document,name,workspace_id)
   values(h,sha256(convert_to(p_edit,'UTF8')),sha256(convert_to(p_read,'UTF8')),clean,clean_name,
          case when workspace_ok then p_workspace_id else null end)
   returning * into t;
   insert into aracne_private.trip_versions(trip_id,revision,name,document,actor,label)
   values(t.id,t.revision,t.name,t.document,left(coalesce(nullif(p_actor,''),'Organisateur'),60),'Création');
   return jsonb_build_object('id',t.id,'revision',t.revision,'role','owner','name',t.name,'last_event',0);
 end if;

 select * into t from aracne_private.trips where id=p_id for update;
 if not found then return jsonb_build_object('error','denied'); end if;

 role_name:=case
   when workspace_ok and t.workspace_id=p_workspace_id then 'owner'
   when h=t.owner_hash then 'owner'
   when h=t.edit_hash then 'edit'
   when h=t.read_hash then 'read'
   else null end;
 if role_name is null then return jsonb_build_object('error','denied'); end if;

 if t.document->>'schemaVersion'='5' and p_action<>'read' and p_action<>'versions' then
 return jsonb_build_object('error','upgrade_required');
 end if;
 if p_action='read' then
   select max(id) into last_event from aracne_private.trip_events where trip_id=t.id;
   return jsonb_build_object(
     'id',t.id,'name',t.name,'revision',t.revision,'role',role_name,'document',t.document,
     'last_event',coalesce(last_event,0),
     'events',coalesce((select jsonb_agg(jsonb_build_object(
       'id',e.id,'revision',e.revision,'actor',e.actor,'action',e.action,
       'detail',e.detail,'created_at',e.created_at
     ) order by e.id)
     from aracne_private.trip_events e where e.trip_id=t.id and e.id>coalesce(p_since_event,0)),'[]'::jsonb)
   );
 elsif p_action='write' and role_name in ('owner','edit') then
   if p_revision is distinct from t.revision then
     return jsonb_build_object('error','conflict','revision',t.revision);
   end if;
   if role_name='edit' then
     clean:=jsonb_set(clean,'{name}',to_jsonb(t.name),true);
     clean_name:=t.name;
   else
     clean_name:=left(btrim(coalesce(nullif(clean->>'name',''),t.name)),80);
     clean:=jsonb_set(clean,'{name}',to_jsonb(clean_name),true);
   end if;
   update aracne_private.trips set document=clean,name=clean_name,revision=revision+1,updated_at=now()
    where id=t.id returning * into t;
   if jsonb_typeof(p_events)='array' then
     for event_row in select * from jsonb_array_elements(p_events)
     loop
       if coalesce(event_row->>'action','')<>'' then
         insert into aracne_private.trip_events(trip_id,revision,actor,action,detail)
         values(t.id,t.revision,left(coalesce(nullif(event_row->>'actor',''),nullif(p_actor,''),'Participant'),60),
                left(event_row->>'action',160),left(coalesce(event_row->>'detail',''),500));
       end if;
     end loop;
   end if;
   select max(id) into last_event from aracne_private.trip_events where trip_id=t.id;
   return jsonb_build_object('revision',t.revision,'name',t.name,'last_event',coalesce(last_event,0));
 elsif p_action='snapshot' and role_name='owner' then
   insert into aracne_private.trip_versions(trip_id,revision,name,document,actor,label)
   values(t.id,t.revision,t.name,t.document,left(coalesce(nullif(p_actor,''),'Organisateur'),60),left(p_label,100))
   returning * into v;
   return jsonb_build_object('version_id',v.id,'revision',v.revision,'created_at',v.created_at);
 elsif p_action='versions' then
   return jsonb_build_object('versions',coalesce((
     select jsonb_agg(jsonb_build_object(
       'id',x.id,'revision',x.revision,'name',x.name,'actor',x.actor,'label',x.label,'created_at',x.created_at
     ) order by x.created_at desc)
     from aracne_private.trip_versions x where x.trip_id=t.id
   ),'[]'::jsonb));
 elsif p_action='restore' and role_name='owner' then
   select * into v from aracne_private.trip_versions where id=p_version_id and trip_id=t.id;
   if not found then return jsonb_build_object('error','invalid'); end if;
   update aracne_private.trips set document=v.document,name=v.name,revision=revision+1,updated_at=now()
    where id=t.id returning * into t;
   insert into aracne_private.trip_events(trip_id,revision,actor,action,detail)
   values(t.id,t.revision,left(coalesce(nullif(p_actor,''),'Organisateur'),60),'a restauré une sauvegarde',
          'Révision '||v.revision::text);
   return jsonb_build_object('revision',t.revision,'document',t.document,'name',t.name);
 elsif p_action='rename' and role_name='owner' then
   clean_name:=left(btrim(coalesce(p_name,'')),80);
   if clean_name='' then return jsonb_build_object('error','name_required'); end if;
   update aracne_private.trips
      set name=clean_name,document=jsonb_set(document,'{name}',to_jsonb(clean_name),true),
          revision=revision+1,updated_at=now()
    where id=t.id returning * into t;
   insert into aracne_private.trip_events(trip_id,revision,actor,action,detail)
   values(t.id,t.revision,left(coalesce(nullif(p_actor,''),'Organisateur'),60),'a renommé le voyage',clean_name);
   return jsonb_build_object('revision',t.revision,'name',t.name);
 elsif p_action='rotate' and role_name='owner' then
   if p_edit is null or p_read is null or p_edit !~ '^[a-f0-9]{64}$'
      or p_read !~ '^[a-f0-9]{64}$' or p_token=p_edit or p_token=p_read or p_edit=p_read then
     return jsonb_build_object('error','invalid');
   end if;
   update aracne_private.trips set edit_hash=sha256(convert_to(p_edit,'UTF8')),
     read_hash=sha256(convert_to(p_read,'UTF8')),updated_at=now() where id=t.id;
   return jsonb_build_object('ok',true);
 elsif p_action='delete' and role_name='owner' then
   delete from aracne_private.trips where id=t.id;
   return jsonb_build_object('ok',true);
 end if;
 return jsonb_build_object('error','denied');
end $function$
;
CREATE OR REPLACE FUNCTION public.aracne_trip(p_action text, p_id uuid DEFAULT NULL::uuid, p_token text DEFAULT NULL::text, p_document jsonb DEFAULT NULL::jsonb, p_revision bigint DEFAULT NULL::bigint, p_edit text DEFAULT NULL::text, p_read text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
 t aracne_private.trips%rowtype; h bytea; role_name text; clean jsonb;
begin
 if not aracne_private.beta_allowed() then return jsonb_build_object('error','beta_required'); end if;
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
$function$
;
CREATE OR REPLACE FUNCTION public.aracne_trip_v5(p_action text, p_id uuid DEFAULT NULL::uuid, p_token text DEFAULT NULL::text, p_document jsonb DEFAULT NULL::jsonb, p_revision bigint DEFAULT NULL::bigint, p_edit text DEFAULT NULL::text, p_read text DEFAULT NULL::text, p_name text DEFAULT NULL::text, p_actor text DEFAULT NULL::text, p_events jsonb DEFAULT '[]'::jsonb, p_since_event bigint DEFAULT 0, p_version_id bigint DEFAULT NULL::bigint, p_label text DEFAULT NULL::text, p_workspace_id uuid DEFAULT NULL::uuid, p_workspace_token text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
 t aracne_private.trips%rowtype;
 v aracne_private.trip_versions%rowtype;
 h bytea;
 wh bytea;
 role_name text;
 clean jsonb;
 clean_name text;
 event_row jsonb;
 last_event bigint;
 workspace_ok boolean:=false;
begin
 if not aracne_private.beta_allowed() then return jsonb_build_object('error','beta_required'); end if;
 if p_token is not null and p_token ~ '^[a-f0-9]{64}$' then
   h:=sha256(convert_to(p_token,'UTF8'));
 end if;
 if p_workspace_id is not null and p_workspace_token is not null and p_workspace_token ~ '^[a-f0-9]{64}$' then
   wh:=sha256(convert_to(p_workspace_token,'UTF8'));
   workspace_ok:=exists(select 1 from aracne_private.workspaces w where w.id=p_workspace_id and w.owner_hash=wh);
 end if;

 if p_action in ('create','write') then
   if p_document is null or jsonb_typeof(p_document)<>'object'
      or octet_length(p_document::text)>524288
      or p_document->>'version' is distinct from '1'
      or jsonb_typeof(p_document->'plan') is distinct from 'array'
      or jsonb_typeof(p_document->'notes') is distinct from 'array' then
     return jsonb_build_object('error','invalid');
   end if;
   clean:=jsonb_set(p_document,'{notes}',coalesce((select jsonb_agg(n)
     from jsonb_array_elements(p_document->'notes') n where n->>'privacy'='group'),'[]'::jsonb));
 end if;

 if p_action in ('create','write') then
 clean:=jsonb_set(clean,'{schemaVersion}','5'::jsonb,true);
 end if;
 if p_action='create' then
   if h is null or p_edit is null or p_read is null or p_edit !~ '^[a-f0-9]{64}$'
      or p_read !~ '^[a-f0-9]{64}$' or p_token=p_edit or p_token=p_read or p_edit=p_read then
     return jsonb_build_object('error','invalid');
   end if;
   clean_name:=left(btrim(coalesce(nullif(p_name,''),clean->>'name','')),80);
   if clean_name='' then return jsonb_build_object('error','name_required'); end if;
   clean:=jsonb_set(clean,'{name}',to_jsonb(clean_name),true);
   perform pg_advisory_xact_lock(739142510);
   if (select count(*) from aracne_private.trips)>=1000
      or (select count(*) from aracne_private.trips where created_at>now()-interval '1 hour')>=30 then
     return jsonb_build_object('error','quota');
   end if;
   insert into aracne_private.trips(owner_hash,edit_hash,read_hash,document,name,workspace_id)
   values(h,sha256(convert_to(p_edit,'UTF8')),sha256(convert_to(p_read,'UTF8')),clean,clean_name,
          case when workspace_ok then p_workspace_id else null end)
   returning * into t;
   insert into aracne_private.trip_versions(trip_id,revision,name,document,actor,label)
   values(t.id,t.revision,t.name,t.document,left(coalesce(nullif(p_actor,''),'Organisateur'),60),'Création');
   return jsonb_build_object('id',t.id,'revision',t.revision,'role','owner','name',t.name,'last_event',0);
 end if;

 select * into t from aracne_private.trips where id=p_id for update;
 if not found then return jsonb_build_object('error','denied'); end if;

 role_name:=case
   when workspace_ok and t.workspace_id=p_workspace_id then 'owner'
   when h=t.owner_hash then 'owner'
   when h=t.edit_hash then 'edit'
   when h=t.read_hash then 'read'
   else null end;
 if role_name is null then return jsonb_build_object('error','denied'); end if;

 if p_action='read' then
   select max(id) into last_event from aracne_private.trip_events where trip_id=t.id;
   return jsonb_build_object(
     'id',t.id,'name',t.name,'revision',t.revision,'role',role_name,'document',t.document,
     'last_event',coalesce(last_event,0),
     'events',coalesce((select jsonb_agg(jsonb_build_object(
       'id',e.id,'revision',e.revision,'actor',e.actor,'action',e.action,
       'detail',e.detail,'created_at',e.created_at
     ) order by e.id)
     from aracne_private.trip_events e where e.trip_id=t.id and e.id>coalesce(p_since_event,0)),'[]'::jsonb)
   );
 elsif p_action='write' and role_name in ('owner','edit') then
   if p_revision is distinct from t.revision then
     return jsonb_build_object('error','conflict','revision',t.revision);
   end if;
   if role_name='edit' then
     if exists(select 1 from jsonb_each(clean) e where e.key in
       ('theme','people','start','days','arrival','budget','pace','transport','interests','frameworkLocked','resetEpoch','publishedBook','carnetVersion','finalizedAt','finalizedBy','finalizedFingerprint')
       and e.value is distinct from t.document->e.key)
       or exists(select 1 from jsonb_each(t.document) e where e.key in
       ('theme','people','start','days','arrival','budget','pace','transport','interests','frameworkLocked','resetEpoch','publishedBook','carnetVersion','finalizedAt','finalizedBy','finalizedFingerprint')
       and e.value is distinct from clean->e.key)
     then return jsonb_build_object('error','denied');end if;
     if exists (
       select 1 from jsonb_array_elements(clean->'plan') d cross join lateral jsonb_array_elements(d) s
       where s->>'status'='validated' and not exists (
         select 1 from jsonb_array_elements(t.document->'plan') od cross join lateral jsonb_array_elements(od) os
         where os=s
       )
     ) then return jsonb_build_object('error','denied'); end if;
     clean:=jsonb_set(clean,'{name}',to_jsonb(t.name),true);
     clean_name:=t.name;
   else
     clean_name:=left(btrim(coalesce(nullif(clean->>'name',''),t.name)),80);
     clean:=jsonb_set(clean,'{name}',to_jsonb(clean_name),true);
   end if;
   update aracne_private.trips set document=clean,name=clean_name,revision=revision+1,updated_at=now()
    where id=t.id returning * into t;
   if jsonb_typeof(p_events)='array' then
     for event_row in select * from jsonb_array_elements(p_events)
     loop
       if coalesce(event_row->>'action','')<>'' then
         insert into aracne_private.trip_events(trip_id,revision,actor,action,detail)
         values(t.id,t.revision,left(coalesce(nullif(event_row->>'actor',''),nullif(p_actor,''),'Participant'),60),
                left(event_row->>'action',160),left(coalesce(event_row->>'detail',''),500));
       end if;
     end loop;
   end if;
   select max(id) into last_event from aracne_private.trip_events where trip_id=t.id;
   return jsonb_build_object('revision',t.revision,'name',t.name,'last_event',coalesce(last_event,0));
 elsif p_action='snapshot' and role_name='owner' then
   insert into aracne_private.trip_versions(trip_id,revision,name,document,actor,label)
   values(t.id,t.revision,t.name,t.document,left(coalesce(nullif(p_actor,''),'Organisateur'),60),left(p_label,100))
   returning * into v;
   return jsonb_build_object('version_id',v.id,'revision',v.revision,'created_at',v.created_at);
 elsif p_action='versions' then
   return jsonb_build_object('versions',coalesce((
     select jsonb_agg(jsonb_build_object(
       'id',x.id,'revision',x.revision,'name',x.name,'actor',x.actor,'label',x.label,'created_at',x.created_at
     ) order by x.created_at desc)
     from aracne_private.trip_versions x where x.trip_id=t.id
   ),'[]'::jsonb));
 elsif p_action='restore' and role_name='owner' then
   select * into v from aracne_private.trip_versions where id=p_version_id and trip_id=t.id;
   if not found then return jsonb_build_object('error','invalid'); end if;
   insert into aracne_private.trip_versions(trip_id,revision,name,document,actor,label) values(t.id,t.revision,t.name,t.document,left(coalesce(p_actor,'Organisateur'),60),'Before restore');
   update aracne_private.trips set document=jsonb_set(v.document,'{schemaVersion}','5'::jsonb,true),name=v.name,revision=revision+1,updated_at=now()
    where id=t.id returning * into t;
   insert into aracne_private.trip_events(trip_id,revision,actor,action,detail)
   values(t.id,t.revision,left(coalesce(nullif(p_actor,''),'Organisateur'),60),'a restauré une sauvegarde',
          'Révision '||v.revision::text);
   return jsonb_build_object('revision',t.revision,'document',t.document,'name',t.name);
 elsif p_action='rename' and role_name='owner' then
   clean_name:=left(btrim(coalesce(p_name,'')),80);
   if clean_name='' then return jsonb_build_object('error','name_required'); end if;
   update aracne_private.trips
      set name=clean_name,document=jsonb_set(document,'{name}',to_jsonb(clean_name),true),
          revision=revision+1,updated_at=now()
    where id=t.id returning * into t;
   insert into aracne_private.trip_events(trip_id,revision,actor,action,detail)
   values(t.id,t.revision,left(coalesce(nullif(p_actor,''),'Organisateur'),60),'a renommé le voyage',clean_name);
   return jsonb_build_object('revision',t.revision,'name',t.name);
 elsif p_action='rotate' and role_name='owner' then
   if p_edit is null or p_read is null or p_edit !~ '^[a-f0-9]{64}$'
      or p_read !~ '^[a-f0-9]{64}$' or p_token=p_edit or p_token=p_read or p_edit=p_read then
     return jsonb_build_object('error','invalid');
   end if;
   update aracne_private.trips set edit_hash=sha256(convert_to(p_edit,'UTF8')),
     read_hash=sha256(convert_to(p_read,'UTF8')),updated_at=now() where id=t.id;
   return jsonb_build_object('ok',true);
 elsif p_action='delete' and role_name='owner' then
   delete from aracne_private.trips where id=t.id;
   return jsonb_build_object('ok',true);
 end if;
 return jsonb_build_object('error','denied');
end $function$
;
CREATE OR REPLACE FUNCTION public.aracne_workspace(p_action text, p_id uuid DEFAULT NULL::uuid, p_token text DEFAULT NULL::text, p_trip_id uuid DEFAULT NULL::uuid, p_trip_token text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
 w aracne_private.workspaces%rowtype;
 t aracne_private.trips%rowtype;
 h bytea;
begin
 if not aracne_private.beta_allowed() then return jsonb_build_object('error','beta_required'); end if;
 if p_token is null or p_token !~ '^[a-f0-9]{64}$' then
   return jsonb_build_object('error','denied');
 end if;
 h:=sha256(convert_to(p_token,'UTF8'));
 if p_action='create' then
   perform pg_advisory_xact_lock(739142511);
   if (select count(*) from aracne_private.workspaces where created_at>now()-interval '1 hour')>=60 then
     return jsonb_build_object('error','quota');
   end if;
   insert into aracne_private.workspaces(owner_hash) values(h) returning * into w;
   return jsonb_build_object('id',w.id);
 end if;
 select * into w from aracne_private.workspaces where id=p_id and owner_hash=h;
 if not found then return jsonb_build_object('error','denied'); end if;
 if p_action='list' then
   return jsonb_build_object('trips',coalesce((
     select jsonb_agg(jsonb_build_object(
       'id',tr.id,'name',tr.name,'revision',tr.revision,
       'updated_at',tr.updated_at,'created_at',tr.created_at,'archived',tr.archived
     ) order by tr.updated_at desc)
     from aracne_private.trips tr where tr.workspace_id=w.id
   ),'[]'::jsonb));
 elsif p_action='attach' then
   if p_trip_token is null or p_trip_token !~ '^[a-f0-9]{64}$' then
     return jsonb_build_object('error','denied');
   end if;
   select * into t from aracne_private.trips
    where id=p_trip_id and owner_hash=sha256(convert_to(p_trip_token,'UTF8')) for update;
   if not found then return jsonb_build_object('error','denied'); end if;
   update aracne_private.trips set workspace_id=w.id,updated_at=now() where id=t.id;
   return jsonb_build_object('ok',true);
 end if;
 return jsonb_build_object('error','denied');
end $function$
;
REVOKE ALL ON SCHEMA aracne_private FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA aracne_private FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA aracne_private FROM PUBLIC;
GRANT USAGE ON SCHEMA aracne_private TO anon, authenticated;
GRANT EXECUTE ON FUNCTION aracne_private.beta_api(text,jsonb) TO anon, authenticated;
REVOKE ALL ON FUNCTION public.aracne_beta FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.aracne_beta TO anon, authenticated;
REVOKE ALL ON FUNCTION public.aracne_trip_v2 FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.aracne_trip_v2 TO anon, authenticated;
REVOKE ALL ON FUNCTION public.aracne_trip FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.aracne_trip TO anon, authenticated;
REVOKE ALL ON FUNCTION public.aracne_trip_v5 FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.aracne_trip_v5 TO anon, authenticated;
REVOKE ALL ON FUNCTION public.aracne_workspace FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.aracne_workspace TO anon, authenticated;

