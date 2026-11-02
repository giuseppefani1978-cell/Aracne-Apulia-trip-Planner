/* A06.3 — Prévisualisation d'itinéraire basée sur lieux vérifiés, sans accès aux voyages.
   Aucun itinéraire routier/durée n'est inféré. Aucune action d'écriture.
 */
(() => {
  'use strict';
  const matcher = window.A06PlaceMatcher;
  const source = window.A06IlVoloPlaces;
  const catalog = window.A06PlannerCatalog;
  if (!matcher || !Array.isArray(source) || typeof catalog?.list !== 'function') return;
  const normalize = value => String(value ?? '').normalize('NFD').toLowerCase()
    .replace(/[\u0300-\u036f]/g, '').replace(/[’‘']/g,' ')
    .replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  const rad = n => n*Math.PI/180;
  const distance = (a,b) => {
    if (![a?.lat,a?.lon,b?.lat,b?.lon].every(x => typeof x === 'number' && Number.isFinite(x))) return Infinity;
    const dLat=rad(b.lat-a.lat),dLon=rad(b.lon-a.lon);
    const h=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLon/2)**2;
    return 2*6371*Math.atan2(Math.sqrt(Math.max(0,h)),Math.sqrt(Math.max(0,1-h)));
  };
  const contains = (question,name) => {
    const q=' '+normalize(question)+' ',n=normalize(name);
    return n.length>=4 && q.includes(' '+n+' ');
  };
  const labels={
    fr:{noAnchor:'Précisez une région ou une ville des Pouilles, par exemple Bari, Vieste, Trani, Alberobello, Taranto ou Otranto.',noMatches:'Aucune étape reliée et vérifiée n’est disponible près de ce lieu pour cette première version.',disclaimer:'Proposition indicative issue du catalogue Planner, sans calcul routier, horaires ni réservations. Contenus et accès à vérifier ; chaque étape exige une confirmation séparée.'},
    it:{noAnchor:'Indica una zona o una città della Puglia, ad esempio Bari, Vieste, Trani, Alberobello, Taranto o Otranto.',noMatches:'Nessuna tappa verificata e collegata è disponibile vicino a questo luogo in questa prima versione.',disclaimer:'Proposta orientativa dal catalogo Planner, senza percorsi stradali, orari o prenotazioni. Verifica accessi e contenuti; conferma ogni tappa.'},
    en:{noAnchor:'Specify a place or region in Puglia, such as Bari, Vieste, Trani, Alberobello, Taranto or Otranto.',noMatches:'There are no verified linked stops near this place in the current version.',disclaimer:'Indicative Planner catalogue suggestion, not road routing, opening hours or bookings. Verify access and facts; confirm each stop separately.'},
    es:{noAnchor:'Indica una zona o ciudad de Apulia, como Bari, Vieste, Trani, Alberobello, Taranto u Otranto.',noMatches:'No hay etapas vinculadas y verificadas cerca de este lugar en esta versión.',disclaimer:'Sugerencia orientativa del catálogo Planner, sin rutas de carretera, horarios ni reservas. Comprueba accesos y confirma cada etapa.'}
  };
  const regional = () => window.A06PugliaKnowledge;
  // A06.4: the authoritative Planner catalogue is the itinerary destination;
  // the original 7 crosswalk mappings remain available for Salento.
  function proposeFromPlanner(question,lang,copy) {
    const index=regional();
    const focus=index?.findFocus?.(question);
    if(!focus?.zone) return null;
    const items=index.search(question,lang,12).places;
    const zoneItems=items.filter(p=>p.zone===focus.zone &&
      Number.isFinite(p.lat)&&Number.isFinite(p.lon));
    const ordered=zoneItems.sort((a,b)=>{
      const score=p=>(p.origin==='planner-v1'?3:1)+
        (p.sourceGrade==='official-regional-context'?1:0);
      return score(b)-score(a);
    });
    const unique=new Set(),stops=ordered.filter(p=>!unique.has(p.id)&&unique.add(p.id))
      .slice(0,4).map(p=>Object.freeze({
        plannerId:p.id,name:p.name,ilId:null,matchType:'planner-catalogue',
        provenance:p.sourceGrade
      }));
    if(!stops.length)return {ok:false,code:'no-matches',text:copy.noMatches,stops:[],language:lang};
    return Object.freeze({ok:true,language:lang,anchor:focus.anchor?.name ||
      regional().getZone(focus.zone)?.label?.[lang]||focus.zone,
      disclaimer:copy.disclaimer,stops:Object.freeze(stops),
      routing:'indicative-only',catalogue:'planner-puglia-v0.4'});
  }

  function propose(query,language='fr'){
    const lang=labels[language]?language:'fr',copy=labels[lang];
    const question=String(query||'').slice(0,600).trim();
    const focus=regional()?.findFocus?.(question);
    if(focus?.zone && focus.zone!=='salento'){
      const regionProposal=proposeFromPlanner(question,lang,copy);
      if(regionProposal)return regionProposal;
    }

    const planner=catalog.list();
    const byId=new Map(planner.map(p=>[p.id,p]));
    const mapped=matcher.matchMany(source.map(p=>p.id))
      .filter(m=>m.status==='matched' && byId.has(m.plannerId))
      .map(m=>({...m,point:byId.get(m.plannerId)}));
    // Full official POI names preferred; matching the shorter Planner names only
    // when these have at least 5 letters prevents random substrings.
    const explicit=mapped.map(m=>{
      const terms=[m.ilName,m.plannerName];
      const positions=terms.filter(n=>normalize(n).length>=5 && contains(question,n))
        .map(n=>normalize(question).indexOf(normalize(n)));
      return {...m,at:positions.length?Math.min(...positions):Infinity};
    }).filter(m=>Number.isFinite(m.at)).sort((a,b)=>a.at-b.at);
    let choices=[];
    let anchor=null;
    if(explicit.length>=2) {
      choices=explicit.slice(0,4);
      anchor=explicit[0].plannerName;
    } else {
      const candidates=planner
        .filter(p=>normalize(p.name).length>=5 && contains(question,p.name) &&
          Number.isFinite(p.lat)&&Number.isFinite(p.lon))
        .sort((a,b)=>normalize(b.name).length-normalize(a.name).length);
      const origin=explicit[0]?.point || candidates[0];
      if(!origin){
        const regionProposal=proposeFromPlanner(question,lang,copy);
        if(regionProposal)return regionProposal;
        return {ok:false,code:'no-anchor',text:copy.noAnchor,stops:[],language:lang};
      }
      anchor=origin.name;
      const radiusKm=35; // as-the-crow-flies relevance threshold, NOT road distance
      choices=mapped.map(m=>({...m,d:distance(origin,m.point)}))
        .filter(m=>m.d<=radiusKm)
        .sort((a,b)=>a.d-b.d).slice(0,4);
      if(explicit.length===1 && !choices.some(m=>m.ilId===explicit[0].ilId))
        choices.unshift(explicit[0]);
      choices=choices.slice(0,4);
    }
    const unique=new Set();
    const stops=choices.filter(m=>!unique.has(m.plannerId)&&unique.add(m.plannerId))
      .map(m=>Object.freeze({
        ilId:m.ilId,plannerId:m.plannerId,name:m.plannerName,
        matchType:m.matchType
      }));
    if(!stops.length)return {ok:false,code:'no-matches',text:copy.noMatches,stops:[],language:lang};
    return Object.freeze({ok:true,language:lang,anchor,
      disclaimer:copy.disclaimer,stops:Object.freeze(stops),routing:'indicative-only'});
  }
  window.A06RouteProposals=Object.freeze({version:'0.3.0-preview',propose});
})();