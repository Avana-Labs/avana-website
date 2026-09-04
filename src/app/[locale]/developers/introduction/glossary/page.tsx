import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'introduction/glossary', {
    title: "Glossary",
    description: "DeFi glossary for Avana - definitions of Spoke, Hub, LP NFT, collateral factor, debt shares, liquidation, oracle, and other protocol terms.",
  })
}

const sections = [
  { id: "core-concepts", title: "Core Concepts" },
  { id: "protocol-components", title: "Protocol Components" },
  { id: "financial-terms", title: "Financial Terms" },
  { id: "risk-security", title: "Risk & Security" },
  { id: "metrics", title: "Metrics" },
  { id: "disclaimers", title: "Disclaimers" },
]

const glossaryTerms = {
  coreComponents: [
    {
      term: "Borrow Spoke",
      definition:
        "The borrower-facing Avana spoke that receives LP collateral, values positions, tracks debt, and coordinates borrowing and liquidation against Hub liquidity.",
    },
    {
      term: "Lend Spoke",
      definition:
        "The lender-facing capital entry point that routes supplied assets into the Hub so Borrow Spokes can draw shared liquidity.",
    },
    {
      term: "Hub",
      definition:
        "The shared monetary layer in Aave v4 that manages liquidity, reserves, accounting, and protocol-wide capital coordination across connected spokes.",
    },
    {
      term: "Hub-and-Spoke Architecture",
      definition:
        "A design where shared capital lives in the Hub while collateral-specific logic is isolated in spokes. Avana uses this model because LP collateral needs DEX-specific valuation and liquidation behavior.",
    },
    {
      term: "Liquidation Node",
      definition:
        "A protocol-operated runtime that indexes active positions and serves as a specialized liquidation backstop for complex LP collateral.",
    },
  ],
  lpAndCollateral: [
    {
      term: "LP Position",
      definition:
        "A liquidity position from a supported AMM. Depending on the DEX, it may be a fungible LP token, a concentrated-liquidity NFT, or another approved pool-share format.",
    },
    {
      term: "Collateral Factor",
      definition:
        "The portion of USD collateral value that may count toward borrowing power. In LP markets, this is applied at the position level rather than to the spoke as a whole.",
    },
    {
      term: "Borrowing Capacity",
      definition:
        "The amount a user can borrow inside a Borrow Spoke after each deposited LP position has been valued, risk-adjusted, and added to the user’s aggregate capacity.",
    },
    {
      term: "Allowed Pool",
      definition:
        "A governance-approved pool that meets admissibility requirements such as oracle coverage, liquidity depth, unwind quality, and spoke compatibility.",
    },
    {
      term: "Loan-to-Value (LTV)",
      definition:
        "The borrowing ratio associated with collateral after Avana’s position valuation and pool-specific risk controls have been applied.",
    },
  ],
  debtAndInterest: [
    {
      term: "Debt Shares",
      definition:
        "The internal accounting unit used to track borrower obligations while interest accrues over time without rewriting every loan balance continuously.",
    },
    {
      term: "Borrow Rate",
      definition:
        "The rate borrowers pay on outstanding debt. It reflects both shared Hub conditions and LP-specific risk considerations.",
    },
    {
      term: "Utilization Rate",
      definition:
        "The proportion of borrowed liquidity relative to available supply in the relevant Hub-connected capital layer.",
    },
    {
      term: "Risk Premium",
      definition:
        "The risk-specific component layered on top of base borrowing conditions to reflect the LP collateral profile being financed.",
    },
    {
      term: "Reserve Factor",
      definition:
        "The portion of protocol economics or interest flows reserved for the system rather than passed through entirely to liquidity suppliers.",
    },
  ],
  liquidationTerms: [
    {
      term: "Health Factor",
      definition:
        "The ratio between adjusted collateral value and outstanding debt inside a Borrow Spoke. When it falls too low, the position approaches liquidation eligibility.",
    },
    {
      term: "Liquidation",
      definition:
        "The process of repaying debt against an unhealthy LP-backed position, unwinding enough collateral to restore solvency, and returning any residual value after settlement.",
    },
    {
      term: "Liquidation Bonus",
      definition:
        "The liquidation premium paid to the party that executes the unwind, compensating them for capital use, routing complexity, and execution risk.",
    },
  ],
  oracleAndTransform: [
    {
      term: "Oracle",
      definition:
        "Avana’s valuation engine for LP collateral. It combines external asset prices, LP position reconstruction, and recoverable-value safeguards.",
    },
    {
      term: "Recoverable Value",
      definition:
        "The amount the protocol believes can realistically be realized during a stressed unwind after liquidation slippage, pool conditions, and risk buffers are considered.",
    },
    {
      term: "Transform",
      definition:
        "A controlled modification of a collateralized LP position, such as a rebalance or range change, that is only allowed when the resulting position still satisfies protocol health checks.",
    },
  ],
  metrics: [
    { term: "TVL", definition: "Total value of assets supplied as LP collateral or capital across Avana-connected components." },
    { term: "Outstanding Debt", definition: "The amount currently borrowed against approved collateral positions." },
    { term: "Borrow Utilization", definition: "The share of available Hub liquidity that has been drawn by borrowers." },
    { term: "Borrowing Headroom", definition: "The difference between a user’s current debt and remaining aggregate borrowing capacity inside a Borrow Spoke." },
    { term: "Residual Value", definition: "Any value left in a position after debt, liquidation premium, and execution costs have been settled." },
  ],
  riskMitigation: [
    {
      term: "Pool Approval",
      definition:
        "The rule that only pre-approved pools may be admitted as collateral, limiting exposure to unsupported or weakly monitored markets.",
    },
    {
      term: "Recovery Haircut",
      definition:
        "A valuation discount applied so borrow power reflects recoverable unwind value rather than optimistic theoretical NAV.",
    },
    {
      term: "Exposure Caps",
      definition:
        "Risk limits that bound borrowable exposure by pool family, collateral class, or liquidity depth.",
    },
    {
      term: "Circuit Breaker",
      definition:
        "A risk control that can pause or restrict actions when prices, market behavior, or protocol dependencies become inconsistent or unsafe.",
    },
    {
      term: "Governance Safety",
      definition:
        "The set of review, timelock, veto, and emergency roles used by the Risk Framework to keep parameter changes disciplined.",
    },
    {
      term: "Reentrancy Protection",
      definition:
        "The contract-level protection that prevents a state-changing workflow from being entered again before the first execution is complete.",
    },
  ],
}

export default async function GlossaryPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "introduction/glossary", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      {/* Main content */}
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader title="Glossary" />

        <section id="core-concepts" className="mb-10">
          <h2 className="type-doc-section-title mb-6 pb-2 border-b border-gray-200">
            Core Concepts
          </h2>
          <dl className="space-y-4">
            {glossaryTerms.coreComponents.map((item) => (
              <div key={item.term} className="group">
                <dt className="type-doc-subsection-title mb-1">{item.term}</dt>
                <dd className="type-doc-body pl-4 border-l-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="protocol-components" className="mb-10">
          <h2 className="type-doc-section-title mb-6 pb-2 border-b border-gray-200">
            LP & Collateral
          </h2>
          <dl className="space-y-4">
            {glossaryTerms.lpAndCollateral.map((item) => (
              <div key={item.term} className="group">
                <dt className="type-doc-subsection-title mb-1">{item.term}</dt>
                <dd className="type-doc-body pl-4 border-l-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="financial-terms" className="mb-10">
          <h2 className="type-doc-section-title mb-6 pb-2 border-b border-gray-200">
            Debt & Interest
          </h2>
          <dl className="space-y-4">
            {glossaryTerms.debtAndInterest.map((item) => (
              <div key={item.term} className="group">
                <dt className="type-doc-subsection-title mb-1">{item.term}</dt>
                <dd className="type-doc-body pl-4 border-l-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="text-xl type-doc-subsection-title mt-8 mb-4">Liquidation</h3>
          <dl className="space-y-4">
            {glossaryTerms.liquidationTerms.map((item) => (
              <div key={item.term} className="group">
                <dt className="type-doc-subsection-title mb-1">{item.term}</dt>
                <dd className="type-doc-body pl-4 border-l-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="text-xl type-doc-subsection-title mt-8 mb-4">Oracle & Transform</h3>
          <dl className="space-y-4">
            {glossaryTerms.oracleAndTransform.map((item) => (
              <div key={item.term} className="group">
                <dt className="type-doc-subsection-title mb-1">{item.term}</dt>
                <dd className="type-doc-body pl-4 border-l-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="risk-security" className="mb-10">
          <h2 className="type-doc-section-title mb-6 pb-2 border-b border-gray-200">
            Risk & Security
          </h2>
          <dl className="space-y-4">
            {glossaryTerms.riskMitigation.map((item) => (
              <div key={item.term} className="group">
                <dt className="type-doc-subsection-title mb-1">{item.term}</dt>
                <dd className="type-doc-body pl-4 border-l-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="metrics" className="mb-10">
          <h2 className="type-doc-section-title mb-6 pb-2 border-b border-gray-200">
            Metrics
          </h2>
          <dl className="space-y-4">
            {glossaryTerms.metrics.map((item) => (
              <div key={item.term} className="group">
                <dt className="type-doc-subsection-title mb-1">{item.term}</dt>
                <dd className="type-doc-body pl-4 border-l-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="disclaimers" className="mb-10">
          <h2 className="type-doc-section-title mb-6 pb-2 border-b border-gray-200">
            Disclaimers
          </h2>
          <div className="type-doc-callout type-doc-callout-warning">
            <ul className="type-doc-body space-y-2">
              <li><strong>No Investment Advice:</strong> Avana is a software protocol. This documentation does not constitute investment advice.</li>
              <li><strong>Risk of Loss:</strong> Users can lose funds through smart contract vulnerabilities, market volatility, liquidation, or oracle manipulation.</li>
              <li><strong>Regulatory Status:</strong> The regulatory status of Avana and its tokens (if any) is not guaranteed and may vary by jurisdiction.</li>
              <li><strong>No Warranty:</strong> The software is provided &quot;as is&quot; without warranty of any kind.</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Right scroll-spy sidebar */}
      <DeveloperScrollSpyRail 
        sections={sections} 
        sectionColor="blue"
      />
    </div>
  ))
}
