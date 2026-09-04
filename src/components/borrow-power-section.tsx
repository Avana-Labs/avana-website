import Image from "next/image"
import { SectionIntro } from "@/components/shared"
import type { AppLocale } from "@/i18n/locales"
import { withMarketingI18n } from "@/lib/content-i18n/with-marketing-i18n"

export default async function BorrowPowerSection({ locale }: { locale: AppLocale }) {
  return withMarketingI18n(locale, ['borrow-power-section'], (
    <section className="bg-white">
      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] md:gap-8 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(0,30rem)_minmax(0,1fr)]">
        <div className="space-y-4">
          <SectionIntro
            eyebrow="Borrow Power"
            eyebrowTone="blue"
            title="Aggregate collateral for more credit"
            titleClassName="max-w-[14ch]"
          />

          <ol className="mt-7 grid max-w-[32rem] gap-4">
            <li className="flex gap-3">
              <span className="type-meta-label mt-0.5 shrink-0">1.</span>
              <p className="type-body-copy">
                Stack borrowing power across multiple
                <br />
                supported LP positions in one market.
              </p>
            </li>
            <li className="flex gap-3">
              <span className="type-meta-label mt-0.5 shrink-0">2.</span>
              <p className="type-body-copy">
                Track each position’s health alongside
                <br />
                your total account credit.
              </p>
            </li>
            <li className="flex gap-3">
              <span className="type-meta-label mt-0.5 shrink-0">3.</span>
              <p className="type-body-copy">
                Add or adjust collateral as market
                <br />
                conditions and capacity change.
              </p>
            </li>
          </ol>
        </div>

        <div className="relative flex justify-center md:justify-end">
          <div className="relative w-full max-w-[36rem] lg:max-w-[40rem] xl:max-w-[42rem]">
            <Image
              src="/images/avana-combine-coins.png"
              alt="Avana combine LP positions illustration"
              width={1024}
              height={1024}
              className="h-auto w-full"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 52vw, 672px"
            />
          </div>
        </div>
      </div>
    </section>
  ))
}
