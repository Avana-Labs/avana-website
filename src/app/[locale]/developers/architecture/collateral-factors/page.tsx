import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'architecture/collateral-factors', {
    title: "Collateral Factors",
    description: "How the collateral factor of each Avana market is computed from its tokens' Aave V4 Core Hub factors and a pool risk factor, how Collateral Risk sets the borrow rate, and which caps also limit borrowing.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "formula", title: "Formula" },
  { id: "token-factors", title: "Token Factors" },
  { id: "pool-risk-factor", title: "Pool Risk Factor" },
  { id: "aave-configuration", title: "Aave Configuration" },
  { id: "worked-example", title: "Worked Example" },
  { id: "collateral-risk", title: "Collateral Risk and Rate" },
  { id: "caps", title: "Caps" },
]

export default async function CollateralFactorsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "architecture/collateral-factors", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Collateral Factors"
          description="Each market's collateral factor starts from the weakest of its tokens' Aave V4 Core Hub factors and is reduced by a pool risk factor of at most 40%."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            Valuation and borrowing limits are calculated separately. The LPOracle reports the value of the liquidity each vault token represents, with no haircut. The vault-token reserve&apos;s collateral factor then sets how much of that value can support debt. Aave V4 uses one collateral factor for both borrowing and liquidation and calculates health per account. In Avana an account is one PositionProxy holding one market, so each market has its own collateral factor and health factor.
          </p>
        </section>

        <section id="formula" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Formula</h2>
          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"CF_LP = floor(min(CF₁, …, CFₙ) × poolRiskFactor / 10⁴)"}</code>
          </div>
          <div className="mt-2 type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"Borrowing capacity = LP position value × CF_LP"}</code>
          </div>
          <p className="mt-4 mb-4 type-doc-body">
            All values are in basis points. CFᵢ is the collateral factor of each pool token, and the pool risk factor is set per pool. The result rounds down, so it is never above the formula and at most 1 bps below it, and Aave never lends more than the computed factor allows.
          </p>
          <p className="mb-4 type-doc-body">
            An LP position is only as good as its weakest token, so the smallest token factor bounds it. The pool risk factor then discounts for what an LP position adds on top of its tokens: price-path loss inside the pool, pool manipulation and the cost of unwinding liquidity during a liquidation. It is applied only here; the LPOracle reports the unhaircut value.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Token factors</th><th className="text-left px-4 py-2 type-doc-subsection-title">Pool risk factor</th><th className="text-left px-4 py-2 type-doc-subsection-title">CF_LP</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">USDC 7,800; USDT 7,500</td><td className="px-4 py-2">3,750</td><td className="px-4 py-2">2,812 (2,812.5 rounded down)</td></tr>
                <tr><td className="px-4 py-2">USDC 7,800; USDT 7,500</td><td className="px-4 py-2">4,000</td><td className="px-4 py-2">3,000</td></tr>
                <tr><td className="px-4 py-2">Both 7,800</td><td className="px-4 py-2">4,000 (ceiling)</td><td className="px-4 py-2">3,120 (31.2%)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            {"Example values; each market's parameters are set at listing."}
          </p>
        </section>

        <section id="token-factors" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Token Factors</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Each token&apos;s factor is its Aave V4 Core Hub collateral factor, read by the risk reviewer at listing and stored in Avana&apos;s ParameterStore (bounds 1 to 9,999 bps). The source is recorded in the listing file. There is no automatic link to the Core Hub: factors are recalibrated manually through the timelock.</li>
            <li>A GHO leg uses an explicit factor set in the listing payload, never the Core Hub GHO value, because the Core Hub does not list GHO as collateral at a usable value. Tokens with no Core Hub listing also use an explicit value set at listing.</li>
          </ul>
          <div className="mt-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Parameter</th><th className="text-left px-4 py-2 type-doc-subsection-title">Bounds</th><th className="text-left px-4 py-2 type-doc-subsection-title">Change</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">tokenCollateralFactorBps</code></td><td className="px-4 py-2">1 – 9,999</td><td className="px-4 py-2">Normal delay (5 days)</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">ghoLegCollateralFactorBps</code></td><td className="px-4 py-2">1 – 9,999</td><td className="px-4 py-2">Set per token in the listing payload; normal delay</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">poolRiskFactor</code></td><td className="px-4 py-2">1 – 4,000</td><td className="px-4 py-2">Lower at the short delay (12 hours); raise at the normal delay</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="pool-risk-factor" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Pool Risk Factor</h2>
          <p className="mb-4 type-doc-body">
            The Aave V4 risk service providers set each pool&apos;s risk factor in the market&apos;s listing payload, within 1 to 4,000 bps, so the pool risk factor is at most 40%. It reflects the position&apos;s range, price sensitivity, pool depth and expected liquidation costs.
          </p>
          <p className="mb-4 type-doc-body">
            Avana draws on Gauntlet&apos;s analysis of LP collateral, which recommends conservative starting factors. When the borrowed asset is not one of the pool&apos;s own tokens, such as GHO borrowed against WETH/USDC, it suggests starting as low as 0.25 times the lower underlying factor. Final factors are calibrated per market with the service providers.
          </p>
          <p className="mb-4 type-doc-body">
            At the 40% ceiling, a pool of two tokens with 78% factors has a collateral factor of 31.2%. Borrowing to the Lens recommendation of health factor 1.10 then gives an opening loan-to-value of about 28.4% (31.2% divided by 1.10).
          </p>
        </section>

        <section id="aave-configuration" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Aave Configuration</h2>
          <p className="mb-4 type-doc-body">
            The Aave DAO sets the collateral factor on every dynamic key of the vault-token reserve, greater than 0 and at most the formula value. A key above it is drift: the RiskModule stops new-account pledges, borrowing and withdrawals with debt in that market, while repayment and liquidation continue on Aave&apos;s live values.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>To cut a factor, Avana first lowers the pool risk factor at the short delay, which stops new borrowing against the market through the drift check. The Aave payload then edits every existing key of the reserve.</li>
            <li>To raise a factor, the Avana change at the normal delay executes first and the Aave payload follows.</li>
            <li>Listing margin: for every price route of either token (primary, alternate and standby), 10,000 minus CF_LP must exceed the route&apos;s published feed deviation plus its drift within one heartbeat. With CF_LP of 2,812 the headroom is 7,188 bps, well above a 350 bps alternate route.</li>
            <li>Bonus bound: the maximum liquidation bonus times CF_LP, rounded up, must stay below 10,000 bps, so an account that first becomes liquidatable always holds enough collateral to pay the debt and the bonus. With a 105% maximum bonus and CF_LP of 3,000 the product is 3,150.</li>
            <li>No vault-token reserve key may have collateral factor 0. Offboarding uses positive collateral-factor steps instead.</li>
          </ul>
        </section>

        <section id="worked-example" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Worked Example</h2>
          <p className="mb-4 type-doc-body">
            {"Example values; each market's parameters are set at listing."}{" "}Market 3 is a USDC/USDT Aerodrome Slipstream market on the CDP Spoke &quot;Aerodrome Slipstream Stable&quot; on Base. One whole vault token (10⁶ units) is worth $2.00, CF_LP is 3,120 bps, and USDC is priced at $0.9999.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Item</th><th className="text-left px-4 py-2 type-doc-subsection-title">Value</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Carol pledges an unstaked position with liquidity 10,000,000,000</td><td className="px-4 py-2">10,000 whole vault tokens, $20,000</td></tr>
                <tr><td className="px-4 py-2">CF-weighted collateral</td><td className="px-4 py-2">$20,000 × 31.20% = $6,240</td></tr>
                <tr><td className="px-4 py-2">Recommended borrow shown by the Lens (health factor 1.10)</td><td className="px-4 py-2">5,673.29 USDC</td></tr>
                <tr><td className="px-4 py-2">Protocol maximum (health factor 1.00)</td><td className="px-4 py-2">6,209.56 USDC</td></tr>
                <tr><td className="px-4 py-2">Carol borrows 5,000 USDC (debt value $4,999.50)</td><td className="px-4 py-2">Health factor 6,240 / 4,999.50 = 1.2481</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 mb-4 type-doc-body">
            The Lens previews add a small margin for interest accrued before the transaction is included, so the previews sit slightly below the plain ratios.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">ARFC illustration</h3>
          <p className="mb-4 type-doc-body">
            The ARFC uses a $100,000 USDC/USDT position with a lower token factor of 75.00% and a pool risk factor of 37.50%, giving 28.12% after rounding down. These figures are not proposed launch parameters.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Item</th><th className="text-left px-4 py-2 type-doc-subsection-title">Result</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Collateral-based borrowing capacity</td><td className="px-4 py-2">28,120 GHO</td></tr>
                <tr><td className="px-4 py-2">Recommended borrow at health factor 1.10</td><td className="px-4 py-2">About 25,560 GHO</td></tr>
                <tr><td className="px-4 py-2">Actual borrowing and initial health factor</td><td className="px-4 py-2">20,000 GHO at 1.41</td></tr>
                <tr><td className="px-4 py-2">Collateral value at health factor 1.00, debt unchanged</td><td className="px-4 py-2">About $71,120 (a fall of about 29%)</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="collateral-risk" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Collateral Risk and Rate</h2>
          <p className="mb-4 type-doc-body">
            Each vault-token reserve also has a Collateral Risk value in bps, set by the risk reviewer in the Aave listing. It is not a haircut on collateral value: it sets the borrower&apos;s risk premium. Because each account holds one market, the account&apos;s premium is that market&apos;s Collateral Risk.
          </p>
          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"Borrowing rate = baseRate × (1 + riskPremium)"}</code>
          </div>
          <ul className="mt-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>The GHO strategy is flat, so the rate does not depend on utilization. The Aave DAO keeps the GHO base rate at or above the Aave V4 Core Hub GHO base rate. This is not enforced on-chain; Avana monitoring alerts if it falls below.</li>
            <li>Premium accrues on drawn debt and does not compound on itself.</li>
            <li>Example: a loan backed by collateral with a 50% risk premium pays 6.75% at a 4.5% base rate. With a 5.50% base rate and a 15% premium, the effective rate is 6.325%.</li>
            <li>The CDP Spoke&apos;s risk-premium threshold must be at least the highest Collateral Risk on the Spoke plus 1 bps, and is never lowered while debt in that asset exists. Otherwise Aave&apos;s premium check could make repay, borrow, withdraw and liquidation revert.</li>
            <li>Avana adds no interest fee on any asset; all interest accrues to the lender.</li>
          </ul>
        </section>

        <section id="caps" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Caps</h2>
          <p className="mb-4 type-doc-body">
            An account&apos;s borrowing capacity also depends on its existing debt, oracle checks and available liquidity. These caps bound how much collateral and debt can exist:
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Cap</th><th className="text-left px-4 py-2 type-doc-subsection-title">Scope</th><th className="text-left px-4 py-2 type-doc-subsection-title">Launch value</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">marketUsdCap</code></td><td className="px-4 py-2">Regular pledge budget per market</td><td className="px-4 py-2">Set per market in the listing payload</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">topUpSliceUsd</code></td><td className="px-4 py-2">Budget reserved for rescue top-ups per market</td><td className="px-4 py-2">10% of the market cap</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">tokenUsdCap</code></td><td className="px-4 py-2">Exposure per pool token across every Spoke and market of a Hub</td><td className="px-4 py-2">Set per token in the listing payload</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">depositorUsdCap</code></td><td className="px-4 py-2">Exposure per depositor across a Hub</td><td className="px-4 py-2">Set in the listing payload</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">minPledgeUsd</code></td><td className="px-4 py-2">Smallest value of a pledge or top-up</td><td className="px-4 py-2">$10</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">stressFloorUsd</code></td><td className="px-4 py-2">Lowest whole-token price used for cap charges and Hub supply-cap sizing</td><td className="px-4 py-2">$1.00</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">poolShareMaxBps</code></td><td className="px-4 py-2">Avana&apos;s share of a pool&apos;s liquidity on a chain</td><td className="px-4 py-2">No limit by default; a per-pool cap only where the listing sets one; alert above 25%</td></tr>
                <tr><td className="px-4 py-2">Hub supply cap</td><td className="px-4 py-2">Vault-token units per market, sized at the stress floor</td><td className="px-4 py-2">(market cap + slice) / stress floor, in whole tokens</td></tr>
                <tr><td className="px-4 py-2">Draw cap</td><td className="px-4 py-2">Debt per CDP Spoke and debt asset</td><td className="px-4 py-2">Within the credit line, flash liquidity and route depth</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            There is no borrower allowlist, no minimum debt and no daily borrow limit. Exposure is limited by these caps and by Aave&apos;s health-factor check. How the health factor is measured is explained in{" "}
            <Link href="/developers/architecture/health-factor" className="text-type-accent hover:underline">Health Factor</Link>.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How each market's collateral factor is computed from token factors and a pool risk factor of at most 40%, how Collateral Risk sets the borrow rate, and which caps limit borrowing."
        sectionColor="violet"
      />
    </div>
  ))
}
