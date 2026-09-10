/**
 * Footer - The site-wide footer component.
 */
import { getImageProps } from "next/image"
import { getLocale, getTranslations } from "next-intl/server"
import Link from "next/link"
import { withLocale } from "@/lib/i18n/path"
import { HEADER_WORDMARK_PATH, SITE_NAME, siteRoutes } from "@/lib/site"
import { cn } from "@/lib/utils"

interface FooterLink {
  href: string
  label: string
  external?: boolean
}

interface FooterSection {
  title: string
  links: readonly FooterLink[]
  className?: string
}

interface SocialLink {
  href: string
  label: string
  name: string
  icon: React.ReactNode
  className: string
}

const socialIcons = {
  twitter: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5">
      <path
        d="M4 4L20 20M20 4L4 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.68c-2.78.61-3.37-1.18-3.37-1.18-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.33 1.08 2.9.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03a9.57 9.57 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.69.9.69 1.82v2.7c0 .26.18.57.69.48A10 10 0 0 0 12 2Z"
      />
    </svg>
  ),
} as const

export default async function Footer(): Promise<React.JSX.Element> {
  const [t, locale] = await Promise.all([getTranslations("common"), getLocale()])

  const socialLinks: readonly SocialLink[] = [
    {
      href: "https://twitter.com/avana_labs",
      label: t("footer.socialAria", { network: t("footer.twitter") }),
      name: t("footer.twitter"),
      icon: socialIcons.twitter,
      className: "bg-[#01AACF] text-white hover:bg-[#00a0c2]",
    },
    {
      href: "https://github.com/Avana-Labs",
      label: t("footer.socialAria", { network: t("footer.github") }),
      name: t("footer.github"),
      icon: socialIcons.github,
      className: "bg-black/[0.06] text-foreground hover:bg-black/[0.1]",
    },
  ]

  const footerSections: readonly FooterSection[] = [
    {
      title: t("footer.explore"),
      links: [
        { href: siteRoutes.borrow, label: t("nav.borrow") },
        { href: siteRoutes.lend, label: t("nav.lend") },
        { href: siteRoutes.multiply, label: t("nav.multiply") },
      ],
    },
    {
      title: t("footer.resources"),
      links: [
        { href: siteRoutes.about, label: t("nav.about") },
        { href: siteRoutes.newsroom, label: t("nav.newsroom") },
        { href: siteRoutes.faq, label: t("nav.faq") },
        { href: siteRoutes.brand, label: t("nav.brand") },
      ],
    },
    {
      title: t("footer.docs"),
      links: [
        { href: siteRoutes.developers, label: t("nav.developers") },
        { href: siteRoutes.privacy, label: t("nav.privacy") },
        { href: siteRoutes.terms, label: t("nav.terms") },
      ],
    },
  ]

  const footerDisclosure = [t("footer.disclosureRisk"), t("footer.disclosureInfo")] as const

  return (
    <footer className="w-full">
      <div className="h-px w-full bg-border" aria-hidden="true" />
      <div className="site-content-shell pt-12 pb-6">
        <div className="grid gap-x-8 gap-y-12 lg:grid-cols-[minmax(16rem,1.2fr)_minmax(0,1fr)] lg:gap-x-8 xl:gap-x-10">
          <div className="space-y-5 lg:max-w-sm lg:justify-self-start">
            <Link
              prefetch={false}
              href={withLocale(locale, siteRoutes.home)}
              className="inline-flex w-fit items-start justify-start"
            >
              {/* Keep this shared image in HTML instead of importing a page client chunk. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                {...getImageProps({
                  src: HEADER_WORDMARK_PATH,
                  alt: t("a11y.logo", { site: SITE_NAME }),
                  width: 480,
                  height: 240,
                  quality: 85,
                  sizes: "121px",
                  className: "h-[56px] w-auto origin-left scale-[1.08] -translate-x-[10%]",
                }).props}
                alt={t("a11y.logo", { site: SITE_NAME })}
              />
            </Link>
            <p className="max-w-sm text-[1.02rem] font-normal leading-7 tracking-[-0.02em] text-type-secondary">
              {t("footer.blurb")}
            </p>
            <div className="pt-1">
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "group inline-flex h-8 min-w-0 items-center gap-1.5 rounded-full px-3 text-sm font-medium leading-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-type-accent/50",
                      link.className,
                    )}
                  >
                    <span className="flex size-3.5 shrink-0 items-center justify-center">
                      {link.icon}
                    </span>
                    <span className="truncate tracking-[-0.015em]">{link.name}</span>
                    <svg
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      className="size-3 shrink-0 transition-transform group-hover:translate-x-0.5"
                    >
                      <path
                        d="m6 3 5 5-5 5"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:justify-self-center lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10 xl:gap-x-8">
            {footerSections.map((section) => (
              <div
                key={section.title}
                className={`flex flex-col gap-4 text-sm font-normal text-foreground ${section.className ?? ""}`}
              >
                <span className="font-medium text-type-tertiary">{section.title}</span>
                <div className="flex flex-col gap-2 opacity-70">
                  {section.links.map((link) =>
                    link.external ? (
                      <a
                        key={`${section.title}-${link.label}-${link.href}`}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="transition-colors hover:text-type-accent"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        prefetch={false}
                        key={`${section.title}-${link.label}-${link.href}`}
                        href={withLocale(locale, link.href)}
                        className="transition-colors hover:text-type-accent"
                      >
                        {link.label}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 text-xs leading-5 text-type-tertiary [content-visibility:auto] [contain-intrinsic-block-size:20rem] lg:col-span-2">
            <div className="space-y-3">
              {footerDisclosure.map((paragraph, index) => (
                <p key={`footer-disclosure-${index}`}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
