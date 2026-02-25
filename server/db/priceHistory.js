// server/db/priceHistory.js
const { pool } = require('../db');

async function insertPriceHistory(rows) {
  if (!rows?.length) return;
  const client = await pool.connect();
  try {
    for (const row of rows) {
      await client.query(
        `INSERT INTO price_history (time, open, high, low, close)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (time) DO UPDATE SET
            open  = EXCLUDED.open,
            high  = EXCLUDED.high,
            low   = EXCLUDED.low,
            close = EXCLUDED.close`,
        [
          new Date(row.time),
          row.open,
          row.high,
          row.low,
          row.close,
        ]
      );
    }
  } finally {
    client.release();
  }
}

// Read the most recent candles from the DB
async function getLatestCandles(limit = 288) {
  const { rows } = await pool.query(
    `
      SELECT time, open, high, low, close
      FROM price_history
      ORDER BY time DESC
      LIMIT $1
    `,
    [limit]
  );

  // rows come back newest-first; reverse to oldest-first for the chart
  return rows
    .map((r) => ({
      time: new Date(r.time).getTime(), // ms timestamp for the frontend
      open: Number(r.open),
      high: Number(r.high),
      low: Number(r.low),
      close: Number(r.close),
    }))
    .reverse();
}

module.exports = {
  insertPriceHistory,
  getLatestCandles,
};