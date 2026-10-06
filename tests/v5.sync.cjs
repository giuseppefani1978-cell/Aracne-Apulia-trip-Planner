const {client}=require('./v5.dom.cjs'),assert=require('assert/strict');
const clone=x=>JSON.parse(JSON.stringify(x));
const drain=async c=>{while(c.w.aracneShared._busy())await new Promise(r=>setImmediate(r))};
const tick=async c=>{await drain(c);await c.w.aracneShared._tick()};
(async()=>{const a=client('fr'),b=client('it');
try{
 a.w.prompt=()=> 'Shared test';a.w.aracneV5.create();let doc=a.w.aracneShared._shared(),rev=1;
 const id='aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
 for(const [c,role] of [[a,'owner'],[b,'edit']]){
 c.w.fetch=async(url,opts)=>{const req=JSON.parse(opts.body);if(req.p_action==='read')return {ok:true,json:async()=>({document:clone(doc),revision:rev,role,name:doc.name,last_event:0})};if(req.p_action==='write'){if(req.p_revision!==rev)return {ok:true,json:async()=>({error:'conflict',revision:rev})};doc=clone(req.p_document);rev++;return {ok:true,json:async()=>({revision:rev,last_event:0})}};throw Error(req.p_action)};
 c.w.aracneShared._setRaw({id,token:(role==='owner'?'a':'b').repeat(64),role,base:clone(doc),revision:rev,edit:'e'.repeat(64),read:'f'.repeat(64)});c.w.aracneShared._apply(clone(doc));c.w.document.querySelector('#modal').close();
 }
 await drain(a);await drain(b);
 a.run("state.plan=[[{uid:'a',name:'A',desc:'',time:''}]];save()");b.run("state.plan=[[{uid:'b',name:'B',desc:'',time:''}]];save()");
 await tick(a);await tick(b);await tick(a);
 assert.equal(a.run('state.plan.flat().length'),2);assert.equal(b.run('state.plan.flat().length'),2);
 a.run("state.plan[0][0].name='from A';save()");b.run("state.plan[0][0].name='from B';save()");await tick(a);await tick(b);assert.equal(b.w.aracneShared._status(),'conflict');assert.equal(b.run('state.plan[0][0].name'),'from B');assert.equal(doc.plan[0][0].name,'from A');
 b.run("state.notes.push({id:'private',text:'Keep me',privacy:'private',day:-1});save()");await b.w.aracneShared._resolve();assert.equal(b.run("state.notes.find(n=>n.id==='private').text"),'Keep me');
 a.w.prompt=()=> 'Solo B';a.w.aracneV5.create();a.w.aracneV5.openTrips();a.click(`[data-v5-trip="${id}"]`);await new Promise(r=>setImmediate(r));assert.equal(a.w.aracneShared._getRaw().edit,'e'.repeat(64));
 console.log('PASS two clients independent edits, explicit conflict, private note preservation, invitation preservation');
}finally{a.close();b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
