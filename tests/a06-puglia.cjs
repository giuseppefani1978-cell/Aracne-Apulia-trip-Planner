'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM,VirtualConsole}=require('jsdom');
const base=path.resolve(__dirname,'../dist');
const file=name=>fs.readFileSync(path.join(base,name),'utf8');
const languages=['fr','it','en','es'];
const targets=[
  ['gargano','Nature dans le Gargano pendant 3 jours'],
  ['imperiale','Que voir à Trani ?'],
  ['bari','Que voir à Bari ?'],
  ['itria','Que découvrir en Vallée d’Itria ?'],
  ['murgia','Que visiter dans la Murgia ?'],
  ['salento','Que découvrir à Gallipoli ?']
];
const counts={gargano:11,imperiale:7,bari:10,itria:13,murgia:10,salento:32};
const sourceV1=file('app.fr.js').match(/const raw=(\[[\s\S]*?\]);\s*const places=/);
assert.ok(sourceV1,'V1 Planner place source missing');
const v1=vm.runInNewContext('('+sourceV1[1]+')');
const v2={};vm.runInNewContext(file('catalog-v2.js'),{window:v2});
assert.equal(v1.length,37);assert.equal(v2.aracneCatalogV2.length,46);
const catalog=[...v1.map((r,i)=>({id:'p'+i,name:r[0],lat:r[2],lon:r[3]})),
 ...v2.aracneCatalogV2.map(r=>({id:r[0],name:r[1],lat:r[3],lon:r[4]}))];
const sourceNames=new Map(catalog.map(p=>[p.id,p.name]));
assert.equal(sourceNames.size,83,'The Planner catalog must not contain duplicate IDs');

function setup(lang){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM('<!doctype html><html lang="'+lang+'"><head></head><body><nav><button data-view="map" type="button">Map</button></nav><input id="search"><select id="zoneFilter"><option value="all">All</option></select></body></html>',{
  url:'https://aracne-lab.invalid/dist/index.html',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc
 });
 const w=dom.window,context=dom.getInternalVMContext();
 w.matchMedia=()=>({matches:true});w.scrollTo=()=>{};w.setInterval=()=>1;
 w.fetch=()=>{throw Error('A06.4 cannot call network')};
 w.XMLHttpRequest=class{open(){throw Error('A06.4 forbidden xhr')}};
 w.A06PlannerCatalog=Object.freeze({
  list:()=>catalog.map(p=>Object.freeze({...p})),
  proposalContext:()=>Object.freeze({canEdit:false,role:'read',fingerprint:'test-read-only'})
 });
 const scripts=['a06-places.js','a06-knowledge.js','a06-intelligence.js','a06-adapter.js',
  'a06-matcher.js','a06-puglia-data.js','a06-puglia-knowledge.js','a06-proposals.js','a06-panel.js'];
 for(const script of scripts)vm.runInContext(file(script),context,{filename:script});
 return {dom,w,errors};
}
(async()=>{
 for(const lang of languages){
 const {dom,w,errors}=setup(lang);
 try{
  w.localStorage.setItem('aracne-puglia-v1','{"trip":"original-synthetic-fixture"}');
  const regional=w.A06PugliaKnowledge;
  const stats=regional.stats();
  assert.equal(stats.plannerPlaces,83);
  assert.equal(stats.legacyPlaces,50);
  assert.equal(stats.legacyMapped,7);
  assert.equal(stats.unifiedDistinct,126);
  assert.equal(stats.officialRegionalContext,20);
  assert.equal(stats.catalogueSourceUnreverified,46);
  assert.equal(stats.editorialUnverified,17);
  assert.deepEqual(JSON.parse(JSON.stringify(stats.sixZones)),counts);
  assert.equal(regional.unifiedList().length,126);
  assert.equal(new Set(regional.unifiedList().map(p=>p.id)).size,126);
  for(const [zone,question] of targets){
   const info=regional.answer(question,lang);
   assert.equal(info?.zone,zone,lang+': wrong zone for '+question);
   assert.ok(info.text.length>80,lang+' '+zone+' empty knowledge');
   assert.ok(Array.isArray(info.plannerPlaces)&&info.plannerPlaces.length>=1);
   assert.ok(info.plannerPlaces.every(id=>sourceNames.has(id)));
   assert.ok(info.sources.every(s=>s.url.startsWith('https://')));
  }
  const whole=regional.answer('Que faire dans les Pouilles ?',lang);
  assert.ok(whole?.text.includes(regional.getZone('gargano').label[lang]));
  assert.ok(whole.text.includes(regional.getZone('salento').label[lang]));
  const nearby=regional.search('Quelles plages près de Polignano a Mare ?',lang);
  assert.equal(nearby.zone,'bari');
  assert.ok(nearby.places.every(p=>p.zone==='bari'));
  const duration=regional.search('Nature dans le Gargano pour 3 jours',lang);
  assert.equal(duration.days,3);
  assert.ok(duration.themes.includes('nature'));
  const unknown=regional.answer('Comment réparer un satellite ?',lang);
  assert.equal(unknown,null,'Unrelated queries must not invent tourism facts');
  const publicCards=w.A06PugliaData.places;
  for(const p of publicCards)assert.equal(sourceNames.get(p.id),p.name,'catalog drift '+p.id);
  const route=w.A06RouteProposals.propose('Propose-moi un parcours autour de Bari',lang);
  assert.equal(route.ok,true,'route '+lang);
  assert.ok(route.stops.length>=2&&route.stops.length<=4);
  assert.ok(route.stops.every(stop=>sourceNames.has(stop.plannerId)));
  assert.equal(route.routing,'indicative-only');
  assert.ok(route.stops.every(stop=>stop.matchType==='planner-catalogue'));
  const salentoRoute=w.A06RouteProposals.propose('Parcours autour d’Otranto',lang);
  assert.equal(salentoRoute.ok,true,'legacy Salento route must remain usable');
  assert.ok(salentoRoute.stops.some(s=>s.matchType!=='planner-catalogue'));
  const assistant=await w.A06TourismAssistant.ask('Que voir à Bari ?',lang);
  assert.equal(assistant.knowledgeSource,'puglia-structured-0.4');
  assert.ok(assistant.plannerPlaces.length);
  assert.ok(!assistant.text.includes('HIRUNDU'));
  assert.equal(w.A06TourismAssistant.stats().plannerWrites,0);
  w.document.querySelector('#a06-open').click();
  const panel=w.document.querySelector('#a06-panel'),question=panel.querySelector('.a06-input');
  question.value='Que voir à Bari ?';
  panel.querySelector('form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  for(let i=0;i<30&&!panel.querySelector('.a06-matches button');i++)await new Promise(resolve=>setTimeout(resolve,10));
  assert.ok(panel.querySelector('.a06-matches button'),'assistant regional map links missing '+lang);
  let navigation=0;w.document.querySelector('nav button[data-view="map"]').addEventListener('click',()=>navigation++);
  panel.querySelector('.a06-matches button').click();
  assert.equal(navigation,1,'Map only on explicit user click');
  assert.equal(w.localStorage.getItem('aracne-puglia-v1'),'{"trip":"original-synthetic-fixture"}');
  assert.equal(w.document.querySelector('#confirmAdd'),null);
  assert.equal(errors.length,0,errors.join('; '));
  const page=fs.readFileSync(path.resolve(__dirname,'../dist/index.'+(lang==='fr'?'html':lang+'.html')),'utf8');
  assert.ok(page.includes('a06-puglia-data.js?v=0.4.0'));
  assert.ok(page.includes('a06-puglia-knowledge.js?v=0.5.0'));
  assert.ok(page.indexOf('a06-puglia-knowledge.js') < page.indexOf('a06-proposals.js'));
  console.log('PASS A06.4 '+lang+': six zones, 126 unique records, provenance, route, local-only, map click');
 }finally{await new Promise(resolve=>setTimeout(resolve,0));dom.window.close()}
 }
})().catch(err=>{console.error(err);process.exitCode=1});
