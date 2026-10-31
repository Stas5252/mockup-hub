'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=__dirname,site=path.resolve(base,'../../../mockups/remont-ekt-motion');
const articleDir=path.join(base,'content');
const files=fs.existsSync(articleDir)?fs.readdirSync(articleDir).filter(f=>f.endsWith('.json')):[];
assert(files.length>=15,'Keep at least the original fifteen substantive articles');
const articles=files.map(f=>JSON.parse(fs.readFileSync(path.join(articleDir,f),'utf8')));
const services=JSON.parse(fs.readFileSync(path.join(base,'services.json'),'utf8'));
assert.equal(services.length,5,'Five distinct service landing pages');
const slugs=new Set(articles.map(a=>a.slug)),serviceSlugs=new Set(services.map(s=>s.slug));
assert.equal(slugs.size,files.length,'Unique article routes');assert.equal(serviceSlugs.size,5);
const titles=new Set();
for(const item of [...articles,...services]){
 assert(/^[a-z0-9-]+$/.test(item.slug),item.slug);
 assert(!titles.has(item.title),'Unique visible titles');titles.add(item.title);
 assert(item.description.length>=70&&item.description.length<=240,item.slug+' description');
 assert(item.seoTitle&&item.keywords.length>=2,item.slug+' search mapping');
 for(const date of [item.published,item.modified].filter(Boolean))assert(/^\d{4}-\d{2}-\d{2}$/.test(date)&&new Date(date).toISOString().slice(0,10)===date,item.slug+' valid date');
 assert(!item.modified||item.modified>=item.published,item.slug+' modification follows publication');
 assert(item.sections.length>=6,item.slug+' standalone sections');
 const headings=new Set(item.sections.map(s=>s.id));assert.equal(headings.size,item.sections.length,item.slug+' unique anchors');
 assert(item.sections.every(s=>s.title&&s.paragraphs?.length>=1),item.slug+' paragraphs');
 for(const photo of item.images){assert(fs.existsSync(path.join(site,'assets',photo.src)),photo.src);assert(photo.alt&&photo.caption.includes('портфолио'),item.slug+' honest image context')}
 assert(item.images.length>=2,item.slug+' photos');
 for(const source of item.sources||[])assert(source.url.startsWith('https://'),item.slug+' reference');
 if(slugs.has(item.slug)){
  const text=[item.intro,...item.sections.flatMap(s=>[...s.paragraphs,...(s.list||[]),...(s.table?.rows?.flat()||[])]),...item.faq.map(f=>f.q+' '+f.a)].join(' ');
  assert(text.length>=4000,item.slug+' substantive body ('+text.length+' chars)');
  assert(item.faq.length>=2,item.slug+' useful questions');
  assert(serviceSlugs.has(item.service),item.slug+' relevant service');
  assert(item.related.length>=2&&item.related.every(s=>slugs.has(s)&&s!==item.slug),item.slug+' related articles');
 }
}
console.log(`PASS: ${articles.length} articles, 5 services, unique routes/headings, substantive text, original photos, related links.`);
