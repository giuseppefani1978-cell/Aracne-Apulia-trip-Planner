/* A06.6 — Explicit voice dictation, editable transcript and optional read-aloud.
 * Browser-provided Web Speech API only, feature-detected. Microphone is never
 * started automatically. Browser speech processing may use platform services.
 * No custom audio recording, uploads, analytics, or storage.
 */
(() => {
 'use strict';
 const panel=document.getElementById('a06-panel');
 if(!panel || window.A06Voice)return;
 const input=panel.querySelector('.a06-input'),controls=panel.querySelector('.a06-voice');
 if(!input||!controls)return;
 const lang=document.documentElement.lang,locale={fr:'fr-FR',it:'it-IT',en:'en-GB',es:'es-ES'}[lang]||'fr-FR';
 const t={
 fr:{start:'🎙 Dicter',stop:'■ Stop',speak:'🔊 Lire',stopSpeech:'Arrêter la lecture',ready:'Corrigez le texte avant de l’envoyer.',listening:'Écoute en cours…',unsupported:'Dictée web indisponible : utilisez le micro du clavier.',failed:'Dictée interrompue. Réessayez ou utilisez le clavier.',privacy:'La reconnaissance vocale dépend de votre navigateur et peut utiliser un service vocal externe.'},
 it:{start:'🎙 Detta',stop:'■ Stop',speak:'🔊 Ascolta',stopSpeech:'Ferma lettura',ready:'Correggi il testo prima di inviarlo.',listening:'Ascolto in corso…',unsupported:'Dettatura web non disponibile: usa il microfono della tastiera.',failed:'Dettatura interrotta. Riprova o usa la tastiera.',privacy:'Il riconoscimento vocale dipende dal browser e potrebbe usare un servizio esterno.'},
 en:{start:'🎙 Dictate',stop:'■ Stop',speak:'🔊 Read aloud',stopSpeech:'Stop reading',ready:'Edit the transcript before sending.',listening:'Listening…',unsupported:'Web dictation unavailable: use the keyboard microphone.',failed:'Dictation stopped. Try again or use the keyboard.',privacy:'Voice recognition depends on your browser and may use an external speech service.'},
 es:{start:'🎙 Dictar',stop:'■ Stop',speak:'🔊 Escuchar',stopSpeech:'Detener lectura',ready:'Corrige el texto antes de enviarlo.',listening:'Escuchando…',unsupported:'Dictado web no disponible: usa el micrófono del teclado.',failed:'Dictado interrumpido. Reintenta o usa el teclado.',privacy:'El reconocimiento depende del navegador y puede utilizar un servicio externo.'}
 }[lang]||null;
 const labels=t||{start:'Dictate',stop:'Stop',speak:'Read aloud',stopSpeech:'Stop',ready:'Edit before sending',listening:'Listening',unsupported:'Use keyboard dictation',failed:'Try again',privacy:'Speech is processed by browser'};
 const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 const start=document.createElement('button'),stopButton=document.createElement('button');
 const read=document.createElement('button'),status=document.createElement('small');
 const privacy=document.createElement('small');
 start.type='button';stopButton.type='button';read.type='button';
 start.className='a06-voice-start';stopButton.className='a06-voice-stop';
 read.className='a06-voice-read';privacy.className='a06-voice-privacy';
 start.textContent=labels.start;stopButton.textContent=labels.stop;read.textContent=labels.speak;
 status.setAttribute('role','status');status.textContent=SpeechRecognition?labels.ready:labels.unsupported;
 privacy.textContent=labels.privacy;
 start.disabled=!SpeechRecognition;stopButton.disabled=true;read.disabled=true;
 controls.append(start,stopButton,read,status,privacy);
 let recognition=null,base='',finalWords='',lastAnswer='',runId=0;
 function stop(){
  const old=recognition;recognition=null;runId++;
  start.disabled=!SpeechRecognition;stopButton.disabled=true;start.dataset.listening='false';
  if(old){
   old.onend=null;old.onresult=null;old.onerror=null;
   try{old.stop()}catch(e){try{old.abort()}catch(_){}}
  }
  status.textContent=SpeechRecognition?labels.ready:labels.unsupported;
 }
 start.addEventListener('click',()=>{
  if(!SpeechRecognition)return;
  stop(); // Never retain a previous recognition stream.
  const id=++runId;
  base=input.value.trim(),finalWords='';
  try{
   const sr=new SpeechRecognition();recognition=sr;
   sr.lang=locale;sr.continuous=false;sr.interimResults=true;sr.maxAlternatives=1;
   sr.onstart=()=>{
    if(id!==runId)return;
    start.disabled=true;stopButton.disabled=false;start.dataset.listening='true';status.textContent=labels.listening;
   };
   sr.onresult=event=>{
    if(id!==runId)return;
    let final='',interim='';
    for(let i=0;i<event.results.length;i++){
      const entry=event.results[i];const words=entry?.[0]?.transcript||'';
      if(entry.isFinal)final+=words.trim()+' ';else interim+=words.trim()+' ';
    }
    finalWords=final.trim();
    const combined=[base,finalWords,interim.trim()].filter(Boolean).join(' ').slice(0,600);
    input.value=combined;input.dispatchEvent(new Event('input',{bubbles:true}));
   };
   sr.onerror=event=>{
    if(id!==runId)return;
    if(event?.error!=='no-speech'&&event?.error!=='aborted')status.textContent=labels.failed;
   };
   sr.onend=()=>{
    if(id!==runId)return;
    recognition=null;runId++;
    const done=[base,finalWords].filter(Boolean).join(' ').slice(0,600);
    if(finalWords)input.value=done;
    start.disabled=false;stopButton.disabled=true;start.dataset.listening='false';
    status.textContent=labels.ready;
    input.focus();
   };
   sr.start();
  }catch(error){stop();status.textContent=labels.failed;input.focus()}
 });
 stopButton.addEventListener('click',()=>{
  stop();input.focus();
 });
 // Read-aloud is opt-in and independent of dictation. Never autoplay.
 read.addEventListener('click',()=>{
  if(!window.speechSynthesis||!window.SpeechSynthesisUtterance)return;
  if(window.speechSynthesis.speaking){
   window.speechSynthesis.cancel();read.textContent=labels.speak;return;
  }
  if(!lastAnswer)return;
  const utterance=new window.SpeechSynthesisUtterance(lastAnswer.slice(0,2500));
  utterance.lang=locale;utterance.rate=0.95;
  utterance.onend=()=>{read.textContent=labels.speak};
  utterance.onerror=()=>{read.textContent=labels.speak};
  try{window.speechSynthesis.speak(utterance);read.textContent=labels.stopSpeech}catch(e){}
 });
 window.A06Voice=Object.freeze({
  supported:!!SpeechRecognition,
  stop,
  setLastAnswer:answer=>{lastAnswer=String(answer||'');read.disabled=!lastAnswer||!window.speechSynthesis||!window.SpeechSynthesisUtterance},
  reset:()=>{stop();lastAnswer='';read.disabled=true;window.speechSynthesis?.cancel?.()},
  status:()=>Object.freeze({listening:!!recognition,lang:locale,webRecognitionAvailable:!!SpeechRecognition}),
 });
})();