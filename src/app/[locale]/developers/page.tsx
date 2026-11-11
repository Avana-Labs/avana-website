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
      "A borrower pledges a Uniswap v3 position on Ethereum or an unstaked Aerodrome Slipstream position on Base whose tick range exactly matches a listed market. The AMM protocol's LPVault takes custody, but the liquidity stays in the pool and keeps earning fees, which the borrower can collect at any time.",
  },
  {
    step: "02",
    title: "Represent and value it",
    description:
      "Collateralization records the position's credited liquidity. The AaveAdapter mints exactly that many vault-token units to the borrower's PositionProxy for that market, which supplies them to the market's CDP Spoke. The LPOracle values each vault token at Chainlink prices by fair composition, with no haircut, and checks it against the pool's TWAP and an independent second source.",
  },
  {
    step: "03",
    title: "Borrow GHO from the Avana Hub",
    description:
      "Borrowing capacity is the position's value multiplied by the market's collateral factor, the lowest token factor times a pool risk factor of at most 40%. The borrower draws GHO from the Avana Stable LP Hub, funded by a capped Aave DAO credit line. USDC, USDT or WETH can be enabled as debt assets per CDP Spoke once the Aave DAO approves them.",
  },
]

const collateralHighlights: Array<{
  title: string
  description: string
}> = [
  {
    title: "Liquidity stays in the pool",
    description:
      "Pledging an LP position moves custody to the LPVault but leaves its liquidity in the pool. The borrower can borrow GHO without first withdrawing the position and giving up its fees or range.",
  },
  {
    title: "Valuation and limits are separate",
    description:
      "The LPOracle reports the value of the liquidity with no haircut. Each market's collateral factor, min(token factors) × pool risk factor, sets how much of that value supports debt, and each market has its own account and health factor.",
  },
  {
    title: "Liquidation has explicit rules",
    description:
      "Every liquidation runs through LPVaultSwap with Aave's standard liquidation call and is always partial. LPVaultSwap takes the debt asset from its caller, unwinds only the seized units and swaps them in one transaction. Its one liquidation entry point is open to any address, and Avana's keeper liquidates every account below health factor 1.",
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
            description="Avana lets liquidity providers borrow GHO on Aave V4 against Uniswap v3 positions on Ethereum and Aerodrome Slipstream positions on Base. The positions stay in their pools and keep earning trading fees."
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
              Explore Hubs and Spokes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section id="what-is-avana" className="mt-10 scroll-mt-32">
          <SectionHeader
            title="What is Avana?"
            description="Avana brings AMM liquidity positions to Aave V4 as collateral. A depositor pledges a position of a listed market to the LPVault of its AMM protocol and then borrows GHO from the Avana Stable LP Hub while the position stays in the pool."
          />

          <p className="max-w-3xl type-doc-body">
            <>To borrow against LP assets elsewhere, a liquidity provider usually has to withdraw from the pool first. Withdrawing gives up trading fees and, for concentrated positions, the chosen range.</>{" "}<>Avana keeps the position in its pool. The LPVault of its AMM protocol holds the position, and a vault token represents it on a CDP Spoke. A vault token is a transfer-restricted, collateral-only ERC-20 in which one base unit equals one unit of credited liquidity. At launch Avana runs on Ethereum with Uniswap v3 markets and on Base with Aerodrome Slipstream markets, each market being one stablecoin pool with one exact tick range.</>
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
            description="Avana Hubs and Spokes are standard, unmodified Aave V4 contracts owned by the Aave DAO. Avana-specific logic sits in Avana's own contracts: an LPVault per AMM protocol, Collateralization, vault tokens, PositionProxies and the ProxyManager, the AaveAdapter, RiskModule, MarketRegistry, ParameterStore, LPOracle, DebtOracle, LPVaultSwap and the AvanaTimelock."
          />

          <p className="mt-4 max-w-3xl type-doc-body">
            Hubs come in three tiers: Stable LP at launch on Ethereum and Base, with Correlated LP and Volatile LP Hubs added later. A CDP Spoke is one Spoke per chain, Hub, AMM protocol and risk tier and lists several markets: &quot;Uniswap v3 Stable&quot; on Ethereum and &quot;Aerodrome Slipstream Stable&quot; on Base. A supply-only Lend Spoke on each chain carries the Aave DAO credit lines, and a Coverage Spoke per Hub and debt asset, the Avana Umbrella, holds the First-Loss Reserve. Each wallet has one PositionProxy per CDP Spoke and market, so every borrower action passes through the AaveAdapter and each market has its own health factor.
          </p>
        </section>

      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="An overview of Avana: pledging Uniswap v3 and Aerodrome Slipstream positions, borrowing GHO from the Avana Stable LP Hub, and the per-market rules for valuation and liquidation."
        sectionColor="blue"
      />
    </div>
  ))
}
