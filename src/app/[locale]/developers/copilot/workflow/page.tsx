import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { MessageSquare, Brain, Database, Calculator, BarChart3, RefreshCw } from "lucide-react"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, "copilot/workflow", {
    title: "Agent Workflow",
    description:
      "The end-to-end workflow Avana's Ask AI follows to turn intent into secure, optimized on-chain results.",
  })
}

const sections = [
  { id: "query-processing", title: "Query Processing" },
  { id: "analysis-engine", title: "Analysis Engine" },
  { id: "oracle-integration", title: "Oracle Integration" },
  { id: "decision-engine", title: "Decision Engine" },
  { id: "trade-execution", title: "Trade Execution" },
  { id: "feedback-system", title: "Feedback System" },
]

type Step = {
  id: string
  step: string
  icon: LucideIcon
  label: string
  title: string
  body: ReactNode
}

const steps: Step[] = [
  {
    id: "query-processing",
    step: "01",
    icon: MessageSquare,
    label: "Query Processing",
    title: "Conversational intelligence",
    body: (
      <ul className="space-y-2 type-doc-body">
        <li><span className="font-medium text-gray-900">Natural language interface.</span> Ask questions like &ldquo;What is Aave&apos;s current borrowing APR?&rdquo; or issue commands such as &ldquo;Swap ETH for USDC when gas drops below 10 Gwei.&rdquo;</li>
        <li><span className="font-medium text-gray-900">Multi-query support.</span> Handle market analysis, strategy validation, direct execution commands, and portfolio optimization in one request.</li>
        <li><span className="font-medium text-gray-900">Validation layer.</span> Checks input integrity, user authentication, and compliance before anything proceeds.</li>
      </ul>
    ),
  },
  {
    id: "analysis-engine",
    step: "02",
    icon: Brain,
    label: "Analysis Engine",
    title: "Turning context into actionable insight",
    body: (
      <>
        <ul className="space-y-2 type-doc-body">
          <li><span className="font-medium text-gray-900">Intent classification.</span> Identifies the goal, such as arbitrage or liquidity migration.</li>
          <li><span className="font-medium text-gray-900">Parameter extraction.</span> Gathers assets, timeframes, and risk tolerances.</li>
          <li><span className="font-medium text-gray-900">Risk &amp; strategy validation.</span> Cross-checks the request against historical data and preferences for viability.</li>
        </ul>
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Ask AI does not account for personal financial goals. Always validate suggestions against your own risk profile.
        </p>
      </>
    ),
  },
  {
    id: "oracle-integration",
    step: "03",
    icon: Database,
    label: "Oracle Integration",
    title: "Real-time data, real-world context",
    body: (
      <>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="type-doc-panel">
            <h4 className="type-doc-subsection-title mb-1">On-chain metrics</h4>
            <p className="type-doc-body">Real-time prices, liquidity depths, large-wallet activity, gas trends, and contract interactions.</p>
          </div>
          <div className="type-doc-panel">
            <h4 className="type-doc-subsection-title mb-1">Market indicators</h4>
            <p className="type-doc-body">Volume and momentum analysis, sentiment scores, and volatility indices.</p>
          </div>
        </div>
        <p className="mt-3 type-doc-body">
          This lets users define compound triggers, such as &ldquo;initiate ETH staking when APR is above 5%, gas is under 15 Gwei, and sentiment turns positive.&rdquo;
        </p>
      </>
    ),
  },
  {
    id: "decision-engine",
    step: "04",
    icon: Calculator,
    label: "Decision Engine",
    title: "Risk-aware execution planning",
    body: (
      <>
        <ul className="space-y-2 type-doc-body">
          <li><span className="font-medium text-gray-900">Risk assessment.</span> Evaluates volatility, liquidity gaps, and slippage modeling.</li>
          <li><span className="font-medium text-gray-900">Opportunity validation.</span> Assesses profit potential, cost-benefit ratios, and timing.</li>
        </ul>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="type-doc-panel text-sm">
            <span className="type-doc-subsection-title">Time-based</span>
            <p className="mt-1 type-doc-body">&ldquo;Unstake assets after 7 days.&rdquo;</p>
          </div>
          <div className="type-doc-panel text-sm">
            <span className="type-doc-subsection-title">Gas-based</span>
            <p className="mt-1 type-doc-body">&ldquo;Claim rewards only if Gwei is under 10.&rdquo;</p>
          </div>
          <div className="type-doc-panel text-sm">
            <span className="type-doc-subsection-title">Price-based</span>
            <p className="mt-1 type-doc-body">&ldquo;Sell 50% if BTC drops below $60K.&rdquo;</p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "trade-execution",
    step: "05",
    icon: BarChart3,
    label: "Trade Execution",
    title: "Precision and security in every transaction",
    body: (
      <div className="space-y-3 type-doc-body">
        <p><span className="font-medium text-gray-900">Pre-execution checklist.</span> Verifies balances, optimizes gas, and prioritizes the routing path.</p>
        <p><span className="font-medium text-gray-900">Transaction flow.</span> Interacts with the relevant contracts, handles signing and network broadcast, and monitors confirmations in real time.</p>
        <p><span className="font-medium text-gray-900">Supported actions.</span> Executes a wide range of operations across lending, staking, and yield protocols.</p>
      </div>
    ),
  },
  {
    id: "feedback-system",
    step: "06",
    icon: RefreshCw,
    label: "Feedback System",
    title: "Continuous improvement and transparency",
    body: (
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="type-doc-panel">
          <h4 className="type-doc-subsection-title mb-1">Post-trade analytics</h4>
          <p className="type-doc-body">Execution audit with confirmation status, finalized vs. expected price, gas breakdown, and slippage analysis.</p>
        </div>
        <div className="type-doc-panel">
          <h4 className="type-doc-subsection-title mb-1">User reporting</h4>
          <p className="type-doc-body">Real-time alerts, performance dashboards, and strategy-tweak suggestions based on evolving conditions.</p>
        </div>
      </div>
    ),
  },
]

export default async function CopilotWorkflowPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "copilot/workflow", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Agent Workflow"
          description="Ask AI's end-to-end workflow translates intent into secure, optimized results. Here is how a request moves from question to outcome."
        />

        <div className="space-y-12">
          {steps.map(({ id, step, icon: Icon, label, title, body }) => (
            <section key={id} id={id} className="scroll-mt-32">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-sm font-semibold text-[#01AACF]">
                  {step}
                </div>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-[#01AACF]" />
                  <span className="text-xs font-medium uppercase tracking-wide text-[#01AACF]">{label}</span>
                </div>
              </div>
              <h2 className="mb-3 type-doc-section-title">{title}</h2>
              {body}
            </section>
          ))}
        </div>

        <div className="mt-10 type-doc-panel">
          <h2 className="mb-2 type-doc-section-title">From question to outcome</h2>
          <p className="type-doc-body">
            Ask AI goes beyond simple trade execution. It turns unstructured queries into
            auditable, optimized strategies, with every action backed by real-time data and executed
            through the router&apos;s standardized protocol adapters.
          </p>
        </div>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="A six-stage pipeline: parse the request, analyze it, gather data, plan a risk-aware decision, execute, and report back."
        sectionColor="cyan"
      />
    </div>
  ))
}
