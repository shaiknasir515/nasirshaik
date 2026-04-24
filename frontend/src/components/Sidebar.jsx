import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar(){
  return (
    <aside className="sidebar">
      <div style={{marginBottom:24}}>
        <h2 style={{margin:0, fontSize:20}}>⚡ Stock Dashboard</h2>
        <div className="muted" style={{marginTop:6}}>Groww-style UI (student project)</div>
      </div>

      <nav>
        <div style={{marginBottom:12}}>
          <Link to="/" className="link">Dashboard</Link>
        </div>

        <div style={{marginTop:18}}>
          <div className="muted" style={{fontSize:13}}>Quick Links</div>
          <ul style={{paddingLeft:16}}>
            <li><a className="link" href="http://127.0.0.1:8000/trending" target="_blank" rel="noreferrer">Trending (API)</a></li>
            <li><a className="link" href="http://127.0.0.1:8000/docs" target="_blank" rel="noreferrer">Backend Docs</a></li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
