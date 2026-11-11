import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, "safety/insurance", {
    title: "Avana Umbrella",
    description: "Avana Umbrella, the First-Loss Reserve: one Coverage Spoke per Hub and debt asset, funded by Avana Labs and controlled by the Aave DAO, that eliminates recorded deficits within 72 hours.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "form", title: "Form and Control" },
  { id: "deficits", title: "How a Deficit Arises" },
  { id: "coverage", title: "Covering a Deficit" },
  { id: "sizing", title: "Sizing and the Coverage Rule" },
  { id: "deficit-breaker", title: "Deficit Breaker" },
  { id: "funding", title: "Funding and Withdrawals" },
  { id: "beyond-reserve", title: "Losses Beyond the Reserve" },
  { id: "walkthrough", title: "Walkthrough" },
  { id: "limits", title: "What It Does Not Cover" },
]

export default async function InsuranceFundsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "safety/insurance", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Avana Umbrella"
          description="The First-Loss Reserve: one Coverage Spoke per Hub and debt asset, funded by Avana Labs and controlled by the Aave DAO."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            Avana Umbrella is Avana&apos;s protocol safety module, named after Aave&apos;s Umbrella, whose design inspired it. It is the First-Loss Reserve: one Coverage Spoke per (Hub, debt asset), funded by Avana Labs in that asset and controlled by the Aave DAO. Each one covers the deficits Aave records for approved Avana CDP Spokes in its own asset, on its own Hub, and nothing else.
          </p>
          <p className="mb-4 type-doc-body">
            At launch there are two: GHO on the Ethereum Stable LP Hub and GHO on the Base Stable LP Hub. Every further debt asset enabled on a CDP Spoke, such as USDC, USDT or WETH, gets its own Coverage Spoke, funded to its minimum before any draw cap on that asset rises above 0.
          </p>
          <div className="doc-topic type-doc-body">
            The Coverage Spokes are Avana&apos;s only on-chain loss layer. Avana counts no coverage from committed fee income, from Aave&apos;s own Umbrella or from DAO layers. Collateral limits and liquidation remain the first controls against loss.
          </div>
        </section>

        <section id="form" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Form and Control</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>A Coverage Spoke is a supply-only Spoke registered on its asset of its Hub with a draw cap of 0. Its funds are Hub liquidity of that asset like any other supply, held as shares, and accrue the asset&apos;s supply yield.</li>
            <li>It is not upgradeable and has no owner other than the Aave DAO&apos;s access manager. Avana Labs and Avana contracts hold no role on it. A replacement is a new deployment, funded through the old one&apos;s withdrawal path.</li>
            <li>The Coverage Spokes are the only holders of the Hub&apos;s deficit-eliminator role, and each spends its shares only through the Hub&apos;s deficit elimination on its own asset.</li>
            <li>The Aave DAO sets each one&apos;s allowlist of CDP Spokes, its minimum balance and its withdrawals. A DAO-delegated caller holding the coverage role triggers coverage.</li>
            <li>It holds no tokens between transactions and ignores tokens sent to it directly.</li>
          </ul>
        </section>

        <section id="deficits" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">How a Deficit Arises</h2>
          <p className="mb-4 type-doc-body">
            Each account is one Position Proxy per (wallet, CDP Spoke, market), so it holds exactly one collateral reserve. A deficit arises only when a liquidation through LPVaultSwap empties that reserve while debt remains. Inside the liquidation, the CDP Spoke reports the remaining debt of each debt reserve to that reserve&apos;s funding Hub, in that reserve&apos;s own asset, and the account&apos;s debt in it becomes 0.
          </p>
          <p className="type-doc-body">
            A liquidation that reverts records nothing. The deficit stays counted against the CDP Spoke&apos;s draw cap on that asset until it is eliminated, so it uses draw-cap headroom. Monitoring warns on any non-zero deficit at once and pages if one is still uncovered after 24 hours.
          </p>
        </section>

        <section id="coverage" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Covering a Deficit</h2>
          <p className="mb-4 type-doc-body">
            The coverage caller covers every recorded deficit within <code className="type-doc-inline-code">deficitCoverageWindow</code>, 72 hours from the deficit being recorded. On Base the window includes the delivery time of Aave&apos;s cross-chain governance to the Base executor, so the Base runbook starts the call at the first page.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>The caller calls <code className="type-doc-inline-code">coverDeficit(borrowSpoke, maxAmount)</code> on the Coverage Spoke of the deficit&apos;s Hub and asset.</li>
            <li>The call reverts unless the caller holds the coverage role, the CDP Spoke is on the allowlist and a deficit is recorded.</li>
            <li>The Coverage Spoke calls <code className="type-doc-inline-code">eliminateDeficit</code> on its Hub for its own asset. The Hub burns the matching shares, rounded up so other suppliers&apos; share price does not fall, and reduces the recorded deficit.</li>
            <li>A deficit in two assets takes two calls, one on each asset&apos;s Coverage Spoke. A shortfall in one asset&apos;s reserve is never made up from another asset, Hub or chain.</li>
          </ul>
          <p className="mb-2 type-doc-body">The amount covered in one call:</p>
          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"amount = min(maxAmount, recorded deficit rounded up, fundedBalance())"}</code>
          </div>
          <p className="type-doc-body">
            Coverage never exceeds what the caller asked for, what Aave recorded as lost, or what the reserve holds. It keeps working while the Coverage Spoke or the covered CDP Spoke is halted on the Hub.
          </p>
        </section>

        <section id="sizing" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Sizing and the Coverage Rule</h2>
          <p className="mb-4 type-doc-body">
            The funding ARFC sets each reserve&apos;s coverage ratio and minimum balance with Aave&apos;s risk service providers. The funded balance must cover a fixed share of every draw cap on its (Hub, asset), summed over every CDP Spoke that draws that asset from that Hub:
          </p>
          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"fundedBalance × 10⁴ ≥ coverageRatioBps × Σ drawCap"}</code>
          </div>
          <p className="mb-4 type-doc-body">
            The rule is checked when a debt reserve is enabled and on every draw-cap raise Avana records. A raise that would break it reverts with <code className="type-doc-inline-code">CoverageBelowRatio</code> until more funds are added.
          </p>
          <div className="doc-topic type-doc-body mb-4">
            Example values; the funding ARFC sets the real ones. At an illustrative ratio of 20% (2,000 bps), a 2,000,000 GHO credit line on the Ethereum Stable LP Hub needs at least 400,000 GHO in its Umbrella. Raising one Spoke&apos;s draw cap from 1,200,000 to 1,250,000 GHO, so that the summed caps reach 2,050,000 GHO, needs at least 410,000 GHO; until Avana Labs funds 10,000 GHO more, the raise reverts.
          </div>
          <p className="type-doc-body">
            Beyond the ratio, caps are sized so that each reserve covers two modelled losses per (Hub, debt asset): an incident term over a 48-hour window, which includes a debt-asset price rise, and a tail term for one pool token going to zero. The Lens reports the cap-based tail coverage, and monitoring warns below 150% of the minimum and pages below 100%.
          </p>
        </section>

        <section id="deficit-breaker" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Deficit Breaker</h2>
          <p className="mb-4 type-doc-body">
            When the outstanding deficit of a CDP Spoke&apos;s GHO reserve exceeds <code className="type-doc-inline-code">breakerDeficitMax</code>, 10,000 GHO, the DEFICIT breaker freezes new borrowing on that debt reserve automatically. Other debt assets set their own materiality level at listing. Smaller deficits trip nothing on-chain; every new deficit raises an alert and is covered within 72 hours.
          </p>
          <p className="mb-4 type-doc-body">
            The breaker latches. It stays tripped after coverage until a pause guardian calls <code className="type-doc-inline-code">resetDebtBreaker</code>, or the timelock does at the normal delay, so the root cause is reviewed before borrowing resumes. The reset reverts with <code className="type-doc-inline-code">ConditionStillHolds</code> while the deficit is still above the level.
          </p>
          <p className="type-doc-body">
            A reserve below its minimum raises a monitoring alert and trips no breaker. The Emergency Guardian or the Aave Protocol Guardian decides whether to trip a manual debt breaker or freeze the Hub, and Avana Labs tops the reserve up. Repayment, debt-free withdrawal, liquidation and borrowing of other assets continue throughout.
          </p>
        </section>

        <section id="funding" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Funding and Withdrawals</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Avana Labs funds each reserve to at least its minimum before any draw cap on its (Hub, asset) rises above 0, and tops it back up after any coverage. The funding call moves the asset straight to the Hub and credits it as the Coverage Spoke&apos;s shares; funds added give the funder no claim.</li>
            <li>Avana&apos;s committed fee share counts toward the minimum only once received in that asset through the funding call.</li>
            <li>Pending-settlement proceeds go to the Umbrella. When anyone calls <code className="type-doc-inline-code">settlePending</code> to clear vault tokens left by a seizure that never settled, LPVaultSwap converts the released tokens into the market&apos;s settlement debt asset (GHO at launch) and funds the matching Umbrella with the amount recovered.</li>
            <li>Funds leave only through deficit elimination or a DAO withdrawal: the Aave DAO requests it, and it executes after <code className="type-doc-inline-code">reserveWithdrawalDelay</code>, 14 days, fixed in the contract.</li>
            <li>Before the credit line closes, the DAO approves a withdrawal only if the balance left still meets the minimum. Unused capital returns to Avana Labs only after that (Hub, asset) credit line closes and every allowlisted CDP Spoke has zero debt and zero deficit in that asset.</li>
          </ul>
        </section>

        <section id="beyond-reserve" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Losses Beyond the Reserve</h2>
          <p className="mb-4 type-doc-body">
            A deficit larger than the reserve&apos;s funded balance stays recorded on the funding Hub. The uncovered part is a loss of that Hub asset&apos;s suppliers, pro rata to their shares, including suppliers through the chain&apos;s Lend Spoke.
          </p>
          <p className="mb-4 type-doc-body">
            Aave&apos;s share accounting counts the deficit inside the asset until the loss is realized, so a supplier who withdrew before realization would leave at full value. Avana removes that information advantage. As soon as an uncovered deficit appears, the Emergency Guardian runs playbook P-18:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Every drawing Spoke&apos;s draw cap on that (Hub, asset) is set to 0 through the Aave Guardian.</li>
            <li>Monitoring raises the <code className="type-doc-inline-code">UncoveredDeficit(hub, asset, amount)</code> alarm, which goes to lenders through the app.</li>
            <li>The Lens publishes the uncovered amount and the deficit-adjusted share price, so every lender sees the loss before withdrawing.</li>
            <li>The Aave DAO realizes the uncovered amount against supplier shares. A top-up by Avana Labs or the DAO before realization lets the coverage caller eliminate the remainder instead.</li>
          </ul>
          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"priceAdj = (A − uncovered) / Sh"}</code>
          </div>
          <div className="doc-topic type-doc-body">
            Example values (Ethereum, GHO): the Hub&apos;s GHO has A = 2,000,000 GHO and Sh = 1,950,000 shares. A deficit of 130,000 GHO meets a reserve holding 100,000 GHO, because earlier coverage drew it below its 400,000 GHO minimum. After coverage 30,000 GHO stays uncovered. The Lens shows an adjusted price of (2,000,000 − 100,000 − 30,000) / (1,950,000 − 97,500) ≈ 1.00944 GHO per share, against an unadjusted 1.02564. A lender holding 18,525 shares, 1% of the remaining shares, bears 300 GHO of the loss once it is realized.
          </div>
        </section>

        <section id="walkthrough" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Walkthrough</h2>
          <p className="mb-4 type-doc-body">
            Example values; each market&apos;s parameters are set at listing. Market 1 is the USDC/USDT 0.01% Uniswap v3 market on the Uniswap v3 Stable CDP Spoke of the Ethereum Stable LP Hub, with a collateral factor of 28.12% and a maximum liquidation bonus of 5%. Dan&apos;s proxy holds 20,000 vault tokens at $2.00 ($40,000) and owes 10,000 GHO, a health factor of 1.1248. The GHO Umbrella holds an illustrative 400,000 GHO, its minimum. The Hub&apos;s GHO has A = 2,050,000 GHO and Sh = 2,000,000 shares, and GHO draw caps sum to 2,000,000 GHO.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Step</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">What happens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">1. Collapse</td>
                  <td className="px-4 py-2">USDT collapses within minutes and the LPOracle serves $0.50 per vault token. Dan&apos;s collateral is worth $10,000 and his health factor is 0.2812. USDT leaves the $0.90–$1.02 stablecoin band, so new borrowing and withdrawals that leave debt stop in market 1; the price-drop alert fires. Liquidation continues.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">2. Preview</td>
                  <td className="px-4 py-2">Avana&apos;s keeper previews the liquidation through the Lens: the bonus is the maximum 5%, and the collateral covers only 10,000 / 1.05 = 9,523.81 GHO of debt, so the preview flags a deficit.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">3. Liquidation</td>
                  <td className="px-4 py-2">The keeper calls LPVaultSwap with 10,000 GHO of its own as the amount to cover. Aave seizes all 20,000 vault tokens and restores 9,523.81 GHO. Dan&apos;s only collateral reserve is now empty, so the Spoke reports a deficit of 476.19 GHO. Dan&apos;s debt is 0.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">4. Settlement</td>
                  <td className="px-4 py-2">The unwind and swaps return 9,950 GHO, above the 9,899 GHO minimum. Of the 426.19 GHO realized gain, Avana&apos;s fee is 95.24 GHO (20% of the 476.19 GHO oracle gain) and the keeper&apos;s reward is 330.95 GHO; the borrower surplus is 0. The keeper receives 10,330.95 GHO: its reward plus the 10,000 GHO it funded, of which Aave used 9,523.81 GHO.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">5. Alert</td>
                  <td className="px-4 py-2">Monitoring sees the deficit and warns at once. It is below 10,000 GHO, so the DEFICIT breaker does not trip and GHO borrowing on other markets continues.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">6. Coverage</td>
                  <td className="px-4 py-2">Within 72 hours the coverage caller calls coverDeficit with a limit of 1,000 GHO. The amount is min(1,000, 476.19, 400,000) = 476.19 GHO.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">7. Elimination</td>
                  <td className="px-4 py-2">The Hub burns 464.576 shares from the Coverage Spoke, rounded up, and the Spoke&apos;s deficit is 0.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">8. Below minimum</td>
                  <td className="px-4 py-2">The reserve now holds about 399,523.81 GHO, below its 400,000 GHO minimum. The contract emits ReserveBelowMinimum and monitoring alerts. Repayment, liquidation and debt-free withdrawal run as normal.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">9. Top-up</td>
                  <td className="px-4 py-2">Avana Labs funds 477 GHO and the reserve is back above its minimum.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="limits" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">What It Does Not Cover</h2>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Shortfalls inside a liquidation. A liquidation that cannot reach its recovery floor reverts with nothing changed, or its caller pays the gap through the shortfall top-up. A recovery a few units below the debt repaid, for example from Aave&apos;s dust rule, comes out of the liquidation caller&apos;s own payout, never from the reserve.</li>
            <li>Liquidation gas and the losses of liquidation callers. No Avana contract reimburses them: Avana&apos;s keeper pays its gas and any such loss as an operating cost of Avana, and a caller that borrows through a flash liquidation helper pays the loan premium from its own payout.</li>
            <li>Borrowers&apos; own losses. Borrowers still bear impermanent loss, price risk and liquidation risk; the reserve does not raise borrowing capacity.</li>
            <li>Another asset, Hub or chain. Each chain&apos;s instances are sized against that chain&apos;s caps only.</li>
          </ul>
          <p className="type-doc-body">
            The controls that act before a deficit, and the playbooks that respond to one, are described here:{" "}
            <Link href="/developers/safety/emergency-controls" className="text-type-accent hover:underline">Emergency Controls</Link>.
          </p>
        </section>
      </div>
      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Avana Umbrella: per Hub and debt asset First-Loss Reserve, coverage rule, deficit breaker and losses beyond the reserve."
        sectionColor="rose"
      />
    </div>
  ))
}
