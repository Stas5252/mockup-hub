/**
 * ЛЕТУЧИЙ КОРАБЛЬ — High-End Motion & Interactive Engine
 * Stack: GSAP 3 + ScrollTrigger + Lenis Smooth Scroll
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Lenis Smooth Scroll & GSAP RAF Integration
  // --------------------------------------------------------------------------
  let lenis;
  try {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  } catch (err) {
    console.warn('Lenis fallback', err);
  }

  // Smooth anchor links with Lenis
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(targetElement, { offset: -40, duration: 1.4 });
          } else {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
          closeMobileNav();
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 2. Header Scroll Reactivity
  // --------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 3. Hero Parallax (Desktop Mouse + ScrollTrigger)
  // --------------------------------------------------------------------------
  const heroSection = document.querySelector('.hero-section');
  const heroBg = document.querySelector('.hero-bg-layer');
  const heroContent = document.querySelector('.hero-content');
  const heroBottom = document.querySelector('.hero-bottom-bar');

  // Mouse Parallax with damping (Lerp)
  if (heroSection && heroBg && window.innerWidth > 992) {
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    const updateMouseParallax = () => {
      currentX += (mouseX - currentX) * 0.04;
      currentY += (mouseY - currentY) * 0.04;

      heroBg.style.transform = `scale(1.04) translate(${currentX * -12}px, ${currentY * -8}px)`;
      requestAnimationFrame(updateMouseParallax);
    };
    updateMouseParallax();
  }

  // Hero ScrollTrigger
  if (heroSection) {
    gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8,
      },
    })
      .to(heroContent, { y: -70, opacity: 0.2, ease: 'none' }, 0)
      .to(heroBottom, { y: -40, opacity: 0, ease: 'none' }, 0)
      .to(heroBg, { scale: 1.12, y: 50, ease: 'none' }, 0);
  }

  // --------------------------------------------------------------------------
  // 4. Hero Magnetic CTA Button
  // --------------------------------------------------------------------------
  const magneticButtons = document.querySelectorAll('.btn-cta, .carousel-nav-btn');
  if (window.innerWidth > 992) {
    magneticButtons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. «Куда полетим?» Carousel Controls & Drag
  // --------------------------------------------------------------------------
  const cardsGrid = document.querySelector('.discovery-cards-grid');
  const prevBtn = document.querySelector('.carousel-nav-btn.prev');
  const nextBtn = document.querySelector('.carousel-nav-btn.next');

  if (cardsGrid && prevBtn && nextBtn) {
    const cardWidth = 340;
    prevBtn.addEventListener('click', () => {
      cardsGrid.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      cardsGrid.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });
  }

  // Quick navigation from adventure cards to respective storytelling chapters
  document.querySelectorAll('.adventure-card').forEach((card) => {
    card.addEventListener('click', () => {
      const chapterTarget = card.getAttribute('data-target');
      if (chapterTarget) {
        const el = document.querySelector(chapterTarget);
        if (el) {
          if (lenis) {
            lenis.scrollTo(el, { offset: -40, duration: 1.4 });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. Deep Journey Chapters Animations (GSAP ScrollTrigger)
  // --------------------------------------------------------------------------
  const chapters = document.querySelectorAll('.journey-chapter');
  chapters.forEach((chapter) => {
    const mediaCard = chapter.querySelector('.chapter-media-card');
    const content = chapter.querySelector('.chapter-content-side');

    if (mediaCard) {
      gsap.from(mediaCard, {
        scale: 0.95,
        opacity: 0.8,
        duration: 1,
        ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: chapter,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }

    if (content) {
      gsap.from(content.children, {
        y: 30,
        opacity: 0.2,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: chapter,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }
  });

  // --------------------------------------------------------------------------
  // 7. Interactive Catalog Filtering & Program Booking
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programCards = document.querySelectorAll('.program-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      programCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          gsap.to(card, {
            autoAlpha: 1,
            scale: 1,
            display: 'flex',
            duration: 0.35,
            ease: 'power2.out',
          });
        } else {
          gsap.to(card, {
            autoAlpha: 0,
            scale: 0.95,
            display: 'none',
            duration: 0.25,
            ease: 'power2.in',
          });
        }
      });
    });
  });

  // Handle "Забронировать" click to prefill tour in modal
  document.querySelectorAll('.program-btn-order, .chapter-book-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tourName = btn.getAttribute('data-tour') || 'Индивидуальный подбор тура';
      const tourSelect = document.querySelector('#modalTourSelect');
      if (tourSelect) {
        tourSelect.value = tourName;
      }
      openModal('bookingModal');
    });
  });

  // --------------------------------------------------------------------------
  // 8. Animated Counters (GSAP ScrollTrigger)
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.count-up');
  statNumbers.forEach((stat) => {
    const target = parseInt(stat.getAttribute('data-count'), 10);
    const suffix = stat.getAttribute('data-suffix') || '';

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        let obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            stat.textContent = Math.floor(obj.val).toLocaleString('ru-RU') + suffix;
          },
          onComplete: () => {
            stat.textContent = target.toLocaleString('ru-RU') + suffix;
          }
        });
      },
    });
  });

  // --------------------------------------------------------------------------
  // 9. Interactive Map Pins in «С нами с 2007 года»
  // --------------------------------------------------------------------------
  const pins = document.querySelectorAll('.route-pin');
  const tooltip = document.querySelector('#mapTooltip');

  pins.forEach((pin) => {
    pin.addEventListener('mouseenter', (e) => {
      const info = pin.getAttribute('data-info');
      if (tooltip && info) {
        tooltip.textContent = info;
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
      }
    });
    pin.addEventListener('mousemove', (e) => {
      if (tooltip) {
        const rect = pin.closest('svg').getBoundingClientRect();
        tooltip.style.left = `${e.clientX - rect.left + 15}px`;
        tooltip.style.top = `${e.clientY - rect.top - 30}px`;
      }
    });
    pin.addEventListener('mouseleave', () => {
      if (tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
      }
    });
  });

  // --------------------------------------------------------------------------
  // 10. Modals Management
  // --------------------------------------------------------------------------
  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      if (lenis) lenis.stop();
    }
  };

  const closeModal = (modal) => {
    if (modal) {
      modal.classList.remove('active');
      if (lenis) lenis.start();
    }
  };

  document.querySelectorAll('.open-modal-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-modal');
      if (modalId) openModal(modalId);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('.modal-close-btn')) {
        closeModal(overlay);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach((m) => closeModal(m));
      closeMobileNav();
    }
  });

  // --------------------------------------------------------------------------
  // 11. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileNav = document.querySelector('.mobile-nav-drawer');
  const closeDrawerBtn = document.querySelector('.drawer-close-btn');

  const openMobileNav = () => {
    if (mobileNav) {
      mobileNav.classList.add('open');
      if (lenis) lenis.stop();
    }
  };

  const closeMobileNav = () => {
    if (mobileNav) {
      mobileNav.classList.remove('open');
      if (lenis) lenis.start();
    }
  };

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileNav);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeMobileNav);

  // --------------------------------------------------------------------------
  // 12. Booking Form Submission
  // --------------------------------------------------------------------------
  const bookingForm = document.querySelector('#bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('.form-submit-btn');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Отправка заявки...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = '✓ Заявка успешно принята!';
        submitBtn.style.background = '#28a745';

        setTimeout(() => {
          closeModal(document.querySelector('#bookingModal'));
          bookingForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          alert('Спасибо за заявку! Наш менеджер свяжется с вами в течение 15 минут в рабочее время.');
        }, 1200);
      }, 900);
    });
  }

  // --------------------------------------------------------------------------
  // 13. Final Scene Perspective Zoom on Scroll
  // --------------------------------------------------------------------------
  const finalSection = document.querySelector('.section-final-cinematic');
  const finalBg = document.querySelector('.final-sunset-bg');

  if (finalSection && finalBg) {
    gsap.fromTo(
      finalBg,
      { scale: 1.15, yPercent: -4 },
      {
        scale: 1.0,
        yPercent: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: finalSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  }
});
