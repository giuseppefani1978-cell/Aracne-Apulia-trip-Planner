const {JSDOM}=require(process.env.JSDOM_PATH||'jsdom');
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..'),clients=[];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function until(fn){for(let i=0;i<250;i++){if(fn())return;await sleep(100)}throw Error('Timed out')}
function client(hash='',lang='fr',storage={}){
 const file=lang==='fr'?'index.html':`index.${lang}.html`;
 const dom=new JSDOM(fs.readFileSync(path.join(root,'dist',file),'utf8'),{url:'https://example.test/dist/'+file+hash,runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window,c=dom.getInternalVMContext();clients.push(w);
 w.matchMedia=()=>({matches:true});w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'))};w.confirm=()=>true;
 w.fetch=async(...args)=>{const r=await fetch(...args);if(!r.ok)console.error('HTTP',r.status);return r};w.AbortController=AbortController;w.setInterval=()=>1;
 w.localStorage.setItem('aracne-v2-intro','seen');for(const[k,v]of Object.entries(storage))w.localStorage.setItem(k,v);
 for(const f of [`app.${lang}.js`,'catalog-v2.js','v2.js','v21.js','shared-trips.js'])vm.runInContext(fs.readFileSync(path.join(root,'dist',f),'utf8'),c);
 return {w,run:s=>vm.runInContext(s,c),session:()=>JSON.parse(w.localStorage.getItem('aracne-shared-v1')),click:s=>w.document.querySelector(s).click(),tick:()=>w.dispatchEvent(new w.Event('online'))};
}
const endpoint='https://cpnjdyhsepytphwlenbg.supabase.co/rest/v1/rpc/aracne_trip',key='sb_publishable_heDZcO0ymf5N0SbnaYBT4w_v-ItZm8S';
async function rpc(s,action,extra={}){return (await fetch(endpoint,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({p_action:action,p_id:s.id,p_token:s.token,...extra})})).json()}
(async()=>{let owner;
try{
 const a=client();a.run("state.notes.push({id:'secret-a',text:'PRIVATE',day:-1,privacy:'private'});save()");
 a.click('#sharedOpen');a.click('#sharedCreate');await until(()=>{if(a.w.document.querySelector('#toast').textContent.includes('Impossible'))throw Error(a.w.document.querySelector('#toast').textContent);return a.session()});owner=a.session();a.click('#closeModal');
 const hash=token=>'#trip='+owner.id+'&key='+token;
 const b=client(hash(owner.edit),'it'),c=client(hash(owner.read),'en'),d=client(hash(owner.edit),'es'),e=client(hash(owner.edit));
 await until(()=>[b,c,d,e].every(x=>x.session()));
 assert.equal((await rpc(owner,'read')).document.notes.length,0);
 assert.equal(b.run('state.notes.length'),0);
 a.run("state.name='First group change';save()");await until(()=>a.session().revision===2);
 b.tick();c.tick();await until(()=>b.run('state.name')==='First group change'&&c.run('state.name')==='First group change');
 c.run("state.name='Forbidden';save()");assert.equal(c.run('state.name'),'First group change');
 assert.equal((await rpc(c.session(),'write',{p_document:c.run('JSON.parse(JSON.stringify(state))'),p_revision:2})).error,'denied');
 // Two writers start from revision 2; stale writer must retain its own draft.
 a.run("state.name='Writer A';save()");b.run("state.name='Writer B';save()");
 await until(()=>[a,b].some(x=>x.w.document.querySelector('#sharedStatus').textContent.includes(x===a?'aussi':'Anche')));
 const doc=(await rpc(owner,'read')).document;assert.ok(['Writer A','Writer B'].includes(doc.name));
 const loser=doc.name==='Writer A'?b:a;assert.notEqual(loser.run('state.name'),doc.name);
 loser.click('#sharedOpen');loser.click('#sharedLoad');await until(()=>loser.run('state.name')===doc.name);loser.click('#closeModal');
 // Offline pending changes survive until the connection is restored.
 a.w.fetch=async()=>{throw Error('offline')};a.run("state.name='Offline edit';save()");await sleep(1000);assert.equal(a.run('state.name'),'Offline edit');
 a.w.fetch=(...args)=>fetch(...args);a.tick();await until(()=>a.session().base.name==='Offline edit');
 assert.equal(a.run("state.notes.find(n=>n.id==='secret-a').text"),'PRIVATE');
 const reloaded=client('', 'fr',Object.fromEntries(['aracne-shared-v1','aracne-puglia-v1'].map(k=>[k,a.w.localStorage.getItem(k)])));
 await until(()=>reloaded.session()?.base.name==='Offline edit');assert.equal(reloaded.run('state.name'),'Offline edit');
 a.click('#sharedOpen');a.click('#sharedRotate');await until(()=>a.session().edit!==owner.edit);
 assert.equal((await rpc(b.session(),'read')).error,'denied');
 assert.equal((await rpc({...owner,token:a.session().edit},'read')).role,'edit');
 assert.equal((await rpc({...owner,token:'0'.repeat(64)},'read')).error,'denied');
 console.log('PASS: five independent clients, four languages, shared edits, personal-note exclusion, read-only denial, concurrent conflict without loss, conflict backup, offline retry, reload, link revocation, invalid token');
}finally{try{if(owner)await rpc(owner,'delete')}finally{clients.forEach(w=>w.close())}}
})().catch(e=>{console.error(e);process.exitCode=1});
