import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'integrations/router-contract', {
    title: "AaveAdapter Entry Points",
    description: "Every borrower function of the AaveAdapter with its parameters, purpose and gates, plus deadlines, the borrow nonce, the minimum health factor, events and errors.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "accounts", title: "Accounts and Positions" },
  { id: "entry-points", title: "Entry Points" },
  { id: "gates", title: "Gates per Function" },
  { id: "call-bounds", title: "Deadline, Nonce and Health Factor" },
  { id: "receiver-approvals", title: "Receiver Rule and Approvals" },
  { id: "views", title: "Views" },
  { id: "events", title: "Events" },
  { id: "errors", title: "Main Errors" },
  { id: "upgrades", title: "Upgrades and Limits" },
]

export default async function RouterContractPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "integrations/router-contract", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="AaveAdapter Entry Points"
          description="The AaveAdapter is the single entry point for every borrower action on every CDP Spoke of its chain. This page lists each function, what it checks and what it emits."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            One AaveAdapter runs per chain behind one fixed address. Calls go from the wallet to the AaveAdapter, then to the wallet&apos;s PositionProxy for that market, then to the CDP Spoke. The Adapter creates proxies through the immutable ProxyManager, has Collateralization take custody and record backing, is the only minter and burner of every vault token, runs the RiskModule&apos;s checks and returns their errors unchanged.
          </p>
          <p className="mb-4 type-doc-body">
            Every entry point takes the protocol Lock first and releases it last, so no Avana call can re-enter another. The Adapter holds no token at the end of any call and charges no fee on borrowing or interest.
          </p>
          <div className="doc-topic type-doc-body">
            Repay, debt-free withdrawal and removal, repay-all-and-withdraw, zero-credit release and fee collection read no MarketRegistry state, pause state, address freeze, breaker or price. A borrower can always exit, whatever the protocol state.
          </div>
        </section>

        <section id="accounts" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Accounts and Positions</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>An account is one PositionProxy bound to one wallet, CDP Spoke and market. Its address is a CREATE2 address known before deployment; the first pledge to a market deploys it.</li>
            <li>Each account has its own Aave health factor. Nothing is cross-collateralized between markets of the same wallet.</li>
            <li>An account holds at most 16 records (pledged positions) per market, so one liquidation always fits in a block.</li>
            <li>Positions are named by a <code className="type-doc-inline-code">PositionRef</code> made of the AMM integration identifier and the integration&apos;s position key, never by a bare NFT token ID. Token amount arrays follow the market&apos;s token order.</li>
          </ul>
        </section>

        <section id="entry-points" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Entry Points</h2>
          <p className="mb-4 type-doc-body">The borrower functions are split across two interfaces, IAaveAdapterUser and IAaveAdapterCollateral.</p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Function</th><th className="text-left px-4 py-2 type-doc-subsection-title">Parameters</th><th className="text-left px-4 py-2 type-doc-subsection-title">Purpose</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">pledge</code></td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">marketId, position, deadline</code></td>
                  <td className="px-4 py-2">Pledges one AMM position into a market. Creates the wallet&apos;s proxy on its first pledge, takes custody through the market&apos;s LPVault, mints vault tokens equal to the credited units, supplies them to the CDP Spoke and enables them as collateral. Returns the proxy, the record ID and the credited units.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">recredit</code></td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">marketId, position, topUp, deadline</code></td>
                  <td className="px-4 py-2">Credits units added to a pledged position. For an NFT position the depositor first adds liquidity on the AMM and passes empty bytes; for fungible LP shares the bytes encode the amount. Depositor of record only.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">borrow</code></td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">marketId, debtReserveId, amount, receiver, deadline, minHealthFactor, expectedNonce</code></td>
                  <td className="px-4 py-2">Borrows an approved debt asset on the caller&apos;s account for the market and sends it to the receiver. There is no minimum borrow beyond a non-zero amount and no minimum debt.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">repay</code></td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">borrower, marketId, debtReserveId, maxRepaySpend, repayAll, deadline</code></td>
                  <td className="px-4 py-2">Repays one debt reserve of any borrower&apos;s account with the caller&apos;s funds. A partial repay pulls the smaller of the cap and the debt. A repay-all pulls the full cap, repays the live debt and refunds the rest in the same call, or reverts if debt would remain.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">withdraw</code></td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">marketId, position, units, deadline, minHealthFactor</code></td>
                  <td className="px-4 py-2">Withdraws one record&apos;s credited units, burns them and returns the whole position, with its uncollected fees, to its depositor of record. With debt, the health check runs after the withdrawal.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">repayAllAndWithdraw</code></td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">marketId, position, units, debtReserveIds, maxRepaySpends, deadline</code></td>
                  <td className="px-4 py-2">Repays each named debt reserve in full under its own cap, requires every debt reserve of the account to be at zero, then makes a debt-free withdrawal of one record, in one call.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">removeLiquidity</code></td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">marketId, position, units, minAmounts, deadline, minHealthFactor</code></td>
                  <td className="px-4 py-2">Removes part of one record&apos;s credited units while the position stays in custody. The removed principal is paid to the depositor of record, each token at least its minimum. With debt, the remaining record must still be worth the market&apos;s minimum pledge value.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">repayWithCollateral</code></td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">RepayWithCollateralParams p</code></td>
                  <td className="px-4 py-2">Repays one debt reserve with units released from one record, through LPVaultSwap, with no bonus and no Avana fee. LPVaultSwap flash-borrows the debt asset, repays, unwinds and swaps the units; any leftover is paid to the caller in the debt asset. While debt remains, the health factor must not fall.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">collectFees</code></td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">marketId, position, deadline</code></td>
                  <td className="px-4 py-2">Collects the fees a custodied position has earned and pays them to the depositor of record. Principal, units and health factor are unchanged. Reverts for AMM protocols whose fees roll into the position.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">releaseZeroCredit</code></td>
                  <td className="px-4 py-2"><code className="type-doc-inline-code">marketId, position, deadline</code></td>
                  <td className="px-4 py-2">Returns the position of a record whose credit a seizure took to zero. Mints, burns and supplies nothing. Depositor of record only.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="mb-2 mt-6 type-doc-subsection-title">RepayWithCollateralParams</h3>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Field</th><th className="text-left px-4 py-2 type-doc-subsection-title">Meaning</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">marketId</code></td><td className="px-4 py-2">The account&apos;s market</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">position</code></td><td className="px-4 py-2">The record whose units repay</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">units</code></td><td className="px-4 py-2">Credited units released from the record</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">debtReserveId</code></td><td className="px-4 py-2">The debt reserve repaid</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">minAmounts</code></td><td className="px-4 py-2">Least raw amount of each pool token the unwind must return</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">minDebtRepaid</code></td><td className="px-4 py-2">Smallest repayment accepted, in debt-asset base units</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">deadline</code></td><td className="px-4 py-2">Last valid block timestamp</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">minHealthFactor</code></td><td className="px-4 py-2">Least health factor after the call while debt remains, WAD</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">Every swap leg also carries an oracle-derived minimum output, so the caller&apos;s minimums can only tighten it.</p>
        </section>

        <section id="gates" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Gates per Function</h2>
          <p className="mb-4 type-doc-body">
            The Adapter enforces the deadline, the nonce, the receiver rule, proxy resolution, debt-reserve enablement, the Hub&apos;s pause state and the address freeze. The RiskModule enforces the sequencer gate, price states and ages, Aave pauses and freezes, offboarding, configuration drift, Hub share accounting, liquidation halts, circuit breakers and the health factor.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Function</th><th className="text-left px-4 py-2 type-doc-subsection-title">Pause state of the Hub</th><th className="text-left px-4 py-2 type-doc-subsection-title">Other checks</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">pledge</code></td><td className="px-4 py-2">Refused under Paused with reason MintPathSuspect; rescue top-ups only under Paused with reason General or for a frozen caller; refused under Frozen for an account with no debt</td><td className="px-4 py-2">Registered market on an approved Spoke, matching integration, exact position shape, price state, caps, minimum pledge value ($10), breakers, 16-record limit</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">recredit</code></td><td className="px-4 py-2">Same as a pledge</td><td className="px-4 py-2">Top-up checks and a new cap charge</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">borrow</code></td><td className="px-4 py-2">Refused unless the market&apos;s Hub and the debt reserve&apos;s funding Hub are both in state None</td><td className="px-4 py-2">Receiver rule, address freeze of caller and receiver, nonce, every price and breaker gate over the market and every debt reserve of the account, health factor after the borrow</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">repay</code></td><td className="px-4 py-2">Never read</td><td className="px-4 py-2">None beyond the deadline and an existing proxy</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">withdraw</code> without debt</td><td className="px-4 py-2">Never read</td><td className="px-4 py-2">None; no price is read</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">withdraw</code> with debt</td><td className="px-4 py-2">Refused if the Hub is Paused</td><td className="px-4 py-2">Address freeze, the RiskModule&apos;s withdraw checks, health factor after the withdrawal</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">repayAllAndWithdraw</code></td><td className="px-4 py-2">Never read</td><td className="px-4 py-2">Every debt reserve must end at zero</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">removeLiquidity</code></td><td className="px-4 py-2">Without debt never read; with debt refused if Paused</td><td className="px-4 py-2">With debt: address freeze, withdraw checks, remaining record at least the minimum pledge value, health factor</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">repayWithCollateral</code></td><td className="px-4 py-2">Refused only under Paused with reason MintPathSuspect; open under Frozen and Paused with reason General</td><td className="px-4 py-2">Address freeze, enabled debt reserve, non-zero debt, health factor not lower than before; reads no breaker</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">collectFees</code></td><td className="px-4 py-2">Never read</td><td className="px-4 py-2">Depositor of record only</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">releaseZeroCredit</code></td><td className="px-4 py-2">Never read</td><td className="px-4 py-2">Depositor of record only; record at zero credited units</td></tr>
              </tbody>
            </table>
          </div>
          <p className="type-doc-body">
            The price-state rules behind each gate are on the price states page:{" "}
            <Link href="/developers/integrations/price-states" className="text-type-accent hover:underline">Price States</Link>.
          </p>
        </section>

        <section id="call-bounds" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Deadline, Nonce and Health Factor</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Deadline: every entry point reverts with <code className="type-doc-inline-code">DeadlineExpired</code> when the block timestamp is past the deadline, so a transaction held back by a builder or a congested chain cannot execute later on different terms.</li>
            <li>Nonce: each borrow names the proxy&apos;s current borrow nonce in <code className="type-doc-inline-code">expectedNonce</code>, read from <code className="type-doc-inline-code">borrowNonce(proxy)</code>. The Adapter consumes it and increments it; a mismatch reverts with <code className="type-doc-inline-code">BadNonce</code>, so a signed borrow cannot be replayed or reordered. A reverted borrow leaves the nonce unchanged.</li>
            <li>Minimum health factor: borrow, withdraw, partial removal and repay with collateral take a <code className="type-doc-inline-code">minHealthFactor</code> in WAD. After a borrow or a withdrawal with debt, the health factor excluding rescue units must be at least the larger of 1.00, the market&apos;s optional hard floor (off by default) and this value. Pass 0 for no extra bound.</li>
            <li>The Lens recommends borrowing to a health factor of 1.10. No contract enforces that value; a caller who passes 1.10 as the minimum gets it enforced.</li>
          </ul>
        </section>

        <section id="receiver-approvals" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Receiver Rule and Approvals</h2>
          <p className="mb-4 type-doc-body">
            A borrow&apos;s receiver cannot be the zero address, any registered proxy, the Adapter, Collateralization, any LPVault, LPVaultSwap, the payout escrow, the flash source, any Avana Hub, any approved CDP Spoke or any Spoke listed on the borrowed asset&apos;s funding Hub. A refused receiver reverts with <code className="type-doc-inline-code">InvalidReceiver</code> before any proxy call.
          </p>
          <p className="mb-4 type-doc-body">Users grant only two kinds of approval:</p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>For a pledge, an approval of exactly one position to the immutable LPVault of that AMM protocol: a per-token ERC-721 approval or permit for Uniswap v3 and Slipstream. Never an operator approval for all tokens.</li>
            <li>For a repay, an approval to the AaveAdapter of exactly the repay amount in the debt asset. For a repay-all, the amount is the Lens repay-all quote; the Adapter pulls it in full and refunds the unused part in the same call, leaving zero allowance.</li>
          </ul>
        </section>

        <section id="views" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Views</h2>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">View</th><th className="text-left px-4 py-2 type-doc-subsection-title">Returns</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">proxyOf</code></td><td className="px-4 py-2">The wallet&apos;s proxy for a market, or zero</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">walletOf</code></td><td className="px-4 py-2">The wallet bound to a proxy</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">accountOf</code></td><td className="px-4 py-2">The binding stored at proxy creation: wallet, Spoke, market, vault token and reserve</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">predictProxy</code></td><td className="px-4 py-2">The CREATE2 address of a wallet and market&apos;s proxy, deployed or not</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">borrowNonce</code></td><td className="px-4 py-2">The next expected borrow nonce of a proxy</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="events" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Events</h2>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Event</th><th className="text-left px-4 py-2 type-doc-subsection-title">Emitted when</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">UserProxyCreated</code></td><td className="px-4 py-2">A wallet&apos;s proxy for a market is created and bound</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">CollateralAdded</code></td><td className="px-4 py-2">A position is pledged, credited, minted and supplied</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">CollateralSupplied</code></td><td className="px-4 py-2">Vault-token units are supplied to the Spoke for a proxy</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">CollateralRecredited</code></td><td className="px-4 py-2">Units added to a pledged position are credited</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">Borrowed</code></td><td className="px-4 py-2">A debt asset is borrowed; carries the receiver, amount, nonce and health factor after</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">Repaid</code></td><td className="px-4 py-2">A payer repays one debt reserve of a borrower&apos;s account; carries the amount spent and the debt after</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">CollateralWithdrawn</code></td><td className="px-4 py-2">A record is withdrawn and its position returned</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">CollateralReduced</code></td><td className="px-4 py-2">Part of a record is removed and its principal paid to the depositor</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">RepaidWithCollateral</code></td><td className="px-4 py-2">A debt reserve is repaid with released units; carries health factors before and after</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">CollateralDisabled</code></td><td className="px-4 py-2">The vault-token reserve is disabled as collateral for a proxy whose supply reached zero</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">SeizedUnitsBurned</code></td><td className="px-4 py-2">LPVaultSwap has the Adapter burn seized units during a liquidation</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="errors" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Main Errors</h2>
          <div className="overflow-x-auto mb-4">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Error</th><th className="text-left px-4 py-2 type-doc-subsection-title">Meaning</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">DeadlineExpired</code></td><td className="px-4 py-2">The block timestamp is past the deadline</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">BadNonce</code></td><td className="px-4 py-2">The expected nonce differs from the proxy&apos;s borrow nonce</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">ApplicationFrozen</code></td><td className="px-4 py-2">New activity refused while the Hub is Frozen</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">ApplicationPaused</code></td><td className="px-4 py-2">New activity refused while the Hub is Paused</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">AddressIsFrozen</code></td><td className="px-4 py-2">A frozen address tried new activity</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">NoProxy</code></td><td className="px-4 py-2">The wallet has no proxy for the market</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">UnknownMarket</code></td><td className="px-4 py-2">The market is not registered on an approved CDP Spoke</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">UnknownSpoke</code></td><td className="px-4 py-2">The market&apos;s CDP Spoke is not approved</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">UnknownDebtReserve</code></td><td className="px-4 py-2">The debt reserve is not enabled on the account&apos;s CDP Spoke</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">IntegrationMismatch</code></td><td className="px-4 py-2">The position belongs to another AMM integration</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">InvalidReceiver</code></td><td className="px-4 py-2">The borrow receiver is refused by the receiver rule</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">ZeroAmount</code></td><td className="px-4 py-2">An amount or units argument is zero</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">RepayExceedsMax</code></td><td className="px-4 py-2">A repay-all found debt above the cap; nothing moved</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">DebtRemaining</code></td><td className="px-4 py-2">Debt remains after a repay-all or before the withdrawal of repay-all-and-withdraw</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">NothingToRepay</code></td><td className="px-4 py-2">Repay with collateral named a reserve with no debt</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">HealthFactorNotImproved</code></td><td className="px-4 py-2">Repay with collateral would leave a lower health factor</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">UnitsMismatch</code></td><td className="px-4 py-2">A verified amount differs from the expected one</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">BackingMismatch</code></td><td className="px-4 py-2">Vault-token supply no longer matches recorded backing after the call</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">SupplyIncomplete</code></td><td className="px-4 py-2">Supplied shares did not rise by exactly the credited units</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">LengthMismatch</code></td><td className="px-4 py-2">Array arguments differ in length from each other or from the market&apos;s token count</td></tr>
              </tbody>
            </table>
          </div>
          <p className="type-doc-body">
            Errors raised by the RiskModule, Collateralization, the LPVault and Aave pass through unchanged, for example <code className="type-doc-inline-code">PriceNotLive</code>, <code className="type-doc-inline-code">HealthFactorTooLow</code>, <code className="type-doc-inline-code">BelowMinPledge</code>, <code className="type-doc-inline-code">TooManyRecords</code>, <code className="type-doc-inline-code">BreakerTripped</code>, <code className="type-doc-inline-code">SequencerDown</code>.
          </p>
        </section>

        <section id="upgrades" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Upgrades and Limits</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>The AaveAdapter is a UUPS proxy. Its admin roles can be held only by the chain&apos;s Avana timelock; every upgrade waits the normal delay of 5 days and can be cancelled by the governance multisig, the Emergency Guardian, the Aave Protocol Guardian or the Aave governance executor. It has no setters: every address change is an upgrade.</li>
            <li>PositionProxies and the ProxyManager are immutable and carry no logic, so an Adapter upgrade changes account behaviour without touching any proxy.</li>
            <li>What a faulty Adapter could do is bounded by the Aave DAO&apos;s Hub add caps and Spoke draw caps, by exact approvals, and by the delay: a borrower who sees a harmful upgrade queued can repay and withdraw before it executes, because those paths read no gate.</li>
            <li>Liquidation does not go through these entry points. LPVaultSwap runs it and asks the Adapter only to burn seized units.</li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Every AaveAdapter borrower function, its gates, call bounds, events and errors."
        sectionColor="cyan"
      />
    </div>
  ))
}
