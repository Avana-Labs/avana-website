"use client"

import { useSyncExternalStore } from "react"

const query = "(min-width: 1280px)"

function subscribe(onChange: () => void) {
  const media = window.matchMedia(query)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

/** Keep the desktop SSR fallback; discard hidden desktop trees on small screens. */
export function useDesktopLayout() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => true)
}
