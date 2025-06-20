import React, { useState } from 'react';
import TableA5View from './TableA5View';
import FieldDetailsModal from './FieldDetailsModal';

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalContentStyle = {
  backgroundColor: '#fff',
  width: '90%',
  height: '90%',
  overflowY: 'scroll',
  borderRadius: '8px',
  position: 'relative',
  padding: '20px'
};

const closeButtonStyle = {
  position: 'absolute',
  top: 10,
  right: 10,
  background: 'red',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '0.5rem 1rem',
  cursor: 'pointer'
};

export default function DigitalTwin() {
  const [showSensitivity, setShowSensitivity] = useState(false);
  const [selectedField, setSelectedField] = useState(null);

  return (
    <>
      <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column", background: "#f0f0f0" }}>
        {/* Header */}
        <div style={{ padding: "1rem", fontSize: "1.5rem", fontWeight: "bold" }}>
          Well Visualization and Well Sensitivity
        </div>

        {/* Main content: split into 60% left, 40% right */}
        <div style={{ flex: 1, display: "flex" }}>
          {/* Left side: video section */}
          <div style={{ flex: 6, background: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <video width="95%" height="95%" controls>
              <source src="SeismicSection3D.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Right side: info panel */}
          <div style={{
            flex: 4,
            background: "#fafafa",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div>
              <h3 style={{ marginBottom: "1rem" }}>Geological Properties by Field</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#e0e0e0", textAlign: "left" }}>
                    <th style={{ padding: "5px" }}>Field</th>
                    <th style={{ padding: "5px" }}>Porosity (%)</th>
                    <th style={{ padding: "5px" }}>Permeability (mD)</th>
                    <th style={{ padding: "5px" }}>Oil API Gravity</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Campo Grande", porosity: "21", permeability: "Variable (due to shale)", gravity: "24° API" },
                    { name: "Córrego Dourado", porosity: "17", permeability: "100", gravity: "13.6° API" },
                    { name: "Fazenda Alegre", porosity: "27", permeability: "500–2,000", gravity: "13° API" },
                    { name: "Fazenda São Rafael", porosity: "10–25", permeability: "1–1,000", gravity: "Not specified" },
                    { name: "São Mateus Leste", porosity: "12–21", permeability: "10–200", gravity: "16–32° API" },
                    { name: "Tabuiaiá", porosity: "11–20", permeability: "Low", gravity: "15.5–21.1° API" },
                  ].map(field => (
                    <tr
                      key={field.name}
                      onClick={() => setSelectedField(field.name)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{field.name}</td>
                      <td>{field.porosity}</td>
                      <td>{field.permeability}</td>
                      <td>{field.gravity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Load Graph Button */}
            <div>
              <button
                onClick={() => setShowSensitivity(true)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "black",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                LOAD SENSITIVITY REPORT
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for TableA5View (Sensitivity Report) */}
      {showSensitivity && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <button onClick={() => setShowSensitivity(false)} style={closeButtonStyle}>CLOSE</button>
            <TableA5View />
          </div>
        </div>
      )}

      {/* Modal for FieldDetailsModal (Row Click) */}
      {selectedField && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <FieldDetailsModal fieldName={selectedField} onClose={() => setSelectedField(null)} />
          </div>
        </div>
      )}
    </>
  );
}
