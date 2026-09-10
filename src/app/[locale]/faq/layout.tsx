import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { buildFaqSchema } from "@/app/[locale]/faq/faq-content"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"
import { languageAlternates } from "@/lib/i18n/path"
import { buildOgImagePath, siteRoutes } from "@/lib/site"
import { serializeJsonLd } from "@/lib/structured-data"

export const dynamic = "force-static"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  const t = await getTranslations({ locale, namespace: "meta" })

  return {
    title: t("faq.title"),
    description: t("faq.description"),
    alternates: {
      canonical: siteRoutes.faq,
      languages: languageAlternates(siteRoutes.faq),
    },
    openGraph: {
      title: t("faq.title"),
      url: siteRoutes.faq,
      description: t("faq.description"),
      images: [
        buildOgImagePath({
          title: t("faq.title"),
          subtitle: t("faq.description"),
          type: "faq",
        }),
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [
        buildOgImagePath({
          title: t("faq.title"),
          subtitle: t("faq.description"),
          type: "faq",
        }),
      ],
    },
  }
}

export default async function FaqLayout({
  children,
  params,
}: LocaleParamsProps & { children: React.ReactNode }) {
  const locale = await resolveLocaleParam(params)
  const schema = await buildFaqSchema(locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
      />
      {children}
    </>
  )
}
