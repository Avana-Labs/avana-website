import { hasLocale } from "next-intl"
import { type AppLocale, defaultLocale } from "@/i18n/locales"
import { routing } from "@/i18n/routing"

export type LocaleParams = { locale: string }
export type LocaleParamsProps = { params: Promise<LocaleParams> }

export async function resolveLocaleParam(
  params: Promise<LocaleParams>,
): Promise<AppLocale> {
  const { locale } = await params
  return hasLocale(routing.locales, locale) ? locale : defaultLocale
}
