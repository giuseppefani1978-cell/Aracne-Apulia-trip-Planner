/* Shared trips: capability links + revision-checked RPC. No user accounts. */
(()=>{
'use strict';
const endpoint='https://cpnjdyhsepytphwlenbg.supabase.co/rest/v1/rpc/aracne_trip';
const key='sb_publishable_heDZcO0ymf5N0SbnaYBT4w_v-ItZm8S';
const lang=Math.max(0,['fr','it','en','es'].indexOf(document.documentElement.lang));
const texts={
 title:['Voyage partagé','Viaggio condiviso','Shared trip','Viaje compartido'],
 open:['Préparer à plusieurs','Organizzare insieme','Plan together','Organizar en grupo'],
 local:['Voyage sur cet appareil','Viaggio su questo dispositivo','Trip on this device','Viaje en este dispositivo'],
 synced:['À jour avec le groupe','Aggiornato con il gruppo','Up to date with the group','Al día con el grupo'],
 pending:['Modifications à envoyer','Modifiche da inviare','Changes waiting to sync','Cambios pendientes'],
 offline:['Connexion indisponible · copie locale conservée','Connessione non disponibile · copia locale conservata','Connection unavailable · local copy kept','Conexión no disponible · copia local guardada'],
 conflict:['Le groupe a aussi modifié le voyage. Vos changements sont conservés ici.','Anche il gruppo ha modificato il viaggio. Le vostre modifiche restano qui.','The group also edited this trip. Your changes are kept here.','El grupo también ha editado el viaje. Tus cambios se conservan aquí.'],
 newer:['Une mise à jour du groupe attend : terminez votre saisie.','Un aggiornamento del gruppo attende: completate la modifica.','A group update is waiting: finish your edit.','Hay una actualización del grupo: termina tu edición.'],
 denied:['Lien révoqué ou voyage supprimé. Copie locale conservée.','Link revocato o viaggio eliminato. Copia locale conservata.','Link revoked or trip deleted. Local copy kept.','Enlace revocado o viaje eliminado. Copia local guardada.'],
 intro:['Le programme, les participants, les dépenses et les notes « Pour le groupe » seront partagés. Les notes personnelles restent sur votre téléphone. Toute personne possédant un lien pourra utiliser ses droits : partagez-le uniquement avec vos invités.','Programma, partecipanti, spese e note « Per il gruppo » saranno condivisi. Le note personali restano sul telefono. Chi possiede un link può usarne i diritti: inviatelo solo agli invitati.','The plan, participants, expenses and group notes will be shared. Personal notes stay on your phone. Anyone holding a link can use its permissions: send it only to your guests.','El programa, participantes, gastos y notas del grupo se compartirán. Las notas personales quedan en tu teléfono. Quien tenga un enlace puede usar sus permisos: envíalo solo a tus invitados.'],
 create:['Activer le voyage partagé','Attivare il viaggio condiviso','Enable shared trip','Activar viaje compartido'],
 edit:['Copier le lien pour modifier','Copia link per modificare','Copy editing link','Copiar enlace de edición'],
 read:['Copier le lien de lecture','Copia link di sola lettura','Copy viewing link','Copiar enlace de lectura'],
 owner:['Copier mon lien administrateur','Copia il mio link amministratore','Copy my administrator link','Copiar mi enlace de administrador'],
 ownerInfo:['Gardez votre lien administrateur pour retrouver la gestion sur un autre appareil. Ne l’envoyez pas au groupe.','Conservate il link amministratore per gestire il viaggio su un altro dispositivo. Non inviatelo al gruppo.','Keep your administrator link to manage the trip on another device. Do not send it to the group.','Guarda tu enlace de administrador para gestionar el viaje desde otro dispositivo. No lo envíes al grupo.'],
 rotate:['Révoquer les invitations et créer de nouveaux liens','Revocare gli inviti e creare nuovi link','Revoke invitations and create new links','Revocar invitaciones y crear nuevos enlaces'],
 rotateAsk:['Les anciens liens de lecture et modification ne fonctionneront plus. Continuer ?','I vecchi link di lettura e modifica non funzioneranno più. Continuare?','Old viewing and editing links will stop working. Continue?','Los enlaces antiguos dejarán de funcionar. ¿Continuar?'],
 remove:['Supprimer le voyage en ligne','Eliminare il viaggio online','Delete online trip','Eliminar viaje en línea'],
 removeAsk:['Supprimer le voyage pour tout le groupe ? Les copies déjà présentes sur les téléphones ne seront pas effacées.','Eliminare il viaggio per tutto il gruppo? Le copie già sui telefoni non saranno cancellate.','Delete the trip for everyone? Copies already on phones will not be erased.','¿Eliminar el viaje para todo el grupo? Las copias existentes en los teléfonos no se borrarán.'],
 leave:['Continuer avec une copie individuelle','Continuare con una copia individuale','Continue with an individual copy','Continuar con una copia individual'],
 leaveAsk:['Déconnecter ce téléphone du voyage partagé ? Sa copie sera conservée ici.','Disconnettere questo telefono dal viaggio condiviso? La copia resterà qui.','Disconnect this phone from the shared trip? Its copy will remain here.','¿Desconectar este teléfono del viaje? Su copia se conservará aquí.'],
 load:['Garder ma copie puis charger celle du groupe','Conservare la mia copia e caricare quella del gruppo','Keep my copy and load the group version','Guardar mi copia y cargar la del grupo'],
 backup:['Télécharger ma copie de secours','Scaricare la mia copia di sicurezza','Download my backup copy','Descargar mi copia de seguridad'],
 retry:['Réessayer la synchronisation','Riprova la sincronizzazione','Retry sync','Reintentar sincronización'],
 join:['Rejoindre ce voyage partagé ? Le voyage actuel sera gardé en copie de secours sur ce téléphone.','Partecipare al viaggio condiviso? Il viaggio attuale resterà come copia di sicurezza su questo telefono.','Join this shared trip? Your current trip will be kept as a backup on this phone.','¿Unirse a este viaje? El viaje actual quedará como copia de seguridad en este teléfono.'],
 readonly:['Lecture seule · demandez un lien de modification à l’organisateur.','Sola lettura · chiedete un link di modifica all’organizzatore.','View only · ask the organiser for an editing link.','Solo lectura · pide un enlace de edición al organizador.'],
 fail:['Impossible de synchroniser. Votre copie est conservée. Réessayez.','Sincronizzazione non riuscita. La copia è conservata. Riprovate.','Unable to sync. Your copy is kept. Try again.','No se puede sincronizar. Tu copia está guardada. Reintenta.'],
 quota:['Limite de création atteinte. Réessayez plus tard.','Limite di creazione raggiunto. Riprovate più tardi.','Creation limit reached. Try again later.','Límite de creación alcanzado. Reintenta más tarde.'],
 copied:['Lien copié','Link copiato','Link copied','Enlace copiado'],
 saved:['Voyage partagé activé','Viaggio condiviso attivato','Shared trip enabled','Viaje compartido activado'],
 expense:['Dépenses incluses dans le voyage partagé. Aucun paiement bancaire.','Spese incluse nel viaggio condiviso. Nessun pagamento bancario.','Expenses included in the shared trip. No bank payments.','Gastos incluidos en el viaje compartido. Sin pagos bancarios.']
};
Object.assign(texts,{
 editShort:['Inviter à modifier','Invita a modificare','Invite to edit','Invitar a editar'],
 readShort:['Inviter en lecture seule','Invita in sola lettura','Invite to view','Invitar a consultar'],
 editHint:['Pour préparer ensemble : chacun peut ajuster le voyage.','Per organizzare insieme: tutti possono modificare il viaggio.','Plan together: everyone invited can update the trip.','Para organizar juntos: cada invitado puede modificar el viaje.'],
 readHint:['Pour consulter le programme sans le modifier.','Per consultare il programma senza modificarlo.','See the plan without changing it.','Para consultar el programa sin modificarlo.'],
 advanced:['Gestion du voyage','Gestione del viaggio','Manage trip','Gestionar el viaje'],
 repair:['Résoudre un problème','Risolvere un problema','Fix a problem','Resolver un problema'],
 help:['Comprendre le partage','Capire la condivisione','Understand sharing','Entender cómo compartir'],
 choose:['Comment souhaitez-vous partager ?','Come volete condividere?','How would you like to share?','¿Cómo quieres compartir?'],
 together:['Préparer ensemble','Organizzare insieme','Plan together','Organizar juntos'],
 togetherHint:['Un lien privé pour retrouver le même voyage à plusieurs.','Un link privato per lavorare sullo stesso viaggio.','A private link to the same shared trip.','Un enlace privado para trabajar en el mismo viaje.'],
 snapshot:['Envoyer une copie du programme','Inviare una copia del programma','Send a copy of the plan','Enviar una copia del programa'],
 snapshotHint:['Par WhatsApp ou message. La copie ne se met pas à jour.','Via WhatsApp o messaggio. La copia non si aggiorna.','By WhatsApp or message. The copy does not update.','Por WhatsApp o mensaje. La copia no se actualiza.'],
 rotateHint:['Les anciens invités perdent leur accès. Envoyez ensuite les nouveaux liens.','I vecchi invitati perdono accesso. Inviate poi i nuovi link.','Old invitations stop working. Send the new links afterward.','Las invitaciones antiguas dejan de funcionar. Envía los nuevos enlaces.'],
 removeHint:['Retire le voyage partagé pour tout le groupe. Les copies locales restent.','Elimina il viaggio condiviso per tutti. Restano le copie locali.','Removes the shared trip for everyone. Local copies remain.','Elimina el viaje compartido para todos. Las copias locales permanecen.'],
 leaveHint:['Seul ce téléphone quitte le partage et garde une copie individuelle.','Solo questo telefono esce dalla condivisione e conserva una copia.','Only this phone leaves the shared trip and keeps a local copy.','Solo este teléfono abandona el viaje compartido y conserva una copia.'],
 loadHint:['Conserve vos changements dans une copie de secours avant de charger la version du groupe.','Conserva le modifiche in una copia di sicurezza prima di caricare la versione del gruppo.','Backs up your changes before loading the group version.','Guarda tus cambios en una copia antes de cargar la versión del grupo.']
});
const tr=k=>texts[k][lang],clone=x=>JSON.parse(JSON.stringify(x));
const SESSION='aracne-shared-v1',BACKUP='aracne-shared-backup-v1';
let session=null,base=null,busy=false,dirtyForm=false,status='local',timer;
try{session=JSON.parse(localStorage.getItem(SESSION));if(session)base=session.base}catch{}
function shared(){const s=clone(state);s.notes=s.notes.filter(n=>n.privacy==='group');return s}
function canonical(x){if(Array.isArray(x))return x.map(canonical);if(x&&typeof x==='object')return Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])]));return x}
function same(a,b){return JSON.stringify(canonical(a))===JSON.stringify(canonical(b))}
function pending(){return session&&base&&!same(shared(),base)}
function persist(){localStorage.setItem(SESSION,JSON.stringify(session))}
function secret(){return [...crypto.getRandomValues(new Uint8Array(32))].map(n=>n.toString(16).padStart(2,'0')).join('')}
function backup(){localStorage.setItem(BACKUP,JSON.stringify({date:new Date().toISOString(),state:clone(state),session}))}
async function rpc(action,extra={},credentials=session){
 const abort=new AbortController(),deadline=setTimeout(()=>abort.abort(),15000);
 try{const r=await fetch(endpoint,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({p_action:action,p_id:credentials?.id||null,p_token:credentials?.token,...extra}),signal:abort.signal});if(!r.ok)throw Error('offline');const data=await r.json();if(data.error)throw Error(data.error);return data}finally{clearTimeout(deadline)}
}
const banner=document.createElement('div');banner.className='sharedBar';banner.innerHTML='<span role="status" id="sharedStatus"></span><button type="button" class="secondary" id="sharedOpen"></button>';
$('main').prepend(banner);$('#sharedOpen').textContent=tr('open');$('#sharedOpen').onclick=open;
const oldSave=save;
function paint(next){if(next)status=next;$('#sharedStatus').textContent=tr(status)+(session?.role==='read'?' · '+tr('readonly'):'');const old=$('.v2Topbar > span');if(old)old.textContent='V2.3 · '+tr(session?'title':'local');const notice=$('#budget .notice');if(session&&notice)notice.textContent=tr('expense')}
function apply(doc){const privateNotes=state.notes.filter(n=>n.privacy==='private').map(n=>({...n,day:n.day>=doc.days?-1:n.day}));state=validate({...clone(doc),notes:[...doc.notes,...privateNotes]});day=Math.min(day,state.days-1);oldSave();fillForm();if(view==='plan')renderPlan();if(view==='budget')renderBudget();if(view==='notes')renderNotes();if(view==='map')drawMap();dirtyForm=false}
save=function(){
 if(session?.role==='read'&&base&&!same(shared(),base)){apply(base);toast(tr('readonly'));return}
 oldSave();dirtyForm=false;
 if(session){paint(pending()?'pending':'synced');clearTimeout(timer);timer=setTimeout(tick,650)}
};
// Editing inputs can precede save(), so never replace a form while it is in use.
document.addEventListener('input',e=>{if(e.target.closest('main')||e.target.closest('#stepForm,#editNoteForm'))dirtyForm=true});
async function tick(){
 if(!session||busy||document.hidden||status==='conflict'||status==='denied')return;
 busy=true;const current=session;
 try{
   if(pending()&&session.role!=='read'){
     const sent=shared(),reply=await rpc('write',{p_document:sent,p_revision:session.revision});
     if(session!==current)return;base=sent;session.base=base;session.revision=reply.revision;persist();paint(pending()?'pending':'synced');
   }else{
     const reply=await rpc('read');if(session!==current)return;
     session.role=reply.role;
     if(reply.revision!==session.revision){
       if(dirtyForm||$('#modal').open||pending()){paint('newer');return}
       validate(reply.document);base=clone(reply.document);session.base=base;session.revision=reply.revision;apply(base);persist();
     }
     paint(pending()?'pending':'synced');
   }
 }catch(e){
   if(e.message==='conflict'){
     // A lost response may hide a successful previous write. A read verifies it.
     try{const reply=await rpc('read');if(same(reply.document,shared())){base=clone(reply.document);session.base=base;session.revision=reply.revision;persist();paint('synced')}else paint('conflict')}catch{paint('offline')}
   }else paint(e.message==='denied'?'denied':'offline');
 }finally{busy=false}
}
function link(token){const url=new URL(location.href);url.hash='trip='+session.id+'&key='+token;url.search='';return url.href}
async function copyLink(token){const url=link(token);try{await navigator.clipboard.writeText(url);toast(tr('copied'))}catch{const field=document.createElement('textarea');field.readOnly=true;field.value=url;field.rows=4;$('#modalBody').append(field);field.focus();field.select()}}
function button(id,label){return `<button type="button" class="secondary" id="${id}">${esc(tr(label))}</button>`}
function open(){
 const choice=(id,label,hint)=>`<div class="shareChoice">${button(id,label)}<p>${esc(tr(hint))}</p></div>`;
 let html=`<p class="shareIntro">${esc(tr('intro'))}</p><p class="notice">${esc(tr(status))}</p><div class="shareMain">`;
 if(!session)html+=button('sharedCreate','create');
 else if(session.role==='owner'&&session.edit)html+=choice('sharedEdit','editShort','editHint')+choice('sharedRead','readShort','readHint');
 else if(session.role!=='owner')html+=choice('sharedLink',session.role==='read'?'readShort':'editShort',session.role==='read'?'readHint':'editHint');
 html+='</div>';
 if(session){
   if(['offline','pending','conflict','newer','denied'].includes(status)){
     html+=`<details class="shareDetails" open><summary>${esc(tr('repair'))}</summary>`;
     if(status!=='denied')html+=button('sharedRetry','retry');
     if(['conflict','newer'].includes(status))html+=choice('sharedLoad','load','loadHint');
     html+='</details>';
   }
   html+=`<details class="shareDetails"><summary>${esc(tr('advanced'))}</summary>`;
   if(session.role==='owner')html+=choice('sharedOwner','owner','ownerInfo')+choice('sharedRotate','rotate','rotateHint');
   html+=choice('sharedLeave','leave','leaveHint');
   if(localStorage.getItem(BACKUP))html+=button('sharedBackup','backup');
   if(session.role==='owner')html+=choice('sharedDelete','remove','removeHint');
   html+='</details>';
 }
 html+=`<button type="button" class="textBtn" id="sharedHelp">? ${esc(tr('help'))}</button>`;
 dialog(tr('title'),html);
 $('#sharedHelp').onclick=()=>window.aracneHelp?.('sharing');
 const on=(id,fn)=>{const b=$('#'+id);if(b)b.onclick=async()=>{b.disabled=true;try{await fn()}catch(e){toast(tr(e.message==='quota'?'quota':'fail'))}finally{b.disabled=false}}};
 on('sharedCreate',async()=>{
   if(view==='prepare'&&!syncForm())return;
   const doc=shared();validate(doc);backup();
   const token=secret(),edit=secret(),read=secret();
   const result=await rpc('create',{p_document:doc,p_edit:edit,p_read:read},{token});
   session={id:result.id,token,edit,read,role:'owner',revision:result.revision,base:doc};base=doc;persist();paint('synced');toast(tr('saved'));open();
 });
 on('sharedEdit',()=>copyLink(session.edit));on('sharedRead',()=>copyLink(session.read));on('sharedOwner',()=>copyLink(session.token));on('sharedLink',()=>copyLink(session.token));
 on('sharedRotate',async()=>{if(!confirm(tr('rotateAsk')))return;const edit=secret(),read=secret();await rpc('rotate',{p_edit:edit,p_read:read});session.edit=edit;session.read=read;persist();open()});
 on('sharedDelete',async()=>{if(!confirm(tr('removeAsk')))return;await rpc('delete');disconnect()});
 on('sharedLeave',()=>{if(confirm(tr('leaveAsk')))disconnect()});
 on('sharedRetry',async()=>{paint('pending');await tick();open()});
 on('sharedLoad',async()=>{backup();const r=await rpc('read');validate(r.document);base=clone(r.document);session.base=base;session.revision=r.revision;session.role=r.role;apply(base);persist();paint('synced');open()});
 on('sharedBackup',()=>{const b=JSON.parse(localStorage.getItem(BACKUP));download(new Blob([JSON.stringify(b.state,null,2)],{type:'application/json'}),'voyage-copie-secours.json')});
}
function disconnect(){session=null;base=null;localStorage.removeItem(SESSION);paint('local');$('#modal').close();location.reload()}
// Keep plain-text sharing separate; its existing WhatsApp buttons still send a snapshot.
const oldShare=shareDialog;
shareDialog=function(){
 dialog(tr('choose'),`<div class="shareChoice">${button('shareTogether','together')}<p>${esc(tr('togetherHint'))}</p></div><div class="shareChoice">${button('shareSnapshot','snapshot')}<p>${esc(tr('snapshotHint'))}</p></div><button type="button" class="textBtn" id="shareExplain">? ${esc(tr('help'))}</button>`);
 $('#shareTogether').onclick=open;$('#shareSnapshot').onclick=()=>{oldShare();$('.v2Group')?.remove()};$('#shareExplain').onclick=()=>window.aracneHelp?.('sharing');
};
window.aracneShared={open};
$('#shareTop').onclick=()=>shareDialog();$('#sharePlan').onclick=()=>shareDialog();
async function init(){
 const args=new URLSearchParams(location.hash.slice(1));const id=args.get('trip'),token=args.get('key');
 if(id&&token&&/^[a-f0-9-]{36}$/.test(id)&&/^[a-f0-9]{64}$/.test(token)){
   if(session?.id!==id||session?.token!==token){
     if(!confirm(tr('join'))){history.replaceState(null,'',location.pathname+location.search);paint();return}
     try{const candidate={id,token};const r=await rpc('read',{},candidate);validate(r.document);backup();state.notes=[];session={...candidate,role:r.role,revision:r.revision,base:clone(r.document)};base=session.base;apply(base);persist();paint('synced')}
     catch{paint('denied');return}
   }
   history.replaceState(null,'',location.pathname+location.search);
 }
 paint(session?(pending()?'pending':'synced'):'local');await tick();
}
// Locale scripts translate display defaults before this module runs. Restore the
// canonical saved trip to avoid broadcasting translations as collaborator edits.
if(session){try{const cached=localStorage.getItem('aracne-puglia-v1');if(cached){state=validate(JSON.parse(cached));fillForm()}}catch{}}
paint();init();setInterval(tick,5000);window.addEventListener('online',tick);document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick()});
})();
