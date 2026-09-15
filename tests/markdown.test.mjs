import { test } from "node:test";
import assert from "node:assert/strict";
import { importSource } from "./helpers/import-source.mjs";

const { acceptsMarkdown, getMarkdownForPath } = importSource("src/lib/api/markdown.ts");

test("Markdown negotiation honors media type quality", () => {
  assert.equal(acceptsMarkdown("text/markdown"), true);
  assert.equal(acceptsMarkdown("text/html, text/markdown;q=0.8"), true);
  assert.equal(acceptsMarkdown("text/markdown;q=0"), false);
  assert.equal(acceptsMarkdown("text/html, */*;q=0.5"), false);
});

test("Markdown serves only registered public pages", () => {
  assert.equal(getMarkdownForPath("/pricing").status, 200);
  assert.equal(getMarkdownForPath("/de/pricing/").status, 200);
  assert.equal(getMarkdownForPath("/developers/integrations").status, 200);
});

test("Markdown returns 404 for unknown nested pages", () => {
  const result = getMarkdownForPath("/borrow/does-not-exist");
  assert.equal(result.status, 404);
  assert.match(result.body, /Page not found/);
});
