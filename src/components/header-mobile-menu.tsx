"use client"

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react"
import { createPortal } from "react-dom"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
// import { AAVE_ARFC_LABEL, siteRoutes } from "@/lib/site"
import { siteRoutes } from "@/lib/site"

interface HeaderMobileMenuProps {
  open: boolean
  onClose: () => void
}

function focusMenuTarget(menu: HTMLElement | null) {
  if (!menu) return
  const firstLink = menu.querySelector<HTMLElement>("a[href], button:not([disabled])")
  ;(firstLink ?? menu).focus()
}

export default function HeaderMobileMenu({ open, onClose }: HeaderMobileMenuProps) {
  const t = useTranslations("common")
  const menuRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const [isShown, setIsShown] = useState(false)

  const mobileLinks = [
    { href: siteRoutes.borrow, label: t("nav.borrow") },
    { href: siteRoutes.lend, label: t("nav.lend") },
    { href: siteRoutes.multiply, label: t("nav.multiply") },
    { href: siteRoutes.about, label: t("nav.about") },
    { href: siteRoutes.newsroom, label: t("nav.newsroom") },
    { href: siteRoutes.faq, label: t("nav.helpCenter") },
    { href: siteRoutes.developers, label: t("nav.developers") },
    { href: siteRoutes.pricing, label: t("nav.pricing") },
    // Temporarily hidden — bring back later
    // { href: "https://governance.aave.com/", label: AAVE_ARFC_LABEL, external: true },
    { href: "https://app.avana.cc", label: t("cta.sandboxLong"), external: true },
  ] as const

  useEffect(() => {
    let frame = 0
    let nextFrame = 0

    if (!open) {
      frame = window.requestAnimationFrame(() => setIsShown(false))
      return () => window.cancelAnimationFrame(frame)
    }

    frame = window.requestAnimationFrame(() => {
      nextFrame = window.requestAnimationFrame(() => setIsShown(true))
    })

    return () => {
      window.cancelAnimationFrame(frame)
      window.cancelAnimationFrame(nextFrame)
    }
  }, [open])

  const isVisible = open && isShown

  useLayoutEffect(() => {
    if (open) {
      previousFocusRef.current ??= document.activeElement instanceof HTMLElement ? document.activeElement : null
      if (!isShown) return

      // Move focus before paint so a11y gates don't race the open animation.
      focusMenuTarget(menuRef.current)
      const frame = window.requestAnimationFrame(() => focusMenuTarget(menuRef.current))
      return () => window.cancelAnimationFrame(frame)
    }

    previousFocusRef.current?.focus()
    previousFocusRef.current = null
  }, [isShown, open])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault()
      onClose()
      return
    }

    if (event.key !== "Tab") return

    const focusable = menuRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")
    if (!focusable?.length) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return createPortal(
    <div
      ref={menuRef}
      tabIndex={-1}
      className={`fixed inset-x-0 bottom-0 top-16 z-40 bg-background transition-opacity duration-300 ease-out md:top-[54px] lg:hidden ${
        isVisible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={t("a11y.mobileMenu")}
      aria-hidden={!isVisible}
      inert={!isVisible}
      onKeyDown={handleKeyDown}
    >
      <nav
        id="mobile-site-nav"
        aria-label={t("a11y.mobileNav")}
        className={`h-[calc(100dvh-4rem)] overflow-y-auto px-4 pb-10 pt-10 transition-all duration-300 ease-out sm:px-6 md:h-[calc(100dvh-54px)] ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <ol>
          {mobileLinks.map((link, index) => {
            const external = "external" in link && link.external
            return (
              <li
                key={`${link.label}-${link.href}`}
                className={`border-b border-border transition-all duration-300 ease-out ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${120 + index * 35}ms` }}
              >
                {external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-end justify-between gap-5 py-3"
                    onClick={onClose}
                  >
                    <span className="text-[clamp(1.7rem,7.1vw,2.45rem)] font-medium leading-[0.98] tracking-[-0.03em] text-foreground">
                      {link.label}
                    </span>
                    <span className="shrink-0 pb-0.5 text-[0.95rem] font-medium tracking-[-0.03em] text-type-tertiary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="flex items-end justify-between gap-5 py-3"
                    onClick={onClose}
                  >
                    <span className="text-[clamp(1.7rem,7.1vw,2.45rem)] font-medium leading-[0.98] tracking-[-0.03em] text-foreground">
                      {link.label}
                    </span>
                    <span className="shrink-0 pb-0.5 text-[0.95rem] font-medium tracking-[-0.03em] text-type-tertiary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>,
    document.body,
  )
}
