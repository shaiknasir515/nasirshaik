export const fetchStock = async (symbol) => {
  const res = await fetch(`http://localhost:8000/stock/${symbol}`);
  if (!res.ok) {
    throw new Error("API Error");
  }
  return res.json();
};

export const fetchPrediction = async (symbol) => {
  const res = await fetch(`http://localhost:8000/predict/${symbol}`);
  if (!res.ok) {
    throw new Error("Prediction API Error");
  }
  return res.json();
};
