"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useTranslations } from "next-intl"
import { HeaderHelpCenterMobileRow } from "@/components/header-help-center-button"
import { Link } from "@/i18n/navigation"
// import { AAVE_ARFC_LABEL, siteRoutes } from "@/lib/site"
import { siteRoutes } from "@/lib/site"

interface HeaderMobileMenuProps {
  open: boolean
  onClose: () => void
}

export default function HeaderMobileMenu({ open, onClose }: HeaderMobileMenuProps) {
  const t = useTranslations("common")
  const [isShown, setIsShown] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!open || !dialog) return
    const previousFocus = document.activeElement as HTMLElement | null
    dialog.showModal()
    closeButtonRef.current?.focus()
    return () => {
      dialog.close()
      previousFocus?.focus()
    }
  }, [open])

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

  return createPortal(
    <dialog
      ref={dialogRef}
      className={`fixed inset-x-0 bottom-0 top-16 m-0 h-[calc(100dvh-4rem)] max-h-none w-full max-w-none overflow-visible border-0 bg-background p-0 text-foreground transition-opacity duration-300 ease-out backdrop:bg-transparent md:top-[54px] md:h-[calc(100dvh-54px)] lg:hidden ${
        isVisible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-labelledby="mobile-menu-title"
      onCancel={event => { event.preventDefault(); onClose() }}
    >
      <h2 id="mobile-menu-title" className="sr-only">{t("a11y.mobileMenu")}</h2>
      <button
        type="button"
        ref={closeButtonRef}
        aria-label={t("a11y.closeMenu")}
        onClick={onClose}
        className="absolute -top-[54px] end-4 inline-flex size-11 items-center justify-center bg-background text-type-accent sm:end-6 md:-top-[49px]"
      >
        <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
          <path d="m5 5 14 14M19 5 5 19" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
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

        <div
          className={`transition-all duration-300 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: `${120 + mobileLinks.length * 35}ms` }}
        >
          <HeaderHelpCenterMobileRow onNavigate={onClose} />
        </div>
      </nav>
    </dialog>,
    document.body,
  )
}
