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
    description: "How Avana Oracle prices LP collateral through external feeds, deterministic position reconstruction, and recoverable-value discounts.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "oracle-interface", title: "Oracle Interface" },
  { id: "multi-layer-architecture", title: "Multi-Layer Architecture" },
  { id: "dex-handling", title: "DEX-Specific Handling" },
  { id: "twap-computation", title: "TWAP Computation" },
  { id: "safety-measures", title: "Safety & Manipulation Prevention" },
  { id: "configurable-parameters", title: "Configurable Parameters" },
]

const collateralValueDrivers = [
  "The prices of the underlying assets",
  "The pool reserves or inventory split",
  "Fee accrual",
  "For concentrated liquidity, the current tick relative to the position range",
  "Whether the position is in-range or mostly one-sided",
]

const architectureChecklist = [
  {
    title: "Price underlying assets from external robust oracles",
    description:
      "External feeds provide reference prices for the underlying tokens. This separates the asset-price input from the pool's instantaneous trading price, which can be affected by short-lived trades or manipulation.",
  },
  {
    title: "Derive LP value conservatively",
    description:
      "The oracle reconstructs fungible LP balances or decomposes concentrated-liquidity positions using reserves, liquidity, range, and accrued fees. These inputs determine the assets represented by the position.",
  },
  {
    title: "Haircut for impermanent loss and liquidation slippage",
    description:
      "The reconstructed value is discounted for stressed market conditions, liquidation slippage, and the position's exit route. The resulting value estimates what liquidation could recover.",
  },
  {
    title: "Cap exposure by LP family and pool depth",
    description:
      "Exposure controls use the LP family, pool type, and available liquidity depth to limit how much borrowing a market can support.",
  },
  {
    title: "Apply recoverable value to borrowing and liquidation",
    description:
      "Borrowing capacity and liquidation checks use the estimated value recoverable through the configured unwind route.",
  },
]

const dexOracleTable = [
  {
    dex: "Curve Stable/Stable ERC-20 LPs",
    source: "External stablecoin feeds + pool-state checks + TWAP verification",
    notes: "External prices anchor the assets while pool balances and fee accrual determine discounted collateral value.",
  },
  {
    dex: "Uniswap V2 ERC-20 LPs",
    source: "Chainlink + reserve reconstruction + TWAP verification",
    notes: "Standard LP tokens are valued from reconstructed underlying balances, with TWAP used as a manipulation-resistant cross-check.",
  },
  {
    dex: "Uniswap V3 NFT LPs",
    source: "Chainlink + position decomposition + tick/TWAP checks",
    notes: "The NFT is decomposed by liquidity, active range, and current price, then haircut for recoverable liquidation value.",
  },
  {
    dex: "Balancer Multi-Asset LPs",
    source: "Chainlink + weighted inventory reconstruction",
    notes: "Multi-token pools use external prices and weighted pool inventory to estimate conservative collateral value.",
  },
  {
    dex: "SushiSwap / Aerodrome",
    source: "Chainlink + reserve reconstruction + TWAP verification",
    notes: "Pool-derived observations verify reconstructed value and help resist same-transaction abuse in lower-liquidity markets.",
  },
  {
    dex: "PancakeSwap",
    source: "Chainlink + block-based TWAP verification",
    notes: "External prices remain the anchor while block-based observations validate position state and unwind assumptions.",
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

          description="How the protocol turns LP position state into credit-relevant collateral values."

        />

        <section id="overview" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Overview</h2>
          <p className="type-doc-body mb-4">
            <>Avana prices LP collateral by reconstructing the position and valuing the assets inside
            it. For fungible LPs, the protocol derives value from external asset prices and pool
            balance reconstruction. For concentrated liquidity, it decomposes the position by
            liquidity, range, current tick, token exposure, and accrued fees.</>{" "}<>The result is discounted to estimate recoverable collateral value under the market&apos;s risk assumptions. Borrowing capacity therefore reflects both the position&apos;s underlying assets and the conditions under which they could be recovered during liquidation.</>{" "}<>The distinction between position value and recoverable value matters because the oracle supplies inputs to lending decisions. ERC-20 LP tokens, position NFTs, and multi-asset pools share an interface, but each format has its own reconstruction, validation, and manipulation checks before its value reaches the Borrow Spoke.</>
          </p>

          <div className="doc-topic">
            <h3 className="type-doc-subsection-title mb-3">LP collateral value depends on:</h3>
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
          <h2 className="type-doc-section-title mb-4">Oracle Interface: IOracle</h2>
          <p className="type-doc-body mb-4">
            `IOracle` gives Borrow Spokes a common valuation interface across LP formats. Its return values distinguish principal, accrued fees, and reserved buffers so the caller can account for each component separately:
          </p>
          
          <div className="type-doc-code-block-dark mb-4">
            <code>
              function getValue(uint256 tokenId, address asset)<br/>
              &nbsp;&nbsp;external view returns (<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;uint256 fullValue,<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;uint256 feeValue,<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;uint256 reserveValue<br/>
              &nbsp;&nbsp;);
            </code>
          </div>

          <div className="space-y-3">
            <div className="doc-topic">
              <span className="type-doc-subsection-title">fullValue</span>
              <span className="type-doc-body ml-2">Reconstructed value of the principal liquidity before later liquidation stress adjustments are applied.</span>
            </div>
            <div className="doc-topic">
              <span className="type-doc-subsection-title">feeValue</span>
              <span className="type-doc-body ml-2">Value of the fees accrued by the position that can be recognized alongside principal.</span>
            </div>
            <div className="doc-topic">
              <span className="type-doc-subsection-title">reserveValue</span>
              <span className="type-doc-body ml-2">Reserved portion held back for oracle, unwind, and protocol risk buffers.</span>
            </div>
          </div>

          <p className="mt-4 type-doc-body">
            The adapter behind this interface handles the DEX-specific reconstruction and validation. Borrow Spokes receive the same return fields for ERC-20 LP tokens, position NFTs, and multi-asset pools, while each implementation applies the checks required by its collateral type.
          </p>
        </section>

        <section id="multi-layer-architecture" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Multi-Layer Architecture</h2>
          <p className="type-doc-body mb-4">
            LP valuation is a staged process rather than a single spot-price read. The oracle path
            moves through the following steps:
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
          <h2 className="type-doc-section-title mb-4">DEX-Specific Handling</h2>
          <p className="type-doc-body mb-4">
            Each DEX exposes different position and pool data. The oracle reconstructs the underlying assets from that data and verifies the resulting valuation against its reference prices and risk controls.
          </p>
          
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-2 type-doc-subsection-title">DEX / LP Type</th>
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
          <h2 className="type-doc-section-title mb-4">TWAP Computation by DEX</h2>
          <p className="type-doc-body mb-4">
            Time-weighted average prices (TWAPs) provide verification data alongside external asset prices and position reconstruction. Comparing these inputs helps identify short-lived price distortions or inconsistent pool state. TWAP data supplements the valuation process rather than supplying the collateral value on its own.
          </p>
          
          <div className="space-y-3">
            <div className="doc-topic">
              <h3 className="type-doc-subsection-title mb-1">Uniswap V2 & SushiSwap</h3>
              <p className="type-doc-body">
                On-chain cumulative price data over a 1-hour window is used to cross-check the
                reconstructed reserve picture and reduce sensitivity to flash swaps or other
                short-lived pool distortions.
              </p>
            </div>
            <div className="doc-topic">
              <h3 className="type-doc-subsection-title mb-1">Uniswap V3</h3>
              <p className="type-doc-body">
                For concentrated-liquidity positions, checks use tick range, liquidity distribution, and accrued fees to verify the token exposure represented by each NFT.
              </p>
            </div>
            <div className="doc-topic">
              <h3 className="type-doc-subsection-title mb-1">Balancer</h3>
              <p className="type-doc-body">
                Weighted token observations are combined with pool weights to validate multi-asset
                inventory splits before the oracle assigns a conservative collateral value.
              </p>
            </div>
            <div className="doc-topic">
              <h3 className="type-doc-subsection-title mb-1">Curve</h3>
              <p className="type-doc-body">
                Stablecoin observations are used mainly to detect stale feeds, reserve drift, and
                short-term anomalies while external prices remain the primary anchor.
              </p>
            </div>
            <div className="doc-topic">
              <h3 className="type-doc-subsection-title mb-1">Trader Joe & Aerodrome</h3>
              <p className="type-doc-body">
                Cumulative price observations over a 30-60 minute window help validate
                lower-liquidity pool state and resist same-transaction manipulation during
                collateral checks.
              </p>
            </div>
          </div>
        </section>

        <section id="safety-measures" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Safety & Manipulation Prevention</h2>
          
          <ul className="space-y-3">
            <li className="type-doc-callout type-doc-callout-danger">
              <span className="type-doc-subsection-title">Deviation Thresholds</span>
              <p className="type-doc-body mt-0.5">
                New loans or liquidations can be paused when pool-derived verification data moves
                too far away from external reference prices beyond{" "}
                <code className="type-doc-inline-code">maxDifference</code>.
              </p>
            </li>
            <li>
              <span className="type-doc-subsection-title">maxPoolPriceDifference</span>
              <p className="type-doc-body mt-0.5">
                This keeps pool-implied state aligned with underlying token prices and limits
                instantaneous pool manipulation or same-transaction oracle abuse.
              </p>
            </li>
            <li>
              <span className="type-doc-subsection-title">Open Interest Caps</span>
              <p className="type-doc-body mt-0.5">
                Exposure is capped by LP family, pool depth, and collateral complexity so thinner
                markets receive tighter borrow limits.
              </p>
            </li>
            <li>
              <span className="type-doc-subsection-title">Recovery Haircuts</span>
              <p className="type-doc-body mt-0.5">
                The oracle discounts theoretical LP value for impermanent loss, unwind slippage,
                and stressed liquidation assumptions before any borrow power is granted.
              </p>
            </li>
            <li>
              <span className="type-doc-subsection-title">Oracle Sentinel</span>
              <p className="type-doc-body mt-0.5">
                Oracle Sentinel watches feed health and verification inputs and can trigger fallback
                behavior when data is stale, compromised, or inconsistent with position-state
                checks.
              </p>
            </li>
          </ul>
        </section>

        <section id="configurable-parameters" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Configurable Oracle Parameters</h2>
          <p className="type-doc-body mb-4">
            Pool-specific oracle settings are configured per token through{" "}
            <code className="type-doc-inline-code">setTokenConfig</code>. The table below lists the parameters used to validate a token&apos;s price feed and associated pool:
          </p>
          
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Parameter</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 type-doc-inline-code">Token</td>
                  <td className="px-4 py-2">Collateral token address</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 type-doc-inline-code">AggregatorV3Interface</td>
                  <td className="px-4 py-2">Chainlink feed for underlying token</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 type-doc-inline-code">maxFeedAge</td>
                  <td className="px-4 py-2">Maximum acceptable age for Chainlink feed</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 type-doc-inline-code">Pool</td>
                  <td className="px-4 py-2">Specific DEX pool (Uniswap V3, Balancer, Curve, etc.)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 type-doc-inline-code">twapSeconds</td>
                  <td className="px-4 py-2">Window for TWAP computation</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 type-doc-inline-code">Mode</td>
                  <td className="px-4 py-2">Oracle operational mode (standard/fallback)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 type-doc-inline-code">maxDifference</td>
                  <td className="px-4 py-2">Max allowed deviation between DEX and verification price</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 type-doc-body">
            In practice, oracle behavior comes from the combination of external asset pricing, LP
            reconstruction logic, recoverable-value treatment, and the per-token settings configured
            through <code className="type-doc-inline-code">setTokenConfig</code>.
          </p>
        </section>
      </div>

      {/* Right scroll-spy sidebar */}
      <DeveloperScrollSpyRail 
        sections={sections} 
        pageSummary="How Avana Oracle reconstructs LP positions, applies conservative pricing, and checks market data before value reaches the spoke."
        sectionColor="cyan"
      />
    </div>
  ))
}
