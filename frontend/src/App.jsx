import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, DollarSign, Activity } from 'lucide-react';

export default function App() {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/crypto-telemetry')
      .then((res) => res.json())
      .then((data) => {
        setCryptoData(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error loading crypto data:", err));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0b070f' }}>
        <h2 className="glow-magenta" style={{ letterSpacing: '4px' }}>INITIALIZING CORE TELEMETRY STREAMS...</h2>
      </div>
    );
  }

  const topAsset = [...cryptoData].sort((a, b) => b.total_return - a.total_return)[0];
  const volatileAsset = [...cryptoData].sort((a, b) => b.volatility - a.volatility)[0];

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* HEADER BAR */}
      <div style={{ borderBottom: '2px solid #da70d6', paddingBottom: '20px', marginBottom: '35px' }}>
        <h1 className="glow-magenta" style={{ margin: 0, fontSize: '32px', letterSpacing: '2px' }}>QUANT CRYPTO TELEMETRY</h1>
        <p style={{ color: '#da70d6', fontSize: '13px', marginTop: '5px', letterSpacing: '1px' }}>SYSTEM RUNNING // 5-YEAR HISTORICAL DATA EXTRACTION ENGINE</p>
      </div>

      {/* HIGHLIGHT DATA ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
        <div className="crypto-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <TrendingUp size={36} color="#ff00ff" />
          <div>
            <div style={{ fontSize: '12px', color: '#da70d6', textTransform: 'uppercase' }}>Top Performer (5Y)</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>
              {topAsset.name} <span style={{ color: '#00ff66', fontSize: '16px' }}>+{topAsset.total_return}%</span>
            </div>
          </div>
        </div>

        <div className="crypto-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <AlertCircle size={36} color="#ff1493" />
          <div>
            <div style={{ fontSize: '12px', color: '#da70d6', textTransform: 'uppercase' }}>Highest Asset Volatility</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>
              {volatileAsset.name} <span style={{ color: '#ff1493', fontSize: '16px' }}>{volatileAsset.volatility}% Volatility Index</span>
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC ASSET DISPLAY MATRIX */}
      <h3 style={{ color: '#ffbbff', letterSpacing: '1px', marginBottom: '20px' }}>ACTIVE MARKETS MATRIX</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
        {cryptoData.map((coin) => (
          <div key={coin.name} className="crypto-card" style={{ padding: '25px', position: 'relative' }}>
            
            {/* Coin Logo Rendering Block */}
            <img 
              src={coin.logo} 
              alt={coin.name} 
              style={{ width: '45px', height: '45px', position: 'absolute', top: '20px', right: '20px', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.2))' }} 
            />

            <h2 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '22px' }}>{coin.name}</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', borderTop: '1px solid #301b3b', paddingTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#da70d6' }}>Current Price:</span>
                <span style={{ color: '#00ff66', fontWeight: 'bold' }}>${coin.current_price.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#da70d6' }}>Historical Mean:</span>
                <span style={{ color: '#fff' }}>${coin.mean_price.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#da70d6' }}>Volatility Index:</span>
                <span style={{ color: '#ff1493' }}>{coin.volatility}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #301b3b', paddingTop: '10px', marginTop: '5px' }}>
                <span style={{ color: '#ffb6c1', fontWeight: 'bold' }}>Total Return:</span>
                <span style={{ color: coin.total_return >= 0 ? '#00ff66' : '#ff1493', fontWeight: 'bold' }}>
                  {coin.total_return >= 0 ? '+' : ''}{coin.total_return.toLocaleString()}%
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}