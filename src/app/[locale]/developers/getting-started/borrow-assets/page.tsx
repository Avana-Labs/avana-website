import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'getting-started/borrow-assets', {
    title: "Borrow Assets",
    description: "How to borrow against deposited LP collateral on Avana.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "borrow-checks", title: "Borrow Checks" },
  { id: "health-check", title: "Health Check" },
  { id: "internal-accounting", title: "Internal Accounting" },
  { id: "borrowable-assets", title: "Borrowable Assets" },
  { id: "borrowing-power", title: "Borrowing Power" },
]

export default async function BorrowAssetsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "getting-started/borrow-assets", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Borrow Assets"
          description="Borrow stablecoins, ETH, or other enabled assets against the LP collateral you have already deposited."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>After deposit and valuation, a borrower can request an asset and amount within the account&apos;s available capacity. The Borrow Spoke checks the request and draws the asset from the Hub; the confirmed transaction sends the borrowed tokens to the borrower&apos;s wallet.</>{" "}<>Interest increases outstanding debt over time, so health factor can decline even when the collateral position is unchanged. Unused borrowing capacity provides a buffer against that debt growth and changes in collateral value.</>{" "}<>{"Avana values each LP position separately before aggregating borrowing capacity within a Borrow Spoke. Similar-looking positions can contribute different amounts because their pools, recoverable values, and collateral factors differ."}</>
          </p>
        </section>

        <section id="borrow-checks" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrow Checks</h2>
          <div className="doc-prose">
            <p className="type-doc-body"><>The Borrow Spoke checks that the account still holds the deposited positions and that their pools remain approved for collateral use.</>{" "}<>The borrow amount must fit within your remaining borrowing capacity in that Borrow
                Spoke.</>{" "}<>The Hub must have enough of the requested asset available, and protocol caps must
                allow the borrow.</>{" "}<>Your account must stay above the liquidation threshold after the new debt is added.</></p>
          </div>
        </section>

        <section id="health-check" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Health Check</h2>
          <p className="mb-4 type-doc-body">
            Before a borrow is approved, Avana checks that your account stays healthy after the new
            debt. Health factor is adjusted collateral value divided by outstanding debt. The
            adjusted collateral value already includes LP valuation, collateral factors, and
            recoverable-value discounts.
          </p>

          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">
              healthFactor = adjustedCollateralValue / outstandingDebt
            </code>
          </div>

          <p className="mt-4 type-doc-body">
            If health falls below the liquidation boundary, the position becomes eligible for
            liquidation. See{" "}
            <Link href="/developers/architecture/health-factor" className="text-[#01AACF] hover:underline">
              Health Factor
            </Link>{" "}
            for the full model.
          </p>
        </section>

        <section id="internal-accounting" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Internal Accounting</h2>
          <div className="space-y-4 type-doc-body">
            <p>
            <><strong className="text-gray-900">Debt shares:</strong> new debt is recorded through a
              debt-share model so interest can accrue over time without rewriting the full account
              balance on every block.</>{" "}<><strong className="text-gray-900">Hub draw:</strong> the Borrow Spoke requests the
              asset from the Hub only after the spoke finishes the collateral, capacity, and health
              checks.</>{" "}<><strong className="text-gray-900">State update:</strong> the user receives the borrowed
              asset, and the spoke records the resulting debt state so future health checks,
              repayments, and liquidation logic all reference the same updated account.</>
          </p>
          </div>
        </section>

        <section id="borrowable-assets" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrowable Assets</h2>
          <p className="mb-4 type-doc-body">
            Borrowable assets are configured for each deployment and market. They can include major stablecoins, GHO, ETH, BTC, and other supported assets. Approval of an LP pool establishes collateral eligibility; it does not make every debt asset available to that market.
          </p>
          <p className="type-doc-body">
            Check the Avana interface on your target deployment for the live borrow list.
          </p>
        </section>

        <section id="borrowing-power" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrowing Power</h2>
          <p className="mb-4 type-doc-body">
            <>Borrowing power is the sum of your approved LP positions in one Borrow Spoke, after
            collateral factors and risk discounts. Each position contributes based on its own pool,
            range, liquidity, and risk settings.</>{" "}<>As debt approaches borrowing capacity, less capacity remains to absorb price changes or interest accrual. See{" "}
            <Link href="/developers/architecture/collateral-factors" className="text-[#01AACF] hover:underline">
              Collateral Factors
            </Link>{" "}
            and{" "}
            <Link href="/developers/architecture/health-factor" className="text-[#01AACF] hover:underline">
              Health Factor
            </Link>{" "}
            when sizing a borrow.</>
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How to borrow against deposited LP collateral on Avana."
        sectionColor="emerald"
      />
    </div>
  ))
}
