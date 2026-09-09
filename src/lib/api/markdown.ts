import { localeCodes } from "@/i18n/locales"
import { SITE_NAME, SITE_URL, SUPPORT_EMAIL } from "@/lib/site"

/** Top-level routes that resolve to a real page (mirrors src/app/[locale]/*). */
const KNOWN_TOP_SEGMENTS = new Set([
  "about",
  "borrow",
  "lend",
  "multiply",
  "developers",
  "newsroom",
  "faq",
  "brand",
  "privacy",
  "terms",
])

const localeSet = new Set<string>(localeCodes)

export interface MarkdownResult {
  status: number
  body: string
}

/** Strip a leading /{locale} segment and any trailing slash; lower-case the result. */
function normalizePath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length > 0 && localeSet.has(segments[0])) {
    segments.shift()
  }
  const joined = segments.join("/").toLowerCase()
  return joined ? `/${joined}` : "/"
}

const footerLinks = [
  `- [Home](${SITE_URL}/)`,
  `- [Developer docs](${SITE_URL}/developers)`,
  `- [FAQ](${SITE_URL}/faq)`,
  `- [llms.txt](${SITE_URL}/llms.txt)`,
  `- [OpenAPI spec](${SITE_URL}/openapi.json)`,
  `- [Sitemap](${SITE_URL}/sitemap.xml)`,
].join("\n")

function withFooter(body: string): string {
  return `${body.trim()}\n\n## Machine-readable resources\n\n${footerLinks}\n`
}

const HOME_MARKDOWN = withFooter(`# ${SITE_NAME} — Borrow against your LP positions on Aave v4

${SITE_NAME} is a DeFi lending protocol that turns liquidity provider (LP) positions into productive collateral. Borrow up to 80% against your Uniswap, Curve, and Balancer LP tokens while you keep earning trading fees, powered by specialized Aave v4 Spokes and Hubs with dual oracles and pool-specific risk controls.

## Products

- **Borrow** — Post LP tokens as collateral and draw stablecoins or blue-chip assets without unwinding your position.
- **Lend** — Supply assets to the Aave v4 Lend Spoke that funds LP-collateralized markets.
- **Multiply** — Loop LP collateral to increase exposure with managed liquidation risk.

## Use ${SITE_NAME} when you need to

- Unlock liquidity from LP tokens without exiting the pool or losing fee income.
- Price, list, or borrow against AMM LP collateral programmatically.
- Look up which DEX, staking, restaking, or lending protocols ${SITE_NAME} supports as collateral adapters.

## Links

- App: https://app.avana.cc
- Developer documentation: ${SITE_URL}/developers
- Supported protocols API: ${SITE_URL}/api/protocols
- Contact: ${SUPPORT_EMAIL}`)

const CURATED: Record<string, string> = {
  "/": HOME_MARKDOWN,
  "/about": withFooter(`# About ${SITE_NAME}

${SITE_NAME} is a lending protocol for LP-backed loans. AMM liquidity is one of crypto's largest and most under-used sources of collateral; ${SITE_NAME} brings it into lending markets using specialized Aave v4 Spokes for different DEX designs, several Aave v4 Hubs organized around correlated and higher-range LP markets, and an Aave v4 Lend Spoke that supplies the capital behind those markets.

Risk management is split across independent contributor scopes — Protocol, Operations, Market Risk, and Collateral Risk — so no single team owns every assumption behind an LP collateral market.

- Contact: ${SUPPORT_EMAIL}
- Developer docs: ${SITE_URL}/developers`),
  "/developers": withFooter(`# ${SITE_NAME} Developer Documentation

Integrate with ${SITE_NAME}'s LP-collateral lending markets on Aave v4.

- **Getting started:** ${SITE_URL}/developers/getting-started
- **Architecture:** ${SITE_URL}/developers/architecture
- **Integrations:** ${SITE_URL}/developers/integrations
- **Liquidation:** ${SITE_URL}/developers/liquidation
- **Safety & contracts:** ${SITE_URL}/developers/safety
- **REST API:** ${SITE_URL}/api/health, ${SITE_URL}/api/protocols
- **OpenAPI spec:** ${SITE_URL}/openapi.json`),
  "/faq": withFooter(`# ${SITE_NAME} FAQ

Answers to common questions about borrowing against LP positions, supported pools, liquidation, and risk on ${SITE_NAME}. Read the full FAQ at ${SITE_URL}/faq or the developer docs at ${SITE_URL}/developers.`),
  "/borrow": withFooter(`# Borrow on ${SITE_NAME}

Post Uniswap, Curve, Balancer, and other LP tokens as collateral and borrow against them while continuing to earn trading fees. See ${SITE_URL}/borrow.`),
  "/lend": withFooter(`# Lend on ${SITE_NAME}

Supply assets to the Aave v4 Lend Spoke that funds LP-collateralized markets. See ${SITE_URL}/lend.`),
  "/multiply": withFooter(`# Multiply on ${SITE_NAME}

Loop LP collateral to increase exposure with managed liquidation risk. See ${SITE_URL}/multiply.`),
}

function notFoundMarkdown(path: string): string {
  return withFooter(`# 404 — Page not found

There is no page at \`${path}\` on ${SITE_NAME}.

Try one of the resources below, or browse the full [sitemap](${SITE_URL}/sitemap.xml).`)
}

function genericMarkdown(segment: string, path: string): string {
  const title = segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
  return withFooter(`# ${title} — ${SITE_NAME}

This is the \`${path}\` page on ${SITE_NAME}, a DeFi protocol for borrowing against LP positions on Aave v4. View the full page at ${SITE_URL}${path}.`)
}

/**
 * Resolve a request path to its Markdown representation for `Accept: text/markdown`
 * content negotiation (acceptmarkdown.com). Unknown top-level paths return a 404
 * so agents receive an honest status with recovery links.
 */
export function getMarkdownForPath(pathname: string): MarkdownResult {
  const path = normalizePath(pathname)

  if (CURATED[path]) {
    return { status: 200, body: CURATED[path] }
  }

  const segment = path.split("/")[1] ?? ""
  if (!KNOWN_TOP_SEGMENTS.has(segment)) {
    return { status: 404, body: notFoundMarkdown(path) }
  }

  return { status: 200, body: genericMarkdown(segment, path) }
}
