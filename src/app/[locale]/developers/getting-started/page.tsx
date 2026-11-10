import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'getting-started', {
    title: "Getting Started - Deposit LP",
    description: "How to pledge an exact-range Uniswap v3 position on Ethereum or an unstaked Aerodrome Slipstream position on Base into Avana as collateral: eligibility, approvals, the pledge call, top-ups, re-credit, checks, events and failures.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "eligibility", title: "Eligible Positions" },
  { id: "approvals", title: "Approvals" },
  { id: "pledge-call", title: "The Pledge Call" },
  { id: "pledge-kinds", title: "New Account, Top-Up and Rescue Top-Up" },
  { id: "recredit", title: "Re-Credit Added Liquidity" },
  { id: "checks", title: "Pledge Checks" },
  { id: "availability", title: "Availability by State" },
  { id: "what-is-minted", title: "What Is Minted" },
  { id: "events", title: "Events" },
  { id: "failures", title: "Failures" },
  { id: "lens-pre-checks", title: "Lens Pre-Checks" },
  { id: "worked-example", title: "Worked Example" },
]

const eligibleRows = [
  {
    amm: "Uniswap v3",
    chain: "Ethereum",
    key: "bytes32(tokenId)",
    notes: "Positions from the canonical Uniswap v3 position manager in a listed pool, with ticks equal to the market's range.",
  },
  {
    amm: "Aerodrome Slipstream",
    chain: "Base",
    key: "bytes32((uint256(generation) << 248) | tokenId)",
    notes: "Unstaked positions only, from the position-manager generation the market pins. Token IDs repeat across Slipstream's position managers, so the key carries the generation in its high byte.",
  },
]

const pledgeKinds = [
  {
    kind: "New-account pledge",
    when: "The wallet has no proxy for the market yet, or its proxy has zero debt on every debt reserve. This includes a first pledge and more collateral for a debt-free account.",
    rules: "Refused while the Hub is Frozen, while the sequencer gate is Down or in Grace, and while the Aave configuration has drifted. Needs a Live price (or Drifting caused only by a USD-band breach) and room in the market's Regular budget.",
  },
  {
    kind: "Top-up",
    when: "The proxy has non-zero debt on at least one debt reserve.",
    rules: "Allowed while the Hub is Frozen, during a sequencer outage or grace window, and during Aave configuration drift, because added collateral only lowers risk. Needs a Live or Drifting price. While the account's health factor is below 1.10 it may use the top-up slice.",
  },
  {
    kind: "Rescue top-up",
    when: "A top-up into an account whose health factor is below the rescue target of 1.10, whose charge is at most the USD that restores 1.10, and whose value is at least the smaller of minPledgeUsd and $10.",
    rules: "The only pledge admitted under Paused with reason General, from a frozen wallet, while a rescue-only market breaker is tripped, above the pool-share cap, or below minPledgeUsd. All of its units are rescue units, which never support new debt.",
  },
]

const checkRows = [
  {
    check: "Market status",
    rule: "The market is Active in the MarketRegistry, not Offboarding or Closed.",
    error: "MarketNotActive / MarketOffboarding",
  },
  {
    check: "Price state",
    rule: "A new-account pledge needs Live, or Drifting caused only by a USD-band breach. A top-up needs Live or Drifting. Cached and Expired are refused. Each feed is fresh while its age is at most its own heartbeat plus 1,800 seconds (88,200 seconds for a 24-hour stablecoin feed).",
    error: "PriceNotAccepted",
  },
  {
    check: "Sequencer gate (Base)",
    rule: "A new-account pledge is refused while the Base sequencer is down and for 3,600 seconds after it restarts. Top-ups are not affected. Ethereum's gate is always Up.",
    error: "SequencerDown / SequencerGrace",
  },
  {
    check: "Minimum value",
    rule: "The pledge's value at the served LPOracle price, rounded down, is at least minPledgeUsd ($10 per market at launch). A rescue top-up needs at least the smaller of minPledgeUsd and $10.",
    error: "BelowMinPledge",
  },
  {
    check: "Market cap",
    rule: "The regular part of the charge fits the market's Regular budget, bounded by marketUsdCap. The charge is priced at no less than stressFloorUsd ($1.00 per whole vault token), rounded up.",
    error: "CapExceeded",
  },
  {
    check: "Token and depositor caps",
    rule: "The regular part fits tokenUsdCap for each pool token and depositorUsdCap for the wallet. Both caps are counted once per Hub across every CDP Spoke and market.",
    error: "CapExceeded",
  },
  {
    check: "Top-up slice",
    rule: "A new-account pledge must fit the Regular budget. A top-up may book part of its charge from topUpSliceUsd (10% of marketUsdCap) only while the account's health factor is below 1.10, and only up to the USD that restores 1.10. Units booked this way are rescue units.",
    error: "SliceNotAvailable",
  },
  {
    check: "Pool share",
    rule: "Avana's combined credited liquidity in the pool, across all borrowers, Spokes and markets on the chain, stays at or below poolShareMaxBps of the pool's time-weighted liquidity. The chain default is 10,000 bps (no limit); a per-pool cap applies only where the listing sets one. Only a rescue top-up may exceed it.",
    error: "PoolShareExceeded / PoolShareUnavailable",
  },
  {
    check: "Record limit",
    rule: "An account holds at most 16 open records per market, so liquidating any account walks at most 16 records. An account at 16 records adds collateral with recredit.",
    error: "TooManyRecords",
  },
  {
    check: "Aave state",
    rule: "The vault-token reserve is not paused or frozen, the home Hub's entry for the Spoke is active and not halted, the Hub addCap has room for the units, and the per-user reserve limit is not reached. For a new account, no approved debt reserve is paused.",
    error: "AaveReserveUnavailable / HubSpokeUnavailable / HubAddCapReached / UserReservesLimit / DebtReservePaused",
  },
  {
    check: "Configuration drift (new accounts)",
    rule: "The Aave configuration matches what Avana expects, including the standard-Spoke settings, and Hub shares equal assets for the vault token. Drift never stops a top-up or a rescue top-up.",
    error: "ConfigDrift / HubSharesNotEqualAssets",
  },
  {
    check: "Pause, freeze and breakers",
    rule: "Paused with reason MintPathSuspect refuses every pledge. Frozen refuses new-account pledges. Paused with reason General, a frozen wallet, or a tripped rescue-only market breaker admit only a rescue top-up.",
    error: "ApplicationPaused / ApplicationFrozen / NotRescueTopUp / BreakerTripped",
  },
]

const availabilityRows = [
  ["Hub state None, price Live, sequencer Up", "Allowed", "Allowed", "Allowed"],
  ["Hub Frozen", "Refused", "Allowed", "Allowed"],
  ["Hub Paused, reason General", "Refused", "Refused", "Allowed"],
  ["Hub Paused, reason MintPathSuspect", "Refused", "Refused", "Refused"],
  ["Wallet address-frozen", "Refused", "Refused", "Allowed"],
  ["Base sequencer Down", "Refused", "Allowed while the price is Live or Drifting", "Allowed while the price is Live or Drifting"],
  ["Base sequencer Grace (3,600 s after restart)", "Refused", "Allowed", "Allowed"],
  ["Rescue-only market breaker tripped, or pool share above the pool's listed cap", "Refused", "Refused", "Allowed"],
  ["Price drop, seizure surge or route-failure alert with no guardian trip", "Allowed", "Allowed", "Allowed"],
  ["Drifting from TWAP or feed disagreement", "Refused", "Allowed", "Allowed"],
  ["USD-band breach only", "Allowed", "Allowed", "Allowed"],
  ["Cached or Expired", "Refused", "Refused", "Refused"],
  ["Market not active, Offboarding or Closed", "Refused", "Refused", "Refused"],
  ["Aave configuration drift, Hub shares not equal to assets", "Refused", "Allowed", "Allowed"],
  ["Aave vault-token reserve paused or frozen", "Refused", "Refused", "Refused"],
  ["Any approved debt reserve paused", "Refused", "Allowed", "Allowed"],
  ["Hub halts or deactivates the CDP Spoke", "Refused", "Refused", "Refused"],
  ["Account already holds 16 records", "Refused", "Refused (use recredit)", "Refused (use recredit)"],
  ["Pledge value below minPledgeUsd", "Refused", "Refused", "Allowed down to $10"],
  ["Regular budget full", "Refused", "Refused", "Allowed from the slice, up to the amount that restores HF 1.10"],
]

const eventRows = [
  ["ProxyDeployed, UserProxyCreated", "ProxyManager, AaveAdapter", "First pledge into the market only; always before the proxy's first supply."],
  ["ProxyAdded", "Vault token", "First pledge of the proxy only: the proxy is registered in the market's vault token."],
  ["Transfer (NFT), PositionReceived", "Position manager, LPVault", "The NFT moves from the wallet to the LPVault."],
  ["PriceAccepted, PriceStateChanged, FailureRecorded, GraceStarted", "LPOracle", "Only when the oracle poke changes stored state."],
  ["CollateralPledged", "Collateralization", "The record is written with its units, charge and slice part."],
  ["Transfer, Supply, SetUsingAsCollateral", "Vault token, Hub, Spoke", "Units are minted to the proxy, supplied to the CDP Spoke and enabled as collateral."],
  ["CollateralSupplied", "AaveAdapter", "The proxy's supply is confirmed."],
  ["CollateralAdded", "AaveAdapter", "The pledge is complete."],
  ["RecordRecredited, CollateralRecredited", "Collateralization, AaveAdapter", "A re-credit of added liquidity is complete."],
]

const failureRows = [
  ["LockHeld", "Another Avana call is already running in the same transaction."],
  ["DeadlineExpired", "The block timestamp is past the deadline."],
  ["UnknownMarket / IntegrationMismatch / UnknownSpoke", "The market has no vault token, the integration is not the market's, or the CDP Spoke is not approved."],
  ["ApplicationPaused", "The home Hub is Paused with reason MintPathSuspect."],
  ["ApplicationFrozen", "The home Hub is Frozen and the pledge is a new-account pledge."],
  ["AddressIsFrozen", "A frozen wallet without a proxy tries to open one."],
  ["TooManyRecords", "The account already holds 16 open records in the market."],
  ["NotPositionOwner", "The caller does not own the position, including a Slipstream NFT staked in a gauge."],
  ["RangeMismatch / ShapeMismatch", "The position's pool or tick range is not exactly the market's."],
  ["PoolLocked / AlreadyPledged", "The pool is inside its own callback, or the position already has an open record."],
  ["ZeroLiquidity / LiquidityAboveBound", "The position has no liquidity, or more than the largest creditable amount."],
  ["MarketNotActive / MarketOffboarding", "The market is not active."],
  ["PriceNotAccepted", "The price state does not allow this kind of pledge."],
  ["SequencerDown / SequencerGrace", "A new-account pledge on Base during a sequencer outage or the grace window after it."],
  ["BelowMinPledge", "The pledge is worth less than minPledgeUsd (or less than $10 for a rescue top-up)."],
  ["CapExceeded / PoolShareExceeded / PoolShareUnavailable", "A cap would be exceeded, or the pool's observation history does not cover the TWAP window."],
  ["SliceNotAvailable", "The top-up needs the slice but is a new-account pledge, the account's HF is at least 1.10, the slice part exceeds the restore amount, or the slice is used up."],
  ["NotRescueTopUp / BreakerTripped", "The pledge needs a rescue exemption and does not qualify as a rescue top-up."],
  ["ConfigDrift / HubSharesNotEqualAssets", "A new-account pledge while the Aave configuration has drifted."],
  ["AaveReserveUnavailable / HubAddCapReached / UserReservesLimit", "Aave's reserve, Hub or account limits refuse the supply."],
  ["CollateralNotEnabled / SupplyIncomplete / BackingMismatch", "An Adapter post-check fails; the whole transaction reverts."],
]

export default async function DepositLPPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "getting-started", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Deposit LP"
          description="Pledge an exact-range AMM position into the LPVault of its AMM protocol and use it as collateral on its market's CDP Spoke. The liquidity stays in the pool and keeps earning fees for you."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            A pledge moves custody of one AMM position to the LPVault of its AMM protocol on the chain. The liquidity stays in the pool and keeps earning trading fees for the depositor. In one transaction, Collateralization records the position&apos;s units as backing, the AaveAdapter mints exactly that many vault-token units to the wallet&apos;s PositionProxy, and the proxy supplies them to the market&apos;s CDP Spoke and enables them as collateral. A pledge creates no debt; borrowing is a separate call.
          </p>
          <p className="mb-4 type-doc-body">
            A market is one chain, one AMM protocol, one pool and one exact tick range. Each market is one collateral reserve on one CDP Spoke. The AaveAdapter creates one PositionProxy per wallet and market on the first pledge and reuses it afterwards, so every market is its own Aave account with its own health factor. Nothing is cross-collateralized: a wallet that uses two markets has two proxies and two health factors.
          </p>
          <div className="doc-topic type-doc-body">
            Any wallet that owns the position can pledge it, including a Safe or another smart-contract wallet. There is no EOA-only check. An approved operator cannot pledge on the owner&apos;s behalf, because the LPVault takes the position only from the calling wallet.
          </div>
        </section>

        <section id="eligibility" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Eligible Positions</h2>
          <p className="mb-4 type-doc-body">
            Two AMM protocols are listed at launch, one per chain. A position is named by the market&apos;s integration ID together with a position key.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">AMM</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Chain</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Position key</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {eligibleRows.map((row) => (
                  <tr key={row.amm}>
                    <td className="px-4 py-2">{row.amm}</td>
                    <td className="px-4 py-2">{row.chain}</td>
                    <td className="px-4 py-2"><code className="type-doc-inline-code">{row.key}</code></td>
                    <td className="px-4 py-2">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="mb-2 type-doc-subsection-title">Exact range</h3>
          <p className="mb-4 type-doc-body">
            The position&apos;s lower and upper ticks must equal the market&apos;s range exactly. A narrower range holds far less of each token per unit of liquidity, so crediting it at the market&apos;s per-unit value would overstate it. For example, a $10,000 position on the range [−10, 10] in a USDC/USDT market whose range is [−887,272, 887,272] has about 2,000 times as many liquidity units per dollar, and would be valued at about $20,006,000. The LPVault compares the ticks exactly and refuses it, and the NFT stays with its owner.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Not accepted</h3>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Aerodrome Slipstream positions staked in a gauge. The gauge owns a staked NFT, so the staker cannot pledge it; unstake it first.</li>
            <li>Positions in another pool of the same token pair, or on any range other than the market&apos;s exact range.</li>
            <li>Positions from any other position contract, including forks of Uniswap v3 or Slipstream, and from position-manager generations the market does not pin.</li>
            <li>Pools whose tokens charge a fee on transfer, rebase, or run transfer hooks. Listing excludes these tokens.</li>
            <li>Positions with no liquidity.</li>
          </ul>
        </section>

        <section id="approvals" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Approvals</h2>
          <p className="mb-4 type-doc-body">
            Before the pledge, the wallet approves the market&apos;s LPVault for exactly that position: a per-token approve (or a permit) on the position manager for that token ID. The app never asks for an approval of all NFTs. The LPVault is immutable, moves a position only on Collateralization&apos;s instruction, and records the calling wallet as depositor, so the position can only ever return to that wallet.
          </p>
          <p className="mb-4 type-doc-body">
            The LPVault pulls the NFT with a plain transfer, without a receiver hook, so wallets without an ERC-721 receiver hook (such as a Safe) work. No vault-token, debt-asset or other ERC-20 approval is needed for a pledge.
          </p>
        </section>

        <section id="pledge-call" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">The Pledge Call</h2>
          <div className="type-doc-code-block mb-4">
            <code className="type-doc-body text-gray-900">
              {"pledge(uint256 marketId, PositionRef position, uint256 deadline) returns (address proxy, uint256 recordId, uint128 credited)"}
            </code>
          </div>
          <p className="mb-4 type-doc-body">
            The position reference holds the market&apos;s integration ID and the position key. The deadline is the last valid block timestamp, in seconds on both chains: 600 seconds is 50 Ethereum blocks or 300 Base blocks. There is no amount, proxy or recipient argument. The proxy is resolved from the caller and the market, the credited units are read from the AMM integration after custody, and the depositor of record is the caller, so no argument can inflate backing.
          </p>
          <p className="mb-2 type-doc-body">In order, the call:</p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body mb-4">
            <li>takes the protocol lock and checks the deadline, the market, the integration ID and the home Hub&apos;s pause state;</li>
            <li>on the wallet&apos;s first pledge into the market, deploys its PositionProxy at the address the ProxyManager predicts and registers it in the market&apos;s vault token;</li>
            <li>applies the Frozen gate and decides whether only a rescue top-up can pass;</li>
            <li>has Collateralization ask the LPVault to take custody, check the pool and exact range, and read the position&apos;s liquidity as the credited units;</li>
            <li>pokes the market&apos;s LPOracle and runs the RiskModule&apos;s pledge checks;</li>
            <li>writes the record and books its USD charge;</li>
            <li>mints exactly the credited units to the proxy, supplies them to the CDP Spoke and enables them as collateral;</li>
            <li>checks that the proxy holds no leftover tokens or allowance and that the market&apos;s backing gap is unchanged, then releases the lock.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            Any failure reverts the whole transaction: the position stays with the wallet, and no record, mint, supply or proxy deployment persists.
          </p>
        </section>

        <section id="pledge-kinds" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">New Account, Top-Up and Rescue Top-Up</h2>
          <p className="mb-4 type-doc-body">
            All three kinds of pledge use the same entry point. The RiskModule classifies the pledge from the account&apos;s Aave borrow count at the time of the call.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Kind</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">When it applies</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Rules</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pledgeKinds.map((row) => (
                  <tr key={row.kind}>
                    <td className="px-4 py-2 font-medium text-gray-900">{row.kind}</td>
                    <td className="px-4 py-2">{row.when}</td>
                    <td className="px-4 py-2">{row.rules}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            The rescue target health factor of 1.10 is the level the Lens recommends borrowing to. It is not an opening floor: Avana enforces no health factor above Aave&apos;s 1.00 when you borrow. Paused with reason MintPathSuspect refuses every pledge, rescue top-ups included, because every pledge mints vault tokens.
          </p>
        </section>

        <section id="recredit" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Re-Credit Added Liquidity</h2>
          <p className="mb-4 type-doc-body">
            Anyone can add liquidity to a pledged Uniswap v3 or Slipstream position with the AMM protocol&apos;s increaseLiquidity. Added liquidity stays with the position but is not collateral until the depositor of record re-credits it:
          </p>
          <div className="type-doc-code-block mb-4">
            <code className="type-doc-body text-gray-900">
              {"recredit(uint256 marketId, PositionRef position, bytes topUp, uint256 deadline) returns (uint128 added)"}
            </code>
          </div>
          <p className="mb-4 type-doc-body">
            For NFT positions the topUp argument is empty. Collateralization reads the position&apos;s live liquidity and credits the units above the record&apos;s credited units. The added units run every check of a top-up of that size (or of a new-account pledge if the account has no debt), including the sequencer gate and the rescue rule. The Adapter then mints and supplies exactly the added units, and the record&apos;s charge basis is rebased so that later exits release exactly what was booked. Units admitted through the slice or a rescue exemption are rescue units.
          </p>
          <p className="mb-4 type-doc-body">
            An account that already holds 16 records adds collateral this way instead of with a new position. Before calling, the app can read the units, charge and whether only a rescue top-up can book them with the Lens view previewRecredit. If any check fails, nothing is minted or booked and the added liquidity stays with the position uncredited.
          </p>
        </section>

        <section id="checks" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Pledge Checks</h2>
          <p className="mb-4 type-doc-body">
            The AaveAdapter applies the call bounds, pause state and address freeze. The RiskModule applies every other check and its error reaches the caller unchanged. Example values below are launch defaults; each market&apos;s parameters are set at listing.
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
                  <tr key={row.check}>
                    <td className="px-4 py-2 font-medium text-gray-900">{row.check}</td>
                    <td className="px-4 py-2">{row.rule}</td>
                    <td className="px-4 py-2"><code className="type-doc-inline-code">{row.error}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            The USD charge is booked at the larger of the oracle price and the stress floor, so a pledge made while the pool trades low still consumes cap at no less than $1.00 per whole token. The Hub addCap for the vault token is sized above the market&apos;s Regular and slice budgets at that floor, so a pledge inside Avana&apos;s budget fits under it. Avana sets no limit on the number of markets per wallet.
          </p>
        </section>

        <section id="availability" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Availability by State</h2>
          <p className="mb-4 type-doc-body">
            With several states at once, the most restrictive applies. Each market is its own account, so a wallet&apos;s other markets never gate a pledge.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">State</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">New account</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Top-up</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Rescue top-up</th>
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
          <p className="mt-4 type-doc-body">
            A frozen debt reserve, an exhausted credit line, a short or paused flash source and an unavailable swap route do not block any pledge.
          </p>
        </section>

        <section id="what-is-minted" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">What Is Minted</h2>
          <p className="mb-4 type-doc-body">
            The credited units are the position&apos;s concentrated liquidity L. The AaveAdapter mints exactly that many base units of the market&apos;s vault token to the proxy, and the proxy supplies them all to the CDP Spoke and enables the reserve as collateral. Each market has its own vault token; a whole vault token is 10^d base units, where d is the token&apos;s decimals (6 in the examples below). The LPOracle values one unit from the AMM integration&apos;s composition at oracle prices, never from spot reserves.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Uncollected fees, and any principal already owed to the position when it is pledged, are not credited. They stay owed to the position and the depositor collects them at any time.</li>
            <li>The record stores the depositor, proxy, vault token, credited units, original units, USD charge, pledge time and rescue units. The depositor, proxy and vault token never change while the record is open.</li>
            <li>The record joins the account&apos;s seizure list, ordered by credited units, largest first.</li>
            <li>A debt-free account&apos;s charge stays in the market&apos;s Regular budget until it withdraws. There is no idle budget and no call that moves it.</li>
          </ul>
        </section>

        <section id="events" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Events</h2>
          <p className="mb-4 type-doc-body">
            In emission order. Indexers key positions by chain ID, integration ID and position key, and attribute Spoke events only to proxies announced by UserProxyCreated, not to the transaction sender.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Event</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Contract</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {eventRows.map((row) => (
                  <tr key={row[0]}>
                    <td className="px-4 py-2"><code className="type-doc-inline-code">{row[0]}</code></td>
                    <td className="px-4 py-2">{row[1]}</td>
                    <td className="px-4 py-2">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="failures" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Failures</h2>
          <p className="mb-4 type-doc-body">
            Every failure reverts the whole transaction and the position stays with the wallet. Errors from the position manager, pool, Spoke and Hub pass through unchanged.
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

        <section id="lens-pre-checks" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Lens Pre-Checks</h2>
          <p className="mb-4 type-doc-body">
            The Lens is a read-only contract, one per chain, that an app calls before signing. Its views never revert on a price state, and the pledge itself repeats every check on-chain.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li><code className="type-doc-inline-code">getPriceState</code>: the market&apos;s price state, served and accepted price, and feed ages, read with the market&apos;s vault token.</li>
            <li><code className="type-doc-inline-code">getCapHeadroom</code>: the market, token and depositor headroom, minPledgeUsd and Aave cap headroom, read with the market&apos;s vault token and the depositor.</li>
            <li><code className="type-doc-inline-code">predictProxy</code>: the wallet&apos;s proxy address for the market and whether it is deployed yet.</li>
            <li><code className="type-doc-inline-code">previewRecredit</code>: the units a re-credit would add, their charge, and whether only a rescue top-up can book them.</li>
            <li><code className="type-doc-inline-code">getAccount</code>: after the pledge, the account&apos;s collateral, Aave health factor and gate status.</li>
          </ul>
        </section>

        <section id="worked-example" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Worked Example</h2>
          <div className="doc-topic type-doc-body mb-4">
            Example values; each market&apos;s parameters are set at listing. Market 3 is a USDC/USDT Aerodrome Slipstream market on Base, on the Aerodrome Slipstream Stable CDP Spoke of the Base Stable LP Hub, with tick spacing 1 and range [−887,272, 887,272]. One whole vault token (10^6 units) is worth $2.00. The collateral factor is 3,120 bps (31.20%), minPledgeUsd is $10 and marketUsdCap is $5,000,000 with $1,000,000 booked. The pool has an illustrative per-pool cap of 1,000 bps. Market supply is 400,000,000,000 units and the pool&apos;s in-range liquidity is 20,000,000,000,000. The Hub state is None and the sequencer gate is Up.
          </div>
          <p className="mb-4 type-doc-body">
            Carol has no proxy in market 3. She holds an unstaked Slipstream NFT with L = 10,000,000,000 (about 10,000 USDC and 10,000 USDT).
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body mb-4">
            <li>Her app reads the Lens: the market is Live (the USDC/USD feed last published 72,000 seconds ago, fresh until 88,200), Regular headroom is $4,000,000, the minimum pledge is $10, and predictProxy returns her proxy address.</li>
            <li>She approves the Slipstream LPVault for her NFT on the Slipstream position manager, then calls pledge on market 3 with her position and a deadline of now + 600.</li>
            <li>The ProxyManager deploys her proxy P and the vault token registers it. The LPVault checks the key&apos;s generation byte, the pool and the exact ticks, takes the NFT and reads 10,000,000,000 units.</li>
            <li>The RiskModule checks: value ⌊10,000,000,000 × 200,000,000 / 10^6⌋ = $20,000 ≥ $10; the $20,000 charge fits the $4,000,000 room; pool share (400,000,000,000 + 10,000,000,000) × 10^4 = 4.1 × 10^15 ≤ 1,000 × 2 × 10^13, so Avana holds 2.05% of the pool; record 1 of 16.</li>
            <li>Collateralization books $20,000 in Regular and in the USDC, USDT and depositor counters. The Adapter mints 10,000,000,000 units to P, which supplies them and enables them as collateral.</li>
            <li>Events: ProxyDeployed, UserProxyCreated, ProxyAdded, PositionReceived, CollateralPledged, CollateralSupplied, CollateralAdded.</li>
            <li>The account now shows collateral $20,000 and CF-weighted collateral $6,240. The Lens recommends borrowing up to $5,672.73 of debt value (HF 1.10) and shows the protocol maximum of $6,240 (HF 1.00).</li>
          </ul>
          <h3 className="mb-2 type-doc-subsection-title">Failing variants</h3>
          <ul className="list-disc space-y-2 ps-5 type-doc-body mb-4">
            <li>An NFT with L = 4,000,000 is worth $8 and reverts with BelowMinPledge(800,000,000, 1,000,000,000).</li>
            <li>A 17th record in the same market reverts with TooManyRecords.</li>
            <li>A gauge-staked NFT reverts with NotPositionOwner.</li>
            <li>An NFT on the range [−10, 10] reverts with RangeMismatch.</li>
            <li>The same first pledge 1,800 seconds after a Base sequencer restart reverts with SequencerGrace.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            In each failing case the NFT stays with Carol.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Top-up from the slice and rescue top-up</h3>
          <p className="mb-4 type-doc-body">
            On an Ethereum market with the same parameters, an account owes 15,000 GHO against $50,000 of collateral, so its health factor is 15,600 / 15,000 = 1.04. The market&apos;s Regular budget is full and the Hub is Frozen. A second NFT worth $2,000 is a top-up, so the Frozen gate passes. The CF-weighted value missing to reach 1.10 is (1.10 − 1.04) × 15,000 = $900, which ⌈900 / 0.3120⌉ = $2,884.61538462 of collateral restores. The whole $2,000 books from the slice, all of its units are rescue units, and the health factor becomes $52,000 × 31.20% / 15,000 = 1.0816. A $4,000 top-up in the same state reverts with SliceNotAvailable, because its slice part exceeds $2,884.62.
          </p>
          <p className="mb-4 type-doc-body">
            The guardian then pauses the Hub with reason General. At HF 1.0816, ⌈276 / 0.3120⌉ = $884.62 restores 1.10. An $800 pledge is a rescue top-up and lifts the health factor to 1.0982. A $1,000 pledge in the same state, and a new-account pledge by another wallet, revert with NotRescueTopUp. Under reason MintPathSuspect every pledge reverts with ApplicationPaused.
          </p>
          <p className="type-doc-body">
            The next step is to borrow against the new collateral. Continue to <Link href="/developers/getting-started/borrow-assets" className="text-type-accent hover:underline">Borrow Assets</Link>.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How to pledge an exact-range Uniswap v3 or Aerodrome Slipstream position into Avana as collateral, what is checked and what is minted."
        sectionColor="emerald"
      />
    </div>
  ))
}
