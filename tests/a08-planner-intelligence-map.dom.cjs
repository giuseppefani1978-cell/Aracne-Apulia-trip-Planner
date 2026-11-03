'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const locales=['fr','it','en','es'];
const a07=['dist/app.fr.js','dist/catalog-v2.js','dist/v2.js','dist/v21.js','lab/a07/local-bridge.js','lab/a07/demo-seed.js','dist/experience.js','dist/collaboration-v3.js','dist/v5.js','lab/a07/local-context.js','dist/beta.js','lab/a07/lab-chrome.js'];
const a06=['dist/a06-puglia-data.js','dist/a06-places.js','dist/a06-knowledge.js','dist/a06-intelligence.js','dist/a06-adapter.js','dist/a06-poi-reviews.js','dist/a06-duplicate-audit.js','dist/a06-legacy-audit.js','dist/a06-commercial-audit.js','dist/a06-data-quality.js','dist/a06-puglia-knowledge.js','lab/a08/map-bridge.js','dist/a06-matcher.js','dist/a06-proposals.js','lab/a08/journey-engine.js','dist/a06-dialogue.js','lab/a08/conversation-flow.js','lab/a08/intelligence-panel.js','lab/a08/reliable-voice.js','lab/a08/a08-banner.js'];
(async()=>{
 for(const lang of locales){
  const html=read('lab/a08/index'+(lang==='fr'?'':'.'+lang)+'.html');
  const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(x=>!x.startsWith('https://'));
  for(const src of ['../a07/local-bridge.js','map-bridge.js','conversation-flow.js','intelligence-panel.js','reliable-voice.js'])assert.ok(scripts.includes(src),lang+' lacks '+src);
  assert.ok(scripts.indexOf('map-bridge.js')<scripts.indexOf('../../dist/a06-proposals.js'));
  for(const forbidden of ['supabase.co','beta-access.js','shared-trips.js','invitations-v51.js','beta-invitations.js'])assert.ok(!html.includes(forbidden),'production reference '+forbidden);
  assert.match(html,/connect-src 'self' https:\/\/api\.open-meteo\.com/);
  const vc=new VirtualConsole(),errors=[];vc.on('jsdomError',e=>errors.push(e.message));
  const dom=new JSDOM(html,{url:'https://a08.test.invalid/lab/a08/index'+(lang==='fr'?'':'.'+lang)+'.html',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
  const w=dom.window;
  try {
   const counters={map:0,markers:0,polylines:0,fit:0,spiderIcons:0,spiderMoves:0,threadMoves:0};
   const emptyLayer=()=>({addTo(){return this},clearLayers(){return this},
      addLayer(){return this},removeLayer(){return this}});
   const mockMap={setView(){return this},fitBounds(){counters.fit++;return this},
      invalidateSize(){return this},remove(){return this}};
   w.L={
    map(){counters.map++;return mockMap},tileLayer(){return {addTo(){return this}}},
    layerGroup:emptyLayer,
    marker(){counters.markers++;return {addTo(){return this},bindPopup(){return this},
       setLatLng(){counters.spiderMoves++;return this}}},
    divIcon:o=>{if(o.html?.includes('🕷️'))counters.spiderIcons++;return o},
    polyline(){counters.polylines++;return {addTo(){return this},
       setLatLngs(){counters.threadMoves++;return this}}},
    latLngBounds:x=>x
   };
   w.requestAnimationFrame=cb=>w.setTimeout(()=>cb(w.performance.now()+15000),1);
   w.cancelAnimationFrame=id=>w.clearTimeout(id);
   w.scrollTo=()=>{};w.matchMedia=q=>({matches:!q.includes('prefers-reduced-motion'),
      addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
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
   const sessions=[];
   Object.defineProperty(w.navigator,'userAgent',{configurable:true,value:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1'});
   w.webkitSpeechRecognition=class{
     constructor(){sessions.push(this);this.stopped=false;this.aborted=false}
     start(){this.onstart?.()}
     stop(){this.stopped=true}
     abort(){this.aborted=true}
   };
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
   assert.ok(w.A08JourneyEngine);
   assert.ok(w.A08ConversationFlow,'a single context coordinator is wired to the conversation');
   const ctx=w.A08ConversationFlow;
   const intro=ctx.prepare('Je veux visiter Bari');ctx.commit(intro);
   assert.equal(ctx.context().lastLocation,'p11');
   const thematic=ctx.prepare(lang==='it'?'e le spiagge?':lang==='en'?'and beaches?':lang==='es'?'y las playas?':'et les plages ?');
   assert.match(thematic.dialogueQuery,/Bari Vecchia/,'a thematic followup inherits the preceding destination');
   ctx.commit(thematic);
   const continued=ctx.prepare(lang==='it'?'poi Lecce':lang==='en'?'then Lecce':lang==='es'?'después Lecce':'puis Lecce');
   assert.equal(continued.route,true,'a follow-up through Lecce starts the route context: '+JSON.stringify({lang,continued,context:ctx.context(),mentioned:w.A08JourneyEngine.mentioned('poi Lecce').map(p=>p.id)}));
   assert.match(continued.routeQuery,/Bari Vecchia.*Lecce/);
   w.A08JourneyEngine.propose(continued.routeQuery,lang);ctx.commit(continued,{route:true});
   assert.deepEqual(Array.from(ctx.context().routeIds),['p11','p27']);
   ctx.reset();w.A08JourneyEngine.reset();
   assert.equal(ctx.context().turns,0);
   assert.equal(w.A08JourneyEngine.state().ids.length,0);
   // The exact user regression: Bari -> Lecce -> Gallipoli must preserve order
   // instead of returning nearby points around the first recognized zone.
   const tripQuestion={
    fr:'Peux-tu proposer un parcours entre Bari ses environs jusqu’à Lecce et après Gallipoli',
    it:'Un itinerario da Bari a Lecce e poi Gallipoli',
    en:'A route from Bari to Lecce then Gallipoli',
    es:'Un recorrido desde Bari a Lecce después Gallipoli'
   }[lang];
   const explicitRoute=w.A08JourneyEngine.propose(tripQuestion,lang);
   assert.equal(explicitRoute.explicitWaypoints,true);
   assert.deepEqual(Array.from(explicitRoute.stops,p=>p.plannerId),['p11','p27','p28']);
   assert.equal(explicitRoute.mode,'driving','inherits Planner default unless user overrides');
   assert.match(explicitRoute.text,/Bari Vecchia.*Lecce.*Gallipoli/s);
   assert.equal(explicitRoute.stops.length,3);
   for(const stage of explicitRoute.stops){
     assert.ok(stage.description?.length>45,'rich description: '+stage.name);
     assert.equal(stage.quality,'static-claim-reviewed','source-backed static descriptions');
     assert.match(stage.sourceUrl,/^https:\/\//);
     assert.ok(Array.isArray(stage.nearby),'nearby suggestions are present');
     assert.ok(stage.sourceLabel,'source quality is explicit');
   }
   assert.match(explicitRoute.text,/indicati|orientativ|tracé|linea|lines/i);
   const changeTransport=w.A08JourneyEngine.propose('en train',lang);
   assert.equal(changeTransport.mode,'transit');
   assert.deepEqual(Array.from(changeTransport.stops,p=>p.plannerId),['p11','p27','p28']);
   const afterStop=w.A08JourneyEngine.propose(lang==='it'?'e poi Otranto':lang==='es'?'y después Otranto':'et après Otranto',lang);
   assert.deepEqual(Array.from(afterStop.stops,p=>p.plannerId),['p11','p27','p28','p30']);
   w.A08JourneyEngine.reset();
   assert.equal(w.A08JourneyEngine.state().ids.length,0);
   assert.ok(w.A06Voice);
   const plan=()=>JSON.parse(w.localStorage.getItem('aracne-puglia-v1')).plan;
   const initially=JSON.stringify(plan());
   assert.equal(w.A08MapBridge.resolveNative('p11'),'p11','Bari Vecchia must match native catalog');
   assert.equal(w.A08MapBridge.canAdd('p11'),true);
   assert.equal(w.A08MapBridge.resolveNative('nonexistent'),null);
   assert.equal(w.A08MapBridge.showPlaces(['bad-id']).ok,false);
   const visible=w.A08MapBridge.showPlaces(['p11','p12','p13']);
   assert.equal(visible.ok,true);
   for(let i=0;i<45 && !w.document.querySelector('#a08-map-preview').textContent.includes('Bari Vecchia');i++)await wait(30);
   assert.equal(w.document.querySelector('#map').classList.contains('active'),true);
   assert.ok(w.document.querySelector('#a08-map-preview').textContent.includes('Bari Vecchia'),
     'map preview must render after Planner Leaflet initialization: '+JSON.stringify({state:w.A08MapBridge.status(),errors}));
   assert.equal(w.A08MapBridge.status().selected.length,3);
   assert.equal(w.A08MapBridge.status().previewFocused,false);
   assert.equal(counters.map,1,'must reuse Planner map');
   assert.ok(counters.markers>=3,'should add pins to existing map');
   assert.equal(JSON.stringify(plan()),initially,'map preview must not mutate saved plan');
   assert.equal(w.A08MapBridge.showRoute(['p11','p12','p13']).ok,true);
   await wait(160);
   for(let i=0;i<15 && counters.threadMoves<1;i++)await wait(25);
   assert.ok(counters.polylines>=1,'route preview uses indicative straight line');
   assert.equal(w.A08MapBridge.status().previewFocused,true,'route mode isolates suggested itinerary');
   assert.equal(counters.spiderIcons,1,'Il Volo spider starts on preview route');
   assert.ok(counters.threadMoves>=1,'pink thread animates on same Leaflet map: '+JSON.stringify(counters));
   assert.ok(counters.spiderMoves>=1,'spider moves along path');
   const nWeaves=w.A08MapBridge.status().animationsStarted;
   w.document.querySelector('.a08-replay-weave').click();
   await wait(25);
   assert.equal(w.A08MapBridge.status().animationsStarted,nWeaves+1,'route replay starts new spider animation');
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
   assert.match(read('lab/a08/a08.css'),/\.a06-voice-read\s*\{display:none!important\}/);
   assert.equal(w.document.querySelector('.a06-voice-read')!==null,true);
   const itineraryQ='Itinéraire de Bari à Lecce puis Gallipoli';
   queryInput.value=itineraryQ;
   routeAction.click();
   assert.equal(queryInput.value,'','route action clears the dictation editor');
   assert.ok(w.document.querySelector('.a08-journey-explain'),'ordered route rationale appears');
   assert.ok(w.document.querySelectorAll('.a08-stop-explanation').length>=3,'the response explains every city');
   assert.ok(w.document.querySelectorAll('.a08-stop-source').length>=3,'the route gives links for reviewed facts');
   assert.deepEqual(Array.from(w.A08JourneyEngine.state().ids),['p11','p27','p28']);
   w.A08JourneyEngine.reset();
   const suggested=w.A06RouteProposals.propose(lang==='fr'?'itinéraire à Bari':'route Bari',lang);
   assert.ok(suggested && suggested.stops,'route engine available');
   queryInput.value=lang==='it'?'itinerario Bari':lang==='es'?'ruta Bari':'itinéraire Bari';
   routeAction.click();
   assert.equal(queryInput.value,'','route action never keeps previous question text');
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
   // A08.3: two successive dictated questions must acquire two independent
   // recognition instances; submit clears the editor and cannot recycle old audio.
   const mic=w.document.querySelector('.a06-voice-start');
   const micStop=w.document.querySelector('.a06-voice-stop');
   const form=w.document.querySelector('#a06-panel form');
   assert.ok(w.A06Voice.supported);
   assert.ok(w.document.querySelector('.a08-keyboard-fallback'),'native keyboard fallback available');
   mic.click();assert.equal(sessions.length,1);
   assert.equal(sessions[0].continuous,false,'iOS receives a separate recognition session for every question');
   assert.equal(w.A06Voice.status().phase,'listening');
   sessions[0].onresult?.({results:[{0:{transcript:'Que voir à Bari'},isFinal:true}]});
   sessions[0].onend?.();
   assert.equal(w.A06Voice.status().phase,'idle');
   assert.equal(chatInput.value,'Que voir à Bari');
   form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
   assert.equal(chatInput.value,'','question sent: transcript cleared immediately');
   await wait(50);
   mic.click();assert.equal(sessions.length,2,'second dictation starts a fresh recognition engine');
   sessions[1].onresult?.({results:[{0:{transcript:'Et ensuite Gallipoli'},isFinal:true}]});
   sessions[1].onend?.();
   assert.equal(chatInput.value,'Et ensuite Gallipoli','new transcription contains no previous text');
   mic.click();assert.equal(sessions.length,3,'third dictation starts after natural onend');
   w.A06Voice.stop();assert.equal(sessions[2].aborted,true);
   assert.equal(w.A06Voice.status().phase,'closing','do not launch while WebKit releases previous mic');
   sessions[2].onend?.();
   assert.equal(w.A06Voice.status().phase,'idle');
   chatInput.value='';
   mic.click();assert.equal(sessions.length,4,'microphone is unlocked after cancellation');
   sessions[3].onend?.();
   assert.equal(w.A06Voice.status().phase,'idle');
   // A08.4: submitting while microphone is active must stop immediately.
   mic.click();assert.equal(sessions.length,5);
   sessions[4].onresult?.({results:[{0:{transcript:'Visiter Otranto'},isFinal:false}]});
   assert.equal(chatInput.value,'Visiter Otranto');
   form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
   assert.equal(sessions[4].aborted,true,'Send aborts recognition, not merely its button');
   assert.equal(chatInput.value,'','Send clears even an interim transcription');
   sessions[4].onend?.();
   assert.equal(w.A06Voice.status().phase,'idle','the microphone unlocks after submission');
   mic.click();assert.equal(sessions.length,6,'fresh recognition can start again');
   const keyboard=w.document.querySelector('.a08-keyboard-fallback');
   keyboard.click();
   assert.equal(sessions[5].stopped,true,'switching to keyboard stops listening');
   sessions[5].onend?.();
   assert.equal(w.A06Voice.status().phase,'idle');
   w.document.querySelector('#sharedOpen').click();
   assert.match(w.document.querySelector('#modalBody').textContent,/synchron|sincron|sync/i);
   assert.equal(w.localStorage.getItem('aracne-beta-token-v1'),null);
   assert.deepEqual(errors,[],lang+' DOM errors: '+errors.join(' | '));
   console.log('PASS A08 '+lang+' — integrated assistant, real Planner map, indicative route, native confirmation, isolated local data');
  } finally {dom.window.close();}
 }
})().catch(error=>{console.error(error.stack||error);process.exitCode=1});