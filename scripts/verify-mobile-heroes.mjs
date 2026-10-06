import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
const base = process.env.MOCKUP_BASE_URL || "http://127.0.0.1:3000";
const browser = await puppeteer.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  for (const [width, height] of [
    [390, 620],
    [360, 540],
    [393, 660],
    [430, 720],
    [390, 844],
    [736, 360],
  ]) {
    await page.setViewport({ width, height, isMobile: true, hasTouch: true });
    await page.goto(`${base}/mockups/bite-club/`, {
      waitUntil: "networkidle0",
    });
    await page.evaluate(() => document.fonts.ready);
    if (process.env.CAPTURE_MOBILE)
      await page.screenshot({
        path: `/workspace/design-review/bite-mobile-${width}-${height}.png`,
      });
    for (const enlargedText of [false, true]) {
      if (enlargedText)
        await page.addStyleTag({
          content:
            ".hero p {font-size:17px !important} .hero-kicker {font-size:14px !important}",
        });
      const layout = await page.evaluate(() => {
        const rect = (s) => {
          const r = document.querySelector(s).getBoundingClientRect();
          return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
        };
        return {
          copy: rect(".hero-copy"),
          image: rect(".hero-visual img"),
          cta: rect(".hero-cta"),
          delivery: rect(".hero-bottom"),
          edition: rect(".hero-edition"),
          hero: rect(".hero"),
          width: innerWidth,
          scroll: document.documentElement.scrollWidth,
        };
      });
      const label = `${width}×${height}${enlargedText ? " enlarged text" : ""}`;
      assert.ok(
        layout.image.top >= layout.copy.bottom + 12,
        `${label}: burger covers the hero text (${layout.image.top.toFixed(1)} < ${layout.copy.bottom.toFixed(1)})`,
      );
      assert.ok(
        layout.delivery.top >= layout.image.bottom,
        `${label}: delivery text overlaps burger`,
      );
      assert.ok(
        layout.edition.top >= layout.delivery.bottom,
        `${label}: edition overlaps delivery text`,
      );
      assert.ok(
        layout.hero.bottom >= layout.edition.bottom,
        `${label}: hero clips its footer`,
      );
      assert.equal(
        layout.width,
        layout.scroll,
        `${label}: horizontal overflow`,
      );
      console.log(`PASS readable mobile hero: ${label}`);
    }
  }
  const flowerPage = await browser.newPage();
  await flowerPage.setViewport({ width: 360, height: 540 });
  await flowerPage.goto(`${base}/mockups/bloom-flower/`, {
    waitUntil: "networkidle0",
  });
  await flowerPage.evaluate(() => document.fonts.ready);
  const overlap = await flowerPage.evaluate(() => {
    const panel = document.querySelector(".hero-side").getBoundingClientRect();
    const edition = document
      .querySelector(".hero-index")
      .getBoundingClientRect();
    return (
      Math.min(panel.right, edition.right) >
        Math.max(panel.left, edition.left) &&
      Math.min(panel.bottom, edition.bottom) > Math.max(panel.top, edition.top)
    );
  });
  assert.equal(
    overlap,
    false,
    "BLOOM: edition label overlaps the mobile description panel",
  );
  console.log("PASS BLOOM: mobile description panel and edition stay separate");
} finally {
  await browser.close();
}
