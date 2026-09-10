"use client"

import { useState } from "react"
import { lookupPhrase, usePhraseMap } from "@/components/phrase-map-context"
import { AskAiConversation } from "@/components/ask-ai-conversation"
import { FaqToggleIcons } from "@/components/faq-toggle-icons"
import { MarketingLeadHeader } from "@/components/marketing-lead-header"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface AccordionItem {
  id: string
  number: string
  title: string
  description: string
  prompt: string
}

const accordionItems: AccordionItem[] = [
  {
    id: "answer-what-if",
    number: "01",
    title: "Answer your next “what if?”",
    description:
      "Ask how a 20% market dip impacts your health factor, or simulate a 3x yield loop before committing any capital.",
    prompt:
      "“Simulate a 3x ETH-USDC yield loop and show my liquidation price if ETH drops 15%”",
  },
  {
    id: "one-sentence-execution",
    number: "02",
    title: "Turn five transactions into one sentence",
    description:
      "Swap tokens, bridge chains, and deposit into liquidity pools in one go—without switching networks or signing five approvals.",
    prompt:
      "“Swap 5 ETH for USDC, bridge to Arbitrum, and deposit into the Curve tri-pool”",
  },
  {
    id: "set-triggers",
    number: "03",
    title: "Set conditional rules and walk away",
    description:
      "Tell Ask AI to borrow only when rates drop below 4%, or rebalance your LP if pool prices deviate beyond your target.",
    prompt:
      "“Borrow 25,000 USDC against my LP position whenever Aave borrow APR drops below 3.8%”",
  },
  {
    id: "sleep-through-volatility",
    number: "04",
    title: "Sleep through volatile market swings",
    description:
      "Autonomous agents watch your collateral 24/7, adjusting positions and triggering stop-losses long before liquidation risk.",
    prompt:
      "“Keep my health factor above 1.6 by automatically deleveraging if volatility spikes”",
  },
  {
    id: "spot-peak-yields",
    number: "05",
    title: "Spot peak yields without the rabbit hole",
    description:
      "Ask which pools offer the best fee-to-risk ratio for your assets, compare real-time DEX depth, and deploy with a click.",
    prompt:
      "“Find the highest fee APY pool for wstETH with at least $5M liquidity depth across all DEXs”",
  },
]

export function AskAiShowcase() {
  // Client island: the parent server wrapper cannot rewrite strings across the
  // client boundary, so translate through the phrase map provided by
  // LocalizedMarketing instead.
  const map = usePhraseMap()
  const t = (text: string) => lookupPhrase(map, text)
  const [activeIndex, setActiveIndex] = useState<number>(0)

  return (
    <section className="site-content-shell site-section-gap">
      <MarketingLeadHeader
        title={t("Command your portfolio with Ask AI")}
        subtitle={t(
          "Simulate yield loops, automate borrow guards, and execute in plain English.",
        )}
      />

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-12 lg:gap-16 xl:gap-20">
        <div className="hidden min-w-0 items-center md:flex">
          <div className="w-full">
            <AskAiConversation
              key={accordionItems[activeIndex].id}
              scenario={activeIndex}
              prompt={t(accordionItems[activeIndex].prompt)}
            />
          </div>
        </div>

        <div className="min-w-0">
          <Accordion
            type="single"
            value={accordionItems[activeIndex].id}
            onValueChange={(value) => {
              const nextIndex = accordionItems.findIndex(
                (item) => item.id === value,
              )
              if (nextIndex >= 0) setActiveIndex(nextIndex)
            }}
            orientation="vertical"
            className="w-full"
          >
            {accordionItems.map((item, index) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-b border-border py-6 first:border-t last:border-b"
              >
                <AccordionTrigger className="type-card-title group p-0 text-left text-foreground hover:no-underline [&>svg.size-4]:hidden">
                  <span className="flex flex-1 items-center justify-between gap-4">
                    <span>{t(item.title)}</span>
                    <span className="type-meta-label text-type-tertiary">
                      {item.number}
                    </span>
                  </span>
                  <FaqToggleIcons />
                </AccordionTrigger>
                <AccordionContent className="type-body-copy max-w-[34rem] pb-0 pt-4">
                  <p>{t(item.description)}</p>
                  <div className="mt-6 md:hidden">
                    <AskAiConversation
                      key={item.id}
                      scenario={index}
                      prompt={t(item.prompt)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
