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

const heroSelector = 'picture img[alt="Avana Express homepage hero interface"]';
const isHeroRequest = (url) => /avana-phone-hero|Avana%2520Express|Avana%20Express/.test(url);
const phoneHero = "avana-phone-hero";

async function openHome(width) {
  const page = await browser.newPage();
  const requests = [];
  await page.setCacheEnabled(false);
  await page.setViewport({ width, height: 1000 });
  page.on("request", (request) => {
    if (isHeroRequest(request.url())) requests.push(request.url());
  });
  await page.goto(`${base}/en`, { waitUntil: "networkidle0", timeout: 60000 });
  return { page, requests };
}

const visibleHeroes = (page) => page.$$eval(heroSelector, (images) => images
  .filter((img) => img.getBoundingClientRect().width > 0)
  .map((img) => img.currentSrc));

const phoneHeroShown = (page) => page.waitForFunction((selector, asset) => [...document.querySelectorAll(selector)].some(
  (img) => img.getBoundingClientRect().width > 0 && img.currentSrc.includes(asset) && img.complete && img.naturalWidth > 0,
), { timeout: 15000 }, heroSelector, phoneHero);

const lineFieldWidth = (page) => page.$eval("section canvas", (canvas) => canvas.getBoundingClientRect().width);

test("phones load only the phone hero image", async () => {
  const { page, requests } = await openHome(390);
  try {
    assert.equal(requests.length, 1, "a phone must download exactly one hero image");
    assert.ok(requests[0].includes(phoneHero));
    await phoneHeroShown(page);
    assert.equal(await lineFieldWidth(page), 0, "the line field is hidden on phones");
  } finally {
    await page.close();
  }
});

test("desktop shows the line field and downloads no hero image", async () => {
  const { page, requests } = await openHome(1440);
  try {
    assert.deepEqual(requests, [], "desktop must not download a hero image");
    assert.deepEqual(await visibleHeroes(page), []);
    assert.ok(await lineFieldWidth(page) > 0, "the line field fills the hero on desktop");
  } finally {
    await page.close();
  }
});

test("resizing between desktop and phone swaps the line field and the phone image", async () => {
  const { page } = await openHome(1440);
  try {
    await page.setViewport({ width: 390, height: 1000 });
    await phoneHeroShown(page);
    assert.equal(await lineFieldWidth(page), 0);
    await page.setViewport({ width: 1440, height: 1000 });
    await page.waitForFunction((selector) => [...document.querySelectorAll(selector)]
      .every((img) => img.getBoundingClientRect().width === 0), { timeout: 15000 }, heroSelector);
    assert.ok(await lineFieldWidth(page) > 0);
  } finally {
    await page.close();
  }
});
