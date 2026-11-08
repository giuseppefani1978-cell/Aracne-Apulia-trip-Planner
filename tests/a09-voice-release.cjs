'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');
const source=fs.readFileSync(path.join(__dirname,'../lab/a08/reliable-voice.js'),'utf8');
function setup(){
 const dom=new JSDOM('<html lang="fr"><div id="a06-panel"><form><textarea class="a06-input"></textarea><div class="a06-voice"></div></form></div></html>',{runScripts:'outside-only'});
 const w=dom.window;let now=0,next=0,owner=null;const timers=new Map(),sessions=[];
 w.setTimeout=(fn,ms)=>{const id=++next;timers.set(id,{fn,at:now+ms});return id};
 w.clearTimeout=id=>timers.delete(id);
 const tick=ms=>{const until=now+ms;for(;;){const due=[...timers].filter(([,t])=>t.at<=until).sort((a,b)=>a[1].at-b[1].at)[0];if(!due)break;now=due[1].at;timers.delete(due[0]);due[1].fn()}now=until};
 w.webkitSpeechRecognition=class{
  constructor(){sessions.push(this);this.aborts=0;this.stops=0}
  start(){assert.equal(owner,null,'browser cannot grant microphone to overlapping recognizers');owner=this;this.onstart?.()}
  stop(){this.stops++} // Safari may not release the native service yet.
  abort(){this.aborts++} // The ack is asynchronous, not implied by this call.
  ended(){if(owner===this)owner=null;this.onend?.()}
  result(text){this.onresult?.({results:[{0:{transcript:text},isFinal:true}]})}
 };
 w.eval(source);
 return {w,dom,tick,sessions,click:cls=>w.document.querySelector(cls).click(),input:w.document.querySelector('textarea')};
}
{
 const h=setup(),{w,tick,sessions,click,input}=h;
 click('.a06-voice-start');const first=sessions[0];first.result('Bari');
 w.document.querySelector('form').dispatchEvent(new w.Event('submit'));
 tick(1500);
 assert.equal(sessions.length,1);
 assert.notEqual(w.A06Voice.status().phase,'idle','timeout must not pretend Safari acknowledged release');
 assert.ok(first.aborts>0,'Send cancels native recognition, not just result delivery');
 click('.a06-voice-start');
 assert.equal(sessions.length,1,'retry must not replace a still-connected recognizer');
 first.ended();tick(400);assert.equal(sessions.length,1,'Send disables auto-restart');
 input.value='';click('.a06-voice-start');assert.equal(sessions.length,2);
 const second=sessions[1];second.result('Lecce');assert.equal(input.value,'Lecce');
 first.result('stale');assert.equal(input.value,'Lecce');
 click('.a06-voice-stop');second.result('Lecce et Gallipoli');
 assert.equal(input.value,'Lecce et Gallipoli','Finish accepts the final flushed transcript');
 tick(1300);assert.ok(second.aborts>0,'hung graceful stop escalates to abort');
 second.ended();tick(400);assert.equal(sessions.length,2);
 // A permission failure cannot cause a background restart loop.
 click('.a06-voice-start');sessions[2].onerror({error:'not-allowed'});sessions[2].ended();tick(10000);
 assert.equal(sessions.length,3);
 assert.ok(w.A06Voice.diagnostics().events.some(e=>e.event==='error'&&e.code==='not-allowed'));
 assert.ok(!JSON.stringify(w.A06Voice.diagnostics()).includes('Gallipoli'),'diagnostics exclude dictated content');
 h.dom.window.close();
}
{
 const h=setup();h.click('.a06-voice-start');h.sessions[0].ended();h.tick(1000);
 assert.equal(h.sessions.length,1,'empty Safari sessions must not restart indefinitely');
 h.dom.window.close();
}
console.log('PASS A09 voice: delayed/missing end, native ownership, abort, final result, stale events, errors and private diagnostics');
