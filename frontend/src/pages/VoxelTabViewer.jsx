import React, { useState } from "react";
import { Button, ButtonGroup, Typography } from "@mui/material";
import RawDataViewer from "./RawDataViewer";
import SupervisedAnalysisViewer from "./SupervisedAnalysisViewer";
import SurfacePlot from "./SurfacePlot";
import DualViewer from "./DualSurfacePlot"
import VoxelViewerCore from "./VoxelViewerCore"; // Optional, if you use it in a future tab

const VoxelTabViewer = () => {
  const [tab, setTab] = useState("raw");

  const getDescription = () => {
    switch (tab) {
      case "raw":
        return "Displays the original dataset including spatial, geological, and production attributes from wells. Useful for exploring raw inputs.";
      case "supervised":
        return "Presents results from supervised machine learning models that predict production potential or classify geological formations.";
      case "3d":
        return "Visualizes cumulative oil production (WELL CUMOIL) in a 3D surface plot using spatial coordinates. Highlights production intensity using color gradients. 2nd plot shows the best well planning section based on CUMOIL.";
      default:
        return "";
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <ButtonGroup variant="outlined" style={{ marginBottom: "1rem" }}>
        <Button onClick={() => setTab("raw")} style={{ borderColor: "black" }}>
          Raw Data
        </Button>
        <Button onClick={() => setTab("supervised")} style={{ borderColor: "black" }}>
          Supervised Analysis
        </Button>
        <Button onClick={() => setTab("3d")} style={{ borderColor: "black" }}>
          Production
        </Button>
      </ButtonGroup>

      <Typography variant="subtitle1" style={{ marginBottom: "1rem", color: "#555" }}>
        {getDescription()}
      </Typography>

      {tab === "raw" && <RawDataViewer />}
      {tab === "supervised" && <SupervisedAnalysisViewer />}
      {tab === "3d" && <DualViewer />}
    </div>
  );
};

export default VoxelTabViewer;
