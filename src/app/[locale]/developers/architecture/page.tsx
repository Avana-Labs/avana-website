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
    description: "How the Borrow Spoke accepts LP collateral, values positions, and borrows from Hub liquidity.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "user-experience", title: "User Experience" },
  { id: "example-flow", title: "Example Flow" },
  { id: "three-tier-architecture", title: "Three-Tier Architecture" },
  { id: "data-flow", title: "Data Flow" },
  { id: "spoke-responsibilities", title: "Spoke Responsibilities" },
  { id: "hub-role", title: "Aave v4 Hub Role" },
]

export default async function BorrowSpokePage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "architecture", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Borrow Spoke"
          description="The isolated LP-collateral market where users deposit positions, borrow assets, and manage loan health."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            A Borrow Spoke is an isolated LP-collateral market. It decides which pools are supported,
            how each LP position is valued, what collateral factors apply, which assets can be
            borrowed, and how liquidation works for that market.
          </p>
          <p className="type-doc-body">
            Borrow Spokes are separated because LP positions do not all behave the same. A
            stablecoin LP, a correlated ETH-staked ETH LP, and a volatile governance-token LP need
            different risk settings, different caps, and sometimes different liquidation routes.
          </p>
        </section>

        <section id="user-experience" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrow Flow</h2>
          <p className="mb-4 type-doc-body">
            From the user side, one spoke handles the full account lifecycle: deposit LP collateral,
            check borrowing capacity, borrow, repay, and claim fees when allowed. The interface
            stays consistent even when underlying LP formats differ across DEXs.
          </p>
        </section>

        <section id="example-flow" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Example Flow</h2>
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="mb-2 type-doc-subsection-title">Step 1: Deposit LP collateral</h3>
              <p className="type-doc-body">
                The user deposits an approved LP position. The liquidity stays in the pool, but the
                spoke records it as collateral and starts tracking value and health.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-4">
              <h3 className="mb-2 type-doc-subsection-title">Step 2: Capacity is calculated</h3>
              <p className="type-doc-body">
                The spoke reconstructs the position, prices the underlying exposure, applies
                collateral factors, and shows the resulting borrowing capacity.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-4">
              <h3 className="mb-2 type-doc-subsection-title">Step 3: Borrow assets</h3>
              <p className="type-doc-body">
                The user draws assets from Hub liquidity up to their capacity. Debt and health
                update in the spoke after the borrow confirms.
              </p>
            </div>
            <div>
              <h3 className="mb-2 type-doc-subsection-title">Step 4: Add more collateral</h3>
              <p className="type-doc-body">
                Additional approved LP positions can be deposited later. Each position is valued on
                its own before contributing to aggregate capacity.
              </p>
            </div>
          </div>
        </section>

        <section id="three-tier-architecture" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Three-Tier Architecture</h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 type-doc-subsection-title">Borrowers</h3>
              <p className="type-doc-body">
                Users interact with the Borrow Spoke to deposit collateral, borrow, repay, and
                manage their loan.
              </p>
            </div>
            <div>
              <h3 className="mb-2 type-doc-subsection-title">Borrow Spoke (Avana)</h3>
              <p className="type-doc-body">
                Values LP positions, enforces health checks, and coordinates liquidation when
                collateral no longer supports the debt.
              </p>
            </div>
            <div>
              <h3 className="mb-2 type-doc-subsection-title">Aave v4 Hub</h3>
              <p className="type-doc-body">
                Shared liquidity and accounting layer. Borrow Spokes draw from Hub reserves after
                spoke-side checks pass.
              </p>
            </div>
          </div>
        </section>

        <section id="data-flow" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Data Flow</h2>
          <ol className="mb-6 list-decimal list-inside space-y-4">
            <li className="type-doc-body">
              <strong className="text-gray-900">Collateral enters the spoke</strong> — the LP
              position is recorded and tracked for valuation and health.
            </li>
            <li className="type-doc-body">
              <strong className="text-gray-900">Borrow draws Hub liquidity</strong> — once capacity
              checks pass, the spoke requests assets from the Hub.
            </li>
            <li className="type-doc-body">
              <strong className="text-gray-900">Debt accrues as debt shares</strong> — interest
              compounds through the configured rate model while the spoke keeps account state in sync.
            </li>
            <li className="type-doc-body">
              <strong className="text-gray-900">Liquidation if required</strong> — unhealthy
              accounts move through the liquidation path to restore solvency.
            </li>
          </ol>

          <div>
            <h3 className="mb-2 type-doc-subsection-title">Hub interaction</h3>
            <ul className="space-y-1 type-doc-body">
              <li>• <strong>Borrow:</strong> spoke draws from the Hub when a user opens or extends debt</li>
              <li>• <strong>Repay:</strong> spoke restores debt to the Hub when a user repays</li>
              <li>• <strong>Health check:</strong> Hub reads spoke collateral data via <code className="type-doc-inline-code">getCollateralData</code></li>
              <li>• <strong>Liquidation:</strong> Hub can call <code className="type-doc-inline-code">handleLiquidation</code> when risk thresholds are breached</li>
            </ul>
          </div>
        </section>

        <section id="spoke-responsibilities" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Spoke Responsibilities</h2>
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
                  <td className="px-4 py-2 font-medium text-gray-900">Borrow Spoke</td>
                  <td className="px-4 py-2">
                    Tracks LP positions, aggregate collateral value, and debt for each AMM family.
                    Exposes <code className="type-doc-inline-code">getUserAggregate(user)</code> for frontends and liquidators.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-900">LiquidationAdapter</td>
                  <td className="px-4 py-2">
                    Runs penalty accrual, soft unwind, and hard liquidation for LP formats that need
                    specialized handling.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="hub-role" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Aave v4 Hub Role</h2>
          <p className="mb-4 type-doc-body">
            The Borrow Spoke does not hold lender reserves. The Hub provides pooled liquidity,
            reserve accounting, and the balance-sheet side of borrowing while the spoke handles
            LP-specific risk.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 type-doc-subsection-title">Capital supply</h3>
              <p className="type-doc-body">
                Assets such as USDC, DAI, and ETH enter through the Lend Spoke and Hub. The Borrow
                Spoke decides how much of that liquidity an LP-backed account may access.
              </p>
            </div>
            <div>
              <h3 className="mb-2 type-doc-subsection-title">Credit lines</h3>
              <p className="type-doc-body">
                Each Borrow Spoke has a credit line that limits how much Hub liquidity it can draw,
                keeping LP underwriting isolated while sharing capital efficiency.
              </p>
            </div>
            <div>
              <h3 className="mb-2 type-doc-subsection-title">Independent health factors</h3>
              <p className="type-doc-body">
                Collateral in multiple Borrow Spokes is evaluated separately. Surplus in one market
                does not automatically cover a deficit in another.
              </p>
            </div>
          </div>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How the Borrow Spoke accepts LP collateral, calculates capacity, and coordinates with the Hub."
        sectionColor="violet"
      />
    </div>
  ))
}
