const {client}=require('./v5.dom.cjs'),assert=require('assert/strict');
(async()=>{for(const lang of ['fr','it','en','es']){const c=client(lang),{w,run}=c;try{
const before=run('JSON.stringify(state)');
c.click('#betaStart');assert.equal(w.document.querySelector('#betaSound').getAttribute('aria-pressed'),'false');c.click('#betaSound');assert.equal(w.localStorage.getItem('aracne-beta-sounds'),'on');
c.click('#betaFeedbackOpen');assert.ok(w.document.querySelector('#betaFeedback').value.includes('Beta 1'));c.click('#betaCopy');await Promise.resolve();assert.ok(w.document.querySelector('#betaCopyStatus').textContent);assert.equal(run('JSON.stringify(state)'),before,'beta interactions do not modify trips');
w.document.querySelector('#modal').close();run("show('map');drawMap()");const search=w.document.querySelector('#search');search.value='nardo';assert.ok(run("filtered().some(p=>p.name==='Nardò')"),'accent-insensitive search');search.value='Basiliani';assert.equal(run('filtered().length'),1);c.click('[data-category="nature"]');assert.equal(run('filtered().length'),0);c.click('#betaResetFilters');assert.ok(run('filtered().length')>80);assert.equal(search.value,'');
assert.equal(run('new Set(places.map(p=>p.id)).size'),run('places.length'));assert.ok(run("places.find(p=>p.id==='spa-basiliani').desc.length")>30);assert.equal(w.aracneBeta.version,'1.0.0-beta.10');
c.click('#helpButton');assert.ok(w.document.querySelector('#betaSound'));assert.equal(w.document.querySelector('#betaSound').getAttribute('aria-pressed'),'true');
console.log(lang+': PASS beta controls, feedback fallback, state preservation, accent search, filters and catalog');
}finally{c.close()}}})().catch(e=>{console.error(e);process.exitCode=1});
