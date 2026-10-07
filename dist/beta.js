/* Beta 1: isolated presentation layer; no trip or sharing schema changes. */
(()=>{
'use strict';
const col=Math.max(0,['fr','it','en','es'].indexOf(document.documentElement.lang));
const texts={
 beta:['BÊTA 1','BETA 1','BETA 1','BETA 1'],
 testing:['Premiers voyages, premiers retours','Primi viaggi, primi riscontri','First trips, first feedback','Primeros viajes, primeras opiniones'],
 start:['Bien démarrer','Per iniziare','Getting started','Para empezar'],
 intro:['1. Nommez votre voyage et choisissez vos envies. 2. Ajoutez vos lieux depuis la Carte. 3. Invitez vos proches au même voyage.','1. Dai un nome al viaggio e scegli i tuoi interessi. 2. Aggiungi luoghi dalla Mappa. 3. Invita gli amici allo stesso viaggio.','1. Name your trip and choose your interests. 2. Add places from the Map. 3. Invite friends to the same trip.','1. Nombra tu viaje y elige tus intereses. 2. Añade lugares desde el Mapa. 3. Invita a tus amigos al mismo viaje.'],
 map:['Explorer les lieux','Esplora i luoghi','Explore places','Explorar lugares'],
 help:['Aide et partage','Aiuto e condivisione','Help and sharing','Ayuda y compartir'],
 sound:['Petits sons','Piccoli suoni','Soft sounds','Sonidos suaves'],
 on:['Activés','Attivi','On','Activados'],off:['Désactivés','Disattivati','Off','Desactivados'],
 feedback:['Préparer un retour','Prepara un riscontro','Prepare feedback','Preparar una opinión'],
 hint:['Décrivez ce qui vous a plu ou bloqué. Copiez ce texte et envoyez-le à la personne qui vous a invité.','Descrivi cosa ti è piaciuto o ti ha bloccato. Copia il testo e invialo a chi ti ha invitato.','Describe what worked or confused you. Copy the text and send it to the person who invited you.','Describe lo que te gustó o te bloqueó. Copia el texto y envíalo a quien te invitó.'],
 placeholder:['Ce que je voulais faire :\nCe qui s’est passé :\nCe que j’aimerais améliorer :','Cosa volevo fare:\nCosa è successo:\nCosa migliorerei:','What I wanted to do:\nWhat happened:\nWhat I would improve:','Qué quería hacer:\nQué pasó:\nQué mejoraría:'],
 copy:['Copier mon retour','Copia il riscontro','Copy feedback','Copiar opinión'],copied:['Retour copié','Riscontro copiato','Feedback copied','Opinión copiada'],manual:['Sélectionnez et copiez le texte ci-dessus.','Seleziona e copia il testo qui sopra.','Select and copy the text above.','Selecciona y copia el texto de arriba.'],
 reset:['Effacer les filtres','Azzera i filtri','Clear filters','Borrar filtros'],
 catalog:['Spas et nature : sélection enrichie. Vérifiez accès, réservation et conditions sur la fiche du lieu.','Spa e natura: selezione ampliata. Verifica accesso, prenotazioni e condizioni nella scheda.','More spas and nature spots. Check access, booking and conditions on each place’s page.','Más spas y naturaleza. Consulta acceso, reservas y condiciones en cada ficha.']
};
texts.testSound=['Tester le son','Prova il suono','Test sound','Probar sonido'];
texts.enableSound=['Activer le son','Attiva il suono','Enable sound','Activar sonido'];
texts.soundBlocked=['Le son n’a pas pu démarrer. Touchez à nouveau « Tester le son ».','Il suono non è partito. Tocca di nuovo « Prova il suono ».','Audio could not start. Tap Test sound again.','El sonido no pudo iniciarse. Pulsa Probar sonido de nuevo.'];
const t=k=>texts[k][col];let sounds=false,context;
try{sounds=localStorage.getItem('aracne-beta-sounds')==='on'}catch{}
// iOS treats the default Web Audio session as ambient (silent-switch muted).
// Request media playback only after the user explicitly enables sound.
const melodies={tap:[520],add:[523,659,784],ready:[523,659,784,1047],done:[523,659,784,1047,784,1047]};
const mediaSounds=new Map();
function playbackSession(){try{if(navigator.audioSession){navigator.audioSession.type='playback';return navigator.audioSession.type==='playback'}}catch{}return false}
function mediaTone(kind,failed){
 // Native media is also used on older iOS without the Audio Session API.
 // Generate a short PCM WAV locally: no network request or silent audio loop.
 try{
  let audio=mediaSounds.get(kind);
  if(!audio){
   const notes=melodies[kind]||melodies.tap,rate=22050,d=kind==='tap'?.11:.34;
   const count=Math.ceil(((notes.length-1)*.16+d)*rate),bytes=new Uint8Array(44+count*2),v=new DataView(bytes.buffer);
   const ascii=(offset,text)=>{for(let i=0;i<text.length;i++)bytes[offset+i]=text.charCodeAt(i)};
   ascii(0,'RIFF');v.setUint32(4,36+count*2,true);ascii(8,'WAVE');ascii(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,rate,true);v.setUint32(28,rate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);ascii(36,'data');v.setUint32(40,count*2,true);
   for(let n=0;n<count;n++){let sample=0;notes.forEach((hz,i)=>{const t=n/rate-i*.16;if(t>=0&&t<d){const envelope=Math.min(t/.015,1)*Math.pow(1-t/d,2);sample+=Math.sin(2*Math.PI*hz*t)*envelope*(kind==='tap'?.18:.4)}});v.setInt16(44+n*2,Math.round(Math.max(-1,Math.min(1,sample))*32767),true)}
   let binary='';for(const byte of bytes)binary+=String.fromCharCode(byte);
   audio=new window.Audio('data:audio/wav;base64,'+btoa(binary));audio.preload='auto';mediaSounds.set(kind,audio);
  }
  for(const other of mediaSounds.values())if(other!==audio)other.pause();
  audio.pause();audio.currentTime=0;audio.muted=false;audio.volume=1;
  // play() runs inside the original click, before any async boundary.
  const result=audio.play();if(result?.catch)result.catch(failed);
 }catch{failed()}
}
function tone(kind='tap',report=false){
 const failed=()=>{if(report)toast(t('soundBlocked'))};
 if(!sounds||document.hidden)return;
 try{const playback=playbackSession(),Audio=window.AudioContext||window.webkitAudioContext;if(!playback||!Audio){mediaTone(kind,failed);return}if(!context||context.state==='closed')context=new Audio();
 const play=()=>{if(!sounds||document.hidden)return;if(context.state!=='running'){failed();return}const notes=melodies[kind]||melodies.tap;
 notes.forEach((hz,i)=>{const o=context.createOscillator(),g=context.createGain(),now=context.currentTime+.015+i*.16,d=kind==='tap'?.11:.34;o.type='triangle';o.frequency.setValueAtTime(hz,now);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(kind==='tap'?.065:.16,now+.015);g.gain.setValueAtTime(kind==='tap'?.045:.12,now+(kind==='tap'?.04:.14));g.gain.exponentialRampToValueAtTime(.0001,now+d);o.connect(g);g.connect(context.destination);o.onended=()=>{o.disconnect();g.disconnect()};o.start(now);o.stop(now+d+.02)})};
 if(context.state!=='running')context.resume().then(play).catch(failed);else play();
 }catch{failed()}
}
function soundLabel(button){button.textContent=sounds?'🔊 '+t('sound')+' · '+t('on'):'🔇 '+t('enableSound');button.setAttribute('aria-pressed',String(sounds))}
function toggleSound(){sounds=!sounds;try{localStorage.setItem('aracne-beta-sounds',sounds?'on':'off')}catch{}document.querySelectorAll('#betaSound,#betaSoundQuick').forEach(soundLabel);if(sounds)tone('add');else{for(const audio of mediaSounds.values())audio.pause();if(context?.state==='running')context.suspend().catch(()=>{})}}
function bindSound(){const b=document.querySelector('#betaSound');if(!b)return;soundLabel(b);b.onclick=toggleSound}
function feedback(){dialog(t('feedback'),`<p>${t('hint')}</p><label>${t('feedback')}<textarea id="betaFeedback" rows="8" maxlength="4000"></textarea></label><button class="primary" id="betaCopy">${t('copy')}</button><p class="small" id="betaCopyStatus" role="status"></p>`);const input=document.querySelector('#betaFeedback');input.value='Aracne · Beta 1 · '+document.documentElement.lang+'\n\n'+t('placeholder');document.querySelector('#betaCopy').onclick=async()=>{try{if(!navigator.clipboard?.writeText)throw Error('clipboard');await navigator.clipboard.writeText(input.value);document.querySelector('#betaCopyStatus').textContent=t('copied')}catch{input.focus();input.select();document.querySelector('#betaCopyStatus').textContent=t('manual')}}}
function open(){dialog(t('beta')+' · '+t('start'),`<p>${t('intro')}</p><div class="betaActions"><button class="primary" id="betaMap">${t('map')}</button><button class="secondary" id="betaHelp">${t('help')}</button><button class="secondary" id="betaSound"></button><button class="secondary" id="betaFeedbackOpen">${t('feedback')}</button></div><p class="small">${t('catalog')}</p>`);document.querySelector('#betaMap').onclick=()=>{document.querySelector('#modal').close();show('map')};document.querySelector('#betaHelp').onclick=()=>window.aracneHelp();document.querySelector('#betaFeedbackOpen').onclick=feedback;bindSound()}
const banner=document.createElement('div');banner.className='betaBanner';banner.innerHTML=`<strong>${t('beta')}</strong><span>${t('testing')}</span><button type="button" class="textBtn" id="betaStart">${t('start')} ↗</button>`;document.querySelector('header').after(banner);document.querySelector('#betaStart').onclick=open;
const originalHelp=window.aracneHelp;window.aracneHelp=()=>{originalHelp();const box=document.createElement('div');box.className='betaActions';box.innerHTML=`<button class="secondary" id="betaSound"></button><button class="secondary" id="betaFeedbackOpen">${t('feedback')}</button>`;document.querySelector('#modalBody').append(box);bindSound();document.querySelector('#betaFeedbackOpen').onclick=feedback};document.querySelector('#helpButton').onclick=window.aracneHelp;
const reset=document.createElement('button');reset.type='button';reset.className='textBtn';reset.id='betaResetFilters';reset.textContent=t('reset');document.querySelector('.v2Filters').append(reset);reset.onclick=()=>{document.querySelector('#search').value='';document.querySelector('#zoneFilter').value='all';document.querySelector('[data-category="all"]').click()};
const quick=document.createElement('button');quick.type='button';quick.id='betaSoundQuick';quick.className='textBtn';soundLabel(quick);quick.onclick=toggleSound;banner.append(quick);
const soundTest=document.createElement('button');soundTest.type='button';soundTest.id='betaSoundTest';soundTest.className='textBtn';soundTest.textContent='♫ '+t('testSound');soundTest.onclick=()=>{sounds=true;try{localStorage.setItem('aracne-beta-sounds','on')}catch{}document.querySelectorAll('#betaSound,#betaSoundQuick').forEach(soundLabel);tone('ready',true)};banner.append(soundTest);
const cheers={add:['Youpi, une étape de plus !','Evviva, una tappa in più!','Yay, another stop!','¡Una etapa más!'],ready:['Votre proposition est prête !','La tua proposta è pronta!','Your draft is ready!','¡Tu propuesta está lista!'],done:['Hourra, votre programme est finalisé !','Evviva, il programma è finalizzato!','Hooray, your plan is finalized!','¡Hurra, tu programa está finalizado!']};
const cheer=document.createElement('div');cheer.className='betaCheer';cheer.setAttribute('role','status');cheer.setAttribute('aria-live','polite');document.body.append(cheer);let cheerTimer;
function reduced(){return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)}
function celebrate(kind){clearTimeout(cheerTimer);cheer.textContent=(kind==='done'?'🎉 ':'✨ ')+cheers[kind][col];cheer.classList.add('visible');tone(kind);if(!reduced()&&cheer.animate)cheer.animate([{transform:'translateY(16px) scale(.9)',opacity:0},{transform:'translateY(-4px) scale(1.04)',opacity:1},{transform:'translateY(0) scale(1)',opacity:1}],{duration:440});cheerTimer=setTimeout(()=>cheer.classList.remove('visible'),2800);
 if(kind==='done'&&!reduced()){document.querySelector('.betaConfetti')?.remove();const burst=document.createElement('div');burst.className='betaConfetti';burst.setAttribute('aria-hidden','true');for(let i=0;i<24;i++){const bit=document.createElement('i');bit.style.cssText=`--x:${(i/23)*100}vw;--drift:${(i%5-2)*28}px;--delay:${(i%4)*.07}s;background:${['#8a2387','#e94057','#f5b544','#29a890'][i%4]}`;burst.append(bit)}document.body.append(burst);setTimeout(()=>burst.remove(),1900)}
}
// Capture the before-state, then inspect synchronously at the END of propagation.
// Native browser clicks can run microtasks between capture and target listeners.
const pendingActions=new WeakMap();
const previousChoosePlace=choosePlace;
choosePlace=function(id){previousChoosePlace(id);const modal=document.querySelector('#modal');if(!reduced()&&modal?.animate)modal.animate([{opacity:.5,transform:'translateY(18px) scale(.94)'},{opacity:1,transform:'translateY(-3px) scale(1.015)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:360,easing:'ease-out'})};
// Only successful local user actions celebrate: never initial load, imports or remote sync.
function watchAction(event){const el=event.target.closest?.('#confirmAdd,#stepForm,#finalizePlan,[data-zone]');if(!el||el.disabled)return;
 if(event.type==='click'&&el.id==='stepForm')return;
 const ids=new Set(state.plan.flat().map(p=>p.uid)),version=state.carnetVersion||0;
 pendingActions.set(event,{el,ids,version});
}
function finishAction(event){const before=pendingActions.get(event);if(!before)return;pendingActions.delete(event);const {el,ids,version}=before;
 if((state.carnetVersion||0)>version&&el.id==='finalizePlan')celebrate('done');else if(state.plan.flat().some(p=>!ids.has(p.uid)))celebrate(el.hasAttribute('data-zone')?'ready':'add');
}
document.addEventListener('click',watchAction,true);document.addEventListener('submit',watchAction,true);
window.addEventListener('click',finishAction);window.addEventListener('submit',finishAction);
document.addEventListener('click',event=>{const b=event.target.closest?.('button');if(!b||b.disabled||b.getAttribute('aria-disabled')==='true')return;
 if(!b.matches('#betaSound,#betaSoundQuick,#betaSoundTest,#confirmAdd,#finalizePlan,[data-zone],#stepForm button'))tone();
 if(!reduced()&&b.animate)b.animate([{transform:'scale(.94)',filter:'brightness(1.16)',boxShadow:'0 0 0 0 rgba(233,64,87,.28)'},{transform:'scale(1.035)',filter:'brightness(1.07)',boxShadow:'0 0 0 8px rgba(233,64,87,0)'},{transform:'scale(1)',filter:'brightness(1)',boxShadow:'0 0 0 0 rgba(233,64,87,0)'}],{duration:320,easing:'ease-out'});
});
document.addEventListener('visibilitychange',()=>{if(document.hidden){for(const audio of mediaSounds.values())audio.pause();if(context?.state==='running')context.suspend().catch(()=>{})}});
window.aracneBeta={open,version:'1.0.0-beta.8'};
})();
