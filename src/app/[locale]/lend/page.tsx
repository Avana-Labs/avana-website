import { createPageMetadata } from "@/lib/i18n/page-metadata"
import dynamic from "next/dynamic"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import type { LucideIcon } from "lucide-react"
import { Gauge, Layers, LockKeyhole, MoveRight, TrendingUp, WalletCards } from "lucide-react"
import { InlineFaqSection, type InlineFaqItem } from "@/components/InlineFaqSection"
import { FeatureCardDescription, FeatureCardTitle, SectionIntro } from "@/components/shared"
import { LocalizedMarketing } from "@/components/localized-marketing"
import HomepageNewsroomSection from "@/components/homepage/HomepageNewsroomSection"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

const PlatformToolsShowcaseSection = dynamic(() => import("@/components/platform-tools-showcase-section"))
const InvestApySection = dynamic(() => import("@/components/invest-apy-section"))
const InvestGrowthCalculatorSection = dynamic(() => import("@/components/invest-growth-calculator-section"))
const DeferredTradeMarketShowcase = dynamic(() => import("@/components/deferred-trade-market-showcase"))

const stableSpokeFaqItems: InlineFaqItem[] = [
  {
    value: "stable-1",
    question: "Is my capital safe?",
    answer:
      "All loans are overcollateralized, and borrowers must remain above the required health threshold. If a position becomes unsafe, liquidation begins automatically through a controlled process designed to protect lender capital and contain losses within that market.",
  },
  {
    value: "stable-2",
    question: "Where does my yield come from?",
    answer:
      "Your yield comes from interest paid by LP backed borrowers. Rates are driven by base utilization at the Aave v4 Hub, with additional Spoke premiums reflecting the risk profile of the LP collateral being funded.",
  },
  {
    value: "stable-3",
    question: "How is this different from supplying to Aave directly?",
    answer:
      "Avana is built on Aave v4 and uses its Hub for liquidity, but it serves a different borrower class. Instead of standard token collateral, Avana enables LP positions as collateral, which creates new borrowing demand and expands yield opportunities for suppliers.",
  },
  {
    value: "stable-4",
    question: "Can I withdraw at any time?",
    answer:
      "Yes, as long as there is sufficient available liquidity in the market. There are no lockups. If utilization is very high, withdrawals may depend on repayments or new liquidity entering the system.",
  },
  {
    value: "stable-5",
    question: "What assets can I supply?",
    answer:
      "At launch, supported assets include GHO, USDC, USDT, ETH, and WBTC, with additional assets added through governance over time. New listings prioritize liquidity depth, reliable oracle support, and strong market demand.",
  },
  {
    value: "stable-6",
    question: "Why can yields be higher than standard lending markets?",
    answer:
      "Avana adds LP specific borrower demand on top of the shared Hub liquidity layer. That demand can increase utilization and support an additional risk premium, which gives suppliers access to yield that standard lending markets may not capture.",
  },
]

const keyFeatureCards = [
  {
    icon: Gauge,
    title: "See your supply rates",
    description:
      "Track APY, utilization, and demand across lending markets from one clear supplier view.",
  },
  {
    icon: WalletCards,
    title: "Manage your deposits",
    description:
      "Keep balances, accrued yield, and available liquidity together in one consolidated surface.",
  },
  {
    icon: LockKeyhole,
    title: "Earn on flexible terms",
    description:
      "Supply when it suits you, earn continuously, and withdraw principal plus yield with no lock-up.",
  },
  {
    icon: MoveRight,
    title: "Easy money movement",
    description:
      "Access and move capital whenever liquidity is available, all from one simple online interface.",
  },
  {
    icon: TrendingUp,
    title: "Navigate rate shifts",
    description:
      "Stay ahead when utilization and borrower demand move rates across stablecoin, ETH, and BTC markets.",
  },
  {
    icon: Layers,
    title: "Allocate with clarity",
    description:
      "Decide where capital should sit across lending markets without losing sight of overall yield.",
  },
] as const

function KeyFeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <article className="flex flex-col feature-card rounded-[1.5rem] p-5 md:p-6">
      <Icon className="h-8 w-8 text-type-accent" strokeWidth={1.85} />
      <FeatureCardTitle className="mt-5">{title}</FeatureCardTitle>
      <FeatureCardDescription className="mt-3 max-w-[22rem]">{description}</FeatureCardDescription>
    </article>
  )
}

export async function generateMetadata({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return createPageMetadata(locale, "lend", "/lend", {
    keywords: [
      "LP-backed credit","DeFi lending","stablecoin yield","Aave v4","onchain yield","supply markets",
    ],
  })
}

export default async function LendPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return (
    <LocalizedMarketing locale={locale} keys={["lend/page", "invest-apy-section", "invest-growth-calculator-section", "platform-tools-showcase-section", "InlineFaqSection", "homepage/HomepageNewsroomSection"]}>
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
                  <h1 className="type-display-title mb-3 max-w-[18ch] text-foreground md:mb-5 md:max-w-[16ch]">
                    Earn interest on your assets
                  </h1>

                  <p className="type-display-lead mb-5 max-w-[34ch] sm:max-w-[38ch] md:mb-6">
                    Supply single assets and earn yields where LP collateral creates real borrow utilization.
                  </p>

                  <div className="flex max-w-md flex-row flex-wrap items-start gap-2 sm:gap-3">
                    <Link
                      href="https://app.avana.cc"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-[#01AACF] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#00a0c2]"
                    >
                      Try Lending
                    </Link>
                    <Link
                      href="/developers"
                      className="inline-flex items-center justify-center rounded-full border border-border bg-white px-4 py-2 text-xs text-foreground transition-colors hover:bg-muted"
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

      <section className="border-t border-border/80 bg-white site-section-gap">
        <div className="site-content-shell">
          <div className="flex flex-col gap-3">
            <SectionIntro eyebrow="How it works" eyebrowTone="emerald" title="Lending in three steps" />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-3">
            <div className="feature-card rounded-2xl p-6 md:p-8">
              <span className="type-step-index">1</span>
              <FeatureCardTitle className="mt-6">Pick a market</FeatureCardTitle>
              <FeatureCardDescription className="mt-3">
                Browse lending markets like GHO, USDC, USDT, ETH, and WBTC while tracking APY, utilization, and borrower demand.
              </FeatureCardDescription>
            </div>

            <div className="feature-card rounded-2xl p-6 md:p-8">
              <span className="type-step-index">2</span>
              <FeatureCardTitle className="mt-6">Supply assets</FeatureCardTitle>
              <FeatureCardDescription className="mt-3">
                Connect your wallet, approve the asset, and supply so your funds enter the pool and start earning right away.
              </FeatureCardDescription>
            </div>

            <div className="feature-card rounded-2xl p-6 md:p-8">
              <span className="type-step-index">3</span>
              <FeatureCardTitle className="mt-6">Earn and withdraw</FeatureCardTitle>
              <FeatureCardDescription className="mt-3">
                Interest accrues continuously, and you can withdraw principal plus yield anytime with no lock-up period.
              </FeatureCardDescription>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <DeferredTradeMarketShowcase />
      </section>

      <section className="relative z-10 site-section-gap">
        <div className="site-content-shell">
          <div className="mb-8 max-w-[600px] space-y-3 md:mb-10">
            <SectionIntro
              eyebrow="Why supply"
              eyebrowTone="emerald"
              title="Clear rates, flexible capital, one place to manage it"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {keyFeatureCards.map((card) => (
              <KeyFeatureCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </div>
      </section>

      <InvestApySection />

      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 flex flex-col">
        <div className="flex-1 flex flex-col relative z-0">
        {/* Rest of page content */}
        <div className="site-content-width flex flex-col site-section-stack site-section-gap pb-16 md:pb-20 2xl:pb-18">
          <InvestGrowthCalculatorSection />

          <PlatformToolsShowcaseSection locale={locale} />

          <HomepageNewsroomSection locale={locale} collection="invest" eyebrowTone="emerald" />

          <div className="pb-16 md:pb-24 2xl:pb-22">
            <InlineFaqSection title="Frequently asked questions" items={stableSpokeFaqItems} eyebrowTone="emerald" withTopBorder={false} />
          </div>
        </div>
      </div>
      </div>
    </main>
  </LocalizedMarketing>
)
}
