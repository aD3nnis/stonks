const LCW_BASE = 'https://api.livecoinwatch.com';

function postWithTimeout(path, payload, apiKey, ms = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  return fetch(`${LCW_BASE}${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(payload),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId));
}

async function getBtcPriceAndCandles() {
  const apiKey = process.env.LIVECOINWATCH_API_KEY;
  if (!apiKey) {
    throw new Error('LIVECOINWATCH_API_KEY is not set');
  }

  const maxAttempts = 3;
  const delayMs = 2000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const endMs = Date.now();
      const startMs = endMs - 24 * 60 * 60 * 1000;

      const [singleRes, historyRes] = await Promise.all([
        postWithTimeout('/coins/single', { currency: 'USD', code: 'BTC', meta: false }, apiKey),
        postWithTimeout('/coins/single/history', { currency: 'USD', code: 'BTC', start: startMs, end: endMs, meta: true }, apiKey),
      ]);

      if (!singleRes.ok) {
        throw new Error(`LiveCoinWatch API request failed (single: ${singleRes.status})`);
      }
      if (!historyRes.ok) {
        throw new Error(`LiveCoinWatch API request failed (history: ${historyRes.status})`);
      }

      const singleData = await singleRes.json();
      const historyData = await historyRes.json();

      if (singleData?.error) {
        const msg = singleData.error.description || singleData.error.status || 'LiveCoinWatch API error';
        throw new Error(msg);
      }
      if (historyData?.error) {
        const msg = historyData.error.description || historyData.error.status || 'LiveCoinWatch API error';
        throw new Error(msg);
      }

      const rate = singleData.rate;
      if (rate == null || typeof rate !== 'number') {
        throw new Error('Invalid price response from LiveCoinWatch');
      }

      const history = historyData.history || [];
      if (history.length === 0) {
        throw new Error('Invalid history response from LiveCoinWatch');
      }

      const candles = history.map((point, i) => {
        const time = point.date;
        const close = Number(point.rate);
        const open = i > 0 ? Number(history[i - 1].rate) : close;
        return {
          time,
          open,
          high: Math.max(open, close),
          low: Math.min(open, close),
          close,
        };
      });

      return {
        currentPrice: String(rate),
        candles,
      };
    } catch (err) {
      const isLastAttempt = attempt === maxAttempts;
      if (isLastAttempt) {
        console.error('LiveCoinWatch failed after', maxAttempts, 'attempts:', err.message, err.cause || '');
        throw err;
      }
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

module.exports = { getBtcPriceAndCandles };