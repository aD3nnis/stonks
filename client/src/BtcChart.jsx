import { useEffect, useRef } from 'react'
import { createChart, CandlestickSeries } from 'lightweight-charts'

// CandlestickSeries is the default for addCandlestickSeries in v4
export function BtcChart({ candles }) {
  const chartContainerRef = useRef(null)

  useEffect(() => {
    if (!chartContainerRef.current || !candles?.length) return

    const chart = createChart(chartContainerRef.current, {
      layout: { textColor: '#d1d5db', background: { type: 'solid', color: '#1f2937' } },
      grid: { vertLines: { color: '#374151' }, horzLines: { color: '#374151' } },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: { timeVisible: true, secondsVisible: false },
    })

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    })

    // API returns time in ms; lightweight-charts expects Unix seconds
    const data = candles.map((c) => ({
      time: Math.floor(c.time / 1000),
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }))

    candleSeries.setData(data)
    chart.timeScale().fitContent()

    return () => chart.remove()
  }, [candles])

  return <div ref={chartContainerRef} style={{ width: '100%', height: 400 }} />
}