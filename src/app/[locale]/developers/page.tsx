import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { createPageMetadata } from "@/lib/i18n/page-metadata"
import { Link } from "@/i18n/navigation"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  Coins,
  Gauge,
  Layers3,
  ShieldCheck,
  Workflow,
} from "lucide-react"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { DeveloperDocPageHeader } from "@/components/developer-doc-page-header"
import { DeveloperDocSectionHeader } from "@/components/developer-doc-section-header"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

const sections = [
  { id: "welcome", title: "Welcome" },
  { id: "what-is-avana", title: "What is Avana?" },
  { id: "how-it-works", title: "How It Works" },
  { id: "unlocking-lp-collateral", title: "Why LP Collateral Matters" },
  { id: "architecture", title: "Architecture" },
]

const flowSteps = [
  {
    step: "01",
    title: "Deposit a supported LP position",
    description:
      "A borrower deposits an approved LP position into the relevant Borrow Spoke, but the liquidity itself stays deployed in the underlying pool instead of being redeemed first.",
  },
  {
    step: "02",
    title: "Value it conservatively",
    description:
      "The spoke rebuilds the position from its pool data, prices the underlying exposure through the oracle stack, and then discounts that value through collateral factors and market-specific controls.",
  },
  {
    step: "03",
    title: "Borrow through the Hub",
    description:
      "If the resulting capacity is sufficient, the loan draws from shared Hub liquidity while health checks, collateral accounting, and liquidation behavior remain specific to that spoke.",
  },
]

const collateralHighlights: Array<{
  icon: LucideIcon
  title: string
  description: string
}> = [
  {
    icon: Coins,
    title: "Liquidity stays in the pool",
    description:
      "The protocol is built for LP positions that should keep doing LP work. A borrower does not have to pull liquidity out of the AMM just to access cash against it.",
  },
  {
    icon: Gauge,
    title: "Capacity follows the real LP",
    description:
      "Borrowing power comes from the actual structure of the position: token mix, accrued fees, active range when relevant, available depth, and the way the position could be exited during stress.",
  },
  {
    icon: ShieldCheck,
    title: "Liquidation has explicit rules",
    description:
      "LP collateral is not handled as a generic token balance. Each supported market defines how value is recovered, what gets sold or unwound, and how debt is closed if the account becomes unsafe.",
  },
]

const architectureBlocks: Array<{
  icon: LucideIcon
  title: string
  description: string
}> = [
  {
    icon: Workflow,
    title: "Borrow Spoke",
    description:
      "Accepts supported LP collateral, turns it into spoke-level borrowing capacity, and owns the health and liquidation rules for that market.",
  },
  {
    icon: Layers3,
    title: "Hub",
    description:
      "Holds the shared lending balance sheet: reserve accounting, interest-rate logic, and the liquidity that borrower-facing spokes draw from.",
  },
  {
    icon: Coins,
    title: "Lend Spoke",
    description:
      "Brings lender assets into the system and routes them to the Hub so LP underwriting can stay separate from capital onboarding.",
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
            title="Introduction"
            description="Your LP can keep earning fees in the pool while backing a loan. Avana makes that possible on Aave v4: spokes handle LP-specific risk, the Hub powers shared lending liquidity."
          />
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link
              href="/developers/introduction/key-concepts"
              className="inline-flex items-center gap-2 font-medium text-[#01AACF] transition hover:opacity-80 hover:underline"
            >
              Start with Key Concepts
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/developers/architecture"
              className="inline-flex items-center gap-2 font-medium text-slate-700 transition hover:text-slate-950 hover:underline"
            >
              Explore Borrow Spoke
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section id="what-is-avana" className="mt-10 scroll-mt-32">
          <SectionHeader
            title="What is Avana?"
            description="Avana is a lending protocol built for LP collateral. It lets users deposit supported AMM positions, keep those positions active in the underlying pool, and borrow against them through Aave v4 infrastructure."
          />

          <p className="max-w-3xl type-doc-body">
            Liquidity providers often have to remove liquidity before they can borrow against their
            capital. That means exiting the pool, giving up fee exposure, and interrupting the
            market position they already built.
          </p>
          <p className="mt-3 max-w-3xl type-doc-body">
            Avana solves this by making supported LP positions usable as collateral. The LP stays
            live, Avana tracks and values the position, and Aave v4 handles the borrow-side
            accounting through an internal vault collateral token.
          </p>
        </section>

        <section id="how-it-works" className="mt-10 scroll-mt-32">
          <SectionHeader
            title="How It Works"
            description="The user-facing flow is short, but each stage hides LP-specific underwriting work. Later pages break down the mechanics behind each step."
          />

          <ol className="space-y-4">
            {flowSteps.map(({ step, title, description }) => (
              <li key={step} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-sm font-semibold text-[#01AACF]">
                  {step}
                </div>
                <div className="min-w-0">
                  <h3 className="type-doc-subsection-title">{title}</h3>
                  <p className="mt-1 type-doc-body">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="unlocking-lp-collateral" className="mt-10 scroll-mt-32">
          <SectionHeader
            title="Why LP Collateral Matters"
            description="LP positions already sit in working capital. Without a lending layer, getting cash back out usually means shrinking or closing the pool position first."
          />

          <ul className="space-y-4">
            {collateralHighlights.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-[#01AACF]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="type-doc-subsection-title">{title}</h3>
                  <p className="mt-1 type-doc-body">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="architecture" className="mt-10 scroll-mt-32">
          <SectionHeader
            title="Architecture"
            description="Avana uses Aave v4 because LP collateral needs shared liquidity and isolated risk logic at the same time. The Hub handles the common monetary layer while spokes handle LP-specific work: pool collateral registration, position valuation, risk enforcement, and liquidation execution."
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {architectureBlocks.map(({ icon: Icon, title, description }) => (
              <div key={title}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50 text-[#01AACF]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 type-doc-subsection-title">{title}</h3>
                <p className="mt-2 type-doc-body">{description}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 max-w-3xl type-doc-body">
            Builders should think of the system in two halves. The Hub is the common balance sheet
            and debt engine, while Borrow Spokes decide what each LP market can safely support and
            how that market must be unwound if it fails. The Lend Spoke feeds capital into the Hub
            so suppliers do not need to reason about LP mechanics just to provide liquidity.
          </p>
        </section>

      </div>

      <DeveloperScrollSpyRail
        sections={sections}
        pageSummary="High-level context for LP-backed borrowing, shared Hub liquidity, and the spoke-specific rules that make active LP collateral lendable."
        sectionColor="blue"
      />
    </div>
  ))
}
