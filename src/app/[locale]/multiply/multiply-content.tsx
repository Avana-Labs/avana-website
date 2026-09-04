import { createPageMetadata } from "@/lib/i18n/page-metadata"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import type { LucideIcon } from "lucide-react"
import {
  Activity,
  BadgePercent,
  Layers,
  MousePointerClick,
  TrendingUp,
  Undo2,
} from "lucide-react"
import { InlineFaqSection, type InlineFaqItem } from "@/components/InlineFaqSection"
import LeverageGlanceShowcaseSection from "@/components/leverage-glance-showcase-section"
import HomepageNewsroomSection from "@/components/homepage/HomepageNewsroomSection"
import { FeatureCardDescription, FeatureCardTitle, SectionIntro } from "@/components/shared"
import { siteRoutes } from "@/lib/site"
import { LocalizedMarketing } from "@/components/localized-marketing"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

const loopingBenefits: {
  title: string
  description: string
  icon: LucideIcon
}[] = [
  {
    title: "Grow exposure faster",
    description:
      "Turn a smaller deposit into larger exposure without parking more capital up front.",
    icon: TrendingUp,
  },
  {
    title: "Stretch every dollar",
    description:
      "Use the same capital as collateral and leverage so less of your balance sits idle.",
    icon: BadgePercent,
  },
  {
    title: "Skip the busywork",
    description:
      "Avana opens the full loop so you can skip manual borrow, swap, and redeposit steps.",
    icon: MousePointerClick,
  },
  {
    title: "Set your own multiple",
    description:
      "Pick how aggressive the loop should be and stop where risk still feels right for you.",
    icon: Layers,
  },
  {
    title: "Watch health live",
    description:
      "See debt, exposure, and safety together so you know when to add buffer or take profit.",
    icon: Activity,
  },
  {
    title: "Exit when you want",
    description:
      "Scale down, repay, or close anytime instead of staying locked into a rigid term loan.",
    icon: Undo2,
  },
]

const leverageFeatureItems = [
  {
    title: "Leverage Layer",
    description: "Draw LP-backed credit and deploy borrowed capital into the market.",
  },
  {
    title: "Unwind Layer",
    description: "Close, reduce, repay, or liquidate with debt coverage first.",
  },
  {
    title: "Risk Layer",
    description: "Track collateral, debt, and leverage in real time before risk rises.",
  },
  {
    title: "Monitoring Layer",
    description: "Watch collateral, debt, leverage, liquidation, and health in one view.",
  },
] as const

const leverageWorkflowSteps = [
  {
    title: "Pick a market",
    description:
      "Choose your multiply market while watching loop APY and the liquidation threshold for that setup.",
  },
  {
    title: "Set leverage",
    description:
      "Deposit a supported LP position, then set your target exposure and multiplier for that market.",
  },
  {
    title: "Manage live",
    description: "Avana borrows, opens, and tracks the position so you can reduce, repay, or close in one place.",
  },
] as const

const leverageFaqItems: InlineFaqItem[] = [
  {
    value: "leverage-1",
    question: "What is Avana Leverage Market?",
    answer:
      "Avana Leverage Market lets users deposit supported AMM LP positions as collateral, borrow against them, and open managed leverage or perps exposure from the same position.",
  },
  {
    value: "leverage-2",
    question: "Do I still keep my LP collateral?",
    answer:
      "Yes. Your LP position remains the core collateral of the account until you repay debt and withdraw it, so you do not need to fully exit liquidity to open leverage.",
  },
  {
    value: "leverage-3",
    question: "Is this just normal token borrowing?",
    answer:
      "No. Avana supports simple borrowing, but leverage mode adds an abstracted path where borrowed capital is automatically deployed into managed leverage or perps exposure.",
  },
  {
    value: "leverage-4",
    question: "Where does the liquidity come from?",
    answer:
      "The borrowing layer is designed around Aave v4 style infrastructure. Avana focuses on LP specific underwriting, execution, monitoring, and position management on top.",
  },
  {
    value: "leverage-5",
    question: "Can I close the leverage without withdrawing my LP?",
    answer:
      "Yes. You can unwind the leverage position, reduce or repay debt, and continue holding the LP as collateral if you want to keep the base position active.",
  },
  {
    value: "leverage-6",
    question: "What happens if the position becomes unsafe?",
    answer:
      "Avana monitors the full position and can unwind leverage or liquidate collateral if needed to ensure the underlying debt remains covered.",
  },
  {
    value: "leverage-7",
    question: "Is leverage available for every LP?",
    answer:
      "No. Only supported LP types with reliable valuation logic, risk parameters, and unwind assumptions should be enabled for leverage mode.",
  },
] as const

export async function generateMetadata({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return createPageMetadata(locale, "multiply", "/multiply", {
    keywords: ["LP leverage","AMM leverage","DeFi leverage","DeFi perps","LP perps","LP collateral","Aave v4"],
  })
}

export default async function MultiplyPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return (
    <LocalizedMarketing locale={locale} keys={["multiply/multiply-content", "leverage-glance-showcase-section", "position-safety-section", "InlineFaqSection"]}>
    <main className="bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col px-5 pt-10 sm:px-6 sm:pt-12 md:px-8 md:pt-20 lg:max-w-[64rem] 2xl:max-w-[72rem] lg:min-h-0 lg:px-0">
        <div className="relative z-0">
          <section className="pb-0 lg:pb-10 xl:pb-12">
            <div className="w-full pt-3 pb-0 md:pt-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
                <div className="order-2 mb-8 w-full lg:mb-0 lg:w-[55%]">
                  <div className="relative mx-auto w-full max-w-none lg:mx-0 lg:max-w-[650px] xl:max-w-[700px]">
                    <Image
                      src="/images/Hero__4_.webp"
                      alt="Avana leverage market interface"
                      width={1400}
                      height={1400}
                      priority
                      className="w-full h-auto rounded-[24px] md:rounded-[32px] lg:rounded-[40px]"
                      sizes="(max-width: 1024px) calc(100vw - 40px), 700px"
                    />
                  </div>
                </div>

                <div className="order-1 mb-8 w-full text-left lg:order-2 lg:mb-0 lg:w-[45%]">
                  <h1 className="type-display-title mb-3 max-w-[12ch] text-foreground md:mb-5">
                    <span>Amplify yield</span>
                    <br />
                    <span>under control</span>
                  </h1>

                  <p className="type-display-lead mb-5 max-w-[38ch] sm:max-w-[42ch] md:mb-6">
                    Borrow, reinvest, and repeat through managed strategies designed to increase your market exposure.
                  </p>

                  <div className="flex max-w-md flex-row flex-wrap items-start gap-2 sm:gap-3">
                    <Link
                      href="https://app.avana.cc"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-[#01AACF] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#00a0c2]"
                    >
                      Try Looping
                    </Link>
                    <Link
                      href={siteRoutes.developers}
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
          <div className="flex flex-col gap-6">
            <div className="flex max-w-[600px] flex-col gap-2">
              <SectionIntro
                eyebrow="How it works"
                eyebrowTone="rose"
                title={<span className="block lg:whitespace-nowrap">Looping in three steps</span>}
              />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-3">
            {leverageWorkflowSteps.map((step, index) => (
              <article key={step.title} className="feature-card rounded-2xl p-6 md:p-8">
                <span className="type-step-index">
                  {index + 1}
                </span>
                <FeatureCardTitle className="mt-6">{step.title}</FeatureCardTitle>
                <FeatureCardDescription className="mt-3">
                  {step.description}
                </FeatureCardDescription>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white site-section-gap">
        <div className="site-content-shell">
          <LeverageGlanceShowcaseSection locale={locale} />
        </div>
      </section>

      <section className="bg-white site-section-gap">
        <div className="site-content-shell">
          <div className="mx-auto w-full max-w-[76rem]">
            <div className="max-w-[58rem] space-y-4 text-left">
              <SectionIntro
                eyebrow="Why looping"
                eyebrowTone="violet"
                title={<span className="md:whitespace-nowrap">Multiply your yield up to 10x</span>}
              />
            </div>

            <div className="mt-10 -mx-5 overflow-x-auto px-5 pb-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:mt-16 md:overflow-visible md:px-0 md:pb-0 md:snap-none [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max gap-8 md:grid md:w-full md:grid-cols-2 md:gap-x-16 md:gap-y-14 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-20">
                {loopingBenefits.map((feature) => (
                  <article
                    key={feature.title}
                    className="flex w-[15rem] shrink-0 snap-start flex-col bg-transparent md:w-auto md:shrink"
                  >
                    <feature.icon className="h-11 w-11 text-[#01AACF]" strokeWidth={1.5} aria-hidden="true" />
                    <FeatureCardTitle className="mt-5">{feature.title}</FeatureCardTitle>
                    <FeatureCardDescription className="mt-2 max-w-[22rem]">
                      {feature.description}
                    </FeatureCardDescription>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white site-section-gap">
        <div className="site-content-shell">
          <div className="mx-auto w-full max-w-[76rem]">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,27rem)_minmax(0,1fr)] md:items-start md:gap-8 lg:gap-10 xl:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
              <div className="space-y-4 md:self-start">
                <SectionIntro
                  eyebrow="Position Safety"
                  eyebrowTone="emerald"
                  title={
                    <>
                      <span className="block">Designed for</span>
                      <span className="block">safe leverage</span>
                    </>
                  }
                  titleClassName="max-w-[14ch] md:max-w-none"
                />
                <ol className="mt-7 grid max-w-[32rem] gap-4">
                  {leverageFeatureItems.map((item, index) => (
                    <li key={item.title} className="flex gap-3">
                      <span className="type-meta-label mt-0.5 shrink-0">{index + 1}.</span>
                      <p className="type-body-copy">
                        <span className="text-foreground">{item.title}.</span> {item.description}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="flex items-center justify-center pt-1 md:justify-end">
                <div className="relative w-full max-w-[17rem] sm:max-w-[22rem] md:max-w-[25rem] lg:max-w-[28rem] xl:max-w-[31rem]">
                  <Image
                    src="/images/Avana Coin.webp"
                    alt="Avana coin illustration"
                    width={1714}
                    height={1601}
                    className="h-auto w-full"
                    sizes="(min-width: 1280px) 31rem, (min-width: 1024px) 28rem, (min-width: 768px) 25rem, (min-width: 640px) 22rem, 17rem"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <div className="mx-auto flex w-full max-w-[1200px] flex-col px-4 sm:px-6">
        <div className="relative z-0 flex flex-1 flex-col">
          <div className="site-content-width flex flex-col site-section-stack site-section-gap pb-16 md:pb-20 2xl:pb-18">
            <HomepageNewsroomSection
              locale={locale}
              collection="leverage"
              eyebrowTone="rose"
            />

            <div className="pb-16 md:pb-24 2xl:pb-22">
              <InlineFaqSection
                title="Frequently asked questions"
                items={leverageFaqItems}
                eyebrowTone="rose"
                withTopBorder={false}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  </LocalizedMarketing>
)
}
