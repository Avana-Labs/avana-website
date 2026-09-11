import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'integrations/router-contract', {
    title: "Router Contract",
    description: "How the Avana router coordinates DEX-specific deposit, withdraw, fee, and liquidation actions.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "role-in-system", title: "Role in System" },
  { id: "adapter-model", title: "Adapter Model" },
  { id: "supported-operations", title: "Supported Operations" },
  { id: "deployment-status", title: "Deployment Status" },
]

const supportedOperations = [
  "Bundle DEX-specific deposit, withdraw, and fee-collection calls into one interface layer",
  "Coordinate unwind or routing steps needed for liquidation execution",
  "Support controlled position updates such as range changes when a DEX adapter exists",
  "Expose a consistent integration surface without deciding collateral factors or health checks",
]

export default async function RouterContractPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "integrations/router-contract", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Router Contract"
          description="Execution layer for DEX-specific actions, adapter calls, and liquidation routing."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            <>The router coordinates deposits, withdrawals, fee claims, and liquidation steps through DEX-specific adapters. Each caller can use this shared execution layer instead of assembling the underlying DEX calls independently.</>{" "}<>The router does not decide risk. Collateral factors, health checks, and liquidation
            eligibility remain in the Borrow Spoke, Hub, oracle stack, and risk framework. See{" "}
            <Link href="/developers/architecture" className="text-[#01AACF] hover:underline">
              Borrow Spoke
            </Link>{" "}
            and{" "}
            <Link href="/developers/liquidation" className="text-[#01AACF] hover:underline">
              Liquidation Framework
            </Link>
            .</>
          </p>
        </section>

        <section id="role-in-system" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Role in System</h2>
          <p className="mb-4 type-doc-body">
            DEXs expose different methods for entering a position, removing liquidity, and collecting fees. The router connects Avana&apos;s transaction flows to those methods through a common integration layer.
          </p>
        </section>

        <section id="adapter-model" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Adapter Model</h2>
          <p className="mb-4 type-doc-body">
            <>Each supported DEX family has an adapter for operations such as fee collection and liquidity removal. The adapter implements the calls required by that LP format, keeping DEX-specific execution separate from the rest of the transaction flow.</>{" "}<>An adapter provides execution support for an LP format. Collateral admission also requires compatible valuation and liquidation support, so deploying an adapter alone does not enable a pool for borrowing.</>
          </p>
        </section>

        <section id="supported-operations" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Supported Operations</h2>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            {supportedOperations.map((operation) => (
              <li key={operation}>{operation}</li>
            ))}
          </ul>
        </section>

        <section id="deployment-status" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Deployment Status</h2>
          <p className="mb-4 type-doc-body">
            Router addresses, adapter registries, and enabled networks are deployment-specific.
            Verify chain-specific addresses from the published contract registry or release notes.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Confirm the DEX adapter you rely on is enabled on the target deployment</li>
            <li>Router support does not mean a pool is admitted for collateral</li>
          </ul>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="How the router coordinates DEX-specific actions and liquidation routing."
        sectionColor="cyan"
      />
    </div>
  ))
}
