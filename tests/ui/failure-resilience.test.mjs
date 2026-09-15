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

test("core content remains usable when optional media fails", async () => {
  const page = await browser.newPage();
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  await page.setRequestInterception(true);
  page.on("request", request => {
    if (request.resourceType() === "media" || /\.webm(?:$|\?)/.test(request.url())) {
      request.abort("failed");
    } else {
      request.continue();
    }
  });

  try {
    await page.goto(`${base}/en`, { waitUntil: "networkidle0" });
    assert.ok(await page.$("main"), "main landmark disappeared");
    assert.ok(await page.$eval("h1", element => element.textContent?.trim()), "hero heading disappeared");
    assert.deepEqual(pageErrors, [], `page errors after optional media failure: ${pageErrors.join("; ")}`);
  } finally {
    await page.close();
  }
});
