import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ArrowUpRight } from "lucide-react"
import BuildTomorrowSection from "@/components/BuildTomorrowSection"
import HeroSection from "@/components/hero-section"
import WebappHero from "@/components/webapp-hero"
import { LocalizedMarketing } from "@/components/localized-marketing"
import { Link } from "@/i18n/navigation"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"
import { languageAlternates } from "@/lib/i18n/path"
import { buildOgImagePath, SITE_NAME, SITE_URL, siteRoutes } from "@/lib/site"

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
      canonical: siteRoutes.home,
      languages: languageAlternates(siteRoutes.home),
    },
    openGraph: {
      title: `${SITE_NAME} - ${t("home.title")}`,
      description: t("ogDescription"),
      url: SITE_URL,
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
    <LocalizedMarketing locale={locale} keys={["page","BuildTomorrowSection","hero-section","homepage/HomepageTestimonialSection","homepage/HomepageFaqSection","homepage/HomepageNewsroomSection","webapp-hero"]}>
      <section className="bg-background">
        <div className="site-content-shell pt-14 md:pt-24 lg:pt-28">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-12 lg:gap-16">
            <h1 className="text-[clamp(2.15rem,3.9vw,3.15rem)] leading-[1.12] tracking-[-0.04em] md:flex-1">
              <span className="block font-medium text-foreground">
                {t("hero.titleLine1")}
              </span>
              <span className="mt-1 block font-normal text-type-secondary">
                {t("hero.titleLine2")}
              </span>
            </h1>

            <div className="flex w-full max-w-[24rem] shrink-0 flex-col gap-5 md:-translate-x-10 md:pt-1 lg:-translate-x-16">
              <p className="text-[0.98rem] leading-[1.55] text-type-secondary md:text-[1.05rem]">
                {t("hero.subtitle")}
              </p>
              <div>
                <Link
                  href="https://app.avana.cc"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-[#01AACF] px-3.5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#00a0c2]"
                >
                  {t("hero.primaryCta")}
                  <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="site-content-shell mt-6 md:mt-7 lg:mt-8">
          <WebappHero locale={locale} />
        </div>
      </section>

      <BuildTomorrowSection locale={locale} />
      <HeroSection locale={locale} />
    </LocalizedMarketing>
  )
}
