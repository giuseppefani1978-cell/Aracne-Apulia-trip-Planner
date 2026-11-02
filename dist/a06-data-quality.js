/* A06.5 lot 3 — Geo/taxonomy and commercial verification backlog.
   OBSERVATIONAL ONLY. Existing pins, zones, trip data and provider claims are untouched.
   Coordinates are inherited map markers and NOT independently geocoded entrances.
 */
(() => {
 'use strict';
 const data=window.A06PugliaData;
 if(!data?.places || !window.A06LegacyAudit) return;
 const broadZoneReview=Object.freeze({
   'p34':'Brindisi is grouped with Salento in the historical Planner zone; review regional boundaries, not a new trip ID.',
   'p36':'Torre Guaceto lies near Brindisi; historical Salento grouping needs a regional taxonomy decision.',
   'nature-cerano':'Brindisi-area reserve assigned to Salento macrozone; check region definition.',
   'nature-alta-murgia':'National park spans several areas, is grouped under Imperiale; territory membership is not an entrance coordinate.',
   'beach-bevagna':'Manduria beach assigned to Murgia/Taranto macrozone; cultural/administrative zone differs.',
   'nature-salina-monaci':'Coastal reserve assigned to Murgia/Taranto macrozone; review coastal subzone.'
 });
 const naturalTypes = /^(?:nature-|beach-)/;
 const areaNames = /(?:parco|park|riserva|reserve|bosco|foresta|salin|dune|oasi)/i;
 const mapped=Object.freeze(data.places.map(p=>Object.freeze({
   id:p.id,name:p.name,zone:p.zone,
   pointStatus:typeof p.lat==='number'&&Number.isFinite(p.lat)&&
     typeof p.lon==='number'&&Number.isFinite(p.lon)?'inherited-not-geocoded':'missing',
   pinInterpretation:areaNames.test(p.name)?'large-area-reference-point-not-entrance':'catalogue-indicative-pin',
   reviewZone: Boolean(broadZoneReview[p.id]),
   zoneNote:broadZoneReview[p.id]||null,
   coordinatesVerified:false,
   canNavigateAsEntrance:false
 })));
 const byId=new Map(mapped.map(p=>[p.id,p]));
 const commercial=Object.freeze(data.places.filter(p=>
   /^spa-|^boat-/.test(p.id)
 ).map(p=>Object.freeze({
   id:p.id,name:p.name,category:p.id.startsWith('spa-')?'spa':'boat',
   previousUrl:p.sourceUrl,operatingStatus:'not-checked',
   pricingStatus:'not-checked',hoursStatus:'not-checked',
   bookingStatus:'not-checked',accessStatus:'not-checked',
   sourceFreshness:'recheck-before-recommendation',
   isPromotedToVerified:false
 })));
 const pendingById=new Map(commercial.map(p=>[p.id,p]));
 window.A06DataQuality=Object.freeze({
   version:'0.5.2-review-only',
   listLocations:()=>mapped.slice(),
   getLocation:id=>byId.get(id)||null,
   listCommercialPending:()=>commercial.slice(),
   getCommercial:id=>pendingById.get(id)||null,
   stats:()=>Object.freeze({
     plannerPins:mapped.length,independentlyVerifiedPins:0,
     legacyPinsMissing:window.A06LegacyAudit.stats().missingCoordinates,
     macrozoneWarnings:mapped.filter(p=>p.reviewZone).length,
     commercialPending:commercial.length,
     commercialVerifiedCurrentOffers:0
   })
 });
})();