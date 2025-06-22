"use client"

import { useState } from "react"
import {
  Typography,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Divider,
} from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "#fafafa",
            "&:hover fieldset": {
              borderColor: "#1976d2",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1976d2",
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#fafafa",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          padding: "12px 24px",
        },
      },
    },
  },
})

export default function UploadForm({ open, onClose, onUpload }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    fileType: "Seismic",
    wellCoordinates: "Yes",
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)
    if (file && !formData.name) {
      setFormData((prev) => ({ ...prev, name: file.name.split(".")[0] }))
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setSelectedFile(file)
      if (!formData.name) {
        setFormData((prev) => ({ ...prev, name: file.name.split(".")[0] }))
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      fileType: "Seismic",
      wellCoordinates: "Yes",
    })
    setSelectedFile(null)
    onClose()
  }

  const handleSave = () => {
    if (selectedFile && onUpload) {
      const fileData = {
        ...formData,
        file: selectedFile,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        uploadDate: new Date().toISOString(),
      }
      onUpload(fileData)
    }
    handleCancel()
  }

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {/* Header */}
          <Box className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 16,
                top: 16,
                color: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </IconButton>
            <Typography variant="h4" className="font-bold mb-2">
              Upload Data File
            </Typography>
            <Typography variant="body1" className="opacity-90">
              Add geological data to your project
            </Typography>
          </Box>

          <Box className="p-8 space-y-8">
            {/* File Upload Zone */}
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : selectedFile
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="hidden"
                accept=".csv,.pdf,.seg,.docx,.xlsx,.txt"
              />

              {selectedFile ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <Typography variant="h6" className="font-semibold text-gray-800">
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="body2" className="text-gray-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </Typography>
                  </div>
                  <Button variant="outlined" onClick={() => setSelectedFile(null)} size="small">
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <Typography variant="h6" className="font-semibold text-gray-800 mb-2">
                      Drop your file here, or{" "}
                      <label htmlFor="file-upload" className="text-blue-600 cursor-pointer hover:underline">
                        browse
                      </label>
                    </Typography>
                    <Typography variant="body2" className="text-gray-500">
                      Supports: CSV, PDF, SEG, DOCX, XLSX, TXT
                    </Typography>
                  </div>
                </div>
              )}
            </div>

            <Divider />

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Typography variant="subtitle1" className="font-semibold text-gray-700">
                  File Name *
                </Typography>
                <TextField
                  fullWidth
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter file name"
                  required
                />
              </div>

              {/* File Type */}
              <div className="space-y-2">
                <Typography variant="subtitle1" className="font-semibold text-gray-700">
                  File Type *
                </Typography>
                <FormControl fullWidth required>
                  <Select value={formData.fileType} onChange={(e) => handleInputChange("fileType", e.target.value)}>
                    <MenuItem value="Seismic">🌊 Seismic Data</MenuItem>
                    <MenuItem value="Well Log">🛢️ Well Log</MenuItem>
                    <MenuItem value="Production">📊 Production Data</MenuItem>
                    <MenuItem value="Geological">🗻 Geological Survey</MenuItem>
                    <MenuItem value="Geophysical">⚡ Geophysical Data</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Slug Field */}
            <div className="space-y-2">
              <Typography variant="subtitle1" className="font-semibold text-gray-700">
                URL Slug
              </Typography>
              <TextField
                fullWidth
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="auto-generated-from-filename"
                helperText="Leave empty to auto-generate from filename"
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Typography variant="subtitle1" className="font-semibold text-gray-700">
                Description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Add a description for this file..."
              />
            </div>

            {/* Well Coordinates */}
            <div className="space-y-3">
              <Typography variant="subtitle1" className="font-semibold text-gray-700">
                Contains Well Coordinates *
              </Typography>
              <RadioGroup
                row
                value={formData.wellCoordinates}
                onChange={(e) => handleInputChange("wellCoordinates", e.target.value)}
                sx={{
                  "& .MuiFormControlLabel-root": {
                    backgroundColor: "#f8f9fa",
                    margin: "0 8px 0 0",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    border: "2px solid transparent",
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                    },
                  },
                  "& .MuiFormControlLabel-root:has(.Mui-checked)": {
                    backgroundColor: "#e3f2fd",
                    borderColor: "#1976d2",
                  },
                }}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <Button variant="outlined" onClick={handleCancel} size="large">
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={!selectedFile || !formData.name}
                size="large"
                sx={{
                  background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                  boxShadow: "0 3px 5px 2px rgba(25, 118, 210, .3)",
                }}
              >
                Save & Upload
              </Button>
            </div>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  )
}
