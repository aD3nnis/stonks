const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

const FETCH_OPTIONS = {
  headers: { 'User-Agent': 'BitcoinAlert/1.0' },
};

function fetchWithTimeout(url, ms = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...FETCH_OPTIONS, signal: controller.signal }).finally(() =>
    clearTimeout(timeoutId)
  );
}

async function getBtcPriceAndCandles() {
  const maxAttempts = 3;
  const delayMs = 2000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const [priceRes, chartRes] = await Promise.all([
        fetchWithTimeout(`${COINGECKO_BASE}/simple/price?ids=bitcoin&vs_currencies=usd`),
        fetchWithTimeout(`${COINGECKO_BASE}/coins/bitcoin/market_chart?vs_currency=usd&days=1`),
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
    } catch (err) {
      const isLastAttempt = attempt === maxAttempts;
      if (isLastAttempt) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

module.exports = { getBtcPriceAndCandles };