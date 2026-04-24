import React, { useState, useEffect } from "react";
import axios from "axios";
import ChartBox from "../components/ChartBox";
import { useParams, Link } from "react-router-dom";

const RANGES = [
  {key:"5d", label:"5D", period:"5d", interval:"30m"},
  {key:"1mo", label:"1M", period:"1mo", interval:"1d"},
  {key:"3mo", label:"3M", period:"3mo", interval:"1d"},
  {key:"6mo", label:"6M", period:"6mo", interval:"1d"},
  {key:"1y", label:"1Y", period:"1y", interval:"1d"},
  {key:"5y", label:"5Y", period:"5y", interval:"1wk"}
];

export default function StockDetails(){
  const { symbol } = useParams();
  const [range, setRange] = useState(RANGES[1]);
  const [series, setSeries] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latest, setLatest] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(()=>{
    fetchHistory();
    // eslint-disable-next-line
  }, [symbol, range]);

  async function fetchHistory(){
    setLoading(true); setErr(null);
    try{
      const res = await axios.get(`http://127.0.0.1:8000/stock/${encodeURIComponent(symbol)}/history`, {
        params: { period: range.period, interval: range.interval }
      });
      const data = res.data.data || [];
      const chart = data.map(d => ({ date: d.date.split("T")[0], price: d.close, open:d.open, high:d.high, low:d.low, volume:d.volume }));
      setSeries(chart);
      setMeta({symbol:res.data.symbol, period:res.data.period});
      if (chart.length) setLatest(chart[chart.length-1]);
    }catch(e){
      setErr(e?.response?.data?.detail || e.message);
      setSeries([]);
      setLatest(null);
    }finally{ setLoading(false); }
  }

  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
        <div>
          <h2 style={{margin:0}}>{symbol}</h2>
          <div className="muted">{meta?.period}</div>
        </div>
        <div className="row">
          <Link to="/" className="btn ghost">Back</Link>
          {RANGES.map(r => (
            <button key={r.key} onClick={()=>setRange(r)} className={`btn ${r.key===range.key?"":"ghost"}`} style={{marginLeft:8}}>{r.label}</button>
          ))}
        </div>
      </div>

      {loading && <div className="card">Loading history...</div>}
      {err && <div className="card" style={{background:"#fee2e2", color:"#991b1b"}}>{err}</div>}

      {!loading && !err && (
        <>
          <div style={{display:"grid", gridTemplateColumns:"2fr 1fr", gap:16, marginBottom:16}}>
            <ChartBox data={series} />
            <div className="card">
              <h3>Latest</h3>
              {latest ? (
                <>
                  <p>Close: ₹{latest.price}</p>
                  <p>High: ₹{latest.high}</p>
                  <p>Low: ₹{latest.low}</p>
                  <p>Volume: {latest.volume}</p>
                </>
              ) : <p>No data</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
