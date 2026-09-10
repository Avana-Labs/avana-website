import Image from "next/image"
import { getTokenIconSrc } from "@/lib/token-icons"

// Two real market curves. Each token renders a distinct window of one of them,
// rescaled to fill the chart — so every line keeps the real-market look but no
// two are the same and none is a straight copy of the originals.
const CURVE_A =
  "M0.2 62.6L1.2 61.4L3.9 61.6L6.7 60.8L9.4 65.1L12.1 71.8L14.8 70.7L17.5 69L20.3 68.7L23.1 66.8L25.8 67.8L28.5 66.5L31.2 64.5L34 64.9L36.7 71.3L39.4 70L42.1 66.4L44.9 65.5L47.6 68.3L50.4 67.5L53.1 67.7L55.8 66.7L58.5 68.9L61.2 68.9L64 70.3L66.8 77.2L69.5 79.7L72.1 80.2L74.9 81.7L77.6 82.2L80.4 81.4L83.1 81.4L85.8 81.4L88.5 82.6L91.2 79.1L94.1 80L96.8 79.4L99.4 80L102.2 79.4L104.9 79.6L107.7 81.5L110.4 82.2L113.1 84.7L115.8 81.6L118.6 80.1L121.3 79.7L124 80.8L126.7 67.2L129.6 69.8L132.2 68.3L135.1 70.3L137.7 75.4L140.4 78.3L143.1 78.5L145.9 78.9L148.7 79.4L151.3 78L154 76.9L156.8 77L159.5 77.7L162.3 78L165 77.9L167.8 78.8L170.5 77.2L173.2 72.9L175.9 65.7L178.6 63.2L181.5 69.2L184.1 69.3L186.9 69.2L189.6 71.9L192.3 66.8L195 67L197.7 67.1L200.4 58.2L203.2 54.5L205.9 57.6L208.7 62.5L211.4 65.3L214.2 67.2L216.8 63.9L219.5 71.6L222.4 68.4L225.2 70.4L227.7 73L230.5 81.4L233.2 86.5L236 81.4L238.7 84.1L241.4 86.9L244.2 87.3L246.8 81.7L249.6 82.7L252.4 84.2L255.1 88.6L257.8 84.1L260.5 72L263.3 60.8L266.1 58.5L268.7 61.1L271.6 55.1L274.2 61.8L277 54.6L279.6 53.6L282.4 54.5L285.2 52.1L287.9 51.5L290.5 40.9L293.3 29.6L296 23.4L298.9 25.8L301.6 21.4L304.3 21.6L306.9 18.5L309.6 15.7L312.4 16.6L315.1 15.9L318 9.3L320.6 10.1L323.3 1L326.2 5.9L328.8 4L331.6 13.9L334.4 19L337 21.7L339.7 25.7L342.4 33.7L345.2 32.9L347.9 33.9L350.6 30.7L353.5 19.4L356 27.6L358.9 35.9L361.7 29.5L364.2 23L367 15.4L369.7 20.5L372.4 12.5L375.3 17.8L378.1 30L380.8 32.7L383.4 38L386.1 38.6L388.8 36.8L391.6 13.7L394.2 6.3"

const CURVE_B =
  "M0.8 6.3L3.4 13.7L6.2 36.8L8.9 38.6L11.6 38L14.2 32.7L16.9 30L19.7 17.8L22.6 12.5L25.3 20.5L28 15.4L30.8 23L33.3 29.5L36.1 35.9L39 27.6L41.5 19.4L44.4 30.7L47.1 33.9L49.8 32.9L52.6 33.7L55.3 25.7L58 21.7L60.6 19L63.4 13.9L66.2 4L68.8 5.9L71.7 1L74.4 10.1L77 9.3L79.9 15.9L82.6 16.6L85.4 15.7L88.1 18.5L90.7 21.6L93.4 21.4L96.1 25.8L99 23.4L101.7 29.6L104.5 40.9L107.1 51.5L109.8 52.1L112.6 54.5L115.4 53.6L118 54.6L120.8 61.8L123.4 55.1L126.3 61.1L128.9 58.5L131.7 60.8L134.5 72L137.2 84.1L139.9 88.6L142.6 84.2L145.4 82.7L148.2 81.7L150.8 87.3L153.6 86.9L156.3 84.1L159 81.4L161.8 86.5L164.5 81.4L167.3 73L169.8 70.4L172.6 68.4L175.5 71.6L178.2 63.9L180.8 67.2L183.6 65.3L186.3 62.5L189.1 57.6L191.8 54.5L194.6 58.2L197.3 67.1L200 67L202.7 66.8L205.4 71.9L208.1 69.2L210.9 69.3L213.5 69.2L216.4 63.2L219.1 65.7L221.8 72.9L224.5 77.2L227.2 78.8L230 77.9L232.7 78L235.5 77.7L238.2 77L241 76.9L243.7 78L246.3 79.4L249.1 78.9L251.9 78.5L254.6 78.3L257.3 75.4L259.9 70.3L262.8 68.3L265.4 69.8L268.3 67.2L271 80.8L273.7 79.7L276.4 80.1L279.2 81.6L281.9 84.7L284.6 82.2L287.3 81.5L290.1 79.6L292.8 79.4L295.6 80L298.2 79.4L300.9 80L303.8 79.1L306.5 82.6L309.2 81.4L311.9 81.4L314.6 81.4L317.4 82.2L320.1 81.7L322.9 80.2L325.5 79.7L328.2 77.2L331 70.3L333.8 68.9L336.5 68.9L339.2 66.7L341.9 67.7L344.6 67.5L347.4 68.3L350.1 65.5L352.9 66.4L355.6 70L358.3 71.3L361 64.9L363.8 64.5L366.5 66.5L369.2 67.8L371.9 66.8L374.7 68.7L377.5 69L380.2 70.7L382.9 71.8L385.6 65.1L388.3 60.8L391.1 61.6L393.8 61.4L394.8 62.6"

const VIEW_W = 395

function seriesFrom(d: string): number[] {
  const nums = d.match(/-?\d+(?:\.\d+)?/g) ?? []
  const ys: number[] = []
  for (let i = 1; i < nums.length; i += 2) ys.push(Number(nums[i]))
  return ys
}

// Take a window [start, start+len] (fractions) of a curve using its NATIVE
// points (no resampling, so the original jaggedness is preserved), spread it
// across the full width, and normalize it to fill the chart height.
function windowPath(
  series: number[],
  start: number,
  len: number,
  flip: boolean,
): string {
  const n = series.length
  const i0 = Math.round(start * (n - 1))
  const i1 = Math.min(n, Math.round((start + len) * (n - 1)) + 1)
  const seg = series.slice(i0, i1)
  const m = seg.length
  let min = Infinity
  let max = -Infinity
  for (const v of seg) {
    if (v < min) min = v
    if (v > max) max = v
  }
  const range = max - min || 1
  const top = 5
  const bottom = 84
  const dx = VIEW_W / (m - 1)
  let d = ""
  for (let i = 0; i < m; i++) {
    let norm = (seg[i] - min) / range
    if (flip) norm = 1 - norm
    const y = top + norm * (bottom - top)
    d += `${i === 0 ? "M" : "L"}${(i * dx).toFixed(1)} ${y.toFixed(1)}`
  }
  return d
}

const A = seriesFrom(CURVE_A)
const B = seriesFrom(CURVE_B)

type Market = {
  symbol: string
  name: string
  hub: string
  apy: string
  stroke: string
  path: string
}

// frxUSD and WETH were white in the source (invisible on a light surface), so
// they use visible token-appropriate colors here. Each uses a distinct window.
const markets: Market[] = [
  { symbol: "USDC", name: "USD Coin", hub: "Stable LP Hub", apy: "5.41%", stroke: "#2775CA", path: windowPath(A, 0.0, 0.6, false) },
  { symbol: "GHO", name: "GHO", hub: "Stable LP Hub", apy: "4.12%", stroke: "#28D358", path: windowPath(A, 0.38, 0.6, true) },
  { symbol: "frxUSD", name: "Frax USD", hub: "Stable LP Hub", apy: "6.03%", stroke: "#475569", path: windowPath(B, 0.05, 0.6, false) },
  { symbol: "USDT", name: "Tether USD", hub: "Stable LP Hub", apy: "4.87%", stroke: "#009393", path: windowPath(B, 0.4, 0.6, true) },
  { symbol: "WETH", name: "Wrapped Ether", hub: "Correlated LP Hub", apy: "2.34%", stroke: "#627EEA", path: windowPath(A, 0.22, 0.55, false) },
  { symbol: "WBTC", name: "Wrapped BTC", hub: "Volatile LP Hub", apy: "1.19%", stroke: "#F7931A", path: windowPath(B, 0.2, 0.55, true) },
]

function MarketCard({ market }: { market: Market }) {
  const icon = getTokenIconSrc(market.symbol)
  return (
    <div className="lmd-market">
      <div className="lmd-top">
        <span className="lmd-token">
          {icon ? (
            <Image src={icon} alt="" width={56} height={56} loading="lazy" />
          ) : null}
        </span>
        <span className="lmd-names">
          <span className="lmd-name">{market.name}</span>
          <span className="lmd-meta">{market.hub}</span>
        </span>
        <span className="lmd-figure">{market.apy}</span>
      </div>
      <div className="lmd-band">
        <svg
          className="lmd-chart"
          viewBox="0 0 395 89"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            d={market.path}
            stroke={market.stroke}
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  )
}

export function LendMarketsDeck() {
  const loop = [...markets, ...markets]
  return (
    <div className="lmd-visual" aria-hidden="true">
      <div className="lmd-track">
        {loop.map((market, index) => (
          <MarketCard key={`${market.symbol}-${index}`} market={market} />
        ))}
      </div>
      <style>{`
        .lmd-visual {
          position: relative;
          height: 100%;
          width: 100%;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%);
          mask-image: linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%);
        }
        .lmd-track {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 6px 2px;
          animation: lmd-scroll 34s linear infinite;
          will-change: transform;
        }
        @keyframes lmd-scroll {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        .lmd-market {
          flex: none;
          border: 1px solid rgba(15, 21, 24, 0.08);
          border-radius: 12px;
          background: #ffffff;
          padding: 11px 14px;
          box-shadow: 0 1px 2px rgba(15, 21, 24, 0.04);
        }
        .lmd-top {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .lmd-token {
          display: inline-flex;
          flex: none;
        }
        .lmd-token img {
          width: 42px;
          height: 42px;
          border-radius: 9999px;
        }
        .lmd-names {
          display: flex;
          flex-direction: column;
          min-width: 0;
          gap: 2px;
        }
        .lmd-name {
          font-size: 0.9375rem;
          font-weight: 600;
          line-height: 1.2;
          color: #0f1518;
        }
        .lmd-meta {
          font-size: 0.75rem;
          color: #73726c;
        }
        .lmd-figure {
          margin-left: auto;
          font-size: 0.9375rem;
          font-weight: 600;
          color: #0f1518;
          font-variant-numeric: tabular-nums;
        }
        .lmd-band {
          margin-top: 9px;
        }
        .lmd-chart {
          display: block;
          width: 100%;
          height: 40px;
        }
        @media (prefers-reduced-motion: reduce) {
          .lmd-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

export default LendMarketsDeck
