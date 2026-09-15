import { jsonError } from "@/lib/api/response"
import { clientKey, rateLimit, tooManyRequests, RATE_LIMITS } from "@/lib/api/rate-limit"

export const dynamic = "force-dynamic"

/**
 * Fallback for any unknown /api/* path. Returns a structured JSON 404 instead
 * of an HTML shell so agents can parse the failure and recover.
 */
async function handler(request: Request, { params }: { params: Promise<{ notFound: string[] }> }) {
  const limited = rateLimit(clientKey(request), RATE_LIMITS.apiNotFound)
  if (!limited.ok) return tooManyRequests(limited)

  const { notFound } = await params
  const path = `/api/${(notFound ?? []).join("/")}`
  return jsonError(
    404,
    "endpoint_not_found",
    `No API endpoint matches ${path}.`,
    "See GET /api/health for the list of available endpoints, or /openapi.json for the full schema.",
  )
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
