import dynamic from "next/dynamic"
import type { CSSProperties } from "react"

const DeferredScrollSpySidebar = dynamic(
  () => import("@/components/scroll-spy-sidebar").then((module) => module.ScrollSpySidebar),
  {
    loading: () => null,
  },
)

interface DeveloperScrollSpyRailProps {
  sections: Array<{ id: string; title: string }>
  pageSummary?: string
  sectionColor?: "blue" | "emerald" | "violet" | "amber" | "cyan" | "rose" | "slate"
}

export function DeveloperScrollSpyRail({
  sections,
  pageSummary,
}: DeveloperScrollSpyRailProps) {
  return (
    <aside
      className="hidden w-[17rem] shrink-0 xl:block xl:sticky xl:top-32 xl:self-start xl:pr-2"
      // Every developer page's "On this page" entries use the page summary's text size.
      style={{ "--type-sidebar-link-size": "var(--type-sidebar-summary-size)" } as CSSProperties}
    >
      <DeferredScrollSpySidebar
        sections={sections}
        pageSummary={pageSummary}
        sectionColor="cyan"
      />
    </aside>
  )
}
