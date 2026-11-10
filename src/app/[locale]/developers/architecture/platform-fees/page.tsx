import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'architecture/platform-fees', {
    title: "Platform Fees",
    description: "Avana's only on-chain revenue is 20% of the oracle gain on each liquidation, capped by the realized surplus. There is no fee on borrow interest, on repay with collateral or on LP fees.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "liquidation-fee", title: "Avana Liquidation Fee" },
  { id: "payout-split", title: "Payout Split" },
  { id: "example", title: "Worked Example" },
  { id: "no-fee", title: "Where No Fee Applies" },
  { id: "app-fee", title: "App Fee" },
  { id: "aave-fees", title: "Aave Fees and Costs" },
  { id: "reporting", title: "Reporting" },
]

export default async function PlatformFeesPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "architecture/platform-fees", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Platform Fees"
          description="What Avana earns, what it never takes, and the fees that belong to Aave."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            Avana&apos;s only on-chain revenue is a share of each routed liquidation&apos;s gain, paid in the debt asset that was repaid. All borrow interest accrues to the lenders: for GHO credit lines, the Aave DAO. Avana Labs also earns an app fee that its app charges outside the contracts.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Source</th><th className="text-left px-4 py-2 type-doc-subsection-title">Avana fee</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Liquidation through LPVaultSwap</td><td className="px-4 py-2">20% of the oracle gain, capped by the realized surplus</td></tr>
                <tr><td className="px-4 py-2">Borrow interest</td><td className="px-4 py-2">None; no interest-fee parameter exists</td></tr>
                <tr><td className="px-4 py-2">Repay with collateral</td><td className="px-4 py-2">None</td></tr>
                <tr><td className="px-4 py-2">Pending settlement of an unsettled seizure</td><td className="px-4 py-2">None; the proceeds go to the Coverage Spoke</td></tr>
                <tr><td className="px-4 py-2">LP trading fees</td><td className="px-4 py-2">None; they belong to the depositor of record</td></tr>
                <tr><td className="px-4 py-2">Use of the Avana app</td><td className="px-4 py-2">App fee, charged outside the contracts</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="liquidation-fee" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Avana Liquidation Fee</h2>
          <p className="mb-4 type-doc-body">
            Avana&apos;s share is computed from the oracle value of the seized units, not from what the caller&apos;s swaps returned, and it is never above the realized surplus:
          </p>
          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"G = max(0, V − D − φ)"}</code>
          </div>
          <div className="mt-2 type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"S = max(0, R′ − D − φ)"}</code>
          </div>
          <div className="mt-2 type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"A = min(floor(G × avanaFeeShareBps / 10⁴), S)"}</code>
          </div>
          <ul className="mt-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>V is the oracle value of the seized units in the debt asset, D the debt repaid and φ the flash-loan premium.</li>
            <li>R′ is the amount the unwind and swaps recovered, plus any shortfall top-up from the caller.</li>
            <li>G is the oracle gain, the bonus Aave paid. S is the realized surplus.</li>
          </ul>
          <p className="mt-4 mb-4 type-doc-body">
            Because the fee is measured on the oracle gain, a caller that routes or sandwiches its own swaps badly cannot lower it while the surplus covers it. Because it is capped at the surplus, the fee never makes a liquidation revert, and the debt is always repaid first.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Parameter</th><th className="text-left px-4 py-2 type-doc-subsection-title">Value</th><th className="text-left px-4 py-2 type-doc-subsection-title">Change</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">avanaFeeShareBps</code></td><td className="px-4 py-2">2,000 (20%); bounds 0 – 5,000</td><td className="px-4 py-2">Normal delay (5 days), both directions; final value set in the listing ARFC</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">feeRecipient</code></td><td className="px-4 py-2">A dedicated Avana treasury Safe named in the deployment manifest</td><td className="px-4 py-2">Normal delay</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="payout-split" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Payout Split</h2>
          <p className="mb-4 type-doc-body">
            After LPVaultSwap repays the flash loan and its premium, it divides the realized surplus three ways, all in the debt asset repaid:
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Recipient</th><th className="text-left px-4 py-2 type-doc-subsection-title">Amount</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Avana fee recipient</td><td className="px-4 py-2">A, as above</td></tr>
                <tr><td className="px-4 py-2">Caller (keeper or permissionless liquidator)</td><td className="px-4 py-2">kr = min(S, G) − A</td></tr>
                <tr><td className="px-4 py-2">Borrower&apos;s wallet</td><td className="px-4 py-2">B = max(0, S − G), the recovery above the oracle value of the seizure</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            A + kr + B = S. A payout that a token refuses, for example to a blocklisted address, is held in the payout escrow (InKindEscrow) for its recipient to claim, and the liquidation still completes.
          </p>
        </section>

        <section id="example" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Worked Example</h2>
          <p className="mb-4 type-doc-body">
            {"Example values; each market's parameters are set at listing."}{" "}A Uniswap v3 USDC/USDT market on Ethereum, vault token priced at $2.10. Bob borrowed USDC and his health factor is below 1. Avana&apos;s keeper liquidates with a flash loan of 1,950 USDC at a 0.05% premium.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Term</th><th className="text-left px-4 py-2 type-doc-subsection-title">Value (USDC)</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Debt repaid, D</td><td className="px-4 py-2">1,950</td></tr>
                <tr><td className="px-4 py-2">Seized: 975 vault tokens (1,950 × 1.05 ÷ 2.10), oracle value V</td><td className="px-4 py-2">2,047.50</td></tr>
                <tr><td className="px-4 py-2">Flash premium, φ</td><td className="px-4 py-2">0.975</td></tr>
                <tr><td className="px-4 py-2">Oracle gain, G = 2,047.50 − 1,950 − 0.975</td><td className="px-4 py-2">96.525</td></tr>
                <tr><td className="px-4 py-2">Recovered after unwind and swaps, R (floor 2,026.02)</td><td className="px-4 py-2">2,040.30</td></tr>
                <tr><td className="px-4 py-2">Realized surplus, S = 2,040.30 − 1,950 − 0.975</td><td className="px-4 py-2">89.325</td></tr>
                <tr><td className="px-4 py-2">Avana fee, A = min(20% × 96.525, 89.325)</td><td className="px-4 py-2">19.305 (shown as 19.31)</td></tr>
                <tr><td className="px-4 py-2">Keeper reward, kr = 89.325 − 19.305</td><td className="px-4 py-2">70.02</td></tr>
                <tr><td className="px-4 py-2">Borrower surplus, B</td><td className="px-4 py-2">0</td></tr>
              </tbody>
            </table>
          </div>
          <ul className="mt-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>If the swaps had returned only 2,027 USDC, S would be 76.025 and Avana&apos;s fee would still be 19.305.</li>
            <li>If the swaps had returned 2,052 USDC, S would be 101.025: the keeper would receive 77.22 (96.525 − 19.305) and Bob&apos;s wallet 4.5 USDC.</li>
            <li>On Base, the same flow in the ARFC example repays 2,000 USDC with a 1 USDC premium and recovers 2,038.50 USDC: Avana&apos;s fee is 7.80 and the keeper receives 29.70.</li>
          </ul>
        </section>

        <section id="no-fee" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Where No Fee Applies</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Interest: Avana charges no fee on borrow interest on any asset. Every debt asset&apos;s fee receiver is an Aave DAO treasury address.</li>
            <li>Repay with collateral: a borrower who repays from part of its own position pays no liquidation bonus and no Avana fee. It pays only the swap cost and the flash premium.</li>
            <li>Pending settlement: value recovered from an unsettled seizure goes only to the Coverage Spoke of the market&apos;s debt reserve, and the caller receives nothing.</li>
            <li>LP fees: trading fees on a pledged position belong to the depositor of record. Liquidation removes principal only and never takes separated fees.</li>
            <li>Pledge, borrow, repay, withdraw and fee collection carry no Avana contract fee.</li>
          </ul>
        </section>

        <section id="app-fee" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">App Fee</h2>
          <p className="mb-4 type-doc-body">
            Avana Labs charges an app fee in its app, outside the contracts. No contract computes, holds or enforces it. A borrower who calls the contracts directly does not pay it.
          </p>
        </section>

        <section id="aave-fees" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Aave Fees and Costs</h2>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Item</th><th className="text-left px-4 py-2 type-doc-subsection-title">Who sets it</th><th className="text-left px-4 py-2 type-doc-subsection-title">Who receives it</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Interest: flat GHO base rate plus the borrower&apos;s risk premium</td><td className="px-4 py-2">Aave DAO</td><td className="px-4 py-2">The lender; the Aave DAO for GHO</td></tr>
                <tr><td className="px-4 py-2">Liquidity fee on each debt asset</td><td className="px-4 py-2">Aave DAO</td><td className="px-4 py-2">Aave DAO treasury</td></tr>
                <tr><td className="px-4 py-2">Aave liquidation fee on vault-token reserves</td><td className="px-4 py-2">Aave DAO, required to be 0 or paid to Avana&apos;s fee recipient</td><td className="px-4 py-2">No one at 0</td></tr>
                <tr><td className="px-4 py-2">Liquidation bonus</td><td className="px-4 py-2">Aave DAO; Avana recommends a minimum of at least 2%</td><td className="px-4 py-2">Paid from the seized collateral; it is the oracle gain split above</td></tr>
                <tr><td className="px-4 py-2">Flash-loan premium of the Aave V3 Pool</td><td className="px-4 py-2">Aave; 0 once Avana&apos;s flash source holds the flash-borrower role</td><td className="px-4 py-2">Aave V3 Pool; LPVaultSwap accepts at most 10 bps</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            The live Aave V3 premium is 5 bps. Each listing proposal asks the Aave DAO to grant Avana&apos;s flash source the flash-borrower role on Ethereum and Base, so liquidation flash loans carry no premium. The bonus sizing is explained in{" "}
            <Link href="/developers/liquidation" className="text-type-accent hover:underline">Liquidation</Link>.
          </p>
        </section>

        <section id="reporting" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Reporting</h2>
          <p className="mb-4 type-doc-body">
            Avana Labs publishes weekly usage reports and monthly revenue reports. They cover figures per chain, debt and collateral by market, concentration, the distribution of health factors, successful, failed and retried liquidations, Avana Umbrella usage, bad debt, oracle incidents, pauses, freezes, breaker trips and alerts, credit-line usage and fees earned.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Avana earns 20% of each liquidation's oracle gain, capped by the realized surplus, plus an app fee outside the contracts. Interest goes to lenders, and LP fees stay with the depositor."
        sectionColor="violet"
      />
    </div>
  ))
}
