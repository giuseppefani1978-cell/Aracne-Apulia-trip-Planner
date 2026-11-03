/* A07 — local-only Planner collaboration adapter. Intentionally no network, tokens or invitations. */
(() => {
 'use strict';
 const lang=document.documentElement.lang;
 const copy={
  fr:{status:'LAB A07 · Voyage local de démonstration',share:'Partage désactivé',title:'Simulation locale uniquement',message:'Ce laboratoire reproduit les écrans du Trip Planner, mais aucun lien d’invitation ni synchronisation multi-utilisateurs n’est actif. Toutes les modifications restent dans le navigateur de ce laboratoire.'},
  it:{status:'LAB A07 · Viaggio demo locale',share:'Condivisione disattivata',title:'Solo simulazione locale',message:'Questo laboratorio replica l’interfaccia del Trip Planner ma non attiva inviti o sincronizzazione. Le modifiche rimangono su questo dispositivo.'},
  en:{status:'LAB A07 · Local demonstration trip',share:'Sharing disabled',title:'Local simulation only',message:'This lab reproduces the Trip Planner screens, but invitations and multi-user sync are disabled. Changes stay within this lab browser.'},
  es:{status:'LAB A07 · Viaje de prueba local',share:'Compartir desactivado',title:'Solo simulación local',message:'El laboratorio reproduce las pantallas de Trip Planner, pero no activa invitaciones ni sincronización. Los cambios quedan en este navegador.'}
 };
 const t=copy[lang]||copy.fr;
 const banner=document.createElement('div');
 banner.className='sharedBar';
 banner.innerHTML='<span id="sharedStatus" role="status"></span><button class="secondary" type="button" id="sharedOpen"></button>';
 document.querySelector('main').prepend(banner);
 document.querySelector('#sharedStatus').textContent=t.status;
 document.querySelector('#sharedOpen').textContent=t.share;
 function notice(){
  if(typeof dialog==='function')dialog(t.title,'<p>'+t.message+'</p>');
  else window.alert(t.message);
 }
 const api={
   open:notice,getSession:()=>null,_getRaw:()=>null,_setRaw:()=>{},
   _enable:async()=>{throw Error('lab_local_only')},_shareLink:async()=>{throw Error('lab_local_only')},
   _link:()=>'',_status:()=> 'local',_pending:()=>false,_busy:()=>false,
   _resolve:async()=>{throw Error('lab_local_only')},_rpc:async()=>{throw Error('lab_local_only')},
   _apply:()=>{},_tick:async()=>null,_shared:()=>JSON.parse(JSON.stringify(state)),
   _backup:()=>{},_paint:()=>{},_secret:()=>{throw Error('lab_local_only')}
 };
 window.aracneShared=api;
 document.querySelector('#sharedOpen').onclick=notice;
 document.querySelector('#shareTop').onclick=notice;
 document.querySelector('#sharePlan').onclick=notice;
 window.AracneA07Lab=Object.freeze({mode:'synthetic-local',backend:'none',invitations:false,
  access:'none',tripMode:'solo',version:'A07.0'});
})();