'use strict';
(() => {
 const langs=['fr','it','en','es'], lang=langs.indexOf(document.documentElement.lang), col=lang<0?0:lang;
 const messages={
 guide:['Le guide en 20 secondes','La guida in 20 secondi','The 20-second guide','La guía en 20 segundos'],
 next:['Suivant','Avanti','Next','Siguiente'], back:['Retour','Indietro','Back','Atrás'], skip:['Passer','Salta','Skip','Omitir'], start:['Créer mon voyage','Crea il mio viaggio','Create my trip','Crear mi viaje'],
 tour1:['Un voyage qui vous ressemble','Un viaggio su misura','A trip that feels like you','Un viaje a vuestra medida'],
 tour1text:['Choisissez votre groupe, vos dates et vos envies. Aracne propose une zone pour poser vos valises.','Scegliete gruppo, date e desideri. Aracne propone una zona dove soggiornare.','Choose your group, dates and interests. Aracne suggests an area to stay.','Elegid grupo, fechas y gustos. Aracne propone una zona donde alojaros.'],
 tour2:['Repérez. Ajoutez. Profitez.','Scopri. Aggiungi. Vivi.','Discover. Add. Enjoy.','Descubre. Añade. Disfruta.'],
 tour2text:['Filtrez plages, spas ou bateaux. Ouvrez une fiche et ajoutez-la au jour de votre choix.','Filtrate spiagge, spa o barche. Aprite una scheda e aggiungetela al giorno scelto.','Filter beaches, spas or boats. Open a place and add it to any day.','Filtrad playas, spas o barcos. Abrid una ficha y añadidla al día elegido.'],
 tour3:['Une journée à votre rythme','Una giornata al vostro ritmo','A day at your pace','Un día a vuestro ritmo'],
 tour3text:['Ajustez les visites et les trajets. Le programme affiche le temps prévu et signale les journées trop chargées.','Modificate visite e spostamenti. Il programma mostra il tempo previsto e segnala giornate troppo piene.','Adjust visits and travel. The planner shows expected time and flags overloaded days.','Ajustad visitas y trayectos. El programa muestra el tiempo previsto y avisa de días demasiado cargados.'],
 tour4:['Partagez le programme','Condividete il programma','Share the plan','Compartid el programa'],
 tour4text:['WhatsApp envoie une copie. Pour modifier ensemble, il faudra activer un espace partagé ; pour l’instant, la sauvegarde reste sur ce téléphone.','WhatsApp invia una copia. Per modificare insieme occorre attivare uno spazio condiviso; per ora il salvataggio resta su questo telefono.','WhatsApp sends a copy. Editing together needs a shared space to be enabled; for now saves stay on this phone.','WhatsApp envía una copia. Editar juntos requiere activar un espacio compartido; por ahora se guarda en este teléfono.'],
 all:['Tout voir','Mostra tutto','Show all','Ver todo'], visits:['Sur place','Sul posto','At the places','En los lugares'], minutes:['min','min','min','min'], travel:['Trajets','Spostamenti','Travel','Trayectos'], total:['Temps occupé','Tempo occupato','Time occupied','Tiempo ocupado'],
 duration:['Durée sur place (min)','Durata sul posto (min)','Visit duration (min)','Duración de visita (min)'], transfer:['Depuis l’étape précédente (min)','Dalla tappa precedente (min)','From the previous stop (min)','Desde la etapa anterior (min)'],
 rough:['Ordre de grandeur voiture, pas un calcul routier ni du trafic en direct. Ajustez avec Google Maps.','Stima indicativa in auto, non un calcolo stradale né traffico in tempo reale. Correggete con Google Maps.','Rough driving allowance, not road routing or live traffic. Adjust using Google Maps.','Estimación orientativa en coche, no cálculo de ruta ni tráfico en directo. Ajustar con Google Maps.'],
 unknown:['Trajet à renseigner','Spostamento da indicare','Travel time needed','Trayecto por completar'],
 manual:['Saisi par vous','Inserito da voi','Entered by you','Introducido por vosotros'], estimate:['Estimation indicative','Stima indicativa','Rough estimate','Estimación orientativa'],
 allowance:['Durée conseillée, ajustable','Durata suggerita, modificabile','Suggested time, editable','Duración sugerida, ajustable'],
 missing:['Total incomplet : renseignez les trajets manquants.','Totale incompleto: inserite gli spostamenti mancanti.','Incomplete total: fill in missing travel times.','Total incompleto: completar los trayectos que faltan.'],
 exclusions:['Entre la première et la dernière étape uniquement. Ajouter hôtel, stationnement, repas et retour si nécessaire.','Solo tra la prima e l’ultima tappa. Aggiungere hotel, parcheggio, pasti e ritorno se necessario.','First to last stop only. Add hotel journeys, parking, meals and the return if needed.','Solo entre la primera y la última parada. Añadir hotel, aparcamiento, comidas y regreso si hace falta.'],
 busy:['Journée chargée : plus de 9 h prévues. Retirez une étape ou raccourcissez une visite.','Giornata piena: oltre 9 ore previste. Togliete una tappa o abbreviate una visita.','Busy day: over 9 hours planned. Remove a stop or shorten a visit.','Día cargado: más de 9 horas previstas. Quitad una parada o acortad una visita.'],
 conflict:['Horaire trop proche de l’étape précédente.','Orario troppo vicino alla tappa precedente.','Start time overlaps the previous stop or journey.','Horario demasiado próximo a la parada anterior.'],
 window:['Amplitude prévue','Arco orario previsto','Planned time span','Franja prevista'], waits:['Temps libre entre étapes','Tempo libero tra le tappe','Free time between stops','Tiempo libre entre paradas'],
 source:['Site / source','Sito / fonte','Website / source','Web / fuente'], pin:['Repère approximatif : confirmez l’entrée ou le rendez-vous avec le prestataire.','Posizione indicativa: confermate ingresso o ritrovo con il fornitore.','Approximate pin: confirm the entrance or meeting point with the provider.','Punto aproximado: confirmar entrada o encuentro con el proveedor.'],
 catalog:['Sélection non exhaustive. Horaires, prix, accès groupe et disponibilités à confirmer sur les sites liés.','Selezione non esaustiva. Orari, prezzi, accesso gruppi e disponibilità da confermare sui siti indicati.','Non-exhaustive selection. Confirm hours, prices, group access and availability on the linked sites.','Selección no exhaustiva. Confirmar horarios, precios, acceso de grupos y disponibilidad en las webs enlazadas.'],
 local:['Sur cet appareil · non synchronisé','Su questo dispositivo · non sincronizzato','On this device · not synced','En este dispositivo · sin sincronizar'],
 group:['Et pour préparer à plusieurs ?','E per organizzare insieme?','Planning together?','¿Y para organizar en grupo?'],
 grouptext:['Un même voyage sur cinq téléphones nécessite un petit stockage en ligne. Le nom « Voyage Geneviève » sert de titre ; un lien secret aléatoire donnera accès au voyage sans compte. Toute personne ayant ce lien pourra y accéder : ne le publiez pas. Cette connexion n’est pas encore activée dans cette V2.','Lo stesso viaggio su cinque telefoni richiede un piccolo archivio online. « Viaggio Geneviève » è il titolo; un link segreto casuale darà accesso senza account. Chiunque abbia il link potrà accedere: non pubblicatelo. La connessione non è ancora attiva in questa V2.','One trip on five phones needs a small online store. “Geneviève’s trip” is the title; a random secret link will grant access without accounts. Anyone with the link can access it: do not publish it. This connection is not yet enabled in V2.','Un viaje en cinco teléfonos necesita un pequeño almacenamiento en línea. « Viaje Geneviève » es el título; un enlace secreto aleatorio dará acceso sin cuentas. Cualquiera con el enlace podrá acceder: no lo publiquéis. Esta conexión aún no está activada en V2.'],
 backup:['Sauvegardes avancées','Backup avanzati','Advanced backups','Copias avanzadas'], reset:['Réinitialiser','Reimposta','Reset','Restablecer'], demo:['APERÇU DU FONCTIONNEMENT','ESEMPIO DI FUNZIONAMENTO','HOW IT WORKS','EJEMPLO DE FUNCIONAMIENTO'],
 formHint:['1. Choisissez le groupe et les envies → 2. Choisissez une zone → 3. Ajustez vos journées.','1. Scegliete gruppo e desideri → 2. Scegliete una zona → 3. Modificate le giornate.','1. Choose group and interests → 2. Pick an area → 3. Adjust your days.','1. Elegid grupo y gustos → 2. Elegid una zona → 3. Ajustad los días.']
 };
 const t=k=>messages[k][col], fmt=n=>`${Math.floor(n/60)} h ${String(Math.round(n%60)).padStart(2,'0')}`;
 const safeMinutes=x=>Number.isInteger(x)&&x>=0&&x<=1440;
 const defaultDuration=p=>p.duration??(p.tags?.includes('spa')?150:p.tags?.includes('beach')?180:p.tags?.includes('boat')?180:120);
 // Stable V1 IDs are preserved. Only new places use descriptive IDs.
 for(const r of window.aracneCatalogV2){places.push({id:r[0],name:r[1],zone:r[2],lat:r[3],lon:r[4],tags:r[5].split(','),duration:r[6],source:r[7],desc:r[8][col]})}
 for(const p of places){if(['p20','p21','p35'].includes(p.id))p.tags=p.tags.filter(x=>x!=='spa');p.duration=defaultDuration(p)}
 zones.find(z=>z.id==='imperiale').tags.push('spa');zones.find(z=>z.id==='murgia').tags.push('beach');
 for(const p of state.plan.flat()){const r=window.aracneCatalogV2.find(r=>r[0]===p.id);if(r&&r[8].includes(p.desc))p.desc=r[8][col]}
 const originalValidate=validate;
 validate=function(s){originalValidate(s);for(const p of s.plan.flat()){
  if(p.duration!==undefined&&(!safeMinutes(p.duration)||p.duration<15))throw Error('Invalid duration');
  if(p.travelMinutes!==undefined&&!safeMinutes(p.travelMinutes))throw Error('Invalid travel time');
  if(p.travelFrom!==undefined&&typeof p.travelFrom!=='string')throw Error('Invalid previous stop');
 }return s};
 // Earlier saves may contain no duration. Never overwrite or discard the trip.
 for(const p of state.plan.flat()){if(!safeMinutes(p.duration)||p.duration<15)delete p.duration;if(!safeMinutes(p.travelMinutes))delete p.travelMinutes}
 const geo=p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon);
 function leg(a,b){
  if(safeMinutes(b.travelMinutes)&&b.travelFrom===a.uid&&b.travelMode===state.transport)return {minutes:b.travelMinutes,manual:true};
  if(state.transport!=='driving'||!geo(a)||!geo(b)||a.id==='p6'||b.id==='p6')return {minutes:null};
  // Explicitly a distance-based allowance, NOT a routing API. No estimate for islands.
  const km=distance(a,b);return {minutes:Math.max(10,Math.ceil((km*1.35/45*60+10)/5)*5),manual:false};
 }
 function totals(arr){
  let visit=0,travel=0,missing=0,wait=0,clock=0,first=null;const conflicts=[];
  arr.forEach((p,i)=>{visit+=defaultDuration(p);const l=i?leg(arr[i-1],p):{minutes:0};if(l.minutes===null)missing++;else{travel+=l.minutes;clock+=l.minutes}
   const time=/^\d{2}:\d{2}$/.test(p.time)?p.time.split(':').map(Number):null, scheduled=time?time[0]*60+time[1]:null;
   if(first===null){first=scheduled??600;clock=first}else if(scheduled!==null){if(scheduled<clock)conflicts.push(i);else{wait+=scheduled-clock;clock=scheduled}}
   clock+=defaultDuration(p);
  });return {visit,travel,missing,wait,occupied:visit+travel,span:clock-(first??0),conflicts};
 }
 // Add timing controls to the existing planner; retain notes, budget and sharing.
 const originalRender=renderPlan;
 renderPlan=function(){originalRender();const arr=state.plan[day]||[],sum=totals(arr);
  let panel=$('#v2Timing');if(!panel){panel=document.createElement('section');panel.id='v2Timing';$('#dayTabs').after(panel)}
  panel.innerHTML=arr.length?`<div class="timeStats"><div><b>${fmt(sum.visit)}</b><span>${t('visits')}</span></div><div><b>${fmt(sum.travel)}${sum.missing?' + ?':''}</b><span>${t('travel')}</span></div><div><b>${fmt(sum.occupied)}${sum.missing?' + ?':''}</b><span>${t('total')}</span></div></div><p>${t('window')}: ${fmt(sum.span)}${sum.missing?' + ?':''} · ${t('waits')}: ${fmt(sum.wait)}</p>${sum.missing?`<p class="v2Warning">${t('missing')}</p>`:''}${sum.span>540?`<p class="v2Warning">${t('busy')}</p>`:''}<p class="small">${t('exclusions')}</p>`:'';
  $$('#itinerary .stepContent').forEach((el,i)=>{const p=arr[i],l=i?leg(arr[i-1],p):null;
   const controls=document.createElement('div');controls.className='v2Durations';
   controls.innerHTML=`<label>${t('duration')}<input type="number" min="15" max="1440" step="15" data-duration="${i}" value="${defaultDuration(p)}"></label>${i?`<label>${t('transfer')}<input type="number" min="0" max="1440" step="1" data-travel="${i}" placeholder="?" value="${l.minutes??''}"></label>`:''}<small>${t('allowance')}${l?' · '+(l.minutes===null?t('unknown'):l.manual?t('manual'):t('estimate')):''}</small>${l&&!l.manual?`<small>${t('rough')}</small>`:''}${sum.conflicts.includes(i)?`<small class="v2Warning">${t('conflict')}</small>`:''}`;
   el.querySelector('.actions').before(controls);
   controls.querySelector('[data-duration]').onchange=e=>{const n=Number(e.target.value);if(!safeMinutes(n)||n<15){e.target.value=defaultDuration(p);return}p.duration=n;save();renderPlan()};
   const input=controls.querySelector('[data-travel]');if(input)input.onchange=e=>{if(e.target.value===''){delete p.travelMinutes;delete p.travelFrom;delete p.travelMode}else{const n=Number(e.target.value);if(!safeMinutes(n))return;p.travelMinutes=n;p.travelFrom=arr[i-1].uid;p.travelMode=state.transport}save();renderPlan()};
  });
 };
 const originalShare=shareText;
 shareText=function(scope,notes){let result=originalShare(scope,notes);const indexes=scope==='all'?Array.from({length:state.days},(_,i)=>i):[Number(scope)];
  result+='\n\n'+indexes.map(d=>{const arr=state.plan[d]||[],s=totals(arr);return dayLabel(d)+' · '+t('total')+': '+fmt(s.occupied)+(s.missing?' + ?':'')+'\n'+arr.map((p,i)=>`${p.name} · ${t('visits')} ${fmt(defaultDuration(p))}${i?' · '+t('travel')+' '+(leg(arr[i-1],p).minutes===null?'?':fmt(leg(arr[i-1],p).minutes)):''}`).join('\n')}).join('\n\n');return result+'\n'+t('rough')+'\n'+t('exclusions')};
 let category='all';const originalFiltered=filtered;
 filtered=function(){return originalFiltered().filter(p=>category==='all'||p.tags.includes(category))};
 const filters=document.createElement('div');filters.className='v2Filters';filters.setAttribute('role','group');filters.setAttribute('aria-label',t('all'));
 filters.innerHTML=[['all',t('all')],...Object.entries(kinds)].map(([id,label])=>`<button class="chip ${id==='all'?'selected':''}" aria-pressed="${id==='all'}" data-category="${id}">${esc(label)}</button>`).join('');$('#mapCanvas').before(filters);
 filters.querySelectorAll('button').forEach(b=>b.onclick=()=>{category=b.dataset.category;filters.querySelectorAll('button').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b))});drawMap()});
 const originalMap=drawMap;
 drawMap=function(){originalMap();const list=filtered();$$('#places .place').forEach((el,i)=>{const p=list[i];const extra=document.createElement('p');extra.className='small';extra.innerHTML=`${t('allowance')} · ${fmt(p.duration)}${p.source?`<br><a href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">${t('source')} ↗</a>`:''}`;el.querySelector('button').before(extra)})};
 $('#zoneFilter').onchange=()=>drawMap();$('#search').oninput=()=>drawMap();
 const catalogNote=document.createElement('p');catalogNote.className='notice';catalogNote.textContent=t('catalog')+' '+t('pin');$('#places').before(catalogNote);
 const originalChoose=choosePlace;
 choosePlace=function(id){originalChoose(id);const p=places.find(p=>p.id===id);const extra=document.createElement('p');extra.className='notice';extra.innerHTML=`${t('allowance')} · ${fmt(p.duration)}<br>${t('pin')}${p.source?`<br><a href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">${t('source')} ↗</a>`:''}`;$('#modalBody').prepend(extra)};
 const originalDialog=shareDialog;
 shareDialog=function(){originalDialog();const info=document.createElement('details');info.className='v2Group';info.innerHTML=`<summary>${t('group')}</summary><p>${t('grouptext')}</p>`;$('#modalBody').append(info)};
 $('#shareTop').onclick=()=>shareDialog();$('#sharePlan').onclick=()=>shareDialog();
 // Keep uncommon backup operations, but remove them from the primary path.
 const foot=$('.asideFoot'),details=document.createElement('details');details.innerHTML=`<summary>${t('backup')}</summary>`;
 details.append($('#export'),$('label.fileLabel'));foot.append(details);
 const hint=document.createElement('p');hint.className='v2Hint';hint.textContent=t('formHint');$('#tripForm').before(hint);
 const topbar=document.createElement('div');topbar.className='v2Topbar';topbar.innerHTML=`<span>V2 · ${t('local')}</span><button class="textBtn" id="v2Guide">${t('guide')} ↗</button>`;$('main').prepend(topbar);
 let timer=null,slide=0,playing=true;
 function stop(){clearTimeout(timer);timer=null}
 function finish(){stop();try{localStorage.setItem('aracne-v2-intro','seen')}catch{}$('#modal').close()}
 function tour(){
  stop();const icons=['✧','◎','◷','↗'];
  dialog(t('guide'),`<div class="v2Tour"><div class="v2TourDots">${icons.map((_,i)=>`<span class="${i===slide?'on':''}"></span>`).join('')}</div><div class="v2Demo" aria-hidden="true"><span class="v2DemoIcon">${icons[slide]}</span><div class="v2DemoCard">${['EVJF · 6 · PUGLIA','SPA → + → DAY 1','2 h + 30 min + 1 h','WHATSAPP → ♡'][slide]}</div><small>${t('demo')}</small></div><h3>${t('tour'+(slide+1))}</h3><p>${t('tour'+(slide+1)+'text')}</p><div class="actions"><button class="textBtn" id="tourSkip">${t('skip')}</button><button class="secondary" id="tourBack" ${slide===0?'disabled':''}>${t('back')}</button><button class="primary" id="tourNext">${slide===3?t('start'):t('next')}</button><button class="round" id="tourPause" aria-label="${playing?'Pause':'Play'}">${playing?'Ⅱ':'▶'}</button></div></div>`);
  $('#tourSkip').onclick=finish;$('#tourBack').onclick=()=>{slide--;tour()};$('#tourNext').onclick=()=>{if(slide===3)finish();else{slide++;tour()}};$('#tourPause').onclick=()=>{playing=!playing;tour()};
  if(playing&&slide<3)timer=setTimeout(()=>{slide++;tour()},5500);
 }
 $('#modal').addEventListener('close',()=>{stop();try{localStorage.setItem('aracne-v2-intro','seen')}catch{}});
 $('#v2Guide').onclick=()=>{slide=0;playing=!matchMedia('(prefers-reduced-motion: reduce)').matches;tour()};
 try{if(!localStorage.getItem('aracne-v2-intro'))$('#v2Guide').click()}catch{}
 if(view==='plan')renderPlan();if(view==='map')drawMap();
 // Pure helpers exposed for regression checks only; no user data is exported.
 window.aracneV2Test={totals,leg,defaultDuration};
})();
