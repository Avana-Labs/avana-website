import { NextResponse } from "next/server"
import { SITE_URL } from "@/lib/site"

/** OpenAPI spec that documents the machine-readable surface below. */
export const API_DOCS_URL = `${SITE_URL}/openapi.json`
export const API_VERSION = "1.0.0"

type JsonInit = {
  status?: number
  /** Extra headers merged on top of the JSON defaults. */
  headers?: Record<string, string>
  /** Cache-Control override (defaults to a short shared-cache TTL). */
  cacheControl?: string
}

/**
 * Success envelope shared by every read endpoint. Agents can rely on the
 * `object` discriminator and `Vary: Accept` for content-negotiated caching.
 */
export function jsonOk<T>(data: T, init: JsonInit = {}): NextResponse {
  return NextResponse.json(data, {
    status: init.status ?? 200,
    headers: {
      "Cache-Control": init.cacheControl ?? "public, max-age=300, s-maxage=300",
      Vary: "Accept, Accept-Encoding",
      ...init.headers,
    },
  })
}

export interface ApiErrorBody {
  error: {
    /** Stable, machine-readable error code (snake_case). */
    code: string
    /** Human-readable explanation. */
    message: string
    /** Actionable next step an agent can take to recover. */
    hint: string
    /** Mirrors the HTTP status for clients that only read the body. */
    status: number
    /** Link to the OpenAPI document describing valid requests. */
    documentation: string
  }
}

/**
 * Structured JSON error. Every non-2xx API response uses this shape so agents
 * never have to parse an HTML error page.
 */
export function jsonError(
  status: number,
  code: string,
  message: string,
  hint: string,
  init: JsonInit = {},
): NextResponse<ApiErrorBody> {
  return NextResponse.json<ApiErrorBody>(
    {
      error: { code, message, hint, status, documentation: API_DOCS_URL },
    },
    {
      status,
      headers: {
        "Cache-Control": init.cacheControl ?? "no-store",
        Vary: "Accept, Accept-Encoding",
        ...init.headers,
      },
    },
  )
}
