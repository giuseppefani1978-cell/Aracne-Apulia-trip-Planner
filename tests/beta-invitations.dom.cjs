const {client}=require('./v5.dom.cjs'),assert=require('assert/strict'),fs=require('fs'),path=require('path');
const {JSDOM}=require('jsdom');const root=path.join(__dirname,'..');
const flush=()=>new Promise(r=>setImmediate(r));
(async()=>{
 for(const lang of ['fr','it','en','es']){
  const c=client(lang),{w,run}=c;
  try{
   run(fs.readFileSync(path.join(root,'dist/beta-invitations.js'),'utf8'));
   const requests=[],slot='11111111-1111-4111-a111-111111111111';let guest=false;
   w.aracneBetaAccess={enabled:true,active:true,ready:Promise.resolve(),betaRpc:async(action,data)=>{requests.push({action,data});return action==='invites_list'?{ok:true,organizer:!guest,slots:guest?[]:[{id:slot,ordinal:1,status:'available',reserve:false}]}:{ok:true,code:'ABCDEF123456ABCDEF123456',expires_at:'2026-11-01T12:00:00Z'}}};
   run("state.name='Beta trip'");const doc=w.aracneShared._shared();
   const session={id:'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',token:'a'.repeat(64),edit:'b'.repeat(64),read:'c'.repeat(64),role:'owner',revision:1,base:doc};w.aracneShared._setRaw(session);
   await w.aracneInvitations.open();assert.equal(w.document.querySelectorAll('[data-beta-issue]').length,1);
   w.document.querySelector('#betaInviteRole').value='read';c.click('[data-beta-issue]');await flush();
   const url=new URL(w.document.querySelector('#betaInviteLink').value),args=new URLSearchParams(url.hash.slice(1));
   assert.equal(args.get('key'),'c'.repeat(64));assert.equal(args.get('trip'),session.id);assert.equal(args.get('beta'),'ABCDEF123456ABCDEF123456');
   const wa=new URL(w.document.querySelector('a[href^="https://wa.me/"]').href);const message=wa.searchParams.get('text');assert.ok(message.includes(url.href));assert.ok(message.includes('Beta trip'));assert.ok(message.includes('My Apulia Trip'));assert.ok(!message.includes('Chaque lien personnel inclut'));assert.ok(message.includes('🐦'));
   let nativePayload;w.navigator.share=async payload=>{nativePayload=payload};
   c.click('#betaInviteNative');await flush();assert.equal(nativePayload.text,message,'native sharing carries the friendly invitation and the code-bearing URL');
   await w.aracneInvitations.open();w.document.querySelector('#betaInviteRole').value='edit';c.click('[data-beta-issue]');await flush();
   const editUrl=new URL(w.document.querySelector('#betaInviteLink').value);assert.equal(new URLSearchParams(editUrl.hash.slice(1)).get('key'),'b'.repeat(64));
   const editMessage=new URL(w.document.querySelector('a[href^="https://wa.me/"]').href).searchParams.get('text');
   assert.ok(editMessage.includes('Beta trip'));assert.ok(editMessage.includes(editUrl.href));assert.notEqual(editMessage,message,'edit invitation and read-only invitation have different descriptions');
   c.click('#betaInviteCopy');await flush();assert.ok(w.document.querySelector('#betaInviteMessage').textContent,'copy fallback is explicit');
   guest=true;await w.aracneInvitations.open();assert.equal(w.document.querySelectorAll('[data-beta-issue]').length,0);assert.equal(requests.filter(r=>r.action==='invites_issue').length,1);
   assert.equal(w.document.querySelectorAll('[data-beta-existing]').length,2,'guest can share trips with existing testers');
   console.log(lang+': PASS slot UI, WhatsApp link, permission choice, copy fallback, guest restrictions');
  }finally{c.close()}
 }
 for(const existing of [false,true]){
  const hash='#trip=aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa&key='+'b'.repeat(64)+'&beta=ABCDEF123456ABCDEF123456';
  const dom=new JSDOM('<!doctype html><head></head><body></body>',{url:'https://example.test/dist/index.html'+hash,runScripts:'outside-only'}),w=dom.window;const actions=[];
  w.fetch=async(url,opts)=>{const request=JSON.parse(opts.body);actions.push(request);return {ok:true,json:async()=>request.p_action==='session'?(existing?{ok:true,nickname:'Existing'}:{error:'beta_required'}):request.p_action==='activate'?{ok:true,nickname:'Guest'}:{error:'beta_required'}}};
  w.eval(fs.readFileSync(path.join(root,'dist/beta-access.js'),'utf8'));await w.aracneBetaAccess.ready;
  if(existing){assert.equal(w.aracneBetaAccess.active,true);assert.equal(w.document.querySelector('#aracneBetaAccess'),null);assert.ok(!w.location.hash.includes('beta='));assert.ok(w.location.hash.includes('trip='))}
  else{assert.equal(w.aracneBetaAccess.active,false);assert.equal(w.document.querySelector('#betaAccessCode').value.replaceAll('-',''),'ABCDEF123456ABCDEF123456');assert.ok(w.document.querySelector('#betaAccessCode').closest('label').hidden);assert.ok(w.location.hash.includes('trip='));
   w.document.querySelector('#betaAccessNickname').value='Guest';w.setTimeout=()=>0;w.document.querySelector('#betaAccessSubmit').click();await flush();assert.equal(actions.at(-1).p_action,'activate');assert.ok(!w.location.hash.includes('beta='));assert.ok(w.location.hash.includes('trip='));
  }
  w.close();console.log('PASS gate '+(existing?'existing tester':'new guest')+' preserves trip while consuming beta code');
 }
})().catch(e=>{console.error(e);process.exitCode=1});
