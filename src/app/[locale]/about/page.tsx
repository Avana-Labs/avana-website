import { createPageMetadata } from "@/lib/i18n/page-metadata"
import Image from "next/image"
import { Blocks, ChartNoAxesCombined, ShieldCheck, Workflow, type LucideIcon } from "lucide-react"
import { Link } from "@/i18n/navigation"
import ProtocolRoadmapSection from "@/components/protocol-roadmap-section"
import { FeatureCardDescription, FeatureCardTitle, SectionLead } from "@/components/shared"
import { SITE_NAME } from "@/lib/site"
import { LocalizedMarketing } from "@/components/localized-marketing"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

const riskTeams: {
  number: string
  title: string
  description: string
  icon: LucideIcon
}[] = [
  {
    number: "01",
    title: "Protocol team",
    description:
      "The Protocol team designs and builds Avana's lending system. It owns the smart contracts, LP collateral architecture, liquidation systems, oracle infrastructure, access control, execution environment, and upgrades across integrated AMMs and lending hubs.",
    icon: Blocks,
  },
  {
    number: "02",
    title: "Operations team",
    description:
      "The Operations team coordinates the day-to-day protocol layer. It handles treasury processes, incentive programs, ecosystem growth, contributor workflows, and collateral onboarding operations.",
    icon: Workflow,
  },
  {
    number: "03",
    title: "Market Risk team",
    description:
      "The Market Risk team owns the quantitative side of LP collateral. It covers liquidity depth, volatility, price behavior, concentrated liquidity exposure, liquidation dynamics, pricing integrity, and parameter tuning across market conditions.",
    icon: ChartNoAxesCombined,
  },
  {
    number: "04",
    title: "Collateral Risk team",
    description:
      "The Collateral Risk team owns the qualitative side of onboarding and monitoring. It covers asset structure, liquidity sources, governance dependencies, protocol dependencies, and broader collateral integrity across supported markets.",
    icon: ShieldCheck,
  },
]

export async function generateMetadata({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return createPageMetadata(locale, "about", "/about")
}


export default async function AboutPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return (
    <LocalizedMarketing locale={locale} keys={["about/page", "protocol-roadmap-section"]}>
    <div className="bg-white">
      <section className="pb-16 pt-24 lg:pb-24 lg:pt-40">
        <div className="site-content-shell">
          <div className="mx-auto text-center">
            <h1
              aria-label={`Introducing ${SITE_NAME}: The lending market for AMM liquidity.`}
              className="type-display-title text-foreground"
            >
              <span>{`Introducing ${SITE_NAME}:`}</span>
              <br />
              <span className="text-type-accent">
                The lending market for AMM liquidity.
              </span>
            </h1>
          </div>

          <div className="relative mt-10 aspect-[1630/965] w-full overflow-hidden lg:mt-14">
            <Image
              src="/avana-pool-hero.png"
              alt="Avana about hero image"
              fill
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="mx-auto mt-10 max-w-3xl space-y-8 lg:mt-14">
            <SectionLead variant="body">
              Avana is the lending market for AMM liquidity on Aave V4. Our mission is to make AMM liquidity positions
              usable as collateral across DeFi.
            </SectionLead>
            <p className="type-body-copy">
              Major AMMs hold billions in liquidity, but LP positions are still mostly treated as passive holdings,
              not as productive collateral. Avana starts with selected Uniswap v2 and v3 positions on Ethereum.
            </p>
            <p className="type-body-copy">
              Using LP positions as collateral takes more than listing LP tokens. Avana&apos;s LP Vault holds each
              pledged position and represents it on Aave V4 with a 1:1 vault token. Borrowers draw GHO from the Avana
              Hub through Borrow Spokes for stable, correlated, and blue-chip/stable LP markets. The Hub and Spokes are
              standard Aave V4 contracts owned by the Aave DAO. The Avana Lend Spoke lets lenders supply assets directly to the Avana Hub.
            </p>
            <p className="type-body-copy">
              Smart contracts are only part of the work. The position must stay active in its pool. Its value must be
              measured as conditions change. The market must have enough liquidity to support a loan. Avana divides
              this work across four teams, and each team is responsible for a different part of the risk.
            </p>
            <div className="space-y-5 pt-8">
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2 md:gap-5">
                  {riskTeams.map(({ number, title, description, icon: Icon }) => (
                    <article
                      key={title}
                      className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 md:min-h-[17rem] md:p-6"
                    >
                      <Icon className="size-7 text-type-accent" strokeWidth={1.8} aria-hidden="true" />
                      <FeatureCardTitle as="h2" className="mt-7">
                        {number}. {title}
                      </FeatureCardTitle>
                      <FeatureCardDescription className="mt-3">{description}</FeatureCardDescription>
                    </article>
                  ))}
                </div>
                <p className="type-body-copy text-foreground">
                  Each area has its own owner: technical execution, operations, market modeling, and collateral
                  review.
                </p>
              </div>
            </div>
            <div className="pt-8">
              <ProtocolRoadmapSection locale={locale} />
            </div>
            <SectionLead variant="section" className="text-foreground">
              We are a small team working on a large problem. If you want to join this research effort,{" "}
              <Link
                href="https://twitter.com/avana_labs"
                className="text-type-accent underline decoration-type-accent/30 underline-offset-4 transition hover:decoration-type-accent"
              >
                get in touch.
              </Link>
            </SectionLead>
          </div>
        </div>
      </section>
    </div>
    </LocalizedMarketing>
)
}
