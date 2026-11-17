import { Check } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { createPageMetadata } from "@/lib/i18n/page-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"
import { siteRoutes } from "@/lib/site"
import { SectionTitle } from "@/components/shared"

export async function generateMetadata({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return createPageMetadata(locale, "pricing", siteRoutes.pricing)
}

export default async function PricingPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  const t = await getTranslations({ locale, namespace: "pricing" })

  const feeCards = [
    {
      title: t("frontEnd.title"),
      subtitle: t("frontEnd.subtitle"),
      value: t("frontEnd.value"),
      unit: t("frontEnd.unit"),
      description: t("frontEnd.description"),
      items: [
        t("frontEnd.items.one"),
        t("frontEnd.items.two"),
        t("frontEnd.items.three"),
      ],
      featured: true,
    },
    {
      title: t("liquidation.title"),
      subtitle: t("liquidation.subtitle"),
      value: t("liquidation.value"),
      unit: t("liquidation.unit"),
      description: t("liquidation.description"),
      items: [
        t("liquidation.items.one"),
        t("liquidation.items.two"),
        t("liquidation.items.three"),
      ],
      featured: false,
    },
    {
      title: t("points.title"),
      subtitle: t("points.subtitle"),
      value: t("points.value"),
      unit: t("points.unit"),
      description: t("points.description"),
      items: [
        t("points.items.one"),
        t("points.items.two"),
        t("points.items.three"),
      ],
      featured: false,
    },
  ] as const

  const pricingFaqItems = [
    {
      question: t("faq.items.frontEndFee.question"),
      answer: t("faq.items.frontEndFee.answer"),
    },
    {
      question: t("faq.items.borrowRate.question"),
      answer: t("faq.items.borrowRate.answer"),
    },
    {
      question: t("faq.items.liquidationFee.question"),
      answer: t("faq.items.liquidationFee.answer"),
    },
    {
      question: t("faq.items.points.question"),
      answer: t("faq.items.points.answer"),
    },
    {
      question: t("faq.items.separateCosts.question"),
      answer: t("faq.items.separateCosts.answer"),
    },
  ] as const

  return (
    <div className="bg-background">
      <section className="pb-16 pt-16 md:pb-24 md:pt-20 lg:pt-24">
        <div className="site-content-shell">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <h1 className="text-[clamp(3.25rem,7vw,5.75rem)] font-normal leading-[0.95] tracking-[-0.065em] text-foreground">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-2xl text-[1.05rem] leading-7 tracking-[-0.02em] text-type-secondary md:text-[1.15rem]">
              <span>{t("subtitleLine1")}</span>
              <br className="sm:hidden" />{" "}
              <span>{t("subtitleLine2")}</span>
            </p>
            <div className="mt-8 inline-flex h-[43px] items-center rounded-full bg-[#01AACF] px-[1.35rem] text-base font-medium leading-none tracking-[-0.015em] text-white transition-colors hover:bg-[#00a0c2]">
              {t("interfaceRate")}
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-[76rem] gap-3 md:grid-cols-2 xl:mt-16 xl:grid-cols-3">
            {feeCards.map((card) => (
              <article
                key={card.title}
                className={`flex h-full flex-col rounded-xl p-5 shadow-none md:p-6 ${
                  card.featured
                    ? "bg-[#fafafa]"
                    : "bg-[#fafafa] text-foreground"
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

          <section className="mt-16 pt-16 md:mt-24 md:pt-24">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-6 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:gap-8">
              <div className="space-y-3 md:max-w-[25rem] md:pt-2">
                <SectionTitle variant="lead" className="max-w-none">
                  {t("faq.title")}
                </SectionTitle>
              </div>
              <div className="min-w-0 md:pl-16 lg:pl-24 xl:pl-28">
                <div className="w-full border-t border-gray-200">
                  {pricingFaqItems.map((item) => (
                    <details key={item.question} className="group border-b border-gray-200 py-6">
                      <summary className="flex cursor-pointer list-none items-center gap-4 text-left text-[1.05rem] font-medium leading-6 tracking-[-0.02em] text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
                        <span>{item.question}</span>
                        <span className="ml-auto shrink-0 text-2xl font-normal leading-none text-type-tertiary transition-transform duration-150 group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="max-w-2xl pt-3 text-[0.95rem] leading-7 text-type-secondary">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}
