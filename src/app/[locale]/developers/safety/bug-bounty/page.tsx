import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'safety/bug-bounty', {
    title: "Bug Bounty",
    description: "Responsible disclosure scope for Avana's contracts, deployment operations and supporting services, what is out of scope, and how findings are graded by economic impact.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "scope-and-system-architecture", title: "Scope & System Architecture" },
  { id: "out-of-scope", title: "Out of Scope" },
  { id: "severity-philosophy", title: "Severity Philosophy" },
]

const programs = [
  {
    title: "Program A - Custody and Aave V4 Integration",
    summary:
      "Covers Avana's contracts that hold LP positions, keep the backing ledger, issue vault tokens and connect them to the Avana Hubs and CDP Spokes. The Hubs and Spokes themselves are standard Aave V4 contracts owned by the Aave DAO.",
    includes: [
      "LPVault, one per AMM protocol per chain: custody, fee collection, liquidity removal and position return",
      "Collateralization: the backing ledger, exposure counters, and the seizure share-drop and supply-drop checks",
      "VaultToken and VaultTokenFactory: minting, burning and the transfer rule that sends seized tokens only to LPVaultSwap",
      "PositionProxy and ProxyManager: proxy creation, binding to wallet, Spoke and market, and the Adapter-only call path",
      "AaveAdapter: pledge, borrow, repay, withdraw, partial removal, re-credit, repay with collateral and pause enforcement",
      "Lock: the shared reentrancy lock and its two members",
    ],
    risks: [
      "Theft of LP positions held in an LPVault, or a position returned to anyone but its depositor of record",
      "Vault-token supply without matching liquidity",
      "Borrowing without sufficient collateral, or past Aave's health factor or the draw caps",
      "Blocked repayments, debt-free withdrawals, fee collection or liquidations",
    ],
  },
  {
    title: "Program B - LP Valuation, Risk Checks and Liquidation",
    summary:
      "Covers how Avana prices vault tokens and debt assets, checks eligibility and caps, and settles LP collateral during liquidation.",
    includes: [
      "RiskModule: eligibility, caps, the top-up slice, circuit breakers and the configuration drift check",
      "LPOracle: fair-composition pricing from Chainlink, TWAP and second-source checks, and the price states",
      "DebtOracle: the price source of each non-GHO debt reserve",
      "LPVaultSwap: liquidation through its single entry point open to any caller, repay with collateral and pending settlement",
      "Swap routes from unwound tokens into each debt asset",
      "The IFlashSource implementation that flash-borrows from the Aave V3 Pool for repay with collateral",
      "PayoutEscrow: the payout escrow for an Avana fee, borrower surplus, residue or dust leg a token refuses",
    ],
    risks: [
      "Overvaluation of LP collateral or undervaluation of debt",
      "Oracle manipulation enabling bad debt",
      "Unfair liquidation from underpricing, or seizure of a healthy account",
      "Settlement that leaves debt unpaid, vault tokens unbacked, or payouts misdirected",
    ],
    highlighted: true,
    note: "LP mispricing can have critical economic impact by enabling bad debt, insolvency, or incorrect liquidations, even without direct theft from a contract.",
  },
  {
    title: "Program C - Governance, Configuration and Upgrades",
    summary:
      "Covers the privileged controls over Avana's own contracts and the operations that deploy and configure them.",
    includes: [
      "AvanaTimelock and AvanaRoles: delays, the short-delay list, cancel rights and role administration",
      "MarketRegistry: markets, debt reserves, routes, pause states, address freeze, breakers and standby routes",
      "ParameterStore: parameter bounds, tighten and loosen setters and loosening steps",
      "Deployment scripts and AvanaTimelock operations, including deployment and initialization order, the role map, the short-delay list and the listing batches",
      "The Aave-side settings Avana depends on in the Aave DAO deployment and listing payloads",
    ],
    risks: [
      "Bypass of the timelock or of its required delay",
      "Unauthorized role grant, or a role held outside the role table",
      "Parameter corruption or a loosening beyond its step",
      "A guardian power that reaches exits, liquidation or funds",
    ],
  },
  {
    title: "Program D - Off-chain and Integration Surfaces",
    summary:
      "Covers supporting systems whose compromise can influence what users sign or how liquidations run. These are reviewed with a lighter review than the contracts.",
    includes: [
      "The packages/protocol calldata builders: targets, approvals, receivers and amounts",
      "Avana's keeper",
      "The Convex backend",
      "The Lens read-only views",
      "Frontend issues with direct wallet-risk consequences",
    ],
    risks: [
      "Malicious or wrong transaction construction",
      "Compromised keeper or monitoring paths",
      "User fund loss through trusted integrations",
      "Wrong health factors, prices or backing shown to users or keepers",
    ],
  },
]

const severityLevels = [
  {
    key: "critical",
    title: <>Critical</>,
    text: "Loss of collateral or unbacked debt with no precondition beyond an upgrade or a public call.",
  },
  {
    key: "high",
    title: <>High</>,
    text: "Loss or a protocol-wide halt under a plausible condition.",
  },
  {
    key: "medium",
    title: <>Medium</>,
    text: "Bounded loss, griefing or liveness loss in one market.",
  },
  {
    key: "low",
    title: <>Low</>,
    text: "Dust-level loss or a narrow condition.",
  },
  {
    key: "informational",
    title: <>Informational</>,
    text: "Confirms a design decision; no loss.",
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
            This page describes the scope for responsible disclosure across Avana&apos;s own contracts, deployment operations and supporting services. Program terms, rewards, platform and start date are announced separately.
          </p>
          <p className="mb-4 type-doc-body">
            The scope includes direct contract vulnerabilities and economic failures involving LP collateral. Manipulated prices, insufficient liquidity, or vault tokens that no longer match the liquidity in an LPVault can affect borrowing capacity or prevent liquidation from recovering debt.
          </p>
          <p className="type-doc-body">
            <strong>Severity is based on economic impact.</strong> The assessment considers exploitability and outcomes such as fund loss, unbacked debt, insolvency or systemic collateral mispricing. The size of the affected code is not a measure of the potential loss.
          </p>
        </section>

        <section id="scope-and-system-architecture" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Scope & System Architecture</h2>
          <p className="mb-4 type-doc-body">
            Every Avana contract written from the specification is in scope, together with the deployment scripts, the timelock operations and the calldata builders. Reports are grouped by the affected subsystem. The grouping identifies the component involved; severity depends on the demonstrated impact.
          </p>

          <div className="space-y-5">
            {programs.map((program) => (
              <div key={program.title} className="doc-topic">
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
                    <ul className="list-disc space-y-2 ps-5 type-doc-body">
                      {program.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm type-doc-subsection-title">Primary risks</h4>
                    <ul className="list-disc space-y-2 ps-5 type-doc-body">
                      {program.risks.map((item) => (
                        <li key={item}>{item}</li>
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
            Subsystems are triaged separately, but impact is still scored across solvency, user fund safety, liquidation integrity and related protocol risk. The trust boundaries and the stated blast radius of each upgradeable contract are described on this page:{" "}
            <Link href="/developers/safety/contracts" className="text-type-accent hover:underline">Contract Security</Link>.
          </p>
        </section>

        <section id="out-of-scope" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Out of Scope</h2>
          <p className="type-doc-body">
            Unmodified Aave V4 code is out of scope, including every Avana Hub, CDP Spoke, Lend Spoke and Coverage Spoke. Avana&apos;s deployment check proves their bytecode equals the audited Aave release named in the deployment manifest. The Aave-side settings Avana depends on, and Avana&apos;s handling of them, stay in scope under Program C.
          </p>
        </section>

        <section id="severity-philosophy" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Severity Philosophy</h2>
          <p className="mb-6 type-doc-body">
            Severity is assessed from a credible exploit path and the economic harm it enables, not only from a generic vulnerability score. The levels are the ones used in Avana&apos;s audit findings register:
          </p>

          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Severity</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {severityLevels.map((level) => (
                  <tr key={level.key}>
                    <td className="px-4 py-2">{level.title}</td>
                    <td className="px-4 py-2">{level.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 type-doc-body">
            A finding that enables LP overvaluation or bad debt can be critical even if it affects little code. Findings without a credible path to significant economic harm receive a lower severity assessment.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Responsible disclosure scope, out-of-scope code, and economic-impact severity for Avana."
        sectionColor="rose"
      />
    </div>
  ))
}
