// components/PipelineStatusCard.jsx
// -----------------------------------------------------------------------------
// Stateless UI-only progress widget.
// Feed it `total` and `current` via props when you wire it to real data.

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Grid,
} from "@mui/material";
import {
  CheckCircleOutline,
  HourglassEmpty,
  RadioButtonUnchecked,
} from "@mui/icons-material";

export default function PipelineStatusCard({
  total = 6,
  current = 2, // 0-based index of current stage (mock: “Process”)
  stages = ["Upload", "Clean", "Process", "Cluster", "Supervise", "Results"],
}) {
  const pct = (current / total) * 100;

  return (
    <Card variant="outlined" sx={{ mb: 4 }}>
      <CardContent>
        {/* Heading */}
        <Box display="flex" alignItems="center" mb={0.5}>
          <Box
            sx={{
              width: 8,
              height: 8,
              bgcolor: "primary.main",
              borderRadius: "50%",
              mr: 1,
            }}
          />
          <Typography variant="h6">Current Pipeline Status</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Track your ML pipeline progress from data upload to model deployment
        </Typography>

        {/* Progress bar label */}
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="subtitle2">Pipeline Progress</Typography>
          <Typography variant="subtitle2">
            {current}/{total} completed
          </Typography>
        </Box>

        {/* Progress bar */}
        <LinearProgress
          variant="determinate"
          value={pct}
          sx={{ height: 8, borderRadius: 2 }}
        />

        {/* Stage icons */}
        <Grid container justifyContent="space-between" mt={2}>
          {stages.map((label, idx) => {
            const state =
              idx < current ? "done" : idx === current ? "current" : "todo";
            const icon =
              state === "done" ? (
                <CheckCircleOutline color="success" />
              ) : state === "current" ? (
                <HourglassEmpty color="primary" />
              ) : (
                <RadioButtonUnchecked color="disabled" />
              );
            const color =
              state === "done"
                ? "success.main"
                : state === "current"
                ? "primary.main"
                : "text.secondary";
            return (
              <Grid
                item
                xs={2}
                key={label}
                textAlign="center"
                sx={{ minWidth: 90 }}
              >
                {icon}
                <Typography
                  variant="caption"
                  mt={0.5}
                  sx={{
                    color,
                    fontWeight: state === "current" ? 600 : 400,
                  }}
                >
                  {label}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
}
