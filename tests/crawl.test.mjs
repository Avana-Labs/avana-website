import { test } from "node:test";
import assert from "node:assert/strict";
import { importSource } from "./helpers/import-source.mjs";

const { default: sitemap } = importSource("src/app/sitemap.ts");
const { default: robots } = importSource("src/app/robots.ts", { next: {} });
const { localeCodes } = importSource("src/i18n/locales.ts");
const { publicPagePaths } = importSource("src/lib/public-routes.ts");

test("sitemap contains every public page exactly once", () => {
  const entries = sitemap();
  const paths = entries.map((entry) => new URL(entry.url).pathname);

  assert.equal(new Set(paths).size, paths.length);
  assert.equal(new Set(paths).size, publicPagePaths.size);
  for (const path of paths) assert.ok(publicPagePaths.has(path));

  for (const entry of entries) {
    const languages = entry.alternates?.languages ?? {};
    assert.equal(Object.keys(languages).length, localeCodes.length + 1);
    assert.equal(languages["x-default"], entry.url);
    for (const locale of localeCodes) assert.ok(languages[locale]);
  }
});

test("robots keeps public machine-readable resources crawlable", () => {
  const result = robots();
  const standardRules = result.rules.find((rule) => rule.userAgent === "*");
  assert.ok(standardRules);
  assert.ok(standardRules.allow.includes("/openapi.json"));
  assert.ok(standardRules.allow.includes("/api/protocols"));
  assert.ok(standardRules.disallow.includes("/api/"));
  assert.equal(result.sitemap, "https://avana.cc/sitemap.xml");
});
