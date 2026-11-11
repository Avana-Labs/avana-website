import type React from "react"
import dynamic from "next/dynamic"
import { DocSectionReveal } from "./doc-section-reveal"

const DeferredPageNavigation = dynamic(
  () => import("./page-navigation").then((module) => module.PageNavigation),
  {
    loading: () => <div aria-hidden="true" className="mt-12 border-t border-gray-200 pt-6" />,
  },
)

export function DeveloperContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="developer-content pb-20 lg:pb-24" data-developer-doc-shell>
      {children}
      <DocSectionReveal />
      <div data-export-skip>
        <DeferredPageNavigation />
      </div>
    </div>
  )
}
