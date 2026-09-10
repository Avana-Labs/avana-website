import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import type { AppLocale } from "@/i18n/locales"
import { languageAlternates } from "@/lib/i18n/path"
import { buildOgImagePath } from "@/lib/site"

type MetaKey =
  | "about"
  | "borrow"
  | "lend"
  | "multiply"
  | "brand"
  | "faq"
  | "newsroom"
  | "developers"
  | "privacy"
  | "terms"

/**
 * Locale-aware page metadata from messages.meta.* keys.
 */
export async function createPageMetadata(
  locale: AppLocale,
  key: MetaKey,
  path: string,
  options?: {
    keywords?: string[]
    ogType?: "default" | "blog" | "developers" | "faq"
    titleTemplate?: string | null
  },
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" })
  const title = t(`${key}.title`)
  const description = t(`${key}.description`)
  const ogImage = buildOgImagePath({
    title,
    subtitle: description,
    type: options?.ogType,
  })

  const meta: Metadata = {
    title: options?.titleTemplate === null ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
      languages: languageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url: path,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }

  if (options?.keywords?.length) {
    meta.keywords = options.keywords
  }

  return meta
}
