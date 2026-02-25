require('dotenv').config();
const { fetchAndSaveBtcPrice } = require('./jobs/fetchBtcPrice');
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { getLatestCandles } = require('./db/priceHistory');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'hello world' });
});

app.get('/api/btc', async (req, res) => {
  try {
    const candles = await getLatestCandles(288);

    if (!candles.length) {
      // DB has no data yet; API is up but not warmed
      return res.status(503).json({
        error: 'No Bitcoin price data available yet',
        detail: 'Background job has not fetched any data.',
      });
    }

    const latest = candles[candles.length - 1];
    const currentPrice = String(latest.close);

    res.json({
      currentPrice,
      candles,
    });
  } catch (err) {
    console.error('GET /api/btc failed:', err.message);
    res.status(500).json({
      error: 'Failed to load Bitcoin data',
      detail: err.message,
    });
  }
});

cron.schedule('*/15 * * * *', async () => {
  await fetchAndSaveBtcPrice();
  console.log('Scheduled fetch completed');
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await fetchAndSaveBtcPrice();
  console.log('Startup fetch completed');
});