import { Check } from "lucide-react"
import { getTranslations } from "next-intl/server"
import HomepageFaqSection from "@/components/homepage/HomepageFaqSection"
import { LocalizedMarketing } from "@/components/localized-marketing"
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
      featured: false,
    },
  ] as const

  return (
    <LocalizedMarketing locale={locale} keys={["homepage/HomepageFaqSection"]}>
      <main className="bg-background">
      <section className="px-4 pb-16 pt-16 sm:px-6 md:pb-24 md:pt-20 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-[92rem]">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <h1 className="text-[clamp(3.25rem,7vw,5.75rem)] font-normal leading-[0.95] tracking-[-0.065em] text-foreground">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-2xl text-[1.05rem] leading-7 tracking-[-0.02em] text-type-secondary md:text-[1.15rem]">
              <span>{t("subtitleLine1")}</span>
              <br className="sm:hidden" />{" "}
              <span>{t("subtitleLine2")}</span>
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
                    ? "border-foreground/15 bg-[#fafafa] shadow-[0_16px_36px_-28px_rgba(15,21,24,0.55)]"
                    : "border-border/70 bg-[#fafafa] text-foreground"
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

              </article>
            ))}
          </div>

          <section className="mt-16 border-t border-border/80 pt-16 md:mt-24 md:pt-24">
            <HomepageFaqSection />
          </section>
        </div>
      </section>
      </main>
    </LocalizedMarketing>
  )
}
