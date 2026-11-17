/**
 * The company document behind avana.cc/company. Its text lives in file storage outside this repository (Vercel Blob
 * or Convex file storage): COMPANY_DOC_URL names the file. It is served as plain text, so a browser shows the
 * Markdown as written (a text/markdown response is often downloaded instead) and an AI agent reads it directly. The
 * page is unlisted: no navigation link, no sitemap entry, and noindex.
 */

export const COMPANY_DOC_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, max-age=300, s-maxage=300",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
} as const

const ERROR_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
} as const

/** The document's https URL from COMPANY_DOC_URL, or undefined when it is unset or not https. */
export function companyDocUrl(value: string | undefined): URL | undefined {
  if (!value) return undefined
  try {
    const url = new URL(value)
    return url.protocol === "https:" ? url : undefined
  } catch {
    return undefined
  }
}

/** The /company response: the document, a 404 when no document is configured, or a 502 when storage fails. */
export async function companyDocResponse(
  value: string | undefined,
  fetcher: (url: URL) => Promise<{ ok: boolean; text(): Promise<string> }>,
): Promise<{ status: number; body: string; headers: Record<string, string> }> {
  const url = companyDocUrl(value)
  if (!url) return { status: 404, body: "Not found\n", headers: { ...ERROR_HEADERS } }
  try {
    const res = await fetcher(url)
    if (!res.ok) return { status: 502, body: "Temporarily unavailable\n", headers: { ...ERROR_HEADERS } }
    return { status: 200, body: await res.text(), headers: { ...COMPANY_DOC_HEADERS } }
  } catch {
    return { status: 502, body: "Temporarily unavailable\n", headers: { ...ERROR_HEADERS } }
  }
}
