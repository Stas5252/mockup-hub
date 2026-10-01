'use strict';
const base='https://www.korabl-kirov.ru';
const programs=[
 {title:'Новогодье в Заповеднике сказок',image:'forest',category:'Для детей и всей семьи',tags:['kids','family'],description:'Зимнее путешествие со сказочными героями. Программа 2026–2027.',url:'/dlya_shkolnikov_i_doshkolnikov/novyj_god_dlya_shkolnikov'},
 {title:'Обзорная экскурсия по Кирову',image:'city',category:'Экскурсии',tags:['adult','family'],description:'Знакомство с городом, его историей и достопримечательностями.',url:'/tury_po_kirovskoj_oblasti/ekskursii/obzornaya_ekskursiya_po_kirovu'},
 {title:'Байдарочные и рафтовые сплавы',image:'raft',category:'Активный отдых',tags:['raft','adult'],description:'Водные маршруты по рекам Кировской области.',url:'/vodnye_splavy'},
 {title:'Корпоративные мероприятия',image:'event',category:'Для команд',tags:['corporate','adult'],description:'Праздники и командные программы в Заповеднике сказок.',url:'/korporativnyj_otdyh/korporativnye_i_delovye_meropriyatiya'},
 {title:'День рождения в сказочном лесу',image:'kids',category:'Для детей',tags:['kids','family'],description:'Детский праздник с героями Заповедника сказок.',url:'/dlya_shkolnikov_i_doshkolnikov/dni_rozhdeniya'},
 {title:'Это Вятка, детка!',image:'vyatka',category:'Туры в Киров',tags:['adult','family'],description:'Экскурсионный тур для организованных групп.',url:'/tury_po_kirovskoj_oblasti/eto-vyatka-detka-tur-dlya-organizovannyh-grupp'},
 {title:'Однодневный рафтовый сплав',image:'raft',category:'Для школьников',tags:['raft','kids'],description:'Активный выезд класса на природу.',url:'/dlya_shkolnikov_i_doshkolnikov/odnodnevnyj_raftovyj_splav'},
 {title:'Автобусные туры по России',image:'nature',category:'Путешествия',tags:['adult','family'],description:'Маршруты для тех, кто хочет увидеть больше.',url:'/tury_po_kirovskoj_oblasti/avtobusnye_tury_po_rossii'}
];
const programRail=document.querySelector('.program-rail');
programs.forEach(p=>{const a=document.createElement('a');a.className='program';a.href=base+p.url;a.target='_blank';a.rel='noopener';a.dataset.tags=p.tags.join(' ');a.innerHTML=`<div class="program-image"><img src="assets/${p.image}.webp" alt="${p.title}" loading="lazy"><span>${p.category}</span></div><h3>${p.title}</h3><p>${p.description}</p><span class="text-link">Подробнее о программе</span>`;programRail.append(a)});
const count=document.getElementById('program-count');count.textContent=`${programs.length} программ`;
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b))});let n=0;document.querySelectorAll('.program').forEach(p=>{p.hidden=b.dataset.filter!=='all'&&!p.dataset.tags.split(' ').includes(b.dataset.filter);if(!p.hidden)n++});count.textContent=`Программ: ${n}`;programRail.scrollLeft=0;if(window.ScrollTrigger)ScrollTrigger.refresh()}));
const menu=document.querySelector('.menu-toggle'),header=document.querySelector('header');
menu.addEventListener('click',()=>{const open=header.classList.toggle('menu-open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню')});header.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{header.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Открыть меню')}));
document.querySelectorAll('[data-rail]').forEach(b=>b.addEventListener('click',()=>{const rail=document.querySelector('.'+b.dataset.rail);rail.scrollBy({left:Number(b.dataset.direction)*rail.clientWidth*.72,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}));
document.querySelectorAll('.drag-rail').forEach(rail=>{let startX=0,startScroll=0,drag=false,moved=false;rail.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;startX=e.clientX;startScroll=rail.scrollLeft;drag=true;moved=false});rail.addEventListener('dragstart',e=>e.preventDefault());window.addEventListener('pointermove',e=>{if(!drag)return;const delta=e.clientX-startX;if(Math.abs(delta)>6){moved=true;rail.classList.add('dragging');rail.scrollLeft=startScroll-delta}});window.addEventListener('pointerup',()=>{drag=false;rail.classList.remove('dragging');setTimeout(()=>{moved=false},50)});rail.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation()}},true);rail.addEventListener('keydown',e=>{if(e.target!==rail)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();rail.scrollBy({left:e.key==='ArrowRight'?300:-300,behavior:'smooth'})}})});
document.querySelectorAll('.destination').forEach(a=>a.addEventListener('pointerenter',()=>{if(matchMedia('(min-width:761px)').matches){document.querySelectorAll('.destination').forEach(x=>x.classList.toggle('active',x===a))}}));
const dialog=document.getElementById('contact-dialog');document.querySelectorAll('[data-contact]').forEach(b=>b.addEventListener('click',()=>dialog.showModal()));document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.getElementById('contact-form').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.target);const text=`Здравствуйте! Хочу узнать о программе: ${d.get('direction')}.\nИмя: ${d.get('name')}\nТелефон: ${d.get('phone')}\nПожелания: ${d.get('message')||'Пока нет'}\n`;const url=`mailto:letkor@mail.ru?subject=${encodeURIComponent('Заявка — '+d.get('direction'))}&body=${encodeURIComponent(text)}`;location.href=url;const status=document.getElementById('form-status');status.textContent='Письмо подготовлено. Отправьте его в почтовом приложении. Если приложение не открылось, напишите в Telegram или позвоните.';let link=status.querySelector('a');if(!link){link=document.createElement('a');link.textContent=' Открыть письмо ещё раз';status.append(link)}link.href=url});
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
// One scroll-driven camera, no continuous geometry polling.
if(!reduce){
 const clamp=v=>Math.max(0,Math.min(1,v));
 const hero=document.querySelector('.hero'),scene=document.querySelector('.hero-scene');
 const bg=document.querySelector('.flight-background'),ship=document.querySelector('.ship-wrap'),left=document.querySelector('.cloud-left'),right=document.querySelector('.cloud-right'),mist=document.querySelector('.flight-mist'),copy=document.querySelector('.hero-copy'),transition=document.querySelector('.flight-transition'),wordmark=document.querySelector('.flight-wordmark'),meta=document.querySelector('.hero-meta');
 const route=document.querySelector('.route-line'),length=route.getTotalLength();route.style.strokeDasharray=length;
 let queued=false;
 const paint=()=>{
  queued=false;
  const rect=hero.getBoundingClientRect(),view=scene.clientHeight,p=clamp(-rect.top/Math.max(1,hero.offsetHeight-view));
  if(rect.bottom>0){
   bg.style.transform=`scale(${1+p*.12})`;
   ship.style.transform=`translate3d(${p*innerWidth*.08}px,${-p*view*.42}px,0) scale(${1+p*.65})`;
   left.style.transform=`translate3d(${-p*innerWidth*.45}px,${p*view*.08}px,0)`;
   right.style.transform=`translate3d(${p*innerWidth*.45}px,${p*view*.12}px,0)`;
   const fade=clamp(p/.28);copy.style.opacity=1-fade;copy.style.transform=`translateY(${fade*40}px) scale(${1-fade*.04})`;copy.inert=p>.26;
   meta.style.opacity=1-clamp(p/.18);
   mist.style.transform=`translateY(${-clamp((p-.32)/.68)*view*.62}px)`;
   transition.style.opacity=clamp((p-.72)/.28);
   wordmark.style.opacity=clamp((p-.78)/.1);
  }
  const map=document.querySelector('.map-section').getBoundingClientRect();route.style.strokeDashoffset=length*(1-clamp((innerHeight-map.top)/(innerHeight+map.height*.3)));
 };
 if(window.gsap&&window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);
  const flight=gsap.timeline({scrollTrigger:{trigger:hero,start:'top top',end:()=>'+='+Math.max(1,hero.offsetHeight-scene.clientHeight),scrub:.65,invalidateOnRefresh:true,onUpdate:self=>{copy.inert=self.progress>.26}},defaults:{ease:'none'}});
  flight.to(bg,{scale:1.12,duration:1},0)
   .to(ship,{x:()=>innerWidth*.08,y:()=>-scene.clientHeight*.42,scale:1.65,duration:1},0)
   .to(left,{x:()=>-innerWidth*.45,y:()=>scene.clientHeight*.08,duration:1},0)
   .to(right,{x:()=>innerWidth*.45,y:()=>scene.clientHeight*.12,duration:1},0)
   .to(copy,{autoAlpha:0,y:40,scale:.96,duration:.28},0)
   .to(meta,{autoAlpha:0,duration:.18},0)
   .to(mist,{y:()=>-scene.clientHeight*.62,duration:.68},.32)
   .to(transition,{opacity:1,duration:.28},.72)
   .to(wordmark,{opacity:1,duration:.1},.78);
  document.querySelectorAll('.title-row h2,.river-heading h2,.event-copy h2,.history-grid h2,.map-grid h2,.programs-section h2').forEach(el=>gsap.from(el,{y:30,opacity:0,duration:.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
  ScrollTrigger.create({trigger:'.map-section',start:'top bottom',end:'bottom 30%',onUpdate:self=>{route.style.strokeDashoffset=length*(1-self.progress)}});
  gsap.to('.scene-image',{scale:1.08,yPercent:-4,ease:'none',scrollTrigger:{trigger:'.story-scene',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.from('.final-ship',{xPercent:-15,yPercent:15,scale:.85,ease:'none',scrollTrigger:{trigger:'.final-scene',start:'top bottom',end:'bottom top',scrub:1}});
  document.fonts.ready.then(()=>ScrollTrigger.refresh());
 }else{
  const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(paint)}};
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);paint();
 }
}
document.querySelectorAll('.source-list a').forEach(a=>{a.target='_blank';a.rel='noopener'});
