import Image from "next/image"
import type { LucideIcon } from "lucide-react"
import {
  ArrowLeftRight,
  BriefcaseBusiness,
  Building2,
  Globe2,
  Layers,
  Percent,
  RotateCcw,
  Wallet,
  Zap,
} from "lucide-react"
import { DeFiTerm } from "@/components/defi-term"
import HomepageFaqSection from "@/components/homepage/HomepageFaqSection"
import HomepageNewsroomSection from "@/components/homepage/HomepageNewsroomSection"
import HomepageTestimonialSection from "@/components/homepage/HomepageTestimonialSection"
import { FeatureCardDescription, FeatureCardTitle, SectionIntro } from "@/components/shared"
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

const lendingSavingsCards: {
  title: string
  description: string
  icon: LucideIcon
}[] = [
  {
    title: "Supply single assets",
    description: "Deposit supported assets into markets used by LP-backed borrowers.",
    icon: Wallet,
  },
  {
    title: "Earn from demand",
    description: "Supplier yield moves with utilization, liquidity, and borrower demand.",
    icon: Percent,
  },
  {
    title: "Withdraw when liquid",
    description: "Redeem supplied assets when there is available liquidity in the market.",
    icon: RotateCcw,
  },
]

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


export default async function HeroSection({ locale }: { locale: AppLocale }) {
  return withMarketingI18n(
    locale,
    [
      "hero-section",
      "homepage/HomepageTestimonialSection",
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
            <SectionIntro
              eyebrow="Borrow Markets"
              eyebrowTone="cyan"
              title="Access loans using hundreds of LP collateral"
            />
          </div>
            </div>

            <div className="w-full space-y-2 overflow-hidden py-5 [mask-image:linear-gradient(to_right,transparent_0%,black_11%,black_89%,transparent_100%)]">
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
            </div>

        </PerformanceDiv>
      </div>

      <div className="site-content-shell site-section-gap">
        <div className="mx-auto grid w-full max-w-[90rem] items-start gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-18">
          <div className="max-w-[33rem]">
            <SectionIntro
              eyebrow="Lend Markets"
              eyebrowTone="emerald"
              title="Earn interest from LP borrower demand"
              titleClassName="mt-5 max-w-none"
            />

            <div className="mt-7 grid max-w-[32rem] gap-5">
              {lendingSavingsCards.map((card, index) => (
                <div key={card.title} className="flex gap-3">
                  <span className="type-meta-label mt-0.5 shrink-0">{index + 1}.</span>
                  <div>
                    <FeatureCardTitle as="p">{card.title}</FeatureCardTitle>
                    <FeatureCardDescription className="mt-1">{card.description}</FeatureCardDescription>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:pt-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-transparent md:rounded-[28px] lg:aspect-[1.18/1] lg:rounded-[32px]">
              <Image
                src="/images/leverage-hero-placeholder.webp"
                alt="Person holding a smartphone showing a finance app"
                fill
                className="object-cover object-[55%_42%]"
                sizes="(max-width: 1024px) 100vw, 54vw"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="site-content-shell site-section-gap flex flex-col site-section-stack">
        <PerformanceDiv>
            <div className="flex flex-col gap-6">
              <div className="flex max-w-[600px] flex-col gap-2">
                <SectionIntro
                  eyebrow="Multiply Markets"
                  eyebrowTone="amber"
                  title={<span className="block">Increase Your Yield with Built-In Risk Controls</span>}
                />
              </div>
            </div>
            <div className="relative mt-10 md:mt-16">
              <div className="overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="grid w-max grid-flow-col auto-cols-[19.75rem] gap-4 px-1 lg:auto-cols-[21.5rem] lg:gap-5">
                  {/* Card 01 — Maximize your capital */}
                  <article className="flex h-[31.25rem] w-full snap-start flex-col overflow-hidden feature-card rounded-[26px] p-5">
                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <FeatureCardTitle>Loop LP capital</FeatureCardTitle>
                        <FeatureCardDescription className="max-w-[16rem]">Supply LP collateral, borrow against it, resupply the borrowed capital, and repeat until your risk limit.</FeatureCardDescription>
                      </div>
                      <div className="type-meta-label shrink-0">01</div>
                    </div>
                    <div className="relative z-0 mt-auto">
                      <div className="flex items-end justify-center">
                        <div className="hero-feature-mockup relative h-[18rem] w-full overflow-hidden rounded-[22px] border border-gray-200 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                          <Image
                            src="/images/avana-tokens-rewards-v2.jpg"
                            alt="Avana token rewards"
                            fill
                            sizes="(min-width: 1024px) 344px, 316px"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </article>

                  {/* Card 02 — LP-aware risk models */}
                  <article className="flex h-[31.25rem] w-full snap-start flex-col overflow-hidden feature-card rounded-[26px] p-5">
                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <FeatureCardTitle>Risk tuned to pools</FeatureCardTitle>
                        <FeatureCardDescription className="max-w-[16rem]">Continuous risk scoring tracks pool volatility and health quality.</FeatureCardDescription>
                      </div>
                      <div className="type-meta-label shrink-0">02</div>
                    </div>
                    <div className="relative z-0 mt-auto">
                      <div className="flex items-end justify-center">
                        <div className="hero-feature-mockup relative h-[18rem] w-full overflow-hidden rounded-[22px] border border-gray-200 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.05),transparent_55%)]" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center px-5">
                            <div className="w-full max-w-[16rem] overflow-hidden">
                              <div className="h-[194px] overflow-hidden">
                                <div className="ce-ticker-risk">
                                  {[
                                    {
                                      pair: "ETH / USDC",
                                      badge: "Low risk",
                                      badgeBg: "bg-emerald-50",
                                      badgeText: "text-emerald-700",
                                      badgeBorder: "border-emerald-100",
                                      metrics: [
                                        { label: "Pool depth", value: "Deep", level: 90, color: "#10b981" },
                                        { label: "Volatility", value: "Low", level: 25, color: "#6ee7b7" },
                                        { label: "Oracle quality", value: "98 / 100", level: 98, color: "#6366f1" },
                                      ],
                                    },
                                    {
                                      pair: "WBTC / ETH",
                                      badge: "Watch",
                                      badgeBg: "bg-amber-50",
                                      badgeText: "text-amber-700",
                                      badgeBorder: "border-amber-100",
                                      metrics: [
                                        { label: "Pool depth", value: "Medium", level: 60, color: "#f59e0b" },
                                        { label: "Volatility", value: "Med", level: 50, color: "#fb923c" },
                                        { label: "Oracle quality", value: "95 / 100", level: 95, color: "#6366f1" },
                                      ],
                                    },
                                    {
                                      pair: "ARB / USDC",
                                      badge: "Elevated",
                                      badgeBg: "bg-rose-50",
                                      badgeText: "text-rose-700",
                                      badgeBorder: "border-rose-100",
                                      metrics: [
                                        { label: "Pool depth", value: "Shallow", level: 35, color: "#f43f5e" },
                                        { label: "Volatility", value: "High", level: 78, color: "#ef4444" },
                                        { label: "Oracle quality", value: "88 / 100", level: 88, color: "#6366f1" },
                                      ],
                                    },
                                    {
                                      pair: "ETH / USDC",
                                      badge: "Low risk",
                                      badgeBg: "bg-emerald-50",
                                      badgeText: "text-emerald-700",
                                      badgeBorder: "border-emerald-100",
                                      metrics: [
                                        { label: "Pool depth", value: "Deep", level: 90, color: "#10b981" },
                                        { label: "Volatility", value: "Low", level: 25, color: "#6ee7b7" },
                                        { label: "Oracle quality", value: "98 / 100", level: 98, color: "#6366f1" },
                                      ],
                                    },
                                  ].map((item, i) => (
                                    <div key={i} className="flex h-[194px] items-center py-2">
                                      <div className="w-full rounded-[20px] border border-gray-100/80 bg-white px-4 py-3 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs font-semibold text-[#18323c]">{item.pair}</span>
                                          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${item.badgeBg} ${item.badgeText} ${item.badgeBorder}`}>
                                            {item.badge}
                                          </span>
                                        </div>
                                        <div className="mt-3 space-y-3">
                                          {item.metrics.map((metric) => (
                                            <div key={metric.label}>
                                              <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-medium text-gray-400">{metric.label}</span>
                                                <span className="text-[11px] font-semibold text-[#18323c]">{metric.value}</span>
                                              </div>
                                              <div className="mt-1.5 h-[5px] w-full overflow-hidden rounded-full bg-gray-100">
                                                <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${metric.level}%`, backgroundColor: metric.color }} />
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                        <div className="mt-3 flex items-center gap-2 text-[10px] font-medium text-emerald-600">
                                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
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
                    </div>
                  </article>

                  {/* Card 03 — Minimal volatility risk */}
                  <article className="flex h-[31.25rem] w-full snap-start flex-col overflow-hidden feature-card rounded-[26px] p-5">
                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <FeatureCardTitle>Minimal volatility risk</FeatureCardTitle>
                        <FeatureCardDescription className="max-w-[16rem]">
                          Transparent risk parameters and predictable liquidation behavior for peg-aligned pools.
                        </FeatureCardDescription>
                      </div>
                      <div className="type-meta-label shrink-0">03</div>
                    </div>
                    <div className="relative z-0 mt-auto">
                      <div className="flex items-end justify-center">
                        <div className="hero-feature-mockup relative h-[18rem] w-full overflow-hidden rounded-[22px] border border-gray-200 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                          <div className="absolute inset-0 flex items-center justify-center p-5">
                            <div className="w-full max-w-[15.75rem]">
                              <div className="overflow-hidden rounded-[20px] border border-gray-200 bg-white p-4">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[8px] font-medium uppercase tracking-[0.1em] text-gray-400">Range</span>
                                  <span className="shrink-0 rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[8px] font-medium text-gray-700">
                                    Peg
                                  </span>
                                </div>
                                <div className="relative mt-4 h-[5.5rem] overflow-hidden rounded-xl bg-gray-100">
                                  <div className="absolute left-3 right-3 top-3 border-t border-dashed border-gray-400" />
                                  <div className="absolute bottom-3 left-3 right-3 border-b border-dashed border-gray-400" />
                                  <p className="absolute left-2 top-1 text-[7px] font-medium text-rose-400/90">↑</p>
                                  <p className="absolute bottom-1 left-2 text-[7px] font-medium text-rose-400/90">↓</p>
                                  <div className="absolute inset-x-9 inset-y-7 z-0 rounded-md border border-gray-200 bg-white" />
                                  <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-600 bg-white" />
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                  <div className="rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2 text-center">
                                    <span className="block text-[8px] text-gray-500">30d vol</span>
                                    <span className="text-[11px] font-semibold text-[#18323c]">3.2%</span>
                                  </div>
                                  <div className="rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2 text-center">
                                    <span className="block text-[8px] text-gray-500">Buffer</span>
                                    <span className="text-[11px] font-semibold text-[#18323c]">18%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>

                  {/* Card 04 — Cleaner position monitoring */}
                  <article className="flex h-[31.25rem] w-full snap-start flex-col overflow-hidden feature-card rounded-[26px] p-5">
                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <FeatureCardTitle>Cleaner position monitoring</FeatureCardTitle>
                        <FeatureCardDescription className="max-w-[16rem]">
                          Track health, usage, and pool-specific limits with a clearer LP-first borrowing workflow.
                        </FeatureCardDescription>
                      </div>
                      <div className="type-meta-label shrink-0">04</div>
                    </div>
                    <div className="relative z-0 mt-auto">
                      <div className="flex items-end justify-center">
                        <div className="hero-feature-mockup relative h-[18rem] w-full overflow-hidden rounded-[22px] border border-gray-200 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                          <div className="absolute inset-0 flex items-center justify-center px-5">
                            <div className="w-full max-w-[16rem] rounded-[22px] border border-gray-200 bg-white p-4">
                              <div className="relative overflow-hidden rounded-[18px] border border-gray-200 bg-gray-50/50 p-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-gray-400">Console</span>
                                  <div className="flex items-center gap-1.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-500" />
                                  </div>
                                </div>
                                <div className="mt-4 flex items-end justify-between gap-3">
                                  <div>
                                    <span className="block text-[10px] font-medium uppercase tracking-[0.08em] text-gray-400">Health</span>
                                    <p className="mt-1 text-[2.6rem] font-semibold leading-none tracking-[-0.05em] text-[#18323c]">1.82</p>
                                  </div>
                                  <div className="flex h-[60px] items-end gap-1.5 rounded-[16px] border border-gray-200 bg-white px-3 py-2">
                                    <div className="h-8 w-2 rounded-full bg-gray-400" />
                                    <div className="h-10 w-2 rounded-full bg-gray-500" />
                                    <div className="h-12 w-2 rounded-full bg-gray-600" />
                                  </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                  <span className="text-[10px] font-semibold text-[#18323c]">ETH / USDC</span>
                                  <span className="text-[10px] font-medium tabular-nums text-gray-400">64%</span>
                                </div>
                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                                  <div className="h-full w-[64%] rounded-full bg-emerald-400" />
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                  <span className="text-[10px] text-gray-400">Cap</span>
                                  <span className="text-[10px] font-semibold text-[#18323c]">$2.4M</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>

                <style>{`
                  /* === Card 01: Maximize Capital — ring + ledger === */
                  .ce-ring-breathe {
                    box-shadow: 0 8px 18px rgba(15,23,42,0.04);
                    animation: ce-rb-scale 12s cubic-bezier(0.76, 0, 0.24, 1) infinite;
                  }
                  .ce-ring-breathe::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    border-radius: inherit;
                    box-shadow: 0 12px 22px rgba(15,23,42,0.06);
                    opacity: 0;
                    animation: ce-rb-shadow 12s cubic-bezier(0.76, 0, 0.24, 1) infinite;
                  }
                  @keyframes ce-rb-scale {
                    0%, 22%, 28%, 50%, 56%, 78%, 84%, 100% { transform: scale(1); }
                    24%, 26%, 52%, 54%, 80%, 82% { transform: scale(1.015); }
                  }
                  @keyframes ce-rb-shadow {
                    0%, 22%, 28%, 50%, 56%, 78%, 84%, 100% { opacity: 0; }
                    24%, 26%, 52%, 54%, 80%, 82% { opacity: 1; }
                  }

                  .ce-ticker-ltv {
                    animation: ce-tv 12s cubic-bezier(0.76, 0, 0.24, 1) infinite;
                  }
                  .ce-ltv-arc {
                    animation: ce-la 12s cubic-bezier(0.76, 0, 0.24, 1) infinite;
                  }
                  .ce-ticker-v {
                    animation: ce-tv 12s cubic-bezier(0.76, 0, 0.24, 1) infinite;
                  }
                  @keyframes ce-la {
                    0%, 22% { stroke-dashoffset: 52.78; }
                    28%, 50% { stroke-dashoffset: 65.97; }
                    56%, 78% { stroke-dashoffset: 92.36; }
                    84%, 100% { stroke-dashoffset: 52.78; }
                  }
                  @keyframes ce-tv {
                    0%, 22% { transform: translateY(0); }
                    28%, 50% { transform: translateY(-25%); }
                    56%, 78% { transform: translateY(-50%); }
                    84%, 100% { transform: translateY(-75%); }
                  }

                  /* === Card 02: Risk models — ticker === */
                  .ce-ticker-risk {
                    animation: ce-tr 16s cubic-bezier(0.76, 0, 0.24, 1) infinite;
                  }
                  @keyframes ce-tr {
                    0%, 22% { transform: translateY(0); }
                    28%, 50% { transform: translateY(-25%); }
                    56%, 78% { transform: translateY(-50%); }
                    84%, 100% { transform: translateY(-75%); }
                  }

                  /* === Reduced motion === */
                  @media (prefers-reduced-motion: reduce) {
                    .ce-ring-breathe,
                    .ce-ring-breathe::after,
                    .ce-ticker-ltv,
                    .ce-ltv-arc,
                    .ce-ticker-v,
                    .ce-escalator,
                    .ce-ticker-risk {
                      animation: none !important;
                    }
                  }
                `}</style>
              </div>
            </div>

        </PerformanceDiv>


      <div>
        <div className="max-w-[58rem] space-y-3 text-left sm:space-y-4">
          <SectionIntro
            eyebrow="Who it's for"
            eyebrowTone="rose"
            title="Ways teams put LP credit to work"
            titleClassName="max-w-[18ch] sm:max-w-[22ch] lg:max-w-none"
          />
        </div>

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

        <HomepageTestimonialSection />

        <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-16">
            <div className="max-w-[36rem] space-y-6">
              <div className="space-y-4">
                <SectionIntro
                  eyebrow="Engineered for resilience"
                  eyebrowTone="slate"
                  title={
                    <>
                      <span className="block">
                        Backed by{" "}
                        <span className="inline-flex translate-y-[-0.02em] items-center align-middle">
                          <Image
                            src="/images/brand/avana-token-circle.jpg"
                            alt="Avana"
                            width={56}
                            height={56}
                            className="h-[1.2em] w-[1.2em] rounded-full object-cover"
                          />
                        </span>
                        ,
                      </span>
                      <span className="block">Powered by Aave v4</span>
                    </>
                  }
                />
              </div>
              <div className="text-left text-type-secondary">
                <p className="type-display-lead max-w-[42rem]">
                  Aave v4 uses{" "}
                  <DeFiTerm term="hub" className="text-[0.92em]">
                    Hub
                  </DeFiTerm>{" "}
                  and{" "}
                  <DeFiTerm term="spoke" className="text-[0.92em]">
                    Spoke
                  </DeFiTerm>{" "}
                  architecture for shared liquidity and flexible risk controls. Avana builds on it for secure{" "}
                  <DeFiTerm term="lp-position" className="text-[0.92em]">
                    LP-backed borrowing
                  </DeFiTerm>
                  , resilient{" "}
                  <DeFiTerm term="oracle" className="text-[0.92em]">
                    oracle
                  </DeFiTerm>{" "}
                  checks, and controlled{" "}
                  <DeFiTerm term="liquidation" className="text-[0.92em]">
                    liquidation
                  </DeFiTerm>
                  .
                </p>
              </div>
            </div>

            <article className="relative h-[240px] w-full overflow-hidden sm:h-[300px] md:h-[360px] lg:h-[420px] xl:h-[460px]">
              <Image
                src="/images/avana-token-icons-v1.jpg"
                alt="Avana token icons"
                fill
                className="scale-[1.04] object-contain object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_68%,rgba(255,255,255,0.28)_86%,#fff_100%)]" />
            </article>
          </div>

        <div className="-mt-8 md:-mt-12">
          <HomepageNewsroomSection locale={locale} eyebrowTone="rose" />
        </div>

        <div className="pb-16 md:pb-24 2xl:pb-22">
          <HomepageFaqSection />
        </div>
      </div>
    </section>
  )
}
