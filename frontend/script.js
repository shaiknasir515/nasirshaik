async function searchStock() {
  const symbol = document.getElementById("searchInput").value.trim();
  const card = document.getElementById("stock-card");

  if (!symbol) {
    card.innerHTML = "<p>Please enter a stock symbol</p>";
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/stock/${symbol}`);
    const data = await res.json();

    if (data.error) {
      card.innerHTML = "<p>Stock not found</p>";
      return;
    }

    card.innerHTML = `
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Price:</strong> ₹${data.price}</p>
      <p><strong>Market Cap:</strong> ${data.marketCap}</p>
      <p><strong>P/E Ratio:</strong> ${data.pe}</p>
      <p><strong>52W High:</strong> ₹${data.high52}</p>
      <p><strong>52W Low:</strong> ₹${data.low52}</p>
    `;
  } catch (err) {
    card.innerHTML = "<p>Backend not running</p>";
  }
}
