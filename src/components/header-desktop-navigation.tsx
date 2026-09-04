"use client"

import dynamic from "next/dynamic"
import { BookOpenText, ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { desktopMenuButtons, type DesktopMenuId } from "@/components/header-nav-data"
import { Link, usePathname } from "@/i18n/navigation"
import { siteRoutes } from "@/lib/site"
// import { AAVE_ARFC_LABEL, siteRoutes } from "@/lib/site"
// import { ArrowUpRight } from "lucide-react"

const DeferredHeaderDesktopMenuPanel = dynamic(() => import("@/components/header-desktop-menu-panel"), { ssr: false })

let desktopMenuPanelPromise: Promise<unknown> | null = null

function warmDesktopMenuPanel() {
  desktopMenuPanelPromise ??= import("@/components/header-desktop-menu-panel")
}

function isPathInSection(pathname: string, matchHrefs: readonly string[]) {
  return matchHrefs.some(
    (href) => pathname === href || pathname.startsWith(`${href}/`),
  )
}

export default function HeaderDesktopNavigation() {
  const t = useTranslations("common")
  const pathname = usePathname() || "/"
  const [desktopMenuOpen, setDesktopMenuOpen] = useState<DesktopMenuId | null>(null)
  const [desktopMenuRendered, setDesktopMenuRendered] = useState<DesktopMenuId | null>(null)
  const [desktopMenuAnimationCycle, setDesktopMenuAnimationCycle] = useState(0)
  const desktopCloseTimeoutRef = useRef<number | null>(null)

  const clearDesktopCloseTimeout = () => {
    if (desktopCloseTimeoutRef.current !== null) {
      window.clearTimeout(desktopCloseTimeoutRef.current)
      desktopCloseTimeoutRef.current = null
    }
  }

  const openDesktopMenu = (menuId: DesktopMenuId) => {
    warmDesktopMenuPanel()
    clearDesktopCloseTimeout()
    setDesktopMenuRendered(menuId)
    setDesktopMenuOpen(menuId)
    setDesktopMenuAnimationCycle((current) => current + 1)
  }

  const scheduleDesktopMenuClose = () => {
    clearDesktopCloseTimeout()
    desktopCloseTimeoutRef.current = window.setTimeout(() => {
      setDesktopMenuOpen(null)
      desktopCloseTimeoutRef.current = null
    }, 110)
  }

  const closeDesktopMenu = () => {
    clearDesktopCloseTimeout()
    setDesktopMenuOpen(null)
  }

  useEffect(() => () => clearDesktopCloseTimeout(), [])

  const menuLabels: Record<DesktopMenuId, string> = {
    products: t("nav.products"),
    resources: t("nav.resources"),
    developers: t("nav.developers"),
  }

  return (
    <>
      <nav
        aria-label={t("a11y.primaryNav")}
        className="hidden min-w-0 items-center lg:ms-4 lg:me-auto lg:flex lg:gap-3 xl:ms-6 xl:gap-7 2xl:gap-8"
        onMouseEnter={warmDesktopMenuPanel}
        onMouseLeave={scheduleDesktopMenuClose}
      >
        {desktopMenuButtons.map((menu) => {
          const isOpen = desktopMenuOpen === menu.id
          const isCurrentSection = isPathInSection(pathname, menu.matchHrefs)
          const isHighlighted = isOpen || isCurrentSection

          return (
            <button
              key={menu.id}
              type="button"
              aria-haspopup="true"
              aria-expanded={isOpen}
              aria-controls={`desktop-menu-${menu.id}`}
              onMouseEnter={() => openDesktopMenu(menu.id)}
              onFocus={() => openDesktopMenu(menu.id)}
              onClick={() => openDesktopMenu(menu.id)}
              className={`site-header-nav-link group relative inline-flex items-center gap-1 px-0 py-1 font-medium tracking-[-0.02em] transition-[color,opacity] duration-200 ease-out xl:gap-1.5 ${isHighlighted ? "text-type-accent" : "text-foreground/62 hover:text-foreground/94"}`}
            >
              <span>{menuLabels[menu.id]}</span>
              <ChevronDown
                aria-hidden="true"
                className={`h-[15px] w-[15px] shrink-0 transition-transform duration-200 ease-out ${isOpen ? "rotate-180" : "rotate-0"}`}
                strokeWidth={2.35}
              />
            </button>
          )
        })}
        <Link
          href={siteRoutes.faq}
          onMouseEnter={closeDesktopMenu}
          onFocus={closeDesktopMenu}
          aria-label={t("nav.helpCenter")}
          title={t("nav.helpCenter")}
          className={`site-header-nav-link group relative inline-flex items-center gap-1.5 px-0 py-1 font-medium tracking-[-0.02em] transition-[color,opacity] duration-200 ease-out ${pathname === siteRoutes.faq ? "text-type-accent" : "text-foreground/62 hover:text-type-accent"}`}
        >
          <span className="hidden xl:inline">{t("nav.helpCenter")}</span>
          <BookOpenText
            aria-hidden="true"
            className="h-[17px] w-[17px] shrink-0 transition-transform duration-200 ease-out group-hover:scale-105 xl:h-[15px] xl:w-[15px]"
            strokeWidth={2.35}
          />
        </Link>
        {/* Temporarily hidden — bring back later
        <a
          href="https://governance.aave.com/"
          target="_blank"
          rel="noreferrer"
          onMouseEnter={closeDesktopMenu}
          onFocus={closeDesktopMenu}
          aria-label={AAVE_ARFC_LABEL}
          title={AAVE_ARFC_LABEL}
          className="site-header-nav-link group relative inline-flex items-center gap-1.5 px-0 py-1 font-medium tracking-[-0.02em] text-foreground/62 transition-[color,opacity] duration-200 ease-out hover:text-type-accent"
        >
          <span className="hidden xl:inline">{AAVE_ARFC_LABEL}</span>
          <ArrowUpRight
            aria-hidden="true"
            className="h-[17px] w-[17px] shrink-0 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 xl:h-[15px] xl:w-[15px]"
            strokeWidth={2.35}
          />
        </a>
        */}
      </nav>

      {desktopMenuRendered !== null ? (
        <DeferredHeaderDesktopMenuPanel
          menuId={desktopMenuRendered}
          isOpen={desktopMenuOpen !== null}
          onOpen={clearDesktopCloseTimeout}
          onClose={scheduleDesktopMenuClose}
          onExited={() => setDesktopMenuRendered(null)}
          animationCycle={desktopMenuAnimationCycle}
        />
      ) : null}
    </>
  )
}
