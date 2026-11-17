import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import {
  parseAddressBook,
  parseReferenceMarkdown,
  type AddressBook,
  type ReferenceDocument,
} from "@/lib/reference/markdown"

export const referencePages = ["addresses", "parameters", "access-controls"] as const
export type ReferencePageName = (typeof referencePages)[number]

const cache = new Map<ReferencePageName, ReferenceDocument>()
let books: Record<string, AddressBook> | null = null

/** Read content/reference/networks/<network>.json: one address file per network. */
export function loadAddressBooks(): Record<string, AddressBook> {
  if (books) return books
  const dir = path.join(process.cwd(), "content", "reference", "networks")
  const loaded: Record<string, AddressBook> = {}
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".json")).sort()) {
    const book = parseAddressBook(readFileSync(path.join(dir, file), "utf8"), `networks/${file}`)
    if (`${book.network}.json` !== file) throw new Error(`networks/${file}: "network" must be ${file.replace(/\.json$/, "")}`)
    loaded[book.network] = book
  }
  books = loaded
  return loaded
}

/**
 * Read and parse content/reference/<name>.md at build time, filling its @{key}
 * references from the network files. The files are copied into the repo by
 * `npm run sync:reference` (see content/reference/README.md).
 */
export function loadReferenceDocument(name: ReferencePageName): ReferenceDocument {
  const cached = cache.get(name)
  if (cached) return cached
  const file = path.join(process.cwd(), "content", "reference", `${name}.md`)
  const document = parseReferenceMarkdown(readFileSync(file, "utf8"), `${name}.md`, { books: loadAddressBooks() })
  cache.set(name, document)
  return document
}
