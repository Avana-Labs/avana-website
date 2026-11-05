import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'architecture/collateral-factors', {
    title: "Collateral Factors",
    description: "How each vault-token reserve's Collateral Factor turns LP position value into GHO borrowing capacity on an Avana Borrow Spoke.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "how-it-works", title: "How It Works" },
  { id: "borrowable-value", title: "Borrowable Value" },
  { id: "notes", title: "Notes" },
]

export default async function CollateralFactorsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "architecture/collateral-factors", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Collateral Factors"
          description="How much of an LP position's value supports GHO debt."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="type-doc-body">
            Valuation and borrowing limits are separate. The LPOracle reports the value of the liquidity behind each vault token with no haircut. The reserve&apos;s Collateral Factor then sets how much of that value supports debt. The formulas are LPCollateralFactor = min(Token0CF, Token1CF) × PoolRiskFactor and BorrowingCapacity = LPPositionValue × LPCollateralFactor.
          </p>
        </section>

        <section id="how-it-works" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">How It Works</h2>
          <p className="type-doc-body">
            {"Only positions in approved markets are accepted. The RiskModule accepts an approved Uniswap v2 pool, or an approved Uniswap v3 pool, fee tier and range."}{" "}
            {"The factor starts from the lower Collateral Factor of the pool's two tokens. The pool risk factor then reduces it once. The pool risk factor reflects range, price sensitivity, pool depth and expected liquidation costs."}{" "}
            {"Gauntlet suggests a starting factor as low as 0.25× the lower underlying factor when borrowing an asset other than the pool's tokens, such as GHO against WETH/USDC. Each market's values are set by governance."}{" "}
          </p>
        </section>

        <section id="borrowable-value" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrowable Value</h2>
          <p className="mb-4 type-doc-body">
            This example is illustrative and does not show market parameters. GHO and USDC are valued at $1. A $100,000 full-range WETH/USDC position is represented by one vault-token base unit per unit of liquidity, valued at $100,000 in total. With a lower underlying Collateral Factor of 70% and a pool risk factor of 50%, the LP Collateral Factor is 35%. Borrowing capacity is 35,000 GHO.
          </p>
          <div className="doc-topic type-doc-body">
            Collateral Risk is not a haircut. It sets the borrower&apos;s interest premium. Capacity
            also depends on existing debt, exposure caps, available GHO liquidity and oracle checks.
          </div>
        </section>

        <section id="notes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Notes</h2>
          <ul className="space-y-3 type-doc-body">
            <li>• Each market&apos;s pool risk factor and Collateral Factor are set by governance.</li>
            <li>• Each market category (Stable LP, Correlated LP and Blue-chip/stable LP) has its own Borrow Spoke, parameters and caps.</li>
            <li>• Read this together with Health Factor and Liquidation Framework when building monitoring tools.</li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How the Collateral Factor turns vault-token value into GHO borrowing capacity."
        sectionColor="violet"
      />
    </div>
  ))
}
