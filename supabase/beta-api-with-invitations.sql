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
end $function$;
