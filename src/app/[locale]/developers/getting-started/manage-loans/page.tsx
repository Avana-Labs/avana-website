import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'getting-started/manage-loans', {
    title: "Manage Loans",
    description: "How to monitor and manage an open GHO loan backed by pledged LP collateral on Avana.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "borrowing-more", title: "Borrowing More" },
  { id: "monitoring-health", title: "Monitoring Health" },
  { id: "operational-control", title: "Operational Control" },
  { id: "position-changes", title: "Position Changes" },
  { id: "key-constraints", title: "Key Constraints" },
]

export default async function ManageLoansPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "getting-started/manage-loans", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Manage Loans"
          description="Track health, repay GHO, add collateral, and withdraw positions while your loan is open."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="type-doc-body">
            <>An open loan changes as interest accrues and as the prices and inventory of the underlying LP position change. To monitor a loan, track both the current GHO debt and the current collateral value. The balances recorded when the loan opened do not determine its current health.</>{" "}<>{"The borrowing rate is BaseRate × (1 + UserRiskPremium). Aave V4 updates the risk premium when you borrow, withdraw, or change collateral, and on request."}</>
          </p>
        </section>

        <section id="borrowing-more" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrowing More</h2>
          <p className="mb-4 type-doc-body">
            <>An additional borrow goes through the same price-feed, capacity, liquidity, and health checks as the first. It can proceed only if the account has remaining capacity, the Avana Hub has GHO available within active caps, and the TWAP and Chainlink checks pass.</>{" "}<>Partial repayment lowers debt and improves health immediately. This can make room
            for a later withdrawal.</>
          </p>
        </section>

        <section id="monitoring-health" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Monitoring Health</h2>
          <div className="space-y-4 type-doc-body">
            <p>
            <><strong className="text-gray-900">Healthy:</strong> the health factor is above 1.00 with a buffer. For example, 25,000 GHO borrowed against a $100,000 WETH/USDC position with a 35% Collateral Factor gives a health factor of 1.40.</>{" "}<><strong className="text-gray-900">Watchlist:</strong> the health factor is above 1.00 but the buffer is small. In the same example, the health factor reaches 1.00 if collateral value falls to about $71,400. Repayment or additional approved collateral increases the buffer.</>{" "}<><strong className="text-gray-900">Liquidatable:</strong> the health factor is below 1.00. Approved keepers can then call LPVaultSwap to liquidate the position. LPVaultSwap uses the market&apos;s settlement mode: partial or full-position settlement.</>
          </p>
          </div>
          <p className="mt-4 type-doc-body">
            For how health is calculated, see{" "}
            <Link href="/developers/architecture/health-factor" className="text-type-accent hover:underline">
              Health Factor
            </Link>.
          </p>
        </section>

        <section id="operational-control" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Operational Control</h2>
          <ol className="list-decimal list-decimal space-y-3 ps-5 type-doc-body">
            <li>Repay part of the GHO debt to rebuild the buffer</li>
            <li>Pledge more approved LP positions in the same market, within per-market and per-account limits</li>
            <li>Withdraw a position only when the remaining account stays healthy</li>
            <li>Repay or withdraw by calling the contracts directly if the Avana frontend is unavailable</li>
          </ol>
        </section>

        <section id="position-changes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Position Changes</h2>
          <div className="space-y-4 type-doc-body">
            <p>
            <>A pledged LP position stays active in its pool while debt is open. Price changes and inventory shifts change the collateral value used in Avana&apos;s health calculations, even without a new transaction from the borrower. A Uniswap v3 position that moves out of range stops earning fees until it is back in range.</>{" "}<>Withdrawals pass through the AaveAdapter and the borrower&apos;s Position Proxy. The Adapter checks account health and the price feeds before it burns vault tokens. The LP Vault then releases the position.</>
          </p>
          </div>
        </section>

        <section id="key-constraints" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Key Constraints</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>A withdrawal cannot leave the account unhealthy</li>
            <li>Pledged positions must be in an approved pool, fee tier, and range</li>
            <li>New borrowing depends on GHO available in the Avana Hub and active caps</li>
            <li>New borrowing and withdrawals are blocked when the TWAP is outside tolerance or the Chainlink feed is stale. Repayment continues.</li>
          </ul>
          <p className="mt-4 type-doc-body">
            Before you change an open loan, read these pages:{" "}
            <Link href="/developers/liquidation" className="text-type-accent hover:underline">
              Liquidation Framework
            </Link>,{" "}
            <Link href="/developers/architecture/collateral-factors" className="text-type-accent hover:underline">
              Collateral Factors
            </Link>.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How to monitor and manage an open GHO loan backed by pledged LP collateral."
        sectionColor="emerald"
      />
    </div>
  ))
}
