/* A06.5 editorial dedup audit: dangerous near-name or proximity pairs.
 * These are explicit KEEP-SEPARATE decisions, not aliases or automatic matches.
 * No change to historical or Planner IDs, and no write to either catalog. */
(() => {
  'use strict';
  const relations=Object.freeze([{"a":"p12","b":"beach-lama","relationship":"municipality-landmark","decision":"keep-separate","note":"Polignano a Mare is a town; Lama Monachile is a beach inside the town."},{"a":"p21","b":"spa-torre-canne","relationship":"locality-service","decision":"keep-separate","note":"Torre Canne is a coastal locality; its thermal establishment is a specific service."},{"a":"p35","b":"spa-cesarea","relationship":"locality-service","decision":"keep-separate","note":"Santa Cesarea Terme the town and its thermal operator are different entities."},{"a":"p0","b":"boat-vieste","relationship":"locality-service","decision":"keep-separate","note":"Vieste the town is not the same POI as a commercial boat operator."},{"a":"p27","b":"spa-risorgimento","relationship":"locality-service","decision":"keep-separate","note":"Lecce the city and a resort spa in Lecce are different entities."},{"a":"p31","b":"beach-torre-lapillo","relationship":"town-nearby-beach","decision":"keep-separate","note":"Porto Cesareo and Torre Lapillo have a geographic relationship, not identical identity."},{"a":"p7","b":"nature-alta-murgia","relationship":"broad-area-other","decision":"keep-separate","note":"Trani city and the Alta Murgia national park are different entities."}].map(x=>Object.freeze(x)));
  window.A06DuplicateAudit=Object.freeze({
    version:"0.5.0",
    list:()=>relations.slice(),
    get:(a,b)=>relations.find(r=>(r.a===a&&r.b===b)||(r.a===b&&r.b===a))||null,
    canAutoMerge:()=>false
  });
})();
