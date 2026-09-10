import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { MessageSquare, Layers, Info, CheckCircle, XCircle } from "lucide-react"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, "copilot/query-example", {
    title: "Prompt Examples",
    description:
      "How to craft precise, actionable prompts for Avana's Ask AI, with end-to-end workflow examples.",
  })
}

const sections = [
  { id: "principles", title: "Core Principles" },
  { id: "interpretation", title: "How Prompts Are Read" },
  { id: "mistakes", title: "Common Mistakes" },
  { id: "workflow-detailed", title: "Worked Examples" },
  { id: "workflow-more", title: "More Scenarios" },
]

const principles: Array<{ icon: typeof MessageSquare; title: string; intro: string; examples: string[] }> = [
  {
    icon: MessageSquare,
    title: "Clarity",
    intro: "Be specific. Instead of “manage my staking,” use:",
    examples: ["@lido (Ethereum): Stake 5 ETH"],
  },
  {
    icon: Layers,
    title: "Modularity",
    intro: "Break complex tasks into sequential steps:",
    examples: ["@uniswapV3 (Polygon): Swap 1 ETH for USDC", "@curve (Polygon): Provide liquidity with USDC"],
  },
  {
    icon: Info,
    title: "Context",
    intro: "Explicitly define networks, assets, and thresholds:",
    examples: ["@aaveV3 (Arbitrum): Borrow 1000 DAI when borrowing rate < 5%"],
  },
]

const interpretation = [
  { title: "Attributes", body: "Protocols, networks, tokens, amounts, and conditions." },
  { title: "Intent", body: "Swap, stake, borrow, migrate, or lend." },
  { title: "Execution plan", body: "Step-by-step with safety checks for gas, slippage, and balance." },
]

const detailedSteps = [
  {
    title: "User query",
    body: "The user enters the request through an interface such as a web app, chatbot, or terminal.",
    terminal: "> Check the price of ETH and buy 1 ETH if it's below $1,800.",
  },
  {
    title: "Off-chain processing",
    body: "Ask AI parses the request into a target asset (ETH), a condition (price < $1,800), and an action (buy 1 ETH), then determines it needs real-time price data.",
  },
  {
    title: "Oracle data fetch",
    body: "Ask AI triggers an oracle query via middleware, and the oracle returns the current price.",
  },
  {
    title: "Decision-making",
    body: "It evaluates the condition: if ETH is below $1,800 it proceeds; otherwise it halts and reports that no trade was executed.",
  },
  {
    title: "Trade execution",
    body: "When the condition is met, Ask AI prepares the transaction, signs it securely, and submits it to the network.",
  },
  {
    title: "On-chain result",
    body: "The network processes the transaction and the trade settles.",
    terminal: "> Trade executed. You bought 1 ETH at $1,790.",
  },
]

const moreScenarios: Array<{ title: string; scenario: string; checks: Array<{ ok: boolean; text: string }>; result: string; tone: "ok" | "warn" }> = [
  {
    title: "Multi-condition trade",
    scenario: "“If ETH < $1,700 and gas < 50 gwei, buy 2 ETH.”",
    checks: [
      { ok: true, text: "ETH price ($1,680) < $1,700" },
      { ok: true, text: "Gas fee (45 gwei) < 50 gwei" },
    ],
    result: "> Trade executed. You bought 2 ETH at $1,680 with 45 gwei gas.",
    tone: "ok",
  },
  {
    title: "Whale-activity trigger",
    scenario: "“Buy $1,000 of ETH only if whale activity shows large ETH sells in the past hour.”",
    checks: [{ ok: true, text: "Several large ETH sales detected" }],
    result: "> Trade executed. Purchased 0.595 ETH ($1,000) based on detected whale activity.",
    tone: "ok",
  },
  {
    title: "Condition not met",
    scenario: "“Sell 2 ETH if price is above $2,000, but only if gas is below 30 gwei.”",
    checks: [
      { ok: true, text: "Gas fee (25 gwei) < 30 gwei" },
      { ok: false, text: "ETH price ($1,980) is not above $2,000" },
    ],
    result: "> No trade executed. ETH is $1,980, below your $2,000 target.",
    tone: "warn",
  },
  {
    title: "Stop-loss execution",
    scenario: "“Sell 3 ETH if the price drops below $1,600 as a stop-loss.”",
    checks: [{ ok: true, text: "Price dropped to $1,590, stop-loss triggered" }],
    result: "> Stop-loss executed. Sold 3 ETH at $1,590 to mitigate losses.",
    tone: "ok",
  },
]

function Terminal({ children }: { children: string }) {
  return (
    <pre className="type-doc-code-block-dark mt-2 text-cyan-300">
      {children}
    </pre>
  )
}

export default async function CopilotQueryExamplePage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "copilot/query-example", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Prompt Examples"
          description="Craft precise, actionable prompts so Ask AI executes exactly what you intend."
        />

        <section id="principles" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Core Principles</h2>
          <div className="space-y-4">
            {principles.map(({ icon: Icon, title, intro, examples }) => (
              <div key={title} className="type-doc-panel">
                <div className="mb-2 flex items-center gap-2.5">
                  <Icon className="h-5 w-5 text-[#01AACF]" />
                  <h3 className="type-doc-subsection-title">{title}</h3>
                </div>
                <p className="mb-2 type-doc-body">{intro}</p>
                <div className="space-y-1.5">
                  {examples.map((ex) => (
                    <code key={ex} className="type-doc-code-block block">
                      {ex}
                    </code>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="interpretation" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">How Prompts Are Read</h2>
          <p className="mb-4 type-doc-body">
            Ask AI breaks each prompt into three components before it acts.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {interpretation.map(({ title, body }) => (
              <div key={title} className="type-doc-panel">
                <h3 className="mb-1 type-doc-subsection-title">{title}</h3>
                <p className="type-doc-body">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="mistakes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Common Mistakes</h2>
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
            <ul className="space-y-2 type-doc-body">
              <li className="flex items-start gap-2">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                <span><span className="font-semibold">Missing network.</span> &ldquo;@makerdao: Repay DAI loan&rdquo; fails without a network.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                <span><span className="font-semibold">Ambiguous amounts.</span> &ldquo;Withdraw some tokens&rdquo; is rejected.</span>
              </li>
            </ul>
          </div>
        </section>

        <section id="workflow-detailed" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Worked Example</h2>
          <p className="mb-6 type-doc-body">
            A price-conditional trade, from prompt to settlement.
          </p>
          <ol className="space-y-6">
            {detailedSteps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-sm font-semibold text-[#01AACF]">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <h3 className="type-doc-subsection-title">{s.title}</h3>
                  <p className="mt-1 type-doc-body">{s.body}</p>
                  {s.terminal ? <Terminal>{s.terminal}</Terminal> : null}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="workflow-more" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">More Scenarios</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {moreScenarios.map((w) => (
              <div key={w.title} className="flex flex-col rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="type-doc-subsection-title">{w.title}</h3>
                <p className="mt-2 type-doc-body">{w.scenario}</p>
                <ul className="mt-3 space-y-1.5">
                  {w.checks.map((c) => (
                    <li key={c.text} className="flex items-start gap-2 type-doc-body">
                      {c.ok ? (
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      ) : (
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                      )}
                      <span>{c.text}</span>
                    </li>
                  ))}
                </ul>
                <pre
                  className={`type-doc-code-block-dark mt-3 text-xs ${
                    w.tone === "warn" ? "text-amber-300" : "text-cyan-300"
                  }`}
                >
                  {w.result}
                </pre>
              </div>
            ))}
          </div>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Prompt-writing principles plus worked examples showing how conditional intent becomes an audited on-chain action."
        sectionColor="cyan"
      />
    </div>
  ))
}
