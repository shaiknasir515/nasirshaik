from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import yfinance as yf
import numpy as np
from stocks import STOCKS

app = FastAPI(title="Real Stock API", version="2.0")

# 🔓 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔧 Helper: NSE symbol normalize
def normalize_symbol(symbol: str):
    symbol = symbol.upper()
    if not symbol.endswith(".NS"):
        symbol += ".NS"
    return symbol

# ✅ ROOT
@app.get("/")
def root():
    return {"status": "Real Stock API running 🚀"}

# 🔍 SEARCH API (Autocomplete)
@app.get("/search")
def search_stock(q: str = Query(..., min_length=1)):
    q = q.lower()
    results = [
        stock for stock in STOCKS
        if q in stock["name"].lower() or q in stock["symbol"].lower()
    ]
    return results[:10]

# 📈 STOCK DETAILS (REAL DATA)
@app.get("/stock/{symbol}")
def get_stock(symbol: str):
    try:
        symbol = normalize_symbol(symbol)
        stock = yf.Ticker(symbol)

        info = stock.info
        hist = stock.history(period="1d")

        if hist.empty:
            raise HTTPException(status_code=404, detail="Stock data not found")

        price = round(hist["Close"].iloc[-1], 2)

        return {
            "symbol": symbol.replace(".NS", ""),
            "name": info.get("longName", "N/A"),
            "price": price,
            "dayHigh": info.get("dayHigh"),
            "dayLow": info.get("dayLow"),
            "previousClose": info.get("previousClose"),
            "volume": info.get("volume"),
            "marketCap": info.get("marketCap"),
            "peRatio": info.get("trailingPE"),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 📊 STOCK HISTORY (30 DAYS)
@app.get("/history/{symbol}")
def get_history(symbol: str):
    try:
        symbol = normalize_symbol(symbol)
        stock = yf.Ticker(symbol)

        end = datetime.now()
        start = end - timedelta(days=30)

        hist = stock.history(start=start, end=end)

        if hist.empty:
            raise HTTPException(status_code=404, detail="No historical data")

        return [
            {
                "date": date.strftime("%Y-%m-%d"),
                "price": round(row["Close"], 2)
            }
            for date, row in hist.iterrows()
        ]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 🔮 STOCK PREDICTION (7 DAYS)
@app.get("/predict/{symbol}")
def predict_stock(symbol: str):
    try:
        symbol = normalize_symbol(symbol)
        stock = yf.Ticker(symbol)
        
        # Get last 60 days to train
        hist = stock.history(period="60d")
        if hist.empty or len(hist) < 10:
            raise HTTPException(status_code=400, detail="Not enough data for prediction")
            
        # Use closing prices
        prices = hist["Close"].values
        days = np.arange(len(prices))
        
        # Simple Linear Regression using numpy
        slope, intercept = np.polyfit(days, prices, 1)
        
        # Predict next 7 days
        future_days = np.arange(len(prices), len(prices) + 7)
        predicted_prices = slope * future_days + intercept
        
        # Return structured prediction
        predictions = []
        last_date = hist.index[-1]
        for i in range(7):
            pred_date = last_date + timedelta(days=i+1)
            # Skip weekends (simplified)
            while pred_date.weekday() >= 5:
                pred_date += timedelta(days=1)
                
            predictions.append({
                "date": pred_date.strftime("%Y-%m-%d"),
                "predictedPrice": round(max(0, predicted_prices[i]), 2) # Ensure no negative prices
            })
            
        return {
            "symbol": symbol.replace(".NS", ""),
            "method": "Linear Regression",
            "currentPrice": round(prices[-1], 2),
            "predictions": predictions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

