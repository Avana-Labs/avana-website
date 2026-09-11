import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, "safety/insurance", {
    title: "Umbrella",
    description: "How Avana's Umbrella design applies first-loss capital, staking, and deficit settlement to Aave v4 LP-collateral markets.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "purpose", title: "Where Umbrella enters the flow" },
  { id: "coverage-accounting", title: "Coverage by reserve and Spoke" },
  { id: "funding-approach", title: "First-loss capital and deficit offsets" },
  { id: "offset-growth", title: "Revenue-linked offset accounting" },
  { id: "activation-path", title: "From deficit to settlement" },
  { id: "staking", title: "Staking and slashing" },
  { id: "readiness", title: "Coverage readiness" },
  { id: "coverage-boundary", title: "Coverage limits" },
]

export default async function InsuranceFundsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "safety/insurance", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Umbrella"
          description="How first-loss capital and staked assets support deficit coverage in Avana's Aave v4 markets."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="type-doc-body">
            Avana uses the Umbrella model for deficit protection in its Aave v4 lending
            architecture. It follows the principle of{" "}
            <a href="https://aave.com/docs/aave-v3/umbrella" className="text-[#01AACF] hover:underline">
              Aave Umbrella
            </a>: a defined first-loss layer sits ahead of staked capital that can be slashed
            to cover protocol bad debt. In Avana, that model is applied to LP-backed borrowing
            across a Hub and its Spokes. Coverage depends on the configured debt reserve,
            Spoke, available capital, and settlement rules; it is not a guarantee for every
            position connected to the Hub.
          </p>
        </section>

        <section id="purpose" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Where Umbrella enters the flow</h2>
          <p className="type-doc-body">
            Collateral valuation, exposure limits, and liquidation remain the first controls
            against loss. Liquidation attempts to recover debt from an LP position&apos;s fees
            and principal. If that process leaves a finalized reserve deficit, Umbrella
            provides the coverage mechanism for the eligible shortfall. The trigger is the
            debt left unrecovered after settlement, rather than a temporary fall in health
            factor or an estimated loss while the LP position is still being unwound.
          </p>
        </section>

        <section id="coverage-accounting" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Coverage by reserve and Spoke</h2>
          <p className="type-doc-body">
            Avana&apos;s v4 coverage design attributes risk and first-loss capacity to the debt
            asset and the Spoke that generates the exposure. A USDC reserve serving one
            collateral market can have different liquidation behavior from USDC borrowing
            against a more complex LP market. Keeping that attribution explicit prevents the
            same asset symbol from being treated as one interchangeable coverage balance.
            Liquidation-linked earnings, realized losses, and available coverage are therefore
            evaluated against the relevant reserve-and-Spoke combination.
          </p>
        </section>

        <section id="funding-approach" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">First-loss capital and deficit offsets</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
              The deficit offset defines the first-loss amount ahead of Umbrella stakers.
              Losses assigned to that layer are covered by the associated capital commitment
              before the remaining eligible deficit reaches slashable stake. The offset is
              an accounting and coverage threshold; recording it does not by itself transfer
              assets into a reserve or prove that the funds are immediately available.
            </p>
            <p className="type-doc-body">
              A governance-declared treasury commitment can provide an initial first-loss
              layer without prefunding every covered reserve. That commitment becomes usable
              coverage through an authorized process that moves the required asset when a
              deficit is realized. Prefunded capital makes the available balance explicit.
              For externally controlled Spokes, the proposed entry model pairs credit-line
              approval with an upfront deductible, rather than relying entirely on future
              revenue that has not yet been earned or verified.
            </p>
          </div>
        </section>

        <section id="offset-growth" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Revenue-linked offset accounting</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
              The proposed revenue-linked extension grows first-loss capacity from recognized
              liquidation-related earnings attributable to the covered reserve and Spoke.
              These can include liquidation fees and recovered liquidation value such as
              Smart Value Recapture (SVR). It does not apply one percentage to all protocol
              revenue: earnings are attributed to the debt asset and market whose losses the
              offset is intended to absorb.
            </p>
            <pre className="type-doc-code-block overflow-x-auto"><code>{`deficitOffset(t + 1) = deficitOffset(t)
  + alpha * recognizedLiquidationEarnings
  - realizedLosses
  - decay`}</code></pre>
            <p className="type-doc-body">
              This is the proposed accounting rule, not a fixed parameter schedule. Governance
              defines the reserve-specific allocation rate, alpha, and a cap tied to an
              explicit measure such as stressed expected loss or outstanding reserve debt.
              Recognized losses consume the offset, while decay keeps historical earnings
              from defining coverage indefinitely. Amounts above the cap need a specified
              destination under the approved policy. Actual settlement still requires the
              capital represented by the offset to be available in the required asset.
            </p>
          </div>
        </section>

        <section id="activation-path" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">From deficit to settlement</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
              The v4 flow connects a finalized Spoke loss to coverage of the affected Hub
              reserve. It identifies the debt asset, the originating Spoke, the final amount
              unrecovered, and the first-loss capital assigned to it. An authorized settlement
              path then delivers coverage to the reserve. If a covered deficit exceeds the
              first-loss layer, the remaining eligible amount can reach Umbrella stake under
              the configured slashing rules and available capacity.
            </p>
            <p className="type-doc-body">
              A declared commitment, a slash, and a completed reserve coverage operation are
              distinct states. Monitoring needs to distinguish capital promised, capital
              collected, and debt actually covered. This matters in a Hub–Spoke architecture
              because a loss can be finalized before the corresponding capital reaches the
              reserve. The settlement design therefore includes who can move funds, which
              asset is delivered, and how completion is recorded under stressed conditions.
            </p>
          </div>
        </section>

        <section id="staking" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Staking and slashing</h2>
          <p className="type-doc-body">
            Umbrella participants stake supported assets into a coverage market and receive
            rewards for making that capital available. In return, the stake can lose value
            when an eligible deficit reaches its slashing layer. The coverage market defines
            the protected asset and exposure, reward terms, slashing limits, and withdrawal
            process, including any cooldown. These are market parameters: Aave v3 token
            addresses, cooldown durations, and offset amounts are not defaults for Avana&apos;s
            v4 integration.
          </p>
        </section>

        <section id="readiness" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Coverage readiness</h2>
          <p className="type-doc-body">
            Enabling coverage depends on the covered markets&apos; operating history rather than
            a single Hub-size threshold. The relevant evidence includes recurring attributable
            earnings, stable liquidity, concentration of deposits and collateral, observed
            liquidation behavior, and a settlement path that can deliver capital promptly.
            A new market without enough earnings history may require seeded first-loss
            capital or remain outside coverage until those conditions are met. A brief rise
            in deposits does not establish the same readiness as sustained liquidity and
            reliable liquidations.
          </p>
        </section>

        <section id="coverage-boundary" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Coverage limits</h2>
          <p className="type-doc-body">
            Umbrella addresses eligible protocol deficits after liquidation. It does not
            reimburse ordinary trading losses, impermanent loss, or every failure of an
            external protocol. Coverage is bounded by the approved market scope and capital
            actually available; it does not increase borrowing capacity or remove liquidation
            risk. The <Link href="/developers/safety" className="text-[#01AACF] hover:underline">
              Risk Framework
            </Link>{" "}
            and <Link href="/developers/liquidation" className="text-[#01AACF] hover:underline">
              Liquidation Framework
            </Link>{" "}
            describe the controls and recovery process that operate before deficit coverage.
          </p>
        </section>
      </div>
      <DeveloperScrollSpyRail sections={sections} sectionColor="rose" />
    </div>
  ))
}
