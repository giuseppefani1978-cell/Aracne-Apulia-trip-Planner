const {JSDOM}=require(process.env.JSDOM_PATH||'jsdom');
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..');
for(const lang of ['fr','it','en','es']){
 const file=lang==='fr'?'index.html':`index.${lang}.html`;
 const dom=new JSDOM(fs.readFileSync(path.join(root,'dist',file),'utf8'),{url:'https://example.test/dist/'+file,runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,ctx=dom.getInternalVMContext();
 const run=s=>vm.runInContext(s,ctx),click=s=>{assert.ok(w.document.querySelector(s),s);w.document.querySelector(s).click()};
 w.matchMedia=()=>({matches:true});w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.confirm=()=>true;
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'))};
 w.AbortController=AbortController;w.fetch=async()=>({ok:true,json:async()=>({role:'owner',revision:1,document:JSON.parse(run('JSON.stringify(state)'))})});
 for(const f of [`app.${lang}.js`,'catalog-v2.js','v2.js','v21.js'])run(fs.readFileSync(path.join(root,'dist',f),'utf8'));
 const initial=run('JSON.stringify(state)');
 const owner={id:'00000000-0000-4000-8000-000000000001',token:'a'.repeat(64),edit:'b'.repeat(64),read:'c'.repeat(64),role:'owner',revision:1,base:JSON.parse(initial)};
 w.localStorage.setItem('aracne-puglia-v1',initial);w.localStorage.setItem('aracne-shared-v1',JSON.stringify(owner));
 for(const f of ['shared-trips.js','experience.js'])run(fs.readFileSync(path.join(root,'dist',f),'utf8'));
 assert.equal(w.document.querySelector('#welcome').open,true);assert.equal(w.document.querySelector('#welcomeLanguage').value,lang);
 for(let i=0;i<6;i++){assert.equal(run('aracneIntro.getSlide()'),i);click('#welcomeNext')}
 assert.equal(w.document.querySelector('#welcome').open,false);assert.equal(run('JSON.stringify(state)'),initial);
 assert.equal(w.document.querySelectorAll('#helpButton').length,1);assert.equal(w.document.querySelector('#v21Help').hidden,true);
 click('#helpButton');assert.equal(w.document.querySelectorAll('.helpQuestion').length,7);click('#v21StartGuide');assert.equal(w.document.querySelector('#modal').open,false);assert.equal(w.document.querySelector('#v21Walkthrough').hidden,false);click('#guideClose');
 click('#helpButton');click('#v2Guide');assert.equal(w.document.querySelector('#welcome').open,true);click('#welcomeSkip');
 click('#shareTop');assert.ok(w.document.querySelector('#shareTogether'));assert.ok(w.document.querySelector('#shareSnapshot'));assert.equal(w.document.querySelector('#sharedDelete'),null);
 click('#shareTogether');assert.ok(w.document.querySelector('.shareMain #sharedEdit'));assert.ok(w.document.querySelector('.shareMain #sharedRead'));
 assert.equal(w.document.querySelector('#sharedDelete').closest('details').open,false);assert.equal(w.document.querySelector('#sharedRetry'),null);assert.equal(w.document.querySelector('#sharedLoad'),null);
 click('#sharedHelp');assert.equal(w.document.querySelector('.helpQuestion').open,true);
 assert.equal(run('JSON.stringify(state)'),initial);
 // Drive the introduction clock: six frames must enter the app without clicks.
 let scheduled=null;const originalTimeout=w.setTimeout.bind(w),originalClear=w.clearTimeout.bind(w);
 w.setTimeout=(fn,delay)=>{if(delay===6000){scheduled=fn;return 98765}return originalTimeout(fn,delay)};
 w.clearTimeout=id=>{if(id===98765)scheduled=null;else originalClear(id)};
 run('aracneIntro.open()');
 for(let i=0;i<6;i++){assert.equal(run('aracneIntro.getSlide()'),i);assert.ok(scheduled,'autoplay scheduled');const next=scheduled;next()}
 assert.equal(w.document.querySelector('#welcome').open,false);
 run('aracneIntro.open()');click('#welcomePlay');assert.equal(scheduled,null);click('#welcomePlay');assert.ok(scheduled);click('#welcomeEnter');assert.equal(w.document.querySelector('#welcome').open,false);assert.equal(scheduled,null);
 console.log(lang+': PASS automatic completion, pause/resume, enter app, full introduction, skip/replay, language, help, walkthrough, share choices, folded management, conditional troubleshooting, unchanged trip');w.close();
}
