const searchInput = document.getElementById("search");
const suggestions = document.getElementById("suggestions");

const nameEl = document.getElementById("stock-name");
const priceEl = document.getElementById("stock-price");
const detailsEl = document.getElementById("stock-card");

searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();
  if (query.length < 1) {
    suggestions.innerHTML = "";
    return;
  }

  const res = await fetch(`http://127.0.0.1:8000/search?q=${query}`);
  const data = await res.json();

  suggestions.innerHTML = "";

  data.forEach(stock => {
    const li = document.createElement("li");
    li.textContent = `${stock.name} (${stock.symbol})`;
    li.onclick = () => loadStock(stock.symbol);
    suggestions.appendChild(li);
  });
});

async function loadStock(symbol) {
  suggestions.innerHTML = "";
  searchInput.value = symbol;

  try {
    const res = await fetch(`http://127.0.0.1:8000/stock/${symbol}`);
    const data = await res.json();

    nameEl.textContent = `${data.name} (${data.symbol})`;
    priceEl.textContent = `₹ ${data.price}`;

    detailsEl.innerHTML = `
      <p><b>Day High:</b> ₹${data.dayHigh}</p>
      <p><b>Day Low:</b> ₹${data.dayLow}</p>
      <p><b>Previous Close:</b> ₹${data.previousClose}</p>
      <p><b>Volume:</b> ${data.volume}</p>
      <p><b>Market Cap:</b> ${data.marketCap}</p>
      <p><b>P/E Ratio:</b> ${data.peRatio}</p>
    `;
  } catch (err) {
    alert("Failed to load stock data");
  }
}
