import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'architecture/incentives', {
    title: "Incentives",
    description: "Avana includes no incentive programs or token emissions. The Avana utility token is separate and requires its own governance approval.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "program-types", title: "Not Included" },
  { id: "distribution-principles", title: "Revenue Flows" },
  { id: "claiming-and-reconciliation", title: "Utility Token" },
  { id: "status", title: "Current Status" },
]

export default async function IncentivesPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "architecture/incentives", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Incentives"
          description="What Avana does and does not include for rewards, tokens and revenue."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>Avana includes no incentive programs, reward campaigns or token emissions.</>{" "}<>Vault tokens have no issuance schedule. They are minted only on an approved deposit and burned on withdrawal or settlement.</>
          </p>
        </section>

        <section id="program-types" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Not Included</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>No emissions or reward campaigns for depositors or borrowers</li>
            <li>No secondary market for vault tokens. They are collateral-only records that can move only to approved Avana contracts</li>
            <li>No development grant from the Aave DAO and no dependency on commercial agreements with AMMs</li>
          </ul>
        </section>

        <section id="distribution-principles" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Revenue Flows</h2>
          <p className="mb-4 type-doc-body">
            All interest revenue from the GHO credit line accrues to the Aave DAO. Avana Labs earns frontend fees and a liquidation fee. Using the contracts directly avoids the frontend fee. Revenues committed to loss coverage are second in the loss order. They come after dedicated first-loss capital and before the Avana Umbrella, Avana&apos;s protocol safety module.
          </p>
        </section>

        <section id="claiming-and-reconciliation" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Utility Token</h2>
          <p className="mb-4 type-doc-body">
            <>The Avana utility token is separate from the lending markets and requires its own governance approval. Its tokenomics include an allocation to the Aave DAO treasury and/or stkAAVE holders.</>{" "}<>Allocation size, eligibility and vesting terms are set through Aave governance.</>
          </p>
        </section>

        <section id="status" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Current Status</h2>
          <p className="type-doc-body">
            The public sandbox uses simulated assets and makes no onchain transactions. The pilot is limited to allowlisted depositors. Each market has minimum and maximum position sizes, and each account has a limit on positions.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Avana includes no incentive programs or emissions. The utility token is separate and requires its own governance approval."
        sectionColor="violet"
      />
    </div>
  ))
}
