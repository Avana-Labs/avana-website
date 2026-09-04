import type { ReactNode } from "react"
import type { AppLocale } from "@/i18n/locales"
import { localizeTree } from "@/components/localize-strings"
import { defaultLocale } from "@/i18n/locales"
import { getMarketingMaps } from "@/lib/content-i18n/load-content"

/**
 * Apply marketing phrase maps inside the component/page that owns the JSX.
 *
 * Parent wrappers cannot rewrite nested Server Component output (or
 * client-boundary props), so each contentful section must call this around
 * its own tree — same pattern as withDocsI18n.
 */
export async function withMarketingI18n(
  locale: AppLocale,
  keys: string[],
  node: ReactNode,
): Promise<ReactNode> {
  if (locale === defaultLocale) return node
  const map = await getMarketingMaps(locale, keys)
  if (!map || Object.keys(map).length === 0) return node
  return localizeTree(node, map)
}
