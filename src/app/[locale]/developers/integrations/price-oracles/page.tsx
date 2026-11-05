import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'integrations/price-oracles', {
    title: "Price Oracles",
    description: "How Avana's LPOracle prices vault tokens from pool liquidity math at Chainlink prices, with the pool TWAP as a consistency check.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "oracle-interface", title: "Vault Token Price" },
  { id: "multi-layer-architecture", title: "Valuation Steps" },
  { id: "dex-handling", title: "Supported Position Types" },
  { id: "twap-computation", title: "TWAP Consistency Check" },
  { id: "safety-measures", title: "Price Conditions" },
  { id: "configurable-parameters", title: "Per-Market Settings" },
]

const collateralValueDrivers = [
  "The Chainlink prices of the two underlying tokens",
  "The amount of liquidity represented by the vault token",
  "For Uniswap v2, the LP token's share of the pool",
  "For Uniswap v3, the position's range relative to the reference price",
  "Whether a Uniswap v3 position is in range or holds only one of its tokens",
]

const architectureChecklist = [
  {
    title: "Read Chainlink reference prices",
    description:
      "Chainlink is the valuation reference for both underlying tokens. Each feed must be within the market's maximum feed age.",
  },
  {
    title: "Compute token amounts from liquidity",
    description:
      "The token amounts behind one vault token are computed from the pool's liquidity math at the reference price. For Uniswap v3 positions, they are computed from the position's liquidity and range.",
  },
  {
    title: "Check against the pool TWAP",
    description:
      "The approved AMM TWAP is compared with the Chainlink-derived price. It is only a consistency check. It is not averaged with the Chainlink price and does not replace it.",
  },
  {
    title: "Report value with no haircut",
    description:
      "LPOracle reports the full value of the liquidity per vault token. It does not discount for impermanent loss, slippage or liquidation costs.",
  },
  {
    title: "Apply the Collateral Factor separately",
    description:
      "Borrowing limits come from the reserve's Collateral Factor, where LPCollateralFactor = min(Token0CF, Token1CF) × PoolRiskFactor. BorrowingCapacity = LPPositionValue × LPCollateralFactor. Collateral Risk sets the borrower's interest premium. It is not a haircut.",
  },
]

const dexOracleTable = [
  {
    dex: "Uniswap v2 LP tokens",
    source: "Chainlink + pool liquidity math + TWAP consistency check",
    notes: "Supported. 1 vault-token base unit per LP-token base unit.",
  },
  {
    dex: "Uniswap v3 positions (full-range or approved range)",
    source: "Chainlink + position liquidity and range + TWAP consistency check",
    notes: "Supported. 1 vault-token base unit per unit of liquidity in that pool, fee tier and range.",
  },
  {
    dex: "Uniswap v4, Curve, Balancer, Aerodrome, SushiSwap and other AMMs",
    source: "Not defined",
    notes: "Not supported. Adding any of them requires a separate review and governance approval, including approval of its pricing method.",
  },
]

export default async function PriceOraclesPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "integrations/price-oracles", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      {/* Main content */}
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader

          title="Price Oracles"

          description="How LPOracle values vault tokens, and what the Aave Adapter allows when price checks fail."

        />

        <section id="overview" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Overview</h2>
          <p className="type-doc-body mb-4">
            <>Avana&apos;s LPOracle prices each vault token from the pool&apos;s liquidity math at
            Chainlink prices. Chainlink is the valuation reference, and the pool&apos;s TWAP is a
            second check. For concentrated positions, token amounts are computed from the
            position&apos;s liquidity and range at the reference price.</>{" "}<>LPOracle reports the value of the liquidity per vault token with no haircut. How much of that value can support debt is set separately, through each reserve&apos;s Collateral Factor on the Borrow Spoke.</>{" "}<>Valuation and borrowing limits are kept separate. The oracle reports what the position is worth. The Collateral Factor and pool risk factor account for range, price sensitivity, pool depth and expected liquidation costs.</>
          </p>

          <div className="doc-topic">
            <h3 className="type-doc-subsection-title mb-3">Vault-token value depends on:</h3>
            <ul className="space-y-3">
              {collateralValueDrivers.map((item) => (
                <li key={item} className="type-doc-callout type-doc-callout-info">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="oracle-interface" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Vault Token Price</h2>
          <p className="type-doc-body mb-4">
            Each vault token is priced as the value of the two token amounts it represents:
          </p>
          
          <div className="type-doc-code-block-dark mb-4">
            <code>
              VaultTokenPrice = q0·P0 + q1·P1
            </code>
          </div>

          <div className="space-y-3">
            <div className="doc-topic">
              <span className="type-doc-subsection-title">q0, q1</span>
              <span className="type-doc-body ml-2">Amounts of token0 and token1 represented by one vault token. They are computed at the reference price from the pool&apos;s liquidity math and, for Uniswap v3, the position&apos;s range.</span>
            </div>
            <div className="doc-topic">
              <span className="type-doc-subsection-title">P0, P1</span>
              <span className="type-doc-body ml-2">Chainlink reference prices for token0 and token1.</span>
            </div>
            <div className="doc-topic">
              <span className="type-doc-subsection-title">No haircut</span>
              <span className="type-doc-body ml-2">The result is the full value of the liquidity. Risk adjustments are applied through the Collateral Factor, not in the price.</span>
            </div>
          </div>

          <p className="mt-4 type-doc-body">
            Vault tokens have 18 decimals and are minted 1:1 with liquidity. There is no scaling factor or exchange rate, so the oracle cannot affect how many vault tokens are issued.
          </p>
        </section>

        <section id="multi-layer-architecture" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Valuation Steps</h2>
          <p className="type-doc-body mb-4">
            LP valuation is not a single spot-price read. The path from prices to borrowing
            capacity has these steps:
          </p>

          <div className="space-y-4">
            {architectureChecklist.map((item, index) => (
              <div key={item.title} className="doc-topic">
                <div className="flex items-start gap-3">
                  <span className="doc-step-number">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="type-doc-subsection-title mb-1">{item.title}</h3>
                    <p className="type-doc-body">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="dex-handling" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Supported Position Types</h2>
          <p className="type-doc-body mb-4">
            LPOracle prices only selected Uniswap v2 LP tokens and Uniswap v3 positions on Ethereum mainnet. Each approved pool has its own vault token, and so does each fee tier and range where applicable.
          </p>
          
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-2 type-doc-subsection-title">AMM / Position Type</th>
                  <th className="text-left px-3 py-2 type-doc-subsection-title">Oracle Source</th>
                  <th className="text-left px-3 py-2 type-doc-subsection-title">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dexOracleTable.map((item) => (
                  <tr key={item.dex}>
                    <td className="px-3 py-2 text-gray-900 font-medium">{item.dex}</td>
                    <td className="px-3 py-2">{item.source}</td>
                    <td className="px-3 py-2 text-xs">{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="twap-computation" className="mb-10">
          <h2 className="type-doc-section-title mb-4">TWAP Consistency Check</h2>
          <p className="type-doc-body mb-4">
            The approved AMM TWAP is a consistency check on the Chainlink-derived price. It is not an average of the two prices and does not replace Chainlink. It detects when pool state and reference prices disagree.
          </p>
          
          <div className="space-y-3">
            <div className="doc-topic">
              <h3 className="type-doc-subsection-title mb-1">Uniswap v2</h3>
              <p className="type-doc-body">
                The pool&apos;s TWAP over the market&apos;s configured window is compared with the
                price implied by Chainlink. The window length is set per market.
              </p>
            </div>
            <div className="doc-topic">
              <h3 className="type-doc-subsection-title mb-1">Uniswap v3</h3>
              <p className="type-doc-body">
                The position&apos;s token amounts are computed from its liquidity and range. Before they are accepted, the pool&apos;s TWAP is compared with the Chainlink-derived price.
              </p>
            </div>
            <div className="doc-topic">
              <h3 className="type-doc-subsection-title mb-1">Tolerance</h3>
              <p className="type-doc-body">
                Each market has an allowed price deviation. If the TWAP is outside it, the Aave
                Adapter blocks new borrowing and risk-increasing withdrawals.
              </p>
            </div>
            <div className="doc-topic">
              <h3 className="type-doc-subsection-title mb-1">Chainlink stays the reference</h3>
              <p className="type-doc-body">
                When the TWAP is outside tolerance, repayment and liquidation continue at the
                Chainlink price. The TWAP is never used as the valuation price.
              </p>
            </div>
            <div className="doc-topic">
              <h3 className="type-doc-subsection-title mb-1">Other AMMs</h3>
              <p className="type-doc-body">
                Avana defines TWAP sources only for Uniswap v2 and v3. A TWAP source for another
                AMM is defined in that AMM&apos;s review and approved by governance.
              </p>
            </div>
          </div>
        </section>

        <section id="safety-measures" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Price Conditions</h2>
          
          <ul className="space-y-3">
            <li className="type-doc-callout type-doc-callout-danger">
              <span className="type-doc-subsection-title">Allowed deviation and maximum feed age</span>
              <p className="type-doc-body mt-0.5">
                Each market sets an allowed deviation between the TWAP and the Chainlink-derived
                price, and a maximum feed age. The four conditions below determine what remains
                available. Separately, the Guardian can freeze a market by freezing both the
                vault-token reserve and the GHO reserve on its Borrow Spoke.
              </p>
            </li>
            <li>
              <span className="type-doc-subsection-title">Chainlink valid, TWAP within tolerance</span>
              <p className="type-doc-body mt-0.5">
                Normal operation.
              </p>
            </li>
            <li>
              <span className="type-doc-subsection-title">Chainlink valid, TWAP outside tolerance</span>
              <p className="type-doc-body mt-0.5">
                The Aave Adapter blocks new borrowing and risk-increasing withdrawals. Repayment
                and liquidation continue at the Chainlink price.
              </p>
            </li>
            <li>
              <span className="type-doc-subsection-title">Chainlink stale or invalid, cached price within maximum age</span>
              <p className="type-doc-body mt-0.5">
                The last valid price is used. New borrowing and voluntary withdrawals are blocked.
                Repayment and liquidation continue.
              </p>
            </li>
            <li>
              <span className="type-doc-subsection-title">Cached price past maximum age</span>
              <p className="type-doc-body mt-0.5">
                Liquidations pause until the feed recovers or governance approves a backup feed.
                Repayment continues.
              </p>
            </li>
          </ul>
        </section>

        <section id="configurable-parameters" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Per-Market Oracle Settings</h2>
          <p className="type-doc-body mb-4">
            Oracle settings are held per market in{" "}
            <code className="type-doc-inline-code">AvanaConfig</code>. Avana Labs recommends the values, a designated risk reviewer checks them, and governance sets them:
          </p>
          
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Setting</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 type-doc-inline-code">Market</td>
                  <td className="px-4 py-2">Vault-token market: approved pool, and fee tier and range for Uniswap v3</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 type-doc-inline-code">Chainlink feeds</td>
                  <td className="px-4 py-2">Reference price feeds for both underlying tokens</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 type-doc-inline-code">Maximum feed age</td>
                  <td className="px-4 py-2">Oldest acceptable Chainlink update, and the limit for using a cached price</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 type-doc-inline-code">TWAP source</td>
                  <td className="px-4 py-2">Approved AMM pool used for the consistency check</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 type-doc-inline-code">TWAP window</td>
                  <td className="px-4 py-2">Time window for the TWAP</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 type-doc-inline-code">Allowed price deviation</td>
                  <td className="px-4 py-2">Maximum difference between the TWAP and the Chainlink-derived price</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 type-doc-inline-code">Backup feed</td>
                  <td className="px-4 py-2">Used only if governance approves it after the cached price passes its maximum age</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 type-doc-body">
            In practice, oracle behavior comes from Chainlink reference pricing, the pool&apos;s
            liquidity math, the TWAP consistency check, and the per-market settings held in{" "}
            <code className="type-doc-inline-code">AvanaConfig</code>.
          </p>
        </section>
      </div>

      {/* Right scroll-spy sidebar */}
      <DeveloperScrollSpyRail 
        sections={sections} 
        pageSummary="How LPOracle prices vault tokens at Chainlink prices, checks them against the pool TWAP, and what happens when price checks fail."
        sectionColor="cyan"
      />
    </div>
  ))
}
