'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../dist'),read=x=>fs.readFileSync(path.join(root,x),'utf8');
const context=vm.createContext({window:{}});
for(const script of ['a06-puglia-data.js','a06-legacy-audit.js','a06-commercial-audit.js','a06-data-quality.js'])
  vm.runInContext(read(script),context,{filename:script});
const {A06CommercialAudit:audit,A06DataQuality:quality,A06PugliaData:region}=context.window;
assert.ok(audit&&quality);
const actual=Array.from(audit.list()),expected=region.places.filter(p=>/^spa-|^boat-/.test(p.id));
assert.equal(actual.length,17);
assert.equal(expected.length,17);
assert.equal(audit.stats().operatorSitesReviewed,10);
assert.equal(audit.stats().bookableConfirmed,0);
assert.equal(audit.stats().priceVerified,0);
assert.equal(audit.stats().currentHoursVerified,0);
assert.equal(audit.stats().independentlyVerifiedBoatOperatorLicences,0);
for(const p of expected){
 const e=audit.get(p.id);
 assert.ok(e,'Missing provider '+p.id);
 assert.equal(e.id,p.id);
 assert.equal(e.name,p.name);
 assert.equal(e.zone,p.zone);
 assert.equal(e.oldSourceUrl,p.sourceUrl);
 assert.ok(['operator-website-content-observed','catalogue-url-not-independently-confirmed'].includes(e.evidenceScope));
 if(e.evidenceScope==='operator-website-content-observed')assert.ok(/^https:\/\//.test(e.evidenceUrl),p.id+' invalid evidence URL');
 else assert.equal(e.evidenceUrl,null,'unconfirmed vendor must not expose verified source');
 assert.equal(e.currentPriceVerified,false);
 assert.equal(e.bookingInventoryChecked,false);
 assert.equal(e.currentHoursVerified,false);
 assert.equal(e.entrancePointVerified,false);
 assert.equal(e.commercialEndorsement,false);
 for(const lang of ['fr','it','en','es'])assert.ok(e.description[lang].length>=65,p.id+' '+lang);
 assert.equal(quality.getCommercial(p.id).isPromotedToVerified,false);
 assert.equal(quality.getCommercial(p.id).bookingStatus,'not-confirmed');
 assert.equal(quality.getCommercial(p.id).pricingStatus,'not-confirmed');
}
assert.equal(audit.get('spa-torre-canne').operationalStatus,'seasonal-closure-announced');
assert.equal(audit.stats().seasonalClosureWarnings,1);
assert.ok(actual.every(x=>['availability-not-verified','seasonal-closure-announced','unknown'].includes(x.operationalStatus)));
assert.equal(quality.stats().commercialPending,17);
assert.equal(quality.stats().commercialSitesReviewed,10);
assert.equal(quality.stats().commercialVerifiedCurrentOffers,0);
assert.equal(quality.stats().independentlyVerifiedPins,0);
assert.equal(quality.stats().plannerPins,83);
assert.equal(audit.get('not-a-provider'),null);
for(const lang of ['fr','it','en','es']){
 const page=read(lang==='fr'?'index.html':'index.'+lang+'.html');
 const order=['a06-poi-reviews.js','a06-legacy-audit.js','a06-commercial-audit.js','a06-data-quality.js','a06-puglia-knowledge.js'];
 let last=-1;
 for(const s of order){
  const idx=page.indexOf('<script src="'+s);
  assert.ok(idx>last,lang+' script missing/out of order '+s);
  last=idx;
 }
}
console.log('PASS A06.5 commercial: 10 provider pages observed, 7 unconfirmed; 1 seasonal closure warning; ZERO current bookings, prices, hours or geocodes certified');
