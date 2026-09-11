import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'architecture/collateral-factors', {
    title: "Collateral Factors",
    description: "How collateral factors turn LP position value into borrowing capacity inside a Borrow Spoke.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "how-it-works", title: "How It Works" },
  { id: "borrowable-value", title: "Borrowable Value" },
  { id: "notes", title: "Notes" },
]

export default async function CollateralFactorsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "architecture/collateral-factors", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Collateral Factors"
          description="How much of an LP position counts toward borrowing capacity after risk discounts."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="type-doc-body">
            Collateral factors define the fraction of an LP position&apos;s recoverable value that can support debt. The Borrow Spoke first reconstructs the position, prices its underlying assets, and applies recoverable-value discounts. It then applies the configured collateral factor to calculate the position&apos;s borrowing capacity.
          </p>
        </section>

        <section id="how-it-works" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">How It Works</h2>
          <p className="type-doc-body">
            {"Valuation begins with a pool-admission check: only positions from approved pools are accepted as collateral."}{" "}
            {"The position is reconstructed, underlying assets are priced, and the result is discounted to recoverable collateral value."}{" "}
            {"Collateral factors and market settings are applied. The spoke reports aggregate borrowing capacity to the Hub for enforcement."}{" "}
          </p>
        </section>

        <section id="borrowable-value" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Borrowable Value</h2>
          <p className="mb-4 type-doc-body">
            Avana values each LP position separately before aggregating borrowing capacity within a Borrow Spoke. Similar-looking positions can contribute different amounts because their pools, recoverable values, and collateral factors differ.
          </p>
          <div className="doc-topic type-doc-body">
            A supported LP position contributes borrowing capacity only after the spoke has admitted
            it, valued it conservatively, and applied the market&apos;s collateral factor.
          </div>
        </section>

        <section id="notes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Notes</h2>
          <ul className="space-y-3 type-doc-body">
            <li>• Each supported pool&apos;s configuration specifies its collateral factors.</li>
            <li>• Different LP families can have different factors, liquidation thresholds, and bonuses.</li>
            <li>• Read this together with Health Factor and Liquidation Framework when building monitoring tools.</li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How collateral factors turn LP position value into borrowing capacity."
        sectionColor="violet"
      />
    </div>
  ))
}
