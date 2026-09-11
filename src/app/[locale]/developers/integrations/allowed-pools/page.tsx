import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'integrations/allowed-pools', {
    title: "Allowed LP Pools",
    description: "How Avana's governance-controlled allowlist determines which LP pools can be used as collateral.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "review-criteria", title: "Review Criteria" },
  { id: "pool-families", title: "Pool Families" },
  { id: "risk-application", title: "Risk Application" },
  { id: "integration-notes", title: "Integration Notes" },
]

const poolFamilies = [
  {
    family: "Stable and correlated pools",
    treatment: "Admission depends on reliable pricing, understood peg behavior, and sufficient liquidity for liquidation.",
  },
  {
    family: "Blue-chip volatile pools",
    treatment: "Support depends on collateral factors, liquidity checks, and liquidation assumptions appropriate to the assets' volatility.",
  },
  {
    family: "Concentrated liquidity positions",
    treatment: "Require position-level valuation and careful handling of active range, one-sided inventory, and fee state.",
  },
  {
    family: "Custom or experimental designs",
    treatment: "Need explicit oracle, custody, and liquidation support before they can be considered for the allowlist at all.",
  },
]

const reviewCriteria = [
  "Reliable external price coverage for the underlying assets",
  "Sufficient pool depth and credible unwind paths during liquidation",
  "Clear admissibility rules for the LP family or spoke template",
  "Acceptable concentration, volatility, and peg-stability profile",
  "Operational support for indexing, fee handling, and liquidation routing",
]

export default async function AllowedPoolsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "integrations/allowed-pools", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader

          title="Allowed LP Pools"

          description="How pool approval determines collateral eligibility before position valuation and borrowing checks."

        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>Avana accepts LP collateral only from reviewed and approved pools. Approval applies to individual pools, so an integration with a DEX does not automatically enable all of its LP positions. The review establishes whether Avana can value the position, hold it as collateral, and recover value through liquidation.</>{" "}<>Pool approval works alongside{" "}
            <Link href="/developers/architecture/collateral-factors" className="text-[#01AACF] hover:underline">
              Collateral Factors
            </Link>{" "}
            and{" "}
            <Link href="/developers/safety" className="text-[#01AACF] hover:underline">
              Risk Framework
            </Link>
            . The allowlist decides whether a pool may enter the system; collateral factors decide how
            much borrowable value each admitted position can contribute.</>{" "}<>{"Each supported DEX family has an adapter for operations such as fee collection and liquidity removal. The adapter implements the calls required by that LP format, keeping DEX-specific execution separate from the rest of the transaction flow."}</>
          </p>
        </section>

        <section id="review-criteria" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Review Criteria</h2>
          <p className="mb-4 type-doc-body">
            Pool review covers pricing, liquidation, and ongoing monitoring. The criteria below determine whether those operations can be supported for the pool and its LP format.
          </p>
          <ul className="space-y-3 type-doc-body">
            {reviewCriteria.map((criterion) => (
              <li key={criterion} className="type-doc-code-block">
                {criterion}
              </li>
            ))}
          </ul>
        </section>

        <section id="pool-families" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Pool Families</h2>
          <div className="space-y-4">
            {poolFamilies.map((family) => (
              <div key={family.family} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                <h3 className="mb-1 type-doc-subsection-title">{family.family}</h3>
                <p className="type-doc-body">{family.treatment}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="risk-application" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Risk Application</h2>
          <p className="mb-4 type-doc-body">
            <>Approval establishes that a pool is eligible for collateral use. Each deposited position is then valued separately and adjusted for risk before it contributes to the account&apos;s borrowing capacity.</>{" "}<>An approved pool may still require lower collateral factors, tighter exposure caps, or a specific liquidation route. These controls determine how the pool can be used after admission.</>
          </p>
        </section>

        <section id="integration-notes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Integration Notes</h2>
          <div className="space-y-3 type-doc-body">
            <p>
            <>Integrations need both the supported pool template and the target deployment&apos;s allowlist to determine whether a position is eligible. DEX compatibility alone does not establish collateral support.</>{" "}<>Adding a pool family involves oracle handling, custody and liquidation adapters, risk limits, and monitoring. Each of these dependencies is part of the enablement review.</>
          </p>
          </div>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Governance-defined allowlist and review criteria for LP pools admitted as collateral."
        sectionColor="cyan"
      />
    </div>
  ))
}
