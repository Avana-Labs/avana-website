import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const globalFont = await readFile("src/app/site-fonts.ts", "utf8");
const brandFont = await readFile("src/app/[locale]/brand/brand-fonts.ts", "utf8");
const legalFont = await readFile("src/app/legal-font.ts", "utf8");
const globalCss = await readFile("src/app/globals.css", "utf8");

test("global font displays Diatype without flashing a system face and suppresses synthetic styles", () => {
  assert.match(globalFont, /ABCDiatypeVariable-Site-Trial\.woff2/);
  // 300 so 1x screens can draw the lighter weights; the face's top weight stays 600.
  assert.match(globalFont, /weight: "300 600"/);
  assert.match(globalFont, /display: "block"/);
  assert.doesNotMatch(globalFont, /preload: false/);
  assert.match(globalCss, /font-synthesis-weight: none/);
  assert.match(globalCss, /font-synthesis-style: none/);
});

test("only 1x screens lower the font weights, by 40 each", () => {
  const root = globalCss.match(/--fw-400: 400;\s*--fw-500: 500;\s*--fw-600: 600;/);
  assert.ok(root, "default weights are 400/500/600");
  const oneX = globalCss.match(/@media \(max-resolution: 1dppx\) \{\s*:root \{\s*--fw-400: 360;\s*--fw-500: 460;\s*--fw-600: 560;/);
  assert.ok(oneX, "1x screens use 360/460/560");
  assert.ok(oneX.index > root.index, "the 1x override comes after the defaults");
  assert.doesNotMatch(globalCss, /font-weight: [0-9]{3};/, "every font weight goes through --fw-*");
});

test("secondary font faces do not add a preload to legal or unrelated routes", () => {
  assert.match(brandFont, /preload: false/);
  assert.match(legalFont, /preload: false/);
});
