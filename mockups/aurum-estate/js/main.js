/* AURUM ESTATE — interactions */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- header on scroll ---------- */
  var header = $('#header');
  function onScroll() {
    header.classList.toggle('fixed', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- burger / mobile menu ---------- */
  var burger = $('#burger');
  burger.addEventListener('click', function () {
    document.body.classList.toggle('menu-open');
  });
  $$('#mmenu a').forEach(function (a) {
    a.addEventListener('click', function () { document.body.classList.remove('menu-open'); });
  });

  /* ---------- hero slider ---------- */
  var slides = $$('#heroBg .slide');
  var countBox = $('#heroCount');
  var current = 0;
  var timer = null;
  var DUR = 7000;

  function pad(n) { return (n < 9 ? '0' : '') + (n + 1); }

  function renderCount() {
    var html = '<button class="on" data-i="' + current + '">' + pad(current) + '</button>' +
      '<span class="hc-line"><i class="run"></i></span>';
    slides.forEach(function (_, i) {
      if (i !== current) html += '<button data-i="' + i + '">' + pad(i) + '</button>';
    });
    countBox.innerHTML = html;
    $$('#heroCount button').forEach(function (b) {
      b.addEventListener('click', function () { go(+b.dataset.i, true); });
    });
  }

  function go(i, manual) {
    current = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle('on', k === current); });
    renderCount();
    if (manual) restart();
  }
  function restart() {
    clearInterval(timer);
    timer = setInterval(function () { go(current + 1); }, DUR);
  }
  renderCount();
  restart();

  /* ---------- gallery scroller ---------- */
  var track = $('#gTrack');
  function gStep() {
    var item = $('.g-item', track);
    return item ? item.getBoundingClientRect().width + 16 : 300;
  }
  $('#gPrev').addEventListener('click', function () { track.scrollBy({ left: -gStep(), behavior: 'smooth' }); });
  $('#gNext').addEventListener('click', function () { track.scrollBy({ left: gStep(), behavior: 'smooth' }); });

  /* ---------- testimonials ---------- */
  var reviews = [
    {
      text: 'МАСШТАБ сделали ремонт точно в срок и точно в смету. Ни одного сюрприза — всё как зафиксировано в договоре.',
      name: 'Елена и Сергей П.',
      role: 'Ремонт квартиры, Архангельск',
      img: 'img/avatar.jpg'
    },
    {
      text: 'Замерщик приехал на следующий день, смету составили бесплатно. Цена за время ремонта не изменилась ни на рубль.',
      name: 'Дмитрий К.',
      role: 'Отделка офиса, Северодвинск',
      img: ''
    },
    {
      text: 'Сделали дизайн-проект и ремонт под ключ в новостройке. Приняли работу без единой переделки.',
      name: 'Анна и Павел С.',
      role: 'Дизайн-проект и ремонт, Архангельск',
      img: ''
    }
  ];
  var tI = 0;
  var tPerson = $('.t-person');
  var tQuote = $('#tQuote');
  var tText = $('#tText');
  var tName = $('#tName');
  var tRole = $('#tRole');
  var tCount = $('#tCount');
  var tAvatarWrap = $('.t-person', tQuote);

  function initials(name) {
    return name.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase();
  }

  function renderT() {
    var r = reviews[tI];
    tQuote.classList.add('fade');
    setTimeout(function () {
      tText.textContent = r.text;
      tName.textContent = r.name;
      tRole.textContent = r.role;
      var old = $('#tAvatar');
      var init = $('.t-ava', tQuote);
      if (r.img) {
        if (init) init.remove();
        if (!old) {
          var im = document.createElement('img');
          im.id = 'tAvatar';
          tPerson.insertBefore(im, tPerson.firstChild);
        }
        var el = document.getElementById('tAvatar');
        if (el) { el.src = r.img; el.alt = r.name; }
      } else {
        if (old) old.remove();
        if (!init) {
          var d = document.createElement('div');
          d.className = 't-ava';
          tPerson.insertBefore(d, tPerson.firstChild);
        }
        var el2 = $('.t-ava', tQuote);
        if (el2) el2.textContent = initials(r.name);
      }
      tCount.textContent = (tI + 1) + '/' + reviews.length;
      tQuote.classList.remove('fade');
    }, 380);
  }
  $('#tPrev').addEventListener('click', function () { tI = (tI - 1 + reviews.length) % reviews.length; renderT(); });
  $('#tNext').addEventListener('click', function () { tI = (tI + 1) % reviews.length; renderT(); });

  /* ---------- reveal on scroll ---------- */
  function revealElement(el) {
    el.classList.add('on');
    if (io) io.unobserve(el);
  }

  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          revealElement(e.target);
        }
      });
    }, { threshold: 0.02, rootMargin: '0px 0px 120px 0px' });
  }

  function checkInitial() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    $$('.rv').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top <= vh * 1.15) {
        el.classList.add('on');
      } else if (io) {
        io.observe(el);
      } else {
        el.classList.add('on');
      }
    });
  }

  checkInitial();
  window.addEventListener('load', checkInitial);
  window.addEventListener('resize', checkInitial);

  /* ---------- form ---------- */
  var form = $('#leadForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.elements.name.value.trim();
    var phone = form.elements.phone.value.trim();
    var consent = form.querySelector('input[type="checkbox"]').checked;
    var ok = $('#formOk');
    if (!name || !phone) {
      ok.textContent = 'Пожалуйста, укажите имя и телефон.';
      ok.classList.add('show');
      return;
    }
    if (!consent) {
      ok.textContent = 'Необходимо согласие с политикой конфиденциальности.';
      ok.classList.add('show');
      return;
    }
    ok.textContent = 'Спасибо, ' + name + '! Мы свяжемся с вами в ближайшее время.';
    ok.classList.add('show');
    form.reset();
    form.querySelector('input[type="checkbox"]').checked = true;
  });
})();
