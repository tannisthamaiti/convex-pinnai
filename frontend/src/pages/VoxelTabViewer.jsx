"use client";

import React, { useState } from "react";
import RawDataViewer from "./RawDataViewer";
import DualViewer from "./DualSurfacePlot";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Container,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",
    },
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function VoxelTabViewer() {
  const [tabValue, setTabValue] = useState(0);
  const [depthRange, setDepthRange] = useState([2000, 8000]);
  const [latRange, setLatRange] = useState([32, 34]);
  const [longRange, setLongRange] = useState([-102, -100]);
  const [formation, setFormation] = useState("All");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" className="py-6">
        <Paper elevation={0} className="bg-white">
          {/* Navigation Tabs */}
          <Box className="border-b border-gray-200">
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              className="px-6"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  "&.Mui-selected": {
                    color: "#2563eb",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#2563eb",
                },
              }}
            >
              <Tab label="RAW DATA" />
              <Tab label="SUPERVISED ANALYSIS" />
              <Tab label="PRODUCTION" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <TabPanel value={tabValue} index={0}>
            <Paper elevation={1} className="bg-gray-50 rounded-lg overflow-auto" sx={{ height: 400 }}>
                <RawDataViewer />
              </Paper>

              <Box className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg max-w-4xl mx-auto">
                <Typography variant="body1" className="text-gray-700">
                  <span className="font-semibold text-blue-700">Answer:</span>{" "}
                  Displays the original dataset including spatial, geological, and production attributes from wells.
                  Useful for exploring raw inputs.
                </Typography>
              </Box>
            
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Paper elevation={1} className="bg-gray-50 rounded-lg overflow-auto" sx={{ height: 400 }}>
                <RawDataViewer />
              </Paper>
            <Box className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg max-w-4xl mx-auto">
                <Typography variant="body1" className="text-gray-700">
                  <span className="font-semibold text-blue-700">Answer:</span>{" "}
                  Displays the original dataset including spatial, geological, and production attributes from wells.
                  Useful for exploring raw inputs.
                </Typography>
              </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
             <Paper elevation={1} className="bg-gray-50 rounded-lg overflow-auto" sx={{ height: 400 }}>
                <DualViewer />
              </Paper>
              <Box className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg max-w-4xl mx-auto">
                <Typography variant="body1" className="text-gray-700">
                  <span className="font-semibold text-blue-700">Answer:</span>{" "}
                  Displays the original dataset including spatial, geological, and production attributes from wells.
                  Useful for exploring raw inputs.
                </Typography>
              </Box>
          </TabPanel>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

function RangeSlider({ label, value, setValue, min, max, step = 1 }) {
  return (
    <div className="min-w-[200px]">
      <Typography variant="body2" className="text-gray-700 mb-2 font-medium">
        {label}
      </Typography>
      <Slider
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        valueLabelDisplay="auto"
        min={min}
        max={max}
        step={step}
        className="text-blue-600"
        sx={{
          "& .MuiSlider-thumb": {
            backgroundColor: "#2563eb",
          },
          "& .MuiSlider-track": {
            backgroundColor: "#2563eb",
          },
          "& .MuiSlider-rail": {
            backgroundColor: "#e5e7eb",
          },
        }}
      />
    </div>
  );
}

function EmptyState({ title, subtitle }) {
  return (
    <div className="text-center py-12">
      <Typography variant="h6" className="text-gray-500">
        {title}
      </Typography>
      <Typography variant="body2" className="text-gray-400 mt-2">
        {subtitle}
      </Typography>
    </div>
  );
}
