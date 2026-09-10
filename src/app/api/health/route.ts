import { API_DOCS_URL, API_VERSION, jsonOk } from "@/lib/api/response"
import { SITE_NAME, SITE_URL } from "@/lib/site"

export const dynamic = "force-static"

/**
 * Liveness probe and API entry point.
 * operationId: getHealth
 */
export function GET() {
  return jsonOk({
    status: "ok",
    name: `${SITE_NAME} API`,
    version: API_VERSION,
    documentation: API_DOCS_URL,
    endpoints: [
      { method: "GET", path: "/api/health", description: "Service liveness and API metadata." },
      { method: "GET", path: "/api/protocols", description: "List supported protocol adapters." },
      { method: "GET", path: "/api/protocols/{id}", description: "Fetch a single protocol adapter by id." },
    ],
    links: {
      llms: `${SITE_URL}/llms.txt`,
      openapi: API_DOCS_URL,
      sitemap: `${SITE_URL}/sitemap.xml`,
    },
  })
}
