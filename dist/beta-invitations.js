/* Personal beta invitations; server enforces quota and ownership. */
(()=>{
'use strict';
const lang=Math.max(0,['fr','it','en','es'].indexOf(document.documentElement.lang));
const copy={
 title:['Inviter au voyage','Invita al viaggio','Invite to trip','Invitar al viaje'],
 hint:['Chaque lien personnel inclut l’accès bêta. Envoyez-le à une seule personne.','Ogni link personale include l’accesso beta. Invialo a una sola persona.','Each personal link includes beta access. Send it to one person only.','Cada enlace personal incluye acceso beta. Envíalo a una sola persona.'],
 quota:['Ces places sont communes à tous vos voyages.','Questi posti valgono per tutti i tuoi viaggi.','These places are shared across all your trips.','Estas plazas son comunes a todos tus viajes.'],
 permission:['Droits sur ce voyage','Permessi sul viaggio','Trip permissions','Permisos del viaje'],
 edit:['Lire et modifier','Leggere e modificare','View and edit','Leer y modificar'],read:['Lecture seule','Sola lettura','View only','Solo lectura'],
 invitation:['Invitation','Invito','Invitation','Invitación'],reserve:['Réserve','Riserva','Reserve','Reserva'],
 available:['Disponible','Disponibile','Available','Disponible'],issued:['Lien préparé','Link preparato','Link prepared','Enlace preparado'],activated:['Activée','Attivato','Activated','Activada'],revoked:['Révoquée','Revocato','Revoked','Revocada'],expired:['Expirée','Scaduto','Expired','Caducada'],
 create:['Préparer le lien','Prepara il link','Prepare link','Preparar enlace'],reuse:['Afficher le lien','Mostra il link','Show link','Mostrar enlace'],cancel:['Annuler et libérer la place','Annulla e libera il posto','Cancel and free the place','Cancelar y liberar plaza'],
 confirm:['Annuler cette invitation ? Le lien envoyé ne fonctionnera plus.','Annullare questo invito? Il link inviato non funzionerà più.','Cancel this invitation? The sent link will stop working.','¿Cancelar esta invitación? El enlace enviado dejará de funcionar.'],
 existing:['Inviter un testeur déjà autorisé','Invita un tester già autorizzato','Invite an existing tester','Invitar a un tester ya autorizado'],
 noQuota:['Aucune place disponible pour de nouveaux testeurs. Demandez un quota à l’administrateur.','Nessun posto per nuovi tester. Chiedi un contingente all’amministratore.','No places for new testers. Ask the administrator for a quota.','No hay plazas para nuevos testers. Pide un cupo al administrador.'],
 noDelegation:['Vous pouvez créer vos voyages, mais votre accès invité ne permet pas d’autoriser de nouveaux bêta-testeurs.','Puoi creare viaggi, ma il tuo accesso ospite non permette di autorizzare nuovi tester.','You can create trips, but guest access cannot admit new beta testers.','Puedes crear viajes, pero el acceso de invitado no permite autorizar nuevos testers.'],
 prepared:['Lien personnel prêt','Link personale pronto','Personal link ready','Enlace personal listo'],
 share:['Partager…','Condividi…','Share…','Compartir…'],clipboard:['Copier le lien','Copia il link','Copy link','Copiar enlace'],copied:['Lien copié','Link copiato','Link copied','Enlace copiado'],
 manual:['Sélectionnez le lien ci-dessous pour le copier.','Seleziona il link qui sotto per copiarlo.','Select the link below to copy it.','Selecciona el enlace de abajo para copiarlo.'],
 expires:['À activer avant le','Da attivare entro il','Activate before','Activar antes del'],
 error:['Impossible de préparer les invitations. Réessayez.','Impossibile preparare gli inviti. Riprova.','Unable to prepare invitations. Try again.','No se pueden preparar las invitaciones. Reintenta.'],
 retry:['Réessayer','Riprova','Retry','Reintentar'],back:['Mes invitations','I miei inviti','My invitations','Mis invitaciones'],
 used:['Invitation déjà activée.','Invito già attivo.','Invitation already activated.','Invitación ya activada.'],
 replace:['Annulez ce lien expiré ou révoqué pour libérer la place.','Annulla il link scaduto o revocato per liberare il posto.','Cancel this expired or revoked link to free the place.','Cancela este enlace caducado o revocado para liberar la plaza.'],
 changed:['Le voyage actif a changé. Rouvrez Inviter.','Il viaggio attivo è cambiato. Riapri Invita.','The active trip changed. Open Invite again.','El viaje activo cambió. Abre Invitar de nuevo.'],
 inviteEdit:["🌴 Bonne nouvelle ! On a accès gratuitement à la bêta de My Apulia Trip · Aracne, une appli pour organiser notre voyage dans les Pouilles !\n\nJe t’invite à rejoindre « {trip} » pour m’aider à choisir les activités, proposer tes idées et préparer notre programme ensemble.\n\n👉 Voici ton invitation personnelle :\n{url}\n\nTon accès bêta est déjà inclus dans le lien : aucun code à recopier. 🐦","🌴 Bella notizia! Abbiamo accesso gratuito alla versione beta di My Apulia Trip · Aracne, un'app per organizzare insieme il nostro viaggio in Puglia!\n\nTi invito a partecipare a « {trip} » per scegliere attività, proporre idee e costruire insieme il nostro programma.\n\n👉 Ecco il tuo invito personale:\n{url}\n\nL'accesso beta è già incluso nel link: non serve copiare alcun codice. 🐦","🌴 Great news! We have free beta access to My Apulia Trip · Aracne, an app to plan our trip to Puglia together!\n\nI'd love you to join « {trip} », suggest activities and help organise our itinerary.\n\n👉 Here's your personal invitation:\n{url}\n\nYour beta access is already included in the link — no code to copy. 🐦","🌴 ¡Buenas noticias! Tenemos acceso gratuito a la beta de My Apulia Trip · Aracne, una app para organizar juntos nuestro viaje a Apulia.\n\nTe invito a participar en « {trip} », proponer actividades y preparar nuestro itinerario juntos.\n\n👉 Aquí tienes tu invitación personal:\n{url}\n\nTu acceso beta ya está incluido en el enlace: no tienes que copiar ningún código. 🐦"],
 inviteRead:["🌴 Bonne nouvelle ! On a accès gratuitement à la bêta de My Apulia Trip · Aracne, une appli pour organiser notre voyage dans les Pouilles !\n\nJe t’invite à découvrir notre voyage « {trip} » et à suivre notre programme commun.\n\n👉 Voici ton invitation personnelle :\n{url}\n\nTon accès bêta est déjà inclus dans le lien : aucun code à recopier. 🐦","🌴 Bella notizia! Abbiamo accesso gratuito alla beta di My Apulia Trip · Aracne, un'app per organizzare il nostro viaggio in Puglia!\n\nTi invito a scoprire il nostro viaggio « {trip} » e a seguire il programma.\n\n👉 Ecco il tuo invito personale:\n{url}\n\nL'accesso beta è già incluso nel link: non serve copiare alcun codice. 🐦","🌴 Great news! We have free beta access to My Apulia Trip · Aracne, an app to plan our trip to Puglia!\n\nYou're invited to discover our trip « {trip} » and follow our shared itinerary.\n\n👉 Here's your personal invitation:\n{url}\n\nYour beta access is already included in the link — no code to copy. 🐦","🌴 ¡Buenas noticias! Tenemos acceso gratuito a la beta de My Apulia Trip · Aracne, una app para organizar nuestro viaje a Apulia.\n\nTe invito a descubrir nuestro viaje « {trip} » y consultar nuestro programa.\n\n👉 Aquí tienes tu invitación personal:\n{url}\n\nTu acceso beta ya está incluido en el enlace: no tienes que copiar ningún código. 🐦"]
};
const t=k=>copy[k][lang],esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let sequence=0;
async function rpc(action,data){const r=await window.aracneBetaAccess.betaRpc(action,data);if(!r?.ok)throw Error(r?.error||'unavailable');return r}
function errorText(e){return t(e.message==='used_code'?'used':e.message==='replace_required'?'replace':'error')}
async function open(session){
 const request=++sequence,api=window.aracneShared,tripName=state.name;
 const valid=()=>request===sequence&&document.querySelector('#modal').open&&api.getSession()?.id===session.id;
 try{
  const result=await rpc('invites_list');if(!valid())return;
  const modes=session.role==='owner'?['edit','read']:[session.role==='read'?'read':'edit'];
  const options=modes.map(m=>'<option value="'+m+'">'+t(m)+'</option>').join('');
  const slots=result.slots||[];
  dialog(t('title'),'<h3>'+esc(tripName)+'</h3><p>'+t('hint')+'</p><label>'+t('permission')+'<select id="betaInviteRole">'+options+'</select></label>'+
   (slots.length?'<p class="small">'+t('quota')+'</p><div class="betaInviteSlots">'+slots.map(s=>'<article class="betaInviteSlot"><strong>'+t(s.reserve?'reserve':'invitation')+' '+s.ordinal+'</strong><span>'+t(s.status)+(s.nickname?' · '+esc(s.nickname):'')+'</span>'+(s.status==='available'||s.status==='issued'?'<button class="secondary" data-beta-issue="'+esc(s.id)+'">'+t(s.status==='available'?'create':'reuse')+'</button>':'')+(['issued','expired','revoked'].includes(s.status)?'<button class="textBtn" data-beta-cancel="'+esc(s.id)+'">'+t('cancel')+'</button>':'')+'</article>').join('')+'</div>':'<p class="notice">'+t(result.organizer?'noQuota':'noDelegation')+'</p>')+
   '<p id="betaInviteStatus" role="status"></p><details><summary>'+t('existing')+'</summary>'+modes.map(m=>'<button class="secondary" data-beta-existing="'+m+'">'+t(m)+'</button>').join('')+'</details>');
  document.querySelectorAll('[data-beta-existing]').forEach(b=>b.onclick=()=>{const mode=b.dataset.betaExisting;api._shareLink(session.role==='owner'?session[mode]:session.token,mode).catch(()=>toast(t('error')))});
  document.querySelectorAll('[data-beta-cancel]').forEach(b=>b.onclick=async()=>{if(!confirm(t('confirm')))return;b.disabled=true;try{await rpc('invites_cancel',{id:b.dataset.betaCancel});if(valid())await open(session)}catch(e){if(valid())document.querySelector('#betaInviteStatus').textContent=errorText(e)}finally{b.disabled=false}});
  document.querySelectorAll('[data-beta-issue]').forEach(b=>b.onclick=async()=>{
   const mode=document.querySelector('#betaInviteRole').value,key=session.role==='owner'?session[mode]:session.token;
   const url=new URL(location.href);url.search='';url.hash=new URLSearchParams({trip:session.id,key}).toString();b.disabled=true;
   try{const r=await rpc('invites_issue',{id:b.dataset.betaIssue,trip_name:tripName});if(!valid()){toast(t('changed'));return}const args=new URLSearchParams(url.hash.slice(1));args.set('beta',r.code);url.hash=args.toString();showLink(session,tripName,url.href,r.expires_at,mode)}catch(e){if(valid())document.querySelector('#betaInviteStatus').textContent=errorText(e)}finally{b.disabled=false}
  });
 }catch(e){if(!valid())return;dialog(t('title'),'<p role="alert">'+errorText(e)+'</p><button id="betaInvitesRetry" class="secondary">'+t('retry')+'</button>');document.querySelector('#betaInvitesRetry').onclick=()=>open(session)}
}
function showLink(session,title,url,expires,mode){
 const message=t(mode==='read'?'inviteRead':'inviteEdit').replace('{trip}',title).replace('{url}',url);
 dialog(t('prepared'),'<h3>'+esc(title)+'</h3><p>'+t('hint')+'</p><p class="small">'+t('expires')+' '+esc(new Date(expires).toLocaleString(document.documentElement.lang))+'</p><div class="betaActions"><a class="primary" target="_blank" rel="noopener noreferrer" href="https://wa.me/?text='+encodeURIComponent(message)+'">WhatsApp</a><button id="betaInviteNative" class="secondary">'+t('share')+'</button><button id="betaInviteCopy" class="secondary">'+t('clipboard')+'</button></div><textarea id="betaInviteLink" readonly rows="4" aria-label="'+t('clipboard')+'">'+esc(url)+'</textarea><p id="betaInviteMessage" role="status"></p><button id="betaInvitesBack" class="textBtn">'+t('back')+'</button>');
 const copy=async()=>{try{if(!navigator.clipboard?.writeText)throw Error('clipboard');await navigator.clipboard.writeText(url);document.querySelector('#betaInviteMessage').textContent=t('copied')}catch{document.querySelector('#betaInviteLink').select();document.querySelector('#betaInviteMessage').textContent=t('manual')}};
 document.querySelector('#betaInviteCopy').onclick=copy;
 document.querySelector('#betaInviteNative').onclick=async()=>{if(!navigator.share){await copy();return}try{await navigator.share({title,text:message})}catch(e){if(e.name!=='AbortError')await copy()}};
 document.querySelector('#betaInvitesBack').onclick=()=>open(session);
}
window.aracneBetaInvitations={open};
})();
