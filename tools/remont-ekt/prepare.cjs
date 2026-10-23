'use strict';
// Run after editing the project/review data: node tools/remont-ekt/prepare.cjs
// Optional production export: node tools/remont-ekt/prepare.cjs --output /path/to/site
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),site=path.join(root,'mockups/remont-ekt-motion');
const {generate,scriptHashes,pageDates,homeArticles}=require('./seo/generate.cjs');
const app=fs.readFileSync(path.join(site,'app.js'),'utf8');
const data=vm.runInNewContext(app.slice(app.indexOf('const projects ='),app.indexOf('const services='))+'\nJSON.stringify({projects,reviews})');
const {projects,reviews}=JSON.parse(data);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow='<span aria-hidden="true"><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span>';
const cards=projects.map(p=>{const label=[p.label,p.location].filter(Boolean).join(' · ');return `<button class="project real-project" data-project-id="${esc(p.id)}" style="--photo-aspect:${p.aspect}"><div class="project-image"><img src="assets/${esc(p.image)}" alt="" width="${p.width}" height="${p.height}" draggable="false" loading="lazy" decoding="async"></div><div class="project-meta"><div><h3 id="project-${esc(p.id)}-title">${esc(p.title)}</h3><p id="project-${esc(p.id)}-meta">${esc(label)}</p></div>${arrow}</div></button>`}).join('');
const slides=reviews.map((r,i)=>`<article class="review"><blockquote>${esc('«'+r.text+'»')}</blockquote><p class="review-name">${esc(r.name)}</p><p class="review-source">${esc('2ГИС · '+r.displayDate)}</p><p class="review-rating" aria-label="Рейтинг 5 из 5">★★★★★<span>5,0</span></p></article>`).join('');
const dots=reviews.map((r,i)=>`<button${i===0?' class="active"':''} aria-label="${esc('Отзыв '+(i+1)+': '+r.name)}" aria-pressed="${i===0}">${i+1}</button>`).join('');
function fill(html,cls,content,attrs=''){
 const start=`<div class="${cls}"${attrs}>`,i=html.indexOf(start);
 if(i<0)throw Error('Missing '+cls);
 let depth=1,pos=i+start.length,end=pos;const tag=/<\/?div\b[^>]*>/g;tag.lastIndex=pos;
 for(let m;(m=tag.exec(html));){depth+=m[0].startsWith('</')?-1:1;if(depth===0){end=m.index;break}}
 if(depth!==0)throw Error('Unbalanced '+cls);
 return html.slice(0,pos)+content+html.slice(end);
}
let html=fs.readFileSync(path.join(site,'index.html'),'utf8');
html=fill(html,'gallery-track',cards);
html=fill(html,'review-track',slides);
html=fill(html,'review-dots',dots,' role="group" aria-label="Выбрать отзыв"');
const featured=/<!-- home-articles:start -->[\s\S]*?<!-- home-articles:end -->/;
if(!featured.test(html))throw Error('Missing featured articles slot');
html=html.replace(featured,'<!-- home-articles:start -->\n'+homeArticles()+'\n<!-- home-articles:end -->');
fs.writeFileSync(path.join(site,'index.html'),html);
generate(site,false);
const arg=process.argv.indexOf('--output');
if(arg!==-1){
 if(!process.argv[arg+1])throw Error('--output needs a directory');
 const output=path.resolve(process.argv[arg+1]);
 if(output===path.parse(output).root||output===root||root.startsWith(output+path.sep)||output.startsWith(root+path.sep))throw Error('Export must be a separate directory outside the source website, not a parent of the repository');
 fs.mkdirSync(output,{recursive:true});fs.cpSync(site,output,{recursive:true});
 const origin='https://remontekt.ru',canonical=origin+'/';
 const schema={
  '@context':'https://schema.org','@type':'HomeAndConstructionBusiness','@id':canonical+'#business',
  name:'РЕМОНТ-ЕКТ',legalName:'Индивидуальный предприниматель Мягков Евгений Игоревич',
  url:canonical,image:origin+'/assets/hero-daylight.jpg',logo:origin+'/assets/logo.svg',
  telephone:'+7-922-034-47-27',email:'dom196@list.ru',taxID:'741304668607',
  identifier:{'@type':'PropertyValue',propertyID:'ОГРНИП',value:'315745600031345'},
  address:{'@type':'PostalAddress',streetAddress:'ул. Тверитина, 44, офис 1006',addressLocality:'Екатеринбург',addressCountry:'RU'},
  areaServed:{'@type':'City',name:'Екатеринбург'},
  openingHoursSpecification:{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],opens:'09:00',closes:'21:00'},
  sameAs:['https://t.me/remontekt','https://2gis.ru/ekaterinburg/geo/70000001006578256','https://yandex.ru/navi/org/remont_yekt/216407043353']
 };
 const json=JSON.stringify({'@context':'https://schema.org','@graph':[schema,{'@type':'WebSite','@id':canonical+'#website',url:canonical,name:'РЕМОНТ-ЕКТ',inLanguage:'ru-RU',publisher:{'@id':canonical+'#business'}}]}).replace(/</g,'\\u003c');
 const meta=`<link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}"><meta property="og:site_name" content="РЕМОНТ-ЕКТ"><meta property="og:image" content="${origin}/assets/hero-daylight.jpg"><meta property="og:image:width" content="1593"><meta property="og:image:height" content="987"><meta property="og:image:alt" content="Светлый интерьер на главной странице РЕМОНТ-ЕКТ"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${json}</script>`;
 fs.writeFileSync(path.join(output,'index.html'),html.replace('<meta name="robots" content="noindex,follow">','<meta name="robots" content="index,follow">').replace('</head>',meta+'</head>'));
 fs.writeFileSync(path.join(output,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n');
 const editorialUrls=generate(output,true);
 fs.writeFileSync(path.join(output,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+[canonical,...editorialUrls].map(url=>'<url><loc>'+url+'</loc>'+(pageDates()[new URL(url).pathname]?'<lastmod>'+pageDates()[new URL(url).pathname]+'</lastmod>':'')+'</url>').join('')+'</urlset>\n');
 const errorPage=fs.readFileSync(path.join(site,'company.html'),'utf8').replace(/<title>[^<]*<\/title>/,'<title>404 — РЕМОНТ-ЕКТ</title>').replace(/<main[\s\S]*?<\/main>/,'<main class="legal-main container" id="document"><p class="eyebrow">404</p><h1>Страница не найдена</h1><p><a href="./">РЕМОНТ-ЕКТ — главная</a></p></main>');
 // ErrorDocument may be served at any depth. Keep fragment links local while
 // resolving its styles, logo and home navigation from the site root.
 const rootErrorPage=errorPage.replace(/\b(href|src)="([^\"]*)"/g,(all,attribute,url)=>{
  if(/^(?:[a-z]+:|\/|#)/i.test(url))return all;
  const absolute='/'+url.replace(/^(?:\.\/|index\.html)/,'');
  return `${attribute}="${absolute}"`;
 });
 fs.writeFileSync(path.join(output,'404.html'),rootErrorPage);
 const hashes=scriptHashes(output).map(hash=>`'sha256-${hash}'`).join(' ');
 const csp=`default-src 'self'; script-src 'self' ${hashes}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests`;
 fs.copyFileSync(path.join(__dirname,'apache.htaccess'),path.join(output,'.htaccess'));
 fs.writeFileSync(path.join(output,'.htaccess'),fs.readFileSync(path.join(output,'.htaccess'),'utf8').replace('{{CSP}}',csp));
 fs.copyFileSync(path.join(__dirname,'nginx.conf.example'),path.join(output,'nginx.conf.example'));
 fs.writeFileSync(path.join(output,'nginx.conf.example'),fs.readFileSync(path.join(output,'nginx.conf.example'),'utf8').replace('{{CSP}}',csp));
 fs.copyFileSync(path.join(__dirname,'HOSTING.md'),path.join(output,'HOSTING.md'));
 const files=[];
 function walk(dir){fs.chmodSync(dir,0o755);for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else{fs.chmodSync(full,0o644);if(entry.name!=='SHA256SUMS')files.push(full)}}}walk(output);
 fs.writeFileSync(path.join(output,'SHA256SUMS'),files.sort().map(f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')+'  '+path.relative(output,f)).join('\n')+'\n');
 console.log('Production export: '+output);
}
console.log(`Static content: ${projects.length} projects, ${reviews.length} reviews; original images retained.`);
