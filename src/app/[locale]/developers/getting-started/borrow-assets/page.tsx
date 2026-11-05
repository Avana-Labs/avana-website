import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'getting-started/borrow-assets', {
    title: "Borrow GHO",
    description: "How to borrow GHO from the Avana Hub against pledged LP collateral on Avana.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "borrow-checks", title: "Borrow Checks" },
  { id: "health-check", title: "Health Check" },
  { id: "internal-accounting", title: "Internal Accounting" },
  { id: "borrowable-assets", title: "Borrowable Assets" },
  { id: "borrowing-power", title: "Borrowing Power" },
]

export default async function BorrowAssetsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "getting-started/borrow-assets", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Borrow GHO"
          description="Borrow GHO from the Avana Hub against the LP collateral you have pledged. Borrow Spokes lend GHO."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>Once the vault tokens are supplied and enabled as collateral, a borrower can borrow GHO up to the account&apos;s available capacity. The GHO comes from the Avana Hub through the market&apos;s Avana Borrow Spoke. The request passes through the AaveAdapter and the borrower&apos;s Position Proxy. The borrowed GHO goes to the borrower&apos;s wallet.</>{" "}<>Interest increases outstanding debt over time. The health factor can therefore fall even when collateral value does not change. Unused borrowing capacity is a buffer against debt growth and against changes in collateral value.</>{" "}<>{"Each market has its own vault token, Borrow Spoke, Collateral Factor, and caps. Positions of the same size in different pools can therefore support different amounts of GHO."}</>
          </p>
        </section>

        <section id="borrow-checks" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrow Checks</h2>
          <div className="doc-prose">
            <p className="type-doc-body"><>The AaveAdapter checks the price feeds first. New borrowing is blocked when the pool&apos;s TWAP is outside the allowed tolerance from the Chainlink price, or when the Chainlink feed is stale or invalid.</>{" "}<>The borrow amount must fit within your remaining borrowing capacity: position value multiplied by the reserve&apos;s Collateral Factor, less existing debt.</>{" "}<>The Avana Hub must have GHO available under its credit line. Hub draw caps and Spoke caps must
                also allow the borrow.</>{" "}<>Your account must stay healthy after the new debt is added. In an illustrative example, the interface limits a new borrow to an opening health factor of 1.10.</></p>
          </div>
        </section>

        <section id="health-check" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Health Check</h2>
          <p className="mb-4 type-doc-body">
            The health factor compares collateral value, after the reserve&apos;s Collateral Factor
            is applied, with outstanding GHO debt. LPOracle reports the value of the liquidity
            behind each vault token with no haircut. The Collateral Factor sets how much of that
            value can support debt.
          </p>

          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">
              healthFactor = (lpPositionValue × lpCollateralFactor) / outstandingDebt
            </code>
          </div>

          <p className="mt-4 type-doc-body">
            For example, a $100,000 full-range WETH/USDC position with a 35% Collateral Factor
            and 25,000 GHO borrowed has a health factor of 1.40. Below 1.00, the position is
            eligible for liquidation. For the full model, see{" "}
            <Link href="/developers/architecture/health-factor" className="text-type-accent hover:underline">
              Health Factor
            </Link>.
          </p>
        </section>

        <section id="internal-accounting" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Internal Accounting</h2>
          <div className="space-y-4 type-doc-body">
            <p>
            <><strong className="text-gray-900">Position Proxy:</strong> a dedicated Position
              Proxy holds each borrower&apos;s Aave position, so deposits, borrows, repayments,
              and withdrawals all pass through Avana&apos;s controls.</>{" "}<><strong className="text-gray-900">Hub draw:</strong> the Borrow Spoke draws GHO
              from the Avana Hub. The Hub holds a capped GHO credit line allocated through the GHO
              Reserve. Only approved Borrow Spokes have GHO draw capacity.</>{" "}<><strong className="text-gray-900">Interest rate:</strong> BorrowingRate = BaseRate
              × (1 + UserRiskPremium). For example, a 4.5% base rate with a 50% risk premium gives
              6.75%. With several collateral positions, the premium is a weighted average. Aave V4
              updates it on borrow, withdrawal, collateral change, and on request.</>
          </p>
          </div>
        </section>

        <section id="borrowable-assets" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrowable Assets</h2>
          <p className="mb-4 type-doc-body">
            Borrow Spokes lend GHO. It comes from the Avana Hub, which is funded by a capped GHO credit line. Each increase to the credit line is subject to conditions and governance approval.
          </p>
          <p className="type-doc-body">
            Assets other than GHO are borrowed through the Avana Lend Spoke, which Aave governance approves separately.
          </p>
        </section>

        <section id="borrowing-power" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrowing Power</h2>
          <p className="mb-4 type-doc-body">
            <>Borrowing capacity is position value multiplied by the reserve&apos;s Collateral
            Factor, where LPCollateralFactor = min(Token0CF, Token1CF) × PoolRiskFactor. For
            example, if the lower of the two underlying factors is 70% and the pool risk factor is
            50%, the Collateral Factor is 35%. A $100,000 position then supports up to 35,000 GHO.
            Each market&apos;s parameters are set by governance.</>{" "}<>Capacity also depends on existing debt, exposure caps, available GHO liquidity, and oracle checks. As debt approaches capacity, less room remains for price changes or interest. Before sizing a borrow, read these pages:{" "}
            <Link href="/developers/architecture/collateral-factors" className="text-type-accent hover:underline">
              Collateral Factors
            </Link>,{" "}
            <Link href="/developers/architecture/health-factor" className="text-type-accent hover:underline">
              Health Factor
            </Link>.</>
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How to borrow GHO against pledged LP collateral on Avana."
        sectionColor="emerald"
      />
    </div>
  ))
}
