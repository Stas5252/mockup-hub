(()=>{
'use strict';
const items=window.MONCEREE||[],reduce=matchMedia('(prefers-reduced-motion: reduce)'),$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const photo=(p,look=false)=>p.photo||'/mockup-hub/mockups/monceree/assets/'+(look?'look-':'')+p.slug+'.webp';
let selected=0;try{selected=clamp(Number(sessionStorage.getItem('monceree-print'))||0,0,items.length-1)}catch{}
const images=new WeakMap();
async function imageSwap(el,src,alt,animate=true){
 if(!el)return;const ticket=(images.get(el)||0)+1;images.set(el,ticket);
 try{const preload=new Image();preload.src=src;await preload.decode()}catch{return false}
 if(images.get(el)!==ticket)return false;
 el.src=src;el.alt=alt;
 const source=items.find(p=>p.photo===src);el.classList.toggle('brand-source',!!source);el.style.setProperty('--photo-y',source?.focus||'60%');
 if(animate&&!reduce.matches)el.animate([{opacity:.25,transform:'scale(1.035)'},{opacity:1,transform:'scale(1)'}],{duration:650,easing:'cubic-bezier(.19,1,.22,1)'});
 return true;
}
function toast(message){const el=$('.toast');if(!el)return;el.textContent=message;el.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('visible'),3500)}
function lock(){document.body.classList.toggle('modal-open',!!$('dialog[open]'))}
const closing=new WeakMap();
function closeDialog(dialog,origin){if(!dialog?.open)return;clearTimeout(closing.get(dialog));dialog.classList.add('is-closing');closing.set(dialog,setTimeout(()=>{dialog.close();dialog.classList.remove('is-closing');lock();origin?.focus({preventScroll:true})},reduce.matches?0:dialog.id==='site-menu'?350:180))}
function openDialog(dialog){if(!dialog)return;clearTimeout(closing.get(dialog));dialog.classList.remove('is-closing');$$('dialog[open]').filter(d=>d!==dialog).forEach(d=>d.close());if(!dialog.open)dialog.showModal();lock()}
$$('dialog').forEach(d=>d.addEventListener('close',lock));

// A fullscreen menu, with a real focus trap provided by the native dialog.
const menu=$('#site-menu'),menuTrigger=$('[data-open-menu]');
menuTrigger?.addEventListener('click',()=>{openDialog(menu);menuTrigger.setAttribute('aria-expanded','true')});
function closeMenu(){closeDialog(menu,menuTrigger);menuTrigger?.setAttribute('aria-expanded','false')}
$('[data-close-menu]')?.addEventListener('click',closeMenu);menu?.addEventListener('cancel',e=>{e.preventDefault();closeMenu()});
menu?.addEventListener('close',()=>menuTrigger?.setAttribute('aria-expanded','false'));
$$('a',menu||document.createElement('div')).forEach(a=>a.addEventListener('click',()=>{menu?.close();menuTrigger?.setAttribute('aria-expanded','false');lock()}));
$$('[data-menu-image]').forEach(a=>{
 const preview=()=>imageSwap($('.menu-photo img'),'/mockup-hub/mockups/monceree/assets/'+a.dataset.menuImage+'.webp',a.textContent.trim(),true);
 a.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')preview()});a.addEventListener('focus',preview);
});

// One selection shared by hero, inspection, quick view and order links.
let spotlightView='product';
function refreshSpotlight(animate=true){
 const p=items[selected];if(!p)return;const stage=$('.spotlight-stage');if($('#home-order'))$('#home-order').href='/mockup-hub/mockups/monceree/contacts/?model='+p.slug;if(!stage)return;
 stage.classList.toggle('is-look',spotlightView==='look');
 const cutout=$('.spotlight-bag');cutout.className='spotlight-bag bag-cutout '+(selected<4?'original':'extra')+' pos-'+selected%4;cutout.setAttribute('aria-label',p.name+', вид спереди');cutout.setAttribute('aria-hidden',String(spotlightView==='look'));if(animate&&!reduce.matches)cutout.animate([{opacity:0,transform:'scale(.94) rotate(-5deg)'},{opacity:1,transform:'scale(1) rotate(0deg)'}],{duration:750,easing:'cubic-bezier(.19,1,.22,1)'});$('#spotlight-image').setAttribute('aria-hidden',String(spotlightView!=='look'));
 imageSwap($('#spotlight-image'),'/mockup-hub/mockups/monceree/assets/'+(spotlightView==='look'?'look-':'')+p.slug+'.webp',p.name+(spotlightView==='look'?' на модели':' крупным планом'),animate);
 const heading=$('#spotlight-name'),words=p.name.split(' '),accent=document.createElement('em');accent.textContent=words.pop();heading.replaceChildren();if(words.length)heading.append(document.createTextNode(words.join(' ')),document.createElement('br'));heading.append(accent);$('#spotlight-number').textContent=p.number;$('#spotlight-desc').textContent=p.description;
 $('#spotlight-page').href='/mockup-hub/mockups/monceree/product/'+p.slug+'/';$('#spotlight-order').href='/mockup-hub/mockups/monceree/contacts/?model='+p.slug;
 if($('#home-order'))$('#home-order').href='/mockup-hub/mockups/monceree/contacts/?model='+p.slug;
 $$('.spotlight-switch button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.spotlightView===spotlightView)));
 $('.spotlight-switch').dataset.view=spotlightView;
}
function setSelected(i,origin='other'){
 const n=((Number(i)||0)%items.length+items.length)%items.length,changed=n!==selected;selected=n;
 try{sessionStorage.setItem('monceree-print',String(n))}catch{}
 refreshSpotlight(changed);
 if(changed)document.dispatchEvent(new CustomEvent('monceree:select',{detail:{index:n,origin}}));
}
$$('[data-spotlight-view]').forEach(b=>b.addEventListener('click',()=>{spotlightView=b.dataset.spotlightView;refreshSpotlight(true)}));
refreshSpotlight(false);

// Quick product view: eight prints and two photographs for each print.
const productDialog=$('#product-dialog');let quick=0,quickView='product',productOrigin;
function updateQuick(animate=true){
 const p=items[quick];if(!p)return;if(!p.look)quickView='product';$$('[data-dialog-view=look]').forEach(b=>b.hidden=!p.look);
 $('.dialog-media')?.classList.toggle('is-look',quickView==='look');
 imageSwap($('#dialog-image'),photo(p,quickView==='look'),p.name+(quickView==='look'?' на модели':''),animate);
 $('#dialog-name').textContent=p.name;$('#dialog-description').textContent=p.description;$('#dialog-page').href='/mockup-hub/mockups/monceree/product/'+p.slug+'/';$('#dialog-order').href='/mockup-hub/mockups/monceree/contacts/?model='+p.slug;
 $$('[data-dialog-select]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.dialogSelect)===quick)));
 $$('[data-dialog-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.dialogView===quickView)));
 $('.dialog-media .view-switch').dataset.view=quickView;
}
function openProduct(i,origin){quick=clamp(Number(i)||0,0,items.length-1);quickView='product';productOrigin=origin;updateQuick(false);openDialog(productDialog)}
$$('[data-open-product]').forEach(b=>b.addEventListener('click',()=>openProduct(b.dataset.openProduct,b)));
$$('[data-dialog-select]').forEach(b=>b.addEventListener('click',()=>{quick=Number(b.dataset.dialogSelect);setSelected(quick,'dialog');updateQuick()}));
$$('[data-dialog-view]').forEach(b=>b.addEventListener('click',()=>{quickView=b.dataset.dialogView;updateQuick()}));
$('[data-close-product]')?.addEventListener('click',()=>closeDialog(productDialog,productOrigin));productDialog?.addEventListener('cancel',e=>{e.preventDefault();closeDialog(productDialog,productOrigin)});
productDialog?.addEventListener('click',e=>{if(e.target!==productDialog)return;const r=productDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(productDialog,productOrigin)});

// Product-page gallery and image enlargement.
const product=$('[data-product]');let galleryView='product';
if(product){const i=Number(product.dataset.product);setSelected(i,'page');
 $$('[data-gallery-view]').forEach(b=>b.addEventListener('click',()=>{galleryView=b.dataset.galleryView;const p=items[i];$('.product-image-stage').classList.toggle('is-look',galleryView==='look');imageSwap($('.product-gallery-image'),photo(p,galleryView==='look'),p.name+(galleryView==='look'?' на модели':''));$$('[data-gallery-view]').forEach(a=>a.setAttribute('aria-pressed',String(a===b)));$('.gallery-bottom .view-switch').dataset.view=galleryView}));
}
const zoomDialog=$('#image-dialog');let zoomOrigin;
function openImage(src,alt,look,origin){zoomOrigin=origin;zoomDialog.classList.toggle('is-look',look);imageSwap($('#large-image'),src,alt,false);openDialog(zoomDialog)}
$('[data-zoom-selected]')?.addEventListener('click',e=>{const p=items[selected];openImage('/mockup-hub/mockups/monceree/assets/'+(spotlightView==='look'?'look-':'')+p.slug+'.webp',p.name,spotlightView==='look',e.currentTarget)});
$('[data-zoom-gallery]')?.addEventListener('click',e=>{const p=items[Number(product.dataset.product)];openImage(photo(p,galleryView==='look'),p.name+(galleryView==='look'?' на модели':''),galleryView==='look',e.currentTarget)});
function closeImage(){closeDialog(zoomDialog,zoomOrigin)}
$('[data-close-image]')?.addEventListener('click',e=>{e.stopPropagation();closeImage()});zoomDialog?.addEventListener('click',closeImage);zoomDialog?.addEventListener('cancel',e=>{e.preventDefault();closeImage()});

// Catalogue filters are intentional actions; filtering never moves the visitor.
let filter='all';const search=$('#catalog-search'),cards=$$('.catalog-grid .product-card');
function filterCatalog(){const query=search?.value.trim().toLocaleLowerCase('ru')||'';let count=0;cards.forEach(c=>{const visible=(filter==='all'||c.dataset.tone===filter)&&c.dataset.name.includes(query);c.hidden=!visible;if(visible)count++});if($('#catalog-count'))$('#catalog-count').textContent=count;if($('.empty-state'))$('.empty-state').hidden=count!==0;$$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)))}
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;filterCatalog()}));search?.addEventListener('input',filterCatalog);$('[data-reset-search]')?.addEventListener('click',()=>{filter='all';search.value='';filterCatalog();search.focus({preventScroll:true})});

// Order handoff: the visitor copies a concrete message and contacts the real brand.
const enquirySelect=$('#enquiry-model');
if(enquirySelect){const slug=new URLSearchParams(location.search).get('model'),requested=items.findIndex(p=>p.slug===slug);selected=requested>=0?requested:selected;enquirySelect.value=items[selected].slug;
 function updateEnquiry(animate=false){const p=items.find(p=>p.slug===enquirySelect.value)||items[0];setSelected(p.index,'enquiry');imageSwap($('#enquiry-image'),photo(p),p.name,animate);$('#enquiry-text').value='Здравствуйте! Мне понравилась сумка «'+p.name+'». Подскажите, пожалуйста, её цену, наличие, размеры и условия доставки.';}
 updateEnquiry();enquirySelect.addEventListener('change',()=>{updateEnquiry(true);const url=new URL(location.href);url.searchParams.set('model',enquirySelect.value);history.replaceState(null,'',url)});
 $('#copy-enquiry').addEventListener('click',async()=>{const text=$('#enquiry-text').value;try{await navigator.clipboard.writeText(text);toast('Сообщение скопировано — отправьте его MONCEREE')}catch{const field=$('#enquiry-text');field.focus();field.select();let copied=false;try{copied=document.execCommand('copy')}catch{}toast(copied?'Сообщение скопировано — отправьте его MONCEREE':'Выделили сообщение — скопируйте его перед отправкой')}});
}

// Scroll choreography: photographs open, type travels, the selected object turns gently.
if(!reduce.matches&&'IntersectionObserver' in window){document.documentElement.classList.add('motion-enabled');const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');reveal.unobserve(e.target)}}),{threshold:.08});$$('[data-reveal]').forEach((el,i)=>{if(el.classList.contains('product-card'))el.style.setProperty('--reveal-delay',`${i%4*65}ms`);reveal.observe(el)})}
const story=$('.brand-story'),spotlight=$('.spotlight'),head=$('.over-hero'),hero=$('.hero');let scrollFrame=0;
function renderScroll(){const vh=innerHeight;
 if(!reduce.matches){
  if(hero&&scrollY<hero.offsetHeight)hero.style.setProperty('--hero-scroll-y',scrollY*.1+'px');
  if(story){const r=story.getBoundingClientRect();if(r.bottom>0&&r.top<vh){const t=clamp((vh-r.top)/(vh+r.height),0,1);story.style.setProperty('--story-inset',Math.max(0,9-t*20)+'%');story.style.setProperty('--story-y',(t-.5)*-40+'px');story.style.setProperty('--story-type-x',(8-t*18)+'%')}}
  if(spotlight){const r=spotlight.getBoundingClientRect();if(r.bottom>0&&r.top<vh){const t=clamp((vh-r.top)/(vh+r.height),0,1);spotlight.style.setProperty('--product-y',(t-.5)*-20+'px');spotlight.style.setProperty('--product-angle',(-4+t*8)+'deg')}}
 }
 if(head){const hero=$('.hero');head.classList.toggle('is-pinned',scrollY>(hero?.offsetHeight||vh)-90)}scrollFrame=0;
}
addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(renderScroll)},{passive:true});addEventListener('resize',renderScroll);renderScroll();
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduce.matches){$$('.solid-link,.round-link').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.045}px,${(e.clientY-r.top-r.height/2)*.08}px)`});el.addEventListener('pointerleave',()=>el.style.transform='')})}
window.MoncereeUI={get selected(){return selected},setSelected,imageSwap,toast,openProduct,reduced:reduce};
document.documentElement.dataset.uiReady='true';
})();
(()=>{if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const stage=document.querySelector('.spotlight-stage');if(!stage)return;stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();stage.style.setProperty('--bag-tilt-y',(e.clientX-r.left-r.width/2)/r.width*12+'deg');stage.style.setProperty('--bag-tilt-x',-(e.clientY-r.top-r.height/2)/r.height*9+'deg')});stage.addEventListener('pointerleave',()=>{stage.style.setProperty('--bag-tilt-y','0deg');stage.style.setProperty('--bag-tilt-x','0deg')})})();
