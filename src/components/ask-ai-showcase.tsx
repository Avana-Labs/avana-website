"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { lookupPhrase, usePhraseMap } from "@/components/phrase-map-context"
import { Sparkles } from "lucide-react"
import { MarketingLeadHeader } from "@/components/marketing-lead-header"

interface AccordionItem {
  id: string
  title: string
  description: string
  prompt: string
  imageSrc: string
  imageAlt: string
}

const accordionItems: AccordionItem[] = [
  {
    id: "answer-what-if",
    title: "Answer your next “what if?”",
    description:
      "Ask how a 20% market dip impacts your health factor, or simulate a 3x yield loop before committing any capital.",
    prompt: "“Simulate a 3x ETH-USDC yield loop and show my liquidation price if ETH drops 15%”",
    imageSrc: "/images/home-product-multiply.png",
    imageAlt: "Avana Multiply simulation and portfolio management interface",
  },
  {
    id: "one-sentence-execution",
    title: "Turn five transactions into one sentence",
    description:
      "Swap tokens, bridge chains, and deposit into liquidity pools in one go—without switching networks or signing five approvals.",
    prompt: "“Swap 5 ETH for USDC, bridge to Arbitrum, and deposit into the Curve tri-pool”",
    imageSrc: "/images/Avana Express Page 1.png",
    imageAlt: "Avana Express multi-step automated execution workflow",
  },
  {
    id: "set-triggers",
    title: "Set conditional rules and walk away",
    description:
      "Tell Ask AI to borrow only when rates drop below 4%, or rebalance your LP if pool prices deviate beyond your target.",
    prompt: "“Borrow 25,000 USDC against my LP position whenever Aave borrow APR drops below 3.8%”",
    imageSrc: "/images/home-product-borrow.png",
    imageAlt: "Avana Borrow rate monitoring and conditional loan parameters",
  },
  {
    id: "sleep-through-volatility",
    title: "Sleep through volatile market swings",
    description:
      "Autonomous agents watch your collateral 24/7, adjusting positions and triggering stop-losses long before liquidation risk.",
    prompt: "“Keep my health factor above 1.6 by automatically deleveraging if volatility spikes”",
    imageSrc: "/images/Avana Express Light.png",
    imageAlt: "Avana 24/7 position monitoring and automated risk guards",
  },
  {
    id: "spot-peak-yields",
    title: "Spot peak yields without the rabbit hole",
    description:
      "Ask which pools offer the best fee-to-risk ratio for your assets, compare real-time DEX depth, and deploy with a click.",
    prompt: "“Find the highest fee APY pool for wstETH with at least $5M liquidity depth across all DEXs”",
    imageSrc: "/images/home-product-lend.png",
    imageAlt: "Avana Lend yield discovery and pool comparison interface",
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
        subtitle={t("Simulate yield loops, automate borrow guards, and execute in plain English.")}
      />

      <div className="w-full">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-12 md:items-start">
          {/* Desktop media column (changes dynamically based on active tab) */}
          <div className="hidden md:block md:col-span-6">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-lg ring-1 ring-black/10">
              {accordionItems.map((item, index) => {
                const isActive = activeIndex === index
                if (!isActive) return null
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "absolute inset-0 transition-all duration-500 ease-out",
                      isActive
                        ? "opacity-100 scale-100 z-10 pointer-events-auto"
                        : "opacity-0 scale-[0.98] z-0 pointer-events-none"
                    )}
                  >
                    <Image
                      src={item.imageSrc}
                      alt={t(item.imageAlt)}
                      fill
                      sizes="(max-width: 1024px) 50vw, 650px"
                      className="object-cover object-top"
                    />

                    {/* Natural language prompt banner overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 via-black/50 to-transparent">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs text-white backdrop-blur-md ring-1 ring-white/20">
                        <Sparkles className="h-3.5 w-3.5 text-cyan-300 shrink-0" aria-hidden="true" />
                        <span className="font-mono text-[0.78rem] tracking-tight">{t(item.prompt)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Accordion column */}
          <div className="col-span-12 md:col-span-6 md:pl-6 lg:pl-10">
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
                        <h3 className="flex-grow py-4 text-start font-normal text-mkt-p1">{t(item.title)}</h3>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden="true"
                          className={cn(
                            "flex-shrink-0 transition-transform duration-200 text-token-text-primary",
                            isExpanded ? "rotate-180" : "rotate-0"
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
                          isExpanded ? "grid-rows-[minmax(0,1fr)] pb-6 opacity-100" : "grid-rows-[minmax(0,0fr)] pb-0 opacity-0"
                        )}
                        style={{
                          transitionDuration: "300ms",
                          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                          willChange: "grid-template-rows, padding-bottom, opacity",
                        }}
                      >
                        <div className="flex min-h-0 min-w-0 flex-col [&>*]:m-0">
                          <p className="not-last:mb-[1.1em]">{t(item.description)}</p>
                          {/* Mobile inline media */}
                          {isExpanded && (
                            <div className="h-full w-full md:hidden mt-4">
                              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-lg ring-1 ring-black/10">
                                <Image
                                  src={item.imageSrc}
                                  alt={t(item.imageAlt)}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 500px"
                                  className="object-cover object-top"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/85 via-black/50 to-transparent">
                                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs text-white backdrop-blur-md ring-1 ring-white/20">
                                    <Sparkles className="h-3 w-3 text-cyan-300 shrink-0" aria-hidden="true" />
                                    <span className="font-mono text-[0.72rem] tracking-tight">{t(item.prompt)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="relative h-[1px] w-full">
                        <div
                          className={cn(
                            "absolute inset-0 bg-black transition-opacity",
                            isExpanded ? "opacity-[0.04]" : "opacity-[0.12]"
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
