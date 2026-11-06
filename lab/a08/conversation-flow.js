/* A08.5 — one read-only conversation coordinator for tourism answers and routes.
 * A06 dialogue and A08 journey no longer interpret unrelated turns in isolation.
 * The coordinator records explicit places, themes and itinerary requests without
 * copying any Supabase data or changing the Planner's real itinerary.
 */
(()=>{'use strict';
 const places=window.A06PugliaData?.places||[];
 const journey=window.A08JourneyEngine;
 if(!journey)return;
 const lang=document.documentElement.lang;
 const n=s=>String(s||'').normalize('NFD').toLowerCase().replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
 const routeWord=/(?:itin[eé]raire|parcours|trajet|circuit|route|road trip|itinerario|percorso|ruta|recorrido)/i;
 const continuation=/(?:^et\b|^puis\b|^ensuite\b|^apr[eè]s\b|^and\b|^then\b|^after\b|^e poi\b|^poi\b|^dopo\b|^luego\b|^y luego\b|^despu[eé]s\b|ajoute|aggiungi|add|a[ñn]ade)/i;
 const topic=/(?:plage|plages|beach|spiagg|playa|gastronom|cuisine|food|eat|mang|nature|histoire|history|patrimoine|museum|musee|museo|visite|visit)/i;
 const transport=/(?:train|bus|voiture|en auto|by car|by train|transports? en commun|public transport|treno|autobus|tren|coche)/i;
 let history=[],lastLocation=null,lastTopic=null,routeIds=[];
 const name=id=>places.find(p=>p.id===id)?.name||'';
 function reset(){history=[];lastLocation=null;lastTopic=null;routeIds=[]}
 function prepare(input){
  const question=String(input||'').trim().slice(0,600);
  const named=journey.mentioned(question);
  const ids=named.map(p=>p.id);
  const isFollow=continuation.test(n(question));
  const isRoute=routeWord.test(question)||journey.hasRouteIntent(question);
  // If a user continues an existing route ("Et après Otranto?"), keep the
  // full list; for generic questions we preserve only geographical focus.
  let routeQuery=question;
  let makeRoute=isRoute;
  const knownRoute=journey.state().ids;
  if(!makeRoute&&isFollow&&ids.length&&routeIds.length>=1&&
      /(?:puis|ensuite|apr[eè]s|then|after|poi|dopo|luego|despu[eé]s)/i.test(question)){
    makeRoute=true;
  }
  if(makeRoute&&knownRoute.length<2&&ids.length<2){
    // Route explicitly requested after an earlier tourism question:
    // "Je suis à Bari" -> "un itinéraire vers Lecce".
    const sequence=[...routeIds,...ids].filter((id,i,a)=>a.indexOf(id)===i);
    if(sequence.length>=2)routeQuery='parcours '+sequence.map(name).join(' puis ');
  }else if(makeRoute&&knownRoute.length>=2&&ids.length===0&&transport.test(question)){
    routeQuery=question;
  }else if(makeRoute&&knownRoute.length===0&&ids.length===1&&routeIds.length>=2){
    routeQuery='parcours '+routeIds.map(name).join(' puis ')+' puis '+name(ids[0]);
  }
  let dialogueQuery=question;
  if(!makeRoute&&!ids.length&&lastLocation&&(isFollow||topic.test(question))&&
      !/\b(?:puglia|pouilles|apulia|puglie)\b/i.test(question)){
    dialogueQuery=question+' '+({fr:'à',it:'a',en:'in',es:'en'}[lang]||'à')+' '+name(lastLocation);
  }
  // Distinguish conversation memory from the hypothetical trip.
  return Object.freeze({question,dialogueQuery,routeQuery,route:makeRoute,
    ids:[...ids],contextPlace:lastLocation,topic:lastTopic,revision:history.length});
 }
 function commit(prepared,{route=false}={}){
  const ids=prepared.ids||[];
  if(ids.length){lastLocation=ids[ids.length-1];for(const id of ids)if(!routeIds.includes(id))routeIds.push(id);}
  if(topic.test(prepared.question))lastTopic=prepared.question;
  if(route){const found=journey.state().ids;if(found.length>=2){routeIds=[...found];lastLocation=found[found.length-1]}}
  history.push({q:prepared.question,route:!!route,ids:[...ids]});
  history=history.slice(-16);
 }
 window.A08ConversationFlow=Object.freeze({
  version:'0.1.0',prepare,commit,reset,
  context:()=>Object.freeze({lastLocation,lastName:name(lastLocation),lastTopic,
    routeIds:[...routeIds],turns:history.length})
 });
})();