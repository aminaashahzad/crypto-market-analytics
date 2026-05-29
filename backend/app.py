import os
import warnings
from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import yfinance as yf

warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)  # Allows your React frontend to connect securely

COINS = {
    "Bitcoin": "BTC-USD",
    "Ethereum": "ETH-USD",
    "Dogecoin": "DOGE-USD",
    "Solana": "SOL-USD",
    "BNB": "BNB-USD",
}

COIN_LOGOS = {
    "Bitcoin": "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    "Ethereum": "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    "Dogecoin": "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
    "Solana": "https://cryptologos.cc/logos/solana-sol-logo.png",
    "BNB": "https://cryptologos.cc/logos/bnb-bnb-logo.png"
}

PERIOD = "5y"

def get_crypto_metrics():
    records = []
    for name, symbol in COINS.items():
        csv_filename = f"{name.lower()}_historical_data.csv"
        
        # Download data directly with single-period processing to bypass network freezes
        try:
            print(f"Fetching live stream for {name}...")
            df = yf.download(symbol, period=PERIOD, interval="1d", progress=False)
            
            # Clean up columns if they are multi-indexed
            if isinstance(df.columns, pd.MultiIndex):
                df.columns = [col[0] for col in df.columns]
                
            if df.empty and os.path.exists(csv_filename):
                df = pd.read_csv(csv_filename, index_col=0, parse_dates=True)
            elif not df.empty:
                df.to_csv(csv_filename)
        except Exception as e:
            print(f"Local fallback for {name} due to: {e}")
            if os.path.exists(csv_filename):
                df = pd.read_csv(csv_filename, index_col=0, parse_dates=True)
            else:
                continue

        df = df.dropna(how="all").ffill()
        df["Daily_Return"] = df["Close"].pct_change() * 100
        
        close_prices = df["Close"].astype(float)
        p_start, p_end = close_prices.iloc[0], close_prices.iloc[-1]
        
        records.append({
            "name": name,
            "logo": COIN_LOGOS[name],
            "current_price": round(p_end, 2),
            "mean_price": round(close_prices.mean(), 2),
            "volatility": round(df["Daily_Return"].dropna().std(), 2),
            "total_return": round(((p_end - p_start) / p_start) * 100, 2)
        })
    return records

@app.route('/api/crypto-telemetry', methods=['GET'])
def telemetry_api():
    try:
        data = get_crypto_metrics()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("🚀 Starting API Portal Engine on Port 5000...")
    app.run(port=5000, debug=True)