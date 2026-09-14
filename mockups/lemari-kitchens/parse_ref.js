const fs = require('fs');

const jsContent = `/**
 * LeMARI Вологда — Интерактивный конфигуратор и калькулятор кухонь
 * Скандинавская эстетика, масштабирование фигурками Lego (по мотивам Nordic Kitchens)
 */

document.addEventListener('DOMContentLoaded', () => {
  initConfigurator();
  initLegoStories();
  initFAQ();
  initModals();
  initSmoothScroll();
});

function initConfigurator() {
  const state = {
    collection: 'simple',
    layout: 'straight',
    line: 'ceiling',
    facade: 'white',
    countertop: 'compact',
    length: 3.2,
    legoFigure: 'chef'
  };

  const collectionsData = {
    simple: {
      name: 'S I M P L E',
      sub: 'Гладкий минимализм Soft-Touch',
      photo: 'assets/kitchen_simple_lego.jpg',
      basePerMeter: 38000
    },
    frame: {
      name: 'F R A M E',
      sub: 'Тонкая рамка 12 мм',
      photo: 'assets/kitchen_frame_lego.jpg',
      basePerMeter: 44000
    },
    farm: {
      name: 'F A R M',
      sub: 'Брутальные боковины и дуб',
      photo: 'assets/kitchen_farm_lego.jpg',
      basePerMeter: 50000
    },
    wood: {
      name: 'W O O D & J A P A N D I',
      sub: 'Шпон дуба & рейки',
      photo: 'assets/kitchen_wood_lego.jpg',
      basePerMeter: 54000
    },
    modular: {
      name: 'M O D U L A R',
      sub: 'Готовые модули 14–21 день',
      photo: 'assets/kitchen_island.jpg',
      basePerMeter: 29000
    }
  };

  const layoutData = {
    straight: { name: 'Прямая', mult: 1.0, icon: '━' },
    corner: { name: 'Угловая L-образная', mult: 1.35, icon: '┗' },
    island: { name: 'С кухонным островом', mult: 1.55, icon: '☷' }
  };

  const linesData = {
    base: { name: 'Базовая (720 мм)', mult: 1.0 },
    ceiling: { name: 'В потолок (с антресолями)', mult: 1.25 },
    shelves: { name: 'Сканди-полки (без верхних шкафов)', mult: 0.85 }
  };

  const facadesData = {
    white: 'Белый Soft-Touch',
    sage: 'Дымчатый шалфей Sage',
    cashmere: 'Теплый кашемир',
    graphite: 'Глубокий графит Fenix',
    oak: 'Натуральный шпон дуба'
  };

  const countertopsData = {
    postforming: { name: 'Постформинг 38 мм (влагостойкий)', extra: 0 },
    compact: { name: 'Компакт-плита 12 мм (монолит)', extra: 28000 },
    stone: { name: 'Искусственный камень 24 мм', extra: 64000 }
  };

  const legoFiguresData = {
    chef: {
      img: 'assets/lego_scale_chef.jpg',
      label: 'Lego-шеф • Масштаб 1:20 (рост 4 см)',
      visible: true
    },
    installer: {
      img: 'assets/lego_scale_installer.jpg',
      label: 'Lego-мастер • Масштаб 1:20 (рост 4 см)',
      visible: true
    },
    coffee: {
      img: 'assets/nordic_lego_coffee.jpg',
      label: 'Lego-житель • Масштаб 1:20 (хюгге)',
      visible: true
    },
    none: {
      img: '',
      label: '',
      visible: false
    }
  };

  // Элементы DOM
  const previewImg = document.getElementById('configPreviewImg');
  const overlayTag = document.getElementById('configOverlayTag');
  const overlayMeter = document.getElementById('configOverlayMeter');
  const legoOverlay = document.getElementById('configLegoOverlay');
  const legoImg = document.getElementById('configLegoImg');
  const legoLabel = document.getElementById('configLegoLabel');

  const meterDisplayVal = document.getElementById('meterDisplayVal');
  const meterSlider = document.getElementById('meterSlider');

  const summaryCollection = document.getElementById('summaryCollection');
  const summaryLayout = document.getElementById('summaryLayout');
  const summaryLine = document.getElementById('summaryLine');
  const summaryFacade = document.getElementById('summaryFacade');
  const summaryCountertop = document.getElementById('summaryCountertop');
  const summaryDiscount = document.getElementById('summaryDiscount');
  const configFinalPrice = document.getElementById('configFinalPrice');
  const configInstallment = document.getElementById('configInstallment');

  // Модальные элементы синхронизации
  const mSumCol = document.getElementById('mSumCol');
  const mSumLen = document.getElementById('mSumLen');
  const mSumPrice = document.getElementById('mSumPrice');

  // Обработчики: Коллекции
  document.querySelectorAll('[data-opt-collection]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('[data-opt-collection]').forEach(b => b.classList.remove('active'));
      el.classList.add('active');
      state.collection = el.dataset.optCollection;
      update();
    });
  });

  // Кнопки перехода из карточек каталога
  document.querySelectorAll('[data-select-collection]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const col = el.dataset.selectCollection;
      state.collection = col;
      document.querySelectorAll('[data-opt-collection]').forEach(b => {
        b.classList.toggle('active', b.dataset.optCollection === col);
      });
      update();
      const cfgSec = document.getElementById('configurator');
      if (cfgSec) {
        cfgSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Обработчики: Компоновка
  document.querySelectorAll('[data-opt-layout]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('[data-opt-layout]').forEach(b => b.classList.remove('active'));
      el.classList.add('active');
      state.layout = el.dataset.optLayout;
      update();
    });
  });

  // Обработчики: Линия высоты
  document.querySelectorAll('[data-opt-line]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('[data-opt-line]').forEach(b => b.classList.remove('active'));
      el.classList.add('active');
      state.line = el.dataset.optLine;
      update();
    });
  });

  // Обработчики: Цветовые свотчи
  document.querySelectorAll('[data-opt-facade]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('[data-opt-facade]').forEach(b => b.classList.remove('active'));
      el.classList.add('active');
      state.facade = el.dataset.optFacade;
      update();
    });
  });

  // Обработчики: Столешницы
  document.querySelectorAll('[data-opt-countertop]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('[data-opt-countertop]').forEach(b => b.classList.remove('active'));
      el.classList.add('active');
      state.countertop = el.dataset.optCountertop;
      update();
    });
  });

  // Обработчики: Слайдер длины
  if (meterSlider) {
    meterSlider.addEventListener('input', (e) => {
      state.length = parseFloat(e.target.value);
      if (meterDisplayVal) meterDisplayVal.textContent = state.length.toFixed(1) + ' м';
      if (overlayMeter) overlayMeter.textContent = state.length.toFixed(1) + ' м';
      update();
    });
  }

  // Обработчики: Фигурки Lego
  document.querySelectorAll('[data-lego-figure]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('[data-lego-figure]').forEach(b => b.classList.remove('active'));
      el.classList.add('active');
      state.legoFigure = el.dataset.legoFigure;
      updateLegoFigure();
    });
  });

  function updateLegoFigure() {
    const fig = legoFiguresData[state.legoFigure];
    if (!legoOverlay) return;

    if (!fig || !fig.visible) {
      legoOverlay.classList.add('hidden');
    } else {
      legoOverlay.classList.remove('hidden');
      if (legoImg) legoImg.src = fig.img;
      if (legoLabel) legoLabel.textContent = fig.label;
    }
  }

  function update() {
    const col = collectionsData[state.collection];
    const lay = layoutData[state.layout];
    const lin = linesData[state.line];
    const top = countertopsData[state.countertop];
    const facName = facadesData[state.facade];

    // Плавное обновление фотографии кухни
    if (previewImg && previewImg.dataset.currentSrc !== col.photo) {
      previewImg.style.opacity = '0.6';
      setTimeout(() => {
        previewImg.src = col.photo;
        previewImg.dataset.currentSrc = col.photo;
        previewImg.style.opacity = '1';
      }, 150);
    }

    // Текстовые плашки
    if (overlayTag) {
      overlayTag.textContent = col.name + ' • ' + lin.name;
    }
    if (overlayMeter) {
      overlayMeter.textContent = state.length.toFixed(1) + ' м (' + lay.name + ')';
    }

    // Расчет стоимости
    const baseAmount = state.length * col.basePerMeter * lay.mult * lin.mult;
    const grossTotal = Math.round((baseAmount + top.extra) / 1000) * 1000;
    const discountAmount = Math.round((grossTotal * 0.20) / 1000) * 1000;
    const finalTotal = grossTotal - discountAmount;
    const monthlyAmount = Math.round(finalTotal / 12);

    // Обновление чека
    if (summaryCollection) summaryCollection.textContent = col.name;
    if (summaryLayout) summaryLayout.textContent = lay.name + ' (' + state.length.toFixed(1) + ' м)';
    if (summaryLine) summaryLine.textContent = lin.name;
    if (summaryFacade) summaryFacade.textContent = facName;
    if (summaryCountertop) summaryCountertop.textContent = top.name;
    if (summaryDiscount) summaryDiscount.textContent = '-' + discountAmount.toLocaleString('ru-RU') + ' ₽';

    if (configFinalPrice) {
      configFinalPrice.textContent = finalTotal.toLocaleString('ru-RU') + ' ₽';
    }
    if (configInstallment) {
      configInstallment.textContent = 'от ' + monthlyAmount.toLocaleString('ru-RU') + ' ₽ / мес (Рассрочка 0% на 12 мес.)';
    }

    // Синхронизация с модальным окном
    if (mSumCol) mSumCol.textContent = col.name + ' (' + facName + ')';
    if (mSumLen) mSumLen.textContent = state.length.toFixed(1) + ' м, ' + lay.name;
    if (mSumPrice) mSumPrice.textContent = finalTotal.toLocaleString('ru-RU') + ' ₽';

    updateLegoFigure();
  }

  // Печать спецификации
  const btnPrint = document.getElementById('btnPrintSpec');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  // Поделиться проектом
  const btnShare = document.getElementById('btnShareConfig');
  if (btnShare) {
    btnShare.addEventListener('click', () => {
      const col = collectionsData[state.collection].name;
      const text = 'Кухня LeMARI: ' + col + ', ' + state.length.toFixed(1) + ' м, ' + layoutData[state.layout].name + '. Стоимость со скидкой 20%: ' + (configFinalPrice ? configFinalPrice.textContent : '');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          alert('✓ Параметры проекта скопированы в буфер обмена:\\n\\n' + text);
        });
      } else {
        alert(text);
      }
    });
  }

  // Запуск первичного расчета
  update();
}

function initLegoStories() {
  // Интерактивные клики по историям Lego
  const cards = document.querySelectorAll('.lego-story-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = '#111111';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = 'var(--border-light)';
    });
  });
}

function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const q = item.querySelector('.faq-question');
    if (q) {
      q.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        items.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

function initModals() {
  const modal = document.getElementById('leadModal');
  const closeBtn = document.querySelector('.modal-close');
  const openButtons = document.querySelectorAll('[data-open-modal]');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('active');
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal) modal.classList.remove('active');
  });

  // Отправка форм
  const forms = [
    document.getElementById('leadModalForm'),
    document.getElementById('mainBookingForm')
  ];

  forms.forEach(f => {
    if (f) {
      f.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Спасибо за заявку! Инженер фабрики LeMARI свяжется с вами в течение 15 минут для согласования 3D-проекта и удобного времени замера в Вологде.');
        if (modal) modal.classList.remove('active');
        f.reset();
      });
    }
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerH = 80;
        const top = targetEl.getBoundingClientRect().top + window.pageYOffset - headerH;
        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
      }
    });
  });
}
`;

fs.writeFileSync('js/main.js', jsContent, 'utf8');
console.log('js/main.js written successfully! Size:', fs.statSync('js/main.js').size);



