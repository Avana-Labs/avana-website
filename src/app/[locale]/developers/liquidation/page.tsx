import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'liquidation', {
    title: "Liquidation Framework",
    description: "How Avana handles liquidation for vault-backed LP collateral after Aave triggers the liquidation entry point.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "three-layers", title: "Three Layers" },
  { id: "core-rules", title: "Core Rules" },
  { id: "lp-complexity", title: "LP Collateral Complexity" },
  { id: "liquidation-pathways", title: "Liquidation Pathways" },
  { id: "position-state", title: "Position State" },
  { id: "surplus-handling", title: "Surplus Handling" },
  { id: "operator-model", title: "Operator Model" },
]

export default async function LiquidationDesignPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "liquidation", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Liquidation Design"
          description="How liquidation entry, vault seizure, and LP settlement are split across Aave and Avana."
        />

        <section id="overview" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>Aave determines liquidation eligibility and handles debt accounting and seizure of the ERC-20 vault collateral. Avana maps that collateral to its backing LP position and executes the settlement method required by the LP format.</>{" "}<>Liquidation connects two representations of the same collateral: the vault token balance recorded in Aave and the backing LP position tracked by Avana. Seizure of the vault token must resolve to the corresponding LP position so settlement removes both the backing position and its collateral representation consistently.</>
          </p>
          <p className="mt-4 type-doc-body">
            For the operator-facing sequence, see{" "}
            <Link href="/developers/liquidation/liquidators" className="text-[#01AACF] hover:underline">
              Liquidators
            </Link>
            . For the execution sequence, see{" "}
            <Link href="/developers/liquidation/flow" className="text-[#01AACF] hover:underline">
              Liquidation Flow
            </Link>
            .
          </p>
        </section>

        <section id="three-layers" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Three Layers</h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-1 type-doc-subsection-title">Aave layer</h3>
              <p className="type-doc-body">
                Tracks debt, vault collateral balance, health factor, and the liquidation entry
                point that authorizes seizure.
              </p>
            </div>
            <div>
              <h3 className="mb-1 type-doc-subsection-title">Avana adapter layer</h3>
              <p className="type-doc-body">
                Receives the seized vault collateral, burns the corresponding vault token, and maps
                the liquidation event back to the LP position that actually backed it.
              </p>
            </div>
            <div>
              <h3 className="mb-1 type-doc-subsection-title">Avana settlement layer</h3>
              <p className="type-doc-body">
                Identifies the real LP position, runs the appropriate unwind or sale path, repays
                debt, pays the liquidator reward, and routes any surplus according to the market
                rule.
              </p>
            </div>
          </div>
        </section>

        <section id="core-rules" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Core Rules</h2>
          <p className="mb-4 type-doc-body">
            The liquidation process links Aave&apos;s seizure of ERC-20 vault collateral to Avana&apos;s settlement of the backing LP position. The rules below describe the relationship between vault supply, recoverable collateral, and settlement proceeds.
          </p>
          <ul className="space-y-4">
            <li>
              <span className="type-doc-subsection-title">Vault tokens must map to real value</span>
              <p className="mt-0.5 type-doc-body">
                Each amount of vault collateral selected for liquidation must correspond to recoverable value in its backing LP position.
              </p>
            </li>
            <li>
              <span className="type-doc-subsection-title">Backing collateral cannot stay outstanding</span>
              <p className="mt-0.5 type-doc-body">
                Settlement removes the LP position from active collateral. The corresponding vault tokens must also be burned so they cannot continue representing collateral that is no longer held.
              </p>
            </li>
            <li>
              <span className="type-doc-subsection-title">No unbacked supply</span>
              <p className="mt-0.5 type-doc-body">
                Active vault token supply cannot exist without active LP collateral behind it.
              </p>
            </li>
            <li>
              <span className="type-doc-subsection-title">Surplus follows the market rule</span>
              <p className="mt-0.5 type-doc-body">
                Settlement proceeds cover debt first, followed by the liquidator reward and settlement costs. Any remaining value is distributed under the market&apos;s surplus rule.
              </p>
            </li>
          </ul>
        </section>

        <section id="lp-complexity" className="mb-10">
          <h2 className="type-doc-section-title mb-4">LP Collateral Complexity</h2>
          <p className="mb-4 type-doc-body">
            <>LP-backed positions do not all behave the same way during liquidation. A fungible LP
            token can often be redeemed or transferred proportionally, while a Uniswap v3 NFT is a
            single discrete position whose range, fee accrual, and unwind route matter at the
            position level.</>{" "}<>The settlement layer uses the collateral family, backing-position identifier, and configured unwind route to resolve the position and clear its corresponding vault supply.</>
          </p>
        </section>

        <section id="liquidation-pathways" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Liquidation Pathways</h2>
          <p className="mb-4 type-doc-body">
            The settlement path depends on what kind of LP collateral sits behind the vault token.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 type-doc-subsection-title">Fungible LP collateral</h3>
              <ul className="ml-4 space-y-1 type-doc-body">
                <li>• Settlement can be proportional to the debt that must be covered, rather than forcing the entire LP balance through liquidation.</li>
                <li>• Avana can redeem or transfer only the amount needed for the liquidation when the market design supports partial recovery.</li>
                <li>• The remaining position can stay active if the account still satisfies the required health checks afterward.</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 type-doc-subsection-title">NFT-backed LP collateral</h3>
              <ul className="ml-4 space-y-1 type-doc-body">
                <li>• The full position moves into settlement when it is selected for liquidation because the NFT itself is the collateral unit being resolved.</li>
                <li>• The matching vault tokens are burned after Aave seizes the vault collateral and Avana maps that seizure back to the NFT position.</li>
                <li>• Avana can unwind, sell, auction, or transfer the real LP position based on the market rules for that collateral family.</li>
                <li>• Surplus does not automatically go to the liquidator unless the market rule explicitly says so.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="position-state" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Position State</h2>
          <div className="doc-prose">
            <p className="type-doc-body"><>The position is still contributing collateral value, and the outstanding vault
                tokens remain fully backed by that live LP position.</>{" "}<>The selected collateral is no longer withdrawable by the borrower and is actively
                moving through the settlement path.</>{" "}<>The LP position has been resolved, and the matching vault tokens must no longer be
                outstanding.</></p>
          </div>
        </section>

        <section id="surplus-handling" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Surplus Handling</h2>
          <p className="mb-4 type-doc-body">
            <>Settlement value is applied in a fixed order. It first covers debt, then the
            liquidator reward, then settlement costs. Any value left after those obligations is
            surplus, and that surplus follows the market rule for the collateral being settled.</>{" "}<>If recoveries are insufficient, a shortfall remains after settlement. It requires the market&apos;s bad-debt handling; completing the LP unwind does not itself eliminate the unpaid obligation.</>
          </p>
        </section>

        <section id="operator-model" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Operator Model</h2>
          <p className="mb-4 type-doc-body">
            Liquidations are permissionless once a position crosses the liquidation threshold. Any
            eligible liquidator can repay the allowed debt amount and trigger the settlement path.
            LP collateral is harder to unwind than simple token collateral, so Avana also accounts
            for specialized liquidation coverage.
          </p>
          <ul className="space-y-2 type-doc-body">
            <li>Liquidators must track the same risk state and collateral state that the protocol uses.</li>
            <li>Execution must remain atomic from debt repayment through settlement.</li>
            <li>Execution estimates include fee realization, route depth, and residual value, as well as transaction timing.</li>
            <li>Partial and full debt coverage require different routing amounts and recovery estimates.</li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How liquidation moves from Aave entry to Avana vault handling and then to collateral-family-specific LP settlement."
        sectionColor="amber"
      />
    </div>
  ))
}
