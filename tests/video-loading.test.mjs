import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const source = await readFile("src/components/cta-video.tsx", "utf8");
const config = await readFile("next.config.ts", "utf8");

test("CTA video loads near the CTA and never shows a blank box", () => {
  assert.match(source, /preload="none"/);
  assert.match(source, /new IntersectionObserver/);
  assert.match(source, /rootMargin: "1000px 0px"/);
  // The source is attached only once the viewer is near the CTA.
  assert.match(source, /\{active \? <source src=\{WEBM\}/);
  // A poster frame shows until then.
  assert.match(source, /poster=\{POSTER\}/);
  for (const attribute of ["muted", "loop", "autoPlay", "playsInline"]) assert.match(source, new RegExp(`\\n\\s+${attribute}\\n`));
});

test("CTA animation falls back to an animated WebP instead of blanking", () => {
  // WebKit cannot render a VP9 WebM's alpha channel; a failed video switches to the image too.
  assert.match(source, /needsAnimatedImage\(\)/);
  assert.match(source, /onError=\{\(\) => setMode\("image"\)\}/);
  assert.doesNotMatch(source, /removeAttribute\("src"\)/);
});

test("CTA media files exist and are cached for a year", () => {
  for (const name of source.matchAll(/"(\/media\/[^"]+)"/g)) assert.ok(existsSync(`public${name[1]}`), name[1]);
  assert.match(config, /source: '\/media\/:path\*'[\s\S]{0,200}max-age=31536000, immutable/);
});
