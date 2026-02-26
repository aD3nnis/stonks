import { useState, useEffect } from 'react'
import { BtcChart } from './BtcChart'
import { Routes, Route } from 'react-router-dom'
import HowItWasBuilt from './pages/HowItWasBuilt'
import IndicatorUpdates from './pages/IndicatorUpdates'
import Nav from './components/NavBar'
import './App.css'

function App() {
  const [btcData, setBtcData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const apiBase = import.meta.env.VITE_API_URL || ''

  useEffect(() => {
    fetch(`${apiBase}/api/btc`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setError(data?.error || data?.detail || 'Failed to load Bitcoin data')
          setBtcData(null)
          return
        }
        setBtcData({ currentPrice: data.currentPrice, candles: data.candles })
        setError(null)
      })
      .catch((err) => {
        setError(err.message || 'Failed to reach backend')
        setBtcData(null)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="loading-container">
      <div>Loading...</div>
      <div style={{ marginTop: '0.5rem', fontSize: '1em', color: '#666' }}>
        The initial load takes about 15 seconds because I don't want to pay for hosting
      </div>
      <div style={{ marginTop: '0.2rem', fontSize: '1em', color: '#666' }}> 
        Thank you for your patience!
      </div>
    </div>
  )
  if (error) return <div className="error-container">Error: {error}</div>

  const price = Number(btcData.currentPrice)
  const formattedPrice = isNaN(price)
    ? btcData.currentPrice
    : price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })

    return (
      <div>
        <Nav />
        <Routes>
          <Route path="/" element={
            <div className="app-container">
              <h1>Bitcoin</h1>
              <p>A real-time Bitcoin dashboard that monitors key technical signals to inform buy, sell, or hold decisions.</p>
              <p><strong>Current Price:</strong> {formattedPrice}</p>
              <div className="chart-container">
                <BtcChart candles={btcData.candles} />
              </div>
            </div>
          } />
          <Route path="/how-it-was-built" element={<HowItWasBuilt />} />
          <Route path="/indicator-updates" element={<IndicatorUpdates />} />
        </Routes>
      </div>
    )
}

export default App