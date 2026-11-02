'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'../dist'),read=name=>fs.readFileSync(path.join(root,name),'utf8');
const locales=['fr','it','en','es'];
const names=['a06-places.js','a06-knowledge.js','a06-intelligence.js','a06-adapter.js',
 'a06-matcher.js','a06-puglia-data.js','a06-poi-reviews.js','a06-duplicate-audit.js',
 'a06-legacy-audit.js','a06-commercial-audit.js','a06-data-quality.js',
 'a06-puglia-knowledge.js','a06-proposals.js','a06-dialogue.js','a06-panel.js','a06-voice.js'];
const v1=vm.runInNewContext('('+read('app.fr.js').match(/const raw=(\[[\s\S]*?\]);\s*const places=/)[1]+')');
const v2={};vm.runInNewContext(read('catalog-v2.js'),{window:v2});
const catalog=[...v1.map((r,i)=>({id:'p'+i,name:r[0],lat:r[2],lon:r[3]})),
 ...v2.aracneCatalogV2.map(r=>({id:r[0],name:r[1],lat:r[3],lon:r[4]}))];
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
for(const locale of locales){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',error=>errors.push(error.message));
 const html='<html lang="'+locale+'"><head></head><body><nav><button data-view="map" type="button"></button></nav><input id="search"><select id="zoneFilter"><option value="all">All</option></select></body></html>';
 const dom=new JSDOM(html,{url:'https://lab.test.invalid/',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
 const w=dom.window,ctx=dom.getInternalVMContext();
 try{
  w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
  w.fetch=()=>{throw Error('Dialogue cannot send data to remote API')};
  w.XMLHttpRequest=class{open(){throw Error('Dialogue must remain local')}};
  let instance;
  class FakeSpeechRecognition{
   constructor(){instance=this;this.lang=null;this.interimResults=false;this.continuous=true;}
   start(){this.onstart?.();}stop(){this.onend?.()}abort(){this.onend?.()}
   result(text,isFinal=true){
    this.onresult?.({resultIndex:0,results:[Object.assign([{transcript:text}],{isFinal})]});
   }
   finish(){this.onend?.()}
  }
  w.webkitSpeechRecognition=FakeSpeechRecognition;
  w.A06PlannerCatalog=Object.freeze({
    list:()=>catalog.map(p=>Object.freeze({...p})),
    proposalContext:()=>Object.freeze({canEdit:false,role:'read',fingerprint:'synthetic-read-only'}),
    openNativeAdd:()=>({ok:false})
  });
  for(const name of names)vm.runInContext(read(name),ctx,{filename:name});
  const dialogue=w.A06Conversation,assistant=w.A06TourismAssistant,panel=w.document.getElementById('a06-panel');
  assert.ok(dialogue&&panel&&w.A06Voice);
  const broad=await dialogue.ask('Je veux visiter la côte Est','fr');
  assert.equal(broad.clarification,'east','Must ask east-coast clarification');
  assert.ok(/Gargano/.test(broad.text)&&/Bari/.test(broad.text));
  assert.equal(dialogue.context().zone,null);
  const selected=await dialogue.ask('Plutôt vers Bari','fr');
  assert.equal(selected.region,'bari','Followup should adopt Bari region');
  assert.equal(dialogue.context().zone,'bari');
  assert.ok(selected.plannerPlaces.length>0);
  const beaches=await dialogue.ask('Et les plages ?','fr');
  assert.equal(beaches.region,'bari','Followup must retain Bari without user repeating place');
  assert.ok(beaches.resolvedQuestion.toLowerCase().includes('plages'));
  const ostuni=await dialogue.ask('Parlons plutôt de la Vallée d’Itria','fr');
  assert.equal(ostuni.region,'itria','Explicit later region must replace old topic');
  const more=await dialogue.ask('Et les villages ?','fr');
  assert.equal(more.region,'itria');
  assert.ok(dialogue.context().turns<=4);
  dialogue.reset();
  assert.equal(dialogue.context().zone,null);
  const vague=await dialogue.ask('Que faire dans les Pouilles ?','fr');
  assert.equal(vague.clarification,'region','Broad Puglia trip requires region');
  const noGuess=await dialogue.ask('Je ne sais pas','fr');
  assert.equal(noGuess.clarification,'region','Unspecified choice cannot be invented');
  const restored=await dialogue.ask('Gargano','fr');
  assert.equal(restored.region,'gargano');
  assert.equal(assistant.stats().plannerWrites,0);
  assert.equal(w.A06Voice.supported,true,'Fake WebKit speech detector should work');
  const micStart=panel.querySelector('.a06-voice-start'),micStop=panel.querySelector('.a06-voice-stop');
  const input=panel.querySelector('.a06-input'),output=panel.querySelector('.a06-out');
  assert.equal(input.tagName,'TEXTAREA');
  input.value='Je cherche';
  micStart.click();
  assert.equal(instance.lang,{fr:'fr-FR',it:'it-IT',en:'en-GB',es:'es-ES'}[locale]);
  assert.equal(micStop.disabled,false);
  instance.result('une plage vers Bari',true);
  instance.finish();
  assert.equal(input.value,'Je cherche une plage vers Bari');
  assert.equal(micStart.disabled,false);
  input.value='Corrigé manuellement : Que voir à Bari ?';
  assert.equal(input.value.includes('Corrigé manuellement'),true,'Editable after dictation');
  assert.equal(output.textContent.trim(),'','Voice must not automatically send question');
  const form=panel.querySelector('form');
  input.value='Que voir à Bari ?';
  form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  for(let i=0;i<80&&!output.textContent.includes('Bari');i++)await sleep(10);
  assert.ok(output.querySelector('.a06-question'));
  assert.ok(output.querySelector('.a06-reply'));
  input.value='Et les plages ?';
  for(let i=0;i<80&&panel.querySelector('.a06-send').disabled;i++)await sleep(10);
  form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  for(let i=0;i<80&&output.querySelectorAll('.a06-turn').length<2;i++)await sleep(10);
  assert.ok(output.querySelectorAll('.a06-turn').length>=2,'Conversation history must be visible');
  assert.ok(output.querySelectorAll('.a06-reply').length>=2);
  assert.equal(w.A06Voice.status().listening,false);
  panel.querySelector('.a06-new').click(); // New conversation
  assert.equal(output.querySelectorAll('.a06-turn').length,0);
  assert.equal(dialogue.context().zone,null);
  assert.equal(errors.length,0,errors.join('; '));
  console.log('PASS A06.6 '+locale+': eastern coast clarification, follow-ups, editable WebKit dictation, chat history and reset');
 } finally{await sleep(0);dom.window.close()}
}
})().catch(error=>{console.error(error);process.exitCode=1});
