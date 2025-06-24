import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModelTrainingModal from "../components/ModelTrainingModal";
import ConvexChat from "./ConvexChat";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Paper,
  Box,
} from "@mui/material";
import {
  PlayArrow,
  Settings,
  BarChart,
  Map,
  FlashOn,
  Visibility,
  Chat,
  TrendingUp,
} from "@mui/icons-material";

function formatTimestamped(message) {
  const now = new Date();
  return `${now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })} - ${message}`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [showProcessing, setShowProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState(null);
  const [pipelineLogs, setPipelineLogs] = useState([]);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [clusters, setClusters] = useState(3);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    console.log("🔧 Cluster state updated to:", clusters);
  }, [clusters]);

  const handleModelSelect = async (type) => {
    setShowTrainingModal(false);
    if (type === "unsupervised") {
      await handleROICalculate(clusters);
    }
  };

  const handleShowMap = () => navigate("/well-map");
  const handleAskImage = () => navigate("/ask-image");

  const handleROICalculate = async (clusterValue = clusters) => {
    setShowProcessing(true);
    setPipelineLogs([
      formatTimestamped("Files uploaded to folder."),
      formatTimestamped("Ingestion Agent triggered."),
      formatTimestamped("Extracting Formation Tops..."),
    ]);

    try {
      const response = await fetch("https://etscan.org/merge-well-formation");
      const data = await response.json();

      if (data.status === "success") {
        setPipelineLogs((prev) => [
          ...prev,
          formatTimestamped(`✅ Formation Tops extracted. Rows: ${data.rows}`),
          formatTimestamped(`📁 Output File: ${data.output}`),
          formatTimestamped("🧠 Triggering PCA Cluster..."),
        ]);

        const pcaResponse = await fetch("https://etscan.org/sparsity-check", {
          method: "POST",
        });
        const pcaData = await pcaResponse.json();

        if (pcaResponse.ok && pcaData.result) {
          setPipelineLogs((prev) => [
            ...prev,
            formatTimestamped(`Filtered data complete: ${pcaData.result}`),
            formatTimestamped(`Generating PCA plot on ${clusterValue} clusters`),
          ]);

          const plotResponse = await fetch("https://etscan.org/pca-plot/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cluster_number: clusterValue }),
          });

          const plotData = await plotResponse.json();

          if (plotResponse.ok && plotData.status === "success") {
            setPipelineLogs((prev) => [
              ...prev,
              formatTimestamped(`✅ ${plotData.message}`),
              formatTimestamped(`🖼️ Plot Path: ${plotData.plot_path}`),
            ]);
            setProcessingResult(plotData.result || null);
          } else {
            setPipelineLogs((prev) => [
              ...prev,
              formatTimestamped(`⚠️ PCA plot generation failed: ${JSON.stringify(plotData)}`),
            ]);
          }
        } else {
          setPipelineLogs((prev) => [
            ...prev,
            formatTimestamped(`⚠️ Filtered data failed: ${JSON.stringify(pcaData)}`),
          ]);
        }
      } else {
        setPipelineLogs((prev) => [
          ...prev,
          formatTimestamped(`API responded with status: ${data.status}`),
        ]);
      }
    } catch (error) {
      setPipelineLogs((prev) => [
        ...prev,
        formatTimestamped(`❌ API request failed: ${error.message}`),
      ]);
    }
    setShowProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto" style={{ position: "relative" }}>
        <Typography variant="h4" className="text-blue-800 font-bold mb-4">
          Well Data Analysis Dashboard
        </Typography>

        {/* Floating Chat Box */}
        {showChat && (
          <Box
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 360,
              zIndex: 1000,
            }}
          >
            <Card elevation={6}>
              {/* <CardHeader title="AI Chat Assistant" /> */}
              <CardContent>
                <ConvexChat />
              </CardContent>
            </Card>
          </Box>
        )}

        <Card className="mb-6 shadow-lg">
          <CardHeader
            title={
              <div className="flex items-center gap-2 text-blue-800">
                <BarChart /> Build Logs & Processing
              </div>
            }
          />
          <CardContent>
            <Box display="flex" gap={2} mb={2}>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => handleROICalculate()}
                disabled={showProcessing}
              >
                {showProcessing ? "Processing..." : "Data Processing"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Settings />}
                onClick={() => setShowTrainingModal(true)}
              >
                Model Training
              </Button>
            </Box>

            {pipelineLogs.length > 0 && (
              <Box bgcolor="#f9f9f9" p={2} borderRadius={2} border="1px solid #ddd" mb={2}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Pipeline Status
                </Typography>
                {pipelineLogs.map((log, idx) => (
                  <Typography key={idx} variant="body2">
                    {log}
                  </Typography>
                ))}
              </Box>
            )}

            {processingResult && (
              <Box bgcolor="#f0fdf4" p={2} borderRadius={2} border="1px solid #c6f6d5">
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Processing Result
                </Typography>
                {Object.entries(processingResult).map(([key, value]) => (
                  <Typography key={key} variant="body2">
                    <strong>{key}:</strong> {Array.isArray(value) ? value.join(", ") : value}
                  </Typography>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Four Feature Cards */}
        <Card className="mb-6 shadow-sm">
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper
                  onClick={handleShowMap}
                  elevation={0}
                  sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  cursor: "pointer",
                  minHeight: 120,
                  boxShadow: 2,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.02)",
                    backgroundColor: "#f9f9f9",
                  },
                }}

                >
                  <Map sx={{ fontSize: 40, color: "#000" }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#000" }}>
                      Pattern Recognition
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#333" }}>
                      Detects spatial and temporal similarities across wells.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  onClick={() => window.open("/digital-twin", "_blank")}
                  elevation={0}
                  sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  cursor: "pointer",
                  minHeight: 120,
                  boxShadow: 2,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.02)",
                    backgroundColor: "#f9f9f9",
                  },
                }}

                >
                  <TrendingUp sx={{ fontSize: 40, color: "#000" }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#000" }}>
                      Sensitivity Report
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#333" }}>
                      Reservoir productivity parameters analysis report.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  onClick={() => window.open("/voxel", "_blank")}
                  elevation={0}
                  sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  cursor: "pointer",
                  minHeight: 120,
                  boxShadow: 2,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.02)",
                    backgroundColor: "#f9f9f9",
                  },
                }}

                >
                  <FlashOn sx={{ fontSize: 40, color: "#000" }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#000" }}>
                      Well Planning Insights
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#333" }}>
                      Guides drilling with formation and production analysis.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  onClick={handleAskImage}
                  elevation={0}
                  sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  cursor: "pointer",
                  minHeight: 120,
                  boxShadow: 2,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.02)",
                    backgroundColor: "#f9f9f9",
                  },
                }}

                >
                  <Visibility sx={{ fontSize: 40, color: "#000" }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#000" }}>
                      Vug Analysis
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#333" }}>
                      Interpret porous zones using AI-enhanced inference.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Chat Toggle Button */}
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            startIcon={<Chat />}
            onClick={() => setShowChat(!showChat)}
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#115293" },
              color: "#fff",
            }}
          >
            {showChat ? "Hide Chat" : "Chat Now!"}
          </Button>
        </Box>
      </div>

      {showTrainingModal && (
        <ModelTrainingModal
          onClose={() => setShowTrainingModal(false)}
          onSelect={handleModelSelect}
          clusters={clusters}
          setClusters={setClusters}
        />
      )}
    </div>
  );
}
