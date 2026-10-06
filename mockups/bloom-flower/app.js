(() => {
  const money = (n) => n.toLocaleString("ru-RU") + " ₽";
  let base = 190,
    count = 15,
    k = 1.35,
    extra = 0;
  const cart = [],
    price = document.getElementById("price"),
    badge = document.getElementById("countBadge");
  const cartBtn = document.getElementById("cartBtn"),
    dialog = document.getElementById("cartDialog");
  const flowerImages = [
    "assets/powder-rose.webp",
    "assets/peonies.webp",
    "assets/tulips.webp",
    "assets/eucalyptus.webp",
  ];
  function total() {
    return Math.round(base * count * k + 500 + extra);
  }
  function update() {
    price.textContent = money(total());
    badge.textContent = count;
  }
  function activate(selector, el) {
    document.querySelectorAll(selector).forEach((x) => {
      x.classList.toggle("on", x === el);
      x.setAttribute("aria-pressed", String(x === el));
    });
  }
  document.querySelectorAll(".flower").forEach(
    (b, i) =>
      (b.onclick = () => {
        activate(".flower", b);
        base = +b.dataset.price;
        update();
        const img = document.getElementById("bouquetImage");
        img.src = flowerImages[i];
        img.alt = "Букет: " + b.textContent;
      }),
  );
  document.querySelectorAll(".size").forEach(
    (b) =>
      (b.onclick = () => {
        activate(".size", b);
        count = +b.dataset.count;
        k = +b.dataset.k;
        update();
      }),
  );
  document.querySelectorAll(".pack").forEach(
    (b) =>
      (b.onclick = () => {
        activate(".pack", b);
        extra = +b.dataset.extra;
        update();
      }),
  );
  function renderCart() {
    cartBtn.textContent = "Корзина (" + cart.length + ")";
    const list = document.getElementById("bloomCartList");
    list.replaceChildren();
    if (!cart.length) {
      const p = document.createElement("p");
      p.className = "dialog-hint";
      p.textContent =
        "Пока здесь пусто. Выберите букет из коллекции или создайте свой.";
      list.append(p);
    }
    cart.forEach((item, i) => {
      const row = document.createElement("div");
      row.className = "dialog-item";
      const name = document.createElement("span");
      name.textContent = item.name;
      const right = document.createElement("span");
      right.textContent = money(item.price) + " ";
      const remove = document.createElement("button");
      remove.textContent = "×";
      remove.setAttribute("aria-label", "Убрать " + item.name);
      remove.onclick = () => {
        cart.splice(i, 1);
        renderCart();
      };
      right.append(remove);
      row.append(name, right);
      list.append(row);
    });
    document.getElementById("bloomCartTotal").textContent = money(
      cart.reduce((sum, x) => sum + x.price, 0),
    );
  }
  function add(name, value, button) {
    cart.push({ name, price: value });
    renderCart();
    const original = button.textContent;
    button.textContent = "✓";
    setTimeout(() => (button.textContent = original), 900);
  }
  document.getElementById("addBtn").onclick = function () {
    add(
      document.querySelector(".flower.on").textContent +
        " · " +
        count +
        " стеблей",
      total(),
      this,
    );
  };
  document
    .querySelectorAll(".product-add")
    .forEach(
      (b) => (b.onclick = () => add(b.dataset.name, +b.dataset.price, b)),
    );
  cartBtn.onclick = () => dialog.showModal();
  dialog.querySelector(".dialog-close").onclick = () => dialog.close();
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        dialog.close();
    }
  });
  function filter(value) {
    document.querySelectorAll(".filter").forEach((x) => {
      x.classList.toggle("active", x.dataset.filter === value);
      x.setAttribute("aria-pressed", String(x.dataset.filter === value));
    });
    document.querySelectorAll(".product").forEach((p) => {
      p.hidden = !(
        value === "all" ||
        p.dataset.cat === value ||
        (value === "seasonal" && p.dataset.seasonal === "true")
      );
    });
  }
  document
    .querySelectorAll(".filter")
    .forEach((b) => (b.onclick = () => filter(b.dataset.filter)));
  document
    .querySelectorAll("[data-category]")
    .forEach((a) =>
      a.addEventListener("click", () => filter(a.dataset.category)),
    );
  document
    .querySelectorAll(".option")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.classList.contains("on"))),
    );
  update();
  renderCart();
})();
