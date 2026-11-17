"use client"

import { useEffect } from "react"
import { usePathname } from "@/i18n/navigation"

/** The horizontal scroll container of every docs table. */
const WRAPPER_SELECTOR = "div:has(> table.type-doc-table)"

/**
 * Marks each docs table container that scrolls sideways with `data-scroll-left` and
 * `data-scroll-right` while there is more table on that side. CSS fades that edge, so a
 * table cut off at the right shows that it scrolls. Tables that fit get neither mark.
 * New containers (a network switch on the reference pages, an opened collapsed group)
 * are picked up as they appear.
 */
export function DocTableScrollHints() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-developer-doc-shell]")
    if (!root || !("ResizeObserver" in window)) return

    const tracked = new Set<HTMLElement>()
    const update = (el: HTMLElement) => {
      const max = el.scrollWidth - el.clientWidth
      const overflows = max > 1
      el.toggleAttribute("data-scroll-left", overflows && el.scrollLeft > 1)
      el.toggleAttribute("data-scroll-right", overflows && el.scrollLeft < max - 1)
    }
    const onScroll = (event: Event) => update(event.currentTarget as HTMLElement)
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement
        update(tracked.has(el) ? el : (el.parentElement as HTMLElement))
      }
    })
    const track = () => {
      for (const el of root.querySelectorAll<HTMLElement>(WRAPPER_SELECTOR)) {
        if (tracked.has(el)) continue
        tracked.add(el)
        el.addEventListener("scroll", onScroll, { passive: true })
        resizeObserver.observe(el)
        const table = el.querySelector(":scope > table")
        if (table) resizeObserver.observe(table)
        update(el)
      }
    }

    track()
    const mutationObserver = new MutationObserver(track)
    mutationObserver.observe(root, { childList: true, subtree: true })

    return () => {
      mutationObserver.disconnect()
      resizeObserver.disconnect()
      for (const el of tracked) {
        el.removeEventListener("scroll", onScroll)
        el.removeAttribute("data-scroll-left")
        el.removeAttribute("data-scroll-right")
      }
    }
  }, [pathname])

  return null
}
