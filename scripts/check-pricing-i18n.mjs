import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const messagesDir = path.join(root, "messages")
const files = fs.readdirSync(messagesDir).filter((file) => file.endsWith(".json")).sort()
const english = JSON.parse(fs.readFileSync(path.join(messagesDir, "en.json"), "utf8"))

function leafPaths(value, prefix = "") {
  if (value === null || typeof value !== "object") return [prefix]

  return Object.entries(value).flatMap(([key, child]) =>
    leafPaths(child, prefix ? `${prefix}.${key}` : key),
  )
}

const expectedPaths = leafPaths(english.pricing)
const failures = []

for (const file of files) {
  const locale = file.replace(/\.json$/, "")
  const messages = JSON.parse(fs.readFileSync(path.join(messagesDir, file), "utf8"))

  if (!messages.pricing) {
    failures.push(`${locale}: missing pricing namespace`)
    continue
  }

  const actualPaths = new Set(leafPaths(messages.pricing))
  const missing = expectedPaths.filter((key) => !actualPaths.has(key))
  const extra = [...actualPaths].filter((key) => !expectedPaths.includes(key))

  if (missing.length > 0) failures.push(`${locale}: missing ${missing.join(", ")}`)
  if (extra.length > 0) failures.push(`${locale}: unexpected ${extra.join(", ")}`)
}

if (failures.length > 0) {
  console.error(failures.join("\n"))
  process.exit(1)
}

console.log(`Pricing translations are complete for ${files.length} locales.`)
