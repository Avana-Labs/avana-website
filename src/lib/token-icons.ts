const ICON_BASE = "/Asset-Icons"

const symbolToIcon: Record<string, string> = {
  AAVE: "aave",
  AERO: "aero",
  ARB: "arb",
  AURA: "aura",
  AVAX: "avalanche",
  BAL: "bal",
  BASE: "base",
  BLAST: "blast",
  BNB: "bnb",
  BRETT: "brett",
  BTC: "btc",
  cbBTC: "cbbtc",
  cbETH: "cbeth",
  COMP: "compound",
  CONVEX: "convex",
  CRV: "crv",
  CVX: "convex",
  DAI: "dai",
  DEGEN: "degen",
  ETH: "eth",
  EURC: "eurc",
  FRAX: "frax",
  frxUSD: "frxusd",
  GHO: "gho",
  GNO: "gno",
  LDO: "ldo",
  LINK: "chainlink",
  MATIC: "polygon",
  OP: "op",
  CAKE: "pancakeswap",
  POL: "polygon",
  rETH: "reth",
  RLUSD: "rlusd",
  RPL: "rocket-pool",
  sDAI: "sdai",
  SOL: "sol",
  stETH: "steth",
  SUSHI: "sushiswap",
  "3CRV": "3crv",
  UNI: "uni",
  "USD+": "usd-plus",
  USDC: "usdc",
  USDe: "usde",
  USDG: "usdg",
  USDT: "usdt",
  WBTC: "wbtc",
  weETH: "weeth",
  WELL: "well",
  WETH: "weth",
  WORLD: "world",
  wstETH: "wsteth",
  ZORA: "zora",
}

export function getTokenIconSrc(symbol: string): string | null {
  const direct = symbolToIcon[symbol]
  if (direct) return `${ICON_BASE}/${direct}.webp`

  const caseInsensitiveMatch = Object.keys(symbolToIcon).find(
    (key) => key.toLowerCase() === symbol.toLowerCase(),
  )
  if (caseInsensitiveMatch) return `${ICON_BASE}/${symbolToIcon[caseInsensitiveMatch]}.webp`

  return null
}

export function hasTokenIcon(symbol: string): boolean {
  return getTokenIconSrc(symbol) !== null
}
