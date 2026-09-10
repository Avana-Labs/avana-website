"use client"

import { useMemo, useState } from "react"
import { SectionEyebrow, SectionTitle } from "@/components/shared"
import { lookupPhrase, usePhraseMap } from "@/components/phrase-map-context"
import { getTokenIconSrc } from "@/lib/token-icons"

type MarketCategory = "stablecoins" | "ethereum" | "bitcoin" | "others"

type MarketItem = {
  name: string
  ticker: string
  category: MarketCategory
}

const tabs: { id: MarketCategory; label: string }[] = [
  { id: "stablecoins", label: "Stablecoins" },
  { id: "ethereum", label: "Ethereum" },
  { id: "bitcoin", label: "Bitcoin" },
  { id: "others", label: "Others" },
]

const MARKET_ITEMS_PER_ROW = 9

const marketItems: MarketItem[] = [
  // Stablecoins
  { name: "USD Coin", ticker: "USDC", category: "stablecoins" },
  { name: "Tether", ticker: "USDT", category: "stablecoins" },
  { name: "Dai", ticker: "DAI", category: "stablecoins" },
  { name: "GHO", ticker: "GHO", category: "stablecoins" },
  { name: "Frax", ticker: "FRAX", category: "stablecoins" },
  { name: "USDe", ticker: "USDe", category: "stablecoins" },
  { name: "Ripple USD", ticker: "RLUSD", category: "stablecoins" },
  { name: "Global Dollar", ticker: "USDG", category: "stablecoins" },
  { name: "Euro Coin", ticker: "EURC", category: "stablecoins" },
  { name: "USD+", ticker: "USD+", category: "stablecoins" },
  { name: "Savings Dai", ticker: "sDAI", category: "stablecoins" },
  { name: "Frax USD", ticker: "frxUSD", category: "stablecoins" },

  // Ethereum-based
  { name: "Ether", ticker: "ETH", category: "ethereum" },
  { name: "Wrapped Ether", ticker: "WETH", category: "ethereum" },
  { name: "stETH", ticker: "stETH", category: "ethereum" },
  { name: "wstETH", ticker: "wstETH", category: "ethereum" },
  { name: "rETH", ticker: "rETH", category: "ethereum" },
  { name: "cbETH", ticker: "cbETH", category: "ethereum" },
  { name: "weETH", ticker: "weETH", category: "ethereum" },

  // Bitcoin-based
  { name: "Bitcoin", ticker: "BTC", category: "bitcoin" },
  { name: "Wrapped Bitcoin", ticker: "WBTC", category: "bitcoin" },
  { name: "cbBTC", ticker: "cbBTC", category: "bitcoin" },

  // Others
  { name: "Aave", ticker: "AAVE", category: "others" },
  { name: "Uniswap", ticker: "UNI", category: "others" },
  { name: "Chainlink", ticker: "LINK", category: "others" },
  { name: "Curve", ticker: "CRV", category: "others" },
  { name: "Lido", ticker: "LDO", category: "others" },
  { name: "Compound", ticker: "COMP", category: "others" },
  { name: "Convex", ticker: "CVX", category: "others" },
  { name: "Balancer", ticker: "BAL", category: "others" },
  { name: "Aura", ticker: "AURA", category: "others" },
  { name: "SushiSwap", ticker: "SUSHI", category: "others" },
  { name: "PancakeSwap", ticker: "CAKE", category: "others" },
  { name: "Aerodrome", ticker: "AERO", category: "others" },
  { name: "Arbitrum", ticker: "ARB", category: "others" },
  { name: "Optimism", ticker: "OP", category: "others" },
  { name: "Polygon", ticker: "POL", category: "others" },
  { name: "Base", ticker: "BASE", category: "others" },
  { name: "BNB", ticker: "BNB", category: "others" },
  { name: "Solana", ticker: "SOL", category: "others" },
  { name: "Avalanche", ticker: "AVAX", category: "others" },
  { name: "Blast", ticker: "BLAST", category: "others" },
  { name: "Zora", ticker: "ZORA", category: "others" },
  { name: "Worldcoin", ticker: "WORLD", category: "others" },
  { name: "Moonwell", ticker: "WELL", category: "others" },
  { name: "Gnosis", ticker: "GNO", category: "others" },
  { name: "Degen", ticker: "DEGEN", category: "others" },
  { name: "Brett", ticker: "BRETT", category: "others" },
]

function repeatItems<T>(items: T[], count: number, offset: number) {
  if (items.length === 0) return []

  const output: T[] = []
  for (let i = 0; i < count; i += 1) {
    output.push(items[(offset + i) % items.length])
  }
  return output
}

function LogoPill({ ticker }: { ticker: string }) {
  const src = getTokenIconSrc(ticker)

  if (!src) {
    const initials = ticker.slice(0, 4).toUpperCase()
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-[2.25rem] w-[2.25rem] shrink-0 items-center justify-center rounded-full bg-muted text-[0.6rem] font-semibold text-foreground"
      >
        {initials}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      className="h-[2.25rem] w-[2.25rem] rounded-full object-contain"
    />
  )
}

function MarketChip({ item }: { item: MarketItem }) {
  return (
    <article className="flex h-[3.45rem] w-[8.6rem] shrink-0 items-center gap-2.5 rounded-full border border-border bg-card px-2.5 shadow-[0_3px_8px_rgba(15,23,42,0.02)] sm:w-[8.95rem]">
      <LogoPill ticker={item.ticker} />
      <div className="min-w-0">
        <div className="truncate text-[0.8rem] font-semibold leading-tight tracking-[-0.02em] text-foreground">
          {item.name}
        </div>
        <div className="mt-0.5 text-[0.62rem] font-medium uppercase tracking-[0.1em] text-type-tertiary">
          {item.ticker}
        </div>
      </div>
    </article>
  )
}

function MarqueeRow({
  items,
  reverse = false,
  duration,
}: {
  items: MarketItem[]
  reverse?: boolean
  duration: number
}) {
  const trackClass = reverse ? "animate-scroll-right" : "animate-scroll-left"

  return (
    <div className="relative overflow-hidden py-1">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent sm:w-16" />
      <div className={`flex w-max items-center gap-2.5 ${trackClass}`} style={{ animationDuration: `${duration}s` }}>
        {items.map((item, index) => (
          <MarketChip key={`${item.name}-${item.ticker}-${index}-a`} item={item} />
        ))}
        {items.map((item, index) => (
          <MarketChip key={`${item.name}-${item.ticker}-${index}-b`} item={item} />
        ))}
      </div>
    </div>
  )
}

export default function TradeMarketShowcase() {
  const map = usePhraseMap()
  const t = (text: string) => lookupPhrase(map, text)
  const [selectedTab, setSelectedTab] = useState<MarketCategory>("stablecoins")

  const filteredItems = useMemo(() => {
    return marketItems.filter((item) => item.category === selectedTab)
  }, [selectedTab])

  const rows = useMemo(() => {
    if (filteredItems.length === 0) return [[], [], [], []] as MarketItem[][]

    return [
      repeatItems(filteredItems, MARKET_ITEMS_PER_ROW, 0),
      repeatItems(filteredItems, MARKET_ITEMS_PER_ROW, 5),
      repeatItems(filteredItems, MARKET_ITEMS_PER_ROW, 10),
      repeatItems(filteredItems, MARKET_ITEMS_PER_ROW, 15),
    ]
  }, [filteredItems])

  return (
    <section className="relative bg-white site-section-gap">
      <div className="site-content-shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-[600px] flex-col gap-2">
            <SectionEyebrow tone="emerald">{t("Supply markets")}</SectionEyebrow>
            <SectionTitle className="max-w-[16ch] md:max-w-none">
              {t("Lend across markets")}
            </SectionTitle>
          </div>

          <div className="flex items-center justify-start md:justify-end">
            <div className="inline-flex max-w-full flex-wrap items-center gap-2">
              {tabs.map((tab) => {
                const active = selectedTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedTab(tab.id)}
                    className={[
                      "inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                      active
                        ? "bg-[#01AACF] text-white hover:bg-[#00a0c2]"
                        : "border border-border bg-card text-foreground hover:bg-muted",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    {t(tab.label)}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-2 md:mt-10">
          <MarqueeRow items={rows[0]} duration={126} />
          <MarqueeRow items={rows[1]} reverse duration={138} />
          <MarqueeRow items={rows[2]} duration={132} />
          <MarqueeRow items={rows[3]} reverse duration={144} />
        </div>
      </div>
    </section>
  )
}
