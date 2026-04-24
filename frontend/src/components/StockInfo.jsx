import { useState } from "react";
import LivePrice from "./LivePrice";
import { fetchStock, fetchPrediction } from "../api/stockApi";

export default function StockInfo() {
    const [symbol, setSymbol] = useState("");
    const [data, setData] = useState(null);
    const [predictionData, setPredictionData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (!symbol) return;

        setLoading(true);
        setError("");
        setData(null);
        setPredictionData(null);

        try {
            // Fetch both stock and prediction concurrently from Python backend!
            const [stockInfo, predictionInfo] = await Promise.all([
                fetchStock(symbol),
                fetchPrediction(symbol).catch(e => null) // Suppress prediction error if it fails independently
            ]);

            setData(stockInfo);
            if (predictionInfo) {
                setPredictionData(predictionInfo.predictions);
            }
        } catch (err) {
            setError("Failed to fetch stock data. Ensure backend is running.");
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
            <h2>Stock Search</h2>

            <input
                type="text"
                placeholder="Enter stock symbol (AAPL, TCS.NS)"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
            />

            <button onClick={handleSearch} style={{ padding: "10px 20px" }}>
                Search
            </button>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {data && (
                <div style={{ marginTop: "20px", textAlign: "left", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
                    <h3>{data.name} ({data.symbol})</h3>
                    <p><strong>Current Price:</strong> ${data.price}</p>
                    <p><strong>Day High:</strong> ${data.dayHigh}</p>
                    <p><strong>Day Low:</strong> ${data.dayLow}</p>
                    <p><strong>Volume:</strong> {data.volume}</p>
                    <p><strong>Market Cap:</strong> {data.marketCap}</p>

                    <LivePrice symbol={symbol} />
                </div>
            )}

            {predictionData && predictionData.length > 0 && (
                <div style={{ marginTop: "20px", textAlign: "left", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                    <h3>🔮 7-Day Price Prediction</h3>
                    <p><em>Based on Linear Regression Model</em></p>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {predictionData.map((pred, i) => (
                            <li key={i} style={{ padding: "5px 0", borderBottom: "1px solid #eee" }}>
                                <strong>{pred.date}:</strong> <span style={{ color: "blue" }}>${pred.predictedPrice.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
