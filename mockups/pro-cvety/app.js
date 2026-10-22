const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");
function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Открыть меню");
  navigation.classList.remove("open");
}
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  navigation.classList.toggle("open", open);
});
navigation
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
window.matchMedia("(min-width:701px)").addEventListener("change", closeMenu);

const slides = [
  {
    src: "assets/hero.webp",
    alt: "Нежный букет из розовых пионов, роз и белых орхидей",
    position: "",
  },
  {
    src: "assets/work-1.webp",
    alt: "Нежные пудровые розы в светлой упаковке",
    position: "center 45%",
  },
  {
    src: "assets/work-3.webp",
    alt: "Букет розовых пионов",
    position: "center 45%",
  },
];
const heroImage = document.querySelector(".hero-image");
let activeSlide = 0;
function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  heroImage.src = slides[activeSlide].src;
  heroImage.alt = slides[activeSlide].alt;
  heroImage.style.objectPosition = slides[activeSlide].position;
  document.querySelectorAll("[data-slide]").forEach((button) => {
    const active = Number(button.dataset.slide) === activeSlide;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}
document
  .querySelectorAll("[data-slide]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      showSlide(Number(button.dataset.slide)),
    ),
  );
document
  .querySelectorAll("[data-direction]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      showSlide(activeSlide + Number(button.dataset.direction)),
    ),
  );

const form = document.querySelector("#enquiry");
const formStatus = document.querySelector("#form-status");
document.querySelectorAll("[data-bouquet]").forEach((button) =>
  button.addEventListener("click", () => {
    form.elements.message.value = `Интересуют: ${button.dataset.bouquet}. `;
    formStatus.textContent = "";
    document
      .querySelector("#contact")
      .scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    form.elements.name.focus({ preventScroll: true });
  }),
);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  formStatus.textContent =
    "Спасибо! Это демонстрационная форма: данные не отправлены. Приём заявок будет доступен после подключения сайта.";
});
form.addEventListener("input", () => {
  formStatus.textContent = "";
});
const privacyDialog = document.querySelector("#privacy-dialog");
document
  .querySelector(".privacy-link")
  .addEventListener("click", () => privacyDialog.showModal());
privacyDialog
  .querySelector(".dialog-close")
  .addEventListener("click", () => privacyDialog.close());
privacyDialog.addEventListener("click", (event) => {
  if (event.target === privacyDialog) {
    const bounds = privacyDialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      privacyDialog.close();
  }
});
