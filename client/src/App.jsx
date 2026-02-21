import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState(null)   // response from backend
  const [loading, setLoading] = useState(true)   // still fetching?
  const [error, setError] = useState(null)  // request failed?
  
  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message)
        setError(null)
      })
      .catch((err) => {
        setError(err.message || 'Failed to reach backend')
        setMessage(null)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {message && <p>Backend says: {message}</p>}
    </>
  )
}

export default App
