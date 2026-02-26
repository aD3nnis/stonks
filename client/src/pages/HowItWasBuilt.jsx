import './HowItWasBuilt.css'

export default function HowItWasBuilt() {
  return (
    <div className="app-container">
      <div className="how-it-was-built">
        <h1 className="how-it-was-built__title">How It Was Built</h1>
        <a
          href="https://github.com/aD3nnis/stonks"
          target="_blank"
          rel="noopener noreferrer"
          className="how-it-was-built__github"
        >
          View source on GitHub
        </a>

        <section className="how-it-was-built__section">
          <h2 className="how-it-was-built__heading">Frontend</h2>
          <p className="how-it-was-built__text">
          React 19 with React Router for client-side routing. The Bitcoin chart uses TradingView’s
          Lightweight Charts for candlestick data; the UI is styled with plain CSS.
          </p>
        </section>

        <section className="how-it-was-built__section">
          <h2 className="how-it-was-built__heading">Backend</h2>
          <p className="how-it-was-built__text">
          Node.js and Express 5 expose a REST API that serves stored OHLC data. A cron job runs every
          15 minutes, fetches live BTC price and history from the LiveCoinWatch API, and writes
          candles to PostgreSQL.
          </p>
        </section>

        <section className="how-it-was-built__section">
          <h2 className="how-it-was-built__heading">Data</h2>
          <p className="how-it-was-built__text">
          PostgreSQL stores price history; the app uses the <code>pg</code> driver and supports
          Render Postgres (SSL). Technical indicators (e.g. moving-average crossovers) are computed
          server-side with the <code>technicalindicators</code> library.
          </p>
        </section>

        <section className="how-it-was-built__section">
          <h2 className="how-it-was-built__heading">Dev & Deploy</h2>
          <p className="how-it-was-built__text">
          ESLint for linting; Vite proxies <code>/api</code> to the backend in development. The
          backend and database are set up for deployment on Render, with config via environment
          variables.
          </p>
        </section>
      </div>
    </div>
  )
}
