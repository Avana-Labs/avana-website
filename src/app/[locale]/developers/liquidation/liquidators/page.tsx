import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

const coverageModel = [
  {
    title: "Permissionless participation",
    body:
      "Any keeper or execution desk can liquidate if it can monitor positions, source execution liquidity, and unwind the LP formats Avana supports.",
  },
  {
    title: "DEX-specific handling",
    body:
      "An LP unwind includes DEX-specific fee collection, liquidity removal, and routing into the debt asset. Operators need execution support for each collateral format they intend to liquidate.",
  },
  {
    title: "Coverage quality",
    body:
      "Detecting an eligible account is only the first step. Execution also depends on a viable route from its LP collateral to the debt asset, including available liquidity and any fees or costs incurred along the way.",
  },
]

const operationalChecklist = [
  "Monitor the collateral valuation and debt state used by the protocol's eligibility checks.",
  "Coordinate debt repayment and settlement atomically wherever the supported route permits it.",
  "Include fee collection, route depth, and residual value in execution estimates.",
  "Model the amounts and routes for partial and full debt coverage separately.",
]

const executionRequirements = [
  "Position monitoring and debt drift tracking",
  "Simulation for route depth, slippage, and liquidity availability",
  "Transaction delivery with flashloan or prefunded execution paths",
  "DEX adapters for the LP families the protocol supports",
]

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'liquidation/liquidators', {
    title: "Liquidators",
    description: "How liquidation operators close unhealthy LP-backed positions on Avana.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "coverage-model", title: "Coverage Model" },
  { id: "execution-requirements", title: "Execution Requirements" },
  { id: "operational-notes", title: "Operational Notes" },
]

export default async function DeveloperLiquidatorsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "liquidation/liquidators", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Liquidators"
          description="Who can liquidate unhealthy positions and what execution infrastructure is required."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>Liquidations are permissionless once a position crosses the liquidation threshold. Any
            eligible liquidator can repay the allowed debt amount and trigger the settlement path.</>{" "}<>LP collateral is harder to unwind than simple token collateral. Liquidators track the
            same risk state, vault-token mapping, route depth, and unwind assumptions used by the
            protocol.</>{" "}<>{"LP-backed positions do not all behave the same way during liquidation. A fungible LP token can often be redeemed or transferred proportionally, while a Uniswap v3 NFT is a single discrete position whose range, fee accrual, and unwind route matter at the position level."}</>
          </p>
        </section>

        <section id="coverage-model" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Coverage Model</h2>
          <div className="space-y-4">
            {coverageModel.map((item) => (
              <div key={item.title}>
                <h3 className="mb-1 type-doc-subsection-title">{item.title}</h3>
                <p className="type-doc-body">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="execution-requirements" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Execution Requirements</h2>
          <p className="mb-4 type-doc-body">
            A liquidator for Avana needs infrastructure to value positions, simulate exits, source
            capital, and deliver a transaction that completes the unwind path.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            {executionRequirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="operational-notes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Operational Notes</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            {operationalChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 type-doc-body">
            DEX-specific liquidity removal, fee collection, and debt repayment form one liquidation workflow. A failure in any of these steps can prevent completion even when the position&apos;s estimated value is sufficient to cover the debt.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How liquidation operators close unhealthy LP-backed positions on Avana."
        sectionColor="amber"
      />
    </div>
  ))
}
