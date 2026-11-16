#!/usr/bin/env node
/**
 * Copy the Reference pages' Markdown sources into content/reference/.
 *
 * The source of truth lives outside this repo. Set AVANA_REFERENCE_DIR to the
 * folder that holds addresses.md, parameters.md and access-controls.md, or keep
 * the default: a sibling checkout at ../avana-internal-references/reference/site-reference.
 *
 *   npm run sync:reference           copy the files in, then commit them
 *   npm run sync:reference -- --check   exit 1 if the committed copies are out of date
 *
 * The build never reads the outside folder: it parses the committed copies, so
 * CI and Vercel build without access to it.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { importSource } from "../tests/helpers/import-source.mjs"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const FILES = ["addresses.md", "parameters.md", "access-controls.md"]
const target = path.join(ROOT, "content", "reference")
const source = path.resolve(
  process.env.AVANA_REFERENCE_DIR ?? path.join(ROOT, "..", "avana-internal-references", "reference", "site-reference"),
)
const check = process.argv.includes("--check")

const missing = FILES.filter((file) => !fs.existsSync(path.join(source, file)))
if (missing.length > 0) {
  console.error(`Reference sources not found in ${source}: ${missing.join(", ")}`)
  console.error("Set AVANA_REFERENCE_DIR to the folder that holds the three Markdown files.")
  process.exit(1)
}

process.chdir(ROOT)
const { parseReferenceMarkdown } = importSource("src/lib/reference/markdown.ts")
const normalize = (text) => text.replace(/\r\n?/g, "\n")
let stale = 0
for (const file of FILES) {
  const next = normalize(fs.readFileSync(path.join(source, file), "utf8"))
  try {
    parseReferenceMarkdown(next, file)
  } catch (error) {
    console.error(`${file} does not parse: ${error.message}`)
    process.exit(1)
  }
  const destination = path.join(target, file)
  const current = fs.existsSync(destination) ? normalize(fs.readFileSync(destination, "utf8")) : null
  if (current === next) {
    console.log(`up to date  content/reference/${file}`)
    continue
  }
  stale += 1
  if (check) {
    console.error(`out of date content/reference/${file}`)
  } else {
    fs.mkdirSync(target, { recursive: true })
    fs.writeFileSync(destination, next)
    console.log(`updated     content/reference/${file}`)
  }
}

if (check && stale > 0) {
  console.error("Run `npm run sync:reference` and commit the result.")
  process.exit(1)
}
