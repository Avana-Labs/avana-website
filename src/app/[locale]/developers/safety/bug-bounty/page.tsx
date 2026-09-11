import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'safety/bug-bounty', {
    title: "Bug Bounty",
    description: "Avana Bug Bounty responsible disclosure scope, LP-collateral risk surfaces, and economic-impact severity philosophy.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "scope-and-system-architecture", title: "Scope & System Architecture" },
  { id: "severity-philosophy", title: "Severity Philosophy" },
]

const programs = [
  {
    title: "Program A - Core Lending",
    summary:
      "Covers the primary credit engine where accounting integrity, collateralization, and liquidation execution directly protect user funds.",
    includes: [
      "Deposit / withdraw flows",
      "Borrow / repay logic",
      "Health factor and interest accrual",
      "Reserve accounting and debt mint / burn",
      "Liquidation core execution and caps",
    ],
    risks: [
      "Theft of user funds",
      "Reserve insolvency",
      "Undercollateralized borrowing",
      "Blocked repayments, withdrawals, or liquidations",
    ],
  },
  {
    title: "Program B - LP Collateral & Valuation",
    summary:
      "Covers the Avana-specific valuation system for LP-backed credit, including how LP positions are priced, risk-weighted, and stress-tested under volatile market conditions.",
    includes: [
      "LP token onboarding logic",
      "Collateral factor assignment for LP positions",
      "LP share pricing and oracle integration",
      "Concentrated liquidity position handling",
      "Edge cases during imbalance, depegs, low liquidity, or stale oracle states",
    ],
    risks: [
      "Overvaluation of LP collateral",
      "Oracle manipulation enabling bad debt",
      "Unfair liquidation from underpricing",
      "Recursive exploit paths against mispriced LP collateral",
    ],
    highlighted: true,
    note: "LP mispricing can have critical economic impact by enabling bad debt, insolvency, or incorrect liquidations, even without direct theft from a contract.",
  },
  {
    title: "Program C - Governance, Admin, and Protocol Infrastructure",
    summary:
      "Covers privileged control surfaces that can alter parameters, upgrade contracts, pause operations, or redirect protocol-owned assets.",
    includes: [
      "Governance executor and timelock",
      "Role management and upgradeability mechanisms",
      "Pause / guardian roles",
      "Parameter admin systems",
      "Treasury, collector, and privileged automation contracts",
    ],
    risks: [
      "Unauthorized admin action",
      "Upgrade hijack",
      "Parameter corruption",
      "Governance takeover or treasury loss",
    ],
  },
  {
    title: "Program D - Offchain / Integration Surfaces",
    summary:
      "Covers supporting systems whose compromise can influence trusted protocol operations, user interactions, or keeper behavior.",
    includes: [
      "Indexing or liquidation bots maintained by Avana",
      "Keeper assumptions and oracle relays",
      "SDK logic that can induce unsafe interactions",
      "Hosted APIs used in safety-critical paths",
      "Frontend issues with direct wallet-risk consequences",
    ],
    risks: [
      "Malicious transaction construction",
      "Compromised liquidation or oracle relay paths",
      "User fund loss through trusted integrations",
      "Operational outages that freeze critical actions",
    ],
  },
]

const severityLevels = [
  {
    title: "Critical",
    style: "border-red-400 bg-red-50/70",
    text: "Direct or indirect fund loss, creation of bad debt, protocol insolvency, or systemic manipulation of collateral valuation.",
  },
  {
    title: "High",
    style: "border-amber-400 bg-amber-50/70",
    text: "Meaningful but bounded damage, such as incorrect liquidation behavior, partial bypass of risk controls, or contained accounting failures.",
  },
  {
    title: "Medium / Low",
    style: "border-gray-300 bg-gray-50",
    text: "Limited-impact findings, edge-case inconsistencies, non-critical logic issues, or vulnerabilities without a credible path to major economic harm.",
  },
]

export default async function BugBountyPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "safety/bug-bounty", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader

          title="Bug Bounty"

          description="Responsible disclosure scope and economic-impact triage guidance for Avana security research."

        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <><>The Avana Bug Bounty covers responsible disclosure across contracts, risk systems, and
            supporting infrastructure that can affect user funds or protocol solvency.</>{" "}<>The scope includes direct contract vulnerabilities and economic failures involving LP collateral. Manipulated prices, insufficient liquidity, or inconsistent position state can affect borrowing capacity or prevent liquidation from recovering debt.</></>{" "}<><strong>Severity is based on economic impact:</strong> assessment considers exploitability and outcomes such as fund loss, insolvency, bad debt, or systemic collateral mispricing. The size of the affected code is not a measure of the potential loss.</>
          </p>
        </section>

        <section id="scope-and-system-architecture" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Scope & System Architecture</h2>
          <p className="mb-6 type-doc-body">
            Reports are grouped by the affected subsystem: core lending, LP valuation, governance and administration, or offchain integrations. The grouping identifies the component involved; severity depends on the demonstrated impact.
          </p>

          <div className="space-y-5">
            {programs.map((program) => (
              <div
                key={program.title}
                className="doc-topic"
              >
                <div className="mb-4 flex flex-col gap-3">
                  <div>
                    <h3 className="text-lg type-doc-subsection-title">{program.title}</h3>
                    <p className="mt-2 type-doc-body">{program.summary}</p>
                  </div>
                  {program.highlighted ? (
                    <span className="text-sm font-medium text-type-secondary">
                      Highest sensitivity
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="mb-2 text-sm type-doc-subsection-title">Includes</h4>
                    <ul className="space-y-2 type-doc-body">
                      {program.includes.map((item) => (
                        <li key={item} className="type-doc-callout">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm type-doc-subsection-title">Primary risks</h4>
                    <ul className="space-y-2 type-doc-body">
                      {program.risks.map((item) => (
                        <li
                          key={item}
                          className={`type-doc-callout pl-3 ${
                            program.highlighted
                              ? "type-doc-callout-danger"
                              : ""
                          }`}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {program.note ? (
                  <p className="mt-4 type-doc-callout type-doc-callout-danger">
                    <strong>Why it matters:</strong> {program.note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          <p className="mt-6 type-doc-body">
            Subsystems are triaged separately, but impact is still scored across solvency, user fund
            safety, liquidation integrity, and related protocol risk.
          </p>
        </section>

        <section id="severity-philosophy" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Severity Philosophy</h2>
          <p className="mb-6 type-doc-body">
            Severity assessment considers a credible exploit path and the economic harm it could cause, rather than relying only on a generic vulnerability score.
          </p>

          <div className="space-y-4">
            {severityLevels.map((level) => (
              <div
                key={level.title}
                className="doc-topic"
              >
                <h3 className="mb-1 type-doc-subsection-title">{level.title}</h3>
                <p className="type-doc-body">{level.text}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 type-doc-body">
            A finding that enables LP overvaluation or bad debt can be critical even if it affects little code. Findings without a credible path to significant economic harm receive a lower severity assessment.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Responsible disclosure scope, LP-collateral risk surfaces, and economic-impact triage for Avana."
        sectionColor="rose"
      />
    </div>
  ))
}
