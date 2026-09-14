export function BorrowingLimitMock() {
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-[28rem] overflow-hidden rounded-[1.5rem] border border-black/10 bg-[#f7fafb] p-4 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-5"
    >
      <div className="flex items-center justify-between border-b border-black/10 pb-4">
        <div>
          <div className="h-2.5 w-24 rounded-full bg-black/15" />
          <div className="mt-2 h-2 w-36 rounded-full bg-black/8" />
        </div>
        <span className="rounded-full bg-[#dff8fb] px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-[#008aa6]">
          Live
        </span>
      </div>

      <div className="mt-5 rounded-xl bg-white p-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="h-2 w-28 rounded-full bg-black/10" />
            <div className="mt-3 h-9 w-36 rounded-lg bg-black/80" />
          </div>
          <div className="h-12 w-12 rounded-full border-[5px] border-[#01aacf]/25 border-t-[#01aacf]" />
        </div>
        <div className="mt-5 h-2 rounded-full bg-[#e8f1f3]">
          <div className="h-2 w-[68%] rounded-full bg-[#01aacf]" />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {[
          ["LP value", "Verified"],
          ["Risk band", "Pool-aware"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-white p-3.5">
            <div className="h-2 w-16 rounded-full bg-black/10" />
            <div className="mt-3 h-2.5 w-20 rounded-full bg-black/65" />
            <div className="mt-2 h-2 w-14 rounded-full bg-[#01aacf]/50" />
            <span className="sr-only">{label}: {value}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-[#01aacf]/20 bg-[#effbfd] px-3.5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#01aacf]" />
          <div className="h-2 w-28 rounded-full bg-[#01aacf]/35" />
        </div>
        <div className="h-2 w-14 rounded-full bg-[#01aacf]/55" />
      </div>
    </div>
  )
}
