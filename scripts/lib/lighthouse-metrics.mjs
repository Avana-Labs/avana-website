export function metric(report, auditId) {
  const value = report.audits[auditId]?.numericValue;
  if (Number.isFinite(value)) return value;

  if (auditId === "dom-size") {
    const domSize = report.audits["dom-size-insight"]?.details?.debugData?.totalElements;
    if (Number.isFinite(domSize)) return domSize;
  }

  throw new Error(`Missing metric ${auditId}`);
}

export function networkBytes(report, resourceType) {
  const requests = report.audits["network-requests"]?.details?.items ?? [];

  return requests
    .filter((request) => !resourceType || request.resourceType === resourceType)
    .reduce((total, request) => total + (request.transferSize ?? 0), 0);
}

export function reportMetrics(report) {
  return {
    performance: Math.round((report.categories.performance?.score ?? 0) * 100),
    accessibility: Math.round((report.categories.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((report.categories["best-practices"]?.score ?? 0) * 100),
    seo: Math.round((report.categories.seo?.score ?? 0) * 100),
    fcp: metric(report, "first-contentful-paint"),
    lcp: metric(report, "largest-contentful-paint"),
    tbt: metric(report, "total-blocking-time"),
    cls: metric(report, "cumulative-layout-shift"),
    mainThread: metric(report, "mainthread-work-breakdown"),
    domSize: metric(report, "dom-size"),
    transferBytes: networkBytes(report),
    jsTransferBytes: networkBytes(report, "Script"),
    imageTransferBytes: networkBytes(report, "Image"),
  };
}
