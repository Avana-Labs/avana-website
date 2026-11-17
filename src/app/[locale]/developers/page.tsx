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
  { id: "unlocking-lp-collateral", title: "Why LP Collateral Matters" },
  { id: "architecture", title: "Architecture" },
]

const collateralHighlights: Array<{
  title: string
  description: string
}> = [
  {
    title: "Liquidity stays in the pool",
    description:
      "Pledging an LP position moves custody to the LPVault but leaves its liquidity in the pool. The borrower can borrow against it without first withdrawing the position and giving up its fees or range.",
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
            title="Welcome"
            description="Avana lets liquidity providers use their LP positions as collateral on Aave V4 and borrow the assets the Avana Hub lists, across supported DEXes. Today that means Uniswap v3 and v4 positions on Ethereum and Aerodrome Slipstream positions on Base. The positions stay in their pools and keep earning trading fees."
          />
          <p className="mt-6 max-w-3xl type-doc-body">
            The Protocol Overview explains how pledging, valuation, borrowing and liquidation fit together. The reference pages at the top of the navigation list every contract address, market parameter and role.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link
              href="/developers/introduction"
              className="inline-flex items-center gap-2 font-medium text-type-accent transition hover:opacity-80 hover:underline"
            >
              Read the Protocol Overview
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/developers/introduction/key-concepts"
              className="inline-flex items-center gap-2 font-medium text-type-secondary transition hover:text-foreground hover:underline"
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

        <section id="unlocking-lp-collateral" className="mt-10 scroll-mt-32">
          <SectionHeader
            title="Why LP Collateral Matters"
            description="LP collateral lets assets already deployed in an AMM support a loan. The benefit is capital flexibility, not guaranteed positive carry. Borrowers still bear impermanent loss, price risk and liquidation risk."
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
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="An overview of Avana: pledging LP positions from supported DEXes, borrowing from the Avana Hub on each chain, and the per-market rules for valuation and liquidation."
        sectionColor="blue"
      />
    </div>
  ))
}
