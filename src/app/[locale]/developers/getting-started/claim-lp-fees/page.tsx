import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'getting-started/claim-lp-fees', {
    title: "LP Fees",
    description: "How the depositor of a pledged Uniswap v3 or Aerodrome Slipstream position collects its trading fees at any time through Avana, why fees are never collateral and never seized, and a worked example.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "collect-call", title: "The Collect Call" },
  { id: "always-open", title: "Always Open" },
  { id: "fees-and-collateral", title: "Fees and Collateral" },
  { id: "rolled-in-fees", title: "Rolled-In Fees" },
  { id: "events", title: "Events" },
  { id: "failures", title: "Failures" },
  { id: "worked-example", title: "Worked Example" },
]

const availabilityRows = [
  ["Hub state None, Frozen, or Paused with reason General or MintPathSuspect", "Allowed"],
  ["Any circuit breaker tripped on the market or a debt reserve", "Allowed"],
  ["Depositor address-frozen", "Allowed"],
  ["Base sequencer Down (forced in through L1) or in Grace", "Allowed"],
  ["Every price state, including stale feeds and grace windows", "Allowed"],
  ["Market Offboarding, Closed or not active; liquidation halted; configuration drift", "Allowed"],
  ["Any Aave reserve paused or frozen, the Spoke halted, the credit line exhausted", "Allowed"],
  ["Any health factor, including below 1.00 and during a liquidation in another transaction", "Allowed"],
  ["Record at 0 credited units, or reduced by a partial removal or repay with collateral", "Allowed"],
  ["Pool token with a transfer fee switched on after listing", "Allowed; the depositor receives the amounts less the token's fee"],
  ["Pool broken, a pool token paused, or the depositor blocklisted by a pool token", "Refused by the pool or token; fees stay owed and leave with the position"],
  ["An AaveAdapter implementation that reverts on collectFees", "Refused until the Timelock replaces it; fees stay owed and nothing is lost"],
]

const failureRows = [
  ["NotDepositor", "The caller is not the depositor of record of the position."],
  ["NotInCustody / UnknownMarket / InvalidVaultToken", "The position is not in LPVault custody for an open record of the market."],
  ["IntegrationMismatch", "The position reference names another AMM integration than the market's."],
  ["FeesRolledIn", "The market's AMM protocol rolls fees into the position, so there is nothing separate to collect."],
  ["DeadlineExpired / LockHeld", "Call bounds."],
  ["Pool or token error", "The pool is broken or inside its own callback, or a token transfer to the depositor reverts. Fees stay owed to the position."],
]

export default async function ClaimLPFeesPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "getting-started/claim-lp-fees", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="LP Fees"
          description="A pledged position keeps earning trading fees for its depositor. The depositor collects them at any time; they are never collateral and never seized."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            While the LPVault holds a pledged position, its liquidity stays in the pool and earns trading fees. Uniswap v3 and Aerodrome Slipstream keep fees apart from the position&apos;s liquidity, as amounts owed per token. The depositor of record collects them through the AaveAdapter, and the pool pays them straight to the depositor&apos;s wallet.
          </p>
          <p className="mb-4 type-doc-body">
            The call goes wallet → AaveAdapter → Collateralization → LPVault → position manager. It never changes the position&apos;s liquidity, the vault-token supply, the record&apos;s credited units, the account&apos;s debt or its health factor. The PositionProxy is not involved: fees never pass through the Aave account.
          </p>
        </section>

        <section id="collect-call" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">The Collect Call</h2>
          <div className="type-doc-code-block mb-4">
            <code className="type-doc-body text-gray-900">
              {"collectFees(uint256 marketId, PositionRef position, uint256 deadline) returns (uint256[] fees)"}
            </code>
          </div>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Only the depositor of record can call it. No role is required.</li>
            <li>There is no recipient argument: fees always go to the depositor of record, so neither a caller nor a faulty Adapter can redirect them.</li>
            <li>It returns one amount per pool token, in the market&apos;s token order; any amount may be 0.</li>
            <li>For Uniswap v3 and Slipstream the LPVault calls the position manager&apos;s collect with the depositor as recipient and the maximum amount of each token. The pool updates the position&apos;s fees first, then pays every owed amount; nothing stays in the LPVault.</li>
            <li>An unstaked Slipstream position&apos;s fees are already net of the pool&apos;s unstaked-fee share, which the pool sends to the gauge. Avana adds and deducts nothing.</li>
          </ul>
          <p className="mt-4 type-doc-body">
            The app can simulate the call to show the amounts before the depositor signs.
          </p>
        </section>

        <section id="always-open" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Always Open</h2>
          <p className="mb-4 type-doc-body">
            The fee path reads no pause state or reason, circuit breaker, address freeze, price state, sequencer gate, RiskModule, MarketRegistry, ParameterStore, LPOracle, PositionProxy or Aave state. None of them can hold a depositor&apos;s fees. Collection is available from the end of the pledge until the position is returned, including while the record has 0 credited units after a full seizure.
          </p>
          <p className="mb-4 type-doc-body">
            During a Base sequencer outage, the depositor can submit collectFees through the OP Stack L1 forced-inclusion path; it executes when included, because the fee path reads no sequencer gate.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">State</th>
                  <th className="text-left px-4 py-2 type-doc-subsection-title">Collect fees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {availabilityRows.map((row) => (
                  <tr key={row[0]}>
                    <td className="px-4 py-2">{row[0]}</td>
                    <td className="px-4 py-2">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="fees-and-collateral" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Fees and Collateral</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Fees are not collateral. The LPOracle values a position&apos;s liquidity units only and never counts amounts owed to it, so collecting fees cannot move the health factor.</li>
            <li>Fees are never seized. A liquidation, a reconcile on exit, a partial removal or a repay with collateral removes exactly its own units and pays out only the principal that removal returned. A collection cannot run between a removal and its payout, because both run under the same protocol lock.</li>
            <li>Principal owed at pledge stays the depositor&apos;s. If a position is pledged with amounts already owed to it (uncollected fees, or principal removed earlier without a collect), those amounts are not credited, and collectFees pays them to the depositor with later fees.</li>
            <li>Fees owed when a position is returned travel with the NFT; the depositor then collects them directly from the AMM protocol.</li>
          </ul>
        </section>

        <section id="rolled-in-fees" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Rolled-In Fees</h2>
          <p className="mb-4 type-doc-body">
            Some AMM protocols compound fees into the position instead of keeping them apart. For a market on such a protocol, collectFees reverts with FeesRolledIn before any state changes. The fees stay in the position: its unit count is unchanged, each unit is worth more, the LPOracle&apos;s composition values that, and the depositor receives the fees with the units on withdrawal. Both AMM protocols listed at launch, Uniswap v3 and Aerodrome Slipstream, keep fees separate.
          </p>
        </section>

        <section id="events" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Events</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Pool Burn with zero liquidity (only when the position has liquidity), then pool Collect.</li>
            <li>A token Transfer from the pool to the depositor for each non-zero amount.</li>
            <li>Position manager Collect.</li>
            <li>
              <code className="type-doc-inline-code">FeesCollected(positionKey, depositor, amounts)</code>
            </li>
          </ul>
        </section>

        <section id="failures" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Failures</h2>
          <p className="mb-4 type-doc-body">
            Every failure reverts the whole transaction, and the fees stay owed to the position.
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

        <section id="worked-example" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Worked Example</h2>
          <div className="doc-topic type-doc-body mb-4">
            Example values; each market&apos;s parameters are set at listing. Carol&apos;s first record in market 3 on Base is an unstaked Slipstream NFT with L = 10,000,000,000 (about $20,000), pledged 30 days ago. The amounts owed to it, net of the pool&apos;s unstaked-fee share, are 16.50 USDC and 15.95 USDT. Carol owes 5,024.657535 USDC on the account and its health factor is 1.2420. The Base sequencer has been down for 4 hours.
          </div>
          <ul className="list-disc space-y-2 ps-5 type-doc-body mb-4">
            <li>Carol&apos;s app simulates collectFees for the position and shows 16.50 USDC and 15.95 USDT to collect.</li>
            <li>Carol submits collectFees(3, (I, key1), now + 600) through the L1 forced-inclusion path. When it is included, the Adapter takes the lock and checks the deadline; it reads no pause state, breaker, freeze, oracle or sequencer gate.</li>
            <li>Collateralization checks that the record is open, the NFT is in custody and Carol is its depositor of record.</li>
            <li>The LPVault calls the Slipstream position manager&apos;s collect with Carol as recipient, and the pool pays 16.50 USDC and 15.95 USDT to her.</li>
            <li>The NFT&apos;s liquidity, the record&apos;s 10,000,000,000 credited units, the vault-token supply, the cap counters, her debt and her health factor of 1.2420 are unchanged.</li>
            <li>Event FeesCollected(key1, Carol, [16,500,000, 15,950,000]).</li>
          </ul>
          <p className="mb-4 type-doc-body">
            The $32.45 collected over 30 days on $20,000 is 32.45 / 20,000 × 365 / 30 ≈ 1.97% a year, and none of it was collateral. A borrow forced in through L1 during the same outage reverts with SequencerDown. The same collection succeeds while the Base Stable LP Hub is Paused with reason MintPathSuspect, while a breaker of market 3 is tripped and while Carol&apos;s address is frozen. A call from any wallet other than Carol reverts with NotDepositor.
          </p>
          <p className="type-doc-body">
            How a position comes into custody is described in <Link href="/developers/getting-started" className="text-type-accent hover:underline">Deposit LP</Link>.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How the depositor collects trading fees from a pledged position at any time, and why fees are never collateral."
        sectionColor="emerald"
      />
    </div>
  ))
}
