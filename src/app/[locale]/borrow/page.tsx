import { createPageMetadata } from "@/lib/i18n/page-metadata"
import dynamic from "next/dynamic"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { LocalizedMarketing } from "@/components/localized-marketing"
import { Activity, BadgeDollarSign, Compass, Layers, LineChart, ShieldCheck } from "lucide-react"
import { InlineFaqSection, type InlineFaqItem } from "@/components/InlineFaqSection"
import { FeatureCardDescription, FeatureCardTitle, SectionEyebrow, SectionTitle } from "@/components/shared"
import { PerformanceSection } from "@/components/ui/performance-section"
import { CYAN_HIGHLIGHT_TEXT_CLASS } from "@/lib/highlight"
import { cn } from "@/lib/utils"
import { getTokenIconSrc } from "@/lib/token-icons"
import HomepageNewsroomSection from "@/components/homepage/HomepageNewsroomSection"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

const BorrowPowerSection = dynamic(() => import("@/components/borrow-power-section"))
const PositionSafetyCardsSection = dynamic(() => import("@/components/position-safety-cards-section"))

const openSpokeFaqItems: InlineFaqItem[] = [
  {
    value: "open-1",
    question: "What happens to my LP fees while I borrow?",
    answer:
      "Your LP position stays active in the underlying AMM, so fees continue accruing while the loan is open. If liquidation occurs, any uncollected fees are applied first to reduce your debt before principal is unwound.",
  },
  {
    value: "open-2",
    question: "How is my borrowing limit calculated?",
    answer:
      "Your borrowing power is based on the USD value of the LP position, adjusted by the weaker asset in the pair and a pool specific risk factor. That risk factor reflects volatility, liquidity depth, and asset correlation.",
  },
  {
    value: "open-3",
    question: "What is a Spoke?",
    answer:
      "A Spoke is an isolated lending market designed for a specific AMM and pool type. Each Spoke has its own risk parameters, oracle logic, and liquidation flow, which keeps risk contained within that market.",
  },
  {
    value: "open-4",
    question: "What happens if I get liquidated?",
    answer:
      "Liquidation begins when your health factor falls below the allowed threshold. The protocol follows a borrower protective sequence by applying accrued fees first, then unwinding only the amount of LP principal needed to restore or repay the position. Any remaining value is returned to you.",
  },
  {
    value: "open-5",
    question: "Can I repay at any time?",
    answer:
      "Yes. There are no fixed loan terms. You can repay partially or in full whenever you want, as long as the position remains healthy while the loan is open.",
  },
  {
    value: "open-6",
    question: "Can I borrow against multiple LP positions at once?",
    answer:
      "Yes. Multiple LP positions can be used within the same market, with borrowing power derived from the combined collateral value. The interface shows both individual position health and your overall account exposure.",
  },
]

const borrowPartnerFeatures = [
  {
    title: "Live LP collateral",
    description:
      "Treat each LP position as live collateral valued like an active AMM position, not a static token.",
    icon: Layers,
  },
  {
    title: "Pool-specific scoring",
    description:
      "Borrowing power is risk-scored with pool logic that reflects volatility, depth, and market behavior.",
    icon: Compass,
  },
  {
    title: "Real AMM behaviour",
    description:
      "Collateral rules track real pool structure and exposure so credit stays tied to your live position.",
    icon: Activity,
  },
  {
    title: "Shared Hub liquidity",
    description:
      "Borrowing capacity comes from shared Hub liquidity while your LP stays productive in the pool.",
    icon: BadgeDollarSign,
  },
  {
    title: "Dual-oracle pricing",
    description:
      "Dual-oracle pricing keeps marks robust as markets move so collateral value stays credible over time.",
    icon: LineChart,
  },
  {
    title: "Active risk controls",
    description:
      "Health monitoring and venue-aware liquidation protect standards while your exposure keeps earning fees.",
    icon: ShieldCheck,
  },
] as const

const lpHubMarkets = [
  {
    category: "Lowest-risk hub",
    title: "Stable LP Hub",
    description:
      "Stablecoin LP markets built for tight pricing, low slippage, and minimal impermanent loss.",
    pools: ["USDC / GHO", "USDT / USDC", "GHO / USDe", "USDe / USDC", "USDT / GHO"],
    borrowable: ["USDC", "USDT", "GHO", "USDe", "DAI"],
  },
  {
    category: "Global Strategy hub",
    title: "Correlated LP Hub",
    description:
      "LP markets for assets that move together, built for tighter risk bands and cleaner borrowing power.",
    pools: ["ETH / wstETH", "wstETH / cbETH", "ETH / rETH", "USDe / USDC", "GHO / USDe"],
    borrowable: ["ETH", "wstETH", "USDC", "GHO", "USDe"],
  },
  {
    category: "Higher-range hub",
    title: "Volatile LP Hub",
    description:
      "Major DeFi asset LP markets for wider price ranges and higher risk-reward strategies.",
    pools: ["ETH / USDC", "WBTC / ETH", "cbBTC / USDC", "AAVE / ETH", "+4 More"],
    borrowable: ["ETH", "wstETH", "WBTC", "cbBTC", "USDT", "USDC", "GHO", "AAVE"],
  },
] as const

function HubTokenImage({ symbol, overlap = false }: { symbol: string; overlap?: boolean }) {
  const src = getTokenIconSrc(symbol)

  if (!src) {
    const initials = symbol.slice(0, 3).toUpperCase()
    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[0.5rem] font-semibold text-foreground",
          overlap && "-ml-1.5",
        )}
      >
        {initials}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      className={cn("h-5 w-5 shrink-0 rounded-full object-contain", overlap && "-ml-1.5")}
    />
  )
}

function HubPoolIcon({ pool }: { pool: string }) {
  if (pool.includes("More")) {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#01AACF] text-[0.7rem] font-semibold text-white">
        +
      </span>
    )
  }

  const [first, second] = pool.split(" / ")

  return (
    <span className="flex items-center">
      {[first, second].map((token, index) => (
        <HubTokenImage key={`${pool}-${token}`} symbol={token} overlap={index > 0} />
      ))}
    </span>
  )
}

function HubSingleTokenIcon({ token }: { token: string }) {
  return <HubTokenImage symbol={token} />
}

function HubTokenGroup({
  label,
  tokens,
  withPoolIcons = false,
  withTokenIcons = false,
}: {
  label: string
  tokens: readonly string[]
  withPoolIcons?: boolean
  withTokenIcons?: boolean
}) {
  return (
    <div className="mt-5 first:mt-0">
      <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-type-tertiary">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {tokens.map((token) => (
          <span
            key={`${label}-${token}`}
            className="inline-flex h-8 items-center gap-2 rounded-full border border-border bg-card px-3 text-sm font-semibold tracking-[-0.015em] text-foreground"
          >
            {withPoolIcons ? <HubPoolIcon pool={token} /> : null}
            {withTokenIcons ? <HubSingleTokenIcon token={token} /> : null}
            {token}
          </span>
        ))}
      </div>
    </div>
  )
}

function BorrowMarketCard({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="flex h-full flex-col feature-card rounded-2xl p-6 md:p-8">
      <span className="text-4xl text-gray-300/80 md:text-5xl">{number}</span>
      <FeatureCardTitle className="mt-6">{title}</FeatureCardTitle>
      <FeatureCardDescription className="mt-3">{description}</FeatureCardDescription>
    </div>
  )
}

export async function generateMetadata({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return createPageMetadata(locale, "borrow", "/borrow")
}

export default async function BorrowPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return (
    <LocalizedMarketing locale={locale} keys={["borrow/page", "borrow-power-section", "position-safety-cards-section", "position-safety-section", "homepage/HomepageNewsroomSection", "InlineFaqSection"]}>
    <main className="bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col px-5 pt-10 sm:px-6 sm:pt-12 md:px-8 md:pt-20 lg:max-w-[64rem] 2xl:max-w-[72rem] lg:min-h-0 lg:px-0">
        <div className="relative z-0">
          <section className="pb-0 lg:pb-10 xl:pb-12">
            <div className="w-full pt-3 pb-0 md:pt-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
              {/* Left Column - Hero Image */}
                <div className="order-2 mb-8 w-full lg:mb-0 lg:w-[55%]">
                  <div className="relative mx-auto w-full max-w-none lg:mx-0 lg:max-w-[650px] xl:max-w-[700px]">
                    <Image
                      src="/images/Hero__4_.webp"
                      alt="App interface"
                      width={1200}
                      height={1200}
                      quality={58}
                      priority
                      className="w-full h-auto rounded-[24px] md:rounded-[32px] lg:rounded-[40px]"
                      sizes="(max-width: 1024px) calc(100vw - 40px), 700px"
                    />
                </div>
              </div>

              {/* Right Column - Text Content */}
                <div className="order-1 mb-8 w-full text-left lg:order-2 lg:mb-0 lg:w-[45%]">
                  <h1 className="type-display-title mb-3 max-w-[11ch] text-foreground md:mb-5">
                    <span>Borrow against</span>
                    <br />
                    <span>AMM positions</span>
                  </h1>

                  <p className="mb-5 max-w-[34ch] text-base leading-relaxed text-type-secondary sm:max-w-[38ch] md:mb-6 md:text-lg">
                    Turn your liquidity pool positions into collateral and borrow against them here without leaving the pool.
                  </p>

                  <div className="flex max-w-md flex-row flex-wrap items-start gap-2 sm:gap-3">
                    <Link
                      href="https://app.avana.cc"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-[#01AACF] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#00a0c2]"
                    >
                      Try Borrowing
                    </Link>
                    <Link
                      href="/developers"
                      className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-900 transition-colors hover:bg-gray-100"
                    >
                      View Docs
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="border-t border-[#01AACF] bg-white site-section-gap">
        <div className="site-content-shell">
          <div className="mx-auto w-full max-w-[90rem]">
            <div className="flex flex-col gap-6">
              <div className="flex max-w-[600px] flex-col gap-2">
                <SectionEyebrow tone="violet">How it works</SectionEyebrow>
                <SectionTitle>Borrowing in three steps</SectionTitle>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <BorrowMarketCard
                  number="1"
                  title="Deposit LP"
                  description="Choose a supported LP position and deposit it as collateral while your liquidity stays active."
                />

                <BorrowMarketCard
                  number="2"
                  title="Draw liquidity"
                  description="Borrow against the risk-adjusted value of the position and receive funds straight in your wallet."
                />

                <BorrowMarketCard
                  number="3"
                  title="Manage health"
                  description="Repay, add collateral, or reduce debt before the position drifts toward the liquidation threshold."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white site-section-gap">
        <div className="site-content-shell">
          <div className="mx-auto w-full max-w-[90rem]">
            <div className="flex flex-col gap-6">
              <div className="max-w-none">
                <SectionEyebrow tone="blue">Avana Hubs Strategy</SectionEyebrow>
                <SectionTitle className="mt-2 max-w-none lg:whitespace-nowrap">
                  Choose the market type for your collateral
                </SectionTitle>
              </div>
            </div>

            <div className="mt-10 grid gap-5 lg:mt-16 lg:grid-cols-3">
              {lpHubMarkets.map((hub) => (
                <article
                  key={hub.title}
                  className="flex h-full flex-col feature-card rounded-2xl border border-border p-6 md:p-8"
                >
                  <p className="text-sm font-semibold tracking-[-0.01em] text-[#01AACF]">
                    {hub.category}
                  </p>
                  <FeatureCardTitle className="mt-4">{hub.title}</FeatureCardTitle>
                  <FeatureCardDescription className="mt-3 min-h-[4.5rem] max-w-[22rem]">
                    {hub.description}
                  </FeatureCardDescription>

                  <div className="mt-8 border-t border-border pt-6">
                    <HubTokenGroup label="LP pool collateral" tokens={hub.pools} withPoolIcons />
                    <HubTokenGroup label="Borrowable" tokens={hub.borrowable} withTokenIcons />
                  </div>

                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white site-section-gap">
        <div className="site-content-shell">
          <div className="mx-auto w-full max-w-[76rem]">
            <div className="max-w-[58rem] space-y-3 text-left sm:space-y-4">
              <SectionEyebrow tone="blue">Borrow with Confidence</SectionEyebrow>
              <SectionTitle className="max-w-[18ch] sm:max-w-[22ch] lg:max-w-none">
                <span className="block sm:inline">Protected at the</span>{" "}
                <span className="block sm:inline">pool level</span>
              </SectionTitle>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 sm:mt-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 md:mt-16 md:gap-x-16 md:gap-y-14 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-20">
              {borrowPartnerFeatures.map((feature) => (
                <article key={feature.title} className="flex flex-col bg-transparent">
                  <feature.icon className="h-10 w-10 text-[#01AACF] sm:h-11 sm:w-11" strokeWidth={1.5} aria-hidden="true" />
                  <FeatureCardTitle className="mt-4 sm:mt-5">{feature.title}</FeatureCardTitle>
                  <FeatureCardDescription className="mt-2 max-w-[22rem]">
                    {feature.description}
                  </FeatureCardDescription>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PerformanceSection className="site-section-gap">
        <div className="site-content-shell">
          <div className="mx-auto w-full max-w-[76rem] flex flex-col site-section-stack">
            <div className="flex flex-col gap-8 md:gap-12">
              <div className="flex flex-col gap-2">
                <SectionEyebrow tone="emerald">DEX Coverage</SectionEyebrow>
                <SectionTitle>Supported across top DEXs</SectionTitle>
              </div>
              <div className="flex flex-1 items-stretch gap-2 flex-col sm:flex-row">
                <div className="grid w-full flex-1 grid-cols-3 gap-2">
                  <div className="aspect-square rounded-lg border border-gray-200 bg-white p-1 md:p-1.5">
                    <div className="flex size-full items-center justify-center rounded-md border border-gray-200 bg-[#111727] [&>svg]:size-3/5"></div>
                  </div>
                  <div className="aspect-square rounded-lg border border-gray-200 bg-white p-1 md:p-1.5">
                    <div className="flex size-full items-center justify-center rounded-md border border-gray-200 bg-[#FFFFFF] [&>svg]:size-3/5"></div>
                  </div>
                  <div className="aspect-square rounded-lg border border-gray-200 bg-white p-1 md:p-1.5">
                    <div className="flex size-full items-center justify-center rounded-md border border-gray-200 bg-[#000827] [&>svg]:size-3/5"></div>
                  </div>
                  <div className="aspect-square rounded-lg border border-gray-200 bg-white p-1 md:p-1.5">
                    <div className="flex size-full items-center justify-center rounded-md border border-gray-200 bg-[linear-gradient(45deg,#FC6901_0%,#F3B900_100%)] [&>svg]:size-3/5"></div>
                  </div>
                  <div className="aspect-square rounded-lg border border-gray-200 bg-white p-1 md:p-1.5">
                    <div className="flex size-full items-center justify-center rounded-md border border-gray-200 bg-[#000000] [&>svg]:size-3/5"></div>
                  </div>
                  <div className="aspect-square rounded-lg border border-gray-200 bg-white p-1 md:p-1.5">
                    <div className="flex size-full items-center justify-center rounded-md border border-gray-200 bg-[#F5F5F5] [&>svg]:size-3/5"></div>
                  </div>
                </div>
                <div className="flex w-full flex-1">
                  <div className="flex h-[150px] w-full flex-col items-center justify-center rounded-lg bg-gradient-to-b from-blue-50 to-blue-100 p-2 text-center sm:h-auto">
                    <div className="flex size-full flex-col items-center justify-center rounded-md border border-blue-200 bg-white">
                      <div className="text-base font-medium leading-normal text-blue-600 md:text-lg">
                        <div className={`flex items-center text-[32px] font-bold md:text-[48px] ${CYAN_HIGHLIGHT_TEXT_CLASS}`}>
                          12+
                        </div>
                        <span>DEX Integrations</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid w-full flex-1 grid-cols-3 gap-2">
                  <div className="aspect-square rounded-lg border border-gray-200 bg-white p-1 md:p-1.5">
                    <div className="flex size-full items-center justify-center rounded-md border border-gray-200 bg-[#7D00FF] [&>svg]:size-3/5"></div>
                  </div>
                  <div className="aspect-square rounded-lg border border-gray-200 bg-white p-1 md:p-1.5">
                    <div className="flex size-full items-center justify-center rounded-md border border-gray-200 bg-[#000000] [&>svg]:size-3/5"></div>
                  </div>
                  <div className="aspect-square rounded-lg border border-gray-200 bg-white p-1 md:p-1.5">
                    <div className="flex size-full items-center justify-center rounded-md border border-gray-200 bg-[#F3EFCD] [&>svg]:size-3/5"></div>
                  </div>
                  <div className="aspect-square rounded-lg border border-gray-200 bg-white p-1 md:p-1.5">
                    <div className="flex size-full items-center justify-center rounded-md border border-gray-200 bg-[#061121] [&>svg]:size-3/5"></div>
                  </div>
                  <div className="aspect-square rounded-lg border border-gray-200 bg-white p-1 md:p-1.5">
                    <div className="flex size-full items-center justify-center rounded-md border border-gray-200 bg-[linear-gradient(90deg,#E35930_-6.83%,#E84125_100%)] [&>svg]:size-3/5"></div>
                  </div>
                  <div className="aspect-square rounded-lg border border-gray-200 bg-white p-1 md:p-1.5">
                    <div className="flex size-full items-center justify-center rounded-md border border-gray-200 bg-[#F1F7FF] [&>svg]:size-3/5"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex max-w-[600px] flex-col gap-2">
                <SectionEyebrow tone="blue">Liquidity pools</SectionEyebrow>
                <SectionTitle className="md:whitespace-nowrap">
                  Every Pool details, fully explained
                </SectionTitle>
              </div>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.35rem] sm:aspect-[2/1] md:rounded-[1.6rem]">
                <Image
                  src="/images/borrow-markets-visual.png"
                  alt="Document-style preview of supported borrowing markets"
                  fill
                  sizes="(max-width: 1200px) 100vw, 1120px"
                  className="object-cover object-center"
                />
              </div>
            </div>

            <div className="flex flex-col gap-12 md:gap-14">
              <BorrowPowerSection locale={locale} />
              <PositionSafetyCardsSection locale={locale} />
            </div>

          </div>
        </div>
      </PerformanceSection>

      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 flex flex-col">
        <div className="flex-1 flex flex-col relative z-0">
        {/* Rest of page content */}
        <div className="site-content-width flex flex-col site-section-stack site-section-gap pb-16 md:pb-20 2xl:pb-18">
          <HomepageNewsroomSection locale={locale} collection="borrow" eyebrowTone="blue" />

          <div className="pb-16 md:pb-24 2xl:pb-22">
            <InlineFaqSection title="Frequently asked questions" items={openSpokeFaqItems} eyebrowTone="blue" withTopBorder={false} />
          </div>
        </div>
      </div>
      </div>
    </main>
  </LocalizedMarketing>
)
}
