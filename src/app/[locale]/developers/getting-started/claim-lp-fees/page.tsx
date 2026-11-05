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
    description: "How Avana handles trading fees on a pledged LP position.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "how-it-works", title: "How It Works" },
  { id: "health-checks", title: "Health Checks" },
  { id: "fee-accounting", title: "Fee Accounting" },
  { id: "key-benefits", title: "Key Benefits" },
]

export default async function ClaimLPFeesPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "getting-started/claim-lp-fees", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="LP Fees"
          description="A pledged position keeps earning trading fees in the pool. Uncollected fees are released with the position when you withdraw it."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>A pledge changes custody of the LP position but does not remove its liquidity from the pool. The position keeps earning trading fees while the LP Vault holds it. A Uniswap v3 position earns no fees while it is out of range.</>{" "}<>Fees keep accruing while a position is pledged. Uncollected fees stay with the position
            and are released with the LP tokens or NFT when you withdraw.</>{" "}<>{"Fee income does not reduce outstanding GHO debt. Interest on the loan keeps accruing until it is repaid."}</>
          </p>
        </section>

        <section id="how-it-works" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">How It Works</h2>
          <div className="space-y-4 type-doc-body">
            <p>
            <>On withdrawal, the AaveAdapter burns the matching vault tokens. The LP Vault then releases the LP tokens or NFT, with uncollected fees, to the depositor.</>{" "}<>Avana&apos;s AMMSettlementAdapters can redeem LP tokens, remove liquidity, and collect
              fees. They are used for settlement and approved exits. They are not a fee-claim
              action for borrowers.</>{" "}<>A withdrawal is allowed only if the account stays healthy afterward. See Withdraw
              Collateral for the full process.</>
          </p>
          </div>
        </section>

        <section id="health-checks" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Health Checks</h2>
          <p className="mb-4 type-doc-body">
            <>Fees are released only with the position. Collecting them therefore depends on the
            same health check as a withdrawal: the account must stay healthy after the vault
            tokens are burned.</>{" "}<>Withdrawals are also blocked when the pool&apos;s TWAP is outside tolerance or the
            Chainlink feed is stale. If withdrawing the position leaves the account unhealthy,
            repay GHO first. Repayment continues in all of these cases.</>
          </p>
        </section>

        <section id="fee-accounting" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Fee Accounting</h2>
          <div className="space-y-4 type-doc-body">
            <p>
            <>LPOracle prices each vault token as q0·P0 + q1·P1. Here q0 and q1 are the token amounts from the position&apos;s liquidity (and range, for concentrated positions), and P0 and P1 are Chainlink prices. Whether uncollected Uniswap v3 fees count toward collateral value is not specified.</>{" "}<>In a liquidation, LPVaultSwap removes liquidity through the market&apos;s approved settlement route. How uncollected fees are treated in that process is not specified.</>
          </p>
          </div>
          <p className="mt-4 type-doc-body">
            Related pages:{" "}
            <Link href="/developers/integrations/price-oracles" className="text-type-accent hover:underline">
              Price Oracles
            </Link>,{" "}
            <Link href="/developers/liquidation" className="text-type-accent hover:underline">
              Liquidation Framework
            </Link>.
          </p>
        </section>

        <section id="key-benefits" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Key Benefits</h2>
          <p className="type-doc-body">
            <>Your liquidity stays in the pool and keeps earning fees while you borrow GHO.</>{" "}
            <>You can borrow without withdrawing from the pool, so you keep your fees and your range.</>{" "}
            <>Uncollected fees return with the position when you withdraw. Borrowers still bear impermanent loss, price risk, and liquidation risk.</>
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How Avana handles trading fees on a pledged LP position."
        sectionColor="emerald"
      />
    </div>
  ))
}
