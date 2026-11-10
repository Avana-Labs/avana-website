import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'getting-started/withdraw-collateral', {
    title: "Withdraw Collateral",
    description: "How to take a pledged position back from Avana: withdraw with and without debt, repay-all-and-withdraw, zero-credit release, reconcile on exit, what you receive, availability by state, failures and a worked example.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "withdraw-call", title: "The Withdraw Call" },
  { id: "gates", title: "Debt-Free and With-Debt Withdrawals" },
  { id: "repay-all-and-withdraw", title: "Repay All and Withdraw" },
  { id: "zero-credit-release", title: "Zero-Credit Release" },
  { id: "reconcile-on-exit", title: "Reconcile on Exit" },
  { id: "what-you-receive", title: "What You Receive" },
  { id: "availability", title: "Availability by State" },
  { id: "events", title: "Events" },
  { id: "failures", title: "Failures" },
  { id: "worked-example", title: "Worked Example" },
]

const pathRows = [
  ["withdraw", "Returns one whole record's position. Debt-free it is ungated; with debt it runs the withdraw-with-debt checks."],
  ["repayAllAndWithdraw", "Repays the named debt reserves in full, requires no debt left, then makes a debt-free withdrawal, in one call."],
  ["releaseZeroCredit", "Returns a position whose record has 0 credited units left, normally after a full seizure."],
  ["removeLiquidity", "Removes part of a record's units while the position stays pledged (see Manage Loans)."],
]

const withDebtRows = [
  ["Pause state", "The home Hub is not Paused (either reason). A Frozen Hub allows withdraw-with-debt with every check.", "ApplicationPaused"],
  ["Address freeze", "The wallet is not frozen. A frozen wallet can still leave through repayAllAndWithdraw or after repaying.", "AddressIsFrozen"],
  ["Sequencer gate (Base)", "The sequencer is up and restarted more than 3,600 seconds ago.", "SequencerDown / SequencerGrace"],
  ["Prices", "The market is Live with every collateral feed no older than its heartbeat plus 1,800 seconds and its second source agreeing; every debt reserve is on its recorded source and, unless GHO, priced by a Live, fresh DebtOracle.", "PriceNotLive / PriceTooOld / DebtPriceTooOld / SecondSourceDisagrees"],
  ["Aave reserves", "The vault-token reserve and every owed debt reserve are not paused on Aave.", "AaveReservePaused / DebtReservePaused"],
  ["Liquidation can run", "At least one active approved keeper on the chain, and a usable swap route from every pool token to every owed debt asset.", "LiquidationHalted / DebtLiquidationHalted"],
  ["Configuration drift", "Aave's configuration and the standard-Spoke settings match what Avana expects, and Hub shares equal assets.", "ConfigDrift / HubSharesNotEqualAssets"],
  ["Circuit breakers", "Neither the market breaker nor the debt breaker of any owed reserve is tripped.", "BreakerTripped / DebtBreakerTripped"],
  ["Health after the withdrawal", "Aave's own check requires HF at least 1.00. Then the rescue-excluded HF must be at least the largest of 1.00, minHealthFactor and the market's hard floor (off by default).", "HealthFactorBelowThreshold / HealthFactorTooLow"],
]

const availabilityRows = [
  ["Hub None or Frozen", "Allowed", "Allowed", "Allowed"],
  ["Hub Paused (General or MintPathSuspect)", "Allowed", "Refused (ApplicationPaused)", "Allowed"],
  ["Wallet frozen", "Allowed", "Refused (AddressIsFrozen)", "Allowed"],
  ["Market breaker, or debt breaker of an owed reserve, tripped", "Allowed", "Refused", "Allowed"],
  ["Base sequencer Down", "Allowed once included", "Refused (SequencerDown)", "Allowed once included"],
  ["Base sequencer Grace (3,600 s after restart)", "Allowed", "Refused (SequencerGrace)", "Allowed"],
  ["Drifting, Cached or Expired, or stale feeds, or a disagreeing second source", "Allowed", "Refused", "Allowed"],
  ["Rescue units carry the health factor", "Allowed", "Refused (HealthFactorTooLow)", "Allowed"],
  ["Market Offboarding, or vault-token reserve frozen on Aave", "Allowed", "Allowed, against the ramped liquidation threshold", "Allowed"],
  ["Market Closed", "Allowed forever, no price read", "Not reachable: a Closed market has no debt", "Allowed"],
  ["Configuration drift, Hub shares not equal to assets", "Allowed", "Refused", "Allowed"],
  ["No active keeper, or no swap route to an owed debt asset", "Allowed", "Refused", "Allowed"],
  ["A debt reserve of the account paused on Aave", "Allowed", "Refused (DebtReservePaused)", "Allowed"],
  ["Vault-token reserve paused on Aave, or the Hub halts the CDP Spoke", "Refused by Aave", "Refused by Aave", "Allowed"],
  ["Faulty MarketRegistry", "Allowed", "Still gated: the debt decision comes from Aave", "Allowed"],
  ["Unsettled earlier seizure in the market", "Allowed after reconcile", "Allowed after reconcile", "Allowed after reconcile"],
]

const failureRows = [
  ["UnitsMismatch", "The units argument is not the record's credited units after reconcile. Read it from previewRelease."],
  ["ZeroAmount", "Units of 0; a record with no credited units uses releaseZeroCredit."],
  ["NoProxy / UnknownMarket / IntegrationMismatch", "The wallet has no account in the market, or the position reference is not the market's."],
  ["RecordNotFound / NotRecordProxy / InvalidVaultToken", "No open record for the position in this account and market."],
  ["ApplicationPaused", "Debt remains and the home Hub is Paused."],
  ["AddressIsFrozen", "Debt remains and the wallet is frozen."],
  ["SequencerDown / SequencerGrace", "Debt remains and the Base sequencer is down or within its grace window."],
  ["PriceNotLive / PriceTooOld / DebtPriceTooOld / SecondSourceDisagrees", "Debt remains and a price is not usable."],
  ["BreakerTripped / DebtBreakerTripped / LiquidationHalted / ConfigDrift", "Debt remains and another RiskModule gate fails."],
  ["HealthFactorBelowThreshold", "Aave refuses a withdrawal that would leave its health factor below 1.00."],
  ["HealthFactorTooLow", "Debt remains and the rescue-excluded health factor is below the floor or minHealthFactor."],
  ["DebtRemaining", "repayAllAndWithdraw left debt on a reserve the call did not name."],
  ["LengthMismatch", "The reserve and cap arrays differ in length."],
  ["NotDepositor / RecordHasCredit", "A zero-credit release by someone other than the depositor, or for a record that still has credited units."],
  ["PoolLocked", "Reconcile on exit needed to unwind units while the pool was inside its own callback."],
  ["BackingMismatch", "The market's backing gap changed; the whole call reverts."],
  ["ReservePaused / SpokeHalted / SpokeNotActive", "Aave blocks the withdrawal; handled by an emergency playbook with the Aave Guardian."],
]

export default async function WithdrawCollateralPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "getting-started/withdraw-collateral", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Withdraw Collateral"
          description="Take a whole pledged position back, with its fees. A debt-free account can always leave; an account with debt can leave while it stays healthy and the withdraw-with-debt checks pass."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            A withdrawal closes one record: the proxy withdraws exactly the record&apos;s credited units from the CDP Spoke, the AaveAdapter burns them, Collateralization releases the record and its USD charge, and the LPVault returns the whole position to the depositor of record. Only the wallet whose proxy holds the record, which is always its depositor, can withdraw it. Nobody else, including governance and keepers, can move a position that has a record.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Call</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pathRows.map((row) => (
                  <tr key={row[0]}>
                    <td className="px-4 py-2"><code className="type-doc-inline-code">{row[0]}</code></td>
                    <td className="px-4 py-2">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            Partial removal is described in <Link href="/developers/getting-started/manage-loans" className="text-type-accent hover:underline">Manage Loans</Link>.
          </p>
        </section>

        <section id="withdraw-call" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">The Withdraw Call</h2>
          <div className="type-doc-code-block mb-4">
            <code className="type-doc-body text-gray-900">
              {"withdraw(uint256 marketId, PositionRef position, uint256 units, uint256 deadline, uint256 minHealthFactor)"}
            </code>
          </div>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>The position reference names the record&apos;s position by integration ID and position key. One position per call.</li>
            <li>The units must equal the record&apos;s credited units after reconcile, read from Collateralization&apos;s previewRelease. The whole position is released, never part of it.</li>
            <li>The deadline is a timestamp: 600 seconds is 300 Base blocks or 50 Ethereum blocks.</li>
            <li>The minimum health factor applies only when debt remains; 0 means no extra bound.</li>
            <li>The market&apos;s vault token, Spoke and reserve come from the Adapter&apos;s own binding and the vault token&apos;s immutables, with no MarketRegistry read, so a faulty registry can neither block the exit nor substitute another token.</li>
          </ul>
        </section>

        <section id="gates" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Debt-Free and With-Debt Withdrawals</h2>
          <p className="mb-4 type-doc-body">
            The account is debt-free when Aave reports a borrow count of 0 for the proxy. Aave&apos;s count covers every reserve the account owes, so a registry that lists no debt reserves cannot make an indebted account look debt-free.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Debt-free</h3>
          <p className="mb-4 type-doc-body">
            No pause state, circuit breaker, address freeze, sequencer gate, price, MarketRegistry view or RiskModule check is read. A debt-free withdrawal works in every Avana state and every price state. Only Aave can stop it, by pausing the vault-token reserve or halting the CDP Spoke. When the last record leaves, the reserve is disabled as collateral for the proxy.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">With debt</h3>
          <p className="mb-4 type-doc-body">
            Collateral that leaves an indebted account can no longer be seized, so a withdrawal with debt is closed whenever liquidation of the account could not run or a breaker stops new exposure. The checks are the borrow checks without the Offboarding and Aave-frozen refusals:
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
                {withDebtRows.map((row) => (
                  <tr key={row[0]}>
                    <td className="px-4 py-2 font-medium text-gray-900">{row[0]}</td>
                    <td className="px-4 py-2">{row[1]}</td>
                    <td className="px-4 py-2"><code className="type-doc-inline-code">{row[2]}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            The health check runs after the record is released, with the account&apos;s remaining rescue units valued at zero. In an Offboarding market Aave applies the ramped-down liquidation threshold, so a withdrawal with debt needs more remaining collateral as the ramp advances.
          </p>
        </section>

        <section id="repay-all-and-withdraw" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Repay All and Withdraw</h2>
          <div className="type-doc-code-block mb-4">
            <code className="type-doc-body text-gray-900">
              {"repayAllAndWithdraw(uint256 marketId, PositionRef position, uint256 units, uint256[] debtReserveIds, uint256[] maxRepaySpends, uint256 deadline)"}
            </code>
          </div>
          <p className="mb-4 type-doc-body">
            For each named debt reserve the call runs a repay-all with the caller as payer and borrower, under that reserve&apos;s own cap, and refunds the unused part in the same call. The app sets each cap, and its approval, to the Lens quoteRepayAll value. If Aave still reports any debt, the call reverts with DebtRemaining for the first borrowed reserve. Otherwise it makes a debt-free withdrawal.
          </p>
          <p className="mb-4 type-doc-body">
            It reads no pause state, breaker, freeze, sequencer gate, price or MarketRegistry view and calls no RiskModule function. It therefore works under a Frozen or Paused Hub, under any breaker, for a frozen wallet and during a Base sequencer grace window. Any failure reverts all of it.
          </p>
        </section>

        <section id="zero-credit-release" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Zero-Credit Release</h2>
          <div className="type-doc-code-block mb-4">
            <code className="type-doc-body text-gray-900">
              {"releaseZeroCredit(uint256 marketId, PositionRef position, uint256 deadline)"}
            </code>
          </div>
          <p className="mb-4 type-doc-body">
            When a record has no credited units left, normally after a full seizure, the depositor of record takes the position back with this call. It mints, burns and supplies nothing, makes no Spoke withdrawal and no debt check, and reads no pause state, freeze, breaker or price. It is available in every Avana and Aave state, every sequencer state and in a Closed market. The position returns with its uncollected fees and any liquidity donated to it.
          </p>
        </section>

        <section id="reconcile-on-exit" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Reconcile on Exit</h2>
          <p className="mb-4 type-doc-body">
            Inside every withdrawal, zero-credit release and partial removal, Collateralization compares the account&apos;s credited units with its Aave supply. Supply can only fall below credit if a seizure was never settled. In every normal exit the two match and nothing is written.
          </p>
          <p className="mb-4 type-doc-body">
            When units are missing, Collateralization debits the account&apos;s records largest-first by the missing amount, unwinds those units into the market&apos;s pending-settlement balance and releases their charge. The seized vault tokens in circulation stay backed by the tokens in that balance. A record debited to 0 stays open, so its depositor can still collect fees and use releaseZeroCredit. Anyone can later call LPVaultSwap&apos;s settlePending, which burns the stranded vault tokens, converts the pending tokens into the market&apos;s settlement debt asset and funds that asset&apos;s Avana Umbrella (Coverage Spoke). The borrower and the caller receive nothing from it.
          </p>
        </section>

        <section id="what-you-receive" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">What You Receive</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>The position itself: for Uniswap v3 and Slipstream, the NFT, transferred from the LPVault to the depositor of record without a receiver hook. A Slipstream NFT returns unstaked, as it was pledged.</li>
            <li>Its uncollected fees and any principal owed to it. The withdrawal neither collects nor unwinds, so these travel with the NFT and the depositor collects them directly from the AMM protocol.</li>
            <li>Any liquidity donated to the position and never re-credited.</li>
            <li>The record&apos;s USD charge is released from the market&apos;s budget (slice part first, then Regular) and from the token and depositor counters.</li>
          </ul>
        </section>

        <section id="availability" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Availability by State</h2>
          <p className="mb-4 type-doc-body">
            For a withdrawal with debt, the most restrictive state over the account&apos;s market and every debt reserve it owes applies. No Avana pause, breaker or freeze reaches pending settlement or liquidation in any row.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">State</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Debt-free withdraw, remove or repayAllAndWithdraw</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Withdraw or remove with debt</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Zero-credit release</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {availabilityRows.map((row) => (
                  <tr key={row[0]}>
                    <td className="px-4 py-2">{row[0]}</td>
                    <td className="px-4 py-2">{row[1]}</td>
                    <td className="px-4 py-2">{row[2]}</td>
                    <td className="px-4 py-2">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="events" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Events</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>With debt: LPOracle and DebtOracle state events when a poke changes stored state.</li>
            <li>Hub Remove and Spoke Withdraw; the vault token&apos;s Transfer to the proxy and its burn.</li>
            <li>CollateralDisabled, when a debt-free account&apos;s last record leaves the reserve.</li>
            <li>RecordDebited and SeizureReconciled, only when reconcile on exit found missing units.</li>
            <li>The NFT&apos;s Transfer to the depositor, then LPVault PositionReturned and Collateralization CollateralReleased.</li>
            <li>
              <code className="type-doc-inline-code">CollateralWithdrawn(wallet, marketId, vaultToken, positionKey, units, withDebt, healthFactorAfter)</code>
            </li>
          </ul>
          <p className="mt-4 type-doc-body">
            The health factor in CollateralWithdrawn is the maximum uint256 value on the debt-free branch. repayAllAndWithdraw first emits one Repaid per reserve that moved funds.
          </p>
        </section>

        <section id="failures" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Failures</h2>
          <p className="mb-4 type-doc-body">
            Every failure reverts the whole transaction; the record, counters, tokens and position stay as they were.
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
            Example values; each market&apos;s parameters are set at listing. Carol&apos;s account in market 3 (USDC/USDT, Aerodrome Slipstream on Base, $2.00 per whole vault token, collateral factor 31.20%) holds two records: key1 with 10,000,000,000 units ($20,000) and a top-up keyB with 2,500,000,000 units ($5,000). Collateral is $25,000, CF-weighted $7,800, debt 5,000 USDC valued at $4,999.50, so HF = 7,800 / 4,999.50 = 1.5602. Both feeds last published 30,000 seconds ago (fresh until 88,200), the Hub is in state None and the sequencer gate is Up.
          </div>
          <ul className="list-disc space-y-2 ps-5 type-doc-body mb-4">
            <li>The app reads getAccount and getPriceState: market Live, and removing keyB leaves CF-weighted $6,240 and HF 1.2481.</li>
            <li>Carol calls withdraw(3, (I, keyB), 2,500,000,000, now + 600, 1.20e18). The units come from previewRelease.</li>
            <li>The account has debt (borrow count 1), so the gates run: Hub not Paused, Carol not frozen, then the RiskModule pre-check finds the sequencer Up, both oracles Live and no breaker tripped.</li>
            <li>The proxy withdraws 2,500,000,000 units from the Spoke and the Adapter burns them.</li>
            <li>Collateralization closes record keyB and releases its $5,000 charge. The LPVault returns the NFT to Carol with every fee it has accrued.</li>
            <li>Health check: HF = 6,240 / 4,999.50 = 1.2481, above max(1.00, 1.20).</li>
            <li>Events PositionReturned, CollateralReleased and CollateralWithdrawn with HF 1,248,124,812,481,248,124. Carol now holds one record, collateral $20,000.</li>
          </ul>
          <h3 className="mb-2 type-doc-subsection-title">Failing case and the debt-free route</h3>
          <ul className="list-disc space-y-2 ps-5 type-doc-body mb-4">
            <li>Withdrawing key1 instead leaves CF-weighted $1,560 and HF 1,560 / 4,999.50 = 0.3120, so Aave reverts with HealthFactorBelowThreshold.</li>
            <li>1,200 seconds after a sequencer restart, withdraw reverts with SequencerGrace. repayAllAndWithdraw(3, (I, keyB), 2,500,000,000, [r_USDC], [cap], now + 600) repays the USDC debt and returns the NFT at once, because a debt-free exit reads no gate.</li>
            <li>The same withdrawal while the Hub is Paused, while Carol is frozen, or while the market&apos;s pool-share breaker is tripped reverts with ApplicationPaused, AddressIsFrozen or BreakerTripped; repayAllAndWithdraw succeeds in each of these states. Under a Frozen Hub the withdrawal with debt succeeds.</li>
          </ul>
          <p className="type-doc-body">
            How the repay-all cap is quoted is explained in <Link href="/developers/getting-started/repay-loans" className="text-type-accent hover:underline">Repay Loans</Link>.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How to take a pledged position back from Avana, with and without debt, and what you receive."
        sectionColor="emerald"
      />
    </div>
  ))
}
