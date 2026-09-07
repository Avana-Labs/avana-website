#!/usr/bin/env node
/**
 * Extract user-visible strings from TSX via TypeScript AST.
 * Writes content/en/docs.json and content/en/marketing.json for LocalizeStrings maps.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")

const ATTRS = new Set([
  "title",
  "description",
  "alt",
  "aria-label",
  "ariaLabel",
  "placeholder",
  "label",
  "eyebrow",
  "subtitle",
  "summary",
  "question",
  "answer",
  "name",
])

function decodeEntities(s) {
  // Decode &amp; last so sequences like &amp;lt; stay correct.
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8209;/g, "-")
    .replace(/&amp;/g, "&")
}

function isJunk(s) {
  const t = s.trim()
  if (t.length < 2) return true
  if (t.startsWith("http://") || t.startsWith("https://") || t.startsWith("/")) return true
  if (t.startsWith("@/") || t.startsWith("./") || t.startsWith("../")) return true
  if (/^[\d\s\$\%\.\,\-\+\*/:#_@]+$/.test(t)) return true
  if (/^(w-|h-|max-|min-|md:|lg:|xl:|sm:|2xl:|flex|grid|px-|py-|pt-|pb-|mt-|mb-|ml-|mr-|gap-|text-|bg-|border|rounded|absolute|relative|hidden|block|inline)/.test(t) && t.includes("-") && !/[A-Z][a-z]{2,}/.test(t) && t.split(" ").length > 2) {
    return true // utility class piles
  }
  if (/className|useRef|useState|useEffect|\(\)\s*=>/.test(t)) return true
  if (/^[a-z0-9_\-\[\].:%/]+(?:\s+[a-z0-9_\-\[\].:%/]+){2,}$/i.test(t) && !/[A-Z][a-z]{2,}/.test(t)) return true
  if (/^(max-width:|width:|height:)/i.test(t)) return true // image sizes
  if (/^[#.]?[a-zA-Z0-9_-]+$/.test(t) && t.length < 4) return true
  // pure code-looking
  if (/[=;{}<>`]/.test(t) && !/\s/.test(t)) return true
  return false
}

function normalize(s) {
  return decodeEntities(s).replace(/\s+/g, " ").trim()
}

function collectFromSource(filePath) {
  const src = fs.readFileSync(filePath, "utf8")
  const sf = ts.createSourceFile(filePath, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const strings = []
  const seen = new Set()

  function add(raw) {
    if (typeof raw !== "string") return
    const n = normalize(raw)
    if (!n || isJunk(n) || seen.has(n)) return
    // keep only likely human-readable copy
    const hasLetter = /[\p{L}]/u.test(n)
    if (!hasLetter) return
    // skip single tokens that are ids
    if (/^[A-Za-z0-9_/-]+$/.test(n) && n.length < 4) return
    seen.add(n)
    strings.push(n)
  }

  function visit(node) {
    if (ts.isJsxText(node)) {
      add(node.getText(sf))
    } else if (ts.isJsxAttribute(node) && node.initializer) {
      const name = node.name.getText(sf)
      if (ATTRS.has(name)) {
        if (ts.isStringLiteral(node.initializer) || ts.isNoSubstitutionTemplateLiteral(node.initializer)) {
          add(node.initializer.text)
        } else if (ts.isJsxExpression(node.initializer) && node.initializer.expression) {
          const exp = node.initializer.expression
          if (ts.isStringLiteral(exp) || ts.isNoSubstitutionTemplateLiteral(exp)) {
            add(exp.text)
          }
        }
      }
    } else if (ts.isPropertyAssignment(node)) {
      const name = ts.isIdentifier(node.name)
        ? node.name.text
        : ts.isStringLiteral(node.name)
          ? node.name.text
          : ""
      if (
        ATTRS.has(name) ||
        ["q", "a", "label", "heading", "cta", "primaryCta", "secondaryCta"].includes(name)
      ) {
        if (ts.isStringLiteral(node.initializer) || ts.isNoSubstitutionTemplateLiteral(node.initializer)) {
          add(node.initializer.text)
        }
      }
    } else if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      // Capture content-like string literals used for UI arrays (sections titles, FAQ)
      const t = node.text
      if (t.length >= 12 && /[a-zA-Z]{3,}/.test(t) && t.includes(" ") && !isJunk(t)) {
        // Only if parent is array/object related to content, heuristic: contains space + sentence-ish
        if (/^[A-Z0-9]/.test(t) || t.endsWith(".") || t.endsWith("?") || t.includes(" ")) {
          // Avoid import paths and URLs already handled
          if (!t.includes("node_modules") && !t.startsWith("/") && t.length < 2000) {
            // only in object/array context
            let p = node.parent
            if (
              p &&
              (ts.isPropertyAssignment(p) ||
                ts.isArrayLiteralExpression(p) ||
                ts.isCallExpression(p) ||
                ts.isJsxExpression(p) ||
                ts.isBinaryExpression(p) ||
                ts.isVariableDeclaration(p) ||
                ts.isAsExpression(p))
            ) {
              // property name check for key-like short strings keep longer ones
              if (ts.isPropertyAssignment(p)) {
                const pn = ts.isIdentifier(p.name) ? p.name.text : ""
                if (["id", "href", "src", "key", "value", "type", "icon", "slug", "image"].includes(pn)) {
                  // skip
                } else {
                  add(t)
                }
              } else {
                add(t)
              }
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sf)
  return strings
}

function writeJson(rel, data) {
  const dest = path.join(ROOT, rel)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.writeFileSync(dest, JSON.stringify(data, null, 2) + "\n")
  console.log("wrote", rel, "keys", Object.keys(data).length)
}

// -------- docs --------
const docsRoot = path.join(ROOT, "src/app/[locale]/developers")
const docs = {}

function walk(dir, base = "") {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith(".")) continue
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      walk(full, path.join(base, ent.name))
    } else if (ent.name === "page.tsx" || ent.name === "page.ts") {
      let key = base.replace(/\\/g, "/")
      if (!key || key === ".") key = "hub"
      // special layout? only pages
      const strings = collectFromSource(full)
      // pull metadata title/description separately if present
      const meta = { title: "", description: "" }
      const src = fs.readFileSync(full, "utf8")
      const titleM = src.match(/title:\s*["'`]([^"'`]+)["'`]/)
      const descM = src.match(/description:\s*["'`]([^"'`]+)["'`]|description:\s*\n\s*["'`]([^"'`]+)["'`]/)
      if (titleM) meta.title = decodeEntities(titleM[1])
      if (descM) meta.description = decodeEntities(descM[1] || descM[2] || "")

      // toc from sections array if any
      const toc = []
      const secRe = /\{\s*id:\s*["'`]([^"'`]+)["'`]\s*,\s*title:\s*["'`]([^"'`]+)["'`]/g
      let m
      while ((m = secRe.exec(src))) {
        toc.push({ id: m[1], title: decodeEntities(m[2]) })
      }

      docs[key] = { meta, toc, strings }
      console.log("docs", key, strings.length)
    }
  }
}
walk(docsRoot)

// -------- marketing pages + components --------
const marketingFiles = {
  page: "src/app/[locale]/page.tsx",
  "borrow/page": "src/app/[locale]/borrow/page.tsx",
  "lend/page": "src/app/[locale]/lend/page.tsx",
  "multiply/multiply-content": "src/app/[locale]/multiply/multiply-content.tsx",
  "about/page": "src/app/[locale]/about/page.tsx",
  "brand/page": "src/app/[locale]/brand/page.tsx",
  "brand/brand-interactions": "src/app/[locale]/brand/brand-interactions.tsx",
  "hero-section": "src/components/hero-section.tsx",
  "webapp-hero": "src/components/webapp-hero.tsx",
  "avana-products-section": "src/components/avana-products-section.tsx",
  "homepage/HomepageTestimonialSection": "src/components/homepage/HomepageTestimonialSection.tsx",
  "homepage/HomepageFaqSection": "src/components/homepage/HomepageFaqSection.tsx",
  "homepage/HomepageNewsroomSection": "src/components/homepage/HomepageNewsroomSection.tsx",
  "invest-growth-calculator-section": "src/components/invest-growth-calculator-section.tsx",
  "product-feature-scroll-section": "src/components/product-feature-scroll-section.tsx",
  "trade-market-showcase": "src/components/trade-market-showcase.tsx",
  "protocol-roadmap-section": "src/components/protocol-roadmap-section.tsx",
  "position-safety-section": "src/components/position-safety-section.tsx",
  "invest-apy-section": "src/components/invest-apy-section.tsx",
  "leverage-glance-showcase-section": "src/components/leverage-glance-showcase-section.tsx",
  "position-safety-cards-section": "src/components/position-safety-cards-section.tsx",
  "borrow-power-section": "src/components/borrow-power-section.tsx",
  "platform-tools-showcase-section": "src/components/platform-tools-showcase-section.tsx",
  InlineFaqSection: "src/components/InlineFaqSection.tsx",
}

const marketing = {}
for (const [key, rel] of Object.entries(marketingFiles)) {
  const full = path.join(ROOT, rel)
  if (!fs.existsSync(full)) {
    console.warn("missing marketing source", rel)
    continue
  }
  const strings = collectFromSource(full)
  marketing[key] = { strings }
  console.log("marketing", key, strings.length)
}

writeJson("content/en/docs.json", docs)
writeJson("content/en/marketing.json", marketing)

// summary
const dCount = Object.values(docs).reduce((n, p) => n + p.strings.length, 0)
const mCount = Object.values(marketing).reduce((n, p) => n + p.strings.length, 0)
console.log("TOTAL docs strings", dCount, "marketing strings", mCount)
