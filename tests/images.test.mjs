import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const heroSource = await readFile("src/components/feature-page-hero.tsx", "utf8");

test("feature hero images use layout-aware responsive sizes", () => {
  assert.match(heroSource, /sizes="\(min-width: 1280px\) 420px, \(min-width: 640px\) 50vw, 100vw"/);
  assert.doesNotMatch(heroSource, /sizes="100vw"/);
});
