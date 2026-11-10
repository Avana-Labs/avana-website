import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'architecture/custody', {
    title: "Custody and Vault Tokens",
    description: "How Avana holds LP positions, records their backing and represents them on Aave V4: LPVault, Collateralization, vault tokens, PositionProxy, ProxyManager and the Lock.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "lp-vault", title: "LPVault" },
  { id: "collateralization", title: "Collateralization" },
  { id: "vault-tokens", title: "Vault Tokens" },
  { id: "vault-token-factory", title: "VaultTokenFactory" },
  { id: "position-proxy", title: "PositionProxy" },
  { id: "proxy-manager", title: "ProxyManager" },
  { id: "lock", title: "Lock" },
  { id: "backing-invariant", title: "Backing Invariant" },
  { id: "reconcile-example", title: "Reconcile Example" },
]

export default async function CustodyPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "architecture/custody", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Custody and Vault Tokens"
          description="Aave V4 accepts collateral only as ERC-20 reserves, while an AMM position is an NFT or a pool share. Avana separates custody of the position from the collateral record that Aave sees."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            Seven immutable contract types on each chain hold a pledged position and turn it into Aave collateral. Each AMM protocol has one LPVault that holds its positions. One AMM-neutral Collateralization ledger records how many units each position backs. One vault token per market stands for those units one for one. The AaveAdapter mints vault tokens to the borrower&apos;s PositionProxy for that CDP Spoke and market, and the proxy supplies them to the CDP Spoke. The ProxyManager creates proxies, and the Lock stops one Avana call from re-entering another.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Contract</th><th className="text-left px-4 py-2 type-doc-subsection-title">Instances</th><th className="text-left px-4 py-2 type-doc-subsection-title">Job</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">LPVault</td><td className="px-4 py-2">One per AMM protocol per chain</td><td className="px-4 py-2">Holds every pledged position of its AMM protocol and knows each depositor of record</td></tr>
                <tr><td className="px-4 py-2">Collateralization</td><td className="px-4 py-2">One per chain</td><td className="px-4 py-2">Backing records, credited units, seizure order, exposure counters and the pending-settlement balance</td></tr>
                <tr><td className="px-4 py-2">Vault token</td><td className="px-4 py-2">One per market</td><td className="px-4 py-2">Transfer-restricted, collateral-only ERC-20; one base unit per credited unit</td></tr>
                <tr><td className="px-4 py-2">VaultTokenFactory</td><td className="px-4 py-2">One per chain</td><td className="px-4 py-2">Deploys vault tokens with CREATE3 and keeps the token and LPVault registries</td></tr>
                <tr><td className="px-4 py-2">PositionProxy</td><td className="px-4 py-2">One per wallet, CDP Spoke and market</td><td className="px-4 py-2">The borrower&apos;s Aave account for one market; logic-free</td></tr>
                <tr><td className="px-4 py-2">ProxyManager</td><td className="px-4 py-2">One per chain</td><td className="px-4 py-2">Creates proxies with CREATE2 at predictable addresses</td></tr>
                <tr><td className="px-4 py-2">Lock</td><td className="px-4 py-2">One per chain</td><td className="px-4 py-2">Shared reentrancy lock with two members, the AaveAdapter and LPVaultSwap</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            None of these contracts can be upgraded. Custody of positions, and the rule that a position returns only to its depositor of record, live in the immutable LPVaults and Collateralization, so no upgrade of the AaveAdapter, RiskModule or LPVaultSwap can change them.
          </p>
        </section>

        <section id="lp-vault" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">LPVault</h2>
          <p className="mb-4 type-doc-body">
            An LPVault is the immutable custodian of every pledged position of one AMM protocol on one chain. At launch there are two: the Uniswap v3 LPVault on Ethereum and the Aerodrome Slipstream LPVault on Base. A later AMM protocol, or a later generation of position contracts that an existing LPVault does not name, gets a new LPVault with a new integration ID. Existing LPVaults, Collateralization and the Lock are not redeployed.
          </p>
          <p className="mb-4 type-doc-body">
            An LPVault has no proxy, owner, admin role, pause or rescue function. It takes every address it calls from its constructor immutables, including the AMM protocol&apos;s position manager and factory, so forks and other factory generations are rejected. It reads no pause state, breaker, address freeze or price, so seizures, fee collection and debt-free exits reach it in every state.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">What it does</h3>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Function</th><th className="text-left px-4 py-2 type-doc-subsection-title">Behavior</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">bindMarket</code></td><td className="px-4 py-2">Called by the MarketRegistry at listing. Validates and stores the market&apos;s pool and exact shape once; a stored market never changes.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">receivePosition</code></td><td className="px-4 py-2">Pulls the position from its owner, checks that its pool and shape equal the market&apos;s exactly, records the owner as depositor of record and returns its units.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">depositorOf</code></td><td className="px-4 py-2">The custody map keyed by position key. It is non-zero only while the position backs an open record.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">composition</code></td><td className="px-4 py-2">Token amounts per unit at a given oracle price vector. The LPOracle compiles the same pricing library.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">unwind</code></td><td className="px-4 py-2">Removes exactly the units Collateralization debits and sends only their principal to LPVaultSwap or Collateralization, never a fee owed to the position.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">releaseToDepositor</code></td><td className="px-4 py-2">Removes the units of a partial removal and sends their principal to the depositor of record, with the depositor&apos;s per-token minimums.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">returnPosition</code></td><td className="px-4 py-2">Deletes the custody entry, then sends the whole position, with every live unit and every fee owed to it, to the depositor of record. It takes no recipient.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">collectFees</code></td><td className="px-4 py-2">Pays every separated fee of a custodied position to its depositor of record. Units, supply, caps and debt are unchanged.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">returnStray</code></td><td className="px-4 py-2">Sends a position that reached the LPVault without a record to the owner governance established, through a normal-delay timelock operation.</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="mt-6 mb-2 type-doc-subsection-title">Exact-shape validation</h3>
          <p className="mb-4 type-doc-body">
            For concentrated liquidity, a position is accepted only if its lower and upper ticks equal the market&apos;s range exactly. A position with any other range is refused even if it overlaps, because a narrow range valued at the market&apos;s per-unit price would be overvalued. For example, a market listed at [−10, 10] accepts a position at [−10, 10] and refuses one at [−9, 10]. On Base, a Slipstream position staked in a gauge is refused.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Fees and added liquidity</h3>
          <p className="mb-4 type-doc-body">
            Trading fees belong to the depositor of record. Where the AMM protocol keeps fees apart from the position (Uniswap v3, Aerodrome Slipstream), the depositor collects them at any time, in every pause state, price state and breaker state, and liquidation never takes them. Where the AMM protocol rolls fees into the position, they stay in each unit&apos;s value and return with the position. Liquidity that anyone adds to a custodied position is not credited until the depositor calls the re-credit function, and it is never removed by a seizure; it returns to the depositor with the position.
          </p>
          <p className="mb-4 type-doc-body">
            Only Collateralization can call the functions that move a position, units, principal or fees, and only while the AaveAdapter or LPVaultSwap holds the Lock. The stray-position return is the only recovery path. It runs at the normal timelock delay, requires the Lock to be free, checks the stray condition at execution and can be cancelled by any canceller.
          </p>
        </section>

        <section id="collateralization" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Collateralization</h2>
          <p className="mb-4 type-doc-body">
            Collateralization is the immutable, AMM-neutral backing ledger of every pledged position on one chain. One instance serves every Hub, CDP Spoke, market and AMM integration on the chain. It reaches each AMM protocol only through that protocol&apos;s LPVault, and only the AaveAdapter and LPVaultSwap can call it.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Responsibility</th><th className="text-left px-4 py-2 type-doc-subsection-title">How it works</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Backing records</td><td className="px-4 py-2">One record per pledged position, keyed by integration ID and position key: depositor, proxy, market, credited units, original charge and status. A record never moves to another depositor, proxy or market.</td></tr>
                <tr><td className="px-4 py-2">Credited units</td><td className="px-4 py-2">The units the LPVault reports after it takes custody, less units removed by seizures and partial removals, plus units added by re-credit. The AaveAdapter mints exactly this number of vault-token base units.</td></tr>
                <tr><td className="px-4 py-2">Record limit</td><td className="px-4 py-2">At most 16 open records per account and market. A 17th pledge reverts, rescue top-ups included; the borrower adds to an existing record with re-credit instead.</td></tr>
                <tr><td className="px-4 py-2">Largest-first seizure list</td><td className="px-4 py-2">Each account keeps its records ordered by credited units, largest first. A seizure walks the list from the head and stops when the seized units are covered, so it touches only the records it debits.</td></tr>
                <tr><td className="px-4 py-2">Exposure counters</td><td className="px-4 py-2">Market counters per vault token, and token and depositor counters keyed by Hub. Adding a CDP Spoke or market never multiplies a Hub-wide cap.</td></tr>
                <tr><td className="px-4 py-2">Pending-settlement balance</td><td className="px-4 py-2">Token amounts removed for vault tokens that Aave seized but that were never settled. They keep those vault tokens backed until anyone calls the pending settlement.</td></tr>
                <tr><td className="px-4 py-2">Rescue units</td><td className="px-4 py-2">Units added by a rescue top-up. They count fully in Aave&apos;s health factor and liquidation, and are valued at zero when Avana checks a new borrow.</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="mt-6 mb-2 type-doc-subsection-title">Cap counters per Hub</h3>
          <p className="mb-4 type-doc-body">
            Each pledge is charged in USD at a price of at least the market&apos;s stress floor ($1.00 per whole vault token by default). The charge is added to the market counter, to the counter of every pool token on that Hub and to the depositor&apos;s counter on that Hub. Example from the specification: with a Stable LP Hub token cap of $5,000,000 for USDC, a $3,000,000 pledge on one CDP Spoke and a $2,500,000 pledge on another both book against the same counter, so the second is refused ($5,500,000 is above $5,000,000).
          </p>
          <p className="mb-4 type-doc-body">
            Every exit releases exactly the charge its units carry, from the rescue slice first and then from the regular budget. Exit counters saturate at zero and never revert, and exits never call the RiskModule, the MarketRegistry or the ParameterStore, so a policy fault can never block a withdrawal or a liquidation.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Seizure checks</h3>
          <p className="mb-4 type-doc-body">
            Before a liquidation, LPVaultSwap asks Collateralization to snapshot the proxy&apos;s supplied shares and the vault token&apos;s total supply. After Aave seizes and the AaveAdapter burns the seized units, Collateralization requires the share drop and the supply drop to each equal the seized units. It then debits the records largest-first and has the LPVault unwind exactly those units to LPVaultSwap. A record debited to zero stays open, so the depositor can still collect its fees and withdraw the position.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Reconcile on exit</h3>
          <p className="mb-4 type-doc-body">
            A faulty LPVaultSwap could take seized vault tokens without settling them. The proxy&apos;s supplied shares would then be below its credited units. On the next withdrawal, partial removal, re-credit, repay with collateral, zero-credit release or seizure of that account, Collateralization treats the missing units as seized: it debits them largest-first, moves their token amounts into the market&apos;s pending-settlement balance and releases the rest. Any address can later call the pending settlement on LPVaultSwap, which burns the stranded vault tokens, swaps the tokens into the debt asset and adds the proceeds to the Coverage Spoke of the market&apos;s debt reserve. The caller receives nothing.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Partial release</h3>
          <p className="mb-4 type-doc-body">
            A depositor can remove part of a pledged position&apos;s credited units while the position stays pledged. Collateralization debits the record, releases the charge those units carry and has the LPVault pay their principal to the depositor of record, each token at least the caller&apos;s minimum. The withdrawal of a whole position requires the units to equal the record&apos;s credited units; the app reads them from the release preview.
          </p>
        </section>

        <section id="vault-tokens" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Vault Tokens</h2>
          <p className="mb-4 type-doc-body">
            A vault token is the collateral-only ERC-20 that represents the credited units of one market inside Aave V4. There is exactly one vault token per CDP Spoke and market, and it is one collateral reserve of that Spoke on the Spoke&apos;s home Hub. It has no owner, admin, role, setter, pause, blocklist, permit, transfer hook, rebasing, fee on transfer or emissions. Its bindings (integration, LPVault, market key, Hub, Spoke, market ID, LPOracle, AaveAdapter, LPVaultSwap and Collateralization) are immutables, and Collateralization reads the market&apos;s identity only from them.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Units and decimals</h3>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>One base unit equals one credited unit of the market. For Uniswap v3 and Aerodrome Slipstream a unit is one unit of the position&apos;s liquidity over the exact range. There is no conversion factor anywhere in mint, burn or transfer.</li>
            <li>Decimals are fixed at listing: the smallest value from 6 to 18 at which one whole token is worth at least $1 at the listing&apos;s reference prices. A whole token is therefore worth between $1 and $10 at listing, and activation requires the oracle&apos;s whole-token price to be between $0.50 and $20.00.</li>
            <li>Example: a USDC/USDT position with liquidity 5,000,000,000 mints 5,000,000,000 base units, which is 5,000 whole tokens at 6 decimals.</li>
          </ul>
          <h3 className="mt-6 mb-2 type-doc-subsection-title">Mint and burn</h3>
          <p className="mb-4 type-doc-body">
            Only the AaveAdapter mints and burns. It mints only to a registered proxy of the market, inside a pledge (exactly the credited units) or a re-credit (exactly the added units). It burns from a registered proxy after a withdrawal, partial removal or repay with collateral, and from LPVaultSwap after a seizure. A burn needs no allowance, and the token refuses a burn from the Hub. The registry of valid proxies lives in the token, is written only by the AaveAdapter on a proxy&apos;s first pledge into the market, and has no removal.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Transfer rule</h3>
          <p className="mb-4 type-doc-body">
            Every balance change is on one of five paths. Every other transfer reverts, including zero-amount transfers and transfers by a spender with an allowance.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Path</th><th className="text-left px-4 py-2 type-doc-subsection-title">From</th><th className="text-left px-4 py-2 type-doc-subsection-title">To</th><th className="text-left px-4 py-2 type-doc-subsection-title">When</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Mint</td><td className="px-4 py-2">None</td><td className="px-4 py-2">Registered proxy</td><td className="px-4 py-2">Pledge, re-credit</td></tr>
                <tr><td className="px-4 py-2">Supply</td><td className="px-4 py-2">Registered proxy</td><td className="px-4 py-2">Hub</td><td className="px-4 py-2">The CDP Spoke pulls the supply</td></tr>
                <tr><td className="px-4 py-2">Withdraw</td><td className="px-4 py-2">Hub</td><td className="px-4 py-2">Registered proxy</td><td className="px-4 py-2">Withdrawal, partial removal, repay with collateral</td></tr>
                <tr><td className="px-4 py-2">Seizure</td><td className="px-4 py-2">Hub</td><td className="px-4 py-2">LPVaultSwap</td><td className="px-4 py-2">Aave liquidation</td></tr>
                <tr><td className="px-4 py-2">Burn</td><td className="px-4 py-2">Registered proxy or LPVaultSwap</td><td className="px-4 py-2">None</td><td className="px-4 py-2">After a withdrawal or a seizure</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            Proxy-to-proxy transfers, transfers from LPVaultSwap back to the Hub and transfers to or from the AaveAdapter all revert. Because seized collateral can reach only LPVaultSwap, any other caller of the Aave liquidation reverts when the Hub tries to send it the seized tokens. The Spoke settings that close the remaining paths are described in{" "}
            <Link href="/developers/architecture#required-settings" className="text-type-accent hover:underline">Hubs and Spokes</Link>.
          </p>
          <h3 className="mt-6 mb-2 type-doc-subsection-title">Supply bound</h3>
          <p className="mb-4 type-doc-body">
            Total supply is at most the market&apos;s credited units plus its pending-settlement units, and equal to it while every seizure is settled in the same call. Between transactions vault tokens rest only in the Hub, except seized units held by LPVaultSwap after a seizure that was never settled.
          </p>
        </section>

        <section id="vault-token-factory" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">VaultTokenFactory</h2>
          <p className="mb-4 type-doc-body">
            The VaultTokenFactory is immutable and deploys every vault token of its chain. Only the AvanaTimelock can call it, in the same batch as the market&apos;s listing operation, at the normal delay of 5 days. It deploys with CREATE3, salted by the CDP Spoke and the market key, so each token address can be predicted and checked in the deployment manifest before the listing executes.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>The market key is derived from the chain ID, integration ID, pool and exact shape. One pool listed with two ranges is two markets with two tokens.</li>
            <li>The token registry maps each CDP Spoke and market key to one token for life and is never cleared. A market relisted on another Spoke gets a fresh token at a fresh address.</li>
            <li>The LPVault registry maps each integration ID to one LPVault, written once by a timelock operation after checking that the LPVault names this chain&apos;s Collateralization and Lock.</li>
            <li>Deployment reverts unless decimals are between 6 and 18 and the integration is registered.</li>
          </ul>
        </section>

        <section id="position-proxy" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">PositionProxy</h2>
          <p className="mb-4 type-doc-body">
            A PositionProxy is the borrower&apos;s Aave V4 account for one market on one CDP Spoke. It holds that market&apos;s supplied vault tokens and the debt of every debt reserve the account borrows on that Spoke, under one health factor. A wallet that uses two markets has two proxies, so no market&apos;s collateral backs another market&apos;s debt.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Logic-free and immutable: no implementation pointer, initializer, upgrade path, delegatecall, receive function or role. It is never replaced, and no account moves between proxies.</li>
            <li>Created with CREATE2 by the ProxyManager, one per wallet, CDP Spoke and market, on the wallet&apos;s first pledge into that market.</li>
            <li>Its four immutables are the AaveAdapter, the wallet, the Spoke and the market ID. They never change.</li>
            <li>Its one state-changing function, execute, accepts calls only from the chain&apos;s AaveAdapter, including for its bound wallet. The wallet never calls the proxy directly.</li>
            <li>It reads no state and calls no Avana contract or price source. All account logic lives in the AaveAdapter, which upgrades only through the timelock, so a fix reaches every proxy at once and no exit depends on code inside the proxy.</li>
          </ul>
          <p className="mt-4 type-doc-body">
            A borrower who loses its wallet key can never withdraw its positions. Its debt can still be repaid by any payer or cleared by liquidation.
          </p>
        </section>

        <section id="proxy-manager" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">ProxyManager</h2>
          <p className="mb-4 type-doc-body">
            The ProxyManager is the only creator of PositionProxies on its chain. It is immutable, with no owner, role, pause or setter. Only the AaveAdapter can ask it to deploy, and it refuses a wallet that the MarketRegistry has frozen. It keeps no wallet-to-proxy map: the AaveAdapter keeps the binding, and each vault token keeps its registry of valid proxies.
          </p>
          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"salt = keccak256(abi.encode(wallet, spoke, marketId))"}</code>
          </div>
          <p className="mt-4 type-doc-body">
            The prediction view returns a proxy address before deployment. Because the binding is part of both the salt and the constructor arguments, whoever triggers the creation, the proxy at that address is bound to that wallet, Spoke and market. A second deployment for the same triple reverts.
          </p>
        </section>

        <section id="lock" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Lock</h2>
          <p className="mb-4 type-doc-body">
            One immutable reentrancy lock per chain is shared by every Avana contract that moves assets or changes accounting. It has exactly two members, the AaveAdapter and LPVaultSwap. Each of their outer entry points acquires the Lock first and releases it last. While it is held, Collateralization and the LPVaults accept calls only from their named caller, and any attempt to start a second outer entry point in the same call tree reverts.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>AaveAdapter entry points: pledge, recredit, borrow, repay, withdraw, removeLiquidity, repayAllAndWithdraw, repayWithCollateral, collectFees and releaseZeroCredit.</li>
            <li>LPVaultSwap entry points: liquidate, liquidatePermissionless and settlePending.</li>
            <li>A new CDP Spoke, market or LPVault uses the same Lock with no redeploy and no membership change.</li>
            <li>The Lock is not a pause. It never blocks a protocol action at the start of a transaction.</li>
          </ul>
        </section>

        <section id="backing-invariant" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Backing Invariant</h2>
          <p className="mb-4 type-doc-body">
            For every market, at the end of every transaction:
          </p>
          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"vaultToken.totalSupply ≤ totalCredited + pendingUnits"}</code>
          </div>
          <p className="mt-4 mb-4 type-doc-body">
            Each pledge, withdrawal, partial removal, re-credit, repay with collateral and settlement leaves the gap (credited plus pending, minus supply) unchanged, and the AaveAdapter checks this after each call. Equality holds while every seizure is settled in the same call. The one-sided form keeps a market working if a faulty settlement path ever burned units it did not settle: the liquidity behind such a burn stays in custody, so circulating vault tokens stay more than fully backed.
          </p>
          <p className="mb-4 type-doc-body">
            Each record also keeps its live units at or above its credited units. A pledge sets credited equal to live units, an addition by anyone raises live units only, and every removal lowers both by exactly the units debited. The Lens reports vault-token supply next to the liquidity held, so anyone can check the backing of each market.
          </p>
        </section>

        <section id="reconcile-example" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Reconcile Example</h2>
          <p className="mb-4 type-doc-body">
            {"Example values; each market's parameters are set at listing."}{" "}This example from the specification shows how an unsettled seizure is handled. Alice pledges two USDC/USDT positions: record 1 with 5,000,000,000 units and record 2 with 4,000,000,000 units. After a depeg, a faulty LPVaultSwap takes 1,575,000,000 seized units without settling them.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Step</th><th className="text-left px-4 py-2 type-doc-subsection-title">Spoke supply</th><th className="text-left px-4 py-2 type-doc-subsection-title">Records 1 / 2</th><th className="text-left px-4 py-2 type-doc-subsection-title">Pending units</th><th className="text-left px-4 py-2 type-doc-subsection-title">Total supply</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">After both pledges</td><td className="px-4 py-2">9,000,000,000</td><td className="px-4 py-2">5,000,000,000 / 4,000,000,000</td><td className="px-4 py-2">0</td><td className="px-4 py-2">9,000,000,000</td></tr>
                <tr><td className="px-4 py-2">Unsettled seizure</td><td className="px-4 py-2">7,425,000,000</td><td className="px-4 py-2">5,000,000,000 / 4,000,000,000</td><td className="px-4 py-2">0</td><td className="px-4 py-2">9,000,000,000</td></tr>
                <tr><td className="px-4 py-2">Alice repays and withdraws record 1 with 3,425,000,000 units</td><td className="px-4 py-2">4,000,000,000</td><td className="px-4 py-2">closed / 4,000,000,000</td><td className="px-4 py-2">1,575,000,000</td><td className="px-4 py-2">5,575,000,000</td></tr>
                <tr><td className="px-4 py-2">Alice withdraws record 2</td><td className="px-4 py-2">0</td><td className="px-4 py-2">closed / closed</td><td className="px-4 py-2">1,575,000,000</td><td className="px-4 py-2">1,575,000,000</td></tr>
                <tr><td className="px-4 py-2">Anyone calls the pending settlement</td><td className="px-4 py-2">0</td><td className="px-4 py-2">closed / closed</td><td className="px-4 py-2">0</td><td className="px-4 py-2">0</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            In the third step the shortfall is 1,575,000,000 units. Collateralization debits it from record 1 at the head of the list, moves the matching token amounts into the pending-settlement balance and returns the rest of the position to Alice with all of its fees. The 1,575,000,000 outstanding vault tokens stay backed until the settlement burns them and sends the recovered debt asset to the Coverage Spoke.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How Avana holds LP positions in LPVaults, records their backing in Collateralization and represents them on Aave V4 with vault tokens held by per-market PositionProxies."
        sectionColor="violet"
      />
    </div>
  ))
}
