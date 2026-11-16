"use client"

import { useTranslations } from "next-intl"
import type { ReactNode } from "react"
import { useCallback, useMemo, useSyncExternalStore } from "react"
import { DeveloperScrollSpyRail } from "@/components/developer-scroll-spy-rail"
import { cn } from "@/lib/utils"

export interface ReferenceNetworkTab {
  id: string
  title: string
  chainId: number
  sections: Array<{ id: string; title: string }>
}

interface ReferenceNetworkViewProps {
  header: ReactNode
  networks: ReferenceNetworkTab[]
  panels: ReactNode[]
  shared: ReactNode
  leadSections?: Array<{ id: string; title: string }>
  sharedSections: Array<{ id: string; title: string }>
  pageSummary: string
}

const QUERY_KEY = "network"
const CHANGE_EVENT = "reference-network-change"

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange)
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener("popstate", onChange)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

function readNetworkParam() {
  return new URLSearchParams(window.location.search).get(QUERY_KEY) ?? ""
}

/**
 * Network selector for the Reference pages. Only the selected network's panel
 * is mounted, so section ids stay unique and the scroll-spy rail follows it.
 * The choice is kept in `?network=` so links can point at one network.
 */
export function ReferenceNetworkView({
  header,
  networks,
  panels,
  shared,
  leadSections,
  sharedSections,
  pageSummary,
}: ReferenceNetworkViewProps) {
  const t = useTranslations("common.docs.reference")
  const requested = useSyncExternalStore(subscribe, readNetworkParam, () => "")
  const activeIndex = Math.max(
    networks.findIndex((network) => network.id === requested),
    0,
  )
  const active = networks[activeIndex]

  const select = useCallback((id: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set(QUERY_KEY, id)
    window.history.replaceState(window.history.state, "", url)
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [])

  const sections = useMemo(
    () => [...(leadSections ?? []), ...(active?.sections ?? []), ...sharedSections],
    [leadSections, active, sharedSections],
  )

  return (
    <div className="flex min-w-0 flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
      <div data-developer-doc-export-root className="min-w-0 w-full max-w-4xl flex-1">
        {header}

        {networks.length > 0 ? (
          <div className="mb-10">
            <p id="reference-network-label" className="mb-3 type-doc-body text-foreground">
              {t("network")}
            </p>
            <div
              role="tablist"
              aria-labelledby="reference-network-label"
              className="flex flex-wrap gap-2"
              data-export-skip
            >
              {networks.map((network, index) => {
                const selected = index === activeIndex
                return (
                  <button
                    key={network.id}
                    id={`reference-network-tab-${network.id}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="reference-network-panel"
                    onClick={() => select(network.id)}
                    className={cn(
                      "rounded-full border px-4 py-1.5 type-doc-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01AACF]",
                      selected
                        ? "border-[#01AACF] bg-[#01AACF]/10 text-foreground"
                        : "border-border text-type-secondary hover:border-gray-300 hover:text-foreground",
                    )}
                  >
                    {network.title}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}

        {active ? (
          <div
            // A new key per network remounts the panel, so nothing from the first network's markup is reused.
            key={active.id}
            id="reference-network-panel"
            role="tabpanel"
            aria-labelledby={`reference-network-tab-${active.id}`}
          >
            <p className="mb-6 type-doc-body text-type-secondary">
              {active.title} · {t("chainId")} {active.chainId}
            </p>
            {panels[activeIndex]}
          </div>
        ) : null}

        {shared}
      </div>
      <DeveloperScrollSpyRail sections={sections} pageSummary={pageSummary} sectionColor="slate" />
    </div>
  )
}
