import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { Link } from "@/i18n/navigation"
import type { Metadata } from "next"
import { Check, Coins, Wallet, ArrowRightLeft, Bell } from "lucide-react"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { protocols } from "@/data/protocols"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, "copilot/protocols", {
    title: "Supported Protocols",
    description:
      "Protocols and functions the Avana router supports through standardized ILiquidityAdapter interfaces.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "responsibilities", title: "Adapter Responsibilities" },
  { id: "adapters", title: "Supported Adapters" },
]

const responsibilities: Array<{ icon: typeof Check; title: string; body: string }> = [
  { icon: Check, title: "Approve protocol usage", body: "Authorize contract interactions for deposits, withdrawals, buys, and sells." },
  { icon: Coins, title: "Claim rewards", body: "Retrieve farming rewards earned within the protocol." },
  { icon: Wallet, title: "Withdraw liquidity", body: "Remove liquidity from a source pool." },
  { icon: Coins, title: "Apply fees", body: "Deduct fees for the rollover service, keeping the flow transparent and sustainable." },
  { icon: Wallet, title: "Deposit liquidity", body: "Add liquidity tokens to the protocol's farming contract." },
  { icon: ArrowRightLeft, title: "Swap", body: "Execute token swaps within the protocol's ecosystem." },
  { icon: Bell, title: "Event emission", body: "Notify the frontend about critical stages, providing real-time feedback to users." },
]

export default async function CopilotProtocolsPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "copilot/protocols", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="Supported Protocols"
          description="The protocols and functions the Avana router supports through standardized adapter interfaces."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            The router&apos;s reach is built on <code className="type-doc-inline-code">ILiquidityAdapter</code>{" "}
            contracts. Each adapter is a standardized interface that bridges the router and Ask
            AI to a specific DeFi protocol, abstracting away protocol-specific complexity so
            new integrations can be added without changing the caller.
          </p>
          <p className="type-doc-body">
            For developers, this means intricate cross-protocol transactions can be composed with
            simple, uniform calls. See the{" "}
            <Link href="/developers/integrations/router-contract" className="text-[#01AACF] hover:underline">
              Router &amp; Adapters
            </Link>{" "}
            reference for the contract-level details.
          </p>
        </section>

        <section id="responsibilities" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Adapter Responsibilities</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {responsibilities.map(({ icon: Icon, title, body }) => (
              <div key={title} className="type-doc-panel">
                <div className="flex items-center gap-2.5">
                  <Icon className="h-5 w-5 text-[#01AACF]" />
                  <h3 className="type-doc-subsection-title">{title}</h3>
                </div>
                <p className="mt-2 type-doc-body">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="adapters" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Supported Adapters</h2>
          <p className="mb-6 type-doc-body">
            The adapter set grows over time as new protocols are reviewed and added. The list below
            reflects the families currently supported through the router.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {protocols.map((protocol) => (
              <div
                key={protocol.name}
                className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-cyan-200 hover:bg-cyan-50/40"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-xs font-semibold text-[#01AACF]">
                    {protocol.shortName}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold leading-tight text-gray-900">{protocol.name}</h3>
                    <span className="mt-0.5 inline-block text-xs font-medium uppercase tracking-wide text-[#01AACF]">
                      {protocol.category}
                    </span>
                  </div>
                </div>
                <p className="mt-3 type-doc-body">{protocol.purpose}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {protocol.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-600"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Standardized adapter interfaces let the router act across a growing set of DeFi protocols through a single, uniform contract layer."
        sectionColor="cyan"
      />
    </div>
  ))
}
