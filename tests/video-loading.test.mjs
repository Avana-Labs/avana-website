import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile("src/components/cta-video.tsx", "utf8");

test("CTA video restores its preloaded-near-CTA animation behavior", () => {
  assert.match(source, /preload="none"/);
  assert.match(source, /new IntersectionObserver/);
  assert.match(source, /rootMargin: "1000px 0px"/);
  assert.match(source, /src=\{active \? "\/Avana-Transparent\.webm" : undefined\}/);
  assert.doesNotMatch(source, /poster=/);
});
