import { createPageMetadata } from "@/lib/i18n/page-metadata"
import type { ReactNode } from "react"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return createPageMetadata(locale, "brand", "/brand", {
    keywords: ["Avana brand","logo assets","brand kit","cyan logo","identity guidelines"],
  })
}

export default function BrandLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
