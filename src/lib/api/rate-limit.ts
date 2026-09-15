import type { NextResponse } from "next/server"
import { jsonError, type ApiErrorBody } from "@/lib/api/response"

/**
 * Best-effort in-memory throttle for the two dynamic API routes (`/api/md` and
 * `/api/[...notFound]`). Both render on demand, so without a cap a single client
 * or crawler can drive unbounded serverless invocations.
 *
 * Scope: state lives in module memory, i.e. per warm serverless instance. The
 * effective global limit is therefore `limit x concurrent instances`. That is
 * enough to blunt single-source floods and bound per-instance cost, but it is
 * NOT a strict distributed limit. For a hard global guarantee, back the same
 * interface with a shared store (e.g. Vercel KV / Upstash).
 */

interface Bucket {
  count: number
  /** Epoch ms at which the current window expires. */
  resetAt: number
}

const buckets = new Map<string, Bucket>()
let lastSweep = 0

// Defensive ceiling so a flood of unique keys cannot grow the map without
// bound. Well under this in normal operation; the sweep keeps it far lower.
const MAX_KEYS = 20_000

/** Drop expired buckets at most once per window so the map stays bounded. */
function sweep(now: number, windowMs: number): void {
  if (now - lastSweep < windowMs) return
  lastSweep = now
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(key)
  }
}

export interface RateLimitOptions {
  /** Max requests allowed per window. */
  limit: number
  /** Window length in milliseconds. */
  windowMs: number
  /**
   * Namespace so distinct endpoints keep independent counters for the same
   * client. Without it, `/api/md` and `/api/[...notFound]` would share one
   * bucket despite their different limits.
   */
  name?: string
  /** Injectable clock for deterministic tests; defaults to `Date.now()`. */
  now?: number
}

export interface RateLimitResult {
  ok: boolean
  limit: number
  remaining: number
  /** Whole seconds until the current window resets. */
  resetSeconds: number
}

/** Fixed-window counter. Returns whether the request is allowed. */
export function rateLimit(
  key: string,
  { limit, windowMs, name = "", now = Date.now() }: RateLimitOptions,
): RateLimitResult {
  sweep(now, windowMs)
  const windowSeconds = Math.ceil(windowMs / 1000)
  const storeKey = name ? `${name}:${key}` : key
  const existing = buckets.get(storeKey)

  if (!existing || now >= existing.resetAt) {
    // Under pathological unique-key pressure, fail open rather than pin memory.
    if (!existing && buckets.size >= MAX_KEYS) {
      return { ok: true, limit, remaining: limit - 1, resetSeconds: windowSeconds }
    }
    buckets.set(storeKey, { count: 1, resetAt: now + windowMs })
    return { ok: true, limit, remaining: limit - 1, resetSeconds: windowSeconds }
  }

  existing.count += 1
  const resetSeconds = Math.max(0, Math.ceil((existing.resetAt - now) / 1000))
  if (existing.count > limit) {
    return { ok: false, limit, remaining: 0, resetSeconds }
  }
  return { ok: true, limit, remaining: limit - existing.count, resetSeconds }
}

/**
 * Derives a client key from proxy headers. Vercel sets `x-forwarded-for`; the
 * left-most entry is the originating client. Falls back to `x-real-ip`, then a
 * shared `"unknown"` bucket so a missing IP still counts against a coarse limit.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown"
}

/** Structured 429 with standard rate-limit headers. Never cached. */
export function tooManyRequests(result: RateLimitResult): NextResponse<ApiErrorBody> {
  return jsonError(
    429,
    "rate_limited",
    "Too many requests.",
    `Retry after ${result.resetSeconds}s. This endpoint is rate limited per client.`,
    {
      headers: {
        "Retry-After": String(result.resetSeconds),
        "RateLimit-Limit": String(result.limit),
        "RateLimit-Remaining": String(result.remaining),
        "RateLimit-Reset": String(result.resetSeconds),
      },
    },
  )
}

/**
 * Per-client limits. `markdown` is generous so a legitimate agent indexing the
 * full site over content negotiation is not blocked; `apiNotFound` is tighter
 * because there is no legitimate reason to hit unknown endpoints repeatedly.
 */
export const RATE_LIMITS = {
  markdown: { name: "md", limit: 120, windowMs: 60_000 },
  apiNotFound: { name: "api-not-found", limit: 30, windowMs: 60_000 },
} as const

/** Test-only: clears the shared store so cases do not leak state into each other. */
export function __resetRateLimitStore(): void {
  buckets.clear()
  lastSweep = 0
}
