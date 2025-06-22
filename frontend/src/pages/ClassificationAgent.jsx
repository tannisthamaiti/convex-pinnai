import React, { useState } from 'react';
import well1Log from '../../public/S1.png';  // 858d3b...png (log image for Well-1)
import well2Log from '../../public/S2.png';     // log image for Well-2

export default function ClassificationAgent() {
  const [selectedWell, setSelectedWell] = useState(null);

  const cellStyle = {
    border: '2px solid black',
    padding: '10px',
    textAlign: 'center',
    cursor: 'pointer'
  };

  const handleClick = (wellName) => {
    setSelectedWell(wellName);
  };

  return (
    <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', alignItems: 'flex-start' }}>
        {/* Main Classification Scatter Image */}
        <div style={{ flex: 1 }}>
          <img
            src= "https://etscan.org/show-image"
            alt="Classification Overview"
            style={{
              width: '100%',
              maxWidth: '600px',
              height: 'auto',
              border: '2px solid #000',
              borderRadius: '4px'
            }}
          />
        </div>

        {/* Well Confidence Table */}
        <div style={{ flex: 1 }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={cellStyle}>Well</th>
                <th style={cellStyle}>Confidence</th>
              </tr>
            </thead>
            <tbody>
              <tr onClick={() => handleClick('Well-1')}>
                <td style={cellStyle}>Well-1</td>
                <td style={cellStyle}>56.1</td>
              </tr>
              <tr onClick={() => handleClick('Well-2')}>
                <td style={cellStyle}>Well-2</td>
                <td style={cellStyle}>34.8</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Log Plot Viewer */}
      {selectedWell && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h3>{selectedWell} Log Plot</h3>
          <img
            src={selectedWell === 'Well-1' ? well2Log : well2Log}
            alt={`${selectedWell} log plot`}
            style={{
              width: '90%',
              maxWidth: '800px',
              border: '2px solid #000',
              borderRadius: '4px',
              marginTop: '1rem'
            }}
          />
        </div>
      )}
    </div>
  );
}

