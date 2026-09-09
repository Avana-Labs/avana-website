import { apiProtocols, findProtocol } from "@/lib/api/catalog"
import { jsonError, jsonOk } from "@/lib/api/response"

export const dynamic = "force-static"
export const dynamicParams = true

export function generateStaticParams() {
  return apiProtocols.map((protocol) => ({ id: protocol.id }))
}

/**
 * Fetch a single protocol adapter by id (or shortName).
 * operationId: getProtocol
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const protocol = findProtocol(id)

  if (!protocol) {
    return jsonError(
      404,
      "protocol_not_found",
      `No protocol adapter matches id "${id}".`,
      "List valid ids at GET /api/protocols, then request one of the returned `id` values.",
    )
  }

  return jsonOk(protocol)
}
