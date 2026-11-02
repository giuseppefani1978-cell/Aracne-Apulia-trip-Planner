/* A06.4 — Four-language structured retrieval across the six Planner zones.
   Local static lookup; no network calls, trip reads, user state, or external LLM.
   Old Il Volo knowledge remains separate and is used as fallback when unmatched. */
(() => {
  'use strict';
  const DATA = window.A06PugliaData;
  if (!DATA || !Array.isArray(DATA.places) || !DATA.zones) return;
  const languages = ['fr','it','en','es'];
  const normalize = str => String(str||'').normalize('NFD').toLowerCase()
    .replace(/[\u0300-\u036f]/g,'').replace(/[’‘']/g,' ')
    .replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  const includesPhrase = (haystack,needle) => {
    const word=normalize(needle);
    return word.length>=3 && (' '+normalize(haystack)+' ').includes(' '+word+' ');
  };
  const tags = {
    beach:/(?:plag|mer\b|baign|spiagg|mare\b|beach|coast|playa|costas?\b)/i,
    city:/(?:vill|ville|patrim|monum|centro|storic|historic|town|cultur|arquitect|architecture|borgo|ciudad)/i,
    food:/(?:mang|manger|cuisin|gastronom|food|eat|restaurant|vino|wine|vin\b|comer|comida|essen)/i,
    nature:/(?:nature|natur|randonn|hike|hiking|bosco|foret|for[eê]t|\bparc\b|\bparco\b|\bparque\b|\bpark\b|sentier|caminar|naturaleza)/i,
    boat:/(?:bateau|barca|boat|kayak|navig|croisi|cruise|vela|velero)/i,
    spa:/(?:spa|therm|terme|wellness|bien.etre|benessere|relajaci|relax)/i,
    party:/(?:soir|fete|fête|nightlife|club|fiesta|divert|discotec)/i
  };
  const copy = {
    fr:{intro:'Informations touristiques pour',around:'autour de',chosen:'Quelques lieux du catalogue',no:'Précisez une destination des Pouilles (Gargano, Bari, Vallée d’Itria, Murgia, Trani ou Salento).',verified:'Certaines sources officielles documentent la région ; les descriptions de lieux restent à vérifier individuellement.',volatile:'Horaires, tarifs, accès, météo et disponibilités doivent être vérifiés avant la visite.',duration:'Séjour évoqué',days:'jours',places:'lieux du Planner'},
    it:{intro:'Informazioni turistiche per',around:'nei dintorni di',chosen:'Alcuni luoghi del catalogo',no:'Specifica una destinazione in Puglia (Gargano, Bari, Valle d’Itria, Murgia, Trani o Salento).',verified:'Le fonti ufficiali descrivono la regione; le schede dei singoli luoghi richiedono una verifica.',volatile:'Orari, prezzi, accessi, meteo e disponibilità vanno verificati prima della visita.',duration:'Soggiorno richiesto',days:'giorni',places:'luoghi del Planner'},
    en:{intro:'Visitor information for',around:'near',chosen:'Places from the catalogue',no:'Specify a destination in Puglia (Gargano, Bari, Itria Valley, Murgia, Trani or Salento).',verified:'Official sources provide regional context; individual place descriptions still require checking.',volatile:'Opening hours, prices, access, weather and availability must be checked before visiting.',duration:'Trip length mentioned',days:'days',places:'Planner places'},
    es:{intro:'Información turística de',around:'cerca de',chosen:'Lugares del catálogo',no:'Indica un destino de Apulia (Gargano, Bari, Valle de Itria, Murgia, Trani o Salento).',verified:'Las fuentes oficiales aportan contexto regional; las fichas de cada lugar requieren comprobación.',volatile:'Comprueba horarios, precios, accesos, meteorología y disponibilidad antes de la visita.',duration:'Duración mencionada',days:'días',places:'lugares del Planner'}
  };
  const placeById=new Map(DATA.places.map(p=>[p.id,p]));
  const knownZones=new Set(Object.keys(DATA.zones));
  const earthDistance=(a,b)=>{
    const aLon=a?.lon,bLon=b?.lon;
    if(![a?.lat,aLon,b?.lat,bLon].every(Number.isFinite)) return Infinity;
    const radians=value=>value*Math.PI/180;
    const dLat=radians(b.lat-a.lat),dLon=radians(bLon-aLon);
    const k=Math.sin(dLat/2)**2+Math.cos(radians(a.lat))*Math.cos(radians(b.lat))*Math.sin(dLon/2)**2;
    return 12742*Math.atan2(Math.sqrt(Math.max(0,k)),Math.sqrt(Math.max(0,1-k)));
  };
  const sourceStatus=p=>p.sourceGrade==='official-regional-context'?'official-regional-context':
    p.sourceGrade==='catalogue-source-unreverified'?'catalogue-source-unreverified':'editorial-unverified';
  const rank=p=>p.sourceGrade==='official-regional-context'?3:p.sourceGrade==='catalogue-source-unreverified'?2:1;
  const durationMention=query=>{
    const match=normalize(query).match(/\b(\d{1,2})\s*(?:jour|jours|giorno|giorni|days|day|dia|dias)\b/);
    const n=match?Number(match[1]):null;
    return n>=1&&n<=14?n:null;
  };
  function findFocus(query){
    const q=normalize(query);
    if(!q)return {zone:null,anchor:null};
    // Full place names win over generic region aliases.
    const anchors=DATA.places.filter(p=>includesPhrase(q,p.name))
      .sort((a,b)=>normalize(b.name).length-normalize(a.name).length||rank(b)-rank(a));
    if(anchors.length)return {zone:anchors[0].zone,anchor:anchors[0]};
    let zone=null,weight=0;
    for(const [id,meta] of Object.entries(DATA.zones)){
      for(const alias of [id,...(meta.aliases||[]),...Object.values(meta.label||{})]){
        const phrase=normalize(alias);
        if(phrase.length>=4&&includesPhrase(q,phrase)&&phrase.length>weight){zone=id;weight=phrase.length;}
      }
    }
    return {zone,anchor:null};
  }
  function search(question,lang='fr',limit=8){
    const q=String(question||'').slice(0,600),language=languages.includes(lang)?lang:'fr';
    const focus=findFocus(q);
    const days=durationMention(q);
    const themes=Object.entries(tags).filter(([,pattern])=>pattern.test(q)).map(([name])=>name);
    const wantNear=/(?:autour|près|proch|environ|near|around|vicino|intorno|cerca de|alrededor)/i.test(q);
    let pool=DATA.places.filter(p=>knownZones.has(p.zone));
    if(focus.zone)pool=pool.filter(p=>p.zone===focus.zone);
    if(focus.anchor&&(wantNear||focus.zone)){
      const near=pool.filter(p=>earthDistance(p,focus.anchor)<=40);
      if(near.length)pool=near;
    }
    if(themes.length){
      const thematic=pool.filter(p=>p.tags?.some(t=>themes.includes(t)));
      if(thematic.length)pool=thematic;
    }
    pool=pool.slice().sort((a,b)=>{
      if(focus.anchor){
        if(a.id===focus.anchor.id)return -1;if(b.id===focus.anchor.id)return 1;
        const da=earthDistance(a,focus.anchor),db=earthDistance(b,focus.anchor);
        if(Math.abs(da-db)>0.1)return da-db;
      }
      const sourceRank=rank(b)-rank(a);
      if(sourceRank)return sourceRank;
      return a.name.localeCompare(b.name);
    });
    const places=pool.slice(0,Math.max(1,Math.min(12,limit||8)));
    return {recognized:Boolean(focus.zone),zone:focus.zone,anchorId:focus.anchor?.id||null,
      language,days,themes,places};
  }
  function sourcesFor(result){
    if(!result.recognized)return [];
    const sources=[];
    const add=(url,label,quality)=>{
      if(typeof url!=='string'||!/^https:\/\/[a-z0-9.-]+\//i.test(url)||sources.some(item=>item.url===url))return;
      sources.push({url,title:label,quality});
    };
    // POI-specific source audited in A06.5 takes precedence over regional
    // background or older V2 vendor URL. No live opening-time assertions.
    const review=window.A06POIReviews;
    for(const place of result.places){
      const item=review?.get?.(place.id);
      if(item)add(item.source.url,item.name,'poi-static-checked');
      if(sources.length>=5)return sources.slice(0,5);
    }
    const region=DATA.zones[result.zone];
    if(region) add(region.sourceUrl,region.label?.[result.language]||result.zone,'official-region-context');
    for(const p of result.places){
      if(p.sourceGrade==='official-regional-context')add(p.sourceUrl,p.name,'official-region-context');
      // Existing V2 vendor/regional URL may be shown, but is explicitly marked
      // as not reverified; never claim it proves opening hours or availability.
      else if(p.sourceGrade==='catalogue-source-unreverified')add(p.sourceUrl,p.name,'unreverified-catalogue');
      if(sources.length>=5)break;
    }
    return sources.slice(0,5);
  }
  const regionQuery = /\b(?:puglia|pouilles|apulia|apulie|puglie)\b/i;
  function answer(question,lang='fr'){
    const response=search(question,lang,6);
    if(!response.recognized){
      if(!regionQuery.test(normalize(question)))return null;
      const l=response.language,t=copy[l],zones=Object.values(DATA.zones);
      const lines=zones.map(z=>'• '+z.label[l]+': '+z.description[l]);
      return {ok:true,language:l,recognized:true,source:'puglia-structured-v0.4',
        zone:null,text:lines.join('\n')+'\n\n'+t.verified+' '+t.volatile,
        plannerPlaces:[],sources:Object.values(DATA.zones)
          .map(z=>({url:z.sourceUrl,title:z.label[l],quality:'official-region-context'}))
          .filter((s,i,a)=>a.findIndex(x=>x.url===s.url)===i).slice(0,5),
        days:response.days};
    }
    const l=response.language,t=copy[l],region=DATA.zones[response.zone];
    const title=region.label[l]||region.label.fr;
    const intro=t.intro+' '+title+'. '+region.description[l];
    const dayText=response.days?' '+t.duration+': '+response.days+' '+t.days+'.':'';
    const descriptions=response.places.slice(0,5).map(p=>{
      const staticFact=window.A06POIReviews?.get?.(p.id);
      const desc=staticFact?.claim?.[l]||p.description?.[l];
      return '• '+p.name+(desc?' — '+desc:'');
    });
    const text=[intro,dayText,(descriptions.length?t.chosen+':\n'+descriptions.join('\n'):''),t.verified,t.volatile]
      .filter(Boolean).join('\n\n');
    return {ok:true,language:l,recognized:true,source:'puglia-structured-v0.4',
      zone:response.zone,text,plannerPlaces:response.places.map(p=>p.id),
      sources:sourcesFor(response),
      disclaimer:t.volatile,days:response.days};
  }
  const stats=()=>{
    const unique=new Set(DATA.places.map(p=>p.id));
    const matcher=window.A06PlaceMatcher;
    const counts=matcher?.summary?.()||{};
    const ilCount=Array.isArray(window.A06IlVoloPlaces)?window.A06IlVoloPlaces.length:0;
    const mapped=counts.mapped||0;
    return Object.freeze({
      plannerPlaces:unique.size,legacyPlaces:ilCount,legacyMapped:mapped,
      unifiedDistinct:unique.size+ilCount-mapped,
      sixZones:Object.fromEntries(Object.keys(DATA.zones).map(z=>[z,DATA.places.filter(p=>p.zone===z).length])),
      officialRegionalContext:DATA.places.filter(p=>sourceStatus(p)==='official-regional-context').length,
      catalogueSourceUnreverified:DATA.places.filter(p=>sourceStatus(p)==='catalogue-source-unreverified').length,
      editorialUnverified:DATA.places.filter(p=>sourceStatus(p)==='editorial-unverified').length,
      poiStaticReviewed:window.A06POIReviews?.stats?.().reviewed||0,
      duplicateKeepSeparate:window.A06DuplicateAudit?.list?.().length||0,
      legacyInheritedPending:window.A06LegacyAudit?.stats?.().inheritedPending||0,
      legacyMissingCoordinates:window.A06LegacyAudit?.stats?.().missingCoordinates||0,
      legacyIndependentlyVerified:0,
      geoPinsVerified:window.A06DataQuality?.stats?.().independentlyVerifiedPins||0,
      geoMacrozoneWarnings:window.A06DataQuality?.stats?.().macrozoneWarnings||0,
      commercialOffersPending:window.A06DataQuality?.stats?.().commercialPending||0
    });
  };
  // Virtual union: retain Il Volo records not matched to stable Planner IDs.
  // Legacy records are NEVER written to Planner data or silently converted.
  function unifiedList(){
    const legacy=Array.isArray(window.A06IlVoloPlaces)?window.A06IlVoloPlaces:[];
    const matcher=window.A06PlaceMatcher;
    const unmatched=legacy.filter(p=>matcher?.match?.(p.id)?.status!=='matched');
    return Object.freeze([
      ...DATA.places.map(p=>Object.freeze({id:p.id,name:p.name,zone:p.zone,origin:p.origin,plannerId:p.id,sourceGrade:p.sourceGrade})),
      ...unmatched.map(p=>Object.freeze({id:'legacy:'+p.id,name:p.name,zone:'legacy-salento',origin:'il-volo',plannerId:null,sourceGrade:'legacy-source-review-required', inheritedStatus:window.A06LegacyAudit?.get?.(p.id)?.inheritedStatus||'unknown', coordinateStatus:window.A06LegacyAudit?.get?.(p.id)?.coordinateStatus||'unknown'}))
    ]);
  }
  window.A06PugliaKnowledge=Object.freeze({
    version:'0.4.0',search,answer,stats,findFocus,unifiedList,
    getPlace:id=>placeById.get(id)||null,
    getZone:id=>DATA.zones[id]||null
  });
})();