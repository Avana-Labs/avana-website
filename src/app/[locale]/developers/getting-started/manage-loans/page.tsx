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
    description: "How to monitor and manage an open loan backed by LP collateral on Avana.",
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
          description="Track health, repay debt, claim fees, and adjust collateral while your loan is open."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="type-doc-body">
            <>An open loan changes as interest accrues and the underlying LP position&apos;s prices, inventory, and fees change. Monitoring therefore requires both the current debt and the risk-adjusted collateral value; the balances recorded when the loan opened are not enough to determine its current health.</>{" "}<>{"Accrued fees can count toward your collateral buffer until they are claimed. When you claim fees, that value leaves the position, which can lower health if your account is already close to the liquidation threshold."}</>
          </p>
        </section>

        <section id="borrowing-more" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrowing More</h2>
          <p className="mb-4 type-doc-body">
            <>An additional borrow uses the same collateral, capacity, liquidity, and health checks as the initial borrow. It can proceed only if the account has remaining capacity and the Hub can supply the requested asset within active caps.</>{" "}<>Partial repayment frees capacity immediately. It lowers debt, improves health, and can
            make room for withdrawals or fee claims later.</>
          </p>
        </section>

        <section id="monitoring-health" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Monitoring Health</h2>
          <div className="space-y-4 type-doc-body">
            <p>
            <><strong className="text-gray-900">Healthy:</strong> adjusted collateral value exceeds debt, leaving a buffer before the liquidation threshold.</>{" "}<><strong className="text-gray-900">Watchlist:</strong> the account passes health checks but has a smaller buffer. Repayment or additional approved collateral can increase that buffer.</>{" "}<><strong className="text-gray-900">Liquidatable:</strong> the account has crossed the liquidation threshold and is eligible for the configured liquidation process.</>
          </p>
          </div>
          <p className="mt-4 type-doc-body">
            See{" "}
            <Link href="/developers/architecture/health-factor" className="text-[#01AACF] hover:underline">
              Health Factor
            </Link>{" "}
            for how health is calculated.
          </p>
        </section>

        <section id="operational-control" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Operational Control</h2>
          <ol className="list-decimal list-decimal space-y-3 ps-5 type-doc-body">
            <li>Repay part of the debt to rebuild buffer</li>
            <li>Add more approved LP collateral to the same Borrow Spoke</li>
            <li>Claim accrued fees when the account still passes post-claim health checks</li>
            <li>Withdraw or resize collateral only when the remaining account still stays healthy</li>
          </ol>
        </section>

        <section id="position-changes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Position Changes</h2>
          <div className="space-y-4 type-doc-body">
            <p>
            <>A deposited LP position remains active in its pool while debt is open. Price changes, fee accrual, and inventory shifts affect the collateral value used in Avana&apos;s health calculations, even without a new transaction from the borrower.</>{" "}<>Fee claims, collateral withdrawals, and supported position changes pass through Avana while the position is held as collateral. The Borrow Spoke evaluates the resulting account health before allowing value to leave or the position to change.</>
          </p>
          </div>
        </section>

        <section id="key-constraints" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Key Constraints</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Collateral changes cannot leave remaining debt above allowed spoke capacity</li>
            <li>New or replacement positions must stay inside the approved pool set</li>
            <li>Borrow actions still depend on Hub liquidity and active caps</li>
            <li>Repay or add collateral before health reaches liquidation territory</li>
          </ul>
          <p className="mt-4 type-doc-body">
            See{" "}
            <Link href="/developers/liquidation" className="text-[#01AACF] hover:underline">
              Liquidation Framework
            </Link>{" "}
            and{" "}
            <Link href="/developers/architecture/collateral-factors" className="text-[#01AACF] hover:underline">
              Collateral Factors
            </Link>{" "}
            when making changes to a live loan.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How to monitor and manage an open loan backed by LP collateral."
        sectionColor="emerald"
      />
    </div>
  ))
}
