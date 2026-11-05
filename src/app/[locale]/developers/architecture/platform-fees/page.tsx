import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'architecture/platform-fees', {
    title: "Platform Fees",
    description: "How Avana Labs' frontend and liquidation fees differ from interest on the GHO credit line, which accrues to the Aave DAO.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "interface-vs-protocol", title: "Interface vs Protocol" },
  { id: "disclosure", title: "Liquidation Fee" },
  { id: "treasury-usage", title: "Costs & Loss Coverage" },
  { id: "integration-notes", title: "Integration Notes" },
]

export default async function PlatformFeesPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "architecture/platform-fees", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Platform Fees"
          description="Avana Labs' frontend and liquidation fees, separate from borrowing interest."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>Avana Labs earns two fees: a frontend fee on its interface and a liquidation fee.
            All interest revenue attributable to the GHO credit line accrues to the Aave DAO.</>{" "}<>Fee terms are held in AvanaConfig. Their values are set by governance.</>
          </p>
        </section>

        <section id="interface-vs-protocol" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Interface vs Protocol</h2>
          <p className="mb-4 type-doc-body">
            Core contracts determine collateral admission, borrowing capacity, debt and liquidation. The frontend fee applies only to transactions made through Avana&apos;s interface. Borrowers can call the contracts directly and avoid it.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Borrowing interest on the GHO credit line, BaseRate × (1 + UserRiskPremium), accrues to the Aave DAO</li>
            <li>The frontend fee applies only to Avana&apos;s interface. Direct contract calls avoid it</li>
            <li>The liquidation fee is charged once, in LPVaultSwap. Aave&apos;s built-in liquidation fee is set to 0 for vault-token reserves</li>
          </ul>
        </section>

        <section id="disclosure" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Liquidation Fee</h2>
          <p className="mb-4 type-doc-body">
            In partial-settlement markets, the liquidation fee is a fixed percentage of Aave&apos;s liquidation bonus and never adds to the borrower&apos;s cost. In full-position markets, it is part of a capped settlement charge. The keeper reward, execution costs and Avana&apos;s fee are deducted from proceeds, up to a per-market maximum percentage of debt. In integrations, itemize the frontend fee separately from gas, swap costs and liquidation charges.
          </p>
        </section>

        <section id="treasury-usage" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Costs &amp; Loss Coverage</h2>
          <p className="type-doc-body">
            Avana Labs owns, operates and pays for its own contracts, audits, monitoring and
            keepers. Revenues committed to loss coverage are second in the loss order, after
            dedicated first-loss capital and before the Avana Umbrella.
          </p>
        </section>

        <section id="integration-notes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Integration Notes</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Fee levels are set by governance and are not final. Check the governance-approved values before quoting end-user costs</li>
            <li>Do not apply the frontend fee to direct contract integrations, which do not pay it</li>
            <li>Keep fee policy separate from borrow capacity and liquidation logic in integration docs</li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Avana Labs' frontend and liquidation fees, and how they differ from interest that accrues to the Aave DAO."
        sectionColor="violet"
      />
    </div>
  ))
}
