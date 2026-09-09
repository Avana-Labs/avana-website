import { cn } from "@/lib/utils"

export type SectionEyebrowTone =
  | "blue"
  | "emerald"
  | "violet"
  | "amber"
  | "cyan"
  | "rose"
  | "slate"

interface SectionEyebrowProps {
  children: React.ReactNode
  className?: string
  tone?: SectionEyebrowTone
}

export function SectionEyebrow({ children, className = "" }: SectionEyebrowProps) {
  // Rendered as the dark medium first line of the section header, matching
  // MarketingLeadHeader. `tone` is accepted for API compatibility but no longer
  // affects color.
  return (
    <span className={cn("type-lead-title block w-full", className)}>
      {children}
    </span>
  )
}

export default SectionEyebrow
