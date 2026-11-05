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
      "Partner arrangements can include referral or integration revenue. They do not change borrowing terms on Aave V4, risk parameters, or settlement rules. Avana does not depend on commercial agreements with AMMs.",
  },
]

const implementationNotes = [
  "Associate the borrowing entry point with the LP position or portfolio view that supplies its context.",
  "Pass the relevant wallet and market context into the borrowing flow.",
  "Use LPOracle values and Aave V4 health factors rather than duplicating their calculations in the partner interface.",
  "Define which users can access the entry point and how the interface explains the transition to Avana. During the pilot, only allowlisted depositors can pledge positions.",
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
          description="How partners link users into Avana's GHO borrowing flow. Borrowing, risk and settlement rules stay in the contracts."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>AppKit connects DEXs, wallets, and portfolio applications to Avana&apos;s LP-backed GHO borrowing flow. The partner application selects where the entry point appears and passes the user&apos;s wallet and market context. Borrowing itself runs through the Aave Adapter and the Avana Borrow Spoke on Aave V4. Avana&apos;s contracts handle collateral checks and settlement.</>{" "}<>{"AppKit is a frontend integration. It does not change which pools are approved or how positions are valued or liquidated. Users can also call the contracts directly, without AppKit or Avana's frontend."}</>
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
            Partners control the presentation of the borrowing entry point and its surrounding guidance. Those choices affect how users reach the flow. Collateral eligibility and transaction checks stay in Avana&apos;s contracts and Aave V4.
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
            <>Before enabling the integration, verify the complete path from the partner&apos;s position view to Avana&apos;s borrowing flow. The interface must make the selected account, the market, and the transition to Avana clear.</>{" "}<>Include hidden entry points, direct links, and missing wallet, market, or collateral context in that review. These cases affect whether the flow opens with the information needed to evaluate a borrow.</>
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
