# stonks

Bitcoin price chart and indicators app (React + Express + PostgreSQL).

## Local setup

### Prerequisites

- Node.js (v18+)
- PostgreSQL (local or a hosted instance)
- [LiveCoinWatch](https://www.livecoinwatch.com/tools/api) API key (free tier is enough)

### 1. Clone and install

```bash
git clone <repo-url>
cd stonks
```

Install dependencies for both client and server:

```bash
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### 2. Environment variables

The server reads config from a **`.env`** file in the **`server/`** directory. Do not commit `.env` (it’s in `.gitignore`).

**Option A – Copy the example file (recommended)**

```bash
cd server
cp .env.example .env
```

Then edit `server/.env` and replace the placeholders with your real values.

**Option B – Create `.env` manually**

Create `server/.env` with at least:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/your_db_name
LIVECOINWATCH_API_KEY=your_api_key_here
```

Optional:

- `PORT=3000` – server port (default 3000)
- `RENDER=true` – set in production on Render so the server uses the right DB SSL mode

For the **client**, optional:

- `VITE_API_URL` – API base URL (e.g. `http://localhost:3000` when the API runs on a different host/port). Leave unset when the Vite dev server proxies to the same host.

### 3. Database

Create a PostgreSQL database and run any migrations or schema setup you use. Point `DATABASE_URL` in `server/.env` at that database.

### 4. Run locally

**Terminal 1 – server**

```bash
cd server
node index.js
```

Server runs at `http://localhost:3000` (or whatever you set in `PORT`). It will fetch BTC price data on startup and every 15 minutes.

**Terminal 2 – client**

```bash
cd client
npm run dev
```

Vite dev server runs at `http://localhost:5173`. Open that URL in the browser. If the API is on the same machine, you can leave `VITE_API_URL` unset; for a different host/port, set it in `client/.env` (e.g. `VITE_API_URL=http://localhost:3000`).

---

## Env file summary

| Variable | Where | Required | Description |
|----------|--------|----------|-------------|
| `DATABASE_URL` | `server/.env` | Yes | PostgreSQL connection string |
| `LIVECOINWATCH_API_KEY` | `server/.env` | Yes | API key from [LiveCoinWatch](https://www.livecoinwatch.com/tools/api) |
| `PORT` | `server/.env` | No | Server port (default 3000) |
| `RENDER` | `server/.env` | No | Set to `true` on Render for DB SSL |
| `VITE_API_URL` | `client/.env` | No | API base URL when not same origin (e.g. `http://localhost:3000`) |

**Security:** Never commit `server/.env` or `client/.env`. Only `.env.example` (with no real secrets) is committed so others know which variables to set.
