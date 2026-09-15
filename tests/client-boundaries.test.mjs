import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile("src/components/hero-section.tsx", "utf8");

test("below-fold homepage FAQ is code-split at its client boundary", () => {
  assert.match(source, /dynamic\(\(\) => import\("@\/components\/homepage\/HomepageFaqSection"\)/);
  assert.doesNotMatch(source, /import HomepageFaqSection from "@\/components\/homepage\/HomepageFaqSection"/);
});
