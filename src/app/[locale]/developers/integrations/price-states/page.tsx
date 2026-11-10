import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'integrations/price-states', {
    title: "Price States",
    description: "The four LPOracle price states (Live, Drifting, Cached, Expired), what each one serves and allows, the recovery grace window, the Base sequencer gate, the standby route switch and the oracle playbook.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "live", title: "Live" },
  { id: "drifting", title: "Drifting" },
  { id: "cached", title: "Cached" },
  { id: "expired", title: "Expired" },
  { id: "served-price", title: "Served Price by State" },
  { id: "state-effects", title: "What Each State Allows" },
  { id: "disagreement", title: "Disagreement Pause" },
  { id: "grace", title: "Recovery Grace" },
  { id: "sequencer", title: "Sequencer Down and Grace" },
  { id: "standby", title: "Standby Route Switch" },
  { id: "debt-prices", title: "Debt Price States" },
  { id: "playbook", title: "Playbook P-02" },
  { id: "example", title: "Example: Oracle Expiry" },
]

export default async function PriceStatesPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "integrations/price-states", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Price States"
          description="Each market's LPOracle reports one of four states on every read. The state decides what the market's account can do and whether the market can be seized; repay and debt-free exits work in every state."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            The LPOracle reports exactly one state, in increasing severity: Live, Drifting, Cached, Expired. The state is computed on every read from current feed and pool data plus a few stored timers, with no hysteresis. The borrow flag, the second-source result and the sequencer status are reported beside the state and never change it.
          </p>
          <p className="mb-4 type-doc-body">
            The LPOracle only reports. The RiskModule enforces the borrow-side and pledge gates, and LPVaultSwap enforces the liquidation gates. Each wallet has one PositionProxy and one Aave account per market, so a market&apos;s state decides whether that account can borrow and whether that market can be seized; other markets of the same wallet are unaffected.
          </p>
          <div className="doc-topic type-doc-body">
            A price that cannot be trusted only makes an account easier to liquidate, never harder: collateral is served at most at its last accepted price and debt at least at its last accepted price. The market whose price is in doubt is never seized at that price.
          </div>
          <p className="mt-4 type-doc-body">
            The valuation, routes and checks behind each state are described on the price oracles page:{" "}
            <Link href="/developers/integrations/price-oracles" className="text-type-accent hover:underline">Price Oracles</Link>.
          </p>
        </section>

        <section id="live" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Live</h2>
          <p className="mb-4 type-doc-body">
            Every token has a fresh, valid primary or alternate Chainlink route and no Drifting condition holds. A market whose tokens use their alternate routes is still Live; the alternate is reported as an informational reason. The served price is the fresh price.
          </p>
          <p className="type-doc-body">
            Live alone is not enough to borrow. A borrow also needs the second source of every token to agree, the sequencer to be ready on Base and the served price to be within its borrow age. When a second source disagrees or cannot be read, the market stays Live and pledges and liquidation continue, but borrowing and withdrawals with debt stop.
          </p>
        </section>

        <section id="drifting" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Drifting</h2>
          <p className="mb-4 type-doc-body">
            The market is not failed, but one of these conditions holds:
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Reason</th><th className="text-left px-4 py-2 type-doc-subsection-title">Cause</th><th className="text-left px-4 py-2 type-doc-subsection-title">Notes</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">ANY_TOKEN_DISAGREE</code></td><td className="px-4 py-2">A token&apos;s primary and alternate routes are both fresh and differ by more than the agreement tolerance</td><td className="px-4 py-2">Starts the disagreement pause; this market&apos;s seizure waits</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">USD_BAND</code></td><td className="px-4 py-2">A stable market&apos;s USD level is outside 0.90 to 1.02</td><td className="px-4 py-2">Never blocks pledges and never pauses liquidation</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">CONSISTENCY_DEVIATION</code></td><td className="px-4 py-2">The pool TWAP is further than the tolerance from the Chainlink-implied price</td><td className="px-4 py-2">Blocks new pledges</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">CONSISTENCY_UNAVAILABLE</code></td><td className="px-4 py-2">The pool&apos;s observation read fails or cannot cover the window</td><td className="px-4 py-2">Blocks new pledges</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">PRICE_CLAMPED</code></td><td className="px-4 py-2">The oracle price ratio lies outside the market&apos;s tick range</td><td className="px-4 py-2">Blocks new pledges; the position is valued as its one-token holding</td></tr>
              </tbody>
            </table>
          </div>
          <p className="type-doc-body">
            While Drifting, the market serves the lower of the fresh price and the last accepted price; during a disagreement it serves the price built from each token&apos;s lower route, at most the accepted price. Borrowing and withdrawals with debt are blocked; top-ups, repay, fee collection and debt-free withdrawals stay open.
          </p>
        </section>

        <section id="cached" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Cached</h2>
          <p className="mb-4 type-doc-body">
            The market is failed: some token has no valid route, or a configuration, route, feed, pricing-module or token-decimals read failed, or the pool&apos;s reentrancy lock is held. For <code className="type-doc-inline-code">cachedWindow</code> (1 hour at launch) after the first failed read, the market serves its last accepted price with its original source timestamp. Reading the same rounds again never refreshes that timestamp.
          </p>
          <p className="mb-4 type-doc-body">
            The window starts when reads actually began to fail, not at the last round and not at the first poke after the failure. For a feed that went stale, the start is computed from the feed&apos;s own timestamps: the first second after the age limit of the last of its routes to go stale.
          </p>
          <p className="type-doc-body">
            Borrowing, withdrawals with debt, new pledges and top-ups stop. The market cannot be seized. The account&apos;s other reserves stay liquidatable, with this market at its last accepted price. A cap of 1 hour on Cached keeps one late round from turning into mass liquidation while still bounding how long a stale price is used.
          </p>
        </section>

        <section id="expired" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Expired</h2>
          <p className="mb-4 type-doc-body">
            After <code className="type-doc-inline-code">cachedWindow</code> of Cached the market is Expired. It serves 1: one unit of 10⁻⁸ USD per whole vault token, the smallest positive price, so Aave counts the collateral as worth about zero. The value never reverts and is never 0, so Aave keeps valuing positions and repay and debt-free withdrawals keep working.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Avana never seizes an Expired market, so the value 1 only lowers the account&apos;s health factor and never sizes a seizure.</li>
            <li>Avana&apos;s own valuations keep using the last accepted price: caps, the minimum pledge value, the restore amount of a rescue top-up and Lens previews.</li>
            <li>A non-GHO debt asset whose DebtOracle is Expired is served at its last accepted price raised by <code className="type-doc-inline-code">debtStressRiseBps</code>, so stale debt counts higher, never lower.</li>
            <li>The Expired latch is set only from Chainlink source timestamps, never from a caught error, a failed configuration read or a gas shortfall.</li>
          </ul>
        </section>

        <section id="served-price" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Served Price by State</h2>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">State</th><th className="text-left px-4 py-2 type-doc-subsection-title">Collateral price served to Aave</th><th className="text-left px-4 py-2 type-doc-subsection-title">Non-GHO debt price served to Aave</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Live</td><td className="px-4 py-2">Fresh price</td><td className="px-4 py-2">Fresh quote</td></tr>
                <tr><td className="px-4 py-2">Drifting, no disagreement</td><td className="px-4 py-2">Lower of fresh and accepted</td><td className="px-4 py-2">Not applicable: a DebtOracle drifts only on disagreement</td></tr>
                <tr><td className="px-4 py-2">Drifting, routes disagree</td><td className="px-4 py-2">Price at each token&apos;s lower route, at most accepted</td><td className="px-4 py-2">Higher of the two routes and accepted</td></tr>
                <tr><td className="px-4 py-2">Cached</td><td className="px-4 py-2">Accepted price</td><td className="px-4 py-2">Accepted price</td></tr>
                <tr><td className="px-4 py-2">Expired</td><td className="px-4 py-2">1 (10⁻⁸ USD)</td><td className="px-4 py-2">Accepted price × (1 + stress rise)</td></tr>
              </tbody>
            </table>
          </div>
          <div className="doc-topic type-doc-body">
            Example (full-range USDC/USDT, accepted price $1.99980000): USDT reads $1.00 on its primary and $0.975 on its alternate, which disagree. The lower-route price is $1.97483855, so the market serves that. If the market were Cached it would serve $1.99980000; once Expired, 1. Drifting on a TWAP deviation with a fresh price of $1.99999600 serves $1.99980000.
          </div>
        </section>

        <section id="state-effects" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">What Each State Allows</h2>
          <p className="mb-4 type-doc-body">
            Repay, fee collection, debt-free withdrawal, debt-free partial removal and zero-credit release are open in every state, because none of them reads or pokes an oracle. Liquidation is gated per reserve: only the seized collateral market and the repaid debt reserve need fresh, agreeing prices. The table shows the account holding the market in each state.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr>
                <th className="text-left px-4 py-2 type-doc-subsection-title">State</th>
                <th className="text-left px-4 py-2 type-doc-subsection-title">New pledge</th>
                <th className="text-left px-4 py-2 type-doc-subsection-title">Top-up</th>
                <th className="text-left px-4 py-2 type-doc-subsection-title">Borrow</th>
                <th className="text-left px-4 py-2 type-doc-subsection-title">Withdraw with debt</th>
                <th className="text-left px-4 py-2 type-doc-subsection-title">Repay, fees, debt-free exit</th>
                <th className="text-left px-4 py-2 type-doc-subsection-title">Seizure of this market</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Live, borrow flag true</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">Yes, while every input is within its liquidation age</td></tr>
                <tr><td className="px-4 py-2">Live, second source disagrees or unavailable</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">No</td><td className="px-4 py-2">No</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">Yes</td></tr>
                <tr><td className="px-4 py-2">Live on an alternate route past its borrow age</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">No</td><td className="px-4 py-2">No</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">No, treated as Cached</td></tr>
                <tr><td className="px-4 py-2">Drifting, USD band only</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">No</td><td className="px-4 py-2">No</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">Yes, while both routes of each token are fresh and agree</td></tr>
                <tr><td className="px-4 py-2">Drifting, TWAP deviation or unavailable, price clamped</td><td className="px-4 py-2">No</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">No</td><td className="px-4 py-2">No</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">Yes, if the Chainlink inputs are fresh</td></tr>
                <tr><td className="px-4 py-2">Drifting, routes disagree</td><td className="px-4 py-2">No</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">No</td><td className="px-4 py-2">No</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">No, until the routes agree or a standby switch ends the disagreement</td></tr>
                <tr><td className="px-4 py-2">Cached</td><td className="px-4 py-2">No</td><td className="px-4 py-2">No</td><td className="px-4 py-2">No</td><td className="px-4 py-2">No</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">No</td></tr>
                <tr><td className="px-4 py-2">Expired</td><td className="px-4 py-2">No</td><td className="px-4 py-2">No</td><td className="px-4 py-2">No</td><td className="px-4 py-2">No</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">No</td></tr>
                <tr><td className="px-4 py-2">Recovery grace (any state)</td><td className="px-4 py-2">As the state</td><td className="px-4 py-2">As the state</td><td className="px-4 py-2">As the state</td><td className="px-4 py-2">As the state</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">Only accounts below health factor 0.95</td></tr>
                <tr><td className="px-4 py-2">Sequencer down (Base)</td><td className="px-4 py-2">No for a new account</td><td className="px-4 py-2">Yes, if the market&apos;s price is still fresh</td><td className="px-4 py-2">No</td><td className="px-4 py-2">No</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">No</td></tr>
                <tr><td className="px-4 py-2">Sequencer grace (Base)</td><td className="px-4 py-2">No for a new account</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">No</td><td className="px-4 py-2">No</td><td className="px-4 py-2">Yes</td><td className="px-4 py-2">Only accounts below health factor 0.95</td></tr>
              </tbody>
            </table>
          </div>
          <p className="type-doc-body">
            While a market cannot be seized, the account&apos;s other reserves with fresh prices stay liquidatable, with the blocked market counted at its served price. Withdraw with debt includes partial removal with debt and repay with collateral. The full matrix, with pause states, breakers and Aave-side flags, is on the safety pages.
          </p>
        </section>

        <section id="disagreement" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Disagreement Pause</h2>
          <p className="mb-4 type-doc-body">
            The first poke that sees a token&apos;s two fresh routes disagree stores that time and emits <code className="type-doc-inline-code">DisagreementRecorded</code>. From then, seizure of this market is paused for up to <code className="type-doc-inline-code">disagreementPauseMax</code> (3,600 seconds at launch, never more). A short disagreement is usually one route lagging a fast move.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>If the routes still disagree after the pause, one route is wrong. The market is treated as Expired for its own seizure until a poke sees every token agree, a guardian switches the faulty slot to its standby route, or a fix executes through the timelock.</li>
            <li>Meanwhile the market counts at its lower routes, so the disagreement can only make the account look less healthy, and repay and top-ups stay open.</li>
            <li>A route change restarts the disagreement window but never clears a disagreement by itself.</li>
            <li>No grace window follows a disagreement, because top-ups and repay stayed open throughout.</li>
          </ul>
        </section>

        <section id="grace" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Recovery Grace</h2>
          <p className="mb-4 type-doc-body">
            After an outage that reached Expired, the first fresh, valid update stores the recovery time and emits <code className="type-doc-inline-code">GraceStarted</code>. For <code className="type-doc-inline-code">graceDuration</code> (30 minutes at launch, at most 2 hours) LPVaultSwap liquidates an account of this market only if its health factor is below <code className="type-doc-inline-code">graceHealthFactor</code> (0.95 at launch, never below 0.90). After the window, every account below 1.00 is liquidatable again. Borrowers get time to repay or add collateral at the recovered price before ordinary liquidations resume.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Each outage starts at most one grace window.</li>
            <li>The recovery time is reconstructed from Chainlink&apos;s own round timestamps, so an outage that began and ended between two pokes still opens a grace window, and no caller can fake one.</li>
            <li>When the recovering round is the first of a new Chainlink aggregator phase, the previous round is read from the previous phase&apos;s aggregator.</li>
            <li>The window never starts before the recovery: without usable round evidence it starts at the newest input of the fresh price, and after a standby switch at the poke that observes the switch.</li>
          </ul>
        </section>

        <section id="sequencer" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Sequencer Down and Grace</h2>
          <p className="mb-4 type-doc-body">
            On Base, the sequencer-uptime feed adds two conditions that apply on top of every price state. Ethereum has no sequencer gate.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Down: only transactions forced in from L1 execute, on prices that may be hours old. Borrowing, withdrawals with debt, repay with collateral, new-account pledges and liquidation stop. Repay, top-ups with a fresh price, debt-free withdrawal and fee collection keep working, including through L1.</li>
            <li>Grace: for 3,600 seconds after the sequencer restarts, borrowing stays closed and only accounts below health factor 0.95 can be liquidated.</li>
            <li>An unreadable uptime feed blocks borrowing only. It never stops liquidation.</li>
          </ul>
          <div className="doc-topic type-doc-body">
            Example: the sequencer goes down at 09:40; a borrow forced in from L1 reverts, a repay forced in from L1 runs. It restarts at 10:00:00 and the gate is in grace until 11:00:00. At 10:20 an account at health factor 0.9997 cannot be liquidated; after 11:00:00 it can, and borrowing reopens.
          </div>
        </section>

        <section id="standby" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Standby Route Switch</h2>
          <p className="mb-4 type-doc-body">
            Each listed token records a standby route that passed, at listing, every check of the slot it can replace. When a feed fails or two routes disagree, the market&apos;s seizures wait for a usable price; a normal-delay fix would take at least five days, longer than the 48-hour window caps are sized for. The standby lets a guardian end the outage in minutes without choosing an unreviewed price.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Call</th><th className="text-left px-4 py-2 type-doc-subsection-title">Who</th><th className="text-left px-4 py-2 type-doc-subsection-title">Effect</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">useStandbyRoute(token, slot)</code></td><td className="px-4 py-2">Emergency Guardian or Aave Protocol Guardian at once; or the timelock at the short delay, cancellable only by the Aave governance executor</td><td className="px-4 py-2">Puts the standby in the primary or alternate slot and increments the token&apos;s route version</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">cancelStandbySwitch(token)</code></td><td className="px-4 py-2">Aave governance executor, at once</td><td className="px-4 py-2">Undoes a guardian&apos;s switch</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">restorePriceRoute(token)</code></td><td className="px-4 py-2">Timelock, normal delay</td><td className="px-4 py-2">Restores the listed routes once the original route is healthy</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">useStandbySecondSource(token)</code></td><td className="px-4 py-2">Either guardian, at once; switching back goes through the timelock</td><td className="px-4 py-2">Replaces a failing second source with its standby</td></tr>
              </tbody>
            </table>
          </div>
          <p className="type-doc-body">
            A switch writes no oracle state. Every oracle reading the token picks up the new route on its next evaluation, restarts its disagreement timer and keeps its failure timer. A switch never forces Live: the standby is subject to the same freshness, validity and agreement checks, and a stale or disagreeing standby leaves the market where it was.
          </p>
        </section>

        <section id="debt-prices" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Debt Price States</h2>
          <p className="mb-4 type-doc-body">
            GHO&apos;s fixed $1 source never fails. Each non-GHO debt asset&apos;s DebtOracle has the same four states, timers, grace window and standby route as a market.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>A failing debt price blocks borrowing that asset and borrowing or withdrawing with debt on every account that holds it.</li>
            <li>LPVaultSwap repays that debt reserve only while its DebtOracle is Live and within its liquidation age; the account&apos;s other debt reserves can still be repaid against fresh collateral.</li>
            <li>During a debt-oracle grace window, LPVaultSwap applies the grace health factor to every account with debt in that asset.</li>
          </ul>
        </section>

        <section id="playbook" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Playbook P-02</h2>
          <p className="mb-4 type-doc-body">
            P-02 covers oracle failure, staleness, disagreement and manipulation. Monitoring pages on-call when a market is Cached or Expired, when a disagreement starts (and again 30 minutes before the pause ends), and on leg and debt-feed ages.
          </p>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>Identify the failing leg and route from the oracle&apos;s price state.</li>
            <li>If the token&apos;s standby route is fresh and agrees with the healthy route, a guardian switches the failing slot to it.</li>
            <li>If the standby also fails, a guardian trips the market breaker. The market&apos;s own seizures wait while keepers keep liquidating fresh reserves.</li>
            <li>For a failing debt feed, the same steps apply to the DebtOracle, with the debt breaker if the standby fails.</li>
            <li>If only a second source fails or disagrees, so borrowing stops while the price stays Live, a guardian switches to the standby second source once it agrees with the served price.</li>
            <li>The governance multisig prepares a permanent source as a normal-delay price-source operation.</li>
          </ol>
          <p className="mb-4 type-doc-body">
            Recovery: keepers poke until the market is Live, the grace window applies per account, the listed route is restored at the normal delay once healthy, and a manual breaker is reset once the market has been Live for one cached window.
          </p>
          <div className="doc-topic type-doc-body">
            A 24-hour stablecoin feed that has not updated for 20 hours is normal, not an incident: it stays fresh for 88,200 seconds, and borrowing also needs the second source to agree.
          </div>
        </section>

        <section id="example" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Example: Oracle Expiry</h2>
          <p className="mb-4 type-doc-body">
            Example values; each market&apos;s parameters are set at listing. USDT/USD has an 86,400-second heartbeat and stays fresh for 88,200 seconds. The cached window is 1 hour, the grace duration 30 minutes and the grace health factor 0.95. One whole vault token is worth $2.00.
          </p>
          <ol className="list-decimal space-y-2 ps-5 type-doc-body">
            <li>Both USDT routes stop publishing. 88,200 seconds after the last round, a poke finds the leg stale. The market is Cached and serves the cached $2.00; the oracle emits <code className="type-doc-inline-code">FailureRecorded</code>.</li>
            <li>The RiskModule refuses borrows and withdrawals with debt with <code className="type-doc-inline-code">PriceNotLive</code>. LPVaultSwap refuses to seize the market with <code className="type-doc-inline-code">StalePrice</code>. Repay and debt-free withdrawal continue.</li>
            <li>After 1 hour of Cached the market is Expired and serves 1, so Aave counts the collateral as worthless while repay and exits keep working; the oracle emits <code className="type-doc-inline-code">OutageExpiredLatched</code>. Operators follow P-02 and may switch to the standby route.</li>
            <li>The feed publishes again and the next poke accepts it, emitting <code className="type-doc-inline-code">GraceStarted</code> with an end time 1,800 seconds after the recovery.</li>
            <li>For 30 minutes LPVaultSwap seizes only accounts below health factor 0.95; an account at 0.97 is refused with <code className="type-doc-inline-code">GraceHealthFactor</code>. After that, every account below 1.00 can be liquidated. The Lens price-state view shows the state and grace end throughout.</li>
            <li>A debt asset behaves the same way through its DebtOracle, except that once Expired it serves the accepted price raised by the stress rise, so debt is never undervalued.</li>
          </ol>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="The four price states, what each allows, grace, sequencer gate, standby switch and playbook P-02."
        sectionColor="cyan"
      />
    </div>
  ))
}
