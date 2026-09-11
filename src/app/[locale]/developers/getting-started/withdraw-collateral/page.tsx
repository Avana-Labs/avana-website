import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'getting-started/withdraw-collateral', {
    title: "Withdraw Collateral",
    description: "How to withdraw LP collateral from Avana after repaying debt or when your account stays healthy.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "withdrawal-process", title: "Withdrawal Process" },
  { id: "partial-withdrawal", title: "Partial Withdrawal" },
  { id: "after-withdrawal", title: "After Withdrawal" },
]

export default async function WithdrawCollateralPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "getting-started/withdraw-collateral", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Withdraw Collateral"
          description="Withdraw your LP position from Avana when debt is cleared or your account stays healthy without it."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>Withdrawal transfers an LP token or position NFT from Avana&apos;s custody back to the borrower&apos;s wallet. Once the associated debt is fully repaid, the position no longer needs to secure that loan. While debt remains, withdrawal depends on the value of the collateral left in the account.</>{" "}<>You can also withdraw while debt is still open if the remaining collateral still supports
            the outstanding debt after the withdrawal. Avana runs a health check before releasing
            the position.</>{" "}<>{"Interest keeps accruing on open debt until you repay. The amount shown in the interface includes accrued interest, not just the original borrow."}</>
          </p>
        </section>

        <section id="withdrawal-process" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Withdrawal Process</h2>
          <div className="space-y-5 type-doc-body">
            <div>
              <p className="type-doc-subsection-title">1. Repay debt if needed</p>
              <p className="mt-1 type-doc-body">
                If debt remains, repayment may be needed before the remaining collateral can support it without the position being withdrawn. Full repayment removes that loan&apos;s collateral requirement.
              </p>
            </div>
            <div>
              <p className="type-doc-subsection-title">2. Request withdrawal</p>
              <p className="mt-1 type-doc-body">
                In the Avana interface, select the LP position you want to withdraw and confirm the
                transaction.
              </p>
            </div>
            <div>
              <p className="type-doc-subsection-title">3. Health check and release</p>
              <p className="mt-1 type-doc-body">
                The Borrow Spoke recalculates account health with the requested collateral removed. If the remaining account passes the health check, the LP token or position NFT is released to the borrower&apos;s wallet.
              </p>
            </div>
          </div>
        </section>

        <section id="partial-withdrawal" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Partial Withdrawal</h2>
          <p className="type-doc-body">
            You can withdraw one LP position while keeping others deposited, or withdraw part of a
            fungible LP balance, as long as the remaining collateral still covers open debt. Each
            withdrawal is checked individually against your current health factor.
          </p>
        </section>

        <section id="after-withdrawal" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">After Withdrawal</h2>
          <ul className="space-y-2 type-doc-body">
            <li>Your LP returns to your wallet and you control it directly again</li>
            <li>You can keep it in the pool, adjust the range on the DEX, or exit liquidity entirely</li>
            <li>
              You can deposit it again later through{" "}
              <Link href="/developers/getting-started" className="text-[#01AACF] hover:underline">
                Deposit LP
              </Link>{" "}
              if the pool is still approved
            </li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How to withdraw LP collateral from Avana after repaying debt or when health allows."
        sectionColor="emerald"
      />
    </div>
  ))
}
