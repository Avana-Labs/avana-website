import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'architecture', {
    title: "Hubs and Spokes",
    description: "The Aave V4 Hubs and Spokes Avana runs on: Avana Hubs, CDP Spokes, the Lend Spoke, Coverage Spokes, the three required settings, credit lines, the contract call graph and asset flows.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "avana-hubs", title: "Avana Hubs" },
  { id: "cdp-spokes", title: "CDP Spokes" },
  { id: "lend-spoke", title: "Lend Spoke" },
  { id: "coverage-spokes", title: "Coverage Spokes" },
  { id: "fee-receiver", title: "Vault-Token Fee Receiver" },
  { id: "required-settings", title: "Required Settings" },
  { id: "credit-lines", title: "Credit Lines" },
  { id: "cross-hub-lines", title: "Cross-Hub Lines" },
  { id: "call-graph", title: "Call Graph" },
  { id: "asset-flows", title: "Asset Flows" },
]

export default async function HubsAndSpokesPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "architecture", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Hubs and Spokes"
          description="Avana runs on standard, unmodified Aave V4 Hubs and Spokes that the Aave DAO owns and configures. Avana's own contracts handle custody, valuation and liquidation around them."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            Every Hub, Spoke, AaveOracle and configurator Avana uses is unmodified Aave V4 at a pinned release, deployed and owned by the Aave DAO. Avana proposes their configuration and checks it on-chain, but holds no role on them and is not a lender. Each chain Avana runs on has the same set of Aave-side contracts:
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Contract</th><th className="text-left px-4 py-2 type-doc-subsection-title">How many</th><th className="text-left px-4 py-2 type-doc-subsection-title">Role</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Avana Hub</td><td className="px-4 py-2">Up to three tiers per chain</td><td className="px-4 py-2">Holds the vault tokens of its markets and the debt-asset liquidity of its credit lines</td></tr>
                <tr><td className="px-4 py-2">CDP Spoke</td><td className="px-4 py-2">One per chain, Hub, AMM protocol and risk tier</td><td className="px-4 py-2">Lists several markets as collateral reserves and the approved debt reserves</td></tr>
                <tr><td className="px-4 py-2">Lend Spoke</td><td className="px-4 py-2">One per chain</td><td className="px-4 py-2">Supply-only Spoke through which the DAO treasury supplies each credit line</td></tr>
                <tr><td className="px-4 py-2">Coverage Spoke (Avana Umbrella)</td><td className="px-4 py-2">One per Hub and debt asset</td><td className="px-4 py-2">Supply-only Spoke holding the First-Loss Reserve that covers recorded deficits</td></tr>
                <tr><td className="px-4 py-2">Vault-token fee receiver</td><td className="px-4 py-2">One per vault-token asset</td><td className="px-4 py-2">Aave treasury Spoke registered with zero caps</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="avana-hubs" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Avana Hubs</h2>
          <p className="mb-4 type-doc-body">
            An Avana Hub holds only one vault-token asset per market of its CDP Spokes and each credit-line asset the Lend Spoke supplies to it. Liquidity is organized into three Hub tiers because stable, correlated and volatile LP positions carry different risks. A chain can host any of the three.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Hub</th><th className="text-left px-4 py-2 type-doc-subsection-title">Positions</th><th className="text-left px-4 py-2 type-doc-subsection-title">Status</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Avana Stable LP Hub</td><td className="px-4 py-2">Stablecoin and blue-chip pools with tight pricing, low slippage and minimal impermanent loss</td><td className="px-4 py-2">Launch, on Ethereum and on Base</td></tr>
                <tr><td className="px-4 py-2">Avana Correlated LP Hub</td><td className="px-4 py-2">Pools of assets that move together, with tighter risk bands</td><td className="px-4 py-2">Added later on any chain</td></tr>
                <tr><td className="px-4 py-2">Avana Volatile LP Hub</td><td className="px-4 py-2">Major DeFi assets and governance-token pools with wider ranges, under stricter exposure limits</td><td className="px-4 py-2">Added later on any chain</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            Each Hub has its own application pause state in Avana&apos;s MarketRegistry, and the token and depositor caps are counted per Hub across all of its CDP Spokes and markets. A market belongs to one Hub for life; a later Hub gets new markets, and users move by repaying, withdrawing and pledging again.
          </p>
        </section>

        <section id="cdp-spokes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">CDP Spokes</h2>
          <p className="mb-4 type-doc-body">
            A CDP Spoke is one standard Aave V4 Spoke per chain, Hub, AMM protocol and risk tier, with exactly one home Hub. It lists several markets. A market is one pool with one exact position range, and each market is one non-borrowable vault-token reserve of its Spoke. The Spoke also lists the debt reserves recorded for it, GHO first. Each account (one PositionProxy) holds exactly one market, so every market has its own health factor.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Chain</th><th className="text-left px-4 py-2 type-doc-subsection-title">Hub</th><th className="text-left px-4 py-2 type-doc-subsection-title">Launch CDP Spoke</th><th className="text-left px-4 py-2 type-doc-subsection-title">Positions</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Ethereum</td><td className="px-4 py-2">Avana Stable LP Hub</td><td className="px-4 py-2">Uniswap v3 Stable</td><td className="px-4 py-2">Uniswap v3 positions from the canonical position manager, exact tick range</td></tr>
                <tr><td className="px-4 py-2">Base</td><td className="px-4 py-2">Avana Stable LP Hub</td><td className="px-4 py-2">Aerodrome Slipstream Stable</td><td className="px-4 py-2">Unstaked Aerodrome Slipstream positions, exact tick range</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="mt-6 mb-2 type-doc-subsection-title">Configuration</h3>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>One liquidation configuration per Spoke, shared by all of its markets. Avana recommends a target health factor of 1.10 and a minimum liquidation bonus of at least 2%; the Aave DAO decides both in the listing AIP. A market that needs a different target or bonus curve gets its own Spoke.</li>
            <li>The GHO reserve is listed before any vault-token reserve, so it is reserve 0. Other debt assets (USDC, USDT or WETH) become borrowable on a Spoke only through the enable-debt-reserve operation, once the Aave DAO approves their credit line, caps, price source and swap routes.</li>
            <li>Debt reserves are borrowable with collateral factor 0, and the Spoke has no supply cap on them, so outside supply of a debt asset cannot become collateral.</li>
            <li>The Spoke&apos;s AaveOracle reads each market&apos;s LPOracle, Aave&apos;s fixed $1 source for GHO, and a DebtOracle for any other debt asset.</li>
            <li>The per-account reserve limit is set by the Aave DAO and bounds how many debt reserves one account can hold.</li>
            <li>No liquidation-manager Spoke variant is used: the only one available allows one collateral reserve per Spoke, which cannot hold several markets.</li>
          </ul>
          <h3 className="mt-6 mb-2 type-doc-subsection-title">Deployment operations</h3>
          <p className="mb-4 type-doc-body">
            Avana adds a CDP Spoke, a market or a debt reserve only through three AvanaTimelock operations at the normal delay of 5 days, each paired with the Aave DAO payload of the same listing and followed by a 12-hour activation that re-checks the live Aave configuration.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Operation</th><th className="text-left px-4 py-2 type-doc-subsection-title">What it does</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">deployCdpSpoke</code></td><td className="px-4 py-2">Registers a standard Spoke and its AaveOracle, created by the Aave DAO payload, under a Hub with one AMM integration, after checking the three required settings and the Spoke implementation.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">listCollateralMarket</code></td><td className="px-4 py-2">Deploys the market&apos;s vault token and LPOracle, records the exact range, binds the AMM integration&apos;s LPVault and wires the Spoke reserve.</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">enableDebtReserve</code></td><td className="px-4 py-2">Records the funding Hub and asset, checks the credit-line sums, the flash-liquidity and route-depth bounds, the Coverage Spoke funding and the swap routes, and enables borrowing.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="lend-spoke" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Lend Spoke</h2>
          <p className="mb-4 type-doc-body">
            Each chain has one supply-only Lend Spoke, owned by the Aave DAO. Its reserves point to Hub and asset pairs and can list any asset. The DAO treasury supplies each credit line through it, and its supply cap on each pair equals the line. Its draw cap is 0 on every asset. Public lender deposits are not offered at launch.
          </p>
          <p className="mb-4 type-doc-body">
            Credit-line sizes, recall and growth are described in{" "}
            <Link href="/developers/architecture/lend-spoke" className="text-type-accent hover:underline">Lend Spoke</Link>.
          </p>
        </section>

        <section id="coverage-spokes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Coverage Spokes</h2>
          <p className="mb-4 type-doc-body">
            Each Hub and debt asset on each chain has one Coverage Spoke, the Avana Umbrella of that pair. Avana Umbrella is Avana&apos;s protocol safety module, named after Aave&apos;s Umbrella, whose design inspired it. It is a supply-only Spoke with draw cap 0, controlled by the Aave DAO and funded by Avana Labs in its own asset. Its supply is that pair&apos;s First-Loss Reserve.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Coverage Spokes are the only holders of the Hub&apos;s deficit-eliminator role. A Coverage Spoke burns its own shares to cover recorded deficits in its asset from every CDP Spoke that draws that asset from that Hub. A deficit is never covered with another asset&apos;s, Hub&apos;s or chain&apos;s reserve.</li>
            <li>It is funded before any draw cap on its pair rises above 0, and must hold at least the coverage ratio times the sum of draw caps on that pair. The ratio and minimum are set in the funding ARFC with Aave&apos;s service providers; 20% is an illustrative guide only.</li>
            <li>It receives what the pending settlement recovers for markets whose debt reserve that pair funds.</li>
            <li>A Hub halt of a CDP Spoke does not stop coverage of that Spoke&apos;s deficit.</li>
          </ul>
          <div className="mt-4 type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"fundedBalance × 10⁴ ≥ coverageRatioBps × Σ drawCap"}</code>
          </div>
        </section>

        <section id="fee-receiver" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Vault-Token Fee Receiver</h2>
          <p className="mb-4 type-doc-body">
            When the Aave DAO adds a vault token as a Hub asset, Aave registers the asset&apos;s fee receiver as a second Spoke on it with an unlimited supply cap. The listing payload sets that fee receiver&apos;s supply and draw caps to 0, and the vault-token asset has a liquidity fee of 0 and a valid interest-rate strategy, so the fee receiver never holds vault tokens.
          </p>
          <p className="mb-4 type-doc-body">
            Each vault-token asset therefore has exactly two registered Spokes: its CDP Spoke, the only one with non-zero caps, and the fee receiver. Both have draw cap 0, and the asset&apos;s drawn shares are 0. A second Spoke with caps on the asset could draw vault tokens out of the Hub and leave withdrawals and seizures unable to settle, so it counts as drift.
          </p>
        </section>

        <section id="required-settings" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Required Settings</h2>
          <p className="mb-4 type-doc-body">
            Liquidation of an Avana account is possible only through LPVaultSwap, because the vault token accepts seized collateral only to LPVaultSwap. The listing AIP sets three values on every vault-token reserve that keep this transfer rule the only gate:
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Setting</th><th className="text-left px-4 py-2 type-doc-subsection-title">Required value</th><th className="text-left px-4 py-2 type-doc-subsection-title">Path it closes</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">receiveSharesEnabled</code></td><td className="px-4 py-2"><code className="type-doc-inline-code">false</code></td><td className="px-4 py-2">A liquidator taking Spoke supply shares instead of tokens, which moves no vault token</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">liquidationFee</code></td><td className="px-4 py-2">0, or a fee paid to Avana&apos;s fee recipient</td><td className="px-4 py-2">Fee shares moving to another address with no token transfer</td></tr>
                <tr><td className="px-4 py-2">Reinvestment controller</td><td className="px-4 py-2">None (zero address)</td><td className="px-4 py-2">A sweep moving the Hub&apos;s vault tokens to an address the token refuses</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="mt-6 mb-2 type-doc-subsection-title">Drift check</h3>
          <p className="mb-4 type-doc-body">
            The RiskModule compares the live Aave configuration with the values Avana&apos;s sizing assumes on every new-account pledge, borrow, withdrawal with debt and market activation. Monitoring checks the same values continuously. The checks include:
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>The three required settings, and that the vault-token reserve is not borrowable.</li>
            <li>Draw cap 0 for every Spoke on the vault-token asset, exactly two Spokes on it, and no reinvestment controller on any Avana Hub asset.</li>
            <li>Each reserve&apos;s price source: the market&apos;s LPOracle, the fixed GHO source, or the asset&apos;s DebtOracle.</li>
            <li>Collateral risk below the Spoke&apos;s risk-premium threshold.</li>
            <li>The CDP Spoke implementation is the approved standard Spoke, and its borrowable reserves equal the debt reserves Avana recorded.</li>
            <li>The collateral factor is at most Avana&apos;s expected factor, the bonus bound holds, and the target health factor equals the recorded value.</li>
          </ul>
          <p className="mt-4 type-doc-body">
            When a check fails, new-account pledges, borrowing and withdrawals with debt in the affected market stop. Top-ups to indebted accounts, repayment, fee collection, debt-free withdrawal and liquidation continue, and monitoring raises an alarm. A change by the Aave DAO that would admit another liquidator is drift: the playbook asks the DAO to revert it.
          </p>
        </section>

        <section id="credit-lines" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Credit Lines</h2>
          <p className="mb-4 type-doc-body">
            Every borrowable asset comes from a capped credit line approved by the Aave DAO. A credit line is a draw cap per Hub, asset and CDP Spoke. For each debt asset on each funding Hub:
          </p>
          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"LendSpoke.addCap(hub, asset) = creditLine(hub, asset);  Σ drawCap(hub, asset, spoke) ≤ creditLine(hub, asset)"}</code>
          </div>
          <ul className="mt-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Each debt reserve&apos;s draw cap is at most the flash liquidity of its asset in the chain&apos;s Aave V3 Pool and the depth of its swap routes, measured at listing, so every borrowed amount can be liquidated in one transaction.</li>
            <li>CDP Spokes have supply cap 0 on debt assets; the Lend Spoke and the Coverage Spokes have draw cap 0.</li>
            <li>The Hub admits a draw only if drawn debt, premium, uncovered deficit and the new amount fit under the draw cap, so interest and deficits use up capacity.</li>
            <li>No Avana contract or role has authority over any Hub cap, interest rate or Lend Spoke position. Each cap is raised only by an Aave DAO proposal.</li>
            <li>Monitoring alerts when the debt drawn on a reserve, including accrued interest and premium, reaches 90% of its draw cap.</li>
          </ul>
          <div className="mt-4 doc-topic type-doc-body">
            {"Example values; each market's parameters are set at listing."}{" "}On Ethereum a 2,000,000 GHO line gives the Lend Spoke a supply cap of 2,000,000 and the single CDP Spoke a draw cap of 2,000,000. If that Spoke has 1,900,000 GHO drawn, 3,000 GHO of premium and a 475 GHO uncovered deficit, a 100,000 GHO borrow needs 2,003,475 and reverts. The largest borrow that passes is 96,525 GHO.
          </div>
        </section>

        <section id="cross-hub-lines" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Cross-Hub Lines</h2>
          <p className="mb-4 type-doc-body">
            Each CDP Spoke has a home Hub for its collateral, and each debt reserve records its funding Hub. A debt reserve funded by its Spoke&apos;s home Hub is the normal case. A cross-Hub credit line, where the funding Hub differs from the home Hub, is fully specified and off at launch on every chain. While it is off, a debt reserve whose funding Hub is not its Spoke&apos;s home Hub is refused.
          </p>
          <p className="mb-4 type-doc-body">
            When enabled, the funding Hub owns the cap: one register in the chain&apos;s MarketRegistry sums every draw cap on that Hub and asset, whatever the drawing Spoke&apos;s home Hub. Each foreign draw cap is limited by its cross-Hub line, the total of cross-Hub lines is at most the funded balance of that pair&apos;s Coverage Spoke, a pause of the funding Hub stops every borrow of the line, and a line set to 0 closes at once while existing debt can still be repaid or liquidated.
          </p>
        </section>

        <section id="call-graph" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Call Graph</h2>
          <p className="mb-4 type-doc-body">
            Each callee accepts a call only from the caller shown. Wallets reach Aave only through the AaveAdapter, and liquidations reach Aave only through LPVaultSwap.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Flow</th><th className="text-left px-4 py-2 type-doc-subsection-title">Who calls whom</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Pledge</td><td className="px-4 py-2">Wallet approves the LPVault for one position, then calls the AaveAdapter. The AaveAdapter has the ProxyManager deploy the proxy on a first pledge and registers it in the vault token. Collateralization has the LPVault take custody, pokes the LPOracle and asks the RiskModule to check the pledge. The AaveAdapter mints vault tokens to the proxy, which supplies them to the CDP Spoke; the Spoke moves them into the Hub.</td></tr>
                <tr><td className="px-4 py-2">Borrow</td><td className="px-4 py-2">Wallet calls the AaveAdapter. The RiskModule runs the borrow checks and pokes the oracles. The proxy calls the Spoke borrow; the funding Hub sends the debt asset to the proxy, which forwards it to the receiver. The RiskModule then checks the health factor.</td></tr>
                <tr><td className="px-4 py-2">Repay</td><td className="px-4 py-2">Any payer calls the AaveAdapter, which moves the amount to the proxy; the proxy repays the Spoke and refunds any unused amount to the payer.</td></tr>
                <tr><td className="px-4 py-2">Withdraw</td><td className="px-4 py-2">Wallet calls the AaveAdapter. The proxy withdraws from the Spoke, the AaveAdapter burns the vault tokens, and Collateralization has the LPVault return the position to the depositor of record.</td></tr>
                <tr><td className="px-4 py-2">Fee collection</td><td className="px-4 py-2">Depositor calls the AaveAdapter, which calls Collateralization, which has the LPVault collect fees to the depositor.</td></tr>
                <tr><td className="px-4 py-2">Pricing</td><td className="px-4 py-2">The Spoke reads its AaveOracle, which reads the LPOracle, the fixed GHO source or a DebtOracle. Anyone can poke the oracles.</td></tr>
                <tr><td className="px-4 py-2">Liquidation</td><td className="px-4 py-2">Any address that is not frozen calls LPVaultSwap&apos;s liquidate, directly or through a flash liquidation helper that flash-borrows the debt asset from the Aave V3 Pool. LPVaultSwap pulls the debt asset from its caller, has Collateralization snapshot the account and calls the Spoke liquidation. The Hub sends the seized vault tokens to LPVaultSwap, the AaveAdapter burns them, Collateralization debits the records and the LPVault unwinds the units to LPVaultSwap, which swaps through the swap routes and pays out: Avana&apos;s fee, any borrower surplus, then the rest to the caller.</td></tr>
                <tr><td className="px-4 py-2">Funding and coverage</td><td className="px-4 py-2">The DAO treasury supplies through the Lend Spoke. Avana Labs or LPVaultSwap funds a Coverage Spoke, which eliminates deficits on its Hub.</td></tr>
                <tr><td className="px-4 py-2">Governance</td><td className="px-4 py-2">The governance multisig or the Aave governance executor schedules on the AvanaTimelock; anyone executes once ready. Guardians call the MarketRegistry for pauses, freezes, breaker trips and standby switches.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="asset-flows" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Asset Flows</h2>
          <p className="mb-4 type-doc-body">
            Where each asset sits at each stage of a position&apos;s life, between transactions:
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Stage</th><th className="text-left px-4 py-2 type-doc-subsection-title">Position</th><th className="text-left px-4 py-2 type-doc-subsection-title">Vault tokens</th><th className="text-left px-4 py-2 type-doc-subsection-title">Debt asset</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Before pledge</td><td className="px-4 py-2">Wallet</td><td className="px-4 py-2">None exist for this position</td><td className="px-4 py-2">Wallet</td></tr>
                <tr><td className="px-4 py-2">After pledge</td><td className="px-4 py-2">LPVault, recorded in Collateralization; liquidity stays in the pool</td><td className="px-4 py-2">In the home Hub, credited to the proxy</td><td className="px-4 py-2">Unchanged</td></tr>
                <tr><td className="px-4 py-2">After borrow</td><td className="px-4 py-2">LPVault</td><td className="px-4 py-2">Hub</td><td className="px-4 py-2">With the receiver; the funding Hub records the debt</td></tr>
                <tr><td className="px-4 py-2">After fee collection</td><td className="px-4 py-2">LPVault</td><td className="px-4 py-2">Hub</td><td className="px-4 py-2">Unchanged; fees went to the depositor</td></tr>
                <tr><td className="px-4 py-2">After repay</td><td className="px-4 py-2">LPVault</td><td className="px-4 py-2">Hub</td><td className="px-4 py-2">Back in the funding Hub</td></tr>
                <tr><td className="px-4 py-2">After withdrawal</td><td className="px-4 py-2">Depositor of record, with all liquidity and uncollected fees</td><td className="px-4 py-2">Burned</td><td className="px-4 py-2">Unchanged</td></tr>
                <tr><td className="px-4 py-2">After partial liquidation</td><td className="px-4 py-2">LPVault, with fewer credited units</td><td className="px-4 py-2">Seized units burned; the rest in the Hub</td><td className="px-4 py-2">Debt reduced; payouts in the debt asset to the fee recipient, the caller and any borrower surplus</td></tr>
                <tr><td className="px-4 py-2">After full seizure</td><td className="px-4 py-2">LPVault, record open at 0 credited units with its fees</td><td className="px-4 py-2">None for this position</td><td className="px-4 py-2">Any remaining debt recorded as a deficit on the funding Hub</td></tr>
                <tr><td className="px-4 py-2">Deficit coverage</td><td className="px-4 py-2">Not involved</td><td className="px-4 py-2">Not involved</td><td className="px-4 py-2">Coverage Spoke shares burned against the deficit</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            A pledged position rests only in its LPVault. Vault tokens rest only in their market&apos;s home Hub. No Avana contract holds a debt asset between transactions except the payout escrow, for payouts a token refused, and none holds pool tokens except Collateralization, for the pending-settlement balance.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="The Aave V4 Hubs and Spokes Avana runs on, the three settings that make LPVaultSwap the only liquidator, how credit lines are capped, and how calls and assets move."
        sectionColor="violet"
      />
    </div>
  ))
}
