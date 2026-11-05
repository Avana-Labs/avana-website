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
    description: "How to pledge an approved Uniswap v2 LP token or Uniswap v3 position into Avana's LP Vault as collateral for borrowing GHO.",
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
    family: "Uniswap v2 LP tokens",
    examples: "Fungible LP tokens from selected Uniswap v2 pools on Ethereum mainnet",
    notes: "Avana mints one vault-token base unit per LP-token base unit. In a liquidation, these markets use partial settlement by default.",
  },
  {
    family: "Uniswap v3 positions",
    examples: "Full-range positions and specifically approved ranges in selected Uniswap v3 pools",
    notes: "The pool, fee tier, and range must be approved. Avana mints one vault-token base unit per unit of liquidity.",
  },
  {
    family: "Not supported",
    examples: "Uniswap v4, Curve, Balancer, Aerodrome, other AMMs, and other chains such as Base",
    notes: "Adding any of these requires a separate review and governance approval.",
  },
]

export default async function DepositLPPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "getting-started", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Deposit LP"
          description="Pledge an approved Uniswap v2 LP token or Uniswap v3 position to Avana's LP Vault and use it as collateral. Its liquidity stays in the pool."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>Pledging (depositing) an LP position is the first step before borrowing. The depositor approves the transfer of the LP token or position NFT, then deposits it into Avana&apos;s LP Vault through the AaveAdapter. A pledge changes custody but does not remove liquidity from the pool. The position stays in the AMM and keeps earning trading fees. A Uniswap v3 position earns no fees while it is out of range.</>{" "}<>The AaveAdapter then mints vault tokens 1:1 with the deposited liquidity. It supplies them to the market&apos;s Avana Borrow Spoke through the borrower&apos;s Position Proxy and enables them as collateral. A deposit does not create debt. Borrowing GHO is a separate transaction.</>
          </p>
        </section>

        <section id="deposit-flow" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Deposit Flow</h2>
          <div className="space-y-5">
            <div>
              <h3 className="mb-2 type-doc-subsection-title">1. Choose an approved market</h3>
              <p className="type-doc-body">
                Avana supports selected Uniswap v2 and Uniswap v3 markets on Ethereum mainnet.
                Markets are grouped into three categories: stable, correlated, and blue-chip/stable.
                During the pilot, only allowlisted depositors can pledge positions. See{" "}
                <Link href="/developers/integrations/allowed-pools" className="text-type-accent hover:underline">
                  Allowed LP Pools
                </Link>{" "}
                for the market categories.
              </p>
            </div>
            <div>
              <h3 className="mb-2 type-doc-subsection-title">2. Approve and pledge your LP</h3>
              <p className="type-doc-body">
                Approve the LP token or position NFT for transfer, then confirm the deposit. The
                AaveAdapter moves the position into the LP Vault. The LP Vault records the
                depositor, pool, token pair, fee tier, range, and vault-token market.
              </p>
            </div>
            <div>
              <h3 className="mb-2 type-doc-subsection-title">3. Eligibility checks</h3>
              <p className="type-doc-body">
                The Risk Module checks the pool, fee tier, range, oracle availability, and caps. It
                also applies the pilot allowlist, the per-market minimum and maximum position size,
                and the limit on positions per account. A position can be pledged only if it
                passes these checks.
              </p>
            </div>
            <div>
              <h3 className="mb-2 type-doc-subsection-title">4. Borrow when ready</h3>
              <p className="type-doc-body">
                Once the vault tokens are supplied and enabled as collateral, your borrowing
                capacity appears in the interface. To borrow GHO from the Avana Hub, continue
                to{" "}
                <Link href="/developers/getting-started/borrow-assets" className="text-type-accent hover:underline">
                  Borrow GHO
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section id="technical-details" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Technical Details</h2>
          <div className="space-y-4 type-doc-body">
            <p>
            <><strong className="text-gray-900">Borrowing capacity changes with prices.</strong>{" "}
              LPOracle values each vault token from the pool&apos;s liquidity math at Chainlink prices and uses the pool&apos;s TWAP as a consistency check. Capacity is that value multiplied by the reserve&apos;s Collateral Factor. The value at deposit therefore does not fix capacity for the life of the loan.</>{" "}<><strong className="text-gray-900">LP formats differ between Uniswap v2 and v3.</strong>{" "}
              Uniswap v2 pools issue fungible LP tokens. Uniswap v3 positions are NFTs. The LP
              Vault holds both, and vault tokens represent them on Aave. Each approved pool, and
              each range where applicable, has its own vault token.</>{" "}<><strong className="text-gray-900">No unwind on deposit.</strong>{" "}
              Pledging does not remove liquidity from the pool. The position stays active in the
              AMM.</>
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
            <li>Your liquidity keeps earning trading fees in the pool (a Uniswap v3 position earns none while out of range)</li>
            <li>Vault tokens are held by your Position Proxy and enabled as collateral in that market&apos;s Borrow Spoke</li>
            <li>You can pledge more approved positions, within the per-market and per-account limits</li>
            <li>
              Next step:{" "}
              <Link href="/developers/getting-started/borrow-assets" className="text-type-accent hover:underline">
                Borrow GHO
              </Link>
            </li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How to pledge an approved Uniswap v2 or v3 LP position and start building borrowing capacity on Avana."
        sectionColor="emerald"
      />
    </div>
  ))
}
