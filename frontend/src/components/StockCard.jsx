import React from "react";

export default function StockCard({ symbol, data }) {
  const d = data || {};
  return (
    <div className="card">
      <h3>{symbol}</h3>
      <div className="price">₹{d.current_price ?? "—"}</div>
      <div className="sub muted">Open: {d.open ?? "—"} · High: {d.high ?? "—"}</div>
      <div style={{marginTop:10}} className="muted">Vol: {d.volume ?? "—"}</div>
    </div>
  );
}
