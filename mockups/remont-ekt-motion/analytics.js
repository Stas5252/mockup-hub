'use strict';
(()=>{
 const config=window.RemontAnalyticsConfig||{},production=location.hostname==='remontekt.ru';
 const events=new Set(['request_open','form_submit','generate_lead','contact_phone','contact_telegram','contact_whatsapp','contact_email']);
 let consent=false;
 function pagePath(){
  try{const canonical=new URL(document.querySelector('link[rel="canonical"]')?.href||'https://remontekt.ru/');return canonical.origin==='https://remontekt.ru'&&/^\/[a-z0-9/-]*$/.test(canonical.pathname)?canonical.pathname:'/'}catch{return '/'}
 }
 function track(name){
  if(!production||config.enabled!==true||!consent||!events.has(name))return false;
  const path=pagePath();let sent=false;
  // SDKs are installed separately with real accounts and consent controls.
  // There is deliberately no pre-consent queue, SDK loader or persistent storage.
  if(Number.isSafeInteger(config.metrikaId)&&config.metrikaId>0&&typeof window.ym==='function')try{window.ym(config.metrikaId,'reachGoal',name,{page_path:path});sent=true}catch{}
  if(/^G-[A-Z0-9]+$/.test(config.ga4Id||'')&&typeof window.gtag==='function')try{window.gtag('event',name,{send_to:config.ga4Id,page_location:'https://remontekt.ru'+path,page_referrer:'',page_path:path});sent=true}catch{}
  return sent;
 }
 window.RemontAnalytics=Object.freeze({setConsent(value){consent=value===true},track});
 window.addEventListener('remontekt:request-open',()=>track('request_open'));
 window.addEventListener('remontekt:form-submit',()=>track('form_submit'));
 window.addEventListener('remontekt:lead-success',()=>track('generate_lead'));
 document.addEventListener('click',event=>{
  const link=event.target.closest?.('a[href]');if(!link)return;
  try{const target=new URL(link.href,location.href);if(target.protocol==='tel:')track('contact_phone');else if(target.protocol==='mailto:')track('contact_email');else if(target.protocol==='https:'&&['t.me','telegram.me'].includes(target.hostname))track('contact_telegram');else if(target.protocol==='https:'&&['wa.me','api.whatsapp.com','web.whatsapp.com'].includes(target.hostname))track('contact_whatsapp')}catch{}
 });
})();
