import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, "copilot/query-example", {
    title: "Prompt Examples",
    description: "Write requests that make the market, position, and intended outcome clear.",
  })
}

const sections = [
  { id: "principles", title: "Ask a specific question" },
  { id: "interpretation", title: "Explore a scenario" },
  { id: "workflow-detailed", title: "Resolve missing details" },
]

export default async function DocumentationPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "copilot/query-example", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Prompt Examples"
          description="Write requests that make the market, position, and intended outcome clear."
        />

        <section id="principles" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Ask a specific question</h2>
          <blockquote className="doc-example">Compare the borrowing cost and health factor for borrowing 1,000 USDC against my selected LP position.</blockquote>
          <div className="doc-prose">
            <p className="type-doc-body">
              This request identifies the intended borrow and links it to a selected collateral position. The asset and amount define the debt being evaluated; the position supplies the collateral context. Asking for the assumptions and included costs makes the result easier to trace to its inputs.
            </p>
          </div>
        </section>

        <section id="interpretation" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Explore a scenario</h2>
          <blockquote className="doc-example">What happens to this position&apos;s health factor if its collateral value falls by 20% while debt stays the same?</blockquote>
          <div className="doc-prose">
            <p className="type-doc-body">
              This scenario changes collateral value while holding debt constant, which isolates its effect on health factor. A larger debt balance or a different LP range would be a separate scenario with different inputs. The result illustrates the stated assumptions; it is not an execution quote or a prediction of returns.
            </p>
          </div>
        </section>

        <section id="workflow-detailed" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Resolve missing details</h2>
          <blockquote className="doc-example">Which network and data timestamp does this estimate use, and which costs are excluded?</blockquote>
          <div className="doc-prose">
            <p className="type-doc-body">
              Network, timestamp, and cost coverage determine what an estimate represents. A follow-up request can resolve missing context before the result is used to prepare an action. The relevant product flow then provides the current transaction terms for review.
            </p>
          </div>
        </section>

        <nav className="doc-topic flex flex-wrap gap-x-6 gap-y-3">
          <Link href="/developers/copilot">Ask AI</Link>
          <Link href="/developers/copilot/workflow">Agent Workflow</Link>
          <Link href="/developers/copilot/query-example">Prompt Examples</Link>
          <Link href="/developers/integrations/router-contract">Router &amp; Adapters</Link>
        </nav>
      </div>
      <DeveloperScrollSpyRail sections={sections} sectionColor="cyan" />
    </div>
  ))
}
