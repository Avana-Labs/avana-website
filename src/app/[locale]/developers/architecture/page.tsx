import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'architecture', {
    title: "Protocol Architecture - Borrow Spoke",
    description: "How an Avana Borrow Spoke holds vault tokens as collateral and lends GHO from the Avana Hub.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "user-experience", title: "Borrow Flow" },
  { id: "example-flow", title: "Example Flow" },
  { id: "three-tier-architecture", title: "Three-Tier Architecture" },
  { id: "data-flow", title: "Data Flow" },
  { id: "spoke-responsibilities", title: "Component Responsibilities" },
  { id: "hub-role", title: "Avana Hub Role" },
]

export default async function BorrowSpokePage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "architecture", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Borrow Spoke"
          description="A standard Aave V4 Spoke, owned by the Aave DAO, where vault tokens back GHO borrowing for one market category."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>An Avana Borrow Spoke is a standard, unmodified Aave V4 Spoke owned by the Aave DAO.
            It holds the vault-token reserves for one market category. It applies each reserve&apos;s
            Collateral Factor, Collateral Risk and liquidation parameters. Borrow Spokes lend GHO.</>{" "}<>Avana has three market categories, each with its own Borrow Spoke, parameters and caps. Stable LP pairs two stablecoins (candidate USDC/USDT). Correlated LP pairs assets that move together (candidate wstETH/WETH). Blue-chip/stable LP pairs a major asset with a stablecoin (candidate WETH/USDC). Candidates are still being assessed.</>
          </p>
        </section>

        <section id="user-experience" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrow Flow</h2>
          <p className="mb-4 type-doc-body">
            Borrowers do not call the Borrow Spoke directly. The AaveAdapter is the borrower&apos;s entry point to Avana. It coordinates each Pledge with the LP Vault and Collateralization Module. It then mints vault tokens and supplies them through the borrower&apos;s Position Proxy as collateral. Borrowing, repayment and withdrawal also go through the AaveAdapter. Avana-specific logic stays in Avana&apos;s contracts, and the Spoke runs standard Aave V4 accounting.
          </p>
        </section>

        <section id="example-flow" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Example Flow</h2>
          <div className="doc-prose">
            <p className="type-doc-body"><>A depositor pledges a $100,000 full-range WETH/USDC position. The liquidity stays in
                the pool. The Collateralization Module mints one vault-token base unit per unit of the position&apos;s liquidity, valued at $100,000 in total by the LPOracle.</>{" "}<>With a lower underlying Collateral Factor of 70% and a pool risk factor of 50%, the
                reserve&apos;s Collateral Factor is 35%. This gives a borrowing capacity of 35,000 GHO. The interface limits opening borrows to a health factor of 1.10, about 31,800 GHO.</>{" "}<>The borrower draws 25,000 GHO from the Avana Hub, for an initial health factor of 1.40. These numbers are illustrative, not market parameters.</>{" "}<>The borrower can pledge additional approved positions later. Each market has its own vault
                token. Capacity also depends on exposure caps, available GHO liquidity and oracle checks.</></p>
          </div>
        </section>

        <section id="three-tier-architecture" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Three-Tier Architecture</h2>
          <p className="type-doc-body">{"Avana has three layers. The Avana Hub holds the GHO credit line, and the Avana Borrow Spokes hold vault-token reserves. The Aave DAO owns both. Avana's own contracts (LP Vault, AaveAdapter, LPOracle, RiskModule, CollateralizationModule, LPVaultSwap, AMMSettlementAdapters and AvanaConfig) handle custody, valuation and settlement outside Aave V4. Avana does not fork, copy or modify Aave V4 code."}</p>
        </section>

        <section id="data-flow" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Data Flow</h2>
          <ol className="mb-6 list-decimal list-inside space-y-4">
            <li className="type-doc-body">
              <strong className="text-gray-900">Collateral enters the spoke</strong> — the AaveAdapter
              mints vault tokens for the pledged liquidity and supplies them through the borrower&apos;s Position Proxy.
            </li>
            <li className="type-doc-body">
              <strong className="text-gray-900">Borrow draws Avana Hub liquidity</strong> — once Collateral Factor,
              cap and oracle checks pass, the Spoke draws GHO from the Avana Hub within its draw cap.
            </li>
            <li className="type-doc-body">
              <strong className="text-gray-900">Debt accrues at the borrowing rate</strong> — BorrowingRate = BaseRate × (1 + UserRiskPremium).
              Aave V4 updates the premium on borrow, withdrawal, collateral change and on request.
            </li>
            <li className="type-doc-body">
              <strong className="text-gray-900">Liquidation if required</strong> — when the health factor falls below 1, an approved keeper calls LPVaultSwap, which settles the position under the market&apos;s settlement mode.
            </li>
          </ol>

          <div>
            <h3 className="mb-2 type-doc-subsection-title">Avana Hub interaction</h3>
            <ul className="space-y-1 type-doc-body">
              <li>• <strong>Borrow:</strong> the Spoke draws GHO from the Avana Hub, limited by the Hub&apos;s draw cap for that Spoke</li>
              <li>• <strong>Repay:</strong> repaid GHO returns to the Avana Hub. Borrowers can repay through the AaveAdapter or call the contracts directly</li>
              <li>• <strong>Health check:</strong> the Spoke values vault tokens at <code className="type-doc-inline-code">LPOracle</code> prices and applies each reserve&apos;s Collateral Factor</li>
              <li>• <strong>Liquidation:</strong> <code className="type-doc-inline-code">LPVaultSwap</code> calls the Spoke&apos;s standard Aave V4 liquidation using a GHO flash loan. LPVaultSwap is not a spoke and cannot draw from the Avana Hub</li>
            </ul>
          </div>
        </section>

        <section id="spoke-responsibilities" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Component Responsibilities</h2>
          <div className="mb-6 overflow-x-auto">
            <table className="w-full overflow-hidden rounded-lg border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left type-doc-subsection-title">Component</th>
                  <th className="px-4 py-2 text-left type-doc-subsection-title">Responsibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-900">Avana Borrow Spoke</td>
                  <td className="px-4 py-2">
                    Holds collateral-only vault-token reserves for one market category. Lends GHO under
                    each reserve&apos;s Collateral Factor, Collateral Risk and liquidation parameters.
                    Read-only views come from <code className="type-doc-inline-code">AaveAdapterLens</code> and LiquidationPreview.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-900">LPVaultSwap</td>
                  <td className="px-4 py-2">
                    Executes liquidations with a flash loan through each market&apos;s approved settlement
                    route. Draws from the FirstLossReserve when needed and pays keepers, Avana and borrowers.
                    Only approved keepers can call it.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="hub-role" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Avana Hub Role</h2>
          <p className="mb-4 type-doc-body">
            The Borrow Spoke does not hold lender reserves. The Avana Hub, a standard Aave V4 Hub
            owned by the Aave DAO, holds the GHO liquidity and debt accounting. The Spoke
            applies vault-token risk parameters.
          </p>
          <div className="doc-prose">
            <p className="type-doc-body"><>A capped GHO credit line allocated through the GHO Reserve funds the Avana Hub. Each increase is subject to conditions and governance approval.</>{" "}<>Hub add and draw caps limit how much each Borrow Spoke can draw. Only approved
                Borrow Spokes have GHO draw capacity.</>{" "}<>Each market category has its own Borrow Spoke, parameters and caps. The Avana Lend Spoke lets lenders supply assets directly to the Avana Hub.</></p>
          </div>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How an Avana Borrow Spoke holds vault-token collateral, lends GHO, and works with the Avana Hub and LPVaultSwap."
        sectionColor="violet"
      />
    </div>
  ))
}
