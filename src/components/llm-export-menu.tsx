"use client"

import { useEffect, useMemo, useRef, useState, type ComponentType, type SVGProps } from "react"
import { Bot, Check, ChevronDown, Copy, Link } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { exportElementToMarkdown, getExportRootFromElement } from "@/lib/developer-doc-export"

interface LlmExportMenuProps {
  className?: string
}

type MenuAction =
  | "copy-markdown"
  | "copy-link"
  | "open-chatgpt"
  | "open-claude"
  | "open-grok"
  | "open-perplexity"

type BrandMark = ComponentType<SVGProps<SVGSVGElement>>

type MenuItem = {
  title: string
  description: string
  action: MenuAction
  icon?: LucideIcon
  mark?: BrandMark
}

function BrandSvg({
  path,
  className,
  ...props
}: SVGProps<SVGSVGElement> & { path: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor" {...props}>
      <path d={path} />
    </svg>
  )
}

function OpenAiMark(props: SVGProps<SVGSVGElement>) {
  return (
    <BrandSvg
      {...props}
      path="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
    />
  )
}

function AnthropicMark(props: SVGProps<SVGSVGElement>) {
  return (
    <BrandSvg
      {...props}
      path="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z"
    />
  )
}

function XaiMark(props: SVGProps<SVGSVGElement>) {
  return (
    <BrandSvg
      {...props}
      path="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"
    />
  )
}

function PerplexityMark(props: SVGProps<SVGSVGElement>) {
  return (
    <BrandSvg
      {...props}
      path="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z"
    />
  )
}

function buildPagePrompt(root: HTMLElement, reviewPrompt: string): string {
  const title = document.title.replace(/\s+\|\s+Avana$/, "")
  const markdown = exportElementToMarkdown(root)
  return [
    reviewPrompt,
    `Page title: ${title}`,
    `Page URL: ${window.location.href}`,
    "",
    markdown,
  ]
    .join("\n")
    .slice(0, 9000)
}

function openPrefilledUrl(baseUrl: string, prompt: string) {
  window.open(`${baseUrl}${encodeURIComponent(prompt)}`, "_blank", "noopener,noreferrer")
}

function MenuIcon({ item }: { item: MenuItem }) {
  if (item.mark) {
    const Mark = item.mark
    return <Mark className="h-3 w-3 text-foreground/80" />
  }

  const Icon = item.icon ?? Bot
  return <Icon className="h-3 w-3 text-type-tertiary" />
}

function MenuRow({
  item,
  onClick,
}: {
  item: MenuItem
  onClick: (action: MenuAction) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(item.action)}
      className="flex w-full items-start gap-1.25 rounded-[10px] px-[5px] py-[2px] text-left transition hover:bg-muted"
    >
      <span className="mt-0.5 flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[7px] border border-border bg-card text-type-tertiary">
        <MenuIcon item={item} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="type-supporting block text-[0.79rem] font-semibold leading-[1.1rem] text-foreground">
          {item.title}
          {item.action.startsWith("open-") ? (
            <span className="ml-1 align-middle text-[0.8em] text-type-tertiary">↗</span>
          ) : null}
        </span>
        <span className="type-supporting mt-0 block text-[0.65rem] leading-3 text-type-tertiary">
          {item.description}
        </span>
      </span>
    </button>
  )
}

export function LlmExportMenu({ className }: LlmExportMenuProps) {
  const t = useTranslations("common.exportMenu")
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const topAction = useMemo<MenuItem>(
    () => ({
      title: t("copyPage"),
      description: t("copyPageMarkdown"),
      icon: Copy,
      action: "copy-markdown",
    }),
    [t],
  )

  const aiItems = useMemo<MenuItem[]>(
    () => [
      {
        title: t("openInChatGPT"),
        description: t("askAboutPage"),
        mark: OpenAiMark,
        action: "open-chatgpt",
      },
      {
        title: t("openInClaude"),
        description: t("askAboutPage"),
        mark: AnthropicMark,
        action: "open-claude",
      },
      {
        title: t("openInGrok"),
        description: t("askAboutPage"),
        mark: XaiMark,
        action: "open-grok",
      },
      {
        title: t("openInPerplexity"),
        description: t("askAboutPage"),
        mark: PerplexityMark,
        action: "open-perplexity",
      },
    ],
    [t],
  )

  const utilityItems = useMemo<MenuItem[]>(
    () => [
      {
        title: t("copyPageLink"),
        description: t("copyPageLinkDescription"),
        icon: Link,
        action: "copy-link",
      },
    ],
    [t],
  )

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  useEffect(() => {
    if (!copied) return
    const timeoutId = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(timeoutId)
  }, [copied])

  const getExportRoot = () => getExportRootFromElement(containerRef.current)

  const handleCopyMarkdown = async () => {
    const root = getExportRoot()
    if (!root) return

    await navigator.clipboard.writeText(exportElementToMarkdown(root))
    setCopied(true)
    setIsOpen(false)
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setIsOpen(false)
  }

  const handleOpenPrefilled = (target: "chatgpt" | "claude" | "grok" | "perplexity") => {
    const root = getExportRoot()
    if (!root) return

    const prompt = buildPagePrompt(root, t("reviewPrompt"))

    switch (target) {
      case "chatgpt":
        openPrefilledUrl("https://chatgpt.com/?q=", prompt)
        break
      case "claude":
        openPrefilledUrl("https://claude.ai/new?q=", prompt)
        break
      case "grok":
        openPrefilledUrl("https://grok.com/?q=", prompt)
        break
      case "perplexity":
        openPrefilledUrl("https://www.perplexity.ai/?q=", prompt)
        break
    }

    setIsOpen(false)
  }

  const handleAction = (action: MenuAction) => {
    switch (action) {
      case "copy-markdown":
        void handleCopyMarkdown()
        return
      case "copy-link":
        void handleCopyLink()
        return
      case "open-chatgpt":
        handleOpenPrefilled("chatgpt")
        return
      case "open-claude":
        handleOpenPrefilled("claude")
        return
      case "open-grok":
        handleOpenPrefilled("grok")
        return
      case "open-perplexity":
        handleOpenPrefilled("perplexity")
        return
    }
  }

  const TopActionIcon = topAction.icon ?? Copy

  return (
    <div ref={containerRef} className={className}>
      <div ref={menuRef} className="relative self-start" data-export-skip>
        <button
          type="button"
          onClick={() => setIsOpen((previous) => !previous)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1.25 text-foreground/80 transition hover:border-border hover:bg-muted hover:text-foreground"
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span className="text-[0.82rem] font-medium">{copied ? t("copied") : t("copyPage")}</span>
          <span className="h-3.5 w-px bg-border" aria-hidden="true" />
          <ChevronDown className={`h-3.5 w-3.5 transition ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div
            role="menu"
            className="absolute right-0 z-20 mt-2 w-[min(16.5rem,calc(100vw-1rem))] overflow-hidden rounded-[15px] border border-border bg-popover shadow-[0_8px_18px_rgba(15,23,42,0.05)] sm:w-[16.5rem]"
          >
            <div className="p-[2px]">
              <button
                type="button"
                onClick={() => handleAction(topAction.action)}
                className="flex w-full items-start gap-1.25 rounded-[10px] px-[5px] py-[2px] text-left transition hover:bg-muted"
              >
                <span className="mt-0.5 flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[7px] border border-border bg-card text-type-tertiary">
                  <TopActionIcon className="h-[9px] w-[9px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="type-supporting block text-[0.79rem] font-semibold leading-[1.1rem] text-foreground">
                    {topAction.title}
                  </span>
                  <span className="type-supporting mt-0 block text-[0.65rem] leading-3 text-type-tertiary">
                    {topAction.description}
                  </span>
                </span>
              </button>

              <div className="my-[2px] h-px bg-border" />

              <div className="space-y-0">
                {[...aiItems, ...utilityItems].map((item) => (
                  <MenuRow key={item.action} item={item} onClick={handleAction} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
