import type { MetadataRoute } from "next"
import { blogPosts } from "@/lib/blog-posts"
import { languageAlternates, absoluteLocaleUrl } from "@/lib/i18n/path"
import { defaultLocale } from "@/i18n/locales"
import { siteRoutes } from "@/lib/site"

/**
 * Multi-locale sitemap. English (default) uses unprefixed URLs;
 * other locales use /{locale}/... prefixes (as-needed routing).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const landingPaths = [
    "/",
    siteRoutes.developers,
    siteRoutes.newsroom,
    siteRoutes.faq,
    siteRoutes.pricing,
    siteRoutes.borrow,
    siteRoutes.lend,
    siteRoutes.multiply,
    siteRoutes.brand,
    siteRoutes.about,
  ]

  const developerPaths = [
    "/developers/introduction/key-concepts",
    "/developers/introduction/glossary",
    "/developers/getting-started",
    "/developers/getting-started/borrow-assets",
    "/developers/getting-started/manage-loans",
    "/developers/getting-started/repay-loans",
    "/developers/getting-started/withdraw-collateral",
    "/developers/getting-started/claim-lp-fees",
    "/developers/architecture",
    "/developers/architecture/lend-spoke",
    "/developers/architecture/collateral-factors",
    "/developers/architecture/health-factor",
    "/developers/architecture/platform-fees",
    "/developers/architecture/incentives",
    "/developers/integrations",
    "/developers/integrations/appkit",
    "/developers/integrations/allowed-pools",
    "/developers/integrations/price-oracles",
    "/developers/integrations/router-contract",
    "/developers/liquidation",
    "/developers/liquidation/liquidators",
    "/developers/liquidation/flow",
    "/developers/liquidation/examples",
    "/developers/safety",
    "/developers/safety/contracts",
    "/developers/safety/bug-bounty",
    "/developers/safety/insurance",
    "/developers/legal",
    "/developers/legal/disclaimer",
  ]

  const blogPaths = blogPosts.map((post) => `/newsroom/${post.slug}`)
  const utilityPaths = [siteRoutes.privacy, siteRoutes.terms]

  const pathPriority = (path: string): { changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number } => {
    if (path === "/") return { changeFrequency: "weekly", priority: 1 }
    if (path === siteRoutes.developers) return { changeFrequency: "weekly", priority: 0.9 }
    if (path === siteRoutes.newsroom) return { changeFrequency: "daily", priority: 0.8 }
    if (path.startsWith("/newsroom/")) return { changeFrequency: "monthly", priority: 0.6 }
    if (path.startsWith("/developers")) return { changeFrequency: "weekly", priority: 0.7 }
    if (path === siteRoutes.privacy || path === siteRoutes.terms) {
      return { changeFrequency: "yearly", priority: 0.3 }
    }
    return { changeFrequency: "monthly", priority: 0.7 }
  }

  const allPaths = [...landingPaths, ...developerPaths, ...blogPaths, ...utilityPaths]

  return allPaths.map((path) => {
    const { changeFrequency, priority } = pathPriority(path)
    return {
      url: absoluteLocaleUrl(defaultLocale, path),
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: languageAlternates(path),
      },
    }
  })
}
