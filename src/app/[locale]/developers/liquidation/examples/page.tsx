import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'liquidation/examples', {
    title: "Liquidation Examples",
    description: "Worked Avana liquidations with full numbers: Uniswap v3 on Ethereum, Aerodrome Slipstream on Base with sequencer grace, fee and surplus variants, a dust gap and a GHO-debt walkthrough.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "uniswap-ethereum", title: "Uniswap v3 on Ethereum" },
  { id: "payout-variants", title: "Surplus and PayoutTooLow Variants" },
  { id: "slipstream-base", title: "Slipstream on Base" },
  { id: "core-math", title: "Core Math: Fee, Reward and Surplus" },
  { id: "dust-gap", title: "Dust Liquidation Gap" },
  { id: "gho-debt", title: "GHO Debt, Call by Call" },
  { id: "edge-cases", title: "Edge Cases" },
]

export default async function LiquidationExamplesPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "liquidation/examples", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Liquidation Examples"
          description="Worked liquidations with every number: seizure, recovery floor, swaps, flash repayment and payouts."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <div className="mb-4 doc-topic type-doc-body">
            Example values; each market&apos;s parameters are set at listing.
          </div>
          <p className="mb-4 type-doc-body">
            Each example liquidates one account, which holds one market, against one debt reserve. Amounts are in the repaid debt asset. The formulas used here are on the flow page: <Link href="/developers/liquidation/flow" className="text-type-accent hover:underline">Liquidation Flow</Link>.
          </p>
          <p className="mb-4 type-doc-body">
            Common symbols: D is the debt Aave repays, c the vault tokens seized, φ the flash premium, V the oracle value of the seizure, R the debt asset recovered, Y the realized surplus, A Avana&apos;s fee, Kr the keeper reward, B the borrower surplus and keeperOut the caller&apos;s payout.
          </p>
        </section>

        <section id="uniswap-ethereum" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Uniswap v3 on Ethereum</h2>
          <p className="mb-4 type-doc-body">
            Bob has a USDC/USDT Uniswap v3 position on the Uniswap v3 Stable CDP Spoke of the Ethereum Stable LP Hub and owes USDC. His health factor is below 1.
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Setup</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Vault-token price</td><td className="px-4 py-2">$2.10 per vault token (18 decimals)</td></tr>
                <tr><td className="px-4 py-2">Debt reserve</td><td className="px-4 py-2">USDC, reserve 2, funded by the Stable LP Hub&apos;s USDC credit line, priced by the USDC DebtOracle at $1.00</td></tr>
                <tr><td className="px-4 py-2">Aave bonus</td><td className="px-4 py-2">10,500 bps (5%), liquidation fee 0</td></tr>
                <tr><td className="px-4 py-2">Slippage allowance</td><td className="px-4 py-2">100 bps</td></tr>
                <tr><td className="px-4 py-2">Floor rounding allowance</td><td className="px-4 py-2">1 USDC</td></tr>
                <tr><td className="px-4 py-2">Flash premium</td><td className="px-4 py-2">5 bps: the FLASH_BORROWER role is not yet granted; maxFlashFeeBps is 10</td></tr>
                <tr><td className="px-4 py-2">Application state</td><td className="px-4 py-2">Frozen, which stops new pledges and borrowing but not this liquidation</td></tr>
              </tbody>
            </table>
          </div>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>Avana&apos;s keeper K1 calls the Lens preview, which returns a repayment of 1,950 USDC and a payout of 70.02 USDC.</li>
            <li>K1 calls liquidate through private order flow with debtToCover 1,950 USDC, keeperFunds 0, flashAmount 1,950 USDC, PrimaryThenBackup, a deadline 120 s ahead, minPayout 69 USDC (more than 1% below the preview) and maxShortfall 0.</li>
            <li>LPVaultSwap checks the deadline, takes the lock, checks K1 is approved, confirms the health factor is below 1, and pokes the LP Oracle and the USDC DebtOracle, which is Live. It does not read the pause state.</li>
            <li>Flash checks: the source can lend 1,950 USDC, and the premium of 0.975 USDC passes because 975,000 × 10,000 = 9,750,000,000 is at most 10 × 1,950,000,000. The Aave V3 Pool lends 1,950 USDC.</li>
            <li>Aave repays D = 1,950 USDC and seizes c = 1,950 × 1.05 / 2.10 = 975 vault tokens, sent to LPVaultSwap.</li>
            <li>The AaveAdapter burns them and the LP Vault unwinds about 1,030.25 USDC and 1,010 USDT. The USDC leg enters R directly, and the USDT leg&apos;s primary route returns 1,010.05 USDC at or above its per-leg minimum. R = 2,040.30 USDC.</li>
            <li>Floor: V = 975 × 2.10 = 2,047.5 USDC. The slippage term is ⌈2,047.5 × 0.99⌉ = 2,027.025 USDC, U = 2 base units, so the floor is 2,027.025 − 0.000002 − 1 = 2,026.024998 USDC. R is above it, and the rounding gap is max(0, 1,950 + 0.975 − 0 − 2,040.30) = 0.</li>
          </ol>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Waterfall</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Calculation</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">USDC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Realized surplus Y</td><td className="px-4 py-2">2,040.30 − 1,950 − 0.975</td><td className="px-4 py-2">89.325</td></tr>
                <tr><td className="px-4 py-2">Oracle gain G</td><td className="px-4 py-2">2,047.5 − 1,950 − 0.975</td><td className="px-4 py-2">96.525</td></tr>
                <tr><td className="px-4 py-2">Avana fee A</td><td className="px-4 py-2">min(⌊96.525 × 0.2⌋, 89.325)</td><td className="px-4 py-2">19.305</td></tr>
                <tr><td className="px-4 py-2">Keeper reward Kr</td><td className="px-4 py-2">min(89.325, 96.525) − 19.305</td><td className="px-4 py-2">70.02</td></tr>
                <tr><td className="px-4 py-2">Borrower surplus B</td><td className="px-4 py-2">Y − A − Kr</td><td className="px-4 py-2">0</td></tr>
                <tr><td className="px-4 py-2">keeperOut</td><td className="px-4 py-2">(0 + 1,950 + 2,040.30) − (1,950 + 1,950 + 0.975 + 19.305 + 0)</td><td className="px-4 py-2">70.02</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            Payout order: 1,950.975 USDC to the flash source, 19.305 USDC to the fee recipient, 0 to Bob, and 70.02 USDC to K1, which is at least minPayout. USDC is conserved: 1,950 + 2,040.30 = 3,990.30 in, and 1,950 + 1,950.975 + 19.305 + 0 + 70.02 out. No GHO moves at any point.
          </p>
          <p className="mb-4 type-doc-body">
            Events include FlashLoanServed, FlashLoanUsed, SeizedUnitsBurned, RecordDebited, SeizureSettled, UnitsUnwound and LiquidationSettled. A payout that fails to deliver goes to the payout escrow.
          </p>
        </section>

        <section id="payout-variants" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Surplus and PayoutTooLow Variants</h2>
          <p className="mb-4 type-doc-body">
            Same liquidation as above, with different route results. The oracle gain G stays 96.525 USDC, so Avana&apos;s fee stays 19.305 USDC while the realized surplus covers it.
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Routes return R</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Y</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">A</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Kr</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">B</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">2,052</td>
                  <td className="px-4 py-2">101.025</td>
                  <td className="px-4 py-2">19.305</td>
                  <td className="px-4 py-2">77.22</td>
                  <td className="px-4 py-2">4.5</td>
                  <td className="px-4 py-2">Recovery beat the oracle value: 4.5 USDC goes to Bob&apos;s wallet and K1 receives 77.22 USDC.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">2,027</td>
                  <td className="px-4 py-2">76.025</td>
                  <td className="px-4 py-2">19.305</td>
                  <td className="px-4 py-2">56.72</td>
                  <td className="px-4 py-2">0</td>
                  <td className="px-4 py-2">A caller that sandwiched its own routes down to just above the floor still pays the full fee. Its reward falls to 56.72 USDC, so it settles only with a minPayout at or below that.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">2,035</td>
                  <td className="px-4 py-2">84.025</td>
                  <td className="px-4 py-2">19.305</td>
                  <td className="px-4 py-2">64.72</td>
                  <td className="px-4 py-2">0</td>
                  <td className="px-4 py-2">keeperOut is 64.72 USDC, below minPayout of 69, so the call reverts with PayoutTooLow.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            PayoutTooLow only adds a revert. It changes no amount, route or recipient, and the floor is still computed from oracle prices alone.
          </p>
        </section>

        <section id="slipstream-base" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Slipstream on Base</h2>
          <p className="mb-4 type-doc-body">
            Market 3 is a USDC/USDT Aerodrome Slipstream market (tick spacing 1, exact range, unstaked position) on the Aerodrome Slipstream Stable CDP Spoke of the Base Stable LP Hub, priced at $2.00 per vault token. Carol owes 20,000 USDC. Aave&apos;s bonus is 2%. The FLASH_BORROWER role is pending on Base, so the Base Pool charges 5 bps against Base&apos;s maxFlashFeeBps of 10.
          </p>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>The Base sequencer restarts at 10:00:00. At 10:20:00 Carol&apos;s health factor is 0.9997. A keeper call reverts with SequencerGrace, because 0.9997 is not below the grace threshold of 0.95. The USDC/USD feed last published 21 hours earlier (75,600 s, within 88,200 s), so the price is fresh. An account at a health factor of 0.93 is liquidated at 10:20.</li>
            <li>At 11:00:02, the first 2 s Base block after the 3,600 s grace period, keeper K2 calls the Lens preview (a repayment of 2,000 USDC) and then liquidate with debtToCover 2,000 USDC, keeperFunds 0, flashAmount 2,000 USDC, PrimaryThenBackup, a deadline 120 s (60 Base blocks) ahead, minPayout 25 USDC and maxShortfall 0.</li>
            <li>The flash source can lend well above 2,000 USDC. The premium is 1 USDC, and 1,000,000 × 10,000 = 10,000,000,000 is at most 10 × 2,000,000,000.</li>
            <li>Aave repays D = 2,000 USDC and seizes c = 2,000 × 1.02 / 2.00 = 1,020 vault tokens. The Slipstream LP Vault checks the pool lock through Slipstream&apos;s own slot layout, then unwinds about 1,020 USDC and 1,020 USDT.</li>
            <li>Floor: costsBps = 5 and s = min(100, ⌊10,000 × 195 / 10,200⌋) = 100. V = 2,040 USDC and φD = 1 USDC. The floor is 2,019.6 − 0.000002 − 1 = 2,018.599998 USDC. The USDT route returns 1,018.50 USDC, so R = 2,038.50 USDC.</li>
          </ol>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Waterfall</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Calculation</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">USDC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Y</td><td className="px-4 py-2">2,038.5 − 2,000 − 1</td><td className="px-4 py-2">37.5</td></tr>
                <tr><td className="px-4 py-2">G</td><td className="px-4 py-2">2,040 − 2,000 − 1</td><td className="px-4 py-2">39</td></tr>
                <tr><td className="px-4 py-2">A</td><td className="px-4 py-2">min(⌊39 × 0.2⌋, 37.5)</td><td className="px-4 py-2">7.8</td></tr>
                <tr><td className="px-4 py-2">Kr</td><td className="px-4 py-2">min(29.7, 31.2)</td><td className="px-4 py-2">29.7</td></tr>
                <tr><td className="px-4 py-2">B</td><td className="px-4 py-2">Y − A − Kr</td><td className="px-4 py-2">0</td></tr>
                <tr><td className="px-4 py-2">keeperOut</td><td className="px-4 py-2">(0 + 2,000 + 2,038.5) − (2,000 + 2,000 + 1 + 7.8 + 0)</td><td className="px-4 py-2">29.7</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            The Pool pulls 2,001 USDC. Conservation: 4,038.5 in equals 2,000 + 2,001 + 7.8 + 29.7 out. If the fee recipient were blocklisted by USDC&apos;s issuer, the 7.8 USDC would go to the payout escrow and be claimed later with claim.
          </p>
        </section>

        <section id="core-math" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Core Math: Fee, Reward and Surplus</h2>
          <p className="mb-4 type-doc-body">
            Market 1 is a USDC/USDT 0.01% Uniswap v3 market with an exact range on the Uniswap v3 Stable CDP Spoke of the Ethereum Stable LP Hub. The vault token has 6 decimals and is priced at $2.00. The debt reserve is USDC at $1.00 with a 1 USDC floor rounding allowance, a 100 bps slippage allowance and Avana&apos;s 20% share. Avana holds FLASH_BORROWER on the Ethereum Core Pool, so the premium is 0. Aave&apos;s bonus is 10,200 bps with a liquidation fee of 0.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>The keeper flash-borrows 9,800 USDC with keeperFunds 0.</li>
            <li>Aave repays D = 9,800 USDC and seizes 9,800 × 1.02 / 2.00 = 4,998 vault tokens.</li>
            <li>The pool sits at tick 3 and the oracle at tick 2. No spot check applies; the unwound tokens are worth at least V at oracle prices.</li>
            <li>Floor: s = 100 bps, V = 9,996 USDC, U = 2 base units, floor 9,895.039998 USDC.</li>
            <li>The LP Vault returns about 4,998 USDC and 4,998 USDT. The USDC leg needs no swap. The USDT route returns 4,952 USDC, above its leg minimum of 4,946.030395 USDC. R = 9,950 USDC.</li>
          </ul>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Case</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">R</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Y</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">A</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Kr</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">B</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">keeperOut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Base case</td><td className="px-4 py-2">9,950</td><td className="px-4 py-2">150</td><td className="px-4 py-2">39.2</td><td className="px-4 py-2">110.8</td><td className="px-4 py-2">0</td><td className="px-4 py-2">110.8</td></tr>
                <tr><td className="px-4 py-2">Routes beat the oracle</td><td className="px-4 py-2">10,010</td><td className="px-4 py-2">210</td><td className="px-4 py-2">39.2</td><td className="px-4 py-2">156.8</td><td className="px-4 py-2">14</td><td className="px-4 py-2">156.8</td></tr>
                <tr><td className="px-4 py-2">Weaker routes</td><td className="px-4 py-2">9,935</td><td className="px-4 py-2">135</td><td className="px-4 py-2">39.2</td><td className="px-4 py-2">95.8</td><td className="px-4 py-2">0</td><td className="px-4 py-2">95.8</td></tr>
              </tbody>
            </table>
          </div>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Base case: the oracle gain is 9,996 − 9,800 = 196 USDC, so A = min(⌊196 × 0.2⌋, 150) = 39.2 and Kr = min(110.8, 156.8) = 110.8. keeperOut = (0 + 9,800 + 9,950) − (9,800 + 9,800 + 0 + 39.2 + 0) = 110.8. Conservation: 19,750 in equals 9,800 + 9,800 + 39.2 + 110.8 out.</li>
            <li>Routes beat the oracle: Kr is capped at the oracle gain after the fee, 156.8, and the remaining 14 USDC goes to the borrower&apos;s wallet. If the wallet is on USDC&apos;s blocklist, the 14 USDC goes to the payout escrow credited to the wallet.</li>
            <li>Weaker routes: with minPayout set to 110 USDC, the call reverts with PayoutTooLow(95,800,000, 110,000,000). A is unchanged at 39.2.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            The same account can be liquidated by any address through the permissionless path, with debtToCover 9,800 USDC, callerFunds 0, flashAmount 9,800 USDC, a deadline 120 s ahead and minPayout 110 USDC. With R = 9,950 USDC the caller receives 110.8 USDC and Avana&apos;s fee is 39.2 USDC.
          </p>
        </section>

        <section id="dust-gap" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Dust Liquidation Gap</h2>
          <p className="mb-4 type-doc-body">
            Same market. The account&apos;s last 0.3978 vault token (397,800 units) is seized for D = 0.78 USDC.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>V = 0.7956 USDC and the slippage term is ⌈795,600 × 0.99⌉ = 787,644 base units.</li>
            <li>The floor is max(0, 787,644 − 2 − 1,000,000) = 0. Without the rounding allowance, the floor of 0.787644 USDC would revert every attempt and the deficit would never be recorded.</li>
            <li>A route returns R = 0.77 USDC. The rounding gap is 0.78 − 0.77 = 0.01 USDC.</li>
          </ul>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Caller settings</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">Flash-funded, maxShortfall 0.02 USDC</td>
                  <td className="px-4 py-2">The caller pays 0.01 USDC through the top-up. R′ = 0.78 USDC, Y = 0 and keeperOut = (0 + 0.78 + 0.78) − (0.78 + 0.78) = 0.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Flash-funded, maxShortfall 0</td>
                  <td className="px-4 py-2">Reverts with InsufficientProceeds: the gap, not the floor, is short. The keeper resubmits with keeperFunds of 0.01 USDC, which closes the gap.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Caller-funded 0.78 USDC, no flash loan</td>
                  <td className="px-4 py-2">The gap is 0, Y = 0 and keeperOut = (0.78 + 0.77) − 0.78 = 0.77 USDC: a 0.01 USDC loss the caller accepts through minPayout.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            In every case the caller pays the rounding gap. No protocol balance is drawn, and any deficit the call records is reported normally.
          </p>
        </section>

        <section id="gho-debt" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">GHO Debt, Call by Call</h2>
          <p className="mb-4 type-doc-body">
            Same market 1. GHO is debt reserve 0, drawn by the CDP Spoke from the Stable LP Hub&apos;s GHO credit line at Aave&apos;s fixed $1 price, with a floor rounding allowance of 1 GHO. The vault-token reserve is reserve 1, with a Collateral Factor of 2,812 bps, a maximum bonus of 10,500, a bonus factor of 4,000, a health factor for the maximum bonus of 0.90 and a target health factor of 1.10. Alice&apos;s proxy P holds 141,232 vault tokens (282,464 USD) and owes 79,452.85 GHO.
          </p>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>A USDT move takes P&apos;s health factor to 282,464 × 0.2812 / 79,452.85 ≈ 0.9997. Keeper K1 calls the Lens preview for P and reserve 0: bonus 10,200, debt to target (1.10 × 79,452.85 − 79,428.88) / (1.10 − 1.02 × 0.2812) ≈ 9,800.2 GHO. The Ethereum Pool&apos;s idle GHO covers 9,800 GHO, so the preview sets flashAmount to 9,800 GHO and keeperFunds to 0.</li>
            <li>K1 calls liquidate for P, market 1 and reserve 0 with debtToCover 9,800 GHO, keeperFunds 0, flashAmount 9,800 GHO, PrimaryThenBackup, a deadline 120 s ahead, minPayout 110 GHO and maxShortfall 0. LPVaultSwap checks the deadline, takes the lock, and checks the keeper, the proxy, the reserve and that 0 + 9,800 ≥ 9,800. It does not read the pause state.</li>
            <li>LPVaultSwap reads the registry, pokes the LP Oracle (Live; USDC/USD and USDT/USD answers 20 hours and 3 hours old, within 88,200 s), finds the sequencer gate open on Ethereum, reads the health factor 0.9997, the bonus 10,200 and a liquidation fee of 0, and confirms the Hub&apos;s shares equal its assets.</li>
            <li>LPVaultSwap calls the flash source for 9,800 GHO. The source checks the GHO reserve is active and flash-enabled, idle GHO covers 9,800 and the premium is 0 (role granted), then calls the Pool&apos;s flashLoan. The Pool sends 9,800 GHO to the source and calls it back; the source forwards 9,800 GHO to LPVaultSwap and calls onFlashLoan, which runs the next five steps.</li>
            <li>Collateralization&apos;s beginSeizure snapshots P&apos;s 141,232,000,000 supplied shares.</li>
            <li>LPVaultSwap approves the Spoke for 9,800 GHO and calls the liquidation for collateral reserve 1, debt reserve 0 and P, with receiveShares false. Aave restores D = 9,800 GHO to the Hub and the Hub transfers 4,998 vault tokens to LPVaultSwap. No deficit.</li>
            <li>The AaveAdapter burns the 4,998 vault tokens. Collateralization checks that the share drop and the supply drop both equal c, debits P&apos;s largest record, and has the Uniswap v3 LP Vault unwind 4,998,000,000 units. The LP Vault collects only the principal, about 4,998 USDC and 4,998 USDT, to LPVaultSwap.</li>
            <li>The floor in GHO is 9,895.0399980002 GHO (U = 0.0000019998 GHO). The USDC→GHO and USDT→GHO primary routes, through fixed DEX pools, return 4,976 and 4,974 GHO: R = 9,950 GHO and the rounding gap is 0.</li>
            <li>onFlashLoan sends 9,800 GHO back to the flash source and returns; the source approves the Pool for 9,800 GHO, which pulls it.</li>
            <li>Waterfall: Y = 150, A = 39.2, Kr = 110.8, B = 0 and keeperOut = 110.8 GHO, at least minPayout. LPVaultSwap sends 39.2 GHO to the fee recipient and 110.8 GHO to K1, emits LiquidationSettled and releases the lock.</li>
          </ol>
          <div className="mb-4 doc-topic type-doc-body">
            After the transaction P holds 136,234 vault tokens (272,468 USD) against 69,652.85 GHO, a health factor of 272,468 × 0.2812 / 69,652.85 = 1.09999. Alice keeps the rest of her position and all of its fees. Had K1 called the Spoke&apos;s liquidation function directly, the Hub&apos;s vault-token transfer to K1 would have reverted with UnauthorizedRecipient.
          </div>
        </section>

        <section id="edge-cases" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Edge Cases</h2>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Case</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">What happens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">Expired market</td>
                  <td className="px-4 py-2">An account in Expired market 7 holding $20,000 of vault tokens and owing 6,400 GHO has a health factor near 0, because Expired collateral counts as almost 0. A call naming market 7 reverts with StalePrice until a fresh price or a standby price route arrives; the keeper then liquidates at the fresh price.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Stale debt price</td>
                  <td className="px-4 py-2">USDC accepted at 0.9999 and Expired, with a 500 bps stress rise, counts at 1.049895 USD. The account can still be liquidated against its GHO debt; a call repaying USDC waits for a fresh USDC price.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Pool moved before the call</td>
                  <td className="px-4 py-2">The pool is pushed to 2 USDT per USDC. The $10,000 position now holds tokens worth $10,606.60 at oracle prices. The liquidation unwinds at that price; each leg must still meet its oracle minimum, and the floor uses V = 10,000.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Third-party liquidation call</td>
                  <td className="px-4 py-2">An attacker holding 1 USDC calls the Spoke&apos;s liquidation directly on an account at a health factor of 0.98. Aave sizes a seizure of 510,000 units, and the Hub&apos;s transfer reverts with UnauthorizedRecipient. The account is unchanged.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">1-wei repayment front-run</td>
                  <td className="px-4 py-2">A 1,950 USDC whole-debt close sized at 2,047.5 USDC still settles after a 1-wei repayment: Aave pulls 1,949.999999 USDC and the caller payout is 1 wei lower.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Dust leg</td>
                  <td className="px-4 py-2">USDC debt at $0.70 and a DAI leg of 0.000007349976535931 DAI at $0.05000016: the leg is worth less than one USDC base unit, so it is sent to the caller unswapped, R = 0, the floor is 0, and a caller-funded call repays the dust debt.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Small account on Base</td>
                  <td className="px-4 py-2">An account owing 40 USDC with one record uses 1,550,000 gas. The keeper&apos;s part of the bonus is 0.54208 USDC, and Avana&apos;s keeper liquidates it whether or not that covers the gas.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Whole-debt close and record cap</td>
                  <td className="px-4 py-2">An account owing 320 USDC whose preview returns a whole-debt close of 336 USDC is liquidated in one call with debtToCover 336 USDC. An account with 16 records uses 5,150,000 gas, still one transaction.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Worked Avana liquidations with full numbers, from Uniswap v3 on Ethereum and Slipstream on Base to fee variants, a dust gap and a GHO-debt walkthrough."
        sectionColor="amber"
      />
    </div>
  ))
}
