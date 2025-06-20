import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DataSelection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const uploadFile = async () => {
    const fileInput = document.getElementById("fileInput");
    const fileTypeSelect = document.getElementById("fileTypeSelect");

    if (!fileInput.files.length) {
      setUploadStatus("Please choose a file.");
      return;
    }

    const file = fileInput.files[0];
    const fileType = fileTypeSelect.value;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_type", fileType);

    try {
      const res = await fetch("http://165.22.228.32:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setUploadStatus("Upload successful.");
        const newFile = await res.json();
        setUploadedFiles(prev => [...prev, newFile]);
        closeModal(); // Optional: close modal after upload
      } else {
        setUploadStatus("Upload failed.");
      }
    } catch {
      setUploadStatus("Upload failed.");
    }
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("http://165.22.228.32:8000/files");
        const data = await res.json();
        setUploadedFiles(data);
      } catch (err) {
        console.error("Failed to fetch files", err);
      }
    };
    fetchFiles();
  }, []);

  return (
    <div className="data-selection-container">
      {/* Sidebar */}
      <div className="data-sidebar">
        <h2>Data Selection</h2>
        <button className="data-upload-btn" onClick={openModal}>
          Upload Well Data Files
          <span className="icon">+</span>
        </button>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="button" onClick={() => navigate('/dashboard')}>
            Continue to Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="data-main-content">
        <div className="data-section">
          <h3>Well Data</h3>
          <div className="data-file-card">Well_Log_1.csv</div>
          <div className="data-file-card">Well_Summary.pdf</div>
          {uploadedFiles.filter(f => f.type === "Well Data").map((f, i) => (
            <div key={i} className="data-file-card">{f.filename}</div>
          ))}
        </div>

        <div className="data-section">
          <h3>Seismic Data</h3>
          <div className="data-file-card">Seismic_Map_Inline.seg</div>
          <div className="data-file-card">Seismic_Attribute_Report.docx</div>
          {uploadedFiles.filter(f => f.type === "Seismic").map((f, i) => (
            <div key={i} className="data-file-card">{f.filename}</div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="data-modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingTop: '5rem',
          zIndex: 1000
        }}>
          <div className="data-modal" style={{
            position: 'relative',
            background: '#fff',
            padding: '2rem',
            width: '600px',
            maxWidth: '95%',
            borderRadius: '8px',
            boxShadow: '0 5px 25px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            fontSize: '1rem'
          }}>
            <span
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#444',
              }}
            >
              &times;
            </span>

            <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Upload File</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Name*</label>
              <input type="text" defaultValue="File 1" style={{ padding: '0.5rem' }} />

              <label>Slug</label>
              <input type="text" placeholder="Optional, auto-generated" style={{ padding: '0.5rem' }} />

              <label>Description</label>
              <textarea rows="3" style={{ padding: '0.5rem' }} />

              <label>Upload File</label>
              <div className="upload-wrapper" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="file" id="fileInput" />
                <button
                  onClick={uploadFile}
                  style={{
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  ⬆ Upload
                </button>
              </div>

              <div style={{ color: 'green', fontSize: '0.9rem' }}>{uploadStatus}</div>

              <label>File Type*</label>
              <select id="fileTypeSelect">
                <option>Seismic</option>
                <option>Well Data</option>
                <option>Financial</option>
                <option>Others</option>
              </select>

              <label>Well coordinates*</label>
              <div style={{ marginTop: '0.5rem' }}>
                <label>
                  <input type="radio" name="wellCoords" value="yes" defaultChecked /> Yes
                </label>
                <label style={{ marginLeft: '1rem' }}>
                  <input type="radio" name="wellCoords" value="no" /> No
                </label>
              </div>

              <div className="actions" style={{ marginTop: '1.5rem' }}>
                <button onClick={closeModal}>Cancel</button>
                <button>Save Changes</button>
              </div>

              <div className="highlight-box" style={{
                marginTop: '1.5rem',
                background: '#f9f9f9',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}>
                <p>
                  <strong>Note:</strong> If you have chosen to map to your data
                  where it resides currently, our ingestion engine will scan the
                  selected files and identify relevant data.
                </p>
                <p>
                  If you selected <strong>Cloud-based silo storage</strong>,
                  proceed to the next page to upload data to your proprietary
                  cloud storage.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
