"use client"

import { useEffect, useRef, useState } from "react"

export function useSectionActivity<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T>(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || !("IntersectionObserver" in window)) return

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    let isIntersecting = false

    const updateActivity = () => {
      setIsActive(
        isIntersecting &&
          document.visibilityState === "visible" &&
          !reducedMotionQuery.matches,
      )
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting
        updateActivity()
      },
      { rootMargin, threshold: 0 },
    )

    observer.observe(element)
    document.addEventListener("visibilitychange", updateActivity)
    reducedMotionQuery.addEventListener("change", updateActivity)
    updateActivity()

    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", updateActivity)
      reducedMotionQuery.removeEventListener("change", updateActivity)
    }
  }, [rootMargin])

  return { ref, isActive }
}
