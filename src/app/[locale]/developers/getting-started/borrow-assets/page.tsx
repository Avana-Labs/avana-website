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
    title: "Borrow Assets",
    description: "How to borrow GHO, or USDC, USDT or WETH where a CDP Spoke enables them, against pledged LP collateral on Avana: the borrow call, every check, recommended and maximum amounts, failures and a worked example.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "debt-assets", title: "Debt Assets" },
  { id: "borrow-call", title: "The Borrow Call" },
  { id: "borrow-checks", title: "Borrow Checks" },
  { id: "health-check", title: "Health Check" },
  { id: "recommended-vs-maximum", title: "Recommended and Maximum Borrow" },
  { id: "borrow-rate", title: "Borrow Rate and Fees" },
  { id: "availability", title: "Availability by State" },
  { id: "events", title: "Events" },
  { id: "failures", title: "Failures" },
  { id: "worked-example", title: "Worked Example" },
]

const debtAssetRows = [
  ["GHO", "18", "Aave's fixed $1 source", "First debt asset of every CDP Spoke"],
  ["USDC", "6", "Its DebtOracle on Chainlink USDC/USD", "Enabled per CDP Spoke with enableDebtReserve"],
  ["USDT", "6", "Its DebtOracle on Chainlink USDT/USD", "Enabled per CDP Spoke with enableDebtReserve"],
  ["WETH", "18", "Its DebtOracle on Chainlink ETH/USD", "Enabled per CDP Spoke with enableDebtReserve"],
]

const paramRows = [
  ["marketId", "uint256", "The market. With the caller it names the account; the wallet never names its proxy."],
  ["debtReserveId", "uint256", "The debt reserve to borrow. It must be approved for the market's CDP Spoke."],
  ["amount", "uint256", "Amount in the asset's base units (18 decimals for GHO and WETH, 6 for USDC and USDT). Any positive amount: Avana has no minimum debt."],
  ["receiver", "address", "Recipient of the borrowed asset. The app defaults it to the wallet. Protocol contracts and frozen addresses are refused."],
  ["deadline", "uint256", "Last valid block timestamp, in seconds on both chains."],
  ["minHealthFactor", "uint256", "The caller's own minimum health factor after the borrow, in WAD (1e18 = 1.00). 0 means no extra bound."],
  ["expectedNonce", "uint256", "Must equal the proxy's borrowNonce, read on-chain when the call is prepared. It is consumed by a successful borrow, so a signed borrow cannot be replayed."],
]

const checkRows = [
  ["Deadline and amount", "The deadline has not passed and the amount is above 0.", "DeadlineExpired / ZeroAmount"],
  ["Home Hub pause state", "The market's home Hub, and the debt reserve's funding Hub, are in state None. Borrowing is new risk and runs only in None.", "ApplicationFrozen / ApplicationPaused"],
  ["Sequencer gate (Base)", "The Base sequencer is up and restarted more than 3,600 seconds ago. Ethereum's gate is always Up.", "SequencerDown / SequencerGrace"],
  ["Address freeze", "Neither the wallet nor the receiver is a frozen address; the wallet is checked first.", "AddressIsFrozen"],
  ["Account, reserve and receiver", "The wallet has a proxy for the market, the debt reserve is approved for the CDP Spoke, and the receiver is not a protocol contract, Hub, Spoke, listed token or proxy.", "NoProxy / UnknownDebtReserve / InvalidReceiver"],
  ["Credit line", "At launch every debt reserve is funded by the Spoke's home Hub, and the line is the Aave drawCap of (Hub, asset, Spoke). Cross-Hub credit lines are off at launch.", "FundingHubPaused / CreditLineClosed / CreditLineExceeded"],
  ["Nonce", "The expected nonce equals the proxy's borrowNonce, which then increases by 1. A later revert restores it.", "BadNonce"],
  ["Market price", "The market's price state is Live. Each collateral feed's age is at most borrowPriceMaxAge: its own heartbeat plus 1,800 seconds.", "PriceNotLive / PriceTooOld"],
  ["Second-source agreement", "Each price's independent second source (a deep-pool TWAP or a second oracle network) agrees with the served price within its toleranceBps. A disagreement blocks the borrow but leaves the state Live and does not affect liquidation.", "SecondSourceDisagrees"],
  ["Debt prices", "Every debt reserve the account owes, plus the one borrowed, is on its recorded price source and unpaused. Each non-GHO reserve's DebtOracle is Live and no older than its feed's borrowPriceMaxAge.", "DebtPriceTooOld / UnexpectedDebtPriceSource / DebtReservePaused"],
  ["Aave reserve and market status", "The vault-token reserve is not paused or frozen on Aave and the market is not Offboarding.", "AaveReservePaused / ReserveFrozen / MarketOffboarding"],
  ["Configuration drift", "The Spoke is the approved standard Aave V4 Spoke, active and not halted; the standard-Spoke settings that keep liquidation with LPVaultSwap are unchanged; the collateral factor, liquidation bonus and target health factor match what Avana expects; Hub shares equal assets.", "ConfigDrift / HubSharesNotEqualAssets"],
  ["Liquidation can run", "At least one unfrozen approved keeper is active on the chain's LPVaultSwap (keeperFloor is 1), and every debt reserve in scope has a usable swap route from each pool token.", "LiquidationHalted / DebtLiquidationHalted"],
  ["Circuit breakers", "The market breaker is not tripped (pool share above the pool's listed cap, pool depth, token issuer, configuration drift, or a manual guardian trip), and the borrowed reserve's debt breaker is not tripped (including an outstanding GHO deficit above 10,000 GHO on the Spoke).", "BreakerTripped / DebtBreakerTripped"],
  ["Aave borrow", "Aave checks the reserve, the drawCap including any reported deficit, Hub liquidity, and that Aave's health factor stays at least 1.00.", "DrawCapExceeded / InsufficientLiquidity / HealthFactorBelowThreshold"],
  ["Health after the borrow", "The rescue-excluded health factor is at least the largest of 1.00, minHealthFactor and the market's optional hard floor (off by default).", "HealthFactorTooLow"],
]

const availabilityRows = [
  ["Home Hub None, sequencer Up, market Live with its second source agreeing, every debt price fresh, no breaker tripped, wallet and receiver not frozen", "Allowed"],
  ["Home Hub Frozen", "Refused (ApplicationFrozen)"],
  ["Home Hub Paused with reason General or MintPathSuspect", "Refused (ApplicationPaused)"],
  ["Another Hub on the chain paused", "Allowed"],
  ["Base sequencer Down, or within 3,600 seconds of a restart", "Refused (SequencerDown, SequencerGrace)"],
  ["Wallet or receiver frozen", "Refused (AddressIsFrozen)"],
  ["Market breaker tripped", "Refused (BreakerTripped)"],
  ["Debt breaker of the borrowed reserve tripped", "Refused (DebtBreakerTripped)"],
  ["Debt breaker of another reserve the account owes tripped", "Allowed"],
  ["Price drop of 3% in 2 hours, more than 20% of a market seized in 1 hour, or 3 route failures in 1 hour, with no guardian trip", "Allowed: monitoring alerts only"],
  ["Market Drifting, Cached or Expired, or Live with a disagreeing second source", "Refused"],
  ["Any feed older than its heartbeat plus 1,800 seconds", "Refused (PriceTooOld, DebtPriceTooOld)"],
  ["Market Offboarding, or its vault-token reserve frozen or paused on Aave", "Refused"],
  ["No active approved keeper on the chain", "Refused (LiquidationHalted)"],
  ["Another market of the same wallet frozen, paused or in breach", "Allowed: that market is another account"],
  ["Borrowed reserve frozen on Aave, or its drawCap exhausted", "Refused by Aave"],
  ["Flash source short or paused, or one swap route down while another can settle", "Allowed"],
  ["Any positive amount, however small", "Allowed: no minimum debt"],
]

const failureRows = [
  ["HealthFactorTooLow", "The rescue-excluded health factor after the borrow is below 1.00, below minHealthFactor, or below the market's hard floor when one is set."],
  ["PriceNotLive / SecondSourceDisagrees / PriceTooOld", "The market's price is not Live, its second source disagrees, or a collateral feed is too old."],
  ["DebtPriceTooOld / UnexpectedDebtPriceSource", "A debt reserve's DebtOracle is stale or not Live, or the reserve is on an unexpected price source."],
  ["ApplicationFrozen / ApplicationPaused", "The home Hub is Frozen or Paused."],
  ["SequencerDown / SequencerGrace", "The Base sequencer is down or within its 3,600-second grace window."],
  ["AddressIsFrozen", "The wallet or the receiver is frozen."],
  ["BreakerTripped / DebtBreakerTripped", "A market breaker or the borrowed reserve's debt breaker is tripped."],
  ["LiquidationHalted / DebtLiquidationHalted", "No active keeper, or no usable swap route into a debt asset of the account."],
  ["ConfigDrift / HubSharesNotEqualAssets", "Aave's configuration differs from what Avana expects."],
  ["AaveReservePaused / DebtReservePaused / ReserveFrozen / MarketOffboarding", "The market's reserve or a debt reserve is paused or frozen, or the market is offboarding."],
  ["BadNonce", "The expected nonce is not the proxy's current borrowNonce."],
  ["NoProxy / UnknownMarket / UnknownDebtReserve / InvalidReceiver", "The account, market, debt reserve or receiver is not valid."],
  ["DeadlineExpired / ZeroAmount / LockHeld", "Call bounds."],
  ["BalanceDeltaMismatch / UnitsMismatch", "The proxy did not receive and forward exactly the amount."],
  ["DrawCapExceeded / InsufficientLiquidity / HealthFactorBelowThreshold", "Aave refuses the borrow; the error passes through unchanged."],
]

export default async function BorrowAssetsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "getting-started/borrow-assets", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Borrow Assets"
          description="Borrow an approved debt asset on the Aave V4 account that holds one market's collateral. GHO is the first debt asset; USDC, USDT and WETH can be enabled per CDP Spoke."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            Each wallet has one PositionProxy per market, so each market is its own Aave account with its own health factor and nothing is cross-collateralized. A borrow goes wallet → AaveAdapter → the wallet&apos;s proxy for that market → CDP Spoke. The proxy holds no logic and executes only the Adapter&apos;s calls; every check lives in the AaveAdapter and the RiskModule.
          </p>
          <p className="mb-4 type-doc-body">
            The borrowed asset is drawn from the reserve&apos;s funding Hub into the proxy, and the proxy forwards exactly that amount to the receiver in the same call. A borrow changes no vault token, record or cap counter. There is no combined pledge-and-borrow call, no batched borrow and no multicall: pledge and borrow are separate calls, and each borrow names one debt reserve and carries its own nonce.
          </p>
          <p className="mb-4 type-doc-body">
            Avana enforces no opening health floor above Aave&apos;s 1.00. The Lens recommends borrowing to a health factor of 1.10 and shows the protocol maximum at 1.00 beside it. Interest raises the debt over time, so the health factor can fall even when collateral value does not change.
          </p>
        </section>

        <section id="debt-assets" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Debt Assets</h2>
          <p className="mb-4 type-doc-body">
            Any asset the CDP Spoke lists as a debt reserve can be borrowed. Governance enables a debt reserve per CDP Spoke with enableDebtReserve through the chain&apos;s Timelock. The call records the funding Hub and asset, and checks the credit line and the swap routes from every pool token of the Spoke&apos;s markets into the asset.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Asset</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Decimals</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Aave price source</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {debtAssetRows.map((row) => (
                  <tr key={row[0]}>
                    <td className="px-4 py-2 font-medium text-gray-900">{row[0]}</td>
                    <td className="px-4 py-2">{row[1]}</td>
                    <td className="px-4 py-2">{row[2]}</td>
                    <td className="px-4 py-2">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Each non-GHO debt reserve is priced by its own DebtOracle, which reads a primary, an alternate and a standby Chainlink route with the same freshness, failover and agreement rules as the collateral legs. When Expired, it serves the accepted price raised by debtStressRiseBps, so debt is never undervalued.</li>
            <li>The draw is bounded by the Aave drawCap of the reserve&apos;s (funding Hub, asset, CDP Spoke), which is the credit line. At launch every debt reserve is funded by the Spoke&apos;s home Hub, such as the Avana Stable LP Hub.</li>
            <li>One account can owe several debt reserves. The market&apos;s collateral, and only it, backs every debt reserve of that proxy.</li>
          </ul>
        </section>

        <section id="borrow-call" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">The Borrow Call</h2>
          <div className="type-doc-code-block mb-4">
            <code className="type-doc-body text-gray-900">
              {"borrow(uint256 marketId, uint256 debtReserveId, uint256 amount, address receiver, uint256 deadline, uint256 minHealthFactor, uint256 expectedNonce) returns (uint256 drawn)"}
            </code>
          </div>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Parameter</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Type</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paramRows.map((row) => (
                  <tr key={row[0]}>
                    <td className="px-4 py-2"><code className="type-doc-inline-code">{row[0]}</code></td>
                    <td className="px-4 py-2">{row[1]}</td>
                    <td className="px-4 py-2">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            The call returns the amount drawn, which always equals the requested amount. The app keeps one pending borrow per proxy, because one nonce sequence per proxy covers every debt asset.
          </p>
        </section>

        <section id="borrow-checks" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrow Checks</h2>
          <p className="mb-4 type-doc-body">
            In execution order. The checks cover the account&apos;s market and every debt reserve the account owes, plus the one being borrowed. Before checking prices, the RiskModule pokes the market&apos;s LPOracle and each non-GHO DebtOracle so that a disagreement or failure first seen by this borrow starts its window on time.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Check</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Rule</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {checkRows.map((row) => (
                  <tr key={row[0]}>
                    <td className="px-4 py-2 font-medium text-gray-900">{row[0]}</td>
                    <td className="px-4 py-2">{row[1]}</td>
                    <td className="px-4 py-2"><code className="type-doc-inline-code">{row[2]}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="mt-6 mb-2 type-doc-subsection-title">Price freshness</h3>
          <p className="mb-4 type-doc-body">
            Freshness is per feed. A Chainlink feed publishes on a deviation trigger or after its heartbeat, so the limit is the feed&apos;s own heartbeat plus a 1,800-second publication margin. Because a 24-hour feed can stay silent for a day while inside its deviation threshold, a borrow also needs the second source to agree.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>86,400-second feeds (USDT/USD, GHO/USD and the Base stablecoin feeds): fresh for 88,200 seconds.</li>
            <li>82,800-second feeds (USDC/USD and USDS/USD on Ethereum): fresh for 84,600 seconds.</li>
            <li>3,600-second feeds (DAI/USD, ETH/USD): fresh for 5,400 seconds.</li>
          </ul>
        </section>

        <section id="health-check" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Health Check</h2>
          <p className="mb-4 type-doc-body">
            After the Spoke call, the RiskModule reads the account&apos;s health factor from Aave and removes the contribution of the account&apos;s rescue units, the collateral admitted through the top-up slice or a rescue exemption. Aave counts rescue units in full, but they never support new debt.
          </p>
          <div className="type-doc-code-block mb-4">
            <code className="type-doc-body text-gray-900">
              {"hfEx ≥ max(1.00, minHealthFactor, hardHealthFloor(marketId))"}
            </code>
          </div>
          <p className="mb-4 type-doc-body">
            The hard floor is off (0) on every launch market and is set only for a market whose stress tests justify it. Aave&apos;s own borrow check already requires a health factor of at least 1.00, and a higher on-chain floor would refuse borrows Aave accepts without protecting solvency, which the liquidation path guarantees. A failure undoes the whole call, including the transfer to the receiver.
          </p>
          <p className="mb-4 type-doc-body">
            For the full calculation and how the collateral factor applies, see <Link href="/developers/architecture/health-factor" className="text-type-accent hover:underline">Health Factor</Link>.
          </p>
        </section>

        <section id="recommended-vs-maximum" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Recommended and Maximum Borrow</h2>
          <p className="mb-4 type-doc-body">
            The app shows two amounts from the Lens view previewBorrowRecommended, which takes the wallet, market, debt reserve and deadline and returns both:
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body mb-4">
            <li>Recommended: the borrow that leaves the rescue-excluded health factor at 1.10. It is a display value; no contract enforces it.</li>
            <li>Maximum: the borrow that leaves Aave&apos;s health factor at 1.00 (or the market&apos;s hard floor) once interest has accrued to the deadline, with a margin so that a maximum borrow included before the deadline still passes the health check. The view previewBorrowMax returns this amount alone.</li>
          </ul>
          <div className="type-doc-code-block mb-4">
            <code className="type-doc-body text-gray-900">
              {"target × (1 + rate × (deadline − now)) × 1.005"}
            </code>
          </div>
          <p className="mb-4 type-doc-body">
            Both round down, are capped by the reserve&apos;s drawCap headroom, and return 0 when the account&apos;s borrow gate fails. Example: $100,000 of collateral at a 70% collateral factor and no debt gives a maximum of $70,000 before the margin and a recommended $70,000 / 1.10 = $63,636.
          </p>
        </section>

        <section id="borrow-rate" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrow Rate and Fees</h2>
          <p className="mb-4 type-doc-body">
            Interest is Aave V4&apos;s: the debt reserve&apos;s drawn rate on its funding Hub plus the account&apos;s risk premium, which Aave refreshes on each borrow. Interest accrues every second and raises the debt to repay; the repay page shows how the live debt is read. Avana takes no fee on borrow interest.
          </p>
          <p className="mb-4 type-doc-body">
            Avana Labs charges an app fee in its own app, outside the contracts. No contract computes, holds or enforces it, and calling the contracts directly does not pay it.
          </p>
          <p className="type-doc-body">
            Accrual and repayment are covered in <Link href="/developers/getting-started/repay-loans" className="text-type-accent hover:underline">Repay Loans</Link>.
          </p>
        </section>

        <section id="availability" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Availability by State</h2>
          <p className="mb-4 type-doc-body">
            The most restrictive state over the account&apos;s market and every debt reserve it owes applies. The wallet&apos;s other markets, held by other proxies, never gate this borrow.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">State</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Borrow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {availabilityRows.map((row) => (
                  <tr key={row[0]}>
                    <td className="px-4 py-2">{row[0]}</td>
                    <td className="px-4 py-2">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            Breakers stop new debt at once and never stop liquidation, repay, top-ups or debt-free withdrawal. A temporary price or depth gate clears after 30 minutes of healthy observations; a deficit freeze stays until the guardian or the timelock reopens it.
          </p>
        </section>

        <section id="events" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Events</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>LPOracle and DebtOracle state events, only when a poke changes stored state.</li>
            <li>Funding Hub Draw and Spoke Borrow, with Aave&apos;s risk-premium events when the premium changes.</li>
            <li>The asset&apos;s Transfer from the proxy to the receiver.</li>
            <li>
              <code className="type-doc-inline-code">Borrowed(wallet, marketId, debtReserveId, receiver, amount, nonce, healthFactorAfter)</code>
            </li>
          </ul>
        </section>

        <section id="failures" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Failures</h2>
          <p className="mb-4 type-doc-body">
            Every failure reverts the whole transaction, including the nonce increment, every oracle poke and the transfer to the receiver.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Error</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Cause</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {failureRows.map((row) => (
                  <tr key={row[0]}>
                    <td className="px-4 py-2"><code className="type-doc-inline-code">{row[0]}</code></td>
                    <td className="px-4 py-2">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="worked-example" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Worked Example</h2>
          <div className="doc-topic type-doc-body mb-4">
            Example values; each market&apos;s parameters are set at listing. Carol&apos;s account in market 3 (USDC/USDT, Aerodrome Slipstream on Base) from the Deposit LP example holds 10,000 whole vault tokens at $2.00: collateral $20,000, CF-weighted $6,240, no debt and borrowNonce 0. The USDC debt reserve is funded by the Base Stable LP Hub&apos;s USDC credit line and priced by the USDC DebtOracle at $0.9999 on an 86,400-second feed (fresh for 88,200 seconds) with an agreeing second source. The USDC borrow rate is 6.00%. The Hub is in state None and the sequencer gate is Up.
          </div>
          <ul className="list-disc space-y-2 ps-5 type-doc-body mb-4">
            <li>Her app calls previewBorrowRecommended for USDC with a deadline of now + 600: recommended 6,240 / 1.10 / 0.9999 = 5,673.29 USDC (HF 1.10); maximum, with margin (1 + 0.06 × 600 / 31,536,000) × 1.005 = 1.0050011, is 6,240 / 1.0050011 / 0.9999 = 6,209.56 USDC (HF 1.00).</li>
            <li>She borrows 5,000 USDC: borrow(3, r_USDC, 5,000,000,000, Carol, now + 600, 1.20e18, 0).</li>
            <li>The Adapter reads the Hub state (None), the sequencer gate (Up), the freeze list, the account and the reserve, then consumes nonce 0.</li>
            <li>The RiskModule pokes market 3&apos;s LPOracle and the USDC DebtOracle: both Live, the USDC round is 30,000 seconds old (at most 88,200), no drift, an active keeper, no breaker tripped.</li>
            <li>No cap step runs: Carol&apos;s $20,000 charge has been booked since her pledge and a borrow books no charge.</li>
            <li>The proxy borrows 5,000 USDC from the Spoke and forwards exactly 5,000 USDC to Carol.</li>
            <li>Health check: debt value 5,000 × 0.9999 = $4,999.50, so HF = 6,240 / 4,999.50 = 1.2481, above max(1.00, 1.20).</li>
            <li>Event Borrowed with nonce 0 and HF 1,248,124,812,481,248,124; borrowNonce becomes 1.</li>
          </ul>
          <h3 className="mb-2 type-doc-subsection-title">Failing variants</h3>
          <ul className="list-disc space-y-2 ps-5 type-doc-body mb-4">
            <li>5,700 USDC gives HF 6,240 / 5,699.43 = 1.0948 and reverts with HealthFactorTooLow against Carol&apos;s own 1.20. With minHealthFactor 0 it succeeds.</li>
            <li>A USDC/USD round 88,300 seconds old reverts with DebtPriceTooOld.</li>
            <li>A Hub that is Frozen or Paused reverts with ApplicationFrozen or ApplicationPaused.</li>
            <li>A tripped market breaker reverts with BreakerTripped.</li>
            <li>1,800 seconds after a sequencer restart the borrow reverts with SequencerGrace; with the feed reporting down it reverts with SequencerDown.</li>
            <li>A 1 USDC borrow succeeds: there is no minimum debt, and Avana&apos;s own keepers liquidate small accounts at Avana&apos;s gas cost.</li>
          </ul>
          <h3 className="mb-2 type-doc-subsection-title">Rescue units and the maximum</h3>
          <p className="mb-4 type-doc-body">
            On an Ethereum market, wallet V owes 10,000 GHO against CF-weighted collateral of $12,000 (Aave HF 1.2000). $1,000 of the collateral is rescue units, worth $312 CF-weighted, so the rescue-excluded health factor is (12,000 − 312) / 10,000 = 1.1688. Borrowing 2,000 GHO would bring Aave&apos;s HF to 1.00 but the rescue-excluded HF to 0.974, so it reverts with HealthFactorTooLow. 1,688 GHO is the largest borrow the check allows. At a 5.00% GHO rate the Lens returns a recommended 625.45 GHO and a maximum of about 1,629.84 GHO.
          </p>
          <p className="type-doc-body">
            To keep the loan healthy after borrowing, see <Link href="/developers/getting-started/manage-loans" className="text-type-accent hover:underline">Manage Loans</Link>.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How to borrow GHO, USDC, USDT or WETH against pledged LP collateral on Avana, and every check a borrow passes."
        sectionColor="emerald"
      />
    </div>
  ))
}
