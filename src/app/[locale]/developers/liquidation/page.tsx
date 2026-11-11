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
    description: "When an Avana account can be liquidated, who can call the one liquidation entry point, how callers fund it, how Aave V4 sizes a partial seizure, and how LPVaultSwap settles it in the repaid debt asset.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "accounts", title: "Accounts Are Per Market" },
  { id: "eligibility", title: "When an Account Is Liquidatable" },
  { id: "partial-seizure", title: "Partial Seizure Sized by Aave" },
  { id: "receiver", title: "LPVaultSwap as the Only Receiver" },
  { id: "exclusivity", title: "Exclusivity on a Standard Spoke" },
  { id: "entry-points", title: "One Entry Point" },
  { id: "funding", title: "Funding and the Flash Liquidation Helper" },
  { id: "never-blocks", title: "What Never Blocks Liquidation" },
  { id: "what-stops", title: "What Can Stop Liquidation" },
  { id: "keepers", title: "Committed Operators" },
  { id: "gas", title: "Gas and Small Accounts" },
  { id: "freeze", title: "Address Freeze and the Helper" },
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
          description="One liquidation entry point on every chain, open to any address: a partial seizure sized by Aave V4, funded by the caller and settled by LPVaultSwap in the debt asset that was repaid."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            Avana has one liquidation route on every chain: a partial seizure through LPVaultSwap, settled in the debt asset that was repaid. There is one LPVaultSwap per chain, at a fixed address, serving every Hub, CDP Spoke and market of that chain. Its one entry point, <code className="type-doc-inline-code">liquidate</code>, is open to any address that is not frozen once Aave allows the liquidation (health factor below 1). In a single transaction LPVaultSwap:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>pulls up to debtToCover of the debt asset from the caller and measures what arrived. It takes no flash loan itself;</li>
            <li>calls Aave&apos;s standard liquidation on the CDP Spoke, which sizes the repayment and the seizure, pulls the repayment out of the caller&apos;s funding and sends the seized vault tokens to LPVaultSwap;</li>
            <li>has the AaveAdapter burn exactly the seized vault tokens, Collateralization debit them from the account&apos;s records, and the market&apos;s LP Vault unwind exactly the seized units into the market&apos;s tokens;</li>
            <li>swaps each token that is not the debt asset into the debt asset over the market&apos;s fixed swap routes, each leg with a minimum output derived from oracle prices;</li>
            <li>pays out in the debt asset: Avana&apos;s fee, any borrower surplus, and the rest to the caller, including the funding Aave did not use.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            A caller that holds no debt asset uses Avana&apos;s public flash liquidation helper, an immutable periphery contract anyone can use. It flash-borrows the debt asset from the chain&apos;s Aave V3 Pool, calls liquidate, and repays the Pool from the caller&apos;s payout. Operators may run their own helper.
          </p>
          <p className="mb-4 type-doc-body">
            The borrower keeps the rest of the position and all of its fees. GHO appears only when the debt being repaid is GHO. If any step fails, the whole transaction reverts and the account is unchanged.
          </p>
          <p className="mb-4 type-doc-body">
            The requirements for liquidation callers are on the Liquidators page: <Link href="/developers/liquidation/liquidators" className="text-type-accent hover:underline">Liquidators</Link>.
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
            An account can be liquidated when its health factor on the CDP Spoke is below 1, whether from falling collateral value, a rise in the debt asset&apos;s price or accrued interest, and the prices used for the call are fresh. LPVaultSwap checks each condition below before it pulls the caller&apos;s funding.
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
            Every liquidation goes through Aave&apos;s standard <code className="type-doc-inline-code">liquidationCall</code> on the CDP Spoke, called by LPVaultSwap with receiveShares set to false and the caller&apos;s measured funding as Aave&apos;s bound. Aave sizes the repayment and the seizure inside the call. The caller only sets an upper bound on the repayment.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Aave sizes the repayment to bring the account to its target health factor (1.10 is Avana&apos;s recommended value; the Aave DAO sets it), with its dynamic liquidation bonus and its dust rule.</li>
            <li>The dust rule can require the whole debt in the reserve to be repaid, so callers size debtToCover for that case up front. Aave pulls only what it needs, and the rest returns to the caller in its payout.</li>
            <li>LPVaultSwap measures the debt repaid and the vault tokens seized as balance changes within the call. It never reads them from Aave&apos;s return values or events.</li>
            <li>LPVaultSwap does not reimplement Aave&apos;s account or liquidation math. Whole-position settlement does not exist, because Aave sizes every seizure itself. Liquidation is always partial.</li>
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
            <li>with receiveShares set to false and a seizure of at least one unit, the Hub&apos;s transfer to the caller reverts with the vault token&apos;s UnauthorizedTransfer error and the whole call reverts;</li>
            <li>a call sized so that its seizure rounds to 0 units moves no collateral. It only repays debt for the borrower with the caller&apos;s own funds.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            Every LiquidationCall event on a CDP Spoke that seized vault tokens therefore names LPVaultSwap as the liquidator. No vault token moves, and no deficit is reported, except through LPVaultSwap. An LPVaultSwap upgrade keeps the same proxy address, so it stays the only allowed seizure recipient.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: a contract holding 1 USDC calls liquidationCall directly on an account at a health factor of 0.98. Aave sizes a seizure of 510,000 units, the Hub&apos;s transfer of those units to the contract reverts, and the account&apos;s debt, supplied shares and records are unchanged.
          </div>
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
          <h2 className="mb-4 type-doc-section-title">One Entry Point</h2>
          <p className="mb-4 type-doc-body">
            Every liquidation of an Avana account runs through <code className="type-doc-inline-code">LPVaultSwap.liquidate</code>. There is no second liquidation function and no keeper check. Every call liquidates one account, in its one collateral market, against one debt reserve.
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
                  <td className="px-4 py-2">Any address that is not frozen, with no role, registration or agreement</td>
                  <td className="px-4 py-2">The full liquidation, with either route mode: PrimaryThenBackup (primary route with backup fallback) or BackupOnly. The caller funds the repayment and receives the caller payout.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">settlePending</code></td>
                  <td className="px-4 py-2">Any address</td>
                  <td className="px-4 py-2">Settles vault tokens an earlier, unsettled seizure left at LPVaultSwap. It pays the caller nothing and sends the proceeds to the Avana Umbrella (Coverage Spoke).</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="mb-2 type-doc-subsection-title">Who calls it</h3>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Committed operators: Avana&apos;s keeper on each chain at launch, and any operator later added to the registry through the timelock, such as Aave Labs or a risk provider.</li>
            <li>Any other address, funding the call from its own debt asset, through the public flash liquidation helper, or through its own helper.</li>
            <li>The Aave DAO, from its executor or any address it controls, at once and with no Avana action, directly or through the public helper. It can also have a committed operator of its choice registered.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            The caller is always the address that calls LPVaultSwap (msg.sender): LPVaultSwap pulls the funding from that address and pays the caller payout to it. No caller or recipient address is taken from calldata, so a front-runner that copies a call must fund it itself and gains only what the original caller would have. Through a helper, the caller LPVaultSwap sees is the helper.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Every check runs on every call</h3>
          <p className="mb-4 type-doc-body">
            Whoever the caller is, liquidate runs the same checks:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>the health factor, the price gates of the seized market and the repaid reserve, the recovery grace and the sequencer gate;</li>
            <li>the Hub share check;</li>
            <li>the recovery floor and each swap leg&apos;s oracle-derived minimum;</li>
            <li>Avana&apos;s fee and the borrower surplus;</li>
            <li>the deadline, the caller&apos;s minimum payout and the address freeze on the caller.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            These checks cover everything a caller could exploit: the floor comes from oracle prices, the routes are fixed, and the payout goes to the caller itself. Restricting the caller would add no protection and could only leave an account unliquidated. BackupOnly only selects an approved route held to the same floor and leg minimums. One path also means one set of code, tests and monitoring.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: an address with no registration, holding 9,800 USDC, liquidates an account with debtToCover of 9,800 USDC, the BackupOnly route mode, a deadline 120 s ahead and a minimum payout of 9,909 USDC. The backup route returns 4,952 USDC for the USDT leg, so 9,950 USDC is recovered, Avana&apos;s fee of 39.2 USDC goes to the fee recipient, and the caller receives 9,910.8 USDC: its 9,800 USDC back plus a net 110.8 USDC.
          </div>
        </section>

        <section id="funding" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Funding and the Flash Liquidation Helper</h2>
          <h3 className="mb-2 type-doc-subsection-title">The caller funds the repayment</h3>
          <p className="mb-4 type-doc-body">
            LPVaultSwap pulls debtToCover of the debt asset from the caller before any other transfer and measures what arrived as its own balance change. The caller is LPVaultSwap&apos;s only source of the debt asset: liquidate takes no flash loan, calls no lender, and never buys the debt asset with another token.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>LPVaultSwap approves the Spoke for exactly the amount it received and passes that amount to Aave as the bound, so Aave never pulls more than the caller funded.</li>
            <li>The debt asset Aave does not pull is not swapped. It returns to the caller inside the caller payout, so oversizing debtToCover costs the caller nothing at LPVaultSwap.</li>
            <li>For a debt asset with a transfer fee, LPVaultSwap uses the amount that arrived as Aave&apos;s bound, and the fee on the funding and on the payout falls on the caller.</li>
          </ul>
          <div className="mb-4 doc-topic type-doc-body">
            Example: a call with debtToCover of 2,047.5 USDC pulls 2,047.5 USDC. Aave repays 1,950 USDC of debt, and the 97.5 USDC it did not use comes back to the caller in its payout.
          </div>
          <h3 className="mb-2 type-doc-subsection-title">The public flash liquidation helper</h3>
          <p className="mb-4 type-doc-body">
            A caller that holds no debt asset uses the public flash liquidation helper. It is a periphery contract outside the audited core: immutable, with no owner, admin, upgrade path, setter, sweep or rescue function, and holding no funds or allowances between transactions. One public instance per chain borrows from that chain&apos;s Aave V3 Pool: the Core Pool on Ethereum, and on Base the Pool at 0xA238Dd80C259a72e81d7e4664a9801593F98d1c5. Anyone can use it, and no core contract calls it.
          </p>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>The caller calls <code className="type-doc-inline-code">flashLiquidate</code> with the liquidation parameters, a flash amount up to debtToCover, a maximum premium, a top-up bound and its own minimum net payout.</li>
            <li>The helper flash-borrows the debt asset from the Aave V3 Pool with its flashLoan function, which waives the premium for an address that holds Aave&apos;s FLASH_BORROWER role.</li>
            <li>Inside the Pool&apos;s callback, the helper calls liquidate with the parameters unchanged. LPVaultSwap treats it as an ordinary caller: it pulls the funding from the helper and pays the caller payout to it.</li>
            <li>When liquidate returns, the helper repays the Pool its principal and premium from that payout, pulling a top-up from its caller up to the bound if the payout falls short.</li>
            <li>Only after the loan is repaid does the helper pay the rest to its caller.</li>
          </ol>
          <p className="mb-4 type-doc-body">
            The deployment payload requests FLASH_BORROWER for the public helper on each chain. Until Aave grants it, each loan carries the Pool&apos;s premium (5 bps at launch). The premium, including the premium on any part of the loan the debt did not need, comes out of the caller&apos;s payout. It never reduces Avana&apos;s fee or the borrower surplus. A payout too small to repay the loan reverts the whole transaction.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Operator helpers</h3>
          <p className="mb-4 type-doc-body">
            An operator can deploy its own instance of the operator variant of the helper. It accepts calls only from its bound signer, pulls inventory and top-ups only from the operator&apos;s funding Safe, pays only to that Safe, and caps each top-up at a fixed share of debtToCover set at deployment. A compromised signer key can then only start liquidations that pay the operator&apos;s own Safe, and can lose at most the bounded top-up per call. An operator&apos;s own helper holds no FLASH_BORROWER grant unless an Aave proposal adds one, so it pays the Pool premium.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: an operator helper deployed with a top-up limit of 100 bps can pull at most 98 USDC of top-up from the funding Safe on a call with debtToCover of 9,800 USDC, whatever top-up bound the signer sends.
          </div>
          <h3 className="mb-2 type-doc-subsection-title">When flash liquidity is short</h3>
          <p className="mb-4 type-doc-body">
            When the Aave V3 Pool is short of the debt asset, paused, not enabled for flash loans, or charges more than the caller accepts, the helper reverts before LPVaultSwap is called and nothing changes. The caller then funds debtToCover from its own balance or asks for a smaller amount. Each committed operator holds, on each chain, debt-asset inventory of at least the largest single debtToCover that chain&apos;s caps allow, so liquidation never depends on the Pool.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: the Base V3 Pool holds about 0.13M idle GHO. The public helper refuses a 400,000 GHO loan before any state change, and Avana&apos;s keeper repeats the liquidation by calling liquidate directly with 400,000 GHO of its own.
          </div>
          <p className="mb-4 type-doc-body">
            Avana&apos;s core flash source, read from the MarketRegistry, still exists, but only repay with collateral uses it. A liquidation never calls it.
          </p>
        </section>

        <section id="never-blocks" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">What Never Blocks Liquidation</h2>
          <p className="mb-4 type-doc-body">
            LPVaultSwap never reads the MarketRegistry&apos;s pause state, the pause reason, a circuit breaker or a configuration-drift reason. Both liquidate and settlePending run in every one of these states:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>application pause states None, Frozen, Paused(General) and Paused(MintPathSuspect);</li>
            <li>any market, debt or POOL_DEPTH breaker tripped;</li>
            <li>any Spoke setting drifted (CONFIG_DRIFT);</li>
            <li>a market in Offboarding or in its wind-down ramp, and a frozen Aave reserve;</li>
            <li>a frozen borrower wallet;</li>
            <li>zero active committed operators on the chain, which halts new borrowing but leaves liquidate open to every address;</li>
            <li>an Aave V3 Pool that is short of flash liquidity or paused, because a caller can always fund the call from its own balance;</li>
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
          <p className="mb-4 type-doc-body">
            No Avana pause, circuit breaker, configuration drift or address freeze stops liquidation, and neither does an Aave freeze of a reserve. Liquidation waits only for the following:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Stale prices of the seized market or the repaid debt reserve, as described above. The account&apos;s other debt reserves can still be repaid meanwhile.</li>
            <li>The chain&apos;s sequencer gate on Base: down, or the grace period after a restart for accounts at or above a health factor of 0.95.</li>
            <li>Aave-side halts: a halted or deactivated CDP Spoke on its home or funding Hub, or a paused vault-token or debt reserve. Aave&apos;s own errors (SpokeHalted, SpokeNotActive, ReservePaused) pass through unchanged, and Avana cannot override them.</li>
            <li>Settlement legs: no usable swap route for a token, or a recovery below the floor that the caller does not top up. Either reverts the call with nothing changed.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            An address freeze stops only the frozen address&apos;s direct calls to LPVaultSwap. It cannot stop that address from liquidating through the public helper, and it never stops anyone else.
          </p>
          <p className="mb-4 type-doc-body">
            The listing payload agreement commits the Aave DAO to contain a faulty CDP Spoke first with a vault-token reserve freeze and a draw cap of 0, which leave liquidation open, and to halt or pause only a faulty Spoke. During an Aave halt, keepers keep their liquidations prepared at every block, with the helper&apos;s flash amount checked against the Aave V3 Pool&apos;s idle liquidity and their own funds ready for the rest, and submit them in ascending health-factor order in the first block after the halt is lifted.
          </p>
          <p className="mb-4 type-doc-body">
            If both swap routes of a token fail, monitoring raises an alert, and a guardian freezes new borrowing in the market once the approved routes are confirmed unable to settle valid liquidations at the required size. Liquidation, repayment and debt-free exits stay open while the routes are replaced.
          </p>
        </section>

        <section id="keepers" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Committed Operators</h2>
          <p className="mb-4 type-doc-body">
            LPVaultSwap&apos;s keeper list is a registry of committed operators, one per chain covering every Hub of that chain. Each registered operator commits to liquidate every account below a health factor of 1 on its chains, whatever the account&apos;s size and whether or not the bonus covers the gas.
          </p>
          <p className="mb-4 type-doc-body">
            The registry gates no call. A registered operator has no power any other caller lacks: everyone uses liquidate with both route modes and every check. The registry feeds three things only: the keeper floor, the borrowing halt when no active committed operator remains, and monitoring of how fast each account below a health factor of 1 is liquidated.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>At launch, Avana&apos;s keeper is the only committed operator on each chain. It runs primary instances plus a standby on separate infrastructure. Avana names its address per chain, funds it with that chain&apos;s debt assets and pays its gas.</li>
            <li>Others, such as Aave Labs or a risk provider, are added through the timelock at the normal delay, up to 32 per chain.</li>
            <li>An operator registers its own key or Safe that calls liquidate, or its own operator helper. The public helper is never registered, because it commits to nothing.</li>
            <li>The function and event names keep the word keeper (addKeeper, removeKeeper, isApprovedKeeper, activeKeeperCount, getKeepers, KeeperAdded, KeeperRemoved). In them, keeper means committed operator.</li>
          </ul>
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
                  <td className="px-4 py-2">1 active (registered and unfrozen) committed operator per chain: Avana&apos;s keeper at launch</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">MAX_KEEPERS</code></td>
                  <td className="px-4 py-2">32 committed operators per chain</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">addKeeper</code></td>
                  <td className="px-4 py-2">Timelock operation at the normal delay (5 days). Only the Aave governance executor can cancel it. It reverts for a frozen address, for an address already registered, and when 32 operators are registered.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">removeKeeper</code></td>
                  <td className="px-4 py-2">Timelock operation at the short delay (12 hours). It reverts with KeeperFloor if fewer than keeperFloor active committed operators would remain.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-4 doc-topic type-doc-body">
            Example: the Ethereum governance multisig schedules addKeeper(0x3b9f…e210) for a risk provider on 2 March at 12:00 UTC. It becomes executable on 7 March at 12:00 UTC, and from the block it executes in, the operator counts toward keeperFloor and is monitored against its commitment. Its liquidate calls were accepted before that block too, like anyone&apos;s.
          </div>
          <h3 className="mb-2 type-doc-subsection-title">Zero active operators halts borrowing, never liquidation</h3>
          <p className="mb-4 type-doc-body">
            If 0 active committed operators remain on a chain, the RiskModule halts new borrowing and withdrawals with debt on every CDP Spoke of that chain (LiquidationHalted), because no party is then bound to liquidate accounts whose bonus does not cover the gas. Liquidation itself never halts: liquidate stays open to every address. The RiskModule halts a debt reserve in the same way when some market token has no usable swap route into its asset (DebtLiquidationHalted). Repayment, fee collection and debt-free withdrawal stay open.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: Ethereum has two committed operators, Avana&apos;s keeper K1 and a risk provider K2. Removing K2 leaves one and borrowing continues. A removal of K1 then reverts, because it would leave fewer than keeperFloor. If K1&apos;s key is compromised, a guardian freezes it at once; a freeze is never blocked by the floor. With zero active committed operators left, new borrowing on every CDP Spoke of Ethereum halts while liquidate stays open to every address, until a replacement is registered.
          </div>
          <h3 className="mb-2 type-doc-subsection-title">How the Aave DAO liquidates</h3>
          <p className="mb-4 type-doc-body">
            The Aave DAO liquidates Avana accounts through LPVaultSwap like anyone else: through liquidate from its executor or any address it controls, at once and with no Avana action, directly or through the public flash liquidation helper. It can also have a committed operator of its choice registered through the timelock at the normal delay. A direct liquidationCall by the DAO reverts on the vault token&apos;s transfer rule, like any other.
          </p>
        </section>

        <section id="gas" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Gas and Small Accounts</h2>
          <p className="mb-4 type-doc-body">
            Every account is liquidated, whatever its size, and no liquidation depends on a keeper&apos;s profit. Avana has no minimum debt and no minimum repayment on any chain. Avana&apos;s keeper liquidates every account below a health factor of 1, repays as much as Aave allows per call, and Avana pays its gas as its own cost.
          </p>
          <p className="mb-4 type-doc-body">
            What the protocol bounds is the gas of one call, so that the largest account always fits in one transaction. A liquidation that touches n records uses about this much gas, measured on a fork of each chain:
          </p>
          <div className="mb-4 type-doc-code-block">
            <code className="type-doc-body text-gray-900">G(n) = 1,310,000 + 240,000 × n</code>
          </div>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>A one-record liquidation uses about 1.55M gas, which is about $3 at a gas price of about 1 gwei.</li>
            <li>An account holds at most 16 records per market, so the largest liquidation uses 5.15M gas, below the 16,777,216 per-transaction gas limit.</li>
            <li>The gas model of each chain is stated in gas units: execution gas on Ethereum, and execution gas plus each transaction&apos;s L1 data fee on Base. The gas price feeds only the keeper&apos;s gas budget; no protocol rule reads it.</li>
          </ul>
          <div className="mb-4 doc-topic type-doc-body">
            Example (Base): an account owing 40 USDC with one record falls below a health factor of 1. With a 2% bonus, a 0.3% swap cost and Avana&apos;s 20% share, the caller&apos;s reward is (40 × 1.02 × 0.997 − 40) − 0.2 × (40 × 1.02 − 40) = 0.6776 − 0.16 = 0.5176 USDC. Avana&apos;s keeper liquidates the account whether or not that covers the gas.
          </div>
        </section>

        <section id="freeze" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Address Freeze and the Helper</h2>
          <p className="mb-4 type-doc-body">
            The address freeze is the only check on the caller of liquidate. A frozen address that calls LPVaultSwap directly reverts with AddressIsFrozen. The freeze binds only the address that calls LPVaultSwap:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>A frozen address that goes through the public flash liquidation helper reaches LPVaultSwap as the helper, so the freeze does not stop it.</li>
            <li>Freezing the public helper itself would stop every caller that uses it.</li>
            <li>Freezing a committed operator removes it from the keeper floor count. A freeze checks no floor, so a guardian may freeze even the last active operator.</li>
            <li>addKeeper reverts for a frozen address.</li>
            <li>A frozen borrower&apos;s own accounts are liquidated like any other.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            A freeze therefore stops an address&apos;s direct calls and removes a frozen committed operator from the keeper floor. It cannot stop an address from liquidating.
          </p>
        </section>

        <section id="payouts" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Fees and Payouts</h2>
          <p className="mb-4 type-doc-body">
            After the swaps, LPVaultSwap splits the proceeds in a fixed order, all in the debt asset that was repaid:
          </p>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>Avana&apos;s fee: 20% of the oracle gain (the seized collateral&apos;s oracle value minus the debt repaid), capped by the realized gain (the recovery minus the debt repaid). A caller&apos;s routing cannot lower it while the realized gain covers it, and it never makes a liquidation revert by itself.</li>
            <li>Borrower surplus: any recovery above the seized collateral&apos;s oracle value, paid to the borrower&apos;s wallet. It is non-zero only when the swap routes beat the oracle price.</li>
            <li>The caller: everything else. That is the funding Aave did not use, the recovered principal and the caller&apos;s reward (the rest of the oracle gain, capped by what was realized). It is paid directly to the caller, or the whole transaction reverts.</li>
          </ol>
          <p className="mb-4 type-doc-body">
            This fee is Avana&apos;s only on-chain revenue. Avana charges no fee on borrow interest, and no Avana contract reimburses gas.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Best-effort fee near the slippage limit</h3>
          <p className="mb-4 type-doc-body">
            In a market whose slippage allowance reaches the limit the bonus sets, the recovery floor falls to about the debt repaid. A caller that routes the recovery down to the floor then leaves almost no realized gain and can reduce Avana&apos;s fee to about zero, so the fee there is best-effort. Avana accepts this: the floor still protects the debt repaid and the borrower, whose loss is fixed by Aave&apos;s bonus either way.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Recovery below the debt repaid</h3>
          <p className="mb-4 type-doc-body">
            Aave pulls the repayment out of the caller&apos;s own funding, so the caller always holds the debt it repaid. A recovery a few units below the debt repaid, which the floor&apos;s rounding allowances permit so that dust liquidations settle, reduces only the caller&apos;s payout. No Avana contract pays any part of a settlement, and Avana&apos;s keeper accepts that loss. A caller that borrowed through a helper covers it through the helper&apos;s top-up bound, or the helper reverts.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Refused payouts</h3>
          <p className="mb-4 type-doc-body">
            Avana&apos;s fee, the borrower surplus and any route residue or dust leg owed to the caller are delivered with a gas-limited transfer. If the token refuses one of them, for example because the recipient is on the token&apos;s blocklist, the amount goes to Avana&apos;s payout escrow (the PayoutEscrow contract), credited to that recipient, who claims it later. The liquidation still completes. Holding refused payouts is the escrow&apos;s only job.
          </p>
          <p className="mb-4 type-doc-body">
            The caller payout is never escrowed. It includes the caller&apos;s returned funding, and a flash-funded caller repays its loan from it in the same transaction, so it is paid directly or the call reverts. A blocklisted caller blocks only its own call; any other address can liquidate the account.
          </p>
          <p className="mb-4 type-doc-body">
            The formulas, the payout order and worked numbers are on the flow page: <Link href="/developers/liquidation/flow" className="text-type-accent hover:underline">Liquidation Flow</Link>.
          </p>
        </section>

        <section id="deficits" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Deficits and Multi-Debt Accounts</h2>
          <p className="mb-4 type-doc-body">
            Aave reports a deficit inside its liquidation call only when the call empties the account&apos;s collateral and debt remains. It then reports the remaining debt of every borrowed reserve, each on its funding Hub and in that reserve&apos;s asset, and zeroes the account&apos;s debt. Avana accepts this behaviour unchanged. The Avana Umbrella (Coverage Spoke) of each affected Hub and asset covers its deficit within the coverage window, never with another asset&apos;s or another Hub&apos;s coverage.
          </p>
          <p className="mb-4 type-doc-body">
            A call that reports a deficit settles like any other. If the recovery floor or the funding check fails, the whole transaction reverts, deficit report included. A borrower surplus is still paid when the same call leaves a deficit, because the deficit is debt the collateral could not cover at oracle prices, while the surplus is what the collateral produced above those prices. Avana does not net one against the other.
          </p>
          <p className="mb-4 type-doc-body">
            After a full seizure, every record of the account stays open with 0 credited units. The depositor can collect fees and take the position back with the AaveAdapter&apos;s releaseZeroCredit, which needs no debt check. Callers skip accounts with no collateral left, because Aave has already reported their deficit.
          </p>
          <p className="mb-4 type-doc-body">
            An account with several debt reserves is liquidated by successive calls, one debt reserve each, in the order the caller chooses. A committed operator continues until the health factor is at least 1, when Aave rejects further calls, or a deficit has been recorded.
          </p>
        </section>

        <section id="preview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Lens Preview</h2>
          <p className="mb-4 type-doc-body">
            The Lens function <code className="type-doc-inline-code">previewLiquidation(proxy, debtReserveId, deadline)</code> returns ready-to-send liquidation parameters that can be submitted unchanged. It reports:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>the health factor, the bonus, the Spoke&apos;s liquidation configuration and every gate evaluated as LPVaultSwap evaluates it;</li>
            <li>the number of active committed operators, for information only, since it gates no liquidation;</li>
            <li>the debt Aave would repay, sized with Aave V4&apos;s pinned liquidation formulas, including the whole-debt case of the dust rule;</li>
            <li>the expected seizure and the recovery floor;</li>
            <li>the expected gross payout (the funding returned plus the reward) and the expected net payout beyond the funding;</li>
            <li>the expected caller loss: how far the payout can fall below the funding at oracle prices.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            The returned parameters have no funding field, because the caller always funds debtToCover itself. They carry a route mode (PrimaryThenBackup when every primary route is usable, otherwise BackupOnly), a minimum payout of 0 and a top-up limit of 0, which leaves those risk choices to the caller. For a whole-debt close the Lens adds a 500 bps margin to debtToCover; the part Aave does not pull returns to the caller.
          </p>
          <p className="mb-4 type-doc-body">
            The preview reads no flash source and quotes no flash loan. A caller that borrows through a helper reads the helper&apos;s own maxFlashLoan and flashPremium quotes, and sets the helper&apos;s top-up bound to at least the premium plus the expected caller loss, minus the expected net payout.
          </p>
          <p className="mb-4 type-doc-body">
            The Lens is periphery: no Avana contract calls it, and no result of it is used on-chain. On execution, Aave sizes the seizure and LPVaultSwap measures what was spent and seized.
          </p>
        </section>

        <section id="removed" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Not in the Design</h2>
          <p className="mb-4 type-doc-body">
            Earlier versions of these docs described mechanisms that are not part of the protocol. None of the following exist:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>settling a whole position at once, a per-market choice of how to settle, and in-kind settlement;</li>
            <li>swaps through an off-chain or batch-settled order protocol;</li>
            <li>flash minting GHO, and buying the debt asset with GHO;</li>
            <li>a flash loan taken by LPVaultSwap during a liquidation: the caller funds every repayment;</li>
            <li>a second, separate liquidation function for unregistered callers, and a keeper-only rule: liquidate is the one entry point, open to every address that is not frozen;</li>
            <li>a protocol settlement budget or any Avana balance that pays settlement gaps;</li>
            <li>escrowing the caller&apos;s payout;</li>
            <li>a health factor across several positions: each account holds one market.</li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="When an Avana account can be liquidated, how any address liquidates it through one entry point, how callers fund it directly or through the flash liquidation helper, and how the proceeds are split."
        sectionColor="amber"
      />
    </div>
  ))
}
