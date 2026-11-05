import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'integrations/allowed-pools', {
    title: "Allowed LP Pools",
    description: "Which LP pools Avana accepts as collateral, how pools are approved, and the limits that apply during the pilot.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "review-criteria", title: "Review Criteria" },
  { id: "pool-families", title: "Pool Categories" },
  { id: "risk-application", title: "Risk Application" },
  { id: "integration-notes", title: "Pilot Limits" },
]

const poolFamilies = [
  {
    family: "Stable LP",
    treatment: "Two stablecoins. Candidate: USDC/USDT. Has its own Borrow Spoke, parameters and caps.",
  },
  {
    family: "Correlated LP",
    treatment: "Assets that move together. Candidate: wstETH/WETH. Has its own Borrow Spoke, parameters and caps.",
  },
  {
    family: "Blue-chip/stable LP",
    treatment: "A major asset paired with a stablecoin. Candidate: WETH/USDC. Has its own Borrow Spoke, parameters and caps.",
  },
  {
    family: "Not supported",
    treatment: "Uniswap v4, Curve, Balancer, Aerodrome, other AMMs, and other chains such as Base. Adding any of them requires a separate review and governance approval.",
  },
]

const reviewCriteria = [
  "Reliable external pricing for both underlying tokens",
  "Enough liquidity and price history",
  "Liquidity removal that cannot be restricted",
  "Liquidation proceeds that can be recovered under stress",
  "Exposure within pool, underlying-token and depositor limits, including a limit on the share of a pool's liquidity",
]

export default async function AllowedPoolsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "integrations/allowed-pools", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader

          title="Allowed LP Pools"

          description="Which pools Avana accepts, how they are approved, and the limits that apply during the pilot."

        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>Avana accepts collateral only on Ethereum mainnet: selected Uniswap v2 LP tokens and Uniswap v3 positions. Uniswap v3 is limited to full-range positions and specifically approved ranges. Each pool is approved individually, and for Uniswap v3 so is each fee tier and range. Each approved pool, fee tier and range has its own vault token.</>{" "}<>Pool approval works alongside{" "}
            <Link href="/developers/architecture/collateral-factors" className="text-type-accent hover:underline">
              Collateral Factors
            </Link>{" "}
            and the{" "}
            <Link href="/developers/safety" className="text-type-accent hover:underline">
              Risk Framework
            </Link>
            . Approval decides whether a pool can be used. The Collateral Factor decides how much
            can be borrowed against each position.</>{" "}<>{"Each supported position type has an AMM settlement adapter. The adapters redeem LP tokens and remove liquidity. They also collect fees and execute approved exits. New collateral pools are published for a two-week review before listing approval."}</>
          </p>
        </section>

        <section id="review-criteria" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Review Criteria</h2>
          <p className="mb-4 type-doc-body">
            The Risk Module checks that a deposit is in an approved Uniswap v2 pool, or an approved Uniswap v3 pool, fee tier and range. Avana excludes meme-token pools and pools without enough liquidity history or reliable external pricing. It also excludes pools where liquidity removal can be restricted, and markets where liquidation proceeds cannot be recovered under stress. Approved pools must meet the criteria below.
          </p>
          <ul className="space-y-3 type-doc-body">
            {reviewCriteria.map((criterion) => (
              <li key={criterion} className="type-doc-code-block">
                {criterion}
              </li>
            ))}
          </ul>
        </section>

        <section id="pool-families" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Pool Categories</h2>
          <p className="mb-4 type-doc-body">
            Avana groups pools into three categories. The candidate pools are still being assessed.
          </p>
          <div className="space-y-4">
            {poolFamilies.map((family) => (
              <div key={family.family} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                <h3 className="mb-1 type-doc-subsection-title">{family.family}</h3>
                <p className="type-doc-body">{family.treatment}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="risk-application" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Risk Application</h2>
          <p className="mb-4 type-doc-body">
            <>Approval makes a pool eligible. LPOracle then values each position with no haircut. The position&apos;s borrowing capacity comes from the reserve&apos;s Collateral Factor. That factor is the lower Collateral Factor of the two underlying tokens, multiplied by a pool risk factor. The pool risk factor reflects range, price sensitivity, pool depth and expected liquidation costs.</>{" "}<>Each market also has its own settlement mode, TWAP window, allowed price deviation and maximum feed age. Hub caps limit how much each Borrow Spoke can draw.</>
          </p>
        </section>

        <section id="integration-notes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Pilot Limits</h2>
          <div className="space-y-3 type-doc-body">
            <p>
            <>During the pilot, only allowlisted depositors can pledge positions. Each market has a minimum and maximum position size. Each account has a limit on the number of positions it can hold.</>{" "}<>Governance can remove the depositor allowlist once the pilot criteria are met. Adding a pool requires the two-week public review and governance approval.</>
          </p>
          </div>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Accepted pools, approval criteria and pilot limits for LP collateral on Avana."
        sectionColor="cyan"
      />
    </div>
  ))
}
