import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, "copilot/workflow", {
    title: "Agent Workflow",
    description: "Follow a request from its initial context through review and verification.",
  })
}

const sections = [
  { id: "query-processing", title: "Define the request" },
  { id: "analysis-engine", title: "Review the analysis" },
  { id: "trade-execution", title: "Approve and verify" },
]

export default async function DocumentationPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "copilot/workflow", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Agent Workflow"
          description="Follow a request from its initial context through review and verification."
        />

        <section id="query-processing" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Define the request</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
              A request establishes the asset, network, amount, and position being considered. It also distinguishes an explanation or simulation from a request to prepare an action. Missing or ambiguous details need to be resolved before the request can be used in an execution flow.
            </p>
          </div>
        </section>

        <section id="analysis-engine" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Review the analysis</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
              The request determines which context is needed: Avana&apos;s RAG supplies protocol
              explanations, Aave MCP provides relevant Aave market information, and Avana&apos;s
              product logic handles position calculations. Market rates change, quotes expire,
              and balances differ across networks. The selected account, source timestamps,
              missing inputs, and scenario assumptions therefore affect how the result can be
              interpreted, especially when comparing a simulation with a live position.
            </p>
          </div>
        </section>

        <section id="trade-execution" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Approve and verify</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
              A supported transaction moves through preparation, submission, and confirmation. The product flow provides the transaction review and any required wallet approval. After confirmation, the updated balances and debt show the effect on the position.
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
