"use client"

import { Check, Copy } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export function ReferenceCopyButton({ value }: { value: string }) {
  const t = useTranslations("common.docs.reference")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timer)
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      // Clipboard access can be denied; the full value stays selectable in the title.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      data-export-skip
      aria-label={copied ? t("copied") : t("copy")}
      title={copied ? t("copied") : t("copy")}
      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-type-tertiary transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01AACF]"
    >
      {copied ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : <Copy aria-hidden="true" className="h-3.5 w-3.5" />}
    </button>
  )
}
