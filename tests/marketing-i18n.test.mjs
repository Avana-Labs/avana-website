import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { localeCodes } from "../src/i18n/locales.ts";

const checker = path.resolve("scripts/check-marketing-i18n.mjs");

async function check(mutator = () => {}) {
  const root = await mkdtemp(path.join(tmpdir(), "avana-i18n-"));
  const catalogs = Object.fromEntries(localeCodes.map(locale => [locale, {
    example: { strings: ["A translated heading", "A translated description"] },
  }]));
  mutator(catalogs);
  try {
    await mkdir(path.join(root, "src"));
    await writeFile(path.join(root, "src/example.tsx"), '<LocalizedMarketing keys={["example"]} />');
    for (const [locale, catalog] of Object.entries(catalogs)) {
      await mkdir(path.join(root, "content", locale), { recursive: true });
      await writeFile(path.join(root, "content", locale, "marketing.json"), JSON.stringify(catalog));
    }
    return spawnSync(process.execPath, [checker], { cwd: root, encoding: "utf8" });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("complete marketing catalogs pass", async () => {
  const result = await check();
  assert.equal(result.status, 0, result.stderr);
});

for (const [name, corrupt] of [
  ["missing supported locale", c => { delete c.fr; }],
  ["null translation", c => { c.fr.example.strings[0] = null; }],
  ["empty translation", c => { c.fr.example.strings[0] = "  "; }],
  ["invalid source phrase", c => { c.en.example.strings[0] = 42; }],
  ["misaligned translation array", c => { c.fr.example.strings.pop(); }],
  ["missing group", c => { delete c.fr.example; }],
  ["stale locale group", c => { c.fr.removed = { strings: ["Old copy"] }; }],
]) {
  test(`rejects ${name}`, async () => {
    const result = await check(corrupt);
    assert.notEqual(result.status, 0, `false pass: ${result.stdout}`);
  });
}
