"use client"

/**
 * Content renders on the server by default. Opt into `defer` for nonessential
 * below-fold visuals; reserve their full height to avoid layout shifts.
 * Deferring a server-rendered child reduces the initial DOM, not its JS bundle.
 */

import { useEffect, useRef, useState, type ReactNode } from "react"

interface LazySectionProps {
  children: ReactNode
  /** Opt in only for nonessential, below-fold visuals. */
  defer?: boolean
  className?: string
  /** How far before the element enters viewport to trigger loading */
  rootMargin?: string
  /** Content to show while the section hasn't loaded yet */
  fallback?: ReactNode
  /** Minimum height to prevent layout shift */
  minHeight?: string
}

export function LazySection({
  children,
  defer = false,
  className = "",
  rootMargin = "100px",
  fallback = null,
  minHeight = "200px",
}: LazySectionProps) {
  // Keep ordinary localized content in SSR; only explicit opt-ins wait for IO.
  const [isVisible, setIsVisible] = useState(!defer)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || !defer) return
    const scheduleFrame = window.requestAnimationFrame
    const cancelFrame = window.cancelAnimationFrame

    // If IntersectionObserver isn't supported, render immediately
    if (!("IntersectionObserver" in window)) {
      const frame = scheduleFrame(() => setIsVisible(true))
      return () => cancelFrame(frame)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin,
        threshold: 0,
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [defer, rootMargin])

  return (
    <div
      ref={ref}
      className={className}
      style={{ minHeight: isVisible ? undefined : minHeight }}
    >
      {isVisible ? children : fallback}
    </div>
  )
}

export default LazySection
