// Real SQL activation/permission checks on synthetic fixtures; no HTTP access.
const {PGlite}=require('@electric-sql/pglite');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{const db=new PGlite();try{
 await db.exec('CREATE ROLE anon; CREATE ROLE authenticated;');
 await db.exec(fs.readFileSync('staging/schema-baseline.sql','utf8'));
 const batch=(await db.query("INSERT INTO aracne_private.beta_batches(label) VALUES('LAB ONLY') RETURNING id")).rows[0].id;
 async function invite(code,parent=null){return (await db.query("INSERT INTO aracne_private.beta_invites(batch_id,code_hash,suffix,parent_invite_id) VALUES($1,sha256(convert_to($2,'UTF8')),'LAB000',$3) RETURNING id",[batch,code,parent])).rows[0].id}
 const owner=await invite('A'.repeat(24)),guest=await invite('B'.repeat(24),owner),expired=await invite('C'.repeat(24),owner),cancelled=await invite('D'.repeat(24),owner);
 await db.query("INSERT INTO aracne_private.beta_invitation_slots(organizer_id,ordinal,invite_id,expires_at) VALUES($1,1,$2,now()+interval '1 day'),($1,2,$3,now()-interval '1 second')",[owner,guest,expired]);
 await db.query('UPDATE aracne_private.beta_invites SET revoked=true WHERE id=$1',[cancelled]);
 async function api(token,action,data={}){await db.exec('SET ROLE anon');await db.query("SELECT set_config('request.headers',$1,false)",[JSON.stringify({'x-aracne-beta':token.repeat(64)})]);return (await db.query('SELECT public.aracne_beta($1,$2) AS r',[action,data])).rows[0].r}
 const activate=(t,c)=>api(t,'activate',{code:c.repeat(24),nickname:'LAB synthetic'});
 assert.equal((await activate('a','A')).ok,true);
 assert.equal((await activate('b','B')).ok,true);
 assert.equal((await activate('b','B')).ok,true,'same browser activation idempotent');
 assert.equal((await activate('e','B')).error,'used_code','other browser refused');
 assert.equal((await activate('c','C')).error,'invalid_code','expiry enforced');
 assert.equal((await activate('d','D')).error,'invalid_code','revocation enforced');
 const guestList=await api('b','invites_list');assert.equal(guestList.organizer,false);assert.equal(guestList.slots.length,0);
 assert.equal((await api('b','invites_create_group',{label:'Denied',count:1})).error,'denied');
 assert.equal((await api('a','invites_dashboard')).error,'denied');
 const permissions=(await db.query("SELECT has_table_privilege('anon','aracne_private.trips','select') AS tables,has_function_privilege('anon','aracne_private.beta_invitation_api(text,jsonb)','execute') AS helper")).rows[0];assert.deepEqual(permissions,{tables:false,helper:false});
 console.log('PASS synthetic SQL invitations: expiry, revocation, browser binding, idempotency, guest restrictions, private grants');
}finally{await db.close()}})().catch(e=>{console.error(e.message);process.exitCode=1});
