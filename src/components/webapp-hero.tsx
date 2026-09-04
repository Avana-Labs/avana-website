import Image from "next/image"
import type { AppLocale } from "@/i18n/locales"
import { withMarketingI18n } from "@/lib/content-i18n/with-marketing-i18n"
import { brandAssetPath } from "@/lib/brand-assets"

export default async function WebappHero({ locale }: { locale: AppLocale }) {
  return withMarketingI18n(locale, ['webapp-hero'], (
    <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[2/1] lg:aspect-[1672/941]">
      <Image
        src={brandAssetPath("/images/Avana Express Page 1.png")}
        alt="Avana homepage hero visual"
        fill
        priority
        unoptimized
        sizes="(max-width: 768px) 100vw, (max-width: 1536px) 64rem, 72rem"
        className="object-cover object-center dark:hidden"
      />
      <Image
        src={brandAssetPath("/images/Avana Express Page 2.png")}
        alt="Avana homepage hero visual"
        fill
        priority
        unoptimized
        sizes="(max-width: 768px) 100vw, (max-width: 1536px) 64rem, 72rem"
        className="hidden object-cover object-center dark:block"
      />
    </div>
  ))
}
