import { withDocsI18n } from "@/lib/content-i18n/with-docs-i18n"
import { createPageMetadata } from "@/lib/i18n/page-metadata"
import { Link } from "@/i18n/navigation"
import { Fragment } from "react"
import { ArrowRight } from "lucide-react"
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
  title: string
  description: string
}> = [
  {
    title: "Liquidity stays in the pool",
    description:
      "Depositing an LP position as collateral leaves its liquidity in the underlying AMM. The borrower can access a loan without first redeeming the position for its underlying assets.",
  },
  {
    title: "Capacity follows the real LP",
    description:
      "Borrowing power comes from the actual structure of the position: token mix, accrued fees, active range when relevant, available depth, and the way the position could be exited during stress.",
  },
  {
    title: "Liquidation has explicit rules",
    description:
      "LP collateral is not handled as a generic token balance. Each supported market defines how value is recovered, what gets sold or unwound, and how debt is closed if the account becomes unsafe.",
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
            description="Avana uses Aave v4 to support borrowing against active LP positions. Borrow Spokes manage LP-specific risk, while the Hub supplies shared lending liquidity."
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
            <>Borrowing against the underlying tokens normally requires redeeming the LP position first. That reduces or closes the position and stops fee accrual on the liquidity removed from the pool.</>{" "}<>Avana instead accepts supported LP positions as collateral. The position remains active in its AMM while Avana tracks its value. An internal vault collateral token represents the backing position in Aave v4&apos;s borrowing accounts.</>
          </p>
        </section>

        <section id="how-it-works" className="mt-10 scroll-mt-32">
          <SectionHeader
            title="How It Works"
            description="Each stage connects a user action to the protocol's accounting: a deposit establishes custody, valuation determines borrowing capacity, and a borrow creates debt against that capacity. The following guides explain these steps in detail."
          />

          <p className="type-doc-body">
            {flowSteps.map(({ step, description }, index) => (
              <Fragment key={step}>{index > 0 ? " " : null}{description}</Fragment>
            ))}
          </p>
        </section>

        <section id="unlocking-lp-collateral" className="mt-10 scroll-mt-32">
          <SectionHeader
            title="Why LP Collateral Matters"
            description="LP collateral connects assets already deployed in an AMM to a lending market. The borrower's ability to access those assets as credit depends on the position's current value and the market's risk parameters."
          />

          <p className="type-doc-body">
            {collateralHighlights.map(({ title, description }, index) => (
              <Fragment key={title}>{index > 0 ? " " : null}{description}</Fragment>
            ))}
          </p>
        </section>

        <section id="architecture" className="mt-10 scroll-mt-32">
          <SectionHeader
            title="Architecture"
            description="Avana uses Aave v4 because LP collateral needs shared liquidity and isolated risk logic at the same time. The Hub handles the common monetary layer while spokes handle LP-specific work: pool collateral registration, position valuation, risk enforcement, and liquidation execution."
          />

          <p className="mt-4 max-w-3xl type-doc-body">
            The architecture separates shared lending accounts from LP-specific collateral management. The Hub manages reserves and debt, while each Borrow Spoke determines borrowing capacity and liquidation handling for its supported LP markets. The Lend Spoke routes supplier deposits into the Hub, so supplying capital does not require managing an LP position.
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
