import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'safety/contracts', {
    title: "Contract Security",
    description: "Which Avana contracts are upgradeable behind the AvanaTimelock and which are immutable, the trust boundaries between them, and how far a hostile upgrade can reach.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "upgradeability", title: "Upgradeable and Immutable" },
  { id: "upgrade-path", title: "Upgrade Path" },
  { id: "trust-levels", title: "Trust Levels" },
  { id: "trust-boundaries", title: "Trust Boundaries" },
  { id: "blast-radius", title: "Hostile Upgrade Blast Radius" },
  { id: "lock", title: "Reentrancy Lock" },
  { id: "exits", title: "Exits Are Never Blocked" },
]

const boundaries = [
  { boundary: "Borrower → AaveAdapter", crosses: "Pledge, borrow, withdraw, repay-all, liquidity removal, re-credit and repay-with-collateral arguments", checked: "The proxy is resolved from the caller, the CDP Spoke and the market, never from a passed address; the Spoke and market must be registered and active; deadline, borrow nonce, minimum health factor and spend limits; the borrow receiver cannot be an Avana or Aave contract; pause state and address freeze for new activity; every borrow-side check runs in the RiskModule." },
  { boundary: "Borrower → LPVault and Collateralization", crosses: "The pledged position; fee collection and zero-credit release", checked: "Each LPVault accepts only its bound position manager and factory; the pool is derived on-chain, never supplied by the caller; the position must match a listed market's exact pool and range; fees and positions go only to the depositor of record." },
  { boundary: "RiskModule, MarketRegistry, ParameterStore → AaveAdapter and Collateralization", crosses: "Yes-or-no answers, the pledge charge, the post-borrow health factor, the pause state, parameters", checked: "Consulted only for pledge eligibility and borrow-side checks; values are bounded by hard limits in the setters; none of them is read by repay, debt-free withdrawal or fee collection." },
  { boundary: "LPVaultSwap → Collateralization and AaveAdapter", crosses: "Seized vault tokens, seizure and pending settlements, burns of seized units", checked: "Accepted only from LPVaultSwap while it holds the Lock; Collateralization checks that the account's supply shares and the token supply both fell by exactly the seized amount before releasing liquidity." },
  { boundary: "Avana ↔ Aave V4 Hubs and CDP Spokes", crosses: "Supply, borrow, repay, withdraw and liquidation calls; account data", checked: "Aave is trusted for debt and health; Avana does not trust its configuration to stay as listed, so the drift check re-reads the three required reserve settings and other values on new activity and stops new risk when they change." },
  { boundary: "Third parties → Aave Spoke and Hub on Avana reserves", crosses: "Direct liquidation calls and Hub functions on vault-token reserves", checked: "A vault token moves only on its fixed paths: mint to a registered proxy, supply to and withdrawal from the home Hub, seizure to LPVaultSwap; a direct liquidation by anyone else reverts on the seizure transfer." },
  { boundary: "AMM position managers and pools → LPVaults, LPOracles, RiskModule", crosses: "Position data, liquidity units, fees, principal on removal, TWAP observations", checked: "Position manager and factory are immutables of each LPVault; calls revert while the AMM's reentrancy lock is held; valuation uses Chainlink prices only, the pool TWAP is a guard." },
  { boundary: "Chainlink → LPOracle and DebtOracle", crosses: "Token USD prices and timestamps", checked: "Per leg: positive answer, valid and non-future timestamp, age within heartbeat plus 1,800 seconds, inside the aggregator's bounds, decimals pinned at listing; any failure moves the market to a stricter price state." },
  { boundary: "LPOracle → Aave Spoke", crosses: "The vault-token price used for health and seizure sizing", checked: "Returns 8 decimals for life, never reverts and never returns 0, and rounds down. Once a market is Expired it serves 1 unit (10⁻⁸ USD per vault token), so Aave counts the collateral as worthless while exits keep working." },
  { boundary: "Aave V3 Pool flash source → LPVaultSwap", crosses: "Flash-borrowed debt asset and the callback", checked: "Available liquidity and a premium at most maxFlashFeeBps checked before the loan; the callback reverts unless it comes from the chain's Aave V3 Pool with LPVaultSwap as initiator." },
  { boundary: "Swap-route pools → swap routes and LPVaultSwap", crosses: "Debt asset returned for unwound tokens", checked: "Routes are fixed per market, token and debt asset, added at the normal delay; each leg has an oracle-derived minimum output and the total must reach the recovery floor; routes never trade through the pool being unwound." },
  { boundary: "Keepers and permissionless callers → LPVaultSwap", crosses: "Liquidation arguments: account, market, debt reserve, amounts, route mode, deadline, minimum payout, shortfall limit", checked: "Approved, unfrozen keeper for the keeper path; registered proxy and approved debt reserve; fresh prices for the seized market and the repaid debt; every input can only make a call smaller or revert; the payout always goes to the caller." },
  { boundary: "Governance → AvanaTimelock → Avana contracts", crosses: "Upgrades, deployment operations, routes, price sources, parameters, keepers, roles", checked: "Every privileged call executes from the chain's timelock; required delay read from calldata; cancel rights; hard bounds and loosening steps re-checked at execution." },
  { boundary: "Guardians → pause state, address freeze, breakers, standby routes", crosses: "Freeze, pause, unfreeze, unpause, address freeze, breaker trips and resets, standby switch", checked: "Each power stops new activity or puts a reviewed route in service; none reaches repay, debt-free withdrawal, fee collection or liquidation; at most 20 address freezes per caller per rolling 24 hours." },
  { boundary: "Aave DAO → Aave configuration of Avana markets", crosses: "Collateral factors, caps, flags, halts, liquidation settings, price sources", checked: "Drift blocks new risk; a collateral factor of 0 is forbidden while accounts hold the reserve." },
  { boundary: "Tokens and debt assets → Avana", crosses: "Transfers during fee collection, borrow, repay, settlement and swaps", checked: "Fee-on-transfer, rebasing and hook tokens are not listed; SafeERC20 everywhere; amounts measured by balance change; issuer probes for pause and transfer-fee switches." },
  { boundary: "Donations and stray assets → Avana contracts", crosses: "Dust, vault tokens, pool tokens, positions", checked: "Balance-change checks make donations inert; an uncredited position returns only through the timelock." },
  { boundary: "Avana Umbrella → Hub deficit", crosses: "Deficit elimination amounts", checked: "Each Coverage Spoke covers only allowlisted CDP Spokes, only in its own asset, never beyond the recorded deficit or its funded balance." },
  { boundary: "Off-chain services → wallets and keepers", crosses: "Intents, displayed positions, health factors, candidate lists", checked: "Calldata is built from a bundled, verified deployment manifest and never taken from a hosted service; the wallet shows receiver and amount before signing; users and keepers can call contracts directly." },
  { boundary: "LPVaultSwap → payout escrow", crosses: "Payouts a token refuses to deliver", checked: "Deposits only from LPVaultSwap under the Lock; each credit is claimable only by its recipient." },
]

export default async function ContractsArchitecturePage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "safety/contracts", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Contract Security"
          description="Which contracts can be upgraded and which cannot, the trust boundaries between them, and how far a hostile upgrade can reach."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            Avana does not fork, copy or modify Aave V4 code. Every Avana Hub and CDP Spoke is a standard Aave V4 contract owned by the Aave DAO, and all Avana-specific logic sits in Avana&apos;s own contracts. Those contracts are split by what they are trusted for: custody, the backing ledger and the seizure checks are immutable, while policy, pricing and liquidation orchestration are upgradeable behind each chain&apos;s AvanaTimelock.
          </p>
          <p className="mb-4 type-doc-body">
            The split bounds what a faulty or hostile upgrade can do. Immutable code trusts upgradeable code only for yes-or-no answers, prices and values within bounds, so a bad upgrade can block new activity or misprice within limits, but cannot send a position to anyone but its depositor, release liquidity it did not burn, or stop a borrower from leaving.
          </p>
          <p className="type-doc-body">
            The full contract list with addresses and interfaces is on this page:{" "}
            <Link href="/developers/reference/contracts" className="text-type-accent hover:underline">Reference: Contracts</Link>.
          </p>
        </section>

        <section id="upgradeability" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Upgradeable and Immutable</h2>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Form</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Contracts</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Why</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">Upgradeable (UUPS behind the AvanaTimelock)</td>
                  <td className="px-4 py-2">AaveAdapter (one per chain), RiskModule, MarketRegistry, ParameterStore, each LPOracle, each DebtOracle, LPVaultSwap</td>
                  <td className="px-4 py-2">Borrower actions, eligibility checks, prices, parameters, the pause and breaker state, and liquidation orchestration may need fixes or new integrations. Each upgrade waits 5 days in public and any canceller can stop it.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Immutable</td>
                  <td className="px-4 py-2">Each LPVault (one per AMM protocol per chain), Collateralization, vault tokens and the VaultTokenFactory, every PositionProxy and the ProxyManager, the Lock, swap-route versions, the flash source implementations, the payout escrow (InKindEscrow), the AvanaTimelock, the Lens</td>
                  <td className="px-4 py-2">These hold the rules that bound every upgrade: positions return only to their depositor of record, the backing ledger and exposure counters, the seizure share and supply checks, the rule that seized vault tokens go only to LPVaultSwap, the flash-loan checks, escrowed payouts and the timelock&apos;s own delays and roles.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Aave DAO contracts</td>
                  <td className="px-4 py-2">Every Avana Hub, CDP Spoke, Lend Spoke and Avana Umbrella (Coverage Spoke)</td>
                  <td className="px-4 py-2">Standard Aave V4 contracts, upgraded and configured only by Aave governance. Avana Umbrella Coverage Spokes are not upgradeable.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 mb-4 type-doc-body">
            An immutable component is replaced by deploying a new version and pointing the upgradeable layer at it through the timelock: a new swap route or flash source at the normal delay, or, for an LPVault or ledger fault, offboarding the affected markets and relisting them on fixed contracts. A PositionProxy has no logic, no implementation pointer and no upgrade path; it executes only the AaveAdapter&apos;s calls, so account logic changes only with an AaveAdapter upgrade.
          </p>
          <p className="type-doc-body">
            The Lens is a read-only periphery contract with no state and no admin. No core contract calls it or depends on what it returns, so it can be replaced at any time.
          </p>
        </section>

        <section id="upgrade-path" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Upgrade Path</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Each upgradeable contract is a UUPS implementation behind an ERC-1967 proxy. Its upgrade authorization requires APPLICATION_ADMIN, which only the AvanaTimelock holds; a grant of that role or the default admin role to any other account reverts.</li>
            <li>No Avana contract has an Ownable owner, a ProxyAdmin or an AccessManager authority. Immutable contracts accept their few privileged calls only from the timelock address fixed in their bytecode.</li>
            <li>An upgrade is a timelock operation at the normal delay of 5 days, never below 4. The governance Safe, the Emergency Guardian, the Aave Protocol Guardian and the Aave governance executor can each cancel it during the delay.</li>
            <li>Each upgradeable proxy is initialized in its deployment transaction with roles only for the timelock, and the deployer holds no role once deployment ends.</li>
            <li>Before each upgrade proposal the invariant suite reruns on a fork after executing the upgrade, and CI compares the storage layout with the deployed version.</li>
            <li>A fork test enumerates every external function of every deployed implementation and fails on any state-changing function that is not in the restricted-function matrix or the list of public entry points.</li>
            <li>The live-configuration check compares every role holder, proxy slot and timelock setting with the deployment manifest after every governance event.</li>
          </ul>
          <p className="mt-4 type-doc-body">
            Roles, delays and cancel rules are described on this page:{" "}
            <Link href="/developers/safety/governance" className="text-type-accent hover:underline">Governance and Timelock</Link>.
          </p>
        </section>

        <section id="trust-levels" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Trust Levels</h2>
          <p className="mb-4 type-doc-body">
            A component may rely on a component at a higher level, and only for what that level is trusted for.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Level</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Components</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Trusted for</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Not trusted for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">1. Immutable Avana code</td>
                  <td className="px-4 py-2">LPVaults, Collateralization, vault tokens, VaultTokenFactory, Lock, swap routes, flash source implementations, payout escrow, PositionProxies, ProxyManager, AvanaTimelock</td>
                  <td className="px-4 py-2">Custody and return of positions, the backing ledger, seizure checks, the seizure-recipient rule, flash-loan checks, escrowed payouts, timelock delays and roles</td>
                  <td className="px-4 py-2">Nothing beyond their own code</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">2. Upgradeable custody code behind the 5-day timelock</td>
                  <td className="px-4 py-2">AaveAdapter</td>
                  <td className="px-4 py-2">Executing borrower actions, minting exactly the credited units and burning exactly the released or seized units, proxy creation and registration, call bounds</td>
                  <td className="px-4 py-2">Receiving seized collateral, changing a proxy&apos;s code, raising any Aave cap, spending an Avana Umbrella, acting on another chain</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">3. Upgradeable policy and settlement code</td>
                  <td className="px-4 py-2">RiskModule, MarketRegistry, ParameterStore, LPOracles, DebtOracles, LPVaultSwap</td>
                  <td className="px-4 py-2">Borrow-side and pledge checks, prices and price states, parameters and bounds, pause and breaker state, markets and routes, liquidation orchestration</td>
                  <td className="px-4 py-2">Minting, burning, releasing collateral, registering proxies, acting for a borrower</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">4. Aave V4 and the Aave DAO</td>
                  <td className="px-4 py-2">Hubs, CDP Spokes, Lend Spoke, Coverage Spokes, AaveOracle, the Aave V3 Pool behind the flash source</td>
                  <td className="px-4 py-2">Debt, interest, health factor, liquidation sizing, deficit accounting, debt-asset prices, flash liquidity</td>
                  <td className="px-4 py-2">Keeping Avana&apos;s reserve settings unchanged, which Avana re-checks on-chain</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">5. External protocols and off-chain parties</td>
                  <td className="px-4 py-2">AMMs, Chainlink and second sources, the Base sequencer feed, token issuers, swap-route pools, keepers, the backend and indexer, the web app, Safe signers</td>
                  <td className="px-4 py-2">Only what each boundary below states, after its checks</td>
                  <td className="px-4 py-2">Anything else</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="trust-boundaries" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Trust Boundaries</h2>
          <p className="mb-4 type-doc-body">
            Every place where data, assets or authority cross from one trust domain into another, and what is checked at the crossing:
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Boundary</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">What crosses</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">What is checked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {boundaries.map((b) => (
                  <tr key={b.boundary}>
                    <td className="px-4 py-2">{b.boundary}</td>
                    <td className="px-4 py-2">{b.crosses}</td>
                    <td className="px-4 py-2">{b.checked}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            When an external dependency fails, Avana stops new activity and keeps exits open: a failing price route is replaced by its reviewed standby, a failing swap route by the market&apos;s backup route, a short flash source by caller-funded liquidation, and an outage of Avana&apos;s backend or app by calling the contracts directly.
          </p>
        </section>

        <section id="blast-radius" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Hostile Upgrade Blast Radius</h2>
          <p className="mb-4 type-doc-body">
            If an upgradeable component&apos;s implementation is faulty or hostile, its reach is bounded by the immutable layer and by Aave:
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Component</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Can</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Cannot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">AaveAdapter</td>
                  <td className="px-4 py-2">Borrow against every proxy of its chain up to each draw cap, withdraw supplied vault tokens, mint within the Hub&apos;s add cap, burn vault tokens, register proxies, spend allowances granted to it, pledge positions whose owners approved an LPVault</td>
                  <td className="px-4 py-2">Send a position to anyone but its depositor of record, receive seized vault tokens, change an existing proxy, raise any Aave cap, spend an Avana Umbrella, act on another chain</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">RiskModule</td>
                  <td className="px-4 py-2">Approve borrows it should refuse, or block borrowing and pledges</td>
                  <td className="px-4 py-2">Borrow past Aave&apos;s health factor of 1 or the draw caps; touch exits</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">LPVaultSwap</td>
                  <td className="px-4 py-2">Liquidate accounts Aave deems liquidatable, at Aave&apos;s sizing</td>
                  <td className="px-4 py-2">Release liquidity it did not burn, because Collateralization checks the share and supply drop; draw any Avana budget, because none exists</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">MarketRegistry and ParameterStore</td>
                  <td className="px-4 py-2">Misprice gates within bounds, list bad routes, pause, freeze addresses, trip breakers or keep them latched</td>
                  <td className="px-4 py-2">Move funds, or block repayment, debt-free withdrawal or fee collection, which read neither contract</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">DebtOracle</td>
                  <td className="px-4 py-2">Overprice debt, making accounts liquidatable early within Aave&apos;s sizing and bonus, or underprice it</td>
                  <td className="px-4 py-2">Let accounts borrow past each draw cap or the RiskModule&apos;s own debt-price gates</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="mt-6 mb-2 type-doc-subsection-title">Hostile-component tests</h3>
          <p className="mb-4 type-doc-body">
            The required audit tests install a hostile AaveAdapter, LPVaultSwap, RiskModule, MarketRegistry and ParameterStore, or PositionProxy implementation through the real AvanaTimelock path at the 5-day normal delay, and show that each effect stays within that contract&apos;s stated blast radius:
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>The immutable LPVault still returns an NFT only to its depositor of record.</li>
            <li>Collateralization still rejects a seizure without the matching drop in the account&apos;s supply shares and in the vault-token supply.</li>
            <li>Borrowing stays within Aave&apos;s health factor and the draw caps.</li>
          </ul>
        </section>

        <section id="lock" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Reentrancy Lock</h2>
          <p className="mb-4 type-doc-body">
            Each chain has one immutable Lock shared by every Avana contract that moves assets or changes accounting. It has exactly two members, the AaveAdapter and LPVaultSwap. Every outer state-changing entry point of either acquires it first, and any attempt to start a second outer entry point in the same call tree reverts.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Every Collateralization entry point and every value-moving LPVault function is reachable only inside a call tree one of the two members opened, and only from its expected caller. The custody contracts check the holder and never acquire.</li>
            <li>Swap-route and flash callbacks are accepted only from the route&apos;s fixed pool or the chain&apos;s Aave V3 Pool while LPVaultSwap holds the Lock.</li>
            <li>Vault tokens have no transfer hooks, and position release uses a transfer with no receiver callback.</li>
            <li>A shared lock replaces per-contract guards: a guard per contract cannot stop a call that re-enters through a different Avana contract.</li>
            <li>The Lock is not a pause or an access list. It never blocks a protocol action at the start of a transaction, and every contract still follows checks-effects-interactions.</li>
          </ul>
        </section>

        <section id="exits" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Exits Are Never Blocked</h2>
          <p className="mb-4 type-doc-body">
            Repayment, fee collection, debt-free withdrawal, zero-credit release, pending settlement and liquidation read no pause state, breaker or address freeze, and no Avana contract has a contract-wide pause. Leaving needs one repay per debt reserve, or one repay-all-and-withdraw, and one withdrawal per remaining position, each a single transaction.
          </p>
          <p className="mb-4 type-doc-body">
            Every change that could harm a borrower, such as an upgrade of the AaveAdapter, RiskModule or LPVaultSwap, a new flash source, a looser parameter, a new swap route or a role change, waits the normal delay. The 4-day minimum covers a 3-day borrower reaction time plus those few transactions; on Base it also covers the 12-hour forced-inclusion delay for a borrower who must send a transaction from L1 while the sequencer is down.
          </p>
          <div className="doc-topic type-doc-body">
            Example: an AaveAdapter upgrade on Ethereum is scheduled at t = 1,800,000,000 and is ready at 1,800,432,000. A borrower with GHO and USDC debt on one market and three positions there sends one repay-all-and-withdraw call and two withdrawals within the first hour, long before the upgrade can execute.
          </div>
          <p className="mt-4 type-doc-body">
            The only exception is on the Aave side: a Hub halt of a CDP Spoke or an Aave pause of a reserve stops repayment and liquidation on it. The deployment AIP asks the Aave DAO to contain a Spoke with a reserve freeze and zero draw caps instead, which leave every exit open.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Upgradeable and immutable Avana contracts, trust boundaries, hostile-upgrade blast radius and exit safety."
        sectionColor="rose"
      />
    </div>
  ))
}
