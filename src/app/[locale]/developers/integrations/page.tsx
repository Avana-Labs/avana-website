import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'integrations', {
    title: "Integrations",
    description: "How to integrate with Avana: which contracts to call on Ethereum and Base, where addresses come from, the off-chain components, approval rules, deadlines and nonces, and the events to index.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "contracts-to-call", title: "Contracts to Call" },
  { id: "addresses", title: "Addresses" },
  { id: "off-chain", title: "Off-Chain Components" },
  { id: "accounts", title: "Accounts and Positions" },
  { id: "approvals", title: "Approvals" },
  { id: "deadlines-nonces", title: "Deadlines and Nonces" },
  { id: "events", title: "Events to Index" },
  { id: "pages", title: "Integration Pages" },
]

export default async function SupportedIntegrationsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "integrations", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Integrations"
          description="Everything a wallet, app, keeper or indexer needs to work with Avana's contracts directly, without Avana's frontend."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            Avana runs on Ethereum and Base. Each chain has an Avana Stable LP Hub and one CDP Spoke per AMM protocol: &quot;Uniswap v3 Stable&quot; for Uniswap v3 positions on Ethereum and &quot;Aerodrome Slipstream Stable&quot; for unstaked Aerodrome Slipstream positions on Base. The Hubs and Spokes are standard, unmodified Aave V4 contracts owned and configured by the Aave DAO; Avana&apos;s contracts handle custody, valuation, borrower actions and liquidation around them.
          </p>
          <p className="type-doc-body">
            Anyone can call the contracts directly. Avana&apos;s frontend and AppKit are optional; repay, debt-free withdrawal, fee collection and liquidation never depend on them. Each chain&apos;s contracts are separate: nothing is shared across chains, and every operation runs through that chain&apos;s own timelock.
          </p>
        </section>

        <section id="contracts-to-call" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Contracts to Call</h2>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Contract</th><th className="text-left px-4 py-2 type-doc-subsection-title">Who calls it</th><th className="text-left px-4 py-2 type-doc-subsection-title">For</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">AaveAdapter</td><td className="px-4 py-2">Borrowers, apps, anyone repaying for a borrower</td><td className="px-4 py-2">Every borrower action: pledge, re-credit, borrow, repay, withdraw, partial removal, repay-all-and-withdraw, repay with collateral, fee collection, zero-credit release. One per chain.</td></tr>
                <tr><td className="px-4 py-2">LPVaultSwap</td><td className="px-4 py-2">Avana&apos;s approved keepers; any unfrozen address through the permissionless entry point</td><td className="px-4 py-2">Liquidation with <code className="type-doc-inline-code">liquidate</code> or <code className="type-doc-inline-code">liquidatePermissionless</code>, with a flash loan of the debt asset or caller funds</td></tr>
                <tr><td className="px-4 py-2">Lens</td><td className="px-4 py-2">Apps, keepers, monitoring</td><td className="px-4 py-2">Read-only views and previews; never authorizes an action</td></tr>
                <tr><td className="px-4 py-2">LPOracle, DebtOracle</td><td className="px-4 py-2">Keepers, anyone</td><td className="px-4 py-2"><code className="type-doc-inline-code">poke()</code> to store price state; views for state and ages</td></tr>
                <tr><td className="px-4 py-2">Uniswap v3 or Slipstream position manager</td><td className="px-4 py-2">Borrowers</td><td className="px-4 py-2">The per-token approval of a position to the LPVault before a pledge, and adding liquidity before a re-credit</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="addresses" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Addresses</h2>
          <p className="mb-4 type-doc-body">
            Each chain has its own deployment and its own verified deployment manifest. Upgradeable contracts keep one fixed proxy address for life, and each market&apos;s vault token and LPOracle addresses are fixed at listing. Never take a contract address from an untrusted source; use the manifest or the published list.
          </p>
          <p className="type-doc-body">
            Per-chain contract addresses are listed on the contracts reference page:{" "}
            <Link href="/developers/reference/contracts" className="text-type-accent hover:underline">Contracts</Link>.
          </p>
        </section>

        <section id="off-chain" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Off-Chain Components</h2>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Component</th><th className="text-left px-4 py-2 type-doc-subsection-title">What it does</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">packages/protocol</code></td><td className="px-4 py-2">Calldata builders for every AMM integration and chain, built in the browser from a bundled, verified deployment manifest. It records the Lens address and ships the upstream Aave error ABIs. Its builders request only the exact approvals listed below.</td></tr>
                <tr><td className="px-4 py-2">Keeper</td><td className="px-4 py-2">Avana&apos;s keepers poke every oracle on schedule, record breaker breaches every block, liquidate every eligible account using the Lens liquidation preview, pay their own gas and cover small settlement gaps from their own funds.</td></tr>
                <tr><td className="px-4 py-2">Indexer</td><td className="px-4 py-2">A Ponder indexer stores live chain events in Postgres for the app: positions, debt and health factors.</td></tr>
                <tr><td className="px-4 py-2">App backend</td><td className="px-4 py-2">Stores app data, preferences and intent status. It never supplies a transaction target or calldata, so a compromised backend cannot redirect a user&apos;s transaction.</td></tr>
              </tbody>
            </table>
          </div>
          <p className="type-doc-body">
            The off-chain code is covered by tests; the on-chain contracts re-check every input, so no off-chain component can authorize an action.
          </p>
        </section>

        <section id="accounts" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Accounts and Positions</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Each wallet gets one PositionProxy per CDP Spoke and market, deployed on its first pledge. The proxy address is known before deployment from the Lens or the Adapter&apos;s <code className="type-doc-inline-code">predictProxy</code> view.</li>
            <li>Each proxy is a separate Aave account with its own health factor. A problem in one market never makes another market of the same wallet liquidatable.</li>
            <li>Positions are named by the AMM integration identifier and a position key: the token ID for Uniswap v3, and the token ID with the position-manager generation in its high byte for Slipstream.</li>
            <li>A market accepts only positions whose tick range equals the market&apos;s exactly.</li>
          </ul>
        </section>

        <section id="approvals" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Approvals</h2>
          <p className="mb-4 type-doc-body">Users grant only two kinds of approval, each for exactly what one transaction needs:</p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>For a pledge, an approval of exactly one position to the immutable LPVault of that AMM protocol: a per-token ERC-721 approval or permit for Uniswap v3 and Slipstream, or an exact LP-token amount for a fungible-share protocol.</li>
            <li>For a repay, an approval to the AaveAdapter of exactly the repay amount in the debt asset, for the account being repaid. For a repay-all it is the Lens repay-all quote; the Adapter pulls it in full and refunds the rest in the same call, leaving zero allowance.</li>
          </ul>
          <div className="doc-topic type-doc-body">
            Never use an operator approval for all tokens or an unlimited allowance. Never approve the RiskModule, MarketRegistry, ParameterStore, an oracle, LPVaultSwap, a swap route, the flash source or a proxy. The AaveAdapter is the only spender a user trusts beyond the immutable LPVaults, and an exact amount limits what a faulty Adapter could pull to that one repay.
          </div>
        </section>

        <section id="deadlines-nonces" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Deadlines and Nonces</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Every AaveAdapter entry point and every liquidation takes a deadline and reverts once the block timestamp passes it. Lens previews take the same deadline and add the margins (interest accrual, Aave&apos;s dust rule) that keep the transaction valid until then.</li>
            <li>Every borrow names the proxy&apos;s current borrow nonce. The Adapter consumes it, so a borrow cannot be replayed or reordered.</li>
            <li>Borrow, withdraw and partial removal take a minimum health factor that the caller chooses. Repay with collateral takes minimum amounts and a minimum repayment, and every swap leg also carries an oracle-derived minimum output.</li>
            <li>There is no minimum borrow beyond a non-zero amount and no minimum debt. Each pledge must be worth at least the market&apos;s minimum pledge value ($10 at launch).</li>
          </ul>
        </section>

        <section id="events" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Events to Index</h2>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Contract</th><th className="text-left px-4 py-2 type-doc-subsection-title">Events</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">AaveAdapter</td><td className="px-4 py-2"><code className="type-doc-inline-code">UserProxyCreated, CollateralAdded, CollateralSupplied, Borrowed, Repaid, CollateralWithdrawn, CollateralRecredited, CollateralReduced, RepaidWithCollateral, CollateralDisabled, SeizedUnitsBurned</code></td></tr>
                <tr><td className="px-4 py-2">CDP Spoke (per proxy)</td><td className="px-4 py-2"><code className="type-doc-inline-code">Supply, Borrow, Repay, Withdraw, LiquidationCall</code></td></tr>
                <tr><td className="px-4 py-2">ProxyManager</td><td className="px-4 py-2"><code className="type-doc-inline-code">ProxyDeployed</code></td></tr>
                <tr><td className="px-4 py-2">Collateralization</td><td className="px-4 py-2"><code className="type-doc-inline-code">CollateralPledged, CollateralReleased, RecordReduced, RecordRecredited, RecordDebited, SeizureSettled, SeizureReconciled, PendingSettled, CounterSaturated</code></td></tr>
                <tr><td className="px-4 py-2">LPVault</td><td className="px-4 py-2"><code className="type-doc-inline-code">PositionReceived, PositionReturned, UnitsUnwound, UnitsReleased, FeesCollected, StrayReceived, StrayReturned, MarketBound</code></td></tr>
                <tr><td className="px-4 py-2">LPVaultSwap</td><td className="px-4 py-2"><code className="type-doc-inline-code">LiquidationSettled, FlashLoanUsed, RouteFailed, ResidueReturned, PendingSettlementForwarded, Deleveraged, KeeperAdded, KeeperRemoved</code></td></tr>
                <tr><td className="px-4 py-2">LPOracle</td><td className="px-4 py-2"><code className="type-doc-inline-code">PriceStateChanged, PriceAccepted, FailureRecorded, FailureCleared, DisagreementRecorded, DisagreementCleared, OutageExpiredLatched, GraceStarted, QuoteChangeCapped, RouteChanged</code></td></tr>
                <tr><td className="px-4 py-2">DebtOracle</td><td className="px-4 py-2"><code className="type-doc-inline-code">DebtPriceStateChanged, DebtPriceAccepted, DebtFailureRecorded, DebtFailureCleared, DebtDisagreementRecorded, DebtOutageExpiredLatched, DebtGraceStarted</code></td></tr>
                <tr><td className="px-4 py-2">MarketRegistry</td><td className="px-4 py-2"><code className="type-doc-inline-code">PauseStateChanged, PauseReasonChanged, AddressFrozen, AddressUnfrozen, BreakerLatched, GateBreached, BreakerReset, StandbyRouteActivated, MarketActivated, MarketOffboarding, WindDownStepped, MarketClosed, RouteDisabled</code></td></tr>
                <tr><td className="px-4 py-2">RiskModule</td><td className="px-4 py-2"><code className="type-doc-inline-code">BreakersPoked, ConfigDriftDetected</code></td></tr>
                <tr><td className="px-4 py-2">ParameterStore</td><td className="px-4 py-2"><code className="type-doc-inline-code">ParameterSet, ParameterTightened, ParameterLoosened, CapTightened, CapLoosened, MinPledgeUsdSet, FeedConfigured, SecondSourceSwitched</code></td></tr>
                <tr><td className="px-4 py-2">VaultTokenFactory, vault tokens</td><td className="px-4 py-2"><code className="type-doc-inline-code">IntegrationRegistered, VaultTokenDeployed, Transfer, ProxyAdded</code></td></tr>
                <tr><td className="px-4 py-2">Payout escrow</td><td className="px-4 py-2"><code className="type-doc-inline-code">RemainderEscrowed, RemainderClaimed</code></td></tr>
                <tr><td className="px-4 py-2">AvanaTimelock</td><td className="px-4 py-2"><code className="type-doc-inline-code">CallScheduled, CallExecuted, Cancelled, NormalDelayChanged, ShortDelaySelectorSet, PublicExecutionToggled, ExpiredOperationCleaned</code></td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            Borrowers and apps should watch the timelock&apos;s scheduled operations: every normal-delay change is public for 5 days before it executes, which is the window to exit if a change is unwelcome. The Lens emits no events.
          </p>
        </section>

        <section id="pages" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Integration Pages</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li><Link href="/developers/integrations/router-contract" className="text-type-accent hover:underline">AaveAdapter Entry Points</Link></li>
            <li><Link href="/developers/integrations/lens" className="text-type-accent hover:underline">Lens</Link></li>
            <li><Link href="/developers/integrations/price-oracles" className="text-type-accent hover:underline">Price Oracles</Link></li>
            <li><Link href="/developers/integrations/price-states" className="text-type-accent hover:underline">Price States</Link></li>
            <li><Link href="/developers/integrations/allowed-pools" className="text-type-accent hover:underline">Allowed LP Pools</Link></li>
            <li><Link href="/developers/integrations/market-lifecycle" className="text-type-accent hover:underline">Market Lifecycle</Link></li>
            <li><Link href="/developers/integrations/appkit" className="text-type-accent hover:underline">AppKit</Link></li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How to integrate with Avana's contracts directly on Ethereum and Base."
        sectionColor="cyan"
      />
    </div>
  ))
}
