/**
 * LeMARI Вологда — Интерактивный конфигуратор кухни
 * Скандинавская эстетика Nordic Kitchens, живой масштаб человека (170 см), расчет сметы
 */

const state = {
  collection: 'simple',
  line: 'ceiling',
  length: 3.2,
  countertop: 'compact',
  showScaleChar: true
};

const collections = {
  simple: {
    name: 'S I M P L E',
    sub: 'Гладкий минимализм',
    photo: 'assets/col_simple.png',
    baseMeterPrice: 42000
  },
  frame: {
    name: 'F R A M E',
    sub: 'Скандинавская рамка',
    photo: 'assets/col_frame.png',
    baseMeterPrice: 48000
  },
  wood: {
    name: 'W O O D & J A P A N D I',
    sub: 'Шпон европейского дуба',
    photo: 'assets/col_wood.png',
    baseMeterPrice: 56000
  },
  modular: {
    name: 'M O D U L A R',
    sub: 'Готовые серии от 14 дней',
    photo: 'assets/col_modular.jpg',
    baseMeterPrice: 32000
  }
};

const lines = {
  base: {
    name: 'Базовая линия (720 мм)',
    mult: 1.0,
    photo: 'assets/arch_base.webp'
  },
  ceiling: {
    name: 'В потолок (с антресолями)',
    mult: 1.25,
    photo: null // fallback to collection photo
  },
  island: {
    name: 'С кухонным островом',
    mult: 1.6,
    photo: 'assets/arch_island.webp'
  }
};

const countertops = {
  postforming: { name: 'Постформинг Egger 38 мм', price: 0 },
  compact: { name: 'Компакт-плита 12 мм (Монолит)', price: 28000 },
  stone: { name: 'Искусственный камень 24 мм', price: 65000 }
};

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initModals();
  updateConfigurator();
});

// Переключение коллекции в конфигураторе
function setCol(colKey) {
  state.collection = colKey;
  document.querySelectorAll('[data-col]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.col === colKey);
  });
  updateConfigurator();
}

// Переключение линии архитектуры
function setLine(lineKey) {
  state.line = lineKey;
  document.querySelectorAll('[data-line]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.line === lineKey);
  });
  updateConfigurator();
}

// Переключение столешницы
function setTop(topKey) {
  state.countertop = topKey;
  document.querySelectorAll('[data-top]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.top === topKey);
  });
  updateConfigurator();
}

// Обновление слайдера длины
function updateSlider(val) {
  state.length = parseFloat(val);
  const sliderValue = document.getElementById('sliderValue');
  if (sliderValue) sliderValue.textContent = `${state.length.toFixed(1)} м`;
  updateConfigurator();
}

// Переключение фигуры человека для масштаба
function toggleScaleFigure() {
  state.showScaleChar = !state.showScaleChar;
  const charEl = document.getElementById('scaleChar');
  const badgeEl = document.getElementById('scaleBadge');
  const switchEl = document.getElementById('toggleSwitch');

  if (charEl) charEl.classList.toggle('hidden', !state.showScaleChar);
  if (badgeEl) badgeEl.classList.toggle('hidden', !state.showScaleChar);
  if (switchEl) switchEl.classList.toggle('off', !state.showScaleChar);
}

// Выбор из карточек каталога сверху
function selectCollectionInConfig(colKey) {
  setCol(colKey);
  const target = document.getElementById('constructor');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

function selectLineInConfig(lineKey) {
  setLine(lineKey);
  const target = document.getElementById('constructor');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

// Главная функция обновления конфигуратора
function updateConfigurator() {
  const col = collections[state.collection];
  const ln = lines[state.line];
  const top = countertops[state.countertop];

  // Фото превью
  const stageImg = document.getElementById('stageImg');
  if (stageImg) {
    let desiredPhoto = col.photo;
    // Если выбран остров и мы не в модульной серии, показываем фото острова
    if (state.line === 'island' && state.collection !== 'modular') {
      desiredPhoto = 'assets/arch_island.webp';
    } else if (state.line === 'base' && state.collection === 'simple') {
      desiredPhoto = 'assets/arch_base.webp';
    }

    if (stageImg.getAttribute('src') !== desiredPhoto) {
      stageImg.style.opacity = '0.3';
      setTimeout(() => {
        stageImg.src = desiredPhoto;
        stageImg.style.opacity = '1';
      }, 150);
    }
  }

  // Расчет стоимости
  const baseCost = state.length * col.baseMeterPrice * ln.mult;
  const total = Math.round((baseCost + top.price) / 100) * 100;
  const installment = Math.round(total / 12);

  // Обновление строк сметы
  const invCol = document.getElementById('invCol');
  const invLine = document.getElementById('invLine');
  const invLen = document.getElementById('invLen');
  const invTop = document.getElementById('invTop');
  const invTotal = document.getElementById('invTotal');
  const invCredit = document.getElementById('invCredit');

  if (invCol) invCol.textContent = col.name;
  if (invLine) invLine.textContent = ln.name;
  if (invLen) invLen.textContent = `${state.length.toFixed(1)} метра`;
  if (invTop) invTop.textContent = top.name;
  if (invTotal) invTotal.textContent = `${total.toLocaleString('ru-RU')} ₽`;
  if (invCredit) invCredit.textContent = `или от ${installment.toLocaleString('ru-RU')} ₽ / месяц в рассрочку 0% без переплат`;
}

// Инициализация модалок
function initModals() {
  const modal = document.getElementById('leadModal');
  const openBtns = document.querySelectorAll('[data-open-modal]');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('active');
    });
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function closeModal() {
  const modal = document.getElementById('leadModal');
  if (modal) modal.classList.remove('active');
}

function handleFormSubmit(e) {
  e.preventDefault();
  alert('Благодарим за заявку! Инженер-дизайнер LeMARI свяжется с вами в течение 15 минут для согласования 3D-замера.');
  e.target.reset();
}

function handleModalSubmit(e) {
  e.preventDefault();
  alert('Спасибо! Ваша спецификация и скидка 20% успешно зафиксированы. Наш специалист свяжется с вами.');
  closeModal();
  e.target.reset();
}

// Навигация и подсветка
function initNavigation() {
  const navLinks = document.querySelectorAll('.nk-nav__link');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    document.querySelectorAll('section[id]').forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sec.id}`);
        });
      }
    });
  });
}
