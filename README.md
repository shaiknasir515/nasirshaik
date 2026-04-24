# 📈 Stock Price Predictor

A full-stack application that provides real-time stock information and uses Machine Learning (Linear Regression) to predict stock prices 7 days into the future.

## 🏗 Architecture
- **Frontend**: React.js (Vite)
- **Backend (API & ML)**: Python FastAPI with `yfinance` & `numpy`
- **Alternative Backend**: Express Node.js

## 🚀 How to Run Locally

### 1. Start the Machine Learning Backend
Navigate to the `Backend/` directory and start the FastAPI server:
```bash
cd Backend
uvicorn main:app --reload --port 8000
```
*(Requires: `pip install fastapi uvicorn yfinance numpy`)*

### 2. Start the Frontend
Open a new terminal, navigate to the `frontend/` directory, and start the React app:
```bash
cd frontend
npm install
npm run dev
```

### 3. View the App
Open your browser and navigate to the terminal URL (usually `http://localhost:5173`). Search for any valid ticker (e.g., `AAPL`, `TCS.NS`) to see Live Information and the 7-day AI Predictions!
