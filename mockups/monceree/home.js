(()=>{
'use strict';
const UI=window.MoncereeUI,items=window.MONCEREE;if(!UI||!items)return;
const hero=document.querySelector('.hero'),photos=[...document.querySelectorAll('.hero-look')],wheel=document.querySelector('.wheel-window'),buttons=[...document.querySelectorAll('[data-wheel]')];if(!hero||!wheel)return;
let current=UI.selected<items.length?UI.selected:0,desired=current,request=0,wheelCooldown=0,wheelSum=0;
function wrapped(n){return(n%items.length+items.length)%items.length}
function slots(n){buttons.forEach((b,i)=>{let d=wrapped(i-n);if(d>items.length/2)d-=items.length;b.dataset.slot=d;const visible=Math.abs(d)<=1;b.disabled=!visible;b.tabIndex=visible?0:-1;b.setAttribute('aria-pressed',String(i===n));b.setAttribute('aria-hidden',String(!visible))});wheel.setAttribute('aria-label','Выбран принт «'+items[n].name+'». Предыдущая и следующая сумки справа.');}
function updateText(n,animate){const p=items[n],name=document.querySelector('#hero-name'),counter=document.querySelector('#hero-index');counter.textContent=p.number;name.textContent=p.name;document.querySelector('#hero-product').href='/mockup-hub/mockups/monceree/product/'+p.slug+'/';document.querySelector('.hero-inspect').dataset.openProduct=n;document.querySelector('.hero-progress i').style.width=((n+1)/items.length*100)+'%';
 if(animate&&!UI.reduced.matches){name.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:700,easing:'cubic-bezier(.19,1,.22,1)'});counter.animate([{opacity:.2},{opacity:1}],{duration:500})}
}
async function change(index,direction=0,focus=false){
 const n=wrapped(index);desired=n;const ticket=++request;try{await photos[n].querySelector("img").decode()}catch{UI.toast('Не удалось загрузить фото. Попробуйте другой принт.');return}if(ticket!==request)return;
 const previous=current,changed=previous!==n,dir=direction||((n-previous+items.length)%items.length<items.length/2?1:-1);
 const incoming=photos[n], outgoing=photos[previous];
 photos.forEach((photo,i)=>{
  photo.getAnimations().filter(animation=>animation.id==='hero-change').forEach(animation=>animation.cancel());
  photo.classList.toggle('is-current',i===n);
  photo.classList.remove('is-outgoing');
  photo.setAttribute('aria-hidden',String(i!==n));
 });
 if(changed&&!UI.reduced.matches){
  outgoing.classList.add('is-outgoing');
  const start=dir>0?'polygon(0 100%,100% 88%,100% 100%,0 100%)':'polygon(0 0,100% 0,100% 12%,0 0)';
  const transition=incoming.animate([
   {clipPath:start},
   {clipPath:'polygon(0 0,100% 0,100% 100%,0 100%)'}
  ],{duration:780,easing:'cubic-bezier(.22,.8,.22,1)'});
  transition.id='hero-change';
  transition.finished.then(()=>outgoing.classList.remove('is-outgoing'),()=>{});
 }

 current=n;slots(n);updateText(n,changed);UI.setSelected(n,'hero');if(focus)buttons[n].focus({preventScroll:true});
}
let pointerStart=null,dragged=false;
buttons.forEach((b,i)=>b.addEventListener('click',e=>{if(dragged){e.preventDefault();return}if(i===current){UI.openProduct(i,b)}else{change(i,i-current)}}));
document.querySelector('.wheel-prev').addEventListener('click',()=>change(desired-1,-1));document.querySelector('.wheel-next').addEventListener('click',()=>change(desired+1,1));
wheel.addEventListener('keydown',e=>{const direction={ArrowUp:-1,ArrowLeft:-1,ArrowDown:1,ArrowRight:1}[e.key];if(direction){e.preventDefault();change(desired+direction,direction,true)}else if(e.key==='Home'){e.preventDefault();change(0,-1,true)}else if(e.key==='End'){e.preventDefault();change(items.length-1,1,true)}});
wheel.addEventListener('wheel',e=>{if(e.ctrlKey||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;if(e.cancelable)e.preventDefault();if(performance.now()<wheelCooldown)return;wheelSum+=e.deltaY;if(Math.abs(wheelSum)>28){const dir=wheelSum>0?1:-1;wheelSum=0;wheelCooldown=performance.now()+650;change(desired+dir,dir)}},{passive:false});
wheel.addEventListener('pointerdown',e=>{if(e.button!==0&&e.pointerType==='mouse')return;pointerStart={x:e.clientX,y:e.clientY,id:e.pointerId};dragged=false});
wheel.addEventListener('pointermove',e=>{if(!pointerStart||pointerStart.id!==e.pointerId)return;const dy=e.clientY-pointerStart.y;if(Math.abs(dy)>7){dragged=true;wheel.classList.add('dragging');if(!wheel.hasPointerCapture(e.pointerId))wheel.setPointerCapture(e.pointerId);wheel.style.setProperty('--wheel-drag',Math.max(-23,Math.min(23,dy*.28))+'px')}});
function endPointer(e,cancel=false){if(!pointerStart)return;const dy=e.clientY-pointerStart.y,dx=e.clientX-pointerStart.x;pointerStart=null;wheel.style.setProperty('--wheel-drag','0px');wheel.classList.remove('dragging');if(!cancel&&Math.abs(dy)>28&&Math.abs(dy)>Math.abs(dx)){const dir=dy<0?1:-1;change(desired+dir,dir)}setTimeout(()=>dragged=false,0)}
wheel.addEventListener('pointerup',e=>endPointer(e));wheel.addEventListener('pointercancel',e=>endPointer(e,true));wheel.addEventListener('lostpointercapture',()=>{if(pointerStart){pointerStart=null;wheel.style.setProperty('--wheel-drag','0px');wheel.classList.remove('dragging')}});
let touch=null;hero.addEventListener('touchstart',e=>{if(e.target.closest('button,a,.hero-wheel')){touch=null;return}touch={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY}},{passive:true});hero.addEventListener('touchend',e=>{if(!touch)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;touch=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.25){const dir=dx<0?1:-1;change(desired+dir,dir)}},{passive:true});
document.addEventListener('monceree:select',e=>{if(e.detail.origin!=='hero'&&e.detail.index<items.length)change(e.detail.index)});
// The initial and restored selection is ready before any visitor interaction.
document.documentElement.dataset.heroReady='true';
slots(current);updateText(current,false);photos.forEach((im,i)=>{im.classList.toggle('is-current',i===current);im.setAttribute('aria-hidden',String(i!==current))});
})();
