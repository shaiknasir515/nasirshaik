import React, { useContext, useState } from "react";
import { ThemeContext } from "../theme";
import axios from "axios";

export default function Topbar(){
  const { theme, setTheme } = useContext(ThemeContext);
  const [q, setQ] = useState("");
  const [suggest, setSuggest] = useState([]);

  async function searchName(){
    if(!q) return setSuggest([]);
    try{
      const res = await axios.get(`http://127.0.0.1:8000/search/${encodeURIComponent(q)}`);
      setSuggest(res.data.results || []);
    }catch(err){
      setSuggest([]);
    }
  }

  return (
    <div className="topbar">
      <div className="row">
        <div className="search">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search company name or symbol. e.g. TCS or tata" />
        </div>
        <button className="btn ghost" onClick={searchName}>Search</button>
      </div>

      <div className="row">
        <button className="btn ghost" onClick={()=>setTheme(theme==="light"?"dark":"light")}>
          {theme==="light" ? "Dark" : "Light"}
        </button>
      </div>
    </div>
  );
}
