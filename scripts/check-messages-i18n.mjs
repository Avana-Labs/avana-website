import fs from "node:fs"
import path from "node:path"
import { localeCodes } from "../src/i18n/locales.ts"

const root = process.cwd()
const messagesDir = path.join(root, "messages")
const english = JSON.parse(fs.readFileSync(path.join(messagesDir, "en.json"), "utf8"))

function leafPaths(value, prefix = "") {
  if (value === null || typeof value !== "object") return [prefix]

  return Object.entries(value).flatMap(([key, child]) =>
    leafPaths(child, prefix ? `${prefix}.${key}` : key),
  )
}

const expectedPaths = leafPaths(english)
const failures = []

for (const locale of localeCodes) {
  let messages
  try {
    messages = JSON.parse(fs.readFileSync(path.join(messagesDir, `${locale}.json`), "utf8"))
  } catch (error) {
    failures.push(`${locale}: missing or unreadable UI catalog (${error.code ?? error.message})`)
    continue
  }

  const actualPaths = new Set(leafPaths(messages))
  const missing = expectedPaths.filter((key) => !actualPaths.has(key))
  const extra = [...actualPaths].filter((key) => !expectedPaths.includes(key))

  if (missing.length > 0) failures.push(`${locale}: missing ${missing.join(", ")}`)
  if (extra.length > 0) failures.push(`${locale}: unexpected ${extra.join(", ")}`)
  for (const key of actualPaths) {
    const value = key.split(".").reduce((parent, part) => parent?.[part], messages)
    if (typeof value !== "string" || !value.trim()) failures.push(`${locale}: ${key} must be nonempty text`)
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"))
  process.exit(1)
}

console.log(`UI messages are complete and nonempty for ${localeCodes.length} locales (${expectedPaths.length} keys each).`)
