import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { createPageMetadata } from "@/lib/i18n/page-metadata"
import { Link } from "@/i18n/navigation"
import { Fragment } from "react"
import { ArrowRight } from "lucide-react"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { DeveloperDocSectionHeader } from "@/components/developer-doc-section-header"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

const sections = [
  { id: "welcome", title: "Welcome" },
  { id: "what-is-avana", title: "What is Avana?" },
  { id: "how-it-works", title: "How It Works" },
  { id: "unlocking-lp-collateral", title: "Why LP Collateral Matters" },
  { id: "architecture", title: "Architecture" },
]

const flowSteps = [
  {
    step: "01",
    title: "Pledge a supported LP position",
    description:
      "A borrower pledges an approved Uniswap v2 LP token or Uniswap v3 position to the LP Vault. A Pledge changes custody but does not remove liquidity from the pool. The position keeps earning fees while it is in range.",
  },
  {
    step: "02",
    title: "Represent and value it",
    description:
      "The Collateralization Module mints vault tokens 1:1 with the pledged liquidity. The AaveAdapter supplies them to the market's Avana Borrow Spoke through the borrower's Position Proxy. The LPOracle values each vault token from the pool's liquidity math at Chainlink prices, with no haircut. It then checks the result against the pool's TWAP.",
  },
  {
    step: "03",
    title: "Borrow GHO from the Avana Hub",
    description:
      "Borrowing capacity is the position's value multiplied by the reserve's Collateral Factor. If capacity is sufficient, the borrower draws GHO from the Avana Hub. A capped GHO credit line from the Aave DAO funds the Hub.",
  },
]

const collateralHighlights: Array<{
  title: string
  description: string
}> = [
  {
    title: "Liquidity stays in the pool",
    description:
      "Pledging an LP position moves custody to the LP Vault but leaves its liquidity in the underlying pool. The borrower can borrow GHO without first withdrawing the position and giving up its fees or range.",
  },
  {
    title: "Valuation and limits are separate",
    description:
      "The LPOracle reports the value of the liquidity with no haircut. Each reserve's Collateral Factor, min(Token0CF, Token1CF) × PoolRiskFactor, sets how much of that value supports debt.",
  },
  {
    title: "Liquidation has explicit rules",
    description:
      "Each market has an approved settlement mode. LPVaultSwap uses a flash loan to repay debt and settle the LP collateral in one transaction. Partial settlement removes only the liquidity needed to restore health. Full-position settlement settles the whole position and returns any surplus to the borrower.",
  },
]

function SectionHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return <DeveloperDocSectionHeader title={title} description={description} />
}

export async function generateMetadata({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return createPageMetadata(locale, "developers", "/developers", { ogType: "developers" })
}

export default async function DevelopersPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "hub", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-4xl flex-1">
        <section id="welcome" className="scroll-mt-32 pb-10">
          <DeveloperDocPageHeader
            title="Introduction"
            description="Avana lets liquidity providers borrow GHO on Aave V4 against their Uniswap v2 and v3 positions. The positions stay active in their pools and keep earning trading fees."
          />
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link
              href="/developers/introduction/key-concepts"
              className="inline-flex items-center gap-2 font-medium text-type-accent transition hover:opacity-80 hover:underline"
            >
              Start with Key Concepts
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/developers/architecture"
              className="inline-flex items-center gap-2 font-medium text-type-secondary transition hover:text-foreground hover:underline"
            >
              Explore Borrow Spoke
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section id="what-is-avana" className="mt-10 scroll-mt-32">
          <SectionHeader
            title="What is Avana?"
            description="Avana brings AMM liquidity positions to Aave V4 as collateral. A depositor pledges a Uniswap v2 LP token or Uniswap v3 position to the LP Vault. The depositor then borrows GHO from the Avana Hub while the position stays in the pool."
          />

          <p className="max-w-3xl type-doc-body">
            <>To borrow against LP assets elsewhere, a liquidity provider usually has to withdraw from the pool first. Withdrawing gives up trading fees and, for concentrated positions, the chosen range.</>{" "}<>Avana keeps the position in its pool. The LP Vault holds the position, and a vault token represents it on an Avana Borrow Spoke. A vault token is a transfer-restricted, collateral-only ERC-20 record that maps 1:1 to the underlying liquidity. Avana runs on Ethereum mainnet with selected Uniswap v2 and v3 markets.</>
          </p>
        </section>

        <section id="how-it-works" className="mt-10 scroll-mt-32">
          <SectionHeader
            title="How It Works"
            description="Each stage connects a user action to the protocol's accounting. A Pledge establishes custody. Valuation and the Collateral Factor determine borrowing capacity. A borrow creates GHO debt against that capacity. The following guides explain each step in detail."
          />

          <p className="type-doc-body">
            {flowSteps.map(({ step, description }, index) => (
              <Fragment key={step}>{index > 0 ? " " : null}{description}</Fragment>
            ))}
          </p>
        </section>

        <section id="unlocking-lp-collateral" className="mt-10 scroll-mt-32">
          <SectionHeader
            title="Why LP Collateral Matters"
            description="LP collateral lets assets already deployed in an AMM support a GHO loan. The benefit is capital flexibility, not guaranteed positive carry. Borrowers still bear impermanent loss, price risk and liquidation risk."
          />

          <p className="type-doc-body">
            {collateralHighlights.map(({ title, description }, index) => (
              <Fragment key={title}>{index > 0 ? " " : null}{description}</Fragment>
            ))}
          </p>
        </section>

        <section id="architecture" className="mt-10 scroll-mt-32">
          <SectionHeader
            title="Architecture"
            description="The Avana Hub and Avana Borrow Spokes are standard, unmodified Aave V4 contracts owned by the Aave DAO. All Avana-specific logic sits in Avana's own contracts: LP Vault, AaveAdapter, LPOracle, RiskModule, CollateralizationModule, LPVaultSwap, AMMSettlementAdapters and AvanaConfig."
          />

          <p className="mt-4 max-w-3xl type-doc-body">
            Each market category (Stable LP, Correlated LP and Blue-chip/stable LP) has its own Avana Borrow Spoke, parameters and caps. The Avana Hub holds the GHO credit line, and only approved Borrow Spokes can draw from it. A dedicated Position Proxy holds each borrower&apos;s Aave position. Deposits, borrows, repayments and withdrawals therefore pass through Avana&apos;s controls. The Avana Lend Spoke lets lenders supply assets directly to the Avana Hub. Aave governance approves it separately.
          </p>
        </section>

      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="An overview of Avana: pledging Uniswap LP positions, borrowing GHO from the Avana Hub, and the per-market rules for valuation and liquidation."
        sectionColor="blue"
      />
    </div>
  ))
}
