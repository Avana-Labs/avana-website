"use client"

import { useRef, useState } from "react"
import { SectionEyebrow, SectionTitle } from "@/components/shared"
import { useLocalizedPhrase, usePhraseMap, lookupPhrase } from "@/components/phrase-map-context"
import { cn } from "@/lib/utils"

type ApyStage = {
  title: string
  description: string
  minApy: number
  maxApy: number
}

type HeatmapCell = {
  apy: number
  band: "inactive" | "base" | "premium" | "risk"
}

const APY_STAGES: readonly ApyStage[] = [
  {
    title: "Hub Base Rate",
    description: "Supplier yield begins with shared liquidity at the Avana Hub and adjusts as LP-backed borrowing demand, utilization, and market rates change.",
    minApy: 0,
    maxApy: 3,
  },
  {
    title: "Spoke Premium",
    description: "LP-backed borrower demand in each spoke adds a second layer of APY on top of the hub floor.",
    minApy: 3,
    maxApy: 9,
  },
  {
    title: "Pool Risk Adjustment",
    description: "Specific pool risk contributes the final spread, lifting return potential for the same idle cash.",
    minApy: 9,
    maxApy: 20,
  },
] as const

const HEATMAP_ROWS = 5
const HEATMAP_COLUMNS_LINEAR = 20
const STAGE_FILLED_COUNTS = [20, 60, 100] as const
const BAND_COLORS = {
  inactive: "var(--apy-band-inactive)",
  base: "var(--apy-band-base)",
  premium: "var(--apy-band-premium)",
  risk: "var(--apy-band-risk)",
} as const

function buildHeatmap(stageIndex: number): HeatmapCell[][] {
  const stage = APY_STAGES[stageIndex]
  const filledCount = STAGE_FILLED_COUNTS[stageIndex]

  return Array.from({ length: HEATMAP_COLUMNS_LINEAR }, (_, column) =>
    Array.from({ length: HEATMAP_ROWS }, (_, row) => {
      const linearIndex = column * HEATMAP_ROWS + row
      const progress = linearIndex / (HEATMAP_COLUMNS_LINEAR * HEATMAP_ROWS - 1)
      const apy = Number((stage.minApy + progress * (stage.maxApy - stage.minApy)).toFixed(1))
      let band: HeatmapCell["band"] = "inactive"

      if (linearIndex < filledCount) {
        band = "base"
      }

      if (stageIndex >= 1 && linearIndex >= STAGE_FILLED_COUNTS[0] && linearIndex < STAGE_FILLED_COUNTS[1]) {
        band = "premium"
      }

      if (stageIndex >= 2 && linearIndex >= STAGE_FILLED_COUNTS[1]) {
        band = "risk"
      }

      return {
        apy,
        band,
      }
    }),
  )
}

export default function InvestApySection() {
  const map = usePhraseMap()
  const t = (text: string) => lookupPhrase(map, text)
  const [activeStageIndex, setActiveStageIndex] = useState(0)
  const activeStage = APY_STAGES[activeStageIndex]
  const heatmap = buildHeatmap(activeStageIndex)
  const touchStartX = useRef<number | null>(null)
  const eyebrow = useLocalizedPhrase("Understand what drives your rate")
  const sectionTitle = useLocalizedPhrase("See how Hub utilization, Spoke premiums, and pool risk contribute to APY.")

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current
    const endX = event.changedTouches[0]?.clientX

    if (startX === null || endX === undefined) {
      touchStartX.current = null
      return
    }

    const deltaX = endX - startX
    const threshold = 40

    if (deltaX <= -threshold && activeStageIndex < APY_STAGES.length - 1) {
      setActiveStageIndex((current) => Math.min(current + 1, APY_STAGES.length - 1))
    }

    if (deltaX >= threshold && activeStageIndex > 0) {
      setActiveStageIndex((current) => Math.max(current - 1, 0))
    }

    touchStartX.current = null
  }

  return (
    <section className="bg-white site-section-gap">
      <div className="site-content-shell">
        <div className="space-y-4">
          <SectionEyebrow tone="cyan">{eyebrow}</SectionEyebrow>
          <SectionTitle className="max-w-none">
            {sectionTitle}
          </SectionTitle>
        </div>

        <div className="mt-10">
          <div className="space-y-5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="type-card-title text-[clamp(1.4rem,2vw,2rem)] tracking-[-0.05em]">
                {`${activeStage.minApy.toFixed(1)}% ${t("to")} ${activeStage.maxApy.toFixed(1)}%`}
              </span>
              <span className="type-meta-label">
                {t(activeStage.title)}
              </span>
            </div>

            <div
              data-slot="apy-heatmap"
              className="touch-pan-y overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="flex min-w-max w-full gap-2.5 md:gap-3">
                {heatmap.map((column, columnIndex) => (
                  <div key={`column-${columnIndex}`} className="flex min-w-[0.95rem] flex-1 flex-col gap-2.5 md:min-w-[1.1rem] md:gap-3">
                    {column.map((cell, rowIndex) => (
                      <div
                        key={`cell-${columnIndex}-${rowIndex}`}
                        data-slot="apy-cell"
                        data-band={cell.band}
                        data-active={cell.band !== "inactive"}
                        role="img"
                        aria-label={`${cell.apy.toFixed(1)}% APY`}
                        className="aspect-square w-full rounded-[5px] transition-colors duration-500"
                        style={{ backgroundColor: BAND_COLORS[cell.band] }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 md:gap-8">
            {APY_STAGES.map((stage, index) => {
              const active = index === activeStageIndex

              return (
                <button
                  key={stage.title}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveStageIndex(index)}
                  className="flex min-h-[5rem] flex-col items-start text-left md:min-h-[8rem]"
                >
                  <div
                    className={cn(
                      "mb-5 h-[3px] w-full rounded-full transition-colors duration-200",
                      active ? "bg-[#01AACF]" : "bg-muted",
                    )}
                  />
                  <h3
                    className={cn(
                      "type-card-title text-[clamp(0.92rem,3.6vw,1.9rem)] leading-[1.06] tracking-[-0.05em] transition-colors duration-200",
                      active ? "text-type-accent" : "text-type-tertiary",
                    )}
                  >
                    {t(stage.title)}
                  </h3>
                  {active ? (
                    <p className="type-body-copy mt-4 hidden max-w-[20rem] md:block">
                      {t(stage.description)}
                    </p>
                  ) : null}
                </button>
              )
            })}
          </div>

          <p className="type-body-copy mt-4 md:hidden">
            {t(activeStage.description)}
          </p>
        </div>
      </div>
    </section>
  )
}
