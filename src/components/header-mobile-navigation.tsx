"use client"

import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import HeaderLanguageDropdown from "@/components/header-language-dropdown"

const DeferredHeaderMobileMenu = dynamic(() => import("@/components/header-mobile-menu"), {
  ssr: false,
})

let mobileMenuPromise: Promise<unknown> | null = null

function warmMobileMenu() {
  mobileMenuPromise ??= import("@/components/header-mobile-menu")
}

function MobileMenuToggleIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-[18px] w-[26px]">
      <span
        className={`absolute left-0 h-[2.5px] w-full origin-center rounded-full bg-current transition-transform duration-200 ease-out ${
          open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[3px]"
        }`}
      />
      <span
        className={`absolute left-0 h-[2.5px] w-full origin-center rounded-full bg-current transition-transform duration-200 ease-out ${
          open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-[3px]"
        }`}
      />
    </span>
  )
}

export default function HeaderMobileNavigation() {
  const t = useTranslations("common")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileMenuMounted, setMobileMenuMounted] = useState(false)
  const [mobileMenuAnimationCycle, setMobileMenuAnimationCycle] = useState(0)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = mobileMenuOpen ? "hidden" : previousOverflow

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileMenuOpen])

  return (
    <div className="ms-auto flex items-center gap-2 lg:hidden" data-framer-name="Navigation Mobile">
      <HeaderLanguageDropdown variant="mobile" />

      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center text-type-accent transition hover:text-type-accent/80"
        aria-label={mobileMenuOpen ? t("a11y.closeMenu") : t("a11y.openMenu")}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-site-nav"
        onFocus={warmMobileMenu}
        onPointerEnter={warmMobileMenu}
        onTouchStart={warmMobileMenu}
        onClick={() => {
          if (mobileMenuOpen) {
            setMobileMenuOpen(false)
            return
          }

          warmMobileMenu()
          setMobileMenuMounted(true)
          setMobileMenuOpen(true)
          setMobileMenuAnimationCycle((current) => current + 1)
        }}
      >
        <MobileMenuToggleIcon open={mobileMenuOpen} />
      </button>

      {mobileMenuMounted ? (
        <DeferredHeaderMobileMenu
          key={mobileMenuAnimationCycle}
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
      ) : null}
    </div>
  )
}
