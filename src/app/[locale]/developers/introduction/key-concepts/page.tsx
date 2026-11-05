import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'introduction/key-concepts', {
    title: "Key Concepts",
    description: "Core concepts behind Avana: pledging LP positions, vault tokens, LPOracle valuation, Collateral Factors, GHO borrowing and settlement modes.",
  })
}

const sections = [
  { id: "core-insight", title: "Core Insight" },
  { id: "user-flow", title: "Borrowing Model" },
  { id: "oracle-valuation", title: "Oracle & Valuation" },
  { id: "borrowing-process", title: "Borrowing Capacity" },
  { id: "health-monitoring", title: "Health & Liquidation" },
  { id: "fee-collection", title: "Fee Treatment" },
]

export default async function KeyConceptsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "introduction/key-concepts", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader title="Key Concepts" />

        <section id="core-insight" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Core Insight</h2>
          <p className="mb-4 type-doc-body">
            <>Token collateral is usually a balance of a single asset, such as ETH, BTC or a stablecoin. An LP position is a changing combination of assets. Trades alter its inventory, prices change its value, and fees accrue over time. A concentrated-liquidity position also depends on its range and may become one-sided as prices move.</>{" "}<>Avana therefore sets risk parameters per market. Each approved pool (and range, where applicable) has its own vault token. Each market has its own pool risk factor, settlement mode, TWAP window, allowed price deviation and maximum feed age. Each of the three market categories (Stable LP, Correlated LP and Blue-chip/stable LP) has its own Borrow Spoke, parameters and caps.</>
          </p>
        </section>

        <section id="user-flow" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrowing Model</h2>
          <div className="space-y-4 type-doc-body">
            <p>
            <>Users pledge an approved Uniswap v2 LP token or Uniswap v3 position to the LP Vault.
              A Pledge changes custody but does not remove liquidity, so the position keeps earning
              fees. A Uniswap v3 position stops earning fees while it is out of range.</>{" "}<>The Collateralization Module mints vault tokens 1:1 with the pledged liquidity.
              The AaveAdapter supplies them to the market&apos;s Avana Borrow Spoke through the
              borrower&apos;s Position Proxy.</>{" "}<>The borrower then borrows GHO from the Avana Hub. The Borrow Spoke applies
              vault-token risk parameters, and the Hub keeps GHO liquidity and debt accounting.</>
          </p>
          </div>
        </section>

        <section id="oracle-valuation" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Oracle & Valuation</h2>
          <p className="mb-4 type-doc-body">
            <>The LPOracle prices each vault token from the pool&apos;s liquidity math. It derives the
            token amounts behind each vault token and values them at Chainlink prices:
            VaultTokenPrice = q0·P0 + q1·P1. For Uniswap v3, the amounts come from the
            position&apos;s liquidity and range at the reference price.</>{" "}<>The oracle applies no haircut. Each reserve&apos;s Collateral Factor handles risk separately, and Collateral Risk sets the borrower&apos;s interest premium.</>{" "}<>Chainlink is the valuation reference. The pool&apos;s TWAP is a consistency check. It is
            not averaged into the price and does not replace Chainlink. If the TWAP moves outside
            tolerance, new borrowing and risk-increasing withdrawals are blocked. Repayment and liquidation continue at the Chainlink price.</>
          </p>
        </section>

        <section id="borrowing-process" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrowing Capacity</h2>
          <p className="mb-4 type-doc-body">
            <><>Borrowing capacity is the position&apos;s value multiplied by the reserve&apos;s Collateral
            Factor: LPCollateralFactor = min(Token0CF, Token1CF) × PoolRiskFactor. The pool risk
            factor is applied once. It reflects range, price sensitivity, pool depth and expected liquidation costs.</>{" "}<>Capacity also depends on existing debt, exposure caps, available GHO liquidity and
            oracle checks. The borrowing rate is BaseRate × (1 + UserRiskPremium). With several
            collateral reserves, the premium is a weighted average.</></>{" "}<>An illustrative example of how each reserve&apos;s factor is derived is in{" "}
            <Link href="/developers/architecture/collateral-factors" className="text-type-accent hover:underline">
              Collateral Factors
            </Link>.</>
          </p>
        </section>

        <section id="health-monitoring" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Health & Liquidation</h2>
          <p className="mb-4 type-doc-body">
            <>Health factor compares collateral value, after each reserve&apos;s Collateral Factor,
            with outstanding GHO debt. An account becomes eligible for liquidation when its health
            factor falls below 1.</>{" "}<>Only approved keepers can call LPVaultSwap. LPVaultSwap takes a GHO flash loan,
            repays the debt and settles the LP collateral in one transaction. Uniswap v2 and some
            Uniswap v3 markets use partial settlement, which removes only the liquidity needed to
            restore health. Markets where partial removal is not suitable use full-position
            settlement, which returns any surplus to the borrower.</>
          </p>
        </section>

        <section id="fee-collection" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Fee Treatment</h2>
          <p className="mb-4 type-doc-body">
            <>Pledged positions stay in the pool and keep earning trading fees. A Uniswap v3
            position earns fees only while it is in range. When a borrower withdraws, the LP Vault releases the LP
            tokens or NFT together with any uncollected fees. Withdrawal is allowed only if the
            account stays healthy.</>{" "}<><strong>Related docs:</strong>{" "}
            <Link href="/developers/integrations/price-oracles" className="text-type-accent hover:underline">
              Price Oracles
            </Link>,{" "}
            <Link href="/developers/getting-started/claim-lp-fees" className="text-type-accent hover:underline">
              LP Fees
            </Link>.</>
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="The main concepts behind pledging LP positions, vault-token valuation, Collateral Factors and GHO borrowing in Avana."
        sectionColor="blue"
      />
    </div>
  ))
}
