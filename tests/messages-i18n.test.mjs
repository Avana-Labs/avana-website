import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { localeCodes } from "../src/i18n/locales.ts";

const checker = path.resolve("scripts/check-messages-i18n.mjs");

async function check(mutator = () => {}) {
  const root = await mkdtemp(path.join(tmpdir(), "avana-messages-"));
  const catalogs = Object.fromEntries(localeCodes.map(locale => [locale, {
    pricing: { heading: "Pricing" }, common: { close: "Close" },
  }]));
  mutator(catalogs);
  try {
    await mkdir(path.join(root, "messages"));
    for (const [locale, catalog] of Object.entries(catalogs)) {
      await writeFile(path.join(root, "messages", `${locale}.json`), JSON.stringify(catalog));
    }
    return spawnSync(process.execPath, [checker], { cwd: root, encoding: "utf8" });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("complete UI message catalogs pass", async () => {
  const result = await check();
  assert.equal(result.status, 0, result.stderr);
});

for (const [name, corrupt] of [
  ["missing UI locale", c => { delete c.fr; }],
  ["null UI message", c => { c.fr.pricing.heading = null; }],
  ["blank UI message", c => { c.fr.pricing.heading = " "; }],
  ["missing non-pricing namespace", c => { delete c.fr.common; }],
]) {
  test(`rejects ${name}`, async () => {
    const result = await check(corrupt);
    assert.notEqual(result.status, 0, `false pass: ${result.stdout}`);
  });
}
