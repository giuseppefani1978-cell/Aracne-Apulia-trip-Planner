const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');
const landing=fs.readFileSync(path.join(__dirname,'../decouvrir/index.html'),'utf8');
const dom=new JSDOM(landing,{url:'https://myapuliatrip.com/decouvrir/?lang=fr',runScripts:'dangerously'});
const doc=dom.window.document;
assert.equal(doc.querySelectorAll('script[src]').length,0,'landing must not load app or beta gate');
assert.equal(doc.querySelector('a.btn[href="../dist/index.html"]').textContent,'J’ai déjà activé mon accès');
assert.ok(doc.querySelector('[data-t="invitationHelp"]').textContent.includes('lien personnel'));
assert.ok(!landing.includes('aracne_beta('),'no beta API calls on public landing');
assert.ok(!landing.includes('invite='),'no code entry in public landing');
for(const l of ['fr','it','en','es']){
 const sel=doc.querySelector('#language');sel.value=l;sel.dispatchEvent(new dom.window.Event('change'));
 assert.equal(doc.documentElement.lang,l);
 assert.ok(doc.querySelector('h1').textContent.length>12);
 assert.ok(doc.querySelector('[data-t="invitationHelp"]').textContent.length>25);
}
assert.ok(doc.querySelector('img[src="../dist/polignano.jpg"]'));
assert.ok(doc.querySelector('img[src="../dist/icons/icon-192-v4.png"]'));
dom.window.close();
console.log('PASS public discovery page: 4 locales, app link unchanged, beta flow not interrupted');
