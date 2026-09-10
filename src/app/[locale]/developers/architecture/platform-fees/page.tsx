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
    description: "How interface fees on Avana frontends differ from protocol borrowing economics.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "interface-vs-protocol", title: "Interface vs Protocol" },
  { id: "disclosure", title: "Disclosure" },
  { id: "treasury-usage", title: "Treasury Usage" },
  { id: "integration-notes", title: "Integration Notes" },
]

export default async function PlatformFeesPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "architecture/platform-fees", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Platform Fees"
          description="Interface-level fees on Avana frontends, separate from protocol borrowing economics."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            Avana may charge frontend or service fees on official interfaces. Those charges are
            separate from the protocol&apos;s collateral, oracle, and liquidation rules.
          </p>
          <p className="type-doc-callout type-doc-callout-info type-doc-body">
            Fee rates, exemptions, and rollout status are operational settings. Verify them in the
            live interface or release materials before relying on them.
          </p>
        </section>

        <section id="interface-vs-protocol" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Interface vs Protocol</h2>
          <p className="mb-4 type-doc-body">
            Core contracts govern LP admission, borrowing capacity, and liquidation. Interface fees,
            if enabled, sit on top as frontend business policy rather than as a change to the borrow
            or risk engine.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Protocol economics determine debt accrual, collateral treatment, and liquidation outcomes</li>
            <li>Interface fees are tied to a specific frontend or service path</li>
            <li>Direct contract integrations may follow different fee assumptions than the official UI</li>
          </ul>
        </section>

        <section id="disclosure" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Disclosure</h2>
          <p className="mb-4 type-doc-body">
            Any interface fee should be shown clearly before signature so users can distinguish it
            from gas costs, swap fees, and protocol-level debt or liquidation effects.
          </p>
        </section>

        <section id="treasury-usage" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Treasury Usage</h2>
          <p className="type-doc-body">
            If interface fees are collected, they typically fund product operations such as
            infrastructure, monitoring, security work, and support. Governance may formalize or
            revise those policies over time.
          </p>
        </section>

        <section id="integration-notes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Integration Notes</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Verify current fee policy before quoting end-user costs</li>
            <li>Do not hard-code interface-fee assumptions into protocol integrations unless policy is formally versioned</li>
            <li>Keep fee policy separate from borrow capacity and liquidation logic in integration docs</li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Interface fee policy for Avana frontends and service layers."
        sectionColor="violet"
      />
    </div>
  ))
}
