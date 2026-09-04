import type { AppLocale } from "@/i18n/locales"
import ProductFeatureScrollSection from "@/components/product-feature-scroll-section"
import { withMarketingI18n } from "@/lib/content-i18n/with-marketing-i18n"

const safetyFeatures = [
  {
    title: "Safe Zone",
    description:
      "Health Factor > 1.5. Borrow usage stays within capacity, fees keep accruing, and your LP stays intact.",
  },
  {
    title: "Warning Zone",
    description:
      "Health Factor 1.0-1.5. You get notified to repay debt, add collateral, or let automation cut exposure.",
  },
  {
    title: "Liquidation",
    description:
      "Health Factor < 1.0. Fees apply first, needed LP principal unwinds, and residual value returns to you.",
  },
] as const

export default async function PositionSafetySection({ locale }: { locale: AppLocale }) {
  return withMarketingI18n(locale, ['position-safety-section'], (
    <ProductFeatureScrollSection
      locale={locale}
      eyebrow="Position Safety"
      eyebrowTone="violet"
      title="Every health state, fully explained"
      description="Track health, warning, and liquidation states before an LP-backed loan needs action."
      items={safetyFeatures}
      panels={[
        /* Safe Zone — dashboard card with healthy ring + chart */
        <div key="s1" className="relative h-[18rem] w-full overflow-hidden rounded-[22px] border border-gray-200 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.05),transparent_55%)]" />
          <div className="absolute inset-0 flex items-center justify-center p-5">
            <div className="w-full max-w-[15.75rem] rounded-[20px] border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-medium uppercase tracking-[0.12em] text-gray-400">Position health</span>
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-400 panel-pulse" /><span className="text-[8px] font-semibold text-emerald-600">Safe zone</span></div>
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className="relative flex h-[68px] w-[68px] shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90 panel-ring" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#d1fae5" strokeWidth="7" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round" strokeDasharray="238.76" strokeDashoffset="35.81" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="h-[1.1rem] overflow-hidden"><div className="panel-ticker-v-fast">{["1.82","1.85","1.80","1.82"].map((v,i) => (<div key={i} className="flex h-[1.1rem] items-center justify-center"><span className="text-[1rem] font-semibold tabular-nums text-emerald-600">{v}</span></div>))}</div></div>
                  </div>
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  {[{l:"Usage",v:"64%",w:64,c:"bg-emerald-400"},{l:"Buffer",v:"36%",w:36,c:"bg-emerald-200"}].map(m => (
                    <div key={m.l}>
                      <div className="flex items-center justify-between"><span className="text-[8px] font-medium text-gray-400">{m.l}</span><span className="text-[10px] font-semibold tabular-nums text-emerald-600">{m.v}</span></div>
                      <div className="mt-1 h-[4px] overflow-hidden rounded-full bg-gray-100"><div className={`h-full rounded-full ${m.c}`} style={{ width: `${m.w}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative mt-3 h-[52px] w-full overflow-hidden rounded-xl border border-emerald-100/60 bg-[linear-gradient(180deg,#f8fffb_0%,#effcf5_100%)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.10),transparent_60%)]" />
                <div className="absolute inset-x-3 inset-y-0"><div className="absolute left-0 right-0 top-[33%] border-t border-emerald-100/50" /><div className="absolute left-0 right-0 top-[66%] border-t border-emerald-100/40" /></div>
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 52" preserveAspectRatio="none">
                  <defs><linearGradient id="sz-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity="0.18" /><stop offset="100%" stopColor="#10b981" stopOpacity="0" /></linearGradient></defs>
                  <path d="M0,32 C40,30 80,26 120,22 S200,20 240,18 L300,16 L300,52 L0,52Z" fill="url(#sz-g)" />
                  <path d="M0,32 C40,30 80,26 120,22 S200,20 240,18 L300,16" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <div className="absolute bottom-1 right-2 text-[7px] font-medium text-emerald-500">fees accruing</div>
              </div>
            </div>
          </div>
        </div>,
        /* Warning Zone — amber dashboard with action options */
        <div key="s2" className="relative h-[18rem] w-full overflow-hidden rounded-[22px] border border-gray-200 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.05),transparent_55%)]" />
          <div className="absolute inset-0 flex items-center justify-center p-5">
            <div className="w-full max-w-[15.75rem] rounded-[20px] border border-amber-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-medium uppercase tracking-[0.12em] text-gray-400">Position health</span>
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-amber-400 panel-pulse" /><span className="text-[8px] font-semibold text-amber-600">Warning</span></div>
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className="relative flex h-[68px] w-[68px] shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90 panel-ring" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#fef3c7" strokeWidth="7" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" strokeDasharray="238.76" strokeDashoffset="95.5" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="h-[1.1rem] overflow-hidden"><div className="panel-ticker-v-fast" style={{ animationDuration: "5s" }}>{["1.22","1.18","1.25","1.22"].map((v,i) => (<div key={i} className="flex h-[1.1rem] items-center justify-center"><span className="text-[1rem] font-semibold tabular-nums text-amber-500">{v}</span></div>))}</div></div>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[8px] font-medium text-gray-400">Threshold</div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 h-2 overflow-hidden rounded-full bg-amber-100">
                      <div className="h-full w-[82%] rounded-full bg-amber-400 panel-bar-pulse" style={{ animationDuration: "2s" }} />
                    </div>
                    <span className="text-[10px] font-semibold tabular-nums text-amber-600">82%</span>
                  </div>
                  <p className="mt-1.5 text-[8px] text-amber-500">Approaching liquidation</p>
                </div>
              </div>
              <div className="mt-3 border-t border-amber-100 pt-3">
                <span className="text-[8px] font-medium uppercase tracking-[0.1em] text-gray-400">Available actions</span>
                <div className="mt-2 space-y-1.5">
                  {[
                    { l: "Repay debt", sub: "Reduce borrow balance", c: "border-amber-200 bg-amber-50" },
                    { l: "Add collateral", sub: "Increase health factor", c: "border-amber-200 bg-amber-50" },
                    { l: "Auto-reduce", sub: "Automated deleveraging", c: "border-gray-200 bg-gray-50" },
                  ].map((a) => (
                    <div key={a.l} className={`flex items-center justify-between rounded-lg border px-3 py-1.5 ${a.c}`}>
                      <div><span className="block text-[10px] font-medium text-[#18323c]">{a.l}</span><span className="text-[7px] text-gray-400">{a.sub}</span></div>
                      <svg width="12" height="12" viewBox="0 0 16 16" className="text-gray-400"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>,
        /* Liquidation — decline chart with waterfall breakdown */
        <div key="s3" className="relative h-[18rem] w-full overflow-hidden rounded-[22px] border border-gray-200 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(244,63,94,0.05),transparent_55%)]" />
          <div className="absolute inset-0 flex items-center justify-center p-5">
            <div className="w-full max-w-[15.75rem] rounded-[20px] border border-rose-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-medium uppercase tracking-[0.12em] text-gray-400">Liquidation</span>
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-rose-400 panel-pulse" /><span className="text-[8px] font-semibold text-rose-500">HF &lt; 1.0</span></div>
              </div>
              <div className="relative mt-3 h-[60px] w-full overflow-hidden rounded-xl border border-rose-100/60 bg-[linear-gradient(180deg,#fff5f5_0%,#fff1f2_100%)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.08),transparent_60%)]" />
                <div className="absolute inset-x-3 inset-y-0"><div className="absolute left-0 right-0 top-[33%] border-t border-rose-100/50" /><div className="absolute left-0 right-0 top-[66%] border-t border-rose-100/40" /></div>
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 60" preserveAspectRatio="none">
                  <defs><linearGradient id="lq-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f43f5e" stopOpacity="0.14" /><stop offset="100%" stopColor="#f43f5e" stopOpacity="0" /></linearGradient></defs>
                  <path d="M0,12 C40,16 80,22 120,30 S200,44 260,50 L300,54 L300,60 L0,60Z" fill="url(#lq-g)" />
                  <path d="M0,12 C40,16 80,22 120,30 S200,44 260,50 L300,54" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                  <path d="M0,48 L300,48" fill="none" stroke="#fda4af" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
                </svg>
              </div>
              <div className="mt-3">
                <span className="text-[8px] font-medium uppercase tracking-[0.1em] text-gray-400">Sequence</span>
                <div className="mt-2 flex items-center gap-1.5">
                  {[
                    { step: "1", l: "Fees applied", c: "border-emerald-200 bg-emerald-50 text-emerald-700" },
                    { step: "2", l: "LP unwound", c: "border-amber-200 bg-amber-50 text-amber-700" },
                    { step: "3", l: "Residual returned", c: "border-gray-200 bg-gray-50 text-gray-700" },
                  ].map((s, i) => (
                    <div key={s.step} className="flex flex-1 flex-col items-center">
                      <div className={`flex w-full items-center justify-center gap-1 rounded-lg border px-1 py-1.5 ${s.c}`}>
                        <span className="text-[8px] font-semibold">{s.step}</span>
                        <span className="text-[8px] font-medium">{s.l}</span>
                      </div>
                      {i < 2 && <svg width="12" height="8" viewBox="0 0 12 8" className="mt-0.5 text-gray-300"><path d="M6 1v5M3 4l3 3 3-3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" /></svg>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 border-t border-rose-100 pt-2">
                <p className="text-center text-[8px] font-medium text-gray-400">Only the principal needed is unwound</p>
              </div>
            </div>
          </div>
        </div>,
      ]}
    />
  ))
}
