import { createPageMetadata } from "@/lib/i18n/page-metadata"
import Image from "next/image"
import { Blocks, ChartNoAxesCombined, ShieldCheck, Workflow, type LucideIcon } from "lucide-react"
import { Link } from "@/i18n/navigation"
import ProtocolRoadmapSection from "@/components/protocol-roadmap-section"
import { FeatureCardDescription, FeatureCardTitle, SectionIntro, SectionLead } from "@/components/shared"
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
      "Protocol owns the design and implementation of Avana's lending system, including smart contracts, LP collateral architecture, liquidation systems, oracle infrastructure, access control, execution environment, and upgrades across integrated AMMs and lending hubs.",
    icon: Blocks,
  },
  {
    number: "02",
    title: "Operations team",
    description:
      "Operations coordinates the day-to-day protocol layer, including treasury processes, incentive programs, ecosystem growth, contributor workflows, and collateral onboarding operations.",
    icon: Workflow,
  },
  {
    number: "03",
    title: "Market Risk team",
    description:
      "Market Risk owns the quantitative side of LP collateral: liquidity depth, volatility, price behavior, concentrated liquidity exposure, liquidation dynamics, pricing integrity, and parameter tuning across market conditions.",
    icon: ChartNoAxesCombined,
  },
  {
    number: "04",
    title: "Collateral Risk team",
    description:
      "Collateral Risk owns the qualitative side of onboarding and monitoring, including asset structure, liquidity sources, governance dependencies, protocol dependencies, and broader collateral integrity across supported markets.",
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
    <main className="bg-white">
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
              Avana is building the lending market for AMM liquidity on Aave V4. Our mission is to make AMM liquidity
              positions usable as collateral across DeFi.
            </SectionLead>
            <p className="type-body-copy">
              Major AMMs already hold billions in liquidity, yet LP positions are still treated mostly as passive
              positions rather than productive collateral. Avana brings that liquidity into lending markets for
              today&apos;s DEXs and LP types, using dual oracles and stronger risk controls.
            </p>
            <p className="type-body-copy">
              That requires more than listing LP tokens as collateral. Avana is built around specialized Aave v4 Spokes
              for different DEX designs, several Aave v4 Hubs organized around lowest-risk, correlated, and higher-range
              LP markets, and an Aave v4 Lend Spoke that supplies the capital behind those markets.
            </p>
            <p className="type-body-copy">
              <span className="text-foreground">The end state is simple:</span> LP positions that can earn
              in AMMs, back loans in lending markets, and carry risk controls specific to the pools they come from.
            </p>
            <div className="space-y-5 pt-8">
              <SectionIntro
                eyebrow="Protocol Operations"
                eyebrowTone="cyan"
                title="Risk Management"
              />

              <div className="space-y-5">
                <p className="type-body-copy">
                  Risk management in Avana is split across specialized contributor scopes so no single team owns every
                  assumption behind an LP collateral market.
                </p>
                <div className="grid gap-4 md:grid-cols-2 md:gap-5">
                  {riskTeams.map(({ number, title, description, icon: Icon }) => (
                    <article
                      key={title}
                      className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 md:min-h-[17rem] md:p-6"
                    >
                      <Icon className="size-7 text-type-accent" strokeWidth={1.8} aria-hidden="true" />
                      <FeatureCardTitle className="mt-7">
                        {number}. {title}
                      </FeatureCardTitle>
                      <FeatureCardDescription className="mt-3">{description}</FeatureCardDescription>
                    </article>
                  ))}
                </div>
                <p className="type-body-copy text-foreground">
                  The goal is clean separation, with technical execution, operations, market modeling, and collateral
                  review each owned independently.
                </p>
              </div>
            </div>
            <div className="pt-8">
              <ProtocolRoadmapSection locale={locale} />
            </div>
            <SectionLead variant="section" className="text-foreground">
              We are a small team working on a large problem. If you&apos;re interested in joining this research
              effort,{" "}
              <Link
                href="https://twitter.com/avana_labs"
                className="text-type-accent underline decoration-type-accent/30 underline-offset-4 transition hover:decoration-type-accent"
              >
                we would love to hear from you.
              </Link>
            </SectionLead>
          </div>
        </div>
      </section>
    </main>
    </LocalizedMarketing>
)
}
