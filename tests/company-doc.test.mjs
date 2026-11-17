import { test } from "node:test";
import assert from "node:assert/strict";
import { importSource } from "./helpers/import-source.mjs";

const { companyDocUrl, companyDocResponse } = importSource("src/lib/company-doc.ts");

const ok = (text) => async () => ({ ok: true, text: async () => text });

test("companyDocUrl accepts only an https URL", () => {
  assert.equal(companyDocUrl(undefined), undefined);
  assert.equal(companyDocUrl(""), undefined);
  assert.equal(companyDocUrl("not a url"), undefined);
  assert.equal(companyDocUrl("http://example.com/company.md"), undefined);
  assert.equal(companyDocUrl("https://example.com/company.md")?.href, "https://example.com/company.md");
});

test("the document is served as plain text, unlisted", async () => {
  const r = await companyDocResponse("https://example.com/company.md", ok("# Avana\n"));
  assert.equal(r.status, 200);
  assert.equal(r.body, "# Avana\n");
  assert.equal(r.headers["Content-Type"], "text/plain; charset=utf-8");
  assert.match(r.headers["X-Robots-Tag"], /noindex/);
  assert.match(r.headers["Cache-Control"], /s-maxage=300/);
});

test("no configured document is a 404; a storage failure is an uncached 502", async () => {
  const missing = await companyDocResponse(undefined, ok("x"));
  assert.equal(missing.status, 404);
  const failed = await companyDocResponse("https://example.com/company.md", async () => ({ ok: false, text: async () => "" }));
  assert.equal(failed.status, 502);
  assert.equal(failed.headers["Cache-Control"], "no-store");
  const thrown = await companyDocResponse("https://example.com/company.md", async () => {
    throw new Error("network");
  });
  assert.equal(thrown.status, 502);
});
