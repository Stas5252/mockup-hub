'use strict';
// Browser regression probe. Requires Playwright and Chromium in the QA environment.
// Serve a production export, then set TEST_URL (no form submissions are sent).
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const root=process.env.TEST_URL||'http://127.0.0.1:3014/';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.route('**/app.js?*',async route=>{
   const response=await route.fetch();
   const body=`window.__startup={rewrites:0,configurations:0};new MutationObserver(entries=>window.__startup.rewrites+=entries.length).observe(document.querySelector('.gallery-track'),{subtree:true,childList:true,characterData:true});\n`+(await response.text()).replace('function configureGallery(){','function configureGallery(){window.__startup.configurations++;');
   await route.fulfill({response,body});
  });
  await page.route('**/vendor/*',async route=>{await new Promise(resolve=>setTimeout(resolve,700));try{await route.continue()}catch{}});
  await page.route('**/request.php',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({token:'qa-only',requestId:'qa-only',consentVersion:'2026-10-14-mail'})}));
  await page.goto(root,{waitUntil:'domcontentloaded'});
  assert.deepEqual(await page.evaluate(()=>window.__startup),{rewrites:0,configurations:0});
  await page.locator('.hero-actions [data-request]').click();
  assert(await page.locator('#request-dialog').evaluate(el=>el.open));
  assert(!(await page.locator('[name=consent]').isChecked()));
  await page.keyboard.press('Escape');await page.locator('.menu-button').click();
  assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'),'true');
  await page.unrouteAll({behavior:'ignoreErrors'});await page.close();

  const refresh=await browser.newPage({viewport:{width:390,height:844}});
  await refresh.addInitScript(()=>{window.__refreshCount=0;window.__ready=false;window.addEventListener('site-ready',()=>window.__ready=true)});
  await refresh.route('**/app.js?*',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replaceAll('ScrollTrigger.refresh()','(window.__refreshCount++,ScrollTrigger.refresh())')})});
  await refresh.route('**/vendor/*',async route=>{await new Promise(resolve=>setTimeout(resolve,600));await route.continue()});
  await refresh.goto(root);await refresh.waitForFunction(()=>window.__ready);await refresh.waitForTimeout(200);
  assert.equal(await refresh.evaluate(()=>document.fonts.status),'loaded');
  assert.equal(await refresh.evaluate(()=>window.__refreshCount),1,'Already loaded fonts and native window load must not cause redundant explicit refreshes');
  await refresh.close();
  const offscreen=await browser.newPage({viewport:{width:390,height:844}}),decorativeFonts=[];
  offscreen.on('request',request=>{if(request.url().includes('font-6.woff2'))decorativeFonts.push(request.url())});
  await offscreen.goto(root);await offscreen.evaluate(()=>document.fonts.ready);await offscreen.waitForTimeout(2500);
  assert.equal(decorativeFonts.length,0,'The offscreen fixed-size frame must not load its decorative font during the hero');
  await offscreen.locator('.control-interior').scrollIntoViewIfNeeded();
  await offscreen.waitForFunction(()=>document.fonts.check('500 37px Caveat'));
  assert.equal(decorativeFonts.length,1,'The original font must load when relevant');await offscreen.close();
  console.log('PASS: intact static gallery, immediate controls, one explicit loaded-font refresh.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exit(1)});
