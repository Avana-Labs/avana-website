import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile("next.config.ts", "utf8");

test("security policy keeps connections and media same-origin", () => {
  assert.match(source, /connect-src 'self'/);
  assert.match(source, /media-src 'self'/);
  assert.match(source, /font-src 'self' data:/);
  assert.doesNotMatch(source, /connect-src 'self' https:/);
  assert.doesNotMatch(source, /media-src 'self' https:\/\/cdn-front\.freepik\.com/);
});

test("static machine-readable routes have explicit shared-cache policy", () => {
  assert.match(source, /source: '\/og'[\s\S]*?max-age=86400/);
  assert.match(source, /source: '\/sitemap\.xml'[\s\S]*?max-age=3600/);
  assert.match(source, /source: '\/robots\.txt'[\s\S]*?max-age=3600/);
});
