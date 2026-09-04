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
    description: "Illustrative liquidation examples for Avana, showing how fungible LPs, concentrated liquidity, and multi-position accounts are unwound under the same core framework.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "fungible-lp", title: "Fungible LP Example" },
  { id: "concentrated-liquidity", title: "Concentrated Liquidity Example" },
  { id: "nft-liquidity", title: "NFT Liquidation" },
  { id: "multi-position-account", title: "Multi-Position Account" },
  { id: "edge-cases", title: "Edge Cases" },
  { id: "summary", title: "Summary" },
]

const edgeCases = [
  "The position may be mostly one-sided by the time liquidation starts, especially for concentrated liquidity.",
  "Pool depth may be sufficient for valuation but still thin enough to require conservative unwind routing.",
  "Claimable fees can improve recoveries, but they should not be treated as guaranteed until actually realized.",
  "A borrower may have several positions contributing to one spoke-level borrowing capacity, so liquidation sequencing matters.",
]

export default async function LiquidationExamplesPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "liquidation/examples", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Liquidation Examples"
          description="Worked scenarios that show how one liquidation framework is applied to different LP collateral shapes."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            These examples show how liquidation plays out across common LP formats under the{" "}
            <Link href="/developers/liquidation" className="text-[#01AACF] hover:underline">
              Liquidation Framework
            </Link>
            .
          </p>
          <p className="type-doc-body">
            In every case the job is the same: use conservative collateral marks, repay debt into
            the credit layer, unwind the LP through a supported path, and return any residual value
            left after execution costs and the liquidation reward.
          </p>
        </section>

        <section id="fungible-lp" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Fungible LP Example</h2>
          <div>
            <p className="mb-4 type-doc-body">
              A borrower has deposited a fungible LP token from an approved stable or weighted pool.
              Over time, pool composition and oracle inputs move enough that the account no longer
              has sufficient adjusted collateral value for its debt.
            </p>
            <ul className="space-y-2 type-doc-body">
              <li>• The liquidation node detects the shortfall and sources execution liquidity.</li>
              <li>• Debt is repaid and the LP token is redeemed into its underlying assets.</li>
              <li>• Claimable fees are realized if available and helpful to recovery.</li>
              <li>• Underlying assets are routed into the debt asset and the liquidation closes.</li>
              <li>• Any value left after repayment and reward is returned to the borrower.</li>
            </ul>
          </div>
        </section>

        <section id="concentrated-liquidity" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Concentrated Liquidity Example</h2>
          <div>
            <p className="mb-4 type-doc-body">
              A concentrated-liquidity position drifts toward the edge of its active range. The
              account may remain healthy for a while, then tip into liquidation once debt outpaces
              the recoverable value of the current position state.
            </p>
            <ul className="space-y-2 type-doc-body">
              <li>• The node values the position from its current range, liquidity, and token split.</li>
              <li>• Once liquidation begins, claimable fees are checked before principal is unwound.</li>
              <li>• Routing adapts to the actual inventory recovered rather than a static token mix.</li>
              <li>• Settlement follows the same pattern: repay execution liquidity, pay reward, return residual value.</li>
            </ul>
          </div>
        </section>

        <section id="nft-liquidity" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">NFT Liquidation</h2>
          <div>
            <p className="mb-4 type-doc-body">
              A borrower deposits a Uniswap v3 NFT and later the position becomes underwater. The
              unwind is handled at the position level, not as a loose token slice, because the NFT
              represents one specific backing position.
            </p>
            <ul className="space-y-2 type-doc-body">
              <li>• Aave seizes the vault token balance tied to the NFT-backed position.</li>
              <li>• Avana burns the vault token and moves the real LP position into settlement.</li>
              <li>• The settlement module unwinds, sells, auctions, or transfers the position.</li>
              <li>• Debt is repaid first, the liquidator reward comes next, and any surplus follows the market rule.</li>
              <li>• The borrower does not keep a clean partial claim on the same NFT after liquidation.</li>
            </ul>
          </div>
        </section>

        <section id="multi-position-account" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Multi-Position Account</h2>
          <div>
            <p className="mb-4 type-doc-body">
              A borrower may hold several LP positions inside one Borrow Spoke. Capacity is
              aggregated across those positions, but the unwind still has to happen at the position
              level once the account turns unhealthy.
            </p>
            <ul className="space-y-2 type-doc-body">
              <li>• The spoke reports one aggregate borrowing capacity to the Hub.</li>
              <li>• When the account becomes unhealthy, the liquidation node chooses the unwind path that best restores solvency.</li>
              <li>• One position may be enough to close the shortfall, or several may need to be partially or fully unwound.</li>
              <li>• Order of execution, oracle consistency, and route depth matter next to the mark itself.</li>
            </ul>
          </div>
        </section>

        <section id="edge-cases" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Edge Cases</h2>
          <ul className="space-y-3 type-doc-body">
            {edgeCases.map((item) => (
              <li key={item}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section id="summary" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Summary</h2>
          <p className="type-doc-body">
            Fungible LPs, concentrated ranges, NFT positions, and multi-position accounts have
            different unwind details. The shared goal is to repay debt from recoverable LP value,
            not optimistic NAV assumptions.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Illustrative support page for how the liquidation framework applies across LP families."
        sectionColor="amber"
      />
    </div>
  ))
}
