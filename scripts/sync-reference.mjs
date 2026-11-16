#!/usr/bin/env node
/**
 * Copy the Reference pages' sources into content/reference/.
 *
 * The source of truth lives outside this repo. Set AVANA_REFERENCE_DIR to the
 * folder that holds addresses.md, parameters.md, access-controls.md and the
 * networks/ folder (one address file per network), or keep the default: a sibling
 * checkout at ../avana-internal-references/reference/site-reference.
 *
 *   npm run sync:reference              copy the files in, then commit them
 *   npm run sync:reference -- --check   exit 1 if the committed copies are out of date
 *
 * Before copying, it parses every page against the network files and stops if a
 * page names an address key that a network file does not have.
 *
 * The build never reads the outside folder: it parses the committed copies, so
 * CI and Vercel build without access to it.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { importSource } from "../tests/helpers/import-source.mjs"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const PAGES = ["addresses.md", "parameters.md", "access-controls.md"]
const target = path.join(ROOT, "content", "reference")
const source = path.resolve(
  process.env.AVANA_REFERENCE_DIR ?? path.join(ROOT, "..", "avana-internal-references", "reference", "site-reference"),
)
const check = process.argv.includes("--check")

const networkDir = path.join(source, "networks")
const networkFiles = fs.existsSync(networkDir)
  ? fs.readdirSync(networkDir).filter((file) => file.endsWith(".json")).sort().map((file) => `networks/${file}`)
  : []
const missing = PAGES.filter((file) => !fs.existsSync(path.join(source, file)))
if (missing.length > 0 || networkFiles.length === 0) {
  console.error(`Reference sources not found in ${source}: ${[...missing, ...(networkFiles.length ? [] : ["networks/*.json"])].join(", ")}`)
  console.error("Set AVANA_REFERENCE_DIR to the folder that holds the three Markdown files and networks/.")
  process.exit(1)
}

process.chdir(ROOT)
const { parseReferenceMarkdown, parseAddressBook } = importSource("src/lib/reference/markdown.ts")
const normalize = (text) => text.replace(/\r\n?/g, "\n")
const read = (file) => normalize(fs.readFileSync(path.join(source, file), "utf8"))

const books = {}
for (const file of networkFiles) {
  try {
    const book = parseAddressBook(read(file), file)
    if (`networks/${book.network}.json` !== file) throw new Error(`"network" must match the file name`)
    books[book.network] = book
  } catch (error) {
    console.error(`${file} is not valid: ${error.message}`)
    process.exit(1)
  }
}

const usedKeys = new Map()
for (const file of PAGES) {
  try {
    parseReferenceMarkdown(read(file), file, { books, usedKeys })
  } catch (error) {
    console.error(`${file} does not parse: ${error.message}`)
    process.exit(1)
  }
}
for (const [network, book] of Object.entries(books)) {
  const used = usedKeys.get(network) ?? new Set()
  const unused = Object.keys(book.addresses).filter((key) => !key.startsWith("_") && !used.has(key))
  if (unused.length > 0) console.warn(`networks/${network}.json: not shown on any page: ${unused.join(", ")}`)
}

// Network files that no longer exist in the source are removed from the copy.
const targetNetworkDir = path.join(target, "networks")
const stray = fs.existsSync(targetNetworkDir)
  ? fs.readdirSync(targetNetworkDir).filter((file) => file.endsWith(".json")).map((file) => `networks/${file}`).filter((file) => !networkFiles.includes(file))
  : []

let stale = 0
for (const file of [...PAGES, ...networkFiles]) {
  const next = read(file)
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
    fs.mkdirSync(path.dirname(destination), { recursive: true })
    fs.writeFileSync(destination, next)
    console.log(`updated     content/reference/${file}`)
  }
}
for (const file of stray) {
  stale += 1
  if (check) {
    console.error(`not in source content/reference/${file}`)
  } else {
    fs.rmSync(path.join(target, file))
    console.log(`removed     content/reference/${file}`)
  }
}

if (check && stale > 0) {
  console.error("Run `npm run sync:reference` and commit the result.")
  process.exit(1)
}
