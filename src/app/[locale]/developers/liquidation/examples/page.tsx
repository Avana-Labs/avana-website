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
    description: "Worked Avana liquidations with full numbers: caller funding and the flash liquidation helper, Uniswap v3 on Ethereum, Aerodrome Slipstream on Base with sequencer grace, fee and surplus variants, a dust liquidation and a GHO-debt walkthrough.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "uniswap-ethereum", title: "Uniswap v3 on Ethereum" },
  { id: "payout-variants", title: "Surplus and PayoutTooLow Variants" },
  { id: "slipstream-base", title: "Slipstream on Base" },
  { id: "core-math", title: "Core Math: Fee, Reward and Surplus" },
  { id: "dust-gap", title: "Dust Liquidation Loss" },
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
          description="Worked liquidations with every number: funding, seizure, recovery floor, swaps, payouts and the helper's flash repayment."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <div className="mb-4 doc-topic type-doc-body">
            Example values; each market&apos;s parameters are set at listing.
          </div>
          <p className="mb-4 type-doc-body">
            Each example liquidates one account, which holds one market, against one debt reserve, through LPVaultSwap&apos;s one entry point, liquidate. The caller funds the repayment in the debt asset, from its own balance or through the public flash liquidation helper, which borrows from the chain&apos;s Aave V3 Pool and repays the loan from the caller&apos;s payout. Amounts are in the repaid debt asset. The formulas used here are on the flow page: <Link href="/developers/liquidation/flow" className="text-type-accent hover:underline">Liquidation Flow</Link>.
          </p>
          <p className="mb-4 type-doc-body">
            Common symbols: D is the debt Aave repays, c the vault tokens seized, Kf the caller funding LPVaultSwap receives, V the oracle value of the seizure, R the debt asset recovered, G the oracle gain, Y the realized surplus, A Avana&apos;s fee, Kr the caller reward, B the borrower surplus and keeperOut the caller&apos;s payout, which includes its returned funding. F and φ are a helper&apos;s flash loan and premium; they appear in no formula of LPVaultSwap.
          </p>
          <div className="mb-4 type-doc-code-block">
            <code className="type-doc-body text-gray-900">G = max(0, V − D); Y = max(0, R′ − D); A = min(⌊0.2 × G⌋, Y); Kr = min(Y − A, G − A); B = Y − A − Kr; keeperOut = Kf + R′ − D − A − B</code>
          </div>
        </section>

        <section id="uniswap-ethereum" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Uniswap v3 on Ethereum</h2>
          <p className="mb-4 type-doc-body">
            Bob has a USDC/USDT Uniswap v3 position on the Uniswap v3 Stable CDP Spoke of the Ethereum Stable LP Hub and owes USDC. His health factor is below 1. Avana&apos;s keeper K1 holds no USDC for this call and flash-funds it through the public helper H.
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
                <tr><td className="px-4 py-2">Helper premium</td><td className="px-4 py-2">5 bps: in this example the public helper does not yet hold FLASH_BORROWER on the Ethereum Pool; maxFlashFeeBps is 10</td></tr>
                <tr><td className="px-4 py-2">Application state</td><td className="px-4 py-2">Frozen, which stops new pledges and borrowing but not this liquidation</td></tr>
              </tbody>
            </table>
          </div>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>K1 calls the Lens preview, which returns a repayment of 1,950 USDC and a payout of 2,020.8 USDC, a net 70.8 USDC.</li>
            <li>Through private order flow, K1 calls the helper&apos;s flashLiquidate with params of debtToCover 1,950 USDC, PrimaryThenBackup, a deadline 120 s ahead, minPayout 2,019 USDC (the funding plus a net 69 USDC, more than 1% below the previewed net 70.8) and maxShortfall 0, a flash amount of 1,950 USDC, maxPremium 0.975 USDC and a top-up bound of 0.</li>
            <li>Flash: the Pool&apos;s idle USDC covers 1,950 USDC. The premium is 1,950 × 5 / 10,000 = 0.975 USDC, within maxPremium, and within the cap because 975,000 × 10,000 = 9,750,000,000 is at most 10 × 1,950,000,000. H&apos;s callback checks pass; it approves LPVaultSwap for 1,950 USDC and calls liquidate.</li>
            <li>LPVaultSwap checks the deadline, takes the lock, checks that H is not frozen, confirms the health factor is below 1, and pokes the LP Oracle and the USDC DebtOracle, which is Live. There is no keeper check, and it does not read the pause state.</li>
            <li>LPVaultSwap pulls Kf = 1,950 USDC from H. Aave repays D = 1,950 USDC and seizes c = 1,950 × 1.05 / 2.10 = 975 vault tokens, sent to LPVaultSwap.</li>
            <li>The AaveAdapter burns them and the LP Vault unwinds their principal. The USDC leg enters R directly (1,030.25 USDC), and the USDT leg&apos;s primary route returns 1,010.05 USDC at or above its per-leg minimum. R = 2,040.30 USDC.</li>
            <li>Floor: V = 975 × 2.10 = 2,047.5 USDC. The slippage term is ⌈2,047.5 × 0.99⌉ = 2,027.025 USDC, U = 2 base units, so the floor is 2,027.025 − 0.000002 − 1 = 2,026.024998 USDC. R is above it, so no shortfall is pulled.</li>
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
                <tr><td className="px-4 py-2">Realized surplus Y</td><td className="px-4 py-2">2,040.30 − 1,950</td><td className="px-4 py-2">90.3</td></tr>
                <tr><td className="px-4 py-2">Oracle gain G</td><td className="px-4 py-2">2,047.5 − 1,950</td><td className="px-4 py-2">97.5</td></tr>
                <tr><td className="px-4 py-2">Avana fee A</td><td className="px-4 py-2">min(⌊97.5 × 0.2⌋, 90.3)</td><td className="px-4 py-2">19.5</td></tr>
                <tr><td className="px-4 py-2">Caller reward Kr</td><td className="px-4 py-2">min(90.3, 97.5) − 19.5</td><td className="px-4 py-2">70.8</td></tr>
                <tr><td className="px-4 py-2">Borrower surplus B</td><td className="px-4 py-2">Y − A − Kr</td><td className="px-4 py-2">0</td></tr>
                <tr><td className="px-4 py-2">keeperOut to H</td><td className="px-4 py-2">1,950 + 2,040.30 − 1,950 − 19.5 − 0</td><td className="px-4 py-2">2,020.8</td></tr>
                <tr><td className="px-4 py-2">H repays the Pool</td><td className="px-4 py-2">1,950 + 0.975</td><td className="px-4 py-2">1,950.975</td></tr>
                <tr><td className="px-4 py-2">H pays K1</td><td className="px-4 py-2">2,020.8 − 1,950.975 (Kr − φ)</td><td className="px-4 py-2">69.825</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            Payout order at LPVaultSwap: 19.5 USDC to the fee recipient, 0 to Bob, and 2,020.8 USDC to H, at least minPayout. USDC is conserved at LPVaultSwap: 1,950 + 2,040.30 = 3,990.30 in, and 1,950 + 19.5 + 0 + 2,020.8 out. H repays the Pool, and only after the loan closes pays K1. The premium comes out of K1&apos;s share, never out of Avana&apos;s fee or the borrower surplus. No GHO moves at any point.
          </p>
          <p className="mb-4 type-doc-body">
            Events include the Pool&apos;s FlashLoan, LiquidationCall, SeizedUnitsBurned, RecordDebited, SeizureSettled, UnitsUnwound, LiquidationSettled and the helper&apos;s FlashLiquidated. A failed delivery of the fee or the borrower surplus goes to the payout escrow; the payout to H is paid directly or the call reverts.
          </p>
        </section>

        <section id="payout-variants" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Surplus and PayoutTooLow Variants</h2>
          <p className="mb-4 type-doc-body">
            Same liquidation as above, with different route results. The oracle gain G stays 97.5 USDC, so Avana&apos;s fee stays 19.5 USDC while the realized surplus covers it.
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
                  <td className="px-4 py-2">102</td>
                  <td className="px-4 py-2">19.5</td>
                  <td className="px-4 py-2">78</td>
                  <td className="px-4 py-2">4.5</td>
                  <td className="px-4 py-2">Recovery beat the oracle value: 4.5 USDC goes to Bob&apos;s wallet and keeperOut is 2,028 USDC.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">2,027</td>
                  <td className="px-4 py-2">77</td>
                  <td className="px-4 py-2">19.5</td>
                  <td className="px-4 py-2">57.5</td>
                  <td className="px-4 py-2">0</td>
                  <td className="px-4 py-2">A caller that sandwiched its own routes down to just above the floor still pays the full fee; 20% of the realized surplus would have been only 15.4 USDC. keeperOut falls to 2,007.5 USDC, so the call settles only with a minPayout at or below that.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">2,035</td>
                  <td className="px-4 py-2">85</td>
                  <td className="px-4 py-2">19.5</td>
                  <td className="px-4 py-2">65.5</td>
                  <td className="px-4 py-2">0</td>
                  <td className="px-4 py-2">keeperOut is 1,950 + 65.5 = 2,015.5 USDC, below minPayout of 2,019, so the call reverts with PayoutTooLow.</td>
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
            Market 3 is a USDC/USDT Aerodrome Slipstream market (tick spacing 1, exact range, unstaked position) on the Aerodrome Slipstream Stable CDP Spoke of the Base Stable LP Hub, priced at $2.00 per vault token. Carol owes 20,000 USDC. Aave&apos;s bonus is 2%. The public helper&apos;s FLASH_BORROWER role on the Base Pool is still pending, so its loan carries the Base Pool&apos;s 5 bps premium, within Base&apos;s maxFlashFeeBps of 10, and the premium comes out of the keeper&apos;s share.
          </p>
          <p className="mb-4 type-doc-body">
            The example uses a USDC debt reserve to show settlement in a debt asset other than GHO. At launch GHO is the only debt reserve on each CDP Spoke.
          </p>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>The Base sequencer restarts at 10:00:00. At 10:20:00 Carol&apos;s health factor is 0.9997. A keeper call reverts with SequencerGrace, because 0.9997 is not below the grace threshold of 0.95. The USDC/USD feed last published 21 hours earlier (75,600 s, within 88,200 s), so the price is fresh. An account at a health factor of 0.93 is liquidated at 10:20.</li>
            <li>At 11:00:02, the first 2 s Base block after the 3,600 s grace window, keeper K2 calls the public helper with params of debtToCover 2,000 USDC, PrimaryThenBackup, a deadline 120 s (60 Base blocks) ahead, minPayout 2,025 USDC and maxShortfall 0, a flash amount of 2,000 USDC and maxPremium 1 USDC.</li>
            <li>The Base Pool&apos;s idle USDC is well above 2,000 USDC. The loan arrives with a premium of 1 USDC, within maxPremium, and 1,000,000 × 10,000 = 10,000,000,000 is at most 10 × 2,000,000,000. The helper calls liquidate, and LPVaultSwap pulls Kf = 2,000 USDC from it.</li>
            <li>Aave repays D = 2,000 USDC and seizes c = 2,000 × 1.02 / 2.00 = 1,020 vault tokens. The Slipstream LP Vault checks the pool lock through Slipstream&apos;s own slot layout, then unwinds about 1,020 USDC and 1,020 USDT.</li>
            <li>Floor: s = min(100, ⌊10,000 × 200 / 10,200⌋) = 100 and V = 2,040 USDC. The floor is 2,019.6 − 0.000002 − 1 = 2,018.599998 USDC. The USDT route returns 1,018.50 USDC, so R = 2,038.50 USDC.</li>
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
                <tr><td className="px-4 py-2">Y</td><td className="px-4 py-2">2,038.5 − 2,000</td><td className="px-4 py-2">38.5</td></tr>
                <tr><td className="px-4 py-2">G</td><td className="px-4 py-2">2,040 − 2,000</td><td className="px-4 py-2">40</td></tr>
                <tr><td className="px-4 py-2">A</td><td className="px-4 py-2">min(⌊40 × 0.2⌋, 38.5)</td><td className="px-4 py-2">8</td></tr>
                <tr><td className="px-4 py-2">Kr</td><td className="px-4 py-2">min(38.5, 40) − 8</td><td className="px-4 py-2">30.5</td></tr>
                <tr><td className="px-4 py-2">B</td><td className="px-4 py-2">Y − A − Kr</td><td className="px-4 py-2">0</td></tr>
                <tr><td className="px-4 py-2">keeperOut to the helper</td><td className="px-4 py-2">2,000 + 2,038.5 − 2,000 − 8 − 0</td><td className="px-4 py-2">2,030.5</td></tr>
                <tr><td className="px-4 py-2">Helper repays the Pool</td><td className="px-4 py-2">2,000 + 1</td><td className="px-4 py-2">2,001</td></tr>
                <tr><td className="px-4 py-2">Helper pays K2</td><td className="px-4 py-2">2,030.5 − 2,001</td><td className="px-4 py-2">29.5</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            Conservation at LPVaultSwap: 4,038.5 in (Kf + R) equals 2,000 + 8 + 2,030.5 out (D + A + keeperOut). The premium is no longer deducted from the oracle gain, so Avana&apos;s fee is 20% of the full 40 USDC gain and the premium falls wholly on the caller. If the fee recipient were blocklisted by USDC&apos;s issuer, the 8 USDC would go to the payout escrow and be claimed later with claim.
          </p>
        </section>

        <section id="core-math" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Core Math: Fee, Reward and Surplus</h2>
          <p className="mb-4 type-doc-body">
            Market 1 is a USDC/USDT 0.01% Uniswap v3 market with an exact range on the Uniswap v3 Stable CDP Spoke of the Ethereum Stable LP Hub. The vault token has 6 decimals and is priced at $2.00. The debt reserve is USDC at $1.00 with a 1 USDC floor rounding allowance, a 100 bps slippage allowance and Avana&apos;s 20% share. Aave&apos;s bonus is 10,200 bps with a liquidation fee of 0. The caller funds from its own balance: it sets debtToCover to 9,800 USDC and LPVaultSwap receives Kf = 9,800 USDC.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
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
                <tr><td className="px-4 py-2">Base case</td><td className="px-4 py-2">9,950</td><td className="px-4 py-2">150</td><td className="px-4 py-2">39.2</td><td className="px-4 py-2">110.8</td><td className="px-4 py-2">0</td><td className="px-4 py-2">9,910.8</td></tr>
                <tr><td className="px-4 py-2">Routes beat the oracle</td><td className="px-4 py-2">10,010</td><td className="px-4 py-2">210</td><td className="px-4 py-2">39.2</td><td className="px-4 py-2">156.8</td><td className="px-4 py-2">14</td><td className="px-4 py-2">9,956.8</td></tr>
                <tr><td className="px-4 py-2">Weaker routes</td><td className="px-4 py-2">9,935</td><td className="px-4 py-2">135</td><td className="px-4 py-2">39.2</td><td className="px-4 py-2">95.8</td><td className="px-4 py-2">0</td><td className="px-4 py-2">9,895.8</td></tr>
              </tbody>
            </table>
          </div>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Base case: the oracle gain is 9,996 − 9,800 = 196 USDC, so A = min(⌊196 × 0.2⌋, 150) = 39.2 and Kr = min(110.8, 156.8) = 110.8. keeperOut = 9,800 + 9,950 − 9,800 − 39.2 − 0 = 9,910.8: the 9,800 funded plus 110.8. Conservation: 19,750 in equals 9,800 + 39.2 + 9,910.8 out.</li>
            <li>Routes beat the oracle: Kr is capped at the oracle gain after the fee, 156.8, and the remaining 14 USDC goes to the borrower&apos;s wallet. If the wallet is on USDC&apos;s blocklist, the 14 USDC goes to the payout escrow credited to the wallet.</li>
            <li>Weaker routes: with minPayout set to 9,909 USDC (the 9,800 funded plus a net 109), the call reverts with PayoutTooLow(9,895,800,000, 9,909,000,000). A is unchanged at 39.2.</li>
            <li>Through the public helper with a 9,800 USDC loan and a premium of 0 (the helper holds FLASH_BORROWER on the Ethereum Core Pool in this example): the helper receives 9,910.8 USDC, repays the Pool 9,800 USDC and pays its caller 110.8 USDC.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            Any address can liquidate the same account. An address with no registration, holding 9,800 USDC, calls liquidate with debtToCover 9,800 USDC, routeMode BackupOnly, a deadline 120 s ahead and minPayout 9,909 USDC. The backup route returns the same 4,952 USDC for the USDT leg, so R = 9,950 USDC, Avana&apos;s fee of 39.2 USDC goes to the fee recipient, and the caller receives keeperOut = 9,910.8 USDC, a net 110.8 USDC.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Bonus cap binds: the same seizure in a market listed with a 300 bps slippage allowance gives s = min(300, 196) = 196. The slippage term is 9,800.0784 USDC and the floor 9,799.078398 USDC, below D = 9,800 USDC. Routes returning exactly the floor give Y = 0 and A = 0 although G = 196 USDC, and the caller&apos;s payout is Kf − 0.921602 USDC. In such a market Avana&apos;s fee is best-effort; the floor still protects the debt repaid and the borrower.
          </div>
        </section>

        <section id="dust-gap" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Dust Liquidation Loss</h2>
          <p className="mb-4 type-doc-body">
            Same market. The account&apos;s last 0.3978 vault token (397,800 units) is seized for D = 0.78 USDC.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>V = 0.7956 USDC and the slippage term is ⌈795,600 × 0.99⌉ = 787,644 base units.</li>
            <li>The floor is max(0, 787,644 − 2 − 1,000,000) = 0. Without the rounding allowance, the floor of 0.787644 USDC would revert every attempt and the deficit would never be recorded.</li>
            <li>A route returns R = 0.77 USDC, 0.01 USDC below the debt repaid.</li>
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
                  <td className="px-4 py-2">Own funds, Kf of 0.78 USDC</td>
                  <td className="px-4 py-2">The shortfall is 0 and Y = A = Kr = B = 0. keeperOut = 0.78 + 0.77 − 0.78 = 0.77 USDC: a 0.01 USDC loss the caller accepts with a minPayout at or below 0.77 USDC.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Public helper, loan 0.78 USDC, premium 0, top-up bound 0.02 USDC</td>
                  <td className="px-4 py-2">LPVaultSwap pays the helper 0.77 USDC. The helper pulls 0.01 USDC from its caller, repays the Pool 0.78 USDC and pays its caller 0. The caller&apos;s net result is −0.01 USDC.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Public helper, top-up bound 0</td>
                  <td className="px-4 py-2">The helper reverts with TopUpExceeded and the whole liquidation reverts. The caller resubmits from its own funds.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            With a 5 bps premium the helper needs a little more. A dust liquidation funded with 3 USDC that recovers 2.95 USDC leaves a self-funded caller keeperOut = 2.95 USDC, a 0.05 USDC loss. Borrowed whole through the helper at 5 bps, the helper owes 3.0015 USDC, so it pulls a top-up of 0.0515 USDC, allowed with a top-up bound of at least that.
          </p>
          <p className="mb-4 type-doc-body">
            In every case the caller bears the rounding loss. No protocol balance is drawn, and any deficit the call records is reported normally.
          </p>
        </section>

        <section id="gho-debt" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">GHO Debt, Call by Call</h2>
          <p className="mb-4 type-doc-body">
            Same market 1. GHO is debt reserve 0, drawn by the CDP Spoke from the Stable LP Hub&apos;s GHO credit line at Aave&apos;s fixed $1 price, with a floor rounding allowance of 1 GHO. The vault-token reserve is reserve 1, with a Collateral Factor of 2,812 bps, a maximum bonus of 10,500, a bonus factor of 4,000, a health factor for the maximum bonus of 0.90 and a target health factor of 1.10. Alice&apos;s proxy P holds 141,232 vault tokens (282,464 USD) and owes 79,452.85 GHO. The public helper H holds FLASH_BORROWER on the Ethereum Core Pool in this example.
          </p>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>A USDT move takes P&apos;s health factor to 282,464 × 0.2812 / 79,452.85 ≈ 0.9997. Avana&apos;s keeper K1 calls the Lens preview for P and reserve 0 with a deadline 120 s ahead: bonus 10,200, debt to target (1.10 × 79,452.85 − 79,428.88) / (1.10 − 1.02 × 0.2812) ≈ 9,800.2 GHO, so debtToCover is 9,800 GHO, and a previewed payout of 9,910.8 GHO. The Pool&apos;s idle GHO covers 9,800 GHO, so K1 flash-funds the whole amount through H.</li>
            <li>K1 calls H with params for P, market 1 and reserve 0: debtToCover 9,800 GHO, PrimaryThenBackup, a deadline 120 s ahead, minPayout 9,909 GHO and maxShortfall 0, with a flash amount of 9,800 GHO, maxPremium 0 and a top-up bound of 0. H records its single-use context and calls the Pool&apos;s flashLoan for 9,800 GHO. The Pool sends 9,800 GHO to H and calls its executeOperation. H checks the Pool, the initiator, the asset, the amount, the premium of 0 and the context, approves LPVaultSwap for 9,800 GHO and calls liquidate.</li>
            <li>LPVaultSwap checks the deadline, takes the lock, and checks that H is not frozen, that 9,800 GHO is above 0, that P is a valid proxy of market 1&apos;s vault token and that reserve 0 is enabled. There is no keeper check, and it does not read the pause state.</li>
            <li>LPVaultSwap reads the registry, pokes the LP Oracle (Live; USDC/USD and USDT/USD answers 20 hours and 3 hours old, within 88,200 s), finds the sequencer gate open on Ethereum, reads the health factor 0.9997, the bonus 10,200 and a liquidation fee of 0, and confirms the Hub&apos;s shares equal its assets.</li>
            <li>LPVaultSwap pulls 9,800 GHO from H; its balance rises by Kf = 9,800 GHO.</li>
            <li>Collateralization&apos;s beginSeizure snapshots P&apos;s 141,232,000,000 supplied shares.</li>
            <li>LPVaultSwap approves the Spoke for 9,800 GHO and calls the liquidation for collateral reserve 1, debt reserve 0 and P, with receiveShares false. Aave restores D = 9,800 GHO to the Hub and the Hub transfers 4,998 vault tokens to LPVaultSwap, which the transfer rule accepts. No deficit.</li>
            <li>The AaveAdapter burns exactly the 4,998 seized vault tokens. Collateralization checks that the share drop and the supply drop both equal c, debits P&apos;s largest record, and has the Uniswap v3 LP Vault unwind 4,998,000,000 units. The LP Vault collects only the principal, about 4,998 USDC and 4,998 USDT, to LPVaultSwap.</li>
            <li>The floor in GHO is 9,895.0399980002 GHO (U = 0.0000019998 GHO). The USDC→GHO and USDT→GHO primary routes, through fixed DEX pools, return 4,976 and 4,974 GHO: R = 9,950 GHO.</li>
            <li>Waterfall: G = 196, Y = 150, A = 39.2, Kr = 110.8, B = 0 and keeperOut = 9,800 + 9,950 − 9,800 − 39.2 = 9,910.8 GHO, at least minPayout. LPVaultSwap sends 39.2 GHO to the fee recipient and 9,910.8 GHO to H, paid directly or the call reverts, emits LiquidationSettled, releases the lock and returns.</li>
            <li>H measures keeperOut = 9,910.8 GHO, at least the 9,800 GHO it owes (no premium), approves the Pool for 9,800 GHO and returns; the Pool pulls 9,800 GHO. After flashLoan returns, H sends 110.8 GHO to K1.</li>
          </ol>
          <div className="mb-4 doc-topic type-doc-body">
            After the transaction P holds 136,234 vault tokens (272,468 USD) against 69,652.85 GHO, a health factor of 272,468 × 0.2812 / 69,652.85 = 1.09999. Alice keeps about 96.5% of her position and all of its fees. Had K1 called the Spoke&apos;s liquidation function directly, the Hub&apos;s vault-token transfer to K1 would have reverted with UnauthorizedTransfer.
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
                  <td className="px-4 py-2">An attacker holding 1 USDC calls the Spoke&apos;s liquidation directly on an account at a health factor of 0.98. Aave sizes a seizure of 510,000 units, and the Hub&apos;s transfer reverts with UnauthorizedTransfer. The account is unchanged.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">1-wei repayment front-run</td>
                  <td className="px-4 py-2">A 1,950 USDC whole-debt close sized at 2,047.5 USDC still settles after a 1-wei repayment: Aave pulls 1,949.999999 USDC, and the 97.500001 USDC it did not pull returns to the caller inside keeperOut.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Oversized helper loan</td>
                  <td className="px-4 py-2">The 2,047.5 USDC margin borrowed whole through the public helper at 5 bps carries a 1.02375 USDC premium. LPVaultSwap pays the helper 2,118.3 USDC; the helper repays 2,048.52375 USDC and pays its caller 69.77625 USDC. The premium on the unused 97.5 USDC, 0.04875 USDC, falls on the caller alone.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Pool short for the helper</td>
                  <td className="px-4 py-2">The Base V3 Pool holds about 0.13M idle GHO. The public helper refuses a 400,000 GHO loan before any state change, and Avana&apos;s keeper repeats the liquidation by calling liquidate directly with 400,000 GHO of its own.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Dust leg</td>
                  <td className="px-4 py-2">USDC debt at $0.70 and a DAI leg of 0.000007349976535931 DAI at $0.05000016: the leg is worth less than one USDC base unit, so it is sent to the caller unswapped, R = 0, the floor is 0, and a caller-funded call repays the dust debt.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Small account on Base</td>
                  <td className="px-4 py-2">An account owing 40 USDC with one record uses 1,550,000 gas. The keeper&apos;s reward is 0.6776 − 0.16 = 0.5176 USDC, and Avana&apos;s keeper liquidates it whether or not that covers the gas.</td>
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
        pageSummary="Worked Avana liquidations with full numbers, from helper-funded calls on Uniswap v3 and Slipstream to fee variants, a dust liquidation and a GHO-debt walkthrough."
        sectionColor="amber"
      />
    </div>
  ))
}
