/* V2.3: full-page welcome and one help entry. No trip data is changed. */
(()=>{
'use strict';
const c=Math.max(0,['fr','it','en','es'].indexOf(document.documentElement.lang));
const T={
 skip:['Passer','Salta','Skip','Saltar'],next:['Suivant','Avanti','Next','Siguiente'],back:['Retour','Indietro','Back','Atrás'],start:['Créer mon voyage','Crea il mio viaggio','Start planning','Crear mi viaje'],
 pause:['Pause','Pausa','Pause','Pausa'],play:['Lecture auto','Riproduci','Auto-play','Reproducir'],help:['Aide','Aiuto','Help','Ayuda'],lang:['Langue','Lingua','Language','Idioma'],
 eyebrow:['LES POUILLES, À VOTRE FAÇON','LA PUGLIA, A MODO VOSTRO','PUGLIA, YOUR WAY','PUGLIA, A TU MANERA'],
 demo:['Un aperçu, sans modifier votre voyage','Un esempio, senza modificare il viaggio','A preview, without changing your trip','Un ejemplo, sin modificar tu viaje'],
 t0:['Tout commence par vos envies.','Tutto parte dai vostri desideri.','It starts with what you love.','Todo empieza con tus ganas.'],
 d0:['Entre amis, en couple, en famille ou pour un EVJF : choisissez vos dates, le groupe et vos envies.','Amici, coppia, famiglia o addio al nubilato: scegliete date, gruppo e desideri.','Friends, couples, family or a hen party: choose your dates, group and interests.','Amigos, pareja, familia o despedida: elige fechas, grupo y gustos.'],
 t1:['Vos belles étapes, sur la carte.','Le vostre tappe, sulla mappa.','Find your places on the map.','Tus lugares, en el mapa.'],
 d1:['Filtrez plages, villages, spas ou bateaux. Une fiche vous explique le lieu ; un bouton l’ajoute à votre journée.','Filtrate spiagge, borghi, spa o barche. Una scheda presenta il luogo; un pulsante lo aggiunge alla giornata.','Filter beaches, villages, spas or boats. Read about a place and add it to your day.','Filtra playas, pueblos, spas o barcos. Consulta la ficha y añade el lugar a tu día.'],
 t2:['Du temps pour en profiter.','Il tempo di godervi il viaggio.','Make time to enjoy it.','Tiempo para disfrutar.'],
 d2:['Organisez les journées, ajustez les visites et les trajets. Les temps proposés restent modifiables.','Organizzate le giornate, regolate visite e spostamenti. I tempi proposti sono modificabili.','Arrange your days and adjust visits and journeys. Suggested times are editable.','Organiza los días y ajusta visitas y trayectos. Puedes cambiar los tiempos propuestos.'],
 t3:['Les comptes, tout simplement.','I conti, senza complicazioni.','Keep expenses simple.','Las cuentas, sin complicaciones.'],
 d3:['Indiquez qui a payé et pour qui. L’app calcule les remboursements, sans effectuer de paiement.','Indicate chi ha pagato e per chi. L’app calcola i rimborsi, senza effettuare pagamenti.','Enter who paid and who shared the cost. The app calculates repayments, without making payments.','Indica quién pagó y para quién. La app calcula los reembolsos, sin realizar pagos.'],
 t4:['Gardez vos idées et vos souvenirs.','Conservate idee e ricordi.','Keep your ideas and memories.','Guarda tus ideas y recuerdos.'],
 d4:['Écrivez une note privée ou pour le groupe. Créez une image de story à partager sur vos réseaux.','Scrivete una nota privata o per il gruppo. Create una story da condividere sui social.','Write a private or group note. Create a story image to share on social media.','Escribe una nota privada o para el grupo. Crea una imagen de story para tus redes.'],
 t5:['Un voyage, toute la bande.','Un viaggio, tutto il gruppo.','One trip, the whole group.','Un viaje, todo el grupo.'],
 d5:['Activez « Préparer à plusieurs », puis envoyez le lien de modification à vos amis. Vous retrouvez le même voyage, sans compte à créer.','Attivate « Organizzare insieme » e inviate il link di modifica agli amici. Ritrovate lo stesso viaggio, senza creare account.','Enable “Plan together” and send your friends the editing link. Everyone joins the same trip, without creating an account.','Activa « Organizar en grupo » y envía el enlace de edición. Todos acceden al mismo viaje, sin crear una cuenta.'],
 group:['6 personnes · 3 jours','6 persone · 3 giorni','6 people · 3 days','6 personas · 3 días'],
 beach:['Plage','Spiaggia','Beach','Playa'],spa:['Spa','Spa','Spa','Spa'],boat:['Bateau','Barca','Boat','Barco'],
 visit:['Visite','Visita','Visit','Visita'],travel:['Trajet','Spostamento','Travel','Trayecto'],
 dinner:['Dîner du groupe','Cena di gruppo','Group dinner','Cena del grupo'],private:['Note personnelle','Nota personale','Personal note','Nota personal'],groupnote:['Note pour le groupe','Nota per il gruppo','Group note','Nota del grupo'],
 invite:['Inviter mes amis','Invita gli amici','Invite my friends','Invitar a mis amigos'],
 basics:['Découvrir l’app','Scoprire l’app','Discover the app','Descubrir la app'],sharing:['Partager sans se tromper','Condividere con chiarezza','Sharing explained','Compartir con claridad'],
 q0:['Inviter à modifier','Invitare a modificare','Invite to edit','Invitar a editar'],
 a0:['C’est le lien à envoyer aux amis qui préparent le voyage avec vous. Ils peuvent modifier le programme, les dépenses et les notes du groupe.','È il link per gli amici che organizzano con voi. Possono modificare programma, spese e note del gruppo.','Send this link to friends planning with you. They can edit the plan, expenses and group notes.','Envía este enlace a quienes organizan contigo. Pueden modificar el programa, los gastos y las notas del grupo.'],
 q1:['Inviter en lecture seule','Invitare in sola lettura','Invite to view','Invitar a consultar'],
 a1:['Les invités voient la version à jour, sans pouvoir la modifier. Utile pour transmettre le programme final.','Gli invitati vedono la versione aggiornata senza poterla modificare. Utile per inviare il programma finale.','Guests see the up-to-date trip without editing it. Useful for sending the final plan.','Los invitados ven la versión actualizada sin modificarla. Útil para enviar el programa final.'],
 q2:['Envoyer une copie par WhatsApp','Inviare una copia via WhatsApp','Send a copy by WhatsApp','Enviar una copia por WhatsApp'],
 a2:['Envoie du texte : tout le programme ou une journée. Cette copie ne se met pas à jour et ne permet pas de modifier le voyage.','Invia un testo: tutto il programma o una giornata. La copia non si aggiorna e non consente modifiche al viaggio.','Sends text: the whole plan or one day. This copy does not update or grant editing access.','Envía un texto: todo el programa o un día. La copia no se actualiza ni permite modificar el viaje.'],
 q3:['Mon lien administrateur','Il mio link amministratore','My administrator link','Mi enlace de administrador'],
 a3:['Gardez-le pour vous : il permet de gérer le voyage sur un autre appareil, de remplacer les invitations ou de supprimer le voyage partagé.','Conservatelo per voi: permette di gestire il viaggio da un altro dispositivo, sostituire gli inviti o eliminare il viaggio condiviso.','Keep it private: it lets you manage the trip on another device, replace invitations or delete the shared trip.','Guárdalo para ti: permite gestionar el viaje desde otro dispositivo, sustituir invitaciones o eliminarlo.'],
 q4:['Gestion du voyage','Gestione del viaggio','Manage trip','Gestionar el viaje'],
 a4:['« Révoquer » désactive les anciens liens des invités. « Copie individuelle » déconnecte seulement votre téléphone. « Supprimer » retire le voyage en ligne pour tout le groupe, sans effacer les copies déjà téléchargées.','« Revocare » disattiva i vecchi link degli invitati. « Copia individuale » disconnette solo il vostro telefono. « Eliminare » rimuove il viaggio online per tutti, senza cancellare copie già scaricate.','“Revoke” disables old guest links. “Individual copy” disconnects only your phone. “Delete” removes the online trip for everyone, without erasing downloaded copies.','« Revocar » desactiva los enlaces antiguos. « Copia individual » desconecta solo tu teléfono. « Eliminar » borra el viaje en línea para todos, sin borrar las copias descargadas.'],
 q5:['Si la synchronisation s’arrête','Se la sincronizzazione si ferma','If syncing stops','Si se detiene la sincronización'],
 a5:['Sans connexion, les changements restent sur le téléphone. En cas de modifications simultanées, l’app vous avertit : gardez votre copie de secours avant de charger celle du groupe. Ces options apparaissent seulement si nécessaire.','Senza connessione le modifiche restano sul telefono. In caso di modifiche simultanee l’app avvisa: conservate la copia di sicurezza prima di caricare quella del gruppo. Le opzioni appaiono quando servono.','Offline changes stay on your phone. If edits conflict, the app warns you: keep a backup before loading the group version. Recovery options appear when needed.','Sin conexión, los cambios quedan en el teléfono. Si hay cambios simultáneos, la app avisa: guarda una copia antes de cargar la del grupo. Las opciones aparecen cuando hacen falta.'],
 q6:['Qu’est-ce qui reste privé ?','Cosa resta privato?','What stays private?','¿Qué sigue siendo privado?'],
 a6:['Les notes personnelles restent sur votre téléphone. Les notes du groupe, le programme, les participants et les dépenses sont partagés. Un lien est une clé d’accès : envoyez-le seulement aux personnes invitées.','Le note personali restano sul telefono. Note di gruppo, programma, partecipanti e spese sono condivisi. Il link è una chiave di accesso: inviatelo solo agli invitati.','Personal notes stay on your phone. Group notes, the plan, participants and expenses are shared. A link is an access key: send it only to your guests.','Las notas personales quedan en tu teléfono. Las notas del grupo, el programa, los participantes y los gastos se comparten. El enlace es una llave: envíalo solo a tus invitados.']
};
const t=k=>T[k][c];
// Keep the existing guided walkthrough, replacing only its entry point.
const oldHelp=$('#v21Help');oldHelp.hidden=true;
const introButton=$('#v2Guide'),guideButton=$('#v21StartGuide');
const oldGuide=guideButton.onclick;
guideButton.onclick=()=>{$('#modal').close();oldGuide()};
const helpButton=document.createElement('button');helpButton.id='helpButton';helpButton.className='round';helpButton.textContent='?';helpButton.setAttribute('aria-label',t('help'));$('header').append(helpButton);
window.aracneHelp=(section)=>{
 dialog(t('help'),`<section class="helpBasics"><h3>${t('basics')}</h3><div id="helpActions"></div></section><section><h3>${t('sharing')}</h3>${Array.from({length:7},(_,i)=>`<details class="helpQuestion" ${section==='sharing'&&i===0?'open':''}><summary>${t('q'+i)}</summary><p>${t('a'+i)}</p></details>`).join('')}</section>`);
 $('#helpActions').append(guideButton,introButton);
};
helpButton.onclick=()=>window.aracneHelp();
const welcome=document.createElement('dialog');welcome.id='welcome';welcome.setAttribute('aria-labelledby','welcomeTitle');document.body.append(welcome);
let step=0,timer=null,playing=true,previousFocus;
const stop=()=>{clearTimeout(timer);timer=null};
function finish(){stop();welcome.close();document.body.classList.remove('welcomeOpen');try{localStorage.setItem('aracne-welcome-v23','seen')}catch{}previousFocus?.focus?.()}
function demo(){const items=[
 `<span class="welcomeSymbol">✧</span><strong>${t('group')}</strong><div class="welcomeChips"><span>${t('beach')}</span><span>${t('spa')}</span><span>${t('boat')}</span></div>`,
 `<div class="welcomeMap"><span>◎ Polignano</span><span>◎ Monopoli</span><span>◎ Ostuni</span></div><strong>＋ ${t('spa')} · ${t('beach')}</strong>`,
 `<div class="welcomeSchedule"><span>10:00 <b>${t('visit')}</b> 2 h</span><span>12:00 <b>${t('travel')}</b> 30 min</span><span>12:30 <b>${t('beach')}</b> 2 h</span></div>`,
 `<span class="welcomeSymbol">€</span><strong>${t('dinner')}</strong><div class="welcomeCalculation">120 € <span>÷ 6</span> = 20 €</div>`,
 `<div class="welcomeNotes"><span>♡ ${t('private')}</span><span>↗ ${t('groupnote')}</span></div>`,
 `<div class="welcomePeople"><span>A</span><span>B</span><span>C</span></div><strong>↗ ${t('invite')}</strong>`
 ];return items[step]}
function draw(){
 stop();welcome.innerHTML=`<div class="welcomeLayout"><div class="welcomePhoto"><div class="welcomePhotoLabel">PUGLIA <span>insieme.</span></div></div><div class="welcomeContent"><div class="welcomeTop"><span class="welcomeBrand">ARACNE</span><div><select id="welcomeLanguage" aria-label="${t('lang')}">${$('#language').innerHTML}</select><button type="button" id="welcomeSkip">${t('skip')} ↗</button></div></div><div class="welcomeProgress" aria-label="${step+1} / 6">${Array.from({length:6},(_,i)=>`<span class="${i<=step?'active':''}"></span>`).join('')}</div><div class="welcomeBody"><span class="welcomeEyebrow">${t('eyebrow')} · 0${step+1}</span><h1 id="welcomeTitle">${t('t'+step)}</h1><p>${t('d'+step)}</p><div class="welcomeDemo" aria-hidden="true">${demo()}</div><small>${t('demo')}</small></div><div class="welcomeBottom"><button type="button" class="textBtn" id="welcomeBack" ${step===0?'disabled':''}>${t('back')}</button><button type="button" class="primary" id="welcomeNext">${t(step===5?'start':'next')} →</button><button type="button" class="textBtn" id="welcomePlay">${t(playing?'pause':'play')}</button></div></div></div>`;
 $('#welcomeLanguage').value=document.documentElement.lang;
 $('#welcomeLanguage').onchange=()=>{try{sessionStorage.setItem('aracne-welcome-step',String(step))}catch{}$('#language').value=$('#welcomeLanguage').value;$('#language').onchange()};
 $('#welcomeSkip').onclick=finish;$('#welcomeBack').onclick=()=>{playing=false;step--;draw()};$('#welcomeNext').onclick=()=>{playing=false;if(step===5)finish();else{step++;draw()}};$('#welcomePlay').onclick=()=>{playing=!playing;draw()};
 if(playing&&step<5&&!document.hidden)timer=setTimeout(()=>{step++;draw()},6500);
}
function open(n=0){previousFocus=document.activeElement;$('#modal').close();$('#guideClose')?.click();step=Math.max(0,Math.min(5,Number(n)||0));playing=!matchMedia('(prefers-reduced-motion: reduce)').matches;draw();welcome.showModal();document.body.classList.add('welcomeOpen');$('#welcomeSkip').focus({preventScroll:true})}
welcome.addEventListener('cancel',e=>{e.preventDefault();finish()});welcome.addEventListener('close',()=>{stop();document.body.classList.remove('welcomeOpen')});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(welcome.open)draw()});
introButton.onclick=()=>open();window.aracneIntro={open,close:finish,getSlide:()=>step};
let initial=0;try{initial=Number(sessionStorage.getItem('aracne-welcome-step')||0);sessionStorage.removeItem('aracne-welcome-step')}catch{}
open(initial);
})();
