import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { launch } from "chrome-launcher";
import puppeteer from "puppeteer-core";

const base = process.env.AUDIT_BASE_URL;
if (!base) throw new Error("Set AUDIT_BASE_URL to a production test server");

let chrome;
let browser;

before(async () => {
  chrome = await launch({ chromeFlags: ["--headless", "--no-sandbox"] });
  browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${chrome.port}` });
});

after(async () => {
  browser?.disconnect();
  await chrome?.kill();
});

for (const [locale, width] of [["en", 390], ["en", 768], ["en", 1440], ["de", 390], ["ja", 768]]) {
  test(`${locale} borrow has no horizontal overflow at ${width}px`, async () => {
    const page = await browser.newPage();
    try {
      await page.setViewport({ width, height: 900 });
      await page.goto(`${base}/${locale}/borrow`, { waitUntil: "domcontentloaded", timeout: 15000 });
      await page.waitForSelector("main", { visible: true });
      const result = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        clippedHeadings: [...document.querySelectorAll("h1, h2, h3")].filter(element => {
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && rect.right > document.documentElement.clientWidth + 1;
        }).length,
      }));
      assert.ok(result.scrollWidth <= result.clientWidth + 1, `horizontal overflow: ${JSON.stringify(result)}`);
      assert.equal(result.clippedHeadings, 0, `clipped heading: ${JSON.stringify(result)}`);
    } finally {
      await page.close();
    }
  });
}
