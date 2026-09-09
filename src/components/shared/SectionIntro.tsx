import { cn } from "@/lib/utils"
import { SectionEyebrow, type SectionEyebrowTone } from "./SectionEyebrow"
import { SectionTitle } from "./SectionTitle"

interface SectionIntroProps {
  eyebrow?: React.ReactNode
  eyebrowTone?: SectionEyebrowTone
  title: React.ReactNode
  titleVariant?: "display" | "index" | "section"
  titleAs?: "h1" | "h2" | "h3"
  align?: "left" | "center"
  gap?: "sm" | "md"
  className?: string
  titleClassName?: string
}

export function SectionIntro({
  eyebrow,
  eyebrowTone = "blue",
  title,
  titleVariant = "section",
  titleAs = "h2",
  align = "left",
  gap = "md",
  className = "",
  titleClassName = "",
}: SectionIntroProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        gap === "sm" ? "gap-2" : "gap-3",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? <SectionEyebrow tone={eyebrowTone}>{eyebrow}</SectionEyebrow> : null}
      <SectionTitle
        as={titleAs}
        // With an eyebrow, the title is the gray second line; without one it is
        // the dark lead line.
        variant={!eyebrow && titleVariant === "section" ? "lead" : titleVariant}
        className={titleClassName}
      >
        {title}
      </SectionTitle>
    </div>
  )
}

export default SectionIntro
