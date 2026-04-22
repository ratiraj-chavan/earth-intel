import React, { useState } from 'react'

const Upload = ({ onPredict, loading, onClear }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    
    if (file) {
      setSelectedFile(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setSelectedFile(null)
      setPreviewUrl(null)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedFile && !loading) {
      onPredict(selectedFile)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setPreviewUrl(null)

    // Clear file input
    const fileInput = document.getElementById('image-upload')
    if (fileInput) fileInput.value = ''

    // Clear prediction in parent
    if (onClear) {
      onClear()
    }
  }

  return (
    <div className="upload-container">
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="upload-area">
          <label htmlFor="image-upload" className="upload-label">
            {previewUrl ? (
              <div className="preview-container">
                <img src={previewUrl} alt="Preview" className="image-preview" />
                <div className="preview-overlay">
                  <span>📷 Click to change image</span>
                </div>
              </div>
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon">📸</div>
                <p>Click or drag to upload soil image</p>
                <small>Supports JPG, PNG, WEBP (Max 10MB)</small>
              </div>
            )}
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={handleFileChange}
            disabled={loading}
            style={{ display: 'none' }}
          />
        </div>

        <div className="button-group">
          {previewUrl && (
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-clear"
              disabled={loading}
            >
              🗑️ Clear
            </button>
          )}
          <button
            type="submit"
            disabled={!selectedFile || loading}
            className={`btn btn-predict ${(!selectedFile || loading) ? 'btn-disabled' : ''}`}
          >
            {loading ? '⏳ Predicting...' : '🔍 Predict Soil Type'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .upload-container {
          margin: 1rem 0;
        }

        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .upload-area {
          width: 100%;
        }

        .upload-label {
          display: block;
          cursor: pointer;
          border: 2px dashed #ccc;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          background: #fafafa;
        }

        .upload-label:hover {
          border-color: #667eea;
          background: #f5f3ff;
        }

        .upload-placeholder {
          padding: 3rem 2rem;
          text-align: center;
          color: #666;
        }

        .upload-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .upload-placeholder p {
          margin: 0.5rem 0;
          font-size: 1rem;
        }

        .upload-placeholder small {
          font-size: 0.8rem;
          color: #999;
        }

        .preview-container {
          position: relative;
          width: 100%;
          background: #f0f0f0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .image-preview {
          max-width: 100%;
          max-height: 300px;
          object-fit: contain;
          display: block;
        }

        .preview-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          text-align: center;
          padding: 8px;
          font-size: 0.8rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .preview-container:hover .preview-overlay {
          opacity: 1;
        }

        .button-group {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .btn {
          padding: 12px 24px;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .btn-predict {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          flex: 1;
        }

        .btn-predict:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-clear {
          background: #f0f0f0;
          color: #666;
        }

        .btn-clear:hover:not(:disabled) {
          background: #e0e0e0;
          transform: translateY(-2px);
        }

        .btn-disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}

export default Upload