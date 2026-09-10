import { revalidateTag } from "next/cache"
import type { AppLocale } from "@/i18n/locales"
import { defaultLocale } from "@/i18n/locales"
import { loadFaqContent } from "@/lib/content-i18n/load-content"

/**
 * Canonical FAQ content and small server-side helpers for the `/faq` route.
 * Locale-specific bodies live in `content/{locale}/faq.json`.
 */
export type FaqQuestion = {
  id: string
  q: string
  a: string
}

export type FaqCategory = {
  id: string
  name: string
  summary: string
  questions: FaqQuestion[]
}

export type FaqSearchResult = FaqQuestion & {
  category: string
}

export const FAQ_CONTENT_TAG = "faq-content"

/** English default category name (fallback only). Prefer categories[0].name after load. */
export const defaultFaqCategory = "General Questions"

async function loadCategoriesForLocale(locale: string): Promise<FaqCategory[]> {
  const data = await loadFaqContent(locale)
  return data.categories as FaqCategory[]
}

export async function getFaqCategories(locale: AppLocale): Promise<FaqCategory[]> {
  return loadCategoriesForLocale(locale)
}

export async function buildFaqSchema(locale: AppLocale = defaultLocale) {
  const categories = await getFaqCategories(locale)
  const questions = categories.flatMap((category) => category.questions.slice(0, 3))

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((question) => ({
      "@type": "Question",
      name: question.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: question.a,
      },
    })),
  }
}

// Build-time placeholder; layout prefers buildFaqSchema when available.
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [] as Array<Record<string, unknown>>,
}

export function normalizeFaqCategory(
  requestedCategory?: string,
  categories: readonly FaqCategory[] = [],
) {
  const fallback = categories[0]?.name ?? defaultFaqCategory
  return categories.find((category) => category.name === requestedCategory)?.name ?? fallback
}

export function getFaqQuestionsForCategory(
  categories: readonly FaqCategory[],
  categoryName: string,
) {
  return categories.find((category) => category.name === categoryName)?.questions ?? []
}

export function searchFaqQuestions(
  categories: readonly FaqCategory[],
  rawSearchTerm: string,
): FaqSearchResult[] {
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

export function revalidateFaqContent() {
  revalidateTag(FAQ_CONTENT_TAG, "max")
}
