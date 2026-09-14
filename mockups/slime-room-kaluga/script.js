/**
 * КОМНАТА СЛАЙМОВ | КАЛУГА — Интерактивный тактильный скрипт
 * ВКонтакте: https://vk.com/slimeroom | Сообщения: https://vk.me/slimeroom
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. WEB AUDIO API SYNTHESIZER (Тактильные звуки без внешних файлов)
  // ==========================================================================
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Звук чпока / пузыря
  function playPop(frequency = 520) {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      const now = audioCtx.currentTime;

      // Быстрый свип вверх для сочного «чпок!»
      osc.frequency.setValueAtTime(frequency * 0.7, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.6, now + 0.07);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      console.warn('Audio playPop error:', e);
    }
  }

  // Звук сквиша / жмяка
  function playSquish() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const filter = audioCtx.createBiquadFilter();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      const now = audioCtx.currentTime;

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(280, now + 0.12);

      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch (e) {
      console.warn('Audio playSquish error:', e);
    }
  }

  // Звук праздничного звоночка / успеха
  function playChime() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        const now = audioCtx.currentTime + index * 0.06;

        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.36);
      });
    } catch (e) {
      console.warn('Audio playChime error:', e);
    }
  }

  // Переключатель звука
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      const iconSpan = soundToggleBtn.querySelector('.sound-icon') || soundToggleBtn;
      const textSpan = soundToggleBtn.querySelector('.sound-text');

      if (soundEnabled) {
        initAudio();
        playPop(600);
        soundToggleBtn.classList.remove('muted');
        iconSpan.textContent = '🔊';
        if (textSpan) textSpan.textContent = 'Звук: ВКЛ';
        showToast('Звуковые эффекты включены! ✨');
      } else {
        soundToggleBtn.classList.add('muted');
        iconSpan.textContent = '🔇';
        if (textSpan) textSpan.textContent = 'Звук: ВЫКЛ';
        showToast('Звук выключен');
      }
    });
  }

  // ==========================================================================
  // 2. ИНТЕРАКТИВНАЯ СКВИШ-ЛАПКА / СЛАЙМО-ТАППЕР (HERO WIDGET)
  // ==========================================================================
  const squishyPawWrap = document.getElementById('squishyPawWrap');
  const squishyPawEl = document.getElementById('squishyPaw');
  const pawMeterBar = document.getElementById('pawProgressBar');
  const pawCountDisplay = document.getElementById('pawCountDisplay');
  const pawHeadline = document.getElementById('pawHeadline');
  const pawParticlesWrap = document.getElementById('pawParticles');
  const pawRewardTrigger = document.getElementById('pawRewardTrigger');
  const pawRewardText = document.getElementById('pawRewardText');

  let pawTaps = 0;
  const maxTapsForBonus = 10;
  let bonusUnlocked = false;

  const tapPhrases = [
    'Чпок! Привет! 🐾',
    'Жмяк! Ещё! 💖',
    'Тяни-толкай! 🎈',
    'Ого, пальчики разогрелись! 💥',
    'Слайм-энергия растёт! ⚡',
    'Супер-сквиш! 💫',
    'Почти открылся бонус! 🎁',
    'Ещё пару тапов! 🥳',
    'УРА! БОНУС ТВОЙ! 🏆'
  ];

  const emojis = ['🐾', '💖', '✨', '🎈', '⭐', '🦄', '🍓', '🎉', '🍬'];

  function handlePawTap(e) {
    pawTaps++;
    playSquish();
    playPop(480 + (pawTaps % 5) * 60);

    // Тактильный отклик (вибрация) на мобильных
    if (navigator.vibrate) {
      try { navigator.vibrate(24); } catch (err) {}
    }

    // Добавляем эффект сжатия лапки
    if (squishyPawEl) {
      squishyPawEl.classList.add('squished');
      setTimeout(() => {
        squishyPawEl.classList.remove('squished');
      }, 130);
    }

    // Обновляем прогресс-бар
    const percent = Math.min(100, Math.round((pawTaps / maxTapsForBonus) * 100));
    if (pawMeterBar) {
      pawMeterBar.style.width = percent + '%';
    }
    if (pawCountDisplay) {
      pawCountDisplay.textContent = pawTaps;
    }

    // Текстовая реакция
    const phraseIndex = Math.min(pawTaps - 1, tapPhrases.length - 1);
    if (pawHeadline) {
      pawHeadline.textContent = tapPhrases[phraseIndex];
    }

    // Вылет частицы
    createParticle(e);

    // Достижение цели: Секретный бонус
    if (pawTaps >= maxTapsForBonus && !bonusUnlocked) {
      bonusUnlocked = true;
      if (navigator.vibrate) {
        try { navigator.vibrate([40, 50, 40, 50, 80]); } catch (err) {}
      }
      playChime();
      triggerConfetti();

      if (pawRewardText) {
        pawRewardText.innerHTML = '🏆 <strong>Бонус открыт!</strong> Нажмите для просмотра';
      }

      openModal('promoModal');
    }
  }

  function createParticle(e) {
    if (!pawParticlesWrap) return;
    const particle = document.createElement('div');
    particle.className = 'particle-tap';

    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    particle.textContent = randomEmoji;

    // Расчет позиции
    const rect = pawParticlesWrap.getBoundingClientRect();
    let x = rect.width / 2;
    let y = rect.height / 2;

    if (e && typeof e.clientX === 'number') {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    particle.style.left = x + 'px';
    particle.style.top = y + 'px';

    const tx = (Math.random() - 0.5) * 140;
    const ty = -60 - Math.random() * 80;
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);

    pawParticlesWrap.appendChild(particle);
    setTimeout(() => {
      particle.remove();
    }, 850);
  }

  // Pointer events solve desktop and touch without double firing
  if (squishyPawWrap) {
    squishyPawWrap.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      handlePawTap(e);
    });
  }

  if (pawRewardTrigger) {
    pawRewardTrigger.addEventListener('click', () => {
      if (pawTaps >= maxTapsForBonus) {
        openModal('promoModal');
      } else {
        const left = maxTapsForBonus - pawTaps;
        playPop(440);
        showToast(`Жмякните лапку ещё ${left} раз(а), чтобы открыть секретный подарок! 🐾`);
      }
    });
  }

  window.copyPromoCode = function () {
    const codeEl = document.getElementById('promoCodeVal');
    const code = codeEl ? codeEl.textContent.trim() : 'СЛАЙМ19';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code);
    }
    playPop(650);
    showToast(`Промокод ${code} скопирован в буфер! Вставьте в чат VK 📋`);
  };

  // Helper: Reliable clipboard copy with fallback
  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
    } catch (err) {}
    document.body.removeChild(ta);
  }

  // ==========================================================================
  // 3. ИНТЕРАКТИВНЫЙ КАЛЬКУЛЯТОР ПРАЗДНИКА (ЧИПСЫ И КАРТОЧКИ БЕЗ ДУБЛИРОВАНИЯ)
  // ==========================================================================
  let currentAge = 8;
  let currentKids = 10;

  const calcAgeVal = document.getElementById('calcAgeVal');
  const calcAgePills = document.querySelectorAll('#calcAgePills .calc-chip-btn');

  const calcKidsVal = document.getElementById('calcKidsVal');
  const calcKidsPills = document.querySelectorAll('#calcKidsPills .calc-chip-btn');

  const calcTotalDisplay = document.getElementById('calcTotalDisplay');
  const calcSummaryProgName = document.getElementById('calcSummaryProgName');
  const calcSummaryGuestsRow = document.getElementById('calcSummaryGuestsRow');
  const calcSummaryGuestsVal = document.getElementById('calcSummaryGuestsVal');
  const calcSummaryAddonsRow = document.getElementById('calcSummaryAddonsRow');
  const calcSummaryAddonsVal = document.getElementById('calcSummaryAddonsVal');
  const calcProgramRadios = document.querySelectorAll('input[name="calcProgram"]');
  const calcAddonCheckboxes = document.querySelectorAll('.calc-addons-grid input[type="checkbox"]');
  const calcBookBtn = document.getElementById('calcBookBtn');

  // Базовые пакеты
  const packagePrices = {
    start: { name: 'Слайм-Старт', basePrice: 7500, baseKids: 6, extraKidPrice: 800 },
    hit: { name: 'Неон & Баббл Пати (ХИТ)', basePrice: 12900, baseKids: 10, extraKidPrice: 900 },
    vip: { name: 'VIP Мега-Вселенная', basePrice: 19500, baseKids: 15, extraKidPrice: 1000 }
  };

  function formatAge(n) {
    if (n % 10 === 1 && n % 100 !== 11) return `${n} год`;
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return `${n} года`;
    return `${n} лет`;
  }

  function formatKids(n) {
    if (n % 10 === 1 && n % 100 !== 11) return `${n} ребёнок`;
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return `${n} ребёнка`;
    return `${n} детей`;
  }

  function updateCalculator() {
    const age = currentAge;
    const kids = currentKids;

    // Синхронизация активных кнопок-чипсов возраста
    let activeAgeLabel = `${age} лет`;
    calcAgePills.forEach(pill => {
      const pillVal = parseInt(pill.dataset.val, 10);
      if (pillVal === age) {
        pill.classList.add('active');
        activeAgeLabel = pill.textContent.trim();
      } else {
        pill.classList.remove('active');
      }
    });

    // Синхронизация активных кнопок-чипсов детей
    let activeKidsLabel = `${kids} детей`;
    calcKidsPills.forEach(pill => {
      const pillVal = parseInt(pill.dataset.val, 10);
      if (pillVal === kids) {
        pill.classList.add('active');
        activeKidsLabel = pill.textContent.trim();
      } else {
        pill.classList.remove('active');
      }
    });

    if (calcAgeVal) calcAgeVal.textContent = activeAgeLabel;
    if (calcKidsVal) calcKidsVal.textContent = activeKidsLabel;

    // Выбранная программа и синхронизация визуального класса .checked
    let selectedProgKey = 'hit';
    calcProgramRadios.forEach(radio => {
      const parentCard = radio.closest('.calc-prog-card');
      if (radio.checked) {
        selectedProgKey = radio.value;
        if (parentCard) parentCard.classList.add('checked');
      } else {
        if (parentCard) parentCard.classList.remove('checked');
      }
    });

    const progInfo = packagePrices[selectedProgKey] || packagePrices.hit;
    let total = progInfo.basePrice;

    if (calcSummaryProgName) {
      calcSummaryProgName.textContent = progInfo.name;
    }

    const calcKidsHint = document.getElementById('calcKidsHint');
    if (calcKidsHint) {
      calcKidsHint.textContent = `(в тариф «${progInfo.name}» включено до ${progInfo.baseKids} детей)`;
    }

    // Доплата за детей сверх нормы пакета
    let extraKidsCount = 0;
    let extraCost = 0;
    if (kids > progInfo.baseKids) {
      extraKidsCount = kids - progInfo.baseKids;
      extraCost = extraKidsCount * progInfo.extraKidPrice;
      total += extraCost;
      if (calcSummaryGuestsRow && calcSummaryGuestsVal) {
        calcSummaryGuestsRow.style.display = 'flex';
        calcSummaryGuestsVal.textContent = `+${extraCost.toLocaleString('ru-RU')} ₽ (${extraKidsCount} доп.)`;
      }
    } else {
      if (calcSummaryGuestsRow) {
        calcSummaryGuestsRow.style.display = 'none';
      }
    }

    // Дополнительные шоу и эффекты
    const selectedAddons = [];
    let addonsTotal = 0;
    calcAddonCheckboxes.forEach(cb => {
      const parentLabel = cb.closest('.calc-addon-card');
      if (cb.checked) {
        const addonVal = parseInt(cb.value, 10);
        const addonName = parentLabel ? (parentLabel.querySelector('.calc-addon-name')?.textContent || 'Доп. опция') : 'Доп. опция';
        addonsTotal += addonVal;
        total += addonVal;
        selectedAddons.push(`${addonName} (+${addonVal.toLocaleString('ru-RU')} ₽)`);
        if (parentLabel) parentLabel.classList.add('checked');
      } else {
        if (parentLabel) parentLabel.classList.remove('checked');
      }
    });

    if (calcSummaryAddonsRow && calcSummaryAddonsVal) {
      if (selectedAddons.length > 0) {
        calcSummaryAddonsRow.style.display = 'flex';
        calcSummaryAddonsVal.textContent = `+${addonsTotal.toLocaleString('ru-RU')} ₽ (${selectedAddons.length})`;
      } else {
        calcSummaryAddonsRow.style.display = 'none';
      }
    }

    if (calcTotalDisplay) {
      calcTotalDisplay.textContent = total.toLocaleString('ru-RU') + ' ₽';
    }

    return {
      age,
      kids,
      ageLabel: activeAgeLabel,
      kidsLabel: activeKidsLabel,
      program: progInfo.name,
      selectedProgKey,
      addons: selectedAddons,
      total
    };
  }

  // Управление возрастом через чипсы
  calcAgePills.forEach(pill => {
    pill.addEventListener('click', () => {
      currentAge = parseInt(pill.dataset.val, 10);
      playPop(520);
      updateCalculator();
    });
  });

  // Управление гостями через чипсы
  calcKidsPills.forEach(pill => {
    pill.addEventListener('click', () => {
      currentKids = parseInt(pill.dataset.val, 10);
      playPop(520);
      updateCalculator();
    });
  });

  calcProgramRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      playSquish();
      updateCalculator();
    });
  });

  calcAddonCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      playPop(620);
      updateCalculator();
    });
  });

  // Связка кнопок карточек программ с калькулятором
  document.querySelectorAll('[data-calc-select]').forEach(btn => {
    btn.addEventListener('click', () => {
      const progKey = btn.dataset.calcSelect;
      const targetRadio = document.querySelector(`input[name="calcProgram"][value="${progKey}"]`);
      if (targetRadio) {
        targetRadio.checked = true;
        playSquish();
        updateCalculator();
      }
    });
  });

  // Кнопка забронировать с параметрами калькулятора
  if (calcBookBtn) {
    calcBookBtn.addEventListener('click', () => {
      const calcData = updateCalculator();
      playChime();

      // Заполняем поля формы в модалке
      const bookProgSelect = document.getElementById('bookProgramSelect');
      const bookKidsInput = document.getElementById('bookKidsInput');
      const bookCommentInput = document.getElementById('bookComment');

      if (bookProgSelect) {
        for (let opt of bookProgSelect.options) {
          if (opt.value === calcData.program || opt.text.includes(calcData.program) || calcData.program.includes(opt.value)) {
            bookProgSelect.value = opt.value;
            break;
          }
        }
      }
      if (bookKidsInput) {
        bookKidsInput.value = calcData.kids;
      }
      if (bookCommentInput) {
        const addonsText = calcData.addons.length > 0 ? `\nДоп. опции: ${calcData.addons.join(', ')}.` : '';
        bookCommentInput.value = `Расчёт из калькулятора: ${calcData.program}, ${calcData.kidsLabel}, возраст ${calcData.ageLabel}.${addonsText} Итоговая сумма: ${calcData.total.toLocaleString('ru-RU')} ₽.`;
      }

      openModal('bookingModal');
    });
  }

  // ==========================================================================
  // 4. БЕСПЛАТНЫЙ УГОЛОК ДОБРА И ДОНАТЫ (3 КАРТОЧКИ + СБП)
  // ==========================================================================
  let currentDonationAmount = 250;

  function updateDonationModalAmount(amount) {
    currentDonationAmount = amount;
    const modalAmountSpan = document.getElementById('modalDonationAmount');
    if (modalAmountSpan) {
      modalAmountSpan.textContent = amount.toLocaleString('ru-RU') + ' ₽';
    }
    const modalPills = document.querySelectorAll('#modalDonationPills .calc-chip-btn');
    modalPills.forEach(pill => {
      const pAmt = parseInt(pill.dataset.donation, 10);
      if (pAmt === amount) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  // Клик по чипсам сумм внутри модалки
  const modalDonationPills = document.querySelectorAll('#modalDonationPills .calc-chip-btn');
  modalDonationPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const amt = parseInt(pill.dataset.donation, 10) || 250;
      updateDonationModalAmount(amt);
      playPop(520);
    });
  });

  // Клик по 3 аккуратным карточкам подарков (100 ₽, 250 ₽, 500 ₽)
  const charityActionBtns = document.querySelectorAll('.charity-btn');
  charityActionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const amount = parseInt(btn.dataset.amount, 10) || 250;
      updateDonationModalAmount(amount);
      playChime();
      openModal('donationModal');
    });
  });

  // Кнопка "Другая сумма"
  const customDonationTriggerBtn = document.getElementById('customDonationTriggerBtn');
  if (customDonationTriggerBtn) {
    customDonationTriggerBtn.addEventListener('click', () => {
      playPop(520);
      updateDonationModalAmount(500);
      openModal('donationModal');
    });
  }

  // Копирование телефона СБП в баннере
  const copySbpPhoneBtn = document.getElementById('copySbpPhoneBtn');
  if (copySbpPhoneBtn) {
    copySbpPhoneBtn.addEventListener('click', () => {
      const phoneText = copySbpPhoneBtn.dataset.copy || '+79585080632';
      copyToClipboard(phoneText);
      playPop(650);
      showToast('Номер телефона для перевода по СБП скопирован! 📋');
    });
  }

  // Копирование телефона / реквизитов СБП внутри модалки
  const copyPhoneBtn = document.getElementById('copyPhoneBtn');
  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', () => {
      const phoneText = copyPhoneBtn.dataset.copy || '+79585080632';
      copyToClipboard(phoneText);
      playPop(650);
      showToast('Номер телефона для СБП скопирован! 📋');
    });
  }

  // Подтверждение перевода в модалке
  const confirmDonationBtn = document.getElementById('confirmDonationBtn');
  const donorWishInput = document.getElementById('donorWishInput');
  if (confirmDonationBtn) {
    confirmDonationBtn.addEventListener('click', () => {
      playChime();
      triggerConfetti();
      closeModal('donationModal');
      showToast('Спасибо за ваше доброе сердце! Улыбки детей станут ярче ❤️');
    });
  }

  // ==========================================================================
  // 6. АККОРДЕОН FAQ
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
          playPop(540);
        } else {
          playPop(420);
        }
      });
    }
  });

  // ==========================================================================
  // 7. МОДАЛЬНЫЕ ОКНА
  // ==========================================================================
  window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (modalId === 'videoModal') {
        const video = document.getElementById('studioPartyVideo');
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => {});
        }
      }
    }
  };

  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (modalId === 'videoModal') {
        const video = document.getElementById('studioPartyVideo');
        if (video) video.pause();
      }
    }
  };

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        const video = overlay.querySelector('video');
        if (video) video.pause();
      }
    });
  });

  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        const video = modal.querySelector('video');
        if (video) video.pause();
      }
    });
  });

  // Закрытие по клавише Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(modal => {
        modal.classList.remove('open');
        const video = modal.querySelector('video');
        if (video) video.pause();
      });
      document.body.style.overflow = '';
    }
  });

  // Универсальные кнопки открытия модальных окон
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.dataset.openModal;
      if (targetId) {
        playPop(580);
        openModal(targetId);
      }
    });
  });

  const copyPromoBtn = document.getElementById('copyPromoBtn');
  if (copyPromoBtn) {
    copyPromoBtn.addEventListener('click', () => {
      window.copyPromoCode();
    });
  }

  const heroVideoSoundBtn = document.getElementById('heroVideoSoundBtn');
  if (heroVideoSoundBtn) {
    heroVideoSoundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      playPop(580);
      openModal('videoModal');
    });
  }

  // ==========================================================================
  // 8. ОТПРАВКА ФОРМЫ БРОНИРОВАНИЯ
  // ==========================================================================
  const fastBookingForm = document.getElementById('fastBookingForm');
  const modalBookingForm = document.getElementById('modalBookingForm');

  function handleBookingSubmit(e, form) {
    e.preventDefault();
    playChime();
    triggerConfetti();

    const name = form.querySelector('[name="name"]')?.value || 'Гость';
    const phone = form.querySelector('[name="phone"]')?.value || '';
    const date = form.querySelector('[name="date"]')?.value || '';
    const program = form.querySelector('[name="program"]')?.value || 'Праздник';

    // Закрываем модалку если открыта
    closeModal('bookingModal');

    // Показываем подтверждение
    showToast(`Спасибо, ${name}! Заявка принята. Мы перезвоним вам в течение 15 минут! 🎉`);

    // Открываем диалог в VK мессенджере с группой
    setTimeout(() => {
      const vkUrl = 'https://vk.me/slimeroom';
      window.open(vkUrl, '_blank');
    }, 1400);

    form.reset();
  }

  if (fastBookingForm) {
    fastBookingForm.addEventListener('submit', (e) => handleBookingSubmit(e, fastBookingForm));
  }
  if (modalBookingForm) {
    modalBookingForm.addEventListener('submit', (e) => handleBookingSubmit(e, modalBookingForm));
  }

  // ==========================================================================
  // 9. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ: TOAST И КОНФЕТТИ
  // ==========================================================================
  const toastNotification = document.getElementById('toastNotification');
  const toastText = document.getElementById('toastText');
  let toastTimer = null;

  function showToast(msg) {
    if (!toastNotification || !toastText) return;
    toastText.textContent = msg;
    toastNotification.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3800);
  }

  function triggerConfetti() {
    const confettiColors = ['#ff2a85', '#10b981', '#8b5cf6', '#ffd12f', '#06b6d4', '#f43f5e'];
    const count = 35;
    const maxW = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) - 20;

    for (let i = 0; i < count; i++) {
      const conf = document.createElement('div');
      conf.style.position = 'fixed';
      conf.style.zIndex = '99999';
      conf.style.width = (Math.random() * 10 + 6) + 'px';
      conf.style.height = (Math.random() * 8 + 4) + 'px';
      conf.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      conf.style.left = (Math.random() * maxW) + 'px';
      conf.style.top = '-20px';
      conf.style.borderRadius = '3px';
      conf.style.opacity = '1';
      conf.style.pointerEvents = 'none';
      conf.style.transform = `rotate(${Math.random() * 360}deg)`;
      conf.style.transition = `transform ${1.5 + Math.random() * 1.5}s ease-out, top ${1.5 + Math.random() * 1.5}s ease-in, opacity 2s ease-out`;

      document.body.appendChild(conf);

      setTimeout(() => {
        conf.style.top = '105vh';
        conf.style.transform = `rotate(${Math.random() * 720}deg) scale(0.6)`;
        conf.style.opacity = '0';
      }, 20);

      setTimeout(() => {
        conf.remove();
      }, 3200);
    }
  }

  // ==========================================================================
  // 10. МОБИЛЬНОЕ МЕНЮ
  // ==========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNavDrawer.classList.toggle('open');
      playPop(480);
    });

    mobileNavDrawer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('open');
      });
    });
  }

  // Первичная инициализация калькулятора
  updateCalculator();

  console.log('Комната Слаймов | Калуга — скрипт успешно загружен! ✨');
})();
