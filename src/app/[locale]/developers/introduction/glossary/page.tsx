import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'introduction/glossary', {
    title: "Glossary",
    description: "Definitions of Avana terms in alphabetical order, from AaveAdapter and Avana Umbrella to vault tokens, with the terms that are no longer part of the design.",
  })
}

const sections = [
  { id: "a-b", title: "A – B" },
  { id: "c", title: "C" },
  { id: "d-f", title: "D – F" },
  { id: "g-l", title: "G – L" },
  { id: "m-p", title: "M – P" },
  { id: "r-s", title: "R – S" },
  { id: "t-v", title: "T – V" },
  { id: "removed", title: "No Longer Used" },
  { id: "disclaimers", title: "Disclaimers" },
]

type GlossaryEntry = { key: string; term: ReactNode; definition: string }

const glossaryGroups: Array<{ id: string; heading: string; entries: GlossaryEntry[] }> = [
  {
    id: "a-b",
    heading: "A – B",
    entries: [
      { key: "AaveAdapter", term: <>AaveAdapter</>, definition: "The upgradeable entry point on each chain for every borrower action: pledge, borrow, repay, withdraw, partial removal, re-credit, repay with collateral and fee collection. It creates proxies, mints and burns vault tokens, runs the RiskModule's checks and has the proxy call the Spoke." },
      { key: "Address freeze", term: <>Address freeze</>, definition: "A per-chain stop of one wallet's new activity, set by a guardian and lifted only by a normal-delay timelock operation. A frozen wallet keeps repay, debt-free withdrawal, fee collection and rescue top-ups, and its positions can still be liquidated." },
      { key: "AMM integration", term: <>AMM integration</>, definition: "Avana's code for one AMM protocol: its LPVault and pricing library. It takes custody of positions, reads their token amounts at a given price, removes exact units, collects separated fees and reports range and pool-share data." },
      { key: "AMM protocol", term: <>AMM protocol</>, definition: "A DEX family whose positions Avana can accept. At launch: Uniswap v3 on Ethereum and Aerodrome Slipstream on Base. Uniswap v2, Curve, Balancer and Uniswap v4 are supported by the core and are listed only after their readiness checks pass." },
      { key: "Application pause state", term: <>Application pause state</>, definition: "The state of one Hub held by the chain's MarketRegistry: None, Frozen or Paused, with a pause reason of General or MintPathSuspect. It stops new activity only; repay, fee collection, debt-free withdrawal and liquidation stay open." },
      { key: "Avana Hub", term: <>Avana Hub</>, definition: "A standard Aave V4 Hub owned by the Aave DAO that holds the vault tokens of its markets and the liquidity of its credit lines. There are three tiers, Stable LP, Correlated LP and Volatile LP; at launch Ethereum and Base each have an Avana Stable LP Hub." },
      { key: "Avana Umbrella", term: <>Avana Umbrella</>, definition: "Avana's protocol safety module, named after Aave's Umbrella, whose design inspired it. It is the Coverage Spoke of one Hub and debt asset, funded by Avana Labs and controlled by the Aave DAO, and it covers recorded deficits in that asset." },
      { key: "AvanaTimelock", term: <>AvanaTimelock</>, definition: "The immutable, self-administered timelock on each chain through which every privileged Avana change executes. Normal delay 5 days (never below 4), short delay 12 hours for a fixed set of calls, 14-day grace window, public execution and two proposers." },
      { key: "Backing invariant", term: <>Backing invariant</>, definition: "For each market, vault-token supply is at most the credited units plus the pending-settlement units, and equal while every seizure is settled in the same call. Every vault token in circulation is therefore backed by liquidity in custody." },
      { key: "Backing record", term: <>Backing record</>, definition: "Collateralization's entry for one pledged position: depositor, proxy, market, position key, credited units and status. An account holds at most 16 open records per market." },
      { key: "Borrower surplus", term: <>Borrower surplus</>, definition: "The part of a liquidation's recovery above the oracle value of the seized units. It is paid to the borrower's wallet in the debt asset." },
    ],
  },
  {
    id: "c",
    heading: "C",
    entries: [
      { key: "CDP Spoke", term: <>CDP Spoke</>, definition: "A standard Aave V4 Spoke per chain, Hub, AMM protocol and risk tier, owned by the Aave DAO. It lists several markets as collateral reserves and the approved debt reserves. Launch Spokes: \"Uniswap v3 Stable\" on Ethereum and \"Aerodrome Slipstream Stable\" on Base." },
      { key: "Circuit breaker", term: <>Circuit breaker</>, definition: "An automatic stop of new activity in one market or one debt reserve. A temporary gate clears after 30 minutes of healthy observations; a security freeze reopens only after an authorized reset." },
      { key: "Collateral factor (CF)", term: <>Collateral factor (CF)</>, definition: "The Aave V4 factor that sets how much of a reserve's value can support debt. For a vault-token reserve it is the lowest of its tokens' collateral factors multiplied by the pool risk factor, rounded down." },
      { key: "Collateral Risk", term: <>Collateral Risk</>, definition: "A per-reserve value set in the Aave listing that sets the borrower's risk premium. It is not a haircut on collateral value. The borrowing rate is the base rate times one plus the risk premium." },
      { key: "Collateralization", term: <>Collateralization</>, definition: "The immutable, AMM-neutral backing ledger on each chain. It keeps every backing record, the largest-first seizure lists, the exposure counters per Hub and the pending-settlement balance." },
      { key: "Coverage ratio", term: <>Coverage ratio</>, definition: "The required size of a First-Loss Reserve: funded balance times 10⁴ must be at least the coverage ratio in bps times the sum of draw caps on that Hub and asset. It is set in the funding ARFC; 20% is an illustrative guide." },
      { key: "Coverage Spoke", term: <>Coverage Spoke</>, definition: "A DAO-controlled, supply-only Spoke holding Avana-funded supply of one asset on one Hub, the First-Loss Reserve of that pair. One per Hub and debt asset per chain; also called the Avana Umbrella." },
      { key: "Credit line", term: <>Credit line</>, definition: "A capped amount of one asset that the Aave DAO treasury supplies through the Lend Spoke. It is a draw cap per Hub, asset and CDP Spoke; the draw caps sum to at most the line." },
      { key: "Credited units", term: <>Credited units</>, definition: "The units read from the AMM integration when a position was pledged, less units removed by liquidation and partial removal, plus units added by re-credit. Vault tokens exist only against them." },
      { key: "Cross-Hub credit line", term: <>Cross-Hub credit line</>, definition: "A debt reserve whose funding Hub is not its CDP Spoke's home Hub. It is fully specified and off at launch on every chain." },
    ],
  },
  {
    id: "d-f",
    heading: "D – F",
    entries: [
      { key: "Debt reserve", term: <>Debt reserve</>, definition: "A borrowable reserve of a CDP Spoke, recorded with its asset, funding Hub, price source, Coverage Spoke and swap routes. GHO is the first; USDC, USDT or WETH can be enabled per Spoke through the enable-debt-reserve operation." },
      { key: "DebtOracle", term: <>DebtOracle</>, definition: "The upgradeable Aave price source of one non-GHO debt asset on one chain, with primary, alternate and standby routes, failover, an agreement check and Cached and Expired states. Once Expired it serves its last price raised by a stress rise." },
      { key: "Deficit", term: <>Deficit</>, definition: "Debt that Aave records as unbacked on the funding Hub, per debt reserve and in its own asset, when a liquidation leaves an account with no collateral. Only the Coverage Spoke of the same Hub and asset clears it." },
      { key: "Delay classes", term: <>Delay classes</>, definition: "How fast each privileged change can happen: immediate guardian actions (pause, freeze, breaker trips, standby switch, cancel), the 12-hour short delay for a fixed set of risk-reducing calls, the 5-day normal delay for everything else, immutable values and Aave governance." },
      { key: "Deployment operations", term: <>Deployment operations</>, definition: "The three timelock operations that add a CDP Spoke, a market and a debt reserve: deployCdpSpoke, listCollateralMarket and enableDebtReserve. Each runs at the normal delay and is followed by a short-delay activation." },
      { key: "Depositor of record", term: <>Depositor of record</>, definition: "The wallet that owned and pledged a position. Only it receives the position back and its separated fees, and it is the bound wallet of its PositionProxy." },
      { key: "Drift check", term: <>Drift check</>, definition: "Avana's on-chain comparison of the live Aave configuration with the values Avana's sizing assumes, including the three required settings and the collateral factor. A mismatch stops new borrowing in the affected market while liquidation continues." },
      { key: "Emergency Guardian", term: <>Emergency Guardian</>, definition: "A 3-of-5 Safe on each chain, with signers separate from the governance multisig and the Aave Protocol Guardian. It can pause or freeze Hubs, freeze addresses, trip and reset breakers, switch to standby price routes and cancel queued operations; it cannot upgrade or change parameters." },
      { key: "First-Loss Reserve", term: <>First-Loss Reserve</>, definition: "Avana-funded supply of one asset in the Coverage Spoke of one Hub, funded before any draw cap on that pair rises above 0. It is Avana's only on-chain loss layer and covers recorded deficits within 72 hours." },
      { key: "Flash source", term: <>Flash source</>, definition: "The per-chain contract through which LPVaultSwap flash-borrows the debt asset from the Aave V3 Pool, single asset. Its premium must be at most 10 bps, and it is never the funding Hub of the reserve being liquidated." },
      { key: "Freshness", term: <>Freshness</>, definition: "A feed is fresh while its age is at most its own heartbeat plus a 1,800-second margin. Chainlink stablecoin feeds have heartbeats of 82,800 to 86,400 seconds." },
      { key: "Funding Hub", term: <>Funding Hub</>, definition: "The Hub a debt reserve draws from. It bears the reserve's deficits, and its pause stops the reserve's borrows." },
    ],
  },
  {
    id: "g-l",
    heading: "G – L",
    entries: [
      { key: "Governance multisig", term: <>Governance multisig</>, definition: "A 4-of-7 Safe on each chain with at most 3 Avana Labs signers, at least three organizations and three jurisdictions. With the Aave governance executor it proposes timelock operations; it has no instant power." },
      { key: "Grace", term: <>Grace</>, definition: "For 30 minutes after a price recovers from Expired, and for 1 hour after a Base sequencer restart, an account can be liquidated only below health factor 0.95. Borrowers get time to act on prices they could not see." },
      { key: "Health factor (HF)", term: <>Health factor (HF)</>, definition: "Aave V4's measure of one account on one Spoke: collateral value times collateral factor, divided by total debt value. Below 1.00 the account can be liquidated. In Avana each market has its own account and health factor." },
      { key: "Home Hub", term: <>Home Hub</>, definition: "The Hub where a CDP Spoke's collateral reserves live, recorded when the Spoke is registered." },
      { key: "Incident window", term: <>Incident window</>, definition: "The 48-hour longest liquidation stop that caps are sized for: an Aave-side reserve pause or Hub halt, or an oracle price-state pause. Avana's own pause states, breakers and address freeze never stop liquidation." },
      { key: "InKindEscrow", term: <>InKindEscrow</>, definition: "The small immutable payout escrow on each chain. It holds a liquidation payout that a token refused to deliver (the borrower's surplus, Avana's fee or a keeper's reward) until the recipient claims it to an address of its choice." },
      { key: "Keeper", term: <>Keeper</>, definition: "An address on a chain's LPVaultSwap keeper list. Each chain has at least one, Avana's own keeper, and at most 32. A standby keeper on separate infrastructure can be added through the timelock." },
      { key: "Keeper reward", term: <>Keeper reward</>, definition: "The liquidation caller's payout: the oracle gain after Avana's 20% share, up to what the swaps realized. It is paid in the debt asset repaid." },
      { key: "Lend Spoke", term: <>Lend Spoke</>, definition: "The DAO-owned, supply-only Spoke on each chain through which credit lines are supplied to Hub and asset pairs, GHO first. Public lender deposits are not offered at launch." },
      { key: "Lens", term: <>Lens</>, definition: "A read-only periphery contract on each chain, outside the audited core, that gives views and previews: accounts, price states, cap headroom, borrow and repay quotes and liquidation previews. No core contract calls it." },
      { key: "Liquidation bonus", term: <>Liquidation bonus</>, definition: "The extra collateral Aave seizes per unit of debt repaid, set by the Aave DAO on each CDP Spoke. Avana recommends a minimum bonus of at least 2% and a target health factor of 1.10." },
      { key: "Lock", term: <>Lock</>, definition: "The immutable reentrancy lock shared by Avana's contracts on one chain. Its two members are the AaveAdapter and LPVaultSwap; custody contracts accept value-moving calls only while one of them holds it." },
      { key: "LPOracle", term: <>LPOracle</>, definition: "The upgradeable price feed of one market, with 8 decimals. It prices one vault token by fair composition at Chainlink prices, checks the pool TWAP and a second source, and never reverts or returns 0." },
      { key: "LPVault", term: <>LPVault</>, definition: "The immutable custodian of every pledged position of one AMM protocol on one chain. It validates the exact shape, records the depositor of record, unwinds exact units and returns positions only to their depositor." },
      { key: "LPVaultSwap", term: <>LPVaultSwap</>, definition: "The liquidation contract on each chain and the only address the vault token accepts seized collateral to. It flash-borrows the debt asset, calls Aave's liquidation, has the seized units unwound and swaps them into the debt asset in one transaction." },
    ],
  },
  {
    id: "m-p",
    heading: "M – P",
    entries: [
      { key: "Market", term: <>Market</>, definition: "One pool of one AMM protocol on one chain with one exact position shape, with its vault token and its collateral reserve on one CDP Spoke. For concentrated liquidity the shape is the exact tick range." },
      { key: "MarketRegistry", term: <>MarketRegistry</>, definition: "The upgradeable registry on each chain of Hubs, CDP Spokes, markets and their status, debt reserves, price and swap routes, the pause state of each Hub, breaker state and the address freeze set." },
      { key: "Minimum pledge", term: <>Minimum pledge</>, definition: "The smallest USD value a pledge or top-up can add, $10 per market by default. A rescue top-up needs only $10 or the minimum, whichever is lower." },
      { key: "Offboarding", term: <>Offboarding</>, definition: "A market status that blocks new pledges and borrowing. After 5 days of notice the liquidation threshold steps down daily over 30 days to half its listed value; repayment, withdrawal and liquidation stay open throughout." },
      { key: "Oracle gain", term: <>Oracle gain</>, definition: "The oracle value of the units seized in a liquidation, less the debt repaid and the flash premium. Avana's fee is 20% of it, capped by the realized surplus." },
      { key: "ParameterStore", term: <>ParameterStore</>, definition: "The upgradeable store on each chain of every risk parameter with its bounds, a tightening setter at the short delay and a loosening setter at the normal delay." },
      { key: "Partial removal", term: <>Partial removal</>, definition: "Removing part of a pledged position's credited units: the matching vault tokens are burned and the principal goes to the depositor while the position stays pledged." },
      { key: "Pending-settlement balance", term: <>Pending-settlement balance</>, definition: "Token amounts Collateralization removed for vault tokens Aave seized but that were never settled. They back those vault tokens until anyone calls the pending settlement, which sends the recovered value to the Coverage Spoke." },
      { key: "Permissionless liquidation", term: <>Permissionless liquidation</>, definition: "The liquidation entry point open to any address, the Aave DAO included. It uses the primary-then-backup swap routes only and pays no gas reimbursement." },
      { key: "Pool risk factor", term: <>Pool risk factor</>, definition: "A per-pool discount in the collateral factor formula, from 1 to 4,000 bps, set by the Aave V4 risk service providers in the listing payload. It reflects range, price sensitivity, pool depth and liquidation cost." },
      { key: "Pool-share cap", term: <>Pool-share cap</>, definition: "An optional cap on Avana's combined share of a pool's liquidity on a chain. It is off by default and applies only where a pool's listing sets one; a share above 25% raises a monitoring alert." },
      { key: "Position key", term: <>Position key</>, definition: "The identifier of a position within its AMM integration. With the integration ID it names a position on a chain." },
      { key: "PositionProxy", term: <>PositionProxy</>, definition: "One logic-free immutable account per wallet, CDP Spoke and market, created with CREATE2. It is the Aave account for that market and executes only calls from the chain's AaveAdapter." },
      { key: "Price states", term: <>Price states</>, definition: "Live, Drifting (TWAP or route disagreement), Cached (both routes stale, up to 1 hour) and Expired (after 1 hour). They gate borrowing and seizure; repay and debt-free withdrawal work in every state." },
      { key: "ProxyManager", term: <>ProxyManager</>, definition: "The immutable contract on each chain that creates PositionProxies at their predicted addresses on the AaveAdapter's request. It refuses a frozen wallet and holds no proxy code that can change." },
    ],
  },
  {
    id: "r-s",
    heading: "R – S",
    entries: [
      { key: "Re-credit", term: <>Re-credit</>, definition: "Crediting liquidity the depositor added to a pledged position through the AMM protocol, with every top-up check. Units anyone adds are not counted until the depositor re-credits them." },
      { key: "Recovery floor", term: <>Recovery floor</>, definition: "The minimum amount of the debt asset a liquidation's unwind and swaps must return: the oracle value of the seized units less the allowed slippage (1% by default) and small rounding allowances." },
      { key: "Repay with collateral", term: <>Repay with collateral</>, definition: "Repaying debt from part of one pledged position in one flash-funded call. No bonus or Avana fee applies, and the health factor after the call cannot be lower than before it." },
      { key: "Required Spoke settings", term: <>Required Spoke settings</>, definition: "Three values the listing sets on every vault-token reserve: receive-shares disabled, liquidation fee 0 or paid to Avana's fee recipient, and no reinvestment controller. Together with the vault token's transfer rule they make LPVaultSwap the only liquidator." },
      { key: "Rescue top-up", term: <>Rescue top-up</>, definition: "A pledge into an indebted account below health factor 1.10, capped at the amount that restores 1.10. It passes containment, and its rescue units count in liquidation but never support new debt." },
      { key: "RiskModule", term: <>RiskModule</>, definition: "The upgradeable contract that runs Avana's pledge and borrow-side checks: health factor with rescue units excluded, price freshness and agreement, sequencer state, Aave flags, drift and circuit breakers. It holds no tokens." },
      { key: "Sequencer grace", term: <>Sequencer grace</>, definition: "On Base, the 1-hour period after a sequencer restart during which borrowing is refused and only accounts below health factor 0.95 can be liquidated." },
      { key: "Shortfall top-up", term: <>Shortfall top-up</>, definition: "Debt asset a liquidation caller adds from its own funds when the swaps land below the recovery floor, within its own limit. It also pays any rounding gap at final settlement." },
      { key: "Standby route", term: <>Standby route</>, definition: "A price route approved at listing that a guardian can switch a token to at once. The Aave governance executor can undo the switch at once; switching back otherwise takes the normal delay." },
      { key: "Stress floor", term: <>Stress floor</>, definition: "The lowest whole-vault-token price used for cap charges and Hub supply-cap sizing, $1.00 by default. It keeps every pledge Avana accepts within Aave's supply cap." },
      { key: "Stress valuation", term: <>Stress valuation</>, definition: "The conservative price Aave sees for a reserve whose own price is failing: an Expired market at the smallest price, a disagreeing market at the lower route, Expired debt raised by its stress rise. Nothing is seized or repaid at it." },
      { key: "Swap route", term: <>Swap route</>, definition: "A fixed path recorded per market, token and debt asset, with a primary and a backup, that LPVaultSwap uses to swap an unwound token into the debt asset. It never trades through the market's own pool." },
    ],
  },
  {
    id: "t-v",
    heading: "T – V",
    entries: [
      { key: "Target health factor", term: <>Target health factor</>, definition: "The health factor Aave sizes each liquidation toward, one value per CDP Spoke. Avana recommends 1.10; the Aave DAO decides." },
      { key: "Top-up", term: <>Top-up</>, definition: "A pledge into an account that already has debt. A pledge into an account with no debt on any debt reserve opens a new account." },
      { key: "Top-up slice", term: <>Top-up slice</>, definition: "A part of each market's cap, 10% by default, reserved for rescue top-ups so that a full market never stops a borrower adding collateral." },
      { key: "Vault token", term: <>Vault token</>, definition: "The immutable, owner-less, collateral-only ERC-20 of one market. One base unit equals one credited unit; only the AaveAdapter mints and burns it, and it moves only between a registered proxy, the Hub and LPVaultSwap." },
      { key: "Vault-token fee receiver", term: <>Vault-token fee receiver</>, definition: "The Aave treasury Spoke registered on each vault-token Hub asset, with supply and draw caps of 0 so that it never holds vault tokens." },
      { key: "VaultTokenFactory", term: <>VaultTokenFactory</>, definition: "The immutable contract on each chain that deploys vault tokens with CREATE3 at predictable addresses, called only by the timelock, and keeps the write-once token and LPVault registries." },
    ],
  },
  {
    id: "removed",
    heading: "No Longer Used",
    entries: [
      { key: "Borrow Spoke", term: <>Borrow Spoke</>, definition: "The earlier name for a CDP Spoke." },
      { key: "Full-position settlement", term: <>Full-position settlement</>, definition: "Removed. Every liquidation is partial: Aave sizes the seizure, and the borrower keeps the rest of the position and all of its fees." },
      { key: "In-kind settlement", term: <>In-kind settlement</>, definition: "Removed. Every liquidation swaps the unwound tokens into the debt asset in the same transaction or reverts; no keeper takes the unwound tokens." },
      { key: "SettlementBudget", term: <>SettlementBudget</>, definition: "Removed. No Avana contract pays rounding gaps; the liquidation caller sizes its funding up front and pays any rounding gap through its shortfall top-up." },
    ],
  },
]

export default async function GlossaryPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "introduction/glossary", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      {/* Main content */}
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader title="Glossary" />

        {glossaryGroups.map((group) => (
          <section key={group.id} id={group.id} className="mb-10">
            <h2 className="type-doc-section-title mb-6 pb-2 border-b border-gray-200">
              {group.heading}
            </h2>
            <dl className="space-y-4">
              {group.entries.map((item) => (
                <div key={item.key} className="group">
                  <dt className="type-doc-subsection-title mb-1">{item.term}</dt>
                  <dd className="type-doc-body pl-4 border-l-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                    {item.definition}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}

        <section id="disclaimers" className="mb-10">
          <h2 className="type-doc-section-title mb-6 pb-2 border-b border-gray-200">
            Disclaimers
          </h2>
          <div className="type-doc-callout type-doc-callout-warning">
            <ul className="type-doc-body space-y-2">
              <li><strong>No Investment Advice:</strong> Avana is a software protocol. This documentation does not constitute investment advice.</li>
              <li><strong>Status:</strong> The public sandbox uses simulated assets and makes no onchain transactions.</li>
              <li><strong>Risk of Loss:</strong> Users can lose funds through smart contract vulnerabilities, market volatility, impermanent loss, liquidation, or oracle failure.</li>
              <li><strong>Regulatory Status:</strong> The regulatory status of Avana and its tokens (if any) is not guaranteed and may vary by jurisdiction.</li>
              <li><strong>No Warranty:</strong> The software is provided &quot;as is&quot; without warranty of any kind.</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Right scroll-spy sidebar */}
      <DeveloperScrollSpyRail
        sections={sections}
        sectionColor="blue"
      />
    </div>
  ))
}
