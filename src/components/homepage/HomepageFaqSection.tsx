"use client"

import { DeFiTerm } from "@/components/defi-term"
import { FaqToggleIcons } from "@/components/faq-toggle-icons"
import { SectionTitle } from "@/components/shared"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { lookupPhrase, usePhraseMap } from "@/components/phrase-map-context"
import type { ReactNode } from "react"

interface HomepageFaqItem {
  value: string
  question: string
  answer: ReactNode
}

/**
 * HomepageFaqSection - Homepage FAQ using the product-page FAQ layout directly.
 * Answer copy is composed from marketing phrase-map fragments so locales localize.
 */
export default function HomepageFaqSection() {
  const map = usePhraseMap()
  const t = (text: string) => lookupPhrase(map, text)

  const homepageFaqItems: HomepageFaqItem[] = [
    {
      value: "item-1",
      question: "Do I have to sell or exit my LP position?",
      answer: (
        <div className="space-y-2">
          <p>
            {t("No. Your")} <DeFiTerm term="lp">LP</DeFiTerm>{" "}
            {t("position stays active in the underlying AMM while you borrow against it.")}
          </p>
          <p>
            {t("Avana uses your LP shares as")} {" "}
            <DeFiTerm term="collateral">{t("collateral")}</DeFiTerm>{" "}
            {t("so the position can keep earning fees instead of being sold first.")}
          </p>
        </div>
      ),
    },
    {
      value: "item-2",
      question: "How much can I borrow?",
      answer: (
        <div className="space-y-2">
          <p>{t("Borrowing power is based on the risk-adjusted value of your LP position, not a fixed percentage.")}</p>
          <p>
            {t("The amount depends on pool type, volatility, and")} {" "}
            <DeFiTerm term="oracle">{t("oracle")}</DeFiTerm>{" "}
            {t("confidence. There are no minimum amounts, and higher-quality collateral unlocks more room.")}
          </p>
        </div>
      ),
    },
    {
      value: "item-3",
      question: "What happens if my LP value drops?",
      answer: (
        <div className="space-y-2">
          <p>
            {t("If your")} <DeFiTerm term="ltv">{t("loan-to-value ratio")}</DeFiTerm>{" "}
            {t("rises as the LP value falls, your borrowing buffer becomes smaller.")}
          </p>
          <p>
            {t("If it exceeds the")} {" "}
            <DeFiTerm term="liquidation-threshold">{t("liquidation threshold")}</DeFiTerm>{", "}
            {t("part of your position may be")} {" "}
            <DeFiTerm term="liquidation">{t("liquidated")}</DeFiTerm>{" "}
            {t("to restore health or repay the debt.")}
          </p>
        </div>
      ),
    },
    {
      value: "item-4",
      question: "Is my risk isolated?",
      answer: (
        <div className="space-y-2">
          <p>
            {t("Yes. Each")} <DeFiTerm term="lp-position">{t("LP position")}</DeFiTerm>{" "}
            {t("is managed independently so one market does not silently absorb another market's risk.")}
          </p>
          <p>
            {t("System-wide safety is enforced through Aave v4's")} {" "}
            <DeFiTerm term="hub">{t("Hub")}</DeFiTerm>
            {t("-and-")}
            <DeFiTerm term="spoke">{t("Spoke")}</DeFiTerm> {t("architecture.")}
          </p>
        </div>
      ),
    },
    {
      value: "item-5",
      question: "Can I repay early or close my position?",
      answer: (
        <div className="space-y-2">
          <p>
            {t("Yes. There are no fixed loan terms, so you can")} {" "}
            <DeFiTerm term="repay">{t("Repay")}</DeFiTerm> {t("at any time, in part or in full.")}
          </p>
          <p>
            {t("You can also reduce your")} {" "}
            <DeFiTerm term="borrow">{t("borrow")}</DeFiTerm>{", or "}
            <DeFiTerm term="withdraw">{t("withdraw")}</DeFiTerm> {t("collateral as your position remains healthy.")}
          </p>
        </div>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-8 pb-4 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-6 md:pb-0 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:gap-8">
      <div className="space-y-3 md:max-w-[25rem] md:pt-2">
        <SectionTitle variant="lead" className="max-w-none">
          {t("Frequently asked questions")}
        </SectionTitle>
      </div>
      <div className="min-w-0 md:pl-16 lg:pl-24 xl:pl-28">
        <Accordion type="single" collapsible orientation="vertical" className="w-full">
          {homepageFaqItems.map((item) => (
            <AccordionItem key={item.value} value={item.value} className="border-b border-gray-200 pt-6 pb-6 last:border-b-0">
              <AccordionTrigger className="type-accordion-question group gap-4 p-0 text-left text-foreground hover:underline [&>svg.size-4]:hidden">
                {t(item.question)}
                <FaqToggleIcons />
              </AccordionTrigger>
              <AccordionContent className="type-accordion-answer pt-2 text-type-secondary">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
