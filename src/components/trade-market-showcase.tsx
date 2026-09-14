"use client"

import { useMemo } from "react"
import { SectionEyebrow, SectionTitle } from "@/components/shared"
import { lookupPhrase, usePhraseMap } from "@/components/phrase-map-context"
import { getTokenIconSrc } from "@/lib/token-icons"

type MarketItem = {
  name: string
  ticker: string
}

const MARKET_ITEMS_PER_ROW = 9

const marketItems: MarketItem[] = [
  // Stablecoins
  { name: "USD Coin", ticker: "USDC" },
  { name: "Tether", ticker: "USDT" },
  { name: "Dai", ticker: "DAI" },
  { name: "GHO", ticker: "GHO" },
  { name: "Frax", ticker: "FRAX" },
  { name: "USDe", ticker: "USDe" },
  { name: "Ripple USD", ticker: "RLUSD" },
  { name: "Global Dollar", ticker: "USDG" },
  { name: "Euro Coin", ticker: "EURC" },
  { name: "USD+", ticker: "USD+" },
  { name: "Savings Dai", ticker: "sDAI" },
  { name: "Frax USD", ticker: "frxUSD" },

  // Ethereum-based
  { name: "Ether", ticker: "ETH" },
  { name: "Wrapped Ether", ticker: "WETH" },
  { name: "stETH", ticker: "stETH" },
  { name: "wstETH", ticker: "wstETH" },
  { name: "rETH", ticker: "rETH" },
  { name: "cbETH", ticker: "cbETH" },
  { name: "weETH", ticker: "weETH" },

  // Bitcoin-based
  { name: "Bitcoin", ticker: "BTC" },
  { name: "Wrapped Bitcoin", ticker: "WBTC" },
  { name: "cbBTC", ticker: "cbBTC" },

  // Others
  { name: "Aave", ticker: "AAVE" },
  { name: "Uniswap", ticker: "UNI" },
  { name: "Chainlink", ticker: "LINK" },
  { name: "Curve", ticker: "CRV" },
  { name: "Lido", ticker: "LDO" },
  { name: "Compound", ticker: "COMP" },
  { name: "Convex", ticker: "CVX" },
  { name: "Balancer", ticker: "BAL" },
  { name: "Aura", ticker: "AURA" },
  { name: "SushiSwap", ticker: "SUSHI" },
  { name: "PancakeSwap", ticker: "CAKE" },
  { name: "Aerodrome", ticker: "AERO" },
  { name: "Arbitrum", ticker: "ARB" },
  { name: "Optimism", ticker: "OP" },
  { name: "Polygon", ticker: "POL" },
  { name: "Base", ticker: "BASE" },
  { name: "BNB", ticker: "BNB" },
  { name: "Solana", ticker: "SOL" },
  { name: "Avalanche", ticker: "AVAX" },
  { name: "Blast", ticker: "BLAST" },
  { name: "Zora", ticker: "ZORA" },
  { name: "Worldcoin", ticker: "WORLD" },
  { name: "Moonwell", ticker: "WELL" },
  { name: "Gnosis", ticker: "GNO" },
  { name: "Degen", ticker: "DEGEN" },
  { name: "Brett", ticker: "BRETT" },
]

const featuredTickers = [
  "USDC",
  "USDT",
  "DAI",
  "GHO",
  "USDe",
  "ETH",
  "WETH",
  "stETH",
  "wstETH",
  "rETH",
  "BTC",
  "WBTC",
  "cbBTC",
  "AAVE",
  "UNI",
  "CRV",
  "BAL",
  "AURA",
  "AERO",
  "ARB",
  "OP",
  "BASE",
  "SOL",
  "AVAX",
  "WELL",
  "GNO",
]

const featuredMarketItems = marketItems.filter((item) => featuredTickers.includes(item.ticker))

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

function FrozenAssetRow({
  items,
  offset,
}: {
  items: MarketItem[]
  offset: string
}) {
  return (
    <div className="overflow-hidden">
      <div className="flex w-max items-center gap-2.5" style={{ transform: `translateX(${offset})` }}>
        {items.map((item, index) => <MarketChip key={`${item.name}-${item.ticker}-${index}-a`} item={item} />)}
        {items.map((item, index) => <MarketChip key={`${item.name}-${item.ticker}-${index}-b`} item={item} />)}
      </div>
    </div>
  )
}

export default function TradeMarketShowcase() {
  const map = usePhraseMap()
  const t = (text: string) => lookupPhrase(map, text)

  const rows = useMemo(() => {
    return [
      { items: repeatItems(featuredMarketItems, MARKET_ITEMS_PER_ROW, 0), offset: "-1.5rem" },
      { items: repeatItems(featuredMarketItems, MARKET_ITEMS_PER_ROW, 6), offset: "-9rem" },
      { items: repeatItems(featuredMarketItems, MARKET_ITEMS_PER_ROW, 12), offset: "-5rem" },
      { items: repeatItems(featuredMarketItems, MARKET_ITEMS_PER_ROW, 18), offset: "-13rem" },
    ]
  }, [])

  return (
    <section className="relative bg-white site-section-gap">
      <div className="site-content-shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-[600px] flex-col gap-2">
            <SectionEyebrow tone="emerald">{t("Lend assets you already hold")}</SectionEyebrow>
            <SectionTitle className="max-w-none">
              {t("Supply Stablecoins, Ethereum based and other assets.")}
            </SectionTitle>
          </div>
        </div>

        <div className="mt-8 w-full space-y-2 overflow-hidden py-5 [mask-image:linear-gradient(to_right,transparent_0%,black_11%,black_89%,transparent_100%)] md:mt-10">
          {rows.map((row, rowIndex) => <FrozenAssetRow key={rowIndex} items={row.items} offset={row.offset} />)}
        </div>
      </div>
    </section>
  )
}
