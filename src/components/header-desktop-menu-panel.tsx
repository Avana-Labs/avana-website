"use client"

import { useTranslations } from "next-intl"
import type { DesktopMenuId } from "@/components/header-nav-data"
import { Link } from "@/i18n/navigation"
import { siteRoutes } from "@/lib/site"

interface DesktopMenuItem {
  href: string
  label: string
  description?: string
  external?: boolean
}

interface DesktopMenuGroup {
  id: DesktopMenuId
  eyebrow: string
  items: DesktopMenuItem[]
  supportingTitle?: string
  supportingItems: DesktopMenuItem[]
}

function toSentenceCase(value: string) {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

interface HeaderDesktopMenuPanelProps {
  menuId: DesktopMenuId
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onExited: () => void
  animationCycle: number
}

export default function HeaderDesktopMenuPanel({
  menuId,
  isOpen,
  onOpen,
  onClose,
  onExited,
  animationCycle,
}: HeaderDesktopMenuPanelProps) {
  const t = useTranslations("common")

  const desktopMenus: readonly DesktopMenuGroup[] = [
    {
      id: "products",
      eyebrow: t("mega.exploreProducts"),
      items: [
        { href: siteRoutes.borrow, label: t("nav.borrow") },
        { href: siteRoutes.lend, label: t("nav.lend") },
        { href: siteRoutes.multiply, label: t("nav.multiply") },
      ],
      supportingTitle: t("mega.whatYouCanDo"),
      supportingItems: [
        {
          href: siteRoutes.borrow,
          label: t("mega.borrowAgainstLp"),
          description: t("mega.borrowAgainstLpDesc"),
        },
        {
          href: siteRoutes.multiply,
          label: t("mega.openMultiply"),
          description: t("mega.openMultiplyDesc"),
        },
        {
          href: siteRoutes.lend,
          label: t("mega.lendThroughHub"),
          description: t("mega.lendThroughHubDesc"),
        },
      ],
    },
    {
      id: "resources",
      eyebrow: t("mega.exploreResources"),
      items: [
        { href: siteRoutes.about, label: t("nav.about") },
        { href: siteRoutes.newsroom, label: t("nav.newsroom") },
        { href: siteRoutes.brand, label: t("nav.brand") },
      ],
      supportingTitle: t("mega.whereToLook"),
      supportingItems: [
        {
          href: siteRoutes.about,
          label: t("nav.about"),
          description: t("mega.aboutDesc"),
        },
        {
          href: siteRoutes.newsroom,
          label: t("mega.followNotes"),
          description: t("mega.followNotesDesc"),
        },
        {
          href: siteRoutes.brand,
          label: t("mega.browseBrand"),
          description: t("mega.browseBrandDesc"),
        },
      ],
    },
    {
      id: "developers",
      eyebrow: t("mega.exploreDevelopers"),
      items: [
        { href: siteRoutes.developers, label: t("nav.overview") },
        { href: "/developers/architecture", label: t("nav.architecture") },
        { href: "/developers/liquidation", label: t("nav.liquidation") },
      ],
      supportingTitle: t("mega.highlights"),
      supportingItems: [
        {
          href: siteRoutes.developers,
          label: t("mega.startOverview"),
          description: t("mega.startOverviewDesc"),
        },
        {
          href: "/developers/architecture",
          label: t("mega.reviewModel"),
          description: t("mega.reviewModelDesc"),
        },
        {
          href: "/developers/liquidation",
          label: t("mega.understandLiquidation"),
          description: t("mega.understandLiquidationDesc"),
        },
      ],
    },
  ]

  const menu = desktopMenus.find((entry) => entry.id === menuId)
  if (!menu) return null

  return (
    <div
      id={`desktop-menu-${menu.id}`}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onTransitionEnd={(event) => {
        if (!isOpen && event.target === event.currentTarget) {
          onExited()
        }
      }}
      className={`fixed inset-x-0 top-16 z-40 hidden transform-gpu transition-[opacity,transform] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] md:top-[54px] md:block ${
        isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-6 opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <div className="border-b border-border bg-background shadow-[0_24px_72px_rgba(0,0,0,0.04)]">
        <div className="site-content-shell bg-background py-5">
          <div
            key={`${menu.id}-${animationCycle}`}
            className="grid gap-6 lg:min-h-[14.75rem] lg:grid-cols-[minmax(0,19rem)_minmax(15rem,18rem)] lg:gap-2.5 xl:grid-cols-[minmax(0,20rem)_minmax(15rem,18rem)] xl:gap-3"
          >
            <div className="space-y-2.5">
              <p className="type-meta-label text-type-tertiary">
                {toSentenceCase(menu.eyebrow)}
              </p>
              <div className="space-y-1">
                {menu.items.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    suppressHydrationWarning
                    className={`group flex items-start gap-4 py-1.5 text-start text-foreground transition-[opacity,color,filter] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-foreground/74 ${
                      isOpen ? "opacity-100 blur-0" : "opacity-[0.18] blur-[0.2px]"
                    }`}
                    style={{ transitionDelay: `${180 + index * 55}ms` }}
                  >
                    <span className="text-[clamp(1.5rem,1.95vw,2.45rem)] font-normal leading-[1.04] tracking-[-0.03em] transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div
              className={`space-y-2.5 pt-0.5 transition-[opacity,filter] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isOpen ? "opacity-100 blur-0" : "opacity-[0.16] blur-[0.2px]"
              }`}
              style={{ transitionDelay: "280ms" }}
            >
              {menu.supportingTitle ? (
                <p className="type-meta-label text-type-tertiary">{menu.supportingTitle}</p>
              ) : null}
              <div className="space-y-3">
                {menu.supportingItems.map((item, index) => (
                  <Link
                    key={`${item.href}-${item.label}`}
                    href={item.href}
                    aria-label={item.label}
                    suppressHydrationWarning
                    className="group block min-h-[2.8rem] text-start"
                  >
                    <div className="flex items-start gap-[0.6875rem]">
                      <span aria-hidden="true" className="pt-1 text-[0.56rem] font-medium tracking-[0.16em] text-foreground/24">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="line-clamp-2 text-[0.78rem] font-medium leading-[1.24] tracking-[-0.02em] text-foreground/76 transition-colors duration-200 group-hover:text-foreground">
                          {item.label}
                        </p>
                        {item.description ? (
                          <p className="mt-1 line-clamp-2 max-w-[24rem] text-[0.68rem] leading-[1.42] tracking-[-0.01em] text-foreground/46 transition-colors duration-200 group-hover:text-foreground/58">
                            {item.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
