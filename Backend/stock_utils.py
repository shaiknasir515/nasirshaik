import yfinance as yf

async def get_overview(symbol: str):
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info

        return {
            "symbol": symbol,
            "current_price": info.get("currentPrice"),
            "market_cap": info.get("marketCap"),
            "pe_ratio": info.get("trailingPE"),
            "52_week_high": info.get("fiftyTwoWeekHigh"),
            "52_week_low": info.get("fiftyTwoWeekLow"),
        }
    except Exception as e:
        return {"error": str(e)}


async def get_fundamentals(symbol: str):
    try:
        ticker = yf.Ticker(symbol)
        balance_sheet = ticker.balance_sheet
        financials = ticker.financials

        return {
            "balance_sheet": str(balance_sheet),
            "financials": str(financials)
        }
    except Exception as e:
        return {"error": str(e)}
