import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'integrations/lens', {
    title: "Lens",
    description: "The Lens is Avana's read-only periphery contract: single-call views of accounts, markets, prices, risk and liquidation, and previews sized to stay valid until a transaction's deadline.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "account-views", title: "Account Views" },
  { id: "market-views", title: "Market Views" },
  { id: "price-views", title: "Price and State Views" },
  { id: "risk-views", title: "Risk Views" },
  { id: "liquidation-preview", title: "Liquidation Preview" },
  { id: "borrower-previews", title: "Borrower Previews" },
  { id: "constants-errors", title: "Constants and Errors" },
  { id: "example", title: "Example Session" },
]

export default async function LensPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "integrations/lens", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Lens"
          description="A read-only view contract, one per chain, for the app, keepers, monitoring and the public backing proof. Every result is advisory; the target contract re-checks it."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            The Lens is an immutable, read-only periphery contract, one per chain. It gathers state from every Avana contract, the CDP Spokes, Hubs and oracles into single-call views, and returns previews that carry the margins needed to stay valid between the block they were read at and the block that includes the transaction.
          </p>
          <div className="doc-topic mb-4 type-doc-body">
            The Lens sits outside the audited core. No core contract calls it, stores its address or depends on what it returns, and nothing it returns authorizes an action. A Lens bug can mislead a user or keeper into a transaction that reverts or pays less than shown; it cannot move value. It is reviewed and tested as periphery.
          </div>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>A new Lens is a new deployment, made when a dependency&apos;s interface changes. Replacing it needs no governance action; the verified deployment manifest records the address consumers use.</li>
            <li>Every returned struct carries the block number and timestamp it was read at. The Lens emits no events and moves no tokens.</li>
            <li>Every view reverts with <code className="type-doc-inline-code">Locked</code> while an Avana call holds the protocol Lock, so no view reads half-updated state.</li>
            <li>Positions are named by the AMM integration&apos;s position key: the token ID for Uniswap v3, and the generation-prefixed token ID for Aerodrome Slipstream.</li>
          </ul>
        </section>

        <section id="account-views" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Account Views</h2>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Function</th><th className="text-left px-4 py-2 type-doc-subsection-title">Arguments</th><th className="text-left px-4 py-2 type-doc-subsection-title">Returns</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">predictProxy</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">wallet, marketId</code></td><td className="px-4 py-2">The wallet&apos;s proxy address for the market and whether it is deployed. The address is exact before deployment, so an app can show an account before it exists.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">getAccount</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">wallet, marketId</code></td><td className="px-4 py-2">The account view: proxy, borrow nonce, Aave account data, debt in each approved debt reserve, gate status, the market position, breaker reasons, rescue units and whether the wallet is frozen</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">getRecords</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">proxy, offset, limit</code></td><td className="px-4 py-2">One page of the account&apos;s records (at most 16) in seizure-list order, with credited units after reconciliation</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">getEscrowClaimable</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">account, tokens</code></td><td className="px-4 py-2">Unclaimed payouts held for the account by the payout escrow, one amount per requested token</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="market-views" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Market Views</h2>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Function</th><th className="text-left px-4 py-2 type-doc-subsection-title">Arguments</th><th className="text-left px-4 py-2 type-doc-subsection-title">Returns</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">checkBacking</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">vaultToken</code></td><td className="px-4 py-2">The market-level backing check and the Aave configuration check, including the three standard-Spoke settings, as raw values and pass or fail flags</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">checkRecordBacking</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">vaultToken, offset, limit</code></td><td className="px-4 py-2">For one page of record IDs: custody of each position and its live liquidity against its credited units</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">getPendingSettlement</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">vaultToken</code></td><td className="px-4 py-2">The pending-settlement balance of reconciled seizures and whether LPVaultSwap holds enough units to settle it</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">getCapHeadroom</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">vaultToken, depositor</code></td><td className="px-4 py-2">Avana USD cap headroom (market, token, depositor, pool share), the minimum pledge value, top-up slice headroom, the Hub add-cap headroom and the draw-cap headroom of every approved debt reserve</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="price-views" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Price and State Views</h2>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Function</th><th className="text-left px-4 py-2 type-doc-subsection-title">Arguments</th><th className="text-left px-4 py-2 type-doc-subsection-title">Returns</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">getPriceState</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">vaultToken</code></td><td className="px-4 py-2">The market&apos;s price state, liquidation state, reasons, served and accepted prices, input ages against both age limits, deviations, the disagreement pause and its expiry, the grace window and the sequencer status. Served is at most accepted whenever the state is not Live.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">getDebtPriceState</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">spoke, debtReserveId</code></td><td className="px-4 py-2">A debt reserve&apos;s Aave price source, price, source timestamp, age and freshness flags for borrowing and liquidation. A fixed source such as GHO reports age 0 and both flags true.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">getApplicationState</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">hub</code></td><td className="px-4 py-2">The Hub&apos;s pause state: None, Frozen or Paused</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">getPauseReason</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">hub</code></td><td className="px-4 py-2">The pause reason: 0 None, 1 General (rescue top-ups only), 2 MintPathSuspect (every pledge, top-up and re-credit refused)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            Liquidation, pending settlement, repay, fee collection and debt-free withdrawal are open in every pause state. The meaning of each price state is on the price states page:{" "}
            <Link href="/developers/integrations/price-states" className="text-type-accent hover:underline">Price States</Link>.
          </p>
        </section>

        <section id="risk-views" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Risk Views</h2>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Function</th><th className="text-left px-4 py-2 type-doc-subsection-title">Arguments</th><th className="text-left px-4 py-2 type-doc-subsection-title">Returns</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">getBreakerStatus</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">marketId</code></td><td className="px-4 py-2">The market breaker&apos;s reason bitmap (conditions true now, temporary gates still recovering, latched freezes) and when the last temporary gate reopens. A tripped breaker blocks only new activity.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">getDebtBreakerStatus</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">spoke, debtReserveId</code></td><td className="px-4 py-2">The same for a debt reserve</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">isFrozenAddress</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">account</code></td><td className="px-4 py-2">Whether the address is frozen in the MarketRegistry</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">getTailCoverage</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">debtAsset</code></td><td className="px-4 py-2">The funded First-Loss Reserve of a debt asset against its largest one-token tail exposure: funded balance, minimum, worst token, exposure and coverage ratio. Rounding never overstates coverage.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">uncoveredDeficit</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">hub, asset</code></td><td className="px-4 py-2">The deficit the Hub has recorded for the asset above what its Avana Umbrella (Coverage Spoke) holds</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">getHubAssetExposure</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">hub, asset</code></td><td className="px-4 py-2">The exposure of a Hub and asset across every Spoke drawing on it, with its coverage check</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="liquidation-preview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Liquidation Preview</h2>
          <p className="mb-4 type-doc-body">
            <code className="type-doc-inline-code">previewLiquidation(proxy, debtReserveId, deadline)</code> returns every liquidation gate, Aave&apos;s sizing and ready-to-send liquidation parameters for one account, its market and one debt reserve, with the expected seizure, recovery floor, gross and net payout and the loss the caller may bear, all in the debt asset. Any caller without keeper tooling can submit a correct call from it.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Gates read fresh prices only for the seized market and the repaid debt reserve; the account&apos;s other reserves count at their served prices.</li>
            <li>The expected repayment follows the pinned Aave V4 liquidation formulas: target health factor, dynamic bonus, caps and the dust rule.</li>
            <li>When the expected repayment is the whole debt, the whole collateral is seized, or the remainder would be close to Aave&apos;s dust threshold, the debt to cover is the whole debt plus 5% (<code className="type-doc-inline-code">LENS_DUST_MARGIN_BPS</code>, 500 bps).</li>
            <li>The parameters have no funding field: the caller funds the whole debt to cover itself, directly or through a flash liquidation helper whose flash amount it sets to the debt to cover. The route mode is primary-then-backup when every primary swap route is usable, otherwise backup only.</li>
            <li>The expected payout is gross: it includes the returned funding. The net payout is the caller&apos;s reward beyond that funding. A caller sets its minimum payout to its funding plus the smallest net payout it accepts. The expected caller loss is how far the payout can fall below the funding at oracle prices.</li>
            <li>The preview reads no flash source and quotes no flash loan. A caller that borrows through a flash liquidation helper reads the helper&apos;s own available liquidity and premium, and sets the helper&apos;s top-up bound to cover the premium plus any expected caller loss beyond the net payout.</li>
            <li>All amounts are 0 when the account&apos;s health factor is at least 1.00.</li>
            <li>The preview is advisory: LPVaultSwap recomputes and enforces every check, Aave sizes the seizure inside its liquidation call, and settlement uses balance deltas, never a preview.</li>
          </ul>
        </section>

        <section id="borrower-previews" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrower Previews</h2>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Function</th><th className="text-left px-4 py-2 type-doc-subsection-title">Arguments</th><th className="text-left px-4 py-2 type-doc-subsection-title">Returns</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">previewBorrowMax</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">wallet, marketId, debtReserveId, deadline</code></td><td className="px-4 py-2">The protocol maximum: the largest borrow that keeps the health factor at 1.00 (or the market&apos;s optional hard floor) once debt has grown until the deadline, with a 0.5% margin. Capped by draw-cap headroom; 0 when any borrow gate fails.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">previewBorrowRecommended</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">wallet, marketId, debtReserveId, deadline</code></td><td className="px-4 py-2">The recommended borrow at health factor 1.10 next to the protocol maximum. A display value; no contract enforces it.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">quoteRepayAll</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">borrower, marketId, debtReserveId, deadline</code></td><td className="px-4 py-2">The spend cap and approval amount for a repay-all included by the deadline: the debt grown to the deadline plus 0.1%, rounded up. The Adapter refunds the unused part in the same call.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">previewRecredit</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">marketId, positionKey</code></td><td className="px-4 py-2">The units a re-credit would add, their cap charge at the last accepted price, and whether only a rescue top-up could book them</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">previewRepayWithCollateral</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">wallet, marketId, positionKey, units, debtReserveId</code></td><td className="px-4 py-2">Debt repaid, debt asset returned to the wallet and the health factor after, at the block&apos;s prices. Returns zeros and the current health factor when the call would revert.</td></tr>
              </tbody>
            </table>
          </div>
          <div className="doc-topic type-doc-body">
            Example: $100,000 of collateral at a 70% collateral factor and no debt gives a borrowing capacity of $70,000, the maximum at health factor 1.00. The recommended borrow is $70,000 / 1.10 = $63,636.
          </div>
        </section>

        <section id="constants-errors" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Constants and Errors</h2>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Constant</th><th className="text-left px-4 py-2 type-doc-subsection-title">Value</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">LENS_MAX_PAGE</code></td><td className="px-4 py-2">200 records per paged call</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">LENS_DUST_MARGIN_BPS</code></td><td className="px-4 py-2">500 bps</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">RECOMMENDED_HEALTH_FACTOR</code></td><td className="px-4 py-2">1.10</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">BORROW_MAX_MARGIN_BPS</code></td><td className="px-4 py-2">50 bps (the 1.005 factor)</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">REPAY_ALL_MARGIN_BPS</code></td><td className="px-4 py-2">10 bps (the 1.001 factor)</td></tr>
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Error</th><th className="text-left px-4 py-2 type-doc-subsection-title">Raised when</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">Locked</code></td><td className="px-4 py-2">An Avana call is in flight</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">LimitTooHigh</code></td><td className="px-4 py-2">A paged call asks for more than the page limit</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">UnknownProxy</code></td><td className="px-4 py-2">The address is not a registered proxy of the market</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">UnknownDebtReserve</code></td><td className="px-4 py-2">The debt reserve is not approved for the Spoke</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">UnknownDebtAsset</code></td><td className="px-4 py-2">No approved debt reserve lends the asset</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="example" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Example Session</h2>
          <p className="mb-4 type-doc-body">
            Example values; each market&apos;s parameters are set at listing. Carol uses market 3, a USDC/USDT Aerodrome Slipstream market on Base, with a collateral factor of 31.2% and USDC priced at $0.9999.
          </p>
          <ol className="list-decimal space-y-2 ps-5 type-doc-body">
            <li>Before pledging, the app reads the price state (Live; USDC/USD 72,000 seconds old, fresh until 88,200), the cap headroom ($4,000,000 of room, minimum pledge $10), the Hub&apos;s pause state (None) and her predicted proxy address.</li>
            <li>After a $20,000 pledge, the account view shows $20,000 of collateral, $6,240 weighted by the collateral factor, and no debt; the records view lists one record of 10,000,000,000 units.</li>
            <li>On the borrow screen, the recommended borrow is 5,673.29 USDC (6,240 / 1.10 / 0.9999) and the maximum is 6,209.56 USDC (6,240 / 1.0050011 / 0.9999).</li>
            <li>On the repay screen, the repay-all quote for 5,024.657535 USDC of debt is 5,029.687935 USDC; the app sets both the approval and the spend cap to it.</li>
            <li>A keeper&apos;s liquidation preview for another account returns the gates, 1,950 USDC to cover, 975 expected seized vault tokens and ready-to-send parameters.</li>
          </ol>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Read-only Lens views for accounts, markets, prices, risk, liquidation and borrower previews."
        sectionColor="cyan"
      />
    </div>
  ))
}
