import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'liquidation/flow', {
    title: "Liquidation Flow",
    description: "The Avana liquidation sequence: a flash loan, debt repayment, vault-token burn, LP settlement and swap to GHO in one transaction.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "related-docs", title: "Related Docs" },
  { id: "runtime-sequence", title: "Runtime Sequence" },
  { id: "state-transitions", title: "Outcomes" },
  { id: "operator-notes", title: "Keeper Notes" },
]

const runtimeSteps = [
  {
    title: "Detect an account below health factor 1",
    body:
      "Approved keepers monitor accounts using the health factor that Aave V4 computes from LPOracle vault-token prices and each reserve's Collateral Factor. An account is eligible for liquidation when its health factor falls below 1.",
  },
  {
    title: "Take a GHO flash loan",
    body:
      "The keeper calls LPVaultSwap, which takes a GHO flash loan from the GHO FlashMinter on Ethereum. LPVaultSwap is not a spoke and does not borrow from the Avana Hub.",
  },
  {
    title: "Repay debt and take the vault tokens",
    body:
      "In partial-settlement markets, LPVaultSwap calls Aave V4's standard liquidation on the Borrow Spoke. The standard liquidation applies the target health factor and dust rules and transfers the seized vault tokens to LPVaultSwap. In full-position markets, LPVaultSwap repays the debt through the Position Proxy's settlement authority. The Aave Adapter then withdraws all vault tokens for the position.",
  },
  {
    title: "Burn the vault tokens and remove the liquidity",
    body:
      "The vault tokens are burned. In partial settlement, the LP Vault removes the matching liquidity. For Uniswap v3, it removes part of the liquidity and the NFT stays in the vault. For Uniswap v2, it redeems the matching LP tokens. In full-position settlement, the LP Vault releases the NFT for settlement through an approved route.",
  },
  {
    title: "Swap to GHO and repay the flash loan",
    body:
      "Proceeds are converted to GHO through CoW Swap within the same transaction. The flash loan is repaid, and the keeper reward and Avana fee are paid. In full-position markets, any surplus goes to the borrower. If proceeds fall short, LPVaultSwap draws from the FirstLossReserve. If the reserve cannot cover the shortfall, the transaction reverts.",
  },
]

const stateTransitions = [
  {
    title: "Before liquidation",
    body:
      (<>{"The position sits in the LP Vault and stays in its pool. Its vault tokens are supplied to the Borrow Spoke through the borrower's Position Proxy and are fully backed by that liquidity."}{" "}{"Vault tokens can be transferred only to approved Avana contracts, so LPVaultSwap is the only contract that can liquidate them."}</>),
  },
  {
    title: "After settlement",
    body:
      (<>{"After a partial settlement, the borrower keeps the remaining position and its vault tokens, and the account's health factor is restored to the target."}{" "}{"After a full-position settlement, all vault tokens for the position are burned, and the NFT is released and settled through an approved route. Any surplus after debt, fees and costs is returned to the borrower."}</>),
  },
  {
    title: "Reverted liquidation",
    body:
      (<>{"If any step fails, or the FirstLossReserve cannot cover a shortfall, the whole transaction reverts and debt and collateral are unchanged. No deficit is recorded, and keepers may retry with a smaller partial liquidation."}{" "}{"Aave V4 records a deficit on the Avana Hub only when a completed standard Aave V4 liquidation uses up the collateral with debt remaining."}</>),
  },
]

export default async function LiquidationFlowPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "liquidation/flow", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Liquidation Flow"
          description="The sequence for liquidating an LP-backed position in a single transaction, from detection to flash-loan repayment."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>Liquidation starts when an account&apos;s health factor falls below 1. Aave V4 handles
            eligibility and debt accounting. Avana&apos;s LPVaultSwap settles the LP collateral
            behind the vault tokens.</>{" "}<>The whole liquidation runs in one transaction. A flash loan repays the debt and the vault tokens are burned.
            The matching liquidity is removed or the position is released. The proceeds are swapped to GHO and the flash loan is repaid.</>
          </p>
        </section>

        <section id="related-docs" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Related Docs</h2>
          <p className="mb-4 type-doc-body">
            Settlement modes, fees and shortfall handling are described in{" "}
            <Link href="/developers/liquidation" className="text-type-accent hover:underline">
              Liquidation Framework
            </Link>. This flow uses the vault-token pricing in{" "}
            <Link href="/developers/integrations/price-oracles" className="text-type-accent hover:underline">
              Price Oracles
            </Link>{" "}
            and the borrowing limits in{" "}
            <Link href="/developers/architecture/collateral-factors" className="text-type-accent hover:underline">
              Collateral Factors
            </Link>
            .
          </p>
        </section>

        <section id="runtime-sequence" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Runtime Sequence</h2>
          <div className="space-y-4">
            {runtimeSteps.map((step, index) => (
              <div key={step.title}>
                <div className="mb-2 flex items-center gap-3">
                  <span className="font-semibold text-type-accent">{index + 1}.</span>
                  <h3 className="type-doc-subsection-title">{step.title}</h3>
                </div>
                <p className="type-doc-body">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="state-transitions" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Outcomes</h2>
          <p className="mb-4 type-doc-body">
            Every liquidation either completes or reverts within one transaction, so there is no intermediate liquidating state. The outcome depends on the market&apos;s settlement mode.
          </p>
          <div className="space-y-4">
            {stateTransitions.map((item) => (
              <div key={item.title}>
                <h3 className="mb-1 type-doc-subsection-title">{item.title}</h3>
                <p className="type-doc-body">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="operator-notes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Keeper Notes</h2>
          <div className="space-y-3 type-doc-body">
            <p>
            <>Eligibility is based on LPOracle valuation, which uses Chainlink as the reference price and the pool&apos;s TWAP as a consistency check. Raw AMM spot prices do not reproduce these values.</>{" "}<>If Chainlink is stale or invalid, liquidation continues at the last valid price while that price is within its maximum age. Past that age, liquidations pause until the feed recovers or governance approves a backup feed.</>
          </p>
            <p>
              Governance sets the liquidation bonus, target health factor and fee caps for each market. Opening liquidation to third-party keepers requires governance approval.
            </p>
          </div>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Keeper-facing sequence for a single-transaction LPVaultSwap liquidation."
        sectionColor="amber"
      />
    </div>
  ))
}
