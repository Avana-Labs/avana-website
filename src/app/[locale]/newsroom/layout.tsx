import { createPageMetadata } from "@/lib/i18n/page-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export const dynamic = "force-static"

/**
 * Newsroom section layout with SEO metadata
 */
export async function generateMetadata({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return createPageMetadata(locale, "newsroom", "/newsroom", { ogType: "blog" })
}

export default function NewsroomLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
