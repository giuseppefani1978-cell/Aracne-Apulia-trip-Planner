/* A07 — purely synthetic trip, created only for a fresh Lab origin. */
(() => {
 'use strict';
 const mark='aracne-a07-seeded';
 try{
  if(localStorage.getItem(mark))return;
  // No real Planner storage is imported. This hostname has its own browser origin.
  const sample=defaults();
  sample.name='DÉMO · Bari, Polignano et Monopoli';
  sample.theme='friends';sample.people=4;
  sample.members=['Alice (démo)','Benoît (démo)','Carla (démo)','David (démo)'];
  sample.start=today();sample.days=3;sample.arrival='Bari';
  sample.interests=['city','beach','food'];sample.budget=500;
  const stop=(name,time)=>{
   const place=places.find(p=>p.name===name);
   return place?{uid:uid(),id:place.id,name:place.name,desc:place.desc,
     lat:place.lat,lon:place.lon,tags:place.tags,time,duration:75,
     travelMinutes:0,status:'proposed'}:null;
  };
  sample.plan=[
   [stop('Bari Vecchia','10:00')].filter(Boolean),
   [stop('Polignano a Mare','10:30')].filter(Boolean),
   [stop('Monopoli','11:00')].filter(Boolean)
  ];
  sample.notes=[{id:uid(),text:'Note fictive : comparer les plages et restaurants avant de partir.',privacy:'group',day:0}];
  state=validate(sample);
  save();fillForm();
  // Supply the V5 trip-directory with a consistent synthetic active trip.
  // This is a new lab origin and no real user, capability token or session is copied.
  const id=crypto.randomUUID();
  const row={id,name:state.name,state:JSON.parse(JSON.stringify(state)),session:null,
   versions:[],updatedAt:new Date().toISOString()};
  localStorage.setItem('aracne-v5-store',JSON.stringify({version:5,trips:{[id]:row}}));
  localStorage.setItem('aracne-v5-active',id);
  localStorage.setItem(mark,'1');
 }catch(error){console.warn('[A07] synthetic sample could not be initialized',error)}
})();