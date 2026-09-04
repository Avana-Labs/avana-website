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
    description: "Understand the core concepts behind Avana, including LP collateral behavior, conservative valuation, Hub borrowing, and liquidation.",
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
            Standard lending markets usually treat collateral as simple token balances: ETH, BTC,
            stablecoins, or other ERC-20 assets. Avana is built for collateral that changes shape
            over time. LP positions can contain multiple assets, accrue fees, drift with price
            movement, become one-sided, or require a specific unwind path.
          </p>
          <p className="type-doc-body">
            Because of that, Avana underwrites collateral at the LP market level. Each supported
            pool or LP family can have its own valuation logic, collateral factors, borrowable
            assets, liquidation assumptions, and risk limits.
          </p>
        </section>

        <section id="user-flow" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrowing Model</h2>
          <div className="space-y-4 type-doc-body">
            <p>
              Users deposit supported LP positions into a Borrow Spoke. The positions can remain
              active in their pools while the protocol takes custody for collateral accounting.
            </p>
            <p>
              Each approved LP position is valued on its own. After collateral factors and pool
              risk controls are applied, its discounted contribution is added to borrowing capacity
              inside that Borrow Spoke.
            </p>
            <p>
              When the user borrows, the spoke draws liquidity from the Hub. LP market risk stays
              in the spoke layer, while shared capital accounting stays at the Hub.
            </p>
          </div>
        </section>

        <section id="oracle-valuation" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Oracle & Valuation</h2>
          <p className="mb-4 type-doc-body">
            Avana prices LP collateral by reconstructing the position and valuing the assets
            inside it. For fungible LPs, the protocol derives value from external asset prices and
            pool balance reconstruction. For concentrated liquidity, it decomposes the position by
            liquidity, range, current tick, token exposure, and accrued fees.
          </p>
          <p className="mb-4 type-doc-body">
            The result is then discounted into recoverable collateral value. Borrow power is based
            on what the position can realistically support under the market&apos;s risk assumptions,
            not on an optimistic net asset value.
          </p>
          <p className="type-doc-body">
            Avana uses a dual-oracle pricing framework for LP collateral. Chainlink price feeds
            provide the primary reference for the underlying assets, while AMM-derived TWAPs act as
            an independent verification layer sourced from onchain liquidity.
          </p>
        </section>

        <section id="borrowing-process" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrowing Capacity</h2>
          <p className="mb-4 type-doc-body">
            Borrowing capacity comes from the risk-adjusted value of approved LP positions inside a
            Borrow Spoke. Avana reconstructs each position, prices the underlying exposure, applies
            pool-level risk treatment, and then applies the market&apos;s collateral factor.
          </p>
          <p className="mb-4 type-doc-body">
            The Borrow Spoke reports that capacity to the Hub for enforcement. When a user has
            multiple approved positions in the same market, Avana aggregates their capacity while
            still valuing each position under its own pool, range, liquidity, and risk assumptions.
          </p>
          <p className="type-doc-body">
            See{" "}
            <Link href="/developers/architecture/collateral-factors" className="text-[#01AACF] hover:underline">
              Collateral Factors
            </Link>{" "}
            for how each market sets collateral factors, liquidation thresholds, and liquidation
            bonus per asset.
          </p>
        </section>

        <section id="health-monitoring" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Health & Liquidation</h2>
          <p className="mb-4 type-doc-body">
            Avana monitors account health inside each Borrow Spoke using the same valuation path
            that governs borrowing. Adjusted collateral value — already discounted through LP
            reconstruction, pricing, collateral factors, and recoverable-value assumptions — is
            compared against outstanding debt.
          </p>
          <p className="type-doc-body">
            When health falls below the liquidation threshold, Aave handles debt accounting and the
            liquidation entry point against the ERC-20 vault collateral. Avana handles the LP
            settlement behind that vault token: burning vault collateral, mapping liquidation back
            to the real LP position, and following the market route to unwind, sell, auction, or
            transfer the backing position.
          </p>
        </section>

        <section id="fee-collection" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Fee Treatment</h2>
          <p className="mb-4 type-doc-body">
            LP positions may keep accruing trading fees while they are used as collateral. Avana
            can recognize those fees in valuation and, subject to health checks, let users claim
            them without fully exiting the principal LP position.
          </p>
          <p className="type-doc-body">
            <strong>Related docs:</strong>{" "}
            <Link href="/developers/integrations/price-oracles" className="text-[#01AACF] hover:underline">
              Price Oracles
            </Link>{" "}
            and{" "}
            <Link href="/developers/getting-started/claim-lp-fees" className="text-[#01AACF] hover:underline">
              Claim LP Fees
            </Link>
            .
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="The main concepts behind LP-backed borrowing, conservative valuation, and spoke-level risk in Avana."
        sectionColor="blue"
      />
    </div>
  ))
}
