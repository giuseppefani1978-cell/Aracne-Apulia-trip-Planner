/* A08.3 — isolated robust Web Speech dictation, replacing A06.8 voice ONLY in Lab A08.
   Each click uses a new recognition instance. Do not release it before onend.
   No audio upload, storage, auto-recording, API token, or TTS playback. */
(() => {
 'use strict';
 const panel=document.getElementById('a06-panel'),input=panel?.querySelector('.a06-input');
 const controls=panel?.querySelector('.a06-voice');
 if(!panel||!input||!controls||window.A06Voice)return;
 const lang=document.documentElement.lang;
 const locale={fr:'fr-FR',it:'it-IT',en:'en-GB',es:'es-ES'}[lang]||'fr-FR';
 const labels={
  fr:{start:'🎙 Dicter',stop:'■ Stop',ready:'Microphone prêt · nouvelle question',listening:'Je vous écoute…',preparing:'Ouverture du micro…',stopping:'Fermeture du micro…',failed:'Micro indisponible. Réessayez ou utilisez le clavier.',permission:'Autorisez le microphone dans Safari.',unsupported:'Utilisez le micro du clavier iPhone.',privacy:'La reconnaissance vocale peut utiliser un service vocal de votre navigateur.'},
  it:{start:'🎙 Detta',stop:'■ Stop',ready:'Microfono pronto · nuova domanda',listening:'Ti ascolto…',preparing:'Avvio microfono…',stopping:'Chiusura microfono…',failed:'Microfono non disponibile. Riprova o usa la tastiera.',permission:'Consenti l’accesso al microfono in Safari.',unsupported:'Usa il microfono della tastiera.',privacy:'La dettatura può usare servizi del browser.'},
  en:{start:'🎙 Dictate',stop:'■ Stop',ready:'Microphone ready · next question',listening:'Listening…',preparing:'Starting microphone…',stopping:'Releasing microphone…',failed:'Microphone unavailable. Try again or use the keyboard.',permission:'Allow microphone access in Safari.',unsupported:'Use the keyboard microphone.',privacy:'Speech recognition may use browser services.'},
  es:{start:'🎙 Dictar',stop:'■ Stop',ready:'Micrófono listo · nueva pregunta',listening:'Escuchando…',preparing:'Iniciando micrófono…',stopping:'Cerrando micrófono…',failed:'Micrófono no disponible. Reintenta o usa el teclado.',permission:'Permite acceso al micrófono en Safari.',unsupported:'Usa el micrófono del teclado.',privacy:'El dictado puede utilizar servicios del navegador.'}
 }[lang]||null;
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 const start=document.createElement('button'),stopButton=document.createElement('button');
 const read=document.createElement('button'),status=document.createElement('small');
 const details=document.createElement('details'),summary=document.createElement('summary'),privacy=document.createElement('small');
 start.type=stopButton.type=read.type='button';
 start.className='a06-voice-start';stopButton.className='a06-voice-stop';read.className='a06-voice-read';
 status.className='a06-voice-status';status.setAttribute('role','status');
 start.textContent=labels.start;stopButton.textContent=labels.stop;
 read.textContent='🔊';read.hidden=true;read.disabled=true;
 details.className='a06-voice-details';
 summary.textContent={fr:'Confidentialité vocale',it:'Privacy vocale',en:'Voice privacy',es:'Privacidad de voz'}[lang]||'Voice privacy';
 privacy.textContent=labels.privacy;
 details.append(summary,privacy);controls.append(start,stopButton,read,status,details);

 let active=null,phase='idle',token=0,base='',finalWords='',lastError=null;
 let releaseTimer=null, lastAnswer='', discardCurrent=false;
 const available=Boolean(SR);
 function render(note){
  start.disabled=!available||phase!=='idle';
  stopButton.disabled=phase==='idle';
  start.dataset.listening=String(phase==='starting'||phase==='listening');
  if(note)status.textContent=note;
  else status.textContent=!available?labels.unsupported:
    phase==='listening'?labels.listening:
    phase==='starting'?labels.preparing:
    phase==='stopping'?labels.stopping:labels.ready;
 }
 function clearReleaseTimer(){if(releaseTimer!==null){clearTimeout(releaseTimer);releaseTimer=null}}
 function release(sr,id,{discard=false}={}){
  if(active!==sr||token!==id)return;
  clearReleaseTimer();active=null;phase='idle';
  // Final transcript is not reinserted if the user submitted or cleared the editor.
  if(!discard && finalWords && input.value.trim()) {
   input.value=[base,finalWords].filter(Boolean).join(' ').slice(0,600);
   input.dispatchEvent(new Event('input',{bubbles:true}));
  }
  render(lastError||labels.ready);
 }
 function armFallback(sr,id,discard){
  clearReleaseTimer();
  // Safari sometimes omits onend after abort/error. Do not block the next user click forever.
  releaseTimer=setTimeout(()=>release(sr,id,{discard}),1000);
 }
 function endDictation({discard=false}={}){
  const sr=active;
  if(!sr){phase='idle';clearReleaseTimer();render();return}
  if(phase==='stopping')return;
  phase='stopping';discardCurrent=discard;render();
  sr.onstart=null;
  if(discard)sr.onresult=null;
  armFallback(sr,token,discard);
  try{
   if(discard&&typeof sr.abort==='function')sr.abort();
   else sr.stop();
  }catch(_){release(sr,token,{discard})}
 }
 function launch(){
  if(!available||active||phase!=='idle')return;
  clearReleaseTimer();lastError=null;
  base=input.value.trim();finalWords='';discardCurrent=false;
  const id=++token;
  let sr;
  try{sr=new SR()}catch(_){phase='idle';render(labels.failed);return}
  active=sr;phase='starting';render();
  sr.lang=locale;sr.continuous=false;sr.interimResults=true;sr.maxAlternatives=1;
  sr.onstart=()=>{
   if(sr!==active||id!==token)return;
   phase='listening';render();
  };
  sr.onresult=event=>{
   if(sr!==active||id!==token||phase==='stopping')return;
   let final='',interim='';
   for(const result of Array.from(event.results||[])){
    const words=String(result?.[0]?.transcript||'').trim();
    if(!words)continue;
    if(result.isFinal)final+=(final?' ':'')+words;
    else interim+=(interim?' ':'')+words;
   }
   finalWords=final;
   input.value=[base,final,interim].filter(Boolean).join(' ').slice(0,600);
   input.dispatchEvent(new Event('input',{bubbles:true}));
  };
  sr.onerror=event=>{
   if(sr!==active||id!==token)return;
   const reason=event?.error||'unknown';
   lastError=['not-allowed','service-not-allowed','audio-capture'].includes(reason)?labels.permission:labels.failed;
   phase='stopping';render(lastError);
   armFallback(sr,id,false);
  };
  sr.onend=()=>release(sr,id,{discard:discardCurrent});
  try{sr.start()}catch(error){
   // If iOS refuses a new session, unlock the button and expose the failure.
   lastError=labels.failed;
   release(sr,id,{discard:true});
   render(lastError);
  }
 }
 start.addEventListener('click',launch);
 stopButton.addEventListener('click',()=>endDictation());
 // No forced input.focus() at the end: iOS keyboard and microphone may compete.
 function stop(){endDictation({discard:true})}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
 window.addEventListener('pagehide',stop);
 panel.querySelector('form')?.addEventListener('submit',stop);
 render();
 window.A06Voice=Object.freeze({
  supported:available,stop,stopSpeaking:()=>{},setLastAnswer:answer=>{lastAnswer=String(answer||'')},
  reset:()=>{stop();lastAnswer='';input.value='';input.dispatchEvent(new Event('input',{bubbles:true}))},
  status:()=>Object.freeze({listening:phase==='starting'||phase==='listening',phase,
   lang:locale,webRecognitionAvailable:available,speechAvailable:false,audioState:'disabled',
   transcript:input.value,lastError})
 });
})();
