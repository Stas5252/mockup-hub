'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const site=path.resolve(__dirname,'../../../mockups/remont-ekt-motion');
const expected=['uslugi/','sovety/',...JSON.parse(fs.readFileSync(path.join(__dirname,'services.json'))).map(s=>'uslugi/'+s.slug+'/'),...fs.readdirSync(path.join(__dirname,'content')).filter(s=>s.endsWith('.json')).map(s=>'sovety/'+s.slice(0,-5)+'/')];
for(const route of expected)assert(fs.existsSync(path.join(site,route,'index.html')),'Crawlable static page missing: '+route);
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'remontekt-seo-test-'));
try{
 execFileSync(process.execPath,[path.resolve(__dirname,'../prepare.cjs'),'--output',temp],{stdio:'pipe'});
 const sitemap=fs.readFileSync(path.join(temp,'sitemap.xml'),'utf8');const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 const expectedCount=1+expected.length;assert.equal(urls.length,expectedCount,'Home, hubs, services and all articles');assert.equal(new Set(urls).size,expectedCount);
 assert(!/privacy|consent|request\.php|company|\.txt|\?/.test(urls.join('\n')),'No non-indexable pages or proof files');
 const names=new Set();for(const route of expected){
  const prod=fs.readFileSync(path.join(temp,route,'index.html'),'utf8'),preview=fs.readFileSync(path.join(site,route,'index.html'),'utf8');
  assert(prod.includes('<meta name="robots" content="index,follow">'),route+' production robots');
  assert(preview.includes('<meta name="robots" content="noindex,follow">'),route+' preview robots');
  assert(prod.includes('rel="canonical" href="https://remontekt.ru/'+route+'"'),route+' canonical');
  assert.equal((prod.match(/<h1\b/g)||[]).length,1,route+' one primary heading');
  const title=prod.match(/<title>(.*?)<\/title>/)[1];assert(!names.has(title),route+' unique title');names.add(title);
  assert(prod.includes('href="../../#contacts" data-request-link')||prod.includes('href="../#contacts" data-request-link'),route+' no-JS contact fallback with enhanced form entry');
  assert(!/src="\/(?:assets|editorial)/.test(prod),'Local assets keep preview prefix');
  for(const m of prod.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
   JSON.parse(m[1]);const hash=require('node:crypto').createHash('sha256').update(m[1]).digest('base64');assert(fs.readFileSync(path.join(temp,'.htaccess'),'utf8').includes(hash),route+' CSP hash');
  }
 }
 const notFound=fs.readFileSync(path.join(temp,'404.html'),'utf8'),missing='https://remontekt.ru/sovety/missing/';
 assert(!notFound.includes('<base'),'404 must preserve same-page fragment navigation');
 for(const [,url] of notFound.matchAll(/<link rel="stylesheet" href="([^"]+)"/g))assert.equal(new URL(url,missing).pathname.split('/').length,2,'404 styles must load at any depth');
 assert(notFound.includes('href="#document"'),'404 skip link remains local');
 assert(notFound.includes('href="/" aria-label="На главную'),'404 home link resolves to site root');
 assert(fs.readFileSync(path.join(temp,'index.html'),'utf8').includes('href="sovety/"'),'Home discovers article hub');
 const articleCount=expected.filter(route=>/^sovety\/[^/]+\/$/.test(route)).length;
 assert(fs.readFileSync(path.join(temp,'sovety/index.html'),'utf8').includes('Материалов: '+articleCount),'Visible article count follows the actual catalogue');
 console.log('PASS: all generated pages, preview/production robots, unique titles, canonical sitemap, CSP and nested links.');
}finally{fs.rmSync(temp,{recursive:true,force:true})}
