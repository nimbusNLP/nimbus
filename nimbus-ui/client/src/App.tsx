import { useState, useEffect } from 'react'
import './App.css'
import ModelsList from './components/ModelsList'

function App() {
  const [models, setModels] = useState([])

  useEffect(() => {
    fetch('http://localhost:3001/api/models')
      .then(response => response.json())
      .then(data => setModels(data))
  }, [])

  return (
    <>
      <h1>Welcome to the Nimbus UI</h1> 
      <ModelsList models={models} />
    </>
  )
}

export default App
