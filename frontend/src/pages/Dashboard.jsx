// Dashboard.jsx — Material-UI + Tailwind hybrid
// - Live Total-Datasets fetched from /upload
// - Mock values for Data-Quality, Active-Models, Processing-Jobs
// - Build-log runner + ClusteringCard + Tools/Results grids + Chat panel

import React, { useState, useEffect } from "react";
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
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  BarChart,
  Map,
  FlashOn,
  Visibility,
  Chat as ChatIcon,
  PlayArrow,
  Storage,
  CheckCircleOutline,
  TrendingUp,
  WarningAmber,
  Analytics,
  Insights,
  Bolt,
  SettingsInputComponent,
  Timeline,
} from "@mui/icons-material";
import ConvexChat from "./ConvexChat";
import ClusteringCard from "../components/ClusteringCard";

// -----------------------------------------------------------------------------
// Backend routes – change here only
// -----------------------------------------------------------------------------
const URLS = {
  totalDatasets: "/upload", // GET -> { total: number }  OR  an array you can length
  mergeFormation: "https://etscan.org/merge-well-formation",
  sparsityCheck: "https://etscan.org/sparsity-check",
  pcaPlot: "https://etscan.org/pca-plot/",
};

// helper to prepend a timestamp to log lines
const withTs = (msg) =>
  `${new Date().toLocaleTimeString([], { hour12: false })} – ${msg}`;

export default function Dashboard() {
  const navigate = useNavigate();

  // ------------- state -------------
  const [stats, setStats] = useState({ datasets: 0 });
  const [showProcessing, setShowProcessing] = useState(false);
  const [pipelineLogs, setPipelineLogs] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [err, setErr] = useState("");

  // ------------- fetch dataset count once -------------
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(URLS.totalDatasets);
        const json = await res.json();
        const total = Array.isArray(json) ? json.length : json?.total || 0;
        setStats((s) => ({ ...s, datasets: total }));
      } catch {
        // keep default 0 if request fails
      }
    })();
  }, []);

  // ------------- main pipeline handler -------------
  const handleROICalculate = async (clusters = 3) => {
    setShowProcessing(true);
    setErr("");
    setPipelineLogs([
      withTs("Files uploaded."),
      withTs("Ingestion Agent triggered."),
      withTs("Extracting Formation Tops…"),
    ]);

    try {
      // 1) Merge formation tops
      await fetch(URLS.mergeFormation);
      setPipelineLogs((p) => [
        ...p,
        withTs("✅ Formation Tops extracted."),
        withTs("🧪 Running sparsity check…"),
      ]);

      // 2) Sparsity check
      await fetch(URLS.sparsityCheck, { method: "POST" });
      setPipelineLogs((p) => [...p, withTs("📊 Generating PCA plot…")]);

      // 3) PCA plot
      await fetch(URLS.pcaPlot, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cluster_number: clusters }),
      });
      setPipelineLogs((p) => [...p, withTs("✅ PCA plot saved.")]);
    } catch (e) {
      setErr(e.message || "Pipeline failed");
      setPipelineLogs((p) => [...p, withTs(`❌ ${e.message}`)]);
    } finally {
      setShowProcessing(false);
    }
  };

  // --------------------------------------------------------------------------
  // JSX
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto relative">
        {/* ───────────── Heading ───────────── */}
        <Typography variant="h4" fontWeight={700}>
          MLOps Dashboard
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Comprehensive machine-learning operations platform for data processing and model
          management
        </Typography>

        <Box textAlign="right" mb={2}>
          <Chip label="Project: Oil & Gas Analysis" variant="outlined" size="small" />
        </Box>

        {/* ───────────── Top-stats strip ───────────── */}
        {/* ---------- Top Stats strip ---------- */}
        <Grid container spacing={3} mb={4}>
          {/* Total Datasets */}
          <Grid item xs={12} sm={6} md={3}>
            {/* Clickable → navigates to /upload */}
            <Card
              variant="outlined"
              className="h-full cursor-pointer"
              onClick={() => navigate("/upload")}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle2">Total Datasets</Typography>
                  <Storage fontSize="small" />
                </Box>
                <Typography variant="h5" fontWeight={600}>{stats.datasets}</Typography>
                <Typography variant="caption" color="textSecondary">
                  +2 from last week
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {/* Clickable → navigates to /upload */}
            <Card
              variant="outlined"
              className="h-full cursor-pointer"
              onClick={() => navigate("/roi")}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle2">ROI Calculator</Typography>
                  <Storage fontSize="small" />
                </Box>
                <Typography variant="h5" fontWeight={600}>{stats.datasets}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Select your tier's roi
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Data Quality (mock) */}
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" className="h-full">
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle2">Data Quality</Typography>
                  <CheckCircleOutline color="success" fontSize="small" />
                </Box>
                <Typography variant="h5" fontWeight={600}>94%</Typography>
                <LinearProgress variant="determinate" value={94} sx={{ height: 3, borderRadius: 1, mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>

          {/* Active Models (mock) */}
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" className="h-full">
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle2">Active Models</Typography>
                  <TrendingUp fontSize="small" />
                </Box>
                <Typography variant="h5" fontWeight={600}>8</Typography>
                <Typography variant="caption" color="textSecondary">3 in production</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Processing Jobs (mock) */}
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" className="h-full">
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle2">Processing Jobs</Typography>
                  <WarningAmber color="warning" fontSize="small" />
                </Box>
                <Typography variant="h5" fontWeight={600}>3</Typography>
                <Typography variant="caption" color="textSecondary">2 running, 1 queued</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>


        {/* ───────────── Build-logs & processing ───────────── */}
        <Card className="mb-8 shadow-lg">
          <CardHeader
            title={
              <Box display="flex" alignItems="center" gap={1} color="primary.main">
                <BarChart />
                Build Logs & Processing
              </Box>
            }
          />
          <CardContent>
            <Box display="flex" gap={2} mb={2}>
              <Button
                variant="contained"
                startIcon={
                  showProcessing ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <PlayArrow />
                  )
                }
                disabled={showProcessing}
                onClick={() => handleROICalculate()}
              >
                {showProcessing ? "Processing…" : "Data Processing"}
              </Button>
            </Box>

            {err && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {err}
              </Alert>
            )}

            {pipelineLogs.length > 0 && (
              <Box
                sx={{
                  bgcolor: "#fafafa",
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #e2e8f0",
                  maxHeight: 260,
                  overflowY: "auto",
                  mb: 2,
                }}
              >
                {pipelineLogs.map((l, i) => (
                  <Typography key={i} variant="body2">
                    {l}
                  </Typography>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* ───────────── Analysis Tools ───────────── */}
        <Typography variant="h5" fontWeight={600} mb={1}>
          Analysis Tools
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Advanced machine-learning tools for clustering, classification and model evaluation
        </Typography>

        <Grid container spacing={3} mb={8}>
          {/* Clustering (separate component) */}
          <Grid item xs={12} md={6} lg={4}>
            <ClusteringCard onRunClustering={handleROICalculate} />
          </Grid>

          {/* other tool placeholders */}
          {[
            {
              icon: <SettingsInputComponent />,
              title: "Classification Models",
              desc: "Build supervised models for classification tasks",
              route: "/classification",
            },
            {
              icon: <Timeline />,
              title: "Regression Analysis",
              desc: "Predict continuous values & understand relationships",
              route: "/regression",
            },
            {
              icon: <Bolt />,
              title: "Feature Engineering",
              desc: "Automated feature selection & scaling",
              route: "/feature-engineering",
            },
          ].map((t) => (
            <ToolCard key={t.title} {...t} />
          ))}
        </Grid>

        {/* ───────────── Analysis Results ───────────── */}
        <Typography variant="h5" fontWeight={600} mb={1}>
          Analysis Results
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Specialized insights for oil-and-gas operations
        </Typography>

        <Grid container spacing={3} mb={8}>
          {[
            {
              icon: <Analytics />,
              title: "Pattern Recognition",
              desc: "Detect spatial & temporal similarities across wells",
              route: "/well-map",
              ctaColor: "primary",
            },
            {
              icon: <Insights />,
              title: "Sensitivity Report",
              desc: "Reservoir productivity parameters analysis",
              route: "/sensitivity",
              ctaColor: "inherit",
            },
            {
              icon: <Map />,
              title: "Well Planning Insights",
              desc: "Guide drilling with formation & production analysis",
              route: "/planning",
              ctaColor: "inherit",
            },
            {
              icon: <FlashOn />,
              title: "Vug Analysis",
              desc: "Interpret porous zones using AI-enhanced inference",
              route: "/vugs",
              ctaColor: "error",
            },
          ].map((r) => (
            <ResultCard key={r.title} {...r} navigate={navigate} />
          ))}
        </Grid>

        {/* ───────────── Chat toggle ───────────── */}
        {showChat && (
          <Box
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              width: 360,
              zIndex: 1300,
            }}
          >
            <Card elevation={6}>
              <CardContent>
                <ConvexChat />
              </CardContent>
            </Card>
          </Box>
        )}

        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            startIcon={<ChatIcon />}
            onClick={() => setShowChat((v) => !v)}
          >
            {showChat ? "Hide Chat" : "Chat Now!"}
          </Button>
        </Box>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Reusable tiny sub-components                                                */
/* -------------------------------------------------------------------------- */

function StatCard({ icon, title, main, sub, progress }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card variant="outlined" className="h-full">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle2">{title}</Typography>
            {icon}
          </Box>
          <Typography variant="h5" fontWeight={600}>
            {main}
          </Typography>
          {typeof progress === "number" ? (
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 3, borderRadius: 1, mt: 1 }}
            />
          ) : (
            <Typography variant="caption" color="textSecondary">
              {sub}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}

function ToolCard({ icon, title, desc, route }) {
  const navigate = useNavigate();
  return (
    <Grid item xs={12} md={6} lg={4}>
      <Card className="shadow-sm cursor-pointer h-full" onClick={() => navigate(route)}>
        <CardHeader avatar={icon} title={title} />
        <CardContent>
          <Typography variant="body2">{desc}</Typography>
        </CardContent>
        <CardActions>
          <Button variant="outlined" fullWidth startIcon={<PlayArrow />}>
            Launch Tool
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

function ResultCard({ icon, title, desc, route, ctaColor = "primary", navigate }) {
  return (
    <Grid item xs={12} md={6}>
      <Card className="shadow-sm cursor-pointer h-full" onClick={() => navigate(route)}>
        <CardHeader avatar={icon} title={title} />
        <CardContent>
          <Typography variant="body2">{desc}</Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" color={ctaColor} fullWidth>
            Launch Tool
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
