"use client"

import { useEffect } from "react"
import { useSectionActivity } from "@/components/ui/use-section-activity"

/**
 * The CTA logo animation sits far below the fold. This island keeps the large
 * video from loading on initial page open. The poster works without JavaScript;
 * playback follows visibility and the user's reduced-motion preference.
 */
export function CtaVideo() {
  const { ref, isActive } = useSectionActivity<HTMLVideoElement>("0px")

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    if (isActive && !saveData) {
      if (!element.getAttribute("src")) element.src = "/Avana-Transparent.webm"
      void element.play().catch(() => {})
    } else {
      element.pause()
    }
    return () => element.pause()
  }, [isActive, ref])

  return (
    <video
      ref={ref}
      onError={event => {
        event.currentTarget.pause()
        event.currentTarget.removeAttribute("src")
        event.currentTarget.load()
      }}
      className="mx-auto mb-4"
      style={{ width: "28rem", maxWidth: "100%", aspectRatio: "16 / 9" }}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      poster="/images/avana-wordmark.webp"
    />
  )
}
