import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'getting-started/repay-loans', {
    title: "Repay Loans",
    description: "How to repay GHO debt on Avana and restore health on your LP-backed loan.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "repay-process", title: "Repay Process" },
  { id: "partial-vs-full", title: "Partial vs Full Repayment" },
  { id: "when-urgent", title: "When Repayment Is Urgent" },
]

export default async function RepayLoansPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "getting-started/repay-loans", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Repay Loans"
          description="Repay GHO to improve health and make room to withdraw your LP collateral."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="type-doc-body">
            <>Repayment returns GHO through the AaveAdapter and the borrower&apos;s Position Proxy. It reduces the account&apos;s outstanding debt, including accrued interest. The LP position stays pledged. With less debt against the same collateral, the account&apos;s health factor and remaining borrowing capacity increase.</>{" "}<>{"You can repay at any time through the AaveAdapter unless it is paused. You can also repay by calling the contracts directly, without the Avana frontend. This avoids the frontend fee."}</>
          </p>
        </section>

        <section id="repay-process" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Repay Process</h2>
          <div className="space-y-5 type-doc-body">
            <div>
              <p className="type-doc-subsection-title">1. Choose an amount</p>
              <p className="mt-1 type-doc-body">
                Make a partial repayment to rebuild the buffer, or repay the full balance to clear
                the debt.
              </p>
            </div>
            <div>
              <p className="type-doc-subsection-title">2. Submit GHO</p>
              <p className="mt-1 type-doc-body">
                Approve and confirm the repayment transaction. The AaveAdapter repays the Borrow
                Spoke through your Position Proxy. The payment is applied to your outstanding debt,
                including accrued interest.
              </p>
            </div>
            <div>
              <p className="type-doc-subsection-title">3. Health updates</p>
              <p className="mt-1 type-doc-body">
                Once the repayment is confirmed, your health factor and remaining borrowing capacity
                update in the interface.
              </p>
            </div>
          </div>
        </section>

        <section id="partial-vs-full" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Partial vs Full Repayment</h2>
          <p className="mb-4 type-doc-body">
            <>A partial repayment reduces debt without closing the loan. It increases the buffer and can allow a later withdrawal to pass the account&apos;s health check.</>{" "}<>Full repayment clears the GHO debt. You can then withdraw your LP through{" "}
            <Link href="/developers/getting-started/withdraw-collateral" className="text-type-accent hover:underline">
              Withdraw Collateral
            </Link>
            . The LP Vault releases the LP tokens or NFT with uncollected fees.</>{" "}<>Interest accrues on open debt at BaseRate × (1 + UserRiskPremium) until you repay. The
            amount shown in the interface includes accrued interest, not just the original borrow.</>
          </p>
        </section>

        <section id="when-urgent" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">When Repayment Is Urgent</h2>
          <p className="mb-4 type-doc-body">
            <>Repayment directly reduces the debt used in the health-factor calculation. It increases the account&apos;s buffer without relying on a recovery in collateral prices. Repayment continues when price-feed checks block new borrowing and withdrawals, and when a market is being offboarded.</>{" "}<>Once the health factor falls below 1.00, approved keepers can liquidate the account. See the{" "}
            <Link href="/developers/liquidation" className="text-type-accent hover:underline">
              Liquidation Framework
            </Link>{" "}
            for what happens next.</>
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How to repay GHO debt and restore health on an LP-backed loan."
        sectionColor="emerald"
      />
    </div>
  ))
}
