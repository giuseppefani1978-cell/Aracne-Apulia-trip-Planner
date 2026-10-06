const {client}=require('./v5.dom.cjs'),assert=require('assert/strict');
(async()=>{for(const lang of ['fr','it','en','es']){const c=client(lang),{w,run}=c;try{
w.prompt=()=> 'Compleanno Piero';w.aracneV5.create();
assert.equal(w.document.querySelector('#v51Name').textContent,'Compleanno Piero');
assert.ok(w.document.querySelector('#topMap span').textContent);
const sent=[];w.navigator.share=async payload=>sent.push(payload);
const doc=w.aracneShared._shared();
w.aracneShared._setRaw({id:'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',token:'a'.repeat(64),edit:'b'.repeat(64),read:'c'.repeat(64),role:'owner',revision:1,base:doc});
await w.aracneInvitations.open();c.click('#v51Edit');c.click('#v51Read');await Promise.resolve();assert.equal(sent.length,2);assert.ok(sent[0].url.endsWith('key='+'b'.repeat(64)));assert.ok(sent[1].url.endsWith('key='+'c'.repeat(64)));
// An ordinary sharing dialog must not block incoming updates.
w.fetch=async()=>({ok:true,json:async()=>({revision:2,role:'owner',document:{...doc,name:'Updated from participant'},last_event:0})});await w.aracneShared._tick();assert.equal(run('state.name'),'Updated from participant');assert.equal(w.document.querySelector('#v51Name').textContent,'Updated from participant');
w.aracneShared._setRaw(null);w.fetch=async()=>({ok:false,status:404,json:async()=>({code:'PGRST202'})});await w.aracneInvitations.open();assert.ok(w.document.querySelector('[role="alert"]'));assert.equal(sent.length,2);assert.equal(w.aracneShared.getSession(),null);
let createdDocument,creates=0;
w.fetch=async(url,options)=>{const req=JSON.parse(options.body);if(req.p_action==='create'){creates++;createdDocument={...req.p_document,schemaVersion:5};return {ok:true,json:async()=>({id:'cccccccc-cccc-4ccc-cccc-cccccccccccc',revision:1})}}return {ok:true,json:async()=>({document:createdDocument,revision:1,role:'owner',last_event:0})}};
await w.aracneInvitations.open();assert.equal(creates,1);assert.equal(w.aracneShared._pending(),false,'server canonical baseline avoids false local changes');assert.ok(w.document.querySelector('#v51Edit'));
console.log(lang+': PASS native edit/read sharing, active trip label, sync while invitation dialog open, explicit missing-service error');
}finally{c.close()}}})().catch(e=>{console.error(e);process.exitCode=1});
