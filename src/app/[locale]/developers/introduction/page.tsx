import { redirect } from "@/i18n/navigation"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export default async function IntroductionRedirectPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  redirect({ href: "/developers", locale })
}
