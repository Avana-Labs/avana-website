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
            Repayment sends the borrowed asset back to the protocol and reduces your outstanding debt.
            Your LP collateral stays in place — only the debt side of the account changes. Health
            improves immediately because the same collateral now supports a smaller liability.
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
            Partial repayment is enough to improve safety when your account is drifting toward
            liquidation. You do not need to clear the full balance for repayment to matter.
          </p>
          <p className="mb-4 type-doc-body">
            Full repayment clears all debt for that borrow. At that point, collateral restrictions
            tied to the loan are released and you can withdraw your LP through{" "}
            <Link href="/developers/getting-started/withdraw-collateral" className="text-[#01AACF] hover:underline">
              Withdraw Collateral
            </Link>
            .
          </p>
          <p className="type-doc-body">
            Interest keeps accruing on open debt until you repay. The amount shown in the interface
            includes accrued interest, not just the original borrow.
          </p>
        </section>

        <section id="when-urgent" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">When Repayment Is Urgent</h2>
          <p className="mb-4 type-doc-body">
            When health is near the liquidation threshold, repayment is the fastest way to improve
            safety. It directly reduces debt without waiting for markets to recover or adding more
            collateral first.
          </p>
          <p className="type-doc-body">
            Once health crosses the liquidation boundary, see the{" "}
            <Link href="/developers/liquidation" className="text-[#01AACF] hover:underline">
              Liquidation Framework
            </Link>{" "}
            for what happens next.
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
