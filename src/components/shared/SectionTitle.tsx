import { cn } from "@/lib/utils"

interface SectionTitleProps {
  children: React.ReactNode
  className?: string
  as?: "h1" | "h2" | "h3"
  variant?: "display" | "index" | "section" | "lead"
}

// "lead" is the dark first line; "section" is the gray second line of a section
// header (matching MarketingLeadHeader). display/index stay dark page titles.
const variantClasses = {
  display: "type-display-title text-foreground",
  index: "type-index-title text-foreground",
  section: "type-lead-subtitle",
  lead: "type-lead-title",
} as const

export function SectionTitle({
  children,
  className = "",
  as: Tag = "h2",
  variant = "section",
}: SectionTitleProps) {
  return (
    <Tag
      className={cn(
        "site-section-title text-left",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </Tag>
  )
}

export default SectionTitle
