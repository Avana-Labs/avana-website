"use client"

import { useEffect } from "react"
import { usePathname } from "@/i18n/navigation"

const SECTION_SELECTOR = "[data-developer-doc-export-root] > section"

/**
 * Reveals long docs pages section by section.
 *
 * Sections that start below the first screen are marked `data-reveal="pending"`
 * (hidden by CSS) and switch to `data-reveal="shown"` as they scroll into view.
 * Sections already on screen, the anchor target and everything above it are
 * never hidden. The content stays in the HTML for search, anchors and export;
 * CSS `content-visibility` skips their rendering work until they are near.
 */
export function DocSectionReveal() {
  const pathname = usePathname()

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const sections = Array.from(document.querySelectorAll<HTMLElement>(SECTION_SELECTOR))
    if (sections.length < 3) return

    const hashTarget = window.location.hash
      ? document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
      : null
    const hashIndex = hashTarget ? sections.findIndex((section) => section.contains(hashTarget)) : -1
    const foldLine = window.innerHeight

    const pending = sections.filter(
      (section, index) => index > hashIndex && section.getBoundingClientRect().top > foldLine,
    )
    if (pending.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const section = entry.target as HTMLElement
          section.dataset.reveal = "shown"
          observer.unobserve(section)
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    )

    for (const section of pending) {
      section.dataset.reveal = "pending"
      observer.observe(section)
    }

    return () => {
      observer.disconnect()
      for (const section of pending) delete section.dataset.reveal
    }
  }, [pathname])

  return null
}
