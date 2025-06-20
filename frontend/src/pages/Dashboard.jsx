import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ModelTrainingModal from '../components/ModelTrainingModal';
import ConvexChat from './ConvexChat'; // ✅ Make sure this path is correct

function formatTimestamped(message) {
  const now = new Date();
  return `${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} - ${message}`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [showProcessing, setShowProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState(null);
  const [pipelineLogs, setPipelineLogs] = useState([]);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [clusters, setClusters] = useState(3);
  const [showChat, setShowChat] = useState(false); // ✅ toggle chat

  useEffect(() => {
    console.log("🔧 Cluster state updated to:", clusters);
  }, [clusters]);

  const handleModelSelect = async (type) => {
    setShowTrainingModal(false);
    if (type === 'unsupervised') {
      await handleROICalculate(clusters);
    }
  };

  const handleShowMap = () => navigate("/well-map");
  const handleAskImage = () => navigate("/ask-image");

  const handleROICalculate = async (clusterValue = clusters) => {
    setShowProcessing(true);
    setPipelineLogs([
      formatTimestamped('Files uploaded to folder.'),
      formatTimestamped('Ingestion Agent triggered.'),
      formatTimestamped('Extracting Formation Tops...'),
    ]);

    try {
      const response = await fetch('https://etscan.org/merge-well-formation');
      const data = await response.json();

      if (data.status === 'success') {
        setPipelineLogs(prev => [
          ...prev,
          formatTimestamped(`✅ Formation Tops extracted. Rows: ${data.rows}`),
          formatTimestamped(`📁 Output File: ${data.output}`),
          formatTimestamped('🧠 Triggering PCA Cluster...'),
        ]);

        const pcaResponse = await fetch('https://etscan.org/sparsity-check', { method: 'POST' });
        const pcaData = await pcaResponse.json();

        if (pcaResponse.ok && pcaData.result) {
          setPipelineLogs(prev => [
            ...prev,
            formatTimestamped(`Filtered data complete: ${pcaData.result}`),
            formatTimestamped(`Generating PCA plot on ${clusterValue} clusters`),
          ]);

          const plotResponse = await fetch('https://etscan.org/pca-plot/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cluster_number: clusterValue }),
          });

          const plotData = await plotResponse.json();

          if (plotResponse.ok && plotData.status === 'success') {
            setPipelineLogs(prev => [
              ...prev,
              formatTimestamped(`✅ ${plotData.message}`),
              formatTimestamped(`🖼️ Plot Path: ${plotData.plot_path}`),
            ]);
          } else {
            setPipelineLogs(prev => [
              ...prev,
              formatTimestamped(`⚠️ PCA plot generation failed: ${JSON.stringify(plotData)}`),
            ]);
          }
        } else {
          setPipelineLogs(prev => [
            ...prev,
            formatTimestamped(`⚠️ Filtered data failed: ${JSON.stringify(pcaData)}`),
          ]);
        }
      } else {
        setPipelineLogs(prev => [
          ...prev,
          formatTimestamped(`API responded with status: ${data.status}`),
        ]);
      }
    } catch (error) {
      setPipelineLogs(prev => [
        ...prev,
        formatTimestamped(`❌ API request failed: ${error.message}`),
      ]);
    }
  };

  const handleProcessingComplete = (finalData) => {
    setProcessingResult(finalData);
    setShowProcessing(false);
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', background: '#f5f8fc', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.8rem', fontWeight: 600 }}>
          File Summary and Mapping of Wells
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1, background: 'white', padding: '1rem', borderRadius: '10px', boxShadow: '0 0 5px rgba(0,0,0,0.1)', textAlign: 'left' }}>
            <h3>Build Logs</h3>
            <button
              onClick={() => handleROICalculate()}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                marginBottom: '1rem'
              }}
            >
              Data Processing
            </button>
            <button
              onClick={() => setShowTrainingModal(true)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                marginBottom: '1rem',
                marginLeft: '1rem'
              }}
            >
              Model Training
            </button>

            {pipelineLogs.length > 0 && (
              <div style={{ marginTop: '1rem', backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '6px', border: '1px solid #ddd' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Pipeline Status</div>
                {pipelineLogs.map((log, idx) => (
                  <div key={idx}>{log}</div>
                ))}
              </div>
            )}

            {processingResult && (
              <div style={{ marginTop: '1rem', backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '6px', border: '1px solid #ddd' }}>
                <div><strong>Total Wells:</strong> {processingResult.wells}</div>
                <div><strong>Log Types:</strong> {processingResult.logs.join(', ')}</div>
                <div><strong>Composite Index:</strong> {processingResult.index}</div>
                <div><strong>Data Source:</strong> {processingResult.source}</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h3>Data Inspection and Inference</h3>
          <p>Your files are being processed and analyzed.</p>
          <button onClick={handleShowMap} style={{ margin: '0.5rem', padding: '0.5rem 1rem', minWidth: '200px', backgroundColor: '#1e88e5', color: 'white', border: 'none', borderRadius: '4px' }}> Inference</button>
          <button onClick={() => window.open("/digital-twin", "_blank")} style={{ margin: '0.5rem', padding: '0.5rem 1rem', minWidth: '200px', backgroundColor: '#1e88e5', color: 'white', border: 'none', borderRadius: '4px' }}>Production Results</button>
          <button onClick={() => window.open("/voxel", "_blank")} style={{ margin: '0.5rem', padding: '0.5rem 1rem', minWidth: '200px', backgroundColor: '#1e88e5', color: 'white', border: 'none', borderRadius: '4px' }}>Supervised Analysis</button>
          <button onClick={handleAskImage} style={{ margin: '0.5rem', padding: '0.5rem 1rem', minWidth: '200px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px' }}>Vug Analysis</button>
        </div>
      </div>

      {showTrainingModal && (
        <ModelTrainingModal
          onClose={() => setShowTrainingModal(false)}
          onSelect={handleModelSelect}
          clusters={clusters}
          setClusters={setClusters}
        />
      )}

      {/* ✅ Floating Chat Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#FFBF00',
          color: '#000',
          padding: '12px 20px',
          border: 'none',
          borderRadius: '50px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}
      >
        Chat Now!
      </button>

      {/* ✅ Show chat only when toggled */}
      {showChat && <ConvexChat />}
    </div>
  );
}
