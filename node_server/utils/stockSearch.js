// utils/stockSearch.js

const stockList = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" }
];

function searchStocks(query) {
  query = query.toUpperCase();
  return stockList.filter(
    (s) =>
      s.symbol.includes(query) ||
      s.name.toUpperCase().includes(query)
  );
}

module.exports = { searchStocks };
