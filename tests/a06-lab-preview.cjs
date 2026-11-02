'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'lab/a06-intelligence/index.html'),'utf8');
assert.ok(html.includes("connect-src 'none'"),'No remote backend access permitted');
assert.ok(html.includes('noindex,nofollow'),'Preview must be unindexed');
for(const fragment of ['supabase.co','createClient(','service_role','authToken','apiKey','location.href='])
 assert.equal(html.includes(fragment),false,'Unexpected live secret/backend reference '+fragment);
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM(html,{
 url:'https://aracne-intelligence-lab-preview.vercel.app/',
 runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc
});
const w=dom.window,context=dom.getInternalVMContext();
w.matchMedia=()=>({matches:false});w.scrollTo=()=>{};w.fetch=()=>{throw Error('Network request forbidden')};
w.XMLHttpRequest=class{open(){throw Error('XHR forbidden')}};
w.localStorage.setItem('private-synthetic-trip','do-not-change');
const scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
assert.ok(scripts.length>=14,'Expected production intelligence assets in lab preview');
for(const m of scripts){
 const found=/\bsrc="([^"]+)"/.exec(m[1]);
 if(found){
  assert.ok(/^dist\/a06-[\w-]+\.js$/.test(found[1]),'Only local vendored files allowed '+found[1]);
  const js=fs.readFileSync(path.join(root,found[1]),'utf8');
  vm.runInContext(js,context,{filename:found[1]});
 }else if(m[2].trim())vm.runInContext(m[2],context,{filename:'lab-inline.js'});
}
(async()=>{
 const api=w.A06TourismAssistant,knowledge=w.A06PugliaKnowledge,proposals=w.A06RouteProposals,providers=w.A06CommercialAudit;
 assert.ok(api&&knowledge&&proposals&&providers,'Lab engines failed to initialize');
 assert.equal(knowledge.stats().plannerPlaces,83);
 assert.equal(knowledge.stats().unifiedDistinct,126);
 assert.equal(w.A06POIReviews.stats().total,66);
 assert.equal(w.A06POIReviews.stats().reviewed,45);
 assert.equal(w.A06POIReviews.stats().sourceLinkedDraft,21);
 assert.equal(providers.stats().total,17);
 assert.equal(providers.stats().bookableConfirmed,0);
 assert.equal(typeof w.A06PlannerCatalog.openNativeAdd,'undefined','Lab must not offer trip write');
 assert.equal(w.document.querySelector('[id="confirmAdd"]'),null);
 const phrases={fr:'Que voir à Bari ?',it:'Cosa vedere a Bari?',en:'What to see in Bari?',es:'¿Qué ver en Bari?'};
 for(const lang of ['fr','it','en','es']){
  w.document.querySelector('#lang').value=lang;
  w.document.querySelector('#lang').dispatchEvent(new w.Event('change',{bubbles:true}));
  assert.equal(w.document.documentElement.lang,lang);
  const q=w.document.querySelector('#question');q.value=phrases[lang];
  w.document.querySelector('#askForm').dispatchEvent(new w.Event('submit',{cancelable:true,bubbles:true}));
  for(let i=0;i<45 && (w.document.querySelector('#answer').textContent.includes('…')||w.document.querySelector('#submit').disabled);i++)
    await new Promise(resolve=>setTimeout(resolve,10));
  assert.ok(w.document.querySelector('#answer').textContent.length>100,'Lab answer missing '+lang);
  assert.ok(!w.document.querySelector('#answer').textContent.includes('HIRUNDU'));
  w.document.querySelector('#routeMode').click();
  q.value={fr:'Parcours autour de Trani',it:'Itinerario a Trani',en:'Route around Trani',es:'Ruta por Trani'}[lang];
  w.document.querySelector('#askForm').dispatchEvent(new w.Event('submit',{cancelable:true,bubbles:true}));
  assert.ok(w.document.querySelectorAll('.stop').length>=1,'Lab stop preview missing '+lang);
  assert.equal(w.document.querySelectorAll('.stop button').length,0,'Lab must not add stops');
  w.document.querySelector('#infoMode').click();
 }
 assert.equal(w.localStorage.getItem('private-synthetic-trip'),'do-not-change');
 assert.equal(api.stats().plannerWrites,0);
 assert.equal(errors.length,0,errors.join('; '));
 console.log('PASS A06 Lab: four languages, static knowledge, indicative routes, 83 Planner POIs / 126 virtual identities, zero writes or external calls');
})().catch(err=>{console.error(err);process.exitCode=1}).finally(()=>dom.window.close());
