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
    description: "How to withdraw a pledged LP position from the LP Vault after repaying GHO or when your account stays healthy.",
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
          description="Withdraw your LP position from the LP Vault when debt is repaid or your account stays healthy without it."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>Withdrawal returns an LP token or position NFT from the LP Vault to the depositor&apos;s wallet. The AaveAdapter withdraws and burns the matching vault tokens. The LP Vault then releases the LP tokens or NFT with any uncollected fees.</>{" "}<>While GHO debt remains, a withdrawal is allowed only if the account stays healthy
            afterward. The AaveAdapter checks account health before the position is released.</>{" "}<>{"Risk-increasing withdrawals are blocked while the pool's TWAP is outside the allowed tolerance from the Chainlink price. Voluntary withdrawals are blocked while the Chainlink feed is stale or invalid. Repayment continues in both cases."}</>
          </p>
        </section>

        <section id="withdrawal-process" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Withdrawal Process</h2>
          <div className="space-y-5 type-doc-body">
            <div>
              <p className="type-doc-subsection-title">1. Repay debt if needed</p>
              <p className="mt-1 type-doc-body">
                If GHO debt remains, the rest of your collateral must support it once the position is withdrawn. You may need to repay part of the debt first. Full repayment removes the health requirement.
              </p>
            </div>
            <div>
              <p className="type-doc-subsection-title">2. Request withdrawal</p>
              <p className="mt-1 type-doc-body">
                In the Avana interface, select the position you want to withdraw and confirm the
                transaction. You can also withdraw by calling the contracts directly, without the
                Avana frontend.
              </p>
            </div>
            <div>
              <p className="type-doc-subsection-title">3. Health check and release</p>
              <p className="mt-1 type-doc-body">
                The AaveAdapter checks the price feeds and checks account health with the position removed. If the account stays healthy, the Adapter burns the vault tokens. The LP Vault then releases the LP tokens or NFT, with uncollected fees, to the depositor&apos;s wallet.
              </p>
            </div>
          </div>
        </section>

        <section id="partial-withdrawal" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Partial Withdrawal</h2>
          <p className="type-doc-body">
            You can withdraw one pledged position while keeping others pledged, as long as the
            remaining collateral still supports the open debt. Each withdrawal is checked against
            the account&apos;s health factor after the withdrawal.
          </p>
        </section>

        <section id="after-withdrawal" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">After Withdrawal</h2>
          <ul className="space-y-2 type-doc-body">
            <li>Your LP returns to your wallet and you control it directly again</li>
            <li>You can keep it in the pool, adjust the range on Uniswap, or remove liquidity entirely</li>
            <li>
              You can pledge it again later through{" "}
              <Link href="/developers/getting-started" className="text-type-accent hover:underline">
                Deposit LP
              </Link>{" "}
              if the pool is still approved and within pilot limits
            </li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How to withdraw a pledged LP position from the LP Vault after repaying GHO or when health allows."
        sectionColor="emerald"
      />
    </div>
  ))
}
