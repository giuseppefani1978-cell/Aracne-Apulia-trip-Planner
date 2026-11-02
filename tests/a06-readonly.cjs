'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const assert=require('node:assert/strict');
const {JSDOM,VirtualConsole}=require('jsdom');
const root=path.resolve(__dirname,'..');
const modules=['a06-places.js','a06-knowledge.js','a06-intelligence.js','a06-adapter.js','a06-panel.js'];
const languages=['fr','it','en','es'];
const questions={
 fr:['Que voir à Otranto ?','Crée un parcours de Lecce à Otranto'],
 it:['Cosa vedere a Otranto?','Crea un percorso da Lecce a Otranto'],
 en:['What to see in Otranto?','Create a route from Lecce to Otranto'],
 es:['¿Qué ver en Otranto?','Crea una ruta de Lecce a Otranto']
};
(async()=>{
for(const lang of languages){
 const errors=[];
 const vc=new VirtualConsole();
 vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM('<!doctype html><html lang="'+lang+'"><head></head><body></body></html>',{
  url:'https://lab.aracne.invalid/dist/index.'+lang+'.html',
  runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc
 });
 const w=dom.window,context=dom.getInternalVMContext();
 w.scrollTo=()=>{};w.matchMedia=()=>({matches:true});w.fetch=()=>{throw Error('Forbidden outgoing request')};
 w.XMLHttpRequest=class{open(){throw Error('Forbidden XHR')}};
 for(const file of modules)vm.runInContext(fs.readFileSync(path.join(root,'dist',file),'utf8'),context,{filename:file});
 const api=w.A06TourismAssistant;
 assert.ok(api,'A06 API missing');
 assert.equal(api.engineVersion,'1.1.9');
 assert.equal(api.stats().places,50);
 assert.equal(api.stats().plannerWrites,0);
 assert.equal(w.A06IlVoloPlaces.length,50);
 assert.equal(w.document.querySelectorAll('#a06-open').length,1);
 assert.equal(w.document.querySelectorAll('#a06-panel').length,1);
 assert.equal(w.document.querySelectorAll('[data-view]').length,0);
 assert.equal(w.document.querySelectorAll('script[src],iframe').length,0);
 const information=await api.ask(questions[lang][0],lang);
 assert.ok(information.text.length>20,lang+' informational answer missing');
 assert.ok(!information.blocked,lang+' informational intent wrongly blocked');
 const route=await api.ask(questions[lang][1],lang);
 assert.equal(route.blocked,true,lang+' route mutation should be blocked');
 assert.equal(route.sources.length,0);
 const mutation=await api.ask({fr:'Ajoute Lecce au programme',it:'Aggiungi Lecce al percorso',en:'Add Lecce to my itinerary',es:'Añade Lecce al programa'}[lang],lang);
 assert.equal(mutation.blocked,true,lang+' add mutation should be blocked');
 assert.equal(api.stats().plannerWrites,0);
 // A06 exposes no capability that could mutate Planner trips.
 assert.equal(typeof w.aracneIntelligenceBridge,'undefined');
 assert.ok(!w.localStorage.getItem('aracne-puglia-v1'),lang+' storage should be untouched');
 assert.equal(errors.length,0,lang+' jsdom errors: '+errors.join('; '));
 console.log('PASS A06 '+lang+' informational, readonly route/add guard, no storage or beta interaction');
 dom.window.close();
}
})().catch(err=>{console.error(err);process.exitCode=1});
