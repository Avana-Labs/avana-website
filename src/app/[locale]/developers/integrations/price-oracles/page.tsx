import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'integrations/price-oracles', {
    title: "Price Oracles",
    description: "How the LPOracle values one vault token from the position's fair composition at Chainlink prices, how routes, second sources, the TWAP check and the USD band work, and how the DebtOracle prices non-GHO debt.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "vault-token-price", title: "Vault Token Price" },
  { id: "concentrated-liquidity", title: "Concentrated Liquidity" },
  { id: "lppricemath", title: "LPPriceMath" },
  { id: "chainlink-routes", title: "Chainlink Routes" },
  { id: "heartbeats", title: "Heartbeats and Age Limits" },
  { id: "second-source", title: "Second Source" },
  { id: "twap-check", title: "TWAP Consistency Check" },
  { id: "usd-band", title: "USD Band" },
  { id: "quote-change-cap", title: "Quote-Change Cap" },
  { id: "poke-checkpoint", title: "Poke and Checkpoint" },
  { id: "sequencer", title: "Base Sequencer Feed" },
  { id: "debt-oracle", title: "DebtOracle" },
  { id: "views-events", title: "Views, Events and Errors" },
  { id: "governance", title: "Changes and Upgrades" },
]

export default async function PriceOraclesPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "integrations/price-oracles", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Price Oracles"
          description="The LPOracle prices one market's vault token for Aave; the DebtOracle prices each non-GHO debt asset. Both use validated Chainlink routes and report a price state that Avana's contracts enforce."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            A market is one chain, AMM protocol, pool and exact position shape, with one vault token and one collateral reserve on its CDP Spoke. Each market has its own LPOracle proxy. Each AMM protocol has one LPOracle implementation per chain, and every market of that protocol on that chain is a proxy of it. At launch that means one implementation for Uniswap v3 on Ethereum and one for Aerodrome Slipstream on Base.
          </p>
          <p className="mb-4 type-doc-body">The LPOracle has two layers:</p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>A price-state core that does not depend on the AMM. It validates Chainlink prices for each of the market&apos;s tokens, selects one quote per token, runs failover, agreement, freshness, second-source, sequencer and timer rules, and serves a conservative price when the market cannot be trusted.</li>
            <li>A pricing module per AMM protocol, compiled into that protocol&apos;s implementation. It supplies the composition of the position at an oracle price vector, the AMM consistency check and the listing checks. The AMM integration uses the same composition function, so pricing and unwinding agree.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            The LPOracle does two jobs. For Aave, it returns the USD value of one whole vault token with 8 decimals, which the CDP Spoke&apos;s AaveOracle reads for health factors and seizure sizing. For Avana, its views report the price state, the source timestamp and age limits of the served price, whether a borrow may rely on the price, the disagreement pause, the recovery grace window, the last accepted price and an hourly checkpoint. The RiskModule and LPVaultSwap enforce their gates from these views.
          </p>
          <div className="doc-topic type-doc-body">
            The LPOracle applies no haircut: all risk adjustment sits in the CDP Spoke&apos;s collateral factor. It does not price debt, enforce gates, choose feeds or move tokens. No token, ETH or approval ever moves through it.
          </div>
          <p className="mt-4 type-doc-body">
            The four price states and what each one allows are described on the price states page:{" "}
            <Link href="/developers/integrations/price-states" className="text-type-accent hover:underline">Price States</Link>.
          </p>
        </section>

        <section id="vault-token-price" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Vault Token Price</h2>
          <p className="mb-4 type-doc-body">
            The price of one whole vault token is the value of the tokens the position would hold if the pool price equalled the price implied by the oracle price vector. This is the fair composition. It is the cheapest holding the position can reach: moving the pool price can only raise the value of what the position actually holds, so a pool manipulation cannot inflate collateral and the LPOracle never needs the pool&apos;s spot price.
          </p>
          <div className="mb-4 type-doc-code-block"><code className="type-doc-body text-gray-900">value = Σ amountᵢ(oracle price vector) × priceᵢ</code></div>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Prices are the validated Chainlink quotes of each token, with every USD-pegged stable capped at $1.00 for valuation. A stable trading above $1 does not make the collateral safer, so the premium is never credited.</li>
            <li>For concentrated liquidity, the oracle price ratio is clamped to the market&apos;s tick range before the amounts are computed.</li>
            <li>Every amount is floored and then reduced by one raw unit. Every division and square root rounds down, against the borrower.</li>
            <li>Uncollected fees are excluded: owed tokens, fee growth and any fee the AMM keeps apart from the position never count, because a wash trader can raise them within one transaction.</li>
            <li>The result has 8 decimals and is at least 1. The price never reverts except with an out-of-gas guard and never returns 0, because Aave rejects a non-positive price.</li>
          </ul>
          <h3 className="mb-2 type-doc-subsection-title">Vault-token decimals</h3>
          <p className="mb-4 type-doc-body">
            One vault-token base unit is one unit of the position measure the AMM integration credits: for Uniswap v3 and Slipstream, one unit of liquidity of the market&apos;s exact range. The decimals are fixed at listing as the smallest value between 6 and 18 for which one whole token is worth at least $1 at the listing prices, so a whole token is worth between $1 and $10. Listing fails if no such value exists.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Example</h3>
          <p className="mb-4 type-doc-body">Example values; each market&apos;s parameters are set at listing.</p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Step</th><th className="text-left px-4 py-2 type-doc-subsection-title">Value</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Market</td><td className="px-4 py-2">USDC/USDT on the tick range −10 to 10, 10 vault-token decimals</td></tr>
                <tr><td className="px-4 py-2">Valuation prices</td><td className="px-4 py-2">USDC $0.99987, USDT $1.00000</td></tr>
                <tr><td className="px-4 py-2">Composition of one whole token</td><td className="px-4 py-2">5,648,563 raw USDC and 4,348,479 raw USDT</td></tr>
                <tr><td className="px-4 py-2">After the one-unit deduction</td><td className="px-4 py-2">5,648,562 and 4,348,478</td></tr>
                <tr><td className="px-4 py-2">Price</td><td className="px-4 py-2">564,782,768 + 434,847,800 = 999,630,568 ($9.99630568)</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="concentrated-liquidity" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Concentrated Liquidity</h2>
          <p className="mb-4 type-doc-body">
            The concentrated-liquidity pricing module serves every Uniswap v3 market on Ethereum and every Aerodrome Slipstream market on Base. Slipstream uses the same tick, square-root price and liquidity math, so the module is shared; only the pool reads differ, and the module never reads the pool&apos;s spot state for valuation.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>The two token prices are converted to a pool square-root price in 512-bit arithmetic, including the decimals factor. The conversion never reverts; an out-of-bounds result is clamped and the market is reported as Drifting.</li>
            <li>The oracle square-root price is clamped to the range between the market&apos;s lower and upper tick. Outside its range a position holds only one token, and the clamp makes the composition exactly that one-token holding.</li>
            <li>Amounts follow Uniswap&apos;s liquidity-amount formulas at the clamped price, rounding down at every step.</li>
            <li>When the clamp changes the price, the oracle ratio has left the range, which for a stable pair means a token has depegged. The market is Drifting with the price-clamped reason: new pledges and new debt stop, top-ups and liquidation continue.</li>
          </ul>
          <div className="doc-topic type-doc-body">
            Example: USDC/USDT on the range −100 to 100 (about ±1%), 9 decimals. USDT depegs to $0.952 with USDC at $1. The ratio is above the range, so one whole token holds 0 USDC and 9,999,541 raw USDT and is priced at $9.52. Without the clamp, the same formulas would give 29,887,349 raw USDT, valued at $28.45, 2.99 times the real holding.
          </div>
        </section>

        <section id="lppricemath" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">LPPriceMath</h2>
          <p className="mb-4 type-doc-body">
            LPPriceMath is an internal library with no external calls and no storage. It holds the pure arithmetic of the price path and is compiled into every LPOracle implementation and the DebtOracle, so each formula maps to one function and one verification model. The oracles call it with values they have already validated.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Function</th><th className="text-left px-4 py-2 type-doc-subsection-title">Computes</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">normalizeAnswer</code></td><td className="px-4 py-2">A Chainlink answer scaled to 8 decimals, rounding down</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">routeValue</code></td><td className="px-4 py-2">The USD price of a one-leg or two-leg route; a two-leg route takes the timestamp of its oldest leg</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">feedMaxAge</code></td><td className="px-4 py-2">A leg&apos;s heartbeat plus the chain&apos;s heartbeat margin</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">vaultDecimals</code></td><td className="px-4 py-2">The vault-token decimals chosen at listing</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">lpPrice</code></td><td className="px-4 py-2">The price of one whole vault token from the pricing module&apos;s composition</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">inUsdBand</code></td><td className="px-4 py-2">Whether a stable market is inside the USD band</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">servedTimestamp</code></td><td className="px-4 py-2">The source timestamp of the served price: its oldest input</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">ageLimits</code></td><td className="px-4 py-2">The borrow and liquidation age limits of the served price</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">servedPrice</code></td><td className="px-4 py-2">The collateral price served in each state</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">debtServedPrice</code></td><td className="px-4 py-2">The debt price served in each state, including the stress rise</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">secondSourceAgrees</code></td><td className="px-4 py-2">The second-source agreement test</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">sequencerStatus</code></td><td className="px-4 py-2">Up, down, grace or unknown from the sequencer-uptime feed</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">minObservations</code></td><td className="px-4 py-2">The pool observation buffer needed for the TWAP window on the chain</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">gasForCall</code></td><td className="px-4 py-2">The gas check made before every external read</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="chainlink-routes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Chainlink Routes</h2>
          <p className="mb-4 type-doc-body">
            A leg is one Chainlink aggregator read through its standard proxy. A route is one leg (TOKEN/USD) or two legs multiplied (TOKEN/X × X/USD). Each listed token has three routes, recorded in the MarketRegistry at listing under the same checks:
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Route</th><th className="text-left px-4 py-2 type-doc-subsection-title">Role</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Primary</td><td className="px-4 py-2">The token&apos;s direct TOKEN/USD Chainlink feed. Used whenever it is valid.</td></tr>
                <tr><td className="px-4 py-2">Alternate</td><td className="px-4 py-2">An independent route that shares no aggregator with the primary. Used automatically when the primary is invalid, re-evaluated on every read with no transaction, role or stored flag. It never assumes a peg, such as pricing USDT as USDT/USDC × $1.</td></tr>
                <tr><td className="px-4 py-2">Standby</td><td className="px-4 py-2">A third route that a guardian can put in place of the primary or the alternate at once. It passed every listing check of the slot it replaces, so a guardian can only choose among reviewed routes.</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="mb-2 type-doc-subsection-title">Leg validity</h3>
          <p className="mb-4 type-doc-body">
            Each leg is read with a static call inside try/catch and an explicit gas amount. A leg is valid only if its decimals equal the decimals pinned at listing, its answer lies strictly between the pinned minimum and maximum answers, its timestamp is non-zero and not in the future, its age is within the leg&apos;s age limit, and its normalised answer is at least 1. A leg that fails only the age test is Stale; any other failure is Invalid or Error. A route is valid only if all its legs are valid.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Agreement check</h3>
          <p className="mb-4 type-doc-body">
            When both routes of a token are valid, they must agree within the token&apos;s tolerance T, in basis points, compared as exact integers with no division:
          </p>
          <div className="mb-4 type-doc-code-block"><code className="type-doc-body text-gray-900">|primary − alternate| × 10,000 ≤ T × min(primary, alternate)</code></div>
          <p className="mb-4 type-doc-body">
            The tolerance must be at least the deviation thresholds of every leg on both routes plus a margin of 50 bps, so honest routes never disagree. If the check fails, the market is Drifting and the quote stays the primary. When only one route is valid, no agreement check runs.
          </p>
          <div className="doc-topic type-doc-body">
            Example: with T = 225 bps, a primary of $1.0001 and an alternate of $0.9990 agree (1.1 × 10⁹ ≤ 2.248 × 10¹⁰). With the alternate at $0.9750 they disagree (2.51 × 10¹⁰ &gt; 2.194 × 10¹⁰).
          </div>
          <h3 className="mb-2 mt-4 type-doc-subsection-title">Independence rules at listing</h3>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>A token&apos;s primary and alternate routes share no aggregator.</li>
            <li>No two tokens of a market share an aggregator on their alternate routes, so one intermediate feed cannot move every token at once.</li>
            <li>No token&apos;s second source shares an aggregator with any of its routes.</li>
            <li>Every route stays within its pinned answer bounds and within $10,000 per token, the overflow ceiling.</li>
          </ul>
        </section>

        <section id="heartbeats" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Heartbeats and Age Limits</h2>
          <p className="mb-4 type-doc-body">
            A Chainlink feed publishes a new round when its answer moves by its deviation threshold or when its heartbeat elapses. A feed that is still operating is therefore never older than its heartbeat plus a publication delay. Each leg&apos;s age limit is its own published heartbeat, recorded at listing, plus the chain&apos;s heartbeat margin of 1,800 seconds on Ethereum and on Base.
          </p>
          <div className="mb-4 type-doc-code-block"><code className="type-doc-body text-gray-900">feedMaxAge = feedHeartbeat + heartbeatMargin</code></div>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Feed</th><th className="text-left px-4 py-2 type-doc-subsection-title">Heartbeat</th><th className="text-left px-4 py-2 type-doc-subsection-title">Age limit</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Ethereum USDC/USD, USDS/USD</td><td className="px-4 py-2">82,800 s</td><td className="px-4 py-2">84,600 s</td></tr>
                <tr><td className="px-4 py-2">Ethereum USDT/USD, GHO/USD</td><td className="px-4 py-2">86,400 s</td><td className="px-4 py-2">88,200 s</td></tr>
                <tr><td className="px-4 py-2">Ethereum DAI/USD, ETH/USD</td><td className="px-4 py-2">3,600 s</td><td className="px-4 py-2">5,400 s</td></tr>
                <tr><td className="px-4 py-2">Base USD stablecoin feeds</td><td className="px-4 py-2">86,400 s</td><td className="px-4 py-2">88,200 s</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            A calm stablecoin feed legitimately ages up to its 23- or 24-hour heartbeat. A 20-hour-old USDC/USD answer is fresh; a borrow against it also needs the second source to agree. There is no separate heartbeat ceiling for primaries, because the agreement check and the second source bound what a feed&apos;s age can hide.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li><code className="type-doc-inline-code">liquidationPriceMaxAge</code> equals the age limit of each feed.</li>
            <li><code className="type-doc-inline-code">borrowPriceMaxAge</code> is at most that limit. It equals it unless governance lowers it at the short delay during an incident.</li>
            <li>While a token is priced from its alternate route, every alternate leg is held to its borrow age for liquidation too. Past it, the market&apos;s seizure is blocked as if Cached while the market stays Live.</li>
            <li>The oracle reports the deadline of the served price as an age relative to its oldest input, so a slow stablecoin leg and a fast ETH/USD leg in the same market are each held to their own cadence.</li>
          </ul>
        </section>

        <section id="second-source" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Second Source</h2>
          <p className="mb-4 type-doc-body">
            A deviation-triggered feed is trusted for up to a day between rounds, so a borrow must not rely on one oracle network alone. Each token has an independent second source: another oracle network&apos;s aggregator, or a time-weighted price of a deep pool that is not the market&apos;s own pool, multiplied by the reference token&apos;s validated quote. A token is confirmed when the second source is valid and agrees with the token&apos;s quote within its tolerance, at most 500 bps.
          </p>
          <div className="mb-4 type-doc-code-block"><code className="type-doc-body text-gray-900">borrowAllowed = (state == Live) ∧ sequencerReady ∧ every token confirmed ∧ (now − servedUpdatedAt ≤ borrowPriceMaxAge)</code></div>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Borrowing and withdrawals that leave debt need this flag for the account&apos;s market and for the DebtOracle of the borrowed debt reserve.</li>
            <li>The second source never gates liquidation and never changes the state, the served price or any timer, so a broken second source can stop borrowing but never protects an unhealthy account.</li>
            <li>Each token can record a standby second source. Either guardian can switch to it at once; switching back goes through the timelock.</li>
          </ul>
          <div className="doc-topic type-doc-body">
            Example: tolerance 100 bps, quote $1.0002. A second source of $0.9940 confirms the token; $0.9890 does not, and borrowing stops while the market stays Live.
          </div>
        </section>

        <section id="twap-check" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">TWAP Consistency Check</h2>
          <p className="mb-4 type-doc-body">
            The pool&apos;s time-weighted price is an independent check on Chainlink. It gates the price and never feeds it. The check reads only the market&apos;s own pool, fixed at listing, through its observation history over the window W.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>The reference tick is computed from the uncapped Chainlink quotes. The mean tick over the window is rounded toward negative infinity.</li>
            <li>The check passes when the two ticks differ by at most the tolerance τ. One tick is a price step of 1.0001, about 1 bp. The launch tolerance is 50 ticks; it can never be set below 10.</li>
            <li>A failed check, or an observation read that reverts or cannot cover the window, makes the market Drifting. No view reverts because of it.</li>
          </ul>
          <h3 className="mb-2 type-doc-subsection-title">Observation buffer per chain</h3>
          <p className="mb-4 type-doc-body">
            A pool writes at most one observation per block, so an attacker who swaps dust in every block could shrink the buffer&apos;s time span. The pool must hold enough observations to cover the window at the chain&apos;s block time:
          </p>
          <div className="mb-4 type-doc-code-block"><code className="type-doc-body text-gray-900">twapMinObservations = ⌈twapWindow / CHAIN_BLOCK_TIME⌉ + 1</code></div>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Chain</th><th className="text-left px-4 py-2 type-doc-subsection-title">Block time</th><th className="text-left px-4 py-2 type-doc-subsection-title">twapWindow</th><th className="text-left px-4 py-2 type-doc-subsection-title">twapMinObservations</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Ethereum</td><td className="px-4 py-2">12 s</td><td className="px-4 py-2">1,800 s</td><td className="px-4 py-2">151</td></tr>
                <tr><td className="px-4 py-2">Base</td><td className="px-4 py-2">2 s</td><td className="px-4 py-2">1,800 s</td><td className="px-4 py-2">901</td></tr>
              </tbody>
            </table>
          </div>
          <p className="type-doc-body">
            Avana raises the pool&apos;s observation cardinality at listing and pays for it, over several transactions if needed. The Ethereum value used on Base would cover only 300 seconds.
          </p>
        </section>

        <section id="usd-band" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">USD Band</h2>
          <p className="mb-4 type-doc-body">
            When every token moves together, through a common-mode feed error or a correlated depeg, the pool ratio and the agreement check can look normal. The USD band catches the absolute level. It applies to markets whose tokens are all USD-pegged stables, which includes every Stable LP Hub market; other markets use 0 and the maximum value, so the test always passes.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>The band is 0.90 to 1.02 at launch, tested on the geometric mean of the token prices.</li>
            <li>The lower bound is tested on the uncapped quotes, because a downward common-mode move is what the band exists for.</li>
            <li>The upper bound is tested on the prices capped at $1, so GHO markets stay Live while GHO trades at a premium.</li>
            <li>A breach makes the market Drifting. It blocks new borrowing and withdrawals that leave debt; pledges, repay and liquidation continue, liquidation while both routes of each token are fresh and agree.</li>
          </ul>
          <div className="doc-topic type-doc-body">
            Example: GHO at $1.047 and USDC at $1.00 is in band, because the capped prices give 1.00 against an upper limit of 1.0404; tested uncapped, it would have breached. Both tokens at $0.89 give 0.7921 against a lower limit of 0.81, so the market is Drifting.
          </div>
        </section>

        <section id="quote-change-cap" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Quote-Change Cap</h2>
          <p className="mb-4 type-doc-body">
            Every AMM protocol has a per-block quote-change cap, <code className="type-doc-inline-code">maxQuoteChangeBps</code>, set per market (100 bps, 1%, at launch). When a poke computes a price that differs from an accepted price stored in the same block by more than the cap, the LPOracle does not accept it. It emits a capped event and serves the market as Cached for that block; a later block that still computes the new price accepts it.
          </p>
          <div className="doc-topic type-doc-body">
            Example: accepted price $2.10. A quote of $2.13 in the same block is refused (3 × 10¹⁰ &gt; 2.1 × 10¹⁰); $2.11 is accepted. A one-block move never reaches borrowing power, and a real move is accepted one block later.
          </div>
        </section>

        <section id="poke-checkpoint" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Poke and Checkpoint</h2>
          <p className="mb-4 type-doc-body">
            Views compute the state on every read. <code className="type-doc-inline-code">poke()</code> is the only call that writes price, timer or latch storage. It is permissionless, makes only static calls, takes no lock and returns the state.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">What a poke stores</h3>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>The accepted price, only when the market is Live and its inputs are newer than the last accepted price. Re-reading the same rounds never refreshes the timestamp.</li>
            <li>The first failed read of a failure episode and the first observation of a route disagreement.</li>
            <li>The grace latch and the recovery time after an outage that reached Expired.</li>
            <li>The route version of each token, so a standby switch restarts the disagreement window.</li>
            <li>The checkpoint: a copy of the accepted price, taken at most once per hour.</li>
          </ul>
          <h3 className="mb-2 type-doc-subsection-title">Who pokes</h3>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Collateralization pokes the pledged market before each pledge check.</li>
            <li>The RiskModule pokes the account&apos;s market and every non-GHO DebtOracle of the account before a borrow or a withdrawal with debt.</li>
            <li>LPVaultSwap pokes the collateral market and debt oracles of the account it liquidates.</li>
            <li>Keepers poke every LPOracle and DebtOracle at least once per hour and once per heartbeat of the fastest leg in force, in every block while a market is not Live, and in the block after a standby switch, restore or sequencer change.</li>
            <li>Repay, fee collection and debt-free withdrawal never read or poke an oracle.</li>
          </ul>
          <h3 className="mb-2 type-doc-subsection-title">Gas guard</h3>
          <p className="mb-4 type-doc-body">
            Each external read gets an explicit gas amount: 50,000 for a feed, 100,000 for a pool or pricing-module read, 40,000 for a registry, store or token call. Before each read the oracle checks that enough gas remains to forward the full amount and reverts with <code className="type-doc-inline-code">InsufficientGas</code> otherwise. A caller who picks the transaction&apos;s gas limit therefore cannot make a healthy feed look failed. <code className="type-doc-inline-code">poke()</code> also requires <code className="type-doc-inline-code">pokeMinGas</code> at entry (551,588 in the reference measurement).
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Checkpoint and price-drop alert</h3>
          <p className="type-doc-body">
            <code className="type-doc-inline-code">priceCheckpoint()</code> returns the accepted price copied by a poke at most once per 3,600 seconds. It is always a validated Live price. Monitoring compares the served price with a checkpoint from the last two hours and alerts when it is 3% lower. The price drop is an alert to the guardians only, never an on-chain trip.
          </p>
        </section>

        <section id="sequencer" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Base Sequencer Feed</h2>
          <p className="mb-4 type-doc-body">
            On Base, every LPOracle, DebtOracle and the RiskModule read the Chainlink L2 sequencer-uptime feed <code className="type-doc-inline-code">0xBCF85224fc0756B9Fa45aA7892530B47e10b6433</code> with a grace period of 3,600 seconds. Ethereum has no sequencer feed, and the sequencer is always treated as ready there.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Sequencer status</th><th className="text-left px-4 py-2 type-doc-subsection-title">Effect</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Down</td><td className="px-4 py-2">Borrowing blocked and seizure paused, because borrowers cannot react while only L1-forced transactions run</td></tr>
                <tr><td className="px-4 py-2">Grace (first 3,600 s after restart)</td><td className="px-4 py-2">Borrowing stays blocked; only accounts below the grace health factor (0.95) can be liquidated</td></tr>
                <tr><td className="px-4 py-2">Unknown (unreadable feed)</td><td className="px-4 py-2">Borrowing blocked; liquidation continues, so a broken uptime feed never stops liquidation</td></tr>
                <tr><td className="px-4 py-2">Ready</td><td className="px-4 py-2">No effect</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">The sequencer status never changes the price state, the served price or any timer.</p>
        </section>

        <section id="debt-oracle" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">DebtOracle</h2>
          <p className="mb-4 type-doc-body">
            GHO is priced by Aave&apos;s fixed $1 source and has no DebtOracle. Each other debt asset (USDC, USDT or WETH, enabled per CDP Spoke) has exactly one DebtOracle proxy per chain, used as the Aave price source of that asset&apos;s reserve on every CDP Spoke of the chain that lends it. It applies the same leg, route, failover, agreement, freshness, second-source, sequencer and timer rules to one token, with no pool, no consistency check, no USD band and no $1 ceiling: a debt asset above $1 is priced above $1.
          </p>
          <p className="mb-4 type-doc-body">
            A debt price that cannot be trusted is never below the last accepted price, so it can only lower health factors:
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">State</th><th className="text-left px-4 py-2 type-doc-subsection-title">Served debt price</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Live</td><td className="px-4 py-2">The fresh quote</td></tr>
                <tr><td className="px-4 py-2">Drifting (routes disagree)</td><td className="px-4 py-2">The higher of the two routes and the accepted price</td></tr>
                <tr><td className="px-4 py-2">Cached</td><td className="px-4 py-2">The accepted price</td></tr>
                <tr><td className="px-4 py-2">Expired</td><td className="px-4 py-2">The accepted price raised by the asset&apos;s stress rise, rounded up</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            The stress rise, <code className="type-doc-inline-code">debtStressRiseBps</code>, is set per asset between 100 and 5,000 bps at its first debt-reserve listing (500 bps for USDC at launch). LPVaultSwap repays a debt reserve in a liquidation only while its DebtOracle is Live within its liquidation age; otherwise the call reverts <code className="type-doc-inline-code">DebtPriceStale</code> for that reserve, and the account&apos;s other reserves stay liquidatable.
          </p>
          <div className="doc-topic type-doc-body">
            Example: USDC with an accepted price of $0.9999 and a 500 bps stress rise. Once Expired, the served price is $1.049895, so 10,000 USDC of debt counts as $10,498.95 instead of $9,999 in the health factor.
          </div>
        </section>

        <section id="views-events" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Views, Events and Errors</h2>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">LPOracle function</th><th className="text-left px-4 py-2 type-doc-subsection-title">Returns</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">latestAnswer()</code></td><td className="px-4 py-2">The served price, 8 decimals, at least 1</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">latestRoundData()</code></td><td className="px-4 py-2">The served price with the source timestamp of its oldest input</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">decimals()</code></td><td className="px-4 py-2">Always 8</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">getPriceState()</code></td><td className="px-4 py-2">State, reasons, served, fresh and accepted prices, per-token routes and legs with ages, second-source and consistency data, USD level, sequencer readiness, borrow flag, timers, disagreement pause and grace window</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">getClPriceState()</code></td><td className="px-4 py-2">Concentrated-liquidity detail: clamp, both square-root prices, mean and reference ticks, tolerance and observation cardinality</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">getTokenPrices()</code></td><td className="px-4 py-2">The capped valuation price of each token, used by LPVaultSwap for its recovery floor and per-leg minimum outputs</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">lastAcceptedPrice()</code></td><td className="px-4 py-2">The last accepted price and its source timestamp, used for caps, the minimum pledge value and previews</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">priceCheckpoint()</code></td><td className="px-4 py-2">The hourly checkpoint</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">borrowPriceMaxAge()</code></td><td className="px-4 py-2">Age limit of the served price for borrowing; 0 when the market is failed</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">liquidationPriceMaxAge()</code></td><td className="px-4 py-2">Age limit of the served price for liquidation; 0 when the market is failed</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">poke()</code></td><td className="px-4 py-2">Evaluates and stores; returns the state</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">checkConfig(OracleConfig)</code></td><td className="px-4 py-2">A bitmap of failed listing checks; 0 means every check passes</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">Every view returns the same result for every caller in the same block, and no view reverts except with the gas guard.</p>
          <h3 className="mb-2 type-doc-subsection-title">Events to index</h3>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>LPOracle: <code className="type-doc-inline-code">PriceSeeded</code>, <code className="type-doc-inline-code">PriceAccepted</code>, <code className="type-doc-inline-code">PriceStateChanged</code>, <code className="type-doc-inline-code">RouteChanged</code>, <code className="type-doc-inline-code">FailureRecorded</code>, <code className="type-doc-inline-code">FailureCleared</code>, <code className="type-doc-inline-code">DisagreementRecorded</code>, <code className="type-doc-inline-code">DisagreementCleared</code>, <code className="type-doc-inline-code">OutageExpiredLatched</code>, <code className="type-doc-inline-code">GraceStarted</code>, <code className="type-doc-inline-code">QuoteChangeCapped</code>, <code className="type-doc-inline-code">PriceCheckpointed</code>, <code className="type-doc-inline-code">PriceRouteVersionObserved</code>, <code className="type-doc-inline-code">PokeMinGasUpdated</code></li>
            <li>DebtOracle: <code className="type-doc-inline-code">DebtPriceSeeded</code>, <code className="type-doc-inline-code">DebtPriceAccepted</code>, <code className="type-doc-inline-code">DebtPriceStateChanged</code>, <code className="type-doc-inline-code">DebtRouteChanged</code>, <code className="type-doc-inline-code">DebtFailureRecorded</code>, <code className="type-doc-inline-code">DebtFailureCleared</code>, <code className="type-doc-inline-code">DebtDisagreementRecorded</code>, <code className="type-doc-inline-code">DebtDisagreementCleared</code>, <code className="type-doc-inline-code">DebtOutageExpiredLatched</code>, <code className="type-doc-inline-code">DebtGraceStarted</code>, <code className="type-doc-inline-code">DebtRouteVersionObserved</code></li>
          </ul>
          <h3 className="mb-2 type-doc-subsection-title">Errors</h3>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li><code className="type-doc-inline-code">InsufficientGas(gasLeft, required)</code></li>
            <li><code className="type-doc-inline-code">ConfigCheckFailed(failedChecks)</code></li>
            <li><code className="type-doc-inline-code">NotLive(state, reasons)</code></li>
            <li><code className="type-doc-inline-code">PokeMinGasOutOfBounds(value)</code></li>
            <li><code className="type-doc-inline-code">AdminRoleOnlyTimelock(role, account)</code></li>
            <li><code className="type-doc-inline-code">NotDebtAsset(asset)</code> (DebtOracle only)</li>
          </ul>
        </section>

        <section id="governance" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Changes and Upgrades</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Each LPOracle and DebtOracle is a UUPS proxy. Its admin roles can be held only by the chain&apos;s Avana timelock, and every upgrade waits the normal delay of 5 days and can be cancelled while queued.</li>
            <li>A market&apos;s LPOracle address stays the Aave price source and the vault token&apos;s oracle for the life of the market. A new pricing model or a fix is an upgrade of that proxy, never a new address. If Aave&apos;s price source must change, the Aave payload executes only together with the matching Avana timelock operation, and liquidation keeps running on the LPOracle&apos;s own state meanwhile.</li>
            <li>New price sources and any change to price computation take the normal delay. Tightening a tolerance or lowering a borrow age takes the short delay of 12 hours.</li>
            <li>Only two route changes take effect without a delay: the automatic failover to the alternate, and a guardian&apos;s switch to the standby route recorded at listing.</li>
            <li>No role can push a price or set a timer. The accepted price and every timer change only through initialization and pokes.</li>
            <li>At listing, initialization requires every configuration check to pass and a Live price, which it seeds as the first accepted price.</li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How the LPOracle values vault tokens and how the DebtOracle prices non-GHO debt."
        sectionColor="cyan"
      />
    </div>
  ))
}
