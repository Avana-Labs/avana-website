import { getMarkdownForPath } from "@/lib/api/markdown"
import { clientKey, rateLimit, tooManyRequests, RATE_LIMITS } from "@/lib/api/rate-limit"

export const dynamic = "force-dynamic"

/**
 * Internal endpoint that renders a page's Markdown representation. The proxy
 * rewrites requests carrying `Accept: text/markdown` here (acceptmarkdown.com).
 * Not linked in navigation; agents reach it transparently via content negotiation.
 */
export function GET(request: Request) {
  const limit = rateLimit(clientKey(request), RATE_LIMITS.markdown)
  if (!limit.ok) return tooManyRequests(limit)

  const url = new URL(request.url)
  const path = url.searchParams.get("path") || "/"
  const { status, body } = getMarkdownForPath(path)

  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept, Accept-Encoding",
      "Cache-Control": "public, max-age=300, s-maxage=300",
      "X-Robots-Tag": "noindex",
    },
  })
}
