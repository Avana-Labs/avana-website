import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react"

function normalizePhrase(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2212]/g, "-") // dash variants → hyphen
    .replace(/&nbsp;/g, " ")
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
}

function lookup(map: Record<string, string>, value: string): string {
  if (!value) return value
  if (map[value]) return map[value]
  const trimmed = value.trim()
  if (map[trimmed]) return map[trimmed]
  const collapsed = trimmed.replace(/\s+/g, " ")
  if (map[collapsed]) return map[collapsed]
  const normalized = normalizePhrase(value)
  if (map[normalized]) return map[normalized]
  // also try map keys normalized (build reverse once would be better; linear fallback)
  for (const [from, to] of Object.entries(map)) {
    if (normalizePhrase(from) === normalized) return to
  }
  return value
}

/** Longest-phrase first replacement for composed attrs like aria-label templates. */
function lookupComposed(map: Record<string, string>, value: string): string {
  const exact = lookup(map, value)
  if (exact !== value) return exact

  let out = normalizePhrase(value)
  const entries = Object.entries(map)
    .filter(([from, to]) => from && to && from !== to && from.length >= 10)
    .sort((a, b) => b[0].length - a[0].length)

  for (const [from, to] of entries) {
    const fromN = normalizePhrase(from)
    if (!fromN || fromN.length < 10) continue
    if (out.includes(fromN)) {
      out = out.split(fromN).join(to)
    }
  }
  return out === normalizePhrase(value) ? value : out
}

/**
 * Recursively swap exact English string leaves (and common a11y props) using a
 * phrase map. Used for long-form docs/marketing that remain authored in English JSX.
 */
export function localizeTree(node: ReactNode, map: Record<string, string>): ReactNode {
  if (!map || Object.keys(map).length === 0) return node

  if (typeof node === "string") {
    return lookup(map, node)
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => {
      const next = localizeTree(child, map)
      return isValidElement(next) ? cloneElement(next, { key: next.key ?? index }) : next
    })
  }

  if (!isValidElement(node)) {
    return node
  }

  const element = node as ReactElement<{
    children?: ReactNode
    title?: string
    description?: string
    alt?: string
    "aria-label"?: string
    placeholder?: string
    pageSummary?: string
    subtitle?: string
    label?: string
    summary?: string
  }>

  const nextProps: Record<string, unknown> = { ...element.props }
  for (const prop of [
    "title",
    "description",
    "alt",
    "aria-label",
    "placeholder",
    "pageSummary",
    "subtitle",
    "label",
    "summary",
  ] as const) {
    const value = element.props[prop]
    if (typeof value === "string") {
      nextProps[prop] =
        prop === "aria-label" || prop === "title" || prop === "alt"
          ? lookupComposed(map, value)
          : lookup(map, value)
    } else if (
      (prop === "title" ||
        prop === "description" ||
        prop === "subtitle" ||
        prop === "label" ||
        prop === "summary" ||
        prop === "pageSummary") &&
      (Array.isArray(value) || isValidElement(value))
    ) {
      // Content props can also be JSX (e.g. a multi-line hero title); recurse
      // so their text leaves are swapped like children are.
      nextProps[prop] = localizeTree(value, map)
    }
  }

  if ("children" in element.props) {
    nextProps.children = localizeTree(element.props.children, map)
  }

  // Deep-localize common content object props (TOC / FAQs / rails).
  for (const prop of ["sections", "items", "toc", "links", "cards"] as const) {
    const value = (element.props as Record<string, unknown>)[prop]
    if (Array.isArray(value)) {
      nextProps[prop] = value.map((entry) => {
        if (!entry || typeof entry !== "object") return entry
        const obj = entry as Record<string, unknown>
        const next = { ...obj }
        for (const key of ["title", "label", "name", "question", "answer", "description", "summary", "eyebrow"]) {
          if (typeof obj[key] === "string") {
            next[key] = lookup(map, obj[key] as string)
          }
        }
        return next
      })
    }
  }

  return cloneElement(element, nextProps)
}

export function LocalizeStrings({
  map,
  children,
}: {
  map: Record<string, string>
  children: ReactNode
}) {
  return <>{localizeTree(Children.toArray(children), map)}</>
}
