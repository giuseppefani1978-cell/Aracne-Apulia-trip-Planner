/* A08 — connect A06 knowledge to the existing Trip Planner Leaflet map.
 * No second L.map(), no new backend, no automatic trip edits.
 * The native Planner dialog remains the sole path to confirm additions. */
(() => {
  'use strict';
  const data=window.A06PugliaData;
  if(!data||!Array.isArray(data.places)||window.A08MapBridge)return;
  const byId=new Map(data.places.map(p=>[p.id,p]));
  let selected=[],route=false,overlay=null,lastLabel='',lastResult=null;
  let lastPaintSignature='',lastMap=null,weaveFrame=null,weaveSpider=null,weaveThread=null;
  let mapDrawGeneration=0;
  let weaveRun=0,weaveCleanup=null,routePreviewCount=0;
  const locale=document.documentElement.lang;
  const words={
    fr:{preview:'Suggestion d’Aracne · à confirmer',route:'Tracé indicatif à vol d’oiseau, pas un itinéraire routier',places:'Lieux suggérés par Aracne',clear:'Effacer la sélection',add:'Préparer l’ajout',notAdd:'Ce lieu n’est pas encore relié au programme',empty:'Aucun lieu vérifié à afficher',source:'Sources et accès à vérifier avant visite',replay:'🕷️ Rejouer le fil d’Aracne'},
    it:{preview:'Suggerimento di Aracne · da confermare',route:'Tracciato indicativo in linea d’aria, non un percorso stradale',places:'Luoghi suggeriti da Aracne',clear:'Cancella la selezione',add:'Prepara aggiunta',notAdd:'Luogo non ancora collegato al programma',empty:'Nessun luogo verificato da mostrare',source:'Verifica fonti e accessi prima della visita',replay:'🕷️ Rivedi il filo di Aracne'},
    en:{preview:'Aracne suggestion · not yet confirmed',route:'Straight-line preview, not road directions',places:'Places suggested by Aracne',clear:'Clear selection',add:'Prepare to add',notAdd:'Place not linked to trip planner yet',empty:'No verified places to display',source:'Verify sources and access before visiting',replay:'🕷️ Replay Aracne’s thread'},
    es:{preview:'Propuesta de Aracne · pendiente de confirmar',route:'Trazo en línea recta, no una ruta por carretera',places:'Lugares sugeridos por Aracne',clear:'Borrar selección',add:'Preparar adición',notAdd:'Lugar aún no vinculado al programa',empty:'Comprueba fuentes y accesos antes de la visita',source:'Comprueba las fuentes antes de la visita',replay:'🕷️ Repetir el hilo de Aracne'}
  };
  const t=words[locale]||words.fr;
  const finite=p=>p&&Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&Math.abs(p.lat)<=90&&Math.abs(p.lon)<=180;
  const normalize=s=>String(s||'').normalize('NFD').toLowerCase().replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const km=(a,b)=>{
    const rad=n=>n*Math.PI/180,dl=rad(a.lat-b.lat),dn=rad(a.lon-b.lon);
    const q=Math.sin(dl/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dn/2)**2;
    return 12742*Math.atan2(Math.sqrt(q),Math.sqrt(Math.max(0,1-q)));
  };
  // Ported from Il Volo's weaveAracneRoute animation: the spider advances
  // along the polyline, drawing a coloured thread. Here this is a STRAIGHT
  // geographic preview, not a real street, rail or pedestrian route.
  function stopWeave(){
    weaveRun++;
    if(weaveFrame!==null){window.cancelAnimationFrame?.(weaveFrame);weaveFrame=null;}
    if(weaveCleanup!==null){clearTimeout(weaveCleanup);weaveCleanup=null;}
    if(weaveSpider){overlay?.removeLayer?.(weaveSpider);weaveSpider=null;}
    if(weaveThread){overlay?.removeLayer?.(weaveThread);weaveThread=null;}
  }
  function weaveAracneRoute(points){
    if(points.length<2||!overlay||!window.requestAnimationFrame)return;
    if(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)return;
    const coords=points.map(p=>[p.lat,p.lon]);
    const cumulative=[0];
    for(let i=1;i<points.length;i++)
      cumulative.push(cumulative[i-1]+Math.max(0.0001,km(points[i-1],points[i])));
    const total=cumulative[cumulative.length-1];
    if(total<=0)return;
    const icon=L.divIcon({className:'',html:'<span class="a08-map-spider" aria-hidden="true">🕷️</span>',
      iconSize:[34,34],iconAnchor:[17,17]});
    weaveThread=L.polyline([coords[0]],{color:'#C12684',weight:6,opacity:.96,
      lineCap:'round',lineJoin:'round',interactive:false}).addTo(overlay);
    weaveSpider=L.marker(coords[0],{icon,interactive:false,zIndexOffset:1400}).addTo(overlay);
    routePreviewCount++;
    const run=++weaveRun;
    const started=window.performance?.now?.()??Date.now();
    const duration=Math.max(2200,Math.min(12000,2200+points.length*700));
    const tick=now=>{
      if(run!==weaveRun)return;
      const p=Math.max(0,Math.min(1,((now||Date.now())-started)/duration));
      const target=(1-Math.pow(1-p,2.1))*total;
      let i=1;
      while(i<cumulative.length-1&&cumulative[i]<target)i++;
      const segStart=cumulative[i-1],segLen=Math.max(.0001,cumulative[i]-segStart);
      const t=Math.max(0,Math.min(1,(target-segStart)/segLen));
      const from=coords[i-1],to=coords[i],current=[
        from[0]+(to[0]-from[0])*t,from[1]+(to[1]-from[1])*t
      ];
      weaveThread?.setLatLngs([...coords.slice(0,i),current]);
      weaveSpider?.setLatLng(current);
      if(p<1)weaveFrame=window.requestAnimationFrame(tick);
      else{
        weaveFrame=null;
        weaveCleanup=setTimeout(()=>{
          if(run!==weaveRun)return;
          if(weaveThread)overlay?.removeLayer?.(weaveThread);
          if(weaveSpider)overlay?.removeLayer?.(weaveSpider);
          weaveThread=weaveSpider=null;weaveCleanup=null;
        },600);
      }
    };
    weaveFrame=window.requestAnimationFrame(tick);
  }
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
  // A08.6: a preview is a VIEW switch, never a permanent chat lock.
  // The iOS full-screen assistant hid Planner nav using a06-chat-open.
  function exitChatForMap(){
    const panel=document.getElementById('a06-panel');
    if(panel&&!panel.hidden)panel.querySelector('.a06-x')?.click();
    document.documentElement.classList.remove('a06-chat-open','a08-keyboard-open');
    document.body.classList.remove('a06-chat-open');
    document.documentElement.style.removeProperty('--a06-view-height');
    document.documentElement.style.removeProperty('--a06-view-top');
    if(panel)panel.hidden=true;
    document.getElementById('a06-open')?.setAttribute('aria-expanded','false');
  }
  function goPlannerView(name){
    exitChatForMap();
    const target=document.querySelector('nav button[data-view="'+name+'"]');
    if(target)target.click(); // Planner's native show(view) handler
  }
  const mapSection=document.getElementById('map');
  const summary=document.createElement('aside');
  summary.id='a08-map-preview';summary.hidden=true;summary.setAttribute('aria-live','polite');
  const heading=document.createElement('strong'),description=document.createElement('p');
  const list=document.createElement('div'),clear=document.createElement('button');
  clear.type='button';clear.className='secondary';clear.textContent=t.clear;
  clear.addEventListener('click',()=>{
    stopWeave();selected=[];route=false;lastPaintSignature='';
    overlay?.clearLayers();summary.hidden=true;lastResult=null;
    // Restore the Planner's ordinary POIs when exiting route preview.
    if(typeof originalDraw==='function')originalDraw();
  });
  const replay=document.createElement('button');replay.type='button';replay.className='a08-replay-weave';
  replay.textContent=t.replay;
  replay.addEventListener('click',()=>{if(route&&selected.length>=2){lastPaintSignature='';repaint()}});
  summary.append(heading,description,list,replay,clear);
  mapSection?.querySelector('.sectionHead')?.after(summary);
  if(mapSection&&!summary.parentElement)mapSection.prepend(summary);
  const mapNavigation=document.createElement('div');
  mapNavigation.id='a08-map-navigation';
  mapNavigation.setAttribute('aria-label','Navigation Aracne Lab');
  const tabs=[
    ['prepare',{fr:'‹ Le voyage',it:'‹ Il viaggio',en:'‹ Trip home',es:'‹ El viaje'}],
    ['plan',{fr:'Programme',it:'Programma',en:'Itinerary',es:'Programa'}],
    ['notes',{fr:'Carnet',it:'Taccuino',en:'Notebook',es:'Cuaderno'}]
  ];
  for(const [destination,names] of tabs){
    const button=document.createElement('button');button.type='button';
    button.dataset.a08View=destination;
    button.textContent=names[locale]||names.fr;
    button.addEventListener('click',()=>goPlannerView(destination));
    mapNavigation.append(button);
  }
  const conversation=document.createElement('button');
  conversation.type='button';conversation.dataset.a08View='intelligence';
  conversation.textContent=({fr:'✦ Aracne Intelligence',it:'✦ Aracne Intelligence',en:'✦ Aracne Intelligence',es:'✦ Aracne Intelligence'}[locale]||'✦ Aracne');
  conversation.addEventListener('click',()=>{
    exitChatForMap();document.getElementById('a06-open')?.click();
  });
  mapNavigation.append(conversation);
  mapSection.querySelector('.sectionHead')?.after(mapNavigation);
  if(mapSection&&!mapNavigation.parentElement)mapSection.prepend(mapNavigation);
  function repaint(){
    if(!selected.length){summary.hidden=true;overlay?.clearLayers();return;}
    const points=selected.map(id=>byId.get(id)).filter(finite);
    if(!points.length){summary.hidden=true;return;}
    summary.hidden=false;heading.textContent=t.preview;
    replay.hidden=!(route&&points.length>=2);
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
    // Suppress the full Planner catalogue ONLY while reviewing an itinerary.
    // The original catalogue is restored by Clear; otherwise its 83 pins obscure
    // the route and the spider in the user's iPhone screen recording.
    if(route)layer?.clearLayers?.();
    const signature=JSON.stringify([route,selected,mapDrawGeneration]);
    if(signature===lastPaintSignature&&lastMap===map)return;
    stopWeave();lastPaintSignature=signature;lastMap=map;
    if(!overlay)overlay=L.layerGroup().addTo(map);
    else overlay.clearLayers();
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
    if(route&&points.length>=2){
      L.polyline(points.map(p=>[p.lat,p.lon]),{color:'#6744a8',weight:4,
        opacity:0.85,dashArray:'7 9'}).addTo(overlay);
      weaveAracneRoute(points);
    }
    map.invalidateSize();
    if(points.length===1)map.setView([points[0].lat,points[0].lon],12);
    else map.fitBounds(L.latLngBounds(points.map(p=>[p.lat,p.lon])),
      {padding:[38,38],maxZoom:12});
  }
  function select(ids,isRoute=false){
    const next=[...new Set((Array.isArray(ids)?ids:[]).filter(id=>byId.has(id)&&finite(byId.get(id))))].slice(0,12);
    if(JSON.stringify([selected,route])!==JSON.stringify([next,!!isRoute]))lastPaintSignature='';
    selected=next;route=!!isRoute;lastResult={ids:[...selected],route};lastLabel=route?t.route:t.places;
    if(!selected.length)return {ok:false,reason:'no-valid-place'};
    show('map');
    exitChatForMap();
    // The Planner schedules drawMap() 40ms after show('map'). Draw AFTER it.
    setTimeout(repaint,110);
    return {ok:true,ids:[...selected],mode:route?'indicative-route':'places'};
  }
  const originalDraw=drawMap;
  drawMap=function(){
    const v=originalDraw.apply(this,arguments);
    mapDrawGeneration++;
    if(selected.length)setTimeout(repaint,0);
    return v;
  };
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
      selectedNames:selected.map(id=>byId.get(id)?.name),localOnly:safeTrip().localOnly,
      weaver:route&&selected.length>=2,animationsStarted:routePreviewCount,
      previewFocused:route&&selected.length>=2,
      mapDrawGeneration})
  });
})();