import { test } from "node:test";
import assert from "node:assert/strict";
import { importSource } from "./helpers/import-source.mjs";

const { organizationSchema, websiteSchema, serializeJsonLd } = importSource("src/lib/structured-data.ts");
const { SOCIAL_HANDLE } = importSource("src/lib/site.ts");

test("Avana metadata uses the same identity as the existing footer", () => {
  assert.equal(SOCIAL_HANDLE, "@avana_labs");
  assert.deepEqual(organizationSchema.sameAs, ["https://twitter.com/avana_labs", "https://github.com/Avana-Labs"]);
});

test("website schema does not advertise a nonexistent search endpoint", () => {
  assert.equal(websiteSchema.potentialAction, undefined);
});

test("JSON-LD cannot close its containing script", () => {
  const payload = { title: "</script><script>alert(1)</script>" };
  const serialized = serializeJsonLd(payload);
  assert.ok(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), payload);
});
