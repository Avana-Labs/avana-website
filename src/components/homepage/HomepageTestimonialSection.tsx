"use client"

import { useEffect, useRef, useState } from "react"
import { SectionEyebrow, SectionTitle } from "@/components/shared"
import { lookupPhrase, usePhraseMap } from "@/components/phrase-map-context"
import { useSectionActivity } from "@/components/ui/use-section-activity"

const FEATURE_DURATION = 10000
const TRANSITION_DURATION = 300

const featureHighlights = [
  {
    label: "Leverage you control",
    description:
      "Set how aggressive each loop runs and stop where the risk still feels right. Every multiply market caps leverage to what its LP collateral, oracle pricing, and liquidation route can safely support, so a position cannot fold beyond its limits.",
  },
  {
    label: "Live health on every loop",
    description:
      "Each added loop updates your health factor, borrowing power, and liquidation threshold in real time, so you can see exactly how much buffer a leverage setting leaves before the position drifts toward the edge.",
  },
  {
    label: "Controlled unwind",
    description:
      "If a leveraged position approaches its limit, Avana unwinds loops in steps, repaying debt and reducing exposure gradually instead of closing everything at once. Uncollected fees are applied first, and any surplus is returned to you.",
  },
  {
    label: "Per-market leverage limits",
    description:
      "Leverage is only enabled for LP types with reliable valuation, defined risk parameters, and tested unwind assumptions. Isolated Spoke markets keep stress in one leveraged pool from cascading into unrelated positions.",
  },
]

export default function HomepageTestimonialSection() {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const transitionTimerRef = useRef<number | null>(null)
  const { ref, isActive } = useSectionActivity<HTMLDivElement>()

  useEffect(() => {
    if (!isActive) return

    let transitionTimer: number | undefined

    const advanceTimer = window.setTimeout(() => {
      setIsAnimating(true)
      transitionTimer = window.setTimeout(() => {
        setCurrentFeature((previous) => (previous + 1) % featureHighlights.length)
        setIsAnimating(false)
      }, TRANSITION_DURATION)
    }, FEATURE_DURATION)

    return () => {
      window.clearTimeout(advanceTimer)
      if (transitionTimer) {
        window.clearTimeout(transitionTimer)
      }
    }
  }, [currentFeature, isActive])

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current)
      }
    }
  }, [])

  const handleFeatureChange = (index: number) => {
    if (index === currentFeature) {
      return
    }

    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current)
    }

    setIsAnimating(true)
    transitionTimerRef.current = window.setTimeout(() => {
      setCurrentFeature(index)
      setIsAnimating(false)
      transitionTimerRef.current = null
    }, TRANSITION_DURATION)
  }

  const feature = featureHighlights[currentFeature]
  const map = usePhraseMap()
  const t = (text: string) => lookupPhrase(map, text)

  return (
    <div
      ref={ref}
      data-performance-active={isActive ? "true" : "false"}
    >
      <div className="mb-8 space-y-3 md:mb-10">
        <SectionEyebrow tone="rose">{t("Safety by design")}</SectionEyebrow>
        <SectionTitle>{t("Leverage with risk controls built in")}</SectionTitle>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-2/5 lg:border-r border-gray-200 lg:pr-8">
          {featureHighlights.map((entry, index) => (
            <div
              key={entry.label}
              onClick={() => handleFeatureChange(index)}
              onKeyDown={(event) => event.key === "Enter" && handleFeatureChange(index)}
              className="cursor-pointer py-4 border-b border-gray-100 last:border-b-0"
              role="button"
              tabIndex={0}
              aria-label={t(`View ${entry.label}`)}
              aria-pressed={currentFeature === index}
            >
              <div className="flex justify-between items-center gap-6">
                <span className={`text-base transition-colors duration-300 ${currentFeature === index ? "text-foreground" : "text-type-tertiary"}`}>
                  {t(entry.label)}
                </span>
                <span className={`type-meta-label transition-colors duration-300 ${currentFeature === index ? "text-type-secondary" : "text-type-tertiary"}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="h-0.5 mt-3 w-full bg-gray-200 overflow-hidden">
                {currentFeature === index ? (
                  <div
                    key={`progress-${currentFeature}`}
                    className="h-full bg-gray-900"
                    style={{
                      animation: `feature-highlight-progress ${FEATURE_DURATION}ms linear forwards`,
                      transformOrigin: "left center",
                    }}
                  />
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:w-3/5 lg:pl-12 pt-8 lg:pt-0 flex flex-col justify-center">
          <div className={`min-h-[200px] md:min-h-[180px] transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
            <p className="type-section-lead max-w-[39rem]">
              {t(feature.description)}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes feature-highlight-progress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  )
}
