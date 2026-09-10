import type { Metadata } from "next"
import { existsSync } from "fs"
import { join } from "path"
import { formatContentDate } from "@/lib/content-i18n/format-date"
import { resolveLocaleParam, type LocaleParamsProps } from "@/lib/i18n/locale-params"
import BlogPostLayout from "@/components/blog-post-layout"
import { loadBlogContent } from "@/lib/content-i18n/load-content"
import { buildOgImagePath, SITE_NAME } from "@/lib/site"
import { blogPosts, blogPostsBySlug, type BlogPostDefinition, type BlogSection } from "@/lib/blog-posts"

const sectionTones = ["amber", "violet", "cyan", "emerald", "rose", "slate", "blue"] as const

export function getBlogPost(slug: string): BlogPostDefinition {
  const post = blogPostsBySlug.get(slug)

  if (!post) {
    throw new Error(`Unknown blog post slug: ${slug}`)
  }

  return post
}

export function buildBlogMetadata(post: BlogPostDefinition): Metadata {
  const title = `${post.title} | ${SITE_NAME} Newsroom`
  const canonicalPath = `/newsroom/${post.slug}`

  return {
    title,
    description: post.description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      url: canonicalPath,
      description: post.description,
      images: [
        buildOgImagePath({
          title: post.title,
          subtitle: post.description,
          type: "blog",
        }),
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [
        buildOgImagePath({
          title: post.title,
          subtitle: post.description,
          type: "blog",
        }),
      ],
    },
  }
}

export function renderBlogSections(sections: readonly BlogSection[]) {
  return sections.map((section, index) => (
    <section
      key={section.id}
      id={section.id}
      className={`space-y-4 scroll-mt-24`}
    >
      {section.title ? (
        <h2
          {...(section.eyebrow ? { "data-eyebrow": section.eyebrow } : {})}
          className={`site-eyebrow-tone-${sectionTones[index % sectionTones.length]}`}
        >
          {section.title}
        </h2>
      ) : null}
      {section.paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </section>
  ))
}

function slugifySectionId(text: string, index: number) {
  const slug = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return slug || `section-${index + 1}`
}

function firstSentence(text: string) {
  return (text.match(/^[^.!?]+[.!?]?/)?.[0] ?? text).trim().replace(/[.!?]+$/, "")
}

function titleCaseWord(word: string) {
  if (/^(lp|lps|amm|nft|nfts|ui|defi|ltv|twap|mev|il)$/i.test(word)) {
    return word.toUpperCase()
  }
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

function titleCaseLabel(words: string[]) {
  return words.filter(Boolean).map(titleCaseWord).join(" ")
}

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "been", "but", "by", "can", "cannot", "could",
  "does", "for", "from", "had", "has", "have", "if", "in", "into", "is", "it", "its", "just",
  "may", "more", "most", "must", "not", "of", "on", "only", "or", "other", "over", "same",
  "should", "so", "some", "such", "than", "that", "the", "their", "them", "then", "there",
  "these", "they", "this", "those", "through", "to", "too", "under", "up", "very", "was",
  "were", "what", "when", "where", "which", "while", "who", "will", "with", "would", "also",
  "about", "after", "before", "between", "during", "each", "every", "how", "own", "because",
  "whether", "without", "within", "across", "against", "another", "both", "few", "many",
  "much", "one", "two", "all", "any", "being", "do", "did", "doing", "once", "still", "even",
  "here", "like", "make", "made", "need", "needed", "part", "use", "used", "using", "way",
  "ways", "well", "yet", "around", "designed", "means", "meant", "simply", "often", "usually",
])

/**
 * Topic → short TOC labels (1–2 words), ordered more specific first.
 * First unused alias for a matching rule becomes the section title.
 */
const TOPIC_RULES: readonly { test: RegExp; labels: readonly string[] }[] = [
  { test: /role separation|risk initiator|risk guardian|risk defender/i, labels: ["Roles", "Guards"] },
  { test: /defensive asymmetry|defensive changes|easier to reduce risk/i, labels: ["Defense", "Asymmetry"] },
  { test: /risk framework/i, labels: ["Framework", "Policy"] },
  { test: /emergency (actions?|authority|containment)/i, labels: ["Emergency", "Containment"] },
  { test: /timelock|public notice|standard update flow|update flow/i, labels: ["Updates", "Timelock"] },
  { test: /spoke awareness|spoke family|spoke-?level|dedicated spoke/i, labels: ["Spokes", "Markets"] },
  {
    test: /separation matters more|risk surface is more (?:dynamic|heterogeneous)|not all .* interchangeable/i,
    labels: ["Diversity", "Variety"],
  },
  { test: /smart agents?/i, labels: ["Agents", "Runtime"] },
  { test: /partial liquidation|minimal intervention|target health/i, labels: ["Partial", "Minimal"] },
  { test: /fees first|claimable fees|fee realization/i, labels: ["Fees", "Fee first"] },
  { test: /recoverable value/i, labels: ["Recovery", "Value"] },
  { test: /health (factor|monitor|assessment|checks?)/i, labels: ["Health", "Monitoring"] },
  { test: /stress test/i, labels: ["Stress", "Scenarios"] },
  { test: /exit discipline|deleverag/i, labels: ["Exit", "Deleverage"] },
  { test: /yield loop|looping|looped strategy/i, labels: ["Looping", "Leverage"] },
  { test: /stablecoin buffer|stable assets can make/i, labels: ["Buffer", "Stables"] },
  { test: /directional offset|directional (risk|exposure|concentration)/i, labels: ["Offset", "Direction"] },
  { test: /\bneutrality\b|neutral setup/i, labels: ["Neutrality", "Balance"] },
  { test: /hub and spoke|hub-and-spoke/i, labels: ["Architecture", "Hub"] },
  { test: /manipulation resistance|deviation threshold|oracle sentinel/i, labels: ["Safeguards", "Defense"] },
  { test: /capital efficiency/i, labels: ["Efficiency", "Capital"] },
  { test: /liquidation/i, labels: ["Liquidation", "Unwind"] },
  { test: /oracle/i, labels: ["Oracle", "Pricing"] },
  { test: /valuation|priced conservatively|collateral value/i, labels: ["Valuation", "Pricing"] },
  { test: /security model|layered security/i, labels: ["Security", "Layers"] },
  { test: /automation|automated/i, labels: ["Automation", "Controls"] },
  { test: /hedg/i, labels: ["Hedging", "Hedge"] },
  { test: /governance|trust layer/i, labels: ["Governance", "Trust"] },
  { test: /borrow(ing)?\b/i, labels: ["Borrowing", "Credit"] },
  { test: /impermanent loss/i, labels: ["IL risk", "Exposure"] },
  { test: /operational layer|operating model/i, labels: ["Operations", "Ops"] },
  { test: /aerodrome/i, labels: ["Aerodrome", "Base"] },
  { test: /\bcurve\b/i, labels: ["Curve", "Stable"] },
  { test: /balancer/i, labels: ["Balancer", "Weighted"] },
  { test: /uniswap/i, labels: ["Uniswap", "CLMM"] },
  { test: /institution|treasury/i, labels: ["Institutions", "Treasury"] },
  {
    test: /heterogeneous|not the same as a concentrated|interchangeable/i,
    labels: ["Markets", "Diversity"],
  },
  {
    test: /deeper reason|broader lesson|broader (?:point|meaning)|that is ultimately|ultimately the/i,
    labels: ["Takeaway", "Outlook"],
  },
  { test: /lp collateral|lp position|lp markets?/i, labels: ["LP model", "Collateral"] },
]

function compressToShortLabel(phrase: string): string | null {
  const words = phrase
    .replace(/[^a-zA-Z0-9\s'-]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 0 && !STOP_WORDS.has(word.toLowerCase()))

  if (words.length === 0) return null

  // Prefer a crisp 1–2 word label
  const picked = words.length === 1 ? words : words.slice(0, 2)
  return titleCaseLabel(picked)
}

function fallbackShortLabel(paragraph: string): string {
  const lead = firstSentence(paragraph)
    .replace(/^(?:But|And|Yet|So|Still|Of course,?|Importantly,?|Meanwhile,?|Finally,?)\s+/i, "")
    .replace(/^(?:That is|This is)\s+/i, "")

  const phraseMatch = lead.match(
    /^((?:[A-Z][\w']+|LP|LPs|AMM|NFT|DeFi|UI)(?:\s+(?:[A-Z][\w']+|LP|LPs|v\d+|[a-z][\w']+)){0,2})/,
  )
  if (phraseMatch?.[1]) {
    const compressed = compressToShortLabel(phraseMatch[1])
    if (compressed) return compressed
  }

  const words = lead
    .replace(/[^a-zA-Z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word.toLowerCase()))

  if (words.length >= 2) return titleCaseLabel(words.slice(0, 2))
  if (words.length === 1) return titleCaseLabel(words)
  return "Topic"
}

/**
 * Short TOC/heading label (Intro-length), derived from what the paragraph is about.
 * Prefers the earliest matching topic in the paragraph so openers beat closing callbacks.
 */
function deriveSectionTitle(paragraph: string, index: number, usedLabels: Set<string>): string {
  const text = paragraph.replace(/\s+/g, " ").trim()
  if (!text) return takeUniqueLabel(`Topic`, usedLabels)

  type ScoredLabel = { label: string; position: number; rank: number }
  const scored: ScoredLabel[] = []

  TOPIC_RULES.forEach((rule, rank) => {
    const match = rule.test.exec(text)
    if (!match) return

    const position = match.index ?? 0
    for (const label of rule.labels) {
      scored.push({ label, position, rank })
    }
  })

  scored.sort((a, b) => a.position - b.position || a.rank - b.rank)

  for (const { label } of scored) {
    const key = label.toLowerCase()
    if (!usedLabels.has(key)) {
      usedLabels.add(key)
      return label
    }
  }

  const candidates: string[] = []
  const lead = firstSentence(text)
  const topicPatterns: RegExp[] = [
    /\b(?:design choice|principle|objective|goal|idea|point|lesson|distinction|benefit|layer|form|approach|category)\s+is\s+(?:that\s+)?(?:simply\s+)?(.+)$/i,
    /(?:broader|deeper|real|simple|central|key|ultimate)\s+(?:point|objective|goal|lesson|principle|distinction|meaning)\s+is\s+(?:that\s+)?(.+)$/i,
    /(?:That|This) is (?:also )?(?:why|where|when) (.+)$/i,
  ]

  for (const pattern of topicPatterns) {
    const match = lead.match(pattern) ?? text.match(pattern)
    if (!match?.[1]) continue
    const compressed = compressToShortLabel(match[1])
    if (compressed) candidates.push(compressed)
  }

  candidates.push(fallbackShortLabel(text))

  for (const candidate of candidates) {
    const key = candidate.toLowerCase()
    if (!usedLabels.has(key)) {
      usedLabels.add(key)
      return candidate
    }
  }

  return takeUniqueLabel(candidates[0] ?? `Topic`, usedLabels)
}

function takeUniqueLabel(base: string, usedLabels: Set<string>) {
  if (!usedLabels.has(base.toLowerCase())) {
    usedLabels.add(base.toLowerCase())
    return base
  }

  let suffix = 2
  while (usedLabels.has(`${base} ${suffix}`.toLowerCase())) {
    suffix += 1
  }
  const label = `${base} ${suffix}`
  usedLabels.add(label.toLowerCase())
  return label
}

function uniqueSectionId(title: string, index: number, usedIds: Set<string>) {
  let id = slugifySectionId(title, index)
  if (usedIds.has(id)) {
    id = `${id}-${index + 1}`
  }
  usedIds.add(id)
  return id
}

function buildReadableSections(post: BlogPostDefinition): BlogSection[] {
  // Keep authored multi-section / titled structure as-is.
  if (post.sections.length !== 1 || post.sections[0]?.title) {
    const usedLabels = new Set<string>()
    return post.sections.map((section, index) => {
      const title =
        section.title ?? deriveSectionTitle(section.paragraphs[0] ?? "", index, usedLabels)

      if (section.title) {
        usedLabels.add(section.title.toLowerCase())
      }

      return {
        ...section,
        id: section.id || slugifySectionId(title, index),
        title,
      }
    })
  }

  // Single title-less article: one topic section per paragraph, short content labels.
  const paragraphs = post.sections[0].paragraphs
  const usedIds = new Set<string>()
  const usedLabels = new Set<string>()

  return paragraphs.map((paragraph, index) => {
    const title = deriveSectionTitle(paragraph, index, usedLabels)

    return {
      id: uniqueSectionId(title, index, usedIds),
      title,
      paragraphs: [paragraph],
    }
  })
}

function getPostImage(image?: string) {
  if (!image) return undefined

  const publicPath = join(process.cwd(), "public", image.replace(/^\//, ""))
  return existsSync(publicPath) ? image : undefined
}

export function createBlogPage(slug: string) {
  const enPost = getBlogPost(slug)
  const image = getPostImage(enPost.image)

  async function generateMetadata({ params }: LocaleParamsProps): Promise<Metadata> {
    const locale = await resolveLocaleParam(params)
    const localizedPosts = (await loadBlogContent(locale)).posts as BlogPostDefinition[]
    const fallbackIndex = blogPosts.findIndex((entry) => entry.slug === slug)
    const post =
      localizedPosts.find((entry) => entry.slug === slug) ??
      (fallbackIndex >= 0 ? localizedPosts[fallbackIndex] : undefined) ??
      enPost
    return buildBlogMetadata(post as BlogPostDefinition)
  }

  async function Page({ params }: LocaleParamsProps) {
    const locale = await resolveLocaleParam(params)
    const localizedPosts = (await loadBlogContent(locale)).posts as BlogPostDefinition[]
    // English slug routes; loadBlogContent restores EN slugs on each locale file.
    const bySlug = localizedPosts.find((entry) => entry.slug === slug) as BlogPostDefinition | undefined
    const fallbackIndex = blogPosts.findIndex((entry) => entry.slug === slug)
    const byIndex =
      fallbackIndex >= 0 ? (localizedPosts[fallbackIndex] as BlogPostDefinition | undefined) : undefined
    const post = bySlug ?? byIndex ?? enPost
    const sections = buildReadableSections(post)
    const index = localizedPosts.findIndex((entry) => entry.slug === slug)
    const list = index >= 0 || byIndex ? localizedPosts : blogPosts
    const i = index >= 0 ? index : fallbackIndex
    const prevPost = i > 0 ? list[i - 1] : undefined
    const nextPost = i >= 0 && i < list.length - 1 ? list[i + 1] : undefined
    const tableOfContents = sections.map((section, sectionIndex) => ({
      id: section.id,
      title: section.title ?? (sections.length === 1 ? "Article" : `Section ${sectionIndex + 1}`),
    }))
    const sectionColorsById = Object.fromEntries(
      sections.map((section, index) => [section.id, sectionTones[index % sectionTones.length]]),
    )

    return (
      <BlogPostLayout
        title={post.title}
        date={formatContentDate(post.date, locale)}
        description={post.description}
        image={image}
        tableOfContents={tableOfContents}
        sectionColorsById={sectionColorsById}
        prevPost={prevPost ? { slug: prevPost.slug, title: prevPost.title } : undefined}
        nextPost={nextPost ? { slug: nextPost.slug, title: nextPost.title } : undefined}
      >
        <div className="space-y-10">
          {renderBlogSections(sections)}
        </div>
      </BlogPostLayout>
    )
  }

  return { post: enPost, generateMetadata, Page }
}
