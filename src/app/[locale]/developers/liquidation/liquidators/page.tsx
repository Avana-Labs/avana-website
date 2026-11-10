import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'liquidation/liquidators', {
    title: "Liquidators",
    description: "How approved keepers and permissionless callers liquidate Avana accounts through LPVaultSwap: parameters, route modes, sizing, gas and failures.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "keeper-path", title: "Approved Keeper Path" },
  { id: "route-modes", title: "Route Modes" },
  { id: "permissionless-path", title: "Permissionless Path" },
  { id: "settle-pending", title: "Pending Settlement" },
  { id: "sizing", title: "Sizing a Call" },
  { id: "operations", title: "Keeper Operations" },
  { id: "gas", title: "Gas Model" },
  { id: "example", title: "Example: Permissionless Call" },
  { id: "failures", title: "Failures and Responses" },
]

export default async function DeveloperLiquidatorsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "liquidation/liquidators", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Liquidators"
          description="How approved keepers and any other address call LPVaultSwap, how to size a call, and what each failure means."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            An account can be liquidated when its health factor is below 1 and the prices of its market and the repaid debt reserve are fresh. Every liquidation goes through LPVaultSwap, which has two liquidation entry points and one settlement entry point:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li><code className="type-doc-inline-code">liquidate</code>: for approved keepers, with both route modes.</li>
            <li><code className="type-doc-inline-code">liquidatePermissionless</code>: for any address, with the PrimaryThenBackup route mode only.</li>
            <li><code className="type-doc-inline-code">settlePending</code>: for any address; settles stranded units and pays the caller nothing.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            The caller is always msg.sender at LPVaultSwap, and every caller payout goes to msg.sender. No recipient, route, flash source, recovery-floor override or executable calldata is taken from the caller. Every amount is in base units of the debt asset being repaid.
          </p>
          <p className="mb-4 type-doc-body">
            Eligibility rules and the reasons liquidation is never paused are on the design page: <Link href="/developers/liquidation" className="text-type-accent hover:underline">Liquidation Design</Link>.
          </p>
        </section>

        <section id="keeper-path" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Approved Keeper Path</h2>
          <p className="mb-4 type-doc-body">
            Approved keepers call <code className="type-doc-inline-code">liquidate(LiquidationParams params)</code>, which returns a LiquidationResult. A caller that is not on LPVaultSwap&apos;s keeper list reverts with NotApprovedKeeper before any external call, and can use the permissionless path instead. Every approved keeper is operated by Avana.
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Field</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Meaning</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">proxy</code></td>
                  <td className="px-4 py-2">The borrower&apos;s PositionProxy, the Aave account for one market</td>
                  <td className="px-4 py-2">Must be a valid proxy of the market&apos;s vault token, else UnknownProxy</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">marketId</code></td>
                  <td className="px-4 py-2">The collateral market to seize from</td>
                  <td className="px-4 py-2">Must be the proxy&apos;s market; Registered, Active and Offboarding markets are accepted</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">debtReserveId</code></td>
                  <td className="px-4 py-2">The debt reserve to repay</td>
                  <td className="px-4 py-2">Must be enabled for the Spoke, else UnknownDebtReserve</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">debtToCover</code></td>
                  <td className="px-4 py-2">The most debt asset Aave may pull, passed unchanged to Aave</td>
                  <td className="px-4 py-2">Greater than 0; a bound, never an exact amount</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">keeperFunds</code></td>
                  <td className="px-4 py-2">Debt asset pulled from the keeper at entry</td>
                  <td className="px-4 py-2">keeperFunds plus flashAmount must be at least debtToCover, else InvalidAmount</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">flashAmount</code></td>
                  <td className="px-4 py-2">Debt asset to flash-borrow through the chain&apos;s flash source</td>
                  <td className="px-4 py-2">At most the source&apos;s idle liquidity, else FlashLiquidityShort</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">routeMode</code></td>
                  <td className="px-4 py-2">PrimaryThenBackup or BackupOnly</td>
                  <td className="px-4 py-2">Applied as set; no pool price changes it</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">minAmounts</code></td>
                  <td className="px-4 py-2">Optional least amount of each market token the unwind must return</td>
                  <td className="px-4 py-2">Empty, or one value per market token; it can only make the call revert</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">deadline</code></td>
                  <td className="px-4 py-2">Last valid block timestamp, in seconds</td>
                  <td className="px-4 py-2">Checked first, before the lock and any external call, else DeadlineExpired</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">minPayout</code></td>
                  <td className="px-4 py-2">The smallest caller payout the caller accepts</td>
                  <td className="px-4 py-2">Checked after the payout waterfall, else PayoutTooLow</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">maxShortfall</code></td>
                  <td className="px-4 py-2">The most of the caller&apos;s own debt asset the call may pull after the swaps</td>
                  <td className="px-4 py-2">Covers recovery below the floor and any rounding gap; 0 disables it</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            Each amount is at most 2^128 − 1. The deadline, minPayout and minAmounts change no amount, route or recipient: they can only make the call revert. The recovery floor is computed from oracle prices alone, so minPayout protects the caller while the floor protects Avana and the borrower.
          </p>
          <p className="mb-4 type-doc-body">
            The LiquidationResult returns the debt asset, the debt repaid, the units seized, the amount of each token the unwind returned, the amount recovered, the recovery floor, the flash premium, Avana&apos;s fee, the caller payout, the borrower surplus and the shortfall pulled from the caller.
          </p>
        </section>

        <section id="route-modes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Route Modes</h2>
          <p className="mb-4 type-doc-body">
            Each market has, for each of its tokens and each enabled debt asset, a primary and a backup swap route recorded in the MarketRegistry. Both are held to the same recovery floor and per-leg minimums.
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Mode</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Behaviour</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Available to</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">PrimaryThenBackup</code></td>
                  <td className="px-4 py-2">Calls the primary route if it is usable. If the primary is not usable or reverts, emits RouteFailed for a revert and calls the backup if it is usable.</td>
                  <td className="px-4 py-2">Approved keepers and permissionless callers</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">BackupOnly</code></td>
                  <td className="px-4 py-2">Calls only the backup route of each token.</td>
                  <td className="px-4 py-2">Approved keepers only</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            If no usable route converts a token, the call reverts with NoRouteAvailable. There is no in-kind fallback: the keeper waits for a restored or replaced route. A token that is itself the debt asset needs no route.
          </p>
        </section>

        <section id="permissionless-path" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Permissionless Path</h2>
          <p className="mb-4 type-doc-body">
            Any address can call <code className="type-doc-inline-code">liquidatePermissionless(PermissionlessLiquidationParams params)</code> with no role, registration or agreement. It runs the same settlement as the keeper path, with these differences:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>There is no keeper check.</li>
            <li>The parameters have no route mode field: the call always runs PrimaryThenBackup, so a token with no working primary or backup route reverts with NoRouteAvailable.</li>
            <li>The caller&apos;s own funds are passed as callerFunds instead of keeperFunds.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            Everything else applies unchanged: the recovery floor and the optional shortfall top-up, the per-leg minimums, the price, sequencer and grace gates, the Hub share check, the deadline and the minimum payout. The caller pays its own rounding gap exactly as a keeper does, and receives the caller payout from the same waterfall.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Frozen callers</h3>
          <p className="mb-4 type-doc-body">
            A caller on the chain&apos;s freeze list reverts with AddressIsFrozen on either liquidation function. The check runs right after the deadline check. A frozen wallet&apos;s own accounts are still liquidated like any other.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Approvals</h3>
          <p className="mb-4 type-doc-body">
            Before calling, a caller approves LPVaultSwap for the debt asset it may have to provide: callerFunds, pulled at entry, plus maxShortfall, pulled after the swaps only if needed. A purely flash-funded call with maxShortfall set to 0 needs no approval. LPVaultSwap pulls exact amounts and measures each receipt as a balance change.
          </p>
        </section>

        <section id="settle-pending" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Pending Settlement</h2>
          <p className="mb-4 type-doc-body">
            The function <code className="type-doc-inline-code">settlePending(marketId, debtReserveId)</code> settles vault tokens that an earlier, unsettled seizure left at LPVaultSwap&apos;s fixed address. Collateralization keeps those units backed by real pool tokens in a pending balance, reconciled from the borrower&apos;s records during the next seizure or withdrawal. Any address can call it, the pause state is not read, and it never runs inside a liquidation.
          </p>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>Before taking the lock, LPVaultSwap requires a known market and a non-zero fee recipient. It settles the smaller of its own vault-token balance and Collateralization&apos;s pending units, and reverts with NothingPending if that is 0.</li>
            <li>It reads the sequencer gate (SequencerDown while down), pokes the market&apos;s LP Oracle and applies the collateral price gate (StalePrice).</li>
            <li>The AaveAdapter burns the units, and Collateralization releases the matching pool tokens to LPVaultSwap.</li>
            <li>Each token is swapped into the settlement asset over the market&apos;s routes in PrimaryThenBackup mode, with a slippage allowance of the smaller of the market&apos;s allowance and 30 bps.</li>
            <li>The recovery must reach the pending-settlement floor, else RecoveryBelowFloor.</li>
            <li>The recovered amount is added to the Avana Umbrella (Coverage Spoke) of the settlement reserve&apos;s funding Hub and asset through its public fund function.</li>
            <li>Any unconverted route residue goes to the fee recipient, or to the payout escrow if that transfer fails. The call emits PendingSettlementForwarded.</li>
          </ol>
          <p className="mb-4 type-doc-body">
            The caller receives nothing. The unsettled seizure already repaid debt and the borrower&apos;s records were already debited, so no waterfall applies. The Avana Umbrella is the layer that absorbs the loss of that incident. Each market names its settlement debt reserve at listing, its first enabled debt reserve, changeable at the normal delay.
          </p>
          <p className="mb-4 type-doc-body">
            A pending balance never blocks a liquidation. If the call reverts (price or sequencer gate, no usable route, the floor, or the Coverage Spoke refusing the funds), the tokens stay in custody backing the outstanding units, and anyone can repeat the call later.
          </p>
        </section>

        <section id="sizing" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Sizing a Call</h2>
          <p className="mb-4 type-doc-body">
            Callers size each call from the Lens preview, <code className="type-doc-inline-code">previewLiquidation(proxy, debtReserveId, deadline)</code>, which returns parameters that can be sent unchanged.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Set debtToCover to the previewed Aave amount: the repayment to Aave&apos;s target health factor, or the whole debt in the reserve when Aave&apos;s dust rule applies. There is no minimum size per call.</li>
            <li>For a whole-debt close, the Lens quotes debtToCover with a 500 bps margin, rounded up, or stays at least 500 bps below Aave&apos;s dust boundary.</li>
            <li>Set flashAmount to what the flash source can lend (its idle liquidity) and provide the rest as keeperFunds or callerFunds.</li>
            <li>Set minPayout at least 1% below the previewed payout.</li>
            <li>Set a deadline a short time ahead. 120 s is 10 Ethereum blocks and 60 Base blocks.</li>
            <li>Set maxShortfall to cover the rounding gap the preview reports, and more if you are willing to top up a recovery below the floor.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            Caller inputs are bounds, not exact values. A borrower who repays 1 wei, or repays enough to leave the debt just under the dust threshold, changes the amounts but not the outcome. Debt asset that Aave does not pull is not swapped: it repays flash principal or returns to the caller. Oversizing costs the caller only the flash premium on the unused part.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: the Lens previews a whole debt of 1,950 USDC with a 500 bps margin, so debtToCover is 2,047.5 USDC. A 1-wei repayment lands first. Aave pulls 1,949.999999 USDC, the 97.500001 USDC left over repays part of the flash loan, and the caller payout is 1 wei lower.
          </div>
        </section>

        <section id="operations" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Keeper Operations</h2>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Size by simulation: re-run the Lens preview for each account at each new block and keep signed calls current, with flashAmount checked against the flash source&apos;s available liquidity and caller funds ready for the rest.</li>
            <li>Submit through private order flow on Ethereum, so a pending call is not front-run or left in the public mempool.</li>
            <li>Poke oracles: the LP Oracle and DebtOracle poke function is a permissionless cache write that keepers run on every feed update. LPVaultSwap also pokes the seized market and the repaid reserve inside every call. A poke needs a minimum amount of gas, and a gas-starved poke reverts the whole liquidation.</li>
            <li>Send one account per transaction. Separate transactions never contend for the lock, which is released at the end of each call.</li>
            <li>On Base, size each block&apos;s flash loans to the Base Pool&apos;s idle debt asset and spread larger liquidations over successive 2 s blocks.</li>
            <li>Answer RecoveryBelowFloor with a shortfall top-up from keeper funds or with an arbitrage bundle, never with repeated halving, whose gas would exceed the debt each call repays.</li>
            <li>When the flash source is short, paused or charges above the cap, resubmit with the whole amount as caller funds and flashAmount set to 0.</li>
            <li>During an Aave halt of a CDP Spoke, stop sending calls for that market, keep the prepared calls current, and submit them in ascending health-factor order in the first block after the halt is lifted.</li>
            <li>Liquidate an account with several debt reserves with successive calls until its health factor is at least 1 or a deficit is recorded. Skip accounts with no collateral left.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            Failed floors and route failures are not counted on-chain. Avana&apos;s monitoring records each RouteFailed event and each RecoveryBelowFloor or NoRouteAvailable revert, and raises an alert at 3 failures in 1 hour on a market. The guardian freezes new borrowing on the market only once the approved routes are confirmed unable to settle valid liquidations at the required size; liquidation, repayment and debt-free exits stay open.
          </p>
        </section>

        <section id="gas" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Gas Model</h2>
          <p className="mb-4 type-doc-body">
            A flash-funded liquidation that touches n records uses about this much gas, measured on a fork of each chain:
          </p>
          <div className="mb-4 type-doc-code-block">
            <code className="type-doc-body text-gray-900">G(n) = 1,310,000 + 240,000 × n</code>
          </div>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>One record: 1,550,000 gas.</li>
            <li>An account holds at most 16 records per market, so the largest liquidation uses 5,150,000 gas. That is under half of the 16,777,216 per-transaction gas limit, so the largest account always fits in one transaction.</li>
            <li>Ethereum counts execution gas. Base counts execution gas plus the L1 data fee of each transaction.</li>
            <li>Avana budgets keeper gas per chain as the expected number of liquidations times the gas per liquidation times the gas price, plus the L1 data fee on Base. No protocol rule reads the gas price.</li>
          </ul>
          <div className="mb-4 doc-topic type-doc-body">
            Example (Base): an account owing 40 USDC with one record falls below a health factor of 1. Its liquidation uses 1,550,000 gas. With a 2% bonus, a 0.3% swap cost and Avana&apos;s 20% share, the keeper&apos;s part of the bonus is 0.8 × (0.02 − 0.003 × 1.02) × 40 = 0.54208 USDC. Avana&apos;s keeper liquidates the account whether or not that covers the gas.
          </div>
        </section>

        <section id="example" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Example: Permissionless Call</h2>
          <p className="mb-4 type-doc-body">
            Example values; each market&apos;s parameters are set at listing. This is Bob&apos;s USDC-debt account on a Uniswap v3 USDC/USDT market on Ethereum (worked through fully on the examples page), with no approved keeper acting.
          </p>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>Any address E calls the Lens preview for Bob&apos;s proxy and debt reserve 2 with a deadline 120 s ahead. It returns a repayment of 1,950 USDC and the PrimaryThenBackup mode.</li>
            <li>E approves LPVaultSwap to pull up to 5 USDC, its maxShortfall, and calls liquidatePermissionless with debtToCover 1,950 USDC, callerFunds 0, flashAmount 1,950 USDC, empty minAmounts, minPayout 69 USDC and maxShortfall 5 USDC. If E were frozen, the call would revert with AddressIsFrozen.</li>
            <li>The settlement runs as on the keeper path: a 1,950 USDC flash loan with a 0.975 USDC premium, 975 vault tokens seized and unwound, and the USDT leg swapped into USDC. The recovery is 2,040.30 USDC against a floor of 2,026.024998 USDC.</li>
            <li>The shortfall is max(0, floor − R, D + φD − K − R) = 0, so nothing is pulled from E.</li>
            <li>The flash loan is repaid with 1,950.975 USDC, Avana&apos;s fee of 19.305 USDC goes to the fee recipient, and E receives 70.02 USDC. LiquidationSettled is emitted with permissionless set to true.</li>
          </ol>
          <h3 className="mb-2 type-doc-subsection-title">Variant: a 1.774998 USDC top-up</h3>
          <p className="mb-4 type-doc-body">
            Had the USDT leg returned 994 USDC instead, the recovery would be 2,024.25 USDC, below the floor of 2,026.024998 USDC. The gap of 1.774998 USDC is within maxShortfall, so LPVaultSwap pulls it from E and continues with a recovery of 2,026.024998 USDC. Avana&apos;s fee stays 19.305 USDC, because it is measured on oracle value. The borrower surplus is 0, as it always is when a shortfall is paid.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Realized surplus: 2,026.024998 − 1,950 − 0.975 = 75.049998 USDC.</li>
            <li>Caller payout: 75.049998 − 19.305 = 55.744998 USDC, of which 1.774998 USDC is E&apos;s own top-up.</li>
            <li>With minPayout at 69 USDC this call reverts with PayoutTooLow. A caller willing to settle at this recovery sets minPayout at or below 55.744998 USDC.</li>
            <li>With maxShortfall set to 5 USDC, each leg runs at 124 bps instead of 100 bps (100 + ⌊5 × 10,000 / 2,047.5⌋). A leg below its own minimum reverts with MinOutNotMet and the backup route is tried.</li>
            <li>A gap above maxShortfall reverts with RecoveryBelowFloor. A rounding gap at final settlement is paid the same way, or the call reverts with InsufficientProceeds.</li>
          </ul>
        </section>

        <section id="failures" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Failures and Responses</h2>
          <p className="mb-4 type-doc-body">
            Every failure reverts the whole transaction: flash loan, seizure, burn, record debits, deficit report, top-up and payouts. None depends on the pause state, a breaker or a drift reason.
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Error</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Cause</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">DeadlineExpired</code></td>
                  <td className="px-4 py-2">The block timestamp is past the deadline</td>
                  <td className="px-4 py-2">Re-preview and resubmit</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">AddressIsFrozen</code></td>
                  <td className="px-4 py-2">The caller is on the chain&apos;s freeze list</td>
                  <td className="px-4 py-2">Another address must call</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">NotApprovedKeeper</code></td>
                  <td className="px-4 py-2">The caller of liquidate is not an approved keeper</td>
                  <td className="px-4 py-2">Use the permissionless path</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">LockHeld</code></td>
                  <td className="px-4 py-2">The protocol lock is already held (re-entry)</td>
                  <td className="px-4 py-2">Send one account per call</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">InvalidAmount</code></td>
                  <td className="px-4 py-2">debtToCover is 0, an amount is above 2^128 − 1, funds plus flash amount are below debtToCover, or minAmounts has the wrong length</td>
                  <td className="px-4 py-2">Fix the parameters</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">UnknownProxy</code>, <code className="type-doc-inline-code">UnknownMarket</code>, <code className="type-doc-inline-code">UnknownDebtReserve</code></td>
                  <td className="px-4 py-2">The proxy, market or debt reserve does not match the registry</td>
                  <td className="px-4 py-2">Fix the parameters</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">NotLiquidatable</code></td>
                  <td className="px-4 py-2">The health factor is at least 1</td>
                  <td className="px-4 py-2">Nothing to do</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">StalePrice</code></td>
                  <td className="px-4 py-2">The market&apos;s price is Cached or Expired, too old, or in a feed disagreement pause</td>
                  <td className="px-4 py-2">Wait for a fresh price or a standby price route</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">DebtPriceStale</code></td>
                  <td className="px-4 py-2">The repaid reserve&apos;s DebtOracle is not Live or too old</td>
                  <td className="px-4 py-2">Repay the account&apos;s other debt reserves meanwhile</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">GraceHealthFactor</code></td>
                  <td className="px-4 py-2">Inside a recovery grace window with a health factor of 0.95 or more</td>
                  <td className="px-4 py-2">Retry after the window or once the health factor is below 0.95</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">SequencerDown</code></td>
                  <td className="px-4 py-2">The Base sequencer is reported down</td>
                  <td className="px-4 py-2">Wait for the restart</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">SequencerGrace</code></td>
                  <td className="px-4 py-2">Within 3,600 s of a sequencer restart with a health factor of 0.95 or more</td>
                  <td className="px-4 py-2">Retry after the grace period</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">SharesNotEqualAssets</code></td>
                  <td className="px-4 py-2">The home Hub&apos;s shares differ from its assets for the vault-token asset</td>
                  <td className="px-4 py-2">Raised as an alarm for the emergency playbooks</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">FlashLiquidityShort</code></td>
                  <td className="px-4 py-2">The Pool&apos;s idle debt asset is below flashAmount</td>
                  <td className="px-4 py-2">Smaller flashAmount, rest as caller funds</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">FlashSourcePaused</code>, <code className="type-doc-inline-code">FlashFeeTooHigh</code></td>
                  <td className="px-4 py-2">The Pool reserve is inactive, paused or has flash loans disabled, or the premium exceeds maxFlashFeeBps</td>
                  <td className="px-4 py-2">Resubmit fully caller-funded</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">FlashSourceIsHub</code></td>
                  <td className="px-4 py-2">The flash source&apos;s lender is the Spoke&apos;s home Hub or the reserve&apos;s funding Hub</td>
                  <td className="px-4 py-2">Resubmit caller-funded; the timelock replaces the source</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">FundingMismatch</code></td>
                  <td className="px-4 py-2">A pull from the caller delivered a different amount, or less than debtToCover is held before Aave&apos;s call</td>
                  <td className="px-4 py-2">Check approvals and balances</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">NothingSeized</code></td>
                  <td className="px-4 py-2">Aave seized 0 vault-token units</td>
                  <td className="px-4 py-2">Size the call larger</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">NoRouteAvailable</code></td>
                  <td className="px-4 py-2">No usable route converts a token, or both routes fail</td>
                  <td className="px-4 py-2">A keeper may try BackupOnly; otherwise wait for a restored or replaced route</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">RecoveryBelowFloor</code></td>
                  <td className="px-4 py-2">The recovery is below the floor by more than maxShortfall</td>
                  <td className="px-4 py-2">Raise maxShortfall or bundle an arbitrage</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">InsufficientProceeds</code></td>
                  <td className="px-4 py-2">The rounding gap exceeds maxShortfall, or proceeds cannot pay the flash premium on unused principal</td>
                  <td className="px-4 py-2">More caller funds or a larger maxShortfall; size flashAmount to the debt</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">PayoutTooLow</code></td>
                  <td className="px-4 py-2">The caller payout is below minPayout</td>
                  <td className="px-4 py-2">Re-preview, or accept a lower payout</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">InsufficientGas</code></td>
                  <td className="px-4 py-2">Too little gas left before a payout transfer</td>
                  <td className="px-4 py-2">Retry with more gas</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">InvalidFeeRecipient</code></td>
                  <td className="px-4 py-2">The fee recipient is the zero address</td>
                  <td className="px-4 py-2">Governance sets a fee recipient</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Aave errors</td>
                  <td className="px-4 py-2">SpokeHalted, SpokeNotActive, ReservePaused or another upstream check</td>
                  <td className="px-4 py-2">Passed through unchanged; follow the Aave halt procedure</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            A payout transfer that fails, for example to an address an issuer has blocked, does not revert the liquidation. The amount goes to the payout escrow, credited to its recipient, who claims it later.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How approved keepers and permissionless callers liquidate Avana accounts through LPVaultSwap, how to size each call, and what each failure means."
        sectionColor="amber"
      />
    </div>
  ))
}
