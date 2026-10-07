const {client}=require('./v5.dom.cjs'),assert=require('assert/strict');
(async()=>{for(const lang of ['fr','it','en','es']){const c=client(lang),{w,run}=c;try{
let notes=0;Object.defineProperty(w.navigator,'audioSession',{value:{type:'auto'}});w.AudioContext=class{state='running';suspend(){this.state='suspended';return Promise.resolve()}currentTime=0;destination={};createOscillator(){return {frequency:{setValueAtTime(){}},connect(){},disconnect(){},start(){notes++},stop(){}}}createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}}}};
const flush=()=>new Promise(r=>w.queueMicrotask(r));const cheer=()=>w.document.querySelector('.betaCheer');
assert.ok(!cheer().classList.contains('visible'),'no celebration on load');c.click('#betaSoundQuick');assert.equal(notes,3);assert.equal(w.localStorage.getItem('aracne-beta-sounds'),'on');
run("show('map');choosePlace(places[0].id)");c.click('#confirmAdd');assert.ok(cheer().classList.contains('visible'),'feedback completes after target handler in the same user gesture');await flush();assert.ok(cheer().classList.contains('visible'));assert.equal(notes,6,'addition melody');
cheer().classList.remove('visible');run("state.plan[0].push({uid:'remote',name:'Remote'});window.dispatchEvent(new CustomEvent('aracne:shared-applied'))");await flush();assert.ok(!cheer().classList.contains('visible'));
run("state.plan=[[{uid:'final',name:'Visit',desc:'',time:'10:00',status:'proposed'}]];save();show('plan')");c.click('[data-validate-step]');c.click('#finalizePlan');await flush();assert.ok(cheer().classList.contains('visible'));assert.equal(w.document.querySelector('.betaConfetti'),null,'reduced motion respected');const played=notes;
cheer().classList.remove('visible');c.click('#finalizePlan');await flush();assert.ok(!cheer().classList.contains('visible'),'no repeated finalization');assert.equal(notes,played);
w.confirm=()=>false;run('renderZones()');c.click('[data-zone]');await flush();assert.ok(!cheer().classList.contains('visible'),'cancelled generation stays quiet');
c.click('#betaSoundQuick');run("choosePlace(places[1].id)");c.click('#confirmAdd');await flush();assert.equal(notes,played,'mute stays silent');assert.ok(cheer().classList.contains('visible'),'muted visual feedback remains');
console.log(lang+': PASS action melodies, mute, successful additions/finalization, cancellation, remote updates and reduced motion');
}finally{c.close()}}})().catch(e=>{console.error(e);process.exitCode=1});
