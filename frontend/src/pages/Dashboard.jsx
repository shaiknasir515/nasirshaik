import React, { useEffect, useState } from "react";
import axios from "axios";
import StockCard from "../components/StockCard";
import { Link } from "react-router-dom";

export default function Dashboard(){
  // list you want to show by default
  const defaultSymbols = ["RELIANCE.NS","TCS.NS","HDFCBANK.NS","INFY.NS","TATAMOTORS.NS"];
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function load(){
      setLoading(true);
      const results = [];
      for (let s of defaultSymbols){
        try{
          const res = await axios.get(`http://127.0.0.1:8000/stock/${encodeURIComponent(s)}`);
          // res.data.data contains values
          results.push({symbol: s, data: res.data.data});
        }catch(err){
          results.push({symbol: s, data: null});
        }
      }
      setStocks(results);
      setLoading(false);
    }
    load();
  },[]);

  return (
    <div>
      <h1 style={{marginBottom:14}}>Dashboard</h1>
      <div className="grid">
        {loading ? <div className="card">Loading...</div> : stocks.map(s => (
          <Link key={s.symbol} to={`/stock/${encodeURIComponent(s.symbol)}`} style={{textDecoration:"none"}}>
            <StockCard symbol={s.symbol} data={s.data} />
          </Link>
        ))}
      </div>
    </div>
  );
}
