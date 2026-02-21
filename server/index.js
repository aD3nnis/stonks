require('dotenv').config();
const { getBtcPriceAndCandles } = require('./services/coingecko');
const { insertPriceHistory } = require('./db/priceHistory');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'hello world' });
});

app.get('/api/btc', async (req, res) => {
  try {
    const data = await getBtcPriceAndCandles();
    await insertPriceHistory(data.candles);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to fetch Bitcoin data',
      detail: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});