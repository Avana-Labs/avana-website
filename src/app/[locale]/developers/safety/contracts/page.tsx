import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'safety/contracts', {
    title: "Smart Contract Security",
    description: "Avana smart contract security reference covering trust boundaries, contract surfaces, and how audits and bug bounties fit the LP-backed lending design.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "security-challenges", title: "Security Challenges" },
  { id: "multi-layer-security", title: "Multi-Layer Security" },
  { id: "core-contract-surfaces", title: "Core Contract Surfaces" },
  { id: "trust-boundaries", title: "Trust Boundaries" },
  { id: "audit-readiness", title: "Audit Readiness" },
]

const coreSurfaces = [
  {
    title: "Borrow Spoke logic",
    body:
      "Handles collateral admission, user accounting, and the spoke-side lifecycle for LP-backed loans.",
  },
  {
    title: "Hub integration",
    body:
      "Connects spoke-level borrowing capacity to shared credit and liquidity constraints in the Hub layer.",
  },
  {
    title: "Oracle and valuation adapters",
    body:
      "Translate LP positions into conservative collateral values using external prices, position reconstruction, and recoverable-value assumptions.",
  },
  {
    title: "Liquidation execution layer",
    body:
      "Coordinates unwind paths, fee realization, routing, and settlement when an unhealthy account must be closed or resized.",
  },
]

export default async function ContractsArchitecturePage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "safety/contracts", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader

          title="Contracts & Security"

          description="Security reference for the contract surfaces, external dependencies, and review boundaries behind LP-backed lending."

        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>LP-backed lending connects contract accounting to position custody, oracle prices, and DEX-specific liquidation routes. Security review therefore covers both transaction execution and the effect of changing market conditions on collateral value and recovery.</>{" "}<>Contract, economic, and operational review address different parts of that system. A valid contract call can still produce an incorrect lending result if its price input is stale or its assumed liquidation route cannot execute.</>
          </p>
        </section>

        <section id="security-challenges" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Security Challenges</h2>
          <ul className="space-y-3 type-doc-body">
            <li>• LP value can be path dependent and often needs DEX-specific custody and unwind logic.</li>
            <li>• Oracle misuse or stale pricing can create economic loss even when contracts execute exactly as coded.</li>
            <li>• Governance, parameter control, and emergency response are all part of the attack surface.</li>
          </ul>
        </section>

        <section id="multi-layer-security" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Multi-Layer Security</h2>
          <div className="space-y-4">
            <div className="doc-topic">
              <h3 className="mb-1 type-doc-subsection-title">Contract review</h3>
              <p className="type-doc-body">
                Review of a new LP family or execution path covers the affected core contracts, DEX adapters, and privileged controls before enablement.
              </p>
            </div>
            <div className="doc-topic">
              <h3 className="mb-1 type-doc-subsection-title">Economic stress testing</h3>
              <p className="type-doc-body">
                Stress testing examines market shocks, oracle edge cases, and liquidation-routing failures alongside individual contract behavior.
              </p>
            </div>
            <div className="doc-topic">
              <h3 className="mb-1 type-doc-subsection-title">External review channels</h3>
              <p className="type-doc-body">
                Formal audits and the{" "}
                <Link href="/developers/safety/bug-bounty" className="text-blue-600 hover:underline">
                  Bug Bounty
                </Link>{" "}
                program provide complementary review channels: audits assess a defined code scope, while bounty reports can identify additional exploitable behavior.
              </p>
            </div>
          </div>
        </section>

        <section id="core-contract-surfaces" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Core Contract Surfaces</h2>
          <div className="space-y-4">
            {coreSurfaces.map((surface) => (
              <div key={surface.title} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                <h3 className="mb-1 type-doc-subsection-title">{surface.title}</h3>
                <p className="type-doc-body">{surface.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="trust-boundaries" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Trust Boundaries</h2>
          <ul className="space-y-3 type-doc-body">
            <li>• Onchain accounting and settlement require deterministic state changes so debt, vault supply, and backing collateral remain consistent.</li>
            <li>• Price feeds, DEX adapters, and liquidator infrastructure introduce dependencies whose failures can affect valuation or recovery.</li>
            <li>• Governance, pause authority, and upgrades are privileged controls. Their roles, limits, and applicable timelocks define who can change protocol behavior.</li>
          </ul>
        </section>

        <section id="audit-readiness" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Audit Readiness</h2>
          <p className="mb-4 type-doc-body">
            <>Published audit reports identify the code and scope reviewed, the findings, and documented remediation. Deployment review depends on those reports; this page does not establish an audit status or completion date.</>{" "}<>Changes to LP support, liquidation routes, oracle models, privileged roles, or recovery assumptions affect the review scope because they change how collateral is admitted, valued, or settled.</>
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Security reference for the smart contract surfaces and trust boundaries behind LP-backed lending."
        sectionColor="rose"
      />
    </div>
  ))
}
