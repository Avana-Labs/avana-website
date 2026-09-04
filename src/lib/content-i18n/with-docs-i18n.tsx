import type { ReactNode } from "react"
import type { AppLocale } from "@/i18n/locales"
import { localizeTree } from "@/components/localize-strings"
import { defaultLocale } from "@/i18n/locales"
import { getDocsStringMap } from "@/lib/content-i18n/load-content"

/**
 * Apply docs phrase map inside the page module (not layout {children}),
 * so React Server Components can walk the real JSX tree at SSG time.
 */
export async function withDocsI18n(
  locale: AppLocale,
  pageKey: string,
  node: ReactNode,
): Promise<ReactNode> {
  if (locale === defaultLocale) return node
  const map = await getDocsStringMap(locale, pageKey)
  if (!map || Object.keys(map).length === 0) return node
  return localizeTree(node, map)
}
