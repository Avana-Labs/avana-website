import Image from "next/image"
import { MarketingLeadHeader } from "@/components/marketing-lead-header"
import type { AppLocale } from "@/i18n/locales"
import { withMarketingI18n } from "@/lib/content-i18n/with-marketing-i18n"

export async function AvanaProductsSection({ locale }: { locale: AppLocale }) {
  return withMarketingI18n(locale, ["avana-products-section"], (
    <section
      id="avana-products"
      className="w-full bg-inherit site-section-gap"
    >
      <div className="site-content-shell">
        <MarketingLeadHeader
          className="mb-6 sm:mb-8"
          title="Unlock capital from AMM markets"
          subtitle="Three native markets to borrow, earn interest, and manage leverage."
        />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 items-stretch">
          {/* Card 1: Borrow */}
          <div className="h-full">
            <div className="card flex h-full grow-1 flex-col">
              <div className="type-base max-w-prose flex grow flex-col">
                <div>
                  <h2>Borrow against LP positions</h2>
                  <div className="text-pretty">
                    Borrow against LP positions while your liquidity stays active in the underlying AMM.
                  </div>
                </div>
              </div>
              <figure className="pt-g1.75">
                <div
                  className="media-border-container relative grid grid-cols-1 grid-rows-1"
                  style={
                    {
                      "--layered-media-bg-light": "#FFFFFF",
                      "--layered-media-bg-dark": "#3C3935",
                      height: "380px",
                    } as React.CSSProperties
                  }
                >
                  <div
                    className="media-light absolute inset-0 z-0"
                    style={{ backgroundColor: "#fff" }}
                  />
                  <div className="z-20 col-span-full row-span-full h-full min-h-0">
                    <div className="flex h-full w-full items-center justify-center px-g1.75 py-g1.75">
                      <div className="relative w-full max-w-[340px] overflow-hidden rounded-lg shadow-lg ring-1 ring-black/10 xl:max-w-[380px]">
                        <Image
                          src="/marketing-static/automate/card-code-quality.png"
                          alt="Avana Borrow against LP positions"
                          loading="lazy"
                          width={954}
                          height={796}
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 380px"
                          className="h-auto w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </figure>
            </div>
          </div>

          {/* Card 2: Lend */}
          <div className="h-full">
            <div className="card flex h-full grow-1 flex-col">
              <div className="type-base max-w-prose flex grow flex-col">
                <div>
                  <h2>Lend into Hub markets</h2>
                  <div className="text-pretty">
                    Supply capital into Hub-connected lending markets and earn from LP-backed borrower demand.
                  </div>
                </div>
              </div>
              <figure className="pt-g1.75">
                <div
                  className="media-border-container relative grid grid-cols-1 grid-rows-1"
                  style={
                    {
                      "--layered-media-bg-light": "#FFFFFF",
                      "--layered-media-bg-dark": "#4A443B",
                      height: "380px",
                    } as React.CSSProperties
                  }
                >
                  <div
                    className="media-light absolute inset-0 z-0"
                    style={{ backgroundColor: "#fff" }}
                  />
                  <div className="z-20 col-span-full row-span-full h-full min-h-0">
                    <div className="flex h-full w-full items-center justify-center px-g1.75 py-g1.75">
                      <div className="relative w-full max-w-[340px] overflow-hidden rounded-lg shadow-lg ring-1 ring-black/10 xl:max-w-[380px]">
                        <Image
                          src="/marketing-static/automate/card-time-to-merge.png"
                          alt="Avana Lend into Hub-connected markets"
                          loading="lazy"
                          width={954}
                          height={796}
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 380px"
                          className="h-auto w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </figure>
            </div>
          </div>

          {/* Card 3: Multiply */}
          <div className="h-full">
            <div className="card flex h-full grow-1 flex-col">
              <div className="type-base max-w-prose flex grow flex-col">
                <div>
                  <h2>Multiply liquidity yields</h2>
                  <div className="text-pretty">
                    Use LP-backed credit to create managed leverage without exiting your base liquidity position.
                  </div>
                </div>
              </div>
              <figure className="pt-g1.75">
                <div
                  className="media-border-container relative grid grid-cols-1 grid-rows-1"
                  style={{ backgroundColor: "#fff", height: "380px" }}
                >
                  <div className="z-20 col-span-full row-span-full h-full min-h-0">
                    <div className="flex h-full w-full items-center justify-center px-g1.75 py-g1.75">
                      <div className="relative w-full max-w-[340px] overflow-hidden rounded-lg shadow-lg ring-1 ring-black/10 xl:max-w-[380px]">
                        <Image
                          src="/marketing-static/automate/card-codebase-knowledge.png"
                          alt="Avana Multiply managed leverage yield"
                          loading="lazy"
                          width={954}
                          height={796}
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 380px"
                          className="h-auto w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  ))
}
