import Image from "next/image"
import { LazySection } from "@/components/ui/lazy-section"
import type { LucideIcon } from "lucide-react"
import {
  ArrowLeftRight,
  BriefcaseBusiness,
  Building2,
  Globe2,
  Layers,
  Zap,
} from "lucide-react"
import HomepageFaqSection from "@/components/homepage/HomepageFaqSection"
import HomepageNewsroomSection from "@/components/homepage/HomepageNewsroomSection"
import { FeatureCardDescription, FeatureCardTitle } from "@/components/shared"
import { MarketingLeadHeader } from "@/components/marketing-lead-header"
import { AskAiShowcase } from "@/components/ask-ai-showcase"
import { homepagePools, type HomepagePool } from "@/data/homepage"
import { PerformanceDiv } from "@/components/ui/performance-section"
import { TokenLogo } from "@/components/token-logo"
import type { AppLocale } from "@/i18n/locales"
import { withMarketingI18n } from "@/lib/content-i18n/with-marketing-i18n"

function repeatItems<T>(items: T[], count: number, offset: number) {
  if (items.length === 0) return []

  const output: T[] = []
  for (let i = 0; i < count; i += 1) {
    output.push(items[(offset + i) % items.length])
  }
  return output
}

/**
 * HeroSection - Homepage secondary content shell.
 */
function PoolCard({ pool }: { pool: HomepagePool }) {
  return (
    <div className="flex h-[58px] flex-shrink-0 items-center gap-2.5 rounded-full border border-border bg-card px-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:shadow-[0_3px_8px_rgba(0,0,0,0.25)] dark:hover:shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
      <div className="relative flex items-center shrink-0">
        <TokenLogo symbol={pool.token0.symbol} className="z-10" />
        <TokenLogo symbol={pool.token1.symbol} className="-ml-2" />
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-1.5 whitespace-nowrap">
          <span className="text-[0.88rem] tracking-[-0.02em] text-foreground">
            {pool.token0.symbol} / {pool.token1.symbol}
          </span>
          <span className="text-[0.8rem] text-type-tertiary">{pool.dex}</span>
        </div>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="type-meta-label">TVL</span>
          <span className="text-[0.76rem] text-type-secondary">{pool.tvl}</span>
        </div>
      </div>
    </div>
  )
}

const lpUseCases: {
  title: string
  description: string
  icon: LucideIcon
}[] = [
  {
    title: "Treasury financing",
    description:
      "Unlock cash against LP positions to fund runway without selling liquidity or giving up fee flow.",
    icon: Building2,
  },
  {
    title: "Grow exposure",
    description:
      "Borrow against existing positions, add liquidity, and expand fee exposure from the same capital base.",
    icon: Layers,
  },
  {
    title: "Trading liquidity",
    description:
      "Use LP-backed credit to rebalance inventory, hedge risk, or move quickly when a trade needs capital.",
    icon: ArrowLeftRight,
  },
  {
    title: "Cross-ecosystem credit",
    description:
      "Keep LP collateral in one venue and borrow for use across other protocols, strategies, or chains.",
    icon: Globe2,
  },
  {
    title: "Ops runway",
    description:
      "Cover payroll, vendors, and launches with LP credit without touching core positions or reserves.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Move on short notice",
    description:
      "Borrow when timing matters, then redeploy capital as opportunities open across the broader market.",
    icon: Zap,
  },
]

const positionSafetyItems = [
  {
    title: "Leverage Layer",
    description: "Draw LP-backed credit and deploy borrowed capital into the market.",
  },
  {
    title: "Unwind Layer",
    description: "Close, reduce, repay, or liquidate with debt coverage first.",
  },
  {
    title: "Risk Layer",
    description: "Track collateral, debt, and leverage in real time before risk rises.",
  },
  {
    title: "Monitoring Layer",
    description: "Watch collateral, debt, leverage, liquidation, and health in one view.",
  },
] as const


export default async function HeroSection({ locale }: { locale: AppLocale }) {
  return withMarketingI18n(
    locale,
    [
      "hero-section",
      "ask-ai-showcase",
      "homepage/HomepageFaqSection",
      "homepage/HomepageNewsroomSection",
    ],
    HeroSectionBody(locale),
  )
}

function HeroSectionBody(locale: AppLocale) {
  return (
    <section className="pb-0">
      <div className="site-content-shell site-section-gap">
        <PerformanceDiv className="flex flex-col gap-8 md:gap-12">
            <div className="flex flex-col gap-6">
          <div className="flex max-w-[600px] flex-col gap-2">
            <MarketingLeadHeader
              title="Access loans across hundreds of pools"
              subtitle="Keep earning trading fees while drawing credit against your LP."
            />
          </div>
            </div>

            <LazySection defer minHeight="296px" rootMargin="600px" className="w-full space-y-2 overflow-hidden py-5 [mask-image:linear-gradient(to_right,transparent_0%,black_11%,black_89%,transparent_100%)]">
              {[
                { items: repeatItems(homepagePools, 8, 0), motion: "animate-scroll-left", duration: "62s" },
                { items: repeatItems(homepagePools, 8, 6), motion: "animate-scroll-right", duration: "70s" },
                { items: repeatItems(homepagePools, 8, 12), motion: "animate-scroll-left-slow", duration: "78s" },
                { items: repeatItems(homepagePools, 8, 18), motion: "animate-scroll-right-slow", duration: "86s" },
              ].map((row, rowIndex) => (
                <div key={rowIndex} className="overflow-hidden">
                  <div
                    className={`flex w-max items-center gap-3 ${row.motion}`}
                    style={{ animationDuration: row.duration }}
                  >
                    {row.items.map((pool, index) => (
                      <PoolCard key={`row-${rowIndex}-${index}-a`} pool={pool} />
                    ))}
                    {row.items.map((pool, index) => (
                      <PoolCard key={`row-${rowIndex}-${index}-b`} pool={pool} />
                    ))}
                  </div>
                </div>
              ))}
            </LazySection>

        </PerformanceDiv>
      </div>

      <AskAiShowcase />

      <div className="site-content-shell site-section-gap flex flex-col site-section-stack">
        <div id="multiply-markets" className="w-full">
          <PerformanceDiv>
            <MarketingLeadHeader
              className="mb-6 sm:mb-8"
              title="Increase Your Yield with Built-In Risk Controls"
              subtitle="Multiply Markets to loop capital, tune pool risk, and manage position health."
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 items-stretch">
              {/* Card 01 — Loop LP capital */}
              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base max-w-prose flex grow flex-col">
                    <div>
                      <h2>Loop LP capital</h2>
                      <div className="text-pretty">
                        Supply LP collateral, borrow against it, resupply the borrowed capital, and repeat until your risk limit.
                      </div>
                    </div>
                  </div>
                  <figure className="pt-g1.75 mt-auto">
                    <div
                      className="media-border-container relative grid grid-cols-1 grid-rows-1"
                      style={
                        {
                          "--layered-media-bg-light": "#EBE4D8",
                          "--layered-media-bg-dark": "#383026",
                          height: "320px",
                        } as React.CSSProperties
                      }
                    >
                      <div
                        className="media-light absolute inset-0 z-0"
                        style={{ backgroundColor: "rgb(235, 228, 216)" }}
                      />
                      <div
                        className="media-dark absolute inset-0 z-0"
                        style={{ backgroundColor: "rgb(56, 48, 38)" }}
                      />
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <div className="flex h-full w-full items-center justify-center p-4 sm:p-5">
                          <div className="relative h-[210px] w-full max-w-[240px] overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/10 dark:ring-white/10 sm:max-w-[260px]">
                            <Image
                              src="/images/avana-tokens-rewards-v2.jpg"
                              alt="Avana token rewards"
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </figure>
                </div>
              </div>

              {/* Card 02 — Risk tuned to pools */}
              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base max-w-prose flex grow flex-col">
                    <div>
                      <h2>Risk tuned to pools</h2>
                      <div className="text-pretty">
                        Continuous risk scoring tracks pool volatility and health quality.
                      </div>
                    </div>
                  </div>
                  <figure className="pt-g1.75 mt-auto">
                    <div
                      className="media-border-container relative grid grid-cols-1 grid-rows-1"
                      style={
                        {
                          "--layered-media-bg-light": "#DCE6E1",
                          "--layered-media-bg-dark": "#25342D",
                          height: "320px",
                        } as React.CSSProperties
                      }
                    >
                      <div
                        className="media-light absolute inset-0 z-0"
                        style={{ backgroundColor: "rgb(220, 230, 225)" }}
                      />
                      <div
                        className="media-dark absolute inset-0 z-0"
                        style={{ backgroundColor: "rgb(37, 52, 45)" }}
                      />
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <div className="flex h-full w-full items-center justify-center p-3 sm:p-4">
                          <div className="relative w-full max-w-[240px] overflow-hidden rounded-lg bg-card shadow-lg ring-1 ring-black/10 dark:ring-white/10 p-3 sm:max-w-[260px]">
                            <div className="h-[188px] overflow-hidden">
                              <div className="ce-ticker-risk">
                                {[
                                  {
                                    pair: "ETH / USDC",
                                    badge: "Low risk",
                                    badgeBg: "bg-emerald-50 dark:bg-emerald-950/40",
                                    badgeText: "text-emerald-700 dark:text-emerald-300",
                                    badgeBorder: "border-emerald-200 dark:border-emerald-800",
                                    metrics: [
                                      { label: "Pool depth", value: "Deep", level: 90, color: "#10b981" },
                                      { label: "Volatility", value: "Low", level: 25, color: "#6ee7b7" },
                                      { label: "Oracle quality", value: "98 / 100", level: 98, color: "#6366f1" },
                                    ],
                                  },
                                  {
                                    pair: "WBTC / ETH",
                                    badge: "Watch",
                                    badgeBg: "bg-amber-50 dark:bg-amber-950/40",
                                    badgeText: "text-amber-700 dark:text-amber-300",
                                    badgeBorder: "border-amber-200 dark:border-amber-800",
                                    metrics: [
                                      { label: "Pool depth", value: "Medium", level: 60, color: "#f59e0b" },
                                      { label: "Volatility", value: "Med", level: 50, color: "#fb923c" },
                                      { label: "Oracle quality", value: "95 / 100", level: 95, color: "#6366f1" },
                                    ],
                                  },
                                  {
                                    pair: "ARB / USDC",
                                    badge: "Elevated",
                                    badgeBg: "bg-rose-50 dark:bg-rose-950/40",
                                    badgeText: "text-rose-700 dark:text-rose-300",
                                    badgeBorder: "border-rose-200 dark:border-rose-800",
                                    metrics: [
                                      { label: "Pool depth", value: "Shallow", level: 35, color: "#f43f5e" },
                                      { label: "Volatility", value: "High", level: 78, color: "#ef4444" },
                                      { label: "Oracle quality", value: "88 / 100", level: 88, color: "#6366f1" },
                                    ],
                                  },
                                  {
                                    pair: "ETH / USDC",
                                    badge: "Low risk",
                                    badgeBg: "bg-emerald-50 dark:bg-emerald-950/40",
                                    badgeText: "text-emerald-700 dark:text-emerald-300",
                                    badgeBorder: "border-emerald-200 dark:border-emerald-800",
                                    metrics: [
                                      { label: "Pool depth", value: "Deep", level: 90, color: "#10b981" },
                                      { label: "Volatility", value: "Low", level: 25, color: "#6ee7b7" },
                                      { label: "Oracle quality", value: "98 / 100", level: 98, color: "#6366f1" },
                                    ],
                                  },
                                ].map((item, i) => (
                                  <div key={i} className="flex h-[188px] items-center">
                                    <div className="w-full rounded-[14px] border border-border/80 bg-background/90 p-3 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-foreground">{item.pair}</span>
                                        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold ${item.badgeBg} ${item.badgeText} ${item.badgeBorder}`}>
                                          {item.badge}
                                        </span>
                                      </div>
                                      <div className="mt-2.5 space-y-2">
                                        {item.metrics.map((metric) => (
                                          <div key={metric.label}>
                                            <div className="flex items-center justify-between">
                                              <span className="text-[9px] font-medium text-muted-foreground">{metric.label}</span>
                                              <span className="text-[10px] font-semibold text-foreground">{metric.value}</span>
                                            </div>
                                            <div className="mt-1 h-[4px] w-full overflow-hidden rounded-full bg-muted">
                                              <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${metric.level}%`, backgroundColor: metric.color }} />
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="mt-2.5 flex items-center gap-1.5 text-[9px] font-medium text-emerald-600 dark:text-emerald-400">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Borrowing enabled
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </figure>
                </div>
              </div>

              {/* Card 03 — Minimal volatility risk */}
              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base max-w-prose flex grow flex-col">
                    <div>
                      <h2>Minimal volatility risk</h2>
                      <div className="text-pretty">
                        Transparent risk parameters and predictable liquidation behavior for peg-aligned pools.
                      </div>
                    </div>
                  </div>
                  <figure className="pt-g1.75 mt-auto">
                    <div
                      className="media-border-container relative grid grid-cols-1 grid-rows-1"
                      style={
                        {
                          "--layered-media-bg-light": "#DDE3EA",
                          "--layered-media-bg-dark": "#28303B",
                          height: "320px",
                        } as React.CSSProperties
                      }
                    >
                      <div
                        className="media-light absolute inset-0 z-0"
                        style={{ backgroundColor: "rgb(221, 227, 234)" }}
                      />
                      <div
                        className="media-dark absolute inset-0 z-0"
                        style={{ backgroundColor: "rgb(40, 48, 59)" }}
                      />
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <div className="flex h-full w-full items-center justify-center p-3 sm:p-4">
                          <div className="relative w-full max-w-[240px] overflow-hidden rounded-lg bg-card shadow-lg ring-1 ring-black/10 dark:ring-white/10 p-3.5 sm:max-w-[260px]">
                            <div className="overflow-hidden rounded-[14px] border border-border/80 bg-background/90 p-3 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[9px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Range</span>
                                <span className="shrink-0 rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[9px] font-semibold text-foreground">
                                  Peg
                                </span>
                              </div>
                              <div className="relative mt-3 h-[4.75rem] overflow-hidden rounded-lg border border-border/50 bg-muted/40">
                                <div className="absolute left-2.5 right-2.5 top-2.5 border-t border-dashed border-muted-foreground/40" />
                                <div className="absolute bottom-2.5 left-2.5 right-2.5 border-b border-dashed border-muted-foreground/40" />
                                <p className="absolute left-2 top-1 text-[8px] font-bold text-rose-500">↑</p>
                                <p className="absolute bottom-1 left-2 text-[8px] font-bold text-rose-500">↓</p>
                                <div className="absolute inset-x-8 inset-y-5 z-0 rounded-md border border-border bg-background shadow-xs" />
                                <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background shadow-xs" />
                              </div>
                              <div className="mt-3 grid grid-cols-2 gap-2">
                                <div className="rounded-lg border border-border/80 bg-muted/40 px-2.5 py-1.5 text-center">
                                  <span className="block text-[8px] font-medium text-muted-foreground">30d vol</span>
                                  <span className="text-[11px] font-semibold text-foreground">3.2%</span>
                                </div>
                                <div className="rounded-lg border border-border/80 bg-muted/40 px-2.5 py-1.5 text-center">
                                  <span className="block text-[8px] font-medium text-muted-foreground">Buffer</span>
                                  <span className="text-[11px] font-semibold text-foreground">18%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </figure>
                </div>
              </div>

              {/* Card 04 — Cleaner position monitoring */}
              <div className="h-full">
                <div className="card flex h-full grow-1 flex-col">
                  <div className="type-base max-w-prose flex grow flex-col">
                    <div>
                      <h2>Cleaner position monitoring</h2>
                      <div className="text-pretty">
                        Track health, usage, and pool-specific limits with a clearer LP-first borrowing workflow.
                      </div>
                    </div>
                  </div>
                  <figure className="pt-g1.75 mt-auto">
                    <div
                      className="media-border-container relative grid grid-cols-1 grid-rows-1"
                      style={
                        {
                          "--layered-media-bg-light": "#E3DFD8",
                          "--layered-media-bg-dark": "#34302C",
                          height: "320px",
                        } as React.CSSProperties
                      }
                    >
                      <div
                        className="media-light absolute inset-0 z-0"
                        style={{ backgroundColor: "rgb(227, 223, 216)" }}
                      />
                      <div
                        className="media-dark absolute inset-0 z-0"
                        style={{ backgroundColor: "rgb(52, 48, 44)" }}
                      />
                      <div className="z-20 col-span-full row-span-full h-full min-h-0">
                        <div className="flex h-full w-full items-center justify-center p-3 sm:p-4">
                          <div className="relative w-full max-w-[240px] overflow-hidden rounded-lg bg-card shadow-lg ring-1 ring-black/10 dark:ring-white/10 p-3.5 sm:max-w-[260px]">
                            <div className="overflow-hidden rounded-[14px] border border-border/80 bg-background/90 p-3 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Console</span>
                                <div className="flex items-center gap-1.5">
                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/60" />
                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/30" />
                                </div>
                              </div>
                              <div className="mt-3 flex items-end justify-between gap-2">
                                <div>
                                  <span className="block text-[9px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Health</span>
                                  <p className="mt-1 text-[2.2rem] font-semibold leading-none tracking-[-0.05em] text-foreground">1.82</p>
                                </div>
                                <div className="flex h-[48px] items-end gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1.5">
                                  <div className="h-5 w-1.5 rounded-full bg-emerald-500/40" />
                                  <div className="h-7 w-1.5 rounded-full bg-emerald-500/70" />
                                  <div className="h-9 w-1.5 rounded-full bg-emerald-500" />
                                </div>
                              </div>
                              <div className="mt-3 flex items-center justify-between">
                                <span className="text-[10px] font-semibold text-foreground">ETH / USDC</span>
                                <span className="text-[10px] font-medium tabular-nums text-muted-foreground">64%</span>
                              </div>
                              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                                <div className="h-full w-[64%] rounded-full bg-emerald-500" />
                              </div>
                              <div className="mt-2.5 flex items-center justify-between">
                                <span className="text-[9px] text-muted-foreground">Borrow cap</span>
                                <span className="text-[10px] font-semibold text-foreground">$2.4M</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </figure>
                </div>
              </div>
            </div>

            <style>{`
              .ce-ticker-risk {
                animation: ce-tr 16s cubic-bezier(0.76, 0, 0.24, 1) infinite;
              }
              @keyframes ce-tr {
                0%, 22% { transform: translateY(0); }
                28%, 50% { transform: translateY(-25%); }
                56%, 78% { transform: translateY(-50%); }
                84%, 100% { transform: translateY(-75%); }
              }
              @media (prefers-reduced-motion: reduce) {
                .ce-ticker-risk {
                  animation: none !important;
                }
              }
            `}</style>
          </PerformanceDiv>
        </div>


      <div>
        <MarketingLeadHeader
          title="Who it's for"
          subtitle="Ways teams put LP credit to work"
        />

        <div className="mt-8 grid grid-cols-1 gap-8 sm:mt-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 md:mt-16 md:gap-x-16 md:gap-y-14 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-20">
          {lpUseCases.map((item) => {
            const Icon = item.icon

            return (
              <article key={item.title} className="flex flex-col bg-transparent">
                <Icon className="h-10 w-10 text-[#01AACF] sm:h-11 sm:w-11" strokeWidth={1.5} aria-hidden="true" />
                <FeatureCardTitle className="mt-4 sm:mt-5">{item.title}</FeatureCardTitle>
                <FeatureCardDescription className="mt-2 max-w-[22rem]">
                  {item.description}
                </FeatureCardDescription>
              </article>
            )
          })}
        </div>
      </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,27rem)_minmax(0,1fr)] md:items-start md:gap-8 lg:gap-10 xl:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
          <div className="space-y-4 md:self-start">
            <MarketingLeadHeader
              title="Position Safety"
              subtitle="Designed for safe leverage"
            />
            <ol className="mt-7 grid max-w-[32rem] gap-4">
              {positionSafetyItems.map((item, index) => (
                <li key={item.title} className="flex gap-3">
                  <span className="type-meta-label mt-0.5 shrink-0">{index + 1}.</span>
                  <p className="type-body-copy">
                    <span className="text-foreground">{item.title}.</span> {item.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex items-center justify-center pt-1 md:justify-end">
            <div className="relative w-full max-w-[17rem] sm:max-w-[22rem] md:max-w-[25rem] lg:max-w-[28rem] xl:max-w-[31rem]">
              <Image
                src="/images/Avana Coin.webp"
                alt="Avana coin illustration"
                width={1714}
                height={1601}
                className="h-auto w-full"
                sizes="(min-width: 1280px) 31rem, (min-width: 1024px) 28rem, (min-width: 768px) 25rem, (min-width: 640px) 22rem, 17rem"
              />
            </div>
          </div>
        </div>

        <div className="-mt-8 md:-mt-12">
          <HomepageNewsroomSection locale={locale} eyebrowTone="rose" />
        </div>

        <div className="pb-12 md:pb-16 lg:pb-20">
          <HomepageFaqSection />
        </div>
      </div>
      <div className="h-px w-full bg-border" aria-hidden="true" />
    </section>
  )
}
