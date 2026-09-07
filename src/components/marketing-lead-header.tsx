import { cn } from "@/lib/utils"

export function MarketingLeadHeader({
  title,
  subtitle,
  className,
}: {
  title: React.ReactNode
  subtitle: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("marketing-lead-header max-w-prose", className)}>
      <h2 className="type-md-lg text-foreground">{title}</h2>
      <div className="type-md-lg text-theme-text-sec mt-0.5">{subtitle}</div>
    </div>
  )
}
