/**
 * Footer - The site-wide footer component.
 */
import { getImageProps } from "next/image"
import { getLocale, getTranslations } from "next-intl/server"
import Link from "next/link"
import { withLocale } from "@/lib/i18n/path"
import { HEADER_WORDMARK_PATH, SITE_NAME, siteRoutes } from "@/lib/site"

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
  icon: React.ReactNode
}

const socialIcons = {
  twitter: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4.5 w-4.5">
      <path
        d="M4 4L20 20M20 4L4 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4.5 w-4.5">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.68c-2.78.61-3.37-1.18-3.37-1.18-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.33 1.08 2.9.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03a9.57 9.57 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.69.9.69 1.82v2.7c0 .26.18.57.69.48A10 10 0 0 0 12 2Z"
      />
    </svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4.5 w-4.5">
      <path
        fill="currentColor"
        d="M21.6 4.8 18.5 20c-.2 1-.8 1.3-1.7.8l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.8L18 7.6c.4-.3-.1-.5-.6-.2L7 14.2l-4.7-1.5c-1-.3-1-.9.2-1.3L20 4.2c.9-.3 1.5.2 1.2.6Z"
      />
    </svg>
  ),
  discourse: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4.5 w-4.5">
      <path
        fill="currentColor"
        d="M12 3.75a8.25 8.25 0 0 0-7.67 11.3l-1.1 4.2 4.12-1.2A8.25 8.25 0 1 0 12 3.75Zm0 2.1a6.15 6.15 0 0 1 5.8 8.2l-.14.38.58 2.2-2.16-.63-.33.18A6.15 6.15 0 1 1 12 5.85Zm-2.6 6.1a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Zm5.2 0a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Zm-2.6 3.55c1.14 0 2.2-.45 2.98-1.26l-1.02-.99a2.72 2.72 0 0 1-3.92 0l-1.02.99A4.16 4.16 0 0 0 12 15.5Z"
      />
    </svg>
  ),
} as const

export default async function Footer(): Promise<React.JSX.Element> {
  const [t, locale] = await Promise.all([getTranslations("common"), getLocale()])

  const socialLinks: readonly SocialLink[] = [
    {
      href: "https://twitter.com/dexmini",
      label: t("footer.socialAria", { network: t("footer.twitter") }),
      icon: socialIcons.twitter,
    },
    {
      href: "https://github.com/aave",
      label: t("footer.socialAria", { network: t("footer.github") }),
      icon: socialIcons.github,
    },
    {
      href: "https://t.me/dexmini",
      label: t("footer.socialAria", { network: t("footer.telegram") }),
      icon: socialIcons.telegram,
    },
    {
      href: "https://governance.aave.com",
      label: t("footer.socialAria", { network: t("footer.discourse") }),
      icon: socialIcons.discourse,
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
    {
      title: t("footer.social"),
      links: [
        { href: "https://twitter.com/dexmini", label: t("footer.twitter"), external: true },
        { href: "https://github.com/aave", label: t("footer.github"), external: true },
        { href: "https://t.me/dexmini", label: t("footer.telegram"), external: true },
        { href: "https://governance.aave.com", label: t("footer.discourse"), external: true },
      ],
      className: "lg:hidden",
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
            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:border-type-accent/40 hover:bg-type-accent/8"
                >
                  {link.icon}
                </a>
              ))}
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
