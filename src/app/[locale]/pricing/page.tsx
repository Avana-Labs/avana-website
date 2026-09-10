import { ArrowUpRight, Check } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { createPageMetadata } from "@/lib/i18n/page-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"
import { siteRoutes } from "@/lib/site"

export async function generateMetadata({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return createPageMetadata(locale, "pricing", siteRoutes.pricing)
}

export default async function PricingPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  const t = await getTranslations({ locale, namespace: "pricing" })

  const feeCards = [
    {
      title: t("borrow.title"),
      subtitle: t("borrow.subtitle"),
      value: t("borrow.value"),
      unit: t("borrow.unit"),
      description: t("borrow.description"),
      items: [
        t("borrow.items.one"),
        t("borrow.items.two"),
        t("borrow.items.three"),
      ],
      cta: t("borrow.cta"),
      href: "/developers/getting-started/borrow-assets",
      featured: true,
    },
    {
      title: t("lend.title"),
      subtitle: t("lend.subtitle"),
      value: t("lend.value"),
      unit: t("lend.unit"),
      description: t("lend.description"),
      items: [
        t("lend.items.one"),
        t("lend.items.two"),
        t("lend.items.three"),
      ],
      cta: t("lend.cta"),
      href: "/developers/architecture/lend-spoke",
      featured: false,
    },
    {
      title: t("multiply.title"),
      subtitle: t("multiply.subtitle"),
      value: t("multiply.value"),
      unit: t("multiply.unit"),
      description: t("multiply.description"),
      items: [
        t("multiply.items.one"),
        t("multiply.items.two"),
        t("multiply.items.three"),
      ],
      cta: t("multiply.cta"),
      href: siteRoutes.multiply,
      featured: false,
    },
    {
      title: t("interface.title"),
      subtitle: t("interface.subtitle"),
      value: t("interface.value"),
      unit: t("interface.unit"),
      description: t("interface.description"),
      items: [
        t("interface.items.one"),
        t("interface.items.two"),
        t("interface.items.three"),
      ],
      cta: t("interface.cta"),
      href: "/developers/architecture/platform-fees",
      featured: false,
    },
  ] as const

  return (
    <main className="bg-background">
      <section className="px-4 pb-16 pt-16 sm:px-6 md:pb-24 md:pt-20 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-[92rem]">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <h1 className="text-[clamp(3.25rem,7vw,5.75rem)] font-normal leading-[0.95] tracking-[-0.065em] text-foreground">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-2xl text-[1.05rem] leading-7 tracking-[-0.02em] text-type-secondary md:text-[1.15rem]">
              {t("subtitle")}
            </p>
            <div className="mt-8 inline-flex items-center rounded-full border border-border bg-muted/60 px-5 py-2.5 text-[0.95rem] font-medium tracking-[-0.015em] text-foreground shadow-[0_8px_24px_-18px_rgba(15,21,24,0.45)]">
              {t("interfaceRate")}
            </div>
          </div>

          <div className="mt-14 grid gap-3 md:grid-cols-2 xl:mt-16 xl:grid-cols-4">
            {feeCards.map((card) => (
              <article
                key={card.title}
                className={`flex min-h-[35rem] flex-col rounded-xl border p-5 md:min-h-[38rem] md:p-6 ${
                  card.featured
                    ? "border-foreground/15 bg-[#f0efec] shadow-[0_16px_36px_-28px_rgba(15,21,24,0.55)]"
                    : "border-border/70 bg-[#f4f3f0] text-foreground"
                }`}
              >
                <div>
                  <h2 className="text-[1.45rem] font-medium tracking-[-0.035em]">{card.title}</h2>
                  <p className="mt-1 text-[0.95rem] text-type-tertiary">
                    {card.subtitle}
                  </p>
                </div>

                <div className="mt-8 flex items-baseline gap-2 border-b border-current/10 pb-7">
                  <span className="text-[clamp(2.35rem,3.5vw,3.35rem)] font-normal leading-none tracking-[-0.06em]">
                    {card.value}
                  </span>
                  <span className="text-[0.95rem] text-type-tertiary">
                    {card.unit}
                  </span>
                </div>

                <div className="mt-7">
                  <p className="text-[0.95rem] leading-6 text-type-secondary">
                    {card.description}
                  </p>
                  <p className="mt-8 text-sm font-medium text-type-tertiary">
                    {t("includes")}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[0.98rem] leading-6">
                        <Check
                          className="mt-1 h-4 w-4 shrink-0 text-foreground"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={card.href}
                  className={`group mt-auto inline-flex h-11 w-fit items-center gap-2 rounded-full px-5 text-[0.95rem] font-medium transition-[background-color,color,transform] duration-200 hover:-translate-y-0.5 ${
                    card.featured
                      ? "bg-background text-foreground hover:bg-type-accent hover:text-foreground"
                      : "bg-foreground/[0.08] text-foreground hover:bg-foreground hover:text-background"
                  }`}
                >
                  {card.cta}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-4 text-center md:mt-16">
            <p className="text-[1.05rem] leading-7 tracking-[-0.02em] text-type-secondary">{t("moreInfo")}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href={siteRoutes.faq}
                className="inline-flex h-11 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-type-accent hover:text-foreground"
              >
                {t("faqCta")}
              </Link>
              <Link
                href={siteRoutes.developers}
                className="inline-flex h-11 items-center rounded-full border border-border px-5 text-sm font-medium text-foreground transition-colors hover:border-type-accent hover:text-type-accent"
              >
                {t("docsCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
