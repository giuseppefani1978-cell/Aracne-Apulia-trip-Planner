// Temporary synthetic trip only. Removes its own server trip in finally.
const {client}=require('./v5.dom.cjs'),assert=require('assert/strict');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function idle(c){for(let i=0;i<200;i++){if(!c.w.aracneShared._busy())return;await delay(100)}throw Error('busy timeout')}
async function tick(c){await idle(c);await c.w.aracneShared._tick();await idle(c)}
(async()=>{const a=client('fr'),b=client('it'),r=client('en');let owner;
try{
 for(const c of [a,b,r]){c.w.fetch=fetch;c.w.document.querySelector('#modal').close()}
 a.w.prompt=()=> 'V51 temporary synchronization test';a.w.aracneV5.create();
 await a.w.aracneInvitations.open();owner=a.w.aracneShared._getRaw();assert.ok(owner,'real server creation');assert.equal(a.w.aracneShared._pending(),false);
 for(const [c,token] of [[b,owner.edit],[r,owner.read]]){const cred={id:owner.id,token},res=await a.w.aracneShared._rpc('read',{},cred);c.w.aracneShared._setRaw({...cred,role:res.role,revision:res.revision,base:res.document});c.w.aracneShared._apply(res.document);await idle(c)}
 a.run("state.plan=[[{uid:'owner-step',name:'Owner addition',desc:'Synthetic',time:'10:00'}]];save()");await tick(a);await tick(b);assert.equal(b.run('state.plan[0][0].name'),'Owner addition');
 b.run("state.plan[0][0].desc='Participant changed this';save()");await tick(b);await tick(a);assert.equal(a.run('state.plan[0][0].desc'),'Participant changed this');
 await tick(r);assert.equal(r.run('state.plan[0][0].desc'),'Participant changed this');
 const denied=await r.w.aracneShared._rpc('write',{p_document:r.w.aracneShared._shared(),p_revision:r.w.aracneShared._getRaw().revision}).then(()=>false,e=>e.message==='denied');assert.ok(denied,'server denies viewer write');
 b.run("state.notes.push({id:'group-note',privacy:'group',text:'Group note from participant',day:-1});state.notes.push({id:'private-note',privacy:'private',text:'PRIVATE SENTINEL',day:-1});save()");await tick(b);await tick(a);assert.ok(a.run("state.notes.some(n=>n.id==='group-note')"));assert.equal(a.run("state.notes.some(n=>n.id==='private-note')"),false);
 console.log('PASS REAL V5 SERVER: creation, owner → participant, participant → owner, viewer updates, server viewer-write denial, group notes sync, private notes excluded');
}finally{
 for(const c of [a,b,r])await idle(c);
 if(owner){await a.w.aracneShared._rpc('delete',{},owner);console.log('Temporary server trip deleted')}
 for(const c of [a,b,r])c.w.aracneShared._setRaw(null);
 await new Promise(resolve=>setImmediate(resolve));
 for(const c of [a,b,r])c.close()
}})().catch(e=>{console.error(e);process.exitCode=1});
