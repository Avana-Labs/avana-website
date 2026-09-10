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
    description: "Developer guide to AppKit placement, partner handoff, and how Avana credit is embedded inside third-party product surfaces without moving risk logic out of Avana.",
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
      "AppKit belongs where users already understand their LP positions, portfolio state, or swap context, so the borrow entry appears next to existing intent instead of forcing a brand-new flow.",
  },
  {
    title: "Protocol handoff",
    body:
      "The partner passes wallet and market context into Avana. The borrow flow can then open with that context already set instead of asking the user to rebuild it by hand.",
  },
  {
    title: "Partner economics",
    body:
      "Partners may use referral, routing, or integration revenue structures, but they do not become the lender or the risk engine. Avana keeps credit, risk, and settlement.",
  },
]

const implementationNotes = [
  "Place the credit entry near the LP position or portfolio view the user already trusts.",
  "Pass wallet and market context into the borrow flow so the handoff does not feel like a reset.",
  "Leave risk and settlement on Avana. Do not rebuild spoke valuation or liquidation logic in the partner UI.",
  "Decide copy, placement, and launch gating before go live because they shape the integration, not just the polish layer.",
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
            AppKit is for third-party products that already own the user relationship, such as
            DEXs, wallets, and portfolio apps where LP positions are already visible. The partner
            product frames the moment, captures context, and decides where the borrow entry appears.
            Avana runs the actual loan path.
          </p>
          <p className="type-doc-body">
            AppKit is for partners that already own the user relationship — DEXs, wallets, and
            portfolio apps where LP positions are already visible. The partner controls placement
            and handoff. Avana runs the actual loan path.
          </p>
        </section>

        <section id="integration-model" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Integration Model</h2>
          <div className="space-y-4">
            {integrationPoints.map((item) => (
              <div key={item.title} className="type-doc-panel">
                <h3 className="mb-2 type-doc-subsection-title">{item.title}</h3>
                <p className="type-doc-body">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="partner-controls" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Partner Controls</h2>
          <p className="mb-4 type-doc-body">
            AppKit does not force one presentation model. Partners control the entry points and the
            amount of surrounding guidance, while leaving protocol decisions inside Avana.
          </p>
          <ul className="space-y-3 type-doc-body">
            {partnerControls.map((item) => (
              <li key={item} className="rounded-lg border border-gray-200 bg-white px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section id="implementation-notes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Implementation Notes</h2>
          <p className="mb-4 type-doc-body">
            The best integrations feel like a continuation of the existing product flow, not a hard
            jump into an unrelated lending app. These notes are the practical baseline for getting
            that handoff right.
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
            Launch AppKit as an integration project, not just a link placement. Confirm the user
            path, review where the entry sits, and make sure the Avana credit path stays clearly
            separated from the partner shell where responsibility changes.
          </p>
          <p className="type-doc-body">
            Also check what happens when the credit surface is hidden, whether deep links into the
            borrow flow are safe, and how missing wallet, market, or collateral context is handled.
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
