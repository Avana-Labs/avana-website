import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'architecture/lend-spoke', {
    title: "Lend Spoke",
    description: "The supply-only Aave V4 Spoke through which the Aave DAO treasury supplies each credit line to the Avana Hubs, and how draw caps divide each line.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "credit-lines", title: "Credit Lines" },
  { id: "line-sizes", title: "Line Sizes" },
  { id: "draw-caps", title: "Draw Caps" },
  { id: "funding-order", title: "Funding Order" },
  { id: "interest", title: "Interest" },
  { id: "recall", title: "Recall and Growth" },
  { id: "public-deposits", title: "Public Deposits" },
]

export default async function LendSpokePage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "architecture/lend-spoke", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Lend Spoke"
          description="A supply-only Aave V4 Spoke, owned by the Aave DAO, through which the DAO treasury supplies each credit line that Avana borrowers draw from."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            Each chain has one Lend Spoke. It is a standard Aave V4 Spoke owned by the Aave DAO, and it only supplies: its draw cap is 0 on every Hub asset. Its reserves point to Hub and asset pairs and can list any asset. The lender of each line, the GHO Reserve and Aave DAO for GHO, supplies the line amount through it directly, and the resulting position and its interest belong to that lender.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>GHO is the first credit line and the first borrowable asset on each chain.</li>
            <li>Only Avana CDP Spokes have draw caps on a credit-line asset. The other Spokes registered on it (the Lend Spoke, that asset&apos;s Coverage Spoke and the asset&apos;s fee receiver) have draw cap 0.</li>
            <li>No Avana contract or role has authority over any supply cap, draw cap, interest rate or Lend Spoke position. These are Aave DAO decisions.</li>
          </ul>
        </section>

        <section id="credit-lines" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Credit Lines</h2>
          <p className="mb-4 type-doc-body">
            A credit line is a draw cap per Hub, asset and CDP Spoke. The Lend Spoke&apos;s supply cap on a Hub and asset equals the line, and the draw caps of every CDP Spoke that draws that pair sum to at most the line.
          </p>
          <div className="type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"LendSpoke.addCap(hub, asset) = creditLine(hub, asset)"}</code>
          </div>
          <div className="mt-2 type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"Σ over CDP Spokes of drawCap(hub, asset, spoke) ≤ creditLine(hub, asset)"}</code>
          </div>
          <p className="mt-4 type-doc-body">
            With one CDP Spoke per chain and AMM protocol at launch, each Spoke&apos;s draw cap on a debt asset is that asset&apos;s whole line on the chain.
          </p>
        </section>

        <section id="line-sizes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Line Sizes</h2>
          <p className="mb-4 type-doc-body">
            Credit-line sizes come from Aave governance. Avana proposes values, and the funding ARFC, prepared with the Aave V4 risk service providers, sets the final ones.
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Chain</th><th className="text-left px-4 py-2 type-doc-subsection-title">Hub</th><th className="text-left px-4 py-2 type-doc-subsection-title">Launch GHO line</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Ethereum</td><td className="px-4 py-2">Avana Stable LP Hub</td><td className="px-4 py-2">2,000,000 GHO; final value set in the funding ARFC</td></tr>
                <tr><td className="px-4 py-2">Base</td><td className="px-4 py-2">Avana Stable LP Hub</td><td className="px-4 py-2">Set in the funding ARFC, within the GHO flash liquidity of the Base Aave V3 Pool and the depth of the Base swap routes</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            Other debt assets get their lines at their own listing, through the enable-debt-reserve operation, once the Aave DAO approves their credit line, caps, price source and swap routes.
          </p>
        </section>

        <section id="draw-caps" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Draw Caps</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Each debt reserve&apos;s draw cap is at most the flash liquidity of its asset in the chain&apos;s Aave V3 Pool and the depth of its swap routes, measured at listing, so every borrowed amount can be flash-borrowed through the flash liquidation helper and swapped back in one liquidation.</li>
            <li>The Hub admits a draw only if the Spoke&apos;s drawn debt, premium, uncovered deficit and the new amount fit under its draw cap. Accrued interest and recorded deficits use up capacity until they are repaid or covered.</li>
            <li>The sums are checked by Avana&apos;s MarketRegistry when a debt reserve is enabled and on every cap change, and by the drift check.</li>
            <li>Monitoring alerts when the debt drawn on a reserve, including interest and premium, reaches 90% of its draw cap. Only borrowing of that asset fails at the cap.</li>
          </ul>
          <div className="mt-4 doc-topic type-doc-body">
            {"Example values; each market's parameters are set at listing."}{" "}On Ethereum with a 2,000,000 GHO line, the Lend Spoke supply cap is 2,000,000 and the CDP Spoke &quot;Uniswap v3 Stable&quot; has a draw cap of 2,000,000. With 1,900,000 GHO drawn, 3,000 GHO of premium and a 475 GHO uncovered deficit, a 100,000 GHO borrow would bring the total to 2,003,475 and reverts. The largest borrow that passes is 96,525 GHO.
          </div>
        </section>

        <section id="funding-order" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Funding Order</h2>
          <p className="mb-4 type-doc-body">
            Before any CDP Spoke draw cap on a Hub and asset rises above 0, two things must be true:
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>The lender has filled the Lend Spoke supply cap with the full line, so no outside supply fits under the cap.</li>
            <li>The Coverage Spoke (Avana Umbrella) of that Hub and asset is funded by Avana Labs to at least its minimum, and its balance satisfies the coverage ratio.</li>
          </ul>
          <div className="mt-4 type-doc-code-block">
            <code className="type-doc-body text-gray-900">{"fundedBalance × 10⁴ ≥ coverageRatioBps × Σ drawCap"}</code>
          </div>
          <p className="mt-4 type-doc-body">
            The ratio and the minimum are set in the funding ARFC with Aave&apos;s service providers. As an illustrative guide only, a 20% ratio needs 400,000 GHO of funded reserve for a 2,000,000 GHO draw cap. The check runs when a debt reserve is enabled, on every recorded draw-cap raise and on every borrow.
          </p>
        </section>

        <section id="interest" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Interest</h2>
          <p className="mb-4 type-doc-body">
            All interest on a credit line accrues to its lender. For GHO that is the Aave DAO. Each debt asset&apos;s fee receiver is an Aave DAO treasury address and its liquidity fee is set by the DAO. Avana charges no fee on borrow interest on any asset, and no interest-fee parameter exists.
          </p>
          <p className="mb-4 type-doc-body">
            The GHO rate is flat: it does not depend on utilization. The Aave DAO sets the base rate at or above the Aave V4 Core Hub GHO base rate when each proposal executes, and each borrower pays its risk premium on top. Every other debt asset&apos;s rate strategy is set by the Aave DAO in the proposal that lists it. How the premium is set is explained in{" "}
            <Link href="/developers/architecture/collateral-factors" className="text-type-accent hover:underline">Collateral Factors</Link>.
          </p>
        </section>

        <section id="recall" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Recall and Growth</h2>
          <p className="mb-4 type-doc-body">
            To recall a line, the Aave DAO lowers the CDP Spoke draw caps on that Hub and asset to 0 and can change rates. The asset returns to Hub liquidity as borrowers repay or are liquidated, and the Lend Spoke can withdraw only unborrowed funds. There is no forced repayment, and repayment, withdrawal and liquidation stay open.
          </p>
          <p className="mb-4 type-doc-body">
            Raising a line takes an Aave DAO proposal on that chain that raises the Lend Spoke supply cap and the CDP Spoke draw caps together, keeping each draw cap within flash liquidity and route depth. Avana&apos;s timelock has no authority over any of them. The ARFC sets out these phases for GHO:
          </p>
          <div className="overflow-x-auto">
            <table className="type-doc-table">
              <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2 type-doc-subsection-title">Phase</th><th className="text-left px-4 py-2 type-doc-subsection-title">Capacity</th><th className="text-left px-4 py-2 type-doc-subsection-title">Conditions for expansion</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                <tr><td className="px-4 py-2">Launch</td><td className="px-4 py-2">2M GHO on Ethereum; Base line set in the funding ARFC</td><td className="px-4 py-2">Audit and launch requirements met, with oracle availability, borrowing activity and liquidation-route performance reported to governance</td></tr>
                <tr><td className="px-4 py-2">Initial target</td><td className="px-4 py-2">Up to 10M GHO</td><td className="px-4 py-2">Demonstrated borrowing demand, acceptable concentration and execution costs, and a recommendation from the risk reviewers</td></tr>
                <tr><td className="px-4 py-2">Expansion</td><td className="px-4 py-2">50M GHO or more</td><td className="px-4 py-2">Continued operation within approved limits, satisfactory risk reporting and further governance approval</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 type-doc-body">
            The funding proposal defines the measurement periods and thresholds for these conditions, the authority to adjust capacity, repayment terms and interest allocation. At every phase each chain&apos;s draw caps stay within its flash liquidity and the coverage ratio holds.
          </p>
        </section>

        <section id="public-deposits" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Public Deposits</h2>
          <p className="mb-4 type-doc-body">
            Public lender deposits are not offered at launch. Because the lender fills the supply cap with the whole line before borrowing opens, no outside supply fits under it. Public lending through the Lend Spoke is supported by the design and can be enabled later through Aave governance.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How the Aave DAO supplies each credit line through the supply-only Lend Spoke, how CDP Spoke draw caps divide it, and how lines are funded, recalled and grown."
        sectionColor="violet"
      />
    </div>
  ))
}
