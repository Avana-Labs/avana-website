import type { AppLocale } from "@/i18n/locales"
import { LocalizeStrings } from "@/components/localize-strings"
import { PhraseMapProvider } from "@/components/phrase-map-context"
import { defaultLocale } from "@/i18n/locales"
import { getMarketingMaps } from "@/lib/content-i18n/load-content"

/**
 * Localizes marketing page trees using exact phrase maps from
 * content/{locale}/marketing.json.
 *
 * - Server LocalizeStrings rewrites inline string leaves in this slot only.
 * - PhraseMapProvider feeds client islands (APY stages, calculators, FAQs).
 * Nested Server Components still need withMarketingI18n around their own JSX.
 */
export async function LocalizedMarketing({
  locale,
  keys,
  children,
}: {
  locale: AppLocale
  keys: string[]
  children: React.ReactNode
}) {
  if (locale === defaultLocale) {
    return <>{children}</>
  }
  const map = await getMarketingMaps(locale, keys)
  return (
    <PhraseMapProvider map={map}>
      <LocalizeStrings map={map}>{children}</LocalizeStrings>
    </PhraseMapProvider>
  )
}
