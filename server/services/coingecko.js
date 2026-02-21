const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

async function getBtcPriceAndCandles() {
  const [priceRes, chartRes] = await Promise.all([
    fetch(`${COINGECKO_BASE}/simple/price?ids=bitcoin&vs_currencies=usd`),
    fetch(`${COINGECKO_BASE}/coins/bitcoin/market_chart?vs_currency=usd&days=1`),
  ]);

  if (!priceRes.ok || !chartRes.ok) {
    throw new Error('CoinGecko API request failed');
  }

  const priceData = await priceRes.json();
  const chartData = await chartRes.json();

  if (priceData.bitcoin?.usd == null) {
    throw new Error('Invalid price response from CoinGecko');
  }

  const prices = chartData.prices || [];
  const candles = prices.map((point, i) => {
    const time = point[0];
    const close = point[1];
    const open = i > 0 ? prices[i - 1][1] : close;
    return {
      time,
      open,
      high: Math.max(open, close),
      low: Math.min(open, close),
      close,
    };
  });

  return {
    currentPrice: String(priceData.bitcoin.usd),
    candles,
  };
}

module.exports = { getBtcPriceAndCandles };