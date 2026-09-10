interface LogoProps {
  className?: string
}

function BackpackLogo({ className }: LogoProps) {
  return (
    <svg width="116" height="37" viewBox="0 0 116 37" className={className} aria-hidden="true">
      <use href="/images/partners/backpack.svg#logo" />
    </svg>
  )
}

function PhantomLogo({ className }: LogoProps) {
  return (
    <svg width="111" height="37" viewBox="0 0 111 37" className={className} aria-hidden="true">
      <use href="/images/partners/phantom.svg#logo" />
    </svg>
  )
}

function JupiterLogo({ className }: LogoProps) {
  return (
    <svg width="104" height="37" viewBox="0 0 104 37" className={className} aria-hidden="true">
      <use href="/images/partners/jupiter.svg#logo" />
    </svg>
  )
}

function SolflareLogo({ className }: LogoProps) {
  return (
    <svg width="100" height="37" viewBox="0 0 100 37" className={className} aria-hidden="true">
      <use href="/images/partners/solflare.svg#logo" />
    </svg>
  )
}

function DriftLogo({ className }: LogoProps) {
  return (
    <svg width="83" height="37" viewBox="0 0 83 37" className={className} aria-hidden="true">
      <use href="/images/partners/drift.svg#logo" />
    </svg>
  )
}

function BonkLogo({ className }: LogoProps) {
  return (
    <svg width="105" height="37" viewBox="0 0 105 37" className={className} aria-hidden="true">
      <use href="/images/partners/bonk.svg#logo" />
    </svg>
  )
}

export const TRUSTED_LOGOS = [
  { name: "Backpack", href: "https://backpack.app", Logo: BackpackLogo },
  { name: "Phantom", href: "https://phantom.com", Logo: PhantomLogo },
  { name: "Jupiter", href: "https://jup.ag", Logo: JupiterLogo },
  { name: "Solflare", href: "https://solflare.com", Logo: SolflareLogo },
  { name: "Drift", href: "https://www.drift.trade", Logo: DriftLogo },
  { name: "Bonk", href: "https://bonkcoin.com", Logo: BonkLogo },
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
              <Logo className="h-7 w-auto shrink-0 fill-current opacity-75 transition-opacity duration-200 hover:opacity-100" />
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
                    <Logo className="h-7 w-auto shrink-0 fill-current opacity-75" />
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
