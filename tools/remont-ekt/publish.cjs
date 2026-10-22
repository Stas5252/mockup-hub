'use strict';
// Final post-deployment step. Dry run unless --submit is supplied.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ORIGIN='https://remontekt.ru',ENDPOINT='https://api.indexnow.org/indexnow';
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
function canonical(value){const url=new URL(value);if(url.origin!==ORIGIN||url.username||url.password||url.search||url.hash||!/^\/(?:[a-z0-9-]+\/)*$/.test(url.pathname)||url.href!==value)throw Error('Non-canonical sitemap URL: '+value);return url}
function digest(html){const clean=html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,''),body=clean.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1]||clean;return hash(JSON.stringify({title:html.match(/<title>([\s\S]*?)<\/title>/i)?.[1],description:html.match(/<meta name="description" content="([^"]*)"/i)?.[1],schema:[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(x=>x[1]),text:body.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim(),images:[...body.matchAll(/<img\b[^>]*>/gi)].map(x=>[x[0].match(/\bsrc="([^"]*)"/)?.[1],x[0].match(/\balt="([^"]*)"/)?.[1]]),links:[...body.matchAll(/<a\b[^>]*href="([^"]*)"/gi)].map(x=>x[1])}))}
function atomic(file,data){const tmp=file+'.tmp-'+process.pid;fs.writeFileSync(tmp,JSON.stringify(data,null,2)+'\n',{mode:0o600});fs.renameSync(tmp,file)}
async function publish({site,state,keyFile,submit=false,request=fetch}){
 site=fs.realpathSync(site);state=path.resolve(state);let ancestor=path.dirname(state),tail=[];while(!fs.existsSync(ancestor)){tail.unshift(path.basename(ancestor));ancestor=path.dirname(ancestor)}state=fs.existsSync(state)?fs.realpathSync(state):path.join(fs.realpathSync(ancestor),...tail,path.basename(state));if(state===site||state.startsWith(site+path.sep))throw Error('State must be private, outside the public site');
 const urls=[...fs.readFileSync(path.join(site,'sitemap.xml'),'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);if(!urls.length||urls.length>10000||new Set(urls).size!==urls.length)throw Error('Invalid sitemap URL inventory');
 const content={},hashes={};for(const value of urls){const url=canonical(value),file=fs.realpathSync(path.join(site,url.pathname,'index.html'));if(!file.startsWith(site+path.sep))throw Error('Page escapes site');const html=fs.readFileSync(file,'utf8');if(!html.includes('rel="canonical" href="'+value+'"')||!html.includes('name="robots" content="index,follow"'))throw Error('Non-indexable page: '+value);content[value]=html;hashes[value]=digest(html)}
 const previous=fs.existsSync(state)?JSON.parse(fs.readFileSync(state,'utf8')):{version:1,hashes:{}};if(previous.version!==1||previous.host&&previous.host!=='remontekt.ru')throw Error('Unrecognized publication state');
 Object.keys(previous.hashes).forEach(canonical);
 const changed=urls.filter(url=>previous.hashes[url]!==hashes[url]),deleted=Object.keys(previous.hashes).filter(url=>!(url in hashes)),pending=[...changed,...deleted];
 if(!submit||!pending.length)return {mode:submit?'unchanged':'dry-run',urls:pending};
 const key=fs.readFileSync(keyFile,'utf8').trim();if(!/^[a-zA-Z0-9-]{8,128}$/.test(key))throw Error('Invalid IndexNow key');
 fs.mkdirSync(path.dirname(state),{recursive:true,mode:0o700});const lock=state+'.lock';let fd;
 try{fd=fs.openSync(lock,'wx',0o600)}catch{throw Error('Publication is already running; inspect private lock before retrying')}
 async function get(url){return request(url,{redirect:'manual',headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(30000)})}
 const keyLocation=ORIGIN+'/'+key+'.txt';
 try{
  // A second process could have acknowledged while this one prepared its diff.
  if(fs.existsSync(state)&&JSON.stringify(JSON.parse(fs.readFileSync(state,'utf8')))!==JSON.stringify(previous))throw Error('Publication state changed; run again');
  let response=await get(keyLocation);if(response.status!==200||(await response.text()).trim()!==key)throw Error('Live key proof mismatch');
  for(const url of changed){response=await get(url);if(/(?:^|[\s,:])(?:noindex|none)(?:$|[\s,;])/i.test(response.headers.get('X-Robots-Tag')||''))throw Error('Restrictive live robots header: '+url);if(response.status!==200||hash(await response.text())!==hash(content[url]))throw Error('Live build mismatch: '+url)}
  for(const url of deleted){response=await get(url);if(![404,410].includes(response.status))throw Error('Expected deleted URL status: '+url)}
  try{response=await request(ENDPOINT,{method:'POST',redirect:'manual',headers:{'Content-Type':'application/json; charset=utf-8'},body:JSON.stringify({host:'remontekt.ru',key,keyLocation,urlList:pending}),signal:AbortSignal.timeout(30000)})}catch(error){fs.appendFileSync(state+'.jsonl',JSON.stringify({time:new Date().toISOString(),endpoint:ENDPOINT,status:'network-error',urls:pending})+'\n',{mode:0o600});throw error}
  fs.appendFileSync(state+'.jsonl',JSON.stringify({time:new Date().toISOString(),endpoint:ENDPOINT,status:response.status,urls:pending})+'\n',{mode:0o600});
  if(![200,202].includes(response.status))throw Error('IndexNow HTTP '+response.status+'; not acknowledged. Respect Retry-After before retrying.');
  atomic(state,{version:1,host:'remontekt.ru',hashes,acceptedAt:new Date().toISOString(),status:response.status});
  return {mode:'submitted',status:response.status,keyVerificationPending:response.status===202,urls:pending};
 }finally{fs.closeSync(fd);fs.unlinkSync(lock)}
}
module.exports={publish,digest};
if(require.main===module){const args=process.argv.slice(2),option=name=>{const i=args.indexOf(name);return i<0?undefined:args[i+1]};if(!option('--site')||!option('--state')||args.includes('--submit')&&!option('--key-file')){console.error('Usage: node publish.cjs --site /export --state /private/indexnow.json [--key-file /proof.txt --submit]');process.exitCode=1}else publish({site:option('--site'),state:option('--state'),keyFile:option('--key-file'),submit:args.includes('--submit')}).then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>{console.error(e.message);process.exitCode=1})}
