require('dotenv').config();
const { fetchAndSaveBtcPrice } = require('./jobs/fetchBtcPrice');
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'hello world' });
});

app.get('/api/btc', async (req, res) => {
  const data = await fetchAndSaveBtcPrice();
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({
      error: 'Failed to fetch Bitcoin data',
      detail: 'See server logs.',
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