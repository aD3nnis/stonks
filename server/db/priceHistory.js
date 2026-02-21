// server/db/priceHistory.js
const { pool } = require('../db');

async function insertPriceHistory(rows) {
  if (!rows?.length) return;
  const client = await pool.connect();
  try {
    for (const row of rows) {
      await client.query(
        `INSERT INTO price_history (time, open, high, low, close)
         VALUES ($1, $2, $3, $4, $5)`,
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

module.exports = { insertPriceHistory };