import { spawn, execFileSync } from "node:child_process";
import { once } from "node:events";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import desktopConfig from "lighthouse/core/config/desktop-config.js";

const PORT = Number(process.env.LIGHTHOUSE_PORT ?? 3001);
const HOSTNAME = process.env.LIGHTHOUSE_HOSTNAME ?? "127.0.0.1";
const BASE_URL = process.env.LIGHTHOUSE_BASE_URL ?? `http://${HOSTNAME}:${PORT}`;
const OUTPUT_DIR = path.resolve(process.env.LIGHTHOUSE_OUTPUT_DIR ?? ".lighthouse");
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];
const APP_PATH_ROUTES_MANIFEST = path.join(process.cwd(), ".next", "app-path-routes-manifest.json");
const ROUTES_MANIFEST = path.join(process.cwd(), ".next", "routes-manifest.json");
const EXCLUDED_ROUTES = new Set(["/_global-error", "/_not-found", "/favicon.ico", "/robots.txt", "/sitemap.xml", "/og"]);
const REQUESTED_ROUTES = process.env.LIGHTHOUSE_ROUTES?.split(",").map((route) => route.trim()).filter(Boolean);
const RUNS = Math.max(1, Number(process.env.LIGHTHOUSE_RUNS ?? 3));
if (!Number.isInteger(RUNS) || RUNS > 10) throw new Error("Lighthouse runs must be an integer from 1 to 10");
const PROFILE = process.env.LIGHTHOUSE_PROFILE ?? "mobile";
if (!["mobile", "desktop"].includes(PROFILE)) throw new Error("Invalid Lighthouse profile");
const REVISION = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
/**
 * Measure paints and main-thread blocking, don't model them.
 *
 * Lighthouse defaults to "simulate" (Lantern): it traces the page unthrottled
 * and then estimates what slow-4G would have done. The estimate is stable and
 * cheap, but it is not an observation -- on this site it reported TBT of
 * 16-20ms where applied throttling measured 46-331ms on the same build, so the
 * budgets below were passing on a number nothing had actually timed.
 *
 * "devtools" applies real network and CPU throttling and reports observed
 * values. Runs take longer in wall-clock, which is the cost of measuring.
 * Set LIGHTHOUSE_THROTTLING=simulate for a fast, comparable-to-CI-history run.
 */
const THROTTLING_METHOD = process.env.LIGHTHOUSE_THROTTLING ?? "devtools";

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function metric(report, auditId) {
  const value = report.audits[auditId]?.numericValue;
  if (!Number.isFinite(value)) throw new Error(`Missing metric ${auditId}`);
  return value;
}

function networkBytes(report, resourceType) {
  const requests = report.audits["network-requests"]?.details?.items ?? [];

  return requests
    .filter((request) => !resourceType || request.resourceType === resourceType)
    .reduce((total, request) => total + (request.transferSize ?? 0), 0);
}

function reportMetrics(report) {
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

function medianMetrics(results) {
  const keys = Object.keys(results[0]);

  return Object.fromEntries(
    keys.map((key) => [key, median(results.map((result) => result[key]))]),
  );
}

function routeSlug(route) {
  return route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "--");
}

function resolveLocaleRoute(route) {
  if (typeof route !== "string") {
    return null;
  }

  if (route === "/[locale]") {
    return "/";
  }

  if (route.startsWith("/[locale]/")) {
    const resolved = route.slice("/[locale]".length);
    return resolved.includes("[") ? null : resolved;
  }

  return route.includes("[") ? null : route;
}

function isAuditableRoute(route, redirectSources) {
  if (typeof route !== "string" || !route.startsWith("/")) {
    return false;
  }

  if (route.startsWith("/_") || EXCLUDED_ROUTES.has(route)) {
    return false;
  }
  if (route === "/api" || route.startsWith("/api/")) return false;

  if (route.endsWith(".txt") || route.endsWith(".xml") || route.endsWith(".ico")) {
    return false;
  }

  return !redirectSources.has(route);
}

async function getRoutesToAudit() {
  const [appPathRoutesManifestRaw, routesManifestRaw] = await Promise.all([
    readFile(APP_PATH_ROUTES_MANIFEST, "utf8"),
    readFile(ROUTES_MANIFEST, "utf8"),
  ]);

  const appPathRoutesManifest = JSON.parse(appPathRoutesManifestRaw);
  const routesManifest = JSON.parse(routesManifestRaw);
  const redirectSources = new Set((routesManifest.redirects ?? []).map((redirect) => redirect.source));

  return [...new Set(Object.values(appPathRoutesManifest).map(resolveLocaleRoute))]
    .filter((route) => route && isAuditableRoute(route, redirectSources))
    .sort((a, b) => a.localeCompare(b));
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env: process.env,
      stdio: "inherit",
      ...options,
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

async function waitForServer(url, timeoutMs = 90_000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: "manual" });
      if (response.ok || response.status === 307 || response.status === 308) {
        return;
      }
    } catch {
      // Server is still booting.
    }

    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function stopServer(serverProcess) {
  if (serverProcess.exitCode !== null) {
    return;
  }

  serverProcess.kill("SIGTERM");
  const closeResult = await Promise.race([
    once(serverProcess, "close"),
    new Promise((resolve) => setTimeout(resolve, 10_000)),
  ]);

  if (!closeResult && serverProcess.exitCode === null) {
    serverProcess.kill("SIGKILL");
    await once(serverProcess, "close");
  }
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  // Never overwrite a completed baseline, or recursively delete a caller's path.
  try { await readFile(path.join(OUTPUT_DIR, "summary.json")); throw new Error("Output already contains a completed audit; choose a new LIGHTHOUSE_OUTPUT_DIR"); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  if (process.env.LIGHTHOUSE_SKIP_BUILD !== "1") {
    await runCommand("npm", ["run", "build"]);
  }
  const discoveredRoutes = await getRoutesToAudit();
  const routes = REQUESTED_ROUTES ?? discoveredRoutes;
  if (!routes.length || new Set(routes).size !== routes.length) throw new Error("Routes must be nonempty and unique");

  for (const route of routes) {
    const canonical = route.replace(/^\/(?:ar|bn|de|es|fa|fr|ha|he|hi|id|it|ja|ko|nl|pl|pt|ru|sw|th|tr|uk|ur|vi|zh-CN|zh-TW)(?=\/|$)/, "") || "/";
    if (!discoveredRoutes.includes(canonical)) {
      throw new Error(`Requested Lighthouse route is not auditable: ${route}`);
    }
  }

  const serverProcess = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", String(PORT), "--hostname", HOSTNAME], {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  serverProcess.stdout.on("data", (chunk) => process.stdout.write(chunk));
  serverProcess.stderr.on("data", (chunk) => process.stderr.write(chunk));
  let chrome;
  const interrupt = () => { serverProcess.kill("SIGTERM"); void chrome?.kill().finally(() => process.exit(130)); if (!chrome) process.exit(130); };
  process.once("SIGINT", interrupt);
  process.once("SIGTERM", interrupt);

  try {
    await waitForServer(BASE_URL);

    chrome = await launch({
      chromeFlags: ["--headless", "--no-sandbox", "--disable-dev-shm-usage"],
    });

    try {
      const summary = [];
      let environment;
      console.log(`Auditing ${routes.length} routes with ${RUNS} run${RUNS === 1 ? "" : "s"} each (${THROTTLING_METHOD} throttling)...`);

      for (const [index, route] of routes.entries()) {
        const url = `${BASE_URL}${route}`;
        const routeResults = [];

        for (let run = 1; run <= RUNS; run += 1) {
          console.log(`[${index + 1}/${routes.length}] Auditing ${route} (${run}/${RUNS})`);
          const runnerResult = await lighthouse(
            url,
            {
              port: chrome.port,
              output: ["html", "json"],
              onlyCategories: CATEGORIES,
              logLevel: "error",
              throttlingMethod: THROTTLING_METHOD,
            },
            PROFILE === "desktop" ? desktopConfig : undefined,
          );

          if (!runnerResult) {
            throw new Error(`Lighthouse did not return a result for ${url}`);
          }
          if (runnerResult.lhr.runtimeError) throw new Error(runnerResult.lhr.runtimeError.message);
          environment ??= {
            lighthouseVersion: runnerResult.lhr.lighthouseVersion,
            userAgent: runnerResult.lhr.userAgent,
            host: runnerResult.lhr.environment,
            config: runnerResult.lhr.configSettings,
          };

          const outputBase = path.join(OUTPUT_DIR, `${routeSlug(route)}.run-${run}`);
          const reports = Array.isArray(runnerResult.report) ? runnerResult.report : [runnerResult.report];

          for (const report of reports) {
            const extension = report.trimStart().startsWith("{") ? "json" : "html";
            await writeFile(`${outputBase}.report.${extension}`, report, "utf8");
          }

          routeResults.push(reportMetrics(runnerResult.lhr));
        }

        const routeSummary = { route, runs: RUNS, ...medianMetrics(routeResults), samples: routeResults };

        summary.push(routeSummary);
        console.log(
          `[${index + 1}/${routes.length}] Done ${route} ` +
            `(P ${routeSummary.performance}, FCP ${Math.round(routeSummary.fcp)}ms, ` +
            `LCP ${Math.round(routeSummary.lcp)}ms, TBT ${Math.round(routeSummary.tbt)}ms)`,
        );
      }

      console.table(summary);
      await writeFile(
        path.join(OUTPUT_DIR, "summary.json"),
        JSON.stringify({ generatedAt: new Date().toISOString(), revision: REVISION, profile: PROFILE, node: process.version, environment, runs: RUNS, throttlingMethod: THROTTLING_METHOD, expectedRoutes: routes, routes: summary }, null, 2),
        "utf8",
      );
      console.log(`Saved Lighthouse reports to ${OUTPUT_DIR}`);
    } finally {
      await chrome.kill();
    }
  } finally {
    await stopServer(serverProcess);
    process.removeListener("SIGINT", interrupt);
    process.removeListener("SIGTERM", interrupt);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
