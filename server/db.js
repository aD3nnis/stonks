require('dotenv').config();
const { Pool } = require('pg');

const isRender =
  process.env.RENDER === 'true' ||
  process.env.DATABASE_URL?.includes('render.com') ||
  process.env.DATABASE_URL?.includes('dpg-');
  
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRender ? { rejectUnauthorized: false } : undefined,
});

module.exports = { pool };
