# Bitcoin Technical Alert App — Project Brief

## Project Overview

A full-stack web application that monitors Bitcoin price data, detects bullish/bearish technical indicator signals, and sends real-time notifications via email (and optionally SMS). This project is designed as a portfolio piece to demonstrate full-stack development capability for a frontend developer expanding their skillset.

---

## Final Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Recharts or TradingView lightweight-charts |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Scheduler | node-cron |
| Price Data API | Binance API (free, no key required to start) |
| Notifications | SendGrid (email, free tier) → Twilio (SMS, later) |
| Frontend Hosting | Netlify |
| Backend + DB Hosting | Railway or Render |

**Why Node.js over Python:** As a frontend developer already in the JavaScript ecosystem, Node.js means less context switching and faster progress. Python + FastAPI would make more sense if data science or ML were a goal.

**Why Binance over CoinGecko:** Binance is the largest crypto exchange by volume, has been around since 2017, provides real candlestick/OHLC data (required for technical indicators), has generous free rate limits, and is a safer long-term bet than a data aggregator like CoinGecko which has been pushing users toward paid plans.

---

## How Pattern Detection Works

No AI required to start. Bitcoin trend detection uses well-established mathematical formulas called **technical indicators**. Use the npm package **`technicalindicators`** which handles all the math — you just feed it price data and it returns signals.

### Recommended indicators to implement (in order):

**1. Moving Average Crossover (start here)**
When a short-term moving average crosses above a long-term moving average = bullish signal ("golden cross"). When it crosses below = bearish signal ("death cross"). Simple, reliable, well understood.

**2. RSI (Relative Strength Index)**
Measures momentum. Above 70 = overbought (potential bearish reversal). Below 30 = oversold (potential bullish reversal).

**3. MACD**
Momentum indicator that signals trend changes based on the relationship between two moving averages.

**4. Bollinger Bands**
Identifies volatility and potential breakouts when price moves outside the bands.

---

## System Architecture

```
Binance API
    ↓ (every 15 min via node-cron)
Express Backend
    ↓
PostgreSQL (stores price history + alert logs)
    ↓ (when signal detected)
SendGrid / Twilio (email/SMS notification)
    ↑
React Frontend (dashboard — reads from backend API)
```

---

## Security Considerations

### API Keys — most important rule
- **Never hardcode API keys in your code**
- **Never commit them to GitHub**
- Store all secrets in a `.env` file locally
- Add `.env` to `.gitignore` immediately when setting up the project — before writing any real code
- On Railway/Render/Netlify, add secrets as environment variables through their dashboards

### Other considerations
- Since this app is personal (no other users), your security surface is small
- If you add login functionality later, use an existing auth library like **Clerk** or **Auth0** (both have free tiers) — never roll your own password system
- Railway and Render keep your database private by default — don't expose it publicly

---

## Cost Breakdown

| Service | Cost |
|---|---|
| Binance API | Free |
| SendGrid (email) | Free up to 100 emails/day |
| Twilio (SMS) | Free trial credit, then ~pennies per SMS |
| Netlify | Free for personal projects |
| Render | Generous free tier (services spin down when inactive) |
| Railway | Free trial, then small charges based on usage |

**Realistic cost:** $0 while building. A few dollars/month max once actively using SMS alerts. Recommendation: start with email only (fully free), add SMS later.

---

## Why Not AWS?

AWS is overkill for this project and has surprise billing risk. However, knowing where it *would* apply is interview-worthy:

- **AWS Lambda** — in production at scale, your node-cron scheduler would be a good candidate for Lambda (serverless, pay-per-execution). Being able to articulate this shows architectural awareness.
- **AWS SNS** — their notification service, conceptually similar to what you're building.

Build on Railway/Render first. Optionally migrate just the scheduler to AWS Lambda later as a learning exercise — that migration story is actually impressive to discuss in interviews.

---

## Build Plan

### Phase 1 — Project Setup (Day 1)
- Create GitHub repo
- Set up React app and Express server as separate folders in the same repo
- Create `.env` file and add to `.gitignore` **immediately, before anything else**
- Install basic dependencies
- Verify frontend can make a request to backend and get a response ("hello world" level)

### Phase 2 — Get Bitcoin Data Flowing (Days 2–3)
- Write one backend endpoint that calls the Binance API
- Return current Bitcoin price + recent candlestick data
- Display that data on a basic chart in React
- Goal: prove the full pipeline works — Binance → Express → React → Chart

### Phase 3 — Database (Days 3–4)
- Set up PostgreSQL
- Create two tables: `price_history` and `alert_logs`
- Every time backend fetches price data, save it to the database
- This gives your indicators historical data to calculate against

### Phase 4 — The Scheduler (Days 4–5)
- Add `node-cron` to automatically fetch + save Bitcoin price data every 15 minutes
- Leave it running and watch the database fill up on its own
- This makes the app "alive"

### Phase 5 — First Technical Indicator (Days 5–7)
- Install `technicalindicators` npm package
- Implement moving average crossover signal using stored price data
- Log signals to the console first, then save to `alert_logs` table
- Do not hook up notifications yet — just verify detection is working

### Phase 6 — Notifications (Days 7–8)
- Wire up SendGrid to send yourself an email when a signal is detected
- Add deduplication logic — prevent the same signal from firing repeatedly in a short window
- Test thoroughly

### Phase 7 — Polish the Frontend (Days 8–12)
- Build out the React dashboard properly
- Price history chart with real styling
- Alert history feed showing past signals
- Status indicators (last checked, current price, etc.)
- This is where your existing frontend skills shine — invest time here

### Phase 8 — Deploy (Days 12–14)
- Deploy frontend to Netlify
- Deploy backend + database to Railway or Render
- Set all environment variables on the hosting platforms
- Verify everything works the same as locally

---

## Future Feature Expansion (post-MVP)

- Add more technical indicators (RSI, MACD, Bollinger Bands)
- Add SMS notifications via Twilio
- Add multiple cryptocurrencies beyond Bitcoin
- Settings panel to configure alert thresholds
- User authentication (Clerk or Auth0)
- Discuss migrating scheduler to AWS Lambda

---

## Starting Point for Your Next Session

**Your immediate goal for Phase 1:**

1. Create a GitHub repo (make it public — it's a portfolio piece)
2. Inside it, create two folders: `/client` (React) and `/server` (Express)
3. In `/server`, run `npm init` and install `express`, `dotenv`, `cors`
4. In `/server`, create a `.env` file and immediately add it to `.gitignore`
5. In `/client`, run `npx create-react-app .` or `npm create vite@latest . -- --template react`
6. Write a single `/api/hello` endpoint in Express that returns `{ message: "hello world" }`
7. Make a fetch call to that endpoint from React and display the response

Once that works end to end, you're ready for Phase 2.
