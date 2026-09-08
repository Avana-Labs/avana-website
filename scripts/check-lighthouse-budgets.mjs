import { readFile } from "node:fs/promises";
import path from "node:path";

const OUTPUT_DIR = path.resolve(process.env.LIGHTHOUSE_OUTPUT_DIR ?? ".lighthouse");
const BUDGETS = {
  performance: 75,
  fcp: 1_500,
  lcp: 6_000,
  tbt: 100,
  cls: 0.05,
  jsTransferBytes: 200_000,
};
const DOM_BUDGETS = {
  default: 1_000,
  "/multiply": 1_500,
};

const summary = JSON.parse(await readFile(path.join(OUTPUT_DIR, "summary.json"), "utf8"));

const failures = [];

for (const result of summary.routes) {
  const domBudget = DOM_BUDGETS[result.route] ?? DOM_BUDGETS.default;
  const violations = [
    result.performance < BUDGETS.performance && `performance ${result.performance} < ${BUDGETS.performance}`,
    result.fcp > BUDGETS.fcp && `FCP ${Math.round(result.fcp)}ms > ${BUDGETS.fcp}ms`,
    result.lcp > BUDGETS.lcp && `LCP ${Math.round(result.lcp)}ms > ${BUDGETS.lcp}ms`,
    result.tbt > BUDGETS.tbt && `TBT ${Math.round(result.tbt)}ms > ${BUDGETS.tbt}ms`,
    result.cls > BUDGETS.cls && `CLS ${result.cls.toFixed(3)} > ${BUDGETS.cls}`,
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

console.log("Lighthouse budgets passed.");
