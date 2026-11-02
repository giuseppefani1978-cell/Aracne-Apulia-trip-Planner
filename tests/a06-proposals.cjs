'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {client}=require('./v5.dom.cjs');
const root=path.resolve(__dirname,'../dist');
const langs=['fr','it','en','es'];
const questions={
 fr:'Propose-moi un parcours autour d’Otranto',
 it:'Suggerisci un percorso a Otranto',
 en:'Suggest an itinerary around Otranto',
 es:'Propón un recorrido por Otranto'
};
(async()=>{
for(const lang of langs){
 const c=client(lang),{w,run}=c;
 try{
  // Existing Planner + V5 collaboration/roles, not an artificial trip state.
  w.prompt=()=> 'A06 Synthetic Test Trip';
  w.aracneV5.create();
  assert.equal(run('state.name'),'A06 Synthetic Test Trip');
  for(const file of ['a06-places.js','a06-knowledge.js','a06-intelligence.js',
       'a06-adapter.js','a06-matcher.js','a06-proposals.js','a06-panel.js'])
    run(fs.readFileSync(path.join(root,file),'utf8'));
  const api=w.A06RouteProposals;
  assert.ok(api);
  const pre=JSON.stringify(run('state.plan'));
  const proposal=api.propose(questions[lang],lang);
  assert.equal(proposal.ok,true,lang+' Otranto should suggest known places');
  assert.ok(proposal.stops.length>=2 && proposal.stops.length<=4);
  assert.ok(proposal.stops.every(s => w.A06PlaceMatcher.match(s.ilId).plannerId===s.plannerId));
  assert.equal(proposal.routing,'indicative-only');
  assert.ok(!('duration' in proposal) && !('distanceKm' in proposal));
  assert.equal(JSON.stringify(run('state.plan')),pre,'proposal changed trip without consent');
  assert.equal(api.propose('I want a route',lang).ok,false,'no anchor cannot invent places');
  assert.equal(api.propose('Fais un parcours à Porto Badisco',lang).ok,true);
  const context=w.A06PlannerCatalog.proposalContext();
  assert.equal(context.canEdit,true,lang+' local named trip editable');
  assert.ok(!JSON.stringify(context).includes('A06 Synthetic Test Trip'));
  assert.ok(!JSON.stringify(context).includes('aracne-puglia-v1'));
  assert.ok(!('id' in context),'Opaque trip identity');
  const panel=w.document.getElementById('a06-panel');
  w.document.getElementById('a06-open').click();
  const input=panel.querySelector('.a06-input');
  input.value=questions[lang];
  panel.querySelector('form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  // A proposal itself must not navigate or mutate a trip.
  const buttons=[...panel.querySelectorAll('.a06-add-stop')];
  assert.ok(buttons.length>=2,'Expected route suggestion buttons');
  assert.equal(JSON.stringify(run('state.plan')),pre,'UI preview mutated trip');
  assert.equal(w.document.getElementById('modal').open,false);
  buttons[0].click();
  assert.equal(panel.hidden,true);
  assert.equal(w.document.getElementById('modal').open,true,'Native Planner dialog not opened');
  assert.equal(JSON.stringify(run('state.plan')),pre,'Preparing native modal already modified trip');
  const originalAdd=w.document.getElementById('confirmAdd');
  assert.ok(originalAdd);
  originalAdd.click(); // second distinct user confirmation
  assert.equal(run('state.plan.flat().length'),1,'Native confirmation not applied');
  assert.equal(run('state.plan.flat()[0].name'),proposal.stops[0].name);
  const count=run('state.plan.flat().length');
  assert.equal(run('state.plan.flat()[0].status')||'proposed','proposed');

  // Stale proposal cannot be committed after another edit to the trip.
  const stale=w.A06PlannerCatalog.proposalContext().fingerprint;
  assert.equal(w.A06PlannerCatalog.openNativeAdd(proposal.stops[1].plannerId,stale).ok,true);
  run("state.name += ' changed'; save()");
  w.document.getElementById('confirmAdd').click();
  assert.equal(run('state.plan.flat().length'),count,'Stale modal added an item');
  assert.equal(w.document.getElementById('modal').open,false);

  // Read-only capability receives suggestions but cannot even open a modal.
  const base=run('structuredClone(state)');
  w.aracneShared._setRaw({id:'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    token:'a'.repeat(64),role:'read',revision:1,base});
  const readCtx=w.A06PlannerCatalog.proposalContext();
  assert.equal(readCtx.canEdit,false);
  assert.equal(readCtx.role,'read');
  assert.equal(w.A06PlannerCatalog.openNativeAdd(proposal.stops[0].plannerId,readCtx.fingerprint).ok,false);
  assert.equal(run('state.plan.flat().length'),count);
  // Editor is allowed only when synchronized: stale/pending/denied block.
  w.aracneShared._setRaw({id:'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    token:'a'.repeat(64),role:'edit',revision:2,base:run('window.aracneShared._shared()')});
  const edit=w.A06PlannerCatalog.proposalContext();
  assert.equal(edit.canEdit,true,lang+' synchronized editor should be able to confirm');
  w.aracneShared._paint('conflict');
  assert.equal(w.A06PlannerCatalog.proposalContext().canEdit,false,'sync conflict must fail closed');
  w.aracneShared._paint('synced');
  const beforeRole=w.A06PlannerCatalog.proposalContext().fingerprint;
  assert.equal(w.A06PlannerCatalog.openNativeAdd(proposal.stops[1].plannerId,beforeRole).ok,true);
  w.aracneShared._setRaw({id:'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    token:'a'.repeat(64),role:'read',revision:3,base:run('window.aracneShared._shared()')});
  w.document.getElementById('confirmAdd').click();
  assert.equal(run('state.plan.flat().length'),count,'Role revoked during modal must prevent write');
  assert.equal(w.document.getElementById('modal').open,false);
  assert.equal(w.A06TourismAssistant.stats().plannerWrites,0,'Il Volo bridge remains read-only');
  console.log('PASS A06.3 '+lang+': grounded proposal, two-click confirm, reader denial, stale & revocation guards');
 } finally{c.close()}
}
})().catch(error=>{console.error(error);process.exitCode=1});
