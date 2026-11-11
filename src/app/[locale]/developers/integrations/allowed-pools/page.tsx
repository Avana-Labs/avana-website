import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'integrations/allowed-pools', {
    title: "Allowed LP Pools",
    description: "Which pools and ranges Avana lists as collateral at launch, the listing criteria and excluded tokens, the AMM integration interface, Uniswap v3 and Aerodrome Slipstream specifics, and the guards for AMMs that are not yet listed.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "launch-markets", title: "Launch Markets" },
  { id: "exact-range", title: "Market = Pool + Exact Range" },
  { id: "listing-criteria", title: "Listing Criteria" },
  { id: "collateral-factor", title: "Collateral Factor" },
  { id: "excluded-tokens", title: "Excluded Tokens" },
  { id: "integration-interface", title: "AMM Integration Interface" },
  { id: "uniswap-v3", title: "Uniswap v3 Specifics" },
  { id: "slipstream", title: "Aerodrome Slipstream Specifics" },
  { id: "readiness", title: "AMMs Not Yet Listed" },
]

export default async function AllowedPoolsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "integrations/allowed-pools", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Allowed LP Pools"
          description="Avana lists one exact pool and tick range at a time. Each market passes its AMM protocol's listing rules, a five-day public review and an on-chain match check before it accepts collateral."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            Avana launches on Ethereum and Base, each with one Avana Stable LP Hub. Uniswap v3 positions are accepted on Ethereum and Aerodrome Slipstream positions on Base. Correlated LP and Volatile LP Hubs can be added later, each with its own CDP Spokes.
          </p>
          <p className="mb-4 type-doc-body">
            A pool is not approved as a whole. Each market is one pool plus one exact position shape, with its own vault token, collateral reserve, price feed, caps and swap routes. The core design also supports Uniswap v2, Curve StableSwap-NG, Balancer and Uniswap v4, but none of them is listed until its integration passes the guards described below.
          </p>
          <p className="type-doc-body">
            How a market is registered, activated, offboarded and closed is described on the market lifecycle page:{" "}
            <Link href="/developers/integrations/market-lifecycle" className="text-type-accent hover:underline">Market Lifecycle</Link>.
          </p>
        </section>

        <section id="launch-markets" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Launch Markets</h2>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Chain</th><th className="text-left px-4 py-2 type-doc-subsection-title">Hub</th><th className="text-left px-4 py-2 type-doc-subsection-title">CDP Spoke</th><th className="text-left px-4 py-2 type-doc-subsection-title">Positions</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Ethereum</td><td className="px-4 py-2">Avana Stable LP Hub</td><td className="px-4 py-2">Uniswap v3 Stable</td><td className="px-4 py-2">Uniswap v3 NFT positions of the canonical position manager</td></tr>
                <tr><td className="px-4 py-2">Base</td><td className="px-4 py-2">Avana Stable LP Hub</td><td className="px-4 py-2">Aerodrome Slipstream Stable</td><td className="px-4 py-2">Unstaked Aerodrome Slipstream NFT positions of an allowlisted position-manager generation</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            Launch pools are stablecoin pools that meet the listing rules, including USDC/USDT and pools containing GHO. Every token of a Stable LP Hub market is an approved USD-pegged stable, so its price is capped at $1 for valuation and the USD band applies.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>GHO pools: the collateral factor of a GHO leg is an explicit value, <code className="type-doc-inline-code">ghoLegCollateralFactorBps</code>, set per token in the listing payload (between 1 and 9,999 bps), used in place of an Aave Core Hub value.</li>
            <li>GHO markets stay Live while GHO trades above $1, because valuation and the band&apos;s upper bound use the capped price.</li>
            <li>GHO is the first debt asset of each CDP Spoke. USDC, USDT or WETH can be enabled per Spoke as further debt reserves.</li>
          </ul>
        </section>

        <section id="exact-range" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Market = Pool + Exact Range</h2>
          <p className="mb-4 type-doc-body">
            For concentrated liquidity, a market fixes one tick range, which can be the full usable range or a bounded one. A pledge is accepted only when the position&apos;s lower and upper ticks equal the market&apos;s exactly. A position wider or narrower by any number of ticks is never credited. Without this rule, a narrow-range position worth $10,000 would be credited at the market&apos;s per-unit value, about 979 times too high.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>The pool is derived from the position itself through the integration&apos;s pinned factory; a caller-supplied pool is never used.</li>
            <li>Both ticks must be aligned to the pool&apos;s tick spacing using signed arithmetic. A check on an unsigned cast would accept misaligned negative ticks, such as −516 for spacing 10.</li>
            <li>Both ticks must lie inside the usable range for the spacing, and the lower tick must be below the upper tick.</li>
            <li>At most one market exists per CDP Spoke, pool and range. The same pool and range can be listed again only on another CDP Spoke.</li>
          </ul>
        </section>

        <section id="listing-criteria" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Listing Criteria</h2>
          <p className="mb-4 type-doc-body">
            Before a listing is scheduled, the Aave V4 risk service providers publish a listing package with numeric thresholds and evidence for each rule: pool age, TVL, depth, feed heartbeat and deviation, stress slippage, a manipulation-cost study, a TWAP tolerance backtest, a shock table for the market&apos;s exact range and a cap stress test.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Area</th><th className="text-left px-4 py-2 type-doc-subsection-title">Rule</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Pool</td><td className="px-4 py-2">Created by the integration&apos;s pinned factory, with a standard tick spacing and sufficient liquidity history</td></tr>
                <tr><td className="px-4 py-2">Price feeds</td><td className="px-4 py-2">For each token, a primary direct TOKEN/USD Chainlink feed, an independent alternate route and a standby route, each leg with its published heartbeat recorded</td></tr>
                <tr><td className="px-4 py-2">Second source</td><td className="px-4 py-2">For each token, an independent second source (another oracle network, or a TWAP of a deep pool other than the market&apos;s own) whose history over past stress periods stayed within its tolerance</td></tr>
                <tr><td className="px-4 py-2">TWAP history</td><td className="px-4 py-2">The pool&apos;s observation buffer covers the 1,800-second window at the chain&apos;s block time: 151 observations on Ethereum, 901 on Base. Avana pays to raise it at listing.</td></tr>
                <tr><td className="px-4 py-2">Manipulation cost</td><td className="px-4 py-2">The pool&apos;s liquidity within the studied price band is at least the minimum a per-pool manipulation-cost study sets</td></tr>
                <tr><td className="px-4 py-2">Listing margin</td><td className="px-4 py-2">One minus the collateral factor exceeds the feed deviation threshold plus heartbeat drift</td></tr>
                <tr><td className="px-4 py-2">Swap routes</td><td className="px-4 py-2">For each pool token and each debt asset the Spoke lends, a primary and a backup swap route, each proven deep at stress size with the range fully one-sided. No route trades through the market&apos;s own pool.</td></tr>
                <tr><td className="px-4 py-2">Issuer probe</td><td className="px-4 py-2">Each token records a probe: a pause flag for issuers that can pause transfers (USDC), the fee rate for USDT, none otherwise (GHO, DAI)</td></tr>
                <tr><td className="px-4 py-2">Caps</td><td className="px-4 py-2">Market, token and depositor USD caps, a pool-share limit (10% of the pool by default) and the Hub add cap, set by the risk service providers</td></tr>
                <tr><td className="px-4 py-2">Minimum pledge</td><td className="px-4 py-2">$10 per pledge at launch, so every record is worth its liquidation gas</td></tr>
                <tr><td className="px-4 py-2">Records</td><td className="px-4 py-2">At most 16 records per account and market, so one liquidation of the largest account fits in a transaction</td></tr>
                <tr><td className="px-4 py-2">Vault-token value</td><td className="px-4 py-2">One whole vault token must be worth between $0.50 and $20.00 at activation</td></tr>
                <tr><td className="px-4 py-2">Token count</td><td className="px-4 py-2">Between 2 and 8 tokens per pool, the limit set by <code className="type-doc-inline-code">MAX_POOL_TOKENS</code></td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="collateral-factor" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Collateral Factor</h2>
          <p className="mb-4 type-doc-body">
            The LPOracle values each position with no haircut. All risk adjustment is in the reserve&apos;s collateral factor, computed over the market&apos;s tokens:
          </p>
          <div className="mb-4 type-doc-code-block"><code className="type-doc-body text-gray-900">CF = ⌊min(CFᵢ) × poolRiskFactor⌋</code></div>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Each token&apos;s factor is its Aave V4 Core Hub collateral factor, the explicit GHO leg factor, or for a token without a Core Hub factor, a value the risk service providers set.</li>
            <li>The pool risk factor has a ceiling of 0.40.</li>
            <li>A fork check before the proposal asserts that a full liquidation never seizes more than the collateral.</li>
          </ul>
          <div className="doc-topic type-doc-body">
            Example: token factors of 78% and a pool risk factor of 0.40 give a collateral factor of 31.2%. That is a maximum loan-to-value of 31.2% at health factor 1.00 and a recommended 28.4% at the Lens&apos;s health factor of 1.10.
          </div>
        </section>

        <section id="excluded-tokens" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Excluded Tokens</h2>
          <p className="mb-4 type-doc-body">
            The LPVaults, Collateralization and LPVaultSwap account by received balances and forward every token in the same call, so tokens that change balances on their own are excluded:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Fee-on-transfer tokens</li>
            <li>Rebasing tokens</li>
            <li>Tokens with transfer hooks</li>
            <li>Tokens whose transfer returns false instead of reverting</li>
          </ul>
          <p className="mb-4 type-doc-body">
            Native ETH is held as WETH, and a rate token such as a liquid staking token is priced through its rate feed times the underlying feed. USDC and USDT are accepted issuer-upgradeable exceptions with monitoring and an issuer probe.
          </p>
          <div className="doc-topic type-doc-body">
            USDT&apos;s fee rate must be 0 at listing. Every amount Avana receives is measured by balance change, so if the fee is switched on later, settlement and repay complete at the reduced amounts while the issuer breaker stops new exposure to the token.
          </div>
        </section>

        <section id="integration-interface" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">AMM Integration Interface</h2>
          <p className="mb-4 type-doc-body">
            An AMM integration is Avana&apos;s code for one AMM protocol on one chain: one immutable LPVault that holds every pledged position of that protocol, plus the pricing library compiled into both the LPVault and the protocol&apos;s LPOracle implementation. The core (Collateralization, vault tokens, the AaveAdapter, LPVaultSwap and the LPOracle base) depends only on this interface. Adding an AMM protocol adds one LPVault, one pricing library and one LPOracle implementation; nothing else changes.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Part</th><th className="text-left px-4 py-2 type-doc-subsection-title">Functions</th><th className="text-left px-4 py-2 type-doc-subsection-title">Used for</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Custody</td><td className="px-4 py-2"><code className="type-doc-inline-code">bindMarket, receivePosition, validatePosition, topUpPosition, returnPosition, returnStray</code></td><td className="px-4 py-2">Binding a market at listing; taking, checking and returning positions</td></tr>
                <tr><td className="px-4 py-2">Composition</td><td className="px-4 py-2"><code className="type-doc-inline-code">composition</code></td><td className="px-4 py-2">Token amounts a number of units holds at an oracle price vector, from oracle prices only</td></tr>
                <tr><td className="px-4 py-2">Unwind</td><td className="px-4 py-2"><code className="type-doc-inline-code">unwind, releaseToDepositor, unitsOf</code></td><td className="px-4 py-2">Removing exactly the given units for seizure, repay with collateral and partial removal</td></tr>
                <tr><td className="px-4 py-2">Fees</td><td className="px-4 py-2"><code className="type-doc-inline-code">collectFees</code></td><td className="px-4 py-2">Paying accrued fees to the depositor of record</td></tr>
                <tr><td className="px-4 py-2">Risk metadata</td><td className="px-4 py-2"><code className="type-doc-inline-code">riskMetadata, riskStatus, checkReadSafe, consistencyDeviation</code></td><td className="px-4 py-2">Range status, pool lock, pool share and time-weighted depth for the RiskModule, the LPOracle and the Lens</td></tr>
              </tbody>
            </table>
          </div>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Every record, event and index is keyed by the integration identifier and a position key, never by a bare NFT token ID.</li>
            <li>One vault-token base unit is backed by one credited unit: liquidity for concentrated liquidity, LP-token base units for fungible LP shares.</li>
            <li><code className="type-doc-inline-code">checkReadSafe</code> reverts while the pool is inside its own reentrancy lock; Collateralization calls it before every custody, read and removal, and the LPOracle before every quote.</li>
          </ul>
        </section>

        <section id="uniswap-v3" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Uniswap v3 Specifics</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>The LPVault accepts positions of the canonical NonfungiblePositionManager only, never a fork. Its position key is the token ID.</li>
            <li>A market&apos;s pool must come from the canonical factory and match the address derived from the factory&apos;s init code hash. Tick spacing must be that of a standard fee tier: fee 100 → 1, 500 → 10, 3,000 → 60, 10,000 → 200.</li>
            <li>Every custody, removal and liquidity read under the Lock checks the pool&apos;s 7-field slot0 and reverts with <code className="type-doc-inline-code">PoolLocked</code> while the pool is unlocked for a swap or flash callback.</li>
            <li>The borrower approves the LPVault for that one token ID, or signs a position-manager permit. The LPVault pulls with a plain transfer, so wallets without a receiver hook work.</li>
            <li>A removal decreases liquidity and immediately collects only the principal it returned, so fees stay owed to the NFT. Fee collection pays all owed amounts to the depositor of record, including principal left owed before the pledge, which was never credited.</li>
            <li>An NFT sent to the LPVault outside a pledge is never credited; the timelock can return it.</li>
          </ul>
        </section>

        <section id="slipstream" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Aerodrome Slipstream Specifics</h2>
          <p className="mb-4 type-doc-body">
            Slipstream reuses the Uniswap v3 tick and liquidity math, so every Uniswap v3 rule applies with the position manager and factory of the market&apos;s pinned generation in their place. The differences:
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Area</th><th className="text-left px-4 py-2 type-doc-subsection-title">Uniswap v3</th><th className="text-left px-4 py-2 type-doc-subsection-title">Slipstream</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Pool lookup</td><td className="px-4 py-2">By fee</td><td className="px-4 py-2">By tick spacing</td></tr>
                <tr><td className="px-4 py-2">Position field 5</td><td className="px-4 py-2">Fee</td><td className="px-4 py-2">Signed tick spacing, decoded with Slipstream&apos;s own layout</td></tr>
                <tr><td className="px-4 py-2">slot0</td><td className="px-4 py-2">7 fields</td><td className="px-4 py-2">6 fields; the lock flag is field 6, so a v3 decoder would read the wrong word</td></tr>
                <tr><td className="px-4 py-2">Swap fee</td><td className="px-4 py-2">Fixed by the fee tier</td><td className="px-4 py-2">Dynamic; always read live from the pool, never derived from the spacing</td></tr>
                <tr><td className="px-4 py-2">Position managers</td><td className="px-4 py-2">One</td><td className="px-4 py-2">Three generations, each with its own factory, fixed in the LPVault&apos;s immutable allowlist</td></tr>
                <tr><td className="px-4 py-2">Staking</td><td className="px-4 py-2">None</td><td className="px-4 py-2">Gauge-staked positions are refused</td></tr>
                <tr><td className="px-4 py-2">Tick spacings</td><td className="px-4 py-2">1, 10, 60, 200</td><td className="px-4 py-2">Any spacing the factory enables, for example 1, 50, 100, 200, 2000</td></tr>
              </tbody>
            </table>
          </div>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Generation-prefixed position key: the position key carries the generation in its high byte, so the LPVault always calls the right position manager even though token IDs overlap between generations. A pledge from another generation reverts with <code className="type-doc-inline-code">PoolMismatch</code>.</li>
            <li>Unstaked positions only: a pledge reverts with <code className="type-doc-inline-code">PositionEncumbered</code> when the owner is a gauge. The LPVault never stakes or approves a custodied NFT, so a pledged position stays unstaked until it returns to its depositor.</li>
            <li>Lock check: every custody, removal and quote reverts with <code className="type-doc-inline-code">PoolLocked</code> while the 6-field slot0 shows the pool locked.</li>
            <li>Fees of an unstaked position are reduced by the pool&apos;s staked share and its unstaked fee. Fees are never collateral, so this changes only the borrower&apos;s yield, which the Lens reports per market.</li>
          </ul>
        </section>

        <section id="readiness" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">AMMs Not Yet Listed</h2>
          <p className="mb-4 type-doc-body">
            The interface supports four more AMM protocols. No market of any of them is listed until its integration page, fork tests of every guard on its chain and its seizure gas measurement exist, followed by risk review and governance approval. Every one also needs the per-block quote-change cap.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">AMM</th><th className="text-left px-4 py-2 type-doc-subsection-title">Pricing</th><th className="text-left px-4 py-2 type-doc-subsection-title">Guards before listing</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Uniswap v2</td><td className="px-4 py-2">Fair reserves at the oracle ratio, 2·√(r0·r1·p0·p1) per effective supply</td><td className="px-4 py-2">Reserves read only through <code className="type-doc-inline-code">getReserves()</code>, never from token balances; supply includes the pending protocol-fee mint; borrowing refused while the spot price is more than 1% off the oracle ratio; minimum supply; quote-change cap at most 1%; consistency from cumulative prices</td></tr>
                <tr><td className="px-4 py-2">Curve StableSwap-NG</td><td className="px-4 py-2">Lower bound: the cheapest coin&apos;s price × D per supply</td><td className="px-4 py-2">Reentrancy-locked pool call before every read; a reverting D is a price failure; no rate token without a capped rate feed; native ETH wrapped; at most 8 coins; consistency from the pool&apos;s price oracle</td></tr>
                <tr><td className="px-4 py-2">Balancer weighted and stable</td><td className="px-4 py-2">Weighted invariant per actual supply; stable pools as Curve</td><td className="px-4 py-2">Vault reentrancy check before every read; actual supply including pending fee BPT; feed-only consistency check for weighted pools</td></tr>
                <tr><td className="px-4 py-2">Uniswap v4</td><td className="px-4 py-2">As Uniswap v3, over the position&apos;s range</td><td className="px-4 py-2">Hook-free pool or an allowlisted immutable hook with no remove-liquidity hooks and no deltas; no subscribed positions; pool manager must be locked for every read; feed-only consistency check unless the hook is an oracle hook</td></tr>
              </tbody>
            </table>
          </div>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Uniswap v2, Curve and Balancer positions are fungible LP shares. Their LPVault books one custody entry per deposit, and fees compound into the pool, so fee collection reverts with <code className="type-doc-inline-code">FeesRolledIn</code> and the depositor receives them when the position returns.</li>
            <li>Pools hold between 2 and 8 tokens. Every n-token array in the oracle, RiskModule and Collateralization is bounded by <code className="type-doc-inline-code">MAX_POOL_TOKENS</code> = 8.</li>
            <li>Tokenized stocks with market-hours feeds are not listed at launch. A future listing must stop new borrowing while the reference market is closed, pause new activity around corporate actions, and have the issuer allowlist every Avana contract that holds the token.</li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Launch markets, listing criteria, excluded tokens and AMM integration rules."
        sectionColor="cyan"
      />
    </div>
  ))
}
