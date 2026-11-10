import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'liquidation/flow', {
    title: "Liquidation Flow",
    description: "Step-by-step settlement of an Avana liquidation: checks, flash loan, Aave seizure, burn, unwind, swaps, recovery floor, flash repayment and payouts.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "notation", title: "Notation" },
  { id: "sequence", title: "Settlement Steps" },
  { id: "flash-loan", title: "Flash Loan" },
  { id: "seizure", title: "Seizure, Burn and Unwind" },
  { id: "swaps", title: "Swap Legs" },
  { id: "floor", title: "Recovery Floor" },
  { id: "shortfall", title: "Shortfall and Rounding Gaps" },
  { id: "repayment", title: "Flash Repayment" },
  { id: "waterfall", title: "Payout Waterfall" },
  { id: "escrow", title: "Refused Payouts" },
  { id: "events", title: "Events" },
  { id: "end-state", title: "End State" },
]

export default async function LiquidationFlowPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "liquidation/flow", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Liquidation Flow"
          description="Every step of one liquidation, in execution order, with the checks, formulas and payouts LPVaultSwap applies."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            One call liquidates one account, in its one collateral market, against one debt reserve, and settles it in the same transaction. Every amount is measured as a balance change within the call, never as an absolute balance and never from another contract&apos;s return value. If any step fails, the whole transaction reverts.
          </p>
          <p className="mb-4 type-doc-body">
            When the call uses a flash loan, the steps from holding the debt asset to the shortfall check run inside the flash-loan callback. Without a flash loan they run directly after the caller&apos;s funds are pulled. No step before the unwind touches the market&apos;s own pool.
          </p>
          <p className="mb-4 type-doc-body">
            Who can call, and when an account is eligible, is on the design page: <Link href="/developers/liquidation" className="text-type-accent hover:underline">Liquidation Design</Link>.
          </p>
        </section>

        <section id="notation" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Notation</h2>
          <p className="mb-4 type-doc-body">
            Every settlement amount is in base units of the repaid debt asset: 6 decimals for USDC and USDT, 18 for GHO and WETH. Prices are 8-decimal USD. Basis points use 10,000 = 100%. ⌊·⌋ rounds down and ⌈·⌉ rounds up.
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Symbol</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">X</td><td className="px-4 py-2">debtToCover, the most debt asset Aave may pull</td></tr>
                <tr><td className="px-4 py-2">K</td><td className="px-4 py-2">Caller funds pulled at entry (keeperFunds or callerFunds)</td></tr>
                <tr><td className="px-4 py-2">F</td><td className="px-4 py-2">Debt asset flash-borrowed (flashAmount)</td></tr>
                <tr><td className="px-4 py-2">φ, φD</td><td className="px-4 py-2">Flash premium on F; premium on the part of F that covered the debt, min(F, D). Both are 0 when F is 0 or the premium is waived.</td></tr>
                <tr><td className="px-4 py-2">D</td><td className="px-4 py-2">Debt asset Aave pulled in its liquidation call</td></tr>
                <tr><td className="px-4 py-2">c</td><td className="px-4 py-2">Vault-token units LPVaultSwap received</td></tr>
                <tr><td className="px-4 py-2">b, lf, bNet</td><td className="px-4 py-2">Aave liquidation bonus, Aave liquidation fee (0 by the listing settings), net bonus, in bps where 10,000 means no bonus</td></tr>
                <tr><td className="px-4 py-2">Pc, Pdebt</td><td className="px-4 py-2">Vault-token and debt-asset prices served to Aave</td></tr>
                <tr><td className="px-4 py-2">V</td><td className="px-4 py-2">Oracle value of the seized units in the debt asset</td></tr>
                <tr><td className="px-4 py-2">U</td><td className="px-4 py-2">One raw unit of each unwound token, valued in the debt asset</td></tr>
                <tr><td className="px-4 py-2">minOut</td><td className="px-4 py-2">Recovery floor</td></tr>
                <tr><td className="px-4 py-2">R, R′</td><td className="px-4 py-2">Debt asset recovered from the seized collateral; R plus the caller&apos;s shortfall top-up</td></tr>
                <tr><td className="px-4 py-2">g</td><td className="px-4 py-2">Rounding gap, max(0, D + φD − K − R), paid by the caller</td></tr>
                <tr><td className="px-4 py-2">Y, G</td><td className="px-4 py-2">Realized surplus max(0, R′ − D − φD); oracle gain max(0, V − D − φD)</td></tr>
                <tr><td className="px-4 py-2">A, Kr, B</td><td className="px-4 py-2">Avana fee, keeper reward, borrower surplus; A + Kr + B = Y</td></tr>
                <tr><td className="px-4 py-2">keeperOut</td><td className="px-4 py-2">The caller&apos;s payout, keeper or permissionless caller</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="sequence" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Settlement Steps</h2>
          <p className="mb-4 type-doc-body">
            The steps below run in this exact order.
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">#</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Step</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">What happens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">1</td>
                  <td className="px-4 py-2">Deadline</td>
                  <td className="px-4 py-2">LPVaultSwap reverts with DeadlineExpired if the block timestamp is past the deadline, before the lock and before any external call.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">2</td>
                  <td className="px-4 py-2">Lock and entry checks</td>
                  <td className="px-4 py-2">LPVaultSwap takes the chain&apos;s protocol lock (LockHeld if held), then checks the amounts (InvalidAmount), a frozen caller (AddressIsFrozen), the approved keeper on the keeper path (NotApprovedKeeper), the proxy (UnknownProxy), the debt reserve (UnknownDebtReserve) and the route mode. The pause state is not read.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">3</td>
                  <td className="px-4 py-2">Resolve the market</td>
                  <td className="px-4 py-2">From the MarketRegistry: the CDP Spoke, home Hub, collateral reserve, vault token, AMM integration and its LP Vault, pool and exact range, the market&apos;s tokens and swap routes; the debt reserve&apos;s asset, decimals, funding Hub, price source and Avana Umbrella (UnknownMarket on mismatch).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">4</td>
                  <td className="px-4 py-2">Poke oracles and check prices</td>
                  <td className="px-4 py-2">LPVaultSwap pokes the market&apos;s LP Oracle and the repaid reserve&apos;s DebtOracle, then checks the health factor (NotLiquidatable), the collateral price (StalePrice), recovery grace (GraceHealthFactor), Hub shares against assets (SharesNotEqualAssets) and the debt price (DebtPriceStale).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">5</td>
                  <td className="px-4 py-2">Sequencer gate</td>
                  <td className="px-4 py-2">Down reverts with SequencerDown. During the grace period after a restart, only accounts below a health factor of 0.95 pass (SequencerGrace). Ethereum is always open.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">6</td>
                  <td className="px-4 py-2">Read the bonus</td>
                  <td className="px-4 py-2">The health factor, the bonus b and the liquidation fee lf from the Spoke, read in the same call and block as the liquidation, so they equal what Aave applies; the debt price Pdebt.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">7</td>
                  <td className="px-4 py-2">No pool spot check</td>
                  <td className="px-4 py-2">LPVaultSwap reads no pool spot price. A moved pool never reverts the call or changes its route mode.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">8</td>
                  <td className="px-4 py-2">Fund</td>
                  <td className="px-4 py-2">Pulls K from the caller if K is above 0 (FundingMismatch unless exactly K arrives). If F is above 0, borrows F through the flash source; the following steps run inside the callback.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">9</td>
                  <td className="px-4 py-2">Hold the debt asset</td>
                  <td className="px-4 py-2">LPVaultSwap requires its debt-asset balance to have risen by at least X (FundingMismatch). The debt asset is never bought with another asset.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">10</td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">beginSeizure</code></td>
                  <td className="px-4 py-2">Collateralization checks the lock and the caller, checks Hub shares against assets, and stores the proxy&apos;s supplied shares and the vault token&apos;s total supply in transient storage.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">11</td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">liquidationCall</code></td>
                  <td className="px-4 py-2">LPVaultSwap approves the Spoke for exactly X and calls the liquidation with receiveShares set to false, then resets the approval. Aave validates, sizes the repayment, pulls D to the funding Hub and sends c vault tokens from the home Hub to LPVaultSwap. It reports deficits if the call empties the collateral.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">12</td>
                  <td className="px-4 py-2">Measure D and c</td>
                  <td className="px-4 py-2">Both measured as balance changes. If c is 0 the call reverts with NothingSeized. The unused X − D stays in LPVaultSwap to repay flash principal or return to the caller; it is never swapped.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">13</td>
                  <td className="px-4 py-2">Open the recovery window</td>
                  <td className="px-4 py-2">LPVaultSwap records its balance of each market token and of the debt asset. Caller funds, flash principal and the unused debt asset stay outside the window of R.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">14</td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">burnSeized</code></td>
                  <td className="px-4 py-2">The AaveAdapter, the vault token&apos;s only burner, burns the c units from LPVaultSwap&apos;s balance (SeizedUnitsBurned).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">15</td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">settleSeizure</code></td>
                  <td className="px-4 py-2">Collateralization checks the snapshot, the pool lock, that the share drop equals c and that the supply drop equals c. It reconciles any earlier unsettled seizure of the proxy, debits c units from the proxy&apos;s records, and has the LP Vault unwind exactly those units.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">16</td>
                  <td className="px-4 py-2">Measure the unwind</td>
                  <td className="px-4 py-2">LPVaultSwap measures the amount aᵢ of each market token it received. Uncollected fees never enter these amounts.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">17</td>
                  <td className="px-4 py-2">Recovery floor</td>
                  <td className="px-4 py-2">LPVaultSwap computes the net bonus, the effective slippage, V, U and the floor minOut in the debt asset, and each leg&apos;s minimum.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">18</td>
                  <td className="px-4 py-2">Swap legs</td>
                  <td className="px-4 py-2">Each token that is not the debt asset is swapped over its route at its own oracle-derived minimum, in the route mode the caller set. R is the debt asset received from the start of the window to the end of conversion.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">19</td>
                  <td className="px-4 py-2">Shortfall check</td>
                  <td className="px-4 py-2">The shortfall is max(0, minOut − R, D + φD − K − R). A floor gap above maxShortfall reverts with RecoveryBelowFloor; a rounding gap above it reverts with InsufficientProceeds. Otherwise the shortfall is pulled from the caller.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">20</td>
                  <td className="px-4 py-2">Waterfall</td>
                  <td className="px-4 py-2">LPVaultSwap computes Y, A, Kr, B and keeperOut (InsufficientProceeds if negative), then checks keeperOut against minPayout (PayoutTooLow).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">21</td>
                  <td className="px-4 py-2">Repay the flash loan</td>
                  <td className="px-4 py-2">LPVaultSwap sends F + φ to the flash source, which approves the Pool for exactly that amount; the Pool pulls it.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">22</td>
                  <td className="px-4 py-2">Pay out</td>
                  <td className="px-4 py-2">A to the fee recipient, then B to the borrower&apos;s wallet, then keeperOut to the caller, all in the debt asset. Zero amounts are skipped. A refused transfer goes to the payout escrow.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">23</td>
                  <td className="px-4 py-2">Event and lock</td>
                  <td className="px-4 py-2">LPVaultSwap emits LiquidationSettled and releases the lock. Its net balance change is 0 in every token, and every allowance it granted is 0.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="flash-loan" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Flash Loan</h2>
          <p className="mb-4 type-doc-body">
            Each chain has one flash source contract, read from the MarketRegistry&apos;s flashSource and replaceable by the chain&apos;s timelock at the normal delay. Its only implementation calls the chain&apos;s Aave V3 Pool flashLoan with one asset and no debt mode: the Core Pool on Ethereum, and the Base Pool at 0xA238Dd80C259a72e81d7e4664a9801593F98d1c5. Aave V4 has no flash loans. The simple flash-loan function does not waive the premium for the FLASH_BORROWER role, so the full flashLoan call is used.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Checks before lending</h3>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>The lender must not be the CDP Spoke&apos;s home Hub or the reserve&apos;s funding Hub (FlashSourceIsHub). A liquidation must not repay a Hub with that Hub&apos;s own liquidity, which would hide a liquidity crunch.</li>
            <li>The flash source&apos;s available liquidity must be at least F (FlashLiquidityShort).</li>
            <li>The Pool reserve of the asset must be active, not paused and enabled for flash loans, with idle liquidity of at least F (FlashSourcePaused, InsufficientFlashLiquidity).</li>
            <li>The premium must pass the cap below (FlashFeeTooHigh).</li>
          </ul>
          <div className="mb-4 type-doc-code-block">
            <code className="type-doc-body text-gray-900">φ × 10,000 ≤ maxFlashFeeBps × F</code>
          </div>
          <p className="mb-4 type-doc-body">
            The comparison is exact, in base units on both sides. maxFlashFeeBps is 10 on Ethereum and Base, above the Aave V3 premium of 5 bps. The premium is waived when the Pool grants the flash source the FLASH_BORROWER role; governance then lowers maxFlashFeeBps to 0 with tightenMaxFlashFeeBps at the short delay. The premium is a settlement cost, paid before Avana&apos;s fee.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: a flash loan of 2,000 USDC at 5 bps has a premium of 1 USDC. 1,000,000 × 10,000 = 10,000,000,000 is at most 10 × 2,000,000,000 = 20,000,000,000, so the loan proceeds. At 11 bps (2.2 USDC) the check fails and the call reverts; the caller resubmits fully caller-funded.
          </div>
          <h3 className="mb-2 type-doc-subsection-title">Callbacks</h3>
          <p className="mb-4 type-doc-body">
            The Pool calls the flash source&apos;s executeOperation, which accepts only the Pool as caller, itself as initiator, one asset, and the asset and amount it requested (InvalidFlashCallback). It forwards the amount it received to LPVaultSwap and calls LPVaultSwap&apos;s onFlashLoan. LPVaultSwap accepts that callback only from the chain&apos;s flash source, with an active settlement context, the reserve&apos;s debt asset, an amount equal to its own balance change, and the lock held. The context carries only an identifier; the validated parameters stay in transient storage.
          </p>
        </section>

        <section id="seizure" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Seizure, Burn and Unwind</h2>
          <h3 className="mb-2 type-doc-subsection-title">Aave liquidation</h3>
          <p className="mb-4 type-doc-body">
            The standard Spoke validates the call (not a self-liquidation, amount above 0, reserves not paused, collateral supplied, debt drawn in the reserve, health factor below 1), sizes the repayment against its target health factor with its dynamic bonus and dust rule, pulls D, and removes c vault tokens from the home Hub to LPVaultSwap. Receiving shares instead of tokens is disabled on the reserve, so LPVaultSwap always passes false.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Burn and ledger checks</h3>
          <p className="mb-4 type-doc-body">
            The AaveAdapter burns the c units, then Collateralization checks that the drop in the proxy&apos;s supplied shares equals c (DebitMismatch) and that the drop in the vault token&apos;s supply equals c (SupplyDropMismatch). Collateralization reads the Spoke, Hub, reserve and vault token only from the vault token&apos;s immutables, never from the caller. It also refuses to unwind while the pool is inside a callback (PoolLocked), reading each AMM&apos;s own slot layout for that check only.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Record walk</h3>
          <p className="mb-4 type-doc-body">
            Collateralization debits c units from the proxy&apos;s records, largest credited record first, ties by lowest record ID. It stops at the first record that covers the remainder, so at most one record is partly debited. A record at 0 units stays open for its depositor. An account holds at most 16 records per market. Every record of a market has the market&apos;s exact range, so the units are interchangeable and the order has no economic effect. If the records hold fewer than c units, the call reverts with InsufficientCredit.
          </p>
          <p className="mb-4 type-doc-body">
            Before debiting c, Collateralization reconciles any shares an earlier, unsettled seizure took without a debit. It debits those units too, unwinds them into its pending balance, and emits SeizureReconciled. Those tokens are settled later by settlePending and never paid out inside the liquidation.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Unwind</h3>
          <p className="mb-4 type-doc-body">
            For each debited record, the market&apos;s LP Vault removes exactly the debited units and sends the principal to LPVaultSwap. For Uniswap v3 and Aerodrome Slipstream it calls decreaseLiquidity with zero minimums, then collect capped at the principal, so fees owed to the position stay with it for the depositor. Collateralization releases the record&apos;s exposure on a fixed basis: the remaining charge is the original charge times remaining units over original units, rounded up.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: a record pledged with 600,000,000 units and a 1,200 USD charge is debited 200,000,000 units. It keeps ⌈1,200 × 400 / 600⌉ = 800 USD of charge and releases 400 USD of cap.
          </div>
        </section>

        <section id="swaps" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Swap Legs</h2>
          <p className="mb-4 type-doc-body">
            For each market token and each enabled debt asset, the MarketRegistry records a primary and a backup swap route. Each route contract has a fixed path set at deployment, takes only LPVaultSwap as caller, and enforces the minimum output it receives (MinOutNotMet).
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Route types: DexPath (fixed pool hops on Uniswap v3, Slipstream, Curve or Balancer), PegModule (a GHO Stability Module on Ethereum, backup slot of a GHO debt reserve only, or the Sky LitePSM for DAI or USDS into USDC), and WrapperThenDex (one unwrap step, then pool hops).</li>
            <li>A route never trades through the market&apos;s own pool, which is being unwound in the same transaction. Any pool callback is accepted only from the pool fixed in the route.</li>
            <li>The backup shares no external contract and no intermediate token, other than the debt asset, with the primary, so one failure cannot disable both.</li>
            <li>A GHO Stability Module is never a primary route.</li>
            <li>Listing requires both routes of every token to swap the full one-sided value of the largest position within the market&apos;s slippage allowance.</li>
          </ul>
          <h3 className="mb-2 type-doc-subsection-title">Per-leg minimum</h3>
          <p className="mb-4 type-doc-body">
            Every leg runs with a minimum output derived from oracle prices, primary and backup alike. No swap of a liquidation runs without one.
          </p>
          <div className="mb-4 type-doc-code-block">
            <code className="type-doc-body text-gray-900">minOutᵢ = max(1, ⌈Vlegᵢ × (10,000 − sLeg) / 10,000⌉ − Ulegᵢ − ⌊floorRoundingAllowance / k⌋)</code>
          </div>
          <p className="mb-4 type-doc-body">
            Vlegᵢ is the leg&apos;s value in the debt asset at the LP Oracle&apos;s capped leg price, Ulegᵢ is one raw unit of the token in the debt asset, k is the number of legs swapped, and sLeg is the leg slippage (the effective slippage s, widened by a shortfall allowance as described below).
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: a 4,998 USDT leg at 0.9998 USD into USDC, with sLeg of 100 bps, one leg swapped and a 1 USDC allowance: Vleg = 4,997.0004 USDC, and the minimum is 4,947.030396 − 0.000001 − 1 = 4,946.030395 USDC.
          </div>
          <h3 className="mb-2 type-doc-subsection-title">Dust legs, residues and failed routes</h3>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>A token worth at most about one raw unit of the debt asset is a dust leg. It is not swapped: LPVaultSwap sends it whole to the caller and counts it as 0 toward R. Otherwise every route could return 0 for it and the account could never be liquidated.</li>
            <li>Input or intermediate tokens a route returns unconverted count as 0 toward R and go to the caller (ResidueReturned).</li>
            <li>A primary that reverts emits RouteFailed, its approval is reset to 0, and the backup is called. If no usable route converts a token, the call reverts with NoRouteAvailable.</li>
            <li>Route records change only by timelock: setRoute at the normal delay (5 days), disableRoute and restoreRoute of a previously approved route at the short delay (12 hours). An operation that only restores routes can be cancelled only by the Aave governance executor.</li>
          </ul>
          <h3 className="mb-2 type-doc-subsection-title">Unwind at any pool price</h3>
          <p className="mb-4 type-doc-body">
            The unwind runs at zero per-token minimums because the LP Oracle values a position at its fair composition, the minimum of its oracle value over all pool prices. Removing the liquidity at any pool price returns tokens worth at least V at oracle prices. What a moved pool can still distort is a swap, and every swap leg has its own oracle minimum. A spot gate would add nothing and would let anyone keep an underwater account alive by moving a thin pool before each attempt.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: a full-range USDC/USDT position worth $10,000 at $1.00 each holds about 5,000 of each token. An attacker moves the pool to 2 USDT per USDC. The position now holds 3,535.53 USDC and 7,071.07 USDT, worth $10,606.60 at oracle prices. A keeper seizes and unwinds it at that pool price, the USDT leg must still return its oracle minimum, and the floor is computed from V = 10,000.
          </div>
        </section>

        <section id="floor" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Recovery Floor</h2>
          <p className="mb-4 type-doc-body">
            The floor is computed in the debt asset, so the same rule serves GHO, USDC, WETH or any other debt reserve. It allows exactly the swap loss that Aave&apos;s net bonus can pay for after the flash premium.
          </p>
          <div className="mb-4 type-doc-code-block">
            <code className="type-doc-body text-gray-900">
              bNet = 10,000 + ⌊(b − 10,000) × (10,000 − lf) / 10,000⌋
              <br />costsBps = ⌈φ × 10,000 / F⌉ (0 when F = 0)
              <br />s = min(slippageAllowanceBps, ⌊10,000 × (bNet − 10,000 − costsBps) / bNet⌋), or 0 if not positive
              <br />V = ⌊c × Pc × 10^dd / (10^dv × Pdebt)⌋
              <br />U = Σᵢ ⌈pᵢ × 10^dd / (10^dᵢ × Pdebt)⌉ (a token that is the debt asset counts 1)
              <br />minOut = max(0, ⌈V × (10,000 − s) / 10,000⌉ − U − floorRoundingAllowance)
            </code>
          </div>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>s solves (1 + bNet)(1 − s) ≥ 1 + costs, so the slippage term alone repays the debt and the flash premium. slippageAllowanceBps is 100 at launch.</li>
            <li>V uses the prices Aave used for the seizure, so the floor measures swap loss only, never a price difference between Avana and Aave.</li>
            <li>U and floorRoundingAllowance let dust liquidations settle. AMM removals and swaps round down by up to one raw unit per token. Without these terms a dust liquidation would revert on every attempt, and its deficit would never be recorded.</li>
            <li>floorRoundingAllowance is set per debt reserve when it is enabled: one whole token for a USD stablecoin (1,000,000 for USDC, 10^18 for GHO) and 0.0005 WETH for WETH debt.</li>
            <li>The floor depends on no caller input. V rounds down and the slippage term rounds up, both against the caller.</li>
          </ul>
          <div className="mb-4 doc-topic type-doc-body">
            Example (Ethereum, USDC debt): c = 4,998 vault tokens at Pc = 2.00, bNet = 10,200 and no premium. s = min(100, ⌊10,000 × 200 / 10,200⌋) = 100. V = 9,996 USDC. With USDC at 1.0000 and USDT at 0.9998, U = 2 base units. minOut = 9,896.04 − 0.000002 − 1 = 9,895.039998 USDC.
          </div>
        </section>

        <section id="shortfall" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Shortfall and Rounding Gaps</h2>
          <p className="mb-4 type-doc-body">
            After the swaps, LPVaultSwap computes the amount the caller must add:
          </p>
          <div className="mb-4 type-doc-code-block">
            <code className="type-doc-body text-gray-900">shortfall = max(0, minOut − R, D + φD − K − R)</code>
          </div>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>The first term is recovery below the floor. If it exceeds maxShortfall, the call reverts with RecoveryBelowFloor.</li>
            <li>The second term is the rounding gap g: what the caller&apos;s own funds left uncovered of the debt and its flash premium. If it exceeds maxShortfall, the call reverts with InsufficientProceeds.</li>
            <li>Otherwise LPVaultSwap pulls exactly the shortfall from the caller, and R′ = R + shortfall.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            Rounding gaps are paid by the caller, never by a protocol balance, on the keeper and permissionless paths alike. The caller chose the liquidation&apos;s size and funding, so it pays the few base units of rounding that result.
          </p>
          <p className="mb-4 type-doc-body">
            A caller that allows a top-up also lets each leg run at a wider slippage, which keeps liquidations running at full size when routes trade below the oracle in a crash:
          </p>
          <div className="mb-4 type-doc-code-block">
            <code className="type-doc-body text-gray-900">sLeg = min(9,999, s + min(maxShortfallBps, ⌊maxShortfall × 10,000 / V⌋))</code>
          </div>
          <p className="mb-4 type-doc-body">
            maxShortfallBps is 1,000. Avana&apos;s fee does not fall when a shortfall is paid, and the borrower surplus is 0 in that case, so a caller&apos;s top-up never reaches the borrower.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: V = 12,422.6 USDC, s = 100 bps and maxShortfall = 200 USDC. The legs run at 260 bps, the routes return 12,174 USDC, 123.373998 USDC is pulled from the caller, and the liquidation settles at full size.
          </div>
        </section>

        <section id="repayment" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Flash Repayment</h2>
          <p className="mb-4 type-doc-body">
            Before the callback returns, LPVaultSwap transfers enough of the debt asset to the flash source that its balance rises by F + φ, checked as a balance change. Unspent flash principal and the debt asset Aave did not pull repay the loan in the same transaction. The flash source approves the Pool for exactly F + φ, the Pool pulls it, and the flash source resets the allowance and checks that its own balance is unchanged (FlashRepayShort otherwise).
          </p>
          <p className="mb-4 type-doc-body">
            The premium on flash principal the debt did not need, φ − φD, is paid from the caller&apos;s payout only. If the surplus cannot pay it, the call reverts with InsufficientProceeds. A debt asset with a transfer fee is grossed up, and that cost also falls on the caller&apos;s payout.
          </p>
        </section>

        <section id="waterfall" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Payout Waterfall</h2>
          <div className="mb-4 type-doc-code-block">
            <code className="type-doc-body text-gray-900">
              Y = max(0, R′ − D − φD)
              <br />G = max(0, V − D − φD)
              <br />A = min(⌊G × avanaFeeShareBps / 10,000⌋, Y)
              <br />Kr = min(Y − A, G − A)
              <br />B = Y − A − Kr
              <br />keeperOut = (K + F + R′) − (D + F + φ + A + B)
            </code>
          </div>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Avana&apos;s fee A is 20% (avanaFeeShareBps = 2,000) of the oracle gain G, never above the realized surplus Y. While Y covers it, A depends only on the oracle value of the seizure and the debt repaid, never on how the caller swapped. Since A never exceeds Y, the fee alone never makes a liquidation revert.</li>
            <li>The keeper reward Kr is the rest of the oracle gain, capped by what was realized.</li>
            <li>The borrower surplus B is the recovery above the seized collateral&apos;s oracle value. It is non-zero only when the routes beat the oracle price, so a favourable price move during settlement goes to the borrower.</li>
            <li>A + Kr + B = Y exactly. A rounds down, so rounding dust stays with the borrower.</li>
            <li>keeperOut equals Kr plus the caller&apos;s unspent funds, minus the premium on unused flash principal and minus any shortfall the caller added. If it would be negative, the call reverts with InsufficientProceeds.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            The debt asset is conserved: K + F + R + shortfall = D + (F + φ) + A + B + keeperOut. LPVaultSwap never keeps or creates the debt asset.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Payout order</h3>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>The flash principal and premium F + φ, returned to the flash source inside the callback.</li>
            <li>Avana&apos;s fee A to the fee recipient read from the ParameterStore. A zero fee recipient reverts with InvalidFeeRecipient.</li>
            <li>The borrower surplus B to the borrower&apos;s wallet, the wallet the AaveAdapter records for the proxy (BorrowerSurplusPaid).</li>
            <li>keeperOut to the caller.</li>
          </ol>
          <p className="mb-4 type-doc-body">
            No recipient is taken from calldata, nothing accumulates in LPVaultSwap, and every zero-amount transfer is skipped. Each payout is measured as the recipient&apos;s balance change.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example (Ethereum, USDC debt): D = 9,800, V = 9,996, no premium, and the routes return R = 9,950 USDC. Y = 150, A = min(⌊196 × 0.2⌋, 150) = 39.2, Kr = min(110.8, 156.8) = 110.8, B = 0 and keeperOut = 110.8 USDC. With R = 10,010 USDC instead: Y = 210, A = 39.2, Kr = 156.8 and B = 14 USDC to the borrower.
          </div>
        </section>

        <section id="escrow" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Refused Payouts</h2>
          <p className="mb-4 type-doc-body">
            Every payout (Avana&apos;s fee, the borrower surplus, the caller payout, a residue or a dust leg) uses a gas-limited delivery that cannot revert the liquidation:
          </p>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>LPVaultSwap requires enough gas left: ⌈100,000 × 64 / 63⌉ + 10,000 = 111,588 gas, else InsufficientGas. This stops a caller from starving the call to push a payout into the escrow.</li>
            <li>It calls the token&apos;s transfer with exactly 100,000 gas and reads at most 32 bytes of return data.</li>
            <li>If the transfer reverts, returns false or runs out of gas, LPVaultSwap approves the payout escrow for exactly the amount and calls its deposit, credited to the recipient. The liquidation continues. Only a revert of the deposit itself reverts the call.</li>
          </ol>
          <p className="mb-4 type-doc-body">
            The payout escrow keeps the contract name InKindEscrow. It is immutable, one per chain, with no owner, role or setter, and holding refused payouts is its only job. The credited account later calls <code className="type-doc-inline-code">claim(token, recipient)</code> to receive its whole credit at an address it chooses. Deposits emit RemainderEscrowed and claims emit RemainderClaimed.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: a borrower&apos;s wallet is on USDC&apos;s blocklist and the liquidation owes it a 14 USDC surplus. The transfer fails, the 14 USDC is deposited in the escrow credited to the wallet, and the liquidation completes.
          </div>
        </section>

        <section id="events" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Events</h2>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Contract</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Events</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">LP Oracle, DebtOracle</td><td className="px-4 py-2"><code className="type-doc-inline-code">PriceStateChanged</code>, <code className="type-doc-inline-code">DisagreementRecorded</code></td></tr>
                <tr><td className="px-4 py-2">Aave V3 Pool</td><td className="px-4 py-2"><code className="type-doc-inline-code">FlashLoan</code></td></tr>
                <tr><td className="px-4 py-2">Flash source</td><td className="px-4 py-2"><code className="type-doc-inline-code">FlashLoanServed</code></td></tr>
                <tr><td className="px-4 py-2">CDP Spoke</td><td className="px-4 py-2"><code className="type-doc-inline-code">LiquidationCall</code></td></tr>
                <tr><td className="px-4 py-2">Funding Hub</td><td className="px-4 py-2"><code className="type-doc-inline-code">ReportDeficit</code> (deficit case, per debt reserve)</td></tr>
                <tr><td className="px-4 py-2">Vault token</td><td className="px-4 py-2"><code className="type-doc-inline-code">Transfer</code> from the Hub to LPVaultSwap, and from LPVaultSwap to the zero address</td></tr>
                <tr><td className="px-4 py-2">AaveAdapter</td><td className="px-4 py-2"><code className="type-doc-inline-code">SeizedUnitsBurned</code></td></tr>
                <tr><td className="px-4 py-2">AMM protocol and LP Vault</td><td className="px-4 py-2"><code className="type-doc-inline-code">DecreaseLiquidity</code>, <code className="type-doc-inline-code">Collect</code>, <code className="type-doc-inline-code">UnitsUnwound</code></td></tr>
                <tr><td className="px-4 py-2">Collateralization</td><td className="px-4 py-2"><code className="type-doc-inline-code">RecordDebited</code>, <code className="type-doc-inline-code">SeizureSettled</code>, <code className="type-doc-inline-code">SeizureReconciled</code>, <code className="type-doc-inline-code">PendingSettled</code></td></tr>
                <tr><td className="px-4 py-2">LPVaultSwap</td><td className="px-4 py-2"><code className="type-doc-inline-code">FlashLoanUsed</code>, <code className="type-doc-inline-code">RouteFailed</code>, <code className="type-doc-inline-code">ResidueReturned</code>, <code className="type-doc-inline-code">BorrowerSurplusPaid</code>, <code className="type-doc-inline-code">LiquidationSettled</code>, <code className="type-doc-inline-code">PendingSettlementForwarded</code></td></tr>
                <tr><td className="px-4 py-2">Payout escrow</td><td className="px-4 py-2"><code className="type-doc-inline-code">RemainderEscrowed</code>, <code className="type-doc-inline-code">RemainderClaimed</code></td></tr>
                <tr><td className="px-4 py-2">Avana Umbrella (Coverage Spoke)</td><td className="px-4 py-2"><code className="type-doc-inline-code">ReserveFunded</code> (pending settlement)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            LiquidationSettled carries the caller, the proxy and the market, with the debt reserve and asset, debt repaid, units seized, recovered amount, floor, effective slippage, net bonus, caller funds, flash amount and premium, surplus, Avana fee, keeper reward, borrower surplus, caller payout, minimum payout, routes used, whether the call was permissionless, and the shortfall. A deficit appears in the funding Hub&apos;s ReportDeficit event of the same transaction.
          </p>
          <p className="mb-4 type-doc-body">
            LPVaultSwap writes no breaker state. Monitoring computes its alerts off-chain from these events: collateral seized above 20% of a market in 1 hour, and 3 route failures in 1 hour.
          </p>
        </section>

        <section id="end-state" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">End State</h2>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Vault tokens received by LPVaultSwap = burned by the AaveAdapter = vault-token supply drop = the proxy&apos;s share drop on the Spoke = units debited from the proxy&apos;s records = units removed from those positions.</li>
            <li>No depositor fees were taken: every debited position&apos;s owed fees remain collectable by its depositor.</li>
            <li>The recovery plus any top-up met the floor, the flash loan and premium were repaid in full, and the caller payout was at least minPayout.</li>
            <li>No protocol balance paid any part of the settlement.</li>
            <li>A deficit was recorded only if the account has no collateral left, and then its debt is 0 in every debt reserve.</li>
            <li>LPVaultSwap and the flash source end with no net balance change in any token, no allowance granted in the call is non-zero, and the lock is free.</li>
            <li>The debt asset came only from the caller and the flash source, never bought with another asset.</li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Every step of an Avana liquidation in execution order: checks, flash loan, Aave seizure, burn, unwind, swap legs, recovery floor, shortfall, flash repayment and payouts."
        sectionColor="amber"
      />
    </div>
  ))
}
