const {client}=require('./v5.dom.cjs'),assert=require('assert/strict');
(async()=>{for(const lang of ['fr','it','en','es']){const c=client(lang),{w,run}=c;try{
run(`state.name='Draft name';state.days=2;state.plan=[[{uid:'draft',name:'Unpublished',lat:41,lon:17,status:'validated'}]];state.publishedBook={name:'Published trip',transport:'driving',plan:[Array.from({length:8},(_,i)=>({uid:'a'+i,name:'Stop '+i,lat:40+i/100,lon:17,status:'validated'})),[{uid:'b',name:'Second day',lat:42,lon:18,status:'validated'}]]};state.carnetVersion=1;show('plan')`);
assert.equal(w.document.querySelectorAll('#itinerary a[href*="waze"]').length,0);
assert.equal(w.document.querySelector('#routeActions').textContent,'');
run("show('notes')");
const host=w.document.querySelector('#carnetOverview'),wa=host.querySelector('a[href*="wa.me"]');assert.ok(wa);
const text=new URL(wa.href).searchParams.get('text');assert.ok(text.includes('Published trip'));assert.ok(!text.includes('Unpublished'));assert.ok(text.includes('Second day'));
const maps=[...host.querySelectorAll('a[href*="google.com/maps"]')];assert.equal(maps.length,8);assert.equal(host.querySelectorAll('a[href^="https://www.waze.com/"]').length,9);
for(const a of maps){const u=new URL(a.href);assert.equal(u.searchParams.get('travelmode'),'driving');assert.ok(!u.searchParams.has('waypoints'))}
c.click('#carnetNativeShare');await new Promise(r=>w.queueMicrotask(r));assert.ok(w.document.querySelector('#toast').textContent.includes('WhatsApp'));
run("state.publishedBook.transport='transit';renderNotes()");assert.equal(host.querySelectorAll('a[href^="https://www.waze.com/"]').length,0);
console.log(lang+': PASS published snapshot, all route legs, no preparation navigation, honest share fallback');
}finally{c.close()}}})().catch(e=>{console.error(e);process.exit(1)});
