/**
 * Server wrapper that localizes developer doc bodies without rewriting every page.
 */
import type { AppLocale } from "@/i18n/locales"
import { LocalizeStrings } from "@/components/localize-strings"
import { docsPageKeyFromPath, getDocsStringMap } from "@/lib/content-i18n/load-content"

export async function LocalizedDocBody({
  locale,
  pageKey,
  children,
}: {
  locale: AppLocale
  pageKey?: string
  children: React.ReactNode
}) {
  const key = pageKey ?? "hub"
  const map = await getDocsStringMap(locale, key)
  return <LocalizeStrings map={map}>{children}</LocalizeStrings>
}

export { docsPageKeyFromPath }
