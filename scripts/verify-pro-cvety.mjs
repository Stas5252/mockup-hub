import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const base = process.env.MOCKUP_BASE_URL || "http://127.0.0.1:4173";
const browser = await puppeteer.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
  headless: true,
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  const response = await page.goto(`${base}/mockups/pro-cvety/`, {
    waitUntil: "networkidle0",
  });
  assert.equal(response.status(), 200, "Flower page must be available");
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewport({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth),
      width,
      `No horizontal overflow at ${width}px`,
    );
    assert.equal(await page.$$eval("main h1", (els) => els.length), 1);
    assert.ok((await page.$$eval(".work-card", (els) => els.length)) >= 3);
    await page.evaluate(async () => {
      document.querySelectorAll("img").forEach((img) => {
        img.loading = "eager";
      });
      await Promise.all(
        [...document.images].map((img) => img.decode().catch(() => {})),
      );
    });
    assert.equal(
      await page.$$eval("img", (imgs) =>
        imgs.every((img) => img.naturalWidth > 0),
      ),
      true,
      "All photographs load",
    );
    if (width === 360) {
      await page.click(".menu-toggle");
      assert.equal(
        await page.$eval(".menu-toggle", (e) =>
          e.getAttribute("aria-expanded"),
        ),
        "true",
      );
      await page.click(".nav-links a");
      assert.equal(
        await page.$eval(".menu-toggle", (e) =>
          e.getAttribute("aria-expanded"),
        ),
        "false",
      );
    }
    console.log(`PASS page layout and assets: ${width}px`);
  }
  await page.click('[data-slide="1"]');
  assert.match(await page.$eval(".hero-image", (e) => e.src), /work-1\.webp/);
  await page.click('[data-direction="-1"]');
  assert.match(await page.$eval(".hero-image", (e) => e.src), /hero\.webp/);
  assert.equal(
    await page.$eval('[data-slide="0"]', (e) => e.getAttribute("aria-pressed")),
    "true",
  );
  await page.click(".work-card");
  assert.match(
    await page.$eval('[name="message"]', (e) => e.value),
    /Нежные букеты/,
  );
  assert.equal(
    await page.$eval("#enquiry", (e) => e.checkValidity()),
    false,
    "Empty form must fail validation",
  );
  await page.type('[name="name"]', "Анна");
  await page.type('[name="phone"]', "+7 (999) 123-45-67");
  await page.click('[name="consent"]');
  assert.equal(await page.$eval("#enquiry", (e) => e.checkValidity()), true);
  await page.click('#enquiry button[type="submit"]');
  assert.match(
    await page.$eval("#form-status", (e) => e.textContent),
    /демонстрационн/,
  );
  await page.click(".privacy-link");
  assert.equal(await page.$eval("#privacy-dialog", (e) => e.open), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.$eval("#privacy-dialog", (e) => e.open), false);
  await page.goto(base, { waitUntil: "networkidle0" });
  await page.type("#searchInput", "Про Цветы");
  assert.equal(
    await page.$$eval(".mockup-card", (els) => els.length),
    1,
    "New mockup is searchable in catalogue",
  );
  assert.match(
    await page.$eval(".card-actions a", (e) => e.href),
    /mockups\/pro-cvety\//,
  );
  await page.goto(`${base}/viewer.html?site=pro-cvety`, {
    waitUntil: "networkidle0",
  });
  assert.match(
    await page.$eval("#viewerFrame", (e) => e.src),
    /mockups\/pro-cvety\//,
  );
  assert.deepEqual(errors, [], "No browser JavaScript errors");
  console.log(
    "PASS bouquet selection, form validation/demo, privacy dialog, catalogue and viewer",
  );
} finally {
  await browser.close();
}
