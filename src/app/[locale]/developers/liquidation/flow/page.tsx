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
    description: "Operational liquidation flow for Avana, covering the runtime sequence used when vault-backed LP collateral is seized and unwound.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "related-docs", title: "Related Docs" },
  { id: "runtime-sequence", title: "Runtime Sequence" },
  { id: "state-transitions", title: "State Transitions" },
  { id: "operator-notes", title: "Operator Notes" },
]

const runtimeSteps = [
  {
    title: "Detect an unhealthy account",
    body:
      "Liquidation nodes or external keepers watch the same risk-adjusted collateral values used by the protocol and flag accounts whose debt now exceeds allowed borrowing capacity.",
  },
  {
    title: "Source execution liquidity",
    body:
      "The liquidator acquires temporary liquidity, commonly through a flashloan-style path, so debt can be repaid without pre-funding the full unwind out of pocket.",
  },
  {
    title: "Repay debt and seize the vault collateral",
    body:
      "The relevant Borrow Spoke settles debt into the credit layer, takes custody of the vault collateral, and hands the position into LP-specific settlement.",
  },
  {
    title: "Burn the vault token and mark the backing position",
    body:
      "The adapter burns the seized vault token and marks the real LP position as in settlement so the backing supply cannot remain outstanding against a position that is already being unwound.",
  },
  {
    title: "Settle the LP position and close the liquidation",
    body:
      "Avana unwinds, sells, auctions, or transfers the real LP position, repays execution liquidity, pays the liquidator reward, and routes any surplus according to the market rule.",
  },
]

const stateTransitions = [
  {
    title: "ACTIVE to LIQUIDATING",
    body:
      "Once Aave permits liquidation, the selected position leaves ACTIVE state and enters LIQUIDATING state. The borrower should no longer be able to withdraw it.",
  },
  {
    title: "LIQUIDATING to SETTLED",
    body:
      "After the real LP position has been unwound or sold, the backing supply is cleared and the position becomes SETTLED.",
  },
  {
    title: "State rule",
    body:
      "A vault token cannot remain outstanding after its backing LP position has been removed. If the vault tokens are burned, the LP position must be withdrawn, unwound, or moved into settlement.",
  },
]

export default async function LiquidationFlowPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "liquidation/flow", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Liquidation Flow"
          description="Runtime sequence for how unhealthy LP-backed positions move from detection through settlement once liquidation starts."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            Liquidation starts when an account&apos;s health factor falls below the liquidation
            threshold. Aave handles debt accounting and the liquidation entry point against the
            ERC-20 vault collateral. Avana handles the LP settlement behind that vault token.
          </p>
          <p className="type-doc-body">
            Debt is repaid, vault collateral is seized, the matching vault token is burned, the real
            LP position is settled, and any residual value is returned according to the market rule.
          </p>
        </section>

        <section id="related-docs" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Related Docs</h2>
          <p className="mb-4 type-doc-body">
            Liquidation policy lives on the{" "}
            <Link href="/developers/liquidation" className="text-[#01AACF] hover:underline">
              Liquidation Framework
            </Link>{" "}
            page. This flow assumes the recoverable value model in{" "}
            <Link href="/developers/integrations/price-oracles" className="text-[#01AACF] hover:underline">
              Price Oracles
            </Link>{" "}
            and position-level aggregation in{" "}
            <Link href="/developers/architecture/collateral-factors" className="text-[#01AACF] hover:underline">
              Collateral Factors
            </Link>
            .
          </p>
        </section>

        <section id="runtime-sequence" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Runtime Sequence</h2>
          <div className="space-y-4">
            {runtimeSteps.map((step, index) => (
              <div key={step.title}>
                <div className="mb-2 flex items-center gap-3">
                  <span className="font-semibold text-[#01AACF]">{index + 1}.</span>
                  <h3 className="type-doc-subsection-title">{step.title}</h3>
                </div>
                <p className="type-doc-body">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="state-transitions" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">State Transitions</h2>
          <p className="mb-4 type-doc-body">
            Different LP families are all trying to reach the same end state, but they do not get
            there through identical exits. Adapter-based handling lets each pool family follow the
            unwind path that matches its own mechanics.
          </p>
          <div className="space-y-4">
            {stateTransitions.map((item) => (
              <div key={item.title}>
                <h3 className="mb-1 type-doc-subsection-title">{item.title}</h3>
                <p className="type-doc-body">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="operator-notes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Operator Notes</h2>
          <div className="space-y-3 type-doc-body">
            <p>
              Liquidation bots should index active positions, refresh debt drift, and price
              accounts from the same oracle stack used by the protocol rather than from raw AMM
              spot state alone.
            </p>
            <p>
              Profitability checks should account for slippage, route depth, flashloan costs, and
              execution risk. Large or unusual unwinds may benefit from private execution paths to
              reduce adverse MEV exposure.
            </p>
            <p>
              Thresholds, rewards, and admission rules come from the architecture and risk docs.
            </p>
          </div>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Operator-facing runtime sequence for liquidation nodes and keepers."
        sectionColor="amber"
      />
    </div>
  ))
}
