const {client}=require('./v5.dom.cjs'),assert=require('assert/strict');
(async()=>{
 for(const session of ['supported','absent','throws']){
  const c=client('fr'),{w}=c;
  try{
   const order=[],played=[];let resume=0,paused=0;
   if(session!=='absent')Object.defineProperty(w.navigator,'audioSession',{value:{get type(){return 'playback'},set type(v){order.push(v);if(session==='throws')throw Error('unsupported')}}});
   w.AudioContext=class{state='suspended';currentTime=0;destination={};constructor(){order.push('context')}resume(){resume++;this.state='running';return Promise.resolve()}suspend(){this.state='suspended';return Promise.resolve()}createOscillator(){return {frequency:{setValueAtTime(){}},connect(){},disconnect(){},start(){played.push('oscillator')},stop(){}}}createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}}}};
   w.Audio=class{constructor(src){this.src=src}pause(){paused++}play(){played.push(this.src);return Promise.resolve()}};
   assert.equal(played.length,0);
   c.click('#betaSoundTest');
   if(session==='supported'){
    assert.deepEqual(order,['playback','context'],'configure playback before creating AudioContext');
    await new Promise(r=>w.queueMicrotask(r));assert.equal(resume,1);assert.equal(played.length,4);
    c.click('#betaSoundQuick');c.click('#betaSoundTest');await new Promise(r=>w.queueMicrotask(r));assert.equal(resume,2,'resume after mute/interruption');
   }else{
    assert.equal(played.length,1,'native play called synchronously in click');
    const wav=Buffer.from(played[0].split(',')[1],'base64');assert.equal(wav.toString('ascii',0,4),'RIFF');assert.equal(wav.readUInt32LE(40),wav.length-44);
    let peak=0;for(let n=44;n<wav.length;n+=2)peak=Math.max(peak,Math.abs(wav.readInt16LE(n)));assert.ok(peak>8000,'fallback contains audible samples');
    c.click('#betaSoundQuick');assert.ok(paused>0);c.click('#betaStart');assert.equal(played.length,1,'mute remains silent');
   }
   console.log('PASS audio session '+session);
  }finally{c.close()}
 }
 const c=client('fr');try{c.w.Audio=class{pause(){}play(){return Promise.reject(Error('blocked'))}};c.click('#betaSoundTest');await new Promise(r=>c.w.queueMicrotask(r));assert.ok(c.w.document.querySelector('#toast').textContent.includes('pas pu démarrer'));console.log('PASS playback rejection shown')}finally{c.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
