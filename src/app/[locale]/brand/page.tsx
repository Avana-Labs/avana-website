import { LocalizedMarketing } from "@/components/localized-marketing"
import { Download } from "lucide-react"
import { brandOutfitFont } from "@/app/[locale]/brand/brand-fonts"
import { BrandColorPalette, BrandGuidelinesGrid, BrandLogoShowcase, BrandTokenPreview } from "@/app/[locale]/brand/brand-interactions"
import { InlineFaqSection, type InlineFaqItem } from "@/components/InlineFaqSection"
import { SectionEyebrow, SectionTitle } from "@/components/shared"

const BRAND_KIT_URL = "/avana-brand-kit.zip"

const brandSections = {
  logo: { eyebrow: "Primary mark", title: "Logo" },
  typography: { eyebrow: "Voice & rhythm", title: "Typography" },
  color: { eyebrow: "Palette system", title: "Color" },
  concept: { eyebrow: "Avana Token", title: "Icon" },
  guidelines: { eyebrow: "Use it well", title: "Logo Guidelines" },
} as const

const faqItems: InlineFaqItem[] = [
  {
    value: "download-assets",
    question: "How do I download the brand assets?",
    answer:
      "Use the download button at the top of this page. The kit includes the approved PNG and SVG files for the Avana wordmark and icon.",
  },
  {
    value: "color-swaps",
    question: "Can I recolor the Avana logo to match my project?",
    answer:
      "No. Use the approved colorways in the kit. Recoloring the mark makes partner pages and product surfaces feel inconsistent.",
  },
  {
    value: "pairing-marks",
    question: "Can I pair the Avana mark with another brand?",
    answer:
      "Yes. Keep enough clear space around both marks, match their visual weight, and avoid treatments that make either logo look modified.",
  },
  {
    value: "why-guidelines",
    question: "Why do these guidelines matter?",
    answer:
      "They keep Avana recognizable across docs, integrations, launch posts, dashboards, and partner pages.",
  },
]

import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

export default async function BrandPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  return (
    <LocalizedMarketing locale={locale} keys={["brand/page", "brand/brand-interactions"]}>
    <div className="flex min-h-screen flex-col bg-background">
      <section className="bg-background pt-14 pb-0 md:pt-20">
        <div className="site-content-shell">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <h1 className="type-index-title text-foreground">
              Brand
            </h1>
            <p className="max-w-xl text-[1rem] leading-[1.55] tracking-[-0.02em] text-type-secondary md:text-[1.05rem]">
              Official Avana logos, colors, typography, and rules for using the brand clearly.
            </p>
            <a
              href={BRAND_KIT_URL}
              download
              className="group inline-flex h-10 items-center justify-center gap-2 rounded-full border border-foreground/80 bg-background px-5 text-[0.98rem] font-semibold tracking-[-0.02em] text-foreground transition-[background-color,border-color,color] duration-200 ease-out hover:border-[#01AACF] hover:bg-[#01AACF] hover:text-white"
            >
              <span>Download Kit</span>
              <Download className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-y-0.5" />
            </a>
          </div>
        </div>
      </section>

      <main className="flex-1 bg-background">
        <div className="site-content-shell">
          <section className="site-section-gap">
            <div className="mb-8 space-y-3 md:mb-12">
              <SectionEyebrow tone="cyan">{brandSections.logo.eyebrow}</SectionEyebrow>
              <SectionTitle>{brandSections.logo.title}</SectionTitle>
            </div>

            <BrandLogoShowcase />
          </section>

          <section className="site-section-gap">
            <div className="mb-8 space-y-3 md:mb-12">
              <SectionEyebrow tone="cyan">{brandSections.typography.eyebrow}</SectionEyebrow>
              <SectionTitle>{brandSections.typography.title}</SectionTitle>
            </div>

            <div className="grid items-start gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-semibold text-foreground">Diatype</h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  Avana uses Diatype for product and marketing surfaces. It keeps dense protocol content readable while
                  still feeling sharp and editorial.
                </p>
              </div>

              <div className="relative flex flex-col gap-5 border-b border-gray-200 pb-4">
                <div className="w-full overflow-hidden leading-none tracking-[-0.04em] text-foreground">
                  <div className="text-[120px] font-normal whitespace-nowrap md:text-[160px]">AaBbCc</div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid items-start gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-semibold text-foreground">Outfit</h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  Outfit is a fallback specimen for contexts where Diatype is unavailable. Diatype remains the primary
                  typeface for the product experience.
                </p>
              </div>

              <div className="relative flex flex-col gap-5 md:border-b-0">
                <div className="w-full overflow-hidden leading-none text-foreground">
                  <div className={`${brandOutfitFont.className} text-[120px] font-semibold italic whitespace-nowrap tracking-[-0.02em] md:text-[160px]`}>
                    AaBbCc
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="site-section-gap">
            <div className="mb-8 space-y-3 md:mb-12">
              <SectionEyebrow tone="cyan">{brandSections.color.eyebrow}</SectionEyebrow>
              <SectionTitle>{brandSections.color.title}</SectionTitle>
            </div>

            <BrandColorPalette />
          </section>

          <section className="site-section-gap">
            <div className="mb-8 space-y-3 md:mb-12">
              <SectionEyebrow tone="cyan">{brandSections.concept.eyebrow}</SectionEyebrow>
              <SectionTitle>{brandSections.concept.title}</SectionTitle>
            </div>

            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-semibold text-foreground">Primary Token Mark</h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  Avana token uses the circular mark as the default asset image for exchange listings, token pages,
                  market tables, and launch materials.
                </p>
              </div>

              <BrandTokenPreview
                src="/images/brand/avana-token-circle.jpg"
                alt="Avana circular 3D token icon"
                imageClassName="h-[72%] w-[72%] object-contain"
              />
            </div>

            <div className="mt-12 grid items-center gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-semibold text-foreground">Framed Token Mark</h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  Avana token uses the rounded-square mark for interfaces that expect a square asset tile, including
                  wallets, app grids, dashboards, and compact product views.
                </p>
              </div>

              <BrandTokenPreview
                src="/images/brand/avana-token-square.jpg"
                alt="Avana rounded-square 3D token icon"
                imageClassName="h-[88%] w-[88%] object-contain"
              />
            </div>
          </section>

          <section className="site-section-gap">
            <div className="mb-8 space-y-3 md:mb-12">
              <SectionEyebrow tone="cyan">{brandSections.guidelines.eyebrow}</SectionEyebrow>
              <SectionTitle>{brandSections.guidelines.title}</SectionTitle>
            </div>

            <div className="mb-12 grid items-start gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-semibold text-foreground">Things to avoid</h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  Keep the Avana mark intact. These examples show the treatments that make the logo harder to read or
                  less recognizable.
                </p>
              </div>

              <BrandGuidelinesGrid />
            </div>
          </section>

          <div className="pt-8 pb-16 md:pt-14 md:pb-24">
            <InlineFaqSection items={faqItems} withTopBorder={false} />
          </div>
        </div>
      </main>
    </div>
  </LocalizedMarketing>
)
}
