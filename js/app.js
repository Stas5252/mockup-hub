/**
 * MOCKUP HUB - ОСНОВНАЯ ЛОГИКА ПРИЛОЖЕНИЯ
 */

document.addEventListener("DOMContentLoaded", () => {
  // Элементы интерфейса
  const mockupsGrid = document.getElementById("mockupsGrid");
  const categoriesBar = document.getElementById("categoriesBar");
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearch");
  const filterStatusLabel = document.getElementById("filterStatusLabel");
  const sortSelect = document.getElementById("sortSelect");
  const emptyState = document.getElementById("emptyState");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");
  const mockupsCountBadge = document.getElementById("mockupsCount");
  const themeToggleBtn = document.getElementById("themeToggle");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  // Элементы модального окна предпросмотра
  const previewModal = document.getElementById("previewModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalClose = document.getElementById("modalClose");
  const modalTitle = document.getElementById("modalTitle");
  const modalCategory = document.getElementById("modalCategory");
  const previewIframe = document.getElementById("previewIframe");
  const iframeContainer = document.getElementById("iframeContainer");
  const modalExternalLink = document.getElementById("modalExternalLink");
  const modalCopyBtn = document.getElementById("modalCopyBtn");
  const deviceButtons = document.querySelectorAll(".btn-device");

  // Текущее состояние фильтров
  let currentCategory = "Все";
  let searchQuery = "";
  let currentSort = "default";
  let currentActiveMockup = null;

  // ------------------------------------------------------------
  // 1. ТЕМА ОФОРМЛЕНИЯ (DARK / LIGHT)
  // ------------------------------------------------------------
  const savedTheme = localStorage.getItem("mockuphub-theme") || "dark";
  if (savedTheme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  }

  themeToggleBtn.addEventListener("click", () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    if (isLight) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("mockuphub-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("mockuphub-theme", "light");
    }
  });

  // ------------------------------------------------------------
  // 2. ИНИЦИАЛИЗАЦИЯ КАТЕГОРИЙ
  // ------------------------------------------------------------
  function renderCategories() {
    // Вычисляем количество для каждой категории
    const counts = { "Все": MOCKUPS_DATA.length };
    MOCKUPS_DATA.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });

    // Собираем список уникальных категорий
    const dynamicCategories = ["Все", ...new Set(MOCKUPS_DATA.map(m => m.category))];

    categoriesBar.innerHTML = "";
    dynamicCategories.forEach(cat => {
      const count = counts[cat] || 0;
      const btn = document.createElement("button");
      btn.className = `category-btn ${cat === currentCategory ? "active" : ""}`;
      btn.innerHTML = `
        <span>${cat}</span>
        <span class="category-count">${count}</span>
      `;
      btn.addEventListener("click", () => {
        currentCategory = cat;
        updateActiveCategoryButton();
        renderMockups();
      });
      categoriesBar.appendChild(btn);
    });
  }

  function updateActiveCategoryButton() {
    document.querySelectorAll(".category-btn").forEach(btn => {
      const text = btn.querySelector("span").textContent.trim();
      btn.classList.toggle("active", text === currentCategory);
    });
  }

  // ------------------------------------------------------------
  // 3. ПОЛУЧЕНИЕ АБСОЛЮТНОЙ ССЫЛКИ НА МАКЕТ
  // ------------------------------------------------------------
  function getMockupFullUrl(folder) {
    const relativePath = `mockups/${folder}/index.html`;
    try {
      const url = new URL(relativePath, window.location.href);
      return url.href;
    } catch (e) {
      return `${window.location.origin}/${relativePath}`;
    }
  }

  // ------------------------------------------------------------
  // 4. КОПИРОВАНИЕ В БУФЕР ОБМЕНА С УВЕДОМЛЕНИЕМ
  // ------------------------------------------------------------
  let toastTimer = null;
  function showToast(title, message) {
    if (toastTimer) clearTimeout(toastTimer);

    const titleEl = toast.querySelector(".toast-title");
    if (title) titleEl.textContent = title;
    if (message) toastMessage.textContent = message;

    toast.classList.add("show");
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  function copyMockupLink(mockup) {
    const fullUrl = getMockupFullUrl(mockup.folder);
    navigator.clipboard.writeText(fullUrl).then(() => {
      showToast("Ссылка скопирована!", `Прямой адрес: ${fullUrl}`);
    }).catch(() => {
      // Fallback
      prompt("Скопируйте ссылку вручную:", fullUrl);
    });
  }

  // ------------------------------------------------------------
  // 5. ОТРИСОВКА КАРТОЧЕК МАКЕТОВ
  // ------------------------------------------------------------
  function filterAndSortMockups() {
    let filtered = MOCKUPS_DATA.filter(item => {
      const matchesCategory = currentCategory === "Все" || item.category === currentCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.folder.toLowerCase().includes(q) ||
        item.tags.some(tag => tag.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });

    if (currentSort === "name-asc") {
      filtered.sort((a, b) => a.title.localeCompare(b.title, "ru"));
    } else if (currentSort === "category") {
      filtered.sort((a, b) => a.category.localeCompare(b.category, "ru"));
    }

    return filtered;
  }

  function renderMockups() {
    const list = filterAndSortMockups();
    mockupsCountBadge.textContent = `Всего: ${MOCKUPS_DATA.length}`;
    
    // Обновляем текст статуса
    if (searchQuery) {
      filterStatusLabel.textContent = `Найдено: ${list.length} по запросу «${searchQuery}»`;
    } else if (currentCategory !== "Все") {
      filterStatusLabel.textContent = `Категория «${currentCategory}» (${list.length})`;
    } else {
      filterStatusLabel.textContent = `Все доступные макеты (${list.length})`;
    }

    if (list.length === 0) {
      mockupsGrid.innerHTML = "";
      emptyState.style.display = "block";
      return;
    }

    emptyState.style.display = "none";
    mockupsGrid.innerHTML = "";

    list.forEach(mockup => {
      const fullUrl = getMockupFullUrl(mockup.folder);
      const card = document.createElement("div");
      card.className = "mockup-card";

      // Теги в виде HTML
      const tagsHtml = mockup.tags.map(t => `<span class="card-tag">#${t}</span>`).join("");

      card.innerHTML = `
        <div class="card-media">
          <div class="card-mockup-placeholder">
            <span class="placeholder-badge">${mockup.category}</span>
            <div class="placeholder-pattern">${mockup.emoji || "💻"}</div>
            <div class="placeholder-title">${mockup.title}</div>
          </div>
          <div class="card-overlay">
            <button class="btn-overlay-preview" data-action="preview">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Быстрый просмотр
            </button>
          </div>
        </div>

        <div class="card-content">
          <div class="card-header-meta">
            <span class="card-category">${mockup.category}</span>
            <span class="card-folder-tag">/${mockup.folder}/</span>
          </div>

          <h3 class="card-title">${mockup.title}</h3>
          <p class="card-desc">${mockup.description}</p>

          <div class="card-tags">${tagsHtml}</div>

          <div class="card-actions">
            <button class="btn btn-secondary btn-copy" title="Скопировать ссылку для отправки клиенту">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>Копировать</span>
            </button>
            <a href="${fullUrl}" target="_blank" rel="noopener" class="btn btn-primary" title="Открыть макет в новой вкладке">
              <span>Открыть</span>
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      `;

      // Обработчики для карточки
      const copyBtn = card.querySelector(".btn-copy");
      copyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        copyMockupLink(mockup);
      });

      const previewTrigger = card.querySelector('[data-action="preview"]');
      if (previewTrigger) {
        previewTrigger.addEventListener("click", () => {
          openPreviewModal(mockup);
        });
      }

      mockupsGrid.appendChild(card);
    });
  }

  // ------------------------------------------------------------
  // 6. МОДАЛЬНОЕ ОКНО ПРЕДПРОСМОТРА С АДАПТИВНЫМ ФРЕЙМОМ
  // ------------------------------------------------------------
  function openPreviewModal(mockup) {
    currentActiveMockup = mockup;
    const fullUrl = getMockupFullUrl(mockup.folder);

    modalTitle.textContent = mockup.title;
    modalCategory.textContent = mockup.category;
    modalExternalLink.href = fullUrl;
    previewIframe.src = fullUrl;

    // Сброс размера на десктоп
    setIframeWidth("100%");

    previewModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closePreviewModal() {
    previewModal.classList.remove("active");
    previewIframe.src = "about:blank";
    document.body.style.overflow = "";
    currentActiveMockup = null;
  }

  function setIframeWidth(width) {
    iframeContainer.style.width = width;
    deviceButtons.forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-width") === width);
    });
  }

  deviceButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      setIframeWidth(btn.getAttribute("data-width"));
    });
  });

  modalClose.addEventListener("click", closePreviewModal);
  modalBackdrop.addEventListener("click", closePreviewModal);
  
  modalCopyBtn.addEventListener("click", () => {
    if (currentActiveMockup) {
      copyMockupLink(currentActiveMockup);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && previewModal.classList.contains("active")) {
      closePreviewModal();
    }
  });

  // ------------------------------------------------------------
  // 7. СОБЫТИЯ ПОИСКА И СОРТИРОВКИ
  // ------------------------------------------------------------
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    clearSearchBtn.style.display = searchQuery ? "block" : "none";
    renderMockups();
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    clearSearchBtn.style.display = "none";
    renderMockups();
    searchInput.focus();
  });

  sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderMockups();
  });

  resetFiltersBtn.addEventListener("click", () => {
    currentCategory = "Все";
    searchQuery = "";
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    updateActiveCategoryButton();
    renderMockups();
  });

  // ------------------------------------------------------------
  // 8. ПРОВЕРКА HASH В URL (НАПРИМЕР: index.html#furniture-modern)
  // ------------------------------------------------------------
  function checkHashNavigation() {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const target = MOCKUPS_DATA.find(m => m.id === hash || m.folder === hash);
      if (target) {
        setTimeout(() => openPreviewModal(target), 300);
      }
    }
  }

  // Запуск
  renderCategories();
  renderMockups();
  checkHashNavigation();
});
