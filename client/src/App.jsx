import { useState, useEffect } from 'react'
import { BtcChart } from './BtcChart'
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

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  const price = Number(btcData.currentPrice)
  const formattedPrice = isNaN(price)
    ? btcData.currentPrice
    : price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })

    return (
      <div>
        <h1>Bitcoin</h1>
        <p><strong>Price:</strong> {formattedPrice}</p>
        <p>Last 24h: {btcData.candles.length} data points</p>
        <BtcChart candles={btcData.candles} />
      </div>
    )
}

export default App