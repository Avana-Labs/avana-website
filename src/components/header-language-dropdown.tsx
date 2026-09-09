"use client"

import { Check, ChevronDown, Globe2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useEffect, useRef, useState, useTransition } from "react"
import { usePathname, useRouter } from "@/i18n/navigation"
import { locales, type AppLocale } from "@/i18n/locales"

export default function HeaderLanguageDropdown({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile"
}) {
  const t = useTranslations("common")
  const locale = useLocale() as AppLocale
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const closeTimeoutRef = useRef<number | null>(null)
  const isMobile = variant === "mobile"

  const selected = locales.find((entry) => entry.code === locale) ?? locales[0]

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const openMenu = () => {
    clearCloseTimeout()
    setIsOpen(true)
  }

  const scheduleClose = () => {
    clearCloseTimeout()
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false)
      closeTimeoutRef.current = null
    }, 110)
  }

  useEffect(() => () => clearCloseTimeout(), [])

  const selectLocale = (nextLocale: AppLocale) => {
    setIsOpen(false)
    if (nextLocale === locale) return

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale })
    })
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        if (!isMobile) openMenu()
      }}
      onMouseLeave={() => {
        if (!isMobile) scheduleClose()
      }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        aria-label={t("a11y.language", { language: selected.label })}
        disabled={isPending}
        className={`site-header-nav-link group relative inline-flex items-center justify-center px-0 py-1 font-medium tracking-[-0.02em] transition-[color,opacity] duration-200 ease-out ${
          isMobile
            ? "h-10 gap-2 text-[1rem] text-type-accent"
            : `h-9 gap-1.5 xl:gap-2 ${isOpen ? "text-type-accent" : "text-foreground hover:text-type-accent"}`
        }`}
      >
        <Globe2 aria-hidden="true" className="h-[19px] w-[19px] shrink-0" strokeWidth={2.25} />
        <span className={isMobile ? undefined : "hidden max-w-[9rem] truncate xl:inline"}>
          {selected.label}
        </span>
        {isMobile ? (
          <ChevronDown
            aria-hidden="true"
            className={`h-[17px] w-[17px] shrink-0 transition-transform duration-200 ease-out ${isOpen ? "rotate-180" : "rotate-0"}`}
            strokeWidth={2.4}
          />
        ) : null}
      </button>

      {isOpen ? (
        <div role="menu" className={`absolute z-50 pt-2 ${isMobile ? "end-[-3.25rem]" : "end-0"}`}>
          <div
            className={`max-h-[28rem] overflow-y-auto rounded-[16px] border border-border bg-popover py-3 shadow-[0_18px_50px_rgba(15,23,42,0.12)] ${
              isMobile ? "w-[20rem]" : "w-[23rem]"
            }`}
          >
            {locales.map((language) => {
              const isSelected = language.code === locale

              return (
                <button
                  key={language.code}
                  type="button"
                  role="menuitem"
                  onClick={() => selectLocale(language.code)}
                  className={`flex h-12 w-full items-center justify-between gap-4 px-5 text-start text-[1rem] font-medium tracking-[-0.03em] transition-colors duration-150 ease-out hover:bg-foreground/5 ${
                    isSelected ? "bg-foreground/[0.04] text-type-accent" : "text-foreground/80"
                  }`}
                >
                  <span>{language.label}</span>
                  {isSelected ? (
                    <Check aria-hidden="true" className="h-[18px] w-[18px] shrink-0" strokeWidth={2.4} />
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
