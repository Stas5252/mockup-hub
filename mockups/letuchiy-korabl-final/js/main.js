(() => {
  'use strict';

  const cleanups = [];
  const prefersReducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isReducedMotion = () => prefersReducedMotionQuery.matches;
  const addCleanup = (fn) => cleanups.push(fn);

  let lenis = null;

  // 1. Lenis Smooth Scroll Unified with GSAP Ticker
  function initSmoothScroll() {
    if (isReducedMotion() || typeof window.Lenis === 'undefined') return;

    try {
      lenis = new window.Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.2
      });

      if (window.gsap && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);
        lenis.on('scroll', window.ScrollTrigger.update);
        const tickerFn = (time) => {
          lenis.raf(time * 1000);
        };
        window.gsap.ticker.add(tickerFn);
        window.gsap.ticker.lagSmoothing(0);
        addCleanup(() => {
          window.gsap.ticker.remove(tickerFn);
          lenis.destroy();
        });
      } else {
        let rafId;
        const raf = (time) => {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
        addCleanup(() => {
          cancelAnimationFrame(rafId);
          lenis.destroy();
        });
      }
    } catch (err) {
      console.warn('Lenis initialization skipped:', err);
    }
  }

  // 2. Header Solid State & Nav
  function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const onScroll = () => {
      if (window.scrollY > 45) {
        header.classList.add('is-solid');
      } else {
        header.classList.remove('is-solid');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    addCleanup(() => window.removeEventListener('scroll', onScroll));

    // Smooth Anchor Navigation
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      const handler = (e) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(targetEl, { offset: -60, duration: 1.2 });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          // Close mobile nav if open
          const mobileNav = document.getElementById('mobile-nav');
          const toggle = document.querySelector('.menu-toggle');
          if (mobileNav && !mobileNav.hidden) {
            mobileNav.hidden = true;
            document.body.classList.remove('menu-open');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
          }
        }
      };
      anchor.addEventListener('click', handler);
      addCleanup(() => anchor.removeEventListener('click', handler));
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    if (menuToggle && mobileNav) {
      const toggleHandler = () => {
        const isOpen = !mobileNav.hidden;
        mobileNav.hidden = isOpen;
        menuToggle.setAttribute('aria-expanded', String(!isOpen));
        document.body.classList.toggle('menu-open', !isOpen);
      };
      menuToggle.addEventListener('click', toggleHandler);
      addCleanup(() => menuToggle.removeEventListener('click', toggleHandler));
    }
  }

  // 3. Pinned Multi-Phase Hero Sequence (Inspired by findrealestate.com)
  function initHeroPin() {
    if (isReducedMotion() || !window.gsap || !window.ScrollTrigger) return;

    const container = document.querySelector('.hero-pin-container');
    const hero = document.querySelector('#hero');
    if (!container || !hero) return;

    const content = hero.querySelector('.hero__content');
    const cloudsLeft = hero.querySelector('.hero__cloud--left');
    const cloudsRight = hero.querySelector('.hero__cloud--right');
    const ship = hero.querySelector('.hero__ship');
    const logoStage = hero.querySelector('.hero__logo-stage');
    const logoStar = hero.querySelector('.hero__logo-star');
    const logoLine = hero.querySelector('.hero__logo-line');
    const overlayFade = hero.querySelector('.hero__overlay-fade');
    const proof = hero.querySelector('.hero__proof');
    const scrollIndicator = hero.querySelector('.hero__scroll');
    const bg = hero.querySelector('.hero__background');

    // Create Master Scrub Timeline for Hero Pin
    const tl = window.gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        pin: hero,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    // Phase 1: Disperse initial UI & parted clouds
    tl.to(content, { y: -60, opacity: 0, ease: 'power2.inOut', duration: 0.3 }, 0);
    if (proof) tl.to(proof, { y: 40, opacity: 0, ease: 'power2.inOut', duration: 0.25 }, 0);
    if (scrollIndicator) tl.to(scrollIndicator, { opacity: 0, duration: 0.15 }, 0);

    // Clouds parting like atmospheric mist (findrealestate aesthetic)
    if (cloudsLeft) tl.to(cloudsLeft, { xPercent: -55, opacity: 0, duration: 0.5, ease: 'power1.out' }, 0.05);
    if (cloudsRight) tl.to(cloudsRight, { xPercent: 55, opacity: 0, duration: 0.5, ease: 'power1.out' }, 0.05);

    // Phase 2: Ship elevation & centering
    if (ship) {
      tl.to(ship, {
        xPercent: -28,
        yPercent: 18,
        scale: 1.15,
        rotate: -2,
        duration: 0.55,
        ease: 'power1.inOut'
      }, 0.15);
    }
    if (bg) {
      tl.to(bg, { scale: 1.16, yPercent: 6, duration: 0.6, ease: 'none' }, 0.1);
    }

    // Phase 3: Monumental SVG Logo Emblem Emergence
    if (logoStage) {
      tl.to(logoStage, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power2.out' }, 0.35);
      if (logoStar) {
        tl.to(logoStar, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, 0.4);
      }
      if (logoLine) {
        tl.to(logoLine, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, 0.45);
      }
    }

    // Phase 4: Seamless fade to pure white for #audiences entrance
    if (overlayFade) {
      tl.to(overlayFade, { opacity: 1, duration: 0.35, ease: 'power1.inOut' }, 0.7);
    }

    addCleanup(() => {
      tl.scrollTrigger?.kill();
      tl.kill();
    });
  }

  // 4. Word-by-Word Kinetic Text Reveal (findrealestate style)
  function initWordHighlight() {
    if (isReducedMotion() || !window.gsap || !window.ScrollTrigger) return;

    const targets = document.querySelectorAll('.text-scroll-reveal');
    if (!targets.length) return;

    targets.forEach((elem) => {
      // Split text into words if not already split
      if (!elem.querySelector('.split-word')) {
        const text = elem.textContent.trim();
        const words = text.split(/\s+/);
        elem.innerHTML = words
          .map((w) => `<span class="split-word">${w}</span>`)
          .join(' ');
      }

      const wordSpans = elem.querySelectorAll('.split-word');
      if (!wordSpans.length) return;

      const trigger = window.ScrollTrigger.create({
        trigger: elem,
        start: 'top 82%',
        end: 'bottom 45%',
        scrub: true,
        onUpdate: (self) => {
          const count = wordSpans.length;
          const activeIndex = Math.floor(self.progress * count);
          wordSpans.forEach((span, idx) => {
            if (idx <= activeIndex) {
              span.classList.add('is-active');
            } else {
              span.classList.remove('is-active');
            }
          });
        }
      });

      addCleanup(() => trigger.kill());
    });
  }

  // 5. Decoupled Hero Mouse Parallax (QuickTo on ship wrapper - no collision with ScrollTrigger!)
  function initHeroMouseParallax() {
    if (isReducedMotion() || !window.gsap) return;
    if (!window.matchMedia('(pointer:fine)').matches) return;

    const hero = document.querySelector('#hero');
    const wrap = document.querySelector('.hero__ship-wrap');
    if (!hero || !wrap) return;

    const xTo = window.gsap.quickTo(wrap, 'x', { duration: 0.8, ease: 'power2.out' });
    const yTo = window.gsap.quickTo(wrap, 'y', { duration: 0.8, ease: 'power2.out' });

    const onPointerMove = (e) => {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      xTo(nx * 32);
      yTo(ny * 22);
    };

    const onPointerLeave = () => {
      xTo(0);
      yTo(0);
    };

    hero.addEventListener('pointermove', onPointerMove, { passive: true });
    hero.addEventListener('pointerleave', onPointerLeave);

    addCleanup(() => {
      hero.removeEventListener('pointermove', onPointerMove);
      hero.removeEventListener('pointerleave', onPointerLeave);
    });
  }

  // 6. Audience Switcher (Tabs)
  function initAudienceSwitcher() {
    const buttons = [...document.querySelectorAll('[data-audience]')];
    const cards = [...document.querySelectorAll('.journey-card[data-tags]')];
    if (!buttons.length || !cards.length) return;

    const filter = (audience) => {
      buttons.forEach((btn) => {
        btn.setAttribute('aria-pressed', String(btn.dataset.audience === audience));
      });
      cards.forEach((card) => {
        const tags = (card.dataset.tags || '').split(/\s+/);
        if (audience === 'all' || tags.includes(audience)) {
          card.classList.remove('is-dimmed');
        } else {
          card.classList.add('is-dimmed');
        }
      });
    };

    buttons.forEach((btn) => {
      const handler = () => filter(btn.dataset.audience);
      btn.addEventListener('click', handler);
      addCleanup(() => btn.removeEventListener('click', handler));
    });
  }

  // 7. Program Filters
  function initProgramFilters() {
    const filterButtons = [...document.querySelectorAll('[data-program-filter]')];
    const cards = [...document.querySelectorAll('.program-card[data-program]')];
    if (!filterButtons.length || !cards.length) return;

    const applyFilter = (category) => {
      filterButtons.forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.programFilter === category);
      });
      cards.forEach((card) => {
        const progs = (card.dataset.program || '').split(/\s+/);
        if (category === 'all' || progs.includes(category)) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    };

    filterButtons.forEach((btn) => {
      const handler = () => applyFilter(btn.dataset.programFilter);
      btn.addEventListener('click', handler);
      addCleanup(() => btn.removeEventListener('click', handler));
    });
  }

  // 8. Horizontal Track Dragging
  function initHorizontalTrack() {
    const track = document.querySelector('.horizontal-track');
    if (!track) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e) => {
      isDown = true;
      track.classList.add('is-dragging');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    };
    const onMouseLeave = () => {
      isDown = false;
      track.classList.remove('is-dragging');
    };
    const onMouseUp = () => {
      isDown = false;
      track.classList.remove('is-dragging');
    };
    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    };

    track.addEventListener('mousedown', onMouseDown);
    track.addEventListener('mouseleave', onMouseLeave);
    track.addEventListener('mouseup', onMouseUp);
    track.addEventListener('mousemove', onMouseMove);

    addCleanup(() => {
      track.removeEventListener('mousedown', onMouseDown);
      track.removeEventListener('mouseleave', onMouseLeave);
      track.removeEventListener('mouseup', onMouseUp);
      track.removeEventListener('mousemove', onMouseMove);
    });
  }

  // 9. Contact Form Handler
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const onSubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = fd.get('name') || '';
      const phone = fd.get('phone') || '';
      const interest = fd.get('interest') || '';

      const status = form.querySelector('.form-status');
      if (status) {
        status.textContent = `Спасибо, ${name}! Заявка на «${interest}» принята. Мы свяжемся с вами по номеру ${phone}.`;
        status.style.color = 'var(--brand)';
      }

      // Pre-fill mailto fallback
      const subject = encodeURIComponent(`Заявка с сайта: ${interest}`);
      const body = encodeURIComponent(`Имя: ${name}\nТелефон: ${phone}\nНаправление: ${interest}`);
      const mailtoLink = `mailto:letkor@mail.ru?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;
    };

    form.addEventListener('submit', onSubmit);
    addCleanup(() => form.removeEventListener('submit', onSubmit));
  }

  // 10. Magnetic Button Hover Effect
  function initMagnetic() {
    if (isReducedMotion() || !window.gsap) return;
    if (!window.matchMedia('(pointer:fine)').matches) return;

    const magneticElements = document.querySelectorAll('[data-magnetic]');
    magneticElements.forEach((el) => {
      const xTo = window.gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power2.out' });
      const yTo = window.gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power2.out' });

      const onMove = (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.28;
        const dy = (e.clientY - cy) * 0.28;
        xTo(dx);
        yTo(dy);
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);

      addCleanup(() => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      });
    });
  }

  // Initialize
  function init() {
    initSmoothScroll();
    initHeader();
    initHeroPin();
    initWordHighlight();
    initHeroMouseParallax();
    initAudienceSwitcher();
    initProgramFilters();
    initHorizontalTrack();
    initContactForm();
    initMagnetic();
    document.documentElement.classList.add('motion-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
