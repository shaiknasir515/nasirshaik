import requests
from bs4 import BeautifulSoup

def get_shareholding(symbol):
    try:
        url = f"https://www.screener.in/company/{symbol}/consolidated/"
        page = requests.get(url)
        soup = BeautifulSoup(page.text, "html.parser")

        table = soup.find("table", {"id": "shareholding"})

        if table is None:
            return {"error": "Shareholding pattern not found"}

        headers = [th.text.strip() for th in table.find_all("th")]
        rows = []

        for tr in table.find_all("tr")[1:]:
            cols = [td.text.strip() for td in tr.find_all("td")]
            if cols:
                rows.append(dict(zip(headers, cols)))

        return rows
    except:
        return {"error": "Failed to fetch shareholding pattern"}
