import { LOGO_PATH, SITE_NAME, SITE_URL, SOCIAL_URLS, SUPPORT_EMAIL, siteRoutes } from "./site"

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}${LOGO_PATH}`,
  description: "DeFi protocol enabling borrowing against LP positions on Aave v4",
  sameAs: Object.values(SOCIAL_URLS),
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: SUPPORT_EMAIL,
    url: `${SITE_URL}${siteRoutes.faq}`,
  },
}

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
