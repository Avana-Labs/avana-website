import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'architecture/health-factor', {
    title: "Health Factor",
    description: "How Aave V4 measures the health factor of each Avana account, the borrow limits Avana applies on top, rescue top-ups, and worked numbers for borrowing, withdrawal and partial removal.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "calculation", title: "Calculation" },
  { id: "borrow-limits", title: "Borrow Limits" },
  { id: "worked-numbers", title: "Worked Numbers" },
  { id: "rescue", title: "Rescue Top-Ups" },
  { id: "account-limits", title: "Account Limits" },
  { id: "prices", title: "Prices and Health" },
  { id: "user-actions", title: "User Actions" },
]

export default async function HealthFactorPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "architecture/health-factor", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Health Factor"
          description="Aave V4 computes one health factor per account. In Avana an account is one PositionProxy holding one market, so each market a wallet uses has its own health factor."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            The health factor compares an account&apos;s collateral, weighted by its collateral factor, with its total debt over every debt reserve. Aave V4 computes it on the CDP Spoke with standard accounting. An account below 1.00 can be liquidated, partially, through LPVaultSwap.
          </p>
          <p className="mb-4 type-doc-body">
            Each wallet has one PositionProxy per CDP Spoke and market, and each proxy is a separate Aave account. A price failure, breaker or liquidation in one market never changes another market&apos;s account. A token price shared by two markets moves both by design; the per-Hub token caps bound that shared exposure.
          </p>
        </section>

        <section id="calculation" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Calculation</h2>
          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"healthFactor = (collateral value × CF) / Σ debt value of every debt reserve"}</code>
          </div>
          <ul className="mt-4 list-disc space-y-2 ps-5 type-doc-body">
            <li>Collateral value is the account&apos;s supplied vault tokens at the market&apos;s LPOracle price, with no haircut.</li>
            <li>Each debt reserve is valued at its own Aave price: GHO at Aave&apos;s fixed $1, any other debt asset through its DebtOracle. A rise in a debt asset&apos;s price lowers the health factor with no collateral move.</li>
            <li>Every rounding is against the account: the result is rounded down, and debt rounds up.</li>
            <li>With no debt the health factor is the maximum value. Debt-free means the account has zero debt on every debt reserve.</li>
          </ul>
        </section>

        <section id="borrow-limits" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrow Limits</h2>
          <p className="mb-4 type-doc-body">
            Aave&apos;s own rule is the only on-chain limit Avana relies on: Aave refuses any borrow or withdrawal that would leave the health factor below 1.00. Avana sets no opening health floor of its own. The borrower chooses its headroom with the minimum health factor it passes to each borrow, withdrawal with debt or partial removal with debt.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Limit</th><th className="text-left px-4 py-2 type-doc-subsection-title">Value</th><th className="text-left px-4 py-2 type-doc-subsection-title">Where</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Aave health-factor threshold</td><td className="px-4 py-2">1.00</td><td className="px-4 py-2">On-chain, in the CDP Spoke</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">minHealthFactor</code></td><td className="px-4 py-2">Chosen by the caller</td><td className="px-4 py-2">On-chain argument, checked by the RiskModule after the Spoke call</td></tr>
                <tr><td className="px-4 py-2"><code className="type-doc-inline-code">hardHealthFloor</code></td><td className="px-4 py-2">0 (off) on every launch market; bounds 1.00 – 1.25 when set</td><td className="px-4 py-2">Optional per-market floor, set only if stress tests justify it</td></tr>
                <tr><td className="px-4 py-2">Recommended borrow</td><td className="px-4 py-2">1.10</td><td className="px-4 py-2">Shown by the Lens next to the maximum at 1.00; never enforced</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 mb-4 type-doc-body">
            After a borrow or a withdrawal with debt, the RiskModule requires the health factor, with rescue units valued at zero, to be at least the largest of 1.00, the market&apos;s hard floor and the caller&apos;s minimum. Example: with $100,000 of collateral at a 70% collateral factor, the Lens shows $63,636 recommended ($70,000 / 1.10, rounded down) and $70,000 maximum.
          </p>
          <p className="mb-4 type-doc-body">
            A hard floor is raised or enabled at the short delay of 12 hours and lowered at the normal delay, by at most 0.03 per step; disabling it sets it to 0 in one step.
          </p>
        </section>

        <section id="worked-numbers" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Worked Numbers</h2>
          <p className="mb-4 type-doc-body">
            {"Example values; each market's parameters are set at listing."}{" "}Market 3 is a USDC/USDT Aerodrome Slipstream market on Base. One whole vault token is worth $2.00, CF_LP is 3,120 bps, USDC is priced at $0.9999, and there is no hard floor.
          </p>
          <h3 className="mb-2 type-doc-subsection-title">Borrow</h3>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Step</th><th className="text-left px-4 py-2 type-doc-subsection-title">Result</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Carol pledges $20,000 of collateral</td><td className="px-4 py-2">CF-weighted collateral $6,240</td></tr>
                <tr><td className="px-4 py-2">Lens borrow preview</td><td className="px-4 py-2">Recommended 5,673.29 USDC (HF 1.10); maximum 6,209.56 USDC (HF 1.00)</td></tr>
                <tr><td className="px-4 py-2">Carol borrows 5,000 USDC with a minimum health factor of 1.20</td><td className="px-4 py-2">6,240 / 4,999.50 = 1.2481; accepted</td></tr>
                <tr><td className="px-4 py-2">A borrow of 5,700 USDC instead</td><td className="px-4 py-2">HF 1.0948, below her 1.20; reverts with HealthFactorTooLow</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="mt-6 mb-2 type-doc-subsection-title">Withdraw</h3>
          <p className="mb-4 type-doc-body">
            Carol adds a second position of $5,000. Her account holds $25,000 of collateral, $7,800 CF-weighted, against 5,000 USDC of debt, a health factor of 1.5602.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Action</th><th className="text-left px-4 py-2 type-doc-subsection-title">Result</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Withdraw the $5,000 position with a minimum of 1.20</td><td className="px-4 py-2">HF 1.2481; the position and its fees return to Carol</td></tr>
                <tr><td className="px-4 py-2">Withdraw the $20,000 position instead</td><td className="px-4 py-2">HF would be 0.3120; Aave reverts with HealthFactorBelowThreshold</td></tr>
                <tr><td className="px-4 py-2">Repay all and withdraw in one call</td><td className="px-4 py-2">Debt-free exit; reads no pause state, breaker, freeze, price or sequencer gate</td></tr>
              </tbody>
            </table>
          </div>
          <h3 className="mt-6 mb-2 type-doc-subsection-title">Partial removal</h3>
          <p className="mb-4 type-doc-body">
            From the same two-position account (HF 1.5602), Carol removes 2,000 whole tokens (about 2,000 USDC and 2,000 USDT) from her first position and keeps it pledged. The record falls to 8,000,000,000 units, collateral falls to $21,000 and CF-weighted collateral to $6,552, so the health factor is 6,552 / 4,999.50 = 1.3105, above her 1.20 minimum. The remaining record must still be worth at least the $10 minimum pledge.
          </p>
        </section>

        <section id="rescue" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Rescue Top-Ups</h2>
          <p className="mb-4 type-doc-body">
            Adding collateral is a borrower&apos;s cheapest way out of liquidation, so containment never refuses it. A rescue top-up is a pledge into an account with debt whose health factor is below <code className="type-doc-inline-code">rescueHealthFactor</code>, which is fixed at 1.10. Its charge is capped at the amount that brings the account back to 1.10.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>It passes a Hub in the Frozen or Paused (General) state, a tripped circuit breaker, the pool-share cap and an address freeze. A Hub paused for a suspected mint-path exploit refuses it.</li>
            <li>It needs only $10 or the market minimum pledge, whichever is lower, and can use the market&apos;s reserved top-up slice (10% of the market cap) when the regular budget is full.</li>
            <li>The record cap still applies.</li>
            <li>The units it adds are rescue units. Aave counts them in full for health and liquidation, but Avana values them at zero when it checks a new borrow, a withdrawal with debt or a partial removal with debt, so they never support new debt.</li>
          </ul>
          <p className="mt-4 type-doc-body">
            Example: an account at health factor 1.2000 with $10,000 of debt holds $1,000 of rescue units at a 3,120 bps collateral factor. Excluding them removes $312 of CF-weighted collateral, so the health factor Avana checks for new debt is 1.1688.
          </p>
        </section>

        <section id="account-limits" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Account Limits</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>One collateral market per account: the proxy&apos;s market.</li>
            <li>At most 16 open records (positions) per account and market. A 17th pledge reverts with TooManyRecords; the borrower adds to an existing position with re-credit instead. The cap keeps a seizure of a whole account within one transaction: 16 records cost at most 5.15M gas, under 31% of the 16.78M per-transaction limit.</li>
            <li>The number of debt reserves per account is bounded by the CDP Spoke&apos;s per-account reserve limit, set by the Aave DAO.</li>
            <li>No minimum debt. Any borrow above 0 that passes the other checks is accepted. Avana&apos;s own keepers liquidate every account below 1.00 whatever its size and pay the gas.</li>
          </ul>
        </section>

        <section id="prices" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Prices and Health</h2>
          <p className="mb-4 type-doc-body">
            Aave values every reserve at the price its source serves. Under a failing price the oracles serve conservative prices, so the health factor can only move against the borrower, while nothing is ever seized or repaid at those prices.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Price state</th><th className="text-left px-4 py-2 type-doc-subsection-title">Collateral in Aave</th><th className="text-left px-4 py-2 type-doc-subsection-title">Non-GHO debt in Aave</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Live, routes agree</td><td className="px-4 py-2">Accepted price</td><td className="px-4 py-2">Accepted price</td></tr>
                <tr><td className="px-4 py-2">Routes disagree</td><td className="px-4 py-2">Built from the lower route answers</td><td className="px-4 py-2">Higher route answer</td></tr>
                <tr><td className="px-4 py-2">Cached (up to 1 hour)</td><td className="px-4 py-2">Last accepted price</td><td className="px-4 py-2">Last accepted price</td></tr>
                <tr><td className="px-4 py-2">Expired</td><td className="px-4 py-2">Worthless (the smallest price Aave accepts)</td><td className="px-4 py-2">Last accepted price raised by the asset&apos;s stress rise</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            Borrowing and withdrawals with debt need fresh, agreeing prices for the market and every debt reserve of the account. After an Expired price recovers, and for one hour after a Base sequencer restart, only accounts below health factor 0.95 can be liquidated, which gives borrowers time to act.
          </p>
        </section>

        <section id="user-actions" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">User Actions</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Borrowing more lowers the health factor.</li>
            <li>Repaying raises it immediately. Anyone can repay any account&apos;s debt, and no Avana pause, breaker, freeze or price state blocks repayment.</li>
            <li>Pledging another position, a rescue top-up or a re-credit of added liquidity raises it.</li>
            <li>Repaying with collateral repays debt from part of a pledged position in one flash-funded call, and the health factor after the call cannot be lower than before it.</li>
            <li>Withdrawing or removing liquidity with debt must leave the health factor at or above the caller&apos;s minimum and 1.00.</li>
          </ul>
          <p className="mt-4 type-doc-body">
            For how each market&apos;s collateral factor is set, see{" "}
            <Link href="/developers/architecture/collateral-factors" className="text-type-accent hover:underline">Collateral Factors</Link>.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How Aave V4 measures each Avana account's health factor, the limits Avana applies on top, rescue top-ups and worked numbers for borrow, withdrawal and partial removal."
        sectionColor="violet"
      />
    </div>
  ))
}
