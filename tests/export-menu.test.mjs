import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile("src/components/llm-export-menu.tsx", "utf8");

test("copy page menu stays inside the mobile viewport", () => {
  assert.match(source, /relative w-fit max-w-full self-start/);
  assert.match(source, /left-0 right-auto[^\"]*w-\[min\(16\.5rem,calc\(100vw-2rem\)\)\]/);
  assert.match(source, /sm:left-auto sm:right-0/);
});
