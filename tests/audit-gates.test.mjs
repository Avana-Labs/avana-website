import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const sample = () => ({
  performance: 99, fcp: 1500, lcp: 1700, tbt: 50, cls: 0,
  jsTransferBytes: 190000, domSize: 700,
});

const valid = () => ({
  revision: "4ac86b6", profile: "mobile", throttlingMethod: "devtools", runs: 3,
  environment: { config: { formFactor: "mobile" } },
  expectedRoutes: ["/"],
  routes: [{ route: "/", runs: 3, ...sample(), samples: [sample(), sample(), sample()] }],
});

async function check(summary) {
  const dir = await mkdtemp(path.join(tmpdir(), "avana-audit-gate-"));
  try {
    await writeFile(path.join(dir, "summary.json"), JSON.stringify(summary));
    return spawnSync(process.execPath, ["scripts/check-lighthouse-budgets.mjs"], {
      encoding: "utf8", env: { ...process.env, LIGHTHOUSE_OUTPUT_DIR: dir },
    });
  } finally { await rm(dir, { recursive: true, force: true }); }
}

test("complete passing evidence is accepted", async () => {
  assert.equal((await check(valid())).status, 0);
});

for (const [name, corrupt] of [
  ["empty route list", s => { s.routes = []; }],
  ["missing LCP", s => { delete s.routes[0].lcp; }],
  ["null LCP", s => { s.routes[0].lcp = null; }],
  ["missing profile", s => { delete s.profile; }],
  ["missing throttling method", s => { delete s.throttlingMethod; }],
  ["incomplete route coverage", s => { s.expectedRoutes.push("/borrow"); }],
  ["duplicate routes", s => { s.routes.push({ ...s.routes[0] }); }],
  ["insufficient samples", s => { s.routes[0].runs = 1; }],
  ["missing raw samples", s => { delete s.routes[0].samples; }],
  ["empty raw samples", s => { s.routes[0].samples = []; }],
  ["failed raw run", s => { s.routes[0].samples[1].runtimeError = { code: "NO_FCP" }; }],
  ["mismatched environment profile", s => { s.environment.config.formFactor = "desktop"; }],
  ["actual budget failure", s => { s.routes[0].lcp = 9000; }],
]) {
  test(`rejects ${name}`, async () => {
    const summary = valid(); corrupt(summary);
    const result = await check(summary);
    assert.notEqual(result.status, 0, `false pass: ${result.stdout}`);
  });
}
