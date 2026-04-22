import React from 'react'

const Result = ({ prediction }) => {
  // Format confidence as percentage using safe checks
  const confidenceValue = typeof prediction?.confidence === 'number' ? prediction.confidence : 0
  const confidencePercent = (confidenceValue * 100).toFixed(1)
  const isLowConfidence = confidenceValue < 0.65

  // Get color for confidence bar
  const getConfidenceColor = () => {
    const confidence = prediction.confidence || 0
    if (confidence >= 0.8) return '#4caf50'
    if (confidence >= 0.6) return '#ff9800'
    return '#f44336'
  }

  // Get soil type icon
  const getSoilIcon = (soilType) => {
    const icons = {
      'Black': '🖤',
      'Red_Laterite': '🔴',
      'Sandy': '🏖️',
      'Alluvial_Clayey': '🧱'
    }
    return icons[soilType] || '🌍'
  }

  // Get crop icon
  const getCropIcon = (crop) => {
    const icons = {
      'Cotton': '🌿',
      'Wheat': '🌾',
      'Rice': '🍚',
      'Corn': '🌽',
      'Sugarcane': '🎋',
      'Soybean': '🫘',
      'Potato': '🥔'
    }
    return icons[crop] || '🌱'
  }

  return (
    !prediction ? null :
    <div className="result-container">
      <h2 className="result-title">📊 Classification Result</h2>

      {isLowConfidence ? (
        <div className="low-confidence-warning">
          ❌ Could not recognize or confidently predict from this image. Please upload a clear soil image.
        </div>
      ) : (
        <>
          <div className="result-card">
            <div className="result-item soil-type">
              <div className="result-icon">{getSoilIcon(prediction?.prediction)}</div>
              <div className="result-content">
                <span className="result-label">Soil Type</span>
                <span className="result-value">{prediction?.prediction || 'N/A'}</span>
              </div>
            </div>

            <div className="result-item confidence">
              <div className="result-icon">📈</div>
              <div className="result-content">
                <span className="result-label">Confidence</span>
                <span className="result-value">{confidencePercent}%</span>
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill"
                    style={{ 
                      width: `${confidenceValue * 100}%`,
                      backgroundColor: getConfidenceColor()
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="result-item crop">
              <div className="result-icon">🌱</div>
              <div className="result-content">
                <span className="result-label">Recommended Crops</span>
                <div className="multi-list">
                  {prediction?.crops?.slice(0,4).map((crop, index) => (
                    <span key={index} className="list-item">
                      {getCropIcon(crop)} {crop}
                    </span>
                  )) || 'N/A'}
                </div>
              </div>
            </div>

            <div className="result-item fertilizer">
              <div className="result-icon">🧪</div>
              <div className="result-content">
                <span className="result-label">Recommended Fertilizers</span>
                <div className="multi-list">
                  {prediction?.fertilizers?.map((fert, index) => (
                    <span key={index} className="list-item">
                      {fert}
                    </span>
                  )) || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="recommendation-note">
            <p>💡 Based on soil analysis, {(prediction?.crops?.[0] || 'This crop')} is the most suitable crop for {prediction?.prediction || 'this'} soil.</p>
          </div>
        </>
      )}

      <style jsx>{`
        .multi-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 6px;
        }

        .list-item {
          background: #e8f5e9;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #2e7d32;
        }
        .low-confidence-warning {
          margin-bottom: 1rem;
          padding: 1rem;
          background: #ffebee;
          color: #c62828;
          border-radius: 12px;
          border-left: 4px solid #f44336;
          text-align: center;
          font-size: 1rem;
          font-weight: 500;
        }
        .result-container {
          margin-top: 2rem;
          animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .result-title {
          font-size: 1.3rem;
          color: #333;
          margin-bottom: 1rem;
          text-align: center;
        }

        .result-card {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .result-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 16px;
          margin-bottom: 1rem;
          transition: transform 0.2s ease;
        }

        .result-item:hover {
          transform: translateX(5px);
        }

        .result-item:last-child {
          margin-bottom: 0;
        }

        .result-icon {
          font-size: 2rem;
          min-width: 50px;
          text-align: center;
        }

        .result-content {
          flex: 1;
        }

        .result-label {
          display: block;
          font-size: 0.8rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.25rem;
        }

        .result-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
        }

        .crop-value {
          color: #4caf50;
        }

        .confidence-bar {
          margin-top: 8px;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .confidence-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .recommendation-note {
          margin-top: 1rem;
          padding: 1rem;
          background: #e8f5e9;
          border-radius: 12px;
          text-align: center;
          color: #2e7d32;
          font-size: 0.9rem;
          border-left: 4px solid #4caf50;
        }

        .recommendation-note p {
          margin: 0;
        }
      `}</style>
    </div>
  )
}

export default Result