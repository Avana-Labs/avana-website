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

  const pricingFaqItems = [
    {
      question: t("faq.items.interfaceFee.question"),
      answer: t("faq.items.interfaceFee.answer"),
    },
    {
      question: t("faq.items.borrowRate.question"),
      answer: t("faq.items.borrowRate.answer"),
    },
    {
      question: t("faq.items.lendingApy.question"),
      answer: t("faq.items.lendingApy.answer"),
    },
    {
      question: t("faq.items.separateCosts.question"),
      answer: t("faq.items.separateCosts.answer"),
    },
    {
      question: t("faq.items.feeChanges.question"),
      answer: t("faq.items.feeChanges.answer"),
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
                className={`flex min-h-[35rem] flex-col rounded-xl border p-5 md:min-h-[38rem] md:p-6 ${
                  card.featured
                    ? "border-foreground/15 bg-[#fafafa]"
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
    </main>
  )
}
