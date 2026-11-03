/* A08.4 — explicit, recoverable SpeechRecognition lifecycle for WebKit/iOS.
 * A fresh session per click, deterministic abort on Send or new conversation,
 * explicit feedback on silence, browser errors and keyboard fallback.
 * No microphone capture to an app backend; Web Speech may use browser services.
 */
(() => {
 'use strict';
 const panel=document.getElementById('a06-panel');
 const input=panel?.querySelector('.a06-input'),controls=panel?.querySelector('.a06-voice');
 if(!panel||!input||!controls||window.A06Voice)return;
 const lang=document.documentElement.lang,language={fr:'fr-FR',it:'it-IT',en:'en-GB',es:'es-ES'}[lang]||'fr-FR';
 const tr={
 fr:{start:'🎙 Dicter',stop:'■ Terminer',keyboard:'⌨️ Clavier',ready:'Micro prêt pour une nouvelle question.',starting:'Ouverture du micro…',listening:'Je vous écoute…',receiving:'Transcription en cours…',silent:'Micro ouvert, mais aucun mot reçu. Vous pouvez réessayer ou utiliser le clavier.',endSilent:'Aucun texte reçu. Réessayez ou utilisez le micro du clavier iPhone.',closing:'Fermeture du micro…',ended:'Dictée terminée. Vérifiez le texte puis envoyez.',error:'Reconnaissance indisponible. Réessayez ou utilisez le micro du clavier.',denied:'Accès au micro refusé : vérifiez les autorisations du navigateur.',unsupported:'Reconnaissance non disponible ici. Utilisez le micro du clavier.',privacy:'La dictée du navigateur peut utiliser un service vocal externe.',privTitle:'Confidentialité vocale'},
 it:{start:'🎙 Detta',stop:'■ Termina',keyboard:'⌨️ Tastiera',ready:'Microfono pronto per una nuova domanda.',starting:'Avvio microfono…',listening:'Ti ascolto…',receiving:'Trascrizione in corso…',silent:'Microfono aperto ma nessuna parola ricevuta. Riprova o usa la tastiera.',endSilent:'Nessun testo ricevuto. Riprova o usa il microfono della tastiera.',closing:'Chiusura microfono…',ended:'Dettatura terminata. Controlla il testo e invia.',error:'Riconoscimento non disponibile. Riprova o usa la tastiera.',denied:'Accesso microfono negato: controlla le autorizzazioni.',unsupported:'Riconoscimento non disponibile. Usa il microfono della tastiera.',privacy:'La dettatura del browser può usare un servizio vocale esterno.',privTitle:'Privacy vocale'},
 en:{start:'🎙 Dictate',stop:'■ Finish',keyboard:'⌨️ Keyboard',ready:'Mic ready for another question.',starting:'Opening microphone…',listening:'Listening…',receiving:'Transcribing…',silent:'Mic is open, but no words received. Retry or use the keyboard.',endSilent:'No text was received. Retry or use the keyboard microphone.',closing:'Closing microphone…',ended:'Dictation complete. Check text and send.',error:'Speech recognition unavailable. Retry or use keyboard microphone.',denied:'Microphone permission denied. Check browser permissions.',unsupported:'Speech recognition unavailable here. Use the keyboard microphone.',privacy:'Browser dictation may use an external speech service.',privTitle:'Voice privacy'},
 es:{start:'🎙 Dictar',stop:'■ Terminar',keyboard:'⌨️ Teclado',ready:'Micrófono listo para una nueva pregunta.',starting:'Abriendo micrófono…',listening:'Escuchando…',receiving:'Transcribiendo…',silent:'Micrófono abierto sin palabras recibidas. Reintenta o usa el teclado.',endSilent:'No se recibió texto. Reintenta o usa el micrófono del teclado.',closing:'Cerrando micrófono…',ended:'Dictado terminado. Revisa el texto y envía.',error:'Reconocimiento no disponible. Reintenta o usa el teclado.',denied:'Acceso al micrófono denegado. Revisa los permisos.',unsupported:'Reconocimiento no disponible. Usa el micrófono del teclado.',privacy:'El dictado del navegador puede usar un servicio externo.',privTitle:'Privacidad de voz'}
 }[lang]||null;
 const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 const supported=typeof Recognition==='function';
 const make=(cls,value)=>{const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=value;return b};
 const start=make('a06-voice-start',tr.start),finish=make('a06-voice-stop',tr.stop);
 const keyboard=make('a08-keyboard-fallback',tr.keyboard),read=make('a06-voice-read','🔊');
 read.hidden=true;read.disabled=true;
 const status=document.createElement('small');status.className='a06-voice-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const details=document.createElement('details');details.className='a06-voice-details';
 const summary=document.createElement('summary');summary.textContent=tr.privTitle;
 const privacy=document.createElement('small');privacy.textContent=tr.privacy;
 details.append(summary,privacy);controls.append(start,finish,keyboard,read,status,details);
 let session=null,phase='idle',generation=0,base='',finalText='',lastMessage='',lastError=null;
 let discarded=false,everResult=false,watchStart=null,watchSilence=null,watchRelease=null;
 function clearTimer(which){
  const id=which==='start'?watchStart:which==='silence'?watchSilence:watchRelease;
  if(id!==null)clearTimeout(id);
  if(which==='start')watchStart=null;
  else if(which==='silence')watchSilence=null;
  else watchRelease=null;
 }
 function clearAll(){clearTimer('start');clearTimer('silence');clearTimer('release')}
 function draw(message=''){
  start.disabled=!supported||phase!=='idle';finish.disabled=phase==='idle'||phase==='closing';
  start.dataset.listening=String(phase==='listening'||phase==='starting');
  controls.dataset.voicePhase=phase;
  status.textContent=message||lastMessage||(!supported?tr.unsupported:phase==='idle'?tr.ready:phase==='starting'?tr.starting:phase==='listening'?tr.listening:tr.closing);
 }
 function release(sr,id){
  if(sr!==session||id!==generation)return;
  clearAll();
  session=null;phase='idle';
  const note=lastError||lastMessage||(everResult?tr.ended:tr.endSilent);
  // Never put a late recognition result back in a submitted question.
  // The last interim value remains editable unless the user has submitted it.
  discarded=false;
  draw(note);
 }
 function unlockAfterBrowserHang(sr,id){
  clearTimer('release');
  watchRelease=setTimeout(()=>release(sr,id),1200);
 }
 function end({discard=false}={}){
  if(!session){phase='idle';draw();return;}
  const sr=session,id=generation;
  discarded=discarded||discard;
  if(phase==='closing')return;
  phase='closing';lastMessage=discard?tr.ready:tr.closing;clearTimer('start');clearTimer('silence');draw();
  if(discard)sr.onresult=null;
  unlockAfterBrowserHang(sr,id);
  try{if(discard&&typeof sr.abort==='function')sr.abort();else sr.stop()}catch(_){release(sr,id)}
 }
 function armSilence(sr,id){
  clearTimer('silence');
  watchSilence=setTimeout(()=>{
    if(sr!==session||id!==generation||phase!=='listening')return;
    lastMessage=tr.silent;draw();
    // A dead Safari session must not show "listening" indefinitely.
    watchSilence=setTimeout(()=>{
      if(sr!==session||id!==generation||phase!=='listening')return;
      lastMessage=tr.endSilent;end();
    },9000);
  },6500);
 }
 function launch(){
  if(!supported){draw(tr.unsupported);return;}
  if(phase!=='idle'||session)return;
  lastError=null;lastMessage='';discarded=false;everResult=false;
  base=input.value.trim();finalText='';
  const id=++generation;
  let sr;try{sr=new Recognition()}catch(_){draw(tr.error);return}
  session=sr;phase='starting';draw();
  sr.lang=language;sr.continuous=true;sr.interimResults=true;sr.maxAlternatives=1;
  sr.onstart=()=>{
    if(sr!==session||id!==generation||phase!=='starting')return;
    phase='listening';draw(tr.listening);armSilence(sr,id);
  };
  sr.onresult=event=>{
    if(sr!==session||id!==generation||phase==='closing'||discarded)return;
    const finalParts=[],interimParts=[];
    for(const item of Array.from(event?.results||[])){
      const word=String(item?.[0]?.transcript||'').trim();
      if(!word)continue;
      (item.isFinal?finalParts:interimParts).push(word);
    }
    const transcript=[...finalParts,...interimParts].join(' ').trim();
    if(!transcript)return;
    everResult=true;finalText=finalParts.join(' ');
    input.value=[base,transcript].filter(Boolean).join(' ').slice(0,600);
    input.dispatchEvent(new Event('input',{bubbles:true}));
    lastMessage=tr.receiving;draw();
    armSilence(sr,id);
  };
  sr.onerror=event=>{
    if(sr!==session||id!==generation)return;
    const reason=event?.error||'unknown';
    lastError=['not-allowed','service-not-allowed','audio-capture'].includes(reason)?tr.denied:
      reason==='no-speech'?tr.endSilent:tr.error;
    lastMessage=lastError;
    // WebKit may emit an error without the matching onend.
    end({discard:false});
  };
  sr.onend=()=>release(sr,id);
  clearTimer('start');
  watchStart=setTimeout(()=>{
    if(sr!==session||id!==generation||phase!=='starting')return;
    lastError=tr.error;
    end({discard:false});
  },8000);
  try{input.blur();sr.start()}catch(_){lastError=tr.error;release(sr,id)}
 }
 start.addEventListener('click',launch);
 finish.addEventListener('click',()=>end({discard:false}));
 keyboard.addEventListener('click',()=>{
   end({discard:false});input.focus();draw(supported?tr.ready:tr.unsupported);
 });
 function stop(){end({discard:true})}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
 window.addEventListener('pagehide',stop);
 panel.querySelector('form')?.addEventListener('submit',stop,true);
 renderInitial();
 function renderInitial(){draw()}
 window.A06Voice=Object.freeze({
  supported,stop,stopSpeaking:()=>{},setLastAnswer:()=>{},
  reset:()=>{stop();input.value='';input.dispatchEvent(new Event('input',{bubbles:true}))},
  status:()=>Object.freeze({phase,listening:phase==='starting'||phase==='listening',
   lang:language,webRecognitionAvailable:supported,speechAvailable:false,audioState:'disabled',
   transcript:input.value,lastError,messages:lastMessage,hasTranscript:everResult})
 });
})();
