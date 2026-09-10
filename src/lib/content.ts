import { revalidateTag, unstable_cache } from "next/cache"
import type { AppLocale } from "@/i18n/locales"
import { loadBlogContent } from "@/lib/content-i18n/load-content"
import { blogPosts as blogPostDefinitions } from "@/lib/blog-posts"

/**
 * Shared marketing content for the newsroom and blog surfaces.
 *
 * Keeping this data in one server-only module removes duplication across pages
 * and lets us cache reads with tags for low-cost revalidation later.
 */
export type BlogTag = "Product" | "Strategy" | "Guides" | "Protocol" | "Institutions"
export type TagFilter = "All" | BlogTag

export type BlogPost = {
  id: number
  date: string
  title: string
  description: string
  slug: string
  image: string
  category: string
  tag: BlogTag
}

export type NewsroomPost = {
  date: string
  title: string
  byline: string
  description: string
  href: string
}

export type NewsroomCollection = "home" | "borrow" | "invest" | "leverage" | "platform"

export const blogTagOptions: readonly TagFilter[] = [
  "All",
  "Product",
  "Strategy",
  "Guides",
  "Protocol",
  "Institutions",
] as const

export const BLOG_CONTENT_TAG = "blog-posts"
export const NEWSROOM_CONTENT_TAG = "newsroom-posts"

/** English bylines for newsroom teaser rows (translated via marketing phrase map). */
export const newsroomCollectionSpecs: Record<
  NewsroomCollection,
  ReadonlyArray<{ slug: string; byline: string }>
> = {
  home: [
    { slug: "lp-risk-governance", byline: "Risk framework" },
    { slug: "why-lp-collateral-needs-smart-agents", byline: "Smart Agents" },
    { slug: "how-lp-liquidation-should-work", byline: "Liquidation model" },
  ],
  borrow: [
    { slug: "lp-collateral-guide", byline: "Borrowing guide" },
    { slug: "smart-contract-architecture", byline: "Uniswap collateral" },
    { slug: "curve-lp-collateral-aave-v4", byline: "Curve collateral" },
  ],
  invest: [
    { slug: "unleashing-lp-tokens", byline: "Capital efficiency" },
    { slug: "hedge-lp-position", byline: "LP hedging" },
    { slug: "institutional-use-cases", byline: "Treasury strategy" },
  ],
  leverage: [
    { slug: "yield-looping-playbook", byline: "Leverage strategy" },
    { slug: "introducing-automate", byline: "Position controls" },
    { slug: "how-lp-liquidation-should-work", byline: "Risk design" },
  ],
  platform: [
    { slug: "aave-v4-avana-spoke", byline: "Architecture" },
    { slug: "pricing-lp-collateral-oracle-problem", byline: "Oracle design" },
    { slug: "integration-guide", byline: "Developer view" },
  ],
}

function toBlogPosts(definitions: typeof blogPostDefinitions): readonly BlogPost[] {
  return definitions.map((post, index) => ({
    id: index + 1,
    date: post.date,
    title: post.title,
    description: post.description,
    slug: post.slug,
    image: post.image,
    category: post.category,
    tag: post.tag as BlogTag,
  }))
}

const blogPosts: readonly BlogPost[] = toBlogPosts(blogPostDefinitions)

function buildNewsroomPosts(
  definitions: ReadonlyArray<{
    slug: string
    title: string
    description: string
    date: string
  }>,
  collection: NewsroomCollection,
): NewsroomPost[] {
  const bySlug = new Map(definitions.map((entry) => [entry.slug, entry]))

  return newsroomCollectionSpecs[collection].map(({ slug, byline }) => {
    const post = bySlug.get(slug)
    if (!post) {
      throw new Error(`Missing newsroom post for slug: ${slug}`)
    }

    return {
      date: post.date,
      title: post.title,
      byline,
      description: post.description,
      href: `/newsroom/${slug}`,
    }
  })
}

const getCachedBlogPosts = unstable_cache(
  async () => blogPosts,
  ["blog-posts"],
  {
    revalidate: 3600,
    tags: [BLOG_CONTENT_TAG],
  },
)

export function normalizeTagFilter(requestedTag?: string): TagFilter {
  if (!requestedTag) {
    return "All"
  }

  return blogTagOptions.find((tag) => tag === requestedTag) ?? "All"
}

export function filterBlogPosts(posts: readonly BlogPost[], tag: TagFilter) {
  if (tag === "All") {
    return posts
  }

  return posts.filter((post) => post.tag === tag)
}

export async function getBlogPosts(locale: AppLocale) {
  if (locale !== "en") {
    try {
      const content = await loadBlogContent(locale)
      return toBlogPosts(content.posts as typeof blogPostDefinitions)
    } catch {
      // fall through to English catalog
    }
  }

  if (process.env.NODE_ENV !== "production") {
    return blogPosts
  }

  try {
    return await getCachedBlogPosts()
  } catch (error) {
    if (error instanceof Error && error.message.includes("incrementalCache missing")) {
      return blogPosts
    }

    throw error
  }
}

export async function getBlogPostsByTag(locale: AppLocale, tag: TagFilter = "All") {
  const posts = await getBlogPosts(locale)
  return filterBlogPosts(posts, tag)
}

/**
 * Newsroom teaser rows for homepage / product pages.
 * Titles and descriptions come from content/{locale}/blog.json for the active locale.
 */
export async function getNewsroomPosts(locale: AppLocale, collection: NewsroomCollection = "home") {
  const posts = await getBlogPosts(locale)
  return buildNewsroomPosts(posts, collection)
}

export function revalidateMarketingContent() {
  revalidateTag(BLOG_CONTENT_TAG, "max")
  revalidateTag(NEWSROOM_CONTENT_TAG, "max")
}
