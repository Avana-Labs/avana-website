import Image from "next/image"
import { SectionEyebrow, SectionTitle } from "@/components/shared"
import type { AppLocale } from "@/i18n/locales"
import { withMarketingI18n } from "@/lib/content-i18n/with-marketing-i18n"

export default async function PlatformToolsShowcaseSection({ locale }: { locale: AppLocale }) {
  return withMarketingI18n(locale, ['platform-tools-showcase-section'], (
    <section
      data-section="platform-tools-showcase"
      data-theme="beige"
      className="w-full bg-inherit"
    >
      <div className="mb-6 flex max-w-[600px] flex-col gap-2 sm:mb-8 md:max-w-none">
        <SectionEyebrow tone="emerald">Lending tools</SectionEyebrow>
        <SectionTitle>
          Supply once. We’ll handle the complexity
        </SectionTitle>
      </div>

      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.35rem] sm:aspect-[2/1] md:rounded-[1.6rem]">
        <Image
          src="/images/ways-to-use-avana.png"
          alt="Lending tools product overview"
          fill
          sizes="(max-width: 1200px) 100vw, 1120px"
          className="object-cover object-center"
        />
      </div>
    </section>
  ))
}
