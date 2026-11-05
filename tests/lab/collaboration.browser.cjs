/* Run with Playwright installed; real browser, external network entirely aborted. */
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {build}=require('../../scripts/lab/build.cjs');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const {PGlite}=require('@electric-sql/pglite');
(async()=>{const root=build('staging/local.example.json');
 const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(file))}catch{res.writeHead(404).end()}});
 await new Promise(r=>server.listen(4173,'127.0.0.1',r));let browser;
 const db=new PGlite();
 try{
 await db.exec('CREATE ROLE anon; CREATE ROLE authenticated;');await db.exec(fs.readFileSync('staging/schema-baseline.sql','utf8'));await db.exec(fs.readFileSync('staging/legacy-v1-guard.sql','utf8'));
 // This suite exercises trip capabilities; beta activation has its own SQL suite.
 await db.exec('INSERT INTO aracne_private.beta_settings(id,enabled) VALUES(true,false)');
 let queue=Promise.resolve(),calls=0;
 const allowed=new Set(['p_action','p_id','p_token','p_document','p_revision','p_edit','p_read','p_name','p_actor','p_events','p_since_event','p_version_id','p_label','p_workspace_id','p_workspace_token']);
 browser=await chromium.launch({headless:true, ...(process.env.ARACNE_CHROMIUM_PATH ? {executablePath:process.env.ARACNE_CHROMIUM_PATH} : {})});const pages=[];
 for(const lang of ['fr','it','en']){
 const context=await browser.newContext();
 await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.origin==='http://127.0.0.1:4173')return route.continue();
 if(u.origin!=='http://127.0.0.1:54321')return route.abort();
 if(u.pathname!=='/rest/v1/rpc/aracne_trip_v5')return route.fulfill({json:{error:'denied'}});
 const body=route.request().postDataJSON(),keys=Object.keys(body);assert.ok(keys.every(k=>allowed.has(k)));
 const task=queue.then(async()=>{calls++;return db.transaction(async tx=>{await tx.exec('SET LOCAL ROLE anon');const result=await tx.query('SELECT public.aracne_trip_v5('+keys.map((k,i)=>`${k}=>$${i+1}`).join(',')+') AS r',keys.map(k=>body[k]));return result.rows[0].r})});queue=task.catch(()=>{});
 try{await route.fulfill({json:await task})}catch(e){await route.fulfill({status:500,json:{error:e.message}})}
 });
 await context.addInitScript(()=>localStorage.setItem('aracne-lab:v1:aracne-welcome-v5','seen'));
 const page=await context.newPage();await page.goto('http://127.0.0.1:4173/dist/'+(lang==='fr'?'index.html':`index.${lang}.html`));await page.waitForFunction(()=>!!window.aracneShared);pages.push(page);
 }
 const [a,b,r]=pages;
 const result=await a.evaluate(async()=>{const doc=aracneShared._shared();doc.name='LAB collaboration';return aracneShared._rpc('create',{p_document:doc,p_name:doc.name,p_edit:'b'.repeat(64),p_read:'c'.repeat(64)},{token:'a'.repeat(64)})});assert.ok(result.id);
 for(let i=0;i<3;i++){await pages[i].evaluate(async({id,token})=>{const cred={id,token},res=await aracneShared._rpc('read',{},cred);aracneShared._setRaw({...cred,role:res.role,revision:res.revision,base:res.document});aracneShared._apply(res.document);document.querySelector('#modal').close()},{id:result.id,token:'abc'[i].repeat(64)})}
 const write=async(page,name,revision)=>page.evaluate(async({name,revision})=>{const d=aracneShared._shared();d.plan=[[{uid:'lab-step',name,status:'proposed',desc:'',time:''}]];try{return await aracneShared._rpc('write',{p_document:d,p_revision:revision})}catch(e){return {error:e.message}}},{name,revision});
 assert.equal((await write(a,'Owner edit',1)).revision,2);
 assert.equal((await write(b,'Stale edit',1)).error,'conflict');
 assert.equal((await write(r,'Forbidden reader',2)).error,'denied');
 assert.equal((await write(b,'Editor edit',2)).revision,3);
 for(const page of pages){await page.evaluate(()=>aracneShared._tick());await page.waitForFunction(()=>aracneShared._getRaw().revision===3);assert.equal(await page.evaluate(()=>aracneShared._shared().plan[0][0].name),'Editor edit')}
 const privateResult=await b.evaluate(async()=>{const doc=aracneShared._shared();doc.notes.push({privacy:'private',text:'PRIVATE_SENTINEL'});return aracneShared._rpc('write',{p_document:doc,p_revision:3})});assert.equal(privateResult.revision,4);
 const remote=await a.evaluate(()=>aracneShared._rpc('read'));assert.ok(!JSON.stringify(remote).includes('PRIVATE_SENTINEL'));
 await a.evaluate(()=>aracneShared._rpc('rotate',{p_edit:'e'.repeat(64),p_read:'f'.repeat(64)}));
 assert.equal(await b.evaluate(async()=>{try{await aracneShared._rpc('read');return 'allowed'}catch(e){return e.message}}),'denied');
 console.log('PASS 3 Chromium contexts + real local SQL: owner/editor/read, stale revision conflict, polling convergence, private-note filtering, rotation; RPC calls:',calls);
 }finally{if(browser)await browser.close();await db.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
