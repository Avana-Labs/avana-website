import { FeatureCardDescription, FeatureCardTitle, SectionEyebrow, SectionTitle, type SectionEyebrowTone } from "@/components/shared"
import type { ReactNode } from "react"
import type { AppLocale } from "@/i18n/locales"
import { withMarketingI18n } from "@/lib/content-i18n/with-marketing-i18n"

type ProductFeatureItem = {
  title: string
  description: string
}

type ProductFeatureScrollSectionProps = {
  locale: AppLocale
  eyebrow?: string
  eyebrowTone?: SectionEyebrowTone
  title: ReactNode
  description?: string
  items: readonly ProductFeatureItem[]
  panels?: ReactNode[]
}

export default async function ProductFeatureScrollSection({
  locale,
  eyebrow = "Key Features",
  eyebrowTone = "blue",
  title,
  description,
  items,
  panels,
}: ProductFeatureScrollSectionProps) {
  return withMarketingI18n(locale, ['product-feature-scroll-section'], (
    <section>
      <div className="mb-8 max-w-[650px] space-y-3 text-left">
        <SectionEyebrow tone={eyebrowTone}>{eyebrow}</SectionEyebrow>
        <SectionTitle>{title}</SectionTitle>
        {description ? (
          <p className="mt-4 max-w-[38rem] text-[1.15rem] leading-[1.36] tracking-[-0.045em] text-[#6f7378] md:text-[1.35rem]">
            {description}
          </p>
        ) : null}
      </div>
      <div className="relative mt-10 md:mt-16">
        <div className="overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid w-max grid-flow-col auto-cols-[19.75rem] gap-4 px-1 lg:auto-cols-[21.5rem] lg:gap-5">
            {items.map((item, index) => (
              <article
                key={item.title}
                className="group flex h-[31.25rem] w-full snap-start flex-col overflow-hidden feature-card rounded-[26px] p-5 transition-transform duration-150 hover:scale-[1.01]"
              >
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <FeatureCardTitle>{item.title}</FeatureCardTitle>
                    <FeatureCardDescription className="max-w-[16rem]">
                      {item.description}
                    </FeatureCardDescription>
                  </div>
                  <div className="shrink-0 text-sm font-medium tracking-[0.16em] text-gray-400">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="relative z-0 mt-auto">
                  <div className="flex items-end justify-center">
                    {panels?.[index] ?? (
                      <div className="relative h-[18rem] w-full overflow-hidden rounded-[22px] border border-gray-200 bg-white">
                        <div className="absolute inset-x-6 bottom-6 h-px bg-gray-200" />
                        <div className="absolute inset-x-10 bottom-10 h-px bg-gray-100" />
                        <div className="absolute inset-x-16 bottom-14 h-px bg-gray-100" />
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  ))
}
