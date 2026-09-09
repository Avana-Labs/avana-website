import { cn } from "@/lib/utils"
import { getTokenIconSrc } from "@/lib/token-icons"

interface TokenLogoProps {
  symbol: string
  className?: string
}

/**
 * Server component on purpose: the homepage pool marquees render well over a
 * hundred of these, and a client boundary each is hydration the browser would
 * do for markup that never changes.
 */
export function TokenLogo({ symbol, className }: TokenLogoProps) {
  const src = getTokenIconSrc(symbol)

  if (!src) {
    const initials = symbol.slice(0, 3).toUpperCase()
    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[0.55rem] font-semibold text-foreground",
          className,
        )}
      >
        {initials}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={28}
      height={28}
      loading="lazy"
      decoding="async"
      className={cn("h-7 w-7 shrink-0 rounded-full object-contain", className)}
    />
  )
}
