import { test } from "node:test";
import assert from "node:assert/strict";
import { metric, reportMetrics } from "../scripts/lib/lighthouse-metrics.mjs";

const baseReport = () => ({
  categories: {
    performance: { score: 0.98 },
    accessibility: { score: 1 },
    "best-practices": { score: 0.99 },
    seo: { score: 1 },
  },
  audits: {
    "first-contentful-paint": { numericValue: 1200 },
    "largest-contentful-paint": { numericValue: 1500 },
    "total-blocking-time": { numericValue: 40 },
    "cumulative-layout-shift": { numericValue: 0.01 },
    "mainthread-work-breakdown": { numericValue: 600 },
    "network-requests": { details: { items: [
      { resourceType: "Script", transferSize: 100 },
      { resourceType: "Image", transferSize: 200 },
    ] } },
  },
});

test("supports the current Lighthouse DOM size insight audit", () => {
  const report = baseReport();
  report.audits["dom-size-insight"] = { details: { debugData: { totalElements: 842 } } };
  assert.equal(metric(report, "dom-size"), 842);
  assert.equal(reportMetrics(report).domSize, 842);
});

test("continues to support the legacy DOM size audit", () => {
  const report = baseReport();
  report.audits["dom-size"] = { numericValue: 700 };
  assert.equal(metric(report, "dom-size"), 700);
});

test("fails when a required Lighthouse metric is unavailable", () => {
  assert.throws(() => metric(baseReport(), "dom-size"), /Missing metric dom-size/);
});
