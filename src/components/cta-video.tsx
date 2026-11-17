"use client"

import { useEffect, useRef, useState } from "react"

// Hashed names, so the files can be cached for a year (see next.config.ts).
const WEBM = "/media/avana-cta.4af545c9.webm"
const ANIMATED_WEBP = "/media/avana-cta.3aca2b96.webp"
const POSTER = "/media/avana-cta-poster.9fa10edf.webp"

const BOX = { width: "28rem", maxWidth: "100%", aspectRatio: "16 / 9" } as const

/**
 * WebKit (Safari on macOS, and every browser on iOS) does not render the alpha channel of a
 * VP9 WebM, so it gets the same animation as an animated WebP instead.
 */
function needsAnimatedImage() {
  const ua = navigator.userAgent
  const iOS = /iP(hone|ad|od)/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  const safari = /Safari\//.test(ua) && !/(Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS)\//.test(ua)
  return iOS || safari
}

/**
 * The CTA logo animation sits far below the fold. This island keeps it from loading on
 * initial page open: the animation is only attached (and playback started) once the viewer
 * scrolls within range of the FAQ/CTA. The poster frame shows until then, so the box is
 * never blank. If the video cannot play, the animated image takes its place.
 */
export function CtaVideo() {
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(false)
  const [mode, setMode] = useState<"video" | "image">("video")

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          if (needsAnimatedImage()) setMode("image")
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
    if (active && mode === "video") videoRef.current?.play().catch(() => {})
  }, [active, mode])

  return (
    <div ref={ref} className="mx-auto mb-4" style={BOX} aria-hidden="true">
      {mode === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element -- an animated WebP must not go through the optimizer
        <img src={active ? ANIMATED_WEBP : POSTER} alt="" width={960} height={540} className="h-full w-full" decoding="async" />
      ) : (
        <video
          ref={videoRef}
          className="h-full w-full"
          poster={POSTER}
          muted
          loop
          autoPlay
          playsInline
          preload="none"
          // Switch to the animated image instead of leaving the box blank.
          onError={() => setMode("image")}
        >
          {active ? <source src={WEBM} type='video/webm; codecs="vp9"' onError={() => setMode("image")} /> : null}
        </video>
      )}
    </div>
  )
}
