import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'integrations/market-lifecycle', {
    title: "Market Lifecycle",
    description: "How a market is deployed, registered, activated, frozen, offboarded and closed: the deployment operations, timelock delays, the offboarding ramp and relisting.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "states", title: "States and Transitions" },
  { id: "deployment-operations", title: "Deployment Operations" },
  { id: "listing-steps", title: "Listing Steps" },
  { id: "activation", title: "Activation" },
  { id: "delays", title: "Timelock Delays" },
  { id: "freeze", title: "Freeze" },
  { id: "offboarding", title: "Offboarding and Wind-Down" },
  { id: "closure", title: "Closure and Relisting" },
  { id: "debt-reserves", title: "Debt Reserves" },
  { id: "example", title: "Example: Market 3" },
]

export default async function MarketLifecyclePage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "integrations/market-lifecycle", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Market Lifecycle"
          description="A market enters Avana only after a five-day public review and an on-chain match check against Aave's configuration, and leaves through a wind-down with no force-close power over borrowers."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            A market is one chain, AMM protocol, pool and exact position shape. It has one vault token and one collateral reserve on one CDP Spoke. A CDP Spoke is one standard, unmodified Aave V4 Spoke per chain, Hub, AMM protocol and risk tier; at launch these are &quot;Uniswap v3 Stable&quot; on the Ethereum Stable LP Hub and &quot;Aerodrome Slipstream Stable&quot; on the Base Stable LP Hub.
          </p>
          <p className="mb-4 type-doc-body">
            Every lifecycle operation runs on one chain through that chain&apos;s AvanaTimelock. Ethereum and Base each have their own timelock, governance multisig, guardian, MarketRegistry, ParameterStore and keepers. A market never moves to another CDP Spoke.
          </p>
          <p className="type-doc-body">
            The pools and listing criteria themselves are described on the allowed pools page:{" "}
            <Link href="/developers/integrations/allowed-pools" className="text-type-accent hover:underline">Allowed LP Pools</Link>.
          </p>
        </section>

        <section id="states" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">States and Transitions</h2>
          <div className="mb-4 type-doc-code-block"><code className="type-doc-body text-gray-900">Registered → Active → (Frozen) → Offboarding → Closed</code></div>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">State</th><th className="text-left px-4 py-2 type-doc-subsection-title">Meaning</th><th className="text-left px-4 py-2 type-doc-subsection-title">How it is reached</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Registered</td><td className="px-4 py-2">Stored but not usable; every pledge reverts</td><td className="px-4 py-2">The listing batch executes after the normal delay</td></tr>
                <tr><td className="px-4 py-2">Active</td><td className="px-4 py-2">Open to pledges and borrowing</td><td className="px-4 py-2"><code className="type-doc-inline-code">activateMarket</code> at the short delay, after the on-chain match check</td></tr>
                <tr><td className="px-4 py-2">Frozen</td><td className="px-4 py-2">Active with the Aave freeze of its vault-token reserve: no pledges into it and no borrows by accounts holding it. Not stored by Avana; derived from Aave&apos;s flag</td><td className="px-4 py-2">The Aave Protocol Guardian (one-way) or the Aave DAO freezes the reserve; only the Aave DAO unfreezes it</td></tr>
                <tr><td className="px-4 py-2">Offboarding</td><td className="px-4 py-2">New pledges and borrowing blocked; repay, fees, withdrawals and liquidation continue; wind-down ramp after the notice</td><td className="px-4 py-2"><code className="type-doc-inline-code">setMarketOffboarding</code> at the short delay, with the Aave freeze</td></tr>
                <tr><td className="px-4 py-2">Closed</td><td className="px-4 py-2">Final; remaining debt-free positions stay withdrawable forever</td><td className="px-4 py-2"><code className="type-doc-inline-code">closeMarket</code> by anyone once the market&apos;s total debt is zero</td></tr>
                <tr><td className="px-4 py-2">Cancelled</td><td className="px-4 py-2">A registration that never went live; its market ID stays reserved for the pool</td><td className="px-4 py-2"><code className="type-doc-inline-code">cancelRegistration</code> at the short delay, only from Registered</td></tr>
              </tbody>
            </table>
          </div>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Offboarding and Closed are final. No MarketRegistry function returns such a market to Active.</li>
            <li>A market is never deleted, because its vault token stays bound to its Spoke and pool and its debt-free positions stay withdrawable.</li>
            <li>The Hub&apos;s pause state applies on top of the market&apos;s own state, and on Base so does the sequencer gate. Circuit breakers are not lifecycle states: a tripped breaker stops new activity while the market stays Active.</li>
          </ul>
        </section>

        <section id="deployment-operations" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Deployment Operations</h2>
          <p className="mb-4 type-doc-body">Three timelocked operations, each at the normal delay, bring a CDP Spoke, a market and a debt reserve into Avana.</p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Operation</th><th className="text-left px-4 py-2 type-doc-subsection-title">What it does</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">deployCdpSpoke(p)</code></td><td className="px-4 py-2">After the Aave payload has deployed a standard Spoke and its AaveOracle and registered it on the Hub, records the Spoke with its home Hub, AMM integration, risk tier, AaveOracle and implementation, and sets the expected liquidation configuration (target health factor 1.10 and minimum bonus 200 bps as Avana&apos;s guidance; the Aave DAO decides). Reverts unless the Spoke is registered on an Avana Hub, no CDP Spoke exists yet for that Hub, integration and tier, and the integration&apos;s LPVault is deployed.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">listCollateralMarket(def)</code></td><td className="px-4 py-2">Deploys the vault token through the factory, binds the market to the AMM integration&apos;s LPVault with its exact range, and records feeds, second sources, standby routes, issuer probes, swap routes into every debt asset, caps and the minimum pledge value. The market is Registered.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">enableDebtReserve(spoke, def)</code></td><td className="px-4 py-2">Records a debt reserve with its asset and funding Hub, checks the credit line against the coverage of the Avana Umbrella (Coverage Spoke), checks that every market on the Spoke has a primary and backup swap route into the asset, checks liquidation liveness and the flash source, and enables borrowing. A non-GHO asset first gets its own DebtOracle.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="listing-steps" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Listing Steps</h2>
          <ol className="list-decimal space-y-2 ps-5 type-doc-body">
            <li>The Aave V4 risk service providers and Avana publish the listing package: thresholds and evidence for every listing rule, caps, the minimum pledge value, pool risk factor, each feed&apos;s published heartbeat, standby routes and issuer probes.</li>
            <li>Avana operators deploy the market&apos;s LPOracle, which must seed a Live price at initialization, and raise the pool&apos;s observation buffer to cover the TWAP window at the chain&apos;s block time.</li>
            <li>The governance multisig schedules one timelock batch at the normal delay. On the first market of a Spoke it includes the Spoke registration, the liquidation expectations and the first debt reserve; then new feeds, token collateral factors, tolerances and token listings; the vault-token deployment; the market registration; the market&apos;s parameters, caps and minimum pledge value; and the swap routes. Scheduling is public and starts the five-day review; any canceller can cancel the batch.</li>
            <li>The Aave DAO executes the listing payload: the CDP Spoke and its AaveOracle on a Spoke&apos;s first market, the debt reserves, the flash-borrower role, the funded Coverage Spoke, the Hub asset with zero liquidity fee, and the vault-token reserve with borrowing off, share receiving off, liquidation fee 0, no reinvestment controller and the LPOracle as price source.</li>
            <li>After the delay, anyone executes the batch. The MarketRegistry stores the market as Registered and runs every on-chain listing check. Operators poke the LPOracle and confirm a Live price.</li>
            <li>Operators run the off-chain live-configuration check against the approved deployment manifest. Keepers add the market in observe-only mode.</li>
            <li>The governance multisig schedules <code className="type-doc-inline-code">activateMarket</code> at the short delay; anyone executes it.</li>
          </ol>
        </section>

        <section id="activation" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Activation</h2>
          <p className="mb-4 type-doc-body">
            Markets are created inactive so that no user action can reach a market whose Aave side has not been verified. <code className="type-doc-inline-code">activateMarket(marketId)</code> reverts with <code className="type-doc-inline-code">ActivationCheckFailed</code> unless every check passes:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>The market is Registered, and the CDP Spoke&apos;s implementation and debt reserves match those recorded.</li>
            <li>The vault-token reserve exists with the right decimals, borrowing off, share receiving off, not paused or frozen, liquidation fee 0, and a collateral factor above 0 and at most the expected value.</li>
            <li>The reserve&apos;s price source is the market&apos;s LPOracle and the LPOracle is Live; each debt reserve&apos;s price source matches.</li>
            <li>The vault-token asset is listed only on its CDP Spoke, every draw cap on it is 0 and Hub shares equal assets.</li>
            <li>Both swap routes of every pool token into every debt asset are registered and usable, and the liquidation liveness inequality holds.</li>
            <li>The configuration drift check finds nothing.</li>
          </ul>
          <p className="type-doc-body">
            The short delay suffices because every market field except the Aave reserve identifiers was fixed at registration after the full review, and activation succeeds only when the executed Aave payload matches it. The 12 hours give cancellers time to stop an activation that looks wrong off-chain.
          </p>
        </section>

        <section id="delays" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Timelock Delays</h2>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Class</th><th className="text-left px-4 py-2 type-doc-subsection-title">Delay</th><th className="text-left px-4 py-2 type-doc-subsection-title">Lifecycle operations</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Normal</td><td className="px-4 py-2">5 days (bounds 4 to 5 days)</td><td className="px-4 py-2">Spoke registration, market listing, debt-reserve enabling and removal, token listing, feed definitions, new price sources and standby routes, new swap routes, every loosening, restoring a price route, upgrades</td></tr>
                <tr><td className="px-4 py-2">Short</td><td className="px-4 py-2">12 hours</td><td className="px-4 py-2">Activation, cancelling a registration, starting offboarding, every tightening, disabling or restoring a previously approved swap route, freezes, pauses, breaker trips, a timelock standby switch</td></tr>
                <tr><td className="px-4 py-2">Immediate (guardians)</td><td className="px-4 py-2">None</td><td className="px-4 py-2">Application freeze or pause, address freeze, breaker trips and the standby route switch; each only stops new activity or replaces a route with one reviewed at listing</td></tr>
                <tr><td className="px-4 py-2">Aave governance</td><td className="px-4 py-2">Aave&apos;s own process</td><td className="px-4 py-2">Collateral factors, bonus, collateral risk, Hub add caps, Spoke draw caps (credit lines), reserve freezes and unfreezes</td></tr>
              </tbody>
            </table>
          </div>
          <p className="type-doc-body">
            A ready operation can be executed by anyone until 14 days after it became ready; after that it expires and must be proposed again. An operation takes the short delay only when every call in it is on the short-delay list, so one loosening makes the whole batch wait the normal delay.
          </p>
        </section>

        <section id="freeze" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Freeze</h2>
          <p className="type-doc-body">
            Freezing a market is the Aave freeze of its vault-token reserve, set one-way by the Aave Protocol Guardian or by the Aave DAO. It moves an Active market to Frozen at once; only the Aave DAO unfreezes it. The RiskModule reads the flag and rejects pledges into the market and borrows by accounts holding it, while repay, withdrawals and liquidation continue. Avana keeps no market freeze of its own; a stop of new activity in one market is its market breaker.
          </p>
        </section>

        <section id="offboarding" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Offboarding and Wind-Down</h2>
          <p className="mb-4 type-doc-body">
            Offboarding is a 12-hour timelock operation, <code className="type-doc-inline-code">setMarketOffboarding(marketId)</code>, together with an Aave freeze of the market&apos;s vault-token reserve, which stops new pledges and borrowing at once. Repay, fee collection, withdrawals with and without debt, and liquidation stay open.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Public notice: at least <code className="type-doc-inline-code">offboardNoticeSeconds</code>, 5 days, before the first wind-down step.</li>
            <li>Ramp: after the notice, anyone can call <code className="type-doc-inline-code">stepWindDown(marketId)</code> at most once per day. Each step lowers the reserve&apos;s liquidation threshold through Aave&apos;s dynamic configuration, linearly over 30 days, down to 50% of the listed value. The steps are pre-approved in the Aave payload, so the ramp needs no further proposal.</li>
            <li>The final threshold is not 0, because 0 would make every borrower liquidatable in one block.</li>
            <li>Existing debt is never cancelled and there is no force-close power. The ramp ends the wind-down by making each remaining borrower repay or become liquidatable at the final threshold.</li>
            <li>The market&apos;s price feeds, swap routes and keeper duty stay in service until closure.</li>
          </ul>
          <div className="mb-4 type-doc-code-block"><code className="type-doc-body text-gray-900">LT(t) = LT₀ − ⌊(LT₀ − LT_final) × min(t, T) / T⌋</code></div>
          <div className="doc-topic type-doc-body">
            Example: a listed threshold of 34% ends at 17%. On day 12 the threshold is 34% − ⌊17% × 12 / 30⌋ = 27.2%. An account with $10,000 of collateral and $2,000 of debt has a health factor of 1.36 on day 12 and 0.85 at the end, so it repays or is liquidated.
          </div>
        </section>

        <section id="closure" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Closure and Relisting</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>When the total debt of every account in the market is zero, anyone calls <code className="type-doc-inline-code">closeMarket(marketId)</code>; it reverts with <code className="type-doc-inline-code">MarketHasDebt</code> otherwise. The market becomes Closed and its oracle, swap-route and keeper duties end.</li>
            <li>Debt-free positions stay in custody until their depositors withdraw them, with no time limit; a debt-free withdrawal reads no price. Zero-credit records stay releasable.</li>
            <li>A closed market cannot reopen, and no second vault token can be deployed for the same Spoke, pool and range. The same pool and range can return only as a new market on another CDP Spoke, through the full five-day review, with a new vault token and market ID.</li>
            <li>Moving a pool to another risk tier is the same: a new listing on the target tier&apos;s CDP Spoke and the offboarding of the old market. Users move by repaying, withdrawing and pledging again into a new proxy.</li>
            <li>A registration cancelled before activation keeps its market ID reserved for its pool. A later listing of that pool reuses the ID and the existing vault token, which must name the same LPOracle.</li>
          </ul>
        </section>

        <section id="debt-reserves" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Debt Reserves</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>GHO is the first debt reserve of each CDP Spoke and keeps Aave&apos;s fixed $1 price source. USDC, USDT or WETH can be added per Spoke with <code className="type-doc-inline-code">enableDebtReserve</code>, each priced by its own DebtOracle.</li>
            <li>The Aave payload lists the reserve and funds its Coverage Spoke before the Avana batch executes. The CDP Spoke&apos;s draw cap on the asset rises above 0 only after the Coverage Spoke is funded and the batch has executed.</li>
            <li>Removing a debt reserve (<code className="type-doc-inline-code">removeDebtReserve</code>, normal delay) reverts while any debt is drawn on it. The Aave DAO first sets its draw cap to 0 and freezes it, so borrowers repay over time while repay and liquidation stay open.</li>
          </ul>
        </section>

        <section id="example" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Example: Market 3</h2>
          <p className="mb-4 type-doc-body">
            Example values; each market&apos;s parameters are set at listing. The Base Stable LP Hub has no CDP Spoke yet. Market 3 is the USDC/USDT Slipstream pool with tick spacing 1 and the exact range fixed in the listing package, with a collateral factor of 31.2%. GHO is the first debt reserve, with a GHO Coverage Spoke funded to 24,000 GHO. Base blocks are 2 seconds.
          </p>
          <ol className="list-decimal space-y-2 ps-5 type-doc-body">
            <li>Operators deploy market 3&apos;s LPOracle, which seeds a Live price of $2.00 per whole vault token, and raise the pool&apos;s observation buffer to 901.</li>
            <li>Day 0: the governance multisig schedules one batch at the normal delay of 432,000 seconds with the Spoke registration, liquidation expectations (1.10 and 200 bps), the GHO debt reserve, the vault-token deployment, the market listing and its parameters with a $10 minimum pledge. The calldata is public for the review.</li>
            <li>During the delay, the Aave DAO&apos;s Base executor runs the listing payload: the &quot;Aerodrome Slipstream Stable&quot; Spoke, the GHO debt reserve, the vault-token reserve and the funded GHO Coverage Spoke.</li>
            <li>Day 5: anyone executes the batch. The coverage check passes for a 120,000 GHO draw cap at a 20% coverage ratio against 24,000 GHO. The vault token deploys with 6 decimals and market 3 is Registered; a pledge still reverts.</li>
            <li>Operators poke the LPOracle (Live) and run the live-configuration check; keepers watch market 3 in observe-only mode.</li>
            <li>The multisig schedules <code className="type-doc-inline-code">activateMarket(3)</code> at the short delay of 43,200 seconds; anyone executes it on day 5.5 and every match check passes.</li>
            <li>Carol pledges a $20,000 Slipstream position: record 1 of 16.</li>
            <li>A second debt reserve, USDC, is enabled at the normal delay with a USDC Coverage Spoke funded to 50,000 USDC. A 250,000 USDC draw cap passes; 300,000 would revert. Carol borrows 5,000 USDC; her health factor is 20,000 × 0.312 / 5,000 = 1.248.</li>
            <li>Offboarding: the multisig schedules <code className="type-doc-inline-code">setMarketOffboarding(3)</code> at the short delay and the Aave Protocol Guardian freezes the reserve. New pledges and borrows revert with <code className="type-doc-inline-code">MarketOffboarding</code>; the app shows the notice end, 432,000 seconds later.</li>
            <li>Wind-down: after the notice, anyone steps the ramp once a day from 31.2% toward 15.6%. On day 11 the threshold is 25.48% and Carol&apos;s health factor 1.0192; on day 12 it would be 24.96% and 0.9984. She repays her 5,000 USDC on day 11 and withdraws her position debt-free.</li>
            <li>Closure: while any account owes debt, <code className="type-doc-inline-code">closeMarket(3)</code> reverts. Once every account has repaid or been liquidated, anyone calls it. Debt-free positions left in market 3 stay withdrawable with no price read.</li>
            <li>Relisting: market 3 never returns to Active. If the pool must come back, a new CDP Spoke is registered and the same pool and range are listed on it through the full five-day review, giving a new vault token and market ID. Carol pledges again into a new proxy.</li>
          </ol>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Market states, deployment operations, delays, offboarding ramp, closure and relisting."
        sectionColor="cyan"
      />
    </div>
  ))
}
