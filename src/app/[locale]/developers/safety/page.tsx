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
    description: "Protocol-wide risk management for the Avana Hub and LP Collateral Spokes, including roles, bounded updates, and emergency controls.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "core-principles", title: "Core Principles" },
  { id: "roles", title: "Roles" },
  { id: "update-flow", title: "Update Flow" },
  { id: "parameter-classes", title: "Parameter Classes" },
  { id: "public-disclosure", title: "Public Disclosure" },
  { id: "emergency-actions", title: "Emergency Actions" },
]

const corePrinciples = [
  {
    title: "Role Separation",
    description:
      "The framework assigns proposing, reviewing, and emergency containment to different actors so one party does not control the full path alone.",
  },
  {
    title: "Constrained Execution",
    description:
      "Routine risk changes execute only when they remain inside predefined policy bounds and pass validation checks.",
  },
  {
    title: "Public Consistency",
    description:
      "The update described publicly should be the same update that is actually queued for execution.",
  },
  {
    title: "Spoke Awareness",
    description:
      "Each LP collateral spoke carries its own listing rules, oracle assumptions, liquidation path, and risk profile.",
  },
  {
    title: "Defensive Asymmetry",
    description:
      "The process is intentionally biased so reducing risk is faster and simpler than expanding it.",
  },
]

const roles = [
  {
    title: "Avana Risk Initiator",
    summary:
      "The role that prepares and recommends routine risk changes for the Hub and LP Collateral Spokes.",
    responsibilities: [
      "Publish the rationale and classify the update as defensive or growth-oriented",
      "Submit routine updates into the timelocked execution path",
      "Recommend supply caps, borrow caps, LT/LTV, reserve factor, and interest-rate changes inside approved ranges",
      "Initiate spoke-level de-risking and pool onboarding inside preapproved spoke templates",
    ],
  },
  {
    title: "Avana Risk Guardian",
    summary:
      "The independent reviewer with veto authority over queued routine changes.",
    responsibilities: [
      "Verify that the queued update matches the public disclosure",
      "Check that the action stays inside approved policy bounds",
      "Reject updates based on invalid oracle, liquidity, or liquidation assumptions",
      "Cancel a queued update during the timelock window when it creates obvious spoke-level or hub-level instability",
    ],
  },
  {
    title: "Avana Risk Defender",
    summary:
      "The emergency-only role used to contain incidents when the normal timelocked path is too slow.",
    responsibilities: [
      "Reduce borrow caps or supply caps to defensive levels",
      "Freeze new borrowing on a spoke or freeze collateral usage for a pool, template, or spoke",
      "Disable a specific adapter or borrow path when predefined failure conditions are met",
      "Block new debt origination under emergency conditions without being used for routine optimization or growth actions",
    ],
  },
]

const updateFlow = [
  {
    step: "Public Notice",
    description:
      "The Risk Initiator publishes the intended change, why it is needed, and the scope it is expected to affect.",
  },
  {
    step: "Submission",
    description:
      "The Risk Initiator places the proposed change into the execution path used by the framework.",
  },
  {
    step: "Validation",
    description:
      "Framework checks confirm that the update stays inside predefined constraints and approved policy bounds.",
  },
  {
    step: "Timelock",
    description:
      "If validation passes, the change enters a timelock window instead of executing immediately.",
  },
  {
    step: "Guardian Review",
    description:
      "During timelock, the Risk Guardian reviews the exact queued payload and can cancel it if needed.",
  },
  {
    step: "Execution",
    description:
      "If the change survives review, it executes automatically after the timelock expires.",
  },
  {
    step: "Emergency Path",
    description:
      "If emergency conditions are met, the Risk Defender can use a separate defensive path with narrower authority.",
  },
]

const parameterClasses = [
  {
    title: "Defensive Changes",
    tone: "border-red-400 bg-red-50/70",
    description: "These are the fastest routine changes because they reduce protocol exposure.",
    examples: [
      "Lowering borrow caps",
      "Lowering supply caps",
      "Reducing LTV or liquidation threshold",
      "Freezing borrow or collateral usage",
      "Tightening spoke settings",
    ],
  },
  {
    title: "Routine Bounded Changes",
    tone: "border-amber-400 bg-amber-50/70",
    description:
      "These follow the standard Initiator -> Guardian -> timelock route inside approved bounds.",
    examples: [
      "Modest cap increases",
      "Modest parameter tuning inside approved ranges",
      "Adding new pools inside an existing spoke template",
    ],
  },
  {
    title: "Governance-Level Changes",
    tone: "border-gray-300 bg-gray-50",
    description: "These are outside the routine framework and require a higher-level decision path.",
    examples: [
      "Creating a new spoke family",
      "Enabling a new LP primitive",
      "Adding a new oracle model",
      "Enabling a new liquidation adapter",
      "Materially expanding the risk surface beyond preapproved assumptions",
    ],
  },
]

const disclosureItems = [
  "Affected spoke",
  "Affected pools or templates",
  "Current parameters",
  "Proposed parameters",
  "Reason for the update",
  "Whether the update is defensive or growth-oriented",
  "Expected submission timing",
  "Expected timelock window",
  "Relevant dependencies or assumptions",
]

const emergencyTriggers = [
  "Oracle inconsistency",
  "Liquidation path degradation",
  "Abnormal pool behavior",
  "Wrapper dependency failure",
  "Adapter-level compromise",
  "Sudden spoke-level instability",
]

const emergencyDisclosures = [
  "The trigger",
  "The action taken",
  "The intended duration",
  "The path back to normal operation",
]

export default async function RiskFrameworkPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "safety", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader

          title="Risk Framework"

          description="How Avana proposes, reviews, and executes risk changes across the Hub and LP Collateral Spokes."

        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            The Avana Risk Framework defines how parameter changes are proposed, checked, and
            executed across the Hub and LP Collateral Spokes. It covers the controls used when the
            protocol adjusts supply and borrow caps, LT/LTV settings, interest-rate inputs, market
            status, and other parameters that depend on prices, utilization, pool depth,
            concentration, volatility, peg behavior, circuit breakers, position health, and
            related state.
          </p>
          <p className="mb-4 type-doc-body">
            LP collateral is not one homogeneous asset class. Stable LPs, correlated-asset LPs,
            weighted pools, concentrated liquidity, and other AMM designs can each have their own
            spoke-specific valuation path, liquidation path, and failure mode. The framework exists
            so those differences are reflected in the update process instead of being hidden behind
            a single generic risk setting.
          </p>
          <p className="mb-4 type-doc-body">
            Three roles stay separate throughout that process: Avana Risk Initiator, Avana Risk
            Guardian, and Avana Risk Defender. The party that recommends a routine change is not
            the same party that independently checks it, and the role that can act during an
            emergency is intentionally narrower than the routine path.
          </p>
          <p className="type-doc-body type-doc-callout type-doc-callout-danger">
            <strong>Operating rule:</strong> reducing risk should be easier than expanding it.
          </p>
        </section>

        <section id="core-principles" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Core Principles</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {corePrinciples.map((principle) => (
              <div
                key={principle.title}
                className="rounded-xl border border-gray-200 bg-white p-4"
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
                className="rounded-xl border border-gray-200 bg-white p-5"
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
          <h2 className="mb-4 type-doc-section-title">Update Flow</h2>
          <p className="mb-6 type-doc-body">
            Routine changes follow a fixed path so the protocol can distinguish normal parameter
            maintenance from emergency containment. The standard sequence is public notice,
            submission, bound checks, timelock, Guardian review, and execution if the proposal is
            not vetoed.
          </p>

          <div className="space-y-4">
            {updateFlow.map((item, index) => (
              <div
                key={item.step}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-semibold text-rose-700">
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
          <h2 className="mb-4 type-doc-section-title">Parameter Classes</h2>
          <p className="mb-6 type-doc-body">
            Parameter changes do not all carry the same risk, so the framework groups them by how
            much authority they should require and how quickly they should be able to move.
          </p>

          <div className="space-y-4">
            {parameterClasses.map((group) => (
              <div
                key={group.title}
                className={`rounded-xl border p-4 ${group.tone}`}
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
          <h2 className="mb-4 type-doc-section-title">Public Disclosure</h2>
          <p className="mb-6 type-doc-body">
            Every routine update should be published before submission in a format that lets
            developers, users, and reviewers compare the notice with the exact action that is later
            queued.
          </p>

          <div className="type-doc-panel">
            <h3 className="mb-3 type-doc-subsection-title">
              Minimum disclosure standard
            </h3>
            <ul className="grid gap-3 type-doc-body md:grid-cols-2">
              {disclosureItems.map((item) => (
                <li key={item} className="type-doc-callout">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 type-doc-body">
            Consistent disclosure makes it easier to review a proposal for scope creep, mismatched
            assumptions, or simple execution mistakes.
          </p>
        </section>

        <section id="emergency-actions" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Emergency Actions</h2>
          <p className="mb-4 type-doc-body">
            Emergency actions are for containment, not routine tuning. They should be used rarely,
            kept as narrow as possible, and structured so the protocol can return to the standard
            path once the immediate risk is understood. The Risk Defender should only act when a
            defined or highly probable failure condition makes the normal timelocked route unsafe.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-red-200 bg-red-50/70 p-4">
              <h3 className="mb-3 type-doc-subsection-title">
                Emergency triggers
              </h3>
              <ul className="space-y-2 type-doc-body">
                {emergencyTriggers.map((item) => (
                  <li key={item} className="type-doc-callout type-doc-callout-danger">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="mb-3 type-doc-subsection-title">
                Required post-action disclosure
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
            Emergency authority exists only for defined or highly probable failure cases where
            waiting on the normal timelock path is unsafe. It is not a path for routine growth or
            optimization.
          </p>
        </section>

        <p className="type-doc-body">
          Recommendation, review, and emergency containment remain separate because LP collateral
          is a collection of markets with different structures and failure modes, not one
          interchangeable asset list.
        </p>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How Avana governs risk updates across the Hub and LP Collateral Spokes through bounded roles, disclosure, and emergency controls."
        sectionColor="rose"
      />
    </div>
  ))
}
