-- Run after v5-upgrade.sql INSIDE the same transaction; this test rolls back.

DO $test$
declare a jsonb; b jsonb; id uuid; doc jsonb;
begin
doc:='{"version":1,"name":"V5 transaction test","plan":[],"notes":[],"people":2,"days":1}'::jsonb;
a:=public.aracne_trip_v5('create',p_token=>repeat('a',64),p_edit=>repeat('b',64),p_read=>repeat('c',64),p_document=>doc);
if a ? 'error' then raise exception 'create failed: %',a;end if;
id:=(a->>'id')::uuid;
a:=public.aracne_trip_v5('read',id,repeat('b',64));doc:=a->'document';
b:=public.aracne_trip_v5('write',id,repeat('c',64),doc,1);
if b->>'error' is distinct from 'denied' then raise exception 'reader allowed';end if;
b:=public.aracne_trip_v5('write',id,repeat('b',64),doc||'{"carnetVersion":1}'::jsonb,1);
if b->>'error' is distinct from 'denied' then raise exception 'participant published';end if;
b:=public.aracne_trip_v2('write',id,repeat('b',64),doc,1);
if b->>'error' is distinct from 'upgrade_required' then raise exception 'legacy bypass';end if;
doc:=doc||'{"plan":[[{"uid":"p","name":"Test","status":"proposed"}]]}'::jsonb;
b:=public.aracne_trip_v5('write',id,repeat('b',64),doc,1);
if b ? 'error' then raise exception 'participant proposal failed %',b;end if;
b:=public.aracne_trip_v5('write',id,repeat('a',64),doc||'{"carnetVersion":1}'::jsonb,2);
if b ? 'error' then raise exception 'owner publication failed %',b;end if;
end $test$;
ROLLBACK;

