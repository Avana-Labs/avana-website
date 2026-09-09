import { getMarkdownForPath } from "@/lib/api/markdown"

export const dynamic = "force-dynamic"

/**
 * Internal endpoint that renders a page's Markdown representation. The proxy
 * rewrites requests carrying `Accept: text/markdown` here (acceptmarkdown.com).
 * Not linked in navigation; agents reach it transparently via content negotiation.
 */
export function GET(request: Request) {
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
