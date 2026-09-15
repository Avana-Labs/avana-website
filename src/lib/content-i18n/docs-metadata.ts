import type { Metadata } from "next"
import type { AppLocale } from "@/i18n/locales"
import { defaultLocale } from "@/i18n/locales"
import { loadDocsContent } from "@/lib/content-i18n/load-content"
import { absoluteLocaleUrl, languageAlternates } from "@/lib/i18n/path"
import { buildOgImagePath } from "@/lib/site"

/**
 * Locale-aware docs <title> / description from content/{locale}/docs.json meta.
 */
export async function createDocsMetadata(
  locale: AppLocale,
  pageKey: string,
  fallback: { title: string; description: string },
): Promise<Metadata> {
  let { title, description } = fallback
  if (locale !== defaultLocale) {
    try {
      const docs = await loadDocsContent(locale)
      const page = docs[pageKey]
      title = page?.meta?.title || title
      description = page?.meta?.description || description
    } catch {
      // Preserve the English content fallback, but never the parent URL.
    }
  }

  const path = `/developers/${pageKey}`
  const url = absoluteLocaleUrl(locale, path)
  const image = buildOgImagePath({ title, subtitle: description, type: "developers" })
  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: { title, description, url, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  }
}
