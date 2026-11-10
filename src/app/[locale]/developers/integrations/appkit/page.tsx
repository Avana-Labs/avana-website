import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { createDocsMetadata } from "@/lib/content-i18n/docs-metadata"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
  const locale = await resolveLocaleParam(params)
  return createDocsMetadata(locale, 'integrations/appkit', {
    title: "AppKit",
    description: "How AppKit passes wallet and market context from a partner application into Avana's borrowing flow, and what stays in the contracts.",
  })
}

const sections = [
  { id: "overview", title: "Overview" },
  { id: "integration-model", title: "Integration Model" },
  { id: "partner-controls", title: "Partner Controls" },
  { id: "implementation-notes", title: "Implementation Notes" },
  { id: "launch-notes", title: "Launch Notes" },
]

export default async function DeveloperAppKitPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return withDocsI18n(locale, "integrations/appkit", (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-3xl flex-1">
        <DeveloperDocPageHeader
          title="AppKit"
          description="How partners link users into Avana's borrowing flow from their own position views. Borrowing, risk and liquidation rules stay in the contracts."
        />

        <section id="overview" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Overview</h2>
          <p className="mb-4 type-doc-body">
            AppKit connects DEXs, wallets and portfolio applications to Avana&apos;s LP-backed borrowing flow on Ethereum and Base. The partner application chooses where the entry point appears and passes the user&apos;s wallet and market context. Borrowing itself runs through the AaveAdapter and the market&apos;s CDP Spoke on Aave V4: GHO first, and USDC, USDT or WETH where a CDP Spoke has enabled them.
          </p>
          <p className="type-doc-body">
            AppKit is a frontend integration. It does not change which pools are listed, how positions are valued or how they are liquidated. Users can also call the contracts directly, without AppKit or Avana&apos;s frontend.
          </p>
        </section>

        <section id="integration-model" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Integration Model</h2>
          <div className="space-y-4">
            <div className="doc-topic">
              <h3 className="mb-2 type-doc-subsection-title">Intent capture</h3>
              <p className="type-doc-body">A partner places the borrowing entry point beside an LP position, portfolio or swap view. That view supplies the position and market context for the handoff. Only Uniswap v3 positions on Ethereum and unstaked Aerodrome Slipstream positions on Base whose tick range matches a listed market exactly can be pledged.</p>
            </div>
            <div className="doc-topic">
              <h3 className="mb-2 type-doc-subsection-title">Protocol handoff</h3>
              <p className="type-doc-body">The partner passes the wallet, chain and market into Avana so the borrowing flow opens with the relevant account and market selected. Each wallet has one account per market, so the market fixes the account the user will borrow on.</p>
            </div>
            <div className="doc-topic">
              <h3 className="mb-2 type-doc-subsection-title">Partner economics</h3>
              <p className="type-doc-body">Any partner arrangement is off-chain. No contract carries a borrow, interest or frontend fee, and partner arrangements do not change Aave V4 borrowing terms, risk parameters or liquidation rules.</p>
            </div>
          </div>
        </section>

        <section id="partner-controls" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Partner Controls</h2>
          <p className="mb-4 type-doc-body">
            Partners control how the borrowing entry point is presented and the guidance around it. Those choices affect how users reach the flow. Collateral eligibility, price states and every transaction check stay in Avana&apos;s contracts and Aave V4.
          </p>
          <ul className="space-y-3 type-doc-body">
            <li className="doc-topic">Where the credit surface appears in the product</li>
            <li className="doc-topic">Which user segments see the borrow entry point</li>
            <li className="doc-topic">How much education or explanation appears alongside the handoff</li>
            <li className="doc-topic">Whether the product uses a full embedded handoff or a lighter context-preserving entry point</li>
          </ul>
        </section>

        <section id="implementation-notes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Implementation Notes</h2>
          <p className="mb-4 type-doc-body">
            An AppKit integration connects an existing position view to the matching Avana borrowing flow. These notes cover context transfer and the boundary between the partner interface and Avana&apos;s protocol operations.
          </p>
          <ul className="list-disc space-y-2 ps-5 type-doc-body">
            <li>Read account, price-state, cap and preview data from the Lens rather than recomputing collateral values or health factors in the partner interface.</li>
            <li>Show the recommended borrow at health factor 1.10 next to the protocol maximum at 1.00, as the Lens returns them.</li>
            <li>Build transactions with the calldata builders in <code className="type-doc-inline-code">packages/protocol</code> from the verified deployment manifest. Never take a transaction target or calldata from a backend.</li>
            <li>Request only exact approvals: one position to the market&apos;s LPVault for a pledge, and the exact repay amount to the AaveAdapter for a repay. Never an operator approval for all tokens or an unlimited allowance.</li>
            <li>Show when a market is not Live, a Hub is paused or frozen, or a breaker is tripped, so users understand why a pledge or borrow would revert.</li>
          </ul>
          <p className="mt-4 type-doc-body">
            The full integration guide, with contracts, approvals and events, is on the integrations overview:{" "}
            <Link href="/developers/integrations" className="text-type-accent hover:underline">Integrations</Link>.
          </p>
        </section>

        <section id="launch-notes" className="mb-10">
          <h2 className="mb-4 type-doc-section-title">Launch Notes</h2>
          <p className="mb-4 type-doc-body">
            Before enabling the integration, verify the complete path from the partner&apos;s position view to Avana&apos;s borrowing flow on each chain. The interface must make the selected account, the market and the transition to Avana clear.
          </p>
          <p className="type-doc-body">
            Include hidden entry points, direct links, positions whose range does not match a listed market, staked Slipstream positions, and missing wallet, market or collateral context in that review. These cases decide whether the flow opens with the information needed to evaluate a borrow.
          </p>
        </section>
      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="Developer integration guide for embedding AppKit inside partner product surfaces."
        sectionColor="cyan"
      />
    </div>
  ))
}
