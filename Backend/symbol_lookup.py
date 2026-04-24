import requests
from rapidfuzz import fuzz, process

def yahoo_search(query: str):
    """Search Yahoo Finance autocomplete API"""
    url = "https://query1.finance.yahoo.com/v1/finance/search"
    params = {"q": query, "quotesCount": 10, "newsCount": 0}
    
    try:
        response = requests.get(url, params=params)
        return response.json()
    except:
        return None


def get_best_symbol(query: str):
    """
    Advanced fuzzy matching & symbol selection
    """
    data = yahoo_search(query)

    if not data or "quotes" not in data:
        return None

    quotes = data["quotes"]

    # Extract only Indian market symbols
    indian = [
        q for q in quotes
        if q.get("exchange") in ["NSE", "BSE"]
    ]

    if not indian:
        return None

    # Fuzzy match by company name
    choices = {item["shortname"]: item["symbol"] for item in indian if "shortname" in item}

    best_match = process.extractOne(query, choices.keys(), scorer=fuzz.WRatio)

    if best_match and best_match[1] >= 60:  # 60% match threshold
        best_name = best_match[0]
        return choices[best_name]

    return None


def get_top_suggestions(query: str):
    """
    Returns up to 5 close matches for user suggestions.
    """
    data = yahoo_search(query)

    if not data or "quotes" not in data:
        return []

    quotes = data["quotes"]

    indian = [
        q for q in quotes
        if q.get("exchange") in ["NSE", "BSE"]
    ]

    suggestions = []
    for q in indian[:5]:
        suggestions.append({
            "name": q.get("shortname"),
            "symbol": q.get("symbol"),
            "exchange": q.get("exchange"),
        })

    return suggestions
