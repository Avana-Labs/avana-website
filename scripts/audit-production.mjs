import { spawnSync } from "node:child_process";

/**
 * `npm audit --omit=dev` at the high level, with a short list of accepted advisories.
 *
 * npm audit has no way to ignore one advisory, so this runs it with --json and fails on
 * every high or critical advisory that is not listed below. An accepted advisory is still
 * printed on each run. Remove its entry as soon as a patched release exists, then update
 * the dependency.
 */
const ACCEPTED = {
  // picomatch ReDoS through single-branch repeated extglobs. Every picomatch release is
  // affected (<= 4.0.7) and none is patched yet. It reaches production dependencies only
  // through next-intl -> @parcel/watcher, a file watcher used by next-intl's message
  // extraction; the site never passes visitor input to a glob. Accepted 2026-11-17.
  "GHSA-fc5q-39xc-vjpf": "no patched picomatch release; reached only through next-intl's file watcher",
};

const GATE = new Set(["high", "critical"]);

// Under `npm run`, npm_execpath is npm's own CLI, so no shell is needed on any platform.
const args = ["audit", "--omit=dev", "--json"];
const options = { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 };
const run = process.env.npm_execpath
  ? spawnSync(process.execPath, [process.env.npm_execpath, ...args], options)
  : spawnSync("npm", args, { ...options, shell: process.platform === "win32" });

let report;
try {
  report = JSON.parse(run.stdout);
} catch {
  process.stderr.write(`npm audit did not return JSON (exit ${run.status}).\n${run.stderr}\n`);
  process.exit(1);
}
if (report.error) {
  process.stderr.write(`npm audit failed: ${JSON.stringify(report.error)}\n`);
  process.exit(1);
}

const advisories = new Map();
for (const vulnerability of Object.values(report.vulnerabilities ?? {})) {
  for (const via of vulnerability.via) {
    if (typeof via !== "object" || !GATE.has(via.severity)) continue;
    const id = via.url?.split("/").pop() ?? String(via.source);
    const entry = advisories.get(id) ?? { title: via.title, severity: via.severity, packages: new Set() };
    for (const node of vulnerability.nodes) entry.packages.add(node);
    advisories.set(id, entry);
  }
}

const blocking = [];
for (const [id, advisory] of advisories) {
  const line = `${advisory.severity} ${id} ${advisory.title} (${[...advisory.packages].join(", ")})`;
  if (ACCEPTED[id]) {
    process.stdout.write(`accepted: ${line}\n  reason: ${ACCEPTED[id]}\n`);
  } else {
    blocking.push(line);
  }
}

if (blocking.length > 0) {
  process.stderr.write(`High or critical advisories in production dependencies:\n${blocking.map((l) => `  ${l}`).join("\n")}\n`);
  process.exit(1);
}
process.stdout.write(`Production dependencies: no high or critical advisories outside the accepted list.\n`);
