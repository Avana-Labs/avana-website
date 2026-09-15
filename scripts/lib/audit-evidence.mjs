export function validateEvidence(summary) {
  const errors = [];
  if (!summary || !["mobile", "desktop"].includes(summary.profile)) errors.push("missing or invalid profile");
  if (summary?.throttlingMethod !== "devtools") errors.push("applied devtools throttling is required");
  if (!summary?.revision) errors.push("missing revision");
  if (!Number.isInteger(summary?.runs) || summary.runs < 3) errors.push("at least three runs are required");
  if (!Array.isArray(summary?.expectedRoutes) || !summary.expectedRoutes.length) errors.push("missing expected routes");
  if (!Array.isArray(summary?.routes) || !summary.routes.length) return [...errors, "no measured routes"];
  const seen = new Set();
  for (const result of summary.routes) {
    if (!result || typeof result.route !== "string" || !result.route.startsWith("/")) { errors.push("invalid route result"); continue; }
    if (seen.has(result.route)) errors.push(`duplicate route ${result.route}`);
    seen.add(result.route);
    if (result.runs !== summary.runs) errors.push(`${result.route}: incomplete samples`);
    for (const metric of ["performance", "fcp", "lcp", "tbt", "cls", "jsTransferBytes", "domSize"]) {
      if (typeof result[metric] !== "number" || !Number.isFinite(result[metric]) || result[metric] < 0) errors.push(`${result.route}: invalid ${metric}`);
    }
    if (result.performance > 100 || result.fcp === 0 || result.lcp === 0) errors.push(`${result.route}: impossible paint or score`);
  }
  const expectedRoutes = Array.isArray(summary.expectedRoutes) ? summary.expectedRoutes : [];
  if (new Set(expectedRoutes).size !== expectedRoutes.length) errors.push("duplicate expected routes");
  for (const route of expectedRoutes) if (!seen.has(route)) errors.push(`missing route ${route}`);
  for (const route of seen) if (!expectedRoutes.includes(route)) errors.push(`unexpected route ${route}`);
  return errors;
}
