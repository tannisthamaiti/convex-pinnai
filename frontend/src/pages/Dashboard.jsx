// Dashboard.jsx — clean, concise Material UI + Tailwind hybrid
// Combines: build‑log runner, ClusteringCard, Analysis Tools, Analysis Results, chat toggle.
// All backend URLs live in one map at the top.
// -----------------------------------------------------------------------------

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Map,
  FlashOn,
  Visibility,
  Chat as ChatIcon,
  PlayArrow,
  Analytics,
  SettingsInputComponent,
  PrecisionManufacturing,
  Timeline,
  Insights,
  Bolt,
} from "@mui/icons-material";

import ConvexChat from "./ConvexChat";
import ClusteringCard from "../components/ClusteringCard";

// -----------------------------------------------------------------------------
//  Backend routes — edit here only
// -----------------------------------------------------------------------------
const URLS = {
  mergeFormation: "https://etscan.org/merge-well-formation",
  sparsityCheck: "https://etscan.org/sparsity-check",
  pcaPlot: "https://etscan.org/pca-plot/",
};

const ts = (msg) => `${new Date().toLocaleTimeString([], { hour12: false })} – ${msg}`;

export default function Dashboard() {
  const navigate = useNavigate();

  // ---------------- state ----------------
  const [processing, setProcessing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [showChat, setShowChat] = useState(false);

  // ---------------- handlers -------------
  const runPipeline = async (k = 3) => {
    setProcessing(true);
    setError("");
    setLogs([ts("Files uploaded."), ts("Ingestion Agent triggered."), ts("Extracting Formation Tops…")]);

    try {
      // 1️⃣ Merge formation tops
      const merge = await fetch(URLS.mergeFormation).then((r) => r.json());
      if (merge.status !== "success") throw new Error("Merge failed");
      setLogs((p) => [...p, ts(`✅ Formation Tops extracted. Rows: ${merge.rows}`), ts("🧪 Running sparsity check…")]);

      // 2️⃣ Sparsity check
      const sparse = await fetch(URLS.sparsityCheck, { method: "POST" }).then((r) => r.json());
      if (!sparse.result) throw new Error("Sparsity check failed");
      setLogs((p) => [...p, ts(`Filtered data complete: ${sparse.result}`), ts(`📊 Generating PCA plot for ${k} clusters…`)]);

      // 3️⃣ PCA plot
      const plot = await fetch(URLS.pcaPlot, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cluster_number: k }),
      }).then((r) => r.json());
      if (plot.status !== "success") throw new Error("PCA failed");
      setLogs((p) => [...p, ts(`✅ ${plot.message}`), ts(`🖼️ Plot saved: ${plot.plot_path}`)]);
    } catch (e) {
      setError(e.message);
      setLogs((p) => [...p, ts(`❌ ${e.message}`)]);
    } finally {
      setProcessing(false);
    }
  };

  // ---------------- JSX ------------------
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto relative">
        {/* title */}
        <Typography variant="h4" className="text-blue-800 font-bold mb-4">
          MLOps Dashboard
        </Typography>

        {/* floating chat */}
        {showChat && (
          <Box sx={{ position: "absolute", top: 20, right: 20, width: 360, zIndex: 1000 }}>
            <Card elevation={6}>
              <CardContent>
                <ConvexChat />
              </CardContent>
            </Card>
          </Box>
        )}

        {/* processing card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader title={<Box className="flex items-center gap-2 text-blue-800"><BarChart /> Build Logs & Processing</Box>} />
          <CardContent>
            <Box display="flex" gap={2} mb={2}>
              <Button
                variant="contained"
                startIcon={processing ? <CircularProgress size={16} color="inherit" /> : <PlayArrow />}
                disabled={processing}
                onClick={() => runPipeline()}
              >
                {processing ? "Processing…" : "Data Processing"}
              </Button>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {logs.length > 0 && (
              <Box bgcolor="#fafafa" p={2} borderRadius={2} border="1px solid #e2e8f0" sx={{ maxHeight: 260, overflowY: "auto" }}>
                {logs.map((l, i) => (
                  <Typography key={i} variant="body2">{l}</Typography>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Analysis Tools */}
        <Typography variant="h5" className="font-semibold mb-1">Analysis Tools</Typography>
        <Typography variant="body2" color="textSecondary" className="mb-3">Advanced ML utilities</Typography>

        <Grid container spacing={3} className="mb-10">
          <Grid item xs={12} md={6} lg={4}><ClusteringCard onRunClustering={runPipeline} /></Grid>
          {[{ icon: <SettingsInputComponent />, title: "Classification Models", route: "/classification" },
            { icon: <Timeline />, title: "Regression Analysis", route: "/regression" },
            { icon: <PrecisionManufacturing />, title: "Model Evaluation", route: "/evaluation" },
            { icon: <Bolt />, title: "Feature Engineering", route: "/features" },
            { icon: <Visibility />, title: "Model Monitoring", route: "/monitoring" }].map((t, i) => (
              <Grid item xs={12} md={6} lg={4} key={i}>
                <Card className="shadow-sm cursor-pointer" onClick={() => navigate(t.route)}>
                  <CardHeader avatar={t.icon} title={t.title} />
                </Card>
              </Grid>
            ))}
        </Grid>

        {/* Analysis Results */}
        <Typography variant="h5" className="font-semibold mb-1">Analysis Results</Typography>
        <Typography variant="body2" color="textSecondary" className="mb-3">Specialized insights</Typography>

        <Grid container spacing={3}>
          {[{ icon: <Analytics />, title: "Pattern Recognition", desc: "Detects spatial similarities", route: "/well-map" },
            { icon: <Insights />, title: "Sensitivity Report", desc: "Reservoir parameters analysis", route: "/sensitivity" },
            { icon: <Map />, title: "Well Planning Insights", desc: "Guides drilling analysis", route: "/planning" },
            { icon: <FlashOn />, title: "Vug Analysis", desc: "Interpret porous zones", route: "/vugs", color: "error" }].map((r, i) => (
              <Grid item xs={12} md={6} key={i}>
                <Card className="shadow-sm cursor-pointer" onClick={() => navigate(r.route)}>
                  <CardHeader avatar={r.icon} title={r.title} />
                  <CardContent><Typography variant="body2">{r.desc}</Typography></CardContent>
                  <CardActions><Button variant="contained" color={r.color || "primary"}>Launch Tool</Button></CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>

        {/* chat toggle */}
        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button variant="contained" startIcon={<ChatIcon />} onClick={() => setShowChat(!showChat)}>
            {showChat ? "Hide Chat" : "Chat Now!"}
          </Button>
        </Box>
      </div>
    </div>
  );
}
