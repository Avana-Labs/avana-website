import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import { blogTagOptions, getBlogPosts } from "@/lib/content"
import { BlogIndex, BlogIndexFromSearchParams } from "@/app/[locale]/newsroom/blog-index"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"

/**
 * Newsroom index: blog list from content/{locale}/blog.json via route locale.
 */
export default async function BlogPage({ params }: LocaleParamsProps) {
  const locale = await resolveLocaleParam(params)
  const t = await getTranslations({ locale, namespace: "blog" })
  const posts = await getBlogPosts(locale)

  return (
    <div className="site-content-shell py-12">
      <section className="flex justify-center pt-4 md:pt-8">
        <h1 className="type-index-title text-foreground">
          {t("indexTitle")}
        </h1>
      </section>
      <Suspense
        fallback={<BlogIndex key="All" posts={posts} tagOptions={blogTagOptions} activeTag="All" />}
      >
        <BlogIndexFromSearchParams posts={posts} tagOptions={blogTagOptions} />
      </Suspense>
    </div>
  )
}
