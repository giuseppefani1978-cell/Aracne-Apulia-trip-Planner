-- V5 capability endpoint. Install before serving V5 clients.
-- V4 reads remain compatible; V4 mutations of migrated V5 trips are rejected.
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
REVOKE ALL ON FUNCTION public.aracne_trip_v5(text,uuid,text,jsonb,bigint,text,text,text,text,jsonb,bigint,bigint,text,uuid,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.aracne_trip_v5(text,uuid,text,jsonb,bigint,text,text,text,text,jsonb,bigint,bigint,text,uuid,text) TO anon,authenticated;
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

