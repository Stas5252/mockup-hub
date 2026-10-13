'use strict';
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];
let smoothScroll=null;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad=n=>String(n).padStart(2,'0');
const projects = [
  {
    "id": "01-modern-apartment",
    "title": "Современная квартира",
    "location": "",
    "category": "apartment",
    "label": "Квартира",
    "image": "portfolio/01-modern-apartment-hq.jpg",
    "description": "Большое зеркало с подсветкой, деревянный пол ёлочкой, светлая стена и дверь. Фотография объекта РЕМОНТ-ЕКТ.",
    "aspect": 0.8,
    "width": 1024,
    "height": 1280
  },
  {
    "id": "02-cozy-living-room",
    "title": "Уютная гостиная",
    "location": "",
    "category": "apartment",
    "label": "Гостиная",
    "image": "portfolio/02-cozy-living-room-hq.jpg",
    "description": "Большой серый диван, светлая фактурная стена и шторы. Фотография объекта РЕМОНТ-ЕКТ.",
    "aspect": 1.333333,
    "width": 1280,
    "height": 960
  },
  {
    "id": "03-bedroom-workspace",
    "title": "Рабочее место в спальне",
    "location": "",
    "category": "apartment",
    "label": "Спальня",
    "image": "portfolio/03-bedroom-workspace-hq.jpg",
    "description": "Деревянный рабочий стол с подсветкой, светлое кресло, серые шторы и зеркальный шкаф. Фотография объекта РЕМОНТ-ЕКТ.",
    "aspect": 0.8,
    "width": 1024,
    "height": 1280
  },
  {
    "id": "04-cozy-childrens-room",
    "title": "Уютная детская",
    "location": "",
    "category": "apartment",
    "label": "Детская",
    "image": "portfolio/04-cozy-childrens-room.webp",
    "description": "Синее кресло у синей стены, светлый рабочий стол, шторы и край кровати на переднем плане. Фотография объекта РЕМОНТ-ЕКТ.",
    "aspect": 0.749219,
    "width": 959,
    "height": 1280
  },
  {
    "id": "05-place-for-quiet",
    "title": "Место для тишины",
    "location": "",
    "category": "apartment",
    "label": "Зона отдыха",
    "image": "portfolio/05-place-for-quiet.webp",
    "description": "Гидромассажная ванна с фиолетовой подсветкой и фактурной стеной. Фотография объекта РЕМОНТ-ЕКТ.",
    "aspect": 1.333333,
    "width": 1280,
    "height": 960
  },
  {
    "id": "06-bright-bedroom",
    "title": "Светлая спальня",
    "location": "",
    "category": "apartment",
    "label": "Спальня",
    "image": "portfolio/06-bright-bedroom.webp",
    "description": "Светлая комната с деревянным полом ёлочкой, телевизором, подвесной тумбой и балконной дверью. Фотография объекта РЕМОНТ-ЕКТ.",
    "aspect": 0.749219,
    "width": 959,
    "height": 1280
  },
  {
    "id": "07-spacious-bathroom",
    "title": "Просторная ванна",
    "location": "",
    "category": "apartment",
    "label": "Ванная комната",
    "image": "portfolio/07-spacious-bathroom.webp",
    "description": "Светлая ванная комната: ванна слева с тёплой подсветкой, шкаф в центре, раковина и зеркало справа. Фотография объекта РЕМОНТ-ЕКТ.",
    "aspect": 0.749219,
    "width": 959,
    "height": 1280
  },
  {
    "id": "08-cozy-hallway",
    "title": "Уютный коридор",
    "location": "",
    "category": "apartment",
    "label": "Коридор",
    "image": "portfolio/08-cozy-hallway.webp",
    "description": "Коридор с деревянными рейками, высоким зеркалом, входной дверью и подвесными светильниками-кольцами. Фотография объекта РЕМОНТ-ЕКТ.",
    "aspect": 0.450781,
    "width": 577,
    "height": 1280
  },
  {
    "id": "09-restaurant-entrance",
    "title": "Вход в ресторан",
    "location": "",
    "category": "commercial",
    "label": "Ресторан",
    "image": "portfolio/09-restaurant-entrance.webp",
    "description": "Лестница ресторана с ковровыми узорами на стенах и потолке, яркой росписью и неоновыми фигурами. Фотография объекта РЕМОНТ-ЕКТ.",
    "aspect": 0.75,
    "width": 960,
    "height": 1280
  },
  {
    "id": "10-restaurant-communal-table",
    "title": "Коммунальный стол в ресторане",
    "location": "",
    "category": "commercial",
    "label": "Ресторан",
    "image": "portfolio/10-restaurant-communal-table-hq.jpg",
    "description": "Длинный общий стол в ресторане, деревянные стулья и фиолетовая подсветка. Фотография объекта РЕМОНТ-ЕКТ.",
    "aspect": 0.75,
    "width": 960,
    "height": 1280
  },
  {
    "id": "11-largest-bar-counter",
    "title": "Самая большая барная стойка в Екатеринбурге",
    "location": "Екатеринбург",
    "category": "commercial",
    "label": "Ресторан",
    "image": "portfolio/11-largest-bar-counter-hq.jpg",
    "description": "Барная стойка из стеклоблоков с золотистой подсветкой. Реальная фотография объекта в процессе работ.",
    "aspect": 1.333333,
    "width": 1280,
    "height": 960
  },
  {
    "id": "12-modern-kitchen",
    "title": "Современная кухня",
    "location": "",
    "category": "apartment",
    "label": "Кухня",
    "image": "portfolio/12-modern-kitchen-hq.jpg",
    "description": "Светлая кухня с деревянными фасадами, каменной столешницей и встроенной подсветкой. Фотография объекта РЕМОНТ-ЕКТ.",
    "aspect": 0.75,
    "width": 960,
    "height": 1280
  },
  {
    "id": "13-neptun-leak-protection",
    "title": "Система от протечки Нептун",
    "location": "",
    "category": "apartment",
    "label": "Инженерные системы",
    "image": "portfolio/13-neptun-leak-protection.webp",
    "description": "Система защиты от протечек «Нептун» и разводка водоснабжения. Реальная фотография инженерного узла на объекте РЕМОНТ-ЕКТ.",
    "aspect": 0.5625,
    "width": 720,
    "height": 1280
  },
  {
    "id": "14-water-manifold",
    "title": "Сборка коллекторной группы ХВС, ГВС",
    "location": "",
    "category": "apartment",
    "label": "Инженерные системы",
    "image": "portfolio/14-water-manifold.webp",
    "description": "Коллекторная группа для холодного и горячего водоснабжения. Реальная фотография инженерного узла на объекте РЕМОНТ-ЕКТ.",
    "aspect": 0.5625,
    "width": 720,
    "height": 1280
  },
  {
    "id": "15-electrical-heart",
    "title": "Новое электросердце на объекте",
    "location": "",
    "category": "apartment",
    "label": "Инженерные системы",
    "image": "portfolio/15-electrical-heart.webp",
    "description": "Сборка и установка электрического щита на объекте. Реальные фотографии работ РЕМОНТ-ЕКТ.",
    "aspect": 0.5625,
    "width": 720,
    "height": 1280
  }
];
// Text, names, dates and ratings are transcribed from the supplied company site.
// Review photos were not supplied. The adjacent photo is explicitly portfolio imagery.
const reviews = [
  {name:'Сергей и Анна',date:'2025-06-21',displayDate:'21 июня 2025',text:'Капитальный ремонт двушки с нуля: стяжка, электрика, сантехника, отделка. Смета не изменилась — это подкупает.'},
  {name:'Мария К.',date:'2015-09-12',displayDate:'12 сентября 2015',text:'Делали ремонт в квартире. Все очень понравилось! Работают профессионально, сроки соблюдены. Рекомендую!'},
  {name:'Александр В.',date:'2021-05-04',displayDate:'4 мая 2021',text:'Отличная команда, сделали капитальный ремонт в новостройке. Качество на высшем уровне, все по смете, без сюрпризов.'},
  {name:'Екатерина С.',date:'2023-08-17',displayDate:'17 августа 2023',text:'Спасибо за наш новый дом! Всё чётко, красиво и в срок. Отдельно благодарим за помощь в подборе материалов.'},
  {name:'Дмитрий П.',date:'2024-03-09',displayDate:'9 марта 2024',text:'Коммерческое помещение 140 м² — сдали точно в срок, без простоев. Отдельное спасибо за коммуникацию и отчеты.'},
  {name:'Ольга М.',date:'2024-11-02',displayDate:'2 ноября 2024',text:'Косметический ремонт кухни-гостиной. Аккуратно, чисто, весь мусор вывезли. Цены не менялись по ходу работ.'}
];
const services=[{title:'Косметический ремонт',image:'svc1',price:'от 15 000 ₽/м²',text:'Освежим интерьер быстро и качественно. Перед началом работ согласуем перечень, стоимость и сроки. Точная смета — после бесплатного замера.'},{title:'Капитальный ремонт',image:'svc2-daylight',price:'от 25 000 ₽/м²',text:'Полная замена инженерных сетей и комплексный подход. Собственные бригады, контроль ключевых этапов и гарантия на все виды работ. Стоимость фиксируем в договоре.'},{title:'Дизайн-проект',image:'svc3',price:'от 35 000 ₽/м²',text:'Продуманное пространство до начала ремонта. Обсудим планировку, отделку и ваши пожелания. Состав работ и точную стоимость согласуем после знакомства с объектом.'}];
// Real company data is transcribed from the site supplied by the owner.
$('#year').textContent=new Date().getFullYear();
const request=$('#request-dialog'),detail=$('#detail-dialog'),privacy=$('#privacy-dialog');
const openDialog=d=>{if(!d.open)d.showModal();smoothScroll?.stop()};
$$('dialog').forEach(d=>{d.setAttribute('data-lenis-prevent','');d.addEventListener('close',()=>{if(!$('dialog[open]'))smoothScroll?.start()})});
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}));
$$('[data-request]').forEach(b=>b.addEventListener('click',()=>{closeMenu();if(detail.open)detail.close();openDialog(request)}));
$$('[data-privacy]').forEach(b=>b.addEventListener('click',()=>openDialog(privacy)));
const assetSrc=image=>'assets/'+(/\.(webp|jpg|png)$/i.test(image)?image:image+'.jpg');
function showDetail(title,label,text,image){detail.classList.toggle('is-real-photo',image.startsWith('portfolio/'));$('#detail-title').textContent=title;$('#detail-label').textContent=label;$('#detail-text').textContent=text;$('.detail-image img').src=assetSrc(image);$('.detail-image img').alt=title;openDialog(detail)}
$$('[data-service]').forEach(b=>b.addEventListener('click',()=>{const s=services[+b.dataset.service];showDetail(s.title,s.price,s.text,s.image);$('#request-form [name=message]').value='Интересует '+s.title.toLowerCase()+'.'}));
$('#request-form').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);const message=['Здравствуйте! Хочу обсудить ремонт.',`Имя: ${data.get('name').trim()}`,`Помещение: ${data.get('type')}`,data.get('area')?`Площадь: ${data.get('area')} м²`:'',data.get('message')?.trim()].filter(Boolean).join('\n');window.open('https://wa.me/79221960645?text='+encodeURIComponent(message),'_blank','noopener,noreferrer')});
const menuButton=$('.menu-button'),menu=$('#mobile-menu');
function closeMenu(){document.body.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Открыть меню');menu.inert=true;if(!$('dialog[open]'))smoothScroll?.start()}
menuButton.addEventListener('click',()=>{const open=!document.body.classList.contains('menu-open');document.body.classList.toggle('menu-open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');menu.inert=!open;if(open){smoothScroll?.stop();menu.querySelector('a').focus()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('menu-open')){closeMenu();menuButton.focus()}if(e.key==='Tab'&&document.body.classList.contains('menu-open')){const items=[menuButton,...$$('a,button',menu)],first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=$(a.getAttribute('href'));if(!target)return;e.preventDefault();closeMenu();const top=target.getBoundingClientRect().top+scrollY-(innerWidth<768?25:60);if(smoothScroll)smoothScroll.scrollTo(Math.max(0,top),{duration:1.25});else target.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});history.replaceState(null,'',a.getAttribute('href'))}));
// Reviews are real text from the owner's original site. The photo is a clearly
// labelled portfolio image, not a fabricated photograph of a reviewer.
const reviewTrack=$('.review-track'),reviewDots=$('.review-dots');let reviewIndex=0;
reviews.forEach((r,i)=>{const el=document.createElement('article');el.className='review';el.innerHTML='<blockquote></blockquote><p class="review-name"></p><p class="review-source"></p><p class="review-rating" aria-label="Рейтинг 5 из 5">★★★★★<span>5,0</span></p>';$('blockquote',el).textContent='«'+r.text+'»';$('.review-name',el).textContent=r.name;$('.review-source',el).textContent='2ГИС · '+r.displayDate;reviewTrack.append(el);const b=document.createElement('button');b.textContent=i+1;b.setAttribute('aria-label','Отзыв '+(i+1)+': '+r.name);b.addEventListener('click',()=>setReview(i));reviewDots.append(b)});
function setReview(i){reviewIndex=(i+reviews.length)%reviews.length;reviewTrack.style.transform=`translateX(-${reviewIndex*100}%)`;$$('button',reviewDots).forEach((b,j)=>{b.classList.toggle('active',j===reviewIndex);b.setAttribute('aria-pressed',String(j===reviewIndex))});$$('.review').forEach((el,j)=>el.setAttribute('aria-hidden',String(j!==reviewIndex)))}
setReview(0);$$('[data-review-dir]').forEach(b=>b.addEventListener('click',()=>setReview(reviewIndex+ +b.dataset.reviewDir)));$('.review-slider').addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();setReview(reviewIndex+(e.key==='ArrowRight'?1:-1))}});
let reviewDown=null;$('.review-slider').addEventListener('pointerdown',e=>{reviewDown={x:e.clientX,y:e.clientY}});$('.review-slider').addEventListener('pointerup',e=>{if(!reviewDown)return;const dx=e.clientX-reviewDown.x,dy=e.clientY-reviewDown.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))setReview(reviewIndex+(dx<0?1:-1));reviewDown=null});$('.review-slider').addEventListener('pointercancel',()=>reviewDown=null);
// The portfolio is a sticky scroll scene on desktop and a native swipe gallery
// on phones. Both expose arrow buttons, keyboard navigation and project dialogs.
const gallery=$('.gallery-window'),track=$('.gallery-track'),scene=$('.gallery-scene');let galleryTween=null,galleryTrigger=null,visibleProjects=projects,galleryIndex=0,drag=null,suppressClick=false;const isDesktop=()=>innerWidth>=768&&!reduced;
function galleryMax(){return Math.max(0,track.scrollWidth-innerWidth)}

function updateGallery(progress){if(!visibleProjects.length){$('.gallery-index').textContent='00 / 00';$('.gallery-progress span').style.transform='scaleX(0)';return}const max=galleryMax(),x=isDesktop()?progress*max:gallery.scrollLeft;let idx=0,min=Infinity;[...track.children].forEach((el,i)=>{const d=Math.abs(el.offsetLeft-parseFloat(getComputedStyle(gallery).width)*.052-x);if(d<min){idx=i;min=d}});galleryIndex=idx;$('.gallery-index').textContent=pad(idx+1)+' / '+pad(visibleProjects.length);$('.gallery-progress span').style.transform=`scaleX(${visibleProjects.length===1?1:Math.max(.08,progress)})`}
function configureGallery(){if(galleryTrigger){galleryTrigger.kill();galleryTrigger=null}if(galleryTween){galleryTween.kill();galleryTween=null}gsap.set(track,{clearProps:'transform'});gallery.scrollLeft=0;if(isDesktop()&&galleryMax()>0){scene.style.height=Math.max(innerHeight*2,galleryMax()*.45+innerHeight)+'px';galleryTween=gsap.to(track,{x:()=>-galleryMax(),ease:'none',scrollTrigger:{trigger:scene,start:'top top',end:'bottom bottom',scrub:.35,invalidateOnRefresh:true,onUpdate:s=>updateGallery(s.progress)}});galleryTrigger=galleryTween.scrollTrigger}else{scene.style.height='auto';updateGallery(0)}ScrollTrigger.refresh();smoothScroll?.resize()}
function renderProjects(filter='all'){
 visibleProjects=projects.filter(p=>filter==='all'||p.category===filter);track.replaceChildren();scene.classList.toggle('is-empty',!visibleProjects.length);$$('[data-gallery-dir]').forEach(b=>b.disabled=!visibleProjects.length);
 visibleProjects.forEach(p=>{const b=document.createElement('button');b.className='project real-project';b.dataset.projectId=p.id;b.style.setProperty('--photo-aspect',p.aspect);b.innerHTML=`<div class="project-image"><img src="${assetSrc(p.image)}" alt="" width="${p.width}" height="${p.height}" draggable="false" loading="lazy"></div><div class="project-meta"><div><h3></h3><p></p></div><span aria-hidden="true"><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span></div>`;$('img',b).alt=p.title;$('h3',b).textContent=p.title;const label=[p.label,p.location].filter(Boolean).join(' · ');$('p',b).textContent=label;b.setAttribute('aria-label','Открыть проект: '+p.title);b.addEventListener('click',e=>{if(suppressClick){e.preventDefault();return}showDetail(p.title,label,p.description,p.image)});if(!reduced){b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')gsap.to($('img',b),{scale:1.045,duration:1,ease:'power3.out'})});b.addEventListener('pointerleave',()=>gsap.to($('img',b),{scale:1,duration:1,ease:'power3.out'}))}track.append(b)});
 if(!visibleProjects.length){const empty=document.createElement('div');empty.className='gallery-empty';empty.innerHTML='<p>В этой категории пока нет фотографий на сайте.</p><a class="button outline" href="https://t.me/remontekt" target="_blank" rel="noopener noreferrer">Наши работы в Telegram <span>↗</span></a>';track.append(empty)}
 galleryIndex=0;$('.gallery-index').textContent=(visibleProjects.length?'01':'00')+' / '+pad(visibleProjects.length);configureGallery();
}
function galleryTo(i){if(!visibleProjects.length)return;i=Math.max(0,Math.min(visibleProjects.length-1,i));const el=track.children[i];if(isDesktop()&&galleryTrigger){const offset=Math.max(0,Math.min(galleryMax(),el.offsetLeft-parseFloat(getComputedStyle(track).paddingLeft)));const top=galleryTrigger.start+(galleryTrigger.end-galleryTrigger.start)*(offset/galleryMax());smoothScroll?smoothScroll.scrollTo(top,{duration:1.1}):window.scrollTo({top,behavior:reduced?'instant':'smooth'})}else gallery.scrollTo({left:el.offsetLeft-parseFloat(getComputedStyle(track).paddingLeft),behavior:reduced?'instant':'smooth'});galleryIndex=i}
$$('[data-gallery-dir]').forEach(b=>b.addEventListener('click',()=>galleryTo(galleryIndex+ +b.dataset.galleryDir)));
gallery.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();galleryTo(galleryIndex+(e.key==='ArrowRight'?1:-1))}});
gallery.addEventListener('scroll',()=>{if(!isDesktop())updateGallery(gallery.scrollLeft/Math.max(1,galleryMax()))},{passive:true});
gallery.addEventListener('pointerdown',e=>{if(!isDesktop()||e.pointerType!=='mouse')return;drag={x:e.clientX,y:scrollY,id:e.pointerId,moved:false};suppressClick=false});
gallery.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){const r=gallery.getBoundingClientRect();const cursor=$('.drag-cursor');cursor.style.left=e.clientX-r.left+'px';cursor.style.top=e.clientY-r.top+'px'}if(!drag||!galleryTrigger)return;const delta=e.clientX-drag.x;if(Math.abs(delta)>6){drag.moved=true;suppressClick=true;gallery.setPointerCapture(e.pointerId);window.scrollTo(0,Math.max(galleryTrigger.start,Math.min(galleryTrigger.end,drag.y-delta*(galleryTrigger.end-galleryTrigger.start)/Math.max(1,galleryMax()))))}});
function endDrag(){if(drag?.moved)setTimeout(()=>suppressClick=false,150);drag=null}gallery.addEventListener('pointerup',endDrag);gallery.addEventListener('pointercancel',endDrag);
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{const sceneTop=scene.getBoundingClientRect().top+scrollY;$$('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});renderProjects(b.dataset.filter);if(scrollY>sceneTop&&isDesktop())window.scrollTo(0,sceneTop)}));
// Motion is scoped to dedicated layers so mouse offsets never fight scroll
// transforms. All assets and GSAP are local: no animation CDN dependency.
gsap.registerPlugin(ScrollTrigger);ScrollTrigger.config({ignoreMobileResize:true});
if(!reduced&&innerWidth>=768&&typeof Lenis!=='undefined'){smoothScroll=new Lenis({lerp:.1,smoothWheel:true,wheelMultiplier:.85});smoothScroll.on('scroll',ScrollTrigger.update);gsap.ticker.add(time=>smoothScroll.raf(time*1000));gsap.ticker.lagSmoothing(0);}
async function initialiseMotion(){
 try{const svg=await fetch('assets/brand-mask.svg').then(r=>r.text());$('.brand-outline').innerHTML=svg}catch{}
 if(!reduced){
  // The concrete shell, renovated room and furniture use one fixed 3:2
  // artboard. Camera motion is shared; near/far mouse offsets remain separate.
  await Promise.all($$('.hero img').map(img=>img.decode().catch(()=>{})));
  const paths=$$('.brand-outline path');paths.forEach(p=>{const l=p.getTotalLength();p.style.strokeDasharray=l;p.style.strokeDashoffset=l});
  const intro=gsap.timeline({defaults:{ease:'expo.out'}});
  intro.from('.hero-line>span',{yPercent:115,duration:1.8,stagger:.12},0)
    .from('.hero-content p,.hero-actions',{y:20,opacity:0,duration:1.3,stagger:.12},.45)
    .from('.apartment-intro',{scale:1.075,duration:4},0);
  const chapters=[['01','Без отделки'],['02','Преображение'],['03','Готово для жизни']];
  const heroMotion=gsap.matchMedia();
  heroMotion.add({mobile:'(max-width: 767px)',desktop:'(min-width: 768px)'},context=>{
    const beat=context.conditions.mobile?.75:1;
    let chapter=-1;
    function updateApartment(progress){const next=progress<.16*beat?0:progress<.42*beat?1:2;if(next===chapter)return;chapter=next;$('.apartment-phase-index').textContent=chapters[next][0];$('.apartment-phase-text').textContent=chapters[next][1];$('.hero').dataset.phase=['before','renovating','after'][next]}
    const hero=gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.18,onUpdate:s=>updateApartment(s.progress)},defaults:{ease:'power1.out'}});
    hero.to('.apartment-camera',{scale:1.16,yPercent:-2.5,duration:1},0)
      .to('.hero-content',{yPercent:15,scale:.94,duration:.55*beat},0)
      .to('.hero-content,.hero-scroll',{opacity:0,duration:.19*beat},0)
      .to('.apartment-legibility',{opacity:0,duration:.2*beat},0)
      .to('.apartment-after',{clipPath:'inset(0 0% 0 0)',duration:.22*beat,ease:'power2.inOut'},.16*beat)
      .to('.apartment-furniture-reveal',{clipPath:'inset(0 0% 0 0)',duration:.2*beat,ease:'power2.inOut'},.22*beat)
      .to('.apartment-foreground',{yPercent:-.6,duration:.56*beat,ease:'none'},.1*beat)
      .to('.brand-outline',{opacity:1,duration:.02*beat},.43*beat)
      .to(paths,{strokeDashoffset:0,duration:.16*beat,stagger:{amount:.02*beat},ease:'none'},.43*beat)
      .to('.hero-caption',{opacity:0,duration:.1*beat},.45*beat)
      .to('.brand-composite',{opacity:1,duration:.1*beat},.53*beat)
      .to('.apartment-main-camera,.apartment-foreground-camera',{opacity:0,duration:.1*beat},.53*beat)
      .to('.brand-outline',{opacity:0,duration:.1*beat},.53*beat)
      .to('.hero-whiteout',{opacity:1,yPercent:-40,duration:.25*beat},.75*beat)
      .to({}, {duration:.01},1);
    updateApartment(0);
  });
  // Word shading reproduces FIND's scroll-dependent typographic rhythm.
  $$('.reading').forEach(el=>{const palette=getComputedStyle(document.documentElement);const endColor=palette.getPropertyValue('--ink').trim();const startColor=palette.getPropertyValue('--muted').trim();const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(n=>{const fragment=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w))fragment.append(document.createTextNode(w));else{const s=document.createElement('span');s.className='read-word';s.textContent=w;fragment.append(s)}});n.replaceWith(fragment)});const words=$$('.read-word',el);gsap.fromTo(words,{color:startColor},{color:endColor,stagger:{amount:1},duration:.5,ease:'none',scrollTrigger:{trigger:el,start:'top 90%',end:'bottom 40%',scrub:.25}})});
  $$('.image-reveal').forEach(el=>gsap.fromTo(el,{clipPath:'inset(18% 0 18% 0)'},{clipPath:'inset(0% 0 0% 0)',ease:'power2.out',duration:1.6,scrollTrigger:{trigger:el,start:'top 90%',toggleActions:'play none none none'}}));
  $$('.about-image,.control-interior,.review-photo').forEach(el=>gsap.fromTo($('img',el),{yPercent:-4,scale:1.04},{yPercent:4,scale:1,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:.3}}));
  gsap.fromTo('.about-image',{width:()=>innerWidth<768?'100%':'83.4%'},{width:'100%',ease:'none',scrollTrigger:{trigger:'.about-image',start:'top 85%',end:'bottom 65%',scrub:.3}});
  gsap.fromTo('.image-chevron:not(:first-child)',{xPercent:-10,scale:.8,opacity:.1},{xPercent:0,scale:1,opacity:1,stagger:.2,duration:1,ease:'power1.out',scrollTrigger:{trigger:'.image-arrows',start:'top bottom',end:'center center',scrub:1.4}});
  $$('.image-chevron img').forEach((el,i)=>gsap.fromTo(el,{yPercent:-6},{yPercent:6+(i*2),ease:'none',scrollTrigger:{trigger:'.image-arrows',start:'top bottom',end:'bottom top',scrub:.3}}));
  gsap.to('.steps-line span',{scaleY:1,ease:'none',scrollTrigger:{trigger:'.steps',start:'top 75%',end:'bottom 55%',scrub:.3}});
  gsap.fromTo('.outro-bg img',{yPercent:-8,scale:1.12},{yPercent:8,scale:1,ease:'none',scrollTrigger:{trigger:'.outro',start:'top bottom',end:'bottom top',scrub:.3}});
  const mm=gsap.matchMedia();mm.add('(min-width: 768px)',()=>{const layers=$$('.hero .mouse-layer').map(el=>({el,x:gsap.quickTo(el,'x',{duration:1.4,ease:'power3.out'}),y:gsap.quickTo(el,'y',{duration:1.4,ease:'power3.out'}),depth:+el.dataset.depth}));const move=e=>{if(e.pointerType!=='mouse'||scrollY>innerHeight*4)return;const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;layers.forEach(l=>{l.x(x*l.depth);l.y(y*l.depth)})};const leave=()=>layers.forEach(l=>{l.x(0);l.y(0)});$('.hero-sticky').addEventListener('pointermove',move);$('.hero-sticky').addEventListener('pointerleave',leave);$$('.magnetic').forEach(b=>{const x=gsap.quickTo(b,'x',{duration:.45,ease:'power3.out'}),y=gsap.quickTo(b,'y',{duration:.45,ease:'power3.out'});const handler=e=>{if(e.pointerType!=='mouse')return;const r=b.getBoundingClientRect();x((e.clientX-r.left-r.width/2)*.13);y((e.clientY-r.top-r.height/2)*.18)};const reset=()=>{x(0);y(0)};b.addEventListener('pointermove',handler);b.addEventListener('pointerleave',reset)});return()=>{$('.hero-sticky').removeEventListener('pointermove',move);$('.hero-sticky').removeEventListener('pointerleave',leave)}});
 }
 if(reduced){$('.apartment-phase-index').textContent='03';$('.apartment-phase-text').textContent='Готово для жизни';$('.hero').dataset.phase='after'}
 renderProjects();await document.fonts.ready;ScrollTrigger.refresh();window.dispatchEvent(new Event('site-ready'));
}
initialiseMotion();
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(configureGallery,250)});
window.addEventListener('load',()=>ScrollTrigger.refresh());
