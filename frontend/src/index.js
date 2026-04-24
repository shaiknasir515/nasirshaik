const searchInput = document.getElementById("search");
const suggestions = document.getElementById("suggestions");
const output = document.getElementById("output");
const searchBtn = document.getElementById("searchBtn");

// 🔍 Autocomplete
searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();

  if (!query) {
    suggestions.innerHTML = "";
    return;
  }

  try {
    const res = await fetch(`http://127.0.0.1:8000/search?q=${query}`);
    const data = await res.json();

    suggestions.innerHTML = "";

    data.forEach(stock => {
      const li = document.createElement("li");
      li.textContent = `${stock.name} (${stock.symbol})`;

      li.onclick = () => loadStock(stock.symbol);

      suggestions.appendChild(li);
    });
  } catch (err) {
    console.error("Search error:", err);
  }
});

// 🔘 Search button click
searchBtn.addEventListener("click", () => {
  const symbol = searchInput.value.trim();
  if (symbol) {
    loadStock(symbol);
  }
});

// 📈 Load stock data
async function loadStock(symbol) {
  suggestions.innerHTML = "";
  output.innerHTML = "Loading...";

  try {
    const res = await fetch(`http://127.0.0.1:8000/stock/${symbol}`);
    const data = await res.json();

    output.innerHTML = `
      <div style="border:1px solid #ccc; padding:20px; width:400px;">
        <h2>${data.name}</h2>
        <p><b>Symbol:</b> ${data.symbol}</p>
        <p><b>Price:</b> ₹${data.price ?? "N/A"}</p>
        <p><b>Day High:</b> ₹${data.dayHigh ?? "N/A"}</p>
        <p><b>Day Low:</b> ₹${data.dayLow ?? "N/A"}</p>
        <p><b>Market Cap:</b> ${data.marketCap ?? "N/A"}</p>
        <p><b>P/E Ratio:</b> ${data.peRatio ?? "N/A"}</p>
        <p><b>P/B Ratio:</b> ${data.pbRatio ?? "N/A"}</p>
        <p><b>EPS:</b> ${data.eps ?? "N/A"}</p>
        <p><b>ROE:</b> ${data.roe ?? "N/A"}</p>
        <p><b>Debt/Equity:</b> ${data.debtToEquity ?? "N/A"}</p>
        <p><b>Dividend Yield:</b> ${data.dividendYield ?? "N/A"}</p>
        <p><b>Book Value:</b> ${data.bookValue ?? "N/A"}</p>
      </div>
    `;
  } catch (err) {
    alert("Error loading stock data");
    output.innerHTML = "";
  }
}
