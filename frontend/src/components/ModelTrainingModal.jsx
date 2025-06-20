import React from 'react';

export default function ModelTrainingModal({ onClose, onSelect, clusters, setClusters }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '10px',
          width: '320px',
          textAlign: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
        }}
      >
        <h3 style={{ marginBottom: '1rem' }}>Select Training Type</h3>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>Clusters for Unsupervised:</label>
          <select
            value={clusters}
            onChange={(e) => setClusters(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '1rem'
            }}
          >
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <option key={n} value={n}>{n} Clusters</option>
            ))}
          </select>
        </div>

       
        <button onClick={() => onSelect("supervised")} style={modalButtonStyle}>📊 Supervised</button>
        
        <div
          style={{ marginTop: '1rem', color: '#1976d2', cursor: 'pointer' }}
          onClick={onClose}
        >
          ❌ Close
        </div>
      </div>
    </div>
  );
}

const modalButtonStyle = {
  display: 'block',
  width: '100%',
  padding: '0.6rem',
  margin: '0.5rem 0',
  backgroundColor: '#f0f0f0',
  border: '1px solid #ccc',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '1rem'
};
