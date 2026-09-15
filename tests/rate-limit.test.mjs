import { test } from "node:test";
import assert from "node:assert/strict";
import { importSource } from "./helpers/import-source.mjs";

// Stub the response envelope so the limiter can be tested without the Next
// runtime; it echoes the arguments tooManyRequests passes.
const responseMock = {
  jsonError: (status, code, message, hint, init = {}) => ({
    status,
    code,
    message,
    hint,
    headers: init.headers ?? {},
  }),
};

const { rateLimit, clientKey, tooManyRequests, RATE_LIMITS, __resetRateLimitStore } = importSource(
  "src/lib/api/rate-limit.ts",
  { "@/lib/api/response": responseMock },
);

test("rateLimit allows up to the limit, then blocks within the window", () => {
  __resetRateLimitStore();
  const opts = { limit: 3, windowMs: 60_000, now: 1_000 };
  assert.equal(rateLimit("a", opts).ok, true);
  assert.equal(rateLimit("a", opts).ok, true);
  const last = rateLimit("a", opts);
  assert.equal(last.ok, true);
  assert.equal(last.remaining, 0);
  const blocked = rateLimit("a", opts);
  assert.equal(blocked.ok, false);
  assert.equal(blocked.remaining, 0);
  assert.ok(blocked.resetSeconds > 0 && blocked.resetSeconds <= 60);
});

test("rateLimit resets after the window elapses", () => {
  __resetRateLimitStore();
  assert.equal(rateLimit("b", { limit: 1, windowMs: 1_000, now: 0 }).ok, true);
  assert.equal(rateLimit("b", { limit: 1, windowMs: 1_000, now: 500 }).ok, false);
  assert.equal(rateLimit("b", { limit: 1, windowMs: 1_000, now: 1_000 }).ok, true);
});

test("rateLimit tracks each client key independently", () => {
  __resetRateLimitStore();
  const opts = { limit: 1, windowMs: 60_000, now: 0 };
  assert.equal(rateLimit("x", opts).ok, true);
  assert.equal(rateLimit("y", opts).ok, true);
  assert.equal(rateLimit("x", opts).ok, false);
});

test("named scopes keep independent counters for the same client", () => {
  __resetRateLimitStore();
  const client = "unknown";
  const md = { name: "md", limit: 1, windowMs: 60_000, now: 0 };
  const notFound = { name: "api-not-found", limit: 1, windowMs: 60_000, now: 0 };
  assert.equal(rateLimit(client, md).ok, true);
  // Exhausting `md` must not consume the `api-not-found` budget.
  assert.equal(rateLimit(client, notFound).ok, true);
  assert.equal(rateLimit(client, md).ok, false);
  assert.equal(rateLimit(client, notFound).ok, false);
});

test("clientKey prefers x-forwarded-for, then x-real-ip, then unknown", () => {
  const forwarded = new Request("https://avana.cc/api/md", {
    headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
  });
  assert.equal(clientKey(forwarded), "1.2.3.4");
  const real = new Request("https://avana.cc/api/md", { headers: { "x-real-ip": "9.9.9.9" } });
  assert.equal(clientKey(real), "9.9.9.9");
  assert.equal(clientKey(new Request("https://avana.cc/api/md")), "unknown");
});

test("tooManyRequests returns a structured 429 with rate-limit headers", () => {
  const res = tooManyRequests({ ok: false, limit: 30, remaining: 0, resetSeconds: 42 });
  assert.equal(res.status, 429);
  assert.equal(res.code, "rate_limited");
  assert.equal(res.headers["Retry-After"], "42");
  assert.equal(res.headers["RateLimit-Limit"], "30");
  assert.equal(res.headers["RateLimit-Remaining"], "0");
  assert.equal(res.headers["RateLimit-Reset"], "42");
});

test("configured route limits are sane", () => {
  assert.ok(RATE_LIMITS.markdown.limit >= RATE_LIMITS.apiNotFound.limit);
  assert.equal(RATE_LIMITS.markdown.windowMs, 60_000);
  assert.equal(RATE_LIMITS.apiNotFound.windowMs, 60_000);
});
