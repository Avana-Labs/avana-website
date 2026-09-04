import { Link } from "@/i18n/navigation"
import type { LucideIcon } from "lucide-react"
import { ShieldCheck, TriangleAlert, Undo2 } from "lucide-react"
import { FeatureCardDescription, FeatureCardTitle, SectionIntro } from "@/components/shared"
import type { AppLocale } from "@/i18n/locales"
import { withMarketingI18n } from "@/lib/content-i18n/with-marketing-i18n"

const liquidationProtectionSteps: {
  title: string
  description: string
  icon: LucideIcon
}[] = [
  {
    title: "Spot risk early",
    description:
      "Health moves into a warning range before liquidation, so you can repay debt or add collateral first.",
    icon: TriangleAlert,
  },
  {
    title: "Only what is needed",
    description:
      "Liquidation targets the amount required to restore safety, not a forced exit of your full position.",
    icon: ShieldCheck,
  },
  {
    title: "Surplus returns to you",
    description:
      "After debt and liquidator rewards are covered, residual collateral value is routed back through the settlement path.",
    icon: Undo2,
  },
]

function LiquidationCard({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: LucideIcon
}) {
  return (
    <article className="flex flex-col feature-card rounded-[1.75rem] p-5 md:p-6">
      <div className="flex h-8 w-8 items-center justify-center text-[#01AACF]">
        <Icon className="h-8 w-8" strokeWidth={1.85} />
      </div>

      <FeatureCardTitle className="mt-5 md:mt-6">{title}</FeatureCardTitle>
      <FeatureCardDescription className="mt-3 max-w-[22rem]">{description}</FeatureCardDescription>
    </article>
  )
}

export default async function PositionSafetyCardsSection({ locale }: { locale: AppLocale }) {
  return withMarketingI18n(locale, ["position-safety-cards-section"], (
    <section>
      <div className="space-y-3 text-left">
        <SectionIntro
          eyebrow="Liquidations"
          eyebrowTone="violet"
          title="Built so you don’t just lose the position"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:mt-10 lg:grid-cols-3 lg:gap-5">
        {liquidationProtectionSteps.map((step) => (
          <LiquidationCard
            key={step.title}
            title={step.title}
            description={step.description}
            icon={step.icon}
          />
        ))}
      </div>

      <p className="type-body-copy mt-6">
        Read more about how settlement works in{" "}
        <Link
          href="/developers/liquidation"
          className="text-type-accent transition-colors hover:text-[#0097b8]"
        >
          Liquidation Design
        </Link>
        .
      </p>
    </section>
  ))
}
