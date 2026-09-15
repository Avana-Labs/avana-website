import { test } from "node:test";
import assert from "node:assert/strict";

const base = process.env.AUDIT_BASE_URL;
if (!base) throw new Error("Set AUDIT_BASE_URL to a production test server");

for (const query of ["", "?title=Avana&subtitle=Borrow", "?title=%E6%B5%8B%E8%AF%95", "?title=%3Cscript%3Ealert(1)%3C/script%3E"]) {
  test(`social image responds with a valid 1200x630 PNG: ${query || "default"}`, async () => {
    const response = await fetch(`${base}/og${query}`, { signal: AbortSignal.timeout(15000) });
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /^image\/png/);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.subarray(1, 4).toString(), "PNG");
    assert.equal(bytes.readUInt32BE(16), 1200);
    assert.equal(bytes.readUInt32BE(20), 630);
    assert.ok(bytes.length < 5_000_000, "Social preview exceeds 5 MB");
  });
}
