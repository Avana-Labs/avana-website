import type { AppLocale } from "@/i18n/locales"
import { getTranslations } from "next-intl/server"
import { formatContentDate } from "@/lib/content-i18n/format-date"
import { Link } from "@/i18n/navigation"
import { ChevronRight } from "lucide-react"
import {
  FeatureCardDescription,
  FeatureCardTitle,
  SectionEyebrow,
  SectionTitle,
  type SectionEyebrowTone,
} from "@/components/shared"
import { getNewsroomPosts, type NewsroomCollection, type NewsroomPost } from "@/lib/content"
import { withMarketingI18n } from "@/lib/content-i18n/with-marketing-i18n"

type HomepageNewsroomSectionProps = {
  locale: AppLocale
  eyebrow?: string
  eyebrowTone?: SectionEyebrowTone
  title?: string
  collection?: NewsroomCollection
  posts?: readonly NewsroomPost[]
  showDividers?: boolean
  showTopBorder?: boolean
}

/**
 * HomepageNewsroomSection renders cached newsroom rows for the homepage and
 * product pages without duplicating the content map in each route.
 *
 * Post titles/descriptions load from content/{locale}/blog.json.
 * Section chrome (eyebrow / title / CTA / bylines) uses messages + phrase map.
 */
export default async function HomepageNewsroomSection({
  locale,
  eyebrow,
  eyebrowTone = "blue",
  title,
  collection = "home",
  posts,
  showDividers = true,
  showTopBorder,
}: HomepageNewsroomSectionProps) {
  const tNav = await getTranslations({ locale, namespace: "common.nav" })
  const tNews = await getTranslations({ locale, namespace: "common.newsroom" })
  const resolvedEyebrow = eyebrow ?? tNav("newsroom")
  const resolvedTitle = title ?? tNews("latestFrom")
  const readCta = tNews("readNewsroom")
  const resolvedPosts = posts ?? (await getNewsroomPosts(locale, collection))
  const hasTopBorder = showTopBorder ?? showDividers

  return withMarketingI18n(locale, ["homepage/HomepageNewsroomSection"], (
    <section data-section="newsroom-teasers">
      <div className="mb-8 flex max-w-[48rem] flex-col gap-3 md:mb-10">
        <SectionEyebrow tone={eyebrowTone}>{resolvedEyebrow}</SectionEyebrow>
        <SectionTitle>{resolvedTitle}</SectionTitle>
      </div>

      <div className={hasTopBorder ? "border-t border-gray-200" : ""}>
        {resolvedPosts.map((post) => (
          <article
            key={post.href}
            className={`grid gap-4 py-6 md:grid-cols-[9.5rem_minmax(0,20rem)_minmax(0,1fr)_auto] md:gap-8 md:py-8 ${
              showDividers ? "border-b border-gray-200" : ""
            }`}
          >
            <p className="type-meta-label">{formatContentDate(post.date, locale)}</p>

            <div className="space-y-2">
              <FeatureCardTitle className="max-w-[22rem]">{post.title}</FeatureCardTitle>
              <p className="type-meta-label">{post.byline}</p>
            </div>

            <FeatureCardDescription className="max-w-[38rem] md:pt-1">
              {post.description}
            </FeatureCardDescription>

            <div className="md:justify-self-end">
              <Link
                href={post.href}
                className="group inline-flex h-10 items-center justify-center rounded-full border border-foreground/80 bg-white px-5 text-[0.98rem] tracking-[-0.02em] text-foreground transition-[background-color,border-color,color] duration-200 ease-out hover:border-[#01AACF] hover:bg-[#01AACF] hover:text-white"
              >
                <span className="inline-flex items-center gap-2.5">
                  <span>{readCta}</span>
                  <ChevronRight
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                    strokeWidth={2.8}
                  />
                </span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  ))
}
