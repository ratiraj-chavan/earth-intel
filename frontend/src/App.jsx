import React, { useState } from 'react'
import Upload from './components/Upload'
import Result from './components/Result'
import './App.css'

function App() {
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handlePredict = async (file) => {
    // Reset states
    setPrediction(null)
    setError(null)
    setLoading(true)

    // Validate file
    if (!file) {
      setError('Please select an image file first')
      setLoading(false)
      return
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, WEBP)')
      setLoading(false)
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB')
      setLoading(false)
      return
    }

    // Create form data
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Server error: ${response.status}`)
      }

      const data = await response.json()
      setPrediction(data)
    } catch (err) {
      console.error('API Error:', err)
      setError(err.message || 'Failed to connect to the backend. Make sure the server is running at http://localhost:5000')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setPrediction(null)
    setError(null)
  }

  return (
    <div className="app">
      <div className="container">
        <h1>Earth-intel 🌍🌱</h1>
        <p className="subtitle">Upload a soil image to identify its type and get crop recommendations</p>
        
        {error && <div className="error-message">⚠️ {error}</div>}
        
        <Upload onPredict={handlePredict} onClear={handleClear} loading={loading} />
        
        {loading && <div className="loading">🔄 Analyzing soil image...</div>}
        
        {prediction && !loading && <Result prediction={prediction} />}
      </div>
    </div>
  )
}

export default App