import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'introduction/glossary', {
    title: "Glossary",
    description: "Definitions of Avana protocol terms, including the Avana Hub, Borrow Spokes, LP Vault, vault tokens, Collateral Factor, LPOracle and settlement modes.",
  })
}

const sections = [
  { id: "core-concepts", title: "Core Concepts" },
  { id: "protocol-components", title: "Protocol Components" },
  { id: "financial-terms", title: "Financial Terms" },
  { id: "risk-security", title: "Risk & Security" },
  { id: "metrics", title: "Metrics" },
  { id: "disclaimers", title: "Disclaimers" },
]

const glossaryTerms = {
  coreComponents: [
    {
      term: "Avana Hub",
      definition:
        "A standard, unmodified Aave V4 Hub owned by the Aave DAO. It holds a capped GHO credit line allocated through the GHO Reserve. Only approved Avana Borrow Spokes can draw from it.",
    },
    {
      term: "Avana Borrow Spoke",
      definition:
        "A standard Aave V4 Spoke owned by the Aave DAO. It holds collateral-only vault-token reserves for one market category. It lends GHO under each reserve's Collateral Factor, Collateral Risk and liquidation parameters.",
    },
    {
      term: "Avana Lend Spoke",
      definition:
        "An Aave V4 Spoke that Aave governance approves separately. It adds direct lender supply to the Avana Hub and borrowing of assets other than GHO.",
    },
    {
      term: "Hub-and-Spoke Architecture",
      definition:
        "The Aave V4 design in which liquidity sits in a Hub and collateral rules sit in Spokes. Avana uses standard Aave V4 Hub and Spoke contracts and keeps all Avana-specific logic in its own contracts.",
    },
    {
      term: "Keeper",
      definition:
        "An approved operator that calls LPVaultSwap to liquidate unhealthy accounts. At least two keeper operators run: Avana Labs and at least one independent operator.",
    },
  ],
  lpAndCollateral: [
    {
      term: "LP Position",
      definition:
        "A liquidity position in a supported AMM pool. Avana supports selected Uniswap v2 LP tokens and Uniswap v3 positions on Ethereum mainnet. Uniswap v3 is limited to full-range positions and specifically approved ranges.",
    },
    {
      term: "Pledge",
      definition:
        "Depositing an LP position into the LP Vault. A Pledge changes custody but does not remove liquidity from the pool.",
    },
    {
      term: "LP Vault",
      definition:
        "The Avana contract that holds pledged LP tokens and NFTs. It records each position's owner, market, backing and status. It releases a position only through an approved withdrawal or settlement.",
    },
    {
      term: "Vault Token",
      definition:
        "A transfer-restricted, collateral-only ERC-20 record (18 decimals) that represents pledged liquidity 1:1 on an Avana Borrow Spoke. There is one vault token per approved pool, and per range where applicable. It has no owner, no secondary market and no emissions.",
    },
    {
      term: "Position Proxy",
      definition:
        "A dedicated contract that holds each borrower's Aave position. Every deposit, borrow, repayment and withdrawal therefore passes through Avana's controls. In full-position markets it also carries settlement authority.",
    },
    {
      term: "Collateral Factor",
      definition:
        "The share of a vault token's value that supports debt: LPCollateralFactor = min(Token0CF, Token1CF) × PoolRiskFactor.",
    },
    {
      term: "Pool Risk Factor",
      definition:
        "A per-market reduction applied once to the lower underlying Collateral Factor. It reflects range, price sensitivity, pool depth and expected liquidation costs.",
    },
    {
      term: "Borrowing Capacity",
      definition:
        "LPPositionValue × LPCollateralFactor. Capacity also depends on existing debt, exposure caps, available GHO liquidity and oracle checks.",
    },
    {
      term: "Market Category",
      definition:
        "One of three groups of approved markets, each with its own Borrow Spoke, parameters and caps: Stable LP (candidate USDC/USDT), Correlated LP (candidate wstETH/WETH) and Blue-chip/stable LP (candidate WETH/USDC).",
    },
  ],
  debtAndInterest: [
    {
      term: "GHO",
      definition:
        "Aave's stablecoin and the only asset borrowers can borrow from Avana.",
    },
    {
      term: "GHO Credit Line",
      definition:
        "A capped GHO allocation from the Aave DAO to the Avana Hub through the GHO Reserve. Each increase is subject to conditions and governance approval.",
    },
    {
      term: "Borrowing Rate",
      definition:
        "BaseRate × (1 + UserRiskPremium). For example, a 50% risk premium on a 4.5% base rate gives 6.75%.",
    },
    {
      term: "Base Rate",
      definition:
        "The Avana Hub GHO base rate, which is at least the Core Hub GHO base rate.",
    },
    {
      term: "User Risk Premium",
      definition:
        "The premium added to the base rate, set from the Collateral Risk of the borrower's collateral. With several collateral reserves, it is a weighted average. Aave V4 updates it on borrow, withdrawal, collateral change and on request.",
    },
    {
      term: "Collateral Risk",
      definition:
        "A per-reserve setting on the Borrow Spoke that determines the borrower's interest premium. It is not a haircut on collateral value.",
    },
  ],
  liquidationTerms: [
    {
      term: "Health Factor",
      definition:
        "Collateral value after Collateral Factors, divided by outstanding GHO debt. An account becomes liquidatable when its health factor falls below 1.",
    },
    {
      term: "Partial Settlement",
      definition:
        "The settlement mode for Uniswap v2 and selected Aerodrome or Uniswap v3 markets. LPVaultSwap calls Aave V4's standard liquidation with a GHO flash loan. Only the liquidity needed to restore health is removed, so the borrower keeps the rest of the position.",
    },
    {
      term: "Full-Position Settlement",
      definition:
        "The settlement mode for most AMMs that use NFTs. LPVaultSwap repays the debt with a flash loan and settles the whole position through an approved route. Any surplus after debt, fees and costs returns to the borrower.",
    },
    {
      term: "Liquidation Bonus",
      definition:
        "Aave V4's liquidation incentive in partial-settlement markets. It funds the keeper reward, execution costs and Avana's capped liquidation fee. It does not apply in full-position settlement.",
    },
    {
      term: "FirstLossReserve",
      definition:
        "Committed loss-coverage capital that LPVaultSwap draws on within a liquidation if proceeds fall short. If the reserve cannot cover the shortfall, the transaction reverts, and debt and collateral stay unchanged. It counts only once it is funded.",
    },
  ],
  oracleAndTransform: [
    {
      term: "LPOracle",
      definition:
        "Avana's oracle for vault tokens. It prices each vault token from the pool's liquidity math at Chainlink prices (VaultTokenPrice = q0·P0 + q1·P1) and applies no haircut.",
    },
    {
      term: "TWAP Check",
      definition:
        "A consistency check against the pool's time-weighted average price. It is not averaged into the price. If the TWAP moves outside tolerance, new borrowing and risk-increasing withdrawals are blocked. Repayment and liquidation continue at the Chainlink price.",
    },
    {
      term: "AaveAdapter",
      definition:
        "The borrower's entry point to Avana. It coordinates deposits with the LP Vault and Collateralization Module, then mints and supplies vault tokens. Borrowing, repayment and withdrawal also go through the AaveAdapter. It enforces the TWAP and stale-price gates but does not set risk parameters or collateral values.",
    },
    {
      term: "LPVaultSwap",
      definition:
        "The only contract that performs liquidations. It takes flash loans and runs each market's settlement route. It draws from the FirstLossReserve when needed and pays keepers, Avana and borrowers. It is not a spoke and cannot draw from the Avana Hub. It is owned by an Aave DAO executor, and its operational controls are held by an Avana Labs and Aave DAO service-provider multisig.",
    },
    {
      term: "RiskModule",
      definition:
        "Checks market eligibility, the pilot allowlist, position-size limits and exposure limits at the pool, underlying-token and depositor level.",
    },
    {
      term: "CollateralizationModule",
      definition:
        "Sets the vault-token amount for each position at 1:1 with its liquidity and reconciles backing. The oracle cannot affect issuance.",
    },
    {
      term: "AMMSettlementAdapters",
      definition:
        "Immutable, versioned contracts that execute approved exits. They redeem LP tokens, remove liquidity and collect fees.",
    },
    {
      term: "AvanaConfig",
      definition:
        "Holds market definitions, contract mappings, Avana-side limits, oracle settings, settlement routes and fee terms.",
    },
  ],
  metrics: [
    { term: "LP Collateral", definition: "The value of LP positions held in the LP Vault and represented by vault tokens on Avana Borrow Spokes." },
    { term: "Outstanding Debt", definition: "The amount of GHO currently borrowed against vault-token collateral." },
    { term: "Credit-Line Usage", definition: "The share of the Avana Hub's GHO credit line that borrowers have drawn." },
    { term: "Borrowing Headroom", definition: "The difference between a borrower's current debt and their borrowing capacity on a Borrow Spoke." },
    { term: "Backing Reconciliation", definition: "The comparison of vault-token supply with LP Vault liquidity for each market, reported by AaveAdapterLens." },
  ],
  riskMitigation: [
    {
      term: "Pool Approval",
      definition:
        "Only approved pools can be used as collateral. New collateral pools are published for a two-week review before listing approval. Meme-token pools and pools without enough liquidity history or reliable external pricing are excluded.",
    },
    {
      term: "Pilot Allowlist",
      definition:
        "During the pilot, only allowlisted depositors can pledge positions. Each market has minimum and maximum position sizes, and each account has a limit on positions. Governance can remove the allowlist once pilot criteria are met.",
    },
    {
      term: "Exposure Caps",
      definition:
        "Limits checked at the pool, underlying-token and depositor level, including a limit on the share of a pool's liquidity. Hub add and draw caps also limit flows per Borrow Spoke.",
    },
    {
      term: "Emergency Guardian",
      definition:
        "A multisig that can pause, freeze and cancel. It cannot upgrade contracts, change parameters or move collateral. It can freeze a market by freezing both the vault-token reserve and the GHO reserve on the Borrow Spoke.",
    },
    {
      term: "Governance Roles",
      definition:
        "The Aave DAO owns the Avana Hub and Borrow Spokes and holds pause and freeze roles over Avana's contracts. It can stop markets without Avana Labs. Avana Labs administers its own contracts within these permissions.",
    },
    {
      term: "Upgrade Timelock",
      definition:
        "A delay on upgrades to Avana's upgradeable contracts, followed by a grace window. Avana Labs cannot bypass the delay. The Aave DAO can cancel queued upgrades.",
    },
    {
      term: "Avana Umbrella",
      definition:
        "Avana's protocol safety module, named after Aave's Umbrella. It is third in the loss order, after dedicated first-loss capital and revenues committed to loss coverage.",
    },
  ],
}

export default async function GlossaryPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "introduction/glossary", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      {/* Main content */}
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader title="Glossary" />

        <section id="core-concepts" className="mb-10">
          <h2 className="type-doc-section-title mb-6 pb-2 border-b border-gray-200">
            Core Concepts
          </h2>
          <dl className="space-y-4">
            {glossaryTerms.coreComponents.map((item) => (
              <div key={item.term} className="group">
                <dt className="type-doc-subsection-title mb-1">{item.term}</dt>
                <dd className="type-doc-body pl-4 border-l-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="protocol-components" className="mb-10">
          <h2 className="type-doc-section-title mb-6 pb-2 border-b border-gray-200">
            LP & Collateral
          </h2>
          <dl className="space-y-4">
            {glossaryTerms.lpAndCollateral.map((item) => (
              <div key={item.term} className="group">
                <dt className="type-doc-subsection-title mb-1">{item.term}</dt>
                <dd className="type-doc-body pl-4 border-l-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="financial-terms" className="mb-10">
          <h2 className="type-doc-section-title mb-6 pb-2 border-b border-gray-200">
            Debt & Interest
          </h2>
          <dl className="space-y-4">
            {glossaryTerms.debtAndInterest.map((item) => (
              <div key={item.term} className="group">
                <dt className="type-doc-subsection-title mb-1">{item.term}</dt>
                <dd className="type-doc-body pl-4 border-l-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="text-xl type-doc-subsection-title mt-8 mb-4">Liquidation</h3>
          <dl className="space-y-4">
            {glossaryTerms.liquidationTerms.map((item) => (
              <div key={item.term} className="group">
                <dt className="type-doc-subsection-title mb-1">{item.term}</dt>
                <dd className="type-doc-body pl-4 border-l-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="text-xl type-doc-subsection-title mt-8 mb-4">Oracle & Contracts</h3>
          <dl className="space-y-4">
            {glossaryTerms.oracleAndTransform.map((item) => (
              <div key={item.term} className="group">
                <dt className="type-doc-subsection-title mb-1">{item.term}</dt>
                <dd className="type-doc-body pl-4 border-l-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="risk-security" className="mb-10">
          <h2 className="type-doc-section-title mb-6 pb-2 border-b border-gray-200">
            Risk & Security
          </h2>
          <dl className="space-y-4">
            {glossaryTerms.riskMitigation.map((item) => (
              <div key={item.term} className="group">
                <dt className="type-doc-subsection-title mb-1">{item.term}</dt>
                <dd className="type-doc-body pl-4 border-l-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="metrics" className="mb-10">
          <h2 className="type-doc-section-title mb-6 pb-2 border-b border-gray-200">
            Metrics
          </h2>
          <dl className="space-y-4">
            {glossaryTerms.metrics.map((item) => (
              <div key={item.term} className="group">
                <dt className="type-doc-subsection-title mb-1">{item.term}</dt>
                <dd className="type-doc-body pl-4 border-l-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="disclaimers" className="mb-10">
          <h2 className="type-doc-section-title mb-6 pb-2 border-b border-gray-200">
            Disclaimers
          </h2>
          <div className="type-doc-callout type-doc-callout-warning">
            <ul className="type-doc-body space-y-2">
              <li><strong>No Investment Advice:</strong> Avana is a software protocol. This documentation does not constitute investment advice.</li>
              <li><strong>Status:</strong> The public sandbox uses simulated assets and makes no onchain transactions.</li>
              <li><strong>Risk of Loss:</strong> Users can lose funds through smart contract vulnerabilities, market volatility, impermanent loss, liquidation, or oracle failure.</li>
              <li><strong>Regulatory Status:</strong> The regulatory status of Avana and its tokens (if any) is not guaranteed and may vary by jurisdiction.</li>
              <li><strong>No Warranty:</strong> The software is provided &quot;as is&quot; without warranty of any kind.</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Right scroll-spy sidebar */}
      <DeveloperScrollSpyRail 
        sections={sections} 
        sectionColor="blue"
      />
    </div>
  ))
}
