import Image from "next/image"
import { FaqToggleIcons } from "@/components/faq-toggle-icons"
import { MarketingLeadHeader } from "@/components/marketing-lead-header"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { AppLocale } from "@/i18n/locales"
import { withMarketingI18n } from "@/lib/content-i18n/with-marketing-i18n"

const valuationItems = [
  {
    number: "01",
    title: "Pool-specific scoring",
    description:
      "Borrowing power is risk-scored with pool logic that reflects volatility, depth, and market behavior.",
  },
  {
    number: "02",
    title: "Real AMM behaviour",
    description:
      "Collateral rules track real pool structure and exposure so credit stays tied to your live position.",
  },
  {
    number: "03",
    title: "Shared Hub liquidity",
    description:
      "Borrowing capacity comes from shared Hub liquidity while your LP stays productive in the pool.",
  },
  {
    number: "04",
    title: "Dual-oracle pricing",
    description:
      "Dual-oracle pricing keeps marks robust as markets move so collateral value stays credible over time.",
  },
  {
    number: "05",
    title: "Active risk controls",
    description:
      "Health monitoring and venue-aware liquidation protect standards while your exposure keeps earning fees.",
  },
] as const

export default async function BorrowValuationSection({ locale }: { locale: AppLocale }) {
  return withMarketingI18n(locale, ["borrow/page"], (
    <section className="bg-white site-section-gap">
      <div className="site-content-shell">
        <div className="mx-auto w-full max-w-[76rem]">
          <MarketingLeadHeader
            className="max-w-none [&_.type-md-lg]:text-wrap!"
            title="Your borrowing limit follows the pool"
            subtitle="Live valuation and dual-oracle checks account for changing LP conditions."
          />

          <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-12 lg:gap-16 xl:gap-20">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-[20rem] sm:max-w-[24rem] lg:max-w-[28rem]">
                <Image
                  src="/images/avana-combine-coins.png"
                  alt="Avana combine LP positions illustration"
                  width={1024}
                  height={1024}
                  className="h-auto w-full"
                  sizes="(min-width: 1024px) 28rem, (min-width: 640px) 24rem, 20rem"
                />
              </div>
            </div>

            <div className="min-w-0">
              <Accordion
                type="single"
                collapsible
                defaultValue="pool-specific-scoring"
                orientation="vertical"
                className="w-full"
              >
                {valuationItems.map((item) => (
                  <AccordionItem
                    key={item.title}
                    value={item.title.toLowerCase().replaceAll(" ", "-")}
                    className="border-b border-border py-6 first:border-t last:border-b"
                  >
                    <AccordionTrigger className="type-card-title group p-0 text-left text-foreground hover:no-underline [&>svg.size-4]:hidden">
                      <span className="flex flex-1 items-center justify-between gap-4">
                        <span>{item.title}</span>
                        <span className="type-meta-label text-type-tertiary">{item.number}</span>
                      </span>
                      <FaqToggleIcons />
                    </AccordionTrigger>
                    <AccordionContent className="type-body-copy max-w-[34rem] pb-0 pt-4">
                      {item.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  ))
}
