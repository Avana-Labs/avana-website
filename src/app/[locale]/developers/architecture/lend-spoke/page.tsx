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
    description: "How lenders supply assets through the Lend Spoke to fund LP-collateral borrowing.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "capital-entry-point", title: "Capital Entry Point" },
  { id: "risk-adjusted-yield", title: "Risk-Adjusted Yield" },
  { id: "dynamic-risk-controls", title: "Dynamic Risk Controls" },
]

const capitalFlow = [
  {
    title: "Supply capital",
    description:
      "Lenders deposit ETH, BTC, stablecoins, and other supported assets through the Lend Spoke.",
  },
  {
    title: "Route through the Hub",
    description:
      "Capital moves into the Hub reserve layer, where one pool can support multiple LP-collateral borrow markets.",
  },
  {
    title: "Fund Borrow Spokes",
    description:
      "Borrow Spokes draw from Hub liquidity while keeping LP valuation and liquidation rules local to each market.",
  },
]

const dynamicSignals = [
  "Pool composition and changing inventory balance",
  "Trading volume and realized fee generation",
  "Price divergence between paired assets",
  "Volatility regime shifts and peg stability",
  "Liquidity depth available during stressed unwinds",
]

export default async function LendSpokePage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "architecture/lend-spoke", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Lend Spoke"
          description="How lenders supply assets that fund borrowing against LP collateral."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>Lenders supply assets such as ETH, BTC, GHO, USDC, USDT, or other supported tokens into
            the lender-facing side of the protocol. That capital routes through the Hub to support
            borrowing across LP-collateral markets.</>{" "}<>Suppliers provide the assets used for loans rather than managing the LP positions that secure them. Borrow Spokes handle LP valuation, collateral restrictions, and liquidation, while the Hub accounts for the supplied capital and borrowing against it.</>{" "}<>{"The architecture separates shared lending accounts from LP-specific collateral management. The Hub manages reserves and debt, while each Borrow Spoke determines borrowing capacity and liquidation handling for its supported LP markets. The Lend Spoke routes supplier deposits into the Hub, so supplying capital does not require managing an LP position."}</>
          </p>
        </section>

        <section id="capital-entry-point" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Capital Entry Point</h2>
          <p className="mb-6 type-doc-body">
            Lender deposits come through the Lend Spoke first, then move into the shared Hub reserve
            layer. Capital does not need to be partitioned per LP market, even though borrowing
            rules stay separate on the spoke side.
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
            Early in the protocol lifecycle, Hub liquidity may also be supplemented by Aave v4 credit
            lines. Over time, Lend Spoke deposits can become a larger share of native lending
            capital.
          </p>
        </section>

        <section id="risk-adjusted-yield" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Risk-Adjusted Yield</h2>
          <p className="mb-4 type-doc-body">
            <>Supplier yield comes from borrowers paying interest to access liquidity backed by LP
            collateral. Avana combines the shared Hub base rate with spoke-level risk premiums tied
            to the LP markets being funded.</>{" "}<>Supply rates vary with available liquidity, utilization, market conditions, and the risk profile of the borrowing markets. An integration needs the current deployment&apos;s rate and reserve data to display a current return estimate.</>
          </p>
        </section>

        <section id="dynamic-risk-controls" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Dynamic Risk Controls</h2>
          <p className="mb-4 type-doc-body">
            LP collateral changes with pool composition, volume, divergence, volatility, and unwind
            depth. Risk controls can respond to those signals rather than relying on static settings
            alone.
          </p>

          <div className="doc-topic">
            <h3 className="mb-3 type-doc-subsection-title">
              Signals that may inform risk updates
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
        pageSummary="How lender capital enters the protocol and funds LP-collateral borrowing through the Hub."
        sectionColor="violet"
      />
    </div>
  ))
}
