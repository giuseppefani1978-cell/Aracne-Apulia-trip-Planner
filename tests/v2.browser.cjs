/* Run against: python3 -m http.server 8765
 * npm install --no-save playwright && npx playwright install chromium
 * CHROMIUM_PATH=/path/to/chrome node tests/v2.browser.cjs (optional override)
 */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 try{
 for(const locale of ['fr','it','en','es']){
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  // Deliberately offline map dependencies: the complete list must still work.
  await page.route('https://**/*',r=>r.abort());
  await page.goto('http://127.0.0.1:8765/dist/'+(locale==='fr'?'index.html':`index.${locale}.html`));
  await page.waitForSelector('#tourNext');
  assert.equal(await page.locator('#modal').evaluate(e=>e.open),true);
  await page.locator('#tourNext').click();await page.locator('#tourBack').click();await page.locator('#tourSkip').click();
  await page.locator('[data-view="map"]').click();
  await page.waitForFunction(()=>document.querySelectorAll('#places .place').length===53);
  await page.locator('[data-category="spa"]').click();assert.equal(await page.locator('#places .place').count(),5);
  assert.equal(await page.locator('#places .place a').count(),5);
  await page.locator('[data-add="spa-vair"]').click();await page.locator('#confirmAdd').click();
  await page.locator('[data-add="spa-coccaro"]').click();await page.locator('#confirmAdd').click();
  await page.locator('[data-view="plan"]').click();
  assert.equal(await page.locator('[data-duration]').count(),2);
  await page.locator('[data-duration="0"]').fill('240');await page.locator('[data-duration="0"]').dispatchEvent('change');
  await page.locator('[data-travel="1"]').fill('35');await page.locator('[data-travel="1"]').dispatchEvent('change');
  let sum=await page.evaluate(()=>aracneV2Test.totals(state.plan[0]));assert.equal(sum.visit,390);assert.equal(sum.travel,35);assert.equal(sum.occupied,425);
  await page.reload();await page.locator('[data-view="plan"]').click();assert.equal(await page.locator('[data-duration="0"]').inputValue(),'240');assert.equal(await page.locator('[data-travel="1"]').inputValue(),'35');
  const check=await page.evaluate(()=>{
   const a={uid:'a',id:'p0',lat:41.88,lon:16.17,duration:120,time:'10:00'},b={uid:'b',id:'p6',lat:42.12,lon:15.5,duration:180,time:'11:00'};
   const island=aracneV2Test.totals([a,b]);state.transport='transit';const transit=aracneV2Test.totals(state.plan[0]);state.transport='driving';
   const invalid=JSON.parse(JSON.stringify(state));invalid.plan[0][0].duration=-1;let rejected=false;try{validate(invalid)}catch{rejected=true}
   return {island,transit,rejected,shared:shareText('all',false)};
  });assert.equal(check.island.missing,1);assert.equal(check.transit.missing,1);assert.equal(check.rejected,true);assert.ok(check.shared.includes('7 h 05'));
  await page.locator('[data-up="1"]').click();sum=await page.evaluate(()=>aracneV2Test.totals(state.plan[0]));assert.notEqual(sum.travel,35);
  await page.locator('#sharePlan').click();assert.equal(await page.locator('.v2Group').count(),1);await page.locator('#closeModal').click();
  await page.locator('#addManual').click();await page.locator('#stepName').fill('Manual <script> example');await page.locator('#stepForm button.primary').click();assert.equal(await page.locator('[data-duration]').count(),3);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:`/tmp/aracne-v2-${locale}.png`,fullPage:true});
  assert.deepEqual(errors,[]);console.log(locale+': passed (intro, 53 places, spa filter, timing, persistence, transit, islands, reorder, share, manual, mobile width)');
  await context.close();
 }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
