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
            <>Ask AI is Avana&apos;s conversational interface for questions about markets and positions. A request names the market, asset, or position to examine. Follow-up questions can clarify the inputs and assumptions. The response explains the available information. Protocol checks still determine whether a requested transaction can proceed.</>{" "}<>Avana supports borrowing GHO and other enabled debt assets against Uniswap v3 positions on Ethereum and Aerodrome Slipstream positions on Base.</>{" "}<>Wallet-specific questions depend on the selected wallet and network. Public market data describes the market. Balances and positions belong to an account on a particular network. A missing balance, price, or route leaves the associated calculation incomplete.</>
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
              See <a href="https://aave.com/agents" className="text-type-accent hover:underline">
                Aave for Agents
              </a>{" "}
              and the <a href="https://aave.com/docs/mcp" className="text-type-accent hover:underline">
                Aave MCP documentation
              </a>{" "}
              for the upstream service and its interfaces.
            </p>
            <p className="type-doc-body">
              Aave data keeps its network, protocol version, and reserve context. It does not
              show that an asset is available in an Avana market. Avana CDP Spokes accept only
              vault tokens for approved Uniswap v3 positions on Ethereum and Aerodrome Slipstream
              positions on Base as collateral, and lend GHO and the debt assets enabled for each
              Spoke. Avana still applies its own market listing, LP valuation, and
              account checks. A capability of the upstream MCP server is not automatically an
              action in Ask AI. Available actions depend on Avana&apos;s integration and the
              supported product flows.
            </p>
          </div>
        </section>

        <section id="avana-knowledge" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Avana knowledge and RAG</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
              Avana&apos;s retrieval-augmented generation (RAG) searches Avana&apos;s protocol
              knowledge for material relevant to a question. It supplies that material as context
              for the answer. Retrieved passages explain the architecture, collateral rules,
              liquidation process, and product workflows. Each passage includes source
              information, so the explanation can be traced to its documentation. RAG supplies
              protocol knowledge, not live prices. Rates and balances come from the relevant data
              sources.
            </p>
            <p className="type-doc-body">
              Avana&apos;s own position data and calculation logic provide the product-specific
              context. A borrowing question can combine Aave market information, retrieved
              explanations of LP collateral, and calculations for the selected position&apos;s
              GHO debt and borrowing capacity. Each input has a different role. A documentation
              passage explains a rule. A market response reports observed conditions. A position
              calculation applies the relevant inputs to an account or scenario.
            </p>
          </div>
        </section>

        <section id="core-features" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Market analysis</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
              Market comparisons can include the borrowing rate (BaseRate × (1 + UserRiskPremium)), the debt asset available to each CDP Spoke, and each market&apos;s Collateral Factor. A displayed fee yield is only one input. Debt interest and changes in the LP position also affect the result. Borrowers still bear impermanent loss, price risk, and liquidation risk. Input sources, timestamps, and scenario assumptions give the context needed to interpret the comparison.
            </p>
          </div>
        </section>

        <section id="router" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">From analysis to action</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
              Analysis and transaction execution are separate steps. For a supported action, the relevant product flow shows the account, network, assets, amounts, and costs for review. It then requests any required wallet approval. After submission, the transaction is confirmed and the position updates. In the sandbox at app.avana.cc, results are simulated and no onchain transaction is submitted.
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
