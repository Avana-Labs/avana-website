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
    description: "How Avana measures whether an LP-backed account has enough collateral to support its GHO debt.",
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
          description="The ratio between collateral value, after Collateral Factors, and outstanding GHO debt on an Avana Borrow Spoke."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>Health factor compares collateral value, after each reserve&apos;s Collateral Factor,
            with outstanding GHO debt on an Avana Borrow Spoke. The LPOracle values vault tokens
            with no haircut. Pool risk reduces borrowing power through the Collateral Factor.</>{" "}<>If the health factor falls below 1, the account becomes eligible for
            liquidation. For what happens next, see the{" "}
            <Link href="/developers/liquidation" className="text-type-accent hover:underline">
              Liquidation Framework
            </Link>.</>{" "}<>{"Borrowing power is the sum of an account's vault-token collateral on one Borrow Spoke. Each vault token is valued at its own market's price and Collateral Factor."}</>
          </p>
        </section>

        <section id="calculation" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Calculation</h2>
          <p className="mb-4 type-doc-body">
            The Borrow Spoke computes health using standard Aave V4 accounting. The numerator
            is the value of the vault tokens at LPOracle prices, multiplied by each reserve&apos;s
            Collateral Factor.
          </p>

          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">
              healthFactor = (collateralValue × collateralFactor) / outstandingDebt
            </code>
          </div>

          <p className="mt-4 type-doc-body">
            This example is illustrative and does not show market parameters. A $100,000 WETH/USDC
            position with a 35% Collateral Factor and 25,000 GHO of debt starts at a health factor
            of 1.40. The health factor reaches 1.00 if collateral value falls about 29%, to about
            $71,400. Under a simplified full-range model, that fall corresponds to roughly a 49% ETH decline.
          </p>
        </section>

        <section id="health-bands" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Monitoring Bands</h2>
          <div className="space-y-4 type-doc-body">
            <p>
            <><strong className="text-gray-900">Healthy:</strong> the health factor is above 1 with a buffer. In the illustrative example, the interface limits new borrowing to an opening health factor of 1.10.</>{" "}<><strong className="text-gray-900">Watchlist:</strong> the health factor is still above 1 but the buffer is small. Repayment or additional approved collateral increases that buffer.</>{" "}<><strong className="text-gray-900">Liquidatable:</strong> the health factor is below 1, and an approved keeper can liquidate the account through LPVaultSwap.</>
          </p>
          </div>
          <p className="mt-4 type-doc-body">
            Interface warnings may appear before the health factor reaches 1 to give users
            time to act.
          </p>
        </section>

        <section id="response-path" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Response Path</h2>
          <div className="space-y-4 type-doc-body">
            <p>
            <>When health weakens, the borrower can repay GHO at any time through the AaveAdapter
              unless it is paused. The borrower can also call the contracts directly without
              Avana&apos;s frontend. Pledging additional approved collateral also increases the buffer.</>{" "}<>Once the health factor falls below 1, approved keepers can call LPVaultSwap. Partial settlement removes only the liquidity needed to restore health. Full-position settlement repays the debt and returns any surplus to the borrower.</>
          </p>
          </div>
        </section>

        <section id="user-actions" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">User Actions</h2>
          <ul className="space-y-2 type-doc-body">
            <li>Borrowing more reduces health because debt rises against the same collateral.</li>
            <li>Repaying debt improves health immediately. Repayment continues even when the oracle blocks new borrowing.</li>
            <li>Pledging additional approved positions increases headroom if the RiskModule accepts them.</li>
            <li>Withdrawing collateral is allowed only if the account stays healthy. Risk-increasing withdrawals are blocked when the TWAP check fails or the Chainlink feed is stale.</li>
          </ul>
          <p className="mt-4 type-doc-body">
            For how each reserve&apos;s Collateral Factor is set, see{" "}
            <Link href="/developers/architecture/collateral-factors" className="text-type-accent hover:underline">
              Collateral Factors
            </Link>.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How health factor measures account safety from vault-token value, Collateral Factors and GHO debt."
        sectionColor="violet"
      />
    </div>
  ))
}
