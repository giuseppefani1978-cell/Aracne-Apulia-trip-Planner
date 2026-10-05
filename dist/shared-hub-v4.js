/* Aracne V4 Â· multi-trip hub, server alerts and snapshots. */
'use strict';
(()=>{
 const api=window.aracneShared;if(!api?._getRaw)return;
 const locales=['fr','it','en','es'],c=Math.max(0,locales.indexOf(document.documentElement.lang));
 const copy={
  hub:['Mes voyages','I miei viaggi','My trips','Mis viajes'],current:['Voyage actuel','Viaggio attuale','Current trip','Viaje actual'],newTrip:['Nouveau voyage','Nuovo viaggio','New trip','Nuevo viaje'],rename:['Renommer le voyage','Rinomina il viaggio','Rename trip','Renombrar viaje'],saveVersion:['CrÃ©er une sauvegarde','Crea un salvataggio','Create snapshot','Crear copia'],versions:['Sauvegardes','Salvataggi','Snapshots','Copias'],shareEdit:['Inviter Ã  modifier','Invita a modificare','Invite to edit','Invitar a editar'],shareRead:['Partager en lecture','Condividi in lettura','Share view-only','Compartir lectura'],more:['Plus dâ€™options de partage','Altre opzioni di condivisione','More sharing options','MÃ¡s opciones'],owner:['Organisateur','Organizzatore','Organiser','Organizador'],edit:['Participant Â· modification','Partecipante Â· modifica','Participant Â· edit','Participante Â· ediciÃ³n'],read:['Lecture seule','Sola lettura','View only','Solo lectura'],updated:['Le voyage commun a Ã©tÃ© mis Ã  jour','Il viaggio condiviso Ã¨ stato aggiornato','The shared trip was updated','El viaje compartido se actualizÃ³'],changes:['nouvelles modifications','nuove modifiche','new changes','nuevos cambios'],whatsapp:['Partager lâ€™alerte sur WhatsApp','Condividi avviso su WhatsApp','Share alert on WhatsApp','Compartir alerta por WhatsApp'],switched:['Voyage chargÃ©','Viaggio caricato','Trip loaded','Viaje cargado'],snapshotLabel:['Nom de cette sauvegarde (facultatif)','Nome del salvataggio (facoltativo)','Snapshot label (optional)','Nombre de la copia (opcional)'],saved:['Sauvegarde crÃ©Ã©e','Salvataggio creato','Snapshot created','Copia creada'],restored:['Sauvegarde restaurÃ©e','Salvataggio ripristinato','Snapshot restored','Copia restaurada'],restore:['Restaurer','Ripristina','Restore','Restaurar'],confirmRestore:['Restaurer cette version pour tout le groupe ?','Ripristinare questa versione per tutto il gruppo?','Restore this version for the whole group?','Â¿Restaurar esta versiÃ³n para todo el grupo?'],empty:['Aucun autre voyage enregistrÃ© sur cet appareil.','Nessun altro viaggio salvato su questo dispositivo.','No other trip saved on this device.','No hay otros viajes guardados en este dispositivo.'],server:['RÃ©pertoire organisateur','Archivio organizzatore','Organiser directory','Directorio del organizador']
 };
 const t=k=>copy[k]?.[c]||copy[k]?.[0]||k;
 const esc4=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 const KEY='sb_publishable_heDZcO0ymf5N0SbnaYBT4w_v-ItZm8S';
 const WS_ENDPOINT='https://cpnjdyhsepytphwlenbg.supabase.co/rest/v1/rpc/aracne_workspace';
 const WORKSPACE='aracne-workspace-v4',LIB='aracne-trip-library-v4';
 const legacyOpen=api.open;let lastAlert=[];
 function actorName(){const s=api._getRaw();try{return localStorage.getItem('aracne-collab-name-'+(s?.id||'local'))?.trim()||(s?.role==='owner'?t('owner'):'Participant')}catch{return s?.role==='owner'?t('owner'):'Participant'}}
 window.aracneSharedActor=actorName;
 function loadLibrary(){try{return JSON.parse(localStorage.getItem(LIB)||'[]')}catch{return []}}
 function saveLibrary(rows){try{localStorage.setItem(LIB,JSON.stringify(rows.slice(0,30)))}catch{}}
 function compactSession(s){if(!s?.id)return null;return {id:s.id,token:s.token||null,edit:s.edit||null,read:s.read||null,role:s.role||'read',name:s.name||s.base?.name||state.name||'Voyage',workspaceId:s.workspaceId||null,workspaceToken:s.workspaceToken||null,revision:s.revision||0,lastEvent:s.lastEvent||0,updatedAt:new Date().toISOString()}}
 function upsertLibrary(s=api._getRaw()){const row=compactSession(s);if(!row)return;const rows=loadLibrary().filter(x=>x.id!==row.id);rows.unshift(row);saveLibrary(rows)}
 function savePrivate(id){if(!id)return;try{localStorage.setItem('aracne-private-'+id,JSON.stringify((state.notes||[]).filter(n=>n.privacy==='private')))}catch{}}
 function loadPrivate(id){try{return JSON.parse(localStorage.getItem('aracne-private-'+id)||'[]')}catch{return []}}
 async function post(url,body){const r=await fetch(url,{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw Error('offline');const data=await r.json();if(data.error)throw Error(data.error);return data}
 async function workspaceRpc(action,extra={},credentials=window.aracneWorkspaceV4){return post(WS_ENDPOINT,{p_action:action,p_id:credentials?.id||null,p_token:credentials?.token||null,...extra})}
 async function ensureWorkspace(){let w=null;try{w=JSON.parse(localStorage.getItem(WORKSPACE)||'null')}catch{}if(!w?.id||!w?.token){const token=api._secret(),created=await workspaceRpc('create',{}, {token});w={id:created.id,token};try{localStorage.setItem(WORKSPACE,JSON.stringify(w))}catch{}}window.aracneWorkspaceV4=w;return w}
 async function attachOwner(){const s=api._getRaw();if(!s||s.role!=='owner')return;const w=await ensureWorkspace();if(s.token)try{await workspaceRpc('attach',{p_trip_id:s.id,p_trip_token:s.token},w)}catch{}s.workspaceId=w.id;s.workspaceToken=w.token;api._setRaw(s);upsertLibrary(s)}
 function roleLabel(role){return t(role==='owner'?'owner':role==='edit'?'edit':'read')}
 function tripLink(token,id=api._getRaw()?.id){const u=new URL(location.href);u.search='';u.hash='trip='+id+'&key='+token;return u.href}
 async function shareUrl(url,title){if(navigator.share)try{await navigator.share({title,text:title,url});return}catch(e){if(e?.name==='AbortError')return}try{await navigator.clipboard.writeText(url);toast('Lien copiÃ©')}catch{prompt('Lien',url)}}
 async function ensureInviteSecrets(){const s=api._getRaw();if(!s||s.role!=='owner')return s;if(s.edit&&s.read)return s;const edit=api._secret(),read=api._secret();await api._rpc('rotate',{p_edit:edit,p_read:read});s.edit=edit;s.read=read;api._setRaw(s);upsertLibrary(s);return s}
 function alertBadge(count){let b=document.querySelector('.v4AlertBadge'),j=document.querySelector('nav [data-view="journal"]');if(!j)return;if(!b){b=document.createElement('span');b.className='v4AlertBadge';j.append(b)}b.textContent=String(count);b.hidden=!count}
 window.aracneSharedV4Events=events=>{if(!events?.length)return;lastAlert=events;const me=actorName(),external=events.filter(e=>e.actor!==me);if(!external.length)return;alertBadge(external.length);const e=external.at(-1),msg=(e.actor||'Participant')+' '+(e.action||'a modifiÃ© le voyage')+(e.detail?' Â· '+e.detail:'');toast(t('updated')+' Â· '+msg);const bar=document.querySelector('.sharedBar');if(bar){let a=document.querySelector('#v4AlertAction');if(!a){a=document.createElement('button');a.id='v4AlertAction';a.type='button';a.className='textBtn';bar.append(a)}a.textContent=external.length+' '+t('changes');a.onclick=()=>{alertBadge(0);show('journal')}}};
 async function switchTrip(entry){const current=api._getRaw();savePrivate(current?.id);api._backup();const workspace=window.aracneWorkspaceV4;const candidate={id:entry.id,token:entry.token||null,role:entry.role||'owner',workspaceId:entry.workspaceId||workspace?.id||null,workspaceToken:entry.workspaceToken||workspace?.token||null};const r=await api._rpc('read',{p_since_event:entry.lastEvent||0},candidate);state.notes=loadPrivate(entry.id);candidate.role=r.role;candidate.revision=r.revision;candidate.name=r.name||r.document.name;candidate.lastEvent=Number(r.last_event)||0;candidate.base=JSON.parse(JSON.stringify(r.document));api._setRaw(candidate);api._apply(r.document);upsertLibrary(candidate);document.querySelector('#modal')?.close();toast(t('switched')+' Â· '+candidate.name);show('plan')}
 async function openLibrary(){const local=loadLibrary(),workspace=await ensureWorkspace().catch(()=>null);let server=[];if(workspaaJ]ž^ÜÙ\™\J]ØZ]ÛÜšÜÜXÙTœÊ	Û\Ý	ËßKÛÜšÜÜXÙJJKš\ß×_XØ]ÚßXÛÛœÝžRY[™]ÈX\
ØØ[›X\
O–ÞšYJJNÜÙ\™\‹™›Ü‘XXÚ
OžØÛÛœÝÛXžRY™Ù]
šY
_ßNØžRYœÙ]
šYË‹‹›Û‹‹ž›ÛN‰ÛÝÛ™\‰ËÛÜšÜÜXÙRYÛÜšÜÜXÙOËšYÛÜšÜÜXÙUÚÙ[ŽÛÜšÜÜXÙOËÚÙ[ŸJ_JNØÛÛœÝ›ÝÜÏVË‹‹˜žRY˜[Y\Ê
WKœÛÜ

KŠOO”Ýš[™Ê‹\]YØ]‹\]Y]	ÉÊK›ØØ[PÛÛ\\™JÝš[™ÊK\]YØ]K\]Y]	ÉÊJJNÙX[ÙÊ
	ÚX‰ÊK	Ï]ˆÛ\ÜÏHXœ˜\žRXY‰ÊÙ\ØÍ

	ÜÙ\™\‰ÊJJÉÏÜ]ÛˆÛ\ÜÏHœš[X\žHˆYH™]Õš\»ï"È	ÊÙ\ØÍ

	Û™]Õš\	ÊJJÉÏØ]ÛÙ]]ˆÛ\ÜÏHš\\Ý‰ÊÊ›ÝÜË›[™ÝÜ›ÝÜË›X\
O‰Ï]ÛˆÛ\ÜÏHš\Ø\™	ÊÊšYOOX\K—ÙÙ]˜]Ê
OËšYÉØXÝ]™IÎ‰ÉÊJÉÈˆ]K]š\ZYH‰ÊÙ\ØÍ
šY
JÉÈÜ[‰ÊÙ\ØÍ
›˜[Y_	Õ›ÞXYÙIÊJÉÏØÛX[‰ÊÙ\ØÍ
›ÛSX™[
œ›ÛJJJÉÈ0­ÈÉÊÊ[X™\Šœ™]š\Ú[ÛŠ_
JÉÏÜÛX[ÜÜ[Ü[¸ .ÜÜ[Ø]Û‰ÊKš›Ú[Š	ÉÊN‰Ï]ˆÛ\ÜÏH™[\H‰ÊÙ\ØÍ

	Ù[\IÊJJÉÏÙ]‰ÊJÉÏÙ]‰ÊNÙØÝ[Y[œ]Y\žTÙ[XÝÜŠ	ÈÝ™]Õš\	ÊK›Û˜ÛXÚÏJ
OOžØÛÛœÝÏX\K—ÙÙ]˜]Ê
NÜØ]™Tš]˜]JÏËšY
NØ\K—Ø˜XÚÝ\

NØ\K—ÜÙ]˜]Ê[
NÜÝ]OYY˜][Ê
NÜÝ]Kš›Ý\›˜[V×NÝž^ÛØØ[ÝÜ˜YÙKœÙ]][J	Ø\˜XÛ™K\YÛXK]ŒIË”ÓÓ‹œÝš[™ÚYžJÝ]JJ_XØ]Úß[ØØ][Û‹œ™[ØY

_NÙØÝ[Y[œ]Y\žTÙ[XÝÜ[
	ÖÙ]K]š\ZYIÊK™›Ü‘XXÚ
O˜‹›Û˜ÛXÚÏJ
OOœÝÚ]Úš\
žRY™Ù]
‹™]\Ù]š\Y
JK˜Ø]Ú


OOØ\Ý
	Ò[\ÜÜÚX›HHÚ\™Ù\ˆÙH›ÞXYÙIÊJJ_Bˆ\Þ[˜È[˜Ý[Ûˆ™[˜[YUš\

^ØÛÛœÝÏX\K—ÙÙ]˜]Ê
NÚYŠ\ßËœ›ÛHOOIÛÝÛ™\‰Ê\™]\›ŽØÛÛœÝ˜[YO\›Û\

	Ü™[˜[YIÊKË›˜[Y_Ý]K›˜[Y_	ÉÊNÚYŠ[˜[YOËš[J
J\™]\›ŽØÛÛœÝX]ØZ]\K—ÜœÊ	Ü™[˜[YIËÜÛ˜[YN›˜[YKš[J
KØXÝÜŽ˜XÝÜ“˜[YJ
_JNÜÝ]K›˜[YO\‹›˜[YNÜË›˜[YO\‹›˜[YNÜËœ™]š\Ú[Û\‹œ™]š\Ú[ÛŽÚYŠË˜˜\ÙJ\Ë˜˜\ÙK›˜[YO\‹›˜[YNØ\K—ÜÙ]˜]ÊÊNÝ\Ù\Xœ˜\žJÊNÙš[›Ü›J
NÚYŠšY]ÏOOIÜ[‰Ê\™[™\”[Š
NÝØ\Ý
‹›˜[YJ_Bˆ\Þ[˜È[˜Ý[ÛˆÛ˜\ÚÝ

^ØÛÛœÝÏX\K—ÙÙ]˜]Ê
NÚYŠ\ßËœ›ÛHOOIÛÝÛ™\‰Ê\™]\›ŽØÛÛœÝX™[\›Û\

	ÜÛ˜\ÚÝX™[	ÊK	ÉÊ_[Ø]ØZ]\K—ÜœÊ	ÜÛ˜\ÚÝ	ËÜØXÝÜŽ˜XÝÜ“˜[YJ
KÛX™[›X™[JNÝØ\Ý

	ÜØ]™Y	ÊJ_Bˆ\Þ[˜È[˜Ý[Ûˆ™\œÚ[ÛœÊ
^ØÛÛœÝÏX\K—ÙÙ]˜]Ê
NÚYŠ\Ê\™]\›ŽØÛÛœÝX]ØZ]\K—ÜœÊ	Ý™\œÚ[ÛœÉÊNÙX[ÙÊ
	Ý™\œÚ[ÛœÉÊK	Ï]ˆÛ\ÜÏH™\œÚ[Û“\Ý‰ÊÊ
‹™\œÚ[Ûœß×JK›X\
O‰Ï\XÛO]‰ÊÙ\ØÍ
‹›X™[‹›˜[YJJÉÏØÛX[ˆÉÊÝ‹œ™]š\Ú[ÛŠÉÈ0­È	ÊÙ\ØÍ
™]È]J‹˜Ü™X]YØ]
KÓØØ[TÝš[™ÊØÝ[Y[™ØÝ[Y[[[Y[›[™ÊJJÉÈ0­È	ÊÙ\ØÍ
‹˜XÝÜŸ	ÉÊJÉÏÜÛX[Ù]‰ÊÊËœ›ÛOOOIÛÝÛ™\‰ÏÉÏ]ÛˆÛ\ÜÏHœÙXÛÛ™\žHˆ]K\™\ÝÜ™OH‰ÊÝ‹šY
ÉÈ‰ÊÙ\ØÍ

	Ü™\ÝÜ™IÊJJÉÏØ]Û‰Î‰ÉÊJÉÏØ\XÛO‰ÊKš›Ú[Š	ÉÊ_	Ï]ˆÛ\ÜÏH™[\H‰ÊÙ\ØÍ

	Ù[\IÊJJÉÏÙ]‰ÊJÉÏÙ]‰ÊNÙØÝ[Y[œ]Y\žTÙ[XÝÜ[
	ÖÙ]K\™\ÝÜ™WIÊK™›Ü‘XXÚ
O˜‹›Û˜ÛXÚÏX\Þ[˜Ê
OOžÚYŠXÛÛ™š\›J
	ØÛÛ™š\›T™\ÝÜ™IÊJJ\™]\›ŽØÛÛœÝœX]ØZ]\K—ÜœÊ	Ü™\ÝÜ™IËÜÝ™\œÚ[Û—ÚY“[X™\Š‹™]\Ù]œ™\ÝÜ™JKØXÝÜŽ˜XÝÜ“˜[YJ
_JNÜËœ™]š\Ú[Û\œ‹œ™]š\Ú[ÛŽÜË›˜[YO\œ‹›˜[YNÜË˜˜\ÙOR”ÓÓ‹œ\œÙJ”ÓÓ‹œÝš[™ÚYžJœ‹™ØÝ[Y[
JNØ\K—ÜÙ]˜]ÊÊNÜÝ]K››Ý\Ï[ØYš]˜]JËšY
NØ\K—Ø\Jœ‹™ØÝ[Y[
NÝ\Ù\Xœ˜\žJÊNÙØÝ[Y[œ]Y\žTÙ[XÝÜŠ	ÈÛ[Ù[	ÊK˜ÛÜÙJ
NÝØ\Ý

	Ü™\ÝÜ™Y	ÊJ_J_Bˆ\Þ[˜È[˜Ý[ÛˆÜ[’XŠ
^ØÛÛœÝÏX\K—ÙÙ]˜]Ê
NÝ\Ù\Xœ˜\žJÊNØÛÛœÝØ[“ÝÛ™\\ÏËœ›ÛOOOIÛÝÛ™\‰Ë\Ð[\[\Ý[\›[™ÝÛ][IÏ]ˆÛ\ÜÏHÝ\œ™[Ü[ˆÛ\ÜÏH™^YXœ›ÝÈ‰ÊÙ\ØÍ

	ØÝ\œ™[	ÊJJÉÏÜÜ[Ï‰ÊÙ\ØÍ
ÏË›˜[Y_Ý]K›˜[Y_	Õ›ÞXYÙIÊJÉÏÚÏ‰ÊÙ\ØÍ
ÏÜ›ÛSX™[
Ëœ›ÛJN‰ÓØØ[	ÊJÊÏÉÈ0­ÈÉÊÊËœ™]š\Ú[ÛŸ
N‰ÉÊJÉÏÜÙ]]ˆÛ\ÜÏHX‘ÜšY]ÛˆÛ\ÜÏHœÙXÛÛ™\žHˆYHš\È‰ÊÙ\ØÍ

	ÚX‰ÊJJÉÏØ]Û‰ÎÚYŠØ[“ÝÛ™\ŠZ[
ÏIÏ]ÛˆÛ\ÜÏHœÙXÛÛ™\žHˆYH™[˜[YH‰ÊÙ\ØÍ

	Ü™[˜[YIÊJJÉÏØ]Û]ÛˆÛ\ÜÏHœÙXÛÛ™\žHˆYHÛ˜\ÚÝ‰ÊÙ\ØÍ

	ÜØ]™U™\œÚ[Û‰ÊJJÉÏØ]Û‰ÎÚYŠÊZ[
ÏIÏ]ÛˆÛ\ÜÏHœÙXÛÛ™\žHˆYH™\œÚ[ÛœÈ‰ÊÙ\ØÍ

	Ý™\œÚ[ÛœÉÊJJÉÏØ]Û‰ÎÚYŠØ[“ÝÛ™\ŠZ[
ÏIÏ]ÛˆÛ\ÜÏHœÙXÛÛ™\žHˆYHY]‰ÊÙ\ØÍ

	ÜÚ\™QY]	ÊJJÉÏØ]Û]ÛˆÛ\ÜÏHœÙXÛÛ™\žHˆYH™XY‰ÊÙ\ØÍ

	ÜÚ\™T™XY	ÊJJÉÏØ]Û‰ÎÚYŠ\Ð[\
Z[
ÏIÏ]ÛˆÛ\ÜÏHœÙXÛÛ™\žHˆYHÚ]Ð\‰ÊÙ\ØÍ

	ÝÚ]Ø\	ÊJJÉÏØ]Û‰ÎÚ[
ÏIÏ]ÛˆÛ\ÜÏH^ˆˆYH[Ü™H‰ÊÙ\ØÍ

	Û[Ü™IÊJJÉÏØ]ÛÙ]‰ÎÙX[ÙÊ
	ÚX‰ÊK[
NÙØÝ[Y[œ]Y\žTÙ[XÝÜŠ	ÈÝš\ÉÊK›Û˜ÛXÚÏ[Ü[“Xœ˜\žNÙØÝ[Y[œ]Y\žTÙ[XÝÜŠ	ÈÝ™[˜[YIÊOË˜Y]™[\Ý[™\Š	ØÛXÚÉË

OOœ™[˜[YUš\

K˜Ø]Ú


OOØ\Ý
	Ñ\œ™]\‰ÊJJNÙØÝ[Y[œ]Y\žTÙ[XÝÜŠ	ÈÝÛ˜\ÚÝ	ÊOË˜Y]™[\Ý[™\Š	ØÛXÚÉË

OOœÛ˜\ÚÝ

K˜Ø]Ú


OOØ\Ý
	Ñ\œ™]\‰ÊJJNÙØÝ[Y[œ]Y\žTÙ[XÝÜŠ	ÈÝ™\œÚ[ÛœÉÊOË˜Y]™[\Ý[™\Š	ØÛXÚÉË

OO™\œÚ[ÛœÊ
K˜Ø]Ú


OOØ\Ý
	Ñ\œ™]\‰ÊJJNÙØÝ[Y[œ]Y\žTÙ[XÝÜŠ	ÈÝY]	ÊOË˜Y]™[\Ý[™\Š	ØÛXÚÉË\Þ[˜Ê
OOžØÛÛœÝX]ØZ][œÝ\™R[š]TÙXÜ™]Ê
NÜÚ\™U\›
š\[šÊ™Y]
K›˜[Y_Ý]K›˜[YJ_JNÙØÝ[Y[œ]Y\žTÙ[XÝÜŠ	ÈÝ™XY	ÊOË˜Y]™[\Ý[™\Š	ØÛXÚÉË\Þ[˜Ê
OOžØÛÛœÝX]ØZ][œÝ\™R[š]TÙXÜ™]Ê
NÜÚ\™U\›
š\[šÊœ™XY
K›˜[Y_Ý]K›˜[YJ_JNÙØÝ[Y[œ]Y\žTÙ[XÝÜŠ	ÈÝÚ]Ð\	ÊOË˜Y]™[\Ý[™\Š	ØÛXÚÉË

OOžØÛÛœÝ[™\Ï[\Ý[\œÛXÙJMŠK›X\
OO‰ø (ˆ	ÊÙK˜XÝÜŠÉÎˆ	ÊÙK˜XÝ[ÛŠÊK™]Z[ÉÈ8 %	ÊÙK™]Z[‰ÉÊJKš›Ú[Š	×‰ÊNÛÜ[Š	ÚÎ‹ËÝØK›YKÏÝ^IÊÙ[˜ÛÙUT’PÛÛ\Û™[

ÏË›˜[Y_Ý]K›˜[YJJÉ×‰ÊÛ[™\ÊK	×Ø›[šÉË	Û›ÛÜ[™\‰Ê_JNÙØÝ[Y[œ]Y\žTÙ[XÝÜŠ	ÈÝ[Ü™IÊK›Û˜ÛXÚÏ[YØXÞSÜ[ŸBˆ\K›Ü[[Ü[’XŽÂˆÛÛœÝÜYØÝ[Y[œ]Y\žTÙ[XÝÜŠ	ËœÚ\™Y˜\‰ÊNÚYŠÜ
^ØÛÛœÝš\ÏYØÝ[Y[˜Ü™X]Q[[Y[
	Ø]Û‰ÊNÝš\Ë\OIØ]Û‰ÎÝš\Ë˜Û\ÜÓ˜[YOIÝ^ˆš\ÔÚÜÝ]	ÎÝš\Ë^ÛÛ[]
	ÚX‰ÊNÝš\Ë›Û˜ÛXÚÏ[Ü[“Xœ˜\žNÝÜ˜\[™
š\Ê_Bˆ
\Þ[˜Ê
OOžØÛÛœÝÏX\K—ÙÙ]˜]Ê
NÚYŠÊ^ÜË›˜[YO\Ë›˜[Y_Ë˜˜\ÙOË›˜[Y_Ý]K›˜[YNØ\K—ÜÙ]˜]ÊÊNÝ\Ù\Xœ˜\žJÊNÚYŠËœ›ÛOOOIÛÝÛ™\‰ÊX]ØZ]]XÚÝÛ™\Š
K˜Ø]Ú


OOžßJ_Y[ÙH]ØZ][œÝ\™UÛÜšÜÜXÙJ
K˜Ø]Ú


OOžßJ_JJ
NÂŸJJ
NÂ