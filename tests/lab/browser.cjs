/* Run with Playwright installed; real browser, external network entirely aborted. */
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const {build}=require('../../scripts/lab/build.cjs');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
(async()=>{const root=build('staging/local.example.json');
 const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(file))}catch{res.writeHead(404).end()}});
 await new Promise(r=>server.listen(4173,'127.0.0.1',r));let browser;
 try{browser=await chromium.launch({headless:true});const context=await browser.newContext();
 let external=0;await context.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin==='http://127.0.0.1:4173')return route.continue();external++;return route.abort()});
 await context.addInitScript(()=>{if(!localStorage.getItem('aracne-welcome-v5')){localStorage.setItem('aracne-beta-token-v1','PRODUCTION_SENTINEL');localStorage.setItem('aracne-lab:v1:aracne-welcome-v5','seen')}});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/dist/index.html');await page.waitForFunction(()=>!!window.aracneV5);
 await page.evaluate(()=>window.aracneV5.openTrips());page.once('dialog',d=>d.accept('LAB Trip A'));await page.click('#v5New');
 const id=await page.evaluate(()=>localStorage.getItem('aracne-v5-active'));assert.ok(id);
 for(const lang of ['it','en','es','fr']){await page.selectOption('#language',lang);await page.waitForFunction(l=>document.documentElement.lang===l&&!!window.aracneV5,lang);assert.equal(await page.evaluate(()=>localStorage.getItem('aracne-v5-active')),id)}
 await context.setOffline(true);
 await page.evaluate(()=>window.aracneV5.openTrips());page.once('dialog',d=>d.accept('LAB Offline Trip'));await page.click('#v5New');
 assert.notEqual(await page.evaluate(()=>localStorage.getItem('aracne-v5-active')),id);
 await context.setOffline(false);await page.reload();await page.waitForFunction(()=>!!window.aracneV5);
 await page.evaluate(()=>window.aracneV5.openTrips());await page.click(`[data-v5-trip="${id}"]`);
 assert.equal(await page.evaluate(()=>localStorage.getItem('aracne-v5-active')),id);
 const blocked=await page.evaluate(async()=>{try{await fetch('https://cpnjdyhsepytphwlenbg.supabase.co');return false}catch(e){return e.message.includes('NETWORK_BLOCKED')}});assert.ok(blocked);
 assert.deepEqual(errors,[]);console.log('PASS browser: four languages, trip creation/switching, offline creation/reload, network guard; external requests aborted:',external);
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
