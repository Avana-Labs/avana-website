import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, "copilot", {
    title: "Ask AI",
    description: "How Ask AI combines Aave MCP, Avana's RAG, and product calculations to explain markets and LP-backed positions.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "aave-mcp", title: "Aave MCP" },
  { id: "avana-knowledge", title: "Avana knowledge and RAG" },
  { id: "core-features", title: "Market analysis" },
  { id: "router", title: "From analysis to action" },
]

export default async function DocumentationPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "copilot", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Ask AI"
          description="Aave protocol data, Avana knowledge, and position calculations in one conversational interface."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
            <>Ask AI is Avana&apos;s conversational interface for questions about markets and positions. A request identifies the market, asset, or position to examine, and follow-up questions can clarify the inputs and assumptions. The response explains the available information; protocol checks still determine whether a requested transaction can proceed.</>{" "}<>Wallet-specific questions depend on the selected wallet and network. Public market data describes the market, while balances and positions belong to an account on a particular network. A missing balance, price, or route leaves the associated calculation incomplete.</>
          </p>
          </div>
        </section>

        <section id="aave-mcp" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Aave MCP</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
              Ask AI uses Aave MCP alongside Avana&apos;s own retrieval system and product
              implementation. The Model Context Protocol provides a structured interface to
              external tools. Aave&apos;s server exposes v3 and v4 market information, including
              reserves, rates, available liquidity, and protocol structure. This gives Ask AI
              Aave-specific context for questions that also involve Avana markets or positions.
              See <a href="https://aave.com/agents" className="text-[#01AACF] hover:underline">
                Aave for Agents
              </a>{" "}
              and the <a href="https://aave.com/docs/mcp" className="text-[#01AACF] hover:underline">
                Aave MCP documentation
              </a>{" "}
              for the upstream service and its interfaces.
            </p>
            <p className="type-doc-body">
              Aave data retains its network, protocol version, and reserve context. It does
              not establish that the same collateral or debt asset is enabled in an Avana
              Borrow Spoke. Avana still applies its own pool admission, LP valuation, and
              account checks. A capability offered by the upstream MCP server is also not
              automatically an action exposed by Ask AI: available actions depend on Avana&apos;s
              integration and the supported product flows.
            </p>
          </div>
        </section>

        <section id="avana-knowledge" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Avana knowledge and RAG</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
              Avana&apos;s retrieval-augmented generation (RAG) searches its protocol knowledge
              for material relevant to a question and supplies that material as context for
              the answer. Retrieved passages explain the architecture, collateral rules,
              liquidation process, and product workflows, with source information that lets
              the explanation be traced to its documentation. This supplies protocol knowledge
              rather than live prices; rates and balances come from the relevant data sources.
            </p>
            <p className="type-doc-body">
              Avana&apos;s own position data and calculation logic provide the product-specific
              context. A borrowing question can combine Aave market information, retrieved
              explanations of LP collateral, and calculations for the selected position&apos;s
              debt and borrowing capacity. Each input has a different role: a documentation
              passage explains a rule, a market response reports observed conditions, and a
              position calculation applies the relevant inputs to an account or scenario.
            </p>
          </div>
        </section>

        <section id="core-features" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Market analysis</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
              Market comparisons can include borrowing costs, available liquidity, and collateral requirements. A displayed yield is only one input: debt interest and changes in the LP position also affect the result. Input sources, timestamps, and scenario assumptions provide the context needed to interpret the comparison.
            </p>
          </div>
        </section>

        <section id="router" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">From analysis to action</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
              Analysis and transaction execution are separate steps. For a supported action, the relevant product flow presents the account, network, assets, amounts, and costs for review and requests any required wallet approval. Submission is followed by confirmation and an update to the resulting position.
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
