"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { lookupPhrase, usePhraseMap } from "@/components/phrase-map-context"
import { AskAiConversation } from "@/components/ask-ai-conversation"
import { MarketingLeadHeader } from "@/components/marketing-lead-header"

interface AccordionItem {
  id: string
  title: string
  description: string
  prompt: string
}

const accordionItems: AccordionItem[] = [
  {
    id: "answer-what-if",
    title: "Answer your next “what if?”",
    description:
      "Ask how a 20% market dip impacts your health factor, or simulate a 3x yield loop before committing any capital.",
    prompt:
      "“Simulate a 3x ETH-USDC yield loop and show my liquidation price if ETH drops 15%”",
  },
  {
    id: "one-sentence-execution",
    title: "Turn five transactions into one sentence",
    description:
      "Swap tokens, bridge chains, and deposit into liquidity pools in one go—without switching networks or signing five approvals.",
    prompt:
      "“Swap 5 ETH for USDC, bridge to Arbitrum, and deposit into the Curve tri-pool”",
  },
  {
    id: "set-triggers",
    title: "Set conditional rules and walk away",
    description:
      "Tell Ask AI to borrow only when rates drop below 4%, or rebalance your LP if pool prices deviate beyond your target.",
    prompt:
      "“Borrow 25,000 USDC against my LP position whenever Aave borrow APR drops below 3.8%”",
  },
  {
    id: "sleep-through-volatility",
    title: "Sleep through volatile market swings",
    description:
      "Autonomous agents watch your collateral 24/7, adjusting positions and triggering stop-losses long before liquidation risk.",
    prompt:
      "“Keep my health factor above 1.6 by automatically deleveraging if volatility spikes”",
  },
  {
    id: "spot-peak-yields",
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
        className="mb-6 sm:mb-8"
        title={t("Command your portfolio with Ask AI")}
        subtitle={t(
          "Simulate yield loops, automate borrow guards, and execute in plain English.",
        )}
      />

      <div className="w-full">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-12 md:items-start">
          {/* Desktop media column (changes dynamically based on active tab) */}
          <div className="hidden md:block md:col-span-6">
            <AskAiConversation
              key={accordionItems[activeIndex].id}
              scenario={activeIndex}
              prompt={t(accordionItems[activeIndex].prompt)}
            />
          </div>

          {/* Accordion column */}
          <div className="col-span-1 min-w-0 md:col-span-6 md:pl-6 lg:pl-10">
            <div className="group/accordion flex w-full flex-col border-token-border-light border-y md:border-none">
              <div>
                {accordionItems.map((item, index) => {
                  const isExpanded = activeIndex === index
                  return (
                    <div key={item.id} className="group flex flex-col">
                      <button
                        id={`trigger_${item.id}`}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className="text-token-text-primary flex items-center gap-4 text-start transition-opacity hover:opacity-80"
                        aria-expanded={isExpanded}
                        aria-controls={`content_${item.id}`}
                      >
                        <h3 className="flex-grow py-4 text-start font-normal text-mkt-p1">
                          {t(item.title)}
                        </h3>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden="true"
                          className={cn(
                            "flex-shrink-0 transition-transform duration-200 text-token-text-primary",
                            isExpanded ? "rotate-180" : "rotate-0",
                          )}
                        >
                          <path
                            d="M4 6L8 10L12 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>

                      <div
                        id={`content_${item.id}`}
                        aria-labelledby={`trigger_${item.id}`}
                        aria-hidden={!isExpanded}
                        className={cn(
                          "text-mkt-p2 text-token-text-primary/60 grid overflow-hidden transition-[grid-template-rows,padding-bottom,opacity] motion-reduce:transition-none",
                          isExpanded
                            ? "grid-rows-[minmax(0,1fr)] pb-6 opacity-100"
                            : "grid-rows-[minmax(0,0fr)] pb-0 opacity-0",
                        )}
                        style={{
                          transitionDuration: "300ms",
                          transitionTimingFunction:
                            "cubic-bezier(0.4, 0, 0.2, 1)",
                          willChange:
                            "grid-template-rows, padding-bottom, opacity",
                        }}
                      >
                        <div className="flex min-h-0 min-w-0 flex-col [&>*]:m-0">
                          <p className="not-last:mb-[1.1em]">
                            {t(item.description)}
                          </p>
                          {/* Mobile inline media */}
                          {isExpanded && (
                            <div className="h-full w-full md:hidden mt-4">
                              <AskAiConversation
                                scenario={index}
                                prompt={t(item.prompt)}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="relative h-[1px] w-full">
                        <div
                          className={cn(
                            "absolute inset-0 bg-black transition-opacity",
                            isExpanded ? "opacity-[0.04]" : "opacity-[0.12]",
                          )}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
