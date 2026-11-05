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
    title: "Liquidation Framework",
    description: "How Avana's LPVaultSwap settles LP collateral on Aave V4 when an account's health factor falls below 1.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "three-layers", title: "Three Layers" },
  { id: "core-rules", title: "Core Rules" },
  { id: "lp-complexity", title: "Settlement Modes by Market" },
  { id: "liquidation-pathways", title: "Liquidation Pathways" },
  { id: "position-state", title: "Position State" },
  { id: "surplus-handling", title: "Fees, Surplus and Shortfalls" },
  { id: "operator-model", title: "Keeper Model" },
]

export default async function LiquidationDesignPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "liquidation", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Liquidation Design"
          description="How liquidation eligibility, flash-loan settlement and LP collateral removal are split between Aave V4 and Avana's contracts."
        />

        <section id="overview" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>An account becomes eligible for liquidation when its health factor falls below 1. Aave V4 determines eligibility and handles debt accounting. Avana&apos;s LPVaultSwap contract uses a flash loan to repay the debt and settles the LP collateral backing it, all in one transaction.</>{" "}<>Vault tokens can be transferred only to approved Avana contracts. LPVaultSwap is the only contract that performs liquidations. Each market has an approved settlement mode. In partial settlement, the borrower keeps the rest of the position. In full-position settlement, any surplus is returned to the borrower.</>
          </p>
          <p className="mt-4 type-doc-body">
            For the keeper-facing requirements, see{" "}
            <Link href="/developers/liquidation/liquidators" className="text-type-accent hover:underline">
              Liquidators
            </Link>
            . For the execution sequence, see{" "}
            <Link href="/developers/liquidation/flow" className="text-type-accent hover:underline">
              Liquidation Flow
            </Link>
            .
          </p>
        </section>

        <section id="three-layers" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Three Layers</h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-1 type-doc-subsection-title">Aave V4 layer</h3>
              <p className="type-doc-body">
                The Avana Borrow Spoke, a standard Aave V4 contract, tracks debt, vault-token
                collateral and the health factor. In partial-settlement markets it runs Aave
                V4&apos;s standard liquidation, including its target health factor and dust rules.
              </p>
            </div>
            <div>
              <h3 className="mb-1 type-doc-subsection-title">LPVaultSwap layer</h3>
              <p className="type-doc-body">
                LPVaultSwap takes the flash loan and triggers the liquidation or settlement. It burns
                the seized vault tokens and draws from the FirstLossReserve when needed. It then pays
                keepers, Avana and borrowers. LPVaultSwap is not a spoke and does not borrow from the
                Avana Hub.
              </p>
            </div>
            <div>
              <h3 className="mb-1 type-doc-subsection-title">LP Vault and settlement layer</h3>
              <p className="type-doc-body">
                The LP Vault removes the matching liquidity or releases the position for settlement.
                AMM settlement adapters redeem LP tokens and remove liquidity. They also collect fees
                and execute approved exits. Proceeds are converted to GHO through CoW Swap within the liquidation transaction.
              </p>
            </div>
          </div>
        </section>

        <section id="core-rules" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Core Rules</h2>
          <p className="mb-4 type-doc-body">
            Liquidation links Aave V4&apos;s accounting for vault-token collateral to the LP position held in the LP Vault. The rules below keep the two consistent.
          </p>
          <ul className="space-y-4">
            <li>
              <span className="type-doc-subsection-title">Every vault token is backed</span>
              <p className="mt-0.5 type-doc-body">
                Vault tokens are minted 1:1 with deposited liquidity and burned on withdrawal or settlement. Every outstanding vault token is backed by liquidity in the LP Vault.
              </p>
            </li>
            <li>
              <span className="type-doc-subsection-title">Seized vault tokens are burned</span>
              <p className="mt-0.5 type-doc-body">
                When vault tokens are seized or withdrawn for settlement, LPVaultSwap burns them and the LP Vault removes or releases the matching liquidity in the same transaction.
              </p>
            </li>
            <li>
              <span className="type-doc-subsection-title">One transaction</span>
              <p className="mt-0.5 type-doc-body">
                The flash loan, debt repayment, liquidity removal, swap to GHO and flash-loan repayment all complete within the liquidation transaction. If any step fails, the transaction reverts.
              </p>
            </li>
            <li>
              <span className="type-doc-subsection-title">Shortfalls are covered or the transaction reverts</span>
              <p className="mt-0.5 type-doc-body">
                If proceeds fall short, LPVaultSwap draws from the FirstLossReserve in the same transaction. If the reserve cannot cover the shortfall, the transaction reverts and debt and collateral are unchanged.
              </p>
            </li>
          </ul>
        </section>

        <section id="lp-complexity" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Settlement Modes by Market</h2>
          <p className="mb-4 type-doc-body">
            <>Each market has an approved settlement mode. Uniswap v2 LP tokens are fungible and can
            be redeemed in part. Partial settlement covers Uniswap v2 and selected Aerodrome or Uniswap v3 markets. In those Aerodrome and Uniswap v3 markets, liquidity can be partly removed while the NFT stays in the
            LP Vault.</>{" "}<>Full-position settlement covers most AMMs that use NFTs. Adding any other AMM requires its own review and governance approval.</>
          </p>
        </section>

        <section id="liquidation-pathways" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Liquidation Pathways</h2>
          <p className="mb-4 type-doc-body">
            The steps depend on the market&apos;s settlement mode.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 type-doc-subsection-title">Partial settlement</h3>
              <ul className="ml-4 space-y-1 type-doc-body">
                <li>• LPVaultSwap takes a GHO flash loan and calls Aave V4&apos;s standard liquidation, which applies the target health factor and dust rules.</li>
                <li>• LPVaultSwap receives and burns the seized vault tokens. The LP Vault then removes the matching liquidity. For Uniswap v3, it removes part of the liquidity and the NFT stays in the vault. For Uniswap v2, it redeems the matching LP tokens. The proceeds are swapped to GHO and the flash loan is repaid.</li>
                <li>• Normally, only the liquidity needed to restore health is removed, and the borrower keeps the rest. The dust rule may liquidate a small remainder in full.</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 type-doc-subsection-title">Full-position settlement</h3>
              <ul className="ml-4 space-y-1 type-doc-body">
                <li>• LPVaultSwap flash-borrows GHO and repays the debt through the Position Proxy&apos;s settlement authority.</li>
                <li>• The Aave Adapter withdraws and burns all vault tokens for the position. The LP Vault then releases the NFT for settlement through an approved route.</li>
                <li>• If the position is the account&apos;s only collateral, the full debt is repaid. Otherwise, repayment is sized to the approved health target.</li>
                <li>• The surplus after debt, fees and costs is returned to the borrower. The Aave liquidation bonus does not apply in this mode.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="position-state" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Position State</h2>
          <div className="doc-prose">
            <p className="type-doc-body"><>Before liquidation, the position sits in the LP Vault and stays in its pool. Its
                vault tokens are fully backed by that liquidity.</>{" "}<>Liquidation runs in a single transaction, so a position is never left partly settled.
                Either settlement completes, or the transaction reverts and debt and collateral are unchanged.</>{" "}<>After a partial settlement, the borrower keeps the remaining position and its vault tokens.
                After a full-position settlement, all vault tokens for the position are burned and any surplus goes to the borrower.</></p>
          </div>
        </section>

        <section id="surplus-handling" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Fees, Surplus and Shortfalls</h2>
          <p className="mb-4 type-doc-body">
            <>In partial-settlement markets, the Aave V4 liquidation bonus funds the keeper reward,
            execution costs and Avana&apos;s capped liquidation fee. Aave&apos;s built-in liquidation fee
            is set to 0 for vault-token reserves. The protocol fee is therefore charged once, in
            LPVaultSwap, as a fixed percentage of the bonus, and it does not add to the borrower&apos;s
            cost. In full-position markets, the keeper reward, costs and Avana fee are deducted from
            proceeds, up to a per-market maximum percentage of debt. The surplus goes to the borrower.
            Governance sets the bonus, fee and cap values for each market.</>{" "}<>If proceeds fall short, LPVaultSwap draws from the FirstLossReserve in the same transaction. If the reserve cannot cover the shortfall, the transaction reverts, and keepers may retry with a smaller partial liquidation. Borrowing is activated only once a process for resolving such positions is in place. Aave V4 records a deficit on the Avana Hub only when a completed standard Aave V4 liquidation uses up the collateral with debt remaining.</>
          </p>
        </section>

        <section id="operator-model" className="mb-10">
          <h2 className="type-doc-section-title mb-4">Keeper Model</h2>
          <p className="mb-4 type-doc-body">
            Only approved keepers can call LPVaultSwap. At least two keeper operators run
            liquidations: Avana Labs and at least one independent operator. Opening liquidation to
            third-party liquidators requires governance approval.
          </p>
          <ul className="space-y-2 type-doc-body">
            <li>Keepers monitor the health factor that Aave V4 computes from LPOracle prices and each reserve&apos;s Collateral Factor.</li>
            <li>Every step, from flash loan to flash-loan repayment, completes within the liquidation transaction.</li>
            <li>Flash loans come from the GHO FlashMinter on Ethereum.</li>
            <li>Proceeds are converted to GHO through CoW Swap. Every route completes within the liquidation transaction.</li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How liquidation moves from Aave V4 eligibility at a health factor below 1 to LPVaultSwap settlement in partial or full-position mode."
        sectionColor="amber"
      />
    </div>
  ))
}
