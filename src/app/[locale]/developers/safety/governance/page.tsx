import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'safety/governance', {
    title: "Governance and Timelock",
    description: "Who can change Avana on each chain, how long each change waits in the AvanaTimelock, who can cancel it, and how the Aave DAO approves markets and credit lines.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "authorities", title: "Authorities" },
  { id: "timelock", title: "AvanaTimelock" },
  { id: "cancel-rules", title: "Cancel Rules" },
  { id: "guardians", title: "Guardians" },
  { id: "role-table", title: "Role Table" },
  { id: "delay-classes", title: "Delay Classes" },
  { id: "parameter-changes", title: "Parameter Changes" },
  { id: "keepers", title: "Keeper List" },
  { id: "aave-process", title: "Aave DAO Process" },
  { id: "key-security", title: "Multisig Key Security" },
  { id: "handover", title: "Handover and Fallback" },
]

export default async function GovernancePage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "safety/governance", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Governance and Timelock"
          description="Who can change Avana on each chain, how long each change waits, who can cancel it, and how the Aave DAO approves markets and credit lines."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            Governance is per chain. Ethereum and Base each have their own AvanaTimelock, a 4-of-7 governance Safe and a 3-of-5 Emergency Guardian Safe, beside the Aave Protocol Guardian and the Aave DAO&apos;s executor on that chain. No Avana role, Safe or operation on one chain can act on the other, and no Avana contract accepts a cross-chain message. A change that must apply on both chains is scheduled separately on each, with its own delay and cancellers.
          </p>
          <p className="mb-4 type-doc-body">
            The Aave DAO owns and configures every Avana Hub and Spoke: caps, credit lines, collateral factors, the liquidation settings, reserve freeze and pause, and Hub halts. Every change to Avana&apos;s own contracts is an operation on the chain&apos;s AvanaTimelock, which Avana Labs cannot bypass. On Base the Aave DAO acts through its Base executor over Aave&apos;s cross-chain governance, so Aave-side steps on Base can take longer than on Ethereum.
          </p>
          <div className="doc-topic type-doc-body">
            Every change waits in public before it executes: 5 days for anything that adds risk or new configuration, 12 hours for calls that only reduce risk or stop new activity. Pauses, freezes and breakers stop new activity only. Repayment, fee collection, debt-free withdrawal and liquidation stay open in every governance state.
          </div>
        </section>

        <section id="authorities" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Authorities</h2>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Authority</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Controls</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Delay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">Aave DAO (governance executor)</td>
                  <td className="px-4 py-2">Each chain&apos;s Avana Stable LP Hub and its CDP, Lend and Coverage Spokes: Spoke deployment and upgrades, the three required reserve settings, collateral factors, caps, reserve flags, bonus curve, target health factor, collateral risk, debt-asset rates, credit lines and draw caps, each Avana Umbrella&apos;s coverage ratio and minimum, and the flash-borrower role. On the AvanaTimelock it is the second proposer, a canceller, and the only account that can cancel a role change or a restoring operation. It can undo a guardian&apos;s standby price-route switch at once.</td>
                  <td className="px-4 py-2">Aave governance</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Governance Safe (4-of-7 per chain)</td>
                  <td className="px-4 py-2">Proposes, cancels and executes on its chain&apos;s AvanaTimelock: upgrades, the deployment operations and market activation, price sources, routes, parameters, keepers and role changes. It holds no role on any other Avana contract and has no immediate power. A Safe guard limits it to calls to the AvanaTimelock and to itself.</td>
                  <td className="px-4 py-2">12 hours or 5 days per operation</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">AvanaTimelock (one per chain)</td>
                  <td className="px-4 py-2">Holds the admin roles on every upgradeable Avana contract and is the fixed timelock address of every immutable one. Runs each ready operation for 14 days after it becomes ready.</td>
                  <td className="px-4 py-2">As scheduled</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Emergency Guardian (3-of-5 per chain)</td>
                  <td className="px-4 py-2">Freezes and pauses Hubs, freezes addresses, trips and resets circuit breakers, switches a token to its reviewed standby price route or standby second source, and cancels queued operations.</td>
                  <td className="px-4 py-2">Immediate</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Aave Protocol Guardian</td>
                  <td className="px-4 py-2">The same Avana guardian roles as the Emergency Guardian. On the Aave side, one-way freeze and pause of reserves, so Avana&apos;s markets can be stopped without Avana Labs.</td>
                  <td className="px-4 py-2">Immediate</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Risk service providers (Aave V4)</td>
                  <td className="px-4 py-2">Set pool risk factors, USD caps, the minimum pledge and any per-pool share cap in each listing package, each with its cap-sizing calculation, and with the Aave DAO the credit lines, draw caps and each Umbrella&apos;s coverage ratio and minimum. They hold no on-chain Avana role and propose changes through the governance Safe.</td>
                  <td className="px-4 py-2">Through the governance Safe</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            Avana Labs proposes markets and parameter changes for assessment by a designated risk reviewer. The signer sets of the governance Safe, the Emergency Guardian and the Aave Protocol Guardian are pairwise disjoint, so no single group of signers both proposes a change and controls the guardian response to it.
          </p>
        </section>

        <section id="timelock" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">AvanaTimelock</h2>
          <p className="mb-4 type-doc-body">
            The AvanaTimelock is a non-upgradeable extension of OpenZeppelin&apos;s TimelockController. It holds its own admin role and has no other admin, so its proposers, cancellers, delays and settings change only through operations that wait its own delays. On every upgradeable Avana contract it holds both admin roles, and a grant of either role to any other account reverts. Immutable contracts with a privileged function accept that call only from the timelock address fixed in their bytecode. The deployer holds no role once deployment ends.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Setting</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Value</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">normalDelay</code></td>
                  <td className="px-4 py-2">432,000 s (5 days)</td>
                  <td className="px-4 py-2">Always between 4 and 5 days. Changed only by a normal-delay operation on the timelock itself.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">MIN_NORMAL_DELAY</code></td>
                  <td className="px-4 py-2">345,600 s (4 days)</td>
                  <td className="px-4 py-2">Immutable floor of the normal delay.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">MAX_DELAY</code></td>
                  <td className="px-4 py-2">432,000 s (5 days)</td>
                  <td className="px-4 py-2">Immutable ceiling of the normal delay.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">SHORT_DELAY</code></td>
                  <td className="px-4 py-2">43,200 s (12 hours)</td>
                  <td className="px-4 py-2">Applies only when every call in the operation is on the short-delay list.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">SHORT_ELIGIBLE</code></td>
                  <td className="px-4 py-2">Fixed set</td>
                  <td className="px-4 py-2">The only calls the short-delay list may ever hold, fixed at construction. Each one reduces risk, stops new activity or restores configuration already reviewed at the normal delay.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">GRACE_PERIOD</code></td>
                  <td className="px-4 py-2">1,209,600 s (14 days)</td>
                  <td className="px-4 py-2">A ready operation can be executed for 14 days, then it expires and can only be cleaned up.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">publicExecution</code></td>
                  <td className="px-4 py-2">true</td>
                  <td className="px-4 py-2">Anyone can execute a ready operation, so a proposer cannot hold an approved change back to time it.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="mt-6 mb-2 type-doc-subsection-title">Required delay</h3>
          <p className="mb-4 type-doc-body">
            The delay of an operation is read from its calldata, not chosen by the proposer. If every call is on the short-delay list the operation needs 12 hours; one call outside it makes the whole batch wait the normal delay. Scheduling with a shorter delay reverts with this error:
          </p>
          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"DelayBelowRequired(delay, required)"}</code>
          </div>
          <p className="mb-4 type-doc-body">
            For example, a batch that only tightens a market cap and disables a swap route needs 43,200 s. Adding one loosening call to the same batch raises the required delay to 432,000 s.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Example timeline</h3>
          <p className="mb-4 type-doc-body">
            An upgrade scheduled at t = 1,780,000,000 with the normal delay is ready at 1,780,432,000. Anyone can execute it from then until 1,781,641,599. From 1,781,641,600 it is expired and execution reverts. During those 5 days monitoring alerts on the scheduled call, every canceller can cancel it, and a borrower can leave with one repay and one withdrawal per position.
          </p>
          <p className="type-doc-body">
            Shortening the normal delay is itself a normal-delay operation, and the new value applies only to operations scheduled after it executes. A cut from 5 to 4 days therefore helps no operation until 9 days after the cut was published.
          </p>
        </section>

        <section id="cancel-rules" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Cancel Rules</h2>
          <p className="mb-4 type-doc-body">
            Four accounts hold the canceller role on each chain: the governance Safe, the Emergency Guardian, the Aave Protocol Guardian and the Aave governance executor. Any of them can cancel a queued operation during its delay, with two exceptions that only the Aave governance executor can cancel:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>A role-change operation: every call is a role grant, revoke or renounce on an Avana contract or the timelock.</li>
            <li>A restoring operation: every call puts back configuration that was already reviewed, namely restoring a previously approved swap route, switching to a listed standby price route, adding a keeper or unfreezing an address.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            This stops a guardian or the governance Safe from blocking its own removal, a replacement&apos;s appointment, or a repair that brings back liquidation or an address. The mark needs every call in the batch to qualify: a batch that mixes an upgrade with a role call stays cancellable by every canceller, so a proposer cannot shield a harmful call by adding a role call to it.
          </p>
          <div className="doc-topic type-doc-body">
            Example: a batch that revokes the Emergency Guardian&apos;s pause role and also unpauses a Hub is not a role change, so the Emergency Guardian may cancel it. Governance then schedules the revocation on its own. The Emergency Guardian&apos;s cancel of that operation reverts, and only the Aave governance executor can stop it. Removing a guardian therefore takes at most one normal delay.
          </div>
        </section>

        <section id="guardians" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Guardians</h2>
          <p className="mb-4 type-doc-body">
            Both guardians, the Emergency Guardian (3-of-5 per chain) and the Aave Protocol Guardian, hold the same two Avana roles on the chain&apos;s MarketRegistry and the canceller role on the timelock. Their powers are immediate and either stop new activity or put a route reviewed at listing in service.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Guardians can</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Guardians cannot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">Freeze or pause one Hub or every Hub of the chain, with a pause reason</td>
                  <td className="px-4 py-2">Upgrade a contract or change a parameter</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Unfreeze and unpause (pause role only)</td>
                  <td className="px-4 py-2">Choose a price source or route not reviewed at listing</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Freeze up to 20 addresses per rolling 24 hours</td>
                  <td className="px-4 py-2">Unfreeze an address, add or remove a keeper or route</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Trip and reset market and debt circuit breakers</td>
                  <td className="px-4 py-2">Schedule an operation or change a role</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Switch a token to its standby price route or standby second source</td>
                  <td className="px-4 py-2">Cancel a role-change or restoring operation</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Cancel queued operations</td>
                  <td className="px-4 py-2">Stop liquidation, repayment or any exit, or move funds</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            The Aave Protocol Guardian&apos;s Aave-side reserve freeze and pause are not Avana roles and last until the Aave DAO reverses them. The deployment AIP asks the DAO to pause Avana reserves only for exploits and to unpause within the 48-hour incident window that caps are sized for.
          </p>
          <p className="mt-4 type-doc-body">
            The full emergency mechanics are described on this page:{" "}
            <Link href="/developers/safety/emergency-controls" className="text-type-accent hover:underline">Emergency Controls</Link>.
          </p>
        </section>

        <section id="role-table" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Role Table</h2>
          <p className="mb-4 type-doc-body">
            Role constants are defined in AvanaRoles and OpenZeppelin. Keepers, the depositor of record and the fixed contract callers are identified by address checks, not roles.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Role</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Holder</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Powers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">DEFAULT_ADMIN_ROLE</code> (timelock)</td>
                  <td className="px-4 py-2">The AvanaTimelock itself only</td>
                  <td className="px-4 py-2">Grants and revokes the timelock&apos;s proposer, canceller, executor and DAO canceller roles, each as a normal-delay role change</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">DEFAULT_ADMIN_ROLE</code> (each upgradeable contract)</td>
                  <td className="px-4 py-2">The AvanaTimelock only</td>
                  <td className="px-4 py-2">Grants and revokes roles on that contract; the application admin role can go only to the timelock</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">APPLICATION_ADMIN</code></td>
                  <td className="px-4 py-2">The AvanaTimelock only, on every upgradeable contract</td>
                  <td className="px-4 py-2">UUPS upgrades, every parameter setter, fee changes, the three deployment operations and activation, price sources and swap routes, the flash source, keepers, offboarding, pause and freeze and their lifts, address freeze and unfreeze, breaker trips and resets, standby switches, and grants of the guardian roles</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">PROPOSER_ROLE</code></td>
                  <td className="px-4 py-2">Governance Safe and the Aave governance executor; never fewer than two holders</td>
                  <td className="px-4 py-2">Schedule operations; no other power</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">CANCELLER_ROLE</code></td>
                  <td className="px-4 py-2">Governance Safe, Emergency Guardian, Aave Protocol Guardian, Aave governance executor</td>
                  <td className="px-4 py-2">Cancel any queued operation that is neither a role change nor a restoring operation</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">DAO_CANCELLER_ROLE</code></td>
                  <td className="px-4 py-2">Aave governance executor only</td>
                  <td className="px-4 py-2">Cancel role-change and restoring operations; the same executor alone can call the standby-switch undo on the MarketRegistry</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">EXECUTOR_ROLE</code></td>
                  <td className="px-4 py-2">Governance Safe; open to anyone while public execution is on</td>
                  <td className="px-4 py-2">Execute a ready, unexpired operation</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">APPLICATION_PAUSE_GUARDIAN</code></td>
                  <td className="px-4 py-2">Emergency Guardian, Aave Protocol Guardian</td>
                  <td className="px-4 py-2">Pause a Hub or every Hub with a reason, unpause, unfreeze, reset market and debt breakers, switch to a standby route, immediately</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">APPLICATION_FREEZE_GUARDIAN</code></td>
                  <td className="px-4 py-2">Emergency Guardian, Aave Protocol Guardian</td>
                  <td className="px-4 py-2">Freeze a Hub or every Hub, freeze an address, trip a market or debt breaker, immediately; a key with only this role can never undo a stop</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">TIMELOCK</code> (immutable address)</td>
                  <td className="px-4 py-2">The AvanaTimelock</td>
                  <td className="px-4 py-2">Return a stray position from an LPVault and deploy vault tokens through the VaultTokenFactory</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Keepers (address list, not a role)</td>
                  <td className="px-4 py-2">Approved, unfrozen addresses on LPVaultSwap</td>
                  <td className="px-4 py-2">Call the keeper liquidation entry point; anyone can use the permissionless one</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="mt-6 mb-2 type-doc-subsection-title">Aave-side roles Avana depends on</h3>
          <p className="mb-4 type-doc-body">Avana holds no role on any Aave contract. These Aave roles bound what happens to Avana&apos;s reserves:</p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Role</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Holder</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Powers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">Reserve freeze and pause</td>
                  <td className="px-4 py-2">Aave Protocol Guardian and the Aave DAO</td>
                  <td className="px-4 py-2">One-way freeze and pause of a reserve; only the DAO lifts them</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">SPOKE_USER_POSITION_UPDATER_ROLE</code></td>
                  <td className="px-4 py-2">Aave DAO executor</td>
                  <td className="px-4 py-2">Refresh the risk premium and dynamic configuration of Avana proxies</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">COVERAGE_ROLE</code></td>
                  <td className="px-4 py-2">The DAO-delegated coverage caller</td>
                  <td className="px-4 py-2">Cover recorded deficits of allowlisted CDP Spokes from each Avana Umbrella</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">RESERVE_ADMIN_ROLE</code></td>
                  <td className="px-4 py-2">Aave DAO executor</td>
                  <td className="px-4 py-2">Each Avana Umbrella&apos;s CDP Spoke allowlist, minimum balance and withdrawals after the 14-day delay</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="delay-classes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Delay Classes</h2>
          <p className="mb-4 type-doc-body">Each action has a fixed delay class:</p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Action</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Delay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">Upgrade an upgradeable contract: AaveAdapter, RiskModule, MarketRegistry, ParameterStore, an LPOracle, a DebtOracle or LPVaultSwap</td>
                  <td className="px-4 py-2">5 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">The deployment operations (new CDP Spoke, collateral market listing, debt reserve) and removal of a debt reserve with nothing drawn</td>
                  <td className="px-4 py-2">5 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">New price source or standby route, restoring the listed price routes after a standby switch, new or changed swap route, flash source, cross-Hub lines, fee share or fee recipient</td>
                  <td className="px-4 py-2">5 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Loosen a risk parameter, add a keeper, unfreeze an address, unfreeze, unpause or reset a breaker through the timelock, change the timelock&apos;s own settings</td>
                  <td className="px-4 py-2">5 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Role changes on any Avana contract or the timelock (cancellable only by the Aave governance executor)</td>
                  <td className="px-4 py-2">5 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Market activation, cancelling a registration, starting a market&apos;s offboarding</td>
                  <td className="px-4 py-2">12 hours</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Tighten a parameter, disable a swap route, restore a previously approved route, remove a keeper down to the keeper floor of 1</td>
                  <td className="px-4 py-2">12 hours</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Freeze, pause, address freeze, breaker trip or standby switch through the timelock, so the governance Safe can stop new activity if both guardians are unavailable</td>
                  <td className="px-4 py-2">12 hours</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Guardian freeze, pause, unfreeze, unpause, address freeze, breaker trips and resets, standby switches; the Aave executor&apos;s standby undo; cancel</td>
                  <td className="px-4 py-2">Immediate</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Hub and Spoke configuration, credit lines, Avana Umbrella settings</td>
                  <td className="px-4 py-2">Aave governance</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            A new market is listed with one normal-delay batch, so the 5-day delay is its public review, enforced on-chain. The batch deploys the vault token, registers the market with its exact pool and range, sets its initial parameters and caps, and records its price and swap routes. Activation follows at the short delay and reverts unless the Aave-side listing matches.
          </p>
        </section>

        <section id="parameter-changes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Parameter Changes</h2>
          <p className="mb-4 type-doc-body">Every Avana-side risk parameter changes through one process:</p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Publish: the risk service providers publish the change with its cap-sizing calculation, covering the 48-hour incident term and the tail term for one pool token going to zero.</li>
            <li>Build: the governance Safe builds the operation and every signer follows the signing procedure below.</li>
            <li>Schedule: the short delay applies only when every call is a tightening; one loosening call makes the whole batch wait 5 days.</li>
            <li>Review: monitoring alerts on the scheduled call, and any canceller can cancel during the delay.</li>
            <li>Execute: anyone executes it within 14 days of its ready time. Each setter re-checks its bounds at execution, so a value that became unsafe while queued reverts.</li>
            <li>Confirm: the live-configuration check and the Lens cap headroom confirm the result.</li>
          </ul>
          <h3 className="mb-2 type-doc-subsection-title">Loosening limits</h3>
          <p className="mb-4 type-doc-body">
            Each parameter has separate tighten and loosen setters. A tightening must be strictly safer and stays within the hard and liveness bounds, with no step limit. A loosening is limited in size and frequency:
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Parameter</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Largest loosening step</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">Any USD cap (market, token, depositor, top-up slice)</td>
                  <td className="px-4 py-2">+50%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">slippageAllowanceBps</code></td>
                  <td className="px-4 py-2">+25 bps</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Optional per-market hard health floor (off at launch)</td>
                  <td className="px-4 py-2">−0.03</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Every step-limited parameter</td>
                  <td className="px-4 py-2">At most one loosening per normal delay</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 mb-4 type-doc-body">
            For example, from a market cap of $2,000,000 one loosening reaches at most $3,000,000, and the next loosening of that cap executes no earlier than 5 days later, each with its own public review. A larger step reverts with <code className="type-doc-inline-code">LoosenStepTooLarge</code>, and an early one with <code className="type-doc-inline-code">LoosenTooSoon</code>. The stablecoin band limits, the grace duration and the grace health factor change only at the normal delay in both directions.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Collateral-factor changes</h3>
          <p className="type-doc-body">
            The collateral factor itself is an Aave value changed by AIP. For a cut, Avana first tightens the pool risk factor at the short delay, so the drift check stops new borrowing while Aave&apos;s factor is above the new expected one, and the Aave payload then lowers it. For a raise, the Avana change at the normal delay executes first. Aave-side values such as the bonus curve, target health factor, caps, credit lines and Umbrella settings change only through Aave governance.
          </p>
        </section>

        <section id="keepers" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Keeper List</h2>
          <p className="mb-4 type-doc-body">
            Keepers hold no role: LPVaultSwap keeps a list of approved addresses. Avana runs its own keeper on each chain and pays its gas. The list changes only through the timelock:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Adding a keeper waits 5 days and only the Aave governance executor can cancel it, so no guardian can block a replacement.</li>
            <li>Removing a keeper waits 12 hours and reverts if it would leave fewer active keepers than the keeper floor of 1.</li>
            <li>At most 32 keepers can be approved per chain.</li>
            <li>A guardian can freeze a misbehaving keeper&apos;s address at once, even the last active one. While no active keeper remains, new borrowing on the chain stops, and anyone can still liquidate through the permissionless entry point.</li>
            <li>Keeper keys are rotated by adding the new key first (5 days) and removing the old one after (12 hours).</li>
          </ul>
        </section>

        <section id="aave-process" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Aave DAO Process</h2>
          <p className="mb-4 type-doc-body">Avana reaches the Aave DAO through the standard governance path:</p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Step</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">What it decides</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">ARFC</td>
                  <td className="px-4 py-2">Community support for a technical and risk assessment of Avana with Aave DAO service providers on Ethereum and Base, and for preparing a capped GHO credit line request</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Snapshot</td>
                  <td className="px-4 py-2">Confirms support for the assessment</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Deployment ARFC and Snapshot</td>
                  <td className="px-4 py-2">Lists each CDP Spoke as a standard Aave V4 Spoke with the three required reserve settings, grants the flash-borrower role on each chain&apos;s Aave V3 Pool, sets each Spoke&apos;s liquidation settings, registers an Avana Umbrella for GHO on each Stable LP Hub, and adds the Aave executor and Aave Protocol Guardian to each AvanaTimelock</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Funding ARFC and Snapshot</td>
                  <td className="px-4 py-2">Sets the GHO credit line and draw caps per chain, the coverage ratio and minimum of each Avana Umbrella, and a flat GHO rate at or above the Core Hub GHO base rate</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">AIPs</td>
                  <td className="px-4 py-2">Put both approved proposals on-chain; on Base through the DAO&apos;s Base executor</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 mb-4 type-doc-body">
            Neither follow-up ARFC activates borrowing on its own: launch needs both, plus every security and risk prerequisite. Each chain beyond Ethereum and Base comes through its own ARFC.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Credit line request</h3>
          <p className="mb-4 type-doc-body">
            The request is an initial credit line of 2,000,000 GHO on the Ethereum Stable LP Hub. The Base line is set in the funding ARFC, within the GHO flash liquidity of the Aave V3 Base Pool and the depth of the Base swap routes. Capacity scales toward 10,000,000 GHO only as live performance criteria are met, and each increase needs governance approval. Each CDP Spoke&apos;s draw cap stays within its chain&apos;s flash liquidity, swap-route depth and the Umbrella coverage bound.
          </p>
          <p className="type-doc-body">
            Avana recommends a target health factor of 1.10 and a minimum liquidation bonus of at least 2% for each CDP Spoke. The Aave DAO decides both in the listing AIP.
          </p>
        </section>

        <section id="key-security" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Multisig Key Security</h2>
          <p className="mb-4 type-doc-body">
            This standard applies on each chain to the governance Safe, the Emergency Guardian, the Avana treasury Safe and the keeper operators.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Every Safe signer key is on a dedicated hardware wallet that shows EIP-712 typed data on the device. No hot keys, browser-extension keys or shared devices. Keeper operators keep keys in their own HSM or KMS.</li>
            <li>At most 3 of the 7 governance Safe signers belong to Avana Labs, and the signers span at least 3 independent organisations and 3 jurisdictions.</li>
            <li>The Emergency Guardian has 5 different people across at least 3 time zones.</li>
            <li>No person signs on two Safes of the same chain, and the Aave Protocol Guardian&apos;s signers are disjoint from both.</li>
            <li>For every transaction each signer decodes the calldata from the raw transaction, recomputes the Safe transaction hash against the device, simulates it on a fork and checks that its required delay matches the intended class. Two signers also check every target against the deployment manifest.</li>
            <li>Every signer sends a signed liveness message each month, and monitoring alerts when fewer than threshold + 1 signers answer within 72 hours.</li>
            <li>A departing or suspect signer is replaced within 72 hours, and every key is rotated at least every 24 months.</li>
            <li>A delay module makes every owner and threshold change of a governance Safe wait 48 hours.</li>
            <li>Each quarter both chains&apos; Safes rehearse on a fork: pause and unpause, address freeze, standby switch, breaker trip and reset, and a schedule-and-cancel drill.</li>
          </ul>
        </section>

        <section id="handover" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Handover and Fallback</h2>
          <p className="mb-4 type-doc-body">
            The Aave governance executor is a second proposer beside the governance Safe on each chain. If a Safe loses its quorum or renounces its role by mistake, repairs still reach the timelock through Aave governance, which every canceller watches. If the governance Safe stops acting, every contract keeps running on its current configuration, queued operations stay executable within their grace window, the guardians keep their immediate powers and the Aave DAO keeps every Aave-side control.
          </p>
          <p className="type-doc-body">
            Handover to the Aave DAO is one role-change operation per chain: it grants the executor role to the Aave governance executor, grants the proposer and executor roles to a second DAO-named holder, and revokes the governance Safe&apos;s roles last, so the proposer set never falls below two. The guardian and canceller roles are unchanged, and the admin roles stay with the timelock.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Per-chain AvanaTimelock, proposers, cancellers, guardians, roles, delay classes and the Aave DAO approval process."
        sectionColor="rose"
      />
    </div>
  ))
}
