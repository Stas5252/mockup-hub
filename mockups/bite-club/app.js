(() => {
  const money = (n) => n.toLocaleString("ru-RU") + " ₽";
  const cart = [],
    tray = [];
  const drawer = document.getElementById("drawer"),
    cartBtn = document.getElementById("cartBtn"),
    backdrop = document.getElementById("backdrop");
  function renderCart() {
    cartBtn.textContent = "Корзина · " + cart.length;
    document.getElementById("cartTotal").textContent = money(
      cart.reduce((s, x) => s + x.price, 0),
    );
    const list = document.getElementById("cartList");
    list.replaceChildren();
    if (!cart.length) {
      const p = document.createElement("p");
      p.textContent = "Пока пусто. Самое время выбрать первый bite.";
      p.style.cssText = "font-size:12px;line-height:1.8;margin-top:24px";
      list.append(p);
    }
    cart.forEach((item, i) => {
      const row = document.createElement("div");
      row.className = "cart-item";
      const name = document.createElement("span");
      name.textContent = item.name;
      const price = document.createElement("b");
      price.textContent = money(item.price);
      const remove = document.createElement("button");
      remove.className = "remove";
      remove.textContent = "×";
      remove.setAttribute("aria-label", "Убрать " + item.name);
      remove.onclick = () => {
        cart.splice(i, 1);
        renderCart();
        const remaining = drawer.querySelectorAll(".remove");
        const next = remaining[Math.min(i, remaining.length - 1)];
        (next || document.getElementById("close")).focus();
      };
      row.append(name, price, remove);
      list.append(row);
    });
  }
  function add(name, price, b) {
    cart.push({ name, price });
    renderCart();
    if (b) {
      const original = b.textContent;
      b.textContent = "✓";
      setTimeout(() => (b.textContent = original), 800);
    }
  }
  function close() {
    drawer.classList.remove("open");
    drawer.inert = true;
    backdrop.hidden = true;
    document.body.style.overflow = "";
    cartBtn.focus();
  }
  function open() {
    drawer.inert = false;
    drawer.classList.add("open");
    backdrop.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("close").focus();
  }
  cartBtn.onclick = open;
  document.getElementById("close").onclick = close;
  backdrop.onclick = close;
  addEventListener("keydown", (e) => {
    if (!drawer.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "Tab") {
      const items = [...drawer.querySelectorAll("button")],
        first = items[0],
        last = items[items.length - 1];
      if (!drawer.contains(document.activeElement)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  document
    .querySelectorAll(".add")
    .forEach(
      (b) => (b.onclick = () => add(b.dataset.name, +b.dataset.price, b)),
    );
  document.querySelectorAll(".filter").forEach(
    (b) =>
      (b.onclick = () => {
        document.querySelectorAll(".filter").forEach((x) => {
          x.classList.toggle("active", x === b);
          x.setAttribute("aria-pressed", String(x === b));
        });
        document
          .querySelectorAll(".card")
          .forEach((c) =>
            c.classList.toggle(
              "hidden",
              b.dataset.f !== "all" && c.dataset.cat !== b.dataset.f,
            ),
          );
      }),
  );
  function trayTotal() {
    const sum = tray.reduce((s, x) => s + x.price, 0);
    return tray.length === 3 ? Math.round(sum * 0.88) : sum;
  }
  function renderTray() {
    for (let i = 0; i < 3; i++) {
      const slot = document.getElementById("slot" + i);
      slot.replaceChildren();
      slot.classList.toggle("empty", !tray[i]);
      if (tray[i]) {
        const img = document.createElement("img");
        img.src = tray[i].img;
        img.alt = tray[i].name;
        slot.append(img);
      }
    }
    document.getElementById("trayPrice").textContent =
      (tray.length === 3 ? "Комбо −12% · " : "Ваш стол · ") +
      money(trayTotal());
    document.getElementById("tableAdd").disabled = !tray.length;
  }
  document.querySelectorAll(".pick").forEach(
    (b) =>
      (b.onclick = () => {
        const i = tray.findIndex((x) => x.name === b.dataset.name);
        if (i > -1) {
          tray.splice(i, 1);
          b.classList.remove("on");
        } else if (tray.length < 3) {
          tray.push({
            name: b.dataset.name,
            price: +b.dataset.price,
            img: b.dataset.img,
          });
          b.classList.add("on");
        }
        document
          .querySelectorAll(".pick")
          .forEach((x) =>
            x.setAttribute("aria-pressed", String(x.classList.contains("on"))),
          );
        renderTray();
      }),
  );
  document.getElementById("tableAdd").onclick = () => {
    add("Стол: " + tray.map((x) => x.name).join(" / "), trayTotal());
    open();
  };
  const foods = [...document.querySelectorAll(".add")].map((b) => ({
    name: b.dataset.name,
    price: +b.dataset.price,
  }));
  const spin = document.getElementById("spin"),
    result = document.getElementById("result"),
    order = document.getElementById("rouletteOrder");
  let selected = null;
  spin.onclick = () => {
    spin.disabled = true;
    order.hidden = true;
    document.querySelector(".wheel").classList.add("spinning");
    let n = 0;
    const timer = setInterval(
      () => {
        selected = foods[Math.floor(Math.random() * foods.length)];
        result.textContent = selected.name;
        if (++n >= 16) {
          clearInterval(timer);
          spin.disabled = false;
          document.querySelector(".wheel").classList.remove("spinning");
          order.textContent = "Добавить · " + money(selected.price);
          order.hidden = false;
        }
      },
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 65,
    );
  };
  order.onclick = () => {
    if (selected) add(selected.name, selected.price, order);
  };
  drawer.inert = true;
  renderCart();
  renderTray();
})();
