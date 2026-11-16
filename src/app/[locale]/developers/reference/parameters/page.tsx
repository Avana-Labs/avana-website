import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { ReferencePage } from "@/components/reference/reference-page"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { getDocsStringMap } from "@/lib/content-i18n/load-content"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'reference/parameters', {
    title: "Market Parameters",
    description: "Every Avana parameter and constant: meaning, unit, bounds, launch value per chain, and who sets it with which delay.",
  })
}

// The hand-written sections below are translated through the docs catalog. The
// per-network and protocol-wide tables come from content/reference/parameters.md
// (synced with `npm run sync:reference`).
const sections = [
  { id: "overview", title: "Overview" },
  { id: "units", title: "Units Conventions" },
  { id: "change-classes", title: "Change Classes" },
]

export default async function ReferenceParametersPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  const header = await withDocsI18n(locale, "reference/parameters", (
    <DeveloperDocPageHeader
      title="Market Parameters"
      description="Every Avana parameter and constant: meaning, unit, bounds, launch value per chain, and who sets it with which delay."
    />
  ))
  const lead = await withDocsI18n(locale, "reference/parameters", (
    <>
      <section id="overview" className="mb-10"><h2 className="mb-4 type-doc-section-title">Overview</h2><p className="mb-4 type-doc-body">This page lists every tunable value and protocol constant in Avana, per chain, with its unit, the bounds enforced on-chain, its launch value, where it is stored, and who can change it with which delay. Other pages refer to parameters by these names.</p><div className="mb-4 doc-topic type-doc-body"><p className="mb-2"><strong className="text-gray-900">Where economic values are decided.</strong> Every economic or risk value on this page is Avana&apos;s default. Avana recommends the number, and the Aave governance proposal that lists the market (the listing ARFC) or funds the credit line and first-loss coverage (the funding ARFC), prepared with the Aave V4 risk service providers, sets the final value. Engineering constants such as gas limits, buffer sizes and the <code className="type-doc-inline-code">MAX_</code> bounds are fixed values.</p><p><strong className="text-gray-900">Fees.</strong> <code className="type-doc-inline-code">avanaFeeShareBps</code> is the only on-chain Avana fee. The Avana app also charges a fee outside the contracts: no contract computes, holds or enforces it, so it has no parameter, and calling the contracts directly does not pay it. Avana charges no fee on borrow interest.</p></div><p className="mb-4 type-doc-body">Contract roles, forms and scopes are listed on this page: <Link href="/developers/reference/contracts" className="text-type-accent hover:underline">Contracts</Link>.</p></section>
      <section id="units" className="mb-10"><h2 className="mb-4 type-doc-section-title">Units Conventions</h2><p className="mb-4 type-doc-body">Every number in the specification states its unit and precision, and every rounding step states its direction.</p><div className="mb-6 overflow-x-auto"><table className="type-doc-table"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Quantity</th><th className="text-left px-4 py-2 type-doc-subsection-title">Unit</th></tr></thead><tbody className="divide-y divide-gray-200"><tr><td className="px-4 py-2">Ratios and health factor</td><td className="px-4 py-2">WAD (1e18): a health factor of 1.10 is <code className="type-doc-inline-code">1.1e18</code></td></tr><tr><td className="px-4 py-2">Interest indices and deficit amounts</td><td className="px-4 py-2">RAY (1e27)</td></tr><tr><td className="px-4 py-2">Collateral factors, bonuses, tolerances and fees</td><td className="px-4 py-2">Basis points (bps): 10,000 bps = 100%</td></tr><tr><td className="px-4 py-2">Oracle prices</td><td className="px-4 py-2">8 decimals, USD per whole token (Aave&apos;s format)</td></tr><tr><td className="px-4 py-2">Exposure caps and USD charges</td><td className="px-4 py-2">USD with 8 decimals: $10 is <code className="type-doc-inline-code">10e8</code></td></tr><tr><td className="px-4 py-2">Aave value</td><td className="px-4 py-2"><code className="type-doc-inline-code">amount × price × 10^(18 − decimals)</code>, 26 decimals (1e26 = $1)</td></tr><tr><td className="px-4 py-2">GHO</td><td className="px-4 py-2">18 decimals; GHO debt is priced at a fixed $1</td></tr><tr><td className="px-4 py-2">Other debt assets</td><td className="px-4 py-2">The asset&apos;s own decimals (USDC and USDT 6, WETH 18), priced by the asset&apos;s DebtOracle with 8 decimals</td></tr><tr><td className="px-4 py-2">Vault tokens</td><td className="px-4 py-2">Per-market decimals from 6 to 18; one base unit is one credited unit of the market&apos;s AMM integration</td></tr><tr><td className="px-4 py-2">Times and delays</td><td className="px-4 py-2">Seconds</td></tr></tbody></table></div></section>
      <section id="change-classes" className="mb-10"><h2 className="mb-4 type-doc-section-title">Change Classes</h2><p className="mb-4 type-doc-body">Every privileged change is an operation of the chain&apos;s AvanaTimelock: a proposer (the governance multisig or the Aave governance executor) schedules it, it waits its delay, and anyone executes it once ready and before the 14-day grace period ends. In the tables below, Short to tighten and Normal to loosen means the tightening setter runs at the short delay and the loosening setter at the normal delay.</p><div className="mb-6 overflow-x-auto"><table className="type-doc-table"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Class</th><th className="text-left px-4 py-2 type-doc-subsection-title">Who and delay</th><th className="text-left px-4 py-2 type-doc-subsection-title">Who can cancel</th></tr></thead><tbody className="divide-y divide-gray-200"><tr><td className="px-4 py-2">Short</td><td className="px-4 py-2">A proposer schedules and the AvanaTimelock executes after 12 hours, only when every call is on the short-delay list (a subset of the immutable short-eligible set): tighten setters within their liveness bounds, route disable and restore, committed-operator removal down to the floor, offboarding, activation, cancelled registration, freeze, pause, address freeze, breaker trips and standby routes.</td><td className="px-4 py-2">Governance multisig, Emergency Guardian, Aave Protocol Guardian, Aave governance executor; a restoring operation only the Aave governance executor</td></tr><tr><td className="px-4 py-2">Normal</td><td className="px-4 py-2">A proposer schedules and the AvanaTimelock executes after the normal delay (5 days at launch, 4 to 5 days): upgrades, the three deployment operations, the flash source, price sources, routes, every loosening and structural setter, fee changes, committed-operator additions, address unfreezes and stray-position return. A step-limited loosening moves one step at most once per normal delay.</td><td className="px-4 py-2">Same as Short</td></tr><tr><td className="px-4 py-2">Role change</td><td className="px-4 py-2"><code className="type-doc-inline-code">grantRole</code> or <code className="type-doc-inline-code">revokeRole</code> scheduled at the normal delay; admin roles only ever go to the timelock.</td><td className="px-4 py-2">Aave governance executor only</td></tr><tr><td className="px-4 py-2">Restriction lift</td><td className="px-4 py-2">Unfreeze, unpause, or reset of a deficit or security breaker, by the pause guardian at once or by a timelock operation at the normal delay. A temporary gate clears by itself once its condition has been healthy for <code className="type-doc-inline-code">gateRecoverySeconds</code>.</td><td className="px-4 py-2">Operation: same as Short</td></tr><tr><td className="px-4 py-2">Emergency</td><td className="px-4 py-2">Freeze, address freeze and breaker trips by the freeze guardian; pause and standby routes by the pause guardian; <code className="type-doc-inline-code">cancelStandbySwitch</code> by the Aave governance executor; cancel by any canceller. Immediate, outside the timelock, and never a parameter change.</td><td className="px-4 py-2">Not applicable</td></tr><tr><td className="px-4 py-2">Immutable</td><td className="px-4 py-2">Fixed in bytecode. A constant of an immutable contract changes only with a new deployment; a constant of an upgradeable contract changes only with an upgrade at the normal delay.</td><td className="px-4 py-2">Not applicable</td></tr><tr><td className="px-4 py-2">Aave governance</td><td className="px-4 py-2">Set by the Aave DAO through its own governance process.</td><td className="px-4 py-2">Aave DAO</td></tr><tr><td className="px-4 py-2">Listing payload</td><td className="px-4 py-2">Set with the Aave V4 risk service providers and recorded in the market&apos;s or debt reserve&apos;s listing payload: the Avana half runs as one normal-delay batch with activation at the short delay; the Aave half goes through Aave governance.</td><td className="px-4 py-2">Avana half: same as Short; Aave half: Aave DAO</td></tr></tbody></table></div></section>
    </>
  ))
  const phrases = await getDocsStringMap(locale, "reference/parameters")
  return (
    <ReferencePage
      locale={locale}
      page="parameters"
      pageHeader={header}
      lead={lead}
      leadSections={sections.map((section) => ({ ...section, title: phrases[section.title] ?? section.title }))}
    />
  )
}
