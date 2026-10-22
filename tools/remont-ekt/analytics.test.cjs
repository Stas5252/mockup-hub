'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
const site=path.resolve(__dirname,'../../mockups/remont-ekt-motion');
assert(fs.existsSync(path.join(site,'analytics.js')),'Dormant analytics adapter is missing');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
  for(const variant of ['disabled','no-consent','preview','active']){
   const context=await browser.newContext();const page=await context.newPage();const external=[];
   await context.route('**/*',route=>{if(route.request().resourceType()==='document')return route.fulfill({contentType:'text/html',body:'<link rel="canonical" href="https://remontekt.ru/uslugi/kapitalnyy-remont/"><a href="tel:+79220344727">call</a><a href="https://t.me/remontekt">telegram</a><a href="https://wa.me/79220344727">whatsapp</a>'});external.push(route.request().url());return route.abort()});
   await page.goto((variant==='preview'?'https://example.org/':'https://remontekt.ru/')+'?contact=private@example.com#secret');
   await page.evaluate(variant=>{window.calls=[];window.ym=(...args)=>window.calls.push(['ym',...args]);window.gtag=(...args)=>window.calls.push(['gtag',...args]);window.RemontAnalyticsConfig={enabled:variant!=='disabled',metrikaId:123456,ga4Id:'G-TEST12345'}},variant);
   await page.addScriptTag({content:fs.readFileSync(path.join(site,'analytics.js'),'utf8')});
   await page.evaluate(variant=>{
    const api=window.RemontAnalytics;api.track('contact_phone',{contact:'private@example.com'});
    if(variant!=='no-consent')api.setConsent(true);
    api.track('not_allowed');api.track('contact_phone',{contact:'private@example.com'});
    window.dispatchEvent(new Event('remontekt:form-submit'));
    window.dispatchEvent(new Event('remontekt:lead-success'));
   },variant);
   const calls=await page.evaluate(()=>window.calls);assert.equal(calls.length,variant==='active'?6:0,variant);
   assert(!JSON.stringify(calls).includes('private@example.com'));assert(!JSON.stringify(calls).includes('#secret'));
   if(variant==='active'){
    assert.equal(calls.filter(x=>x.includes('generate_lead')).length,2);
    assert(calls.every(x=>JSON.stringify(x).includes('/uslugi/kapitalnyy-remont/')));
    await page.evaluate(()=>{window.RemontAnalytics.setConsent(false);window.RemontAnalytics.track('contact_phone')});assert.equal((await page.evaluate(()=>window.calls)).length,6);
   }
   assert.equal(external.length,0);assert.deepEqual(await context.cookies(),[]);assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);await context.close();
  }
  console.log('PASS: analytics disabled/no-consent/preview fail closed; allowed events only, no PII/query/referrer, consent revocation and no storage/network.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
