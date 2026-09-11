import { readFile } from "fs/promises"
import { join } from "path"
import { defaultLocale, isAppLocale, type AppLocale } from "@/i18n/locales"

type Json = Record<string, unknown>

const contentCache = new Map<string, Json>()

async function loadJson(locale: string, name: string): Promise<Json | null> {
  const key = `${locale}:${name}`
  if (contentCache.has(key)) {
    return contentCache.get(key)!
  }

  try {
    const path = join(process.cwd(), "content", locale, `${name}.json`)
    const raw = await readFile(path, "utf8")
    const data = JSON.parse(raw) as Json
    contentCache.set(key, data)
    return data
  } catch {
    if (locale !== defaultLocale) {
      return loadJson(defaultLocale, name)
    }
    return null
  }
}

export async function getContentLocale(locale: string): Promise<AppLocale> {
  return isAppLocale(locale) ? locale : defaultLocale
}

export async function loadFaqContent(locale: string) {
  const data = await loadJson(locale, "faq")
  if (!data) {
    throw new Error("Missing FAQ content")
  }
  return data as {
    categories: Array<{
      id: string
      name: string
      summary: string
      questions: Array<{ id: string; q: string; a: string }>
    }>
  }
}

export async function loadBlogContent(locale: string) {
  const data = await loadJson(locale, "blog")
  if (!data) {
    throw new Error("Missing blog content")
  }
  const parsed = data as {
    posts: Array<{
      slug: string
      title: string
      date: string
      description: string
      image: string
      category: string
      tag: string
      sections: Array<{
        id: string
        eyebrow?: string
        title?: string
        paragraphs: string[]
      }>
    }>
  }

  // Routes always use English slugs. Translator UIs often rewritten slugs —
  // restore EN slugs by post order so lookups and links stay stable.
  if (locale !== defaultLocale) {
    try {
      const enData = await loadJson(defaultLocale, "blog")
      const enPosts =
        (enData as {
          posts?: Array<{
            slug: string
            image?: string
            tag?: string
            sections?: Array<{ id: string }>
          }>
        } | null)?.posts ?? []
      parsed.posts = parsed.posts.map((post, index) => {
        const enPost = enPosts[index]
        if (!enPost) return post
        return {
          ...post,
          slug: enPost.slug,
          image: enPost.image ?? post.image,
          // Tags are stable identifiers translated by the UI. Translation
          // catalogs may localize their display values, which must not become
          // lookup keys or filter values.
          tag: enPost.tag ?? post.tag,
          sections: post.sections.map((section, sIndex) => ({
            ...section,
            id: enPost.sections?.[sIndex]?.id ?? section.id,
          })),
        }
      })
    } catch {
      // keep translated as-is if EN missing
    }
  }

  return parsed
}

export async function loadDocsContent(locale: string) {
  const data = await loadJson(locale, "docs")
  if (!data) {
    throw new Error("Missing docs content")
  }
  return data as Record<
    string,
    {
      meta: { title: string; description: string }
      toc: Array<{ id: string; title: string }>
      strings: string[]
    }
  >
}

export async function loadLegalContent(locale: string) {
  const data = await loadJson(locale, "legal")
  if (!data) {
    throw new Error("Missing legal content")
  }
  return data as {
    privacy: {
      title: string
      toc: Array<{ id: string; title: string }>
      paragraphs: string[]
      strings?: string[]
    }
    terms: {
      title: string
      toc: Array<{ id: string; title: string }>
      paragraphs: string[]
      strings?: string[]
    }
  }
}

export async function getLegalStringMap(
  locale: string,
  kind: "privacy" | "terms",
): Promise<Record<string, string>> {
  if (locale === defaultLocale) return {}
  const [en, loc] = await Promise.all([loadLegalContent(defaultLocale), loadLegalContent(locale)])
  const enPage = en[kind]
  const locPage = loc[kind]
  if (!enPage || !locPage) return {}
  const map: Record<string, string> = {}
  if (enPage.title && locPage.title) map[enPage.title] = locPage.title
  for (let i = 0; i < Math.min(enPage.toc.length, locPage.toc.length); i++) {
    map[enPage.toc[i].title] = locPage.toc[i].title
  }
  for (let i = 0; i < Math.min(enPage.paragraphs.length, locPage.paragraphs.length); i++) {
    map[enPage.paragraphs[i]] = locPage.paragraphs[i]
  }
  const enStrings = enPage.strings ?? []
  const locStrings = locPage.strings ?? []
  for (let i = 0; i < Math.min(enStrings.length, locStrings.length); i++) {
    const e = enStrings[i]
    const t = locStrings[i]
    map[e] = t
    map[e.trim()] = t
    map[e.trim().replace(/\s+/g, " ")] = t
  }
  return map
}

function putPhrase(map: Record<string, string>, from: string, to: string) {
  if (!from || !to || from === to) return
  map[from] = to
  map[from.trim()] = to
  map[from.trim().replace(/\s+/g, " ")] = to
}

function mergeDocsPageMap(
  map: Record<string, string>,
  enPage: {
    meta: { title: string; description: string }
    toc: Array<{ id: string; title: string }>
    strings: string[]
  },
  locPage: {
    meta: { title: string; description: string }
    toc: Array<{ id: string; title: string }>
    strings: string[]
  },
) {
  const n = Math.min(enPage.strings.length, locPage.strings.length)
  for (let i = 0; i < n; i++) {
    putPhrase(map, enPage.strings[i], locPage.strings[i])
  }
  if (enPage.meta.title && locPage.meta.title) {
    putPhrase(map, enPage.meta.title, locPage.meta.title)
  }
  if (enPage.meta.description && locPage.meta.description) {
    putPhrase(map, enPage.meta.description, locPage.meta.description)
  }
  for (let i = 0; i < Math.min(enPage.toc.length, locPage.toc.length); i++) {
    putPhrase(map, enPage.toc[i].title, locPage.toc[i].title)
  }
}

/** Build EN string → localized string map for a docs page. */
export async function getDocsStringMap(locale: string, pageKey: string): Promise<Record<string, string>> {
  if (locale === defaultLocale) return {}
  const [en, loc] = await Promise.all([loadDocsContent(defaultLocale), loadDocsContent(locale)])
  const map: Record<string, string> = {}

  // Shared phrases provide a fallback. Merge the active page last so its
  // translations win when a phrase has a page-specific meaning.
  const orderedKeys = [
    ...Object.keys(en).filter((key) => key !== pageKey),
    pageKey,
  ]
  for (const key of orderedKeys) {
    const enPage = en[key]
    const locPage = loc[key]
    if (!enPage || !locPage) continue
    mergeDocsPageMap(map, enPage, locPage)
  }
  return map
}

export async function loadMarketingContent(locale: string) {
  const data = await loadJson(locale, "marketing")
  if (!data) {
    throw new Error("Missing marketing content")
  }
  return data as Record<string, { strings: string[] }>
}

/** Build EN → locale map for a marketing file key (path-like id). */
export async function getMarketingStringMap(
  locale: string,
  pageKey: string,
): Promise<Record<string, string>> {
  if (locale === defaultLocale) return {}
  const [en, loc] = await Promise.all([
    loadMarketingContent(defaultLocale),
    loadMarketingContent(locale),
  ])
  const enPage = en[pageKey]
  const locPage = loc[pageKey]
  if (!enPage || !locPage) return {}
  const map: Record<string, string> = {}
  const n = Math.min(enPage.strings.length, locPage.strings.length)
  for (let i = 0; i < n; i++) {
    const en = enPage.strings[i]
    const tr = locPage.strings[i]
    map[en] = tr
    map[en.trim()] = tr
    map[en.trim().replace(/\s+/g, " ")] = tr
  }
  return map
}

/** Merge string maps for multiple marketing sections. */
export async function getMarketingMaps(
  locale: string,
  pageKeys: string[],
): Promise<Record<string, string>> {
  if (locale === defaultLocale) return {}
  // Load the requested section keys plus every other catalog section so shared
  // components and missed wrappers still localize.
  const [en] = await Promise.all([loadMarketingContent(defaultLocale)])
  const allKeys = Array.from(new Set([...pageKeys, ...Object.keys(en)]))
  const maps = await Promise.all(allKeys.map((key) => getMarketingStringMap(locale, key)))
  return Object.assign({}, ...maps)
}

export function docsPageKeyFromPath(pathname: string): string {
  const stripped = pathname.replace(/^\/developers\/?/, "")
  if (!stripped) return "hub"
  return stripped
}
