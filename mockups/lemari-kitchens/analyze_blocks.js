const fs = require('fs');

const cssContent = `/* ==========================================================================
   LeMARI Вологда — Скандинавские кухни и корпусная мебель с 2006 года
   Вдохновлено Nordic Kitchens (nordickitchens.ru)
   Чистый минимализм, масштабирование фигурками Lego, тактильные материалы
   ========================================================================== */

:root {
  /* Фирменная палитра Nordic Kitchens */
  --bg-page: #f4f4f6;
  --bg-white: #ffffff;
  --bg-header: #e6e7e9;
  --bg-subtle: #eeeff1;
  --bg-dark: #191a1c;
  --bg-dark-hover: #2d2e32;
  
  --text-main: #111214;
  --text-secondary: #5a5c64;
  --text-muted: #8c8f99;
  --text-light: #ffffff;

  --accent-gold: #c69255;
  --accent-sage: #607d6b;
  --accent-green: #2e7d32;
  --accent-orange: #d8721c;

  --border-light: #e2e3e7;
  --border-medium: #d0d2d8;
  --border-dark: #222326;

  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;

  --radius-xs: 3px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;

  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.1);

  --transition-fast: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  --transition-smooth: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
  background-color: var(--bg-page);
  color: var(--text-main);
}

body {
  font-family: var(--font-family);
  line-height: 1.55;
  background-color: var(--bg-page);
  color: var(--text-main);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
  transition: var(--transition-fast);
}

button {
  cursor: pointer;
  border: none;
  background: none;
  font-family: inherit;
}

.container {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ==========================================================================
   Верхняя сервисная полоса
   ========================================================================== */
.top-announcement {
  background-color: #1a1b1e;
  color: #e2e3e6;
  font-size: 12px;
  padding: 9px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.top-announcement__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.top-announcement strong {
  color: #ffffff;
}

.top-announcement__links {
  display: flex;
  align-items: center;
  gap: 16px;
}

.top-announcement__phone {
  font-weight: 600;
  color: #ffffff;
}

.top-announcement__messenger {
  color: #b0b3bc;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-xs);
}

.top-announcement__messenger:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

/* ==========================================================================
   Шапка (Header в точности как Nordic Kitchens)
   ========================================================================== */
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: rgba(230, 231, 233, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  height: 80px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.header__logo {
  display: flex;
  flex-direction: column;
}

.header__logo-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header__logo-brand {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #111111;
  line-height: 1;
}

.header__lego-tag {
  background: #111111;
  color: #ffffff;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  padding: 2px 6px;
  border-radius: 2px;
  text-transform: uppercase;
}

.header__logo-sub {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6e7078;
  margin-top: 3px;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header__nav-link {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #2b2c30;
  padding: 6px 0;
  position: relative;
}

.header__nav-link:hover {
  color: #000000;
}

.header__nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #111111;
  transition: width 0.2s ease;
}

.header__nav-link:hover::after {
  width: 100%;
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header__phone-pill {
  font-size: 13px;
  font-weight: 700;
  color: #111111;
  padding: 8px 14px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: var(--radius-xs);
  background: rgba(255, 255, 255, 0.5);
}

.header__phone-pill:hover {
  background: #ffffff;
}

/* Кнопки в скандинавском стиле */
.btn-nordic {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 22px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background-color: var(--bg-dark);
  color: #ffffff;
  border-radius: var(--radius-xs);
  transition: var(--transition-fast);
  text-align: center;
}

.btn-nordic:hover {
  background-color: var(--bg-dark-hover);
  color: #ffffff;
  transform: translateY(-1px);
}

.btn-nordic--light {
  background-color: #ffffff;
  color: #191a1c;
  border: 1px solid var(--border-medium);
}

.btn-nordic--light:hover {
  background-color: #f7f7f8;
  border-color: #191a1c;
  color: #191a1c;
}

.btn-nordic--wide {
  width: 100%;
}

.btn-nordic--small {
  padding: 8px 14px;
  font-size: 11px;
}

/* ==========================================================================
   Секции общие
   ========================================================================== */
.section {
  padding: 84px 0;
  border-bottom: 1px solid var(--border-light);
}

.section--white {
  background-color: #ffffff;
}

.section--grey {
  background-color: var(--bg-page);
}

.section-head {
  text-align: center;
  max-width: 820px;
  margin: 0 auto 52px;
}

.section-head__tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.section-head__title {
  font-size: 34px;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  line-height: 1.25;
  color: var(--text-main);
  margin-bottom: 14px;
}

.section-head__desc {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.65;
}

/* ==========================================================================
   Hero Секция (Первый экран)
   ========================================================================== */
.hero {
  padding: 56px 0 60px;
  background-color: #ffffff;
  border-bottom: 1px solid var(--border-light);
}

.hero__header {
  margin-bottom: 32px;
}

.hero__tagline {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 14px;
}

.hero__title {
  font-size: 46px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: #121316;
  max-width: 960px;
  margin-bottom: 18px;
}

.hero__desc {
  font-size: 16px;
  color: var(--text-secondary);
  max-width: 780px;
  line-height: 1.65;
}

.hero__visual {
  position: relative;
  width: 100%;
  height: 560px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  margin-bottom: 36px;
  background-color: #ebebee;
}

.hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* Интерактивный хотспот Lego-шефа */
.hero__lego-badge {
  position: absolute;
  bottom: 36px;
  left: 36px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(10px);
  padding: 14px 20px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.8);
  max-width: 420px;
}

.hero__lego-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d8721c;
  box-shadow: 0 0 0 4px rgba(216, 114, 28, 0.25);
  flex-shrink: 0;
  animation: pulse-dot 2s infinite ease-in-out;
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

.hero__lego-info {
  display: flex;
  flex-direction: column;
}

.hero__lego-info strong {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #111111;
}

.hero__lego-info span {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.35;
  margin-top: 2px;
}

.hero__floating-card {
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(25, 26, 28, 0.88);
  color: #ffffff;
  padding: 12px 20px;
  border-radius: var(--radius-xs);
  backdrop-filter: blur(8px);
}

.hero__floating-title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero__floating-sub {
  font-size: 11px;
  color: #c4c6cf;
  margin-top: 2px;
}

/* 6 Бейджей доверия */
.hero__badges-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.badge-card {
  background: var(--bg-page);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xs);
  padding: 18px 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  transition: var(--transition-fast);
}

.badge-card:hover {
  background: #ffffff;
  border-color: var(--border-medium);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.badge-card__icon {
  font-size: 20px;
  line-height: 1;
}

.badge-card__title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #111111;
  margin-bottom: 4px;
}

.badge-card__desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.45;
}

/* ==========================================================================
   Блок Философии & Lego-масштаба
   ========================================================================== */
.lego-stories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.lego-story-card {
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  overflow: hidden;
  transition: var(--transition-smooth);
}

.lego-story-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-medium);
}

.lego-story-card__photo {
  position: relative;
  height: 230px;
  overflow: hidden;
  background-color: #ebebee;
}

.lego-story-card__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.lego-story-card:hover .lego-story-card__photo img {
  transform: scale(1.05);
}

.lego-story-card__tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(25, 26, 28, 0.85);
  color: #ffffff;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: var(--radius-xs);
  backdrop-filter: blur(4px);
}

.lego-story-card__body {
  padding: 20px 22px;
}

.lego-story-card__name {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #111111;
  margin-bottom: 8px;
  line-height: 1.35;
}

.lego-story-card__desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.55;
}

/* ==========================================================================
   Коллекции (Стиль и характер вашей кухни)
   ========================================================================== */
.collections-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

.collection-item {
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: var(--transition-smooth);
}

.collection-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-medium);
}

.collection-item--featured {
  grid-column: span 2;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
}

.collection-item__photo {
  position: relative;
  height: 320px;
  overflow: hidden;
  background-color: #ebebee;
}

.collection-item--featured .collection-item__photo {
  height: 100%;
  min-height: 340px;
}

.collection-item__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.collection-item:hover .collection-item__photo img {
  transform: scale(1.04);
}

.collection-item__badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: #ffffff;
  color: #111111;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 5px 10px;
  border-radius: var(--radius-xs);
  box-shadow: var(--shadow-sm);
}

.collection-item__badge--accent {
  background: #111111;
  color: #ffffff;
}

.collection-item__body {
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.collection-item__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.collection-item__code {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.collection-item__time {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--accent-sage);
  text-transform: uppercase;
}

.collection-item__name {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #111111;
  margin-bottom: 12px;
}

.collection-item__desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
}

.collection-item__specs {
  list-style: none;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.collection-item__specs li {
  font-size: 13px;
  color: #33363e;
  position: relative;
  padding-left: 18px;
}

.collection-item__specs li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--accent-gold);
  font-weight: bold;
}

.collection-item__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid var(--border-light);
}

.collection-item__price-label {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.collection-item__price {
  font-size: 20px;
  font-weight: 800;
  color: #111111;
}

/* ==========================================================================
   Дизайн-решения (Архитектура кухни)
   ========================================================================== */
.architecture-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.arch-card {
  background-color: var(--bg-page);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  padding: 36px 30px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: var(--transition-fast);
}

.arch-card:hover {
  background-color: #ffffff;
  border-color: var(--border-medium);
  box-shadow: var(--shadow-sm);
}

.arch-card--highlight {
  background-color: #ffffff;
  border-color: #111111;
  box-shadow: var(--shadow-md);
}

.arch-card__popular-badge {
  position: absolute;
  top: -12px;
  left: 24px;
  background: #111111;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: var(--radius-xs);
}

.arch-card__term {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-gold);
  margin-bottom: 12px;
}

.arch-card__title {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #111111;
  margin-bottom: 12px;
  line-height: 1.3;
}

.arch-card__desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.55;
  margin-bottom: 24px;
}

.arch-card__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid var(--border-light);
}

.arch-card__list li {
  font-size: 13px;
  color: #33363e;
  line-height: 1.45;
  position: relative;
  padding-left: 18px;
}

.arch-card__list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--accent-green);
  font-weight: bold;
}

/* ==========================================================================
   Интерактивный Конструктор и Калькулятор
   ========================================================================== */
.config-layout {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 36px;
  align-items: flex-start;
}

/* Левая панель: Визуализация + Смета */
.config-visual-panel {
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.config-viewport {
  position: relative;
  width: 100%;
  height: 380px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background-color: #ebebee;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
}

.config-viewport__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.25s ease;
}

.config-viewport__tags {
  position: absolute;
  top: 14px;
  left: 14px;
  display: flex;
  gap: 8px;
  z-index: 5;
}

.config-tag {
  background: rgba(25, 26, 28, 0.85);
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 5px 10px;
  border-radius: var(--radius-xs);
  backdrop-filter: blur(4px);
}

.config-tag--meter {
  background: #ffffff;
  color: #111111;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* Наложение фигурки Lego для масштаба */
.config-lego-overlay {
  position: absolute;
  bottom: 20px;
  right: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.config-lego-overlay.hidden {
  opacity: 0;
  transform: translateY(15px) scale(0.95);
  visibility: hidden;
}

.config-lego-figure {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.92);
  border: 2px solid #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.config-lego-figure img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.config-lego-ruler {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.config-lego-ruler__line {
  width: 40px;
  height: 2px;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

.config-lego-ruler__label {
  background: rgba(25, 26, 28, 0.9);
  color: #ffffff;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: var(--radius-xs);
  margin-top: 4px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Панель переключения фигурок Lego */
.config-lego-picker {
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.config-lego-picker__title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.config-lego-picker__buttons {
  display: flex;
  gap: 6px;
}

.btn-lego-chip {
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xs);
  background: var(--bg-page);
  color: var(--text-main);
  transition: var(--transition-fast);
}

.btn-lego-chip:hover {
  background: #ebebee;
}

.btn-lego-chip.active {
  background: #111111;
  color: #ffffff;
  border-color: #111111;
}

/* Чек сметы */
.config-receipt-box {
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  padding: 24px 26px;
  box-shadow: var(--shadow-sm);
}

.config-receipt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-light);
}

.config-receipt-tag {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #111111;
}

.config-receipt-badge {
  background: #eef7ee;
  color: var(--accent-green);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: var(--radius-xs);
}

.config-receipt-rows {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-bottom: 18px;
}

.config-receipt-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
}

.config-receipt-row span {
  color: var(--text-secondary);
}

.config-receipt-row strong {
  color: var(--text-main);
  font-weight: 600;
}

.receipt-free {
  color: var(--accent-green) !important;
}

.receipt-discount {
  color: var(--accent-orange) !important;
}

.config-receipt-total {
  padding: 16px 0 10px;
  border-top: 1px solid var(--border-light);
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.config-receipt-total__label span {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #111111;
  display: block;
}

.config-receipt-total__label small {
  font-size: 11px;
  color: var(--accent-green);
  font-weight: 600;
}

.config-receipt-total__price {
  font-size: 28px;
  font-weight: 800;
  color: #111111;
}

.config-receipt-installment {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: right;
  margin-bottom: 16px;
}

.config-receipt-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.config-receipt-sub-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

/* Правая панель контролов */
.config-options-panel {
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  padding: 32px 36px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.opt-section {
  display: flex;
  flex-direction: column;
}

.opt-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.opt-head--split {
  justify-content: space-between;
}

.opt-num {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: var(--accent-gold);
}

.opt-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #111111;
}

.opt-chips-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.opt-chips-grid--3 {
  grid-template-columns: repeat(3, 1fr);
}

.opt-chip {
  background: var(--bg-page);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xs);
  padding: 12px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: var(--transition-fast);
}

.opt-chip:hover {
  background: #f0f0f3;
  border-color: var(--border-medium);
}

.opt-chip.active {
  background: #ffffff;
  border-color: #111111;
  box-shadow: 0 0 0 1px #111111;
}

.opt-chip__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid var(--border-medium);
  background: #ffffff;
  flex-shrink: 0;
}

.opt-chip.active .opt-chip__dot {
  background: #111111;
  border-color: #111111;
}

.opt-chip__icon {
  font-size: 14px;
  color: #666;
  font-weight: bold;
}

.opt-chip__content {
  display: flex;
  flex-direction: column;
}

.opt-chip__name {
  font-size: 13px;
  font-weight: 700;
  color: #111111;
}

.opt-chip__sub {
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.25;
  margin-top: 2px;
}

/* Слайдер метража */
.meter-display {
  font-size: 16px;
  font-weight: 800;
  color: #111111;
  background: var(--bg-page);
  padding: 4px 12px;
  border-radius: var(--radius-xs);
  border: 1px solid var(--border-light);
}

.range-input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: var(--border-light);
  border-radius: 3px;
  outline: none;
  margin: 12px 0 6px;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #111111;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: transform 0.1s ease;
}

.range-input::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-muted);
}

/* Интерактивные свотчи палитры */
.swatches-interactive {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.swatch-btn {
  background: var(--bg-page);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xs);
  padding: 10px 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
  transition: var(--transition-fast);
}

.swatch-btn:hover {
  background: #ffffff;
  border-color: var(--border-medium);
}

.swatch-btn.active {
  background: #ffffff;
  border-color: #111111;
  box-shadow: 0 0 0 1px #111111;
}

.swatch-btn__circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.swatch-btn__label {
  font-size: 10px;
  font-weight: 600;
  color: #111111;
  line-height: 1.2;
}

/* ==========================================================================
   Сравнительная таблица: Модули vs Индивидуальный заказ
   ========================================================================== */
.comparison-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  background: #ffffff;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
}

.comparison-table th, .comparison-table td {
  padding: 18px 24px;
  border-bottom: 1px solid var(--border-light);
}

.comparison-table th {
  background: var(--bg-page);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #111111;
}

.th-badge {
  display: inline-block;
  font-size: 10px;
  background: var(--accent-sage);
  color: #ffffff;
  padding: 2px 8px;
  border-radius: var(--radius-xs);
  margin-bottom: 6px;
}

.th-badge--dark {
  background: #111111;
}

.col-modular {
  background: #fbfbfb;
}

.col-custom {
  background: #ffffff;
}

.highlight-green {
  color: var(--accent-green);
  font-weight: 700;
}

/* ==========================================================================
   8 Фактов о фабрике LeMARI (г. Вологда)
   ========================================================================== */
.facts-showcase {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 36px;
  align-items: flex-start;
}

.facts-showcase__media {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 100px;
}

.facts-photo-card {
  position: relative;
  border-radius: var(--radius-sm);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
  background: #ffffff;
}

.facts-photo-card img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.facts-photo-card__caption {
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
}

.facts-photo-card__caption strong {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #111111;
}

.facts-photo-card__caption span {
  font-size: 11px;
  color: var(--text-secondary);
}

.facts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background-color: var(--border-medium);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.fact-card {
  background-color: #ffffff;
  padding: 28px 30px;
  transition: var(--transition-fast);
}

.fact-card:hover {
  background-color: #fbfbfb;
}

.fact-card__num {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: var(--accent-gold);
  margin-bottom: 10px;
}

.fact-card__title {
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #111111;
  margin-bottom: 8px;
  line-height: 1.35;
}

.fact-card__desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ==========================================================================
   Материалы & Графитовый корпус
   ========================================================================== */
.swatches-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.swatch-card {
  background: var(--bg-page);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  overflow: hidden;
  transition: var(--transition-fast);
}

.swatch-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
  border-color: var(--border-medium);
}

.swatch-card__img {
  height: 170px;
  overflow: hidden;
  background: #ebebee;
}

.swatch-card__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swatch-card__info {
  padding: 16px;
}

.swatch-card__name {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  color: #111111;
  margin-bottom: 4px;
}

.swatch-card__type {
  font-size: 12px;
  color: var(--text-secondary);
}

.graphite-feature {
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  padding: 40px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  align-items: center;
  box-shadow: var(--shadow-sm);
}

.graphite-feature__tag {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-gold);
}

.graphite-feature__title {
  font-size: 24px;
  font-weight: 800;
  text-transform: uppercase;
  margin-top: 8px;
  margin-bottom: 14px;
  color: #111111;
}

.graphite-feature__desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.65;
  margin-bottom: 20px;
}

.graphite-feature__bullets {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.graphite-feature__image {
  height: 260px;
  border-radius: var(--radius-xs);
  overflow: hidden;
  background: #ebebee;
}

.graphite-feature__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ==========================================================================
   5 Шагов
   ========================================================================== */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
}

.step-card {
  background: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
}

.step-card__step {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent-gold);
  margin-bottom: 12px;
}

.step-card__title {
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  color: #111111;
  margin-bottom: 8px;
}

.step-card__desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.55;
}

/* ==========================================================================
   Секция записи на замер
   ========================================================================== */
.contact-section {
  background-color: #ffffff;
  padding: 84px 0;
  border-bottom: 1px solid var(--border-light);
}

.contact-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.contact-info__tag {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-muted);
  display: block;
  margin-bottom: 10px;
}

.contact-info__title {
  font-size: 34px;
  font-weight: 800;
  text-transform: uppercase;
  line-height: 1.22;
  margin-bottom: 18px;
}

.contact-info__desc {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.65;
  margin-bottom: 28px;
}

.contact-checklist {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-check-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #222;
}

.check-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #eef7ee;
  color: var(--accent-green);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.contact-form-box {
  background: var(--bg-page);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  padding: 36px 32px;
}

.contact-form-title {
  font-size: 18px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #111111;
  margin-bottom: 20px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-field {
  width: 100%;
  padding: 13px 16px;
  font-size: 14px;
  background: #ffffff;
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-xs);
  outline: none;
  font-family: inherit;
  transition: var(--transition-fast);
}

.form-field:focus {
  border-color: #111111;
  box-shadow: 0 0 0 1px #111111;
}

.form-note {
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.4;
  margin-top: 4px;
}

/* ==========================================================================
   FAQ (Аккордеон)
   ========================================================================== */
.faq-list {
  max-width: 820px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  background: var(--bg-page);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xs);
  overflow: hidden;
  transition: var(--transition-fast);
}

.faq-item.active {
  border-color: var(--border-medium);
  background: #ffffff;
  box-shadow: var(--shadow-sm);
}

.faq-question {
  width: 100%;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  text-align: left;
  font-size: 15px;
  font-weight: 700;
  color: #111111;
}

.faq-arrow {
  font-size: 20px;
  font-weight: 300;
  color: var(--text-secondary);
  transition: transform 0.2s ease;
}

.faq-item.active .faq-arrow {
  transform: rotate(45deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  padding: 0 24px;
}

.faq-item.active .faq-answer {
  max-height: 300px;
  padding: 0 24px 20px;
}

.faq-answer p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ==========================================================================
   Подвал (Footer)
   ========================================================================== */
.footer {
  background-color: #ffffff;
  padding: 64px 0 32px;
  font-size: 13px;
  color: var(--text-secondary);
}

.footer-top {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  gap: 36px;
  padding-bottom: 40px;
  border-bottom: 1px solid var(--border-light);
}

.footer-brand {
  display: flex;
  flex-direction: column;
}

.footer-logo {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.footer-logo__main {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #111111;
}

.footer-logo__sub {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.footer-brand__desc {
  font-size: 13px;
  line-height: 1.6;
  margin-bottom: 16px;
  color: var(--text-secondary);
}

.footer-contacts-quick {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: #333;
}

.footer-contacts-quick a {
  font-weight: 700;
  color: #111;
}

.footer-title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #111111;
  margin-bottom: 16px;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links a:hover {
  color: #000000;
}

.footer-bottom {
  padding-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-muted);
}

/* ==========================================================================
   Модальное окно
   ========================================================================== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(17, 18, 20, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 2000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-overlay.active {
  display: flex;
}

.modal-window {
  background: #ffffff;
  border-radius: var(--radius-sm);
  max-width: 480px;
  width: 100%;
  padding: 36px 32px;
  position: relative;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
  animation: modal-enter 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-enter {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-close {
  position: absolute;
  top: 18px;
  right: 18px;
  font-size: 20px;
  color: #888;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition-fast);
}

.modal-close:hover {
  background: #f0f0f0;
  color: #111;
}

.modal-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.modal-title {
  font-size: 22px;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 8px;
  color: #111;
}

.modal-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 20px;
}

.modal-config-summary {
  background: var(--bg-page);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xs);
  padding: 12px 14px;
  font-size: 12px;
  color: #222;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Плавающая кнопка связи */
.floating-cta {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 999;
}

.floating-cta__btn {
  background: #111111;
  color: #ffffff;
  padding: 12px 18px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  transition: var(--transition-fast);
}

.floating-cta__btn:hover {
  transform: translateY(-2px) scale(1.02);
  background: #252628;
}

.floating-cta__icon {
  font-size: 16px;
}

/* ==========================================================================
   Адаптивность (Mobile & Tablet)
   ========================================================================== */
@media (max-width: 1080px) {
  .header__nav {
    display: none;
  }
  .config-layout {
    grid-template-columns: 1fr;
  }
  .config-visual-panel {
    position: static;
  }
  .facts-showcase {
    grid-template-columns: 1fr;
  }
  .facts-showcase__media {
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .lego-stories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .architecture-grid {
    grid-template-columns: 1fr;
  }
  .steps-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .contact-layout {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .footer-top {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .top-announcement__links {
    display: none;
  }
  .hero {
    padding: 36px 0 40px;
  }
  .hero__title {
    font-size: 32px;
  }
  .hero__visual {
    height: 380px;
  }
  .hero__lego-badge {
    bottom: 16px;
    left: 16px;
    right: 16px;
    padding: 10px 14px;
  }
  .hero__badges-grid {
    grid-template-columns: 1fr;
  }
  .collections-grid {
    grid-template-columns: 1fr;
  }
  .collection-item--featured {
    grid-column: span 1;
    grid-template-columns: 1fr;
  }
  .lego-stories-grid {
    grid-template-columns: 1fr;
  }
  .facts-grid {
    grid-template-columns: 1fr;
  }
  .facts-showcase__media {
    grid-template-columns: 1fr;
  }
  .swatches-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .swatches-interactive {
    grid-template-columns: repeat(3, 1fr);
  }
  .opt-chips-grid, .opt-chips-grid--3 {
    grid-template-columns: 1fr;
  }
  .graphite-feature {
    grid-template-columns: 1fr;
    padding: 24px;
  }
  .steps-grid {
    grid-template-columns: 1fr;
  }
  .footer-top {
    grid-template-columns: 1fr;
  }
  .footer-bottom {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}

/* ==========================================================================
   Стили для печати спецификации (Print)
   ========================================================================== */
@media print {
  .header, .top-announcement, .hero, #philosophy, #collections, #architecture, 
  #comparison, #facts, #materials, .contact-section, #faq, .footer, 
  .floating-cta, .modal-overlay, .config-lego-picker, .config-options-panel, 
  .config-receipt-buttons, .config-viewport__tags, .config-lego-overlay {
    display: none !important;
  }

  body, html {
    background: #ffffff !important;
    color: #000000 !important;
    font-size: 12pt;
  }

  .config-layout {
    display: block !important;
  }

  .config-visual-panel {
    position: static !important;
  }

  .config-receipt-box {
    border: 2px solid #000000 !important;
    box-shadow: none !important;
    page-break-inside: avoid;
  }
}
`;

fs.writeFileSync('css/style.css', cssContent, 'utf8');
console.log('css/style.css written successfully! Size:', fs.statSync('css/style.css').size);
