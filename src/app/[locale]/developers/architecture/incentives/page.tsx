import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'architecture/incentives', {
    title: "Incentives",
    description: "Who gets paid what in Avana: the keeper reward from each liquidation's oracle gain, the borrower's surplus, Avana's keeper and coverage funding, and interest to lenders.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "keeper-reward", title: "Keeper Reward" },
  { id: "borrower-surplus", title: "Borrower Surplus" },
  { id: "avana-keepers", title: "Avana's Keepers" },
  { id: "coverage-funding", title: "Coverage Funding" },
  { id: "lenders", title: "Lenders" },
  { id: "not-included", title: "Not Included" },
]

export default async function IncentivesPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "architecture/incentives", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Incentives"
          description="The payments Avana's contracts make, who receives each one, and what Avana Labs pays for itself."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            Avana&apos;s contracts pay out in one place: the settlement of a liquidation. After the debt and the flash loan are repaid, LPVaultSwap splits the realized surplus between Avana&apos;s fee recipient, the caller and the borrower, all in the debt asset repaid. Interest goes to lenders, and Avana Labs pays for its own keepers and funds the First-Loss Reserves.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Participant</th><th className="text-left px-4 py-2 type-doc-subsection-title">Receives</th><th className="text-left px-4 py-2 type-doc-subsection-title">Pays or provides</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Liquidation caller</td><td className="px-4 py-2">Keeper reward from the oracle gain</td><td className="px-4 py-2">Gas, swap outcome and any shortfall top-up</td></tr>
                <tr><td className="px-4 py-2">Borrower</td><td className="px-4 py-2">Any recovery above the oracle value of the seizure; all LP fees</td><td className="px-4 py-2">Interest and the liquidation bonus on seized collateral</td></tr>
                <tr><td className="px-4 py-2">Avana Labs</td><td className="px-4 py-2">20% of the oracle gain; app fee outside the contracts</td><td className="px-4 py-2">Its own keeper gas; First-Loss Reserve capital</td></tr>
                <tr><td className="px-4 py-2">Aave DAO</td><td className="px-4 py-2">All interest on its credit lines</td><td className="px-4 py-2">The credit-line liquidity</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="keeper-reward" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Keeper Reward</h2>
          <p className="mb-4 type-doc-body">
            Aave sizes each seizure at the oracle price, so the bonus it pays is the oracle gain: the oracle value of the seized units, less the debt repaid and the flash premium. The caller&apos;s reward is that gain after Avana&apos;s 20% share, up to what the swaps actually realized.
          </p>
          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"keeper reward = min(S, G) − A"}</code>
          </div>
          <p className="mt-4 mb-4 type-doc-body">
            {"Example values; each market's parameters are set at listing."}{" "}In the Ethereum example of 1,950 USDC repaid against a vault token at $2.10, the oracle gain is 96.525 USDC, the realized surplus 89.325 USDC and Avana&apos;s fee 19.305 USDC, so the keeper receives 70.02 USDC.
          </p>
          <p className="mb-4 type-doc-body">
            The same reward applies to approved keepers and to any address using the permissionless entry point. A caller that covers a shortfall from its own funds is held to its own spend limit and minimum payout. A reward that the token refuses to deliver is held in the payout escrow for the caller to claim.
          </p>
        </section>

        <section id="borrower-surplus" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrower Surplus</h2>
          <p className="mb-4 type-doc-body">
            Value the seized collateral produces above its oracle value, for example because a swap route paid better than the oracle price, belongs to the borrower whose collateral produced it. LPVaultSwap sends it to the borrower&apos;s wallet in the same transaction.
          </p>
          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"borrower surplus = max(0, S − G)"}</code>
          </div>
          <p className="mt-4 type-doc-body">
            In the same example, swaps returning 2,052 USDC instead of 2,040.30 would give a surplus of 101.025 USDC: Avana&apos;s fee stays 19.305, the keeper receives 77.22 and the borrower 4.5 USDC. The borrower also keeps the rest of the position and all of its separated fees.
          </p>
        </section>

        <section id="avana-keepers" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Avana&apos;s Keepers</h2>
          <p className="mb-4 type-doc-body">
            Liquidation never depends on a keeper making a profit. Avana runs its own approved keeper on each chain and liquidates every account below health factor 1, whatever its size, paying the gas as an operating cost from its keeper budget. The budget is set with the Aave V4 risk service providers in the keeper agreement, and monitoring warns at 50% and pages at 25% remaining.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>One liquidation of a single record uses about 1,550,000 gas; one of the largest account (16 records) at most 5,150,000.</li>
            <li>Each chain needs at least one active keeper. Up to 32 keepers can be approved per chain through the timelock, including a standby keeper on separate infrastructure.</li>
            <li>Permissionless callers pay their own gas and receive no reimbursement.</li>
          </ul>
        </section>

        <section id="coverage-funding" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Coverage Funding</h2>
          <p className="mb-4 type-doc-body">
            Avana Labs funds the Coverage Spoke (Avana Umbrella) of each Hub and debt asset, in that asset, before any draw cap on the pair rises above 0. The Aave DAO controls it. It covers recorded deficits within 72 hours and is Avana&apos;s only on-chain loss layer. The coverage ratio and minimum are set in the funding ARFC with Aave&apos;s service providers.
          </p>
          <p className="mb-4 type-doc-body">
            Value recovered from an unsettled seizure also goes to the Coverage Spoke, not to Avana or the caller: the pending settlement pays its caller nothing, and its conversion is held to an oracle-based floor, so no one profits from an unsettled seizure.
          </p>
        </section>

        <section id="lenders" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Lenders</h2>
          <p className="mb-4 type-doc-body">
            All interest on a credit line accrues to its lender, the Aave DAO for GHO. Avana takes no share of it. Fee details are in{" "}
            <Link href="/developers/architecture/platform-fees" className="text-type-accent hover:underline">Platform Fees</Link>.
          </p>
        </section>

        <section id="not-included" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Not Included</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Vault tokens have no emissions and no issuance schedule. They are minted only against credited units and burned on withdrawal, partial removal, repay with collateral or seizure.</li>
            <li>Vault tokens cannot be traded: they move only between a registered proxy, the Hub and LPVaultSwap.</li>
            <li>There is no fee on borrow interest and no Avana fee on repay with collateral.</li>
            <li>There is no settlement budget: a caller that needs to cover a rounding gap at final settlement pays it through its own shortfall top-up.</li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="The keeper reward from each liquidation's oracle gain, the borrower's surplus, Avana's own keepers and First-Loss Reserve funding, and interest to lenders."
        sectionColor="violet"
      />
    </div>
  ))
}
