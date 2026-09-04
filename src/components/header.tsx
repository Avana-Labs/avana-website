"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import HeaderDesktopNavigation from "@/components/header-desktop-navigation"
import { HeaderHelpCenterButton } from "@/components/header-help-center-button"
import HeaderLanguageDropdown from "@/components/header-language-dropdown"
import HeaderMobileNavigation from "@/components/header-mobile-navigation"
import { HeaderThemeToggle } from "@/components/header-theme-toggle"
import { Link } from "@/i18n/navigation"
import { HEADER_WORDMARK_PATH, SITE_NAME, siteRoutes } from "@/lib/site"

function BrandLogo({ alt }: { alt: string }) {
  return (
    <span className="inline-flex items-center overflow-hidden">
      <Image
        src={HEADER_WORDMARK_PATH}
        alt={alt}
        width={480}
        height={240}
        quality={85}
        className="h-[56px] w-auto origin-left scale-[1.08] md:h-[52px]"
      />
    </span>
  )
}

export default function Header(): React.JSX.Element {
  const t = useTranslations("common")

  return (
    <header className="sticky top-0 z-50 bg-[var(--header-surface)] backdrop-blur-[10px]">
      <div className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 md:h-[54px] md:gap-3 md:px-6 lg:px-6 xl:px-8">
        <div className="inline-flex shrink-0 items-center">
          <Link href={siteRoutes.home} aria-label={SITE_NAME} data-framer-name="Logo" className="inline-flex items-center">
            <BrandLogo alt={t("a11y.logo", { site: SITE_NAME })} />
          </Link>
        </div>

        <HeaderDesktopNavigation />

        <div className="hidden items-center gap-1.5 lg:flex xl:gap-2">
          <HeaderHelpCenterButton />
          <HeaderThemeToggle />
          <HeaderLanguageDropdown />
        </div>

        <HeaderMobileNavigation />
      </div>
    </header>
  )
}
