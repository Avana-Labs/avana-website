import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'liquidation/liquidators', {
    title: "Liquidators",
    description: "How any address liquidates Avana accounts through LPVaultSwap.liquidate: funding, the flash liquidation helper, committed operators, the caller payout, sizing, gas and failures.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "entry-point", title: "The liquidate Call" },
  { id: "route-modes", title: "Route Modes" },
  { id: "funding", title: "Funding a Call" },
  { id: "flash-helper", title: "Flash Liquidation Helper" },
  { id: "committed-operators", title: "Committed Operators" },
  { id: "payout", title: "Caller Payout" },
  { id: "sizing", title: "Sizing a Call" },
  { id: "settle-pending", title: "Pending Settlement" },
  { id: "operations", title: "Operator Practice" },
  { id: "gas", title: "Gas Model" },
  { id: "example", title: "Example: Any Caller" },
  { id: "freeze-and-stops", title: "Freezes and Stops" },
  { id: "failures", title: "Failures and Responses" },
]

export default async function DeveloperLiquidatorsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "liquidation/liquidators", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Liquidators"
          description="How any address calls LPVaultSwap, funds the repayment directly or through the flash liquidation helper, sizes the call, and what each failure means."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            An account can be liquidated once Aave allows it: its health factor is below 1 and the prices of its market and the repaid debt reserve are fresh. Every liquidation goes through LPVaultSwap on its chain, which has one liquidation entry point and one settlement entry point:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li><code className="type-doc-inline-code">liquidate</code>: open to any address that is not frozen, with either route mode, PrimaryThenBackup or BackupOnly.</li>
            <li><code className="type-doc-inline-code">settlePending</code>: open to any address; settles stranded units and pays the caller nothing.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            There is no keeper check and no second, restricted path. Every check that protects Avana and the borrower runs on every call, whoever the caller: the health factor, the price, grace and sequencer gates, the Hub share check, the recovery floor with its per-leg minimums, Avana&apos;s fee, the borrower surplus, the deadline, the caller&apos;s minimum payout and the address freeze.
          </p>
          <p className="mb-4 type-doc-body">
            The caller brings the debt asset. It funds the call from its own balance, or through Avana&apos;s public flash liquidation helper, which flash-borrows the debt asset from the chain&apos;s Aave V3 Pool, calls liquidate and repays the loan from the caller&apos;s payout. An operator may also run its own helper. LPVaultSwap itself takes no flash loan in a liquidation.
          </p>
          <p className="mb-4 type-doc-body">
            The caller is always msg.sender at LPVaultSwap: it funds the call and its payout goes to msg.sender. Through a helper, msg.sender is the helper. No recipient, route, recovery-floor override or executable calldata is taken from the caller. Every amount is in base units of the debt asset being repaid.
          </p>
          <p className="mb-4 type-doc-body">
            Eligibility rules and the reasons liquidation is never paused are on the design page: <Link href="/developers/liquidation" className="text-type-accent hover:underline">Liquidation Design</Link>.
          </p>
        </section>

        <section id="entry-point" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">The liquidate Call</h2>
          <p className="mb-4 type-doc-body">
            Any address that is not frozen calls <code className="type-doc-inline-code">liquidate(LiquidationParams params)</code>, which returns a LiquidationResult. One call liquidates one account, in its one collateral market, against one debt reserve. A registered committed operator has no power any other caller lacks.
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Field</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Meaning</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">proxy</code></td>
                  <td className="px-4 py-2">The borrower&apos;s PositionProxy, the Aave account for one market</td>
                  <td className="px-4 py-2">Must be a valid proxy of the market&apos;s vault token, else UnknownProxy</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">marketId</code></td>
                  <td className="px-4 py-2">The collateral market to seize from</td>
                  <td className="px-4 py-2">Must be the proxy&apos;s market; Registered, Active and Offboarding markets are accepted</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">debtReserveId</code></td>
                  <td className="px-4 py-2">The debt reserve to repay</td>
                  <td className="px-4 py-2">Must be enabled for the Spoke, else UnknownDebtReserve</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">debtToCover</code></td>
                  <td className="px-4 py-2">The debt asset LPVaultSwap pulls from msg.sender; the amount that arrives is Aave&apos;s bound</td>
                  <td className="px-4 py-2">Greater than 0; a bound, never an exact amount</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">routeMode</code></td>
                  <td className="px-4 py-2">PrimaryThenBackup or BackupOnly</td>
                  <td className="px-4 py-2">Either value, for every caller; applied as set, and no pool price changes it</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">minAmounts</code></td>
                  <td className="px-4 py-2">Optional least amount of each market token the unwind must return</td>
                  <td className="px-4 py-2">Empty, or one value per market token; it can only make the call revert</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">deadline</code></td>
                  <td className="px-4 py-2">Last valid block timestamp, in seconds</td>
                  <td className="px-4 py-2">Checked first, before the lock and any external call, else DeadlineExpired</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">minPayout</code></td>
                  <td className="px-4 py-2">The smallest caller payout accepted: the funding plus the smallest net payout</td>
                  <td className="px-4 py-2">Checked after the payout waterfall, else PayoutTooLow</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">maxShortfall</code></td>
                  <td className="px-4 py-2">The most of the caller&apos;s own debt asset the call may pull, beyond its funding, to close a gap below the recovery floor</td>
                  <td className="px-4 py-2">0 disables the top-up</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            The struct has no funding or flash-amount field: the caller always funds debtToCover itself, and how it obtains the debt asset is outside LPVaultSwap. debtToCover and maxShortfall are each at most 2^128 − 1. The deadline, minPayout and minAmounts change no amount, route or recipient: they can only make the call revert. The recovery floor is computed from oracle prices alone, so minPayout protects the caller while the floor protects Avana and the borrower.
          </p>
          <p className="mb-4 type-doc-body">
            The LiquidationResult returns the debt asset, the debt repaid, the units seized, the amount of each token the unwind returned, the caller funding received, the amount recovered, the recovery floor, Avana&apos;s fee, the caller reward, the caller payout, the borrower surplus and the shortfall pulled from the caller.
          </p>
          <p className="mb-4 type-doc-body">
            A direct call to the CDP Spoke&apos;s liquidationCall from any other address fails, because the vault token accepts seized collateral only to LPVaultSwap. The Hub&apos;s transfer to that caller reverts with UnauthorizedTransfer and the account is unchanged.
          </p>
        </section>

        <section id="route-modes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Route Modes</h2>
          <p className="mb-4 type-doc-body">
            Each market has, for each of its tokens and each enabled debt asset, a primary and a backup swap route recorded in the MarketRegistry. Both are held to the same recovery floor and per-leg minimums, and both modes are open to every caller.
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Mode</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Behaviour</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">PrimaryThenBackup</code></td>
                  <td className="px-4 py-2">Calls the primary route if it is usable. If the primary is not usable or reverts, emits RouteFailed for a revert and calls the backup if it is usable.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">BackupOnly</code></td>
                  <td className="px-4 py-2">Calls only the backup route of each token. It only selects an approved route held to the same floor and leg minimums.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            If no usable route converts a token, the call reverts with NoRouteAvailable. There is no in-kind fallback: the caller waits for a standby or replaced route. A token that is itself the debt asset needs no route.
          </p>
        </section>

        <section id="funding" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Funding a Call</h2>
          <p className="mb-4 type-doc-body">
            The caller is LPVaultSwap&apos;s only source of the debt asset. Before any other transfer, LPVaultSwap pulls debtToCover from msg.sender and measures what arrived, Kf, as its own balance change. It reverts with FundingMismatch unless Kf is above 0 and at most debtToCover. For a debt asset without a transfer fee, Kf equals debtToCover.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>LPVaultSwap approves the CDP Spoke for exactly Kf and passes Kf to Aave&apos;s liquidationCall, with receiveShares set to false. Aave pulls the repayment D, at most Kf.</li>
            <li>The Kf − D that Aave did not use is not swapped. It returns to the caller inside its payout, with the recovered principal, in the same transaction. Oversizing debtToCover costs the caller nothing at LPVaultSwap.</li>
            <li>Caller funds and the unused debt asset are outside the window in which the recovery R is measured, so prefunding cannot raise R.</li>
            <li>Before calling, the caller approves LPVaultSwap for debtToCover, plus maxShortfall if it allows a floor top-up.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            A caller without the debt asset uses the public flash liquidation helper or its own helper. When the Aave V3 Pool behind a helper is short, paused or charges above the caller&apos;s bound, the helper reverts before LPVaultSwap is called, and the caller funds the debt itself or uses a smaller amount.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: the Base V3 Pool holds about 0.13M idle GHO. The public helper refuses a 400,000 GHO loan before any state change, and Avana&apos;s keeper repeats the liquidation by calling liquidate directly with 400,000 GHO of its own.
          </div>
        </section>

        <section id="flash-helper" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Flash Liquidation Helper</h2>
          <p className="mb-4 type-doc-body">
            The flash liquidation helper lets a caller that holds no debt asset liquidate. It is a periphery contract outside the audited core: public and immutable, with no owner, admin, upgrade path, setter, sweep or rescue function, and it holds no funds or allowances between transactions. One public instance per chain borrows from that chain&apos;s Aave V3 Pool: the Ethereum Core Pool, and on Base the Pool at 0xA238Dd80C259a72e81d7e4664a9801593F98d1c5. Anyone can use it.
          </p>
          <p className="mb-4 type-doc-body">
            LPVaultSwap treats every helper as an ordinary caller. The helper is msg.sender: it funds liquidate and receives the caller payout, and no check or formula of LPVaultSwap depends on the loan.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Interface</h3>
          <p className="mb-4 type-doc-body">
            The public helper implements <code className="type-doc-inline-code">IFlashLiquidator</code>, whose entry point is <code className="type-doc-inline-code">flashLiquidate(FlashLiquidationRequest request)</code>, returning the net payout. It also exposes executeOperation, the Pool callback, and the views maxFlashLoan, flashPremium, POOL, LP_VAULT_SWAP, MARKET_REGISTRY and PARAMETER_STORE.
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Request field</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">params</code></td>
                  <td className="px-4 py-2">The LiquidationParams, passed to liquidate unchanged</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">flashAmount</code></td>
                  <td className="px-4 py-2">The loan F, above 0 and at most debtToCover; any rest of debtToCover comes from the caller</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">maxPremium</code></td>
                  <td className="px-4 py-2">The most premium the caller accepts on the loan</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">maxTopUp</code></td>
                  <td className="px-4 py-2">The most debt asset the helper may pull from the caller after liquidate to repay the loan and premium</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">minPayout</code></td>
                  <td className="px-4 py-2">The smallest net payout accepted after the loan and premium are repaid</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            The request&apos;s minPayout is net of the loan; params.minPayout stays the gross bound LPVaultSwap checks on its payout, and a helper&apos;s caller may leave it at 0 because the helper&apos;s own check binds.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">What the helper does</h3>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>It checks, in order, that none of its calls is open (ContextActive), that the caller is the signer in the operator variant (NotSigner), and that the loan is above 0 and at most debtToCover (InvalidFlashAmount). It reads the debt asset from the MarketRegistry and reverts with InsufficientFlashLiquidity if the loan exceeds what the Pool can lend. It refuses a Pool recorded as an Avana Hub (FlashSourceIsHub), at deployment and on every call.</li>
            <li>It records a single-use context in transient storage: the Pool, itself as initiator, the debt asset, the loan, maxPremium, maxTopUp, the hash of params, its payer and its payout recipient.</li>
            <li>If the loan is smaller than debtToCover, it first pulls the difference from the payer.</li>
            <li>It calls the Pool&apos;s flashLoan. It uses flashLoan, not flashLoanSimple, because only flashLoan waives the premium for an address holding FLASH_BORROWER.</li>
            <li>In the executeOperation callback it requires the recorded Pool, itself as initiator, one asset, the recorded asset, amount and params hash, and an active, unused context; otherwise it reverts with InvalidFlashCallback. It reverts with PremiumTooHigh above maxPremium, and with FlashFeeTooHigh when the premium exceeds maxFlashFeeBps of the loan.</li>
            <li>It approves LPVaultSwap for exactly debtToCover, calls liquidate(params), resets the allowance and measures the caller payout as the rise of its own balance.</li>
            <li>It owes the loan plus the premium. If the payout is smaller, it pulls the difference from the payer up to the top-up bound and reverts with TopUpExceeded beyond it, which reverts the whole liquidation. It then approves the Pool for exactly what it owes.</li>
            <li>After flashLoan returns, it computes its net payout (payout plus top-up, less loan and premium), reverts with PayoutTooLow below the request&apos;s minPayout, and sends the net payout and any market-token residues or dust legs to its payout recipient. It emits FlashLiquidated.</li>
          </ol>
          <p className="mb-4 type-doc-body">
            The helper takes no swap step, route, foreign recipient or executable calldata: the unwind and the routes stay in the core. It pays out only after flashLoan returns, so nothing leaves the helper while the loan is open.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Premium and quotes</h3>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>The premium is 0 once Aave grants the helper FLASH_BORROWER on the Pool, which the deployment payload requests. Otherwise it is the Pool&apos;s premium, 5 bps at launch.</li>
            <li>flashPremium quotes 0 while the helper holds FLASH_BORROWER, otherwise the premium rounded up. Example: 1,950 USDC at 5 bps without the role quotes 0.975 USDC; with it, 0.</li>
            <li>maxFlashLoan returns the smaller of the reserve&apos;s aToken balance and its virtual underlying balance, or 0 if the reserve is inactive, paused or not flash-enabled.</li>
            <li>The premium on the whole loan, including any part the debt did not need, and any transfer-fee loss on the helper&apos;s own transfers, come out of the caller&apos;s payout. They never reduce Avana&apos;s fee or the borrower surplus.</li>
          </ul>
          <h3 className="mb-2 type-doc-subsection-title">Public helper and operator helpers</h3>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>The public helper takes its payer and payout recipient from msg.sender, so a caller can pull from and pay only itself. It is named in each chain&apos;s deployment manifest and is never registered as a committed operator, because it commits to nothing.</li>
            <li>The public helper has no claim function. A residue or dust leg that LPVaultSwap could not deliver to it stays credited to the helper in the PayoutEscrow; that happens only when a market token refuses transfers to the helper.</li>
            <li>An operator may deploy its own helper, which implements <code className="type-doc-inline-code">IOperatorFlashLiquidator</code> with the views SIGNER, FUNDING_SAFE and MAX_TOP_UP_BPS. Only SIGNER may call it, it pulls inventory and top-ups only from FUNDING_SAFE and pays only to it, and each top-up is bounded by MAX_TOP_UP_BPS of debtToCover as well as maxTopUp.</li>
            <li>Its claimEscrowed function, callable only by SIGNER, claims the helper&apos;s PayoutEscrow credit to FUNDING_SAFE. The operator registers this helper&apos;s address, or its signer&apos;s address when it calls liquidate directly, as its committed operator.</li>
            <li>An operator&apos;s own helper holds no FLASH_BORROWER grant unless an Aave proposal adds one, so it pays the Pool premium.</li>
          </ul>
          <div className="mb-4 doc-topic type-doc-body">
            Example: with MAX_TOP_UP_BPS set to 100, a call with debtToCover 9,800 USDC can pull at most 98 USDC of top-up from the Safe, whatever maxTopUp the signer sends. A compromised signer key can only start liquidations that pay the operator&apos;s own Safe.
          </div>
        </section>

        <section id="committed-operators" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Committed Operators</h2>
          <p className="mb-4 type-doc-body">
            The keeper list on each chain&apos;s LPVaultSwap is a registry of committed operators, one per chain covering every Hub. Each registered operator commits to liquidate every account below a health factor of 1 on its chains, whatever the account&apos;s size and whether or not the bonus covers the gas. The registry gates no call: liquidate is open to every address that is not frozen.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>The registry feeds keeperFloor, the borrowing halt at zero active operators, and monitoring, which tracks how fast each account below a health factor of 1 is liquidated.</li>
            <li>At launch the only committed operator on each chain is Avana&apos;s keeper. It runs primary instances plus a standby on separate infrastructure; Avana funds it with each chain&apos;s debt assets and pays its gas, and it repays as much as Aave allows per call, so no liquidation depends on a keeper&apos;s profit.</li>
            <li>Others, such as Aave Labs or a risk provider, are added through the timelock at the normal delay, up to 32 per chain. The Aave DAO can have a committed operator of its choice registered.</li>
            <li>The registered address is the operator&apos;s own key or Safe that calls liquidate, or its per-operator helper. The public helper is never registered.</li>
            <li>Each committed operator holds, on each chain, debt-asset inventory of at least the largest single debtToCover the caps of that chain&apos;s markets allow.</li>
            <li>keeperFloor is 1 active committed operator per chain. When none remains, new borrowing and withdraw-with-debt halt on every CDP Spoke of the chain with LiquidationHalted. Liquidation itself never halts: liquidate stays open to every address.</li>
          </ul>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Function or view</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">addKeeper(operator)</code></td>
                  <td className="px-4 py-2">Timelock at the normal delay (5 days); because it restores liquidation capacity, only the Aave governance executor can cancel it. Reverts with InvalidKeeper for the zero address or a registered operator, AddressIsFrozen for a frozen address, and TooManyKeepers above 32.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">removeKeeper(operator)</code></td>
                  <td className="px-4 py-2">Timelock at the short delay (12 hours). Reverts with KeeperFloor if fewer than 1 active committed operator would remain on the chain.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">isApprovedKeeper</code>, <code className="type-doc-inline-code">activeKeeperCount</code>, <code className="type-doc-inline-code">approvedKeeperCount</code>, <code className="type-doc-inline-code">getKeepers</code></td>
                  <td className="px-4 py-2">Views of the registry; the active count excludes frozen operators. No liquidation check reads them.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">KEEPER_FLOOR</code>, <code className="type-doc-inline-code">MAX_KEEPERS</code></td>
                  <td className="px-4 py-2">1 and 32 per chain</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            The functions, views and the KeeperAdded and KeeperRemoved events keep the word keeper in their names; there it means committed operator. A removed operator returns to the registry only through addKeeper, and removal never stops its liquidate calls.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: the Ethereum governance multisig schedules addKeeper(0x3b9f…e210) for a risk provider on 2 March at 12:00 UTC. It executes on 7 March at 12:00 UTC, and from that block the operator counts toward keeperFloor and is monitored against its commitment. Its liquidate calls were accepted before that block too, like anyone&apos;s.
          </div>
          <div className="mb-4 doc-topic type-doc-body">
            Example: Ethereum has two committed operators, Avana&apos;s keeper K1 and a risk provider K2. Removing K2 leaves one, and borrowing continues; a removal of K1 then reverts. If K1&apos;s key is compromised, a guardian freezes it at once, because a freeze is never blocked by the floor. With zero active committed operators, new borrowing on every CDP Spoke of Ethereum halts while liquidate stays open to every address, until a replacement is registered.
          </div>
          <p className="mb-4 type-doc-body">
            The Aave DAO liquidates Avana accounts like any other caller: through liquidate from its executor or any address it controls, directly or through the public helper, at once and with no Avana action.
          </p>
        </section>

        <section id="payout" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Caller Payout</h2>
          <p className="mb-4 type-doc-body">
            After the swaps, LPVaultSwap splits the result in the debt asset. V is the oracle value of the seized units, R the debt asset recovered and R′ the recovery plus any shortfall top-up.
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Term</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Formula</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Oracle gain G</td><td className="px-4 py-2">max(0, V − D)</td></tr>
                <tr><td className="px-4 py-2">Realized surplus Y</td><td className="px-4 py-2">max(0, R′ − D)</td></tr>
                <tr><td className="px-4 py-2">Avana fee A</td><td className="px-4 py-2">min(⌊G × 20%⌋, Y)</td></tr>
                <tr><td className="px-4 py-2">Caller reward Kr</td><td className="px-4 py-2">min(Y − A, G − A)</td></tr>
                <tr><td className="px-4 py-2">Borrower surplus B</td><td className="px-4 py-2">Y − A − Kr</td></tr>
                <tr><td className="px-4 py-2">Caller payout keeperOut</td><td className="px-4 py-2">Kf + R′ − D − A − B</td></tr>
              </tbody>
            </table>
          </div>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>What the caller receives: when R′ is at least D, keeperOut is Kf + Kr, the whole funding back (the unused part and the recovered principal) plus the reward. When R′ is below D, keeperOut is Kf − (D − R′): the caller bears the difference. keeperOut is never negative.</li>
            <li>The caller&apos;s net result is keeperOut − Kf − shortfall. Through a helper, the helper also repays the loan and premium from keeperOut before paying its caller.</li>
            <li>Avana&apos;s fee is 20% of the oracle gain, capped by the realized gain, so a caller&apos;s routing cannot lower it while the realized gain covers it. Any recovery above the seized collateral&apos;s oracle value goes to the borrower.</li>
            <li>In a market whose slippage allowance reaches the limit the bonus sets, a caller that routes the recovery down to the floor can reduce Avana&apos;s fee to about zero, so the fee there is best-effort. The floor still protects the debt repaid and the borrower.</li>
            <li>Conservation: Kf + R + shortfall = D + A + B + keeperOut.</li>
          </ul>
          <h3 className="mb-2 type-doc-subsection-title">Payout order and delivery</h3>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>Avana&apos;s fee A goes to the fee recipient (InvalidFeeRecipient if it is the zero address).</li>
            <li>The borrower surplus B goes to the account&apos;s wallet, with the event BorrowerSurplusPaid.</li>
            <li>keeperOut goes to msg.sender by a plain transfer. Route residues and dust legs also go to msg.sender.</li>
          </ol>
          <p className="mb-4 type-doc-body">
            A transfer of the fee, the borrower surplus, a route residue or a dust leg that reverts, returns false or runs out of gas does not revert the liquidation: the amount goes to the payout escrow (the PayoutEscrow contract), credited to its recipient, who claims it later. The caller&apos;s payout is the exception. keeperOut includes the returned funding and a flash-funded caller repays its loan from it, so it is never escrowed: it is paid directly to msg.sender or the whole call reverts. A blocklisted caller blocks only its own call; any other address can liquidate the account.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">minPayout and deadline</h3>
          <p className="mb-4 type-doc-body">
            Because keeperOut includes the returned funding, minPayout is the funding plus the smallest net payout the caller accepts. Callers set it at least 1% of the previewed net payout below the preview: minPayout ≤ debtToCover + ⌊0.99 × (previewed keeperOut − debtToCover)⌋. The call reverts with PayoutTooLow if keeperOut falls below it.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: a caller funds 9,800 USDC and sets minPayout to 9,909 USDC, the funding plus a net 109 USDC, more than 1% below the previewed net 110.8 USDC. The liquidation pays keeperOut = 9,910.8 USDC and succeeds. Had the routes returned 9,935 USDC, the reward would be 95.8 USDC, keeperOut 9,895.8 USDC, and the call reverts with PayoutTooLow(9,895,800,000, 9,909,000,000).
          </div>
          <p className="mb-4 type-doc-body">
            The deadline is checked first, so a transaction left pending cannot execute later at a price and bonus its caller never saw. 120 s is 10 Ethereum blocks and 60 Base blocks.
          </p>
        </section>

        <section id="sizing" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Sizing a Call</h2>
          <p className="mb-4 type-doc-body">
            Callers size each call from the Lens preview, <code className="type-doc-inline-code">previewLiquidation(proxy, debtReserveId, deadline)</code>. It returns LiquidationParams that can be sent unchanged, plus the expected seizure, the recovery floor, the gross and net payout, and the loss the caller may bear at oracle prices.
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>The preview sets routeMode to PrimaryThenBackup when the primary route of every pool token is usable, else BackupOnly. It leaves minPayout and maxShortfall at 0 and minAmounts empty, so the caller sets its own risk and capital limits.</li>
            <li>Set debtToCover to the previewed Aave amount: the repayment to Aave&apos;s target health factor, or the whole debt in the reserve when Aave&apos;s dust rule applies. There is no minimum size per call.</li>
            <li>Aave V4&apos;s dust rule can raise the repayment needed to finish a liquidation to the whole debt. For a whole-debt close the Lens quotes debtToCover as the whole debt plus a 500 bps margin, rounded up, or stays at least 500 bps below Aave&apos;s dust boundary. Aave pulls only what it needs, and the rest returns inside keeperOut.</li>
            <li>Set minPayout to the funding plus the previewed net payout, less at least 1% of that net payout.</li>
            <li>Set a deadline a short time ahead. 120 s is 10 Ethereum blocks and 60 Base blocks.</li>
            <li>Through a helper, read its maxFlashLoan and flashPremium, and set its top-up bound to at least the premium plus the previewed caller loss, less the previewed net payout.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            Caller inputs are bounds, not exact values. A borrower who repays 1 wei, or repays enough to leave the debt just under the dust threshold, changes the amounts but not the outcome. Oversizing costs a self-funded caller nothing; through a helper it costs only the premium on the part Aave did not use.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: the Lens previews a whole debt of 1,950 USDC with a 500 bps margin, so debtToCover is 2,047.5 USDC. A 1-wei repayment lands first. Aave pulls 1,949.999999 USDC, and the 97.500001 USDC it did not pull returns to the caller inside keeperOut.
          </div>
          <div className="mb-4 doc-topic type-doc-body">
            Example: the same 2,047.5 USDC borrowed whole through the public helper at 5 bps carries a 1.02375 USDC premium. LPVaultSwap pays the helper keeperOut = 2,118.3 USDC; the helper repays 2,048.52375 USDC and pays its caller 69.77625 USDC. The premium on the unused 97.5 USDC, 0.04875 USDC, falls on the caller alone.
          </div>
          <h3 className="mb-2 type-doc-subsection-title">Rounding loss</h3>
          <p className="mb-4 type-doc-body">
            The recovery floor may sit slightly below the debt repaid so that dust liquidations settle, and that slack can leave the recovery a few base units under D. Such a shortfall reduces only the caller&apos;s payout; no Avana contract pays any part of it. For any recovery at or above the floor, the loss is at most one vault unit&apos;s value plus one raw unit per leg, the reserve&apos;s floor rounding allowance and a few base units of Aave rounding. Avana&apos;s keeper accepts that loss. A flash-funded caller covers it through the helper&apos;s top-up bound, or the helper reverts.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Shortfall top-up</h3>
          <p className="mb-4 type-doc-body">
            A caller that sets maxShortfall above 0, and approves that much, lets each swap leg run at more slippage: the leg slippage rises by up to maxShortfall as a share of V, capped at 1,000 bps, so at most 10% more. After the swaps LPVaultSwap pulls the gap between the floor and R from the caller, or reverts with RecoveryBelowFloor if the gap exceeds maxShortfall. Avana&apos;s fee does not fall with it, and the borrower surplus is 0 whenever a shortfall is paid.
          </p>
          <div className="mb-4 doc-topic type-doc-body">
            Example: V = 12,422.6 USDC, effective slippage 100 bps and maxShortfall 200 USDC. The legs run at 260 bps, the routes return 12,174 USDC, 123.373998 USDC is pulled from the caller, and the liquidation settles at full size.
          </div>
        </section>

        <section id="settle-pending" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Pending Settlement</h2>
          <p className="mb-4 type-doc-body">
            The function <code className="type-doc-inline-code">settlePending(marketId, debtReserveId)</code> settles vault tokens that an earlier, unsettled seizure left at LPVaultSwap&apos;s fixed address. Collateralization keeps those units backed by real pool tokens in a pending balance, reconciled from the borrower&apos;s records during the next seizure or withdrawal. Any address can call it, the pause state is not read, and it never runs inside a liquidation.
          </p>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>Before taking the lock, LPVaultSwap requires a known market and a non-zero fee recipient. It settles the smaller of its own vault-token balance and Collateralization&apos;s pending units, and reverts with NothingPending if that is 0.</li>
            <li>It reads the sequencer gate (SequencerDown while down), pokes the market&apos;s LP Oracle and applies the collateral price gate (StalePrice).</li>
            <li>The AaveAdapter burns the units, and Collateralization releases the matching pool tokens to LPVaultSwap.</li>
            <li>Each token is swapped into the settlement asset over the market&apos;s routes in PrimaryThenBackup mode, with a slippage allowance of the smaller of the market&apos;s allowance and 30 bps.</li>
            <li>The recovery must reach the pending-settlement floor, else RecoveryBelowFloor.</li>
            <li>The recovered amount is added to the Avana Umbrella (Coverage Spoke) of the settlement reserve&apos;s funding Hub and asset through its public fund function.</li>
            <li>Any unconverted route residue goes to the fee recipient, or to the payout escrow if that transfer fails. The call emits PendingSettlementForwarded.</li>
          </ol>
          <p className="mb-4 type-doc-body">
            The caller receives nothing. The unsettled seizure already repaid debt and the borrower&apos;s records were already debited, so no waterfall applies. The Avana Umbrella is the layer that absorbs the loss of that incident. Each market names its settlement debt reserve at listing, its first enabled debt reserve, changeable at the normal delay.
          </p>
          <p className="mb-4 type-doc-body">
            A pending balance never blocks a liquidation. If the call reverts (price or sequencer gate, no usable route, the floor, or the Coverage Spoke refusing the funds), the tokens stay in custody backing the outstanding units, and anyone can repeat the call later.
          </p>
        </section>

        <section id="operations" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Operator Practice</h2>
          <p className="mb-4 type-doc-body">
            How Avana&apos;s keeper and other committed operators run liquidations:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Size by simulation: re-run the Lens preview for each account at each new block and keep signed calls current, with the helper&apos;s flash amount checked against the Aave V3 Pool&apos;s idle liquidity and the operator&apos;s own funds ready for the rest.</li>
            <li>Submit through private order flow on Ethereum, so a pending call is not front-run or left in the public mempool.</li>
            <li>Poke oracles: the LP Oracle and DebtOracle poke function is a permissionless cache write that keepers run on every feed update. LPVaultSwap also pokes the seized market and the repaid reserve inside every call. A poke needs a minimum amount of gas, and a gas-starved poke reverts the whole liquidation.</li>
            <li>Send one account per transaction. Separate transactions never contend for the lock, which is released at the end of each call.</li>
            <li>On Base, size each block&apos;s flash loans to the Base Pool&apos;s idle debt asset and spread larger liquidations over successive 2 s blocks.</li>
            <li>Answer RecoveryBelowFloor with a shortfall top-up from the operator&apos;s own funds or with an arbitrage bundle, never with repeated halving, whose gas would exceed the debt each call repays.</li>
            <li>When the helper reverts because the Pool is short, paused or charges above the bound, call liquidate directly with the operator&apos;s own inventory.</li>
            <li>During an Aave halt of a CDP Spoke, stop sending calls for that market, keep the prepared calls current, and submit them in ascending health-factor order in the first block after the halt is lifted.</li>
            <li>Liquidate an account with several debt reserves with successive calls until its health factor is at least 1 or a deficit is recorded. Skip accounts with no collateral left.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            Failed floors and route failures are not counted on-chain. Avana&apos;s monitoring records each RouteFailed event and each RecoveryBelowFloor or NoRouteAvailable revert, and raises an alert at 3 failures in 1 hour on a market. The guardian freezes new borrowing on the market only once the approved routes are confirmed unable to settle valid liquidations at the required size; liquidation, repayment and debt-free exits stay open.
          </p>
        </section>

        <section id="gas" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Gas Model</h2>
          <p className="mb-4 type-doc-body">
            A liquidation that touches n records uses about this much gas, measured on a fork of each chain:
          </p>
          <div className="mb-4 type-doc-code-block">
            <code className="type-doc-body text-gray-900">G(n) = 1,310,000 + 240,000 × n</code>
          </div>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>One record: about 1.55M gas, which is about $3 at a gas price of about 1 gwei.</li>
            <li>An account holds at most 16 records per market, so the largest liquidation uses about 5.15M gas. That is under half of the 16,777,216 per-transaction gas limit, so the largest account always fits in one transaction.</li>
            <li>Ethereum counts execution gas. Base counts execution gas plus the L1 data fee of each transaction.</li>
            <li>Avana budgets its keeper&apos;s gas per chain from this model, the expected number of liquidations and the gas price, plus the L1 data fee on Base. No protocol rule reads the gas price.</li>
          </ul>
          <div className="mb-4 doc-topic type-doc-body">
            Example (Base): an account owing 40 USDC with one record falls below a health factor of 1. Its liquidation uses 1,550,000 gas. With a 2% bonus, a 0.3% swap cost and Avana&apos;s 20% share, the keeper&apos;s reward is (40 × 1.02 × 0.997 − 40) − 0.2 × (40 × 1.02 − 40) = 0.6776 − 0.16 = 0.5176 USDC. Avana&apos;s keeper liquidates the account whether or not that covers the gas.
          </div>
        </section>

        <section id="example" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Example: Any Caller</h2>
          <p className="mb-4 type-doc-body">
            Example values; each market&apos;s parameters are set at listing. The account is the USDC-debt account on the Uniswap v3 USDC/USDT market 1 on Ethereum, worked through fully on the examples page, and the caller is an address with no registration.
          </p>
          <ol className="mb-4 list-decimal space-y-2 ps-5 type-doc-body">
            <li>The caller holds 9,800 USDC and approves LPVaultSwap for it.</li>
            <li>It calls liquidate with debtToCover 9,800 USDC, routeMode BackupOnly, a deadline 120 s ahead, minPayout 9,909 USDC and maxShortfall 0. If it were frozen, the call would revert with AddressIsFrozen.</li>
            <li>LPVaultSwap pulls Kf = 9,800 USDC. Aave repays D = 9,800 USDC and seizes 4,998 vault tokens, worth V = 9,996 USDC at oracle prices. The recovery floor is 9,895.039998 USDC.</li>
            <li>The backup route returns the same 4,952 USDC for the USDT leg, so R = 9,950 USDC and no shortfall is pulled.</li>
            <li>Avana&apos;s fee of 39.2 USDC goes to the fee recipient and the caller receives keeperOut = 9,910.8 USDC, a net 110.8 USDC.</li>
          </ol>
          <h3 className="mb-2 type-doc-subsection-title">Variant: through the public helper</h3>
          <p className="mb-4 type-doc-body">
            A caller with no USDC sends the same params to the public helper with a flash amount of 9,800 USDC. When the helper holds FLASH_BORROWER the premium is 0: the helper receives 9,910.8 USDC, repays the Pool 9,800 USDC and pays its caller 110.8 USDC. On Bob&apos;s account from the examples page, where the helper pays a 5 bps premium, it repays 1,950.975 USDC from a 2,020.8 USDC payout and pays its caller 69.825 USDC.
          </p>
        </section>

        <section id="freeze-and-stops" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Freezes and Stops</h2>
          <h3 className="mb-2 type-doc-subsection-title">Address freeze and the helper</h3>
          <p className="mb-4 type-doc-body">
            A caller on the chain&apos;s freeze list reverts with AddressIsFrozen when it calls liquidate directly. The check runs after the deadline check. The freeze binds msg.sender only: a frozen address that calls through the public helper reaches LPVaultSwap as the helper, so the freeze does not stop it, and freezing the public helper would stop every caller that uses it.
          </p>
          <p className="mb-4 type-doc-body">
            A freeze therefore stops an address&apos;s direct calls and removes a frozen committed operator from keeperFloor; it cannot stop an address from liquidating. A freeze checks no floor and may freeze the last active operator. A frozen wallet&apos;s own accounts are liquidated like any other.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">What can stop a liquidation</h3>
          <p className="mb-4 type-doc-body">
            No Avana pause, circuit breaker, configuration drift or address freeze stops liquidation, and an Aave freeze of a reserve does not either. Liquidation waits only for:
          </p>
          <ul className="mb-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>a fresh price of the market being seized and of the debt being repaid;</li>
            <li>the Base sequencer check: no call while the sequencer is down, and for one hour after a restart only accounts below a health factor of 0.95;</li>
            <li>Aave-side halts: a Hub halt or deactivation of the Spoke, or an Aave pause of the vault-token or debt reserve.</li>
          </ul>
          <p className="mb-4 type-doc-body">
            The listing payload commits the Aave DAO to contain a Spoke with a reserve freeze and a zero draw cap, which leave liquidation open, and to halt or pause only a faulty Spoke. A short or paused Aave V3 Pool stops only helper-funded calls: a caller that holds the debt asset still liquidates.
          </p>
        </section>

        <section id="failures" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Failures and Responses</h2>
          <p className="mb-4 type-doc-body">
            Every failure reverts the whole transaction: the helper&apos;s flash loan if any, seizure, burn, record debits, deficit report, shortfall top-up and payouts. None depends on the pause state, a breaker or a drift reason. A caller that is not a committed operator causes no failure.
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Error</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Cause</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">DeadlineExpired</code></td>
                  <td className="px-4 py-2">The block timestamp is past the deadline</td>
                  <td className="px-4 py-2">Re-preview and resubmit</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">AddressIsFrozen</code></td>
                  <td className="px-4 py-2">The direct caller is on the chain&apos;s freeze list</td>
                  <td className="px-4 py-2">Another address must call</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">LockHeld</code></td>
                  <td className="px-4 py-2">The protocol lock is already held (re-entry)</td>
                  <td className="px-4 py-2">Send one account per call</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">InvalidAmount</code></td>
                  <td className="px-4 py-2">debtToCover is 0, debtToCover or maxShortfall is above 2^128 − 1, or minAmounts has the wrong length</td>
                  <td className="px-4 py-2">Fix the parameters</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">UnknownProxy</code>, <code className="type-doc-inline-code">UnknownMarket</code>, <code className="type-doc-inline-code">UnknownDebtReserve</code></td>
                  <td className="px-4 py-2">The proxy, market or debt reserve does not match the registry</td>
                  <td className="px-4 py-2">Fix the parameters</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">NotLiquidatable</code></td>
                  <td className="px-4 py-2">The health factor is at least 1</td>
                  <td className="px-4 py-2">Nothing to do</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">StalePrice</code></td>
                  <td className="px-4 py-2">The market&apos;s price is Cached or Expired, too old, or in a feed disagreement pause</td>
                  <td className="px-4 py-2">Wait for a fresh price or a standby price route</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">DebtPriceStale</code></td>
                  <td className="px-4 py-2">The repaid reserve&apos;s DebtOracle is not Live or too old</td>
                  <td className="px-4 py-2">Repay the account&apos;s other debt reserves meanwhile</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">GraceHealthFactor</code></td>
                  <td className="px-4 py-2">Inside a recovery grace window with a health factor of 0.95 or more</td>
                  <td className="px-4 py-2">Retry after the window or once the health factor is below 0.95</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">SequencerDown</code></td>
                  <td className="px-4 py-2">The Base sequencer is reported down</td>
                  <td className="px-4 py-2">Wait for the restart</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">SequencerGrace</code></td>
                  <td className="px-4 py-2">Within 3,600 s of a sequencer restart with a health factor of 0.95 or more</td>
                  <td className="px-4 py-2">Retry after the grace period</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">SharesNotEqualAssets</code></td>
                  <td className="px-4 py-2">The home Hub&apos;s shares differ from its assets for the vault-token asset</td>
                  <td className="px-4 py-2">Raised as an alarm for the emergency playbooks</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">FundingMismatch</code></td>
                  <td className="px-4 py-2">The funding received is 0 or above debtToCover, or the shortfall received differs from the shortfall</td>
                  <td className="px-4 py-2">Check approvals and balances</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">NothingSeized</code></td>
                  <td className="px-4 py-2">Aave seized 0 vault-token units</td>
                  <td className="px-4 py-2">Size the call larger</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">NoRouteAvailable</code></td>
                  <td className="px-4 py-2">No usable route converts a token, or the routes the mode allows all fail</td>
                  <td className="px-4 py-2">Try the other route mode, or wait for a standby or replaced route</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">RecoveryBelowFloor</code></td>
                  <td className="px-4 py-2">The recovery is below the floor by more than maxShortfall</td>
                  <td className="px-4 py-2">Raise maxShortfall or bundle an arbitrage</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">InsufficientProceeds</code></td>
                  <td className="px-4 py-2">The balance cannot pay the fee, surplus and payout; ruled out by construction, a guard against a faulty measurement</td>
                  <td className="px-4 py-2">Report it; it signals a fault</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">PayoutTooLow</code></td>
                  <td className="px-4 py-2">keeperOut is below minPayout, or a helper&apos;s net payout is below the request&apos;s minPayout</td>
                  <td className="px-4 py-2">Re-preview, or accept a lower payout</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">InsufficientGas</code></td>
                  <td className="px-4 py-2">Too little gas left before a gas-limited payout transfer</td>
                  <td className="px-4 py-2">Retry with more gas</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">InvalidFeeRecipient</code></td>
                  <td className="px-4 py-2">The fee recipient is the zero address</td>
                  <td className="px-4 py-2">Governance sets a fee recipient</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Transfer of keeperOut fails</td>
                  <td className="px-4 py-2">msg.sender cannot receive the debt asset, for example an address its issuer blocks</td>
                  <td className="px-4 py-2">Call from an address that can receive it</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Aave errors</td>
                  <td className="px-4 py-2">SpokeHalted, SpokeNotActive, ReservePaused or another upstream check</td>
                  <td className="px-4 py-2">Passed through unchanged; follow the Aave halt procedure</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="mb-2 type-doc-subsection-title">Helper errors</h3>
          <p className="mb-4 type-doc-body">
            These revert in the helper, all but the last two before LPVaultSwap is called, and nothing changes.
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Error</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Cause</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">ContextActive</code>, <code className="type-doc-inline-code">NotSigner</code></td>
                  <td className="px-4 py-2">A nested or reentrant helper call, or a caller other than the signer of an operator helper</td>
                  <td className="px-4 py-2">One account per call; call from the signer</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">InvalidFlashAmount</code></td>
                  <td className="px-4 py-2">The flash amount is 0 or above debtToCover</td>
                  <td className="px-4 py-2">Fix the request</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">InsufficientFlashLiquidity</code></td>
                  <td className="px-4 py-2">The Pool&apos;s idle debt asset is below the flash amount, or the reserve is inactive, paused or not flash-enabled</td>
                  <td className="px-4 py-2">Smaller flash amount with the rest from own funds, or call liquidate directly</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">PremiumTooHigh</code>, <code className="type-doc-inline-code">FlashFeeTooHigh</code></td>
                  <td className="px-4 py-2">The Pool&apos;s premium is above maxPremium, or above maxFlashFeeBps of the loan</td>
                  <td className="px-4 py-2">Raise maxPremium within the cap, or fund from own balance</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">FlashSourceIsHub</code></td>
                  <td className="px-4 py-2">The helper&apos;s Pool is recorded as an Avana Hub</td>
                  <td className="px-4 py-2">Fund from own balance</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">InvalidFlashCallback</code></td>
                  <td className="px-4 py-2">A callback not from the recorded Pool, with a wrong initiator, asset, amount or params, or with no active unused context</td>
                  <td className="px-4 py-2">Nothing to do; forged or replayed callbacks fail</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">TopUpExceeded</code></td>
                  <td className="px-4 py-2">keeperOut plus the allowed top-up is below the loan and premium</td>
                  <td className="px-4 py-2">Larger top-up bound, or fund from own balance</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">PayoutTooLow</code></td>
                  <td className="px-4 py-2">The net payout after repayment is below the request&apos;s minPayout</td>
                  <td className="px-4 py-2">Re-preview, or accept a lower payout</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-4 type-doc-body">
            A transfer of Avana&apos;s fee, the borrower surplus, a route residue or a dust leg that fails, for example to an address an issuer has blocked, does not revert the liquidation. The amount goes to the payout escrow, credited to its recipient, who claims it later.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How any address liquidates Avana accounts through LPVaultSwap.liquidate, funded directly or through the flash liquidation helper, how committed operators work, how to size each call, and what each failure means."
        sectionColor="amber"
      />
    </div>
  ))
}
