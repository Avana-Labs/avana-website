"use client"

import Image from "next/image"
import { readResolvedThemeFromDocument } from "@/components/theme-provider"
import type { ThemeBrandAsset } from "@/lib/brand-assets"
import { useSyncExternalStore } from "react"

function useResolvedThemeAppearance(): "light" | "dark" {
  return useSyncExternalStore(
    () => () => {},
    () => readResolvedThemeFromDocument(),
    () => "light",
  )
}

export function ThemeAwareBrandImage({
  asset,
  alt,
  className,
  knockOutLightBackground = false,
}: {
  asset: ThemeBrandAsset
  alt: string
  className: string
  knockOutLightBackground?: boolean
}) {
  const appearance = useResolvedThemeAppearance()
  const src = appearance === "dark" ? asset.dark : asset.light

  return (
    <Image
      src={src}
      alt={alt}
      width={3000}
      height={1500}
      className={`h-auto object-contain ${knockOutLightBackground ? "brand-token-image" : ""} ${className}`}
    />
  )
}
