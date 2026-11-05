import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'architecture/lend-spoke', {
    title: "Lend Spoke",
    description: "The Avana Lend Spoke lets lenders supply assets directly to the Avana Hub.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "capital-entry-point", title: "Capital Entry Point" },
  { id: "risk-adjusted-yield", title: "Lender Economics" },
  { id: "dynamic-risk-controls", title: "Risk Controls" },
]

const capitalFlow = [
  {
    title: "Supply capital",
    description:
      "Lenders supply assets through the Lend Spoke. The Lend Spoke's governance approval sets which assets it supports.",
  },
  {
    title: "Route through the Avana Hub",
    description:
      "The Avana Hub holds supplied assets. It also holds the GHO credit line from the Aave DAO.",
  },
  {
    title: "Fund Borrow Spokes",
    description:
      "Approved Avana Borrow Spokes draw from the Avana Hub within their caps. Valuation and liquidation rules are set per market.",
  },
]

const dynamicSignals = [
  "Pool liquidity depth and liquidity history",
  "Price history and availability of reliable external pricing",
  "Range, price sensitivity and expected liquidation costs",
  "Exposure at the pool, underlying-token and depositor level, including share of a pool's liquidity",
  "TWAP window, allowed price deviation and maximum feed age",
]

export default async function LendSpokePage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "architecture/lend-spoke", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Lend Spoke"
          description="An Aave V4 Spoke for lenders to supply assets to the Avana Hub."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>Aave governance approves the Avana Lend Spoke separately from the Borrow Spokes.
            It is a standard Aave V4 Spoke for lenders to supply assets directly to the Avana
            Hub.</>{" "}<>The Lend Spoke also enables borrowing of assets other than GHO.</>{" "}<>{"The Aave DAO also funds the Avana Hub with a capped GHO credit line, allocated through the GHO Reserve. Each increase is subject to governance approval."}</>
          </p>
        </section>

        <section id="capital-entry-point" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Capital Entry Point</h2>
          <p className="mb-6 type-doc-body">
            Lender deposits enter through the Lend Spoke. The Avana Hub holds them alongside the
            GHO credit line. Borrowing rules stay on the Avana Borrow Spokes.
          </p>

          <div className="space-y-4">
            {capitalFlow.map((item) => (
              <div
                key={item.title}
                className="doc-topic"
              >
                <h3 className="mb-1 type-doc-subsection-title">{item.title}</h3>
                <p className="type-doc-body">{item.description}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 type-doc-body type-doc-callout type-doc-callout-info">
            Interest on the Aave DAO GHO credit line accrues to the Aave DAO, separately from lender-funded liquidity.
          </p>
        </section>

        <section id="risk-adjusted-yield" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Lender Economics</h2>
          <p className="mb-4 type-doc-body">
            <>Lenders earn lending interest paid by borrowers. Avana Labs retains a protocol share
            on lender-funded liquidity. Interest on Aave DAO credit lines still goes to the
            DAO.</>{" "}<>Borrowers pay BaseRate × (1 + UserRiskPremium). The Avana Hub GHO base rate is at least the Core Hub GHO base rate. Governance sets lender rates and the protocol share.</>
          </p>
        </section>

        <section id="dynamic-risk-controls" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Risk Controls</h2>
          <p className="mb-4 type-doc-body">
            Governance sets market parameters, and Avana&apos;s RiskModule and the Borrow Spokes
            apply them. Avana Labs submits markets and parameters, and a designated risk reviewer
            reviews them. New collateral pools are published for a two-week review before listing
            approval.
          </p>

          <div className="doc-topic">
            <h3 className="mb-3 type-doc-subsection-title">
              Inputs to market parameters
            </h3>
            <ul className="space-y-2 type-doc-body">
              {dynamicSignals.map((item) => (
                <li key={item} className="type-doc-callout type-doc-callout-info">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How the Avana Lend Spoke supplies the Avana Hub alongside the GHO credit line."
        sectionColor="violet"
      />
    </div>
  ))
}
