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

async function visit(width, fn) {
  const page = await browser.newPage();
  page.setDefaultTimeout(4000);
  try {
    await page.setViewport({ width, height: 900 });
    await page.goto(base, { waitUntil: "networkidle0" });
    await fn(page);
  } finally { await page.close(); }
}

test("mobile menu moves focus inside and Escape restores the trigger", async () => {
  await visit(390, async page => {
    const trigger = 'button[aria-controls="mobile-site-nav"]';
    await page.click(trigger);
    await page.waitForSelector('[role="dialog"][aria-hidden="false"], dialog[open]', { visible: true });
    assert.ok(await page.evaluate(() => document.activeElement?.closest('[role="dialog"],dialog')), "Focus stayed outside the modal");
    for (let i = 0; i < 16; i++) {
      await page.keyboard.press("Tab");
      assert.ok(await page.evaluate(() => document.activeElement?.closest('[role="dialog"],dialog')), "Tab escaped the modal");
    }
    await page.keyboard.press("Escape");
    await page.waitForFunction(sel => document.querySelector(sel)?.getAttribute("aria-expanded") === "false", {}, trigger);
    assert.equal(await page.$eval(trigger, el => el === document.activeElement), true);
    assert.notEqual(await page.evaluate(() => document.body.style.overflow), "hidden");
  });
});

test("closed mobile menu has no reachable links", async () => {
  await visit(390, async page => {
    const trigger = 'button[aria-controls="mobile-site-nav"]';
    await page.click(trigger);
    await page.waitForSelector('[role="dialog"][aria-hidden="false"], dialog[open]', { visible: true });
    await page.keyboard.press("Escape");
    await page.waitForFunction(sel => document.querySelector(sel)?.getAttribute("aria-expanded") === "false", {}, trigger);
    for (let i = 0; i < 18; i++) {
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => Boolean(document.activeElement?.closest("#mobile-site-nav"))), false);
    }
  });
});

test("language menu supports arrow keys and Escape", async () => {
  await visit(390, async page => {
    const trigger = '[data-framer-name="Navigation Mobile"] button[aria-haspopup="menu"]';
    await page.focus(trigger);
    await page.keyboard.press("ArrowDown");
    await page.waitForSelector('[role="menuitem"]:focus');
    await page.keyboard.press("End");
    assert.equal(await page.evaluate(() => document.activeElement?.textContent), "עברית");
    await page.keyboard.press("Escape");
    assert.equal(await page.$eval(trigger, el => el === document.activeElement && el.getAttribute("aria-expanded") === "false"), true);
  });
});

test("desktop navigation opens by keyboard and closes on Escape", async () => {
  await visit(1440, async page => {
    const trigger = 'button[aria-controls="desktop-menu-products"]';
    await page.focus(trigger);
    await page.keyboard.press("ArrowDown");
    await page.waitForFunction(() => document.activeElement?.closest("#desktop-menu-products"));
    await page.keyboard.press("Escape");
    await page.waitForFunction(sel => document.querySelector(sel)?.getAttribute("aria-expanded") === "false", {}, trigger);
    assert.equal(await page.$eval(trigger, el => el === document.activeElement), true);
  });
});

test("reduced motion does not download the decorative CTA video", async () => {
  await visit(390, async page => {
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await page.$eval("video", el => el.scrollIntoView({ block: "center" }));
    // Allow the intersection observer and React effects to settle across frames.
    await page.evaluate(() => new Promise(resolve => {
      let frames = 0;
      const tick = () => ++frames === 10 ? resolve() : requestAnimationFrame(tick);
      requestAnimationFrame(tick);
    }));
    assert.equal(await page.$eval("video", el => el.getAttribute("src")), null);
    assert.ok(await page.$eval("video", el => el.getAttribute("poster")));
  });
});
