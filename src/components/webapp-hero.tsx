import { getImageProps } from "next/image"
import { preload } from "react-dom"
import type { AppLocale } from "@/i18n/locales"
import { withMarketingI18n } from "@/lib/content-i18n/with-marketing-i18n"
import { brandAssetPath } from "@/lib/brand-assets"
import mobileHeroAvifImage from "../../public/images/avana-phone-hero.avif"
import mobileHeroImage from "../../public/images/avana-phone-hero.webp"

const emptyHero = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
// Already 1086px wide; serving them directly skips the optimizer's per-deploy cold resize.
// Static imports give hashed /_next/static/media URLs, which are cached as immutable.
// The AVIF is about half the WebP's size; browsers without AVIF fall back to the WebP.
const mobileHeroAvif = mobileHeroAvifImage.src
const mobileHero = mobileHeroImage.src
const mobileMedia = "(width < 640px)"
const desktopMedia = "(width >= 640px)"

// mobileOnly renders just the phone image (the homepage shows the line field from sm up),
// so wider screens neither preload nor download the desktop screenshot.
export default async function WebappHero({
  locale,
  mobileOnly = false,
}: {
  locale: AppLocale
  mobileOnly?: boolean
}) {
  const { props: desktop } = getImageProps({
    src: brandAssetPath("/images/Avana Express Light.webp"),
    alt: "Avana Express homepage hero interface",
    fill: true,
    loading: "eager",
    fetchPriority: "high",
    quality: 85,
    sizes: "(max-width: 768px) 100vw, (max-width: 1536px) 64rem, 72rem",
  })

  // <picture> sources aren't preloaded by Next; media-gated preloads start the
  // matching hero from <head> without fetching the other viewport's image.
  // Only the AVIF is preloaded: browsers skip a preload whose type they can't decode,
  // so no browser downloads both mobile files.
  preload(mobileHeroAvif, { as: "image", type: "image/avif", fetchPriority: "high", media: mobileMedia })
  if (!mobileOnly) preload(desktop.src, {
    as: "image",
    imageSrcSet: desktop.srcSet,
    imageSizes: desktop.sizes,
    fetchPriority: "high",
    media: desktopMedia,
  })

  return withMarketingI18n(locale, ['webapp-hero'], (
    <div className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-[2/1] lg:aspect-[1672/941]">
      {/* Separate slots prevent a previous viewport's image lingering during decode.
          Media-gated sources keep the hidden slot from downloading an image. */}
      <picture className="sm:hidden">
        <source media={mobileMedia} srcSet={mobileHeroAvif} type="image/avif" />
        <source media={mobileMedia} srcSet={mobileHero} type="image/webp" />
        <img
          {...desktop}
          src={emptyHero}
          srcSet={undefined}
          sizes={undefined}
          alt={desktop.alt}
          className="object-contain object-center"
        />
      </picture>
      {!mobileOnly && <picture className="hidden sm:block">
        <source media={desktopMedia} srcSet={desktop.srcSet} sizes={desktop.sizes} />
        <img
          {...desktop}
          src={emptyHero}
          srcSet={undefined}
          alt={desktop.alt}
          className="object-cover object-center"
        />
      </picture>}
    </div>
  ))
}
