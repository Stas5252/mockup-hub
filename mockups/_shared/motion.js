(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced) {
    document.body.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }
  const nav = document.querySelector(".nav"),
    links = document.querySelector(".navlinks");
  if (nav && links) {
    links.id = "navigation";
    const toggle = document.createElement("button");
    toggle.className = "nav-toggle";
    toggle.type = "button";
    toggle.textContent = "☰";
    toggle.setAttribute("aria-label", "Открыть меню");
    toggle.setAttribute("aria-controls", "navigation");
    toggle.setAttribute("aria-expanded", "false");
    nav.append(toggle);
    function close() {
      document.body.classList.remove("nav-menu-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Открыть меню");
      toggle.textContent = "☰";
    }
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-menu-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
      toggle.textContent = open ? "×" : "☰";
    });
    links.addEventListener("click", close);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
    window.addEventListener("resize", () => {
      if (innerWidth > 760) close();
    });
  }
  const progress = document.createElement("div");
  progress.className = "progress";
  document.body.append(progress);
  const hero = document.querySelector(".hero"),
    media = document.querySelector("[data-parallax]");
  let pending = false;
  function paint() {
    const y = window.scrollY,
      height = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${height > 0 ? y / height : 0})`;
    if (media && hero && !reduced && y < hero.offsetHeight)
      media.style.transform = `translateY(${Math.min(y * 0.12, 110)}px) scale(1.07)`;
    pending = false;
  }
  addEventListener(
    "scroll",
    () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(paint);
      }
    },
    { passive: true },
  );
  paint();
  document.querySelectorAll("img").forEach((img) => {
    if (!img.closest(".hero")) img.loading = "lazy";
    img.decoding = "async";
  });
})();
