import { readFileSync } from "node:fs"
import path from "node:path"
import { parseReferenceMarkdown, type ReferenceDocument } from "@/lib/reference/markdown"

export const referencePages = ["addresses", "parameters", "access-controls"] as const
export type ReferencePageName = (typeof referencePages)[number]

const cache = new Map<ReferencePageName, ReferenceDocument>()

/**
 * Read and parse content/reference/<name>.md at build time. The files are
 * copied into the repo by `npm run sync:reference` (see content/reference/README.md).
 */
export function loadReferenceDocument(name: ReferencePageName): ReferenceDocument {
  const cached = cache.get(name)
  if (cached) return cached
  const file = path.join(process.cwd(), "content", "reference", `${name}.md`)
  const document = parseReferenceMarkdown(readFileSync(file, "utf8"), `${name}.md`)
  cache.set(name, document)
  return document
}
