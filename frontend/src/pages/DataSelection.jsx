"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import UploadForm from "./upload-form";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#f50057" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, textTransform: "none", fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          },
        },
      },
    },
  },
});

export default function DataSelection() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 1,
      filename: "Well_Log_1.csv",
      file_type: "Well Data",
      uploadDate: "2024-01-15",
      description: "Primary well logging data from site A-1",
      status: "processed",
    },
    {
      id: 2,
      filename: "Well_Summary.pdf",
      file_type: "Well Data",
      uploadDate: "2024-01-15",
      description: "Comprehensive well analysis report",
      status: "ready",
    },
    {
      id: 3,
      filename: "Seismic_Map_Inline.seg",
      file_type: "Seismic",
      uploadDate: "2024-01-14",
      description: "Inline seismic survey data - Block 7",
      status: "processing",
    },
    {
      id: 4,
      filename: "Seismic_Attribute_Report.docx",
      file_type: "Seismic",
      uploadDate: "2024-01-14",
      description: "Detailed seismic attribute analysis",
      status: "ready",
    },
  ]);

  /* ------------------------------------------------------------- */
  /* Fetch existing files from backend once                        */
  /* ------------------------------------------------------------- */
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("https://etscan.org/files");
        const responseText = await res.text();
        console.log("Files fetch response:", responseText);
        if (res.ok) {
          const data = JSON.parse(responseText);
          setUploadedFiles((prev) => [...prev, ...data]);
        }
      } catch (error) {
        console.error("Failed to fetch uploaded files", error);
      }
    };
    fetchFiles();
  }, []);

  /* ------------------------------------------------------------- */
  /* Handle a new upload                                           */
  /* ------------------------------------------------------------- */
  const handleUpload = async (fileData) => {
    // fileData = { file, fileType, description }
    const formData = new FormData();
    formData.append("file", fileData.file);
    formData.append("file_type", fileData.fileType);

    try {
      const res = await fetch("https://etscan.org/upload", {
        method: "POST",
        body: formData,
      });

      const responseText = await res.text();
      console.log("Upload response:", responseText);

      if (res.ok) {
        const newFile = JSON.parse(responseText);

        const formattedFile = {
          id: uploadedFiles.length + 1,
          filename: newFile.filename,
          file_type: newFile.type || newFile.file_type,
          uploadDate: new Date().toISOString().split("T")[0],
          description: fileData.description || "No description",
          status: "processing",
        };

        setUploadedFiles((prev) => [...prev, formattedFile]);
      } else {
        console.error("Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  /* ------------------------------------------------------------- */
  /* Context-menu helpers                                          */
  /* ------------------------------------------------------------- */
  const handleMenuClick = (event, file) => {
    setAnchorEl(event.currentTarget);
    setSelectedFile(file);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFile(null);
  };

  /* ------------------------------------------------------------- */
  /* UI helpers                                                    */
  /* ------------------------------------------------------------- */
  const getFileIcon = (fileName) => {
    if (!fileName) return { emoji: "📁", color: "#6b7280" };
    const ext = fileName.split(".").pop().toLowerCase();
    const icons = {
      csv:  { emoji: "📊", color: "#10b981" },
      pdf:  { emoji: "📄", color: "#ef4444" },
      seg:  { emoji: "🌊", color: "#8b5cf6" },
      docx: { emoji: "📝", color: "#3b82f6" },
      xlsx: { emoji: "📈", color: "#059669" },
    };
    return icons[ext] || { emoji: "📁", color: "#6b7280" };
  };

  /* ------------------------------------------------------------- */
  /* Group files by category                                       */
  /* ------------------------------------------------------------- */
  const groupedFiles = uploadedFiles.reduce((acc, file) => {
    const category = file.file_type === "Seismic" ? "Seismic Data" : "Well Data";
    (acc[category] ||= []).push(file);
    return acc;
  }, {});

  /* ------------------------------------------------------------- */
  /* Render                                                        */
  /* ------------------------------------------------------------- */
  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* --- Top bar --- */}
        <Box className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div>
              <Typography variant="h4" className="font-bold text-gray-800">
                Data Management
              </Typography>
              <Typography variant="body1" className="text-gray-600 mt-1">
                Upload and manage your geological data files
              </Typography>
            </div>
            <Button
              variant="contained"
              onClick={() => setUploadDialogOpen(true)}
              startIcon={<span>+</span>}
              sx={{
                background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                boxShadow: "0 3px 5px 2px rgba(25,118,210,.3)",
              }}
            >
              Upload Files
            </Button>
          </div>
        </Box>

        {/* --- Main grid --- */}
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column ------------------------------------------------ */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-4">
                <Typography variant="h6" className="font-bold text-gray-800">
                  Quick Actions
                </Typography>
                <Button fullWidth variant="outlined" onClick={() => setUploadDialogOpen(true)}>
                  Upload New File
                </Button>
                <Button fullWidth variant="outlined">Bulk Import</Button>
                <Button fullWidth variant="contained" component={Link} to="/dashboard">
                  View Dashboard
                </Button>
                <Button fullWidth variant="contained" component={Link} to="/texasmap">
                  Add more Data
                </Button>
                <Divider />
                <Typography variant="subtitle2">File Statistics</Typography>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span>Total Files</span><span>{uploadedFiles.length}</span></div>
                  <div className="flex justify-between"><span>Well Data</span><span>{groupedFiles["Well Data"]?.length || 0}</span></div>
                  <div className="flex justify-between"><span>Seismic Data</span><span>{groupedFiles["Seismic Data"]?.length || 0}</span></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column ------------------------------------------------ */}
          <div className="lg:col-span-2 space-y-8">
            {Object.entries(groupedFiles).map(([category, files]) => (
              <div key={category}>
                {/* Section header */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar sx={{ bgcolor: category === "Well Data" ? "#1976d2" : "#9c27b0" }}>
                    {category === "Well Data" ? "🛢️" : "🌊"}
                  </Avatar>
                  <div>
                    <Typography variant="h5" className="font-bold">{category}</Typography>
                    <Typography variant="body2" className="text-gray-600">{files.length} files</Typography>
                  </div>
                </div>

                {/* File cards */}
                <div className="grid grid-cols-1 gap-4">
                  {files.map((file) => {
                    const icon = getFileIcon(file.filename);
                    return (
                      <Card key={file.id}>
                        <CardContent className="p-4 flex justify-between items-start">
                          <div className="flex gap-4 items-start">
                            <div
                              className="w-12 h-12 flex items-center justify-center text-2xl rounded-lg"
                              style={{ backgroundColor: `${icon.color}20` }}
                            >
                              {icon.emoji}
                            </div>
                            <div>
                              <Typography variant="h6" className="font-semibold truncate">
                                {file.filename}
                              </Typography>
                              <Typography variant="body2" className="text-gray-600">
                                {file.description || "No description"}
                              </Typography>
                              {/* Size removed → only show date */}
                              <div className="text-sm text-gray-500 mt-1">{file.uploadDate}</div>
                            </div>
                          </div>
                          <IconButton onClick={(e) => handleMenuClick(e, file)}>⋮</IconButton>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Context menu --- */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
          <MenuItem onClick={handleMenuClose}>Download</MenuItem>
          <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
          <Divider />
          <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>Delete</MenuItem>
        </Menu>

        {/* --- Upload dialog --- */}
        <UploadForm
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          onUpload={handleUpload}
        />
      </div>
    </ThemeProvider>
  );
}
