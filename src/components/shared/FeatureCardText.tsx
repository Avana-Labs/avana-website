import { cn } from "@/lib/utils"

interface FeatureCardTitleProps {
  children: React.ReactNode
  className?: string
  as?: "h2" | "h3" | "h4" | "p"
}

export function FeatureCardTitle({
  children,
  className = "",
  as: Tag = "h3",
}: FeatureCardTitleProps) {
  return (
    <Tag className={cn("feature-card-title", className)}>
      {children}
    </Tag>
  )
}

interface FeatureCardDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function FeatureCardDescription({
  children,
  className = "",
}: FeatureCardDescriptionProps) {
  return (
    <p className={cn("feature-card-description", className)}>
      {children}
    </p>
  )
}

export default FeatureCardTitle
