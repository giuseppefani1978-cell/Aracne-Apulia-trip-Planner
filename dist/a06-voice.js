/* A06.8 — Port Il Volo 1.1.9 single-utterance TTS, with A06.7 mic UX.
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
 let readRun=0,readState='idle',currentUtterance=null,audioState='idle';
 const isReading=()=>readState==='reading';
 const ready=()=>SpeechRecognition?labels.ready:labels.unsupported;
 const textForVoice=answer=>String(answer||'')
  .replace(/https?:\/\/\S+/gi,'').replace(/[•*_#]+/g,' ')
  .replace(/[ \t]+/g,' ').replace(/\s*\n+\s*/g,'. ').trim();
 function stopSpeaking(){
  readRun++;readState='idle';audioState='idle';currentUtterance=null;
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
  readState='idle';currentUtterance=null;
  read.textContent=labels.speak;read.dataset.reading='false';
  status.textContent=message||ready();
 }
 // This follows the working Il Volo Aracne Intelligence speech engine:
 // one native SpeechSynthesisUtterance, locale-specific voice, rate 0.96,
 // and normal browser onstart/onend/onerror lifecycle. Do not segment on iOS.
 function speakIlVoloStyle(text,id){
  const utterance=new window.SpeechSynthesisUtterance(text);
  currentUtterance=utterance;
  utterance.lang=locale;utterance.rate=0.96;
  try{
   const voices=synth.getVoices?.()||[];
   const selected=voices.find(v=>v.lang===utterance.lang)||
    voices.find(v=>(v.lang||'').toLowerCase().startsWith(lang));
   if(selected)utterance.voice=selected;
  }catch(_){}
  utterance.onstart=()=>{
   if(id!==readRun)return;
   audioState='playing';
   status.textContent={fr:'Lecture en cours…',it:'Lettura in corso…',en:'Reading aloud…',es:'Leyendo en voz alta…'}[lang]||'Reading…';
  };
  utterance.onend=()=>{
   if(id!==readRun)return;
   audioState='ended';finishReading();
  };
  utterance.onerror=event=>{
   if(id!==readRun)return;
   audioState='error:'+(event?.error||'unknown');
   finishReading(({fr:'Lecture audio impossible dans ce navigateur',it:'Lettura audio non disponibile in questo browser',en:'Audio playback unavailable in this browser',es:'La lectura de audio no funciona en este navegador'}[lang]||'Speech unavailable')+' ('+(event?.error||'erreur')+')');
  };
  try{
   synth.speak(utterance); // Must run synchronously in the user click gesture.
  }catch(error){
   audioState='error:'+(error?.name||'unknown');
   finishReading(({fr:'Lecture audio impossible',it:'Audio non disponibile',en:'Speech unavailable',es:'Audio no disponible'}[lang]||'Speech unavailable'));
  }
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
  const spokenText=textForVoice(lastAnswer);
  if(!spokenText){finishReading(labels.failed);return}
  readState='reading';audioState='starting';
  read.textContent=labels.stopSpeech;read.dataset.reading='true';
  status.textContent={fr:'Démarrage de la lecture…',it:'Avvio lettura…',en:'Starting playback…',es:'Iniciando lectura…'}[lang]||'Starting…';
  speakIlVoloStyle(spokenText,readRun);
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
   lang:locale,webRecognitionAvailable:Boolean(SpeechRecognition),speechAvailable:canRead,audioState})
 });
})();