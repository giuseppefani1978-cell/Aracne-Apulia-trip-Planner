'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const locales=['fr','it','en','es'];
const sequence=['dist/app.fr.js','dist/catalog-v2.js','dist/v2.js','dist/v21.js',
 'lab/a07/local-bridge.js','lab/a07/demo-seed.js','dist/experience.js',
 'dist/collaboration-v3.js','dist/v5.js','lab/a07/local-context.js',
 'dist/beta.js','lab/a07/lab-chrome.js'];
(async()=>{
 for(const locale of locales){
  const html=read('lab/a07/index'+(locale==='fr'?'':'.'+locale)+'.html');
  assert.match(html,/\bid="mapCanvas"/,'real Planner Leaflet canvas');
  assert.match(html,/\bid="expenseForm"/,'real Planner expenses');
  assert.match(html,/local-bridge\.js/,'local-only adapter');
  assert.match(html,/demo-seed\.js/,'synthetic fixture');
  assert.match(html,/Content-Security-Policy/);
  assert.match(html,/connect-src 'self' https:\/\/api\.open-meteo\.com/);
  for(const forbidden of ['supabase.co','beta-access.js','shared-trips.js',
   'beta-invitations.js','invitations-v51.js','aracneBetaPrelock'])
   assert.equal(html.includes(forbidden),false,'Forbidden A07 reference: '+forbidden);
  assert.match(html,/lab-chrome\.js/);
  const vc=new VirtualConsole(),errors=[];vc.on('jsdomError',e=>errors.push(e.message));
  const dom=new JSDOM(html,{url:'https://a07.test.invalid/lab/a07/index'+(locale==='fr'?'':'.'+locale)+'.html',
   runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
  const w=dom.window;
  try{
   w.scrollTo=()=>{};
   w.matchMedia=()=>({matches:true,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
   w.confirm=()=>true;w.alert=()=>{};w.prompt=()=>'Test A07';
   w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};
   w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'))};
   w.fetch=()=>{throw Error('Unexpected network access in A07 boot')};
   w.XMLHttpRequest=class{open(){throw Error('XHR forbidden')}};
   const ctx=dom.getInternalVMContext();
   for(const file of sequence){
    const actual=file==='dist/app.fr.js'?'dist/app.'+locale+'.js':file;
    vm.runInContext(read(actual),ctx,{filename:actual});
   }
   assert.equal(w.AracneA07Lab.backend,'none');
   assert.equal(w.AracneA07Lab.invitations,false);
   assert.equal(w.aracneShared.getSession(),null);
   assert.equal(w.aracneShared._getRaw(),null);
   await assert.rejects(w.aracneShared._enable(),/lab_local_only/);
   assert.match(w.document.querySelector('#sharedStatus').textContent,/LAB A07/i);
   assert.match(w.document.querySelector('#v51Name').textContent,/Bari/i);
   assert.ok(w.document.querySelector('#a07Ribbon'));
   assert.ok(w.document.querySelector('#topMap'));
   assert.ok(w.document.querySelector('#journalContent'));
   w.document.querySelector('[data-view="notes"]').click();
   assert.ok(w.document.querySelector('#carnetOverview'),'Carnet overview is created when Notes tab renders');
   const trip=JSON.parse(w.localStorage.getItem('aracne-puglia-v1'));
   assert.match(trip.name,/Bari/);
   assert.equal(trip.plan.length,3);
   assert.equal(trip.members.length,4);
   const directory=JSON.parse(w.localStorage.getItem('aracne-v5-store'));
   assert.equal(Object.keys(directory.trips).length,1);
   assert.equal(directory.trips[w.localStorage.getItem('aracne-v5-active')].session,null);
   assert.equal(w.localStorage.getItem('aracne-beta-token-v1'),null);
   assert.equal(w.document.querySelector('#aracneBetaPrelock'),null);
   // Real Planner navigation remains accessible.
   w.document.querySelector('#topMap').click();
   assert.ok(w.document.querySelector('#map').classList.contains('active'));
   assert.ok(w.document.querySelector('#mapCanvas'));
   w.document.querySelector('#sharedOpen').click();
   assert.match(w.document.querySelector('#modalBody').textContent,/synchron|sincron|sync/i);
   assert.deepEqual(errors,[],locale+': '+errors.join(' | '));
   console.log('PASS A07 '+locale+' — Planner views + synthetic V5 trip; no backend');
  }finally{w.close()}
 }
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});