import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'safety/emergency-controls', {
    title: "Emergency Controls",
    description: "Per-Hub pause states, address freeze, circuit breakers, monitoring alerts, standby price routes and the emergency playbooks, and what always stays open.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "always-open", title: "What Always Stays Open" },
  { id: "pause-states", title: "Pause States" },
  { id: "transitions", title: "Transitions and Unpausing" },
  { id: "address-freeze", title: "Address Freeze" },
  { id: "breakers", title: "Circuit Breakers" },
  { id: "alerts", title: "Alerts Only" },
  { id: "standby", title: "Standby Routes" },
  { id: "playbooks", title: "Playbooks" },
  { id: "example-breaker", title: "Example: Circuit Breaker" },
  { id: "example-pause", title: "Example: Guardian Pause" },
]

const playbooks = [
  { id: "P-02", name: "Oracle failure, staleness, disagreement or manipulation", automatic: "The ORACLE gate stops borrowing, withdrawals with debt and new pledges in the market; a failing debt feed stops borrowing that debt.", action: "A guardian switches the failing slot to its standby route; if the standby also fails, the market breaker is tripped while keepers keep liquidating reserves with fresh prices." },
  { id: "P-03", name: "Market crash or stablecoin depeg", automatic: "The stablecoin band and oracle checks stop new borrowing and withdrawals with debt; price drops and seizure surges only alert.", action: "Pause each affected Hub with reason General if more than one market moves, and ask the Aave guardians to freeze the affected reserves; keepers keep liquidating." },
  { id: "P-04", name: "Pool or route liquidity drain", automatic: "POOL_DEPTH, and POOL_SHARE where a pool cap is set, stop new pledges and borrowing; route failures only alert.", action: "Confirm on a fork whether the approved routes can settle at size; only if they cannot, trip the market breaker. Keepers use the backup route and the dead route is disabled at the short delay." },
  { id: "P-05", name: "Exploit in progress", automatic: "Every condition breaker that holds.", action: "Within minutes, pause with MintPathSuspect if minting, the Adapter or Collateralization is suspect, otherwise General; freeze the attacker's addresses; cancel operations the attacker benefits from. The fix is an upgrade at the normal delay." },
  { id: "P-06", name: "Malicious or mistaken governance operation", automatic: "None; the timelock delay is the protection.", action: "Review the calldata within 1 hour and cancel; pause with General if it touches roles or upgrades." },
  { id: "P-07", name: "Compromised signer or key", automatic: "Owner and threshold changes of the governance Safe wait 48 hours.", action: "Cancel every unexpected operation; the Aave governance executor schedules revocation of the compromised roles; a compromised keeper is frozen at once or removed at the short delay." },
  { id: "P-08", name: "Keeper outage or misbehaving keeper", automatic: "With no active keeper, new borrowing on the chain stops.", action: "The standby keeper takes over and the permissionless path stays open; freeze a misbehaving keeper; trip the market breaker on any market left unliquidated past 3,600 seconds." },
  { id: "P-09", name: "Bad debt", automatic: "The DEFICIT breaker freezes borrowing of the reserve above 10,000 GHO outstanding.", action: "The coverage caller covers the deficit from the asset's Avana Umbrella; if the reserve is short, trip the debt breaker and Avana Labs funds it." },
  { id: "P-10", name: "Hub liquidity crunch or withdrawal cascade", automatic: "None on the Avana side; Aave refuses borrows past available liquidity.", action: "Pause with General if new borrowing must stop; keep liquidations running; unpause once utilization is below 90%." },
  { id: "P-11", name: "Token issuer action", automatic: "The ISSUER breaker on every market holding the token and every debt reserve of the asset.", action: "Pause with General if the token is in many markets; ask the Aave guardians to freeze affected reserves; refused payouts go to the payout escrow." },
  { id: "P-12", name: "Aave-side incident", automatic: "The CONFIG_DRIFT check stops new activity.", action: "Follow Aave's incident process; do not unpause until the Spoke matches the deployment manifest." },
  { id: "P-13", name: "Frontend or infrastructure compromise", automatic: "None; the contracts are unaffected.", action: "Take the app offline, warn users, rotate keys and verify the bundle; users exit through a known-good build or a block explorer." },
  { id: "P-14", name: "Spoke-setting drift", automatic: "The market's CONFIG_DRIFT breaker stops new-account pledges, borrowing and withdrawals with debt; seizure stays exclusive to LPVaultSwap.", action: "Ask the Aave Protocol Guardian to freeze the vault-token reserve and set the Spoke's draw caps to 0; trip the breaker manually if no read has yet; the Aave DAO restores the setting." },
  { id: "P-15", name: "Flash source short or paused", automatic: "None; every liquidation reverts before any state change when the source cannot lend.", action: "Keepers switch to their own funds; a lasting failure is answered by a reviewed replacement flash source at the normal delay." },
  { id: "P-16", name: "Aave halt of a CDP Spoke", automatic: "Every new activity on the Spoke is refused; repayment, withdrawal and liquidation stop on the Aave side.", action: "Ask the Aave guardians to replace the halt with a reserve freeze and zero draw caps; pause the Hub with General; keepers prepare liquidations for the first block after the lift." },
  { id: "P-17", name: "Sequencer outage (Base)", automatic: "While the sequencer is down, borrowing and liquidation stop; repay and debt-free withdrawal run through L1-forced transactions. For 1 hour after restart, only accounts below health factor 0.95 can be liquidated.", action: "None on-chain; keepers poke every oracle in the first block after restart and clear the backlog in health-factor order." },
  { id: "P-18", name: "Uncovered deficit", automatic: "The DEFICIT breaker stops borrowing the asset on the affected Spoke.", action: "Ask the Aave DAO to set every drawing Spoke's draw cap to 0; publish the uncovered amount and the adjusted share price; the DAO realizes the loss against that asset's suppliers." },
  { id: "P-19", name: "LPVault or ledger bug and relisting", automatic: "None beyond P-05.", action: "Pause every Hub of the chain (MintPathSuspect when minting or custody is suspect); the Aave guardians freeze affected reserves; offboard the affected markets and relist on fixed contracts." },
  { id: "P-20", name: "Debt-asset transfer fee switched on", automatic: "The ISSUER breaker on every reserve of that asset and every market holding it; liquidation continues.", action: "Confirm the breakers show ISSUER and trip any reserve whose probe did not report; the transfer fee is borne by the keeper's payout." },
  { id: "P-21", name: "Fee recipient blocklisted", automatic: "No liquidation reverts; Avana's fee goes to the payout escrow.", action: "Schedule a new fee recipient at the normal delay; the treasury claims the escrowed fee to an address it names." },
]

export default async function EmergencyControlsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "safety/emergency-controls", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Emergency Controls"
          description="Pause states, address freeze, circuit breakers, alerts, standby routes and the playbooks that use them."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            Avana has four stops, all held by each chain&apos;s MarketRegistry: a pause state per Hub with a reason, a chain-wide address freeze, circuit breakers per market and per debt reserve, and a market&apos;s offboarding status. There is no contract-wide pause, no per-function or per-keeper pause, and no incident clock. Each stop blocks new activity only.
          </p>
          <p className="mb-4 type-doc-body">
            The Emergency Guardian (3-of-5 per chain) and the Aave Protocol Guardian act immediately. The governance Safe reaches the same stops through the AvanaTimelock at the short delay, so new activity can still be stopped within 12 hours if both guardians are unavailable. Lifting a stop through the timelock waits the normal delay.
          </p>
          <p className="mb-4 type-doc-body">
            Roles and delays are described on this page:{" "}
            <Link href="/developers/safety/governance" className="text-type-accent hover:underline">Governance and Timelock</Link>.
          </p>
        </section>

        <section id="always-open" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">What Always Stays Open</h2>
          <p className="mb-4 type-doc-body">
            No pause, freeze, breaker, configuration drift or offboarding can stop these actions:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Repayment by anyone, for any account, including repaying everything and withdrawing in one call</li>
            <li>Debt-free withdrawal and partial liquidity removal, and release of a position with no credit</li>
            <li>LP fee collection by the depositor of record</li>
            <li>Liquidation of eligible accounts, through both the keeper and the permissionless entry point</li>
            <li>Pending settlement and claims from the payout escrow</li>
            <li>Rescue top-ups: an indebted account adding collateral within its restore amount, except under Paused(MintPathSuspect)</li>
          </ul>
          <div className="doc-topic type-doc-body">
            Stopping liquidation would let unhealthy accounts lose more value with nobody able to close them, turning a code incident into bad debt. Liquidation still needs a fresh price for the market being seized and the debt being repaid, Aave eligibility and an executable swap route. On Base it also waits for the sequencer check. Only Aave-side actions, a Hub halt of a CDP Spoke or an Aave pause of a reserve, can block repayment or liquidation, and the deployment AIP asks the Aave DAO to use them only for exploits and lift them within 48 hours.
          </div>
        </section>

        <section id="pause-states" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Pause States</h2>
          <p className="mb-4 type-doc-body">
            Each Hub has one state: None, Frozen or Paused, and a Paused Hub carries a reason, General or MintPathSuspect. The state applies to every market and CDP Spoke whose home Hub it is and to every debt reserve the Hub funds. A borrow reads both the home Hub and the debt reserve&apos;s funding Hub and applies the stricter state.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Action</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">None</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Frozen</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Paused (General)</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Paused (MintPathSuspect)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">New pledge by an account with no debt</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2">No</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Top-up or re-credit of an indebted account</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">Rescue top-up only</td>
                  <td className="px-4 py-2">No</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Borrow</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2">No</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Withdraw or remove liquidity with debt; repay with collateral</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">Yes, with every risk check</td>
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2">No</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Repay, repay all and withdraw</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">Yes</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Fee collection</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">Yes</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Debt-free withdrawal and removal, zero-credit release</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">Yes</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Liquidation (keeper and permissionless)</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">Yes</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Pending settlement</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 mb-4 type-doc-body">
            Blocked calls revert with <code className="type-doc-inline-code">ApplicationFrozen</code> or <code className="type-doc-inline-code">ApplicationPaused</code>; under Paused(General) a top-up that is not a rescue reverts with <code className="type-doc-inline-code">NotRescueTopUp</code>.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Frozen stops new exposure from new accounts and new debt while everything that reduces risk keeps working.</li>
            <li>Paused(General) also stops withdrawals with debt and every pledge that grows exposure. A rescue top-up stays open, because adding collateral is the cheapest way out of liquidation. A rescue top-up brings an indebted account below the rescue health factor of 1.10 back toward it, within the market&apos;s top-up slice.</li>
            <li>Paused(MintPathSuspect) is used when the minting code, the AaveAdapter or Collateralization is suspect. It also refuses every top-up and re-credit, rescue included, so no vault token is minted.</li>
          </ul>
        </section>

        <section id="transitions" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Transitions and Unpausing</h2>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Call</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Transition</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Who</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">freeze(hub)</code></td>
                  <td className="px-4 py-2">None to Frozen</td>
                  <td className="px-4 py-2">Freeze guardian at once; timelock at 12 hours</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">pause(hub, reason)</code></td>
                  <td className="px-4 py-2">None or Frozen to Paused(reason), or a change of reason while Paused</td>
                  <td className="px-4 py-2">Pause guardian at once; timelock at 12 hours</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">unfreeze(hub)</code></td>
                  <td className="px-4 py-2">Frozen to None</td>
                  <td className="px-4 py-2">Pause guardian at once; timelock at 5 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">unpause(hub)</code></td>
                  <td className="px-4 py-2">Paused to None</td>
                  <td className="px-4 py-2">Pause guardian at once; timelock at 5 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">freezeAll()</code></td>
                  <td className="px-4 py-2">Freezes every Hub of the chain that is in None</td>
                  <td className="px-4 py-2">Freeze guardian at once; timelock at 12 hours</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">pauseAll(reason)</code></td>
                  <td className="px-4 py-2">Pauses every Hub of the chain not already Paused with that reason</td>
                  <td className="px-4 py-2">Pause guardian at once; timelock at 12 hours</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul className="mt-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>A call on one Hub never changes another Hub, and nothing on one chain changes the other. Use freezeAll or pauseAll when the cause lies in code every Hub of the chain shares.</li>
            <li>Unfreezing while Paused reverts with CannotUnfreezeWhilePaused, so a weaker lift cannot silently skip the stronger state. A chain-wide call that changes no Hub reverts with NothingToChange.</li>
            <li>A key holding only the freeze role can never undo a freeze, an address freeze or a breaker trip.</li>
            <li>The pause state has no on-chain expiry. A guardian that keeps a Hub paused against governance stops only new activity, and its role can be revoked by a role-change operation that only the Aave governance executor can cancel. The other guardian can unpause at once in the meantime.</li>
            <li>Each change emits <code className="type-doc-inline-code">PauseStateChanged</code>, and each new reason emits <code className="type-doc-inline-code">PauseReasonChanged</code>.</li>
          </ul>
        </section>

        <section id="address-freeze" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Address Freeze</h2>
          <p className="mb-4 type-doc-body">
            A guardian can freeze one wallet at once with <code className="type-doc-inline-code">freezeAddress</code>, so an exploiting address loses new activity within minutes without pausing every user. The timelock can do the same at the short delay.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">A frozen wallet cannot</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">A freeze never blocks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">Pledge or re-credit, except as a rescue top-up</td>
                  <td className="px-4 py-2">Repayment, by the wallet or by anyone for it</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Borrow, or receive a borrow</td>
                  <td className="px-4 py-2">Debt-free withdrawal and removal, repay all and withdraw</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Withdraw or remove liquidity with debt, or repay with collateral</td>
                  <td className="px-4 py-2">LP fee collection and zero-credit release</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Create a new Position Proxy</td>
                  <td className="px-4 py-2">Pending settlement and payout-escrow claims</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Call either liquidation entry point as the caller</td>
                  <td className="px-4 py-2">Liquidation of the frozen wallet&apos;s own positions</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul className="mt-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Each caller can freeze at most <code className="type-doc-inline-code">MAX_ADDRESS_FREEZES_PER_DAY</code> = 20 addresses in any rolling 24 hours, counted in one-hour buckets, so a compromised guardian cannot freeze users in bulk and the other guardian keeps its full allowance.</li>
            <li>Protected addresses cannot be frozen: the timelock, the Aave governance executor, every Avana contract, vault token, LPOracle and DebtOracle, every Hub, approved Spoke and Avana Umbrella, every debt asset, the flash source and the Aave V3 Pool, every recorded swap route and every registered proxy.</li>
            <li>A guardian can freeze any keeper, including the last active one. While no active keeper remains, new borrowing stops on every Hub of the chain and liquidation stays open through the permissionless entry point.</li>
            <li>Unfreezing an address takes a timelock operation at the normal delay that only the Aave governance executor can cancel, so the guardian that froze it cannot keep it frozen by cancelling every unfreeze. A freeze has no on-chain expiry.</li>
          </ul>
        </section>

        <section id="breakers" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Circuit Breakers</h2>
          <p className="mb-4 type-doc-body">
            Breakers apply per market and per (CDP Spoke, debt reserve). The RiskModule evaluates them live on new pledges, borrows and withdrawals with debt, so a condition blocks even if nobody recorded it. Avana&apos;s keeper calls the permissionless <code className="type-doc-inline-code">pokeBreakers</code> every block to record breaches in the MarketRegistry. LPVaultSwap never reads or writes breaker state, so no breaker can slow or revert a liquidation.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Temporary gates</h3>
          <p className="mb-4 type-doc-body">
            A temporary gate blocks while its condition holds and reopens by itself once the condition is false and <code className="type-doc-inline-code">gateRecoverySeconds</code> (1,800 seconds, a provisional launch setting within 600 to 7,200) have passed since the last recorded breach.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Gate</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Condition</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Blocks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">ORACLE</td>
                  <td className="px-4 py-2">The collateral price is not Live, a stablecoin leaves the $0.90–$1.02 band, or a debt price is stale, off source or disagreeing</td>
                  <td className="px-4 py-2">New borrowing and withdrawals that leave debt</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">POOL_SHARE</td>
                  <td className="px-4 py-2">Avana&apos;s combined share of a pool, across all borrowers, ranges and Spokes on the chain, is above the pool&apos;s cap. Off by default; it applies only where a pool&apos;s listing sets a cap</td>
                  <td className="px-4 py-2">New borrowing and pledges that increase pool exposure</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">POOL_DEPTH</td>
                  <td className="px-4 py-2">The pool&apos;s in-range liquidity over the TWAP window falls below the listing depth minimum</td>
                  <td className="px-4 py-2">New pledges and borrowing in the market</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="mt-6 mb-2 type-doc-subsection-title">Latched security freezes</h3>
          <p className="mb-4 type-doc-body">
            A security freeze stays tripped until an authorized reset, because a person must confirm recovery. A market breaker blocks new-account pledges, top-ups that are not rescues, borrowing and withdrawals with debt in that market. A debt breaker blocks borrowing that reserve and withdrawals with debt by accounts that owe it.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Reason</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Trips when</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">DEFICIT</td>
                  <td className="px-4 py-2">The outstanding deficit of a CDP Spoke&apos;s debt reserve exceeds breakerDeficitMax: 10,000 GHO for a GHO reserve, a materiality set at listing for other assets</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">ISSUER</td>
                  <td className="px-4 py-2">A pool token or debt asset reports itself paused or switches on a transfer fee, read through the issuer probe recorded at listing; a reverting probe counts as tripped</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">CONFIG_DRIFT</td>
                  <td className="px-4 py-2">The Aave configuration of the market&apos;s CDP Spoke differs from what was listed, including the three required reserve settings</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">MANUAL</td>
                  <td className="px-4 py-2">A guardian or the timelock trips the breaker with tripMarketBreaker or tripDebtBreaker</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul className="mt-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Manual trips: a freeze guardian at once, or the timelock at the short delay.</li>
            <li>Resets with <code className="type-doc-inline-code">resetMarketBreaker</code> or <code className="type-doc-inline-code">resetDebtBreaker</code>: a pause guardian at once, or the timelock at the normal delay.</li>
            <li>A reset clears only latched reasons and reverts with <code className="type-doc-inline-code">ConditionStillHolds</code> while a latched condition other than MANUAL is still true.</li>
            <li>Lens shows each breaker&apos;s reasons and, for a temporary gate in recovery, when it reopens.</li>
          </ul>
        </section>

        <section id="alerts" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Alerts Only</h2>
          <p className="mb-4 type-doc-body">
            These conditions page on-call but trip nothing on-chain. A reverted liquidation cannot persist a failure count, and an on-chain counter could be fed by a caller to trip it, so monitoring computes them from events and simulations.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Alert</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Threshold</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">Price drop</td>
                  <td className="px-4 py-2">3% in 2 hours</td>
                  <td className="px-4 py-2">Guardians decide whether to trip the market breaker</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Collateral seized</td>
                  <td className="px-4 py-2">More than 20% of a market&apos;s credited units in 1 hour</td>
                  <td className="px-4 py-2">Treated as a sign of a price exploit or pool failure</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Swap-route failures</td>
                  <td className="px-4 py-2">3 in 1 hour for one market or debt asset</td>
                  <td className="px-4 py-2">A guardian trips a breaker only once a fork confirms the approved routes cannot settle valid liquidations at the required size</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Avana&apos;s share of a pool</td>
                  <td className="px-4 py-2">Above 25% across all borrowers and Spokes on the chain</td>
                  <td className="px-4 py-2">Listing review of the pool&apos;s caps</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Deficits and Umbrella balance</td>
                  <td className="px-4 py-2">Every new deficit; an Avana Umbrella below its minimum</td>
                  <td className="px-4 py-2">Coverage within 72 hours; Avana Labs tops the reserve up</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="standby" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Standby Routes</h2>
          <p className="mb-4 type-doc-body">
            Each listed token records a standby price route beside its primary and alternate Chainlink routes, checked at listing like the slot it can replace. A pause guardian calls <code className="type-doc-inline-code">useStandbyRoute(token, slot)</code> to put it in service at once. The Aave governance executor can undo that switch at once with <code className="type-doc-inline-code">cancelStandbySwitch</code>, and the listed routes come back through a normal-delay operation.
          </p>
          <p className="mb-4 type-doc-body">
            A switch never forces the price Live and never bypasses freshness, validity or the agreement check, so a guardian can only choose among routes the listing reviewed. Each token with a second source also has a standby second source, which a guardian can switch to at once; switching back takes the timelock at the normal delay.
          </p>
          <p className="type-doc-body">
            A swap route that fails is disabled at the short delay and restored to its previously approved address at the short delay, an operation only the Aave governance executor can cancel. There is no immediate route block.
          </p>
        </section>

        <section id="playbooks" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Playbooks</h2>
          <p className="mb-4 type-doc-body">
            Every incident follows the same triage: an alert fires, the on-call engineer confirms it on-chain within 15 minutes, classifies it as one of the playbooks below, pages both Safes and opens an incident log. If it does not yet fit a playbook and new activity is at risk, a guardian first pauses the affected Hub with reason General (P-01), or MintPathSuspect if minting may be involved. A public status note goes out within 1 hour of confirmation and a post-mortem within 7 days.
          </p>
          <p className="mb-4 type-doc-body">
            Each playbook runs on the chain of the incident. On Base, Aave-side steps go through the Base executor and can lag Ethereum, so Base playbooks send the Aave request at detection.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Playbook</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Automatic response</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Immediate action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {playbooks.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-2"><strong>{p.id}</strong> {p.name}</td>
                    <td className="px-4 py-2">{p.automatic}</td>
                    <td className="px-4 py-2">{p.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            Guardian powers are rehearsed on a fork with the real Safes of each chain before launch and every quarter.
          </p>
        </section>

        <section id="example-breaker" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Example: Circuit Breaker</h2>
          <p className="mb-4 type-doc-body">
            Example values; each market&apos;s parameters are set at listing. Market 1&apos;s pool has an illustrative per-pool cap of 1,000 bps.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Step</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">What happens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">1</td>
                  <td className="px-4 py-2">Avana&apos;s keeper pokes the breakers every block. At t = 1,000 Avana&apos;s share of market 1&apos;s pool across all Spokes is 1,040 bps, above the 1,000 bps cap; the MarketRegistry records the breach and emits GateBreached.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">2</td>
                  <td className="px-4 py-2">A borrow in market 1 reverts with BreakerTripped(1, POOL_SHARE). A pledge that raises pool exposure passes only as a rescue top-up. The borrower can still repay, and LPVaultSwap never reads breakers.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">3</td>
                  <td className="px-4 py-2">The share falls back below the cap. With gateRecoverySeconds = 1,800 the gate reopens at t = 2,800; the Lens shows it as recovering until then.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">4</td>
                  <td className="px-4 py-2">Aave records a 10,000 GHO deficit on the CDP Spoke&apos;s GHO reserve, equal to breakerDeficitMax. The next poke latches DEFICIT (BreakerLatched) and GHO borrows revert with DebtBreakerTripped. The Lens shows the uncovered amount.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">5</td>
                  <td className="px-4 py-2">After the deficit is covered, the Emergency Guardian calls resetDebtBreaker for the Spoke&apos;s GHO reserve (BreakerReset). While the deficit remained, the same call reverted with ConditionStillHolds.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">6</td>
                  <td className="px-4 py-2">Alerts only, with no on-chain trip: a 3% price drop in 2 hours, more than 20% of a market seized in 1 hour, 3 swap-route failures in 1 hour. Once routes are confirmed unable to settle at size, the guardian calls tripMarketBreaker.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="example-pause" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Example: Guardian Pause</h2>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Step</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">What happens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">1</td>
                  <td className="px-4 py-2">A mint-path exploit is suspected. The Emergency Guardian calls pause on the MarketRegistry for the Hub with reason MintPathSuspect, which takes effect immediately and emits PauseStateChanged and PauseReasonChanged.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">2</td>
                  <td className="px-4 py-2">The app reads the application state and pause reason from the Lens: Paused, MintPathSuspect.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">3</td>
                  <td className="px-4 py-2">Pledge, re-credit, borrow and repay with collateral on the AaveAdapter revert with ApplicationPaused.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">4</td>
                  <td className="px-4 py-2">Still open: repay by anyone, fee collection, repay all and withdraw, and liquidation through LPVaultSwap.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">5</td>
                  <td className="px-4 py-2">Once the mint path is cleared, the guardian changes the reason to General: rescue top-ups reopen, while borrowing and repay with collateral stay blocked until the Hub is unpaused.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">6</td>
                  <td className="px-4 py-2">Recovery: the pause guardian unpauses the Hub, or the AvanaTimelock does at the normal delay. A milder incident uses a Hub freeze, which stops new-account pledges and borrowing, and an address freeze for a single wallet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Per-Hub pause states, address freeze, circuit breakers, alerts, standby routes and the emergency playbooks."
        sectionColor="rose"
      />
    </div>
  ))
}
