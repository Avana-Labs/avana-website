import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'safety', {
    title: "Safety Mechanisms - Risk Framework",
    description: "Governance roles, the upgrade timelock, emergency controls and reporting for the Avana Hub, Borrow Spokes and Avana's own contracts.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "core-principles", title: "Core Principles" },
  { id: "roles", title: "Roles" },
  { id: "update-flow", title: "Change Process" },
  { id: "parameter-classes", title: "Change Classes" },
  { id: "public-disclosure", title: "Reporting" },
  { id: "emergency-actions", title: "Emergency Actions" },
]

const corePrinciples = [
  {
    title: "Aave DAO Ownership",
    description:
      "The Avana Hub and Borrow Spokes are standard, unmodified Aave V4 contracts owned by the Aave DAO. All Avana-specific logic sits in Avana's own contracts.",
  },
  {
    title: "Timelocked Upgrades",
    description:
      "Upgradeable Avana contracts sit behind an upgrade timelock with a grace window. Avana Labs cannot bypass the timelock, and the Aave DAO can cancel a queued upgrade.",
  },
  {
    title: "Separate Review",
    description:
      "Avana Labs submits markets and parameters, and a designated risk reviewer reviews them. New collateral pools are published for a two-week review before listing approval.",
  },
  {
    title: "Per-Market Settings",
    description:
      "Each pool category has its own Borrow Spoke, parameters and caps. Each market has its own pool risk factor, settlement mode, TWAP window, allowed price deviation and maximum feed age.",
  },
  {
    title: "Limited Emergency Powers",
    description:
      "The Emergency Guardian can pause, freeze and cancel. It cannot upgrade contracts, change parameters or move collateral.",
  },
]

const roles = [
  {
    title: "Aave DAO",
    summary:
      "Owns the Avana Hub and Borrow Spokes and holds pause and freeze roles over Avana's own contracts.",
    responsibilities: [
      "Own the Avana Hub, Borrow Spokes and their configuration",
      "Pause or freeze Avana's contracts and stop markets without Avana Labs",
      "Cancel queued upgrades during the timelock",
      "Own LPVaultSwap through an Aave DAO executor, while an Avana Labs and Aave DAO service-provider multisig holds its operational controls",
      "Approve new pools, credit-line increases and removal of the pilot allowlist through governance",
    ],
  },
  {
    title: "Avana Labs",
    summary:
      "Builds, operates and pays for Avana's own contracts, audits, monitoring and keepers, within the permissions set by governance.",
    responsibilities: [
      "Administer the LP Vault, AvanaConfig, Risk Module, Collateralization Module, LPOracle, AMM settlement adapters and Aave Adapter",
      "Submit markets and parameters for review by a designated risk reviewer",
      "Submit upgrades through the timelock, which it cannot bypass",
      "Run a keeper operator alongside at least one independent operator",
    ],
  },
  {
    title: "Emergency Guardian",
    summary:
      "A multisig that can act quickly to restrict activity, with no power to upgrade or move funds.",
    responsibilities: [
      "Pause Avana contracts",
      "Freeze a market by freezing both the vault-token reserve and the GHO reserve on its Borrow Spoke",
      "Cancel queued upgrades",
      "Cannot upgrade contracts, change parameters or move collateral",
    ],
  },
]

const updateFlow = [
  {
    step: "Submission",
    description:
      "Avana Labs submits a market, parameter set or contract change.",
  },
  {
    step: "Public Review",
    description:
      "New collateral pools are published for a two-week review before listing approval.",
  },
  {
    step: "Risk Review",
    description:
      "A designated risk reviewer reviews the submitted markets and parameters.",
  },
  {
    step: "Governance Approval",
    description:
      "Changes that need Aave DAO approval go through Aave governance: a request for final comment, a Snapshot vote and an onchain AIP vote.",
  },
  {
    step: "Timelock",
    description:
      "Upgrades to Avana contracts are queued in a timelock with a grace window before execution. Avana Labs cannot bypass the timelock.",
  },
  {
    step: "Cancellation Window",
    description:
      "While an upgrade is queued, the Aave DAO or the Emergency Guardian can cancel it.",
  },
  {
    step: "Emergency Path",
    description:
      "Separately, the Aave DAO and the Emergency Guardian can pause or freeze at any time. These actions only restrict activity.",
  },
]

const parameterClasses = [
  {
    title: "Defensive Actions",
    tone: "border-red-400 bg-red-50/70",
    description: "Actions that reduce exposure. The Aave DAO and the Emergency Guardian can take them without Avana Labs.",
    examples: [
      "Pausing Avana contracts",
      "Freezing a market's vault-token and GHO reserves on its Borrow Spoke",
      "Cancelling a queued upgrade",
      "Freezing new borrowing during offboarding",
      "Stopping a market",
    ],
  },
  {
    title: "Avana Contract Changes",
    tone: "border-amber-400 bg-amber-50/70",
    description:
      "Changes to Avana's own contracts and settings, administered by Avana Labs within its permissions. Upgrades go through the timelock and can be cancelled by the Aave DAO.",
    examples: [
      "Upgrades to the LP Vault, AvanaConfig, Risk Module, Collateralization Module, LPOracle, Aave Adapter or LPVaultSwap",
      "Avana-side limits, oracle settings, settlement routes and fee terms in AvanaConfig",
      "Pilot allowlist, position-size and exposure limits in the Risk Module",
    ],
  },
  {
    title: "Governance-Level Changes",
    tone: "border-gray-300 bg-gray-50",
    description: "Changes that need Aave DAO approval.",
    examples: [
      "Listing a new collateral pool, after a two-week public review",
      "Adding an AMM beyond Uniswap v2 and v3",
      "Deploying on another chain, starting with Base",
      "Increasing the GHO credit line beyond the pilot",
      "Removing the pilot allowlist",
    ],
  },
]

const disclosureItems = [
  "Debt and collateral by market",
  "Concentration",
  "Health factor distribution",
  "Successful, failed and retried liquidations",
  "FirstLossReserve usage",
  "Bad debt",
  "Oracle incidents",
  "Credit-line usage",
  "Fees",
  "First-loss resources",
]

const emergencyTriggers = [
  "Chainlink price valid, TWAP outside tolerance: new borrowing and risk-increasing withdrawals are blocked. Repayment and liquidation continue at the Chainlink price.",
  "Chainlink stale or invalid, cached price within its maximum age: the last valid price is used. New borrowing and voluntary withdrawals are blocked.",
  "Cached price past its maximum age: liquidations pause until the feed recovers or governance approves a backup feed. Repayment continues.",
  "Guardian market freeze: the vault-token reserve and GHO reserve are frozen on the Borrow Spoke.",
  "Offboarding: new borrowing is frozen. Repayment and withdrawal continue, and unhealthy positions can still be liquidated.",
  "Liquidation shortfall that the FirstLossReserve cannot cover: the transaction reverts and debt and collateral are unchanged.",
]

const emergencyDisclosures = [
  "The Emergency Guardian cannot upgrade contracts",
  "The Emergency Guardian cannot change parameters",
  "The Emergency Guardian cannot move collateral",
  "Offboarding does not cancel debt",
]

export default async function RiskFrameworkPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "safety", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader

          title="Risk Framework"

          description="How governance roles, the upgrade timelock and emergency controls apply to the Avana Hub, Borrow Spokes and Avana's own contracts."

        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>The Avana Hub and Borrow Spokes are standard, unmodified Aave V4 contracts owned
            by the Aave DAO. Avana-specific logic sits in Avana&apos;s own contracts: the LP Vault,
            AvanaConfig, Risk Module, Collateralization Module, LPOracle, AMM settlement adapters,
            Aave Adapter and LPVaultSwap.</>{" "}<>Avana has three pool categories: stable, correlated and blue-chip/stable. Each category has its own Borrow Spoke, parameters and caps. Each market also has its own pool risk factor, settlement mode and oracle settings.</>
          </p>
          <p className="mb-4 type-doc-body">
            Three parties hold separate powers: the Aave DAO, Avana Labs and an Emergency
            Guardian multisig. Avana Labs submits and administers changes, and a designated risk
            reviewer reviews them. The Aave DAO approves changes and can stop markets. The Guardian
            can only pause, freeze and cancel.
          </p>
          <p className="type-doc-body type-doc-callout type-doc-callout-danger">
            <strong>Operating rule:</strong> the Aave DAO can pause, freeze or stop Avana markets
            without Avana Labs, and Avana Labs cannot bypass the upgrade timelock.
          </p>
        </section>

        <section id="core-principles" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Core Principles</h2>
          <div className="flex flex-col gap-4">
            {corePrinciples.map((principle) => (
              <div
                key={principle.title}
                className="doc-topic"
              >
                <h3 className="mb-2 type-doc-subsection-title">
                  {principle.title}
                </h3>
                <p className="type-doc-body">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="roles" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Roles</h2>
          <div className="space-y-5">
            {roles.map((role) => (
              <div
                key={role.title}
                className="doc-topic"
              >
                <h3 className="text-lg type-doc-subsection-title">{role.title}</h3>
                <p className="mt-2 type-doc-body">{role.summary}</p>
                <ul className="mt-4 space-y-2 type-doc-body">
                  {role.responsibilities.map((item) => (
                    <li key={item} className="type-doc-callout type-doc-callout-danger">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="update-flow" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Change Process</h2>
          <p className="mb-6 type-doc-body">
            Changes follow the fixed path below. New pools get a public review, and governance
            approval applies only where required. Pause and freeze actions use a separate, faster path.
          </p>

          <div className="space-y-4">
            {updateFlow.map((item, index) => (
              <div
                key={item.step}
                className="doc-topic"
              >
                <div className="flex items-start gap-3">
                  <span className="doc-step-number">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="mb-1 type-doc-subsection-title">
                      {item.step}
                    </h3>
                    <p className="type-doc-body">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="parameter-classes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Change Classes</h2>
          <p className="mb-6 type-doc-body">
            Changes are grouped by who can make them and how. Governance sets timelock lengths, grace windows and Guardian signers.
          </p>

          <div className="space-y-4">
            {parameterClasses.map((group) => (
              <div
                key={group.title}
                className="doc-topic"
              >
                <h3 className="mb-1 type-doc-subsection-title">
                  {group.title}
                </h3>
                <p className="mb-3 type-doc-body">
                  {group.description}
                </p>
                <ul className="space-y-2 type-doc-body">
                  {group.examples.map((item) => (
                    <li key={item} className="type-doc-callout">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="public-disclosure" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Reporting</h2>
          <p className="mb-6 type-doc-body">
            Avana Labs publishes weekly usage reports and monthly revenue reports. New collateral pools are published for a two-week review before listing approval.
          </p>

          <div className="doc-topic">
            <h3 className="mb-3 type-doc-subsection-title">
              Report contents
            </h3>
            <ul className="flex flex-col gap-3 type-doc-body">
              {disclosureItems.map((item) => (
                <li key={item} className="type-doc-callout">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 type-doc-body">
            AaveAdapterLens reports vault-token supply against LP Vault liquidity for each market, so anyone can check backing onchain.
          </p>
        </section>

        <section id="emergency-actions" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Emergency Actions</h2>
          <p className="mb-4 type-doc-body">
            The Aave DAO holds pause and freeze roles over Avana&apos;s contracts. It can stop markets without Avana Labs. The Emergency Guardian multisig can pause, freeze and cancel queued upgrades. Some restrictions apply automatically when oracle checks fail.
          </p>

          <div className="flex flex-col gap-4">
            <div className="doc-topic">
              <h3 className="mb-3 type-doc-subsection-title">
                Conditions that restrict activity
              </h3>
              <ul className="space-y-2 type-doc-body">
                {emergencyTriggers.map((item) => (
                  <li key={item} className="type-doc-callout type-doc-callout-danger">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="doc-topic">
              <h3 className="mb-3 type-doc-subsection-title">
                Limits on emergency powers
              </h3>
              <ul className="space-y-2 type-doc-body">
                {emergencyDisclosures.map((item) => (
                  <li key={item} className="type-doc-callout">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-6 type-doc-body type-doc-callout type-doc-callout-danger">
            Emergency powers can only stop or restrict activity. Borrowers can still repay and
            make permitted withdrawals by calling the contracts directly, without Avana&apos;s
            frontend.
          </p>
        </section>

        <p className="type-doc-body">
          Avana Labs owns, operates and pays for its own contracts, audits, monitoring and keepers. The Aave DAO&apos;s exposure is limited to the capped GHO credit line. Each increase to the credit line requires governance approval.
        </p>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Governance roles, the upgrade timelock, emergency controls and reporting for Avana on Aave V4."
        sectionColor="rose"
      />
    </div>
  ))
}
