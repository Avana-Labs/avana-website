"use client"

import { Check, Copy } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { lookupPhrase, usePhraseMap } from "@/components/phrase-map-context"
import { ThemeAwareBrandImage } from "@/components/theme-aware-brand-image"
import {
  brandGuidelineSurfaceClassName,
  brandLogoAssets,
  brandPreviewSurfaceClassName,
  brandTokenSurfaceClassName,
} from "@/lib/brand-assets"

type LogoVariant = "horizontal" | "vertical" | "icon"

interface BrandLogoVariant {
  id: LogoVariant
  title: string
  description: string
  asset: (typeof brandLogoAssets)[keyof typeof brandLogoAssets]
  alt: string
  mobileImageClassName: string
  desktopImageClassName: string
}

const mobileLogoImageClassName = "w-full max-w-[11rem]"
const logoImageClassName = "w-full max-w-[27rem]"

const logoVariants: readonly BrandLogoVariant[] = [
  {
    id: "horizontal",
    title: "Full Black",
    description:
      "Use this as the default Avana wordmark. It has the clearest contrast and works best on light backgrounds, product pages, partner decks, and documentation.",
    asset: brandLogoAssets.fullBlack,
    alt: "Avana full black logo",
    mobileImageClassName: mobileLogoImageClassName,
    desktopImageClassName: logoImageClassName,
  },
  {
    id: "vertical",
    title: "Full Cyan",
    description:
      "Use the cyan wordmark when the page already has a quiet layout and needs a stronger Avana signal. Keep it on white or very light backgrounds.",
    asset: brandLogoAssets.fullCyan,
    alt: "Avana full cyan logo",
    mobileImageClassName: mobileLogoImageClassName,
    desktopImageClassName: logoImageClassName,
  },
  {
    id: "icon",
    title: "Logo",
    description:
      "Use the icon when the full wordmark would be too small to read, such as app icons, social avatars, favicons, or compact partner lists.",
    asset: brandLogoAssets.icon,
    alt: "Avana logo",
    mobileImageClassName: mobileLogoImageClassName,
    desktopImageClassName: logoImageClassName,
  },
] as const

const colorGroups = [
  {
    title: "Core Colors",
    description: "The Avana palette is intentionally simple: white for space, ink for clarity, and cyan for recognition.",
    colors: [
      {
        name: "Avana White",
        hex: "#FFFFFF",
        usage: "Primary surface for product pages, cards, documentation, and layouts that need room to breathe.",
      },
      {
        name: "Avana Ink",
        hex: "#0F1518",
        usage: "Main text and dark logo color. Use it when contrast and authority matter.",
      },
      {
        name: "Avana Cyan",
        hex: "#01AACF",
        usage: "Primary accent for active states, links, key highlights, and Avana-led calls to action.",
      },
    ],
  },
] as const

function useMarketingPhrase() {
  const map = usePhraseMap()
  return (text: string) => lookupPhrase(map, text)
}

export function BrandLogoShowcase() {
  const t = useMarketingPhrase()
  const [activeLogoVariant, setActiveLogoVariant] = useState<LogoVariant>("horizontal")

  return (
    <div className="grid items-start gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-0">
        {logoVariants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            className={`flex w-full flex-col gap-3 border-t border-border py-5 text-left transition-all duration-200 ${
              activeLogoVariant === variant.id ? "opacity-100" : "opacity-50 hover:opacity-75"
            }`}
            onMouseEnter={() => setActiveLogoVariant(variant.id)}
            onFocus={() => setActiveLogoVariant(variant.id)}
            onClick={() => setActiveLogoVariant(variant.id)}
          >
            <div className={`brand-logo-preview relative flex aspect-[7/3] items-center justify-center p-4 ${brandPreviewSurfaceClassName} md:hidden`}>
              <ThemeAwareBrandImage
                asset={variant.asset}
                alt={t(variant.alt)}
                className={variant.mobileImageClassName}
              />
            </div>
            <h3 className="text-xl font-semibold text-foreground">{t(variant.title)}</h3>
            <p className="text-sm leading-relaxed text-gray-500">{t(variant.description)}</p>
          </button>
        ))}
      </div>

      <div className={`brand-logo-preview group relative hidden h-[400px] items-center justify-center p-6 ${brandPreviewSurfaceClassName} md:flex`}>
        {logoVariants.map((variant) => (
          <div
            key={variant.id}
            className={`absolute flex items-center justify-center text-[#6DB0EA] transition-all duration-300 ease-in-out ${
              activeLogoVariant === variant.id ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            <ThemeAwareBrandImage
              asset={variant.asset}
              alt={t(variant.alt)}
              className={variant.desktopImageClassName}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

const guidelineAvoidItems = [
  { text: "Do not stretch or compress the logo.", icon: "stretch" },
  { text: "Do not rotate or flip the mark.", icon: "rotate" },
  { text: "Do not recolor the logo outside approved colorways.", icon: "recolor" },
  { text: "Do not crop the mark or place it too close to an edge.", icon: "crop" },
  { text: "Do not add shadows, gradients, outlines, or effects.", icon: "effects" },
  { text: "Do not crowd the mark with partner logos or UI labels.", icon: "spacing" },
] as const

export function BrandGuidelinesGrid() {
  const t = useMarketingPhrase()

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {guidelineAvoidItems.map((item, index) => (
        <div key={index} className="relative flex flex-col items-center gap-3">
          <div className={`relative flex aspect-square w-full items-center justify-center overflow-hidden p-4 ${brandGuidelineSurfaceClassName}`}>
            {item.icon === "stretch" ? (
              <div className="origin-center scale-x-125 scale-y-75">
                <ThemeAwareBrandImage
                  asset={brandLogoAssets.fullBlack}
                  alt={t("Stretched logo example")}
                  className="w-full max-w-[11rem]"
                />
              </div>
            ) : null}
            {item.icon === "rotate" ? (
              <div className="rotate-45">
                <ThemeAwareBrandImage
                  asset={brandLogoAssets.iconBlack}
                  alt={t("Rotated icon example")}
                  className="w-full max-w-[7rem]"
                />
              </div>
            ) : null}
            {item.icon === "recolor" ? (
              <div className="flex items-center gap-1.5">
                <div className="text-[#9E5537] hue-rotate-60 saturate-150">
                  <ThemeAwareBrandImage
                    asset={brandLogoAssets.iconPersonal}
                    alt={t("Recolored logo example")}
                    className="w-full max-w-[5.5rem]"
                  />
                </div>
                <div className="text-[#BC846F] hue-rotate-180 saturate-150">
                  <ThemeAwareBrandImage
                    asset={brandLogoAssets.iconPersonal}
                    alt={t("Second recolored logo example")}
                    className="w-full max-w-[5.5rem]"
                  />
                </div>
              </div>
            ) : null}
            {item.icon === "crop" ? (
              <div className="-mr-16 overflow-hidden">
                <ThemeAwareBrandImage
                  asset={brandLogoAssets.iconBlack}
                  alt={t("Cropped logo example")}
                  className="w-full max-w-[8rem]"
                />
              </div>
            ) : null}
            {item.icon === "effects" ? (
              <div className="blur-[1.5px] drop-shadow-[0_16px_12px_rgba(1,170,207,0.45)]">
                <ThemeAwareBrandImage
                  asset={brandLogoAssets.iconBlack}
                  alt={t("Logo with effects example")}
                  className="w-full max-w-[7rem]"
                />
              </div>
            ) : null}
            {item.icon === "spacing" ? (
              <div className="flex items-center gap-0.5">
                <ThemeAwareBrandImage
                  asset={brandLogoAssets.iconBlack}
                  alt={t("Crowded spacing example")}
                  className="w-full max-w-[4.5rem]"
                />
                <span className="text-base font-semibold text-[#2F414B] dark:text-foreground">{t("Partner")}</span>
              </div>
            ) : null}
            <span className="pointer-events-none absolute inset-x-5 top-1/2 h-1 -translate-y-1/2 rotate-[-48deg] rounded-full bg-[#ff8f6f]" />
          </div>
          <p className="text-center text-xs leading-tight text-gray-600 dark:text-type-secondary">{t(item.text)}</p>
        </div>
      ))}
    </div>
  )
}

export function BrandTokenPreview({
  src,
  alt,
  imageClassName,
}: {
  src: string
  alt: string
  imageClassName: string
}) {
  return (
    <div className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden p-6 ${brandTokenSurfaceClassName}`}>
      <ThemeAwareBrandImage
        asset={{ light: src, dark: src }}
        alt={alt}
        className={imageClassName}
        knockOutLightBackground
      />
    </div>
  )
}

export function BrandColorPalette() {
  const t = useTranslations("common.exportMenu")
  const phrase = useMarketingPhrase()
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const resetTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text)
    setCopiedColor(text)

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current)
    }

    resetTimerRef.current = window.setTimeout(() => {
      setCopiedColor(null)
      resetTimerRef.current = null
    }, 2000)
  }

  return (
    <div className="space-y-12">
      {colorGroups.map((group) => (
        <div key={group.title} className="grid items-start gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-semibold text-foreground">{phrase(group.title)}</h3>
            <p className="text-sm leading-relaxed text-gray-500">{phrase(group.description)}</p>
          </div>

          <div className="flex flex-col gap-4">
            {group.colors.map((color) => (
              <div
                key={color.hex}
                className="flex items-stretch gap-4 overflow-hidden rounded-[20px] border border-[#2F414B]/10"
              >
                <button
                  type="button"
                  className="group relative h-24 w-24 flex-shrink-0 cursor-pointer md:h-28 md:w-28"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => copyToClipboard(color.hex)}
                >
                  {color.hex === "#FFFFFF" ? (
                    <div className="absolute inset-0 border-r border-[#2F414B]/10" />
                  ) : null}
                  <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-gray-600 opacity-0 transition-opacity group-hover:opacity-100">
                    {copiedColor === color.hex ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    {copiedColor === color.hex ? t("copied") : color.hex}
                  </span>
                </button>
                <div className="flex min-w-0 flex-1 flex-col justify-center py-3 pr-3">
                  <p className="font-semibold text-foreground">{phrase(color.name)}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{phrase(color.usage)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
