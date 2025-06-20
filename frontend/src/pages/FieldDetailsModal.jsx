import React from 'react';

const fieldData = {
  "Campo Grande": {
    Location: "38 km from São Mateus",
    "Discovery Date": "May 1975",
    "Production Start": "August 2008",
    Wells: "10 drilled, 2 producing",
    Reservoir: "Turbiditic sandstone of the Urucutuca Formation",
    Porosity: "21%",
    Permeability: "Variable (affected by shale intercalations)",
    "Oil Gravity": "24° API",
    "Production Zones": "URUC10 (oil) and URUC20 (gas)",
  },
  "Córrego Dourado": {
    Location: "São Mateus Municipality",
    "Discovery Date": "May 1975",
    "Production Start": "August 2008",
    Wells: "8 drilled, 4 producing",
    Reservoir: "Fluviodeltaic sandstone of the Mariricu Formation",
    Porosity: "17%",
    Permeability: "100 millidarcys",
    "Oil Gravity": "13.6° API",
    "Primary Drive Mechanism": "Solution gas drive",
    "Enhanced Recovery": "Cyclic steam injection",
  }
};

export default function FieldDetailsModal({ fieldName, onClose }) {
  const data = fieldData[fieldName];

  return (
    <div style={{ padding: '2rem', textAlign: 'left', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>{fieldName} Field Details</h2>
      {data ? (
        <div style={{ marginTop: '1rem', lineHeight: '1.6', fontSize: '1rem' }}>
          {Object.entries(data).map(([key, value]) => (
            <div key={key}><strong>{key}:</strong> {value}</div>
          ))}
        </div>
      ) : (
        <p>No details available for this field.</p>
      )}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          onClick={onClose}
          style={{
            background: 'red',
            color: 'white',
            padding: '0.5rem 1.5rem',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
