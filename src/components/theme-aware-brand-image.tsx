import Image from "next/image"
import type { ThemeBrandAsset } from "@/lib/brand-assets"

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
  return (
    <Image
      src={asset.light}
      alt={alt}
      width={3000}
      height={1500}
      className={`h-auto object-contain ${knockOutLightBackground ? "brand-token-image" : ""} ${className}`}
    />
  )
}
