/**
 * AvanaHubWave — a decorative, slowly-drifting wave that conveys the volatility
 * character of an Avana LP Hub instead of a wall of token icons:
 *
 *   - "stable"     → a tight, nearly-flat band (low deviation, calm)
 *   - "correlated" → two waves moving in sync, a constant gap apart (assets track)
 *   - "volatile"   → one jagged, high-amplitude line (wide, erratic swings)
 *
 * Pure SVG + CSS keyframes (no client JS, no animation library), matching the
 * house pattern in borrow-against-lp.tsx / multiply-assets-loop.tsx. Paths are
 * periodic over VIEW_W so a translateX(-VIEW_W) loop tiles seamlessly. Motion is
 * disabled under prefers-reduced-motion; the static frame still reads distinctly.
 */

export type HubWaveVariant = "stable" | "correlated" | "volatile"

const VIEW_W = 400
const VIEW_H = 150
const MID = VIEW_H / 2
const STEP = 3
const TAU = Math.PI * 2

// Angular frequency whose period divides VIEW_W (keeps the loop seamless).
const w = (k: number) => (TAU * k) / VIEW_W
const r = (n: number) => Math.round(n * 10) / 10

function linePath(fn: (x: number) => number): string {
  let d = ""
  for (let x = 0; x <= VIEW_W * 2; x += STEP) {
    d += `${x === 0 ? "M" : "L"}${x} ${r(fn(x))}`
  }
  return d
}

function bandPath(top: (x: number) => number, bottom: (x: number) => number): string {
  let d = `M0 ${r(top(0))}`
  for (let x = STEP; x <= VIEW_W * 2; x += STEP) d += `L${x} ${r(top(x))}`
  for (let x = VIEW_W * 2; x >= 0; x -= STEP) d += `L${x} ${r(bottom(x))}`
  return `${d}Z`
}

// --- variant shapes -------------------------------------------------------
//
// All three fill down to the baseline so they carry the same visual weight;
// character comes from smoothness, spread and amplitude.

const toBase = (fn: (x: number) => number) => bandPath(fn, () => VIEW_H + 4)
type Fill = { d: string; opacity: number; solid?: boolean }
type Stroke = { d: string; opacity: number }

// Stable: calm, smooth rolling hills (low harmonics). Two stacked layers give
// depth; a tight twin line hugs the front crest — a nod to tight pricing.
const stableFront = (x: number) =>
  64 + 16 * Math.sin(w(1) * x + 0.4) + 2 * Math.sin(w(2) * x + 1.2)
const stableTwin = (x: number) => stableFront(x) + 6
const stableBack = (x: number) => 71 + 14 * Math.sin(w(1) * x + 1.9)

// Correlated: a single clean sine (perfect regularity = perfect correlation)
// drawn as a constant-width body — a smooth snake slithering across the panel.
const snakeMid = (x: number) => MID + 24 * Math.sin(w(2) * x + 0.5)
const corrTop = (x: number) => snakeMid(x) - 10
const corrBottom = (x: number) => snakeMid(x) + 10

// Volatile: one line, layered harmonics → wide, jagged, erratic swings.
const volLine = (x: number) =>
  MID +
  20 * Math.sin(w(1) * x + 0.2) +
  12 * Math.sin(w(3) * x + 1.7) +
  8 * Math.sin(w(5) * x + 3.1) +
  5 * Math.sin(w(8) * x + 0.9) +
  4 * Math.sin(w(13) * x + 2.2)

const SHAPES: Record<HubWaveVariant, { fills: Fill[]; lines: Stroke[]; duration: string }> = {
  stable: {
    fills: [
      { d: toBase(stableBack), opacity: 0.4 },
      { d: toBase(stableFront), opacity: 1 },
    ],
    lines: [
      { d: linePath(stableFront), opacity: 1 },
      { d: linePath(stableTwin), opacity: 0.45 },
    ],
    duration: "26s",
  },
  correlated: {
    fills: [{ d: bandPath(corrTop, corrBottom), opacity: 0.2, solid: true }],
    lines: [
      { d: linePath(corrTop), opacity: 1 },
      { d: linePath(corrBottom), opacity: 1 },
    ],
    duration: "18s",
  },
  volatile: {
    fills: [{ d: toBase(volLine), opacity: 1 }],
    lines: [{ d: linePath(volLine), opacity: 1 }],
    duration: "11s",
  },
}

export function AvanaHubWave({ variant }: { variant: HubWaveVariant }) {
  const fillId = `hw-fill-${variant}`
  const strokeId = `hw-stroke-${variant}`
  const shape = SHAPES[variant]
  const duration = shape.duration

  return (
    <div className="hw-wrap" aria-hidden="true">
      <svg
        className="hw-svg"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        role="presentation"
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#01AACF" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#01AACF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#01AACF" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#01AACF" stopOpacity="1" />
            <stop offset="100%" stopColor="#01AACF" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {/* faint grid — a nod to the surface-plot reference */}
        <g className="hw-grid">
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1="0" x2={VIEW_W} y1={VIEW_H * f} y2={VIEW_H * f} />
          ))}
        </g>

        <g className="hw-drift" style={{ animationDuration: duration }}>
          {shape.fills.map((f, i) => (
            <path
              key={`f-${i}`}
              d={f.d}
              fill={f.solid ? "#01AACF" : `url(#${fillId})`}
              fillOpacity={f.opacity}
            />
          ))}
          {shape.lines.map((s, i) => (
            <path
              key={`s-${i}`}
              d={s.d}
              fill="none"
              stroke={`url(#${strokeId})`}
              strokeWidth={2}
              strokeOpacity={s.opacity}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      </svg>

      <style>{`
        .hw-wrap {
          position: relative;
          width: 100%;
          height: 160px;
          overflow: hidden;
          border-radius: 8px;
          background:
            radial-gradient(120% 90% at 50% 0%, rgba(1, 170, 207, 0.05), transparent 70%),
            #f8fafb;
        }
        .hw-svg { display: block; width: 100%; height: 100%; }
        .hw-grid line { stroke: rgba(15, 21, 24, 0.05); stroke-width: 1; vector-effect: non-scaling-stroke; }
        .hw-drift {
          transform: translate3d(0, 0, 0);
          animation-name: hw-drift;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        @keyframes hw-drift {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-${VIEW_W}px, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hw-drift { animation: none; }
        }
      `}</style>
    </div>
  )
}

export default AvanaHubWave
