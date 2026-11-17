/**
 * Icons for the Reference pages: tokens, venues and networks. Paths are under public/.
 * Crypto icons come from public/Asset-Icons; the tokenized-stock icons in
 * public/Stock-Icons are copied from the design kit's stock-Icons set.
 */

const TOKEN_ICONS: Record<string, string> = {
  AAVE: "/Asset-Icons/aave.webp",
  AERO: "/Asset-Icons/aero.webp",
  cbBTC: "/Asset-Icons/cbbtc.webp",
  DAI: "/Asset-Icons/dai.webp",
  ETH: "/Asset-Icons/eth.webp",
  GHO: "/Asset-Icons/gho.webp",
  LINK: "/Asset-Icons/chainlink.webp",
  UNI: "/Asset-Icons/uni.webp",
  USDC: "/Asset-Icons/usdc.webp",
  USDT: "/Asset-Icons/usdt.webp",
  WBTC: "/Asset-Icons/wbtc.webp",
  WETH: "/Asset-Icons/weth.webp",
  wstETH: "/Asset-Icons/wsteth.webp",
  AMZNc: "/Stock-Icons/amazon.png",
  GOOGLc: "/Stock-Icons/google.png",
  METAc: "/Stock-Icons/meta.png",
  NVDAc: "/Stock-Icons/nvidia.png",
  SNDKc: "/Stock-Icons/sandisk.png",
  SPCXc: "/Stock-Icons/spacex.png",
}

const VENUE_ICONS: Array<[prefix: string, icon: string]> = [
  ["Uniswap v3", "/Asset-Icons/uni.webp"],
  ["Uniswap v4", "/Asset-Icons/uni.webp"],
  ["Aero Slipstream", "/Asset-Icons/aero.webp"],
]

const NETWORK_ICONS: Record<string, string> = {
  "ethereum-sepolia": "/Asset-Icons/eth.webp",
  "base-sepolia": "/Asset-Icons/base.webp",
  ethereum: "/Asset-Icons/eth.webp",
  base: "/Asset-Icons/base.webp",
}

export function tokenIcon(symbol: string): string | undefined {
  return TOKEN_ICONS[symbol]
}

/** The icons of a cell that is exactly one token (`USDC`) or one pair (`WETH/USDC`, `WETH/USDC LP`); otherwise null. */
export function tokenIcons(text: string): Array<{ symbol: string; src: string }> | null {
  const symbols = text.trim().replace(/ LP$/, "").split("/")
  if (symbols.length > 2) return null
  const icons = symbols.map((symbol) => ({ symbol, src: TOKEN_ICONS[symbol] }))
  return icons.every((icon) => icon.src) ? (icons as Array<{ symbol: string; src: string }>) : null
}

/** The venue icon for a name that starts with a venue (`Uniswap v3 Stable`, `Aero Slipstream integration`). */
export function venueIcon(text: string): string | undefined {
  return VENUE_ICONS.find(([prefix]) => text.startsWith(prefix))?.[1]
}

export function networkIcon(networkId: string): string | undefined {
  return NETWORK_ICONS[networkId]
}
