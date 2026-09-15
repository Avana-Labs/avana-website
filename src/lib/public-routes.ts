import { blogPosts } from "@/lib/blog-posts"
import { siteRoutes } from "@/lib/site"

export const landingPaths = [
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
] as const

export const developerPaths = [
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
  "/developers/copilot",
  "/developers/copilot/query-example",
  "/developers/copilot/workflow",
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
] as const

export const blogPaths = blogPosts.map((post) => `/newsroom/${post.slug}`) as readonly string[]
export const utilityPaths = [siteRoutes.privacy, siteRoutes.terms] as const

export const publicPagePaths = new Set<string>([
  ...landingPaths,
  ...developerPaths,
  ...blogPaths,
  ...utilityPaths,
])
