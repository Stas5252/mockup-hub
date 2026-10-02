(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) document.documentElement.classList.add('motion-ready');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });
    $$('.reveal').forEach(el => observer.observe(el));
  } else $$('.reveal').forEach(el => el.classList.add('visible'));

  let scrollPending = false;
  function onScroll() {
    if (scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(() => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      $('.scroll-progress').style.transform = `scaleX(${height > 0 ? window.scrollY / height : 0})`;
      if (!reduced && window.innerWidth > 650 && window.scrollY < 900) $('.hero-portrait img').style.transform = `scale(1.025) translateY(${Math.min(window.scrollY * .025, 14)}px)`;
      scrollPending = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const menuToggle = $('.menu-toggle');
  const mobileMenu = $('#mobile-menu');
  function closeMenu() { mobileMenu.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Открыть меню'); }
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenu.hidden = expanded;
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menuToggle.setAttribute('aria-label', expanded ? 'Открыть меню' : 'Закрыть меню');
  });
  $$('a', mobileMenu).forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 950) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  function filterButtons(selector, rows, attr) {
    $$(selector).forEach(button => button.addEventListener('click', () => {
      const selected = button.getAttribute(attr);
      $$(selector).forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
      $$(rows).forEach(row => {
        const category = row.dataset.category || row.dataset.priceCategory;
        row.hidden = selected !== 'all' && category !== selected;
        if (!row.hidden) row.classList.add('visible');
      });
      onScroll();
    }));
  }
  filterButtons('[data-service-filter]', '.service-item', 'data-service-filter');
  filterButtons('[data-price-filter]', '.price-row', 'data-price-filter');

  function animatePanel(panel) {
    panel.classList.remove('panel-changing');
    void panel.offsetWidth;
    panel.classList.add('panel-changing');
  }
  function tabs(selector, update) {
    const buttons = $$(selector);
    function activate(button, focus = false) {
      buttons.forEach(b => { const active = b === button; b.setAttribute('aria-selected', String(active)); b.tabIndex = active ? 0 : -1; });
      update(button);
      if (focus) button.focus();
    }
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => activate(button));
      button.addEventListener('keydown', e => {
        if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) {
          e.preventDefault();
          const n = e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length - 1 : (index + (e.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
          activate(buttons[n], true);
        }
      });
    });
  }
  const visitCopy = [
    ['Расскажите, что важно для вас.', 'Врач выслушает ваши пожелания, уточнит историю лечения и ответит на вопросы. Если вы тревожитесь, скажите об этом — вместе найдём комфортный темп.'],
    ['Разберёмся в ситуации целиком.', 'Осмотр и необходимые снимки помогают увидеть причину проблемы. Врач покажет, что обнаружено, объяснит показания к обследованиям и расскажет, какие задачи стоит решить в первую очередь.'],
    ['Согласуем каждый следующий шаг.', 'Вы получите варианты лечения, последовательность этапов и стоимость. Можно задать вопросы и взять время на решение. Лечение начинается, когда план понятен и согласован.']
  ];
  tabs('[data-visit]', button => {
    const panel = $('#visit-panel'); const copy = visitCopy[Number(button.dataset.visit)];
    panel.innerHTML = `<h3>${copy[0]}</h3><p>${copy[1]}</p>`;
    panel.setAttribute('aria-labelledby', button.id); animatePanel(panel);
  });
  const storyCopy = [
    { title: 'Хочу улыбаться<br>естественно и свободно.', discuss: 'Форму, оттенок зубов и ваши ожидания.', options: 'От профессиональной гигиены до реставраций и виниров — по показаниям.' },
    { title: 'Хочу ровные зубы<br>и комфортный прикус.', discuss: 'Положение зубов, функцию прикуса и привычки.', options: 'Брекеты или элайнеры. Способ и длительность определяет ортодонт после диагностики.' },
    { title: 'Хочу снова жевать<br>и улыбаться уверенно.', discuss: 'Состояние зубов, костной ткани и возможные альтернативы.', options: 'Коронки, протезы или имплантация. План учитывает и функцию, и эстетику.' }
  ];
  tabs('[data-story]', button => {
    const panel = $('#story-panel'); const item = storyCopy[Number(button.dataset.story)];
    panel.innerHTML = `<span class="eyebrow">ПРИМЕР ЗАДАЧИ</span><h3>${item.title}</h3><dl><div><dt>Что обсуждаем</dt><dd>${item.discuss}</dd></div><div><dt>Какие есть решения</dt><dd>${item.options}</dd></div></dl>`;
    panel.setAttribute('aria-labelledby', button.id); animatePanel(panel);
  });
  const reviews = [
    ['Впервые ушла с консультации без ощущения, что нужно срочно принимать решение. Мне объяснили варианты и дали время подумать.', 'Анна', 'Первичная консультация'],
    ['Для меня было важно понимать, что происходит. Врач показывал снимки, объяснял каждый шаг и делал паузы, когда я просила.', 'Елена', 'Лечение зубов'],
    ['Понравилось, что сначала обсудили здоровье зубов, а потом эстетику. У меня появился понятный план, а не просто список процедур.', 'Михаил', 'Планирование лечения']
  ];
  let reviewIndex = 0;
  $$('[data-review-step]').forEach(button => button.addEventListener('click', () => {
    reviewIndex = (reviewIndex + Number(button.dataset.reviewStep) + reviews.length) % reviews.length;
    const r = reviews[reviewIndex];
    $('#review-quote').textContent = r[0]; $('#review-author').textContent = r[1];
    $('#review-context').textContent = `Пример отзыва · ${r[2]}`;
    $('#review-count').textContent = `0${reviewIndex + 1} / 03`;
    animatePanel($('#review-quote'));
  }));

  const booking = $('#booking-dialog'); const info = $('#info-dialog');
  function syncDialogBody() { document.body.classList.toggle('modal-open', $$('dialog[open]').length > 0); }
  function showDialog(dialog) { if (!dialog.open) dialog.showModal(); syncDialogBody(); }
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('close', syncDialogBody);
    dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
  });
  $$('[data-close-dialog]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));
  function openBooking(service = '') {
    closeMenu();
    const select = $('#modal-service');
    const valid = [...select.options].find(option => option.value === service);
    $$('.temporary-option', select).forEach(el => el.remove());
    if (service && !valid) { const option = new Option(service, service); option.className = 'temporary-option'; select.add(option); }
    select.value = service || 'Первичная консультация';
    $('.form-feedback', booking).textContent = '';
    $('.form-feedback', booking).className = 'form-feedback';
    if (info.open) info.close();
    showDialog(booking);
  }
  $$('[data-book]').forEach(button => button.addEventListener('click', () => openBooking(button.dataset.book)));

  const doctors = [
    { name: 'Мария Волкова', role: 'Стоматолог-терапевт', image: 'dentist-woman.jpg', text: 'Помогает сохранить здоровье зубов и восстановить их естественную форму. На консультации объясняет варианты лечения, отвечает на вопросы и обсуждает домашний уход.', services: ['Лечение кариеса', 'Эстетические реставрации', 'Профилактика и уход'] },
    { name: 'Александр Белов', role: 'Хирург-имплантолог', image: 'dentist-man.jpg', text: 'Занимается планированием хирургического лечения и восстановлением отсутствующих зубов. Обсуждает показания, альтернативы и последовательность этапов.', services: ['Консультация по имплантации', 'Хирургическое лечение', 'Комплексный план восстановления'] }
  ];
  $$('[data-doctor]').forEach(button => button.addEventListener('click', () => {
    const d = doctors[Number(button.dataset.doctor)];
    $('#info-content').innerHTML = `<p class="eyebrow">ПОЗНАКОМИТЬСЯ С ВРАЧОМ</p><div class="doctor-dialog-layout"><img src="assets/${d.image}" alt="Демонстрационный портрет врача"><div><span class="eyebrow">${d.role}</span><h2 id="info-title">${d.name}</h2><p>${d.text}</p></div></div><h3>Направления работы</h3><ul>${d.services.map(s => `<li>${s}</li>`).join('')}</ul><p class="prototype-note">Карточка-пример. Имя, описание и фотография демонстрационные.</p><button class="button" id="doctor-book">Записаться к специалисту</button>`;
    $('#doctor-book').addEventListener('click', () => openBooking(`Консультация: ${d.name}`));
    showDialog(info);
  }));
  const infoCopy = {
    privacy: ['Обработка данных', 'Это демонстрационный макет «Армадент». Введённые данные проверяются только в вашем браузере, не отправляются на сервер и не сохраняются. После закрытия или обновления страницы они не используются.', 'Перед запуском настоящего сайта здесь будет размещена политика оператора персональных данных, сведения о согласии и способах отзыва.'],
    legal: ['Информация о клинике', 'Сайт представлен как дизайн-концепция. Фотографии, имена специалистов, цены и отзывы служат примерами оформления и не являются сведениями о действующей клинике.', 'Перед публикацией рабочего сайта сюда будут добавлены юридическое наименование, реквизиты, лицензия на медицинскую деятельность и подтверждённая информация о специалистах.'],
    contacts: ['Контакты «Армадент»', 'Город, адрес, телефон и расписание клиники пока не предоставлены. В этом разделе предусмотрено место для контактов, маршрута, информации о парковке и доступности входа.', 'Кнопки записи открывают демонстрационную форму. Реального звонка или записи в макете не происходит.']
  };
  document.addEventListener('click', e => {
    const button = e.target.closest('[data-info]');
    if (!button) return;
    const copy = infoCopy[button.dataset.info];
    $('#info-content').innerHTML = `<p class="eyebrow">АРМАДЕНТ · ИНФОРМАЦИЯ</p><h2 id="info-title">${copy[0]}</h2><p>${copy[1]}</p><p>${copy[2]}</p>`;
    showDialog(info);
  });

  $$('[data-booking-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = $('[name=name]', form), phone = $('[name=phone]', form), consent = $('[name=consent]', form), feedback = $('.form-feedback', form);
      const digits = phone.value.replace(/\D/g, '');
      const nameValid = name.value.trim().length >= 2;
      const phoneValid = digits.length >= 10 && digits.length <= 15;
      name.setAttribute('aria-invalid', String(!nameValid)); phone.setAttribute('aria-invalid', String(!phoneValid));
      if (!nameValid || !phoneValid || !consent.checked) {
        feedback.className = 'form-feedback error';
        feedback.textContent = !nameValid ? 'Укажите имя — не менее двух символов.' : !phoneValid ? 'Проверьте номер телефона: нужно от 10 до 15 цифр.' : 'Подтвердите согласие с условиями обработки данных.';
        (!nameValid ? name : !phoneValid ? phone : consent).focus();
        return;
      }
      feedback.className = 'form-feedback success';
      feedback.textContent = 'Сценарий записи показан. Это макет: заявка не отправлена, звонка не будет. В рабочей версии здесь появится подтверждение записи.';
      name.value = ''; phone.value = ''; consent.checked = false;
    });
    $$('input', form).forEach(input => input.addEventListener('input', () => input.removeAttribute('aria-invalid')));
  });

})();
