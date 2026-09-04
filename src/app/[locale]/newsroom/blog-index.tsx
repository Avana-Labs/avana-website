"use client"

import { Link } from "@/i18n/navigation"
import { useLocale, useTranslations } from "next-intl"
import { formatContentDate } from "@/lib/content-i18n/format-date"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import type { BlogPost, TagFilter } from "@/lib/content"

/**
 * Client-side blog index so `/blog` can stay fully static.
 * The active tag lives in the URL (?tag=) and is read with useSearchParams;
 * the server page renders the default "All" view as the Suspense fallback so
 * the static HTML still contains the full post grid.
 */

const bookCoverThemes = [
  {
    cover: "bg-[#0F1518]",
    coverColor: "#0F1518",
    spineColor: "#01AACF",
    text: "text-white",
    muted: "text-white/54",
    number: "text-white/48",
  },
  {
    cover: "bg-[#2F414B]",
    coverColor: "#2F414B",
    spineColor: "#BC846F",
    text: "text-white",
    muted: "text-white/56",
    number: "text-white/52",
  },
  {
    cover: "bg-[#9E5537]",
    coverColor: "#9E5537",
    spineColor: "#0F1518",
    text: "text-white",
    muted: "text-white/58",
    number: "text-white/46",
  },
  {
    cover: "bg-[#01AACF]",
    coverColor: "#01AACF",
    spineColor: "#2F414B",
    text: "text-[#0F1518]",
    muted: "text-[#0F1518]/58",
    number: "text-[#0F1518]/42",
  },
  {
    cover: "bg-[#2F414B]",
    coverColor: "#2F414B",
    spineColor: "#01AACF",
    text: "text-white",
    muted: "text-white/54",
    number: "text-white/48",
  },
  {
    cover: "bg-[#BC846F]",
    coverColor: "#BC846F",
    spineColor: "#0F1518",
    text: "text-[#0F1518]",
    muted: "text-[#0F1518]/58",
    number: "text-[#0F1518]/42",
  },
  {
    cover: "bg-[#0F1518]",
    coverColor: "#0F1518",
    spineColor: "#9E5537",
    text: "text-white",
    muted: "text-white/56",
    number: "text-white/52",
  },
  {
    cover: "bg-[#2F414B]",
    coverColor: "#2F414B",
    spineColor: "#BC846F",
    text: "text-white",
    muted: "text-white/54",
    number: "text-white/48",
  },
] as const

function getBookCoverTheme(index: number) {
  return bookCoverThemes[index % bookCoverThemes.length]
}

/** Pure-CSS spiral binding: one element + gradient paint, no images or extra assets. */
function BookSpine({
  spineColor,
  coverColor,
}: {
  spineColor: string
  coverColor: string
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-4"
      style={{
        backgroundColor: spineColor,
        // Three cheap paint layers only — repeats scale with height, no DOM per ring
        backgroundImage: [
          // Punch holes (reads as the cover through each coil)
          `radial-gradient(circle 2.2px at 52% 50%, ${coverColor} 96%, transparent 100%)`,
          // Wire coil loops (silver rings, spiral-notebook style)
          `radial-gradient(ellipse 6px 3.15px at 52% 50%, #f7f8fa 0 38%, #c8ced8 48%, transparent 58%)`,
          // Face shade so the spine reads as a bound edge, not a flat strip
          `linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.06) 50%, transparent 100%)`,
        ].join(", "),
        backgroundSize: "100% 12px, 100% 12px, 100% 100%",
        backgroundRepeat: "repeat-y, repeat-y, no-repeat",
        backgroundPosition: "center top, center top, 0 0",
      }}
    />
  )
}

function getBookNumber(index: number) {
  return String(index + 1).padStart(2, "0")
}

function buildTagHref(tag: TagFilter) {
  if (tag === "All") {
    return "/newsroom"
  }

  return `/newsroom?tag=${encodeURIComponent(tag)}`
}

export function BlogIndex({
  posts,
  tagOptions,
  activeTag,
}: {
  posts: readonly BlogPost[]
  tagOptions: readonly TagFilter[]
  activeTag: TagFilter
}) {
  const t = useTranslations("common.tags")
  const locale = useLocale()
  const tagLabel = (tag: TagFilter) => {
    if (tag === "All") return t("all")
    const key = tag.toLowerCase() as "product" | "strategy" | "guides" | "protocol" | "institutions"
    try {
      return t(key)
    } catch {
      return tag
    }
  }
  const [visibleCount, setVisibleCount] = useState(8)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const filteredBlogs = useMemo(
    () =>
      [...posts]
        .filter((post) => activeTag === "All" || post.tag === activeTag)
        .sort((first, second) => Date.parse(second.date) - Date.parse(first.date)),
    [activeTag, posts],
  )
  const visibleBlogs = filteredBlogs.slice(0, visibleCount)

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current

    if (!loadMoreElement || visibleCount >= filteredBlogs.length) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) => Math.min(count + 8, filteredBlogs.length))
        }
      },
      { rootMargin: "100px 0px" },
    )

    observer.observe(loadMoreElement)
    return () => observer.disconnect()
  }, [filteredBlogs.length, visibleCount])

  return (
    <>
      <section className="flex justify-center pb-10 pt-8 md:pb-12 md:pt-10">
        <div className="flex w-full max-w-4xl flex-col items-center text-center">
          <div className="flex max-w-full items-center justify-center">
            <div className="flex max-w-full flex-wrap items-center justify-center gap-2">
              {tagOptions.map((tag) => {
                const active = activeTag === tag

                return (
                  <Link
                    key={tag}
                    href={buildTagHref(tag)}
                    scroll={false}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex shrink-0 items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                      active
                        ? "bg-[#01AACF] text-white hover:bg-[#00a0c2]"
                        : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {tagLabel(tag)}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="pt-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 py-6 md:gap-x-7 md:gap-y-10 lg:grid-cols-4">
          {visibleBlogs.map((post, index) => {
            const theme = getBookCoverTheme(index)

            return (
              <div key={post.id}>
                <Link
                  href={`/newsroom/${post.slug}`}
                  className="group block h-full touch-manipulation"
                >
                <div className="flex flex-col gap-3">
                  <div className="relative aspect-[4/5] w-full">
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-[3%] right-[-3%] w-[8%] rounded-r-sm border-r border-[#d8dee7] bg-[#f6f8fb] shadow-[5px_7px_12px_rgba(15,23,42,0.10)] transition-transform duration-200 group-hover:translate-x-1.5 dark:border-border dark:bg-[#111111] dark:shadow-[5px_7px_12px_rgba(0,0,0,0.35)]"
                    />
                    <div
                      className={`relative flex h-full flex-col overflow-hidden rounded-[0.2rem] ${theme.cover} px-5 py-6 shadow-[0_10px_24px_rgba(15,23,42,0.14)] transition-[transform,box-shadow] duration-200 ease-out group-hover:-translate-x-1.5 group-hover:-skew-y-[0.6deg] group-hover:shadow-[6px_12px_25px_rgba(15,23,42,0.16)] md:px-6 md:py-7`}
                    >
                      <BookSpine spineColor={theme.spineColor} coverColor={theme.coverColor} />
                      <div className="relative z-10 flex items-start justify-between gap-4">
                        <span className={`text-[0.8rem] font-semibold uppercase tracking-[0.22em] ${theme.text}`}>
                          {tagLabel(post.tag)}
                        </span>
                        <span className={`font-mono text-sm ${theme.number}`}>{getBookNumber(index)}</span>
                      </div>
                      <h2 className={`relative z-10 mt-auto max-w-[13ch] break-words pb-2 text-[1.25rem] font-medium leading-[1.16] tracking-[-0.055em] sm:text-[1.45rem] md:text-[1.58rem] ${theme.text}`}>
                        {post.title}
                      </h2>
                      <span className={`relative z-10 mt-4 text-xs font-medium ${theme.muted}`}>
                        {formatContentDate(post.date, locale)}
                      </span>
                    </div>
                  </div>
                </div>
                </Link>
              </div>
            )
          })}
        </div>
        {visibleCount < filteredBlogs.length ? (
          <div ref={loadMoreRef} aria-hidden="true" className="h-px" />
        ) : null}
      </section>
    </>
  )
}

export function BlogIndexFromSearchParams({
  posts,
  tagOptions,
}: {
  posts: readonly BlogPost[]
  tagOptions: readonly TagFilter[]
}) {
  const searchParams = useSearchParams()
  const requestedTag = searchParams.get("tag") ?? undefined
  const activeTag = tagOptions.find((tag) => tag === requestedTag) ?? "All"

  return <BlogIndex key={activeTag} posts={posts} tagOptions={tagOptions} activeTag={activeTag} />
}
