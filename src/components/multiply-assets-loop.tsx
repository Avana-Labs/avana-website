import Image from "next/image"
import { getTokenIconSrc } from "@/lib/token-icons"

type Coin = {
  symbol: string
  size: number
  dur: string
  delay: string
  center?: boolean
}

// Overlapping cluster of real token icons that float on a continuous, seamless
// loop — each coin bobs on its own phase so the group never rests.
const coins: Coin[] = [
  { symbol: "WETH", size: 56, dur: "3.4s", delay: "-0.2s" },
  { symbol: "GHO", size: 62, dur: "3.0s", delay: "-1.1s" },
  { symbol: "USDC", size: 76, dur: "3.7s", delay: "-0.6s", center: true },
  { symbol: "USDT", size: 62, dur: "3.1s", delay: "-1.6s" },
  { symbol: "WBTC", size: 56, dur: "3.3s", delay: "-0.9s" },
]

export function MultiplyAssetsLoop() {
  return (
    <div className="mal-wrap" aria-hidden="true">
      <div className="mal-row">
        {coins.map((coin, index) => {
          const icon = getTokenIconSrc(coin.symbol)
          return (
            <span
              key={coin.symbol}
              className={`mal-coin${coin.center ? " mal-coin-center" : ""}`}
              style={
                {
                  width: `${coin.size}px`,
                  height: `${coin.size}px`,
                  marginLeft: index === 0 ? 0 : "-10px",
                  zIndex: coin.center ? 4 : 3 - Math.abs(index - 2),
                  "--mal-dur": coin.dur,
                  "--mal-delay": coin.delay,
                } as React.CSSProperties
              }
            >
              {icon ? (
                <Image src={icon} alt="" width={coin.size} height={coin.size} loading="lazy" />
              ) : null}
            </span>
          )
        })}
      </div>
      <style>{`
        .mal-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
        }
        .mal-row {
          position: relative;
          display: flex;
          align-items: center;
        }
        .mal-coin {
          position: relative;
          flex: none;
          border-radius: 9999px;
          overflow: hidden;
          animation: mal-float var(--mal-dur) ease-in-out infinite;
          animation-delay: var(--mal-delay);
          will-change: transform;
        }
        .mal-coin img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          object-fit: cover;
        }
        @keyframes mal-float {
          0%, 100% { transform: translateY(-6px); }
          50% { transform: translateY(6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mal-coin {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

export default MultiplyAssetsLoop
