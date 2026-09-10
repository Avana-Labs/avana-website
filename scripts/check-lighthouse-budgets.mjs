import { readFile } from "node:fs/promises";
import path from "node:path";

const OUTPUT_DIR = path.resolve(process.env.LIGHTHOUSE_OUTPUT_DIR ?? ".lighthouse");

/**
 * Thresholds are calibrated against `throttlingMethod: "devtools"` (see
 * run-lighthouse.mjs), i.e. observed paints under applied network and CPU
 * throttling -- not Lantern's simulation of them.
 *
 * This matters: the previous thresholds were set against simulated runs, which
 * reported TBT of 16-20ms where applied throttling measured 46-331ms on the
 * same build. The gate was green on a number nothing had timed.
 *
 * Observed on 6b7b19a (median of 3 runs/route, local `next start`):
 *   performance 98-99   fcp 1599-1732ms   lcp 1599-1732ms
 *   tbt 36-103ms        cls 0             js 171-195 KiB
 *
 * Headroom is deliberately wide. Applied throttling normalises the network but
 * layers a 4x CPU slowdown on top of whatever the host provides, so a loaded CI
 * runner scores materially worse than a developer laptop. These are regression
 * alarms, not targets -- tighten them only against numbers from the machine
 * that will actually enforce them.
 */
const BUDGETS = {
  performance: 85,
  fcp: 2_200,
  lcp: 2_600,
  tbt: 250,
  cls: 0.05,
  jsTransferBytes: 215_000,
};

const DOM_BUDGETS = {
  default: 1_000,
  "/multiply": 1_500,
};

/**
 * `/terms` reports CLS ~0.231 only when the audit runs all four categories: the
 * accessibility pass interacts with the page, and the late font swap reflows a
 * text block within that window. The underlying shift carries
 * `had_recent_input=true`, so Chrome excludes it from real-user CLS, and a
 * performance-only run of the same build scores 0.000. /privacy and /faq record
 * no shift events at all.
 *
 * Tracked as a measurement artifact rather than silently relaxing the global
 * CLS gate. Revisit if the shift ever appears without `had_recent_input`.
 */
const CLS_BUDGETS = {
  default: BUDGETS.cls,
  "/terms": 0.3,
};

const PERFORMANCE_BUDGETS = {
  default: BUDGETS.performance,
  "/terms": 80, // depressed by the CLS artifact documented above
};

const summary = JSON.parse(await readFile(path.join(OUTPUT_DIR, "summary.json"), "utf8"));

// A summary produced by simulated throttling cannot be judged against these
// thresholds. Fail loudly rather than reporting a meaningless pass.
if (summary.throttlingMethod && summary.throttlingMethod !== "devtools") {
  console.error(
    `Refusing to check budgets: summary.json was produced with "${summary.throttlingMethod}" throttling, ` +
      `but these thresholds are calibrated for "devtools". Re-run \`npm run lighthouse:audit\`.`,
  );
  process.exit(1);
}

if (!summary.throttlingMethod) {
  console.warn(
    "Warning: summary.json predates throttling-method recording. Re-run the audit to confirm it used applied throttling.",
  );
}

const failures = [];

for (const result of summary.routes) {
  const domBudget = DOM_BUDGETS[result.route] ?? DOM_BUDGETS.default;
  const clsBudget = CLS_BUDGETS[result.route] ?? CLS_BUDGETS.default;
  const perfBudget = PERFORMANCE_BUDGETS[result.route] ?? PERFORMANCE_BUDGETS.default;
  const violations = [
    result.performance < perfBudget && `performance ${result.performance} < ${perfBudget}`,
    result.fcp > BUDGETS.fcp && `FCP ${Math.round(result.fcp)}ms > ${BUDGETS.fcp}ms`,
    result.lcp > BUDGETS.lcp && `LCP ${Math.round(result.lcp)}ms > ${BUDGETS.lcp}ms`,
    result.tbt > BUDGETS.tbt && `TBT ${Math.round(result.tbt)}ms > ${BUDGETS.tbt}ms`,
    result.cls > clsBudget && `CLS ${result.cls.toFixed(3)} > ${clsBudget}`,
    result.jsTransferBytes > BUDGETS.jsTransferBytes && `JS ${Math.round(result.jsTransferBytes / 1024)}KiB > ${Math.round(BUDGETS.jsTransferBytes / 1024)}KiB`,
    result.domSize > domBudget && `DOM ${Math.round(result.domSize)} > ${domBudget}`,
  ].filter(Boolean);

  if (violations.length > 0) {
    failures.push(`${result.route}: ${violations.join(", ")}`);
  }
}

if (failures.length > 0) {
  console.error("Lighthouse budget failures:\n" + failures.join("\n"));
  process.exit(1);
}

console.log(`Lighthouse budgets passed (${summary.throttlingMethod ?? "unknown"} throttling, ${summary.runs} run(s)/route).`);
