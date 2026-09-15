import type { MetadataRoute } from "next"
import { languageAlternates, absoluteLocaleUrl } from "@/lib/i18n/path"
import { defaultLocale } from "@/i18n/locales"
import { blogPaths, developerPaths, landingPaths, utilityPaths } from "@/lib/public-routes"
import { siteRoutes } from "@/lib/site"

/**
 * Multi-locale sitemap. English (default) uses unprefixed URLs;
 * other locales use /{locale}/... prefixes (as-needed routing).
 */
export default function sitemap(): MetadataRoute.Sitemap {
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
      changeFrequency,
      priority,
      alternates: {
        languages: languageAlternates(path),
      },
    }
  })
}
