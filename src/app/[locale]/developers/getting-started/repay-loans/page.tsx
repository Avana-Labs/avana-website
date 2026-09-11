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
    description: "How to repay debt on Avana and restore health on your LP-backed loan.",
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
          description="Repay debt to improve health and regain control over your LP collateral."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="type-doc-body">
            <>Repayment returns the borrowed asset through the Borrow Spoke and reduces the account&apos;s outstanding debt, including accrued interest. The LP collateral remains deposited. With less debt against the same collateral, the account&apos;s health factor and remaining borrowing capacity increase.</>{" "}<>{"You can also withdraw while debt is still open if the remaining collateral still supports the outstanding debt after the withdrawal. Avana runs a health check before releasing the position."}</>
          </p>
        </section>

        <section id="repay-process" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Repay Process</h2>
          <div className="space-y-5 type-doc-body">
            <div>
              <p className="type-doc-subsection-title">1. Choose an amount</p>
              <p className="mt-1 type-doc-body">
                Select partial repayment to regain buffer, or repay the full balance to clear debt
                entirely.
              </p>
            </div>
            <div>
              <p className="type-doc-subsection-title">2. Submit the debt asset</p>
              <p className="mt-1 type-doc-body">
                Approve and confirm the repayment transaction. The payment is routed through the
                Borrow Spoke and applied against your outstanding liability, including accrued
                interest.
              </p>
            </div>
            <div>
              <p className="type-doc-subsection-title">3. Health updates</p>
              <p className="mt-1 type-doc-body">
                Once the repayment confirms, your health factor and remaining borrowing capacity
                update in the interface.
              </p>
            </div>
          </div>
        </section>

        <section id="partial-vs-full" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Partial vs Full Repayment</h2>
          <p className="mb-4 type-doc-body">
            <>A partial repayment reduces debt without closing the loan. It increases the collateral buffer and can allow a later withdrawal or fee claim to pass the account&apos;s health checks.</>{" "}<>Full repayment clears all debt for that borrow. At that point, collateral restrictions
            tied to the loan are released and you can withdraw your LP through{" "}
            <Link href="/developers/getting-started/withdraw-collateral" className="text-[#01AACF] hover:underline">
              Withdraw Collateral
            </Link>
            .</>{" "}<>Interest keeps accruing on open debt until you repay. The amount shown in the interface
            includes accrued interest, not just the original borrow.</>
          </p>
        </section>

        <section id="when-urgent" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">When Repayment Is Urgent</h2>
          <p className="mb-4 type-doc-body">
            <>Repayment directly reduces the debt used in the health-factor calculation. Near the liquidation threshold, this can increase the account&apos;s buffer without relying on a recovery in collateral prices.</>{" "}<>Once health crosses the liquidation boundary, see the{" "}
            <Link href="/developers/liquidation" className="text-[#01AACF] hover:underline">
              Liquidation Framework
            </Link>{" "}
            for what happens next.</>
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How to repay debt and restore health on an LP-backed loan."
        sectionColor="emerald"
      />
    </div>
  ))
}
