import Image from "next/image"
import { getTokenIconSrc } from "@/lib/token-icons"

/**
 * BorrowAgainstLP — one compact, static card for "Borrow against LP positions
 * while your liquidity stays active in the underlying AMM." The GHO/AAVE LP
 * pair is the collateral (still earning fees) and a GHO borrow is drawn
 * against it. Fills the media area so there is no dead space.
 */
export function BorrowAgainstLP() {
  const gho = getTokenIconSrc("GHO")
  const aave = getTokenIconSrc("AAVE")

  return (
    <div className="bal-card" aria-hidden="true">
      <div className="bal-head">
        <span className="bal-pair">
          {gho ? (
            <Image className="bal-coin" src={gho} alt="" width={48} height={48} loading="lazy" />
          ) : null}
          {aave ? (
            <Image className="bal-coin bal-coin-2" src={aave} alt="" width={48} height={48} loading="lazy" />
          ) : null}
        </span>
        <span className="bal-names">
          <span className="bal-name">GHO / AAVE</span>
          <span className="bal-meta">LP collateral · earning fees</span>
        </span>
      </div>

      <div className="bal-main">
        <span className="bal-label">Borrow against your LP</span>
        <span className="bal-amount">
          7,500<small>GHO</small>
        </span>
      </div>

      <div className="bal-usage">
        <span className="bal-usage-head">
          <span className="bal-label">Borrow used</span>
          <span className="bal-label bal-used">49%</span>
        </span>
        <span className="bal-bar">
          <span className="bal-bar-fill" />
        </span>
      </div>

      <style>{`
        .bal-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 12px;
          height: 100%;
          width: 100%;
          max-width: 380px;
          margin: 0 auto;
          padding: 6px 8px;
          color: #0f1518;
        }
        .bal-head { display: flex; align-items: center; gap: 11px; }
        .bal-pair { position: relative; display: inline-flex; flex: none; align-items: center; }
        .bal-coin { width: 48px; height: 48px; border-radius: 9999px; display: block; }
        .bal-coin-2 { margin-left: -13px; }
        .bal-names { display: flex; flex-direction: column; min-width: 0; gap: 2px; }
        .bal-name { font-size: 0.9375rem; font-weight: 600; line-height: 1.2; }
        .bal-meta { font-size: 0.72rem; color: #73726c; line-height: 1.2; }
        .bal-main { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
        .bal-label { font-size: 0.72rem; color: #73726c; line-height: 1.15; }
        .bal-green { color: #16a34a; }
        .bal-used { color: #0f1518; font-weight: 600; }
        .bal-amount {
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1;
          letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums;
          display: inline-flex;
          align-items: baseline;
          gap: 5px;
        }
        .bal-amount small { font-size: 0.75rem; font-weight: 600; color: #73726c; }
        .bal-usage-head { display: flex; align-items: center; justify-content: space-between; }
        .bal-bar {
          display: block;
          height: 7px;
          border-radius: 9999px;
          background: #eef0f1;
          overflow: hidden;
          margin-top: 7px;
        }
        .bal-bar-fill {
          display: block;
          height: 100%;
          width: 49%;
          border-radius: 9999px;
          background: #01aacf;
        }
      `}</style>
    </div>
  )
}

export default BorrowAgainstLP
