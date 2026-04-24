const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const stocks = {
  TCS: {
    name: "Tata Consultancy Services",
    price: 3890,
    marketCap: "14.2T",
    pe: 29.5,
    high52: 4250,
    low52: 3050
  },
  INFY: {
    name: "Infosys",
    price: 1620,
    marketCap: "6.7T",
    pe: 26.1,
    high52: 1850,
    low52: 1350
  }
};

app.get("/stock/:symbol", (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const stock = stocks[symbol];

  if (!stock) {
    return res.status(404).json({ error: "Stock not found" });
  }

  res.json(stock);
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
