/**
 * АТЕЛЬЕ VESTA — Архитектурный калькулятор авторской сметы
 * Прозрачный расчет стоимости, ремесленных часов и сроков производства.
 */

(function () {
  'use strict';

  const CalcEngine = {
    ensemble: 'lounge', // solo, lounge, residence
    area: 36,
    wood: 'oak',
    fabric: 'boucle',
    logistics: 'whiteglove',
    currency: 'RUB', // RUB, EUR, USD
    currencyRates: { RUB: 1, EUR: 0.0098, USD: 0.0108 },
    currencySymbols: { RUB: '₽', EUR: '€', USD: '$' },
    addons: {
      dovetail: true,
      butterfly: false,
      wireless: true,
      plaque: true
    },

    ensembleBase: {
      solo: { rub: 545000, name: 'Модульный диван VESTA Grand', hours: 68 },
      lounge: { rub: 780000, name: 'Лаунж-комплект (диван, столик, кресло)', hours: 104 },
      residence: { rub: 1180000, name: 'Полная резиденция (диван, столик, кресло, консоль, свет)', hours: 156 }
    },

    woodMultipliers: {
      oak: { rate: 1.0, name: 'Европейский белый дуб' },
      walnut: { rate: 1.22, name: 'Американский орех (+22%)' },
      ash: { rate: 1.14, name: 'Мореный огненный ясень (+14%)' }
    },

    fabricCosts: {
      boucle: { rub: 0, name: 'Фактурное плотное букле Ecru' },
      linen: { rub: 45000, name: 'Бельгийский вываренный лён' },
      leather: { rub: 115000, name: 'Анилиновая седельная кожа растительного дубления' }
    },

    addonCosts: {
      dovetail: { rub: 38000, hours: 14, name: 'Шиповые сопряжения «ласточкин хвост»' },
      butterfly: { rub: 46000, hours: 8, name: 'Латунные клинья-бабочки в торцах' },
      wireless: { rub: 29000, hours: 4, name: 'Индукционная зарядка Qi в травертине' },
      plaque: { rub: 15000, hours: 2, name: 'Именная латунная табличка мастера' }
    },

    logisticsCosts: {
      pickup: { rub: 0, name: 'Самовывоз из мастерской' },
      whiteglove: { rub: 42000, name: 'Архитектурный занос, сборка и расстановка' },
      freight: { rub: 68000, name: 'Климатический деревянный кофр для дальних резиденций' }
    },

    init() {
      this.bindInputs();
      this.listenMaterialSync();
      this.calculate();
    },

    bindInputs() {
      // Выбор ансамбля
      document.querySelectorAll('#ensembleButtons button').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('#ensembleButtons button').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.ensemble = btn.dataset.val;
          this.calculate();
        });
      });

      // Ползунок площади
      const slider = document.getElementById('areaRangeSlider');
      if (slider) {
        slider.addEventListener('input', (e) => {
          this.area = parseInt(e.target.value, 10);
          const readout = document.getElementById('areaValueReadout');
          if (readout) readout.textContent = `${this.area} м²`;
          this.calculate();
        });
      }

      // Выбор массива дерева
      document.querySelectorAll('#woodButtons button').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('#woodButtons button').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.wood = btn.dataset.val;
          this.calculate();
        });
      });

      // Выбор обивки
      document.querySelectorAll('#fabricButtons button').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('#fabricButtons button').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.fabric = btn.dataset.val;
          this.calculate();
        });
      });

      // Чекбоксы ремесленных улучшений
      document.querySelectorAll('.craft-option-row').forEach(row => {
        row.addEventListener('click', () => {
          const key = row.dataset.addon;
          this.addons[key] = !this.addons[key];
          row.classList.toggle('checked', this.addons[key]);
          this.calculate();
        });
      });

      // Логистика
      document.querySelectorAll('#logisticsButtons button').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('#logisticsButtons button').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.logistics = btn.dataset.val;
          this.calculate();
        });
      });

      // Валютный переключатель
      const currToggle = document.getElementById('currencyToggleBtn');
      if (currToggle) {
        currToggle.addEventListener('click', () => {
          const list = ['RUB', 'EUR', 'USD'];
          const nextIdx = (list.indexOf(this.currency) + 1) % list.length;
          this.currency = list[nextIdx];
          currToggle.textContent = `${this.currency} (${this.currencySymbols[this.currency]})`;
          this.calculate();
        });
      }
    },

    listenMaterialSync() {
      window.addEventListener('vesta:materialChange', (e) => {
        const { type, value } = e.detail;
        if (type === 'wood' && this.woodMultipliers[value]) {
          this.wood = value;
          document.querySelectorAll('#woodButtons button').forEach(b => {
            b.classList.toggle('active', b.dataset.val === value);
          });
          this.calculate();
        } else if (type === 'fabric' && this.fabricCosts[value]) {
          this.fabric = value;
          document.querySelectorAll('#fabricButtons button').forEach(b => {
            b.classList.toggle('active', b.dataset.val === value);
          });
          this.calculate();
        }
      });
    },

    formatPrice(amountRub) {
      const converted = amountRub * this.currencyRates[this.currency];
      const sym = this.currencySymbols[this.currency];
      if (this.currency === 'RUB') {
        return Math.round(converted).toLocaleString('ru-RU') + ' ₽';
      } else {
        return sym + ' ' + Math.round(converted).toLocaleString('en-US');
      }
    },

    calculate() {
      const ensembleData = this.ensembleBase[this.ensemble] || this.ensembleBase.lounge;
      const woodData = this.woodMultipliers[this.wood] || this.woodMultipliers.oak;
      const fabricData = this.fabricCosts[this.fabric] || this.fabricCosts.boucle;
      const logData = this.logisticsCosts[this.logistics] || this.logisticsCosts.whiteglove;

      // Базовая цена с учетом породы дерева и масштаба
      let baseCalculated = Math.round(ensembleData.rub * woodData.rate);

      // Коррекция на площадь (база 36м², каждый метр +/- 0.5%)
      const areaFactor = 1 + (this.area - 36) * 0.005;
      baseCalculated = Math.round(baseCalculated * areaFactor);

      // Добавка за ткань
      const fabricCost = fabricData.rub;

      // Ремесленные усложнения
      let addonsCost = 0;
      let totalHours = ensembleData.hours;

      let selectedAddonsCount = 0;
      Object.keys(this.addons).forEach(k => {
        if (this.addons[k]) {
          const item = this.addonCosts[k];
          addonsCost += item.rub;
          totalHours += item.hours;
          selectedAddonsCount++;
        }
      });

      const logisticsCost = logData.rub;
      const grandTotal = baseCalculated + fabricCost + addonsCost + logisticsCost;

      // Обновление DOM досье
      const elBaseTitle = document.getElementById('dossierBaseTitle');
      const elBaseSpec = document.getElementById('dossierBaseSpec');
      const elBaseCost = document.getElementById('dossierBaseCost');

      if (elBaseTitle) elBaseTitle.textContent = ensembleData.name;
      if (elBaseSpec) elBaseSpec.textContent = `${woodData.name} · Площадь ${this.area} м²`;
      if (elBaseCost) elBaseCost.textContent = this.formatPrice(baseCalculated);

      const elFabSpec = document.getElementById('dossierFabricSpec');
      const elFabCost = document.getElementById('dossierFabricCost');
      if (elFabSpec) elFabSpec.textContent = fabricData.name;
      if (elFabCost) elFabCost.textContent = this.formatPrice(fabricCost);

      const elAddonsSpec = document.getElementById('dossierAddonsSpec');
      const elAddonsCost = document.getElementById('dossierAddonsCost');
      if (elAddonsSpec) elAddonsSpec.textContent = `${selectedAddonsCount} ремесленных узла ручной обработки`;
      if (elAddonsCost) elAddonsCost.textContent = this.formatPrice(addonsCost);

      const elLogSpec = document.getElementById('dossierLogisticsSpec');
      const elLogCost = document.getElementById('dossierLogisticsCost');
      if (elLogSpec) elLogSpec.textContent = logData.name;
      if (elLogCost) elLogCost.textContent = this.formatPrice(logisticsCost);

      const elHours = document.getElementById('dossierHours');
      if (elHours) elHours.textContent = `${totalHours} часов ручной работы`;

      const elTotal = document.getElementById('dossierGrandTotal');
      if (elTotal) elTotal.textContent = this.formatPrice(grandTotal);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CalcEngine.init());
  } else {
    CalcEngine.init();
  }
})();
