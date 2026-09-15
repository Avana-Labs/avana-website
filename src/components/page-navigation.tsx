/**
 * Page Navigation Component — previous/next for developer documentation.
 */

"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/navigation"
import { navigationSections } from "./developer-sidebar"

const flattenedPages = navigationSections.flatMap((section) =>
  section.items.map((item) => ({
    href: item.href,
    labelKey: item.labelKey,
    sectionTitleKey: section.titleKey,
  })),
)

export function PageNavigation() {
  const t = useTranslations("common")
  const pathname = usePathname()
  const normalizedPathname = pathname || "/"

  const currentIndex = flattenedPages.findIndex((page) => page.href === normalizedPathname)

  if (currentIndex === -1) return null

  const prevPage = currentIndex > 0 ? flattenedPages[currentIndex - 1] : null
  const nextPage = currentIndex < flattenedPages.length - 1 ? flattenedPages[currentIndex + 1] : null

  return (
    <div className="mt-12 border-t border-gray-200 pt-6">
      <div className="flex items-stretch justify-between gap-4">
        {prevPage ? (
          <Link
            href={prevPage.href}
            className="group max-w-[50%] flex-1 rounded-lg border border-gray-200 p-4 transition-colors hover:border-cyan-200 hover:bg-cyan-50/40"
          >
            <div className="type-supporting mb-1 flex items-center gap-1 text-type-accent transition-colors group-hover:text-[#008fb0]">
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              <span>{t("docs.previous")}</span>
            </div>
            <div className="type-body-copy font-medium text-[#0F1518] transition-colors group-hover:text-type-accent">
              {t(prevPage.labelKey)}
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {nextPage ? (
          <Link
            href={nextPage.href}
            className="group max-w-[50%] flex-1 rounded-lg border border-gray-200 p-4 text-end transition-colors hover:border-cyan-200 hover:bg-cyan-50/40"
          >
            <div className="type-supporting mb-1 flex items-center justify-end gap-1 text-type-accent transition-colors group-hover:text-[#008fb0]">
              <span>{t("docs.next")}</span>
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </div>
            <div className="type-body-copy font-medium text-[#0F1518] transition-colors group-hover:text-type-accent">
              {t(nextPage.labelKey)}
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  )
}
