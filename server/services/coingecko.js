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
      const chartRes = await fetchWithTimeout(
        `${COINGECKO_BASE}/coins/bitcoin/market_chart?vs_currency=usd&days=1`
      );

      if (!chartRes.ok) {
        const msg = `CoinGecko API request failed (chart: ${chartRes.status})`;
        throw new Error(msg);
      }

      const chartData = await chartRes.json();
      const prices = chartData.prices || [];

      if (prices.length === 0) {
        throw new Error('Invalid price response from CoinGecko');
      }

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

      const currentPrice = String(prices[prices.length - 1][1]);

      return {
        currentPrice,
        candles,
      };
    } catch (err) {
      const isLastAttempt = attempt === maxAttempts;
      if (isLastAttempt) {
        console.error('CoinGecko failed after', maxAttempts, 'attempts:', err.message, err.cause || '');
        throw err;
      }
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

module.exports = { getBtcPriceAndCandles };