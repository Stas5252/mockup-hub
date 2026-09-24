/**
 * Строительная компания «МАСШТАБ»
 * Высокопроизводительный движок интерактивности и анимаций:
 * - Lenis Momentum Smooth Scroll (creative-motion-engine)
 * - GSAP 3 & ScrollTrigger кинематографичные появления и скролл-эффекты
 * - Магнитные кнопки (Magnetic Physics)
 * - Анимированные счетчики метрик
 * - Интерактивный калькулятор сметы и 3D-план
 * - Безупречный адаптив под любые устройства (Impeccable QA standard)
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. ИНИЦИАЛИЗАЦИЯ LENIS SMOOTH SCROLL & СИНХРОНИЗАЦИЯ С GSAP
  // ==========================================================================
  let lenis = null;

  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // Экспортируем в window для внешнего доступа и headless CDP скриптов
    window.lenis = lenis;

    // Синхронизация с GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      // gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // ==========================================================================
  // 2. ХЕДЕР: БЛЮР И ФИКСАЦИЯ ПРИ СКРОЛЛЕ
  // ==========================================================================
  const header = document.querySelector('.site-header');
  const handleScroll = (scrollY) => {
    if (scrollY > 30) {
      header?.classList.add('is-scrolled');
    } else {
      header?.classList.remove('is-scrolled');
    }
  };

  if (lenis) {
    lenis.on('scroll', (e) => handleScroll(e.scroll));
  } else {
    window.addEventListener('scroll', () => handleScroll(window.scrollY), { passive: true });
  }

  // ==========================================================================
  // 3. ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРНЫМ ССЫЛКАМ (ЧЕРЕЗ LENIS)
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        
        // Закрываем мобильное меню если открыто
        const mobileDrawer = document.getElementById('mobile-drawer');
        if (mobileDrawer?.classList.contains('active')) {
          mobileDrawer.classList.remove('active');
          document.body.style.overflow = '';
          if (lenis) lenis.start();
        }

        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -70, duration: 1.2 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // ==========================================================================
  // 4. ГЛАВНЫЙ HERO СЛАЙДЕР С ДИНАМИЧЕСКИМ ПРОГРЕСС-БАРОМ
  // ==========================================================================
  const heroSlides = [
    {
      index: '01',
      tag: 'РЕМОНТ И ОТДЕЛКА ПОД КЛЮЧ В АРХАНГЕЛЬСКЕ И ОБЛАСТИ',
      title: 'Больше<br>чем ремонт',
      desc: 'Строительная компания МАСШТАБ — создаем продуманные пространства, где качество отделки, надежность инженерных сетей и безупречный уют образуют единое гармоничное целое.',
      img: 'assets/img/hero-luxury-facade.jpg',
      badgeTop: 'ДОМ,<br>КОТОРЫЙ<br>ВДОХНОВЛЯЕТ',
      badgeBottom: 'АРХАНГЕЛЬСК.<br><span class="text-[10px] tracking-[0.22em] font-light text-[#00e5d4]">СЕВЕРОДВИНСК.</span>'
    },
    {
      index: '02',
      tag: 'ДИЗАЙН-ПРОЕКТЫ И 3D-ВИЗУАЛИЗАЦИЯ ИНТЕРЬЕРОВ',
      title: 'Масштаб<br>ваших идей',
      desc: 'Создаем авторские планировочные решения, фотореалистичную 3D визуализацию, ведомость чистовых материалов и развертки электрики. Авторский надзор до новоселья.',
      img: 'assets/img/hero-interior.jpg',
      badgeTop: 'ДИЗАЙН-ПРОЕКТЫ<br>ПОД КЛЮЧ',
      badgeBottom: 'АРХАНГЕЛЬСК.<br><span class="text-[10px] tracking-[0.22em] font-light text-[#00e5d4]">СЕВЕРОДВИНСК.</span>'
    },
    {
      index: '03',
      tag: 'ЭЛЕКТРОСНАБЖЕНИЕ И ЭЛЕКТРОМОНТАЖ ЛЮБОЙ СЛОЖНОСТИ',
      title: 'Надежность<br>на века',
      desc: 'Проектирование и монтаж систем электроснабжения, сборка электрощитов по ГОСТ, разводка слаботочных сетей и умного дома с официальной гарантией в договоре.',
      img: 'assets/img/renovation-electro.jpg',
      badgeTop: 'ЭЛЕКТРОСНАБЖЕНИЕ<br>ПО ГОСТ',
      badgeBottom: 'ФИКСИРОВАННАЯ<br><span class="text-[10px] tracking-[0.22em] font-light text-[#00e5d4]">ЦЕНА В ДОГОВОРЕ</span>'
    }
  ];

  let currentSlideIndex = 0;
  let slideInterval = null;
  const SLIDE_DURATION = 8000; // 8 секунд на слайд

  const heroTag = document.getElementById('hero-tag');
  const heroTitle = document.getElementById('hero-title');
  const heroDesc = document.getElementById('hero-desc');
  const heroImg = document.getElementById('hero-img');
  const heroBadgeTop = document.getElementById('hero-badge-top');
  const heroBadgeBottom = document.getElementById('hero-badge-bottom');
  const heroPagination = document.getElementById('hero-pagination');
  const heroProgressBar = document.getElementById('hero-progress-bar');

  function startProgressBar() {
    if (!heroProgressBar) return;
    heroProgressBar.style.transition = 'none';
    heroProgressBar.style.width = '0%';
    
    // Форсируем reflow
    void heroProgressBar.offsetWidth;
    
    heroProgressBar.style.transition = `width ${SLIDE_DURATION}ms linear`;
    heroProgressBar.style.width = '100%';
  }

  function updateHeroSlide(index) {
    currentSlideIndex = index;
    const slide = heroSlides[index];

    if (heroTag) heroTag.textContent = slide.tag;
    if (heroTitle) heroTitle.innerHTML = slide.title;
    if (heroDesc) heroDesc.textContent = slide.desc;
    
    if (heroImg) {
      if (typeof gsap !== 'undefined') {
        gsap.to(heroImg, {
          opacity: 0.35,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            heroImg.src = slide.img;
            gsap.to(heroImg, { opacity: 1, duration: 0.6, ease: 'power2.out' });
          }
        });
      } else {
        heroImg.style.opacity = '0.35';
        setTimeout(() => {
          heroImg.src = slide.img;
          heroImg.style.opacity = '1';
        }, 250);
      }
    }

    if (heroBadgeTop) heroBadgeTop.innerHTML = slide.badgeTop;
    if (heroBadgeBottom) heroBadgeBottom.innerHTML = slide.badgeBottom;

    // Пагинация 01 —— 02 03
    if (heroPagination) {
      const items = heroPagination.querySelectorAll('.page-num');
      items.forEach((item, idx) => {
        if (idx === index) {
          item.className = 'page-num active-page cursor-pointer text-white font-semibold transition-colors';
        } else {
          item.className = 'page-num inactive-page cursor-pointer text-slate-500 hover:text-white transition-colors';
        }
      });
    }

    startProgressBar();
  }

  function startSlideTimer() {
    clearInterval(slideInterval);
    startProgressBar();
    slideInterval = setInterval(() => {
      const nextIndex = (currentSlideIndex + 1) % heroSlides.length;
      updateHeroSlide(nextIndex);
    }, SLIDE_DURATION);
  }

  if (heroPagination) {
    const pageNums = heroPagination.querySelectorAll('.page-num');
    pageNums.forEach((el) => {
      el.addEventListener('click', () => {
        const targetIndex = parseInt(el.getAttribute('data-slide') || '0', 10);
        updateHeroSlide(targetIndex);
        startSlideTimer();
      });
    });
  }

  startSlideTimer();

  // ==========================================================================
  // 5. GSAP КИНЕМАТОГРАФИЧНЫЕ ПОЯВЛЕНИЯ И АНИМАЦИИ
  // ==========================================================================
  if (typeof gsap !== 'undefined') {
    // 5.1 Hero секция: быстрое кинематографичное появление без задержки конверсионных кнопок
    const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    heroTl
      .from('.site-header', { y: -20, opacity: 0, duration: 0.5 })
      .from('#hero-tag', { x: -20, opacity: 0, duration: 0.4 }, 0.1)
      .from('#hero-title', { y: 25, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.15)
      .from('#hero-desc', { y: 15, opacity: 0, duration: 0.5 }, 0.25)
      .fromTo(['#btn-hero-calc-main', '#btn-hero-calc-text'], 
        { scale: 0.95, opacity: 0 }, 
        { scale: 1, opacity: 1, stagger: 0.08, duration: 0.4 }, 0.3)
      .from('#hero-pagination', { opacity: 0, y: 10, duration: 0.4 }, 0.35)
      .from('#hero-badge-top, #hero-badge-bottom', { opacity: 0, x: 15, stagger: 0.1, duration: 0.5 }, 0.25);

    // 5.2 ScrollTrigger: Анимация полосы метрик и счетчики
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: '.stats-bar-section',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.from('.stat-col', {
            y: 25,
            opacity: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: 'power3.out'
          });

          // Анимация чисел счетчиков
          document.querySelectorAll('.stat-counter').forEach((counter) => {
            const targetVal = parseFloat(counter.getAttribute('data-target') || '0');
            const suffix = counter.getAttribute('data-suffix') || '';
            if (targetVal > 0) {
              const counterObj = { val: 0 };
              gsap.to(counterObj, {
                val: targetVal,
                duration: 1.8,
                ease: 'power2.out',
                onUpdate: () => {
                  counter.textContent = Math.round(counterObj.val) + suffix;
                }
              });
            }
          });
        }
      });

      // 5.3 Реализованные проекты: появление карточек
      gsap.from('.card-project', {
        scrollTrigger: {
          trigger: '#projects',
          start: 'top 80%',
          once: true,
        },
        y: 35,
        opacity: 0,
        stagger: 0.14,
        duration: 0.9,
        ease: 'power3.out',
      });

      // 5.4 Преимущества: параллакс фотографии и появление пунктов
      gsap.to('.advantage-parallax-img', {
        scrollTrigger: {
          trigger: '#advantages',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        yPercent: 8,
        ease: 'none',
      });

      gsap.from('.advantage-perk-item', {
        scrollTrigger: {
          trigger: '#advantages',
          start: 'top 75%',
          once: true,
        },
        x: -25,
        opacity: 0,
        stagger: 0.09,
        duration: 0.8,
        ease: 'power3.out',
      });

      // 5.5 Услуги: параллакс фотографии
      gsap.to('.service-parallax-img', {
        scrollTrigger: {
          trigger: '#services',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        yPercent: 8,
        ease: 'none',
      });

      // 5.6 Отзывы: параллакс фото
      gsap.to('.testimonial-parallax-img', {
        scrollTrigger: {
          trigger: '#reviews',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        yPercent: 8,
        ease: 'none',
      });
    }
  }

  // ==========================================================================
  // 6. МАГНИТНЫЕ КНОПКИ (MAGNETIC PHYSICS НА ДЕСКТОПЕ)
  // ==========================================================================
  if (typeof gsap !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const magneticElements = document.querySelectorAll('.btn-circle-arrow, .btn-circle-arrow-light');
    magneticElements.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
          x: x * 0.35,
          y: y * 0.35,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1.2, 0.4)',
        });
      });
    });
  }

  // ==========================================================================
  // 7. СЛАЙДЕР ОТЗЫВОВ КЛИЕНТОВ (1 / 3)
  // ==========================================================================
  const testimonials = [
    {
      num: '1 / 3',
      text: 'Делали капитальный ремонт 3-комнатной квартиры под ключ в Архангельске. Смета строго по договору, ни на рубль больше! Сдали даже на 4 дня раньше срока, электрика, плитка и двери установлены идеально. Огромное спасибо компании «МАСШТАБ»!',
      name: 'Екатерина и Александр В.',
      role: 'Квартира 112 м², ЖК RIVER PARK, Архангельск',
      avatar: 'assets/img/avatar-clients.jpg',
      duration: '45 рабочих дней',
      budget: 'Без переплат (0 ₽)',
      warranty: '5 лет по договору'
    },
    {
      num: '2 / 3',
      text: 'Заказывал строительство и чистовую отделку загородного дома 240 м² в Северодвинске. Ребята из «МАСШТАБ» взяли на себя всё: от фундамента и электроснабжения по ГОСТ до чистовой отделки. Каждую неделю получал детальный видеоотчет в Telegram. Однозначно рекомендую!',
      name: 'Михаил Смирнов',
      role: 'Владелец резиденции «Белый Берег», Северодвинск',
      avatar: 'assets/img/avatar-client2.jpg',
      duration: '90 рабочих дней',
      budget: 'Строго по смете',
      warranty: '5 лет по договору'
    },
    {
      num: '3 / 3',
      text: 'Делали капитальный ремонт офиса 310 м² в БЦ Север. Главным требованием было уложиться в жесткий дедлайн и согласовать сложный проект электрики и вентиляции. Команда сработала как единый механизм — открылись точно в срок без единого замечания.',
      name: 'Игорь Демидов',
      role: 'Руководитель инвестиционной группы «Северный Союз»',
      avatar: 'assets/img/avatar-client3.jpg',
      duration: '35 рабочих дней',
      budget: 'Точно в бюджет',
      warranty: '5 лет по договору'
    }
  ];

  let testIdx = 0;
  const testText = document.getElementById('test-text');
  const testName = document.getElementById('test-name');
  const testRole = document.getElementById('test-role');
  const testAvatar = document.getElementById('test-avatar');
  const testCounter = document.getElementById('test-counter');
  const testDuration = document.getElementById('test-duration');
  const testBudget = document.getElementById('test-budget');
  const testWarranty = document.getElementById('test-warranty');
  const testPrev = document.getElementById('test-prev');
  const testNext = document.getElementById('test-next');

  function renderTestimonial(idx) {
    testIdx = idx;
    const item = testimonials[idx];

    if (typeof gsap !== 'undefined') {
      gsap.to(['#test-text', '#test-name', '#test-role', '#test-duration', '#test-budget', '#test-warranty'], {
        opacity: 0,
        y: -10,
        duration: 0.2,
        onComplete: () => {
          if (testText) testText.textContent = item.text;
          if (testName) testName.textContent = item.name;
          if (testRole) testRole.textContent = item.role;
          if (testAvatar) testAvatar.src = item.avatar;
          if (testCounter) testCounter.textContent = item.num;
          if (testDuration) testDuration.textContent = item.duration;
          if (testBudget) testBudget.textContent = item.budget;
          if (testWarranty) testWarranty.textContent = item.warranty;

          gsap.to(['#test-text', '#test-name', '#test-role', '#test-duration', '#test-budget', '#test-warranty'], {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
          });
        }
      });
    } else {
      if (testText) testText.textContent = item.text;
      if (testName) testName.textContent = item.name;
      if (testRole) testRole.textContent = item.role;
      if (testAvatar) testAvatar.src = item.avatar;
      if (testCounter) testCounter.textContent = item.num;
      if (testDuration) testDuration.textContent = item.duration;
      if (testBudget) testBudget.textContent = item.budget;
      if (testWarranty) testWarranty.textContent = item.warranty;
    }
  }

  testPrev?.addEventListener('click', () => {
    const prev = (testIdx - 1 + testimonials.length) % testimonials.length;
    renderTestimonial(prev);
  });

  testNext?.addEventListener('click', () => {
    const next = (testIdx + 1) % testimonials.length;
    renderTestimonial(next);
  });

  // ==========================================================================
  // 8. ГАЛЕРЕЯ (СТАТИЧЕСКИЙ ГРИД — кнопки prev/next оставлены декоративно)
  // ==========================================================================
  // Галерея отображается как CSS grid 2x2 / 4-column, навигация не требуется.

  // ==========================================================================
  // 9. ИНТЕРАКТИВНАЯ КАРТА ОБЪЕКТОВ
  // ==========================================================================
  const mapData = {
    office: {
      title: 'Центральный офис «МАСШТАБ»',
      address: 'Архангельск, Троицкий проспект, 65',
      desc: 'Главный офис, шоурум отделочных материалов и проектное бюро.',
      status: 'Открыт пн-сб с 09:00 до 20:00'
    },
    riverpark: {
      title: 'ЖК RIVER PARK',
      address: 'Архангельск, Набережная Северной Двины',
      desc: 'Премиальный ремонт 3 резиденций общей площадью 380 м².',
      status: 'Объект сдан в 2025 г.'
    },
    whitecoast: {
      title: 'Резиденция «Белый Берег»',
      address: 'Северодвинск, район о. Ягры',
      desc: 'Строительство загородного коттеджа из керамоблока с полной отделкой.',
      status: 'Объект сдан в 2024 г.'
    }
  };

  const mapTooltip = document.getElementById('map-tooltip');
  const mapTooltipTitle = document.getElementById('map-tooltip-title');
  const mapTooltipAddress = document.getElementById('map-tooltip-address');
  const mapTooltipStatus = document.getElementById('map-tooltip-status');

  document.querySelectorAll('.map-pin-btn').forEach((pin) => {
    pin.addEventListener('click', () => {
      const key = pin.getAttribute('data-pin');
      if (key && mapData[key] && mapTooltip) {
        const d = mapData[key];
        if (mapTooltipTitle) mapTooltipTitle.textContent = d.title;
        if (mapTooltipAddress) mapTooltipAddress.textContent = d.address;
        if (mapTooltipStatus) mapTooltipStatus.textContent = d.status;

        mapTooltip.classList.remove('hidden');
        mapTooltip.classList.add('flex');
      }
    });
  });

  document.getElementById('map-tooltip-close')?.addEventListener('click', () => {
    mapTooltip?.classList.add('hidden');
    mapTooltip?.classList.remove('flex');
  });

  // ==========================================================================
  // 10. ИНТЕРАКТИВНЫЙ КАЛЬКУЛЯТОР СМЕТЫ РЕМОНТА
  // ==========================================================================
  const calcAreaInput = document.getElementById('calc-area-range');
  const calcAreaVal = document.getElementById('calc-area-display');
  const calcTypeSelect = document.getElementById('calc-type');
  const calcTierRadios = document.querySelectorAll('input[name="calc-tier"]');
  const calcDesignCheck = document.getElementById('calc-opt-design');
  const calcElectroCheck = document.getElementById('calc-opt-electro');
  const calcFurnitureCheck = document.getElementById('calc-opt-furniture');
  const calcResultPrice = document.getElementById('calc-result-price');
  const calcResultDays = document.getElementById('calc-result-days');

  function calculateEstimate() {
    if (!calcAreaInput || !calcResultPrice) return;

    const area = parseInt(calcAreaInput.value || '85', 10);
    if (calcAreaVal) calcAreaVal.textContent = area + ' м²';

    let ratePerMeter = 14500; // Комфорт по умолчанию
    calcTierRadios.forEach((r) => {
      if (r.checked) {
        ratePerMeter = parseInt(r.value, 10);
      }
    });

    const typeCoeff = parseFloat(calcTypeSelect?.value || '1.0');

    let addonPerMeter = 0;
    if (calcDesignCheck?.checked) addonPerMeter += 2200;
    if (calcElectroCheck?.checked) addonPerMeter += 3500;
    if (calcFurnitureCheck?.checked) addonPerMeter += 4000;

    const totalPrice = Math.round(area * (ratePerMeter * typeCoeff + addonPerMeter));
    const estimatedDays = Math.round(35 + area * 0.75);

    calcResultPrice.textContent = totalPrice.toLocaleString('ru-RU') + ' ₽';
    if (calcResultDays) calcResultDays.textContent = estimatedDays + ' рабочих дней';
  }

  calcAreaInput?.addEventListener('input', calculateEstimate);
  calcTypeSelect?.addEventListener('change', calculateEstimate);
  calcTierRadios.forEach((r) => r.addEventListener('change', calculateEstimate));
  calcDesignCheck?.addEventListener('change', calculateEstimate);
  calcElectroCheck?.addEventListener('change', calculateEstimate);
  calcFurnitureCheck?.addEventListener('change', calculateEstimate);

  calculateEstimate();

  // ==========================================================================
  // 11. ИНТЕРАКТИВНЫЕ КОМНАТЫ НА ПЛАНЕ КВАРТИРЫ
  // ==========================================================================
  const roomInfo = {
    living: {
      name: 'Кухня-гостиная с островом',
      size: '48.5 м²',
      desc: 'Зона приготовления, остров из натурального кварцита, обеденная группа на 6 персон и просторный диванный лаундж с панорамным видом.'
    },
    bedroom: {
      name: 'Мастер-спальня',
      size: '22.0 м²',
      desc: 'Кровать king-size, мягкое скрытое контурное освещение, примыкающий персональный санузел и гардеробная.'
    },
    bath1: {
      name: 'Мастер-санузел',
      size: '8.2 м²',
      desc: 'Отдельностоящая ванна, душевая зона walk-in, керамогранит крупного формата 120х278.'
    },
    bath2: {
      name: 'Гостевой санузел и прихожая',
      size: '6.0 м²',
      desc: 'Подвесная сантехника, гигиенический душ, зеркало со встроенным обогревом.'
    },
    closet: {
      name: 'Гардеробная комната',
      size: '6.5 м²',
      desc: 'Индивидуальные системы хранения с подсветкой полок и доводчиками Blum.'
    }
  };

  const roomDisplay = document.getElementById('room-detail-display');
  const planRooms = document.querySelectorAll('.plan-room');

  planRooms.forEach((roomEl) => {
    const handleSelectRoom = () => {
      const rKey = roomEl.getAttribute('data-room');
      planRooms.forEach((r) => r.classList.remove('active-room'));
      roomEl.classList.add('active-room');

      if (rKey && roomInfo[rKey] && roomDisplay) {
        const info = roomInfo[rKey];
        roomDisplay.innerHTML = `
          <div class="text-xs font-mono uppercase tracking-wider text-[#00b4b6] mb-1 font-semibold">${info.size}</div>
          <div class="font-serif text-lg text-slate-900 font-semibold mb-1">${info.name}</div>
          <div class="text-xs text-slate-600 leading-relaxed">${info.desc}</div>
        `;
      }
    };

    roomEl.addEventListener('mouseenter', handleSelectRoom);
    roomEl.addEventListener('click', handleSelectRoom);
  });

  // ==========================================================================
  // 12. МОДАЛЬНЫЕ ОКНА И МОБИЛЬНОЕ МЕНЮ (С УПРАВЛЕНИЕМ LENIS SCROLL LOCK)
  // ==========================================================================
  function setupModal(triggerBtnId, modalId) {
    const trigger = document.getElementById(triggerBtnId);
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close-btn');

    function openModal() {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    }

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }

    trigger?.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });

    closeBtn?.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  setupModal('btn-open-calc', 'modal-calc');
  setupModal('btn-open-calc-2', 'modal-calc');
  setupModal('btn-header-call', 'modal-call');
  setupModal('btn-hero-calc', 'modal-calc');
  setupModal('btn-hero-calc-main', 'modal-calc');
  setupModal('btn-hero-calc-text', 'modal-calc');

  // Мобильное меню (Drawer)
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');

  mobileMenuBtn?.addEventListener('click', () => {
    mobileDrawer?.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  });

  const closeDrawer = () => {
    mobileDrawer?.classList.remove('active');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  };

  mobileDrawerClose?.addEventListener('click', closeDrawer);
  mobileDrawer?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // ==========================================================================
  // 13. TOAST УВЕДОМЛЕНИЯ И ОТПРАВКА ФОРМ
  // ==========================================================================
  const toast = document.getElementById('toast-success');
  function showToast(msg) {
    if (!toast) return;
    const toastMsg = toast.querySelector('.toast-message');
    if (toastMsg && msg) toastMsg.textContent = msg;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 4500);
  }

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const phoneInput = form.querySelector('input[type="tel"]');
      if (phoneInput && !phoneInput.value.trim()) {
        phoneInput.focus();
        return;
      }

      // Закрываем активные модалки
      document.querySelectorAll('.modal-backdrop.active').forEach((m) => {
        m.classList.remove('active');
      });
      document.body.style.overflow = '';
      if (lenis) lenis.start();

      showToast('Спасибо за заявку! Наш главный инженер свяжется с вами в течение 15 минут для согласования бесплатного замера.');
      form.reset();
    });
  });

  // Маска ввода для телефона (+7 (XXX) XXX-XX-XX)
  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener('input', () => {
      let val = input.value.replace(/\D/g, '');
      if (val.startsWith('7') || val.startsWith('8')) {
        val = val.substring(1);
      }
      let formatted = '+7 ';
      if (val.length > 0) formatted += '(' + val.substring(0, 3);
      if (val.length >= 3) formatted += ') ' + val.substring(3, 6);
      if (val.length >= 6) formatted += '-' + val.substring(6, 8);
      if (val.length >= 8) formatted += '-' + val.substring(8, 10);
      input.value = formatted;
    });
  });
});
