import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

const coverageModel = [
  {
    title: "Approved keepers",
    body:
      "Only approved keepers can call LPVaultSwap. At least two keeper operators run liquidations: Avana Labs and at least one independent operator. Opening liquidation to third-party liquidators requires governance approval.",
  },
  {
    title: "Settlement through LPVaultSwap",
    body:
      "Vault tokens can be transferred only to approved Avana contracts. LPVaultSwap is the only contract that performs liquidations. Keepers call LPVaultSwap, which runs the market's settlement route: liquidity removal and fee collection through the AMM settlement adapters, then a swap to GHO.",
  },
  {
    title: "Single-transaction execution",
    body:
      "Each liquidation runs in one transaction. LPVaultSwap takes a flash loan, repays the debt and settles the LP collateral. It then swaps the proceeds to GHO through approved routes and repays the flash loan. If proceeds fall short and the FirstLossReserve cannot cover the gap, the transaction reverts.",
  },
]

const operationalChecklist = [
  "Monitor the health factor that Aave V4 computes from LPOracle prices and each reserve's Collateral Factor. Accounts are eligible below 1.",
  "Flash loans come from the GHO FlashMinter on Ethereum. LPVaultSwap does not borrow from the Avana Hub.",
  "Proceeds are converted to GHO through CoW Swap. Every route completes within the liquidation transaction.",
  "If a liquidation reverts because of a shortfall, retry with a smaller partial liquidation where the market allows it.",
]

const executionRequirements = [
  "Position monitoring using LPOracle prices and current debt, including accrued interest",
  "Simulation of liquidity removal and swap output on the approved routes",
  "Approval as an LPVaultSwap keeper",
  "Support for both settlement modes: partial and full-position",
]

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'liquidation/liquidators', {
    title: "Liquidators",
    description: "Who liquidates unhealthy LP-backed positions on Avana, and how keepers call LPVaultSwap.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "coverage-model", title: "Keeper Model" },
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
          description="Who can liquidate unhealthy positions and what keepers need to run LPVaultSwap."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>An account becomes eligible for liquidation when its health factor falls below 1.
            Liquidation is not permissionless: only approved keepers can call LPVaultSwap.</>{" "}<>The keeper set includes Avana Labs and at least one independent operator.
            Opening liquidation to third-party liquidators requires governance approval.</>{" "}<>{"Each market has an approved settlement mode. In partial settlement, only the liquidity needed to restore health is removed and the borrower keeps the rest. In full-position settlement, the whole position is settled and any surplus is returned to the borrower."}</>
          </p>
        </section>

        <section id="coverage-model" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Keeper Model</h2>
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
            A keeper needs infrastructure to track account health, simulate settlement and submit
            the LPVaultSwap transaction.
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
            In partial-settlement markets, the keeper reward is paid from the Aave V4 liquidation bonus. In full-position markets, it is deducted from proceeds within a per-market cap. Governance sets reward levels, bonuses and caps.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How approved keepers liquidate unhealthy LP-backed positions on Avana through LPVaultSwap."
        sectionColor="amber"
      />
    </div>
  ))
}
