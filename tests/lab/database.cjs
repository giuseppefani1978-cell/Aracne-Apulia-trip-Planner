/* In-process PostgreSQL only: no URL, socket or production credentials accepted. */
const {PGlite}=require('@electric-sql/pglite');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 let db=new PGlite();
 try{
 await db.exec('CREATE ROLE anon; CREATE ROLE authenticated;');
 await db.exec(fs.readFileSync('staging/schema-baseline.sql','utf8'));
 await db.exec("INSERT INTO aracne_private.beta_settings(id,enabled) VALUES(true,true); INSERT INTO aracne_private.beta_batches(id,label) VALUES('11111111-1111-4111-8111-111111111111','LAB SYNTHETIC'); INSERT INTO aracne_private.beta_invites(id,batch_id,code_hash,suffix,is_admin) VALUES('22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111',sha256(convert_to(repeat('A',24),'UTF8')),'AAAAAA',false);");
 const token='d'.repeat(64),owner='a'.repeat(64),edit='b'.repeat(64),read='c'.repeat(64);
 const rpc=async(action,id=null,tok=owner,doc=null,rev=null,extra='')=>(await db.query(`SELECT public.aracne_trip_v5($1,p_id=>$2,p_token=>$3,p_document=>$4,p_revision=>$5${extra}) AS r`,[action,id,tok,doc,rev])).rows[0].r;
 const beta=async(action,data={})=>(await db.query('SELECT public.aracne_beta($1,$2) AS r',[action,data])).rows[0].r;
 const doc={version:1,name:'LAB fictional Lecce',people:2,days:1,plan:[],notes:[{privacy:'private',text:'PRIVATE_SENTINEL'},{privacy:'group',text:'Synthetic shared note'}]};
 await db.exec("SET ROLE anon");
 assert.equal((await rpc('create',null,owner,doc,null,",p_edit=>repeat('b',64),p_read=>repeat('c',64)")).error,'beta_required');
 await db.query("SELECT set_config('request.headers',$1,false)",[JSON.stringify({'x-aracne-beta':token})]);
 assert.equal((await beta('activate',{code:'A'.repeat(24),nickname:'LAB Organizer'})).ok,true);
 assert.equal((await beta('dashboard')).error,'denied');
 const created=await rpc('create',null,owner,doc,null,",p_edit=>repeat('b',64),p_read=>repeat('c',64)");assert.ok(created.id,JSON.stringify(created));const id=created.id;
 const snapshot=await rpc('read',id,read);assert.equal(snapshot.role,'read');assert.equal(snapshot.document.notes.length,1);assert.ok(!JSON.stringify(snapshot).includes('PRIVATE_SENTINEL'));
 const clean=snapshot.document;
 assert.equal((await rpc('write',id,read,clean,1)).error,'denied');
 assert.equal((await rpc('delete',id,edit)).error,'denied');
 assert.equal((await rpc('rename',id,edit,null,null,",p_name=>'Forbidden'")).error,'denied');
 assert.equal((await rpc('write',id,edit,{...clean,carnetVersion:1},1)).error,'denied');
 assert.equal((await rpc('write',id,edit,clean,1)).revision,2);
 assert.equal((await rpc('write',id,owner,clean,1)).error,'conflict');
 const legacy=(await db.query('SELECT public.aracne_trip_v2($1,p_id=>$2,p_token=>$3,p_document=>$4,p_revision=>$5) AS r',['write',id,owner,clean,2])).rows[0].r;assert.equal(legacy.error,'upgrade_required');
 const snap=await rpc('snapshot',id);assert.ok(snap.version_id);
 assert.equal((await rpc('rename',id,owner,null,null,",p_name=>'LAB modified'")).name,'LAB modified');
 const restored=await rpc('restore',id,owner,null,null,`,p_version_id=>${Number(snap.version_id)}`);assert.equal(restored.document.name,clean.name);
 await rpc('rotate',id,owner,null,null,",p_edit=>repeat('e',64),p_read=>repeat('f',64)");assert.equal((await rpc('read',id,edit)).error,'denied');assert.equal((await rpc('read',id,read)).error,'denied');
 assert.equal((await rpc('read','33333333-3333-4333-8333-333333333333',owner)).error,'denied');
 await db.exec('RESET ROLE');
 const before=(await db.query('SELECT id,document,revision FROM aracne_private.trips ORDER BY id')).rows;
 const backup=await db.dumpDataDir();await db.close();
 db=new PGlite({loadDataDir:backup});await db.waitReady;
 assert.deepEqual((await db.query('SELECT id,document,revision FROM aracne_private.trips ORDER BY id')).rows,before);
 await db.exec("UPDATE aracne_private.beta_invites SET revoked=true");
 await db.query("SELECT set_config('request.headers',$1,false)",[JSON.stringify({'x-aracne-beta':token})]);await db.exec('SET ROLE anon');
 assert.equal((await rpc('read',id)).error,'beta_required');
 console.log('PASS isolated PostgreSQL: activation, role permissions, private notes, revisions, v2 rejection, snapshots, restore, rotation, cross-trip denial, backup/reopen, revocation');
 }finally{await db.close()}
})().catch(e=>{console.error(e.message);process.exitCode=1});
