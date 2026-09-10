import type { AppLocale } from "@/i18n/locales"
import { LocalizeStrings } from "@/components/localize-strings"
import { getLegalStringMap } from "@/lib/content-i18n/load-content"

export async function LocalizedLegal({
  locale,
  kind,
  children,
}: {
  locale: AppLocale
  kind: "privacy" | "terms"
  children: React.ReactNode
}) {
  const map = await getLegalStringMap(locale, kind)
  return <LocalizeStrings map={map}>{children}</LocalizeStrings>
}
