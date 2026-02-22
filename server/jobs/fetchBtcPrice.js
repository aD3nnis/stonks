const { getBtcPriceAndCandles } = require('../services/coingecko');
const { insertPriceHistory } = require('../db/priceHistory');

async function fetchAndSaveBtcPrice() {
  try {
    const data = await getBtcPriceAndCandles();
    await insertPriceHistory(data.candles);
    return data;  // so GET /api/btc can res.json(data)
  } catch (err) {
    console.error('fetchAndSaveBtcPrice failed:', err.message);
  }
}

module.exports = { fetchAndSaveBtcPrice };