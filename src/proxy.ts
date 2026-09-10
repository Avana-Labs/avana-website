import { NextRequest, NextResponse } from "next/server"
import { defaultLocale, localeCodes } from "@/i18n/locales"
import { getMarkdownForPath } from "@/lib/api/markdown"

const localeSet = new Set<string>(localeCodes)
const internalRewriteHeader = "x-avana-locale-rewrite"

/**
 * Keep the default locale out of public URLs while serving the pre-rendered
 * `[locale]` route. This avoids request-time locale detection and the
 * rewrite/redirect loop produced by `localePrefix: "as-needed"`.
 *
 * Also implements Markdown content negotiation (acceptmarkdown.com): a request
 * that sends `Accept: text/markdown` is transparently served the page's Markdown
 * representation with `Vary: Accept`.
 */
export default function proxy(request: NextRequest) {
  if (request.headers.get(internalRewriteHeader) === "1") {
    return NextResponse.next()
  }

  const pathname = request.nextUrl.pathname

  // Content negotiation: agents that ask for Markdown get Markdown, not HTML.
  // Generated inline (not rewritten) so unknown paths keep an honest 404 status —
  // a middleware rewrite would force the response back to 200.
  const accept = request.headers.get("accept") ?? ""
  if (accept.includes("text/markdown")) {
    const { status, body } = getMarkdownForPath(pathname)
    return new NextResponse(body, {
      status,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        Vary: "Accept, Accept-Encoding",
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "X-Robots-Tag": "noindex",
      },
    })
  }

  const firstSegment = pathname.split("/")[1]

  if (firstSegment === defaultLocale) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/"
    return NextResponse.redirect(url, 308)
  }

  let response: NextResponse
  if (localeSet.has(firstSegment)) {
    response = NextResponse.next()
  } else {
    const url = request.nextUrl.clone()
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set(internalRewriteHeader, "1")

    response = NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    })
  }

  // Let caches keep separate HTML and Markdown variants for the same URL.
  response.headers.append("Vary", "Accept")
  return response
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
