import { readFile } from "node:fs/promises";
import { localeCodes } from "../src/i18n/locales.ts";
import { SITE_URL } from "../src/lib/site.ts";

const root = ".next/server/app";
const manifest = JSON.parse(await readFile(".next/prerender-manifest.json", "utf8"));
const failures = [];
const semanticsOnly = process.argv.includes("--semantics");
let checked = 0;

function attr(tag, name) {
  return tag?.match(new RegExp(`\\b${name}="([^"]*)"`, "i"))?.[1];
}

for (const [route, data] of Object.entries(manifest.routes)) {
  const locale = route.split("/")[1];
  if (data.routeType !== "page" || !localeCodes.includes(locale)) continue;
  const meta = JSON.parse(await readFile(`${root}${route}.meta`, "utf8"));
  if (meta.status >= 300) continue;
  const html = await readFile(`${root}${route}.html`, "utf8");
  const path = route.slice(locale.length + 1) || "/";
  const publicPath = locale === "en" ? path : route;
  const expected = SITE_URL + (publicPath === "/" ? "" : publicPath);
  const links = html.match(/<link\b[^>]*>/g) ?? [];
  const metas = html.match(/<meta\b[^>]*>/g) ?? [];
  const canonicals = links.filter(tag => attr(tag, "rel") === "canonical");
  const descriptions = metas.filter(tag => attr(tag, "name") === "description");
  const titles = html.match(/<title>[^<]+<\/title>/g) ?? [];
  const errors = [];
  if (canonicals.length !== 1 || attr(canonicals[0], "href") !== expected) errors.push("canonical");
  if (attr(metas.find(tag => attr(tag, "property") === "og:url"), "content") !== expected) errors.push("og:url");
  if (titles.length !== 1) errors.push("title");
  if (descriptions.length !== 1 || !attr(descriptions[0], "content")?.trim()) errors.push("description");
  if (attr(html.match(/<html\b[^>]*>/)?.[0], "lang") !== locale) errors.push("lang");
  for (const lang of [...localeCodes, "x-default"]) {
    const prefix = lang === "en" || lang === "x-default" ? "" : `/${lang}`;
    const alternate = SITE_URL + prefix + (path === "/" ? "" : path);
    if (!links.some(tag => attr(tag, "hreflang") === lang && attr(tag, "href")?.replace(/\/$/, "") === alternate)) {
      errors.push(`hreflang:${lang}`);
    }
  }
  if (semanticsOnly) {
    errors.length = 0;
    // Next's streamed replacement payload is not a second visible document.
    const initialDocument = html.split(/<div hidden id="S:/)[0];
    if ((initialDocument.match(/<main\b/gi) ?? []).length !== 1) errors.push("main landmark count");
    if ((initialDocument.match(/<h1\b/gi) ?? []).length !== 1) errors.push("h1 count");
    let previous = 0;
    for (const heading of initialDocument.matchAll(/<h([1-6])\b/gi)) {
      const level = Number(heading[1]);
      if (previous && level > previous + 1) { errors.push("heading order"); break; }
      previous = level;
    }
  }
  if (errors.length) failures.push({ route: publicPath, errors });
  checked++;
}

if (!checked) throw new Error("No rendered locale pages were checked");
console.log(`${semanticsOnly ? "Semantics" : "SEO"}: ${checked} rendered pages, ${failures.length} failures`);
if (failures.length) {
  console.error(failures.slice(0, 6).map(f => `${f.route}: ${f.errors.join(", ")}`).join("\n"));
  console.error("Failure counts:", Object.fromEntries([...new Set(failures.flatMap(f => f.errors))].map(key => [key, failures.filter(f => f.errors.includes(key)).length])));
  process.exitCode = 1;
}
