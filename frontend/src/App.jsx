import { useState } from "react";
import { fetchStock } from "./api/stockApi";

function App() {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setError("");
    setData(null);
    setLoading(true);

    if (!symbol) return;

    let formattedSymbol = symbol.toUpperCase();
    if (!formattedSymbol.endsWith(".NS")) {
      formattedSymbol += ".NS";
    }

    try {
      const result = await fetchStock(formattedSymbol);
      setData(result);
    } catch (err) {
      setError("Failed to fetch stock data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>📈 Stock Analyzer</h1>

      <input
        type="text"
        placeholder="Enter stock (TCS, SBIN, INFY)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />

      <button onClick={handleSearch} style={{ marginLeft: "10px" }}>
        Search
      </button>

      {loading && <p>⏳ Loading stock data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div style={{ marginTop: "20px", background: "#f4f4f4", padding: "20px" }}>
          <h2>{data.name}</h2>
          <p><b>Price:</b> ₹{data.price}</p>
          <p><b>Market Cap:</b> {data.marketCap}</p>
          <p><b>P/E Ratio:</b> {data.peRatio}</p>
          <p><b>52W High:</b> ₹{data.high52}</p>
          <p><b>52W Low:</b> ₹{data.low52}</p>
        </div>
      )}
    </div>
  );
}

export default App;
