"use client"

import { useId, useMemo, useState } from "react"
import { SandboxNotice, SectionEyebrow, SectionTitle } from "@/components/shared"
import { lookupPhrase, usePhraseMap } from "@/components/phrase-map-context"

const AVANA_APY = 12
const FLUID_APY = 3.5
const MIN_MONTHS = 1
const MAX_MONTHS = 24
const DEFAULT_MONTHS = 12
const DEFAULT_DEPOSIT = "5000"

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

const integerFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
})

function parseDeposit(value: string) {
  const digitsOnly = value.replace(/[^\d]/g, "")
  if (!digitsOnly) {
    return 0
  }

  return Number(digitsOnly)
}

function calculateAccruedInterest(principal: number, apy: number, months: number) {
  if (principal <= 0) {
    return 0
  }

  const monthlyRate = apy / 100 / 12
  return principal * (Math.pow(1 + monthlyRate, months) - 1)
}

function formatDepositInput(value: string) {
  if (!value) {
    return ""
  }

  return integerFormatter.format(Number(value))
}

export default function InvestGrowthCalculatorSection() {
  const map = usePhraseMap()
  const t = (text: string) => lookupPhrase(map, text)
  const inputId = useId()
  const rangeId = useId()
  const [depositInput, setDepositInput] = useState(DEFAULT_DEPOSIT)
  const [months, setMonths] = useState(DEFAULT_MONTHS)

  const principal = parseDeposit(depositInput)

  const { avanaInterest, avanaTotal, fluidTotal } = useMemo(() => {
    const accruedAtAvana = calculateAccruedInterest(principal, AVANA_APY, months)
    const accruedAtFluid = calculateAccruedInterest(principal, FLUID_APY, months)

    return {
      avanaInterest: accruedAtAvana,
      avanaTotal: principal + accruedAtAvana,
      fluidTotal: principal + accruedAtFluid,
    }
  }, [months, principal])

  const thumbPosition = ((months - MIN_MONTHS) / (MAX_MONTHS - MIN_MONTHS)) * 100
  const depositInputDisplay = formatDepositInput(depositInput)
  const projectedValueDisplay = currencyFormatter.format(avanaTotal)
  const fluidValueDisplay = currencyFormatter.format(fluidTotal)
  const depositInputSize =
    depositInputDisplay.length > 13
      ? "text-[1.2rem] md:text-[1.5rem]"
      : "text-[1.5rem] md:text-[1.7rem]"
  const projectedValueSize =
    projectedValueDisplay.length > 18
      ? "text-[clamp(2.7rem,10vw,4.8rem)] md:text-[clamp(2.1rem,3.5vw,3.25rem)]"
      : projectedValueDisplay.length > 14
        ? "text-[clamp(2.2rem,5.8vw,4.35rem)] md:text-[clamp(2.3rem,4vw,3.9rem)]"
        : "text-[clamp(2.7rem,7vw,5.2rem)] md:text-[clamp(2.7rem,4.8vw,4.8rem)]"

  return (
    <section>
      <div className="space-y-6 lg:space-y-10">
        <div className="space-y-3">
          <SectionEyebrow tone="emerald">{t("See what time adds to your deposit")}</SectionEyebrow>
          <SectionTitle className="max-w-none">
            {t("Adjust the amount and duration to explore an illustrative return.")}
          </SectionTitle>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-10">
          <div className="space-y-6 lg:space-y-8 lg:pt-4">
            <div className="flex items-center justify-between gap-6 border-b border-border pb-4 lg:pb-6">
              <p className="text-sm font-semibold tracking-[-0.03em] text-type-tertiary">
                {t("Avana APY")}
              </p>
              <div className="inline-flex items-center rounded-full bg-[#01AACF]/10 px-4 py-2 text-[#01AACF] ring-1 ring-[#01AACF]/25">
                <span className="text-[1.15rem] font-semibold tracking-[-0.04em] md:text-[1.35rem]">
                  12.0%
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <label htmlFor={inputId} className="block text-[1.2rem] font-semibold tracking-[-0.03em] text-foreground">
                {t("Initial Deposit")}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[1.6rem] tracking-[-0.04em] text-type-secondary">
                  $
                </span>
                <input
                  id={inputId}
                  type="text"
                  inputMode="numeric"
                  value={depositInputDisplay}
                  onChange={(event) => setDepositInput(event.target.value.replace(/[^\d]/g, ""))}
                  className={`h-14 w-full rounded-[20px] border border-border bg-card pl-11 pr-5 tracking-[-0.05em] text-foreground outline-none transition focus:border-type-accent/50 md:h-16 ${depositInputSize}`}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <label htmlFor={rangeId} className="block text-[1.2rem] font-semibold tracking-[-0.03em] text-foreground">
                  {t("Time Period (months)")}
                </label>
                <p className="text-sm text-type-tertiary">
                  {months} {months === 1 ? t("month") : t("months")}
                </p>
              </div>

              <div className="relative px-1 pb-8 md:pb-10">
                <input
                  id={rangeId}
                  type="range"
                  min={MIN_MONTHS}
                  max={MAX_MONTHS}
                  value={months}
                  onChange={(event) => setMonths(Number(event.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-type-accent"
                />
                <div
                  className="absolute top-6 -translate-x-1/2 rounded-full border border-border bg-card px-3 py-1.5 text-center text-foreground shadow-sm md:top-8 md:px-4 md:py-2"
                  style={{ left: `calc(${thumbPosition}% * 0.96 + 2%)` }}
                >
                  <div className="text-[0.92rem] font-semibold leading-none tracking-[-0.03em] md:text-[1rem]">
                    {months} {t("months")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-card rounded-2xl p-5 md:p-8">
            <div className="space-y-5 md:space-y-7">
              <div className="sm:hidden">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#01AACF]/80">
                      {t("Projected Value")}
                    </p>
                    <p className="text-[2.35rem] whitespace-nowrap leading-[0.9] tracking-[-0.08em] text-[#01AACF]">
                      {projectedValueDisplay}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-type-tertiary">
                      {t("Avana Interest")}
                    </p>
                    <p className="text-[1.05rem] font-semibold tracking-[-0.04em] text-foreground">
                      {currencyFormatter.format(avanaInterest)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden space-y-4 sm:block">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#01AACF]/80">
                  {t("Projected Value")}
                </p>
                <p className={`${projectedValueSize} max-w-full whitespace-nowrap leading-[0.88] tracking-[-0.09em] text-[#01AACF]`}>
                  {projectedValueDisplay}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm text-type-tertiary">
                    {t("Avana Interest")}
                  </p>
                  <p className="text-[1.2rem] font-semibold tracking-[-0.04em] text-foreground">
                    {currencyFormatter.format(avanaInterest)}
                  </p>
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-4 border-t border-border pt-4 md:pt-5">
                <p className="text-sm font-medium text-type-tertiary">
                  {t("3.5% APY")}
                </p>
                <p className="text-[1.15rem] font-semibold tracking-[-0.04em] text-foreground md:text-[1.35rem]">
                  {fluidValueDisplay}
                </p>
              </div>

              <SandboxNotice />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
