import Image from "next/image"
import type { ReactNode } from "react"
import { brandAssetPath } from "@/lib/brand-assets"

type FeaturePageHeroProps = {
  title: ReactNode
  description: ReactNode
  imageSrc: string
  imageAlt: string
  imageWidth: number
  imageHeight: number
  /** CTA links rendered in the hero action row. */
  children?: ReactNode
}

export function FeaturePageHero({
  title,
  description,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  children,
}: FeaturePageHeroProps) {
  return (
    <section
      className="site-content-shell items-center grid grid-cols-12 gap-6 pt-10 sm:pt-14 md:pt-20 pb-4 md:pb-8"
      aria-labelledby="feature-page-hero"
    >
      <div className="col-span-12 sm:col-span-6 xl:col-span-5 xl:col-start-2">
        <h1 id="feature-page-hero" className="text-mkt-h1 text-balance">
          {title}
        </h1>
        <div className="mt-8 w-[90%] max-w-[460px] text-balance xl:text-pretty">
          <p>{description}</p>
        </div>
        {children ? (
          <div className="flex w-fit flex-wrap gap-2 mt-6">{children}</div>
        ) : null}
      </div>
      <div className="col-span-12 sm:col-span-6 xl:col-span-5">
        <div className="h-full w-full overflow-hidden aspect-square">
          <div className="h-full w-full mx-auto overflow-hidden rounded-2xl aspect-auto md:aspect-auto">
            <Image
              alt={imageAlt}
              src={brandAssetPath(imageSrc)}
              sizes="100vw"
              className="mx-auto"
              width={imageWidth}
              height={imageHeight}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
