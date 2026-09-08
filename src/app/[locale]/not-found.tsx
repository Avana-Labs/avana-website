import { getLocale, getTranslations } from "next-intl/server"
import Link from "next/link"
import { withLocale } from "@/lib/i18n/path"
import { siteRoutes } from "@/lib/site"

export default async function NotFound() {
  const [t, locale] = await Promise.all([getTranslations("common"), getLocale()])

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center bg-white px-6 py-16 text-[#0F1518] sm:px-8 sm:py-20">
      <section className="mx-auto w-full max-w-[760px]">
        <div className="py-14 text-center sm:py-18">
          <p className="mt-5 text-[4.5rem] font-semibold leading-none tracking-[-0.04em] text-[#01AACF] sm:text-[5.75rem]">
            404
          </p>

          <h1 className="mx-auto mt-6 max-w-[620px] text-[1.05rem] font-semibold leading-7 tracking-[-0.02em] text-[#0F1518]">
            {t("notFound.title")}
          </h1>
          <p className="mx-auto mt-5 max-w-[440px] text-[1rem] leading-7 text-[#414347] sm:text-[1.05rem]">
            {t("notFound.body")}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              prefetch={false}
              href={withLocale(locale, siteRoutes.home)}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#01AACF] px-5 text-sm font-medium text-white transition hover:bg-[#00a0c2]"
            >
              {t("notFound.home")}
            </Link>

            <nav aria-label={t("a11y.helpfulLinks")} className="flex flex-wrap justify-center gap-x-5 gap-y-3">
              <Link
                prefetch={false}
                href={withLocale(locale, siteRoutes.faq)}
                className="text-sm font-medium text-[#01AACF] underline underline-offset-4 transition hover:text-[#008fb0]"
              >
                {t("notFound.faq")}
              </Link>
            </nav>
          </div>
        </div>
      </section>
    </div>
  )
}
