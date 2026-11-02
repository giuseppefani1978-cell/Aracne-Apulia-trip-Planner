'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'../dist');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const names=['a06-places.js','a06-knowledge.js','a06-intelligence.js','a06-adapter.js',
'a06-matcher.js','a06-puglia-data.js','a06-poi-reviews.js','a06-duplicate-audit.js',
'a06-legacy-audit.js','a06-commercial-audit.js','a06-data-quality.js',
'a06-puglia-knowledge.js','a06-proposals.js','a06-dialogue.js','a06-panel.js','a06-voice.js'];
const v1=vm.runInNewContext('('+read('app.fr.js').match(/const raw=(\[[\s\S]*?\]);\s*const places=/)[1]+')');
const s={};vm.runInNewContext(read('catalog-v2.js'),{window:s});
const catalog=[...v1.map((r,i)=>({id:'p'+i,name:r[0],lat:r[2],lon:r[3]})),
 ...s.aracneCatalogV2.map(r=>({id:r[0],name:r[1],lat:r[3],lon:r[4]}))];
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
for(const language of ['fr','it','en','es']){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM('<!doctype html><html lang="'+language+'"><head></head><body><nav><button type="button" data-view="map">Map</button></nav><input id="search"><select id="zoneFilter"><option value="all">All</option></select></body></html>',{
 url:'https://preview.test.invalid/',pretendToBeVisual:true,runScripts:'outside-only',virtualConsole:vc});
 const w=dom.window;
 try {
  w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
  w.matchMedia=q=>({matches:q.includes('max-width'),media:q});
  let recognition=null,spoken=[],cancelled=0;
  class Recognition{
   constructor(){recognition=this;this.lang=null;this.continuous=true;this.interimResults=false;}
   start(){this.onstart?.()}stop(){this.onend?.()}abort(){this.onend?.()}
   result(text){this.onresult?.({results:[Object.assign([{transcript:text}],{isFinal:true})]})}
   end(){this.onend?.()}
  }
  class Utterance {
   constructor(text){this.text=text;this.lang='';this.rate=1;this.onend=null;this.onerror=null}
  }
  const speech={
   paused:false,speaking:false,cancel(){cancelled++;this.speaking=false;},
   getVoices(){return [{lang:{fr:'fr-FR',it:'it-IT',en:'en-GB',es:'es-ES'}[language],name:'Mock voice'}]},
   speak(utterance){spoken.push(utterance);this.speaking=true;},
   resume(){this.paused=false}
  };
  Object.defineProperty(w,'speechSynthesis',{configurable:true,value:speech});
  w.SpeechSynthesisUtterance=Utterance;w.webkitSpeechRecognition=Recognition;
  w.fetch=()=>{throw Error('A06 cannot make network calls')};
  w.XMLHttpRequest=class{open(){throw Error('XHR forbidden')}};
  w.A06PlannerCatalog=Object.freeze({
   list:()=>catalog.map(x=>Object.freeze({...x})),
   proposalContext:()=>Object.freeze({canEdit:false,role:'read',fingerprint:'fake'})
  });
  const ctx=dom.getInternalVMContext();
  for(const file of names)vm.runInContext(read(file),ctx,{filename:file});
  const panel=w.document.getElementById('a06-panel'),voice=w.A06Voice;
  const css=[...w.document.querySelectorAll('style')].map(n=>n.textContent).join('\n');
  assert.ok(css.includes('position:fixed!important;inset:0!important'),'Mobile must occupy full viewport');
  assert.ok(css.includes('grid-template-columns:minmax(0,1fr) auto'),'Input/button must not overflow');
  assert.ok(css.includes('font-size:16px!important'),'Prevent iPhone input zoom');
  assert.ok(css.includes('.a06-out{padding:10px 14px'),'Conversation must have scrolling area');
  assert.ok(css.includes('.a06-voice-details'),'Privacy text must be collapsible');
  assert.equal(panel.querySelector('.a06-voice-details').tagName,'DETAILS');
  assert.equal(panel.querySelector('.a06-compose').contains(panel.querySelector('.a06-voice')),true);
  assert.equal(panel.querySelector('.a06-compose').contains(panel.querySelector('form')),true);
  w.document.querySelector('#a06-open').click();
  assert.equal(panel.hidden,false);
  assert.ok(w.document.documentElement.classList.contains('a06-chat-open'));
  assert.equal(w.document.activeElement.tagName,'BODY','On small iPhone opening chat must not launch keyboard');
  const form=panel.querySelector('form'),input=panel.querySelector('.a06-input');
  input.value='Que voir à Bari ?';
  form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  const readButton=panel.querySelector('.a06-voice-read');
  for(let i=0;i<80&&readButton.disabled;i++)await wait(10);
  assert.equal(readButton.disabled,false,'Speech option requires a reply');
  assert.ok(panel.querySelector('.a06-reply').textContent.length>50);
  readButton.click();
  assert.equal(voice.status().reading,true,'Reading must be tracked independent from browser speaking flag');
  assert.ok(spoken.length>=1);
  assert.ok(spoken[0].text.length<=170,'Safari chunks should be short');
  const mic=panel.querySelector('.a06-voice-start');
  const before=cancelled;
  mic.click();
  assert.ok(cancelled>before,'Starting dictation should cancel read-aloud');
  assert.equal(voice.status().reading,false);
  assert.equal(voice.status().listening,true);
  assert.equal(readButton.dataset.reading,'false');
  recognition.result('Et les plages ?');
  recognition.end();
  assert.equal(input.value.includes('Et les plages'),true);
  input.value='Et les plages ?';
  form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  for(let i=0;i<80&&panel.querySelector('.a06-send').disabled;i++)await wait(10);
  assert.ok(panel.querySelectorAll('.a06-turn').length>=2,'Chat history should remain readable');
  assert.equal(voice.status().reading,false);
  // Starting playback, tapping the input to type and switching to a new question
  // must work without touching "Stop audio".
  readButton.click();
  assert.equal(voice.status().reading,true);
  const stopCount=cancelled;
  input.dispatchEvent(new w.Event('focus'));
  assert.equal(voice.status().reading,false);
  assert.ok(cancelled>stopCount);
  readButton.click();
  assert.equal(voice.status().reading,true);
  panel.querySelector('.a06-new').click();
  assert.equal(voice.status().reading,false,'Reset must stop voice');
  assert.equal(panel.querySelectorAll('.a06-turn').length,0);
  assert.ok(!panel.classList.contains('a06-has-turns'));
  w.document.querySelector('.a06-x').click();
  assert.equal(panel.hidden,true);
  assert.ok(!w.document.documentElement.classList.contains('a06-chat-open'));
  assert.equal(errors.length,0,errors.join('; '));
  console.log('PASS A06.7 '+language+': fullscreen mobile, editable input, chunks, automatic audio cancel, reset, no backend writes');
 } finally {await wait(0);dom.window.close()}
}
})().catch(e=>{console.error(e);process.exitCode=1});
