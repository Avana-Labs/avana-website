import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'integrations/appkit', {
    title: "AppKit",
    description: "How AppKit passes wallet and market context from a partner application into Avana's borrowing flow.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "integration-model", title: "Integration Model" },
  { id: "partner-controls", title: "Partner Controls" },
  { id: "launch-notes", title: "Launch Notes" },
]

const integrationPoints = [
  {
    title: "Intent capture",
    body:
      "A partner can place the borrowing entry point alongside an LP position, portfolio, or swap view. That view supplies the position and market context for the handoff to Avana.",
  },
  {
    title: "Protocol handoff",
    body:
      "The partner passes wallet and market context into Avana so the borrowing flow opens with the relevant account and market already selected.",
  },
  {
    title: "Partner economics",
    body:
      "Partner arrangements may include referral, routing, or integration revenue. These arrangements do not transfer lending, risk assessment, or settlement responsibilities from Avana to the partner application.",
  },
]

const implementationNotes = [
  "Associate the borrowing entry point with the LP position or portfolio view that supplies its context.",
  "Pass the relevant wallet and market context into the borrowing flow.",
  "Use Avana's collateral valuation and liquidation rules rather than duplicating their calculations in the partner interface.",
  "Define which users can access the entry point and how the interface explains the transition to Avana.",
]

const partnerControls = [
  "Where the credit surface appears in the product",
  "Which user segments see the borrow entry point",
  "How much education or explanation appears alongside the handoff",
  "Whether the product uses a full embedded handoff or a lighter context-preserving entry point",
]

export default async function DeveloperAppKitPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "integrations/appkit", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="AppKit"
          description="How partners embed Avana LP-backed credit while Avana keeps responsibility for borrowing, risk, and settlement."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>AppKit connects DEXs, wallets, and portfolio applications to Avana&apos;s LP-backed borrowing flow. The partner application selects where the entry point appears and passes the user&apos;s wallet and market context. Avana handles the loan operations, collateral checks, and settlement.</>{" "}<>{"An adapter provides execution support for an LP format. Collateral admission also requires compatible valuation and liquidation support, so deploying an adapter alone does not enable a pool for borrowing."}</>
          </p>
        </section>

        <section id="integration-model" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Integration Model</h2>
          <div className="space-y-4">
            {integrationPoints.map((item) => (
              <div key={item.title} className="doc-topic">
                <h3 className="mb-2 type-doc-subsection-title">{item.title}</h3>
                <p className="type-doc-body">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="partner-controls" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Partner Controls</h2>
          <p className="mb-4 type-doc-body">
            Partners control the presentation of the borrowing entry point and its surrounding guidance. Those choices affect how users reach the flow; collateral eligibility and transaction checks remain part of Avana.
          </p>
          <ul className="space-y-3 type-doc-body">
            {partnerControls.map((item) => (
              <li key={item} className="doc-topic">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section id="implementation-notes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Implementation Notes</h2>
          <p className="mb-4 type-doc-body">
            An AppKit integration connects an existing position view to the corresponding Avana borrowing flow. The implementation tasks below cover placement, context transfer, and the boundary between the partner interface and Avana&apos;s protocol operations.
          </p>
          <div className="space-y-3 type-doc-body">
            {implementationNotes.map((item) => (
              <p key={item} className="type-doc-code-block">
                {item}
              </p>
            ))}
          </div>
        </section>

        <section id="launch-notes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Launch Notes</h2>
          <p className="mb-4 type-doc-body">
            <>Before enabling the integration, verify the complete path from the partner&apos;s position view to Avana&apos;s borrowing flow. The interface needs to make the selected account, market, and transition to Avana clear.</>{" "}<>Include hidden entry points, direct links, and missing wallet, market, or collateral context in that review. These cases affect whether the flow opens with the information needed to evaluate a borrow.</>
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Developer integration guide for embedding AppKit inside partner product surfaces."
        sectionColor="cyan"
      />
    </div>
  ))
}
