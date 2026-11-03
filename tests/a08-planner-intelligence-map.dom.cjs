'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const locales=['fr','it','en','es'];
const a07=['dist/app.fr.js','dist/catalog-v2.js','dist/v2.js','dist/v21.js','lab/a07/local-bridge.js','lab/a07/demo-seed.js','dist/experience.js','dist/collaboration-v3.js','dist/v5.js','lab/a07/local-context.js','dist/beta.js','lab/a07/lab-chrome.js'];
const a06=['dist/a06-puglia-data.js','dist/a06-places.js','dist/a06-knowledge.js','dist/a06-intelligence.js','dist/a06-adapter.js','dist/a06-poi-reviews.js','dist/a06-duplicate-audit.js','dist/a06-legacy-audit.js','dist/a06-commercial-audit.js','dist/a06-data-quality.js','dist/a06-puglia-knowledge.js','lab/a08/map-bridge.js','dist/a06-matcher.js','dist/a06-proposals.js','dist/a06-dialogue.js','lab/a08/intelligence-panel.js','dist/a06-voice.js','lab/a08/a08-banner.js'];
(async()=>{
 for(const lang of locales){
  const html=read('lab/a08/index'+(lang==='fr'?'':'.'+lang)+'.html');
  const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(x=>!x.startsWith('https://'));
  for(const src of ['../a07/local-bridge.js','map-bridge.js','intelligence-panel.js','../../dist/a06-voice.js'])assert.ok(scripts.includes(src),lang+' lacks '+src);
  assert.ok(scripts.indexOf('map-bridge.js')<scripts.indexOf('../../dist/a06-proposals.js'));
  for(const forbidden of ['supabase.co','beta-access.js','shared-trips.js','invitations-v51.js','beta-invitations.js'])assert.ok(!html.includes(forbidden),'production reference '+forbidden);
  assert.match(html,/connect-src 'self' https:\/\/api\.open-meteo\.com/);
  const vc=new VirtualConsole(),errors=[];vc.on('jsdomError',e=>errors.push(e.message));
  const dom=new JSDOM(html,{url:'https://a08.test.invalid/lab/a08/index'+(lang==='fr'?'':'.'+lang)+'.html',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
  const w=dom.window;
  try {
   const counters={map:0,markers:0,polylines:0,fit:0};
   const emptyLayer=()=>({addTo(){return this},clearLayers(){return this},addLayer(){return this}});
   const mockMap={setView(){return this},fitBounds(){counters.fit++;return this},invalidateSize(){return this},remove(){return this}};
   w.L={
    map(){counters.map++;return mockMap},tileLayer(){return {addTo(){return this}}},
    layerGroup:emptyLayer,marker(){counters.markers++;return {addTo(){return this},bindPopup(){return this}}},
    divIcon:o=>o,polyline(){counters.polylines++;return {addTo(){return this}}},
    latLngBounds:x=>x
   };
   w.scrollTo=()=>{};w.matchMedia=()=>({matches:true,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
   // iOS keyboard simulation: Safari visualViewport shrinks while layout viewport stays tall.
   Object.defineProperty(w,'innerHeight',{value:820,configurable:true,writable:true});
   const visual=new w.EventTarget();visual.height=820;visual.offsetTop=0;
   Object.defineProperty(w,'visualViewport',{value:visual,configurable:true});
   w.confirm=()=>true;w.prompt=()=> 'Demo';w.alert=()=>{};
   w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};
   w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'))};
   w.fetch=()=>{throw Error('A08 must not call remote backend')};
   w.XMLHttpRequest=class{open(){throw Error('XHR forbidden')}};
   w.speechSynthesis={speak(){},cancel(){},getVoices(){return[]}};
   w.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};
   const context=dom.getInternalVMContext();
   for(const f of [...a07,...a06]){
    const actual=f==='dist/app.fr.js'?'dist/app.'+lang+'.js':f;
    vm.runInContext(read(actual),context,{filename:actual});
   }
   assert.equal(w.AracneA08Lab.backend,'none');
   assert.equal(w.AracneA07Lab.backend,'none');
   assert.equal(w.AracneA08Lab.onlySynthetic,true);
   assert.equal(w.A08MapBridge.status().mapReused,true);
   assert.equal(w.A06PlannerCatalog.list().length,83);
   assert.ok(w.A06TourismAssistant);
   assert.ok(w.A06Conversation);
   assert.ok(w.A06RouteProposals);
   assert.ok(w.A06Voice);
   const plan=()=>JSON.parse(w.localStorage.getItem('aracne-puglia-v1')).plan;
   const initially=JSON.stringify(plan());
   assert.equal(w.A08MapBridge.resolveNative('p11'),'p11','Bari Vecchia must match native catalog');
   assert.equal(w.A08MapBridge.canAdd('p11'),true);
   assert.equal(w.A08MapBridge.resolveNative('nonexistent'),null);
   assert.equal(w.A08MapBridge.showPlaces(['bad-id']).ok,false);
   const visible=w.A08MapBridge.showPlaces(['p11','p12','p13']);
   assert.equal(visible.ok,true);
   await wait(180);
   assert.equal(w.document.querySelector('#map').classList.contains('active'),true);
   assert.ok(w.document.querySelector('#a08-map-preview').textContent.includes('Bari Vecchia'));
   assert.equal(w.A08MapBridge.status().selected.length,3);
   assert.equal(counters.map,1,'must reuse Planner map');
   assert.ok(counters.markers>=3,'should add pins to existing map');
   assert.equal(JSON.stringify(plan()),initially,'map preview must not mutate saved plan');
   assert.equal(w.A08MapBridge.showRoute(['p11','p12','p13']).ok,true);
   await wait(160);
   assert.ok(counters.polylines>=1,'route preview uses indicative straight line');
   assert.equal(JSON.stringify(plan()),initially,'route preview must be read-only');
   const snapshot=w.A06PlannerCatalog.proposalContext();
   // A stale proposal cannot open a native dialog.
   w.localStorage.setItem('aracne-v5-active','different-test-trip');
   assert.equal(w.A06PlannerCatalog.openNativeAdd('p11',snapshot.fingerprint).ok,false);
   w.localStorage.setItem('aracne-v5-active',JSON.parse(w.localStorage.getItem('aracne-v5-store'))&&Object.keys(JSON.parse(w.localStorage.getItem('aracne-v5-store')).trips)[0]);
   const fresh=w.A06PlannerCatalog.proposalContext();
   assert.equal(w.A06PlannerCatalog.openNativeAdd('p11',fresh.fingerprint).ok,true);
   assert.ok(w.document.querySelector('#modal').hasAttribute('open'));
   assert.ok(w.document.querySelector('#confirmAdd'),'real Planner confirmation button');
   assert.equal(JSON.stringify(plan()),initially,'opening modal does not persist');
   w.document.querySelector('#confirmAdd').click();
   assert.notEqual(JSON.stringify(plan()),initially,'only native confirmation mutates local itinerary');
   assert.equal(w.aracneShared.getSession(),null,'no backend session');
   const queryInput=w.document.querySelector('#a06-panel .a06-input'),routeAction=w.document.querySelector('.a06-route-action');
   assert.ok(routeAction&&queryInput,'integrated assistant controls');
   const suggested=w.A06RouteProposals.propose(lang==='fr'?'itinéraire à Bari':'route Bari',lang);
   assert.ok(suggested && suggested.stops,'route engine available');
   queryInput.value=lang==='it'?'itinerario Bari':lang==='es'?'ruta Bari':'itinéraire Bari';
   routeAction.click();
   assert.ok(w.document.querySelector('.a06-map-preview'),'route proposal must show map preview');
   w.document.querySelector('.a06-map-preview').click();
   await wait(160);
   assert.ok(w.A08MapBridge.status().selected.length>0,'route action should send stops to map');
   // A08.1 mobile regression: the overlay must track the visual viewport,
   // stay above Planner's bottom nav and offer an explicit keyboard dismissal.
   const keyboardCSS=read('lab/a08/a08.css');
   assert.match(keyboardCSS,/html\.a06-chat-open body nav\s*\{\s*display:none!important/);
   assert.match(keyboardCSS,/z-index:2147483000!important/);
   assert.match(keyboardCSS,/overflow-y:auto!important/);
   const chatButton=w.document.querySelector('#a06-open');chatButton.click();
   assert.equal(w.document.documentElement.classList.contains('a06-chat-open'),true);
   assert.equal(w.document.documentElement.style.getPropertyValue('--a06-view-height'),'820px');
   const chatInput=w.document.querySelector('#a06-panel .a06-input');
   chatInput.focus();visual.height=415;visual.offsetTop=23;
   visual.dispatchEvent(new w.Event('resize'));
   assert.equal(w.document.documentElement.style.getPropertyValue('--a06-view-top'),'23px');
   assert.equal(w.document.documentElement.style.getPropertyValue('--a06-view-height'),'415px');
   assert.equal(w.document.documentElement.classList.contains('a08-keyboard-open'),true);
   const dismiss=w.document.querySelector('.a08-dismiss-keyboard');
   assert.ok(dismiss,'dedicated hide-keyboard action');dismiss.click();
   assert.notEqual(w.document.activeElement,chatInput,'keyboard dismissal blurs input');
   assert.equal(w.document.documentElement.classList.contains('a08-keyboard-open'),false);
   chatButton.click(); // closes the panel, since it is currently open
   assert.equal(w.document.documentElement.classList.contains('a06-chat-open'),false);
   assert.equal(w.document.documentElement.style.getPropertyValue('--a06-view-height'),'');
   w.document.querySelector('#sharedOpen').click();
   assert.match(w.document.querySelector('#modalBody').textContent,/synchron|sincron|sync/i);
   assert.equal(w.localStorage.getItem('aracne-beta-token-v1'),null);
   assert.deepEqual(errors,[],lang+' DOM errors: '+errors.join(' | '));
   console.log('PASS A08 '+lang+' — integrated assistant, real Planner map, indicative route, native confirmation, isolated local data');
  } finally {dom.window.close();}
 }
})().catch(error=>{console.error(error.stack||error);process.exitCode=1});