const express = require("express");
const cors = require("cors");
const yahooFinance = require("yahoo-finance2").default;

const app = express();
const PORT = 5000;

app.use(cors());

/* -------------------- SIMPLE IN-MEMORY CACHE -------------------- */
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function formatSymbol(symbol) {
  symbol = symbol.toUpperCase().trim();

  // Add NSE suffix if not present
  if (!symbol.endsWith(".NS")) {
    symbol = symbol + ".NS";
  }

  return symbol;
}

async function getStockData(symbol) {
  // Return cached data if available
  if (cache.has(symbol)) {
    return cache.get(symbol);
  }

  // Small delay to avoid Yahoo blocking
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const data = await yahooFinance.quote(symbol);

  // Cache the result
  cache.set(symbol, data);

  // Auto-expire cache
  setTimeout(() => cache.delete(symbol), CACHE_DURATION);

  return data;
}

/* -------------------- API ROUTE -------------------- */
app.get("/stock/:symbol", async (req, res) => {
  try {
    const rawSymbol = req.params.symbol;
    const symbol = formatSymbol(rawSymbol);

    const quote = await getStockData(symbol);

    if (!quote || !quote.regularMarketPrice) {
      return res.status(404).json({ error: "Stock not found" });
    }

    res.json({
      symbol: quote.symbol,
      name: quote.longName || quote.shortName || "N/A",
      currentPrice: quote.regularMarketPrice,
      dayHigh: quote.regularMarketDayHigh,
      dayLow: quote.regularMarketDayLow,
      previousClose: quote.regularMarketPreviousClose,
      volume: quote.regularMarketVolume,
      marketCap: quote.marketCap,
      peRatio: quote.trailingPE,
      high52: quote.fiftyTwoWeekHigh,
      low52: quote.fiftyTwoWeekLow,
    });
  } catch (error) {
    console.error("Yahoo API error:", error.message);

    if (error.message.includes("Too Many Requests")) {
      return res
        .status(429)
        .json({ error: "Rate limit exceeded. Please try again later." });
    }

    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});
app.get("/predict/:symbol", async (req, res) => {
  try {
    const symbol = formatSymbol(req.params.symbol);

    const history = await yahooFinance.historical(symbol, {
      period1: "2023-01-01",
      interval: "1d",
    });

    if (!history || history.length < 5) {
      return res.status(400).json({ error: "Not enough data" });
    }

    // Simple Moving Average (last 5 days)
    const last5 = history.slice(-5);
    const avg =
      last5.reduce((sum, day) => sum + day.close, 0) / last5.length;

    res.json({
      symbol,
      predictedPrice: avg.toFixed(2),
      method: "5-Day Moving Average",
    });
  } catch (err) {
    res.status(500).json({ error: "Prediction failed" });
  }
});

/* -------------------- START SERVER -------------------- */
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
