"use client"

import { useTranslations } from "next-intl"

export function SandboxNotice({ className = "" }: { className?: string }) {
  const t = useTranslations("common")

  return (
    <p className={`flex items-start gap-2.5 text-xs font-medium leading-5 text-type-secondary md:text-sm ${className}`.trim()}>
      <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#01AACF] text-sm leading-none text-foreground">
        !
      </span>
      <span className="max-w-[1000px]">{t("sandboxNotice")}</span>
    </p>
  )
}
