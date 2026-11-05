import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'safety/contracts', {
    title: "Smart Contract Security",
    description: "The Avana contract set, its roles and upgradeability, trust boundaries, and current review and audit status.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "security-challenges", title: "Security Challenges" },
  { id: "multi-layer-security", title: "Review Layers" },
  { id: "core-contract-surfaces", title: "Contracts" },
  { id: "trust-boundaries", title: "Trust Boundaries" },
  { id: "audit-readiness", title: "Audit Status" },
]

const coreSurfaces = [
  {
    title: "LPVault",
    body:
      "Holds LP tokens and NFTs, and records each position's owner, market, backing and status. Releases positions only through an approved withdrawal or settlement. Upgradeable, behind the timelock.",
  },
  {
    title: "AvanaConfig",
    body:
      "Market definitions, contract mappings, Avana-side limits, oracle settings, settlement routes and fee terms. Upgradeable, behind the timelock.",
  },
  {
    title: "RiskModule",
    body:
      "Eligibility checks, the pilot allowlist, and position-size and exposure limits. Upgradeable, behind the timelock.",
  },
  {
    title: "CollateralizationModule",
    body:
      "Sets the vault-token amount for each position, 1:1 with liquidity, and reconciles backing. Upgradeable, behind the timelock.",
  },
  {
    title: "LPOracle",
    body:
      "Prices vault tokens from pool models and Chainlink, with TWAP checks and staleness rules. Upgradeable, behind the timelock.",
  },
  {
    title: "AMMSettlementAdapters",
    body:
      "Redeem LP tokens and remove liquidity. Collect fees and execute approved exits. Immutable and versioned.",
  },
  {
    title: "AaveAdapter",
    body:
      "Handles deposits, vault-token minting, supply and collateral enablement. Also handles borrowing, repayment and withdrawal. Enforces the TWAP and stale-price gates. Upgradeable, behind the timelock.",
  },
  {
    title: "PositionProxy / Factory",
    body:
      "Holds each depositor's Aave position and acts as the settlement authority for full-position markets. Immutable.",
  },
  {
    title: "LPVaultSwap",
    body:
      "Runs liquidations: flash loans, settlement routes, FirstLossReserve draws, and payouts to keepers, Avana and borrowers. Has no draw capacity on the Avana Hub. Upgradeable. Owned by an Aave DAO executor, with operational controls held by an Avana Labs and Aave DAO service-provider multisig.",
  },
  {
    title: "AaveAdapterLens / LiquidationPreview",
    body:
      "Read-only views. Immutable.",
  },
  {
    title: "Vault tokens",
    body:
      "Collateral-only ERC-20 records with 18 decimals, one per market. Immutable, with no owner.",
  },
  {
    title: "Avana Borrow Spokes and Avana Hub",
    body:
      "Standard Aave V4 contracts, owned by the Aave DAO.",
  },
  {
    title: "AccessManager / UpgradeTimelock",
    body:
      "Upgrade timelock that Avana Labs cannot bypass. Supports Aave DAO cancellation, pause and freeze.",
  },
  {
    title: "CreditLineController",
    body:
      "Credit-line accounting, if needed.",
  },
  {
    title: "FirstLossReserve",
    body:
      "Holds committed loss-coverage capital. Counts toward coverage only once funded.",
  },
]

export default async function ContractsArchitecturePage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "safety/contracts", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader

          title="Contracts & Security"

          description="The contract set, its upgradeability and ownership, and the review status of Avana's code."

        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>Avana does not fork, copy or modify Aave V4 code. The Avana Hub and Borrow Spokes are standard Aave V4 contracts owned by the Aave DAO. All Avana-specific logic sits in Avana&apos;s own contracts. The design follows the pattern of Babylon&apos;s native BTC integration on Aave V4.</>{" "}<>Security review covers both contract execution and economic behavior. A valid contract call can still produce a wrong lending result if its price input is stale or its settlement route cannot execute. For this reason, oracle checks and in-transaction settlement are part of the design. Contract names may change after audits.</>
          </p>
        </section>

        <section id="security-challenges" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Security Challenges</h2>
          <ul className="space-y-3 type-doc-body">
            <li>• LP positions are not ERC-20 reserves. Avana keeps custody in the LP Vault, separate from the vault tokens that represent positions on Aave. Every vault token must stay backed.</li>
            <li>• Stale or manipulated prices can cause loss even when contracts execute as coded. LPOracle therefore uses Chainlink as the reference price, the pool TWAP as a consistency check, and maximum feed ages.</li>
            <li>• Upgrades, pause and freeze roles, and configuration are privileged controls and part of the attack surface.</li>
          </ul>
        </section>

        <section id="multi-layer-security" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Review Layers</h2>
          <div className="space-y-4">
            <div className="doc-topic">
              <h3 className="mb-1 type-doc-subsection-title">Internal security review</h3>
              <p className="type-doc-body">
                Core contracts and the Aave V4 integration are feature-complete and in internal security review, including AI-assisted analysis.
              </p>
            </div>
            <div className="doc-topic">
              <h3 className="mb-1 type-doc-subsection-title">Technical and risk assessment</h3>
              <p className="type-doc-body">
                A technical and risk assessment with Aave DAO service providers covers position custody, valuation, liquidation, the Aave V4 integration, governance roles, loss allocation and economic terms.
              </p>
            </div>
            <div className="doc-topic">
              <h3 className="mb-1 type-doc-subsection-title">Independent audits</h3>
              <p className="type-doc-body">
                Independent public audits follow the internal review, and their reports are published. The{" "}
                <Link href="/developers/safety/bug-bounty" className="text-blue-600 hover:underline">
                  Bug Bounty
                </Link>{" "}
                page describes the disclosure scope. Program terms are announced separately.
              </p>
            </div>
          </div>
        </section>

        <section id="core-contract-surfaces" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Contracts</h2>
          <div className="space-y-4">
            {coreSurfaces.map((surface) => (
              <div key={surface.title} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                <h3 className="mb-1 type-doc-subsection-title">{surface.title}</h3>
                <p className="type-doc-body">{surface.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="trust-boundaries" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Trust Boundaries</h2>
          <ul className="space-y-3 type-doc-body">
            <li>• Vault tokens have no owner or admin. They can be transferred only to the Avana Hub, Borrow Spokes, Position Proxies, Aave Adapter and LPVaultSwap. They are minted only on approved deposit and burned on withdrawal or settlement.</li>
            <li>• Chainlink feeds, AMM TWAPs, the GHO FlashMinter and CoW Swap are external dependencies whose failure can affect valuation or recovery.</li>
            <li>• Upgrades go through a timelock that Avana Labs cannot bypass, and the Aave DAO can cancel them. The Aave DAO holds pause and freeze roles over Avana&apos;s contracts. The Emergency Guardian can pause, freeze and cancel, but cannot upgrade, change parameters or move collateral.</li>
          </ul>
        </section>

        <section id="audit-readiness" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Audit Status</h2>
          <p className="mb-4 type-doc-body">
            <>The public sandbox at app.avana.cc uses simulated assets and makes no onchain transactions. It is not evidence of production readiness.</>{" "}<>Changes to supported AMMs, settlement routes, oracle models or privileged roles change the audit scope, because they change how collateral is admitted, valued or settled.</>
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Contract set, trust boundaries and review status for Avana on Aave V4."
        sectionColor="rose"
      />
    </div>
  ))
}
