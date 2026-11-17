import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ArrowRight } from "lucide-react"
import HeroSection from "@/components/hero-section"
import WebappHero from "@/components/webapp-hero"
import LineFieldCanvas from "@/components/line-field-canvas"
import { TrustedBySection } from "@/components/trusted-by-section"
import { AvanaProductsSection } from "@/components/avana-products-section"
import { TryAvanaCtaSection } from "@/components/try-avana-cta-section"
import { LocalizedMarketing } from "@/components/localized-marketing"
import { Link } from "@/i18n/navigation"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"
import { absoluteLocaleUrl, languageAlternates } from "@/lib/i18n/path"
import { buildOgImagePath, SITE_NAME, siteRoutes } from "@/lib/site"

export const dynamic = "force-static"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  const t = await getTranslations({ locale, namespace: "meta" })

  return {
    title: t("home.title"),
    description: t("home.description"),
    keywords: [
      "LP collateral",
      "borrow against LP positions",
      "Aave v4",
      "DeFi lending",
      "liquidity provider loans",
      "AMM collateral",
    ],
    alternates: {
      canonical: absoluteLocaleUrl(locale, siteRoutes.home),
      languages: languageAlternates(siteRoutes.home),
    },
    openGraph: {
      type: "website",
      title: `${SITE_NAME} - ${t("home.title")}`,
      description: t("ogDescription"),
      url: absoluteLocaleUrl(locale, siteRoutes.home),
      images: [
        {
          url: buildOgImagePath({
            title: SITE_NAME,
            subtitle: t("ogSubtitle"),
          }),
          alt: t("ogAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
      images: [
        buildOgImagePath({
          title: SITE_NAME,
          subtitle: t("ogSubtitle"),
        }),
      ],
    },
  }
}

export default async function Home({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  const t = await getTranslations({ locale, namespace: "home" })

  return (
    <LocalizedMarketing locale={locale} keys={["page","avana-products-section","hero-section","homepage/HomepageFaqSection","homepage/HomepageNewsroomSection","webapp-hero"]}>
      <section className="relative isolate overflow-hidden bg-background">
        <LineFieldCanvas className="pointer-events-none absolute inset-0 -z-10 hidden h-full w-full sm:block" />
        {/* Phones keep the left-aligned layout with the app image; sm and up center the
            headline over the line field. */}
        <div className="site-content-shell pt-14 sm:flex sm:min-h-[38rem] sm:flex-col sm:items-center sm:pb-[19rem] sm:text-center md:min-h-[44rem] md:pt-32 lg:min-h-[48rem] lg:pt-44">
          <div className="max-w-[40rem] sm:flex sm:max-w-none sm:flex-col sm:items-center">
            <h1 className="text-[1.875rem] leading-[1.25] tracking-[-0.0125em] text-foreground max-sm:text-balance sm:text-[2.375rem] sm:leading-[1.1] sm:tracking-[-0.03em] sm:[font-variation-settings:'wght'_350] md:text-[2.75rem] lg:text-[3rem]">
              <span className="sm:hidden">{t("hero.titleLine1Mobile")}</span>
              <span className="hidden text-type-accent sm:inline">{t("hero.titleLine1")}</span>
              <br />
              <span className="text-type-secondary sm:hidden">{t("hero.titleLine2Mobile")}</span>
              <span className="hidden text-type-secondary sm:inline">{t("hero.titleLine2")}</span>
            </h1>

            <div className="mt-[1.4rem] flex flex-wrap items-center gap-x-2.5 gap-y-2 sm:mt-7 sm:justify-center">
              <Link
                href="https://governance.aave.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-[43px] items-center gap-1.5 rounded-full bg-[#01AACF] px-[1.35rem] text-base leading-none text-white transition-colors hover:bg-[#00a0c2]"
              >
                {t("hero.primaryCta")}
                <ArrowRight className="h-4 w-4 stroke-[1.75] rtl:rotate-180" aria-hidden />
              </Link>
              <Link
                href="https://app.avana.cc"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-[43px] items-center gap-1.5 rounded-full bg-black/[0.06] px-[1.35rem] text-base leading-none text-foreground transition-colors hover:bg-black/[0.1]"
              >
                {t("hero.secondaryCta")}
                <ArrowRight className="h-4 w-4 stroke-[1.75] rtl:rotate-180" aria-hidden />
              </Link>
            </div>
          </div>
        </div>

        <div className="site-content-shell mt-6 sm:hidden">
          <WebappHero locale={locale} mobileOnly />
        </div>
      </section>

      <TrustedBySection caption={t("trustedBy.caption")} />

      <AvanaProductsSection locale={locale} />

      <HeroSection locale={locale} />

      <TryAvanaCtaSection
        title={t.has("cta.title") ? t("cta.title") : "Try Avana now."}
        primaryCta={t("hero.primaryCta")}
        secondaryCta={t("hero.secondaryCta")}
      />
    </LocalizedMarketing>
  )
}
