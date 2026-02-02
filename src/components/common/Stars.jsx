// ─────────────────────────────────────────────────────────────────────────────
// SHARED: STARS
// ─────────────────────────────────────────────────────────────────────────────
export function Stars({ value }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(n => <span key={n} className={`star ${(value || 0) >= n ? "filled" : ""}`}>★</span>)}
    </div>
  );
}
