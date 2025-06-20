import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';



export default function WellMap() {
  const iframeRef = useRef(null);
  const [selectedData, setSelectedData] = useState([]);
  const [agentMessage, setAgentMessage] = useState("");
  const navigate = useNavigate();

  const handleAgentClick = (type) => {
  if (type === 'Cluster Analysis') {
    navigate('/classification-agent');
    return;
  }

  const base = selectedData.length;
  const responses = {
    Regression: `Try Linear Regression or XGBoost. Confidence: ${Math.min(90, base * 1.5)}%`,
    'Anomaly Detection': `Use Isolation Forest or Autoencoder. Confidence: ${Math.min(80, base)}%`
  };
  setAgentMessage(responses[type]);
};

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

  return (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
    {/* Header */}
    <header style={{ background: '#1976d2', color: '#fff', padding: '1rem' }}>
      <h2>Well Map Visualization</h2>
    </header>

    {/* Main Section: Map + Data */}
    <div style={{ display: 'flex', flex: 1 }}>
      {/* Plotly Map */}
      <iframe
        ref={iframeRef}
        src="https://etscan.org/output/plot.html"
        style={{ width: '70%', height: '100%', border: 'none' }}
        title="Well Map"
      />

      {/* Selected Data Panel */}
      <div style={{ width: '30%', padding: '1rem', background: '#f8f8f8', overflowY: 'auto' }}>
        <h3>Selected Data Points</h3>
        <p><strong>Count:</strong> {selectedData.length}</p>
      </div>
    </div>

    {/* AI Agent Flow Section */}
    <div style={{ background: '#eef2f3', padding: '1rem', borderTop: '1px solid #ccc' }}>
      <h3 style={{ textAlign: 'center' }}>AI Agent Recommendation Flow</h3>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
        {['Cluster Analysis', 'Classification', 'Anomaly Detection'].map((agent, index) => (
          <div
            key={agent}
            onClick={() => handleAgentClick(agent)}
            style={{
              padding: '1rem 2rem',
              border: '3px solid black',
              borderRadius: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              minWidth: '150px',
              background: '#fff',
              fontWeight: 'bold'
            }}
          >
            {agent}
          </div>
        ))}
      </div>

      
      {/* Agent Response Box */}
      {agentMessage && (
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#e8f5e9', borderLeft: '5px solid green' }}>
          <strong>Agent Response:</strong>
          <p>{agentMessage}</p>
        </div>
      )}
    </div>
  </div>
);
}
