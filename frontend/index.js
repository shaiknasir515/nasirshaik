const API_BASE = "http://127.0.0.1:8000";

// ===== ELEMENTS =====
const singleStockInput = document.getElementById("singleStock");
const searchBtn = document.getElementById("searchBtn");
const compareBtn = document.getElementById("compareBtn");

const leftCard = document.getElementById("leftCard");
const rightCard = document.getElementById("rightCard");

const ctx = document.getElementById("priceChart").getContext("2d");
let priceChart;

// ===== HELPERS =====
function formatSymbol(symbol) {
  return symbol.toUpperCase(); // REMOVE .NS FOR NOW
}


async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("API error");
  return res.json();
}

function renderCard(card, data) {
  card.innerHTML = `
    <h2>${data.name}</h2>
    <p><b>Symbol:</b> ${data.symbol}</p>
    <p><b>Price:</b> ₹${data.price}</p>
    <p><b>High:</b> ₹${data.dayHigh}</p>
    <p><b>Low:</b> ₹${data.dayLow}</p>
    <p><b>Market Cap:</b> ${data.marketCap}</p>
    <p><b>P/E:</b> ${data.peRatio}</p>
  `;
}

// ===== SEARCH SINGLE STOCK =====
searchBtn.addEventListener("click", async () => {
  const symbol = formatSymbol(singleStockInput.value.trim());
  if (!symbol) return alert("Enter stock name");

  try {
    const info = await fetchJSON(`${API_BASE}/stock/${symbol}`);
    const history = await fetchJSON(`${API_BASE}/history/${symbol}`);

    renderCard(leftCard, info);
    rightCard.innerHTML = "";

    if (priceChart) priceChart.destroy();

    priceChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: history.map(d => d.date),
        datasets: [{
          label: symbol,
          data: history.map(d => d.price),
          borderWidth: 2,
          tension: 0.3
        }]
      }
    });
  } catch (err) {
    alert("Stock not found");
    console.error(err);
  }
});

// ===== COMPARE MODE (TEMP: SAME INPUT USED TWICE) =====
compareBtn.addEventListener("click", async () => {
  const s1 = prompt("Enter first stock").toUpperCase();
  const s2 = prompt("Enter second stock").toUpperCase();

  if (!s1 || !s2) return;

  try {
    const [info1, info2, h1, h2] = await Promise.all([
      fetchJSON(`${API_BASE}/stock/${formatSymbol(s1)}`),
      fetchJSON(`${API_BASE}/stock/${formatSymbol(s2)}`),
      fetchJSON(`${API_BASE}/history/${formatSymbol(s1)}`),
      fetchJSON(`${API_BASE}/history/${formatSymbol(s2)}`)
    ]);

    renderCard(leftCard, info1);
    renderCard(rightCard, info2);

    if (priceChart) priceChart.destroy();

    priceChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: h1.map(d => d.date),
        datasets: [
          { label: s1, data: h1.map(d => d.price), borderWidth: 2 },
          { label: s2, data: h2.map(d => d.price), borderWidth: 2 }
        ]
      }
    });
  } catch (err) {
    alert("Comparison failed");
    console.error(err);
  }
});
