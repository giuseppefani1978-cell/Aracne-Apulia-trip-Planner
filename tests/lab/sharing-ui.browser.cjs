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
 let queue=Promise.resolve(),calls=0,cut=false;
 const allowed=new Set(['p_action','p_id','p_token','p_document','p_revision','p_edit','p_read','p_name','p_actor','p_events','p_since_event','p_version_id','p_label','p_workspace_id','p_workspace_token']);
 browser=await chromium.launch({headless:true, ...(process.env.ARACNE_CHROMIUM_PATH ? {executablePath:process.env.ARACNE_CHROMIUM_PATH} : {})});const pages=[];
 for(const lang of ['fr','it','en']){
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.origin==='http://127.0.0.1:4173')return route.continue();
 if(u.origin!=='http://127.0.0.1:54321')return route.abort();
 if(cut)return route.abort();
 if(u.pathname!=='/rest/v1/rpc/aracne_trip_v5')return route.fulfill({json:{error:'denied'}});
 const body=route.request().postDataJSON(),keys=Object.keys(body);assert.ok(keys.every(k=>allowed.has(k)));
 const task=queue.then(async()=>{calls++;return db.transaction(async tx=>{await tx.exec('SET LOCAL ROLE anon');const result=await tx.query('SELECT public.aracne_trip_v5('+keys.map((k,i)=>`${k}=>$${i+1}`).join(',')+') AS r',keys.map(k=>body[k]));return result.rows[0].r})});queue=task.catch(()=>{});
 try{await route.fulfill({json:await task})}catch(e){await route.fulfill({status:500,json:{error:e.message}})}
 });
 await context.addInitScript(()=>{localStorage.setItem('aracne-lab:v1:aracne-welcome-v5','seen');navigator.share=async payload=>{window.testSharedURL=payload.url}});
 const page=await context.newPage();page.setDefaultTimeout(15000);await page.goto('http://127.0.0.1:4173/dist/'+(lang==='fr'?'index.html':`index.${lang}.html`));await page.waitForFunction(()=>!!window.aracneShared);pages.push(page);
 }
 const [a,b,r]=pages;
 if(await a.locator('#modal').evaluate(e=>e.open))await a.click('#closeModal');
 await a.click('#v51Trips');a.once('dialog',d=>d.accept('LAB UI Journey'));await a.click('#v5New');
 await a.click('#v51Invite');await a.waitForSelector('#v51Edit');await a.click('#v51Edit');
 console.log('UI share ready');const editLink=await a.evaluate(()=>window.testSharedURL);assert.ok(editLink.includes('#trip='));
 await a.click('#v51Read');const readLink=await a.evaluate(()=>window.testSharedURL);assert.notEqual(readLink,editLink);
 b.once('dialog',d=>d.accept());await b.goto(editLink);await b.waitForFunction(()=>window.aracneShared?.getSession()?.role==='edit');
 r.once('dialog',d=>d.accept());await r.goto(readLink);await r.waitForFunction(()=>window.aracneShared?.getSession()?.role==='read');
 console.log('UI guests joined');assert.equal(new URL(b.url()).hash,'','capability removed after join');assert.equal(new URL(r.url()).hash,'');
 assert.equal(await b.locator('#v51Name').textContent(),'LAB UI Journey');
 await a.click('#closeModal');await a.click('#tripMenu');a.once('dialog',d=>d.accept('LAB Renamed through UI'));await a.click('#v5Rename');await a.click('#closeModal');
 await b.waitForFunction(()=>document.querySelector('#v51Name').textContent==='LAB Renamed through UI');
 await r.waitForFunction(()=>document.querySelector('#v51Name').textContent==='LAB Renamed through UI');
 console.log('UI rename propagated');
 // Reader has no destructive trip controls in the rendered management dialog.
 await r.click('#tripMenu');assert.equal(await r.locator('#v5Delete').count(),0);assert.equal(await r.locator('#v5Rename').count(),0);await r.click('#closeModal');
 // Disconnect only the local RPC bridge, leaving the UI available.
 cut=true;await a.click('#tripMenu');a.once('dialog',d=>d.accept('LAB Offline rename'));await a.click('#v5Rename');await a.click('#closeModal');
 await a.waitForFunction(()=>window.aracneShared._status()==='offline');
 assert.equal(await a.locator('#v51Name').textContent(),'LAB Renamed through UI');
 assert.equal(await b.locator('#v51Name').textContent(),'LAB Renamed through UI');
 cut=false;
 await a.waitForFunction(()=>window.aracneShared._status()==='synced');
 await a.click('#tripMenu');a.once('dialog',d=>d.accept('LAB Offline rename'));await a.click('#v5Rename');await a.click('#closeModal');
 await b.waitForFunction(()=>document.querySelector('#v51Name').textContent==='LAB Offline rename',{},{timeout:20000});
 await r.waitForFunction(()=>document.querySelector('#v51Name').textContent==='LAB Offline rename',{},{timeout:20000});
 await a.reload();await a.waitForFunction(()=>window.aracneShared?.getSession()?.role==='owner');assert.equal(await a.locator('#v51Name').textContent(),'LAB Offline rename');
 console.log('PASS UI: new trip, edit/read share buttons, invitation joins, secret hash cleanup, rename propagation, reader controls, offline rename refusal and reconnect retry, owner reload');
 }finally{if(browser)await browser.close();await db.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
