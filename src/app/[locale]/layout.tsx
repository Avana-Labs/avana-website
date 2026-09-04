import type React from "react"
import type { Metadata, Viewport } from "next"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { diatypeFont } from "@/app/site-fonts"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getLocaleDefinition, getLocaleDir } from "@/i18n/locales"
import { routing } from "@/i18n/routing"
import { languageAlternates } from "@/lib/i18n/path"
import {
  buildOgImagePath,
  SITE_NAME,
  SITE_URL,
  SOCIAL_HANDLE,
} from "@/lib/site"
import { organizationSchema, serializeJsonLd, websiteSchema } from "@/lib/structured-data"
import { THEME_INIT_SCRIPT } from "@/lib/theme"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "meta" })
  const localeDef = getLocaleDefinition(locale)
  const title = t("siteTitle")
  const description = t("siteDescription")

  return {
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    keywords: [
      "DeFi",
      "LP tokens",
      "liquidity provider",
      "collateral",
      "borrowing",
      "Aave v4",
      "Uniswap",
      "Curve",
      "Balancer",
      "AMM",
      "lending",
      "yield farming",
    ],
    authors: [{ name: t("team") }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    openGraph: {
      type: "website",
      locale: localeDef.ogLocale,
      url: SITE_URL,
      siteName: SITE_NAME,
      title,
      description: t("ogDescription"),
      images: [
        {
          url: buildOgImagePath({
            title: SITE_NAME,
            subtitle: t("ogSubtitle"),
          }),
          width: 1200,
          height: 630,
          alt: t("ogAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
      site: SOCIAL_HANDLE,
      creator: SOCIAL_HANDLE,
      images: [buildOgImagePath({ title: SITE_NAME, subtitle: t("ogSubtitle") })],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    applicationName: SITE_NAME,
    category: "Finance",
    icons: {
      icon: [{ url: "/Avana%20Favicon.png", type: "image/png" }],
      shortcut: "/Avana%20Favicon.png",
      apple: "/Avana%20Favicon.png",
    },
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: "/",
      languages: languageAlternates("/"),
    },
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
}

const shouldRenderVercelInsights = process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV)

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages({ locale })
  const t = await getTranslations({ locale, namespace: "common" })
  const dir = getLocaleDir(locale)

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      style={{ "--font-diatype": diatypeFont.style.fontFamily } as React.CSSProperties}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteSchema) }}
        />
      </head>
      <body className={`${diatypeFont.variable} overflow-x-clip bg-background font-sans text-foreground`}>
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={{ common: messages.common }}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:start-4 focus:z-[100] focus:rounded-lg focus:bg-[#01AACF] focus:px-4 focus:py-2 focus:text-[#0F1518] focus:outline-none focus:ring-2 focus:ring-[#01AACF] focus:ring-offset-2"
          >
            {t("a11y.skipToContent")}
          </a>
          <div className="flex min-h-screen min-w-0 flex-col">
            <Header />
            <main id="main-content" className="min-w-0 flex-1 overflow-x-clip">
              {children}
            </main>
            <Footer />
          </div>
          </NextIntlClientProvider>
        </ThemeProvider>
        {shouldRenderVercelInsights ? <SpeedInsights /> : null}
        {shouldRenderVercelInsights ? <Analytics /> : null}
      </body>
    </html>
  )
}
