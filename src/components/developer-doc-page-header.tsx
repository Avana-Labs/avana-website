import dynamic from "next/dynamic"
import type { ReactNode } from "react"

interface DeveloperDocPageHeaderProps {
  title: string
  description?: string
  /** Shown right after the title, centred on its line; wraps under it on narrow screens. */
  badge?: ReactNode
}

const DeferredLlmExportMenu = dynamic(
  () => import("@/components/llm-export-menu").then((module) => module.LlmExportMenu),
  {
    loading: () => (
      <div
        aria-hidden="true"
        className="h-10 w-32 rounded-full border border-border bg-muted"
      />
    ),
  },
)

export function DeveloperDocPageHeader({ title, description, badge }: DeveloperDocPageHeaderProps) {
  const heading = (
    <h1 className="doc-page-title min-w-0 text-foreground">
      {title}
    </h1>
  )
  return (
    <div className="mb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {badge ? (
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
            {heading}
            {badge}
          </div>
        ) : (
          heading
        )}

        <div className="relative self-start" data-export-skip>
          <DeferredLlmExportMenu />
        </div>
      </div>

      {description ? (
        <p className="type-doc-body mt-5 max-w-3xl">{description}</p>
      ) : null}
    </div>
  )
}
