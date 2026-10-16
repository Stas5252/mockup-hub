(function () {
  'use strict';
  const hero = document.getElementById('hero');
  const stage = document.getElementById('device-stage');
  const intro = document.getElementById('intro-screen');
  const devices = [...stage.querySelectorAll('[data-scene-device]')];
  const controls = [...hero.querySelectorAll('[data-scene-select]')];
  const motionMedia = matchMedia('(prefers-reduced-motion: reduce)');
  let motionPreference = 'full';
  try { motionPreference = localStorage.getItem('mobix_motion_preference') || 'full'; } catch {}
  const reduced = {get matches(){return motionPreference==='off'||(motionPreference==='system'&&motionMedia.matches);},addEventListener(type,handler){motionMedia.addEventListener(type,handler);}};
  document.documentElement.classList.toggle('motion-enabled',!reduced.matches);
  const motionToggle=document.getElementById('motion-toggle');
  function syncMotionButton(){hero.dataset.motion=reduced.matches?'paused':'playing';motionToggle.setAttribute('aria-pressed',String(!reduced.matches));motionToggle.setAttribute('aria-label',reduced.matches?'Включить анимацию':'Приостановить анимацию');motionToggle.title=reduced.matches?'Включить анимацию':'Приостановить анимацию';motionToggle.innerHTML=reduced.matches?'<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="m9 5 10 7-10 7Z"/></svg>':'<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>';}
  syncMotionButton();
  const names = ['iPhone 18 Pro', 'Apple Watch Series 12', 'AirPods 5', 'iPad Pro M5', 'MacBook Pro M5 Pro'];
  const headlines = ['iPhone.<br>Больше, чем<br>смартфон.', 'Apple Watch.<br>Время<br>большего.', 'AirPods.<br>Звук нового<br>уровня.', 'iPad.<br>Творчество<br>без границ.', 'MacBook.<br>Сила<br>твоих идей.'];
  const descriptions = ['Мощность, стиль и технологии<br>в каждом касании.', 'Технологии,<br>которые всегда с тобой.', 'Погрузись в мир<br>чистого звука.', 'Для работы, вдохновения<br>и больших открытий.', 'Большие возможности.<br>В каждом движении.'];
  const desktop = [{x:51,y:52,w:36,r:-3},{x:20,y:75,w:22,r:-11},{x:85,y:76,w:21,r:10},{x:81,y:31,w:25,r:12},{x:19,y:27,w:35,r:-12}];
  const mobile = [{x:51,y:50,w:43,r:-3},{x:20,y:76,w:25,r:-12},{x:84,y:78,w:23,r:9},{x:82,y:28,w:29,r:12},{x:20,y:27,w:39,r:-11}];
  const flight = [{x:150,y:30,r:18},{x:-40,y:-70,r:-32},{x:150,y:170,r:29},{x:-70,y:25,r:-27},{x:15,y:180,r:19}];
  let active = 0, started = false, visible = true, introTimeline, sceneTimeline, switchTimeline, pending = null;
  let wheelTime = 0, touch = null, suppressClickUntil = 0;
  hero.dataset.mode='collection';
  const catalogLabels=['Смотреть iPhone','Смотреть часы','Смотреть AirPods','Смотреть iPad','Смотреть MacBook'];
  const categoryLabels=['смартфонов','смарт-часов','наушников','планшетов','ноутбуков'];
  const ctaButton=hero.querySelector('.hero-store-button');
  const ctaArrow=ctaButton.querySelector('span').outerHTML;
  function updateCTA(){const focused=hero.dataset.mode==='focus';ctaButton.innerHTML=(focused?catalogLabels[active]:'Перейти в магазин')+' '+ctaArrow;ctaButton.setAttribute('href',focused?'#catalog':'#store');}
  const mobileView = () => stage.clientWidth < 600 && innerWidth < 701;
  function positions(index) {
    const small = mobileView(), base = (small ? mobile : desktop).map(p => ({...p}));
    if(hero.dataset.mode==='focus'){base[index]={x:53,y:51,w:(small?[53,52,49,44,78]:[43,46,45,39,71])[index],r:index===4?-5:-3};return base;}
    if (index) {
      const vacant = base[index];
      base[0] = {...vacant, w:small ? 27 : 23, r:vacant.x > 50 ? 8 : -9};
      base[index] = {x:51,y:51,w:(small?[43,43,43,39,66]:[36,40,40,35,62])[index],r:index===4?-5:-3};
    }
    return base;
  }
  function updateUI(index) {
    hero.dataset.active = index;
    devices.forEach((el,i) => {const hidden=hero.dataset.mode==='focus'&&i!==index;el.classList.toggle('is-active',i===index);el.removeAttribute('aria-pressed');el.setAttribute('aria-hidden',String(hidden));el.tabIndex=hidden?-1:0;el.setAttribute('aria-label','Открыть каталог '+categoryLabels[i]);});
    controls.forEach((el,i) => {el.classList.toggle('active',i===index);el.setAttribute('aria-pressed',String(i===index));});
    updateCTA();
    document.querySelectorAll('[data-nav]').forEach(el => el.classList.toggle('scene-active',+el.dataset.nav===index));
  }
  function arrange(index, entrance = false, instant = false) {
    if (!window.gsap) return;
    sceneTimeline?.kill();
    const target = positions(index), duration = reduced.matches || instant ? 0 : entrance ? 1.45 : 1.2;
    sceneTimeline = gsap.timeline({onComplete(){hero.dataset.phase='ready';if(pending!==null){const next=pending;pending=null;api.select(next);}}});
    devices.forEach((el,i) => {
      const p=target[i], hidden=hero.dataset.mode==='focus'&&i!==index;
      el.style.pointerEvents=hidden?'none':'auto';
      gsap.killTweensOf(el);
      gsap.set(el,{x:0,y:0,xPercent:-50,yPercent:-50,zIndex:i===index?12:([10,7,11,5,4][i])});
      if(entrance)gsap.set(el,{left:flight[i].x+'%',top:flight[i].y+'%',width:p.w+'%',rotation:flight[i].r,scale:.4,autoAlpha:0});
      sceneTimeline.to(el,{left:p.x+'%',top:p.y+'%',width:p.w+'%',rotation:p.r,scale:hidden?.78:1,autoAlpha:hidden?0:1,duration:hidden?Math.min(duration,.55):duration,ease:entrance?'power3.out':'power3.inOut'},entrance?i*.09:0);
    });
    hero.dataset.phase=duration?(entrance?'entering':'switching'):'ready';
    if(!duration)hero.dataset.phase='ready';
  }
  function enter(entrance=true) {
    introTimeline?.kill();
    started=true;
    gsap.to(intro,{autoAlpha:0,duration:reduced.matches?0:.55,onComplete(){intro.hidden=true;intro.setAttribute('aria-hidden','true');}});
    gsap.to('.header',{autoAlpha:1,duration:.65});
    gsap.fromTo('.hero-copy',{autoAlpha:0,y:25},{autoAlpha:1,y:0,duration:reduced.matches?0:.95,ease:'power3.out',delay:reduced.matches?0:.35});
    gsap.fromTo('.hero-bottom,.scene-gesture-hint',{autoAlpha:0,y:12},{autoAlpha:1,y:0,duration:.7,delay:reduced.matches?0:.9});
    document.body.style.overflow='';
    arrange(active,entrance);
  }
  motionToggle.onclick=()=>{motionPreference=reduced.matches?'full':'off';try{localStorage.setItem('mobix_motion_preference',motionPreference)}catch{}document.documentElement.classList.toggle('motion-enabled',!reduced.matches);syncMotionButton();hero.classList.toggle('scene-paused',document.hidden||!visible||reduced.matches);if(!started)enter(!reduced.matches);else arrange(active,false,true);};
  const api = window.MobixShowcase = {
    get activeIndex(){return active;},
    openCategory(index){if(suppressClickUntil>Date.now())return;window.MobixCatalog?.openCategory(index);},
    select(index) {
      const wasFocused=hero.dataset.mode==='focus';
      hero.dataset.mode='focus';
      index=(index+devices.length)%devices.length;
      if(!started){active=index;updateUI(index);pending=index;enter();return;}
      if(wasFocused&&index===active&&hero.dataset.phase==='ready')return;
      active=index;updateUI(index);
      if(window.gsap){
        switchTimeline?.kill();
        switchTimeline=gsap.timeline();
        switchTimeline.to('.hero-copy h1,.hero-description',{autoAlpha:0,y:-12,duration:reduced.matches?0:.2,ease:'power2.in',onComplete(){
          hero.querySelector('h1').innerHTML=headlines[index];
          hero.querySelector('.hero-description').innerHTML=descriptions[index];
          document.getElementById('hero-caption').textContent=names[index].toUpperCase();
        }}).fromTo('.hero-copy h1,.hero-description',{autoAlpha:0,y:16},{autoAlpha:1,y:0,duration:reduced.matches?0:.5,ease:'power3.out',stagger:.045},'+=0.04');
        gsap.to('.scene-background',{x:(index-2)*-5,scale:1.02+index*.003,duration:1.4,ease:'power2.inOut'});
      }
      arrange(index);
    },
    replay() {
      scrollTo({top:0,behavior:'instant'});
      active=0;pending=null;started=false;hero.dataset.mode='collection';
      sceneTimeline?.kill();switchTimeline?.kill();
      updateUI(0);
      hero.querySelector('h1').innerHTML='MOBIX<br>Ближе<br>к твоему миру';
      hero.querySelector('.hero-description').innerHTML='Премиальные устройства,<br>которые вдохновляют каждый день.';
      document.getElementById('hero-caption').textContent='НОВАЯ КОЛЛЕКЦИЯ APPLE';
      this.playIntro();
    },
    playIntro() {
      if(!window.gsap){intro.hidden=true;hero.dataset.phase='ready';return;}
      if(reduced.matches){enter(false);return;}
      introTimeline?.kill();
      intro.hidden=false;intro.setAttribute('aria-hidden','false');
      gsap.set(intro,{autoAlpha:1});
      gsap.set(devices,{autoAlpha:0});
      gsap.set('.header,.hero-copy,.hero-bottom,.scene-gesture-hint',{autoAlpha:0});
      document.body.style.overflow='hidden';
      hero.dataset.phase='intro';
      introTimeline=gsap.timeline({onComplete(){enter(true);}});
      introTimeline.fromTo('.intro-emblem',{autoAlpha:0,scale:.86,y:16},{autoAlpha:1,scale:1,y:0,duration:.85,ease:'power3.out'},0)
        .fromTo('.intro-wordmark',{autoAlpha:0,y:16},{autoAlpha:1,y:0,duration:.75,ease:'power3.out'},.2)
        .fromTo('.intro-center>p,.intro-motto',{autoAlpha:0,y:10},{autoAlpha:1,y:0,duration:.75,stagger:.12},.48)
        .fromTo('.intro-progress span',{scaleX:0},{scaleX:1,duration:1.6,ease:'power2.inOut'},.5)
        .fromTo('.intro-world',{y:90,autoAlpha:0},{y:0,autoAlpha:1,duration:1.5,ease:'power3.out'},.1)
        .to('.intro-center',{y:-9,duration:.4,ease:'power2.inOut'},2.15);
    }
  };
  devices.forEach((el,i)=>el.addEventListener('click',()=>api.openCategory(i)));
  ctaButton.addEventListener('click',e=>{if(hero.dataset.mode==='focus'){e.preventDefault();api.openCategory(active);}});
  controls.forEach((el,i)=>el.addEventListener('click',()=>api.select(i)));
  document.getElementById('scene-prev').onclick=()=>api.select(active-1);
  document.getElementById('scene-next').onclick=()=>api.select(active+1);
  document.getElementById('intro-skip').onclick=()=>enter(true);
  document.getElementById('replay-intro').onclick=()=>api.replay();
  document.addEventListener('keydown',e=>{
    if(!visible||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)||document.querySelector('.overlay:not([hidden])'))return;
    if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();api.select(active+(e.key==='ArrowRight'?1:-1));}
    if(e.key==='Escape'&&!started)enter(true);
  });
  stage.addEventListener('pointerdown',e=>{touch={x:e.clientX,y:e.clientY};});
  stage.addEventListener('pointerup',e=>{if(!touch)return;let dx=e.clientX-touch.x,dy=e.clientY-touch.y;touch=null;if(Math.abs(dx)>38&&Math.abs(dx)>Math.abs(dy)*1.4){suppressClickUntil=Date.now()+500;api.select(active+(dx<0?1:-1));}});
  stage.addEventListener('pointercancel',()=>touch=null);
  stage.addEventListener('wheel',e=>{
    if(!visible||!started)return;
    let delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
    if(Math.abs(delta)<12)return;
    let next=active+(delta>0?1:-1);
    if(next<0||next>4)return;
    e.preventDefault();
    if(Date.now()-wheelTime<1250)return;
    wheelTime=Date.now();api.select(next);
  },{passive:false});
  if(window.gsap){
    const parallax=devices.map((el,i)=>({x:gsap.quickTo(el.querySelector('.device-parallax'),'x',{duration:.9,ease:'power3.out'}),y:gsap.quickTo(el.querySelector('.device-parallax'),'y',{duration:.9,ease:'power3.out'}),r:gsap.quickTo(el.querySelector('.device-parallax'),'rotationY',{duration:1,ease:'power3.out'})}));
    stage.addEventListener('pointermove',e=>{if(reduced.matches||!visible||e.pointerType==='touch')return;const rect=stage.getBoundingClientRect();const x=(e.clientX-rect.left)/rect.width-.5,y=(e.clientY-rect.top)/rect.height-.5;parallax.forEach((q,i)=>{let depth=i===active?1.4:.65;q.x(x*22*depth);q.y(y*16*depth);q.r(x*9*depth);});});
    stage.addEventListener('pointerleave',()=>parallax.forEach(q=>{q.x(0);q.y(0);q.r(0);}));
  }
  let frameWidth=stage.clientWidth;
  new ResizeObserver(()=>{if(frameWidth===stage.clientWidth)return;frameWidth=stage.clientWidth;if(started)arrange(active,false,true);}).observe(stage);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;hero.classList.toggle('scene-paused',!visible||reduced.matches);},{threshold:.12}).observe(hero);
  document.addEventListener('visibilitychange',()=>hero.classList.toggle('scene-paused',document.hidden||!visible||reduced.matches));
  reduced.addEventListener('change',()=>{if(reduced.matches&&!started)enter(false);});
  const revealNodes=[...document.querySelectorAll('.collection,.categories .section-heading,.category-card,.catalog>.section-heading,.benefits .section-heading,.benefit-grid>.benefit')];
  if(!reduced.matches&&window.gsap){
    document.documentElement.classList.add('motion-ready');
    revealNodes.forEach(el=>el.classList.add('reveal-pending'));
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;gsap.to(el,{opacity:1,y:0,duration:.85,delay:el.classList.contains('category-card')?([...el.parentNode.children].indexOf(el)%3)*.075:0,ease:'power3.out',onComplete(){el.classList.remove('reveal-pending');}});observer.unobserve(el);});},{threshold:.12,rootMargin:'0px 0px -10px 0px'});
    revealNodes.forEach(el=>observer.observe(el));
  }
  // One intro per page load. Images are local and start decoding immediately.
  devices.forEach(el=>el.querySelector('img').decode?.().catch(()=>{}));
  updateUI(0);api.playIntro();
})();


