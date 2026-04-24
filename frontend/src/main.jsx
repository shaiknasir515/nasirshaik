import { fetchStock } from "./api/stockApi";

async function handleSearch() {
  const input = document.getElementById("stock-input").value.toLowerCase();
  const data = await fetchStock(input);

  document.getElementById("stock-card").innerHTML = `
    <p><b>Name:</b> ${data.name}</p>
    <p><b>Price:</b> ₹${data.price}</p>
    <p><b>Day High:</b> ₹${data.dayHigh}</p>
    <p><b>Day Low:</b> ₹${data.dayLow}</p>
    <p><b>Market Cap:</b> ${data.marketCap}</p>
    <p><b>P/E Ratio:</b> ${data.peRatio}</p>
  `;
}
