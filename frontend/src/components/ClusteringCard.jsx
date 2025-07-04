import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Slider,
} from "@mui/material";
import { BarChart } from "@mui/icons-material";
import { Map, FlashOn, Visibility, Chat as ChatIcon, PlayArrow } from "@mui/icons-material";

export default function ClusteringCard({ onRunClustering }) {
  const [open, setOpen] = useState(false);
  const [clusters, setClusters] = useState(3);

  const handleStart = () => {
    setOpen(false);
    if (onRunClustering) onRunClustering(clusters);
  };

  return (
    <>
      <Card className="shadow-md">
        <CardHeader
          avatar={<BarChart />}
          title="Clustering Analysis"
          subheader="Unsupervised well segmentation"
        />
        <CardContent>
          <Typography variant="body2" className="text-gray-600">
            Uses k-means to discover cluster groups in multivariate well data. Preview via PCA projection.
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
            Start Clustering
          </Button>
        </CardActions>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Select number of clusters</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>Clusters: {clusters}</Typography>
          <Slider
            value={clusters}
            onChange={(e, v) => setClusters(v)}
            valueLabelDisplay="auto"
            min={2}
            max={10}
            step={1}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleStart}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
