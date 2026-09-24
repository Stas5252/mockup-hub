/**
 * АТЕЛЬЕ VESTA — Микро-взаимодействия и интерфейсные события
 */

(function () {
  'use strict';

  function initApp() {
    initCustomCursor();
    initGalleryFilters();
    initTeleportToStage();
    initBookingModal();
  }

  // 1. Кинетический курсор
  function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function renderCursor() {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const hoverables = 'a, button, input, .swatch-circle-btn, .craft-option-row, .monograph-lot-card';
    document.querySelectorAll(hoverables).forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  // 2. Фильтрация каталога коллекции
  function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-tab-pill');
    const lotCards = document.querySelectorAll('.monograph-lot-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.dataset.filter;

        lotCards.forEach(card => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 3. Телепорт камеры на предмет в 3D
  function initTeleportToStage() {
    document.querySelectorAll('.btn-teleport-stage').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const piece = btn.dataset.piece;

        // Отправка события в Three.js сцену
        window.dispatchEvent(new CustomEvent('vesta:teleportView', {
          detail: { piece }
        }));

        // Плавный скролл к 3D-павильону
        const stage = document.getElementById('configurator');
        if (stage) {
          stage.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // 4. Модальное окно записи на диалог с архитектором
  function initBookingModal() {
    const modal = document.getElementById('bookingModal');
    const form = document.getElementById('bookingForm');
    const successBlock = document.getElementById('bookingSuccessBlock');
    const closeBtn = document.getElementById('closeModalBtn');

    if (!modal) return;

    function openModal() {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (successBlock) successBlock.style.display = 'none';
      if (form) form.style.display = 'block';
    }

    document.querySelectorAll('[data-open-modal="booking"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        form.style.display = 'none';
        if (successBlock) successBlock.style.display = 'block';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
