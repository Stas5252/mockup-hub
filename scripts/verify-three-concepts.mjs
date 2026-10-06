import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

// Run after `python -m http.server 3000` from the repository root.
const base = process.env.MOCKUP_BASE_URL || "http://127.0.0.1:3000";
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
const errors = [];
const page = await browser.newPage();
page.on("pageerror", (e) => errors.push(e.message));
const text = (selector) =>
  page.$eval(selector, (e) => e.textContent.replace(/\u00a0/g, " "));
async function click(selector) {
  await page.$eval(selector, (e) =>
    e.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await page.waitForFunction(
    (selector) => {
      const el = document.querySelector(selector);
      return (
        !el.closest(".reveal") || el.closest(".reveal").classList.contains("in")
      );
    },
    {},
    selector,
  );
  await page.locator(selector).setTimeout(10000).click();
}
async function open(site) {
  await page.goto(`${base}/mockups/${site}/`, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
}
try {
  for (const site of ["bloom-flower", "bite-club", "aeris-hotel"]) {
    for (const width of [360, 390, 768, 1440]) {
      await page.setViewport({ width, height: 900 });
      await open(site);
      const layout = await page.evaluate(() => ({
        width: innerWidth,
        document: document.documentElement.scrollWidth,
      }));
      assert.equal(
        layout.document,
        layout.width,
        `${site}: horizontal overflow at ${width}`,
      );
      for (
        let y = 0;
        y < (await page.evaluate(() => document.body.scrollHeight));
        y += 800
      ) {
        await page.evaluate(
          (y) => scrollTo({ top: y, behavior: "instant" }),
          y,
        );
        await new Promise((r) => setTimeout(r, 30));
      }
      await page.waitForFunction(() =>
        [...document.images].every((i) => i.complete && i.naturalWidth > 0),
      );
      if (width < 760) {
        await click(".nav-toggle");
        assert.equal(
          await page.$eval(".nav-toggle", (e) =>
            e.getAttribute("aria-expanded"),
          ),
          "true",
        );
        await click(".navlinks a");
        assert.equal(
          await page.$eval(".nav-toggle", (e) =>
            e.getAttribute("aria-expanded"),
          ),
          "false",
        );
      }
      console.log(`PASS layout/assets/navigation: ${site} ${width}px`);
    }
  }
  await page.setViewport({ width: 1440, height: 1000 });
  await open("bloom-flower");
  assert.equal(await text("#price"), "4 348 ₽");
  await click('.flower[data-price="260"]');
  await click('.size[data-count="25"]');
  await click('.pack[data-extra="900"]');
  assert.equal(await text("#price"), "12 775 ₽");
  await click("#addBtn");
  await click('.product-add[data-name="Powder Rose"]');
  await click("#cartBtn");
  assert.equal(await text("#bloomCartTotal"), "17 675 ₽");
  await click(".dialog-item button");
  assert.equal(await text("#bloomCartTotal"), "4 900 ₽");
  await page.keyboard.press("Escape");
  assert.equal(await page.$eval("#cartDialog", (e) => e.open), false);
  await click('.filter[data-filter="mono"]');
  assert.equal(await page.$$eval(".product:not([hidden])", (e) => e.length), 1);
  await click('.filter[data-filter="seasonal"]');
  assert.equal(await page.$$eval(".product:not([hidden])", (e) => e.length), 1);
  await click('.filter[data-filter="all"]');
  assert.equal(await page.$$eval(".product:not([hidden])", (e) => e.length), 3);
  console.log("PASS BLOOM: builder pricing, cart totals/removal, filters");

  await open("bite-club");
  await click('.add[data-name="Hot Honey"]');
  await click("#cartBtn");
  assert.equal(await text("#cartTotal"), "690 ₽");
  await click(".remove");
  assert.equal(await text("#cartTotal"), "0 ₽");
  await page.keyboard.press("Tab");
  assert.equal(
    await page.$eval("#drawer", (el) => el.contains(document.activeElement)),
    true,
    "Cart keeps keyboard focus after removing its final item",
  );
  await page.keyboard.press("Escape");
  assert.equal(await page.$eval("#drawer", (e) => e.inert), true);
  for (const name of ["Hot Honey", "Tokyo Burn", "Dirty Double"])
    await click(`.pick[data-name="${name}"]`);
  assert.equal(await text("#trayPrice"), "Комбо −12% · 1 602 ₽");
  await click('.pick[data-name="Red Devil"]');
  assert.equal(await text("#trayPrice"), "Комбо −12% · 1 602 ₽");
  await click("#tableAdd");
  assert.equal(await text("#cartTotal"), "1 602 ₽");
  await click("#close");
  await click('.filter[data-f="burger"]');
  assert.equal(await page.$$eval(".card:not(.hidden)", (e) => e.length), 1);
  await click("#spin");
  await page.waitForFunction(() => !document.getElementById("spin").disabled);
  assert.ok(
    [
      "Hot Honey",
      "Tokyo Burn",
      "Dirty Double",
      "Red Devil",
      "Salmon Club",
    ].includes(await text("#result")),
  );
  await click("#rouletteOrder");
  assert.equal(await text("#cartBtn"), "Корзина · 2");
  console.log(
    "PASS BITE: cart, filters, three-dish limit, −12% discount, roulette ordering",
  );

  await open("aeris-hotel");
  await click('.mood-btn[data-key="family"]');
  assert.equal(await text("#recTitle"), "Aeris House");
  assert.equal(await text("#recPrice"), "27 900 ₽");
  await page.$eval("#arrival", (el) => {
    el.value = "2026-12-12";
    el.dispatchEvent(new Event("change"));
  });
  await page.$eval("#departure", (el) => {
    el.value = "2026-12-15";
    el.dispatchEvent(new Event("change"));
  });
  await click("#book button");
  assert.equal(await text(".room-price b"), "38 700 ₽");
  await click(".room-book");
  assert.equal(await text("#bookingRoom"), "Dune Deluxe");
  assert.ok((await text("#bookingDetails")).includes("38 700 ₽ за 3 ночи"));
  await page.keyboard.press("Escape");
  await page.$eval("#arrival", (el) => {
    el.value = "2026-12-20";
    el.dispatchEvent(new Event("change"));
  });
  assert.equal(await page.$eval("#departure", (el) => el.value), "2026-12-21");
  await page.$eval("#arrival", (el) => {
    el.value = "";
    el.dispatchEvent(new Event("change"));
  });
  assert.equal(
    await page.$eval("#departure", (el) => el.hasAttribute("min")),
    false,
  );
  console.log(
    "PASS AERIS: mood selection, date search totals, room dialog, invalid-date correction",
  );

  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  for (const site of ["bloom-flower", "bite-club", "aeris-hotel"]) {
    await open(site);
    assert.equal(
      await page.$eval(".reveal", (el) => getComputedStyle(el).opacity),
      "1",
    );
    console.log(`PASS reduced motion: ${site}`);
  }
  assert.deepEqual(errors, [], "Browser JavaScript errors");
  console.log(
    "PASS: all three concepts verified; no browser JavaScript errors",
  );
} finally {
  await browser.close();
}
