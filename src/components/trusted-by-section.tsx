import Image from "next/image"

interface LogoProps {
  className?: string
}

function BrandWordmark({ src, width, height, size = "default", className }: LogoProps & { src: string; width: number; height: number; size?: "default" | "large" | "small" }) {
  const sizing = size === "large" ? "!h-6 max-w-[112px]" : size === "small" ? "!h-4 max-w-[88px]" : "!h-5 max-w-[96px]"

  return <Image src={src} alt="" width={width} height={height} className={`${className} ${sizing} object-contain`} aria-hidden="true" />
}

export const TRUSTED_LOGOS = [
  { name: "Kraken", href: "https://www.kraken.com", Logo: (props: LogoProps) => <BrandWordmark {...props} src="/images/partners/kraken.svg" width={650} height={155} /> },
  { name: "Aave", href: "https://aave.com", Logo: (props: LogoProps) => <BrandWordmark {...props} size="small" src="/images/partners/aave.svg" width={833} height={139} /> },
  { name: "Balancer", href: "https://balancer.fi", Logo: (props: LogoProps) => <BrandWordmark {...props} src="/images/partners/balancer.svg" width={1001} height={185} /> },
  { name: "Avalanche", href: "https://www.avax.network", Logo: (props: LogoProps) => <BrandWordmark {...props} size="large" src="/images/partners/avalanche.svg" width={2500} height={472} /> },
  { name: "Uniswap", href: "https://uniswap.org", Logo: (props: LogoProps) => <BrandWordmark {...props} size="large" src="/images/partners/uniswap.svg" width={961} height={240} /> },
] as const

interface TrustedBySectionProps {
  caption?: string
}

export function TrustedBySection({
  caption = "Trusted by teams that ship high-quality Web3 products",
}: TrustedBySectionProps) {
  return (
    <section className="overflow-hidden border-b border-border/40 bg-background/50 py-10 md:py-12" aria-label="Trusted by">
      <div className="site-content-shell flex flex-col items-center gap-6 md:gap-7">
        <p className="text-center text-sm font-normal tracking-[-0.01em] text-type-secondary">
          {caption}
        </p>

        {/* Desktop: centered wrapping row */}
        <div className="hidden sm:flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-12">
          {TRUSTED_LOGOS.map(({ name, href, Logo }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="inline-flex items-center justify-center text-type-secondary transition-colors duration-200 hover:text-foreground"
            >
              <Logo className="h-7 w-auto max-w-[112px] shrink-0 object-contain fill-current opacity-75 transition-opacity duration-200 hover:opacity-100" />
            </a>
          ))}
        </div>

        {/* Mobile: infinite marquee with edge fade gradients */}
        <div className="relative w-full sm:hidden overflow-hidden">
          <div
            className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-background to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-background to-transparent"
            aria-hidden="true"
          />

          <div className="flex w-max animate-logo-marquee items-center gap-10 hover:[animation-play-state:paused]">
            {[0, 1].map((copyIndex) => (
              <div key={copyIndex} className="flex items-center gap-10 shrink-0">
                {TRUSTED_LOGOS.map(({ name, href, Logo }) => (
                  <a
                    key={`${copyIndex}-${name}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    tabIndex={copyIndex === 1 ? -1 : undefined}
                    aria-hidden={copyIndex === 1 ? true : undefined}
                    className="inline-flex items-center justify-center text-type-secondary transition-colors duration-200 hover:text-foreground"
                  >
                    <Logo className="h-7 w-auto max-w-[112px] shrink-0 object-contain fill-current opacity-75" />
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
