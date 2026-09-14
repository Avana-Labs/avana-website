import { FaqToggleIcons } from "@/components/faq-toggle-icons"
import { MarketingLeadHeader } from "@/components/marketing-lead-header"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { AppLocale } from "@/i18n/locales"
import { withMarketingI18n } from "@/lib/content-i18n/with-marketing-i18n"

const valuationItems = [
  {
    number: "01",
    title: "Live LP collateral",
    description:
      "Treat each LP position as live collateral valued like an active AMM position, not a static token.",
  },
  {
    number: "02",
    title: "Pool-specific scoring",
    description:
      "Borrowing power is risk-scored with pool logic that reflects volatility, depth, and market behavior.",
  },
  {
    number: "03",
    title: "Real AMM behaviour",
    description:
      "Collateral rules track real pool structure and exposure so credit stays tied to your live position.",
  },
  {
    number: "04",
    title: "Shared Hub liquidity",
    description:
      "Borrowing capacity comes from shared Hub liquidity while your LP stays productive in the pool.",
  },
  {
    number: "05",
    title: "Dual-oracle pricing",
    description:
      "Dual-oracle pricing keeps marks robust as markets move so collateral value stays credible over time.",
  },
  {
    number: "06",
    title: "Active risk controls",
    description:
      "Health monitoring and venue-aware liquidation protect standards while your exposure keeps earning fees.",
  },
] as const

function BorrowingLimitMock() {
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-[28rem] overflow-hidden rounded-[1.5rem] border border-black/10 bg-[#f7fafb] p-4 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-5"
    >
      <div className="flex items-center justify-between border-b border-black/10 pb-4">
        <div>
          <div className="h-2.5 w-24 rounded-full bg-black/15" />
          <div className="mt-2 h-2 w-36 rounded-full bg-black/8" />
        </div>
        <span className="rounded-full bg-[#dff8fb] px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-[#008aa6]">
          Live
        </span>
      </div>

      <div className="mt-5 rounded-xl bg-white p-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="h-2 w-28 rounded-full bg-black/10" />
            <div className="mt-3 h-9 w-36 rounded-lg bg-black/80" />
          </div>
          <div className="h-12 w-12 rounded-full border-[5px] border-[#01aacf]/25 border-t-[#01aacf]" />
        </div>
        <div className="mt-5 h-2 rounded-full bg-[#e8f1f3]">
          <div className="h-2 w-[68%] rounded-full bg-[#01aacf]" />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {[
          ["LP value", "Verified"],
          ["Risk band", "Pool-aware"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-white p-3.5">
            <div className="h-2 w-16 rounded-full bg-black/10" />
            <div className="mt-3 h-2.5 w-20 rounded-full bg-black/65" />
            <div className="mt-2 h-2 w-14 rounded-full bg-[#01aacf]/50" />
            <span className="sr-only">{label}: {value}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-[#01aacf]/20 bg-[#effbfd] px-3.5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#01aacf]" />
          <div className="h-2 w-28 rounded-full bg-[#01aacf]/35" />
        </div>
        <div className="h-2 w-14 rounded-full bg-[#01aacf]/55" />
      </div>
    </div>
  )
}

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
              <BorrowingLimitMock />
            </div>

            <div className="min-w-0">
              <Accordion
                type="single"
                collapsible
                defaultValue="live-lp-collateral"
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
