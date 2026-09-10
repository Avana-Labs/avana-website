import Image from "next/image"
import { FaqToggleIcons } from "@/components/faq-toggle-icons"
import { MarketingLeadHeader } from "@/components/marketing-lead-header"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { AppLocale } from "@/i18n/locales"
import { withMarketingI18n } from "@/lib/content-i18n/with-marketing-i18n"

const borrowPowerItems = [
  {
    number: "01",
    title: "Combine supported LP collateral",
    description:
      "Bring multiple supported LP positions into one borrowing account. Each position contributes to the collateral base according to its verified value and risk parameters.",
  },
  {
    number: "02",
    title: "Borrow against total capacity",
    description:
      "Avana calculates available credit across the combined collateral base, so you can borrow against aggregate capacity without creating a separate loan for every LP position.",
  },
  {
    number: "03",
    title: "Preserve position-level controls",
    description:
      "Each LP position keeps its own valuation and risk parameters while contributing borrowing power to the combined collateral base.",
  },
  {
    number: "04",
    title: "Add collateral as you grow",
    description:
      "Deposit additional supported LP positions to increase borrowing power, or adjust collateral as your portfolio and market conditions change.",
  },
  {
    number: "05",
    title: "Manage one collateral account",
    description:
      "Monitor combined collateral value, outstanding debt, available credit, and account health from one place as positions and prices change.",
  },
] as const

export default async function BorrowPowerSection({ locale }: { locale: AppLocale }) {
  return withMarketingI18n(locale, ["borrow-power-section"], (
    <section className="bg-white">
      <MarketingLeadHeader
        title="Combine collateral. Unlock more credit."
        subtitle="One borrowing account across every supported LP position."
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
            defaultValue="combine-supported-lp-collateral"
            orientation="vertical"
            className="w-full"
          >
            {borrowPowerItems.map((item) => (
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
    </section>
  ))
}
