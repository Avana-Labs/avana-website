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
    description: "Governance-defined allowlist and review criteria for LP pools that Avana is willing to admit as collateral.",
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
    treatment: "Often the easiest to admit when pricing is reliable, peg behavior is understood, and unwind depth remains strong.",
  },
  {
    family: "Blue-chip volatile pools",
    treatment: "Can be supported, but usually with more conservative collateral factors, liquidity checks, and tougher liquidation assumptions.",
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

          description="Governance-controlled allowlist for the pools and LP families Avana is prepared to accept as collateral."

        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            Avana only accepts LP collateral from pools that have been reviewed and approved. The
            allowlist exists because LP support is not automatic for every pool on a DEX. The
            protocol needs enough information to price the position, manage liquidation, and bound
            the risk it is taking on.
          </p>
          <p className="type-doc-body">
            Pool approval works alongside{" "}
            <Link href="/developers/architecture/collateral-factors" className="text-[#01AACF] hover:underline">
              Collateral Factors
            </Link>{" "}
            and{" "}
            <Link href="/developers/safety" className="text-[#01AACF] hover:underline">
              Risk Framework
            </Link>
            . The allowlist decides whether a pool may enter the system; collateral factors decide how
            much borrowable value each admitted position can contribute.
          </p>
        </section>

        <section id="review-criteria" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Review Criteria</h2>
          <p className="mb-4 type-doc-body">
            A pool enters the allowlist only when the protocol can answer the same basic questions
            every time: can it price the position, can it exit the position, and can it monitor the
            risk in production.
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
            Pool approval does not mean a position gets generous credit treatment. After a pool is
            admitted, each LP position is still valued on its own, discounted according to its risk
            treatment, and then added to the user&apos;s borrowing capacity inside the Borrow Spoke.
          </p>
          <p className="type-doc-body">
            That is why pool approval and collateral valuation are tightly linked. A pool can be
            safe enough to admit while still requiring conservative caps, lower LTVs, or stricter
            liquidation handling once it is live.
          </p>
        </section>

        <section id="integration-notes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Integration Notes</h2>
          <div className="space-y-3 type-doc-body">
            <p>
              Builders should think in terms of approved pool templates and deployment-specific
              allowlists, not as if every LP on a DEX is automatically supported.
            </p>
            <p>
              New pool families usually require coordinated work across oracle handling, liquidation
              routing, risk limits, and monitoring infrastructure before they are safe to enable.
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
