import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'getting-started/claim-lp-fees', {
    title: "Claim LP Fees",
    description: "How to claim accrued LP trading fees on Avana without exiting your collateral position.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "how-it-works", title: "How It Works" },
  { id: "health-checks", title: "Health Checks" },
  { id: "fee-accounting", title: "Fee Accounting" },
  { id: "key-benefits", title: "Key Benefits" },
]

export default async function ClaimLPFeesPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "getting-started/claim-lp-fees", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Claim LP Fees"
          description="Claim trading fees from your LP position while it stays active as collateral."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>Avana accounts for principal liquidity and accrued fees separately. Where the LP format supports fee collection, a borrower can claim eligible fees without redeeming the principal position held as collateral.</>{" "}<>Fee claims still affect your collateral value, so Avana runs a health check before and
            after the claim. If claiming fees would push your account below the required collateral
            boundary, the claim is blocked until you repay debt or add more collateral.</>{" "}<>{"Interest increases outstanding debt over time, so health factor can decline even when the collateral position is unchanged. Unused borrowing capacity provides a buffer against that debt growth and changes in collateral value."}</>
          </p>
        </section>

        <section id="how-it-works" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">How It Works</h2>
          <div className="space-y-4 type-doc-body">
            <p>
            <>A fee-claim request identifies the deposited position. Avana routes it through the DEX-specific collection method for that LP format.</>{" "}<>For concentrated-liquidity DEXs, that is typically a collect-style call that pulls
              accrued fees while leaving principal in the pool. For fungible LP tokens, Avana uses
              the DEX&apos;s native fee-claim path when one is available.</>{" "}<>After fees are claimed, Avana syncs the updated position state back into the Borrow
              Spoke so health and borrowing capacity reflect the new balance.</>
          </p>
          </div>
        </section>

        <section id="health-checks" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Health Checks</h2>
          <p className="mb-4 type-doc-body">
            <>Accrued fees can count toward your collateral buffer until they are claimed. When you
            claim fees, that value leaves the position, which can lower health if your account is
            already close to the liquidation threshold.</>{" "}<>Repay debt or add collateral first if a fee claim would leave your account under the
            required boundary.</>
          </p>
        </section>

        <section id="fee-accounting" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Fee Accounting</h2>
          <div className="space-y-4 type-doc-body">
            <p>
            <>The oracle reports principal value and fee value separately. This allows the Borrow Spoke to account for claimable fees in collateral valuation and to update that valuation when fees leave the position.</>{" "}<>During liquidation, eligible accrued fees may be collected before principal liquidity is unwound. Applying those fees to recovery can reduce the amount of principal needed to cover debt.</>
          </p>
          </div>
          <p className="mt-4 type-doc-body">
            See{" "}
            <Link href="/developers/integrations/price-oracles" className="text-[#01AACF] hover:underline">
              Price Oracles
            </Link>{" "}
            and{" "}
            <Link href="/developers/liquidation" className="text-[#01AACF] hover:underline">
              Liquidation Framework
            </Link>
            .
          </p>
        </section>

        <section id="key-benefits" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Key Benefits</h2>
          <p className="type-doc-body">
            <>Your LP principal keeps earning fees and stays active in the pool while you borrow.</>{" "}
            <>You can realize fee income without unwinding the collateral position.</>{" "}
            <>Health checks prevent fee claims from pulling out too much value and leaving debt undersecured.</>
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How to claim accrued LP trading fees without exiting your collateral position."
        sectionColor="emerald"
      />
    </div>
  ))
}
