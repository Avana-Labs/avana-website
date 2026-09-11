import { createPageMetadata } from "@/lib/i18n/page-metadata"
import dynamic from "next/dynamic"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { LocalizedMarketing } from "@/components/localized-marketing"
import { Activity, ArrowRight, BadgeDollarSign, Compass, Layers, LineChart, ShieldCheck } from "lucide-react"
import { InlineFaqSection, type InlineFaqItem } from "@/components/InlineFaqSection"
import { FeatureCardDescription, FeatureCardTitle, SandboxNotice, SectionEyebrow, SectionTitle } from "@/components/shared"
import { PerformanceSection } from "@/components/ui/performance-section"
import { brandAssetPath } from "@/lib/brand-assets"
import { protocols } from "@/data/protocols"
import { FeaturePageHero } from "@/components/feature-page-hero"
import { AvanaHubWave } from "@/components/avana-hub-wave"
import HomepageNewsroomSection from "@/components/homepage/HomepageNewsroomSection"
import { MarketingLeadHeader } from "@/components/marketing-lead-header"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"
import { SupportedDexDirectory } from "@/components/supported-dex-directory"

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
    title: "Stable LP Hub",
    description:
      "Stablecoin LP markets built for tight pricing, low slippage, and minimal impermanent loss.",
    variant: "stable",
  },
  {
    title: "Correlated LP Hub",
    description:
      "LP markets for assets that move together, built for tighter risk bands and cleaner borrowing power.",
    variant: "correlated",
  },
  {
    title: "Volatile LP Hub",
    description:
      "Major DeFi asset LP markets for wider price ranges and higher risk-reward strategies.",
    variant: "volatile",
  },
] as const

const supportedDexes = protocols.filter(
  (protocol) => protocol.category === "DEX" && protocol.shortName !== "GMX-P",
)

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
      <span className="text-4xl text-[#01AACF] md:text-5xl">{number}</span>
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
    <LocalizedMarketing locale={locale} keys={["borrow/page", "borrow-power-section", "position-safety-cards-section", "homepage/HomepageNewsroomSection", "InlineFaqSection"]}>
    <main className="bg-white">
      <FeaturePageHero
        title={
          <>
            Borrow against
            <br />
            AMM positions
          </>
        }
        description="Turn your liquidity pool positions into collateral and borrow against them here without leaving the pool."
        imageSrc="/images/Avana Borrow Hero.png"
        imageAlt="Avana Borrow product interface"
        imageWidth={1254}
        imageHeight={1254}
      >
        <Link
          href="https://app.avana.cc"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-[43px] items-center gap-1.5 rounded-full bg-black/[0.06] px-[1.35rem] text-base leading-none text-foreground transition-colors hover:bg-black/[0.1]"
        >
          Try Sandbox
          <ArrowRight className="h-4 w-4 stroke-[1.75] rtl:rotate-180" aria-hidden />
        </Link>
      </FeaturePageHero>

      <section className="bg-white site-section-gap">
        <div className="site-content-shell">
          <div className="mx-auto w-full">
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

      <section id="avana-hubs" className="bg-white site-section-gap">
        <div className="site-content-shell">
          <div className="mx-auto w-full">
            <div className="flex flex-col gap-6">
              <div className="max-w-none">
                <SectionEyebrow tone="blue">Avana Hubs Strategy</SectionEyebrow>
                <SectionTitle className="mt-2 max-w-none lg:whitespace-nowrap">
                  Choose the market type for your collateral
                </SectionTitle>
              </div>
            </div>

            <div className="mt-10 grid items-start gap-5 lg:mt-16 lg:grid-cols-3">
              {lpHubMarkets.map((hub) => (
                <article
                  key={hub.title}
                  className="flex flex-col feature-card rounded-[4px] p-5"
                >
                  <FeatureCardTitle>{hub.title}</FeatureCardTitle>
                  <FeatureCardDescription className="mt-1.5 max-w-[22rem]">
                    {hub.description}
                  </FeatureCardDescription>

                  <div className="mt-5 rounded-[4px] bg-white p-2">
                    <AvanaHubWave variant={hub.variant} />
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
            <MarketingLeadHeader
              title="Borrow with Confidence"
              subtitle="Protected at the pool level"
            />

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

      <SupportedDexDirectory protocols={supportedDexes} />

      <PerformanceSection className="site-section-gap">
        <div className="site-content-shell">
          <div className="mx-auto w-full max-w-[76rem] flex flex-col site-section-stack">
            <div id="liquidity-pools" className="flex flex-col gap-6">
              <div className="flex max-w-[600px] flex-col gap-2">
                <SectionEyebrow tone="blue">Liquidity pools</SectionEyebrow>
                <SectionTitle className="md:whitespace-nowrap">
                  Every Pool details, fully explained
                </SectionTitle>
              </div>
              <div className="relative aspect-[1672/941] w-full overflow-hidden rounded-[1.35rem] sm:aspect-[2/1] md:rounded-[1.6rem]">
                <Image
                  src={brandAssetPath("/images/Avana Borrow Light.png")}
                  alt="Document-style preview of supported borrowing markets"
                  fill
                  sizes="(max-width: 1200px) 100vw, 1120px"
                  className="object-cover object-center"
                />
              </div>
              <SandboxNotice className="mt-4 sm:mt-5" />
            </div>

            <div className="flex flex-col gap-12 md:gap-14">
              <BorrowPowerSection locale={locale} />
              <PositionSafetyCardsSection locale={locale} />
            </div>

          </div>
        </div>
      </PerformanceSection>

      <div className="site-content-shell flex flex-col">
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
