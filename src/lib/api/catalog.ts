import { protocols, type ProtocolAdapter } from "@/data/protocols"

export interface ApiProtocol extends ProtocolAdapter {
  /** URL-safe identifier used by `/api/protocols/{id}`. */
  id: string
}

/** Slugify an adapter name into a stable, URL-safe id (e.g. "Uniswap v3 Adapter" -> "uniswap-v3"). */
function toProtocolId(name: string): string {
  return name
    .toLowerCase()
    .replace(/\badapter\b/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function buildCatalog(): ApiProtocol[] {
  const seen = new Map<string, number>()
  return protocols.map((adapter) => {
    const base = toProtocolId(adapter.name)
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    const id = count === 0 ? base : `${base}-${count + 1}`
    return { id, ...adapter }
  })
}

/** Supported protocol adapters, exposed as agent-readable metadata. */
export const apiProtocols: ApiProtocol[] = buildCatalog()

export function findProtocol(id: string): ApiProtocol | undefined {
  const needle = id.toLowerCase()
  return apiProtocols.find(
    (protocol) => protocol.id === needle || protocol.shortName.toLowerCase() === needle,
  )
}
