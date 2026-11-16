/**
 * Parser for the Reference pages' Markdown sources (content/reference/*.md).
 *
 * The format is deliberately small; content/reference/README.md documents it:
 * front matter, `## ` groups (a group that opens with a `- network:` list is a
 * network), `### ` sections, `#### ` collapsed groups, paragraphs, GFM tables
 * and `> ` notes.
 *
 * Addresses live in one data file per network (content/reference/networks/<id>.json).
 * Text in a network group names one with `@{key}`; the parser swaps in the value
 * from that network's file, so a deployment only replaces those files.
 */

export interface ReferenceNetwork {
  id: string
  chainId: number
  explorer: string
}

export interface ReferenceTable {
  headers: string[]
  rows: string[][]
}

export type ReferenceBlock =
  | { type: "paragraph"; text: string }
  | { type: "note"; text: string }
  | { type: "table"; table: ReferenceTable }
  | { type: "details"; title: string; blocks: ReferenceBlock[] }

export interface ReferenceSection {
  id: string
  title: string
  blocks: ReferenceBlock[]
}

export interface ReferenceGroup {
  id: string
  title: string
  network?: ReferenceNetwork
  blocks: ReferenceBlock[]
  sections: ReferenceSection[]
}

export interface ReferenceDocument {
  title: string
  description: string
  updated: string
  intro: ReferenceBlock[]
  groups: ReferenceGroup[]
}

/** One network's data file: its chain and every address the pages name, keyed by release-manifest path. */
export interface AddressBook {
  network: string
  chainId: number
  explorer: string
  addresses: Record<string, string>
}

export type InlinePart =
  | { type: "text"; value: string }
  | { type: "code"; value: string }
  | { type: "strong"; value: string }
  | { type: "link"; text: string; href: string }

const ADDRESS = /^0x[0-9a-fA-F]{40}$/
const HASH = /^0x[0-9a-fA-F]{64}$/
const KEY_REFERENCE = /@\{([^}]+)\}/g

export function isAddress(value: string): boolean {
  return ADDRESS.test(value)
}

export function isHash(value: string): boolean {
  return HASH.test(value)
}

/** Placeholder addresses start with 30 zero hex digits (see README). */
export function isPlaceholderAddress(value: string): boolean {
  return isAddress(value) && /^0x0{30}/.test(value)
}

/** Placeholder 32-byte values (for example a Uniswap v4 PoolId) start with 56 zero hex digits. */
export function isPlaceholderHash(value: string): boolean {
  return isHash(value) && /^0x0{56}/.test(value)
}

/** Check a network data file and return it typed. Keys starting with `_` are comments. */
export function parseAddressBook(source: string, name = "network file"): AddressBook {
  const data = JSON.parse(source) as Partial<AddressBook>
  if (typeof data.network !== "string" || !data.network) throw new Error(`${name}: needs a "network" id`)
  if (!Number.isInteger(data.chainId) || (data.chainId as number) <= 0) throw new Error(`${name}: needs a numeric "chainId"`)
  if (!/^https:\/\/\S+$/.test(data.explorer ?? "")) throw new Error(`${name}: needs an https "explorer" URL`)
  if (!data.addresses || typeof data.addresses !== "object") throw new Error(`${name}: needs an "addresses" object`)
  for (const [key, value] of Object.entries(data.addresses)) {
    if (key.startsWith("_")) continue
    if (typeof value !== "string" || !(isAddress(value) || isHash(value))) {
      throw new Error(`${name}: "${key}" must be a 20-byte address or a 32-byte hash`)
    }
  }
  return { ...(data as AddressBook), explorer: (data.explorer as string).replace(/\/+$/, "") }
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[`'’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function splitTableRow(line: string): string[] {
  let body = line.trim()
  if (body.startsWith("|")) body = body.slice(1)
  if (body.endsWith("|") && !body.endsWith("\\|")) body = body.slice(0, -1)
  const cells: string[] = []
  let current = ""
  let inCode = false
  for (let i = 0; i < body.length; i += 1) {
    const char = body[i]
    if (char === "\\" && body[i + 1] === "|") {
      current += "|"
      i += 1
    } else if (char === "`") {
      inCode = !inCode
      current += char
    } else if (char === "|" && !inCode) {
      cells.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  cells.push(current.trim())
  return cells
}

const DELIMITER_ROW = /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?$/
const H4 = /^####\s+(.+?)\s*$/

function parseFrontMatter(lines: string[]): { meta: Record<string, string>; rest: string[] } {
  const meta: Record<string, string> = {}
  if (lines[0]?.trim() !== "---") return { meta, rest: lines }
  const end = lines.indexOf("---", 1)
  if (end === -1) throw new Error("Front matter is not closed with ---")
  for (const line of lines.slice(1, end)) {
    const match = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)
    if (match) meta[match[1]] = match[2].trim()
  }
  return { meta, rest: lines.slice(end + 1) }
}

function parseNetwork(
  meta: Record<string, string>,
  groupTitle: string,
  book: AddressBook | undefined,
): ReferenceNetwork | undefined {
  if (!meta.network) return undefined
  // The network's data file supplies the chain ID and explorer unless the group states them.
  const chainIdText = meta.chainId ?? (book ? String(book.chainId) : undefined)
  const explorer = meta.explorer ?? book?.explorer ?? ""
  const chainId = Number(chainIdText)
  if (!Number.isInteger(chainId) || chainId <= 0) {
    throw new Error(`Network "${groupTitle}" needs a numeric chainId`)
  }
  if (book && chainId !== book.chainId) {
    throw new Error(`Network "${groupTitle}": chainId ${chainId} differs from networks/${book.network}.json`)
  }
  if (!/^https:\/\/\S+$/.test(explorer)) {
    throw new Error(`Network "${groupTitle}" needs an https explorer URL`)
  }
  return { id: meta.network, chainId, explorer: explorer.replace(/\/+$/, "") }
}

type Resolve = (text: string) => string

/** Parse blocks (paragraphs, tables, notes, `#### ` collapsed groups) from a run of lines. */
function parseBlocks(lines: string[], where: string, resolve: Resolve = (text) => text): ReferenceBlock[] {
  const blocks: ReferenceBlock[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i].trim()
    if (!line || line.startsWith("<!--")) {
      i += 1
      continue
    }
    const h4 = line.match(H4)
    if (h4) {
      // A collapsed group runs to the next `#### ` heading or the end of the section.
      const inner: string[] = []
      i += 1
      while (i < lines.length && !H4.test(lines[i].trim())) {
        inner.push(lines[i])
        i += 1
      }
      blocks.push({ type: "details", title: resolve(h4[1]), blocks: parseBlocks(inner, `${where} / ${h4[1]}`, resolve) })
      continue
    }
    if (line.startsWith("|")) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim())
        i += 1
      }
      if (tableLines.length < 2 || !DELIMITER_ROW.test(tableLines[1])) {
        throw new Error(`Malformed table in ${where}: the second line must be the |---| delimiter row`)
      }
      const headers = splitTableRow(tableLines[0])
      const rows = tableLines.slice(2).map((row, index) => {
        const cells = splitTableRow(row)
        if (cells.length !== headers.length) {
          throw new Error(
            `Table row ${index + 1} in ${where} has ${cells.length} cells; the header has ${headers.length}`,
          )
        }
        return cells.map(resolve)
      })
      blocks.push({ type: "table", table: { headers, rows } })
      continue
    }
    if (line.startsWith(">")) {
      const noteLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        noteLines.push(lines[i].trim().replace(/^>\s?/, ""))
        i += 1
      }
      blocks.push({ type: "note", text: resolve(noteLines.join(" ").replace(/^Note:\s*/i, "").trim()) })
      continue
    }
    const paragraph: string[] = []
    while (i < lines.length) {
      const next = lines[i].trim()
      if (!next || next.startsWith("|") || next.startsWith(">") || H4.test(next)) break
      paragraph.push(next)
      i += 1
    }
    blocks.push({ type: "paragraph", text: resolve(paragraph.join(" ")) })
  }
  return blocks
}

export interface ParseOptions {
  /** Network data files by network id; a network group that uses `@{key}` needs its file. */
  books?: Record<string, AddressBook>
  /** Collects every key the document uses, per network id. */
  usedKeys?: Map<string, Set<string>>
}

export function parseReferenceMarkdown(
  source: string,
  name = "reference",
  options: ParseOptions = {},
): ReferenceDocument {
  const { meta, rest } = parseFrontMatter(source.replace(/\r\n?/g, "\n").split("\n"))
  if (!meta.title) throw new Error(`${name}: front matter needs a title`)

  const introLines: string[] = []
  const groups: ReferenceGroup[] = []
  type RawGroup = { title: string; lines: string[]; sections: { title: string; lines: string[] }[] }
  let group: RawGroup | null = null
  const rawGroups: RawGroup[] = []

  for (const line of rest) {
    if (/^#\s/.test(line)) continue // the page title comes from front matter
    const h2 = line.match(/^##\s+(.+?)\s*$/)
    const h3 = line.match(/^###\s+(.+?)\s*$/)
    if (h2) {
      group = { title: h2[1], lines: [], sections: [] }
      rawGroups.push(group)
    } else if (h3) {
      if (!group) throw new Error(`${name}: section "${h3[1]}" appears before any ## group`)
      group.sections.push({ title: h3[1], lines: [] })
    } else if (!group) {
      introLines.push(line)
    } else if (group.sections.length > 0) {
      group.sections[group.sections.length - 1].lines.push(line)
    } else {
      group.lines.push(line)
    }
  }

  const networkSectionIds = new Set<string>()
  const usedIds = new Set<string>()
  for (const raw of rawGroups) {
    // A network group opens with a `- key: value` list.
    const groupMeta: Record<string, string> = {}
    let bodyStart = 0
    for (; bodyStart < raw.lines.length; bodyStart += 1) {
      const line = raw.lines[bodyStart].trim()
      if (!line && Object.keys(groupMeta).length === 0) continue
      const match = line.match(/^-\s+([A-Za-z][\w-]*):\s*(.+)$/)
      if (!match) break
      groupMeta[match[1]] = match[2].trim()
    }
    const book = groupMeta.network ? options.books?.[groupMeta.network] : undefined
    const network = parseNetwork(groupMeta, raw.title, book)
    let used: Set<string> | undefined
    if (network && options.usedKeys) {
      used = options.usedKeys.get(network.id) ?? new Set<string>()
      options.usedKeys.set(network.id, used)
    }
    const resolve: Resolve = (text) =>
      text.replace(KEY_REFERENCE, (_, key: string) => {
        if (!network || !book) {
          throw new Error(`${name} / ${raw.title}: @{${key}} needs a network group with a data file`)
        }
        const value = book.addresses[key]
        if (value === undefined) throw new Error(`${name} / ${raw.title}: @{${key}} is not in networks/${book.network}.json`)
        used?.add(key)
        return value
      })
    const groupId = network?.id ?? slugify(raw.title)
    const sections = raw.sections.map((section) => {
      let id = slugify(section.title)
      if (network) {
        networkSectionIds.add(id)
      } else {
        if (networkSectionIds.has(id) || usedIds.has(id)) id = `${groupId}-${id}`
        usedIds.add(id)
      }
      return { id, title: section.title, blocks: parseBlocks(section.lines, `${raw.title} / ${section.title}`, resolve) }
    })
    groups.push({
      id: groupId,
      title: raw.title,
      network,
      blocks: parseBlocks(network ? raw.lines.slice(bodyStart) : raw.lines, raw.title, resolve),
      sections,
    })
  }

  return {
    title: meta.title,
    description: meta.description ?? "",
    updated: meta.updated ?? "",
    intro: parseBlocks(introLines, `${name} intro`, (text) => {
      if (new RegExp(KEY_REFERENCE.source).test(text)) throw new Error(`${name} intro: @{key} needs a network group`)
      return text
    }),
    groups,
  }
}

/** Split a cell or paragraph into text, `code`, **strong** and [link](url) parts. */
export function parseInline(text: string): InlinePart[] {
  const parts: InlinePart[] = []
  const pattern = /`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g
  let last = 0
  for (const match of Array.from(text.matchAll(pattern))) {
    const index = match.index ?? 0
    if (index > last) parts.push({ type: "text", value: text.slice(last, index) })
    if (match[1] !== undefined) parts.push({ type: "code", value: match[1] })
    else if (match[4] !== undefined) parts.push({ type: "strong", value: match[4] })
    else parts.push({ type: "link", text: match[2], href: match[3] })
    last = index + match[0].length
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) })
  return parts
}
