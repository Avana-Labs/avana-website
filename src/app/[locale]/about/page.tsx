import { createPageMetadata } from "@/lib/i18n/page-metadata"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import ProtocolRoadmapSection from "@/components/protocol-roadmap-section"
import { SectionIntro, SectionLead } from "@/components/shared"
import { SITE_NAME } from "@/lib/site"
import { LocalizedMarketing } from "@/components/localized-marketing"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

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
        <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6 2xl:px-0">
          <div className="mx-auto text-center">
            <h1
              aria-label={`Introducing ${SITE_NAME}: A lending protocol for LP-backed loans`}
              className="type-display-title text-foreground"
            >
              <span>{`Introducing ${SITE_NAME}:`}</span>
              <br />
              <span className="text-type-accent">
                A lending protocol for LP-backed loans
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
            <SectionLead variant="display">
              One of crypto&apos;s most important sources of collateral is hiding in plain sight:{" "}
              <span className="text-type-accent">AMM liquidity.</span>
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
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h3 className="type-body-copy text-foreground">
                      01. Protocol team
                    </h3>
                    <p className="type-body-copy">
                      Protocol owns the design and implementation of Avana&apos;s lending system, including smart
                      contracts, LP collateral architecture, liquidation systems, oracle infrastructure, access control,
                      execution environment, and upgrades across integrated AMMs and lending hubs.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="type-body-copy text-foreground">
                      02. Operations team
                    </h3>
                    <p className="type-body-copy">
                      Operations coordinates the day-to-day protocol layer, including treasury processes, incentive
                      programs, ecosystem growth, contributor workflows, and collateral onboarding operations.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="type-body-copy text-foreground">
                      03. Market Risk team
                    </h3>
                    <p className="type-body-copy">
                      Market Risk owns the quantitative side of LP collateral: liquidity depth, volatility, price
                      behavior, concentrated liquidity exposure, liquidation dynamics, pricing integrity, and parameter
                      tuning across market conditions.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="type-body-copy text-foreground">
                      04. Collateral Risk team
                    </h3>
                    <p className="type-body-copy">
                      Collateral Risk owns the qualitative side of onboarding and monitoring, including asset structure,
                      liquidity sources, governance dependencies, protocol dependencies, and broader collateral
                      integrity across supported markets.
                    </p>
                  </div>
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
