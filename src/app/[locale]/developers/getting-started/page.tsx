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
    description: "How to deposit a supported LP position into Avana and start building borrowing capacity.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "deposit-flow", title: "Deposit Flow" },
  { id: "technical-details", title: "Technical Details" },
  { id: "supported-lp-tokens", title: "Supported LP Position Types" },
  { id: "after-deposit", title: "After Deposit" },
]

const supportedFamilies = [
  {
    family: "Concentrated liquidity positions",
    examples: "Range-bound NFT or position-manager based LPs",
    notes: "Range, tick position, and fee accrual are part of the valuation path.",
  },
  {
    family: "Fungible stable or correlated LPs",
    examples: "Stable-swap and tightly correlated pool shares",
    notes: "Pool inventory and unwind quality drive conservative borrowing power.",
  },
  {
    family: "Weighted and multi-asset LPs",
    examples: "Weighted baskets and multi-token pools",
    notes: "Each supported family is admitted only through approved pool templates.",
  },
]

export default async function DepositLPPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "getting-started", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Deposit LP"
          description="Deposit a supported LP position into Avana to use it as collateral while it keeps earning fees in the pool."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            To borrow against LP collateral on Avana, start by depositing a supported position into
            the app. Pick an approved pool, connect your wallet, and submit the deposit for the LP
            you already hold on a supported DEX.
          </p>
          <p className="type-doc-body">
            Avana records the position, values it, and adds it to your borrowing capacity in the
            relevant Borrow Spoke. Your liquidity stays in the pool and keeps accruing fees. Deposit
            does not borrow for you — it sets up the collateral you can borrow against next.
          </p>
        </section>

        <section id="deposit-flow" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Deposit Flow</h2>
          <div className="space-y-5">
            <div>
              <h3 className="mb-2 type-doc-subsection-title">1. Choose a supported pool</h3>
              <p className="type-doc-body">
                Open the Avana interface and select an LP market that is live on your deployment.
                Only approved pools can be deposited. See{" "}
                <Link href="/developers/integrations/allowed-pools" className="text-[#01AACF] hover:underline">
                  Allowed LP Pools
                </Link>{" "}
                for how pool support is defined.
              </p>
            </div>
            <div>
              <h3 className="mb-2 type-doc-subsection-title">2. Approve and deposit your LP</h3>
              <p className="type-doc-body">
                Approve the LP token or position NFT if needed, then confirm the deposit. Avana
                routes the position into the Borrow Spoke for that market.
              </p>
            </div>
            <div>
              <h3 className="mb-2 type-doc-subsection-title">3. Wait for valuation</h3>
              <p className="type-doc-body">
                The spoke checks that the pool is approved, reconstructs the position, and applies
                collateral factors to calculate how much borrowing capacity the deposit adds.
              </p>
            </div>
            <div>
              <h3 className="mb-2 type-doc-subsection-title">4. Borrow when ready</h3>
              <p className="type-doc-body">
                Once the deposit clears, your borrowing capacity updates in the interface. You can
                move on to{" "}
                <Link href="/developers/getting-started/borrow-assets" className="text-[#01AACF] hover:underline">
                  Borrow Assets
                </Link>{" "}
                when you want to draw liquidity from the Hub.
              </p>
            </div>
          </div>
        </section>

        <section id="technical-details" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Technical Details</h2>
          <div className="space-y-4 type-doc-body">
            <p>
              <strong className="text-gray-900">Borrowing power updates with the market.</strong>{" "}
              Your capacity is recalculated from the live LP position as prices, fees, and pool state
              change — not locked at the deposit-time mark.
            </p>
            <p>
              <strong className="text-gray-900">LP formats differ by DEX.</strong>{" "}
              Some pools issue fungible LP tokens; concentrated-liquidity DEXs use position NFTs or
              position-manager shares. Avana handles both through the same spoke custody model.
            </p>
            <p>
              <strong className="text-gray-900">No unwind on deposit.</strong>{" "}
              You are not removing liquidity from the pool when you deposit. The position stays
              active in the AMM.
            </p>
          </div>
        </section>

        <section id="supported-lp-tokens" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Supported LP Position Types</h2>
          <div className="overflow-x-auto">
            <table className="w-full overflow-hidden rounded-lg border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left type-doc-subsection-title">Family</th>
                  <th className="px-4 py-2 text-left type-doc-subsection-title">Examples</th>
                  <th className="px-4 py-2 text-left type-doc-subsection-title">Admission Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {supportedFamilies.map((item) => (
                  <tr key={item.family}>
                    <td className="px-4 py-2 font-medium text-gray-900">{item.family}</td>
                    <td className="px-4 py-2">{item.examples}</td>
                    <td className="px-4 py-2">{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="after-deposit" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">After Deposit</h2>
          <ul className="space-y-2 type-doc-body">
            <li>Your LP keeps earning trading fees in the underlying pool</li>
            <li>Borrowing capacity appears in the interface for that Borrow Spoke</li>
            <li>You can deposit more approved positions in the same market to add capacity</li>
            <li>
              Next step:{" "}
              <Link href="/developers/getting-started/borrow-assets" className="text-[#01AACF] hover:underline">
                Borrow Assets
              </Link>
            </li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How to deposit a supported LP position and start building borrowing capacity on Avana."
        sectionColor="emerald"
      />
    </div>
  ))
}
