'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const read=f=>fs.readFileSync(path.join(dist,f),'utf8');

// Use the actual Planner source catalog, not made-up POI IDs.
const app=read('app.fr.js');
const original=app.match(/const raw=(\[[\s\S]*?\]);\s*const places=/);
assert.ok(original,'Planner V1 catalog not found');
const rows=vm.runInNewContext('('+original[1]+')');
const catalog={};
vm.runInNewContext(read('catalog-v2.js'),{window:catalog});
assert.ok(Array.isArray(catalog.aracneCatalogV2));
const places=[
 ...rows.map((r,i)=>({id:'p'+i,name:r[0],lat:r[2],lon:r[3]})),
 ...catalog.aracneCatalogV2.map(r=>({id:r[0],name:r[1],lat:r[3],lon:r[4]}))
];
assert.equal(places.length,83,'Source Planner V1+V2 changed: review matching');

function browser(lang='fr'){
 const messages=[];
 const virtualConsole=new VirtualConsole();
 virtualConsole.on('jsdomError',err=>messages.push(err.message));
 const dom=new JSDOM('<!doctype html><html lang="'+lang+'"><head></head><body><nav><button data-view="map" type="button">Map</button></nav><input id="search"><select id="zoneFilter"><option value="all">All</option></select></body></html>',{
  url:'https://isolated-test.invalid/dist/index.html',pretendToBeVisual:true,
  runScripts:'outside-only',virtualConsole
 });
 const w=dom.window,ctx=dom.getInternalVMContext();
 w.scrollTo=()=>{};w.matchMedia=()=>({matches:true});
 w.fetch=()=>{throw Error('A06 network call forbidden')};
 w.XMLHttpRequest=class{open(){throw Error('A06 XHR forbidden')}};
 w.A06PlannerCatalog=Object.freeze({list:()=>places.map(p=>Object.freeze({...p}))});
 const loaded=['a06-places.js','a06-knowledge.js','a06-intelligence.js','a06-adapter.js','a06-matcher.js','a06-panel.js'];
 for(const f of loaded)vm.runInContext(read(f),ctx,{filename:f});
 return {dom,w,m:w.A06PlaceMatcher,messages};
}
(async()=>{
const {dom,w,m,messages}=browser();
assert.ok(m,'matcher API not installed');
const stats=m.summary();
assert.deepEqual(JSON.parse(JSON.stringify(stats)),{
 sourceCount:50,plannerCount:83,mapped:7,exact:4,alias:3,unmatched:43,ambiguous:0
});
for(const id of ['badisco','acquaviva','cesarea','suina']){
 assert.equal(m.match(id)?.status,'matched',id);
 assert.equal(m.match(id)?.matchType,'exact',id);
}
for(const id of ['cesine','monaci','turchi']){
 assert.equal(m.match(id)?.status,'matched',id);
 assert.equal(m.match(id)?.matchType,'alias',id);
}
assert.equal(m.match('lecce')?.status,'unmatched','Church must not be replaced by Lecce city/hotel');
assert.equal(m.match('bauxite')?.status,'unmatched','Mine must not be replaced by hotel/city');
assert.equal(m.match('santemiliano')?.status,'unmatched','Unknown coordinates remain unmatched');
assert.equal(m.match('does-not-exist'),null);
assert.equal(m.matchMany(['badisco','badisco','unknown']).length,1);

// Deliberately inject duplicate and geographically false catalog entries.
const originalList=w.A06PlannerCatalog;
w.A06PlannerCatalog=Object.freeze({list:()=>[
 {id:'a',name:'Porto Badisco',lat:40.05,lon:18.50},
 {id:'b',name:'Porto Badisco',lat:40.05,lon:18.50}
]});
assert.equal(m.match('badisco')?.status,'ambiguous','Do not choose between equal matches');
w.A06PlannerCatalog=Object.freeze({list:()=>[
 {id:'false',name:'Porto Badisco',lat:41.5,lon:18.5},
 {id:'nearby-hotel',name:'Basiliani Spa',lat:40.055,lon:18.5}
]});
assert.equal(m.match('badisco')?.status,'unmatched','No name-only/fuzzy/nearest-neighbor matches');
w.A06PlannerCatalog=originalList;

// UI: a mapped source can ONLY open the Planner map/search; never add a step.
w.localStorage.setItem('aracne-puglia-v1','unchanged-private-trip-fixture');
const nav=w.document.querySelector('[data-view="map"]');
let clicks=0;nav.addEventListener('click',()=>clicks++);
const open=w.document.getElementById('a06-open');
open.click();
assert.equal(w.document.querySelector('#a06-panel').hidden,false);
const form=w.document.querySelector('#a06-panel form');
form.querySelector('.a06-input').value='Parle-moi de Porto Badisco';
form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
for(let i=0;i<40 && w.document.querySelectorAll('.a06-place button').length===0;i++)
 await new Promise(resolve=>setTimeout(resolve,10));
const link=w.document.querySelector('.a06-place button');
assert.ok(link,'Mapped tourist POI must offer find-on-map action');
assert.equal(clicks,0,'No automatic navigation');
assert.equal(w.localStorage.getItem('aracne-puglia-v1'),'unchanged-private-trip-fixture');
link.click();
assert.equal(clicks,1,'Explicit user action opens map');
assert.equal(w.document.querySelector('#search').value,'Porto Badisco');
assert.equal(w.localStorage.getItem('aracne-puglia-v1'),'unchanged-private-trip-fixture');
assert.equal(w.document.querySelector('#confirmAdd'),null,'Never simulate Planner addition');
assert.equal(messages.length,0,messages.join('; '));
console.log('PASS A06.2 catalog: '+stats.sourceCount+' Il Volo POIs, '+stats.plannerCount+' Planner POIs, '+stats.mapped+' safe mappings (4 exact, 3 alias)');
console.log('PASS A06.2: city/hotel false matches, missing coords, duplicates and distant places refused');
console.log('PASS A06.2 UI: explicit map search only; no trip mutation');
dom.window.close();
})().catch(error=>{console.error(error);process.exitCode=1});
