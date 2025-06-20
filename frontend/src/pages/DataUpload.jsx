import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupFilesByType } from '../utils';

export default function DataUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showSubmit, setShowSubmit] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    setShowSubmit(true);
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prevFiles => 
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
    if (selectedFiles.length <= 1) {
      setShowSubmit(false);
    }
  };

  const handleSubmit = () => {
    setIsProcessing(true);
    // Group files by type and store in localStorage
    const fileTypes = groupFilesByType(selectedFiles);
    localStorage.setItem('uploadedFiles', JSON.stringify(fileTypes));
    
    // Simulate scanning process for 8 seconds
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/dashboard');
    }, 8000);
  };

  return (
    <div className="page-container">
      <h1 className="text-center mb-6">Data Selection</h1>
      
      <div className="section">
        <div className="upload-container">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            style={{ display: 'none' }}
          />

          <div className="info-text">
            <ol>
              <li>If you have chosen to map to your data where it resides currently, our ingestion engine will scan the selected files, identify relevant data, 
              and create copies of the pertinent data. Your original files will not be moved or modified - they will remain exactly 
              as they are in their current location.</li>
              <li>If you selected Cloud-based silo storage, please proceed to the next page to select the data to be uploaded to your proprietary cloud storage.</li>
            </ol>
          </div>

          {/* Select Files button */}
          <button 
            onClick={handleFileSelect}
            className="button"
            disabled={isProcessing}
          >
            Select Files
          </button>

          {/* Selected Files Display */}
          {selectedFiles.length > 0 && (
            <div className="selected-files-container">
              <h3 className="mt-4 mb-2">Selected Files:</h3>
              <div className="file-list">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <span className="file-icon">📄</span>
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                    <button 
                      onClick={() => removeFile(index)}
                      className="remove-file-button"
                      disabled={isProcessing}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit section */}
          {showSubmit && (
            <div className="submit-section">
              <p className="submit-text">
                When all files are selected, click "Submit" to begin scanning
              </p>
              <button 
                onClick={handleSubmit}
                className="button submit-button"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="processing-container">
                    <div className="spinner"></div>
                    <span>Scanning files...</span>
                  </div>
                ) : 'Submit'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
