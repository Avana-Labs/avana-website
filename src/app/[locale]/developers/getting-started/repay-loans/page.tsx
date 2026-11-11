import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'getting-started/repay-loans', {
    title: "Repay Loans",
    description: "How to repay debt on an Avana account: the repay call, repay-all with a spend cap and refund, interest accrual, repayment by any payer, why no Avana pause can block it, failures and worked examples.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "repay-call", title: "The Repay Call" },
  { id: "repay-all", title: "Repay All with a Spend Cap" },
  { id: "interest", title: "Interest Accrual" },
  { id: "never-blocked", title: "What Can Block a Repay" },
  { id: "third-party", title: "Repayment by Another Payer" },
  { id: "events", title: "Events" },
  { id: "failures", title: "Failures" },
  { id: "worked-example", title: "Worked Examples" },
]

const paramRows = [
  ["borrower", "address", "The wallet whose account is repaid. It need not be the caller."],
  ["marketId", "uint256", "The account's market. With the borrower it names the account."],
  ["debtReserveId", "uint256", "The debt reserve repaid (GHO, USDC, USDT, WETH or another reserve the Spoke lends)."],
  ["maxRepaySpend", "uint256", "The most the payer allows to be pulled in this call, in the asset's base units."],
  ["repayAll", "bool", "True clears the reserve's whole live debt or reverts; false repays up to the cap."],
  ["deadline", "uint256", "Last valid block timestamp, in seconds on both chains."],
]

const stepRows = [
  "Take the protocol lock and check the deadline. The caller becomes the payer.",
  "Resolve the borrower's proxy for the market from the Adapter's own storage.",
  "Read the live debt D of the reserve from the Spoke: drawn debt plus premium, accrued to the block, rounded up. If D is 0, return 0 with no transfer and no event.",
  "Size the pull: a partial repay pulls min(maxRepaySpend, D); a repay-all pulls the whole cap, or reverts before any transfer if D is above it.",
  "Move the funds from the payer straight to the borrower's proxy and measure what arrived.",
  "Have the proxy approve the Spoke for exactly that amount and repay its own account. Aave restores premium first, then drawn debt, and takes at most the debt.",
  "Reset the approval to 0 and refund whatever Aave did not take to the payer, in the same call.",
  "For a repay-all, require the reserve's debt to be 0. If the account is now debt-free on every reserve, mark it debt-free.",
  "Emit Repaid and release the lock.",
]

const blockRows = [
  ["Hub None, Frozen, Paused (General) or Paused (MintPathSuspect)", "Allowed"],
  ["Payer or borrower is a frozen address", "Allowed"],
  ["Any market or debt breaker tripped", "Allowed"],
  ["Base sequencer Down (forced in through L1) or in Grace", "Allowed"],
  ["Any price state, stale feeds, USD-band breach", "Allowed"],
  ["Market Offboarding, liquidation halted, configuration drift, Hub shares not equal to assets", "Allowed"],
  ["Faulty MarketRegistry, RiskModule or ParameterStore", "Allowed: none of them is called"],
  ["Aave vault-token reserve paused or frozen, repaid reserve frozen, drawCap exhausted", "Allowed"],
  ["Repaid debt reserve paused on Aave", "Refused by Aave (ReservePaused)"],
  ["The Hub halts or deactivates the CDP Spoke", "Refused by Aave (SpokeHalted)"],
  ["A broken AaveAdapter implementation", "Refused until fixed by an Adapter upgrade through the chain's Timelock, which every proxy uses at once"],
]

const failureRows = [
  ["RepayExceedsMax", "Repay-all with a live debt above maxRepaySpend. It reverts before any transfer."],
  ["DebtRemaining", "Repay-all left debt in the reserve, for example when a token transfer fee made the received amount smaller than the debt."],
  ["ZeroAmount", "A partial repay with debt outstanding and maxRepaySpend of 0."],
  ["NoProxy", "The borrower has no account in the market."],
  ["DeadlineExpired / LockHeld", "Call bounds."],
  ["UnitsMismatch / BalanceDeltaMismatch", "The proxy received 0 or more than the pulled amount, or its balance did not return to its starting value."],
  ["Token error", "The payer's allowance or balance is below the amount pulled; the token's own error passes through."],
  ["ReservePaused / SpokeNotActive / SpokeHalted", "Aave blocks the repay."],
  ["Unauthorized", "A third party called the Spoke's repay directly for the proxy instead of going through the AaveAdapter."],
]

export default async function RepayLoansPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "getting-started/repay-loans", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Repay Loans"
          description="Repay any amount of one debt reserve, or all of it, through the AaveAdapter. Any address can pay, and no Avana pause, breaker, freeze, price or sequencer state can block it."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            A repay moves the debt asset from the payer to the borrower&apos;s PositionProxy, which repays its own account on the CDP Spoke; Aave returns the asset to the reserve&apos;s funding Hub. The payer is always the caller. Any address can repay any account: the borrower, another wallet of the borrower, a rescue service or the protocol. A payer can never borrow or move collateral, because those calls act only on the caller&apos;s own account.
          </p>
          <p className="mb-4 type-doc-body">
            Each call repays one debt reserve of one account and leaves the account&apos;s other reserves untouched. Avana has no minimum debt, so a partial repay may leave any remainder. A repay changes no vault token, position, record or booked charge.
          </p>
          <div className="doc-topic type-doc-body">
            A borrower can also repay with liquidity from one of their own pledged positions, without bringing funds. That path is described under repay with collateral on the <Link href="/developers/getting-started/manage-loans" className="text-type-accent hover:underline">Manage Loans</Link> page.
          </div>
        </section>

        <section id="repay-call" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">The Repay Call</h2>
          <div className="type-doc-code-block mb-4">
            <code className="type-doc-body text-gray-900">
              {"repay(address borrower, uint256 marketId, uint256 debtReserveId, uint256 maxRepaySpend, bool repayAll, uint256 deadline) returns (uint256 spent)"}
            </code>
          </div>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Parameter</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Type</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paramRows.map((row) => (
                  <tr key={row[0]}>
                    <td className="px-4 py-2"><code className="type-doc-inline-code">{row[0]}</code></td>
                    <td className="px-4 py-2">{row[1]}</td>
                    <td className="px-4 py-2">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            The payer approves the AaveAdapter for the debt asset beforehand; there is no permit path. The call returns the amount Aave took. In order, it does the following:
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            {stepRows.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <p className="mt-4 type-doc-body">
            A token that takes a fee on transfer reduces the repayment instead of blocking it: every step after the pull uses the amount that actually arrived.
          </p>
        </section>

        <section id="repay-all" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Repay All with a Spend Cap</h2>
          <p className="mb-4 type-doc-body">
            Debt keeps accruing between signing and inclusion, so a cap equal to the debt quoted at signing would always fall short. Instead, the app reads a cap quoted to the deadline from the Lens and sets both the approval and maxRepaySpend to it:
          </p>
          <div className="type-doc-code-block mb-4">
            <code className="type-doc-body text-gray-900">
              {"quoteRepayAll(borrower, marketId, debtReserveId, deadline) = ⌈debt × (1 + rate × (deadline − now)) × 1.001⌉"}
            </code>
          </div>
          <p className="mb-4 type-doc-body">
            A repay-all pulls the whole cap, Aave takes the live debt at inclusion, and the proxy refunds the difference to the payer in the same call. The payer never spends more than it signed for, and an approval of exactly the cap ends at 0, so no standing allowance remains. If another payer repays first, the borrower&apos;s own repay-all only pays what is left.
          </p>
          <p className="mb-4 type-doc-body">
            To repay every debt reserve and take a position back in one call, use repayAllAndWithdraw, described in <Link href="/developers/getting-started/withdraw-collateral" className="text-type-accent hover:underline">Withdraw Collateral</Link>.
          </p>
        </section>

        <section id="interest" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Interest Accrual</h2>
          <p className="mb-4 type-doc-body">
            Interest is Aave V4&apos;s and accrues every second: the reserve&apos;s drawn rate on its funding Hub plus the account&apos;s risk premium. The live debt read by a repay is drawn debt plus premium, accrued to the block and rounded up. A repay restores premium first, then drawn debt; when the drawn shares reach 0 the reserve is no longer marked as borrowed.
          </p>
          <p className="mb-4 type-doc-body">
            Avana takes no fee on interest and the repay call charges no fee. Avana Labs charges an app fee in its own app, outside the contracts; calling the contracts directly does not pay it.
          </p>
          <div className="doc-topic type-doc-body">
            Example values: 5,000 USDC borrowed at 6.00% is ⌈5,000,000,000 × (1 + 0.06 × 30 / 365)⌉ = 5,024,657,535 base units (5,024.657535 USDC) after 30 days. 8,000 GHO at 5.00% is 8,032.876712 GHO after 30 days.
          </div>
        </section>

        <section id="never-blocked" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">What Can Block a Repay</h2>
          <p className="mb-4 type-doc-body">
            Repay never reads a pause state, a circuit breaker, the address freeze, the sequencer gate or any other MarketRegistry view, and never calls the RiskModule, an oracle or the ParameterStore. The account binding (Spoke, vault token, reserve) comes from the Adapter&apos;s own storage written when the proxy was created. So no Avana pause, breaker, freeze, price state or registry fault can block a repay; only Aave can.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">State</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Repay with funds</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {blockRows.map((row) => (
                  <tr key={row[0]}>
                    <td className="px-4 py-2">{row[0]}</td>
                    <td className="px-4 py-2">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            The proxy holds no logic and has no upgrade path; it only forwards the Adapter&apos;s calls. Aave&apos;s listing agreement uses a reserve freeze and a drawCap of 0 for containment, which leave repayment open, and keeps reserve pauses and Spoke halts for a faulty Spoke.
          </p>
        </section>

        <section id="third-party" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Repayment by Another Payer</h2>
          <p className="mb-4 type-doc-body">
            Any payer repays through the AaveAdapter with the borrower&apos;s address. The funds are pulled from the payer, never from the borrower, and any refund goes back to the payer. This lets a borrower&apos;s other wallets, a rescue service or the protocol save an account near liquidation, including one whose key is lost.
          </p>
          <p className="mb-4 type-doc-body">
            Calling the Spoke&apos;s repay directly for a proxy fails with Unauthorized, because Aave accepts repayment only from the position owner or an approved position manager, and proxies approve none.
          </p>
          <div className="doc-topic type-doc-body">
            Example values; each market&apos;s parameters are set at listing. On Ethereum, a rescue service R repays 3,000 GHO of wallet W&apos;s market-A account while the Avana Stable LP Hub is Paused with reason MintPathSuspect, a GHO debt breaker is tripped and W is a frozen address. The call reads none of these states: 3,000 GHO are pulled from R, W&apos;s debt falls to 5,032.88 GHO, the event is Repaid with R as payer and W as borrower, and W&apos;s collateral does not move. If W&apos;s own repay-all with a cap of 8,040 GHO lands later in the same block, Aave takes only the remaining 5,032.876712 GHO and W gets 3,007.123288 GHO back.
          </div>
        </section>

        <section id="events" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Events</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>The asset&apos;s Transfer from the payer to the proxy, and the proxy&apos;s approval of the Spoke.</li>
            <li>Hub Restore and Spoke Repay, in Aave&apos;s order.</li>
            <li>The approval reset and, when non-zero, the refund Transfer from the proxy to the payer.</li>
            <li>Collateralization&apos;s DebtFree, only when the account is left with no debt on any reserve.</li>
            <li>
              <code className="type-doc-inline-code">Repaid(payer, borrower, marketId, debtReserveId, spent, debtAfter, repayAll)</code>
            </li>
          </ul>
          <p className="mt-4 type-doc-body">
            A repay at zero debt emits nothing.
          </p>
        </section>

        <section id="failures" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Failures</h2>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Error</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Cause</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {failureRows.map((row) => (
                  <tr key={row[0]}>
                    <td className="px-4 py-2"><code className="type-doc-inline-code">{row[0]}</code></td>
                    <td className="px-4 py-2">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            A repay at zero debt, including debt another payer or a liquidation cleared first, is not a failure: it returns 0 with no token movement.
          </p>
        </section>

        <section id="worked-example" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Worked Examples</h2>
          <div className="doc-topic type-doc-body mb-4">
            Example values; each market&apos;s parameters are set at listing. Carol&apos;s account in market 3 on Base, 30 days after she borrowed 5,000 USDC at 6.00%: live debt 5,024,657,535 base units, HF 6,240 / (5,024.657535 × 0.9999) = 1.2420.
          </div>
          <h3 className="mb-2 type-doc-subsection-title">Repay all</h3>
          <ul className="list-disc space-y-2 ps-5 type-doc-body mb-4">
            <li>The app calls quoteRepayAll(Carol, 3, r_USDC, now + 600): ⌈5,024,657,535 × (1 + 0.06 × 600 / 31,536,000) × 1.001⌉ = 5,029,687,935.</li>
            <li>Carol approves the AaveAdapter for exactly 5,029,687,935 USDC base units and calls repay(Carol, 3, r_USDC, 5,029,687,935, true, now + 600). No pause state, breaker, freeze, price or sequencer gate is read.</li>
            <li>The call is included 4 seconds (2 Base blocks) later, when the live debt is 5,024,657,573.</li>
            <li>The Adapter pulls 5,029,687,935 into Carol&apos;s proxy; Aave takes 5,024,657,573; 5,030,362 is returned to Carol in the same call.</li>
            <li>The account has no debt left, so Collateralization marks it debt-free. Event Repaid(Carol, Carol, 3, r_USDC, 5,024,657,573, 0, true). Carol&apos;s allowance to the Adapter is 0.</li>
            <li>Carol&apos;s $20,000 charge stays booked until she withdraws; her NFTs can now leave through a debt-free withdrawal.</li>
          </ul>
          <h3 className="mb-2 type-doc-subsection-title">Variants</h3>
          <ul className="list-disc space-y-2 ps-5 type-doc-body mb-4">
            <li>A partial repay of 2,000 USDC leaves 3,024,657,535; any remainder is accepted because there is no minimum debt.</li>
            <li>A repay-all with a cap of 5,020,000,000 reverts with RepayExceedsMax(5,024,657,535, 5,020,000,000) before any transfer.</li>
            <li>A repay-all that leaves debt in the reserve reverts with DebtRemaining.</li>
            <li>While the Base sequencer is down, Carol can force the same repay in from L1 and it succeeds.</li>
            <li>On Ethereum, the same quote included 24 seconds (2 blocks) later finds a debt of 5,024,657,765 and refunds 5,030,170.</li>
            <li>A repay after a liquidation already cleared the debt returns 0 with no transfer, approval or event.</li>
          </ul>
          <p className="type-doc-body">
            The third-party example above shows a rescue service repaying while the Hub is paused, a breaker is tripped and the borrower is frozen.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How to repay part or all of a debt reserve on Avana, by any payer, in every Avana pause state."
        sectionColor="emerald"
      />
    </div>
  ))
}
