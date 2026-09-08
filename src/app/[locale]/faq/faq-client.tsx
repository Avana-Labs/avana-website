"use client"

import { useDesktopLayout } from "@/components/ui/use-desktop-layout"
import { Link } from "@/i18n/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  Banknote,
  BookText,
  CircleHelp,
  Gauge,
  Folder,
  Layers3,
  Landmark,
  Network,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  SquareChartGantt,
} from "lucide-react"
import type { FaqCategory, FaqSearchResult } from "@/app/[locale]/faq/faq-content"
import { FaqToggleIcons } from "@/components/faq-toggle-icons"
import { ScrollSpySidebar } from "@/components/scroll-spy-sidebar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

/**
 * Client-side FAQ browser. Category names/labels are already locale-resolved
 * in category data from content/{locale}/faq.json.
 */

type FaqAccordionItem = {
  id: string
  q: string
  a: string
  category?: string
}

const categoryIconsById: Record<string, LucideIcon> = {
  general: CircleHelp,
  "protocol-architecture": Network,
  "lp-collateral": Layers3,
  "valuation-oracles": Gauge,
  borrowing: Banknote,
  "supplying-earning": Folder,
  liquidations: ShieldCheck,
  governance: Landmark,
  "gho-stablecoin": ReceiptText,
  "multiply-markets": SquareChartGantt,
  "automation-features": Sparkles,
}

function buildFaqHref({
  category,
  query,
}: {
  category?: string
  query?: string
}) {
  const params = new URLSearchParams()

  if (category) {
    params.set("category", category)
  }

  if (query) {
    params.set("q", query)
  }

  const search = params.toString()

  return search ? `/faq?${search}` : "/faq"
}

function normalizeCategory(categories: readonly FaqCategory[], requestedCategory?: string | null) {
  const fallback = categories[0]?.name ?? ""
  return categories.find((category) => category.name === requestedCategory)?.name ?? fallback
}

function searchQuestions(categories: readonly FaqCategory[], rawSearchTerm: string): FaqSearchResult[] {
  const searchTerm = rawSearchTerm.trim().toLowerCase()

  if (!searchTerm) {
    return []
  }

  return categories
    .flatMap((category) =>
      category.questions.map((question) => ({
        ...question,
        category: category.name,
      })),
    )
    .filter(
      (question) =>
        question.q.toLowerCase().includes(searchTerm) ||
        question.a.toLowerCase().includes(searchTerm),
    )
}

function FaqAccordionList({
  items,
  showCategory = false,
  categoryLabel,
}: {
  items: FaqAccordionItem[]
  showCategory?: boolean
  categoryLabel: (name: string) => string
}) {
  return (
    <Accordion type="single" collapsible orientation="vertical" className="w-full">
      {items.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id} className="border-b border-gray-200 py-6 last:border-b-0">
          <AccordionTrigger className="type-accordion-question group gap-4 p-0 text-start text-foreground hover:underline [&>svg.size-4]:hidden">
            <div className="flex flex-col text-start">
              <span>{faq.q}</span>
              {showCategory && faq.category ? (
                <span className="mt-2 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#01AACF]">
                  {categoryLabel(faq.category)}
                </span>
              ) : null}
            </div>
            <FaqToggleIcons />
          </AccordionTrigger>
          <AccordionContent className="type-accordion-answer whitespace-pre-line pt-5 text-type-secondary">
            {faq.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

function FaqCategoryCard({
  category,
  active,
  href,
  articlesLabel,
}: {
  category: { id: string; name: string; summary: string; questions: { id: string }[] }
  active: boolean
  href: string
  articlesLabel: string
}) {
  const Icon = categoryIconsById[category.id] ?? BookText

  return (
    <Link
      id={`faq-tab-${category.id}`}
      href={href}
      scroll={false}
      role="tab"
      aria-selected={active}
      aria-controls={`faq-panel-${category.id}`}
      className={`group flex h-full w-[14rem] shrink-0 snap-start flex-col rounded-[1.1rem] border border-black/8 border-t-2 bg-white p-4 text-start transition-all duration-300 sm:w-[14.5rem] md:w-[15rem] ${
        active ? "border-t-[#01AACF]" : "border-t-[#01AACF]/30"
      }`}
    >
      <Icon className="h-6 w-6 text-[#01AACF]" strokeWidth={1.8} />

      <h3 className="mt-5 text-[0.95rem] font-semibold leading-[1.2] tracking-[-0.04em] text-[#01AACF]">
        {category.name}
      </h3>

      <div className="mt-auto pt-5 text-[0.8rem] font-medium tracking-[-0.02em] text-[#01AACF]">
        {articlesLabel}
      </div>
    </Link>
  )
}

export function FaqView({
  categories,
  searchTerm,
  activeCategory,
}: {
  categories: readonly FaqCategory[]
  searchTerm: string
  activeCategory: string
}) {
  const isDesktop = useDesktopLayout()
  const t = useTranslations("common.faqUi")
  const locale = useLocale()
  const faqAction = locale === "en" ? "/faq" : `/${locale}/faq`
  const searchResults = searchTerm ? searchQuestions(categories, searchTerm) : []
  const activeQuestions =
    categories.find((category) => category.name === activeCategory)?.questions ?? []
  const sidebarSections = categories.map((category) => ({
    id: category.id,
    title: category.name,
  }))
  const defaultName = categories[0]?.name ?? ""
  const clearHref = buildFaqHref({
    category: activeCategory !== defaultName ? activeCategory : undefined,
  })

  return (
    <>
      <div className="mb-10 py-8 text-center lg:mb-8 lg:py-14">
        <h1 className="type-index-title mb-8 text-center text-foreground">
          {t("heading")}
        </h1>

        <form action={faqAction} className="mx-auto max-w-md">
          {activeCategory ? (
            <input type="hidden" name="category" value={activeCategory} />
          ) : null}
          <div className="relative">
            <div className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              name="q"
              defaultValue={searchTerm}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-full border border-black/10 bg-white py-3.5 ps-12 pe-24 text-gray-800 placeholder:text-gray-400 focus:border-black/30 focus:outline-none focus:ring-2 focus:ring-black/8"
            />
            <button
              type="submit"
              className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-black/20 hover:text-black"
            >
              {t("search")}
            </button>
          </div>
        </form>
      </div>

      <div className={`mb-10 overflow-x-auto pb-2 lg:mb-12 ${searchTerm ? "" : "xl:hidden"}`}>
        <div aria-label={t("categoriesAria")} role="tablist" className="flex w-max snap-x snap-mandatory gap-4">
          {categories.map((category) => {
            const active = activeCategory === category.name && !searchTerm

            return (
              <FaqCategoryCard
                key={category.id}
                category={category}
                active={active}
                articlesLabel={t("articles", { count: category.questions.length })}
                href={buildFaqHref({
                  category: category.name === defaultName ? undefined : category.name,
                })}
              />
            )
          })}
        </div>
      </div>

      <div className={searchTerm ? "" : "xl:hidden"}>
        {searchTerm ? (
          <>
            <div className="mb-7 flex items-center justify-between gap-4">
              <h2 className="text-[1.45rem] font-semibold leading-[1.15] tracking-[-0.03em] text-gray-950 sm:text-[1.7rem]">
                {t("searchResults")}
              </h2>
              <Link
                href={clearHref}
                className="text-sm font-medium text-gray-700 underline decoration-black/20 underline-offset-4 hover:text-black hover:decoration-black/50"
              >
                {t("clearSearch")}
              </Link>
            </div>

            {searchResults.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-gray-500">{t("noResults", { query: searchTerm })}</p>
              </div>
            ) : (
              <FaqAccordionList
                items={searchResults}
                showCategory
                categoryLabel={(name) => t("category", { name })}
              />
            )}
          </>
        ) : (
          <div
            id={`faq-panel-${categories.find((category) => category.name === activeCategory)?.id ?? categories[0]?.id ?? "default"}`}
            role="tabpanel"
            aria-labelledby={`faq-tab-${categories.find((category) => category.name === activeCategory)?.id ?? categories[0]?.id ?? "default"}`}
          >
            <FaqAccordionList items={activeQuestions} categoryLabel={(name) => t("category", { name })} />
          </div>
        )}
      </div>

      {!searchTerm && isDesktop ? (
        <div className="hidden xl:grid xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-24">
          <div className="max-w-3xl">
            {categories.map((category) => (
              <section key={category.id} id={category.id} className="scroll-mt-32 py-12 first:pt-0">
                <div className="mb-6">
                  <h2 className="text-[1.7rem] font-semibold leading-[1.15] tracking-[-0.04em] text-[#01AACF]">
                    {category.name}
                  </h2>
                </div>

                <FaqAccordionList items={category.questions} categoryLabel={(name) => t("category", { name })} />
              </section>
            ))}
          </div>

          <div className="hidden self-start xl:block xl:sticky xl:top-28 xl:justify-self-end xl:pt-4">
            <ScrollSpySidebar sections={sidebarSections} sectionColor="cyan" />
          </div>
        </div>
      ) : null}
    </>
  )
}

export function FaqFromSearchParams({ categories }: { categories: readonly FaqCategory[] }) {
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get("q")?.trim() ?? ""
  const activeCategory = normalizeCategory(categories, searchParams.get("category"))

  return <FaqView categories={categories} searchTerm={searchTerm} activeCategory={activeCategory} />
}
