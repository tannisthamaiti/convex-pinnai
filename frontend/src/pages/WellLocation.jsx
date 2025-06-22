import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonGroup, Typography } from '@mui/material';

export default function WellLocation() {
  const iframeRef = useRef(null);
  const [selectedData, setSelectedData] = useState([]);
  const [agentMessage, setAgentMessage] = useState('');
  const navigate = useNavigate();

  // Handle incoming data from iframe
  useEffect(() => {
    function handleMessage(event) {
      if (event?.data?.type === 'well-selection') {
        console.log('📥 Data received from iframe:', event.data.payload);
        setSelectedData(event.data.payload.data || []);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Handle agent suggestion based on selected data count
  const handleAgentClick = (type) => {
    const base = selectedData.length;
    const responses = {
      Regression: `Try Linear Regression or XGBoost.\nConfidence: ${Math.min(90, base * 1.5).toFixed(1)}%`,
      'Anomaly Detection': `Use Isolation Forest or Autoencoder.\nConfidence: ${Math.min(80, base).toFixed(1)}%`,
    };
    setAgentMessage(responses[type]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Main Section: Map + Data */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Plotly Map Iframe */}
        <iframe
          ref={iframeRef}
          src="https://etscan.org/output/plot.html"
          style={{ width: '70%', height: '100%', border: 'none' }}
          title="Well Location"
        />

        {/* Selected Data Panel */}
        <div style={{ width: '30%', padding: '1rem', background: '#f8f8f8', overflowY: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Selected Data Points
          </Typography>
          <Typography variant="body1">
            <strong>Count:</strong> {selectedData.length}
          </Typography>

          
        </div>
      </div>
    </div>
  );
}
