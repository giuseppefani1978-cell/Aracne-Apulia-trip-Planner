/* A06.7 — Explicit voice dictation, editable transcript and optional read-aloud.
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
 const details=document.createElement('details'),summary=document.createElement('summary'),privacy=document.createElement('small');
 const synth=window.speechSynthesis,canRead=Boolean(synth&&window.SpeechSynthesisUtterance);
 start.type=stopButton.type=read.type='button';
 start.className='a06-voice-start';stopButton.className='a06-voice-stop';
 read.className='a06-voice-read';status.className='a06-voice-status';
 start.textContent=labels.start;stopButton.textContent=labels.stop;read.textContent=labels.speak;
 status.setAttribute('role','status');status.textContent=SpeechRecognition?labels.ready:labels.unsupported;
 details.className='a06-voice-details';
 summary.textContent={fr:'Confidentialité vocale',it:'Privacy vocale',en:'Voice privacy',es:'Privacidad de voz'}[lang]||'Voice privacy';
 privacy.textContent=labels.privacy;details.append(summary,privacy);
 start.disabled=!SpeechRecognition;stopButton.disabled=true;read.disabled=true;
 controls.append(start,stopButton,read,status,details);
 let recognition=null,base='',finalWords='',lastAnswer='',runId=0;
 let readRun=0,readState='idle',chunks=[],chunkIndex=0,currentUtterance=null;
 const isReading=()=>readState==='reading';
 const ready=()=>SpeechRecognition?labels.ready:labels.unsupported;
 const textForVoice=answer=>String(answer||'').slice(0,3000)
  .replace(/https?:\/\/\S+/gi,'').replace(/[•*_#]+/g,' ')
  .replace(/[ \t]+/g,' ').replace(/\s*\n+\s*/g,'. ').trim();
 function segment(text){
  const output=[];let remaining=text;
  while(remaining.length){
   if(remaining.length<=170){output.push(remaining);break}
   let cut=remaining.lastIndexOf('. ',170)+1;
   if(cut<55)cut=remaining.lastIndexOf(' ',170);
   if(cut<45)cut=170;
   output.push(remaining.slice(0,cut).trim());
   remaining=remaining.slice(cut).trim();
  }
  return output.filter(Boolean);
 }
 function stopSpeaking(){
  readRun++;readState='idle';chunks=[];chunkIndex=0;currentUtterance=null;
  try{synth?.cancel?.()}catch(_){}
  read.textContent=labels.speak;read.dataset.reading='false';
  if(!recognition)status.textContent=ready();
 }
 function stopDictation(){
  const old=recognition;recognition=null;runId++;
  start.disabled=!SpeechRecognition;stopButton.disabled=true;start.dataset.listening='false';
  if(old){
   old.onstart=old.onend=old.onresult=old.onerror=null;
   try{old.stop()}catch(_){try{old.abort()}catch(__){}}
  }
  status.textContent=ready();
 }
 function stop(){stopDictation();stopSpeaking()}
 function finishReading(message){
  readState='idle';currentUtterance=null;chunks=[];chunkIndex=0;
  read.textContent=labels.speak;read.dataset.reading='false';
  status.textContent=message||ready();
 }
 function nextChunk(id){
  if(id!==readRun||!isReading())return;
  if(chunkIndex>=chunks.length){finishReading();return}
  const utterance=new window.SpeechSynthesisUtterance(chunks[chunkIndex++]);
  currentUtterance=utterance;
  utterance.lang=locale;utterance.rate=0.94;
  try{
   const voices=synth.getVoices?.()||[];
   const selected=voices.find(v=>v.lang?.toLowerCase()===locale.toLowerCase())||
    voices.find(v=>v.lang?.slice(0,2).toLowerCase()===locale.slice(0,2).toLowerCase());
   if(selected)utterance.voice=selected;
  }catch(_){}
  utterance.onend=()=>{if(id!==readRun)return;nextChunk(id)};
  utterance.onerror=()=>{if(id!==readRun)return;try{synth.cancel()}catch(_){}finishReading(labels.failed)};
  try{
   if(synth.paused)synth.resume();
   synth.speak(utterance);
  }catch(_){finishReading(labels.failed)}
 }
 start.addEventListener('click',()=>{
  if(!SpeechRecognition)return;
  stopSpeaking();stopDictation(); // Switching to dictation always stops any reading.
  const id=++runId;base=input.value.trim();finalWords='';
  try{
   const sr=new SpeechRecognition();recognition=sr;
   sr.lang=locale;sr.continuous=false;sr.interimResults=true;sr.maxAlternatives=1;
   sr.onstart=()=>{
    if(id!==runId)return;
    start.disabled=true;stopButton.disabled=false;start.dataset.listening='true';
    status.textContent=labels.listening;
   };
   sr.onresult=event=>{
    if(id!==runId)return;
    let final='',interim='';
    for(let i=0;i<event.results.length;i++){
     const entry=event.results[i],words=entry?.[0]?.transcript||'';
     if(entry.isFinal)final+=words.trim()+' ';else interim+=words.trim()+' ';
    }
    finalWords=final.trim();
    input.value=[base,finalWords,interim.trim()].filter(Boolean).join(' ').slice(0,600);
    input.dispatchEvent(new Event('input',{bubbles:true}));
   };
   sr.onerror=event=>{
    if(id!==runId)return;
    if(event?.error!=='no-speech'&&event?.error!=='aborted')status.textContent=labels.failed;
   };
   sr.onend=()=>{
    if(id!==runId)return;
    recognition=null;runId++;
    if(finalWords)input.value=[base,finalWords].filter(Boolean).join(' ').slice(0,600);
    start.disabled=false;stopButton.disabled=true;start.dataset.listening='false';
    status.textContent=labels.ready;input.focus();
   };
   sr.start();
  }catch(_){stopDictation();status.textContent=labels.failed;input.focus()}
 });
 stopButton.addEventListener('click',()=>{stopDictation();input.focus()});
 read.addEventListener('click',()=>{
  if(isReading()){stopSpeaking();return}
  if(!canRead){status.textContent=labels.failed;return}
  if(!lastAnswer.trim())return;
  stopDictation();stopSpeaking();
  chunks=segment(textForVoice(lastAnswer));
  if(!chunks.length){finishReading(labels.failed);return}
  readState='reading';read.textContent=labels.stopSpeech;read.dataset.reading='true';
  status.textContent={fr:'Lecture en cours…',it:'Lettura in corso…',en:'Reading aloud…',es:'Leyendo en voz alta…'}[lang]||'Reading…';
  nextChunk(readRun); // Invoke speech while inside the explicit click gesture.
 });
 // Any new question or text entry cancels playback; user need not press Stop.
 input.addEventListener('focus',()=>{if(isReading())stopSpeaking()});
 input.addEventListener('input',()=>{if(isReading())stopSpeaking()});
 panel.querySelector('form')?.addEventListener('submit',stop);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
 window.addEventListener('pagehide',stop);
 window.A06Voice=Object.freeze({
  supported:Boolean(SpeechRecognition),stop,stopSpeaking,
  setLastAnswer:answer=>{
   stopSpeaking();lastAnswer=String(answer||'');
   read.disabled=!canRead||!lastAnswer.trim();
  },
  reset:()=>{stop();lastAnswer='';read.disabled=true},
  status:()=>Object.freeze({listening:Boolean(recognition),reading:isReading(),
   lang:locale,webRecognitionAvailable:Boolean(SpeechRecognition),speechAvailable:canRead})
 });
})();