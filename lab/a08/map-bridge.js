/* A08 — connect A06 knowledge to the existing Trip Planner Leaflet map.
 * No second L.map(), no new backend, no automatic trip edits.
 * The native Planner dialog remains the sole path to confirm additions. */
(() => {
  'use strict';
  const data=window.A06PugliaData;
  if(!data||!Array.isArray(data.places)||window.A08MapBridge)return;
  const byId=new Map(data.places.map(p=>[p.id,p]));
  let selected=[],route=false,overlay=null,lastLabel='',lastResult=null;
  const locale=document.documentElement.lang;
  const words={
    fr:{preview:'Suggestion d’Aracne · à confirmer',route:'Tracé indicatif à vol d’oiseau, pas un itinéraire routier',places:'Lieux suggérés par Aracne',clear:'Effacer la sélection',add:'Préparer l’ajout',notAdd:'Ce lieu n’est pas encore relié au programme',empty:'Aucun lieu vérifié à afficher',source:'Sources et accès à vérifier avant visite'},
    it:{preview:'Suggerimento di Aracne · da confermare',route:'Tracciato indicativo in linea d’aria, non un percorso stradale',places:'Luoghi suggeriti da Aracne',clear:'Cancella la selezione',add:'Prepara aggiunta',notAdd:'Luogo non ancora collegato al programma',empty:'Nessun luogo verificato da mostrare',source:'Verifica fonti e accessi prima della visita'},
    en:{preview:'Aracne suggestion · not yet confirmed',route:'Straight-line preview, not road directions',places:'Places suggested by Aracne',clear:'Clear selection',add:'Prepare to add',notAdd:'Place not linked to trip planner yet',empty:'No verified places to display',source:'Verify sources and access before visiting'},
    es:{preview:'Propuesta de Aracne · pendiente de confirmar',route:'Trazo en línea recta, no una ruta por carretera',places:'Lugares sugeridos por Aracne',clear:'Borrar selección',add:'Preparar adición',notAdd:'Lugar aún no vinculado al programa',empty:'Comprueba fuentes y accesos antes de la visita',source:'Comprueba las fuentes antes de la visita'}
  };
  const t=words[locale]||words.fr;
  const finite=p=>p&&Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&Math.abs(p.lat)<=90&&Math.abs(p.lon)<=180;
  const normalize=s=>String(s||'').normalize('NFD').toLowerCase().replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const km=(a,b)=>{
    const rad=n=>n*Math.PI/180,dl=rad(a.lat-b.lat),dn=rad(a.lon-b.lon);
    const q=Math.sin(dl/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dn/2)**2;
    return 12742*Math.atan2(Math.sqrt(q),Math.sqrt(Math.max(0,1-q)));
  };
  function nativeFor(id){
    const original=byId.get(id);
    if(!finite(original))return null;
    // IDs by themselves are NOT enough: require name and geographical agreement.
    const matches=places.filter(p=>finite(p)&&normalize(p.name)===normalize(original.name)&&km(original,p)<1);
    return matches.length===1?matches[0]:null;
  }
  const safeTrip=()=>{
    const session=window.aracneShared?.getSession?.();
    const active=localStorage.getItem('aracne-v5-active')||'local';
    const fingerprint=JSON.stringify([active,state.name,state.days,state.plan]);
    return {role:session?.role||'owner',canEdit:!session||session.role!=='read',
      fingerprint,days:state.days,localOnly:!session};
  };
  function confirmNativeAdd(id,fingerprint){
    const snapshot=safeTrip(),native=nativeFor(id);
    if(!snapshot.localOnly||!snapshot.canEdit||snapshot.fingerprint!==fingerprint||!native)
      return {ok:false,reason:'unavailable-or-stale'};
    // Genuine Planner flow opens the per-day dialog. No write until its Confirm.
    try {show('map');choosePlace(native.id);return {ok:true,opened:true};}
    catch(error){console.warn('[A08] native Planner dialog unavailable',error);return {ok:false,reason:'dialog-unavailable'};}
  }
  const mapSection=document.getElementById('map');
  const summary=document.createElement('aside');
  summary.id='a08-map-preview';summary.hidden=true;summary.setAttribute('aria-live','polite');
  const heading=document.createElement('strong'),description=document.createElement('p');
  const list=document.createElement('div'),clear=document.createElement('button');
  clear.type='button';clear.className='secondary';clear.textContent=t.clear;
  clear.addEventListener('click',()=>{selected=[];route=false;overlay?.clearLayers();summary.hidden=true;lastResult=null;});
  summary.append(heading,description,list,clear);
  mapSection?.querySelector('.sectionHead')?.after(summary);
  if(mapSection&&!summary.parentElement)mapSection.prepend(summary);
  function repaint(){
    if(!selected.length){summary.hidden=true;overlay?.clearLayers();return;}
    const points=selected.map(id=>byId.get(id)).filter(finite);
    if(!points.length){summary.hidden=true;return;}
    summary.hidden=false;heading.textContent=t.preview;
    description.textContent=(route?t.route:t.places)+' · '+t.source;
    list.replaceChildren();
    for(const p of points){
      const row=document.createElement('div');row.className='a08-map-row';
      const name=document.createElement('span');name.textContent=p.name;
      const add=document.createElement('button');add.type='button';
      const native=nativeFor(p.id),fingerprint=safeTrip().fingerprint;
      add.textContent=native?t.add:t.notAdd;add.disabled=!native||!safeTrip().localOnly;
      add.addEventListener('click',()=>confirmNativeAdd(p.id,fingerprint));
      row.append(name,add);list.append(row);
    }
    if(!window.L||!map)return; // Still present text/list without Leaflet.
    if(!overlay)overlay=L.layerGroup().addTo(map);
    overlay.clearLayers();
    points.forEach((p,index)=>{
      const icon=L.divIcon({className:'',html:'<span class="a08-map-pin">'+(index+1)+'</span>',iconSize:[30,30]});
      const marker=L.marker([p.lat,p.lon],{icon}).addTo(overlay);
      const popup=document.createElement('div');
      const title=document.createElement('strong');title.textContent=p.name;
      const info=document.createElement('p');info.textContent=t.source;
      popup.append(title,info);
      const native=nativeFor(p.id);
      if(native){const add=document.createElement('button');add.textContent=t.add;add.type='button';
        const fingerprint=safeTrip().fingerprint;
        add.onclick=()=>confirmNativeAdd(p.id,fingerprint);popup.append(add);}
      marker.bindPopup(popup);
    });
    if(route&&points.length>=2)L.polyline(points.map(p=>[p.lat,p.lon]),
      {color:'#6744a8',weight:4,opacity:0.85,dashArray:'7 9'}).addTo(overlay);
    map.invalidateSize();
    if(points.length===1)map.setView([points[0].lat,points[0].lon],12);
    else map.fitBounds(L.latLngBounds(points.map(p=>[p.lat,p.lon])),
      {padding:[38,38],maxZoom:12});
  }
  function select(ids,isRoute=false){
    selected=[...new Set((Array.isArray(ids)?ids:[]).filter(id=>byId.has(id)&&finite(byId.get(id))))].slice(0,12);
    route=!!isRoute;lastResult={ids:[...selected],route};lastLabel=route?t.route:t.places;
    if(!selected.length)return {ok:false,reason:'no-valid-place'};
    show('map');
    setTimeout(repaint,80);
    return {ok:true,ids:[...selected],mode:route?'indicative-route':'places'};
  }
  const originalDraw=drawMap;
  drawMap=function(){const v=originalDraw.apply(this,arguments);if(selected.length)setTimeout(repaint,0);return v;};
  document.getElementById('search')?.addEventListener('input',()=>{if(selected.length)setTimeout(repaint,0)});
  document.getElementById('zoneFilter')?.addEventListener('change',()=>{if(selected.length)setTimeout(repaint,0)});
  window.A06PlannerCatalog=Object.freeze({
    list:()=>data.places,proposalContext:safeTrip,
    openNativeAdd:confirmNativeAdd
  });
  window.A08MapBridge=Object.freeze({
    showPlaces:ids=>select(ids,false),
    showRoute:ids=>select(ids,true),
    canAdd:id=>Boolean(nativeFor(id)&&safeTrip().localOnly),
    resolveNative:id=>nativeFor(id)?.id||null,
    status:()=>({version:'A08.0',mapReused:true,selected:[...selected],route,
      selectedNames:selected.map(id=>byId.get(id)?.name),localOnly:safeTrip().localOnly})
  });
})();