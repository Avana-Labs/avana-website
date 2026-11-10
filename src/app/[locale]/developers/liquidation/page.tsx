import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'liquidation', {
    title: "Liquidation Design",
    description: "When an Avana account can be liquidated, how Aave V4 sizes a partial seizure, and how LPVaultSwap settles it in the repaid debt asset.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "accounts", title: "Accounts Are Per Market" },
  { id: "eligibility", title: "When an Account Is Liquidatable" },
  { id: "partial-seizure", title: "Partial Seizure Sized by Aave" },
  { id: "receiver", title: "LPVaultSwap as the Only Receiver" },
  { id: "exclusivity", title: "Exclusivity on a Standard Spoke" },
  { id: "entry-points", title: "Three Entry Points" },
  { id: "never-blocks", title: "What Never Blocks Liquidation" },
  { id: "what-stops", title: "What Can Stop Liquidation" },
  { id: "keepers", title: "Keepers" },
  { id: "payouts", title: "Fees and Payouts" },
  { id: "deficits", title: "Deficits and Multi-Debt Accounts" },
  { id: "preview", title: "Lens Preview" },
  { id: "removed", title: "Not in the Design" },
]

export default async function LiquidationDesignPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "liquidation", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Liquidation Design"
          description="One liquidation route on every chain: a partial seizure sized by Aave V4, settled by LPVaultSwap in the debt asset that was repaid."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            Avana has one liquidation route on every chain: a partial seizure through LPVaultSwap, settled in the debt asset that was repaid. There is one LPVaultSwap per chain, at a fixed address, serving every Hub, CDP Spoke and market of that chain. In a single transaction it:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>flash-borrows the debt asset itself through the chain&apos;s flash source, which calls the Aave V3 Pool, or uses the caller&apos;s own debt asset when flash liquidity is short;</li>
            <li>calls Aave&apos;s standard liquidation on the CDP Spoke, which sizes the repayment and the seizure and sends the seized vault tokens to LPVaultSwap;</li>
            <li>has the AaveAdapter burn the seized vault tokens, and Collateralization have the market&apos;s LP Vault unwind exactly the seized units into the market&apos;s tokens;</li>
            <li>swaps each token that is not the debt asset into the debt asset over the market&apos;s fixed swap routes, each leg with a minimum output derived from oracle prices;</li>
            <li>repays the flash loan and its premium, then pays Avana&apos;s fee, the caller&apos;s reward and any borrower surplus, all in the debt asset.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            The borrower keeps the rest of the position and all of its fees. GHO appears only when the debt being repaid is GHO. If any step fails, the whole transaction reverts and the account is unchanged.
          </p>
          <p className="mb-4 type-doc-body">
            The keeper-facing requirements are on the Liquidators page: <Link href="/developers/liquidation/liquidators" className="text-type-accent hover:underline">Liquidators</Link>.
          </p>
          <p className="mb-4 type-doc-body">
            Every step of a settlement, with its checks and formulas, is on the flow page: <Link href="/developers/liquidation/flow" className="text-type-accent hover:underline">Liquidation Flow</Link>.
          </p>
        </section>

        <section id="accounts" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Accounts Are Per Market</h2>
          <p className="mb-4 type-doc-body">
            Each wallet has one PositionProxy per CDP Spoke and market. Each proxy is a separate Aave account that holds exactly one collateral reserve, the market&apos;s vault token, and may hold several debt reserves. A wallet using two markets has two accounts, so a falling price in one market never liquidates an account in another market.
          </p>
          <p className="mb-4 type-doc-body">
            The PositionProxy is a logic-free, immutable account. It holds no settlement authority, and its binding to the wallet, the Spoke and the market never changes.
          </p>
        </section>

        <section id="eligibility" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">When an Account Is Liquidatable</h2>
          <p className="mb-4 type-doc-body">
            An account can be liquidated when its health factor on the CDP Spoke is below 1 and the prices used for the call are fresh. LPVaultSwap checks each condition below before it moves any funds.
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Condition</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Rule</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Error if not met</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2">Health factor</td>
                  <td className="px-4 py-2">Below 1, read from the Spoke&apos;s account data. Aave applies the same check inside its liquidation call.</td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">NotLiquidatable</code></td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Collateral price of the seized market</td>
                  <td className="px-4 py-2">The market&apos;s LP Oracle price is Live or Drifting, not Cached or Expired. Every input is at most its feed&apos;s heartbeat plus a 1,800 s margin old, and no feed disagreement pause is active.</td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">StalePrice</code></td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Price of the repaid debt reserve</td>
                  <td className="px-4 py-2">GHO always passes, because Aave prices it at a fixed $1. Any other debt asset needs a Live DebtOracle with every input within its heartbeat plus 1,800 s.</td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">DebtPriceStale</code></td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Sequencer gate (Base)</td>
                  <td className="px-4 py-2">While the sequencer is down, liquidation stops. For 3,600 s after a restart, only accounts with a health factor below 0.95 can be liquidated. Ethereum has no sequencer and is always open.</td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">SequencerDown</code>, <code className="type-doc-inline-code">SequencerGrace</code></td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Recovery grace</td>
                  <td className="px-4 py-2">For 1,800 s after a market&apos;s price recovers from Expired, only accounts with a health factor below 0.95 can be liquidated.</td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">GraceHealthFactor</code></td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Hub shares equal assets</td>
                  <td className="px-4 py-2">The home Hub&apos;s added shares equal its added assets for the vault-token asset, so Aave&apos;s seized shares equal vault-token units.</td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">SharesNotEqualAssets</code></td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Listed market and debt reserve</td>
                  <td className="px-4 py-2">The market is listed on the account&apos;s CDP Spoke (Registered, Active or Offboarding), and the debt reserve is enabled for the Spoke with a funding Hub and an Avana Umbrella recorded.</td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">UnknownMarket</code>, <code className="type-doc-inline-code">UnknownDebtReserve</code></td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="mb-2 type-doc-subsection-title">Freshness follows each feed&apos;s heartbeat</h3>
          <p className="mb-4 type-doc-body">
            A Chainlink feed publishes on its deviation trigger or after its heartbeat, so an age up to the heartbeat is normal. A USD stablecoin feed with an 86,400 s heartbeat is fresh for 88,200 s: an answer published 23 hours ago passes. A 3,600 s feed is fresh for 5,400 s.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Drifting, disagreement and Expired markets</h3>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>A market that is Drifting only because of its time-weighted price guard, an observation failure or a price-band breach, with both feed routes of each token fresh and agreeing, can still be liquidated. Aave decides eligibility and sizes the seizure at the served price.</li>
            <li>When a token&apos;s primary and alternate feeds are both fresh but disagree beyond tolerance, liquidation of that market pauses for up to 3,600 s from the first recorded observation. If they still disagree after that, the market is treated as Expired for liquidation until they agree, a standby price route is switched in, or governance approves a fix.</li>
            <li>Once a market is Expired, its collateral counts as almost 0, so the account&apos;s health factor falls, but the account cannot be seized until a fresh price returns.</li>
            <li>Other debt reserves of the account are not gated. A failing debt price only raises the debt&apos;s value, which lowers the health factor, and no debt is ever repaid at a stress price.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            How the LP Oracle produces these price states is described on the Price Oracles page: <Link href="/developers/integrations/price-oracles" className="text-type-accent hover:underline">Price Oracles</Link>.
          </p>
        </section>

        <section id="partial-seizure" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Partial Seizure Sized by Aave</h2>
          <p className="mb-4 type-doc-body">
            Every liquidation goes through Aave&apos;s standard <code className="type-doc-inline-code">liquidationCall</code> on the CDP Spoke, called by LPVaultSwap with receiveShares set to false. Aave sizes the repayment and the seizure inside the call. The caller only sets an upper bound on the repayment.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Aave sizes the repayment to bring the account to its target health factor (1.10 is Avana&apos;s recommended value; the Aave DAO sets it), with its dynamic liquidation bonus and its dust rule.</li>
            <li>The dust rule can require the whole debt in the reserve to be repaid, so callers size their funding for that case.</li>
            <li>LPVaultSwap measures the debt repaid and the vault tokens seized as balance changes within the call. It never reads them from Aave&apos;s return values or events.</li>
            <li>LPVaultSwap does not reimplement Aave&apos;s account or liquidation math. Whole-position settlement does not exist, because Aave sizes every seizure itself.</li>
            <li>A liquidation that seizes nothing reverts, so debt is never repaid without collateral being taken.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            After a liquidation that leaves collateral and is not limited by the dust rule or the collateral cap, the account&apos;s health factor is at least Aave&apos;s target. The seized value is at most the debt repaid times the bonus, plus one vault-token unit at the served price.
          </p>
        </section>

        <section id="receiver" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">LPVaultSwap as the Only Receiver</h2>
          <p className="mb-4 type-doc-body">
            The vault token&apos;s transfer rule accepts only three movements: a registered proxy to its home Hub (supply), the home Hub to a registered proxy (withdrawal, burned in the same call), and the home Hub to LPVaultSwap (seizure). Every other recipient is rejected, including zero-amount transfers.
          </p>
          <p className="mb-4 type-doc-body">
            Aave delivers seized collateral with a transfer from the Hub to the liquidator. A liquidation called by any address other than LPVaultSwap therefore reverts on that transfer:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>with receiveShares set to true, the Spoke reverts with CannotReceiveShares, because the reserve has share receipt disabled;</li>
            <li>with receiveShares set to false and a seizure of at least one unit, the Hub&apos;s transfer to the caller reverts with UnauthorizedRecipient and the whole call reverts;</li>
            <li>a call sized so that its seizure rounds to 0 units moves no collateral. It only repays debt for the borrower with the caller&apos;s own funds.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            Every LiquidationCall event on a CDP Spoke that seized vault tokens therefore names LPVaultSwap as the liquidator. No vault token moves, and no deficit is reported, except through LPVaultSwap. An LPVaultSwap upgrade keeps the same proxy address, so it stays the only allowed seizure recipient.
          </p>
        </section>

        <section id="exclusivity" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Exclusivity on a Standard Spoke</h2>
          <p className="mb-4 type-doc-body">
            The CDP Spoke is a standard, unmodified Aave V4 Spoke, and its liquidation function has no caller restriction. Exclusivity comes from the vault token&apos;s transfer rule together with three Aave settings on every Avana collateral reserve:
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Aave setting</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Value</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">What it closes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">receiveSharesEnabled</code></td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">false</code></td>
                  <td className="px-4 py-2">A liquidator cannot take the seized collateral as Hub shares instead of vault tokens.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">liquidationFee</code></td>
                  <td className="px-4 py-2">0, or paid to Avana&apos;s fee receiver</td>
                  <td className="px-4 py-2">No fee shares reach a third party during a liquidation.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">reinvestmentController</code></td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">address(0)</code></td>
                  <td className="px-4 py-2">No contract can move the Hub&apos;s vault tokens, and Hub shares stay equal to assets.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            The listing settings also make the vault-token reserve non-borrowable, list the vault-token asset on no other Spoke (with a draw cap of 0 everywhere), and grant no position-manager approval on any proxy.
          </p>
          <p className="mb-4 type-doc-body">
            The RiskModule checks these settings on every new-account pledge, borrow and withdrawal with debt, and monitoring checks them every block. Drift in any setting trips the market&apos;s CONFIG_DRIFT breaker: new pledges, borrows and withdrawals with debt stop, while liquidation, repayment, top-ups, debt-free withdrawal and fee collection continue. The listing payload agreement commits the Aave DAO to keep these settings while Avana debt exists.
          </p>
        </section>

        <section id="entry-points" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Three Entry Points</h2>
          <p className="mb-4 type-doc-body">
            Who may call, and with which options, is decided only at LPVaultSwap. Every call liquidates one account, in its one collateral market, against one debt reserve.
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Function</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Caller</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">What it does</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">liquidate</code></td>
                  <td className="px-4 py-2">Approved keepers only</td>
                  <td className="px-4 py-2">The full path, with both route modes (PrimaryThenBackup and BackupOnly). Pays the keeper reward to the caller.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">liquidatePermissionless</code></td>
                  <td className="px-4 py-2">Any address, with no role, registration or agreement</td>
                  <td className="px-4 py-2">The same settlement with the PrimaryThenBackup route mode only. Pays the same reward to the caller. It exists so liquidation continues when no approved keeper acts.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">settlePending</code></td>
                  <td className="px-4 py-2">Any address</td>
                  <td className="px-4 py-2">Settles vault tokens an earlier, unsettled seizure left at LPVaultSwap. It pays the caller nothing and sends the proceeds to the Avana Umbrella (Coverage Spoke).</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            A frozen address cannot call either liquidation function. A frozen borrower&apos;s own accounts are liquidated like any other.
          </p>
        </section>

        <section id="never-blocks" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">What Never Blocks Liquidation</h2>
          <p className="mb-4 type-doc-body">
            LPVaultSwap never reads the MarketRegistry&apos;s pause state, the pause reason, a circuit breaker or a configuration-drift reason. The three entry points run in every one of these states:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>application pause states None, Frozen, Paused(General) and Paused(MintPathSuspect);</li>
            <li>any market, debt or POOL_DEPTH breaker tripped;</li>
            <li>any Spoke setting drifted (CONFIG_DRIFT);</li>
            <li>a market in Offboarding or in its wind-down ramp, and a frozen Aave reserve;</li>
            <li>a frozen borrower wallet;</li>
            <li>a pool spot price at any distance from the oracle price. There is no pool spot gate, so a moved pool never reverts a liquidation or changes its route mode.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            Pause states, breakers and drift stop actions that add risk, such as new pledges and borrowing. They stop no action that reduces risk. A liquidation that cannot run lets an unhealthy account&apos;s loss grow toward a deficit, while repayment and debt-free withdrawal stay open anyway.
          </p>
          <div className="doc-topic type-doc-body">
            Example: the Emergency Guardian sets Paused(MintPathSuspect) on the Ethereum Stable LP Hub at 14:00 after an alert on another market. At 14:05 a keeper liquidates an account at a health factor of 0.97 exactly as it would with no pause.
          </div>
        </section>

        <section id="what-stops" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">What Can Stop Liquidation</h2>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Stale prices of the seized market or the repaid debt reserve, as described above. The account&apos;s other debt reserves can still be repaid meanwhile.</li>
            <li>The chain&apos;s sequencer gate on Base: down, or the grace period after a restart for accounts at or above a health factor of 0.95.</li>
            <li>Aave-side halts: a halted or deactivated CDP Spoke on its home or funding Hub, or a paused vault-token or debt reserve. Aave&apos;s own errors (SpokeHalted, SpokeNotActive, ReservePaused) pass through unchanged, and Avana cannot override them.</li>
            <li>Settlement legs: no usable swap route for a token, or a recovery below the floor that the caller does not top up.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            The listing payload agreement commits the Aave DAO to contain a faulty CDP Spoke first with a vault-token reserve freeze and a draw cap of 0, which leave liquidation open. During an Aave halt, keepers keep their liquidations prepared at every block and submit them in ascending health-factor order in the first block after the halt is lifted.
          </p>
        </section>

        <section id="keepers" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Keepers</h2>
          <p className="mb-4 type-doc-body">
            Every approved keeper is Avana&apos;s own: its primary keepers and a standby keeper on separate infrastructure. Avana names each address per chain, funds it with that chain&apos;s debt assets and pays its gas. Its duty is to liquidate every account below a health factor of 1 on its chains, whatever the account&apos;s size, including accounts whose bonus does not cover the gas. Avana has no minimum debt on any chain, and no liquidation depends on a keeper making a profit.
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Item</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">keeperFloor</code></td>
                  <td className="px-4 py-2">1 active (approved and unfrozen) keeper per chain, Avana&apos;s own</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">MAX_KEEPERS</code></td>
                  <td className="px-4 py-2">32 approved keepers per chain</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">addKeeper</code></td>
                  <td className="px-4 py-2">Timelock operation at the normal delay (5 days); only the Aave governance executor can cancel it; reverts for a frozen address</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">removeKeeper</code></td>
                  <td className="px-4 py-2">Timelock operation at the short delay (12 hours); reverts if fewer than keeperFloor active keepers would remain</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            If 0 active keepers ever remain on a chain, the RiskModule halts new borrowing and withdrawals with debt on every CDP Spoke of that chain (LiquidationHalted), while liquidation stays open to anyone through the permissionless path. It halts a debt reserve in the same way when some market token has no usable swap route into its asset (DebtLiquidationHalted). Repayment, fee collection and debt-free withdrawal stay open.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: Ethereum has keepers K1 and K2. Removing K2 leaves one active keeper and borrowing continues. A removal of K1 then reverts, because it would leave fewer than keeperFloor. If K1&apos;s key were compromised, a replacement keeper is added first and K1 is frozen.
          </div>
          <p className="mb-4 type-doc-body">
            The Aave DAO liquidates Avana accounts through LPVaultSwap like anyone else: through the permissionless path from its executor or any address it controls, at once and with no Avana action, or through the keeper path with a keeper address added by the timelock.
          </p>
        </section>

        <section id="payouts" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Fees and Payouts</h2>
          <p className="mb-4 type-doc-body">
            After the flash loan and its premium are repaid, the realized surplus is split in a fixed order, all in the debt asset that was repaid:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Avana&apos;s fee: 20% of the oracle-value gain of the seizure, never more than the realized surplus. A caller&apos;s routing cannot lower it while the realized gain covers it.</li>
            <li>Keeper reward: the rest of the oracle-value gain, capped by what was realized. It goes to the caller of either liquidation function.</li>
            <li>Borrower surplus: any recovery above the oracle value of the seized collateral, paid to the borrower&apos;s wallet.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            This fee is Avana&apos;s only on-chain revenue. Avana charges no fee on borrow interest. A payout that its recipient cannot receive goes to the payout escrow (InKindEscrow), credited to that recipient, and never reverts the liquidation.
          </p>
          <p className="mb-4 type-doc-body">
            The formulas and the payout order are on the flow page: <Link href="/developers/liquidation/flow" className="text-type-accent hover:underline">Liquidation Flow</Link>.
          </p>
        </section>

        <section id="deficits" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Deficits and Multi-Debt Accounts</h2>
          <p className="mb-4 type-doc-body">
            Aave reports a deficit inside its liquidation call only when the call empties the account&apos;s collateral and debt remains. It then reports the remaining debt of every borrowed reserve, each on its funding Hub and in that reserve&apos;s asset, and zeroes the account&apos;s debt. Avana accepts this behaviour unchanged. The Avana Umbrella (Coverage Spoke) of each affected Hub and asset covers its deficit within the coverage window, never with another asset&apos;s or another Hub&apos;s coverage.
          </p>
          <p className="mb-4 type-doc-body">
            A call that reports a deficit settles like any other. If the recovery floor or the funding check fails, the whole transaction reverts, deficit report included.
          </p>
          <p className="mb-4 type-doc-body">
            After a full seizure, every record of the account stays open with 0 credited units. The depositor can collect fees and take the position back with the AaveAdapter&apos;s releaseZeroCredit, which needs no debt check. Keepers skip accounts with no collateral left, because Aave has already reported their deficit.
          </p>
          <p className="mb-4 type-doc-body">
            An account with several debt reserves is liquidated by successive calls, one debt reserve each, in the order the keeper chooses. Keepers continue until the health factor is at least 1, when Aave rejects further calls, or a deficit has been recorded.
          </p>
        </section>

        <section id="preview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Lens Preview</h2>
          <p className="mb-4 type-doc-body">
            The Lens function <code className="type-doc-inline-code">previewLiquidation(proxy, debtReserveId, deadline)</code> returns ready-to-send liquidation parameters that can be submitted unchanged. It reports:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>the health factor, the bonus, the Spoke&apos;s liquidation configuration and every gate evaluated as LPVaultSwap evaluates it;</li>
            <li>the debt Aave would repay, sized with Aave V4&apos;s pinned liquidation formulas, including the whole-debt case of the dust rule;</li>
            <li>the expected seizure, the flash amount sized to the flash source&apos;s idle liquidity, the premium, and caller funds for the rest;</li>
            <li>the recovery floor, the expected payout and the rounding gap the caller may have to pay.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            For a whole-debt close the Lens adds a 500 bps margin to the repayment bound. The Lens is periphery: no Avana contract calls it, and no result of it is used on-chain. On execution, Aave sizes the seizure and LPVaultSwap measures what was spent and seized.
          </p>
        </section>

        <section id="removed" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Not in the Design</h2>
          <p className="mb-4 type-doc-body">
            Earlier versions of these docs described mechanisms that are not part of the protocol. None of the following exist:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>full-position settlement, settlement modes per market, and in-kind settlement;</li>
            <li>swaps through CoW Swap or any other off-chain or batch-settled path;</li>
            <li>flash minting from the GHO FlashMinter, and buying the debt asset with GHO;</li>
            <li>a protocol settlement budget or any Avana balance that pays settlement gaps;</li>
            <li>a keeper-only liquidation rule: liquidation is open to anyone through the permissionless path;</li>
            <li>a health factor across several positions: each account holds one market.</li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="When an Avana account can be liquidated, how Aave V4 sizes the partial seizure, why LPVaultSwap is the only receiver, and what never blocks liquidation."
        sectionColor="amber"
      />
    </div>
  ))
}
