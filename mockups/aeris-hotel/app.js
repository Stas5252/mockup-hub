(() => {
  const rooms = {
    quiet: {
      title: "Dune Deluxe",
      note: "тихий сад · терраса · тишина",
      price: 12900,
      img: "assets/dune-deluxe.webp",
    },
    spa: {
      title: "Sea Suite",
      note: "ванна · доступ в spa · вид на море",
      price: 18400,
      img: "assets/sea-suite.webp",
    },
    romance: {
      title: "Sunset Suite",
      note: "закат · ванна · завтрак в номере",
      price: 21900,
      img: "assets/photo-1566665797739-1674de7a421a.jpg",
    },
    family: {
      title: "Aeris House",
      note: "две спальни · терраса · кухня",
      price: 27900,
      img: "assets/photo-1600607687920-4e2a09cf159d.jpg",
    },
  };
  const money = (n) => n.toLocaleString("ru-RU") + " ₽";
  const nightWord = (n) =>
    n % 100 >= 11 && n % 100 <= 14
      ? "ночей"
      : n % 10 === 1
        ? "ночь"
        : n % 10 >= 2 && n % 10 <= 4
          ? "ночи"
          : "ночей";
  document.querySelectorAll(".mood-btn").forEach(
    (b) =>
      (b.onclick = () => {
        document.querySelectorAll(".mood-btn").forEach((x) => {
          x.classList.toggle("on", x === b);
          x.setAttribute("aria-pressed", String(x === b));
        });
        const r = rooms[b.dataset.key],
          img = document.getElementById("recImg");
        img.src = r.img;
        img.alt = r.title;
        document.getElementById("recTitle").textContent = r.title;
        document.getElementById("recNote").textContent = r.note;
        document.getElementById("recPrice").textContent = money(r.price);
      }),
  );
  const form = document.getElementById("book"),
    arrival = document.getElementById("arrival"),
    departure = document.getElementById("departure");
  const iso = (date) =>
    new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  arrival.min = iso(today);
  if (new Date(arrival.value) < today) {
    arrival.value = iso(today);
    const end = new Date(today);
    end.setDate(end.getDate() + 3);
    departure.value = iso(end);
  }
  function syncDates() {
    const next = new Date(arrival.value + "T12:00:00");
    if (!arrival.value || !Number.isFinite(next.getTime())) {
      departure.removeAttribute("min");
      return;
    }
    next.setDate(next.getDate() + 1);
    departure.min = iso(next);
    if (departure.value <= arrival.value) departure.value = departure.min;
  }
  arrival.addEventListener("change", syncDates);
  syncDates();
  let toastTimer;
  function toast(text) {
    const el = document.getElementById("toast");
    el.textContent = text;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 3500);
  }
  let searched = false,
    nights = 3;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    if (departure.value <= arrival.value) {
      departure.setCustomValidity("Выберите дату после заезда");
      departure.reportValidity();
      departure.setCustomValidity("");
      return;
    }
    nights = Math.round(
      (Date.parse(departure.value) - Date.parse(arrival.value)) / 86400000,
    );
    searched = true;
    document.getElementById("bookingSummary").textContent =
      arrival.value.split("-").reverse().join(".") +
      " — " +
      departure.value.split("-").reverse().join(".") +
      " · " +
      nights +
      " " +
      nightWord(nights) +
      " · " +
      document.getElementById("guests").selectedOptions[0].textContent;
    document.querySelectorAll(".room").forEach((room) => {
      room.querySelector(".room-price b").textContent = money(
        +room.dataset.price * nights,
      );
      room.querySelector(".rate-label").textContent =
        "за " + nights + " " + nightWord(nights);
    });
    document.getElementById("rooms").scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
    toast("Показаны варианты проживания на выбранные даты");
  });
  const dialog = document.getElementById("bookingDialog");
  document.querySelectorAll(".room-book").forEach(
    (b) =>
      (b.onclick = () => {
        const room = b.closest(".room");
        document.getElementById("bookingRoom").textContent =
          room.querySelector(".room-name").textContent;
        document.getElementById("bookingDetails").textContent =
          money(+room.dataset.price * (searched ? nights : 1)) +
          (searched ? " за " + nights + " " + nightWord(nights) : " за ночь") +
          " · " +
          room.querySelector(".room-meta").textContent;
        document.getElementById("bookingRequest").reset();
        dialog.showModal();
      }),
  );
  dialog.querySelector(".dialog-close").onclick = () => dialog.close();
  document.getElementById("bookingRequest").onsubmit = (e) => {
    e.preventDefault();
    dialog.close();
    toast("Спасибо! Это демонстрация бронирования: заявка не отправлена.");
  };
})();
