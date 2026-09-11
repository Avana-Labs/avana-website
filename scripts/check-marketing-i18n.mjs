import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Marketing copy is localized by a phrase map: components render English, and
 * `LocalizedMarketing` swaps in translations looked up from
 * content/<locale>/marketing.json.
 *
 * The lookup fails soft by design -- an absent group or a short array just
 * renders the English string. That is the right runtime behaviour and the wrong
 * build behaviour: missing or stale groups can silently ship English or keep
 * deleted-page copy alive because nothing checks them.
 *
 * This asserts what the runtime cannot:
 *   1. every group a component asks for exists in every locale
 *   2. every locale's `strings` array is the same length as English, since the
 *      map is built by index -- a short or long array silently mistranslates
 */
const CONTENT_DIR = path.resolve("content");
const SRC_DIR = path.resolve("src");
const DEFAULT_LOCALE = "en";

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

/** Group keys requested via `keys={[...]}` or `withMarketingI18n(locale, [...])`. */
async function requestedGroups() {
  const groups = new Map(); // key -> first file that asked for it
  for (const file of await walk(SRC_DIR)) {
    const source = await readFile(file, "utf8");
    const rel = path.relative(process.cwd(), file);
    for (const block of source.matchAll(/keys=\{\[([^\]]*)\]\}/g)) {
      for (const key of block[1].matchAll(/"([^"]+)"/g)) {
        if (!groups.has(key[1])) groups.set(key[1], rel);
      }
    }
    for (const block of source.matchAll(/withMarketingI18n\([^,]+,\s*\[([^\]]*)\]/g)) {
      for (const key of block[1].matchAll(/['"]([^'"]+)['"]/g)) {
        if (!groups.has(key[1])) groups.set(key[1], rel);
      }
    }
  }
  return groups;
}

async function loadCatalog(locale) {
  return JSON.parse(await readFile(path.join(CONTENT_DIR, locale, "marketing.json"), "utf8"));
}

const locales = (await readdir(CONTENT_DIR, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter(async (name) => name);

const withCatalog = [];
for (const locale of locales) {
  try {
    await readFile(path.join(CONTENT_DIR, locale, "marketing.json"));
    withCatalog.push(locale);
  } catch {
    // Directory carries no marketing catalog (e.g. shared helpers) -- not a locale.
  }
}

const english = await loadCatalog(DEFAULT_LOCALE);
const groups = await requestedGroups();
const failures = [];

for (const [group, sourceFile] of groups) {
  if (!(group in english)) {
    failures.push(`"${group}" requested by ${sourceFile} but absent from content/${DEFAULT_LOCALE}/marketing.json`);
  }
}

// A removed page or component must not leave a dead phrase-map group behind.
// Stale groups make catalogs drift indefinitely and hide real missing coverage.
for (const group of Object.keys(english)) {
  if (!groups.has(group)) {
    failures.push(`stale marketing group "${group}" remains in content/${DEFAULT_LOCALE}/marketing.json`);
  }
}

for (const locale of withCatalog) {
  if (locale === DEFAULT_LOCALE) continue;
  const catalog = await loadCatalog(locale);

  for (const [group, sourceFile] of groups) {
    if (!(group in english)) continue; // already reported above
    if (!(group in catalog)) {
      failures.push(`${locale}: missing group "${group}" (requested by ${sourceFile}) -- renders English`);
      continue;
    }
    const expected = english[group].strings.length;
    const actual = catalog[group].strings.length;
    if (actual !== expected) {
      failures.push(`${locale}: group "${group}" has ${actual} strings, expected ${expected} -- index pairing would mistranslate`);
    }
  }
}

if (failures.length > 0) {
  console.error(`Marketing i18n check failed (${failures.length} problem${failures.length === 1 ? "" : "s"}):`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log(`Marketing i18n OK: ${groups.size} groups x ${withCatalog.length} locales, all present and index-aligned.`);
