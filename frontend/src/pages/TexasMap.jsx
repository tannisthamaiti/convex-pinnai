"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  InputAdornment,
} from "@mui/material";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import "leaflet/dist/leaflet.css";

// Dummy data
const mockSurveys = [
  { id: "s1", name: "Amendment FAN 3D", type: "3D Seismic" },
  { id: "s2", name: "Amendment Ph1 & 2 Elastic FWI", type: "3D Seismic" },
  { id: "s3", name: "CaribeSPAN", type: "2D Seismic" },
  { id: "s4", name: "Catcher 3D", type: "3D Seismic" },
  { id: "s5", name: "Engagement 3D", type: "3D Seismic" },
];

const mockDataPoints = [
  { id: "1", lat: 30.2672, lng: -97.7431, type: "seismic", intensity: 0.8 },
  { id: "2", lat: 29.7604, lng: -95.3698, type: "gravity", intensity: 0.6 },
  { id: "3", lat: 32.7767, lng: -96.797, type: "magnetic", intensity: 0.9 },
  { id: "4", lat: 29.4241, lng: -98.4936, type: "seismic", intensity: 0.7 },
];

export default function TexasMapWithSidebar({
  selectedLayers = ["seismic", "gravity", "magnetic"],
  onDataPointClick = () => {},
}) {
  const [search, setSearch] = useState("");

  const getColor = (type) => {
    switch (type) {
      case "seismic":
        return "#2196f3";
      case "gravity":
        return "#f44336";
      case "magnetic":
        return "#4caf50";
      default:
        return "#9e9e9e";
    }
  };

  const filteredSurveys = mockSurveys.filter((survey) =>
    survey.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPoints = mockDataPoints.filter((pt) =>
    selectedLayers.includes(pt.type)
  );

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 300,
          bgcolor: "white",
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        <Button
          variant="outlined"
          fullWidth
          sx={{ mb: 2, textTransform: "none" }}
        >
          Filters &#x2699;
        </Button>

        <TextField
          fullWidth
          placeholder="Search Surveys"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <List sx={{ flex: 1, overflowY: "auto", mt: 1 }}>
          {filteredSurveys.map((survey) => (
            <ListItem
              key={survey.id}
              sx={{ borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}
            >
              <ListItemIcon>
                <StarIcon sx={{ color: "#2ecc71" }} />
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight={600}>{survey.name}</Typography>}
                secondary={survey.type}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 1 }} />
        <Typography variant="caption" color="text.secondary">
          Showing results 1 - {filteredSurveys.length}
        </Typography>
      </Box>

      {/* Map */}
      <Box sx={{ flex: 1 }}>
        <MapContainer
          center={[31.0, -99.0]}
          zoom={6}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredPoints.map((point) => (
            <CircleMarker
              key={point.id}
              center={[point.lat, point.lng]}
              radius={8}
              pathOptions={{
                color: getColor(point.type),
                fillOpacity: point.intensity,
              }}
              eventHandlers={{ click: () => onDataPointClick(point) }}
            >
              <Tooltip>{`${point.type} - Intensity: ${point.intensity}`}</Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </Box>
    </Box>
  );
}
