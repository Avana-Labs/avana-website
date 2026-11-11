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
    description: "Step-by-step settlement of an Avana liquidation: checks, caller funding, Aave seizure, burn, unwind, swaps, recovery floor, payouts, and the flash liquidation helper that wraps a flash-funded call.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "notation", title: "Notation" },
  { id: "params", title: "Call Parameters" },
  { id: "sequence", title: "Settlement Steps" },
  { id: "funding", title: "Caller Funding" },
  { id: "helper", title: "Flash Liquidation Helper" },
  { id: "seizure", title: "Seizure, Burn and Unwind" },
  { id: "swaps", title: "Swap Legs" },
  { id: "floor", title: "Recovery Floor" },
  { id: "shortfall", title: "Shortfall and Rounding" },
  { id: "waterfall", title: "Payout Waterfall" },
  { id: "repayment", title: "Flash Repayment Through the Helper" },
  { id: "escrow", title: "Refused Payouts" },
  { id: "events", title: "Events" },
  { id: "errors", title: "Errors" },
  { id: "end-state", title: "End State" },
]

export default async function LiquidationFlowPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "liquidation/flow", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Liquidation Flow"
          description="Every step of one liquidation, in execution order, with the checks, formulas and payouts LPVaultSwap applies, and the steps the flash liquidation helper adds around a flash-funded call."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            One call to <code className="type-doc-inline-code">LPVaultSwap.liquidate</code> liquidates one account, in its one collateral market, against one debt reserve, and settles it in the same transaction. Every amount is measured as a balance change within the call, never as an absolute balance and never from another contract&apos;s return value. If any step fails, the whole transaction reverts.
          </p>
          <p className="mb-4 type-doc-body">
            LPVaultSwap takes no flash loan: every step runs directly in the call, funded by the caller. A flash-funded liquidation wraps the whole call inside the flash liquidation helper&apos;s flash-loan callback, and LPVaultSwap runs the same steps with the helper as its caller. No step before the unwind touches the market&apos;s own pool.
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
                <tr><td className="px-4 py-2">X</td><td className="px-4 py-2">debtToCover, the most debt asset LPVaultSwap pulls from the caller</td></tr>
                <tr><td className="px-4 py-2">Kf</td><td className="px-4 py-2">Caller funding: the debt asset LPVaultSwap received from the caller, 0 &lt; Kf ≤ X. Kf equals X unless the asset charges a transfer fee.</td></tr>
                <tr><td className="px-4 py-2">D</td><td className="px-4 py-2">Debt asset Aave pulled in its liquidation call, never more than Kf</td></tr>
                <tr><td className="px-4 py-2">c</td><td className="px-4 py-2">Vault-token units LPVaultSwap received</td></tr>
                <tr><td className="px-4 py-2">b, lf, bNet</td><td className="px-4 py-2">Aave liquidation bonus, Aave liquidation fee (0 by the listing settings), net bonus, in bps where 10,000 means no bonus</td></tr>
                <tr><td className="px-4 py-2">Pc, Pdebt</td><td className="px-4 py-2">Vault-token and debt-asset prices served to Aave</td></tr>
                <tr><td className="px-4 py-2">V</td><td className="px-4 py-2">Oracle value of the seized units in the debt asset</td></tr>
                <tr><td className="px-4 py-2">U</td><td className="px-4 py-2">One raw unit of each unwound token, valued in the debt asset</td></tr>
                <tr><td className="px-4 py-2">s, sLeg</td><td className="px-4 py-2">Effective slippage of the floor; slippage of each swap leg</td></tr>
                <tr><td className="px-4 py-2">minOut</td><td className="px-4 py-2">Recovery floor</td></tr>
                <tr><td className="px-4 py-2">R, R′</td><td className="px-4 py-2">Debt asset recovered from the seized collateral; R plus the caller&apos;s shortfall top-up</td></tr>
                <tr><td className="px-4 py-2">G</td><td className="px-4 py-2">Oracle gain, max(0, V − D)</td></tr>
                <tr><td className="px-4 py-2">Y</td><td className="px-4 py-2">Realized surplus, max(0, R′ − D)</td></tr>
                <tr><td className="px-4 py-2">A, Kr, B</td><td className="px-4 py-2">Avana fee, caller reward, borrower surplus; A + Kr + B = Y</td></tr>
                <tr><td className="px-4 py-2">keeperOut</td><td className="px-4 py-2">The caller&apos;s payout, Kf + R′ − D − A − B: the funding Aave did not use, the recovered principal and the reward</td></tr>
                <tr><td className="px-4 py-2">F, φ</td><td className="px-4 py-2">A flash liquidation helper&apos;s loan and its premium. They appear only in the helper&apos;s own steps; no formula of LPVaultSwap contains them.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="params" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Call Parameters</h2>
          <p className="mb-4 type-doc-body">
            The call is <code className="type-doc-inline-code">liquidate(LiquidationParams params)</code>. The Lens function previewLiquidation returns parameters that can be sent unchanged.
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Field</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">proxy</code></td><td className="px-4 py-2">The borrower&apos;s PositionProxy, the Aave account of one wallet in one market</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">marketId</code></td><td className="px-4 py-2">The proxy&apos;s collateral market</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">debtReserveId</code></td><td className="px-4 py-2">The debt reserve to repay, enabled on the CDP Spoke</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">debtToCover</code></td><td className="px-4 py-2">The debt asset LPVaultSwap pulls from the caller. The amount that arrives is Aave&apos;s bound, and the part Aave does not use returns to the caller.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">routeMode</code></td><td className="px-4 py-2">PrimaryThenBackup or BackupOnly, either value for every caller</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">minAmounts</code></td><td className="px-4 py-2">Optional least amount of each market token the unwind must return; empty means 0 for every token. It can only make the call revert.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">deadline</code></td><td className="px-4 py-2">Last valid block timestamp, in seconds on every chain</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">minPayout</code></td><td className="px-4 py-2">Smallest caller payout accepted. The payout includes the returned funding, so this is the funding plus the smallest net payout accepted.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">maxShortfall</code></td><td className="px-4 py-2">Most of the caller&apos;s own debt asset the call may pull beyond its funding, to close a gap below the recovery floor; 0 disables it</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            The struct has no caller-funds or flash-amount field: the caller always funds debtToCover itself, and how it obtains the debt asset is outside LPVaultSwap. A caller can never supply a route address, a lender, a funding source, a recipient or an override of the recovery floor. The deadline and the minimum payout can only make the call revert, and maxShortfall only adds the caller&apos;s own funds.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Sizing the call</h3>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>debtToCover is the Lens&apos;s previewed Aave amount. When Aave&apos;s dust rule asks for the whole debt, the Lens quotes the whole debt plus a 500 bps margin, rounded up.</li>
            <li>The minimum payout is the funding plus the previewed net payout less at least 1% of that net payout: minPayout ≤ X + ⌊0.99 × (previewed keeperOut − X)⌋.</li>
            <li>The deadline is a few blocks ahead, for example t + 36 on Ethereum (three blocks) or t + 6 on Base. On Ethereum, callers submit through private order flow.</li>
          </ul>
          <div className="mb-4 doc-topic type-doc-body">
            Example: the Lens previews a whole debt of 1,950 USDC, so debtToCover is ⌈1,950 × 1.05⌉ = 2,047.5 USDC. A 1-wei repay lands first, Aave pulls 1,949.999999 USDC, and the 97.500001 USDC it did not pull returns to the caller inside its payout.
          </div>
        </section>

        <section id="sequence" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Settlement Steps</h2>
          <p className="mb-4 type-doc-body">
            The steps below run in this exact order, for every caller.
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
                  <td className="px-4 py-2">LPVaultSwap takes the chain&apos;s protocol lock (LockHeld if held), then checks the amounts (InvalidAmount), a frozen caller (AddressIsFrozen), the proxy (UnknownProxy), the debt reserve (UnknownDebtReserve) and the route mode. There is no keeper check, and the pause state is not read.</td>
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
                  <td className="px-4 py-2">LPVaultSwap pulls X of the debt asset from the caller and measures Kf as its own balance change, reverting with FundingMismatch unless 0 &lt; Kf ≤ X. It calls no flash source and no lender.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">9</td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">beginSeizure</code></td>
                  <td className="px-4 py-2">Collateralization checks the lock and the caller, checks Hub shares against assets, and stores the proxy&apos;s supplied shares and the vault token&apos;s total supply in transient storage.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">10</td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">liquidationCall</code></td>
                  <td className="px-4 py-2">LPVaultSwap approves the Spoke for exactly Kf and calls the liquidation with Kf as the bound and receiveShares set to false, then resets the approval. Aave validates, sizes the repayment, pulls D to the funding Hub and sends c vault tokens from the home Hub to LPVaultSwap. It reports deficits if the call empties the collateral.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">11</td>
                  <td className="px-4 py-2">Measure D and c</td>
                  <td className="px-4 py-2">Both measured as balance changes. If c is 0 the call reverts with NothingSeized. The unused Kf − D stays in LPVaultSwap and returns to the caller inside keeperOut; it is never swapped.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">12</td>
                  <td className="px-4 py-2">Open the recovery window</td>
                  <td className="px-4 py-2">LPVaultSwap records its balance of each market token and of the debt asset. The caller&apos;s funding and the unused debt asset stay outside the window of R.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">13</td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">burnSeized</code></td>
                  <td className="px-4 py-2">The AaveAdapter, the vault token&apos;s only burner, burns the c units from LPVaultSwap&apos;s balance (SeizedUnitsBurned).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">14</td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">settleSeizure</code></td>
                  <td className="px-4 py-2">Collateralization checks the snapshot, the pool lock, that the share drop equals c and that the supply drop equals c. It reconciles any earlier unsettled seizure of the proxy, debits c units from the proxy&apos;s records, and has the LP Vault unwind exactly those units.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">15</td>
                  <td className="px-4 py-2">Measure the unwind</td>
                  <td className="px-4 py-2">LPVaultSwap measures the amount aᵢ of each market token it received. Uncollected fees never enter these amounts.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">16</td>
                  <td className="px-4 py-2">Recovery floor</td>
                  <td className="px-4 py-2">LPVaultSwap computes the net bonus, the effective slippage, V, U and the floor minOut in the debt asset, and each leg&apos;s minimum.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">17</td>
                  <td className="px-4 py-2">Swap legs</td>
                  <td className="px-4 py-2">Each token that is not the debt asset is swapped over its route at its own oracle-derived minimum, in the route mode the caller set. R is the debt asset received from the start of the window to the end of conversion.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">18</td>
                  <td className="px-4 py-2">Shortfall check</td>
                  <td className="px-4 py-2">The shortfall is max(0, minOut − R). Above maxShortfall the call reverts with RecoveryBelowFloor; otherwise the shortfall is pulled from the caller.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">19</td>
                  <td className="px-4 py-2">Waterfall</td>
                  <td className="px-4 py-2">LPVaultSwap computes G, Y, A, Kr, B and keeperOut (a defensive InsufficientProceeds check), then checks keeperOut against minPayout (PayoutTooLow).</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">20</td>
                  <td className="px-4 py-2">Pay out</td>
                  <td className="px-4 py-2">A to the fee recipient, then B to the borrower&apos;s wallet, then keeperOut to the caller, all in the debt asset; then any route residues and dust legs to the caller. Zero amounts are skipped. A refused fee, surplus, residue or dust leg goes to the PayoutEscrow; a failed transfer of keeperOut reverts the whole call.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">21</td>
                  <td className="px-4 py-2">Event and lock</td>
                  <td className="px-4 py-2">LPVaultSwap emits LiquidationSettled and releases the lock. Its net balance change is 0 in every token, and every allowance it granted is 0.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="funding" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Caller Funding</h2>
          <p className="mb-4 type-doc-body">
            LPVaultSwap pulls the caller&apos;s funding with a transferFrom of X from the caller before any other transfer, and measures the rise of its own balance as Kf. The caller is LPVaultSwap&apos;s only source of the debt asset in a liquidation. Callers always fund in the debt asset of the reserve they repay, so no swap into the debt asset is needed and no leftover is sold back.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>The call reverts with FundingMismatch unless 0 &lt; Kf ≤ X.</li>
            <li>Kf, not X, is Aave&apos;s bound, so D ≤ Kf always holds: Aave pulls the repayment out of the caller&apos;s own funding.</li>
            <li>The unused Kf − D returns to the caller inside keeperOut, unswapped. Oversizing debtToCover costs the caller nothing at LPVaultSwap.</li>
            <li>A debt asset is enabled only while its transfer fee is zero. If a fee is switched on later, Kf is what arrived and keeperOut is what LPVaultSwap sends, and the fee on both transfers falls on the caller alone.</li>
          </ul>
          <div className="mb-4 doc-topic type-doc-body">
            Example (USDT with a transfer fee): debtToCover of 5,000 USDT delivers Kf = 4,995 USDT, and 4,995 USDT is Aave&apos;s bound.
          </div>
          <p className="mb-4 type-doc-body">
            liquidate takes no flash loan, and callers batch accounts with separate calls. The core flash source, read from the MarketRegistry&apos;s flashSource, serves only repay with collateral. Its callback reverts if it is called while LPVaultSwap holds the lock, which is always the case inside liquidate.
          </p>
        </section>

        <section id="helper" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Flash Liquidation Helper</h2>
          <p className="mb-4 type-doc-body">
            The flash liquidation helper lets a caller that holds no debt asset liquidate. It is a periphery contract outside the audited core: public, immutable, with no owner, admin, upgrade path, setter, sweep, rescue or arbitrary-call function, and holding no funds or allowances between transactions. One public instance per chain borrows from that chain&apos;s Aave V3 Pool (the Ethereum Core Pool; on Base 0xA238Dd80C259a72e81d7e4664a9801593F98d1c5). An operator can deploy its own instance of the operator variant. LPVaultSwap treats every helper as an ordinary caller.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Interface</h3>
          <p className="mb-4 type-doc-body">
            The helper implements <code className="type-doc-inline-code">IFlashLiquidator</code>, whose entry point is <code className="type-doc-inline-code">flashLiquidate(FlashLiquidationRequest request)</code>, returning the caller&apos;s net payout. The operator variant implements IOperatorFlashLiquidator, which adds SIGNER, FUNDING_SAFE, MAX_TOP_UP_BPS and claimEscrowed.
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Request field</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">params</code></td><td className="px-4 py-2">The LiquidationParams, passed to liquidate unchanged</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">flashAmount</code></td><td className="px-4 py-2">The loan F, with 0 &lt; F ≤ debtToCover</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">maxPremium</code></td><td className="px-4 py-2">The most premium the caller accepts on F</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">maxTopUp</code></td><td className="px-4 py-2">The most debt asset the helper may pull from the caller after liquidate, to repay F plus the premium</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">minPayout</code></td><td className="px-4 py-2">The smallest net payout accepted after the loan is repaid</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            The helper also exposes maxFlashLoan(asset), the Pool&apos;s idle liquidity of the asset (0 while the reserve is inactive, paused or not enabled for flash loans), and flashPremium(asset, amount), which is 0 while the helper holds FLASH_BORROWER and otherwise the Pool&apos;s premium rounded up. Its immutables are POOL, LP_VAULT_SWAP, MARKET_REGISTRY and PARAMETER_STORE.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Steps up to the liquidation</h3>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>Checks, in order: no other helper context is open (ContextActive); in the operator variant, the caller is the signer (NotSigner); 0 &lt; F ≤ X (InvalidFlashAmount); the debt asset is read from the MarketRegistry; and F is within the Pool&apos;s idle liquidity (InsufficientFlashLiquidity). The helper also refuses a Pool recorded as a Hub (FlashSourceIsHub), at deployment and on every call.</li>
            <li>The helper records a single-use context in transient storage: the Pool, itself as initiator, the asset, F, the premium and top-up bounds, the hash of the parameters, the payer and the payout recipient.</li>
            <li>If F is below X, it pulls X − F of the debt asset from the payer.</li>
            <li>It calls the Pool&apos;s flashLoan, not flashLoanSimple, because only flashLoan waives the premium for FLASH_BORROWER.</li>
            <li>In the callback, executeOperation accepts only the recorded Pool as caller, itself as initiator, one asset, the recorded asset and amount, and matching parameters, and marks the context used so a second callback fails (InvalidFlashCallback). It reverts with PremiumTooHigh above the caller&apos;s maxPremium, and with FlashFeeTooHigh above the ParameterStore&apos;s maxFlashFeeBps.</li>
            <li>It approves LPVaultSwap for exactly X, calls liquidate with the parameters unchanged, resets the allowance and measures keeperOut as its own balance change.</li>
          </ol>
          <div className="mb-4 type-doc-code-block">
            <code className="type-doc-body text-gray-900">
              φ ≤ maxPremium
              <br />φ × 10,000 ≤ maxFlashFeeBps × F
            </code>
          </div>
          <p className="mb-4 type-doc-body">
            maxFlashFeeBps applies only to the helper and to repay with collateral; no check of liquidate reads it. It is 10 bps at launch (bounds 0 to 100), set strictly above the Pool&apos;s premium while that premium is above 0, and lowered to 0 once both the helper and the core flash source hold FLASH_BORROWER.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: a loan of 2,000 USDC at 5 bps carries a premium of 1 USDC. With maxPremium of 1 USDC the loan proceeds. At 6 bps (1.2 USDC) the helper reverts before LPVaultSwap is called, and the caller resubmits with its own funds or a smaller loan.
          </div>
          <p className="mb-4 type-doc-body">
            Inside the callback LPVaultSwap runs every step above exactly as for any caller: it checks that the helper is not frozen, pulls Kf from the helper and pays keeperOut directly to the helper or reverts. No check or formula of LPVaultSwap depends on the loan. The helper&apos;s repayment of the loan is described in its own section below.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Public helper and operator variant</h3>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Item</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Public helper</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Operator variant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">Who may call</td>
                  <td className="px-4 py-2">Anyone</td>
                  <td className="px-4 py-2">Only its signer</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Payer and payout recipient</td>
                  <td className="px-4 py-2">The caller itself</td>
                  <td className="px-4 py-2">The operator&apos;s funding Safe</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Top-up bound</td>
                  <td className="px-4 py-2">The request&apos;s maxTopUp</td>
                  <td className="px-4 py-2">The smaller of maxTopUp and ⌊X × MAX_TOP_UP_BPS / 10,000⌋</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">FLASH_BORROWER</td>
                  <td className="px-4 py-2">Requested in each chain&apos;s deployment payload</td>
                  <td className="px-4 py-2">None unless an Aave proposal adds one, so it pays the Pool premium</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Committed operator registry</td>
                  <td className="px-4 py-2">Never registered, because it commits to nothing</td>
                  <td className="px-4 py-2">The operator registers this helper, or its signer when it calls liquidate directly</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Escrowed residues</td>
                  <td className="px-4 py-2">No claim function; a credit can arise only when a market token refuses the helper itself</td>
                  <td className="px-4 py-2">claimEscrowed, callable by the signer, pays the credit to the funding Safe</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            The helper takes no swap step, route, foreign recipient or executable calldata from the request. The unwind and the routes stay in the core.
          </p>
        </section>

        <section id="seizure" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Seizure, Burn and Unwind</h2>
          <h3 className="mb-2 type-doc-subsection-title">Aave liquidation</h3>
          <p className="mb-4 type-doc-body">
            The standard Spoke validates the call (not a self-liquidation, amount above 0, reserves not paused, collateral supplied, debt drawn in the reserve, health factor below 1), sizes the repayment against its target health factor with its dynamic bonus and dust rule, pulls D out of the caller&apos;s funding, and removes c vault tokens from the home Hub to LPVaultSwap. Receiving shares instead of tokens is disabled on the reserve, so LPVaultSwap always passes false.
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
            <li>In PrimaryThenBackup mode the primary is called first and the backup only if the primary is not usable or reverts. In BackupOnly mode only the backup is called. Both modes are open to every caller and are held to the same floor and leg minimums.</li>
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
            <li>Input or intermediate tokens a route returns unconverted count as 0 toward R and go to the caller (ResidueReturned). A residue never stands in for recovery, because the floor and each leg&apos;s minimum are met in the debt asset alone.</li>
            <li>Dust legs and residues are delivered with the gas-limited transfer of the payout step. If a token refuses the caller, the amount is credited to the caller in the PayoutEscrow.</li>
            <li>A primary that reverts emits RouteFailed, its approval is reset to 0, and the backup is called. If no usable route converts a token, the call reverts with NoRouteAvailable.</li>
            <li>Route records change only by timelock: setRoute at the normal delay (5 days), disableRoute and restoreRoute of a previously approved route at the short delay (12 hours). An operation that only restores routes can be cancelled only by the Aave governance executor.</li>
          </ul>
          <h3 className="mb-2 type-doc-subsection-title">Unwind at any pool price</h3>
          <p className="mb-4 type-doc-body">
            The unwind runs at zero per-token minimums because the LP Oracle values a position at its fair composition, the minimum of its oracle value over all pool prices. Removing the liquidity at any pool price returns tokens worth at least V at oracle prices. What a moved pool can still distort is a swap, and every swap leg has its own oracle minimum. A spot gate would add nothing and would let anyone keep an underwater account alive by moving a thin pool before each attempt.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: a full-range USDC/USDT position worth $10,000 at $1.00 each holds about 5,000 of each token. An attacker moves the pool to 2 USDT per USDC. The position now holds 3,535.53 USDC and 7,071.07 USDT, worth $10,606.60 at oracle prices. A caller seizes and unwinds it at that pool price, the USDT leg must still return its oracle minimum, and the floor is computed from V = 10,000.
          </div>
        </section>

        <section id="floor" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Recovery Floor</h2>
          <p className="mb-4 type-doc-body">
            The floor is computed in the debt asset, so the same rule serves GHO, USDC, WETH or any other debt reserve. It allows exactly the swap loss that Aave&apos;s net bonus can pay for.
          </p>
          <div className="mb-4 type-doc-code-block">
            <code className="type-doc-body text-gray-900">
              bNet = 10,000 + ⌊(b − 10,000) × (10,000 − lf) / 10,000⌋ (10,000 when b ≤ 10,000)
              <br />s = min(slippageAllowanceBps, ⌊10,000 × (bNet − 10,000) / bNet⌋), or 0 when bNet ≤ 10,000
              <br />V = ⌊c × Pc × 10^dd / (10^dv × Pdebt)⌋
              <br />U = Σᵢ ⌈pᵢ × 10^dd / (10^dᵢ × Pdebt)⌉ (a token that is the debt asset counts 1)
              <br />minOut = max(0, ⌈V × (10,000 − s) / 10,000⌉ − U − floorRoundingAllowance)
            </code>
          </div>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>s solves bNet × (1 − s) ≥ 1, so the slippage term alone recovers the debt repaid, up to one vault unit and 1 base unit. slippageAllowanceBps is 100 at launch, so s is at most 1%.</li>
            <li>The formula has no flash-premium or transfer-fee term. LPVaultSwap takes no flash loan, and a helper&apos;s premium is the helper&apos;s cost.</li>
            <li>V uses the prices Aave used for the seizure, so the floor measures swap loss only, never a price difference between Avana and Aave.</li>
            <li>U and floorRoundingAllowance let dust liquidations settle. AMM removals and swaps round down by up to one raw unit per token. Without these terms a dust liquidation would revert on every attempt, and its deficit would never be recorded. Any amount they leave the recovery below D comes out of the caller&apos;s payout.</li>
            <li>floorRoundingAllowance is set per debt reserve when it is enabled: one whole token for a USD stablecoin (1,000,000 for USDC, 10^18 for GHO) and 0.0005 WETH for WETH debt.</li>
            <li>The floor depends on no caller input. V rounds down and the slippage term rounds up, both against the caller.</li>
          </ul>
          <div className="mb-4 doc-topic type-doc-body">
            Example (Ethereum, USDC debt): c = 4,998 vault tokens at Pc = 2.00 and bNet = 10,200. s = min(100, ⌊10,000 × 200 / 10,200⌋) = 100. V = 9,996 USDC. With USDC at 1.0000 and USDT at 0.9998, U = 2 base units. minOut = 9,896.04 − 0.000002 − 1 = 9,895.039998 USDC.
          </div>
          <h3 className="mb-2 type-doc-subsection-title">When the bonus cap binds</h3>
          <p className="mb-4 type-doc-body">
            When slippageAllowanceBps is at or above the cap the bonus sets, s sits at that cap and minOut falls to about D. A caller that routes the recovery down to the floor then leaves Y near 0, and Avana&apos;s fee near 0 with it. The fee is best-effort in such a market: the floor still protects the debt repaid and the borrower.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: the same seizure in a market listed with slippageAllowanceBps = 300 gives s = min(300, 196) = 196. The slippage term is 9,800.0784 USDC and minOut = 9,799.078398 USDC, below D = 9,800 USDC. Routes returning exactly minOut give Y = 0 and A = 0 although G = 196 USDC, and the caller&apos;s payout is Kf − 0.921602 USDC.
          </div>
        </section>

        <section id="shortfall" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Shortfall and Rounding</h2>
          <h3 className="mb-2 type-doc-subsection-title">Shortfall top-up</h3>
          <p className="mb-4 type-doc-body">
            After the swaps, LPVaultSwap computes the amount the caller must add to reach the floor:
          </p>
          <div className="mb-4 type-doc-code-block">
            <code className="type-doc-body text-gray-900">shortfall = max(0, minOut − R)</code>
          </div>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>If the shortfall exceeds maxShortfall, the call reverts with RecoveryBelowFloor. The caller retries with a larger maxShortfall, a smaller debtToCover or the other route mode.</li>
            <li>Otherwise LPVaultSwap pulls exactly the shortfall from the caller, and R′ = R + shortfall.</li>
            <li>The floor is checked on R alone, so unused caller funds cannot hide a poor recovery. Only an explicit, capped top-up closes the gap.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            A caller that allows a top-up also lets each leg run at a wider slippage, which keeps liquidations running at full size when routes trade below the oracle in a crash:
          </p>
          <div className="mb-4 type-doc-code-block">
            <code className="type-doc-body text-gray-900">sLeg = min(9,999, s + min(maxShortfallBps, ⌊maxShortfall × 10,000 / V⌋))</code>
          </div>
          <p className="mb-4 type-doc-body">
            maxShortfallBps is 1,000 at launch (bounds 0 to 5,000), so a top-up buys at most 10% more slippage. Avana&apos;s fee does not fall when a shortfall is paid, and the borrower surplus is 0 in that case, so a caller&apos;s top-up never reaches the borrower.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: V = 12,422.6 USDC, s = 100 bps and maxShortfall = 200 USDC. The legs run at 260 bps, the routes return 12,174 USDC, 123.373998 USDC is pulled from the caller, and the liquidation settles at full size.
          </div>
          <h3 className="mb-2 type-doc-subsection-title">Rounding: the caller bears a recovery below the debt</h3>
          <p className="mb-4 type-doc-body">
            Aave pulls D out of the caller&apos;s funding, so Kf ≥ D, and there is no settlement gap for LPVaultSwap to close. A recovery at or above the floor but a few units below D is the caller&apos;s loss, D − R′, taken from keeperOut. No Avana contract pays it, and no settlement budget exists.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>For any recovery at or above the floor, the loss is at most one vault unit&apos;s value plus U + floorRoundingAllowance plus (2 + ⌈drawnIndex / RAY⌉) debt-asset base units.</li>
            <li>The caller that chose the liquidation&apos;s size and funding bears it. Avana&apos;s keeper holds enough of each chain&apos;s debt assets to fund the whole repayment and that loss, and accepts the loss.</li>
            <li>A flash-funded caller covers it through the helper&apos;s top-up bound, or the helper reverts and the caller resubmits from its own funds.</li>
          </ul>
          <div className="mb-4 doc-topic type-doc-body">
            Example (Ethereum, USDC dust case): D = 0.78 USDC, R = 0.77 USDC, minOut = 0, and the caller funds Kf = 0.78 USDC. The shortfall is 0, Y = A = Kr = B = 0, and keeperOut = 0.78 + 0.77 − 0.78 = 0.77 USDC: a 0.01 USDC loss the caller accepts with a minimum payout of at most 0.77 USDC. Through the public helper with a 0.78 USDC loan, no premium and a top-up bound of 0.02 USDC, LPVaultSwap pays the helper 0.77 USDC, the helper pulls 0.01 USDC from its caller, repays the Pool 0.78 USDC and pays its caller 0. With a top-up bound of 0, the helper reverts and the whole liquidation reverts.
          </div>
        </section>

        <section id="waterfall" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Payout Waterfall</h2>
          <div className="mb-4 type-doc-code-block">
            <code className="type-doc-body text-gray-900">
              G = max(0, V − D)
              <br />Y = max(0, R′ − D)
              <br />A = min(⌊G × avanaFeeShareBps / 10,000⌋, Y)
              <br />Kr = min(Y − A, G − A)
              <br />B = Y − A − Kr
              <br />keeperOut = Kf + R′ − D − A − B
            </code>
          </div>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Avana&apos;s fee A is 20% (avanaFeeShareBps = 2,000, bounds 0 to 5,000) of the oracle gain G, never above the realized surplus Y. While Y covers it, A depends only on the oracle value of the seizure and the debt repaid, never on how the caller swapped. Since A never exceeds Y, the fee alone never makes a liquidation revert. It is best-effort where the bonus cap binds.</li>
            <li>The caller reward Kr is the rest of the oracle gain, capped by what was realized.</li>
            <li>The borrower surplus B is the recovery above the seized collateral&apos;s oracle value. It is non-zero only when the routes beat the oracle price, so a favourable price move during settlement goes to the borrower. B is paid even when the same call leaves a deficit.</li>
            <li>A + Kr + B = Y exactly. A rounds down, so rounding dust stays with the borrower.</li>
            <li>When R′ ≥ D, keeperOut = Kf + Kr: the whole funding back plus the reward. When R′ is below D, keeperOut = Kf − (D − R′): the caller bears the difference. It is never negative; a defensive check reverts with InsufficientProceeds if it would be.</li>
            <li>The caller&apos;s net result is keeperOut − Kf − shortfall. A helper&apos;s premium comes out of the caller&apos;s share, never out of A or B.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            The debt asset is conserved: Kf + R + shortfall = D + A + B + keeperOut. LPVaultSwap never keeps or creates the debt asset.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Payout order</h3>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>Avana&apos;s fee A to the fee recipient read from the ParameterStore. A zero fee recipient reverts with InvalidFeeRecipient.</li>
            <li>The borrower surplus B to the borrower&apos;s wallet, the wallet the AaveAdapter records for the proxy (BorrowerSurplusPaid).</li>
            <li>keeperOut to the caller, by a plain transfer. If it fails, the whole liquidation reverts.</li>
            <li>Route residues and dust legs to the caller.</li>
          </ol>
          <p className="mb-4 type-doc-body">
            No recipient is taken from calldata, nothing accumulates in LPVaultSwap, and every zero-amount transfer is skipped. Each payout is measured as the recipient&apos;s balance change.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example (Ethereum, USDC debt): Kf = D = 9,800, V = 9,996, and the routes return R = 9,950 USDC. G = 196, Y = 150, A = min(⌊196 × 0.2⌋, 150) = 39.2, Kr = min(110.8, 156.8) = 110.8, B = 0 and keeperOut = 9,800 + 9,950 − 9,800 − 39.2 = 9,910.8 USDC, the 9,800 USDC funded plus 110.8. Conservation: 9,800 + 9,950 = 9,800 + 39.2 + 9,910.8 = 19,750. Through the public helper with a 9,800 USDC loan and no premium, the helper receives 9,910.8 USDC, repays the Pool 9,800 USDC and pays its caller 110.8 USDC. With R = 10,010 USDC instead: Y = 210, A = 39.2, Kr = 156.8, B = 14 USDC to the borrower and keeperOut = 9,956.8 USDC.
          </div>
          <h3 className="mb-2 type-doc-subsection-title">Minimum payout</h3>
          <p className="mb-4 type-doc-body">
            After the waterfall, LPVaultSwap reverts with PayoutTooLow if keeperOut is below minPayout. The check only adds a revert: it changes no amount, route or recipient, and the floor stays computed from the oracle alone. The floor protects Avana and the borrower; this check protects the caller.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: the caller above funds 9,800 USDC and sets minPayout = 9,909 USDC (its funding plus a net 109 USDC, more than 1% below the previewed net 110.8). The liquidation pays 9,910.8 USDC and succeeds. Had the routes returned R = 9,935 USDC, then Y = 135, A = 39.2, Kr = 95.8, keeperOut = 9,895.8 USDC, and the call reverts with PayoutTooLow(9,895,800,000, 9,909,000,000).
          </div>
        </section>

        <section id="repayment" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Flash Repayment Through the Helper</h2>
          <p className="mb-4 type-doc-body">
            LPVaultSwap repays no flash loan. In a flash-funded call, the helper repays the Pool after liquidate returns, still inside the Pool&apos;s callback:
          </p>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>The helper owes F + φ. If keeperOut is below that, it pulls the difference from its payer as a top-up, and reverts with TopUpExceeded above the bound. A revert here reverts the whole liquidation.</li>
            <li>It approves the Pool for exactly F + φ and returns; the Pool pulls the amount.</li>
            <li>After flashLoan returns, the helper computes its caller&apos;s payout as its own balance change over the whole call, keeperOut + top-up − F − φ, and reverts with PayoutTooLow below the request&apos;s minPayout.</li>
            <li>It sends that payout, and any market-token residues or dust legs LPVaultSwap paid it, to the payout recipient, resets every allowance, and emits FlashLiquidated.</li>
          </ol>
          <p className="mb-4 type-doc-body">
            The helper pays only after flashLoan returns, so nothing leaves it while the loan is open. The premium on the whole loan, including any part the debt did not need, and any transfer-fee loss on the helper&apos;s own transfers come out of the caller&apos;s payout. They never reduce Avana&apos;s fee or the borrower surplus. The request&apos;s minPayout is net of the loan and premium; the liquidation&apos;s own minPayout still bounds keeperOut, and a helper caller may leave it at 0.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example (Ethereum, USDC debt, helper without FLASH_BORROWER): the helper borrows 1,950 USDC at 5 bps, a premium of 0.975 USDC. LPVaultSwap pays it keeperOut = 2,020.8 USDC, the helper repays 1,950.975 USDC and pays its caller 69.825 USDC, which passes a minimum of 69 USDC.
          </div>
          <div className="mb-4 doc-topic type-doc-body">
            Example (oversized loan): the Lens margin of 2,047.5 USDC borrowed whole at 5 bps carries a premium of 1.02375 USDC. LPVaultSwap pays the helper 2,118.3 USDC, including the 97.5 USDC Aave did not use. The helper repays 2,048.52375 USDC and pays its caller 69.77625 USDC, so the premium on the unused 97.5 USDC, 0.04875 USDC, falls on the caller alone.
          </div>
        </section>

        <section id="escrow" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Refused Payouts</h2>
          <p className="mb-4 type-doc-body">
            Avana&apos;s fee, the borrower surplus, and each route residue or dust leg owed to the caller use a gas-limited delivery that cannot revert the liquidation. The residue of settlePending to the fee recipient uses it too. The caller payout keeperOut does not: it is paid by a plain transfer, and a failure reverts the call.
          </p>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>LPVaultSwap requires enough gas left for the attempt plus a post-call reserve, at least ⌈100,000 × 64 / 63⌉ = 101,588 gas plus that reserve, else InsufficientGas. This stops a caller from starving the call to push a payout into the escrow.</li>
            <li>It calls the token&apos;s transfer with exactly 100,000 gas (PAYOUT_TRANSFER_GAS) and reads at most 32 bytes of return data.</li>
            <li>If the transfer reverts, returns false or runs out of gas, LPVaultSwap approves the PayoutEscrow for exactly the amount and calls its deposit, credited to the recipient. The liquidation continues. Only a revert of the deposit itself reverts the call.</li>
          </ol>
          <p className="mb-4 type-doc-body">
            The PayoutEscrow is immutable, one per chain, with no owner, role, setter, pause or sweep, and holding refused payouts is its only job. Only LPVaultSwap can deposit, and only while it holds the lock. The credited account later calls <code className="type-doc-inline-code">claim(token, recipient)</code> to receive its whole credit at an address it chooses. No Avana switch, pause or address freeze can hold a credit. Deposits emit RemainderEscrowed and claims emit RemainderClaimed.
          </p>
          <p className="mb-4 type-doc-body">
            Why the caller payout is never escrowed: it contains the caller&apos;s returned funding, and a flash-funded caller repays its loan from it in the same transaction, so an escrowed payout would leave the loan unpaid and the transaction would revert anyway. The caller chose its own address and controls whether it can receive the debt asset. A blocklisted caller blocks only its own call; any other address can liquidate the account.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: a borrower&apos;s wallet is on USDC&apos;s blocklist and the liquidation owes it a 14 USDC surplus. The transfer fails, the 14 USDC is deposited in the escrow credited to the wallet, and the liquidation completes. The borrower later claims it to another wallet that USDC accepts.
          </div>
          <div className="mb-4 doc-topic type-doc-body">
            Example: Circle blocklists the treasury Safe that is the fee recipient. In a liquidation that owes a 19.5 USDC fee, the transfer to the Safe reverts within its 100,000 gas, LPVaultSwap deposits 19.5 USDC in the escrow credited to the Safe, pays keeperOut of 2,020.8 USDC to the caller and completes. Had the caller&apos;s own address been blocklisted, the transfer of keeperOut would revert and the whole liquidation with it.
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
                <tr><td className="px-4 py-2">Aave V3 Pool (flash-funded calls only)</td><td className="px-4 py-2"><code className="type-doc-inline-code">FlashLoan</code>, with the helper as target and initiator</td></tr>
                <tr><td className="px-4 py-2">Flash liquidation helper</td><td className="px-4 py-2"><code className="type-doc-inline-code">FlashLiquidated</code></td></tr>
                <tr><td className="px-4 py-2">CDP Spoke</td><td className="px-4 py-2"><code className="type-doc-inline-code">LiquidationCall</code></td></tr>
                <tr><td className="px-4 py-2">Funding Hub</td><td className="px-4 py-2"><code className="type-doc-inline-code">ReportDeficit</code> (deficit case, per debt reserve)</td></tr>
                <tr><td className="px-4 py-2">Vault token</td><td className="px-4 py-2"><code className="type-doc-inline-code">Transfer</code> from the Hub to LPVaultSwap, and from LPVaultSwap to the zero address</td></tr>
                <tr><td className="px-4 py-2">AaveAdapter</td><td className="px-4 py-2"><code className="type-doc-inline-code">SeizedUnitsBurned</code></td></tr>
                <tr><td className="px-4 py-2">AMM protocol and LP Vault</td><td className="px-4 py-2"><code className="type-doc-inline-code">DecreaseLiquidity</code>, <code className="type-doc-inline-code">Collect</code>, <code className="type-doc-inline-code">UnitsUnwound</code></td></tr>
                <tr><td className="px-4 py-2">Collateralization</td><td className="px-4 py-2"><code className="type-doc-inline-code">RecordDebited</code>, <code className="type-doc-inline-code">SeizureSettled</code>, <code className="type-doc-inline-code">SeizureReconciled</code>, <code className="type-doc-inline-code">PendingSettled</code></td></tr>
                <tr><td className="px-4 py-2">LPVaultSwap</td><td className="px-4 py-2"><code className="type-doc-inline-code">RouteFailed</code>, <code className="type-doc-inline-code">ResidueReturned</code>, <code className="type-doc-inline-code">BorrowerSurplusPaid</code>, <code className="type-doc-inline-code">LiquidationSettled</code>, <code className="type-doc-inline-code">PendingSettlementForwarded</code></td></tr>
                <tr><td className="px-4 py-2">PayoutEscrow</td><td className="px-4 py-2"><code className="type-doc-inline-code">RemainderEscrowed</code>, <code className="type-doc-inline-code">RemainderClaimed</code></td></tr>
                <tr><td className="px-4 py-2">Avana Umbrella (Coverage Spoke)</td><td className="px-4 py-2"><code className="type-doc-inline-code">ReserveFunded</code> (pending settlement)</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="mb-2 type-doc-subsection-title">Event fields</h3>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>LiquidationSettled carries the caller, the proxy and the market (all indexed), with the debt reserve and debt asset, debt repaid, units seized, amounts unwound, recovered amount, floor, effective slippage, net bonus, caller funds, surplus, Avana fee, keeper reward, borrower surplus, caller payout, minimum payout, route mode, routes used and shortfall. It has no flash field and no flag for the kind of caller, because LPVaultSwap takes no loan and every caller uses the same entry point.</li>
            <li>BorrowerSurplusPaid carries the proxy, the wallet, the debt asset, the amount and whether it was escrowed.</li>
            <li>ResidueReturned carries the caller, the token, the amount and whether it was escrowed. It covers route residues and dust legs.</li>
            <li>FlashLiquidated carries the helper&apos;s caller, the payout recipient, the asset, the flash amount, the premium, keeperOut, the top-up and the payout.</li>
            <li>FlashLoanUsed is emitted only by repay with collateral, never by a liquidation.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            A deficit appears in the funding Hub&apos;s ReportDeficit event of the same transaction. A failed attempt emits nothing, because every liquidation is one transaction.
          </p>
          <p className="mb-4 type-doc-body">
            LPVaultSwap writes no breaker state. Monitoring computes its alerts off-chain from these events and from reverted calls: collateral seized above 20% of a market in 1 hour, and 3 route failures in 1 hour.
          </p>
        </section>

        <section id="errors" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Errors</h2>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Error</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">AddressIsFrozen</code></td><td className="px-4 py-2">The caller of liquidate is on the chain&apos;s freeze list. It does not fire for a frozen address that calls through the public helper.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">InvalidAmount</code></td><td className="px-4 py-2">debtToCover is 0, debtToCover or maxShortfall exceeds the uint128 range, or minAmounts has the wrong length</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">FundingMismatch</code></td><td className="px-4 py-2">The caller funding is outside 0 &lt; Kf ≤ X, or a shortfall pull delivered a different amount</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">RecoveryBelowFloor</code></td><td className="px-4 py-2">The gap below the recovery floor exceeds maxShortfall</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">InsufficientProceeds</code></td><td className="px-4 py-2">Defensive only: unreachable while Kf ≥ D, it guards against a faulty balance measurement</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">PayoutTooLow</code></td><td className="px-4 py-2">keeperOut is below the call&apos;s minPayout, or a helper&apos;s net payout is below the request&apos;s minPayout</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">InsufficientGas</code></td><td className="px-4 py-2">Gas left is below a payout&apos;s headroom; the caller retries with more gas</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">KeeperFloor</code></td><td className="px-4 py-2">removeKeeper would leave fewer than keeperFloor active committed operators</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">ContextActive</code>, <code className="type-doc-inline-code">NotSigner</code>, <code className="type-doc-inline-code">InvalidFlashAmount</code></td><td className="px-4 py-2">Helper: a nested call, a caller other than the operator variant&apos;s signer, or a flash amount outside 0 to debtToCover</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">InsufficientFlashLiquidity</code></td><td className="px-4 py-2">Helper: the flash amount exceeds the Pool&apos;s idle liquidity; reverts before LPVaultSwap is called</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">PremiumTooHigh</code>, <code className="type-doc-inline-code">FlashFeeTooHigh</code></td><td className="px-4 py-2">Helper: the Pool&apos;s premium exceeds the caller&apos;s maxPremium or the maxFlashFeeBps cap</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">InvalidFlashCallback</code>, <code className="type-doc-inline-code">FlashSourceIsHub</code></td><td className="px-4 py-2">Helper: a callback that does not match its single-use context, or a Pool recorded as a Hub</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">TopUpExceeded</code></td><td className="px-4 py-2">Helper: repaying the loan and premium needs a top-up above the caller&apos;s bound; the whole liquidation reverts</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            The price, sequencer, market and seizure errors are listed in the steps above. NotApprovedKeeper no longer exists: a caller outside the committed operator registry runs every check like any other. Aave&apos;s own errors pass through unchanged.
          </p>
        </section>

        <section id="end-state" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">End State</h2>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Vault tokens received by LPVaultSwap = burned by the AaveAdapter = vault-token supply drop = the proxy&apos;s share drop on the Spoke = units debited from the proxy&apos;s records = units removed from those positions.</li>
            <li>No depositor fees were taken: every debited position&apos;s owed fees remain collectable by its depositor.</li>
            <li>The recovery plus any top-up met the floor, Avana&apos;s fee went to the fee recipient, any borrower surplus went to the borrower or the PayoutEscrow, and the caller payout was at least minPayout and paid directly to the caller.</li>
            <li>No protocol balance paid any part of the settlement: Aave&apos;s repayment came from the caller&apos;s funding, and any recovery below D reduced only the caller&apos;s payout.</li>
            <li>A deficit was recorded only if the account has no collateral left, and then its debt is 0 in every debt reserve.</li>
            <li>LPVaultSwap ends with no net balance change in any token, no allowance granted in the call is non-zero, and the lock is free.</li>
            <li>The debt asset came only from the caller, never bought with another asset and never flash-borrowed by LPVaultSwap. In a flash-funded call, the helper borrowed from the Aave V3 Pool within the caller&apos;s maxPremium, repaid the loan and premium in the same transaction before paying its caller, and holds nothing after the call.</li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Every step of an Avana liquidation in execution order: checks, caller funding, Aave seizure, burn, unwind, swap legs, recovery floor, shortfall, payouts, and the flash liquidation helper around a flash-funded call."
        sectionColor="amber"
      />
    </div>
  ))
}
