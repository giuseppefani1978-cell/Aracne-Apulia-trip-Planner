/* A08.2 — Deterministic multi-destination conversation and trip planning.
   Reuses A06 catalog + A06 original single-zone generator as fallback.
   No cloud LLM, booking, live timetable, road routing, or trip writes.
*/
(()=>{'use strict';
 const catalog=window.A06PugliaData?.places;
 const fallback=window.A06RouteProposals;
 if(!Array.isArray(catalog)||!fallback?.propose)return;
 const byId=new Map(catalog.map(p=>[p.id,p]));
 const reviewed=window.A06POIReviews;
 const guidance={
   fr:{why:'À découvrir',day:'À explorer autour de cette étape',detail:'Description indicative issue du catalogue, à vérifier',review:'Information statique vérifiée',context:'Source régionale ou de catalogue, pas une validation individuelle',more:'Suggestions proches',transport:'Liaisons à confirmer selon le mode choisi'},
   it:{why:'Da scoprire',day:'Da vedere nei dintorni',detail:'Descrizione indicativa del catalogo, da verificare',review:'Informazione statica verificata',context:'Fonte regionale o di catalogo, non convalida individuale',more:'Idee vicine',transport:'Verificare collegamenti secondo il mezzo scelto'},
   en:{why:'What to explore',day:'Around this stop',detail:'Indicative catalogue description; verify before visiting',review:'Static fact reviewed',context:'Regional or catalogue source, not a place-specific verification',more:'Nearby ideas',transport:'Check connections for your transport mode'},
   es:{why:'Para descubrir',day:'Alrededor de la etapa',detail:'Descripción orientativa del catálogo; verificar',review:'Información estática verificada',context:'Fuente regional o de catálogo, no validación individual',more:'Ideas cercanas',transport:'Confirmar conexiones para el transporte elegido'}
 };
 const haversine=(a,b)=>{
   const rad=x=>x*Math.PI/180,dy=rad(a.lat-b.lat),dx=rad(a.lon-b.lon);
   const t=Math.sin(dy/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dx/2)**2;
   return 12742*Math.atan2(Math.sqrt(Math.max(0,t)),Math.sqrt(Math.max(0,1-t)));
 };
 function enrichStop(p,lang){
   const g=guidance[lang]||guidance.fr;
   const r=reviewed?.get?.(p.id);
   const verified=r?.verification==='static-claim-reviewed';
   const description=verified?r.claim?.[lang]||r.claim?.fr||'':p.description?.[lang]||p.description?.fr||'';
   const source=verified?r.source?.url||null:p.sourceUrl||null;
   const selected=catalog.filter(q=>q.id!==p.id&&q.zone===p.zone&&Number.isFinite(q.lat)&&Number.isFinite(q.lon))
       .map(q=>({p:q,d:haversine(p,q)})).filter(x=>x.d<=22).sort((a,b)=>a.d-b.d).slice(0,2)
       .map(x=>Object.freeze({id:x.p.id,name:x.p.name}));
   return Object.freeze({plannerId:p.id,name:p.name,description,
     quality:verified?'static-claim-reviewed':'catalogue-unreverified',
     sourceUrl:source,sourceLabel:verified?g.review:g.context,
     durationMinutes:Number.isFinite(p.duration)&&p.duration>0?p.duration:null,
     nearby:Object.freeze(selected),type:p.tags?.filter(x=>['city','beach','nature','food'].includes(x)).slice(0,3)||[],
     provenance:p.sourceGrade,matchType:'ordered-waypoint'});
 }
 function enrichProposal(proposal,lang){
   if(!proposal?.ok||!Array.isArray(proposal.stops))return proposal;
   const details=proposal.stops.map(stop=>byId.get(stop.plannerId)).filter(Boolean).map(p=>enrichStop(p,lang));
   return Object.freeze({...proposal,stops:Object.freeze(details),enriched:true});
 }
 function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘']/g,' ').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();}
 const aliases={
  p11:['bari','bari vecchia','vieux bari','old bari','bari centro'],
  p12:['polignano','polignano a mare'],
  p27:['lecce','leche','lecche'],
  p28:['gallipoli','galipoli'],
  p34:['brindisi','brindes'],
  p30:['otranto'],
  p13:['monopoli'],
  p16:['alberobello'],
  p0:['vieste'],
  p7:['trani'],
  p25:['taranto','tarente'],
  p20:['ostuni']
 };
 const terms=[];
 for(const p of catalog){
  const synonyms=[p.name,...(aliases[p.id]||[])];
  for(const alias of synonyms){
   const term=norm(alias);
   if(term.length<4)continue;
   terms.push({term,p,score:term.length});
  }
 }
 const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 function mentioned(question){
  const q=norm(question),hits=[];
  for(const {term,p,score} of terms){
   const pattern=new RegExp('(?:^|\\s)'+esc(term)+'(?=\\s|$)','g');
   let m;while((m=pattern.exec(q))){
    const at=m.index+(m[0].startsWith(' ')?1:0);
    hits.push({at,end:at+term.length,score,p});
    if(!pattern.global)break;
   }
  }
  hits.sort((a,b)=>a.at-b.at||b.score-a.score);
  const used=[],ordered=[];
  for(const h of hits){
   if(used.some(x=>h.at<x.end&&h.end>x.at))continue;
   used.push(h);
   if(!ordered.some(p=>p.id===h.p.id))ordered.push(h.p);
  }
  return ordered;
 }
 const words={
  fr:{modeCar:'voiture',modeTransit:'transports en commun',start:'Parcours proposé',to:'puis',explain:'Voici les étapes dans l’ordre demandé. Le tracé sur la carte est indicatif et ne suit pas les routes.',transport:'Moyen de transport',planner:'préférence actuellement sélectionnée dans le Planner',changed:'mode indiqué dans ta question',optional:'À explorer éventuellement en chemin',question:'Le Planner utilise actuellement ce mode. Souhaites-tu le conserver ou le modifier ?',note:'Chaque ajout au programme reste soumis à confirmation. Distances, durée et correspondances non calculées.'},
  it:{modeCar:'auto',modeTransit:'trasporti pubblici',start:'Percorso proposto',to:'poi',explain:'Le tappe rispettano l’ordine richiesto. La mappa mostra linee indicative, non strade reali.',transport:'Trasporto',planner:'scelta corrente nel Planner',changed:'scelta specificata',optional:'Da esplorare lungo il percorso',question:'Vuoi mantenere il trasporto corrente del Planner?',note:'Le tappe devono essere confermate. Distanze, durate e coincidenze non calcolate.'},
  en:{modeCar:'car',modeTransit:'public transport',start:'Suggested route',to:'then',explain:'The stops follow your requested order. Map lines are indicative, not actual roads.',transport:'Transport',planner:'current Planner preference',changed:'specified in your request',optional:'Optional places along the way',question:'Keep the transport mode currently selected in Planner?',note:'Every trip edit needs confirmation. Road times and connections are not calculated.'},
  es:{modeCar:'coche',modeTransit:'transporte público',start:'Ruta propuesta',to:'después',explain:'Las etapas siguen el orden solicitado. La línea del mapa es orientativa, no una ruta vial.',transport:'Transporte',planner:'preferencia actual de Planner',changed:'indicado en la solicitud',optional:'Opciones en el camino',question:'¿Mantener el transporte actual de Planner?',note:'Cada cambio requiere confirmación. No se calculan duraciones ni conexiones.'}
 };
 const intents=/(?:parcours|itineraire|itinéraire|circuit|trajet|route|road trip|itinerary|percorso|itinerario|tragitto|ruta|recorrido)/i;
 const follow=/(?:ensuite|apres|après|puis|et ensuite|ajoute|ajouter|passe par|via|poi|dopo|aggiungi|then|after|add|luego|despues|después|añade|anade)/i;
 const revise=/(?:plutot|plutôt|finalement|instead|rather|invece|piuttosto|mejor|en vez)/i;
 const transportWords={
  driving:/(?:voiture|auto\b|car\b|driving|automobile|coche|carro|macchina|en voiture|by car)/i,
  transit:/(?:train|bus|transports? en commun|transport public|public transport|transit|treno|autobus|tren|metro)/i
 };
 function transport(q){
  for(const [k,re]of Object.entries(transportWords))if(re.test(q))return k;
  return null;
 }
 let memory={ids:[],mode:null,lastQuestion:'',revision:0};
 function reset(){memory={ids:[],mode:null,lastQuestion:'',revision:memory.revision+1};}
 function hasRouteIntent(question){
  const hits=mentioned(question);
  return intents.test(question)||(hits.length>=2&&follow.test(question))||
    (memory.ids.length>=2&&hits.length>0&&(follow.test(question)||revise.test(question)))||
    (memory.ids.length>=2&&transport(question)!==null&&hits.length===0);
 }
 function transportMode(explicit){
  const selected=explicit||memory.mode||
    (typeof state!=='undefined'&&state?.transport==='transit'?'transit':'driving');
  return selected;
 }
 function detourCandidates(stops){
  if(stops.length<2)return [];
  const a=stops[0],b=stops[stops.length-1],vLat=b.lat-a.lat,vLon=b.lon-a.lon;
  const sq=vLat*vLat+vLon*vLon;
  if(sq<.0001)return [];
  return catalog.filter(p=>p?.lat&&p?.lon&&!stops.some(s=>s.id===p.id)
     &&!window.A06CommercialAudit?.get?.(p.id)
     &&!p.tags?.includes('spa')&&!p.tags?.includes('boat')).map(p=>{
      const t=Math.max(0,Math.min(1,((p.lat-a.lat)*vLat+(p.lon-a.lon)*vLon)/sq));
      const dy=p.lat-(a.lat+t*vLat),dx=(p.lon-(a.lon+t*vLon))*Math.cos(p.lat*Math.PI/180);
      const approxKm=111*Math.sqrt(dy*dy+dx*dx);
      return {p,t,approxKm};
  }).filter(x=>x.t>.08&&x.t<.92&&x.approxKm<16)
    .sort((x,y)=>x.approxKm-y.approxKm).slice(0,3).map(x=>x.p);
 }
 function propose(query,language='fr'){
  const q=String(query||'').trim().slice(0,600),lang=words[language]?language:'fr',t=words[lang],hits=mentioned(q);
  const isRoute=hasRouteIntent(q);
  if(!isRoute)return enrichProposal(fallback.propose(q,lang),lang);
  const explicitTransport=transport(q);
  let ordered=hits.map(x=>x.id);
  const continuing=memory.ids.length>=2&&ordered.length<=1&&(follow.test(q)||explicitTransport||revise.test(q));
  if(continuing){
   ordered=[...memory.ids];
   if(hits[0]&&!ordered.includes(hits[0].id))ordered.push(hits[0].id);
   // "plutôt X" with one city replaces the last destination.
   else if(hits[0]&&revise.test(q)&&ordered.length>1)ordered[ordered.length-1]=hits[0].id;
  }
  if(ordered.length<2){
   if(!hits.length&&!memory.ids.length)return enrichProposal(fallback.propose(q,lang),lang);
   if(memory.ids.length>=2&&continuing)ordered=[...memory.ids];
   else return fallback.propose(q,lang);
  }
  const unique=new Set();ordered=ordered.filter(id=>byId.has(id)&&!unique.has(id)&&unique.add(id));
  const stops=ordered.map(id=>byId.get(id));
  if(stops.length<2)return fallback.propose(q,lang);
  const mode=transportMode(explicitTransport);
  const hints=detourCandidates(stops);
  memory={ids:[...ordered],mode,lastQuestion:q,revision:memory.revision+1};
  const names=stops.map(p=>p.name);
  const text=t.explain+'\n\n'+t.start+': '+names.join(' → ')+'.\n'+t.transport+': '+(mode==='driving'?t.modeCar:t.modeTransit)+' ('+(explicitTransport?t.changed:t.planner)+').\n\n'+t.note;
  return Object.freeze({ok:true,language:lang,anchor:names[0],text,stops:Object.freeze(stops.map(p=>enrichStop(p,lang))),routing:'indicative-only',mode,explicitWaypoints:true,
  optionalStops:Object.freeze(hints.map(p=>enrichStop(p,lang))),
  disclaimer:t.note});
 }
 // A08.2 routes are now understood before the one-zone A06 fallback.
 window.A08JourneyEngine=Object.freeze({version:'0.2.0',propose,reset,mentioned,hasRouteIntent,
   state:()=>Object.freeze({...memory,ids:[...memory.ids]})});
 window.A06RouteProposals=Object.freeze({version:'0.4.0-lab-route',propose});
})();