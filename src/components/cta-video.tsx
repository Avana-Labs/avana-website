"use client"

import { useEffect, useRef, useState } from "react"

/**
 * The CTA logo animation sits far below the fold. This island keeps the large
 * video from loading on initial page open: the source is only attached (and
 * playback started) once the viewer scrolls within range of the FAQ/CTA.
 */
export function CtaVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true)
          observer.disconnect()
        }
      },
      // Start fetching a bit before it enters view so it is ready by the CTA.
      { rootMargin: "1000px 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (active) ref.current?.play().catch(() => {})
  }, [active])

  return (
    <video
      ref={ref}
      className="mx-auto mb-4"
      style={{ width: "28rem", maxWidth: "100%", aspectRatio: "16 / 9" }}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      src={active ? "/Avana-Transparent.webm" : undefined}
    />
  )
}
