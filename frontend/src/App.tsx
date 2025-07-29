import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/items/100?q=abc')  // Fetch sample data from FastAPI backend
      .then((response) => response.json())
      .then((data) => {
        setCount(data.item_id);
        setQuery(data.q)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, []);

  return (
    <>
      <h1>picChef</h1>
      <h2>From a picture to your kitchen</h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

        <p>Your query: {query}</p>

      </div>
    </>
  )
}

export default App
