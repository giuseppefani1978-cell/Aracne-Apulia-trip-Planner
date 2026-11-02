'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../dist');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const sandbox={window:{}};
const moduleContext=vm.createContext(sandbox);
for(const script of ['a06-places.js','a06-knowledge.js','a06-legacy-audit.js']){
 vm.runInContext(read(script),moduleContext,{filename:script});
}
const window=sandbox.window,places=window.A06IlVoloPlaces,source=window.AracneKnowledgeBase,audit=window.A06LegacyAudit;
assert.ok(Array.isArray(places)&&places.length===50);
assert.ok(source && audit);
assert.equal(audit.list().length,50);
assert.equal(audit.stats().total,50);
assert.equal(audit.stats().inheritedVerified,45);
assert.equal(audit.stats().inheritedPending,5);
assert.equal(audit.stats().missingCoordinates,15);
assert.equal(audit.stats().fusionIndependentlyVerified,0);
const ids=new Set(places.map(x=>x.id));
assert.equal(ids.size,50);
for(const p of places){
 const old=source.get(p.id),a=audit.get(p.id);
 assert.ok(old && a);
 assert.equal(a.name,p.name);
 assert.equal(a.inheritedStatus,old.verificationStatus);
 assert.equal(a.inheritedConfidence,old.confidence);
 assert.equal(a.fusionVerified,false);
 assert.equal(a.canAutoMerge,false);
 assert.equal(a.coordinateStatus,(!Number.isFinite(p.lat)||!Number.isFinite(p.lng))?'missing':'legacy-unverified');
 assert.deepEqual(JSON.parse(JSON.stringify(a.sourceIds)),JSON.parse(JSON.stringify(old.sourceIds||[])));
}
const pending=['lecce','scarra','enea','ripe','giurupi'];
const actual=Array.from(audit.list()).filter(x=>x.inheritedStatus==='legacy-pending').map(x=>x.id).sort();
assert.deepEqual(actual,pending.slice().sort());
assert.deepEqual(Array.from(audit.list()).filter(x=>x.coordinateStatus==='missing').map(x=>x.id).sort(),
 ['santemiliano','cervi','scarra','enea','ripe','caprarica','treporte','casale','giurupi','montagna','fiume','cavallo','grottella','santacaterina','mulino'].sort());
assert.ok(!audit.get('non-existent'));
for(const language of ['fr','it','en','es']){
 for(const id of pending){
  assert.ok(typeof source.get(id).summary?.[language]==='string');
  assert.ok(source.get(id).summary[language].length>20);
 }
 const page=read(language==='fr'?'index.html':'index.'+language+'.html');
 const review=page.indexOf('a06-poi-reviews.js'),legacy=page.indexOf('a06-legacy-audit.js');
 const knowledge=page.indexOf('a06-puglia-knowledge.js');
 assert.ok(review>=0&&legacy>review&&knowledge>legacy,'Bad legacy audit loading order '+language);
}
console.log('PASS A06.5 legacy: 50 inherited labels preserved, five pending, fifteen missing coordinates, zero fabricated fixes');
