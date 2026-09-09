/**
 * Verifies the machine-readable surface that makes the site agent-friendly:
 * homepage H1, llms.txt, OpenAPI spec, the public JSON API (including JSON 404s),
 * Markdown content negotiation, robots, and homepage metadata.
 *
 * Usage: BASE_URL=http://localhost:3000 node scripts/check-agent-readiness.mjs
 */
const BASE_URL = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

const results = [];
function check(name, condition, detail = "") {
  results.push({ name, ok: Boolean(condition), detail });
}

async function get(path, headers = {}) {
  const res = await fetch(`${BASE_URL}${path}`, { headers, redirect: "manual" });
  const body = await res.text();
  return { res, body };
}

// 1. Homepage: 200 with an <h1> in raw HTML.
{
  const { res, body } = await get("/");
  check("Homepage 200", res.status === 200, `status ${res.status}`);
  check("Homepage has <h1>", /<h1[\s>]/i.test(body));
  check("Homepage og:type", /property="og:type"/i.test(body));
  check("Homepage canonical", /rel="canonical"/i.test(body));
  check("Homepage <html lang>", /<html[^>]*\slang=/i.test(body));
  check("Homepage og:image", /property="og:image"/i.test(body));
}

// 2. llms.txt
{
  const { res, body } = await get("/llms.txt");
  check("llms.txt 200", res.status === 200, `status ${res.status}`);
  check("llms.txt has H1 title", /^#\s+Avana/m.test(body));
  check("llms.txt when-to-use section", /when to use/i.test(body));
}

// 3. OpenAPI spec
{
  const { res, body } = await get("/openapi.json");
  check("openapi.json 200", res.status === 200, `status ${res.status}`);
  check("openapi.json is application/json", (res.headers.get("content-type") || "").includes("application/json"));
  let spec = null;
  try { spec = JSON.parse(body); } catch { /* ignore */ }
  check("openapi.json parses", spec !== null);
  check("openapi.json has openapi version", spec?.openapi?.startsWith("3."));
  check("openapi.json has paths", spec && Object.keys(spec.paths || {}).length >= 3);
  const ops = spec ? Object.values(spec.paths).flatMap((p) => Object.values(p)) : [];
  check("every operation has operationId", ops.length > 0 && ops.every((o) => o.operationId));
  check("every operation has description", ops.length > 0 && ops.every((o) => o.description));
}

// 4. JSON API happy paths
{
  const { res, body } = await get("/api/health");
  const json = safeJson(body);
  check("/api/health 200", res.status === 200, `status ${res.status}`);
  check("/api/health status ok", json?.status === "ok");
}
{
  const { res, body } = await get("/api/protocols");
  const json = safeJson(body);
  check("/api/protocols 200", res.status === 200, `status ${res.status}`);
  check("/api/protocols returns list", json?.object === "list" && json?.count > 0);
  check("protocol has id + description fields", json?.data?.[0]?.id && json?.data?.[0]?.purpose);
}
{
  const { res, body } = await get("/api/protocols/uniswap-v3");
  const json = safeJson(body);
  check("/api/protocols/{id} 200", res.status === 200, `status ${res.status}`);
  check("/api/protocols/{id} correct id", json?.id === "uniswap-v3");
}

// 5. JSON error responses (structured)
{
  const { res, body } = await get("/api/protocols/does-not-exist");
  const json = safeJson(body);
  check("Unknown protocol -> 404", res.status === 404, `status ${res.status}`);
  check("Unknown protocol -> JSON error code+hint", json?.error?.code && json?.error?.hint);
}
{
  const { res, body } = await get("/api/definitely-not-a-route");
  const json = safeJson(body);
  check("Unknown API path -> 404", res.status === 404, `status ${res.status}`);
  check("Unknown API path -> JSON error", json?.error?.code === "endpoint_not_found");
}

// 6. Agent-friendly 404 for pages (real 404 status, not a 200 shell)
{
  const { res } = await get("/this-path-does-not-exist-xyz");
  check("Unknown page -> 404 status", res.status === 404, `status ${res.status}`);
}

// 7. Markdown content negotiation (acceptmarkdown.com)
{
  const { res, body } = await get("/", { Accept: "text/markdown" });
  const ct = res.headers.get("content-type") || "";
  const vary = res.headers.get("vary") || "";
  check("Markdown: homepage 200", res.status === 200, `status ${res.status}`);
  check("Markdown: content-type text/markdown", ct.includes("text/markdown"), ct);
  check("Markdown: Vary includes Accept", /accept/i.test(vary), vary);
  check("Markdown: body is markdown", /^#\s+/m.test(body));
}
{
  const { res, body } = await get("/no-such-page", { Accept: "text/markdown" });
  const ct = res.headers.get("content-type") || "";
  check("Markdown 404: status 404", res.status === 404, `status ${res.status}`);
  check("Markdown 404: text/markdown", ct.includes("text/markdown"), ct);
  check("Markdown 404: links to sitemap", /sitemap\.xml/.test(body));
}

// 8. robots + sitemap
{
  const { res, body } = await get("/robots.txt");
  check("robots.txt 200", res.status === 200, `status ${res.status}`);
  check("robots allows /openapi.json", /Allow:\s*\/openapi\.json/i.test(body), body.slice(0, 200));
}
{
  const { res } = await get("/sitemap.xml");
  check("sitemap.xml 200", res.status === 200, `status ${res.status}`);
}

function safeJson(text) {
  try { return JSON.parse(text); } catch { return null; }
}

const failures = results.filter((r) => !r.ok);
for (const r of results) {
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ""}`);
}
console.log(`\n${results.length - failures.length}/${results.length} checks passed.`);
if (failures.length > 0) {
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}
