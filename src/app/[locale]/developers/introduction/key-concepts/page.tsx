import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'introduction/key-concepts', {
    title: "Key Concepts",
    description: "The concepts behind Avana: markets, vault tokens, per-market accounts, Hubs and Spokes, debt reserves, oracles and price states, collateral and health factors, liquidation, Avana Umbrella, pauses and the timelock.",
  })
}

const sections = [
  { id: "lp-collateral", title: "LP Collateral" },
  { id: "market", title: "Market" },
  { id: "vault-token", title: "Vault Token" },
  { id: "account", title: "PositionProxy and Account" },
  { id: "spokes", title: "CDP, Lend and Coverage Spokes" },
  { id: "hubs", title: "Hubs" },
  { id: "debt-reserves", title: "Debt Reserves" },
  { id: "oracles", title: "Oracles and Price States" },
  { id: "collateral-factor", title: "Collateral Factor" },
  { id: "health-factor", title: "Health Factor" },
  { id: "liquidation", title: "Liquidation Paths" },
  { id: "avana-umbrella", title: "Avana Umbrella" },
  { id: "pause-breakers", title: "Pauses and Breakers" },
  { id: "timelock", title: "AvanaTimelock" },
]

export default async function KeyConceptsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "introduction/key-concepts", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Key Concepts"
          description="One short section per concept. Each links to the page that covers it in full."
        />

        <section id="lp-collateral" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">LP Collateral</h2>
          <p className="mb-4 type-doc-body">
            Token collateral is usually a balance of one asset. An LP position is a changing combination of assets: trades change its inventory, prices change its value, and fees accrue over time. A concentrated-liquidity position also depends on its range and becomes one-sided as prices move out of it. Avana therefore sets risk parameters per market, keeps the liquidity in its pool, and gives each market its own Aave account per borrower.
          </p>
        </section>

        <section id="market" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Market</h2>
          <p className="mb-4 type-doc-body">
            A market is one pool of one AMM protocol on one chain with one exact position shape. For concentrated liquidity the shape is the exact tick range. Each market has one vault token and is one collateral reserve of exactly one CDP Spoke for life.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>A position is accepted only if its range equals the market&apos;s exactly. A market listed at [−10, 10] refuses a position at [−9, 10], even though they overlap.</li>
            <li>One pool listed with two ranges is two markets.</li>
            <li>At launch: Uniswap v3 stablecoin pools on Ethereum and unstaked Aerodrome Slipstream stablecoin pools on Base, such as USDC/USDT and pools containing GHO.</li>
            <li>Each market is listed through the AvanaTimelock at the normal delay of 5 days together with the Aave DAO listing payload, which sets its collateral factor, bonus curve and caps.</li>
          </ul>
        </section>

        <section id="vault-token" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Vault Token</h2>
          <p className="mb-4 type-doc-body">
            A vault token is the transfer-restricted, collateral-only ERC-20 of one market. One base unit equals one unit of credited liquidity. Its decimals are fixed at listing between 6 and 18 so that one whole token is worth between $1 and $10 at listing prices. Only the AaveAdapter mints and burns it, and it can move only from a registered proxy into the Hub, from the Hub back to a proxy, or from the Hub to LPVaultSwap on a seizure. It has no owner, admin or emissions.
          </p>
          <p className="mb-4 type-doc-body">
            The full rules are in{" "}
            <Link href="/developers/architecture/custody" className="text-type-accent hover:underline">Custody and Vault Tokens</Link>.
          </p>
        </section>

        <section id="account" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">PositionProxy and Account</h2>
          <p className="mb-4 type-doc-body">
            Each wallet gets one PositionProxy per CDP Spoke and market, created at a predictable CREATE2 address on its first pledge into that market. The proxy is the Aave account: it holds the market&apos;s vault tokens and the debt of every debt reserve the account borrows, under one health factor. It is logic-free and immutable, and it executes only calls from the AaveAdapter; the wallet acts through the AaveAdapter.
          </p>
          <p className="mb-4 type-doc-body">
            Because every market has its own account, nothing is cross-collateralized. Example from the specification: Alice pledges a USDC/USDT position and a GHO/USDC position on &quot;Uniswap v3 Stable&quot; and gets two proxies. She borrows 3,000 GHO on the first. If the GHO/USDC feed goes stale, the second account cannot borrow, while the first keeps borrowing and cannot be liquidated because of the second.
          </p>
        </section>

        <section id="spokes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">CDP, Lend and Coverage Spokes</h2>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Spoke</th><th className="text-left px-4 py-2 type-doc-subsection-title">What it does</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">CDP Spoke</td><td className="px-4 py-2">One standard Aave V4 Spoke per chain, Hub, AMM protocol and risk tier. It lists several markets as non-borrowable collateral reserves and the approved debt reserves. Launch: &quot;Uniswap v3 Stable&quot; on Ethereum and &quot;Aerodrome Slipstream Stable&quot; on Base.</td></tr>
                <tr><td className="px-4 py-2">Lend Spoke</td><td className="px-4 py-2">One supply-only Spoke per chain through which the Aave DAO treasury supplies each credit line. No public deposits at launch.</td></tr>
                <tr><td className="px-4 py-2">Coverage Spoke</td><td className="px-4 py-2">One supply-only Spoke per Hub and debt asset, the Avana Umbrella of that pair, holding Avana-funded First-Loss Reserve supply.</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            Every Spoke is owned and configured by the Aave DAO. The listing sets three values on every vault-token reserve: receive-shares disabled, liquidation fee 0 (or paid to Avana&apos;s fee recipient) and no reinvestment controller. Avana&apos;s drift check enforces them. Details are in{" "}
            <Link href="/developers/architecture" className="text-type-accent hover:underline">Hubs and Spokes</Link>.
          </p>
        </section>

        <section id="hubs" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Hubs</h2>
          <p className="mb-4 type-doc-body">
            An Avana Hub is a standard Aave V4 Hub owned by the Aave DAO that holds the vault tokens of its markets and the liquidity of its credit lines. There are three tiers: Stable LP, Correlated LP and Volatile LP. At launch Ethereum and Base each have one Avana Stable LP Hub. Each CDP Spoke has one home Hub for its collateral, and each Hub has its own pause state and per-Hub token and depositor caps.
          </p>
        </section>

        <section id="debt-reserves" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Debt Reserves</h2>
          <p className="mb-4 type-doc-body">
            A debt reserve is a borrowable reserve of a CDP Spoke, funded by a capped credit line. GHO is the first debt reserve on each launch Spoke. USDC, USDT or WETH can be enabled per CDP Spoke through the enable-debt-reserve operation, once the Aave DAO approves the credit line, caps, price source and swap routes. Each debt reserve records its funding Hub, its price source and its Coverage Spoke.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Credit line: the Lend Spoke supply cap equals the line, and CDP Spoke draw caps on it sum to at most the line. Launch line: 2,000,000 GHO on Ethereum, with the final value and the Base line set in the funding ARFC.</li>
            <li>Each draw cap stays within the flash liquidity of its asset in the Aave V3 Pool and the depth of its swap routes, so every borrowed amount can be liquidated in one transaction.</li>
            <li>A cross-Hub credit line, where the funding Hub differs from the Spoke&apos;s home Hub, is specified and off at launch.</li>
          </ul>
        </section>

        <section id="oracles" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Oracles and Price States</h2>
          <p className="mb-4 type-doc-body">
            Each market has an LPOracle that prices one vault token by fair composition: the token amounts the units would hold if the pool traded at the Chainlink prices, valued at those prices. A trade in the pool cannot move the valuation. Each non-GHO debt asset has a DebtOracle with the same route model; GHO debt uses Aave&apos;s fixed $1 price.
          </p>
          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"value = Σ amountᵢ(oracle prices) × priceᵢ"}</code>
          </div>
          <ul className="mt-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Each token has a Chainlink primary route, an alternate route with automatic failover and a standby route approved at listing. A feed is fresh for its own heartbeat plus 1,800 seconds.</li>
            <li>The pool&apos;s 30-minute TWAP is a consistency check, not the price. Borrowing and withdrawals with debt also need an independent second source to agree.</li>
            <li>On Base every price also reads the sequencer-uptime feed.</li>
          </ul>
          <div className="mt-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">State</th><th className="text-left px-4 py-2 type-doc-subsection-title">Meaning</th><th className="text-left px-4 py-2 type-doc-subsection-title">Effect</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Live</td><td className="px-4 py-2">Fresh prices that agree</td><td className="px-4 py-2">Normal operation</td></tr>
                <tr><td className="px-4 py-2">Drifting</td><td className="px-4 py-2">TWAP disagreement, or the primary and alternate routes disagree</td><td className="px-4 py-2">Borrowing and withdrawals with debt blocked; route disagreement also pauses seizure in that market</td></tr>
                <tr><td className="px-4 py-2">Cached</td><td className="px-4 py-2">Both routes of a token stale, for up to 1 hour</td><td className="px-4 py-2">Last accepted price served; pledges, borrowing and seizure of this market wait</td></tr>
                <tr><td className="px-4 py-2">Expired</td><td className="px-4 py-2">Cached for more than 1 hour</td><td className="px-4 py-2">Collateral counts as worthless in Aave; seizure waits for a fresh price or a standby switch</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            For 30 minutes after a price recovers from Expired, only accounts below health factor 0.95 can be liquidated. Repayment, fee collection and debt-free withdrawal work in every state. More detail is in{" "}
            <Link href="/developers/integrations/price-states" className="text-type-accent hover:underline">Price States</Link>.
          </p>
        </section>

        <section id="collateral-factor" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Collateral Factor</h2>
          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"CF_LP = floor(min CFᵢ × poolRiskFactor / 10⁴)"}</code>
          </div>
          <p className="mt-4 mb-4 type-doc-body">
            Each token&apos;s factor comes from the Aave V4 Core Hub, except that a GHO leg uses an explicit factor set at listing. The pool risk factor is set per pool by the risk service providers and is at most 40%. With two tokens at 78% and the 40% ceiling, CF_LP is 3,120 bps (31.2%). Collateral Risk sets the borrower&apos;s rate premium: borrowing rate = base rate × (1 + risk premium). See{" "}
            <Link href="/developers/architecture/collateral-factors" className="text-type-accent hover:underline">Collateral Factors</Link>.
          </p>
        </section>

        <section id="health-factor" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Health Factor</h2>
          <p className="mb-4 type-doc-body">
            Aave V4 computes one health factor per account, so per market. The only on-chain borrow limit is Aave&apos;s 1.00, plus the minimum health factor the borrower passes with each call. The Lens shows a recommended borrow at 1.10 next to the maximum at 1.00. An account holds at most 16 positions per market, and there is no minimum debt. See{" "}
            <Link href="/developers/architecture/health-factor" className="text-type-accent hover:underline">Health Factor</Link>.
          </p>
        </section>

        <section id="liquidation" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Liquidation Paths</h2>
          <p className="mb-4 type-doc-body">
            When an account&apos;s health factor is below 1, it is liquidated through Aave&apos;s standard liquidation call, always partially, by LPVaultSwap. The vault token accepts seized collateral only to LPVaultSwap, so every other caller of the Aave liquidation reverts.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Path</th><th className="text-left px-4 py-2 type-doc-subsection-title">Who</th><th className="text-left px-4 py-2 type-doc-subsection-title">Notes</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">liquidate</code></td><td className="px-4 py-2">Any address that is not frozen, including Avana&apos;s keeper and the Aave DAO</td><td className="px-4 py-2">The only liquidation entry point; either swap-route mode; the caller funds the debt asset</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">flashLiquidate</code></td><td className="px-4 py-2">Any caller without the debt asset, through the public flash liquidation helper</td><td className="px-4 py-2">The helper flash-borrows the debt asset from the Aave V3 Pool, calls liquidate and repays the loan from the caller&apos;s payout</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">repayWithCollateral</code></td><td className="px-4 py-2">The borrower</td><td className="px-4 py-2">Repays from part of its own position; no bonus and no Avana fee</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            In one transaction LPVaultSwap takes the debt asset from its caller, repays the debt, receives and burns the seized vault tokens, has the LPVault unwind exactly those units, swaps each token into the debt asset with oracle-derived minimums and pays out: Avana&apos;s fee, any borrower surplus, then the rest to the caller. If the swaps cannot settle, the call reverts and nothing changes. No Avana pause, breaker or freeze stops liquidation. See{" "}
            <Link href="/developers/liquidation" className="text-type-accent hover:underline">Liquidation</Link>.
          </p>
        </section>

        <section id="avana-umbrella" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Avana Umbrella</h2>
          <p className="mb-4 type-doc-body">
            Avana Umbrella is Avana&apos;s protocol safety module, named after Aave&apos;s Umbrella, whose design inspired it. Each Hub and debt asset has one: a Coverage Spoke controlled by the Aave DAO and funded by Avana Labs in that asset, holding the pair&apos;s First-Loss Reserve. When a liquidation empties an account while debt remains, Aave records a deficit on the funding Hub, and the Umbrella of the same Hub and asset covers it within 72 hours. It is Avana&apos;s only on-chain loss layer. A deficit larger than the reserve is a loss to that Hub asset&apos;s suppliers.
          </p>
        </section>

        <section id="pause-breakers" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Pauses and Breakers</h2>
          <p className="mb-4 type-doc-body">
            Avana&apos;s containment tools stop new activity only. Repayment, fee collection, debt-free withdrawal and liquidation stay open in every state.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Pause state per Hub: None, Frozen or Paused. Frozen blocks new accounts and borrowing. Paused, with the reason General, also blocks top-ups other than rescue top-ups, withdrawals with debt and repay with collateral. A pause with the reason MintPathSuspect also refuses every top-up.</li>
            <li>Circuit breakers per market and per debt reserve. Temporary gates (price, pool share, pool depth) clear after 30 minutes of healthy observations. Security freezes (an outstanding deficit above 10,000 GHO, issuer action, configuration drift, a guardian&apos;s manual trip) stay until an authorized reset.</li>
            <li>Address freeze: a per-chain freeze of one wallet&apos;s new activity, at most 20 per guardian per rolling 24 hours, lifted only by a normal-delay operation.</li>
          </ul>
          <p className="mt-4 type-doc-body">
            The Emergency Guardian (a 3-of-5 Safe per chain) and the Aave Protocol Guardian can use these tools at once. See{" "}
            <Link href="/developers/safety/emergency-controls" className="text-type-accent hover:underline">Emergency Controls</Link>.
          </p>
        </section>

        <section id="timelock" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">AvanaTimelock</h2>
          <p className="mb-4 type-doc-body">
            Every privileged change to an Avana contract on a chain executes through that chain&apos;s AvanaTimelock, with no bypass. The governance multisig (4-of-7) and the Aave governance executor propose. Anyone executes a ready operation within its 14-day grace window.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Delay</th><th className="text-left px-4 py-2 type-doc-subsection-title">Value</th><th className="text-left px-4 py-2 type-doc-subsection-title">Used for</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Normal</td><td className="px-4 py-2">5 days (never below 4 or above 5)</td><td className="px-4 py-2">Upgrades, listings, loosening parameters, keeper additions, role changes</td></tr>
                <tr><td className="px-4 py-2">Short</td><td className="px-4 py-2">12 hours</td><td className="px-4 py-2">Only a fixed set of risk-reducing, activity-stopping or restoring calls</td></tr>
                <tr><td className="px-4 py-2">Grace</td><td className="px-4 py-2">14 days</td><td className="px-4 py-2">Window to execute a ready operation</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            The governance multisig, the Emergency Guardian, the Aave Protocol Guardian and the Aave governance executor can cancel. Only the Aave governance executor can cancel a role change or an operation that restores reviewed configuration. See{" "}
            <Link href="/developers/safety/governance" className="text-type-accent hover:underline">Governance</Link>.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="The concepts behind Avana: markets and vault tokens, per-market accounts, Hubs and Spokes, debt reserves, oracles, collateral and health factors, liquidation, Avana Umbrella, pauses and the timelock."
        sectionColor="blue"
      />
    </div>
  ))
}
