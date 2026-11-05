import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'liquidation/examples', {
    title: "Liquidation Examples",
    description: "A worked liquidation example for Avana, showing partial and full-position settlement of the same position at health factor 0.98.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "fungible-lp", title: "Starting Position" },
  { id: "concentrated-liquidity", title: "Partial Settlement Example" },
  { id: "nft-liquidity", title: "Full-Position Settlement Example" },
  { id: "multi-position-account", title: "Multi-Position Account" },
  { id: "edge-cases", title: "Edge Cases" },
  { id: "summary", title: "Summary" },
]

const edgeCases = [
  "If proceeds fall short of the debt, LPVaultSwap draws from the FirstLossReserve in the same transaction. If the reserve cannot cover the shortfall, the transaction reverts and debt and collateral are unchanged. Keepers may retry with a smaller partial liquidation.",
  "In partial settlement, Aave V4's dust rule may liquidate a small remaining position in full rather than leave an uneconomic remainder.",
  "If the Chainlink feed is stale and the cached price is past its maximum age, liquidations pause until the feed recovers or governance approves a backup feed. Repayment continues.",
  "An out-of-range Uniswap v3 position holds only one of its two tokens and stops earning fees while out of range, which changes the amounts recovered on removal.",
]

export default async function LiquidationExamplesPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "liquidation/examples", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Liquidation Examples"
          description="A worked example: the same unhealthy position settled under partial and full-position settlement."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>These examples apply the{" "}
            <Link href="/developers/liquidation" className="text-type-accent hover:underline">
              Liquidation Framework
            </Link>
            {" "}to one position.</>{" "}<>The figures are illustrative and are not market parameters. GHO and USDC are assumed to be worth $1. Governance sets the liquidation bonus, target health factor and fee caps for each market.</>
          </p>
        </section>

        <section id="fungible-lp" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Starting Position</h2>
          <div>
            <p className="mb-4 type-doc-body">
              A borrower pledges a $100,000 full-range WETH/USDC position. The borrower receives one vault-token base unit per unit of liquidity, valued at $100,000 in total. The lower Collateral Factor of the two underlying
              tokens is 70% and the pool risk factor is 50%, so the LP Collateral Factor is 35%.
            </p>
            <ul className="space-y-2 type-doc-body">
              <li>• Borrowing capacity is 35,000 GHO.</li>
              <li>• The interface limit at an opening health factor of 1.10 is about 31,800 GHO.</li>
              <li>• The borrower takes 25,000 GHO, for an initial health factor of 1.40.</li>
              <li>• The health factor reaches 1.00 when the collateral is worth about $71,400, a fall of about 29%.</li>
              <li>• The collateral then falls to $70,000 and the health factor to 0.98, so the account is eligible for liquidation.</li>
            </ul>
          </div>
        </section>

        <section id="concentrated-liquidity" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Partial Settlement Example</h2>
          <div>
            <p className="mb-4 type-doc-body">
              With a 5% liquidation bonus and a 1.05 target health factor, Aave V4&apos;s standard
              liquidation repays only enough debt to restore the target.
            </p>
            <ul className="space-y-2 type-doc-body">
              <li>• LPVaultSwap takes a GHO flash loan and repays about 2,564 GHO of debt.</li>
              <li>• About $2,692 of liquidity, less than 4% of the position, is removed from the pool and swapped to GHO.</li>
              <li>• The bonus funds the keeper reward, execution costs and Avana&apos;s capped fee. Aave&apos;s built-in liquidation fee is 0 for vault-token reserves.</li>
              <li>• The borrower keeps about $67,300 of collateral against 22,436 GHO of debt, for a health factor of 1.05.</li>
            </ul>
          </div>
        </section>

        <section id="nft-liquidity" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Full-Position Settlement Example</h2>
          <div>
            <p className="mb-4 type-doc-body">
              In a full-position market, the same position is settled in full and the surplus is returned to the borrower. The Aave liquidation bonus does not apply in this mode.
            </p>
            <ul className="space-y-2 type-doc-body">
              <li>• LPVaultSwap flash-borrows 25,000 GHO and repays the debt through the Position Proxy&apos;s settlement authority.</li>
              <li>• The Aave Adapter withdraws and burns all vault tokens. The LP Vault then releases the position for settlement through an approved route.</li>
              <li>• Settlement realizes 69,000 GHO.</li>
              <li>• The flash loan is repaid. The keeper reward, execution costs and Avana fee total 750 GHO, within the market&apos;s maximum percentage of debt.</li>
              <li>• The borrower receives the remaining 43,250 GHO.</li>
            </ul>
          </div>
        </section>

        <section id="multi-position-account" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Multi-Position Account</h2>
          <div>
            <p className="mb-4 type-doc-body">
              A borrower can hold more than one vault-token reserve as collateral on a Borrow Spoke.
              Aave V4 computes one health factor for the account, but settlement still happens
              position by position under each market&apos;s settlement mode.
            </p>
            <ul className="space-y-2 type-doc-body">
              <li>• The borrower&apos;s interest premium is the weighted average of the Collateral Risk of each reserve.</li>
              <li>• In partial-settlement markets, Aave V4&apos;s standard liquidation sizes repayment to its target health factor.</li>
              <li>• In full-position markets, the full debt is repaid if the position is the account&apos;s only collateral. Otherwise, repayment is sized to the approved health target.</li>
              <li>• Exposure limits at the pool, underlying-token and depositor level cap how much one account can hold. During the pilot, a limit on positions per account also applies.</li>
            </ul>
          </div>
        </section>

        <section id="edge-cases" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Edge Cases</h2>
          <ul className="space-y-3 type-doc-body">
            {edgeCases.map((item) => (
              <li key={item}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section id="summary" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Summary</h2>
          <p className="type-doc-body">
            In the same scenario, partial settlement removes less than 4% of the position and leaves the borrower with a health factor of 1.05. Full-position settlement closes the position and returns 43,250 GHO to the borrower. The settlement mode is set per market.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="A worked example comparing partial and full-position settlement."
        sectionColor="amber"
      />
    </div>
  ))
}
