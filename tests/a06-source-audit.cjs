'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'), path=require('node:path'),vm=require('node:vm');
const {JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'../dist');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const langs=['fr','it','en','es'];
const catalogV1=vm.runInNewContext('('+read('app.fr.js').match(/const raw=(\[[\s\S]*?\]);\s*const places=/)[1]+')');
const c2={};vm.runInNewContext(read('catalog-v2.js'),{window:c2});
const catalog=[...catalogV1.map((r,i)=>({id:'p'+i,name:r[0],lat:r[2],lon:r[3]})),
  ...c2.aracneCatalogV2.map(r=>({id:r[0],name:r[1],lat:r[3],lon:r[4]}))];
const ids=new Set(catalog.map(p=>p.id));
assert.equal(ids.size,83,'Planner IDs are immutable and non-colliding');
const modules=['a06-places.js','a06-knowledge.js','a06-intelligence.js','a06-adapter.js',
 'a06-matcher.js','a06-puglia-data.js','a06-poi-reviews.js','a06-duplicate-audit.js','a06-legacy-audit.js','a06-data-quality.js',
 'a06-puglia-knowledge.js','a06-proposals.js','a06-panel.js'];

(async()=>{
 for(const lang of langs){
  const errors=[];
  const consoleHook=new VirtualConsole();
  consoleHook.on('jsdomError',e=>errors.push(e.message));
  const dom=new JSDOM('<!doctype html><html lang="'+lang+'"><head></head><body><nav><button type="button" data-view="map">Map</button></nav><input id="search"><select id="zoneFilter"><option value="all">All</option></select></body></html>',{
   url:'https://aracne-lab.invalid/dist/index.html',runScripts:'outside-only',
   pretendToBeVisual:true,virtualConsole:consoleHook
  });
  const w=dom.window,ctx=dom.getInternalVMContext();
  try{
   w.scrollTo=()=>{};w.matchMedia=()=>({matches:true});
   w.fetch=()=>{throw Error('No network allowed in A06.5')};
   w.XMLHttpRequest=class {open(){throw Error('No XHR allowed')}};
   w.A06PlannerCatalog=Object.freeze({
    list:()=>catalog.map(p=>Object.freeze({...p})),
    proposalContext:()=>({canEdit:false,role:'read',fingerprint:'read-only-fixture'})
   });
   for(const file of modules)vm.runInContext(read(file),ctx,{filename:file});
   const reviews=w.A06POIReviews,dupes=w.A06DuplicateAudit,k=w.A06PugliaKnowledge;
   assert.ok(reviews&&dupes&&k,'review knowledge/duplicates missing');
   const list=reviews.list();
   assert.equal(list.length,45);
   assert.equal(reviews.stats().reviewed,45);
   assert.equal(new Set(list.map(p=>p.id)).size,45);
   assert.deepEqual([...new Set(list.map(p=>p.zone))].sort(),['bari','gargano','imperiale','itria','murgia','salento']);
   for(const p of list){
    assert.ok(ids.has(p.id),'Audited POI must correspond to real Planner ID '+p.id);
    assert.equal(catalog.find(x=>x.id===p.id).name,p.name);
    assert.ok(/^https:\/\//.test(p.source.url));
    assert.equal(p.verification,'static-claim-reviewed');
    assert.ok(['UNESCO','official-or-manager','protected-area-register'].includes(p.source.type));
    for(const language of langs)assert.ok(p.claim[language].length>=55,'Missing fact '+p.id+' '+language);
    for(const flag of Object.values(p.limits))assert.equal(flag,false,'No verification of dynamic/geo claims');
   }
   assert.equal(dupes.list().length,7);
   for(const pair of dupes.list()){
    assert.ok(ids.has(pair.a)&&ids.has(pair.b),pair.a+' vs '+pair.b);
    assert.notEqual(pair.a,pair.b);
    assert.equal(pair.decision,'keep-separate');
    assert.equal(dupes.canAutoMerge(pair.a,pair.b),false);
   }
   assert.equal(dupes.get('beach-lama','p12').decision,'keep-separate');
   assert.equal(dupes.get('spa-cesarea','p35').decision,'keep-separate');
   assert.equal(k.unifiedList().length,126,'No automatic merge/delete of legacy IDs');
   const stats=k.stats();
   assert.equal(stats.poiStaticReviewed,45);
   assert.equal(stats.duplicateKeepSeparate,7);
   const queries=[
    ['p2','Foresta Umbra','gargano'],
    ['p9','Castel del Monte','imperiale'],
    ['p11','Bari Vecchia','bari'],
    ['p16','Alberobello','itria'],
    ['p22','Altamura','murgia'],
    ['p27','Lecce','salento']
   ];
   for(const [id,name,zone] of queries){
    const answer=k.answer('Que voir à '+name+' ?',lang);
    assert.equal(answer.zone,zone,id);
    assert.ok(answer.text.includes(reviews.get(id).claim[lang]),'No audited fact for '+id+' '+lang);
    assert.ok(answer.sources.some(s=>s.url===reviews.get(id).source.url&&s.quality==='poi-static-checked'),'No direct audited source for '+id);
   }
   const batch2=[
    ['p1','Peschici','gargano'],
    ['p3','Monte Sant’Angelo','gargano'],
    ['p4','Bovino','gargano'],
    ['p6','Îles Tremiti','gargano'],
    ['p8','Barletta','imperiale'],
    ['p13','Monopoli','bari'],
    ['p17','Locorotondo','itria'],
    ['p18','Martina Franca','itria'],
    ['p19','Cisternino','itria'],
    ['p20','Ostuni','itria'],
    ['p23','Gravina in Puglia','murgia'],
    ['p24','Laterza','murgia'],
    ['p28','Gallipoli','salento'],
    ['p30','Otranto','salento'],
    ['p34','Brindisi','salento']
   ];
   for(const [id,name,zone] of batch2){
     const result=k.answer('Que voir à '+name+' ?',lang);
     assert.equal(result?.zone,zone,'Missing zone '+id+' '+lang);
     assert.ok(result.text.includes(reviews.get(id).claim[lang]),'Missing new verified fact '+id+' '+lang);
     assert.ok(result.sources.some(x=>x.quality==='poi-static-checked'&&x.url===reviews.get(id).source.url),
        'Missing direct new source '+id+' '+lang);
   }
   assert.equal(batch2.length,15);
   const batch3=[
      ['p5','Lucera','gargano'],['p10','Bisceglie','imperiale'],['p15','Giovinazzo','bari'],
      ['p26','Castellaneta','murgia'],['p31','Porto Cesareo','salento'],['p32','Nardò','salento'],
      ['p33','Santa Maria di Leuca','salento'],['nature-dune-costiere','Parco Dune Costiere','itria'],
      ['nature-pianelle','Bosco delle Pianelle','itria'],['nature-porto-selvaggio','Parco di Porto Selvaggio','salento'],
      ['nature-ugento','Parco Naturale Litorale di Ugento','salento'],
      ['nature-otranto-leuca','Parco Costa Otranto–Leuca e Bosco di Tricase','salento'],
      ['nature-rauccio','Bosco e Paludi di Rauccio · Lecce','salento'],
      ['nature-lama-balice','Parco Naturale Lama Balice · Bari','bari'],
      ['nature-saline-margherita','Saline di Margherita di Savoia','imperiale'],
      ['nature-oasi-laterza','Oasi Gravina di Laterza','murgia']
   ];
   assert.equal(batch3.length,16);
   for(const [id,name,zone] of batch3){
     const response=k.answer('Que voir à '+name+' ?',lang);
     assert.equal(response?.zone,zone,'Missing new zone '+id+' '+lang);
     assert.ok(response.text.includes(reviews.get(id).claim[lang]),'No batch3 fact '+id+' '+lang);
     assert.ok(response.sources.some(s=>s.quality==='poi-static-checked'&&s.url===reviews.get(id).source.url),
       'Missing direct batch3 source '+id+' '+lang);
   }
   const quality=w.A06DataQuality;
   assert.equal(quality.stats().plannerPins,83);
   assert.equal(quality.stats().independentlyVerifiedPins,0);
   assert.equal(quality.stats().macrozoneWarnings,6);
   assert.equal(quality.stats().legacyPinsMissing,15);
   assert.equal(quality.stats().commercialVerifiedCurrentOffers,0);
   assert.ok(quality.stats().commercialPending>10);
   assert.equal(quality.getLocation('p36').reviewZone,true);
   assert.equal(quality.getLocation('p34').reviewZone,true);
   assert.equal(quality.getLocation('nature-ugento').coordinatesVerified,false);
   assert.ok(quality.listCommercialPending().every(p=>p.isPromotedToVerified===false&&p.operatingStatus==='not-checked'));
   const caution=reviews.get('nature-saline-margherita').accessCaution;
   assert.ok(caution?.[lang]?.length>30);
   const noPOI=k.answer('Un lieu complètement inconnu ?',lang);
   assert.equal(noPOI,null);
   w.localStorage.setItem('aracne-puglia-v1','private-trip-unchanged');
   const regional=await w.A06TourismAssistant.ask('Que voir à Alberobello ?',lang);
   assert.equal(regional.knowledgeSource,'puglia-structured-0.4');
   assert.ok(regional.sources.some(s=>s.quality==='poi-static-checked'));
   assert.ok(!regional.text.includes('HIRUNDU'));
   assert.equal(w.localStorage.getItem('aracne-puglia-v1'),'private-trip-unchanged');
   assert.equal(w.A06TourismAssistant.stats().plannerWrites,0);
   const page=read(lang==='fr'?'index.html':'index.'+lang+'.html');
   const order=['a06-puglia-data.js','a06-poi-reviews.js','a06-duplicate-audit.js','a06-legacy-audit.js','a06-data-quality.js','a06-puglia-knowledge.js'];
   let prev=-1;
   for(const script of order){
    const loc=page.indexOf('<script src="'+script);
    assert.ok(loc>prev,'Missing/bad order of '+script);
    prev=loc;
   }
   assert.equal(errors.length,0,errors.join('; '));
   console.log('PASS A06.5 '+lang+': 45 sourced POI facts, 7 keep-separate pairs, 126 IDs, no writes');
  } finally {
   await new Promise(resolve=>setTimeout(resolve,0));
   dom.window.close();
  }
 }
})().catch(error=>{console.error(error);process.exitCode=1});
