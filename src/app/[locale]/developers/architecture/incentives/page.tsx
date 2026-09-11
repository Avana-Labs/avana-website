import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'architecture/incentives', {
    title: "Incentives Programs",
    description: "How optional reward campaigns relate to Avana without changing core lending mechanics.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "program-types", title: "Program Types" },
  { id: "distribution-principles", title: "Distribution Principles" },
  { id: "claiming-and-reconciliation", title: "Claiming & Reconciliation" },
  { id: "status", title: "Current Status" },
]

export default async function IncentivesPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "architecture/incentives", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Incentives Programs"
          description="Optional reward campaigns that sit on top of Avana without changing core lending mechanics."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>Incentive campaigns distribute rewards alongside Avana&apos;s lending operations. Their eligibility and reward calculations are separate from LP valuation, Borrow Spoke risk controls, Hub liquidity, and liquidation eligibility.</>{" "}<>Campaign availability and duration depend on the deployment. A program described here is not necessarily active on every network.</>
          </p>
        </section>

        <section id="program-types" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Program Types</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Supplier-facing campaigns that deepen capital in the Lend Spoke or connected liquidity layer</li>
            <li>Borrower-facing campaigns that encourage healthy LP-backed borrowing</li>
            <li>Operator or ecosystem campaigns tied to testing, integrations, or risk-supporting activity</li>
          </ul>
        </section>

        <section id="distribution-principles" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Distribution Principles</h2>
          <p className="mb-4 type-doc-body">
            Reward calculations may depend on activity, participation duration, or other campaign rules. These calculations determine reward entitlement; they do not change collateral value, borrowing capacity, or liquidation eligibility.
          </p>
        </section>

        <section id="claiming-and-reconciliation" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Claiming & Reconciliation</h2>
          <p className="mb-4 type-doc-body">
            <>Claim paths, vesting schedules, and reconciliation methods are campaign-specific. They
            may be handled onchain, through a dedicated rewards controller, or through offchain
            accounting published by the campaign operator.</>{" "}<>Integrators should verify the active claim path and eligibility rules for the deployment
            they are targeting.</>
          </p>
        </section>

        <section id="status" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Current Status</h2>
          <p className="type-doc-body">
            Each campaign has its own deployment, dates, eligibility rules, and distribution terms. Its published announcement provides the information needed to identify which activity qualifies and how rewards are distributed.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Optional rewards and campaign mechanics on top of Avana."
        sectionColor="violet"
      />
    </div>
  ))
}
