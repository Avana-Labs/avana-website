import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'architecture/health-factor', {
    title: "Health Factor",
    description: "How Avana measures whether an LP-backed account has enough collateral to support its debt.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "calculation", title: "Calculation" },
  { id: "health-bands", title: "Monitoring Bands" },
  { id: "response-path", title: "Response Path" },
  { id: "user-actions", title: "User Actions" },
]

export default async function HealthFactorPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "architecture/health-factor", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Health Factor"
          description="The ratio between risk-adjusted collateral value and outstanding debt inside a Borrow Spoke."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>Health factor measures the relationship between risk-adjusted collateral value and
            outstanding debt inside a Borrow Spoke. Adjusted collateral value already includes
            Avana&apos;s LP valuation, collateral factors, pool-level risk treatment, and
            recoverable-value assumptions.</>{" "}<>If health falls below the liquidation boundary, the position becomes eligible for
            liquidation. See the{" "}
            <Link href="/developers/liquidation" className="text-[#01AACF] hover:underline">
              Liquidation Framework
            </Link>{" "}
            for what happens next.</>{" "}<>{"Borrowing power is the sum of your approved LP positions in one Borrow Spoke, after collateral factors and risk discounts. Each position contributes based on its own pool, range, liquidity, and risk settings."}</>
          </p>
        </section>

        <section id="calculation" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Calculation</h2>
          <p className="mb-4 type-doc-body">
            Health is computed per Borrow Spoke. The numerator is adjusted collateral value — already
            discounted through reconstruction, pricing, collateral factors, and recoverable-value
            assumptions.
          </p>

          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">
              healthFactor = adjustedCollateralValue / outstandingDebt
            </code>
          </div>

          <p className="mt-4 type-doc-body">
            If a user has collateral in more than one Borrow Spoke, each spoke computes health
            independently. Extra margin in one market does not cover a deficit in another.
          </p>
        </section>

        <section id="health-bands" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Monitoring Bands</h2>
          <div className="space-y-4 type-doc-body">
            <p>
            <><strong className="text-gray-900">Healthy:</strong> adjusted collateral value exceeds debt, leaving a buffer before the liquidation threshold.</>{" "}<><strong className="text-gray-900">Watchlist:</strong> the account passes health checks but has a smaller buffer. Repayment or additional approved collateral can increase that buffer.</>{" "}<><strong className="text-gray-900">Liquidatable:</strong> the account has crossed the liquidation threshold and is eligible for the configured liquidation process.</>
          </p>
          </div>
          <p className="mt-4 type-doc-body">
            Interface warnings may appear earlier than the hard liquidation threshold to give users
            time to act.
          </p>
        </section>

        <section id="response-path" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Response Path</h2>
          <div className="space-y-4 type-doc-body">
            <p>
            <>When health weakens, the borrower can repay debt, add approved LP collateral, or take
              other actions that improve the account under the spoke&apos;s health checks.</>{" "}<>Once health crosses the liquidation boundary, liquidators can begin recovering value from the collateral under the market&apos;s liquidation rules.</>
          </p>
          </div>
        </section>

        <section id="user-actions" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">User Actions</h2>
          <ul className="space-y-2 type-doc-body">
            <li>Borrowing more reduces health because debt rises against the same collateral.</li>
            <li>Repaying debt improves health immediately.</li>
            <li>Adding approved collateral can increase headroom if the spoke accepts and values it.</li>
            <li>Claiming fees, withdrawing collateral, or changing a position can reduce its collateral contribution. These actions are subject to checks on the resulting account health.</li>
          </ul>
          <p className="mt-4 type-doc-body">
            See{" "}
            <Link href="/developers/architecture/collateral-factors" className="text-[#01AACF] hover:underline">
              Collateral Factors
            </Link>{" "}
            for how adjusted collateral value is calculated.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How health factor measures account safety from adjusted collateral value and debt."
        sectionColor="violet"
      />
    </div>
  ))
}
