export const SITE_NAME = "Avana"
export const SITE_URL = "https://avana.cc"
export const SUPPORT_EMAIL = "support@avana.cc"
export const LOGO_PATH = "/Avana%20Logo.png"
export const HEADER_WORDMARK_PATH = "/images/avana-wordmark.webp"
export const SOCIAL_HANDLE = "@dexmini"
export const AAVE_ARFC_LABEL = "Aave ARFC"
export const DEFAULT_OG_SUBTITLE = "Borrow Against LP Positions on Aave v4"
export const DEFAULT_SITE_DESCRIPTION =
  "Unlock liquidity from your LP tokens. Borrow up to 80% against Uniswap, Curve, and Balancer positions while continuing to earn trading fees on Aave v4."
export const DEFAULT_OG_DESCRIPTION =
  "Unlock liquidity from your LP tokens while continuing to earn trading fees."

export const siteRoutes = {
  home: "/",
  about: "/about",
  borrow: "/borrow",
  lend: "/lend",
  multiply: "/multiply",
  developers: "/developers",
  pricing: "/pricing",
  developersIntro: "/developers/introduction",
  newsroom: "/newsroom",
  blog: "/newsroom",
  faq: "/faq",
  brand: "/brand",
  earlyAccess: "/faq",
  privacy: "/privacy",
  terms: "/terms",
  launchApp: "/",
} as const

export const blogRoutes = {
  aaveV4AvanaSpoke: "/newsroom/aave-v4-avana-spoke",
  avanaLpCollateral: "/newsroom/avana-lp-collateral",
  lpRiskGovernance: "/newsroom/lp-risk-governance",
  smartAgentsLpCollateral: "/newsroom/why-lp-collateral-needs-smart-agents",
  lpLiquidationShouldWork: "/newsroom/how-lp-liquidation-should-work",
  lpCollateralOracleProblem: "/newsroom/pricing-lp-collateral-oracle-problem",
  balancerLpCollateralAaveV4: "/newsroom/balancer-lp-collateral-aave-v4",
  curveLpCollateralAaveV4: "/newsroom/curve-lp-collateral-aave-v4",
  aerodromeLpCollateralAaveV4: "/newsroom/aerodrome-lp-collateral-aave-v4",
} as const

export const legacyBlogRedirects = [
  {
    source: "/blog",
    destination: siteRoutes.newsroom,
  },
  {
    source: "/blog/aave-v4-amm-spoke",
    destination: blogRoutes.aaveV4AvanaSpoke,
  },
  {
    source: "/blog/amm-markets-lp-collateral",
    destination: blogRoutes.avanaLpCollateral,
  },
  {
    source: "/blog/:slug",
    destination: "/newsroom/:slug",
  },
] as const

export function buildOgImagePath({
  title = SITE_NAME,
  subtitle = DEFAULT_OG_SUBTITLE,
  type,
}: {
  title?: string
  subtitle?: string
  type?: "default" | "blog" | "developers" | "faq"
} = {}) {
  const searchParams = new URLSearchParams({ title, subtitle })

  if (type) {
    searchParams.set("type", type)
  }

  return `/og?${searchParams.toString()}`
}
