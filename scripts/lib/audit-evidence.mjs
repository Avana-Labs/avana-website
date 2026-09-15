export function validateEvidence(summary) {
  const errors = [];
  if (!summary || !["mobile", "desktop"].includes(summary.profile)) errors.push("missing or invalid profile");
  if (summary?.throttlingMethod !== "devtools") errors.push("applied devtools throttling is required");
  if (!summary?.revision) errors.push("missing revision");
  if (!Number.isInteger(summary?.runs) || summary.runs < 3) errors.push("at least three runs are required");
  if (!Array.isArray(summary?.expectedRoutes) || !summary.expectedRoutes.length) errors.push("missing expected routes");
  if (!summary?.environment || typeof summary.environment !== "object") {
    errors.push("missing Lighthouse environment");
  } else if (summary.environment.config?.formFactor !== summary.profile) {
    errors.push("Lighthouse profile does not match environment");
  }
  if (!Array.isArray(summary?.routes) || !summary.routes.length) return [...errors, "no measured routes"];
  const seen = new Set();
  for (const result of summary.routes) {
    if (!result || typeof result.route !== "string" || !result.route.startsWith("/")) { errors.push("invalid route result"); continue; }
    if (seen.has(result.route)) errors.push(`duplicate route ${result.route}`);
    seen.add(result.route);
    if (result.runs !== summary.runs) errors.push(`${result.route}: incomplete samples`);
    if (!Array.isArray(result.samples) || result.samples.length !== summary.runs) {
      errors.push(`${result.route}: raw samples are required`);
    }
    if (result.runtimeError) errors.push(`${result.route}: runtime error`);
    for (const [sampleIndex, sample] of (result.samples ?? []).entries()) {
      if (!sample || typeof sample !== "object") {
        errors.push(`${result.route}: invalid sample ${sampleIndex + 1}`);
        continue;
      }
      if (sample.runtimeError) errors.push(`${result.route}: sample ${sampleIndex + 1} runtime error`);
      for (const metric of ["performance", "fcp", "lcp", "tbt", "cls", "jsTransferBytes", "domSize"]) {
        if (typeof sample[metric] !== "number" || !Number.isFinite(sample[metric]) || sample[metric] < 0) {
          errors.push(`${result.route}: sample ${sampleIndex + 1} invalid ${metric}`);
        }
      }
      if (sample.performance > 100 || sample.fcp === 0 || sample.lcp === 0) {
        errors.push(`${result.route}: sample ${sampleIndex + 1} impossible paint or score`);
      }
    }
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
