import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, "safety/insurance", {
    title: "Umbrella",
    description: "How Avana's loss order applies first-loss capital, committed revenues and Avana Umbrella to shortfalls and deficits on the Avana Hub.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "purpose", title: "Shortfalls during liquidation" },
  { id: "coverage-accounting", title: "Deficits on the Avana Hub" },
  { id: "funding-approach", title: "First-loss capital" },
  { id: "offset-growth", title: "Loss order" },
  { id: "activation-path", title: "From deficit to coverage" },
  { id: "staking", title: "Avana Umbrella" },
  { id: "readiness", title: "Coverage readiness" },
  { id: "coverage-boundary", title: "Coverage limits" },
]

export default async function InsuranceFundsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "safety/insurance", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Umbrella"
          description="How first-loss capital, committed revenues and Avana Umbrella cover losses in Avana's Aave V4 markets."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="type-doc-body">
            Avana covers losses in three layers: dedicated first-loss capital, then revenues
            committed to loss coverage, then Avana Umbrella. Avana Umbrella is Avana&apos;s
            protocol safety module, named after{" "}
            <a href="https://aave.com/docs/aave-v3/umbrella" className="text-type-accent hover:underline">
              Aave Umbrella
            </a>. Collateral limits and liquidation remain the first controls against loss.
            Coverage is limited to the capital actually funded and committed. It is not a
            guarantee for every position.
          </p>
        </section>

        <section id="purpose" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Shortfalls during liquidation</h2>
          <p className="type-doc-body">
            If liquidation proceeds do not cover the debt being repaid, LPVaultSwap draws from
            the FirstLossReserve in the same transaction. If the reserve cannot cover the
            shortfall, the transaction reverts and debt and collateral are unchanged. Keepers
            may retry with a smaller partial liquidation. Borrowing is activated only once a
            process for resolving such positions is in place.
          </p>
        </section>

        <section id="coverage-accounting" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Deficits on the Avana Hub</h2>
          <p className="type-doc-body">
            Aave V4 records a deficit on the Avana Hub only when a completed standard Aave V4
            liquidation uses up an account&apos;s collateral with debt remaining. A liquidation
            that reverts does not create a deficit, and the debt stays on the account. The Avana
            Hub is a standard Aave V4 contract owned by the Aave DAO. Only approved Borrow Spokes
            have GHO draw capacity on it.
          </p>
        </section>

        <section id="funding-approach" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">First-loss capital</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
              The first layer is dedicated first-loss capital held in the FirstLossReserve
              contract. Its size is set with Aave DAO service providers. The reserve counts
              toward coverage only once it is funded. A commitment alone is not coverage.
            </p>
            <p className="type-doc-body">
              LPVaultSwap draws on the FirstLossReserve directly during liquidation, so
              first-loss capital is used before any deficit reaches the Avana Hub. Avana&apos;s
              monthly reports include first-loss resources.
            </p>
          </div>
        </section>

        <section id="offset-growth" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Loss order</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
              Losses are absorbed in a fixed order. Each layer is used before the next.
            </p>
            <pre className="type-doc-code-block overflow-x-auto"><code>{`1. Dedicated first-loss capital (FirstLossReserve)
2. Revenues committed to loss coverage
3. Avana Umbrella`}</code></pre>
            <p className="type-doc-body">
              The size of each layer, and which revenues are committed to loss coverage, are
              set with Aave DAO service providers and approved by governance. All interest revenue
              attributable to the GHO credit line accrues to the Aave DAO.
            </p>
          </div>
        </section>

        <section id="activation-path" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">From deficit to coverage</h2>
          <div className="doc-prose">
            <p className="type-doc-body">
              A shortfall found during liquidation is covered from the FirstLossReserve in the
              same transaction, or the liquidation reverts. A deficit recorded on the Avana
              Hub after a completed standard liquidation is covered in the loss order above.
            </p>
            <p className="type-doc-body">
              The Aave DAO&apos;s exposure is limited to the capped GHO credit line. Each increase
              to the credit line requires governance approval. Governance defines the exact
              settlement steps for covering a Hub deficit.
            </p>
          </div>
        </section>

        <section id="staking" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Avana Umbrella</h2>
          <p className="type-doc-body">
            Avana Umbrella is the third layer of the loss order and is named after Aave&apos;s
            Umbrella. Its mechanics are not specified yet, including which assets can be staked,
            reward terms, slashing limits and withdrawal cooldowns. A separate governance approval
            sets them. Aave v3 Umbrella token addresses, cooldowns and parameters are not
            defaults for Avana.
          </p>
        </section>

        <section id="readiness" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Coverage readiness</h2>
          <p className="type-doc-body">
            The GHO credit line grows in stages. Each stage has its own conditions and requires governance approval. Only funded capital counts as protection, and amounts spent during liquidation are deducted from available coverage. Coverage applies to GHO deficits on the Avana Hub. Weekly usage reports and monthly revenue reports let readers check coverage against exposure. The reports include bad debt, FirstLossReserve usage, credit-line usage and first-loss resources. They also include successful, failed and retried liquidations.
          </p>
        </section>

        <section id="coverage-boundary" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Coverage limits</h2>
          <p className="type-doc-body">
            Loss coverage applies to protocol shortfalls and deficits. It does not reimburse
            borrowers, who still bear impermanent loss, price risk and liquidation risk.
            Coverage is limited to capital actually available. It does not increase borrowing
            capacity or remove liquidation risk. The controls and recovery process that operate before loss coverage are described in{" "}
            <Link href="/developers/safety" className="text-type-accent hover:underline">
              Risk Framework
            </Link>,{" "}
            <Link href="/developers/liquidation" className="text-type-accent hover:underline">
              Liquidation Framework
            </Link>.
          </p>
        </section>
      </div>
      <DeveloperScrollSpyRail sections={sections} sectionColor="rose" />
    </div>
  ))
}
