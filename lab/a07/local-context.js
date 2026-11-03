/* A07 — V5.1 header appearance without invitation capabilities. */
(() => {
 'use strict';
 const lang=document.documentElement.lang;
 const words={
  fr:{name:'Voyage actif',local:'Local · fictif',invite:'Invitations indisponibles',trips:'Mes voyages',status:'Sans synchronisation'},
  it:{name:'Viaggio attivo',local:'Locale · demo',invite:'Inviti non disponibili',trips:'I miei viaggi',status:'Senza sincronizzazione'},
  en:{name:'Current trip',local:'Local · demo',invite:'Invitations unavailable',trips:'My trips',status:'No synchronization'},
  es:{name:'Viaje actual',local:'Local · prueba',invite:'Invitaciones no disponibles',trips:'Mis viajes',status:'Sin sincronización'}
 };
 const t=words[lang]||words.fr;
 const section=document.createElement('section');section.className='v51Context';
 section.innerHTML='<div class="v51Identity"><small></small><strong id="v51Name"></strong><span id="v51Role"></span><span id="v51Status" role="status"></span></div><div class="v51Buttons"><button class="secondary" type="button" id="v51Invite"></button><button class="secondary" type="button" id="v51Trips"></button></div>';
 document.querySelector('header').after(section);
 section.querySelector('.v51Identity small').textContent=t.name;
 document.querySelector('#v51Role').textContent=t.local;
 document.querySelector('#v51Status').textContent=t.status;
 document.querySelector('#v51Invite').textContent=t.invite;
 document.querySelector('#v51Trips').textContent=t.trips;
 const refresh=()=>{document.querySelector('#v51Name').textContent=state.name||t.local};
 const oldSave=save;save=function(){oldSave();refresh()};
 document.querySelector('#v51Invite').onclick=()=>document.querySelector('#sharedOpen')?.click();
 document.querySelector('#v51Trips').onclick=()=>window.aracneV5?.openTrips?.();
 document.querySelector('#shareTop').onclick=()=>document.querySelector('#sharedOpen')?.click();
 document.querySelector('#sharePlan').onclick=()=>document.querySelector('#sharedOpen')?.click();
 window.addEventListener('aracne:shared-applied',refresh);
 refresh();
})();