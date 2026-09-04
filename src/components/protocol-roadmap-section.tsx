import { Code2, Coins, Globe2, LayoutDashboard, Layers3, RefreshCcw, Rocket, ShieldCheck } from "lucide-react"
import { SectionEyebrow, SectionTitle } from "@/components/shared"
import type { AppLocale } from "@/i18n/locales"
import { withMarketingI18n } from "@/lib/content-i18n/with-marketing-i18n"

type RoadmapStatus = "Released" | "In Progress" | "Q2" | "Q3" | "Q4" | "Q1 2027"

const roadmapPhases: {
  title: string
  summary: string
  milestones: { label: string; status: RoadmapStatus }[]
}[] = [
  {
    title: "Phase 1 - Borrow Market",
    summary: "Borrow against LP positions with pricing, risk checks, and liquidation controls.",
    milestones: [
      { label: "Borrow pricing engine", status: "Q3" },
      { label: "Oracle and risk parameters", status: "Q3" },
      { label: "Health factor model", status: "Q3" },
      { label: "Borrow / repay contracts", status: "Q3" },
      { label: "LP valuation model", status: "Q3" },
      { label: "Liquidation engine", status: "Q3" },
      { label: "Testnet LP support", status: "Q3" },
      { label: "Borrow dashboard", status: "Q3" },
      { label: "Real-time risk monitoring", status: "Q3" },
      { label: "Collateral Swap", status: "Q3" },
      { label: "Debt Swap", status: "Q3" },
      { label: "Repay with Collateral", status: "Q3" },
      { label: "Mainnet borrow launch", status: "Q3" },
    ],
  },
  {
    title: "Phase 2 - Lend Market",
    summary: "Supply capital to back LP borrowing and earn yield from the market.",
    milestones: [
      { label: "Supply and withdraw flows", status: "Q4" },
      { label: "Yield accrual engine", status: "Q4" },
      { label: "Lender dashboard", status: "Q4" },
      { label: "Incentive distribution", status: "Q4" },
      { label: "Market reporting", status: "Q4" },
      { label: "Lend market launch", status: "Q4" },
      { label: "Liquidity routing support", status: "Q4" },
      { label: "Smart contract audit V2", status: "Q4" },
      { label: "Governance v1", status: "Q4" },
    ],
  },
  {
    title: "Phase 3 - Multiply Market",
    summary: "Open LP-backed leverage positions and manage them with a single workflow.",
    milestones: [
      { label: "Multiply workflow design", status: "Q1 2027" },
      { label: "Position packaging", status: "Q1 2027" },
      { label: "Loop and leverage engine", status: "Q1 2027" },
      { label: "Auto-deleverage controls", status: "Q1 2027" },
      { label: "Cross-chain support", status: "Q1 2027" },
      { label: "LP pair coverage", status: "Q1 2027" },
      { label: "Multiply risk controls", status: "Q1 2027" },
      { label: "Smart contract audit V3", status: "Q1 2027" },
      { label: "Multiply market launch", status: "Q1 2027" },
    ],
  },
]

function getRoadmapStatusClass() {
  return "text-type-accent"
}

function getRoadmapStatusLabel(status: RoadmapStatus) {
  if (status === "Released") return "Released"
  if (status === "In Progress") return "In Progress"
  if (status === "Q1 2027") return "Target Q1 2027"
  return `Target ${status} 2026`
}

function getRoadmapGroupOpacity(status: RoadmapStatus) {
  if (status === "Released" || status === "In Progress") return ""
  if (status === "Q2") return "opacity-95"
  if (status === "Q3") return "opacity-85"
  return "opacity-75"
}

function getRoadmapDisplayLabel(label: string) {
  const shortLabels: Record<string, string> = {
    "Borrow pricing engine": "Pricing engine",
    "Oracle and risk parameters": "Oracle and risk parameters",
    "Borrow / repay contracts": "Borrow / repay contracts",
    "Real-time risk monitoring": "Risk monitoring",
    "Collateral Swap": "Collateral Swap",
    "Debt Swap": "Debt Swap",
    "Repay with Collateral": "Repay with Collateral",
    "Mainnet borrow launch": "Borrow launch",
    "Supply and withdraw flows": "Supply / withdraw flows",
    "Yield accrual engine": "Yield accrual engine",
    "Lend market launch": "Lend launch",
    "Liquidity routing support": "Routing support",
    "Multiply workflow design": "Workflow design",
    "Loop and leverage engine": "Loop engine",
    "Auto-deleverage controls": "Auto-deleverage controls",
    "Cross-chain support": "Cross-chain support",
    "LP pair coverage": "LP pair coverage",
    "Multiply market launch": "Multiply launch",
  }

  return shortLabels[label] ?? label
}

function RoadmapMilestoneIcon({ label }: { label: string }) {
  const normalized = label.toLowerCase()
  const iconClassName = "h-3.5 w-3.5 text-type-accent"

  if (
    normalized.includes("risk") ||
    normalized.includes("liquidation") ||
    normalized.includes("ltv") ||
    normalized.includes("oracle") ||
    normalized.includes("audit") ||
    normalized.includes("health")
  ) {
    return <ShieldCheck className={iconClassName} aria-hidden="true" />
  }

  if (
    normalized.includes("dashboard") ||
    normalized.includes("interface") ||
    normalized.includes("ui") ||
    normalized.includes("monitoring")
  ) {
    return <LayoutDashboard className={iconClassName} aria-hidden="true" />
  }

  if (normalized.includes("token") || normalized.includes("ava")) {
    return <Coins className={iconClassName} aria-hidden="true" />
  }

  if (normalized.includes("loop") || normalized.includes("leverage")) {
    return <RefreshCcw className={iconClassName} aria-hidden="true" />
  }

  if (
    normalized.includes("base") ||
    normalized.includes("arbitrum") ||
    normalized.includes("cross-chain") ||
    normalized.includes("deployment")
  ) {
    return <Globe2 className={iconClassName} aria-hidden="true" />
  }

  if (normalized.includes("pool")) {
    return <Layers3 className={iconClassName} aria-hidden="true" />
  }

  if (normalized.includes("launch") || normalized.includes("sandbox") || normalized.includes("testnet")) {
    return <Rocket className={iconClassName} aria-hidden="true" />
  }

  return <Code2 className={iconClassName} aria-hidden="true" />
}

export default async function ProtocolRoadmapSection({ locale }: { locale: AppLocale }) {
  return withMarketingI18n(locale, ['protocol-roadmap-section'], (
    <section className="space-y-8" id="roadmap">
      <div className="space-y-3">
        <SectionEyebrow tone="cyan">What comes next</SectionEyebrow>
        <SectionTitle>Roadmap</SectionTitle>
      </div>

      <p className="type-body-copy">
        Avana develops in three phases. Each phase builds on the one before it: Borrow Markets,
        Lend Markets, then Multiply Markets.
      </p>

      <div className="flex flex-col gap-10">
        {roadmapPhases.map((phase, index) => {
          const statusOrder: RoadmapStatus[] = ["Released", "In Progress", "Q2", "Q3", "Q4", "Q1 2027"]
          const groupedMilestones = statusOrder
            .map((status) => ({
              status,
              items: phase.milestones.filter((milestone) => milestone.status === status),
            }))
            .filter((group) => group.items.length > 0)

          return (
            <div key={phase.title} className={index === 0 ? "space-y-4" : "space-y-4 pt-2"}>
              <div className="space-y-2">
                <h3 className="type-body-copy text-foreground">
                  {phase.title}
                </h3>
                <p className="type-body-copy">{phase.summary}</p>
              </div>

              <div className="space-y-3">
                {groupedMilestones.map((group) => (
                  <div key={`${phase.title}-${group.status}`} className={`space-y-2 ${getRoadmapGroupOpacity(group.status)}`}>
                    <p className={`type-meta-label ${getRoadmapStatusClass()}`}>
                      {getRoadmapStatusLabel(group.status)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((milestone) => (
                        <div
                          key={milestone.label}
                          className="flex items-center gap-2 rounded-md border border-border bg-muted px-2.5 py-1.5"
                        >
                          <RoadmapMilestoneIcon label={milestone.label} />
                          <span className="text-sm font-medium leading-tight text-foreground">
                            {getRoadmapDisplayLabel(milestone.label)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  ))
}
