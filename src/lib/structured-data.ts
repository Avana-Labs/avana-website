import { LOGO_PATH, SITE_NAME, SITE_URL, SUPPORT_EMAIL, siteRoutes } from "./site"

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}${LOGO_PATH}`,
  description: "DeFi protocol enabling borrowing against LP positions on Aave v4",
  sameAs: [
    "https://twitter.com/dexmini",
    "https://github.com/aave",
    "https://t.me/dexmini",
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
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
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
