import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'safety', {
    title: "Safety Mechanisms - Risk Framework",
    description: "The risk layers in Avana's design: per-market accounts, collateral factors, caps, oracle states, circuit breakers, pause and freeze, liquidation, Avana Umbrella and governance limits.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "layers", title: "Risk Layers" },
  { id: "accounts", title: "Per-Market Accounts" },
  { id: "collateral-factor", title: "Collateral Factor" },
  { id: "caps", title: "Caps" },
  { id: "oracle-states", title: "Oracle States" },
  { id: "breakers", title: "Breakers, Pause and Freeze" },
  { id: "liquidation", title: "Liquidation Design" },
  { id: "coverage", title: "Avana Umbrella" },
  { id: "governance-limits", title: "Governance Limits" },
  { id: "hub-tiers", title: "Hub Tiers" },
  { id: "monitoring", title: "Monitoring and Reporting" },
  { id: "related", title: "Related Pages" },
]

export default async function RiskFrameworkPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "safety", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Risk Framework"
          description="The layers that limit loss in Avana's Aave V4 markets, from account isolation and caps to liquidation, Avana Umbrella and governance limits."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            Avana lists AMM liquidity positions as collateral on standard, unmodified Aave V4 Spokes owned by the Aave DAO. Every Aave contract stays unmodified; custody, valuation and liquidation sit in Avana&apos;s own contracts. Risk is limited in layers, each with its own owner and parameters, and every market sets its own values at listing.
          </p>
          <div className="doc-topic type-doc-body">
            The Aave DAO owns and configures every Avana Hub and Spoke and can stop Avana&apos;s markets without Avana Labs. Every change to Avana&apos;s own contracts waits in the AvanaTimelock, which Avana Labs cannot bypass. No pause, freeze or breaker stops repayment, debt-free withdrawal, fee collection or eligible liquidation.
          </div>
        </section>

        <section id="layers" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Risk Layers</h2>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Layer</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">What it limits</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Set by</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">Per-market accounts</td>
                  <td className="px-4 py-2">A price move in one market cannot liquidate a position in another</td>
                  <td className="px-4 py-2">Fixed in the design</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Collateral factor with pool risk factor</td>
                  <td className="px-4 py-2">How much of a position&apos;s value can support debt</td>
                  <td className="px-4 py-2">Risk service providers and the Aave DAO at listing</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Caps</td>
                  <td className="px-4 py-2">Exposure per market, per underlying token and per depositor on each Hub, and each credit line</td>
                  <td className="px-4 py-2">Risk service providers and the Aave DAO</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Oracle states</td>
                  <td className="px-4 py-2">New borrowing on prices Avana cannot trust, and seizure at such prices</td>
                  <td className="px-4 py-2">Automatic</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Circuit breakers</td>
                  <td className="px-4 py-2">New activity in one market or one debt reserve</td>
                  <td className="px-4 py-2">Automatic, or a guardian</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Pause, freeze and address freeze</td>
                  <td className="px-4 py-2">New activity on a Hub, every Hub of a chain, or one wallet</td>
                  <td className="px-4 py-2">Guardians at once; the timelock at 12 hours</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Liquidation</td>
                  <td className="px-4 py-2">Debt left on accounts below a health factor of 1</td>
                  <td className="px-4 py-2">Any caller; Avana&apos;s keeper is the committed operator on each chain</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Avana Umbrella (Coverage Spoke)</td>
                  <td className="px-4 py-2">Recorded deficits, up to its funded balance</td>
                  <td className="px-4 py-2">Funded by Avana Labs, controlled by the Aave DAO</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Governance limits</td>
                  <td className="px-4 py-2">How fast and how far anyone can change Avana</td>
                  <td className="px-4 py-2">AvanaTimelock and fixed bounds</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="accounts" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Per-Market Accounts</h2>
          <p className="mb-4 type-doc-body">
            A market is one pool with one exact tick range, listed as one collateral reserve on one CDP Spoke. Each wallet gets one Position Proxy per (CDP Spoke, market): a logic-free, immutable Aave account bound to that wallet, Spoke and market. Each market therefore has its own health factor, and nothing is cross-collateralized across markets.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>An account holds at most 16 positions in one market, so the liquidation of its last part always fits in one transaction.</li>
            <li>Each pledged position must match a listed market&apos;s exact pool and range, with a minimum value of $10. Aerodrome Slipstream positions must be unstaked.</li>
            <li>There is no borrower allowlist and no minimum debt.</li>
            <li>Borrowers in the same market still share exposure to its oracle, contracts and pool liquidity.</li>
          </ul>
        </section>

        <section id="collateral-factor" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Collateral Factor</h2>
          <p className="mb-4 type-doc-body">
            Valuation and borrowing limits are separate. The LPOracle values the vault token at its fair composition at Chainlink prices, with no haircut. The reserve&apos;s collateral factor then sets how much of that value can support debt. It starts from the lowest Aave V4 Core Hub collateral factor among the pool&apos;s tokens and applies the pool risk factor once, rounding down:
          </p>
          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"LP Collateral Factor = min(CF₁, …, CFₙ) × Pool Risk Factor"}</code>
          </div>
          <p className="mb-4 type-doc-body">
            The pool risk factor is at most 40% and reflects the position&apos;s range, price sensitivity, pool depth and expected liquidation costs. A GHO leg uses an explicit factor set at listing. The Aave DAO sets the reserve&apos;s factor at or below this value and never at 0 while accounts hold the reserve; Avana&apos;s drift check stops new borrowing if Aave&apos;s factor is set higher. Gauntlet&apos;s analysis of LP collateral recommends conservative starting factors, and final factors are calibrated per market with service providers.
          </p>
          <p className="mb-2 type-doc-body">Example values; each market&apos;s parameters are set at listing. GHO, USDC and USDT are assumed to hold at $1.</p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Item</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">USDC/USDT position value (exact range)</td>
                  <td className="px-4 py-2">$100,000</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Lower token collateral factor × pool risk factor</td>
                  <td className="px-4 py-2">75.00% × 37.50% = 28.12% (rounded down)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Collateral-based borrowing capacity</td>
                  <td className="px-4 py-2">28,120 GHO</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Recommended borrow shown by the Lens, at health factor 1.10</td>
                  <td className="px-4 py-2">About 25,560 GHO</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Actual borrowing and initial health factor</td>
                  <td className="px-4 py-2">20,000 GHO at 1.41</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Collateral value at health factor 1.00, debt unchanged</td>
                  <td className="px-4 py-2">About $71,120</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            Aave&apos;s rule is the only on-chain borrowing limit: an account may borrow up to a health factor of 1.00. The Lens shows a recommended borrow at 1.10 beside that maximum, because a loan opened at full capacity has no buffer. An optional per-market hard health floor exists, off at launch, and is set only if stress tests justify it.
          </p>
        </section>

        <section id="caps" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Caps</h2>
          <p className="mb-4 type-doc-body">
            The risk service providers set every cap in each market&apos;s listing package, with its cap-sizing calculation. Caps are charged at the USD value at pledge, booked at no less than a stress floor of $1.00 per whole vault token.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Cap</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Scope</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">marketUsdCap</code></td>
                  <td className="px-4 py-2">Per market</td>
                  <td className="px-4 py-2">Regular pledge budget of the market</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">tokenUsdCap</code></td>
                  <td className="px-4 py-2">Per underlying token, per Hub</td>
                  <td className="px-4 py-2">Exposure to one token across every CDP Spoke and market of the Hub; each pledge charges its full value to both tokens&apos; counters</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">depositorUsdCap</code></td>
                  <td className="px-4 py-2">Per depositor, per Hub</td>
                  <td className="px-4 py-2">Exposure of one depositor across every CDP Spoke and market of the Hub</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">topUpSliceUsd</code></td>
                  <td className="px-4 py-2">Per market</td>
                  <td className="px-4 py-2">A reserved budget, 10% of the market cap by default, used only for rescue top-ups that bring an indebted account back to a health factor of 1.10; exempt from the token and depositor caps</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">poolShareMaxBps</code></td>
                  <td className="px-4 py-2">Per pool, per chain</td>
                  <td className="px-4 py-2">Off by default. Where a pool&apos;s listing sets one, Avana&apos;s combined share of the pool above it blocks new borrowing and pledges that increase pool exposure. A share above 25% raises an alert</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Credit line and draw caps</td>
                  <td className="px-4 py-2">Per (Hub, debt asset) and per CDP Spoke</td>
                  <td className="px-4 py-2">Set by the Aave DAO; each draw cap stays within the chain&apos;s flash liquidity, swap-route depth and the Avana Umbrella coverage rule</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            Concentration is covered by the token and market caps and listing review rather than a default pool-share limit: removing liquidity has no price impact, and liquidation proceeds can be sold through any approved route. Caps are sized so that each Avana Umbrella covers two modelled losses: the 48-hour incident term, which includes each pool&apos;s worst historic LP drop and a debt-asset price rise, and the tail term for one pool token going to zero. Tightening a cap takes 12 hours; raising one takes 5 days and at most +50% per step.
          </p>
        </section>

        <section id="oracle-states" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Oracle States</h2>
          <p className="mb-4 type-doc-body">
            Each token has a Chainlink primary route, an alternate route with automatic failover and a standby route approved at listing. A feed counts as fresh for its own heartbeat plus 1,800 seconds, and stablecoins are never valued above $1. A 30-minute pool TWAP is a consistency check, not a price source, and borrowing also needs each token&apos;s price to agree with an independent second source.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Condition</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Market response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">Live, second source agrees</td>
                  <td className="px-4 py-2">Normal operation</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Live, second source disagrees or is unavailable</td>
                  <td className="px-4 py-2">Borrowing and withdrawals that leave debt are blocked. Pledges, repayment and liquidation continue.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Drifting: TWAP consistency check fails</td>
                  <td className="px-4 py-2">New pledges, borrowing and withdrawals that leave debt are blocked. Aave values the collateral at the lower of the fresh and last accepted price. Liquidation continues while the Chainlink inputs are fresh.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Drifting: primary and alternate routes disagree</td>
                  <td className="px-4 py-2">Borrowing is blocked and the collateral is valued at the lower route. Liquidation of the market waits until the routes agree, a guardian switches the faulty route to its standby, or a timelock fix executes.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Cached: both routes of a token stale or invalid, for up to 1 hour</td>
                  <td className="px-4 py-2">Pledges, top-ups and borrowing are blocked. Aave values the collateral at the last accepted price. Liquidation of the market waits for a fresh price or a standby switch.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Expired: after 1 hour of Cached</td>
                  <td className="px-4 py-2">The collateral counts as worthless in Aave&apos;s health factor. Liquidation of the market waits for a fresh price or a standby switch, so collateral is never seized at a price Avana cannot trust.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">First 30 minutes after recovery from Expired</td>
                  <td className="px-4 py-2">Only accounts below a health factor of 0.95 can be liquidated.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Base sequencer down, or within 1 hour of its restart</td>
                  <td className="px-4 py-2">Borrowing is blocked. Liquidation pauses while the sequencer is down; for 1 hour after restart only accounts below 0.95 can be liquidated.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            In every row, repayment, fee collection and debt-free withdrawal stay open. A stablecoin outside the $0.90–$1.02 band also blocks new borrowing and withdrawals that leave debt. A non-GHO debt asset follows the same states through its DebtOracle, except that once Expired it serves a raised stress price, so debt is never undervalued.
          </p>
        </section>

        <section id="breakers" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Breakers, Pause and Freeze</h2>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Temporary gates (ORACLE, POOL_SHARE, POOL_DEPTH) stop new activity in a market while their condition holds and reopen after 30 minutes of healthy observations.</li>
            <li>Latched freezes (DEFICIT, ISSUER, CONFIG_DRIFT, MANUAL) stay tripped until a pause guardian or the timelock resets them. The deficit freeze trips when a CDP Spoke&apos;s outstanding GHO deficit exceeds 10,000 GHO.</li>
            <li>Each Hub has a pause state: None, Frozen, Paused(General) or Paused(MintPathSuspect). Guardians can also freeze or pause every Hub of a chain at once.</li>
            <li>A guardian can freeze up to 20 wallets per rolling 24 hours; a frozen wallet loses new activity, never its exits.</li>
            <li>Price drops, seizure surges, swap-route failures and pool concentration above 25% are alerts, not on-chain trips.</li>
          </ul>
          <p className="type-doc-body">
            What each state blocks, the playbooks and worked examples are described on this page:{" "}
            <Link href="/developers/safety/emergency-controls" className="text-type-accent hover:underline">Emergency Controls</Link>.
          </p>
        </section>

        <section id="liquidation" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Liquidation Design</h2>
          <p className="mb-4 type-doc-body">
            An account becomes liquidatable when its health factor falls below 1. Every liquidation runs through LPVaultSwap in one atomic transaction, through its single entry point <code className="type-doc-inline-code">liquidate</code>, and is always partial:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>The caller funds the debt asset and LPVaultSwap takes no flash loan. A caller without the debt asset uses Avana&apos;s public flash liquidation helper, an immutable periphery contract that flash-borrows it from the Aave V3 Pool, calls LPVaultSwap and repays the loan from the caller&apos;s payout.</li>
            <li>It calls the CDP Spoke&apos;s standard liquidation, which sizes the repayment toward the Spoke&apos;s target health factor (Avana recommends 1.10) with Aave&apos;s dynamic bonus, and receives the seized vault tokens.</li>
            <li>The seized tokens are burned and exactly that share of the position is unwound; the borrower keeps the rest of the position and all of its fees.</li>
            <li>Each unwound token is swapped into the debt asset over the market&apos;s primary or backup route, with oracle-derived minimum outputs, and the proceeds must reach a recovery floor. The caller may top up a small shortfall from its own funds; otherwise the transaction reverts and nothing changes.</li>
            <li>Avana&apos;s fee is 20% of the oracle gain, capped by the realized gain. Any recovery above the seized collateral&apos;s oracle value goes to the borrower, and everything else goes to the caller, paid directly or the transaction reverts. An Avana fee or borrower payout a token refuses goes to the payout escrow (PayoutEscrow).</li>
          </ul>
          <p className="mb-4 type-doc-body">
            Any address can call <code className="type-doc-inline-code">liquidate</code>, with every check applied to every call. At launch Avana&apos;s keeper is the committed operator on each chain: Avana pays its gas, and it liquidates every account below 1 whatever its size. Registration as a committed operator gates no call. A direct liquidation from any other contract fails, because the vault token accepts seized collateral only to LPVaultSwap and every Avana reserve has three required settings: shares not received, no Aave liquidation fee and no reinvestment controller.
          </p>
          <p className="type-doc-body">
            No Avana pause, breaker, configuration drift or address freeze stops liquidation. It waits only for a fresh price of the seized market and the repaid debt, the Base sequencer check, and Aave-side halts or reserve pauses. The full flow and examples are on this page:{" "}
            <Link href="/developers/liquidation" className="text-type-accent hover:underline">Liquidation Framework</Link>.
          </p>
        </section>

        <section id="coverage" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Avana Umbrella</h2>
          <p className="mb-4 type-doc-body">
            When a liquidation empties an account&apos;s collateral while debt remains, Aave records a deficit on the funding Hub in that debt asset. Each (Hub, debt asset) has its own Avana Umbrella, a Coverage Spoke funded by Avana Labs and controlled by the Aave DAO, which eliminates a recorded deficit within 72 hours. At launch there are two, GHO on each chain&apos;s Stable LP Hub. A loss larger than the reserve falls on that Hub asset&apos;s suppliers, pro rata, after the Aave DAO realizes it.
          </p>
          <p className="type-doc-body">
            The coverage rule, the deficit breaker and worked examples are on this page:{" "}
            <Link href="/developers/safety/insurance" className="text-type-accent hover:underline">Avana Umbrella</Link>.
          </p>
        </section>

        <section id="governance-limits" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Governance Limits</h2>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Each chain has its own AvanaTimelock, 4-of-7 governance Safe and 3-of-5 Emergency Guardian; nothing on one chain acts on the other.</li>
            <li>Every upgrade, parameter change, market listing and role change waits 5 days, never less than 4. Calls that only reduce risk or stop new activity wait 12 hours. Anyone can execute a ready operation within 14 days.</li>
            <li>The governance Safe and the Aave governance executor propose. The governance Safe, both guardians and the Aave governance executor can cancel; only the Aave governance executor can cancel a role change or a restoring operation.</li>
            <li>Loosening is limited: a USD cap rises at most 50% and the slippage allowance at most 25 bps per step, once per normal delay.</li>
            <li>Guardians cannot upgrade, change parameters, choose a new price source, unfreeze an address or move funds.</li>
            <li>Avana Labs proposes markets and parameter changes for assessment by a designated risk reviewer, and new markets are listed at the normal delay, a 5-day public review enforced on-chain.</li>
          </ul>
          <p className="type-doc-body">
            The full role table and delay classes are on this page:{" "}
            <Link href="/developers/safety/governance" className="text-type-accent hover:underline">Governance and Timelock</Link>.
          </p>
        </section>

        <section id="hub-tiers" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Hub Tiers</h2>
          <p className="mb-4 type-doc-body">
            Stable, correlated and volatile LPs carry different risks, so liquidity is organized into three Hub tiers. Each Hub connects to its own CDP Spokes, one per (chain, Hub, AMM protocol, risk tier), and each credit line is a draw cap per (Hub, asset, Spoke).
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Hub</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Pools</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">Avana Stable LP Hub (low risk)</td>
                  <td className="px-4 py-2">Established stablecoin pools built for tight pricing, low slippage and minimal impermanent loss, such as USDC/USDT and pools containing GHO</td>
                  <td className="px-4 py-2">At launch, on Ethereum (Uniswap v3 Stable CDP Spoke) and Base (Aerodrome Slipstream Stable CDP Spoke)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Correlated LP Hub</td>
                  <td className="px-4 py-2">Blue-chip pools of assets that move together, with tighter risk bands</td>
                  <td className="px-4 py-2">Added later on any chain</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Volatile LP Hub (high risk)</td>
                  <td className="px-4 py-2">Major DeFi assets and emerging markets with wider price ranges under stricter exposure limits</td>
                  <td className="px-4 py-2">Added later on any chain</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            Pause states, caps on tokens and depositors, and each Avana Umbrella are keyed by Hub, so an incident in one Hub&apos;s pools can be stopped without stopping another Hub.
          </p>
        </section>

        <section id="monitoring" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Monitoring and Reporting</h2>
          <p className="mb-4 type-doc-body">Avana&apos;s monitoring pages on-call for these conditions, among others:</p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>A market price drop of 3% in 2 hours</li>
            <li>More than 20% of a market&apos;s collateral seized in 1 hour</li>
            <li>3 swap-route failures in 1 hour for one market or debt asset</li>
            <li>Avana&apos;s combined share of a pool above 25%</li>
            <li>Every new deficit, and any deficit still uncovered after 24 hours</li>
            <li>An Avana Umbrella below 150% of its minimum (warning) or below its minimum (page)</li>
            <li>Every operation scheduled, cancelled or executed on the AvanaTimelock, and every role or Safe owner change</li>
            <li>Fewer than two proposers, a guardian role with no holder, or active committed operators below the keeper floor</li>
            <li>A price state of Cached or Expired, a route disagreement, or a stale debt feed</li>
          </ul>
          <p className="mb-4 type-doc-body">
            For each market, the Lens reports vault-token supply alongside the liquidity held in the LPVault, so anyone can check on-chain that every vault token is backed one for one. Avana Labs publishes weekly usage reports and monthly revenue reports covering:
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Figures per chain</li>
            <li>Debt and collateral by market</li>
            <li>Concentration levels</li>
            <li>The distribution of health factors</li>
            <li>Successful, failed and retried liquidations</li>
            <li>Avana Umbrella usage</li>
            <li>Bad debt</li>
            <li>Oracle incidents</li>
            <li>Pauses, freezes, circuit-breaker trips and monitoring alerts</li>
            <li>Credit-line usage</li>
            <li>Fees earned</li>
          </ul>
        </section>

        <section id="related" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Related Pages</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li><Link href="/developers/safety/governance" className="text-type-accent hover:underline">Governance and Timelock</Link>: who can change Avana, how long each change waits and who can cancel it.</li>
            <li><Link href="/developers/safety/emergency-controls" className="text-type-accent hover:underline">Emergency Controls</Link>: pause states, address freeze, breakers, alerts and playbooks.</li>
            <li><Link href="/developers/safety/insurance" className="text-type-accent hover:underline">Avana Umbrella</Link>: the First-Loss Reserve and how deficits are covered.</li>
            <li><Link href="/developers/safety/contracts" className="text-type-accent hover:underline">Contract Security</Link>: upgradeable and immutable contracts, trust boundaries and blast radius.</li>
            <li><Link href="/developers/safety/bug-bounty" className="text-type-accent hover:underline">Bug Bounty</Link>: responsible disclosure scope and severity levels.</li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Risk layers for Avana on Aave V4: accounts, collateral factors, caps, oracle states, breakers, liquidation, Avana Umbrella and governance."
        sectionColor="rose"
      />
    </div>
  ))
}
