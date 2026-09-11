import { ChevronRight } from "lucide-react"
import type { ProtocolAdapter } from "@/data/protocols"
import { SectionEyebrow, SectionTitle } from "@/components/shared"

const iconClasses = [
  "bg-[#dbe9ff] text-[#4268a8]",
  "bg-[#f4dfd6] text-[#9b5b3e]",
  "bg-[#e4e1fa] text-[#6757a6]",
  "bg-[#dcefe5] text-[#3e8362]",
  "bg-[#f2e7c5] text-[#90702d]",
  "bg-[#e5e5e5] text-[#4e4e4e]",
] as const

const dexLinks: Record<string, string> = {
  U2: "https://uniswap.org",
  U3: "https://uniswap.org",
  U4: "https://uniswap.org",
  CRV: "https://curve.fi",
  AE: "https://aerodrome.finance",
  BAL: "https://balancer.fi",
  BAL2: "https://balancer.fi",
  COW: "https://swap.cow.fi/#/1/swap/WETH/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  SUSHI: "https://sushi.com",
}

export function SupportedDexDirectory({ protocols }: { protocols: ProtocolAdapter[] }) {
  return (
    <section id="supported-dexes" className="site-section-gap">
      <div className="site-content-shell">
        <div className="mx-auto w-full max-w-[90rem]">
          <div className="mb-8 flex max-w-[600px] flex-col gap-2">
            <SectionEyebrow tone="emerald">Supported DEXs</SectionEyebrow>
            <SectionTitle>Every supported liquidity venue</SectionTitle>
          </div>

          <div>
            <div className="min-w-0">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {protocols.map((protocol, index) => (
                  <a
                    key={protocol.name}
                    href={dexLinks[protocol.shortName]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[5rem] items-center gap-3 rounded-lg bg-[#fafafa] px-3 py-2.5 transition-colors hover:bg-[#f1f1ef] sm:gap-4 sm:px-4"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[0.55rem] font-semibold tracking-[-0.02em] shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${iconClasses[index % iconClasses.length]}`}>
                      {protocol.shortName}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[1rem] font-medium leading-tight tracking-[-0.02em] text-[#292a26] sm:text-[1.1rem]">
                        {protocol.name.replace(/ Adapter$/, "")}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-[0.85rem] leading-snug text-[#6f706a] sm:text-[0.95rem]">
                        {protocol.purpose}
                      </p>
                    </div>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-[#aaa9a3] transition-transform group-hover:translate-x-0.5"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
