(() => {
  const app = document.querySelector('#app');
  if (!app) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const targets = [
    '.section-head', '.split-copy', '.features-grid .feature',
    '.dish', '.hall', '.review', '.gallery-grid img',
    '.menu-section > h2', '.contact-grid > *',
    '.application > .wrap > h2', '.application > .wrap > p', '.application-form'
  ].join(',');
  let observer;

  function prepare() {
    if (observer) observer.disconnect();
    const elements = Array.from(app.querySelectorAll(targets));
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      document.documentElement.classList.remove('motion-ready');
      elements.forEach(element => {
        element.classList.remove('motion-reveal', 'is-visible');
        element.style.removeProperty('--reveal-delay');
      });
      return;
    }
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -32px 0px', threshold: 0.08 });
    elements.forEach(element => {
      element.classList.add('motion-reveal');
      const siblings = element.parentElement ? Array.from(element.parentElement.children) : [];
      element.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(element), 3) * 55}ms`);
      observer.observe(element);
    });
    document.documentElement.classList.add('motion-ready');
  }

  // The site swaps the direct children of #app on each hash route.
  new MutationObserver(prepare).observe(app, { childList: true });
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', prepare);
  else if (reduceMotion.addListener) reduceMotion.addListener(prepare);
  prepare();

  // A small scroll offset gives the opening photograph depth on larger screens.
  let frame = 0;
  function moveHero() {
    frame = 0;
    const photo = app.querySelector('.hero-image');
    const hero = photo && photo.closest('.hero');
    if (!photo || !hero) return;
    const distance = (!reduceMotion.matches && window.innerWidth > 900)
      ? Math.min(18, Math.max(0, -hero.getBoundingClientRect().top * .07)) : 0;
    photo.style.setProperty('--hero-shift', distance.toFixed(1) + 'px');
  }
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(moveHero); }, {passive:true});
  window.addEventListener('resize', moveHero, {passive:true});
})();
