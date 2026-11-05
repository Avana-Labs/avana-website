import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { Fragment } from "react"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'integrations', {
    title: "Supported Integrations",
    description: "Which AMM positions Avana accepts as collateral, which are not supported, and what a pool needs before it is listed.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "appkit", title: "AppKit" },
  { id: "dex-families", title: "AMM Position Types" },
  { id: "enablement-status", title: "Governance Approval" },
  { id: "review-requirements", title: "Review Requirements" },
]

const dexFamilies = [
  {
    title: "Uniswap v3 positions",
    body:
      "Uniswap v3 positions are NFTs. Their value depends on the current price, the position's range and its liquidity. Avana accepts only full-range positions and specifically approved ranges. Each approved pool, fee tier and range has its own vault token.",
  },
  {
    title: "Uniswap v2 LP tokens",
    body:
      "Uniswap v2 LP tokens are fungible ERC-20 shares. The LP Vault holds them in the same way as NFTs, so every Uniswap v2 liquidation follows Avana's settlement route.",
  },
  {
    title: "Other AMMs",
    body:
      "Avana does not support Uniswap v4, Curve, Balancer, Aerodrome or other AMMs. Adding any of them requires a separate review and governance approval. Full-position settlement covers most AMMs that use NFTs.",
  },
]

export default async function SupportedIntegrationsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "integrations", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Supported Integrations"
          description="Which AMM positions Avana accepts as collateral and what is reviewed before a pool is listed."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>Avana runs on Ethereum mainnet and accepts selected Uniswap v2 LP tokens and Uniswap
            v3 positions as collateral. Each pool is approved individually. Approval does not
            extend to every pool on an AMM. Avana does not support Uniswap v4, Curve, Balancer,
            Aerodrome, other AMMs or other chains such as Base.</>{" "}<>Each approved pool needs reliable external pricing, enough liquidity history, and liquidity
            removal that cannot be restricted. It also needs an approved settlement mode and its own risk parameters and caps. Admission and valuation details are on these pages:{" "}
            <Link href="/developers/integrations/allowed-pools" className="text-type-accent hover:underline">
              Allowed LP Pools
            </Link>,{" "}
            <Link href="/developers/integrations/price-oracles" className="text-type-accent hover:underline">
              Price Oracles
            </Link>.</>
          </p>
        </section>

        <section id="appkit" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">AppKit</h2>
          <p className="mb-4 type-doc-body">
            <>AppKit lets DEXs, wallets and portfolio apps link users from their existing views
            into Avana&apos;s borrowing flow. Users do not need AppKit or Avana&apos;s frontend. They
            can call the contracts directly.</>{" "}<>See the{" "}
            <Link href="/developers/integrations/appkit" className="text-type-accent hover:underline">
              AppKit guide
            </Link>{" "}
            for partner controls, handoff patterns, and launch notes.</>
          </p>
        </section>

        <section id="dex-families" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">AMM Position Types</h2>
          <p className="type-doc-body">
            {dexFamilies.map((family, index) => (
              <Fragment key={family.title}>
                {index > 0 ? " " : null}{family.body}
              </Fragment>
            ))}
          </p>
        </section>

        <section id="enablement-status" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Governance Approval</h2>
          <p className="mb-4 type-doc-body">
            <>Deploying a market, activating a GHO credit line and approving risk parameters are separate governance decisions. Deployment and GHO funding each go through their own Snapshot vote and AIP.</>{" "}<>Each additional chain, starting with Base, requires its own governance approval. Contract addresses are published after deployment is approved.</>
          </p>
        </section>

        <section id="review-requirements" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Review Requirements</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Reliable Chainlink pricing for both underlying tokens and an approved AMM TWAP for the consistency check</li>
            <li>Enough liquidity and price history, and liquidation proceeds that can be recovered under stress</li>
            <li>Liquidity removal that cannot be restricted, and an approved settlement mode and swap route</li>
            <li>Publication for a two-week review and approval through Aave governance before listing</li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Which AMM positions Avana supports and what is reviewed before a pool is listed."
        sectionColor="cyan"
      />
    </div>
  ))
}
