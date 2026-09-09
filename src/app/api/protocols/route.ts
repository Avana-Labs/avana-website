import { apiProtocols } from "@/lib/api/catalog"
import { jsonOk } from "@/lib/api/response"

export const dynamic = "force-static"

/**
 * List every supported protocol adapter.
 * operationId: listProtocols
 */
export function GET() {
  return jsonOk({
    object: "list",
    count: apiProtocols.length,
    data: apiProtocols,
  })
}
