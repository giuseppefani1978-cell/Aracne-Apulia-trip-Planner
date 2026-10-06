/* Shared trips: capability links + revision-checked RPC. No user accounts. */
(()=>{
'use strict';
const endpoint='https://cpnjdyhsepytphwlenbg.supabase.co/rest/v1/rpc/aracne_trip_v5';
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
 editShort:['Partager pour modifier','Condividi per modificare','Share to edit','Compartir para editar'],
 readShort:['Partager en lecture seule','Condividi in sola lettura','Share view-only','Compartir en solo lectura'],
 editHint:['Lien de modification : les personnes qui le reçoivent peuvent consulter et modifier le voyage.','Per organizzare insieme: tutti possono modificare il viaggio.','Plan together: everyone invited can update the trip.','Para organizar juntos: cada invitado puede modificar el viaje.'],
 readHint:['Lien de lecture : les personnes qui le reçoivent peuvent consulter le voyage sans le modifier.','Per consultare il programma senza modificarlo.','See the plan without changing it.','Para consultar el programa sin modificarlo.'],
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
texts.setup_required=['Le partage est indisponible : le service V5 doit être installé. Votre voyage reste enregistré sur cet appareil.','Condivisione non disponibile: il servizio V5 deve essere installato. Il viaggio resta salvato su questo dispositivo.','Sharing unavailable: the V5 service must be installed. Your trip stays saved on this device.','Compartir no está disponible: falta instalar el servicio V5. El viaje sigue guardado en este dispositivo.'];
const tr=k=>texts[k][lang],clone=x=>JSON.parse(JSON.stringify(x));
const SESSION='aracne-shared-v1',BACKUP='aracne-shared-backup-v1';
let session=null,base=null,busy=false,dirtyForm=false,status='local',timer;
let conflictRemote=null;
try{session=JSON.parse(localStorage.getItem(SESSION));if(session)base=session.base}catch{}
function shared(){const s=clone(state);delete s.localTripId;s.notes=s.notes.filter(n=>n.privacy==='group');return s}
function canonical(x){if(Array.isArray(x))return x.map(canonical);if(x&&typeof x==='object')return Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])]));return x}
function same(a,b){return JSON.stringify(canonical(a))===JSON.stringify(canonical(b))}
function pending(){return session&&base&&!same(shared(),base)}
function persist(){localStorage.setItem(SESSION,JSON.stringify(session))}
function secret(){return [...crypto.getRandomValues(new Uint8Array(32))].map(n=>n.toString(16).padStart(2,'0')).join('')}
function backup(){localStorage.setItem(BACKUP,JSON.stringify({date:new Date().toISOString(),state:clone(state),session}))}
async function rpc(action,extra={},credentials=session){
 const abort=new AbortController(),deadline=setTimeout(()=>abort.abort(),15000);
 const workspace=credentials?.workspaceId&&credentials?.workspaceToken?{p_workspace_id:credentials.workspaceId,p_workspace_token:credentials.workspaceToken}:{};
 try{const r=await fetch(endpoint,{method:'POST',headers:{apikey:key,'Content-Type':'application/json','x-aracne-beta':(()=>{try{return localStorage.getItem('aracne-beta-token-v1')||''}catch{return ''}})()},body:JSON.stringify({p_action:action,p_id:credentials?.id||null,p_token:credentials?.token||null,...workspace,...extra}),signal:abort.signal});if(!r.ok){let problem={};try{problem=await r.json()}catch{}throw Error(problem.code==='PGRST202'||r.status===404?'setup_required':'offline')}const data=await r.json();if(data.error){const e=Error(data.error);e.revision=data.revision;throw e}return data}finally{clearTimeout(deadline)}
}
function mergeValue(baseValue,localValue,remoteValue){
 const cp=x=>x===undefined?undefined:clone(x);
 if(same(localValue,remoteValue))return cp(localValue);
 if(same(localValue,baseValue))return cp(remoteValue);
 if(same(remoteValue,baseValue))return cp(localValue);
 throw Error('merge_conflict');
}
function mergeObject(baseObj={},localObj={},remoteObj={}){
 const out=clone(remoteObj||{}),keys=new Set([...Object.keys(baseObj||{}),...Object.keys(localObj||{}),...Object.keys(remoteObj||{})]);
 for(const k of keys)out[k]=mergeValue(baseObj?.[k],localObj?.[k],remoteObj?.[k]);
 return out;
}
function mergeById(baseArr=[],localArr=[],remoteArr=[],key='id'){
 const bm=new Map(baseArr.map(x=>[x?.[key],x]).filter(x=>x[0])),lm=new Map(localArr.map(x=>[x?.[key],x]).filter(x=>x[0])),rm=new Map(remoteArr.map(x=>[x?.[key],x]).filter(x=>x[0]));
 const order=remoteArr.map(x=>x?.[key]).filter(Boolean),out=new Map(remoteArr.map(x=>[x?.[key],clone(x)]).filter(x=>x[0]));
 for(const [id,b] of bm){
  const l=lm.get(id),r=rm.get(id);
  if(!l){if(r&&!same(r,b))throw Error('merge_conflict');out.delete(id);continue}
  if(!r){if(!same(l,b))throw Error('merge_conflict');continue}
  out.set(id,mergeObject(b,l,r));
 }
 for(const [id,l] of lm)if(!bm.has(id)){if(rm.has(id))out.set(id,mergeObject({},l,rm.get(id)));else{out.set(id,clone(l));order.push(id)}}
 return [...new Set(order)].filter(id=>out.has(id)).map(id=>out.get(id));
}
function flattenPlan(plan=[]){const rows=[];(plan||[]).forEach((arr,d)=>(arr||[]).forEach((p,i)=>rows.push({...clone(p),__day:d,__index:i})));return rows}
function mergePlan(basePlan=[],localPlan=[],remotePlan=[]){
 const merged=mergeById(flattenPlan(basePlan),flattenPlan(localPlan),flattenPlan(remotePlan),'uid'),max=Math.max(basePlan.length,localPlan.length,remotePlan.length,1),days=Array.from({length:max},()=>[]);
 merged.forEach(p=>{const d=Math.max(0,Math.min(max-1,Number(p.__day)||0));days[d].push(p)});
 days.forEach(arr=>arr.sort((a,b)=>(Number(a.__index)||0)-(Number(b.__index)||0)));
 return days.map(arr=>arr.map(({__day,__index,...p})=>p));
}
function mergeDocs(baseDoc={},localDoc={},remoteDoc={}){
 if(!same(baseDoc.resetEpoch,localDoc.resetEpoch)&&!same(baseDoc,remoteDoc))throw Error('merge_conflict');
 if(!same(baseDoc.resetEpoch,remoteDoc.resetEpoch)&&!same(baseDoc,localDoc))throw Error('merge_conflict');
 const out=clone(remoteDoc),special=new Set(['plan','notes','expenses','journal']);
 for(const k of new Set([...Object.keys(baseDoc),...Object.keys(localDoc),...Object.keys(remoteDoc)]))if(!special.has(k))out[k]=mergeValue(baseDoc[k],localDoc[k],remoteDoc[k]);
 out.plan=mergePlan(baseDoc.plan||[],localDoc.plan||[],remoteDoc.plan||[]);
 out.notes=mergeById(baseDoc.notes||[],localDoc.notes||[],remoteDoc.notes||[],'id');
 out.expenses=mergeById(baseDoc.expenses||[],localDoc.expenses||[],remoteDoc.expenses||[],'id');
 out.journal=mergeById(baseDoc.journal||[],localDoc.journal||[],remoteDoc.journal||[],'id');
 return out;
}
function newJournalEvents(doc,against){
 const known=new Set((against?.journal||[]).map(e=>e.id));
 return (doc?.journal||[]).filter(e=>e?.id&&!known.has(e.id)).map(e=>({actor:e.actor||window.aracneSharedActor?.()||'Participant',action:e.action||'a modifié le voyage',detail:e.detail||''}));
}
function receiveEvents(reply){
 const events=Array.isArray(reply?.events)?reply.events:[];
 if(events.length)window.aracneSharedV4Events?.(events);
 if(session&&Number.isFinite(Number(reply?.last_event)))session.lastEvent=Number(reply.last_event);
}
const banner=document.createElement('div');banner.className='sharedBar';banner.innerHTML='<span role="status" id="sharedStatus"></span><button type="button" class="secondary" id="sharedOpen"></button>';
$('main').prepend(banner);$('#sharedOpen').textContent=tr('open');$('#sharedOpen').onclick=open;
const oldSave=save;
function paint(next){if(next)status=next;window.dispatchEvent(new CustomEvent('aracne:sync-status',{detail:{status}}));$('#sharedStatus').textContent=tr(status)+(session?.role==='read'?' · '+tr('readonly'):'');const old=$('.v2Topbar > span');if(old)old.textContent='V5.1 · '+tr(session?'title':'local');const notice=$('#budget .notice');if(session&&notice)notice.textContent=tr('expense')}
function apply(doc){const privateNotes=state.notes.filter(n=>n.privacy==='private').map(n=>({...n,day:n.day>=doc.days?-1:n.day}));state=validate({...clone(doc),notes:[...doc.notes,...privateNotes]});day=Math.min(day,state.days-1);oldSave();fillForm();if(view==='plan')renderPlan();if(view==='budget')renderBudget();if(view==='notes')renderNotes();if(view==='map')drawMap();dirtyForm=false;window.dispatchEvent(new CustomEvent('aracne:shared-applied',{detail:{revision:session?.revision||0,role:session?.role||null}}))}
save=function(){
 if(session?.role==='read'&&base&&!same(shared(),base)){apply(base);toast(tr('readonly'));return}
 oldSave();dirtyForm=false;
 if(session){paint(pending()?'pending':'synced');clearTimeout(timer);timer=setTimeout(tick,650)}
};
// Editing inputs can precede save(), so never replace a form while it is in use.
document.addEventListener('input',e=>{if(e.target.closest('#tripForm,#stepForm,#editNoteForm,#noteForm,#expenseForm'))dirtyForm=true});
async function tick(){
 if(!session||busy||document.hidden||status==='conflict'||status==='denied')return;
 busy=true;const current=session;
 try{
   if(pending()&&session.role!=='read'){
     const sent=shared(),events=newJournalEvents(sent,base),reply=await rpc('write',{p_document:sent,p_revision:session.revision,p_actor:window.aracneSharedActor?.()||null,p_events:events});
     if(session!==current)return;base=sent;session.base=base;session.revision=reply.revision;if(Number.isFinite(Number(reply.last_event)))session.lastEvent=Number(reply.last_event);persist();paint(pending()?'pending':'synced');
   }else{
     const reply=await rpc('read',{p_since_event:session.lastEvent||0});if(session!==current)return;
     session.role=reply.role;session.name=reply.name||reply.document?.name||session.name;
     if(reply.revision!==session.revision){
       if(dirtyForm||($('#modal').open&&($('#stepForm')||$('#editNoteForm')))||pending()){paint('newer');return}
       validate(reply.document);base=clone(reply.document);session.base=base;session.revision=reply.revision;apply(base);persist();
     }
     receiveEvents(reply);persist();paint(pending()?'pending':'synced');
   }
 }catch(e){
   if(e.message==='conflict'){
     try{
       const reply=await rpc('read',{p_since_event:session.lastEvent||0});if(session!==current)return;conflictRemote=reply;
       if(dirtyForm||($('#modal').open&&($('#stepForm')||$('#editNoteForm')))){paint('conflict');return}
       const local=shared();
       if(same(reply.document,local)){base=clone(reply.document);session.base=base;session.revision=reply.revision;persist();paint('synced')}
       else{
         const merged=mergeDocs(base||reply.document,local,reply.document);validate(merged);
         const events=newJournalEvents(merged,reply.document);
         base=clone(reply.document);session.base=base;session.revision=reply.revision;apply(merged);persist();paint('pending');
         try{
           const wr=await rpc('write',{p_document:merged,p_revision:reply.revision,p_actor:window.aracneSharedActor?.()||null,p_events:events});
           if(session!==current)return;base=clone(merged);session.base=base;session.revision=wr.revision;if(Number.isFinite(Number(wr.last_event)))session.lastEvent=Number(wr.last_event);persist();paint(pending()?'pending':'synced');
         }catch(err){if(session!==current)return;paint(err.message==='denied'?'denied':'newer')}
       }
     }catch(err){if(session!==current)return;paint(err.message==='merge_conflict'?'conflict':'offline')}
   }else if(session===current)paint(e.message==='denied'?'denied':e.message==='setup_required'?'setup_required':'offline');
 }finally{busy=false}
}
let enabling=null;
async function enable(){
 if(session)return session;
 if(enabling)return enabling;
 enabling=(async()=>{
  if(view==='prepare'&&!syncForm())throw Error('invalid');
  const sourceId=localStorage.getItem('aracne-v5-active');const doc=shared();validate(doc);if(!doc.name.trim())throw Error('name_required');backup();
  const token=secret(),edit=secret(),read=secret();
  const result=await rpc('create',{p_document:doc,p_edit:edit,p_read:read,p_name:doc.name,p_actor:window.aracneSharedActor?.()||'Organisateur'},{token});
  // Persist credentials immediately, even if the subsequent read loses connection.
  const created={id:result.id,token,edit,read,role:'owner',revision:result.revision,lastEvent:0,name:doc.name,base:doc};if(sourceId!==localStorage.getItem('aracne-v5-active')){window.aracneV5?.registerShared(sourceId,created,doc);throw Error('trip_changed')}session=created;base=doc;persist();
  window.dispatchEvent(new CustomEvent('aracne:shared-created',{detail:{id:session.id}}));
  const r=await rpc('read');base=clone(r.document);session.base=base;session.revision=r.revision;apply(base);persist();paint('synced');return session;
 })();try{return await enabling}finally{enabling=null}
}
function link(token){const url=new URL(location.href);url.hash='trip='+session.id+'&key='+token;url.search='';return url.href}
async function copyLink(token){const url=link(token);try{await navigator.clipboard.writeText(url);toast(tr('copied'))}catch{const field=document.createElement('textarea');field.readOnly=true;field.value=url;field.rows=4;$('#modalBody').append(field);field.focus();field.select()}}
async function shareCapabilityLink(token,mode){const url=link(token),payload={title:state.name,text:state.name+'\n'+tr(mode==='read'?'readHint':'editHint'),url};if(typeof navigator.share==='function'){try{await navigator.share(payload);return}catch(e){if(e&&e.name==='AbortError')return}}await copyLink(token)}
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
 on('sharedCreate',async()=>{await enable();open()});
 on('sharedEdit',()=>shareCapabilityLink(session.edit,'edit'));on('sharedRead',()=>shareCapabilityLink(session.read,'read'));on('sharedOwner',()=>copyLink(session.token));on('sharedLink',()=>shareCapabilityLink(session.token,session.role==='read'?'read':'edit'));
 on('sharedRotate',async()=>{if(!confirm(tr('rotateAsk')))return;const edit=secret(),read=secret();await rpc('rotate',{p_edit:edit,p_read:read});session.edit=edit;session.read=read;persist();open()});
 on('sharedDelete',async()=>{if(window.aracneV5){await window.aracneV5.remove();return;}if(!confirm(tr('removeAsk')))return;await rpc('delete');disconnect()});
 on('sharedLeave',()=>{if(window.aracneV5){window.aracneV5.detach();return;}if(confirm(tr('leaveAsk')))disconnect()});
 on('sharedRetry',async()=>{paint('pending');await tick();open()});
 on('sharedLoad',async()=>{backup();const r=await rpc('read',{p_since_event:session.lastEvent||0});receiveEvents(r);validate(r.document);base=clone(r.document);session.base=base;session.revision=r.revision;session.role=r.role;session.name=r.name||r.document.name;apply(base);persist();paint('synced');open()});
 on('sharedBackup',()=>{const b=JSON.parse(localStorage.getItem(BACKUP));download(new Blob([JSON.stringify(b.state,null,2)],{type:'application/json'}),'voyage-copie-secours.json')});
}
function disconnect(){session=null;base=null;localStorage.removeItem(SESSION);paint('local');$('#modal').close();location.reload()}
// Keep plain-text sharing separate; its existing WhatsApp buttons still send a snapshot.
const oldShare=shareDialog;
shareDialog=function(){
 dialog(tr('choose'),`<div class="shareChoice">${button('shareTogether','together')}<p>${esc(tr('togetherHint'))}</p></div><div class="shareChoice">${button('shareSnapshot','snapshot')}<p>${esc(tr('snapshotHint'))}</p></div><button type="button" class="textBtn" id="shareExplain">? ${esc(tr('help'))}</button>`);
 $('#shareTogether').onclick=open;$('#shareSnapshot').onclick=()=>{oldShare();$('.v2Group')?.remove()};$('#shareExplain').onclick=()=>window.aracneHelp?.('sharing');
};
window.aracneShared={open,getSession:()=>session?{id:session.id,role:session.role,revision:session.revision,name:session.name||state.name}:null,_getRaw:()=>session,_setRaw:(next)=>{session=next;base=next?.base||null;if(next)localStorage.setItem(SESSION,JSON.stringify(next));else localStorage.removeItem(SESSION);paint(next?'synced':'local')},_enable:enable,_shareLink:shareCapabilityLink,_link:link,_status:()=>status,_pending:pending,_busy:()=>busy,_resolve:async()=>{if(!session)return;backup();const current=session;const reply=await rpc('read');if(session!==current)return;validate(reply.document);base=clone(reply.document);session.base=base;session.revision=reply.revision;apply(base);persist();paint('synced');conflictRemote=null},_rpc:rpc,_apply:apply,_tick:tick,_shared:shared,_backup:backup,_paint:paint,_secret:secret,_mergeDocs:mergeDocs};
$('#shareTop').onclick=()=>shareDialog();$('#sharePlan').onclick=()=>shareDialog();
async function init(){
 const args=new URLSearchParams(location.hash.slice(1));const id=args.get('trip'),token=args.get('key');
 if(id&&token&&/^[a-f0-9-]{36}$/.test(id)&&/^[a-f0-9]{64}$/.test(token)){
   if(session?.id!==id||session?.token!==token){
     if(!confirm(tr('join'))){history.replaceState(null,'',location.pathname+location.search);paint();return}
     try{const candidate={id,token};const r=await rpc('read',{p_since_event:0},candidate);validate(r.document);window.aracneV5?.checkpoint();backup();state.notes=[];session={...candidate,role:r.role,revision:r.revision,lastEvent:Number(r.last_event)||0,name:r.name||r.document.name,base:clone(r.document)};base=session.base;receiveEvents(r);apply(base);persist();paint('synced')}
     catch{paint('denied');return}
   }
   history.replaceState(null,'',location.pathname+location.search);
 }
 paint(session?(pending()?'pending':'synced'):'local');await tick();
}
// Locale scripts translate display defaults before this module runs. Restore the
// canonical saved trip to avoid broadcasting translations as collaborator edits.
if(session){try{const cached=localStorage.getItem('aracne-puglia-v1');if(cached){state=validate(JSON.parse(cached));fillForm()}}catch{}}
document.addEventListener('close',()=>{dirtyForm=false;tick()},true);
paint();init();setInterval(tick,5000);window.addEventListener('online',tick);document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick()});
})();
