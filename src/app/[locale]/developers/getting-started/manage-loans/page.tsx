import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'getting-started/manage-loans', {
    title: "Manage Loans",
    description: "How to monitor an Avana account and change it while a loan is open: Lens views, price states, top-ups and rescue top-ups, re-credit, partial liquidity removal, repay with collateral, and what stays open during pauses.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "monitoring", title: "Monitoring" },
  { id: "price-states", title: "Price States" },
  { id: "top-ups", title: "Top-Ups and Rescue Top-Ups" },
  { id: "recredit", title: "Re-Credit Added Liquidity" },
  { id: "partial-removal", title: "Partial Liquidity Removal" },
  { id: "repay-with-collateral", title: "Repay with Collateral" },
  { id: "during-pauses", title: "What Stays Open During Pauses" },
]

const lensRows = [
  ["getAccount", "The account for one wallet and market: proxy, borrowNonce, Aave health factor, collateral value, debt value, average collateral factor, risk premium, borrow count, debt on each approved debt reserve, gate status, breaker reasons, rescue units and whether the wallet is frozen."],
  ["getRecords", "The account's records, at most 16, in seizure order (largest credited first)."],
  ["getPriceState", "The market's price state, served and accepted price, feed ages, deviations, and any disagreement or grace window."],
  ["getDebtPriceState", "A debt reserve's Aave price source, price, source timestamp, age and freshness for borrowing and liquidation."],
  ["getBreakerStatus / getDebtBreakerStatus", "Whether a market breaker or a debt-reserve breaker is tripped or recovering, and why."],
  ["getApplicationState / getPauseReason", "The Hub's pause state (None, Frozen or Paused) and, when Paused, its reason (General or MintPathSuspect)."],
  ["isFrozenAddress", "Whether an address is frozen."],
  ["getEscrowClaimable", "Payouts held for the account in the payout escrow after a liquidation whose transfer failed."],
  ["previewBorrowRecommended / quoteRepayAll / previewRecredit / previewRepayWithCollateral", "Previews for the next borrow, repay-all, re-credit or repay with collateral."],
]

const priceStateRows = [
  ["Live", "Every feed is fresh and the routes agree with the pool's TWAP.", "Every action that passes its other checks. Borrow and withdraw-with-debt also need the second source to agree."],
  ["Drifting", "The pool's TWAP or a second route disagrees with the served price, or a stablecoin leaves its USD band.", "Top-ups, rescue top-ups, repay and debt-free exits. New-account pledges only for a USD-band breach. Borrow and withdraw-with-debt are refused."],
  ["Cached", "A feed is past its heartbeat plus 1,800 seconds; the oracle serves the last cached price.", "Repay with funds and debt-free exits. Pledges, borrow, withdraw-with-debt, repay with collateral and liquidation of the market are refused."],
  ["Expired", "Cached for longer than the cached window (1 hour), or a persistent route disagreement. The oracle serves a price of 1 (10^-8 USD per vault token), so Aave counts the collateral as worthless.", "Repay with funds and debt-free exits only."],
  ["Grace after recovery", "For 30 minutes after a feed publishes again, liquidation reaches only accounts below a health factor of 0.95, then every account below 1.00.", "The state shows the grace end; borrowers use the window to repay or add collateral."],
]

const removalSteps = [
  "Carol calls removeLiquidity(3, (I, key1), 2,000,000,000, [1,990e6, 1,990e6], now + 600, 1.20e18).",
  "The account has debt, so the pause, freeze and RiskModule pre-withdraw checks run: sequencer Up, oracles Live, no breaker.",
  "The proxy withdraws 2,000,000,000 units from the Spoke and the Adapter burns them.",
  "Collateralization debits record key1 to 8,000,000,000 units and releases $20,000 × 2 / 10 = $4,000 of charge. The LPVault removes the liquidity and pays about 2,000 USDC and 2,000 USDT to Carol, each at least 1,990.",
  "The remaining record is worth $16,000, above the $10 minimum. Collateral is now $21,000 and CF-weighted $6,552, so HF = 6,552 / 4,999.50 = 1.3105, above 1.20.",
  "Events: RecordReduced, UnitsReleased, CollateralReduced.",
]

const rwcSteps = [
  "V previews with previewRepayWithCollateral(V, m_A, key31, 1,500,000,000, r_USDC): repays 2,968.505747 USDC, returns 29.41 USDC to V, and leaves HF 1.5735.",
  "V calls repayWithCollateral with units 1,500,000,000, minAmounts [1,490e6, 1,490e6], minDebtRepaid 2,950e6 and minHealthFactor 1.30e18.",
  "LPVaultSwap values 1,500 whole tokens at the oracle price vector: 1,500 USDC + 1,500 USDT = 3,000 USDC. After the 100 bps slippage allowance and a 0.01 USDC rounding allowance this is 2,969.99 USDC.",
  "x = min(10,000, ⌊2,969.99 × 10^4 / 10,005⌋) = 2,968.505747 USDC. LPVaultSwap flash-borrows x through the chain's flash source; the premium is ⌈x × 5 / 10^4⌉ = 1.484253 USDC.",
  "The proxy repays 2,968.505747 USDC: the debt falls to 7,031.494253 USDC before any collateral leaves.",
  "The proxy withdraws the units, the Adapter burns them, and the LPVault unwinds 1,500 USDC + 1,500 USDT to LPVaultSwap.",
  "The USDT leg swaps to 1,499.40 USDC (minimum 1,485). Recovered 2,999.40 USDC covers the loan and premium; 29.41 USDC goes to V.",
  "Health check: 11,064 / 7,031.494253 = 1.5735, at least max(1.20, 1.30). Events: Deleveraged, RepaidWithCollateral.",
]

const pauseRows = [
  ["New-account pledge", "Refused", "Refused", "Refused", "Refused", "Refused (rescue-only breakers)", "Refused"],
  ["Top-up", "Allowed", "Refused", "Refused", "Refused", "Refused (rescue-only breakers)", "Allowed"],
  ["Rescue top-up", "Allowed", "Allowed", "Refused", "Allowed", "Allowed", "Allowed"],
  ["Borrow", "Refused", "Refused", "Refused", "Refused", "Refused", "Refused"],
  ["Repay (any payer)", "Allowed", "Allowed", "Allowed", "Allowed", "Allowed", "Allowed"],
  ["Repay with collateral", "Allowed", "Allowed", "Refused", "Allowed", "Allowed", "Refused while Down"],
  ["Withdraw or remove with debt", "Allowed", "Refused", "Refused", "Refused", "Refused", "Refused"],
  ["Debt-free withdraw or remove, repayAllAndWithdraw, releaseZeroCredit", "Allowed", "Allowed", "Allowed", "Allowed", "Allowed", "Allowed"],
  ["Collect fees", "Allowed", "Allowed", "Allowed", "Allowed", "Allowed", "Allowed"],
]

export default async function ManageLoansPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "getting-started/manage-loans", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Manage Loans"
          description="Monitor an open loan and change its collateral: add collateral, re-credit liquidity you added, remove part of a position, or repay with your own collateral."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            An account is one PositionProxy for one wallet and market, with one health factor. Its health factor changes when the LPOracle price of the market&apos;s vault token moves, when debt prices move, and as interest accrues. Below 1.00 the account can be liquidated.
          </p>
          <p className="mb-4 type-doc-body">
            To raise the health factor a borrower can repay any amount, pledge another position as a top-up, re-credit liquidity added to a pledged position, or repay with collateral. To take collateral out while debt remains, a borrower can withdraw a whole record or remove part of one, as long as the account stays above the health floor.
          </p>
          <div className="doc-topic type-doc-body">
            Health factor 1.10 is a guide, not a limit: the Lens recommends borrowing to 1.10, and an indebted account below 1.10 can use rescue top-ups. Liquidation starts below 1.00.
          </div>
        </section>

        <section id="monitoring" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Monitoring</h2>
          <p className="mb-4 type-doc-body">
            The Lens is a read-only contract, one per chain, for apps, keepers and monitoring. Its views never revert on a price state; they revert only while an Avana call is in flight in the same transaction.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">View</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Returns</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lensRows.map((row) => (
                  <tr key={row[0]}>
                    <td className="px-4 py-2"><code className="type-doc-inline-code">{row[0]}</code></td>
                    <td className="px-4 py-2">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            The health factor and its formula are explained in <Link href="/developers/architecture/health-factor" className="text-type-accent hover:underline">Health Factor</Link>.
          </p>
        </section>

        <section id="price-states" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Price States</h2>
          <p className="mb-4 type-doc-body">
            Each market&apos;s LPOracle reports a price state, and each non-GHO debt reserve&apos;s DebtOracle reports its own. The state decides which actions can run. Example values: a 24-hour stablecoin feed is fresh for 88,200 seconds, the cached window is 1 hour and the grace window is 30 minutes.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">State</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Meaning</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">What a borrower can do</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {priceStateRows.map((row) => (
                  <tr key={row[0]}>
                    <td className="px-4 py-2 font-medium text-gray-900">{row[0]}</td>
                    <td className="px-4 py-2">{row[1]}</td>
                    <td className="px-4 py-2">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="top-ups" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Top-Ups and Rescue Top-Ups</h2>
          <p className="mb-4 type-doc-body">
            A top-up is a pledge into an account that has debt. It uses the same pledge call as a first deposit and the same position rules (exact range, at most 16 records). Because added collateral only lowers risk, a top-up passes a Frozen Hub, a Base sequencer outage or grace window, and Aave configuration drift.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Rescue health factor and the slice</h3>
          <p className="mb-4 type-doc-body">
            The rescue health factor is 1.10. While an indebted account is below it, a top-up may book its charge from the market&apos;s top-up slice (10% of the market cap) when the regular budget is full, but only up to the USD value that brings the account back to 1.10. A rescue top-up is a top-up below 1.10 whose charge is at most that restore amount and whose value is at least the smaller of minPledgeUsd and $10. It is the only pledge admitted under Paused with reason General, from a frozen wallet, under a rescue-only market breaker, above the pool-share cap or below minPledgeUsd.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Rescue units</h3>
          <p className="mb-4 type-doc-body">
            Units admitted through the slice or a rescue exemption are rescue units. Aave counts them as collateral, so they protect the account from liquidation, but they count as zero for new borrowing and for withdrawals that leave debt: those checks use the health factor with rescue units valued at zero.
          </p>
          <div className="doc-topic type-doc-body mb-4">
            Example values; each market&apos;s parameters are set at listing. An account owes 15,000 GHO against $50,000 of collateral at a 31.20% collateral factor, so its HF is 1.04. The regular budget is full. A $2,000 top-up books from the slice (the restore amount is $2,884.62), all of its units are rescue units, and HF becomes 1.0816. Under Paused with reason General, an $800 rescue top-up (restore amount $884.62) lifts HF to 1.0982, while a $1,000 pledge reverts with NotRescueTopUp.
          </div>
          <p className="type-doc-body">
            Every check a pledge runs is listed in <Link href="/developers/getting-started" className="text-type-accent hover:underline">Deposit LP</Link>.
          </p>
        </section>

        <section id="recredit" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Re-Credit Added Liquidity</h2>
          <p className="mb-4 type-doc-body">
            Liquidity added to a pledged NFT with the AMM protocol&apos;s increaseLiquidity is not collateral until the depositor of record calls recredit. The added units run every check of a top-up of that size, the Adapter mints and supplies exactly those units, and the record&apos;s charge basis is rebased. An account at 16 records adds collateral this way.
          </p>
          <div className="type-doc-code-block mb-4">
            <code className="type-doc-body text-gray-900">
              {"recredit(uint256 marketId, PositionRef position, bytes topUp, uint256 deadline) returns (uint128 added)"}
            </code>
          </div>
          <p className="type-doc-body">
            For NFT positions the topUp argument is empty. Read the units, charge and whether only a rescue top-up can book them with previewRecredit before calling.
          </p>
        </section>

        <section id="partial-removal" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Partial Liquidity Removal</h2>
          <p className="mb-4 type-doc-body">
            removeLiquidity takes part of one record&apos;s units out of the pool and pays the tokens to the depositor of record. The position stays pledged with its remaining units and its uncollected fees.
          </p>
          <div className="type-doc-code-block mb-4">
            <code className="type-doc-body text-gray-900">
              {"removeLiquidity(uint256 marketId, PositionRef position, uint128 units, uint256[] minAmounts, uint256 deadline, uint256 minHealthFactor) returns (uint256[] amounts)"}
            </code>
          </div>
          <ul className="list-disc space-y-2 ps-5 type-doc-body mb-4">
            <li>The units must be above 0 and below the record&apos;s credited units; removing every unit is a withdrawal.</li>
            <li>The minimum amounts hold one entry per pool token, in the market&apos;s token order; each token paid must be at least its minimum.</li>
            <li>Only the principal of the removed units is paid. Fees stay owed to the position and are collected separately.</li>
            <li>Debt-free, the call reads no pause state, freeze, breaker, sequencer gate or price, and any remainder is allowed.</li>
            <li>With debt, it runs the checks of a withdrawal with debt: a Paused Hub refuses it, a frozen wallet cannot make it, the RiskModule pre-checks apply (sequencer, Live prices, second sources, keepers, drift, breakers), the record left behind must be worth at least minPledgeUsd, and the rescue-excluded health factor after the call must be at least the largest of 1.00, minHealthFactor and the hard floor.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            Failures: <code className="type-doc-inline-code">PartialRemovalTooLarge</code> for units at or above the credited units, <code className="type-doc-inline-code">AmountBelowMinimum</code> when a token falls below its minimum, <code className="type-doc-inline-code">RecordBelowMinPledge</code> when the remaining record is worth less than minPledgeUsd, and <code className="type-doc-inline-code">HealthFactorTooLow</code> below the health floor.
          </p>
          <div className="doc-topic type-doc-body mb-4">
            Example values; each market&apos;s parameters are set at listing. Carol holds record key1 (10,000,000,000 units, $20,000) and a top-up keyB (2,500,000,000 units, $5,000) in market 3 on Base: collateral $25,000, CF-weighted $7,800, debt 5,000 USDC valued at $4,999.50, HF 1.5602. She removes 2,000 whole tokens from key1 and keeps the NFT pledged.
          </div>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            {removalSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </section>

        <section id="repay-with-collateral" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Repay with Collateral</h2>
          <p className="mb-4 type-doc-body">
            repayWithCollateral repays one debt reserve with liquidity from one of the caller&apos;s own pledged positions, in one call. LPVaultSwap flash-borrows the debt asset through the chain&apos;s flash source, the proxy repays, the units are withdrawn and burned, the LPVault unwinds them, LPVaultSwap swaps every token that is not the debt asset at oracle-bounded prices, repays the flash loan and its premium, and sends the rest to the caller in the debt asset.
          </p>
          <div className="type-doc-code-block mb-4">
            <code className="type-doc-body text-gray-900">
              {"repayWithCollateral(RepayWithCollateralParams p) returns (uint256 debtRepaid, uint256 debtAssetToWallet)"}
            </code>
          </div>
          <p className="mb-4 type-doc-body">
            The parameters are the market, the position, the units to release, the debt reserve, a minimum amount per pool token for the unwind, the smallest repayment accepted, the deadline and the minimum health factor after the call while debt remains. No approval of the debt asset is needed.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body mb-4">
            <li>There is no liquidation bonus, no Avana fee in the contracts and no protocol budget draw. The borrower pays the flash premium and the swap cost.</li>
            <li>The repay size is set by oracle prices: x = min(debt, ⌊Vnet × 10^4 / (10^4 + maxFlashFeeBps)⌋), where Vnet is the units&apos; oracle value in the debt asset less the market&apos;s slippage allowance (100 bps at launch) and a rounding allowance. A pool trade cannot change it; a sandwich can only make a swap fail its minimum.</li>
            <li>The flash premium must satisfy premium × 10^4 ≤ maxFlashFeeBps × x. maxFlashFeeBps is 10 at launch; the Aave V3 Pool charges 5 bps, and 0 once Avana&apos;s flash source holds the FLASH_BORROWER role.</li>
            <li>The debt falls before any collateral leaves. While debt remains, Aave&apos;s health factor after the call must be at least the larger of its value before the call and minHealthFactor.</li>
            <li>It runs under a Frozen Hub, under Paused with reason General, for a frozen wallet and under every circuit breaker, because it only lowers debt. It is refused under Paused with reason MintPathSuspect, while the market or the repaid reserve is Cached or Expired, and while the Base sequencer is down. When the flash source is short or paused, repay with funds instead.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            Failures: <code className="type-doc-inline-code">DeleverageTooSmall</code> below the minimum repayment, <code className="type-doc-inline-code">HealthFactorNotImproved</code>, <code className="type-doc-inline-code">MinOutNotMet</code> for a swap leg below its oracle minimum, <code className="type-doc-inline-code">DeleverageShortfall</code>, <code className="type-doc-inline-code">FlashLiquidityShort</code>, <code className="type-doc-inline-code">NothingToRepay</code>, and <code className="type-doc-inline-code">ApplicationPaused</code> under MintPathSuspect only.
          </p>
          <div className="doc-topic type-doc-body mb-4">
            Example values; each market&apos;s parameters are set at listing. On Ethereum, wallet V owes 10,000 USDC with CF-weighted collateral of $12,000 (HF 1.20). Record #31 is a Uniswap v3 USDC/USDT position at $2.00 per whole token. USDC is priced at $1.0000 and the flash premium is 5 bps.
          </div>
          <ul className="list-disc space-y-2 ps-5 type-doc-body mb-4">
            {rwcSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <p className="type-doc-body">
            With a minimum repayment of 3,000 USDC the same call reverts with DeleverageTooSmall(2,968,505,747, 3,000,000,000). With a zero flash premium, x is 2,969.99 USDC.
          </p>
        </section>

        <section id="during-pauses" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">What Stays Open During Pauses</h2>
          <p className="mb-4 type-doc-body">
            Pause states are set per Hub by the Emergency Guardian or the timelock. Frozen stops new accounts and new borrowing; Paused stops more. Circuit breakers stop new exposure only. Repayment, debt-free exits, fee collection and eligible liquidations stay open in every state below.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Action</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Frozen</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Paused (General)</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Paused (MintPathSuspect)</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Wallet frozen</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Breaker tripped</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Base sequencer Down or Grace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pauseRows.map((row) => (
                  <tr key={row[0]}>
                    <td className="px-4 py-2 font-medium text-gray-900">{row[0]}</td>
                    <td className="px-4 py-2">{row[1]}</td>
                    <td className="px-4 py-2">{row[2]}</td>
                    <td className="px-4 py-2">{row[3]}</td>
                    <td className="px-4 py-2">{row[4]}</td>
                    <td className="px-4 py-2">{row[5]}</td>
                    <td className="px-4 py-2">{row[6]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            Avana cannot keep exits open when Aave itself blocks them: a pause of the vault-token reserve or a Hub halt of the CDP Spoke stops withdrawals, and a pause of a debt reserve stops repayment of that reserve. Liquidation never reads a pause state, breaker or address freeze; its own rules are in <Link href="/developers/liquidation" className="text-type-accent hover:underline">Liquidation</Link>.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How to monitor an open Avana loan and change its collateral: top-ups, re-credit, partial removal and repay with collateral."
        sectionColor="emerald"
      />
    </div>
  ))
}
