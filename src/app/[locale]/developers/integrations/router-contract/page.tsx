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
    title: "Aave Adapter",
    description: "How the Aave Adapter, Avana's borrower entry point, handles deposits, borrowing, repayment and withdrawal through each borrower's Position Proxy.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "role-in-system", title: "Role in System" },
  { id: "adapter-model", title: "Price Gates and Withdrawals" },
  { id: "supported-operations", title: "Supported Operations" },
  { id: "deployment-status", title: "Upgrades and Access" },
]

const supportedOperations = [
  "Pledge: moves a Uniswap v2 LP token or Uniswap v3 position into the custody of the LP Vault. The Adapter mints vault tokens 1:1 through the Collateralization Module. It supplies them through the borrower's Position Proxy and enables them as collateral.",
  "Borrow: borrows GHO from the Avana Hub through the Borrow Spoke. The TWAP and stale-price gates apply.",
  "Repay: available at any time unless the Adapter is paused.",
  "Withdraw: allowed only if the account stays healthy. The Adapter burns the matching vault tokens, and the LP Vault releases the LP tokens or NFT with uncollected fees.",
]

export default async function RouterContractPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "integrations/router-contract", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Aave Adapter"
          description="The borrower entry point for deposits, borrowing, repayment and withdrawal, acting through each borrower's Position Proxy."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>The Aave Adapter is the borrower&apos;s entry point to Avana. It coordinates deposits with the LP Vault and the Collateralization Module. When a position is pledged, the Adapter mints vault tokens and supplies them through the borrower&apos;s Position Proxy as collateral. Borrowing, repayment and withdrawal also go through the Adapter.</>{" "}<>The Aave Adapter does not set risk parameters or collateral values. Collateral Factors, health checks and liquidation
            eligibility come from the Borrow Spoke, LPOracle and governance-approved parameters. Related pages:{" "}
            <Link href="/developers/architecture" className="text-type-accent hover:underline">
              Borrow Spoke
            </Link>,{" "}
            <Link href="/developers/liquidation" className="text-type-accent hover:underline">
              Liquidation Framework
            </Link>.</>
          </p>
        </section>

        <section id="role-in-system" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Role in System</h2>
          <p className="mb-4 type-doc-body">
            A dedicated Position Proxy holds each borrower&apos;s Aave position. Every borrower action (deposit, borrow, repay, withdraw) therefore passes through the Aave Adapter and Avana&apos;s controls. Partial-settlement liquidations do not go through the Aave Adapter. In partial settlement, LPVaultSwap calls the Borrow Spoke directly. In full-position settlement, the Aave Adapter withdraws and burns all vault tokens for the position so the LP Vault can release it.
          </p>
        </section>

        <section id="adapter-model" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Price Gates and Withdrawals</h2>
          <p className="mb-4 type-doc-body">
            <>The Aave Adapter enforces the TWAP and stale-price gates. If the pool TWAP is outside tolerance, it blocks new borrowing and risk-increasing withdrawals. If the Chainlink feed is stale or invalid, it blocks new borrowing and voluntary withdrawals. Repayment continues in both cases.</>{" "}<>A withdrawal is allowed only if the account stays healthy afterward. The Aave Adapter then burns the matching vault tokens. The LP Vault releases the LP tokens or NFT together with any uncollected fees.</>
          </p>
        </section>

        <section id="supported-operations" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Supported Operations</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            {supportedOperations.map((operation) => (
              <li key={operation}>{operation}</li>
            ))}
          </ul>
        </section>

        <section id="deployment-status" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Upgrades and Access</h2>
          <p className="mb-4 type-doc-body">
            The Aave Adapter is upgradeable, behind a timelock that Avana Labs cannot bypass.
            Contract addresses are published after deployment is approved.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Borrowers can call the contracts directly, without Avana&apos;s frontend. They keep the ability to repay and make permitted withdrawals.</li>
            <li>Only positions that pass the Risk Module&apos;s pool and limit checks can be deposited. The Aave Adapter does not decide which pools are approved.</li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How the Aave Adapter handles borrower actions through each borrower's Position Proxy."
        sectionColor="cyan"
      />
    </div>
  ))
}
