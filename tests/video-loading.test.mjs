import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile("src/components/cta-video.tsx", "utf8");

test("CTA video defers transfer until visible and playable", () => {
  assert.match(source, /preload="none"/);
  assert.match(source, /if \(isActive && !saveData\)/);
  assert.match(source, /poster="\/images\/avana-wordmark\.webp"/);
  assert.doesNotMatch(source, /src="\/Avana-Transparent\.webm"/);
});
