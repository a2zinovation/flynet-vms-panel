import React, { useState, useEffect } from "react";
import HomeIcon from "@mui/icons-material/Home";
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { cameraService } from "../services/cameras";

import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  IconButton,
  Slider,
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MapLocationPicker from "../components/MapLocationPicker";

const steps = ['Basic Data', 'Connection', 'Plan', 'Location'];

export default function CamerasRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cameraId = searchParams.get('id');
  const isEditMode = Boolean(cameraId);

  // Stepper state
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Basic Data
    name: "",
    manufacturer: "RTSP/RTMP Generic",
    protocol: "RTSP",
    server: "FlynetES-01",
    
    // Connection (RTSP)
    rtspUrl: "",
    username: "",
    password: "",
    host: "",
    port: "554",
    
    // Connection (RTMP)
    rtmpUrl: "",
    
    // Plan
    storageDays: 12,
    preAlarmSeconds: 5,
    
    // Location
    address: "",
    latitude: 40.7128,
    longitude: -74.0060,
    
    // Additional fields
    resolution: "1280x720",
    type: "RTSP",
    analytical: "",
    storage: "",
    comments: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchingCamera, setFetchingCamera] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [manufacturers, setManufacturers] = useState([
    "RTSP/RTMP Generic",
    "Hikvision",
    "Dahua",
    "Axis",
    "Intelbras",
    "Tecvoz",
    "Vivotek",
    "Uniview",
  ]);

  // Fetch camera data if editing
  useEffect(() => {
    if (isEditMode && cameraId) {
      fetchCamera();
    }
  }, [cameraId, isEditMode]);

  const fetchCamera = async () => {
    try {
      setFetchingCamera(true);
      const response = await cameraService.getById(cameraId);
      const camera = response.data || response;
      
      setFormData({
        name: camera.name || "",
        manufacturer: camera.manufacturer || "RTSP/RTMP Generic",
        protocol: camera.protocol || "RTSP",
        server: camera.server || "FlynetES-01",
        rtspUrl: camera.rtsp_url || camera.rtspUrl || "",
        rtmpUrl: camera.rtmp_url || camera.rtmpUrl || "",
        username: camera.username || "",
        password: "",
        host: camera.host || "",
        port: camera.port || "554",
        storageDays: camera.storage_days || camera.storageDays || 12,
        preAlarmSeconds: camera.pre_alarm_seconds || camera.preAlarmSeconds || 5,
        address: camera.address || "",
        latitude: camera.latitude || 40.7128,
        longitude: camera.longitude || -74.0060,
        resolution: camera.resolution || "1280x720",
        type: camera.type || "RTSP",
        analytical: camera.analytical || "",
        storage: camera.storage || "",
        comments: camera.comments || "",
      });
    } catch (err) {
      console.error("Error fetching camera:", err);
      setError(err.message || "Failed to load camera data");
    } finally {
      setFetchingCamera(false);
    }
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleLocationChange = (latitude, longitude, address) => {
    setFormData({
      ...formData,
      latitude,
      longitude,
      address: address || formData.address,
    });
  };

  const handleNext = () => {
    // Skip Connection step for RTMP (no manual URL needed)
    if (activeStep === 0 && formData.protocol === "RTMP") {
      setActiveStep(2); // Jump to Plan
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    // Handle back navigation for RTMP
    if (activeStep === 2 && formData.protocol === "RTMP") {
      setActiveStep(0); // Jump back to Basic Data
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      // Prepare data for API
      const apiData = {
        name: formData.name,
        manufacturer: formData.manufacturer,
        protocol: formData.protocol,
        server: formData.server,
        type: formData.type,
        resolution: formData.resolution,
        storage_days: formData.storageDays,
        pre_alarm_seconds: formData.preAlarmSeconds,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        analytical: formData.analytical,
        storage: formData.storage,
        comments: formData.comments,
        status: isEditMode ? undefined : 'active', // Default to active for new cameras
      };

      // Add protocol-specific fields
      if (formData.protocol === "RTSP") {
        apiData.rtsp_url = formData.rtspUrl;
        apiData.username = formData.username;
        apiData.password = formData.password;
        apiData.host = formData.host;
        apiData.port = formData.port;
      } else if (formData.protocol === "RTMP") {
        apiData.rtmp_url = formData.rtmpUrl;
      }

      let response;
      if (isEditMode) {
        response = await cameraService.update(cameraId, apiData);
      } else {
        response = await cameraService.create(apiData);
      }

      setSnackbar({
        open: true,
        message: isEditMode ? "Camera updated successfully!" : "Camera created successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/app/cameras");
      }, 1500);
    } catch (err) {
      console.error("Error saving camera:", err);
      setError(err.message || "Failed to save camera");
      setSnackbar({
        open: true,
        message: err.message || "Failed to save camera",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Basic Data
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={handleChange("name")}
                placeholder="Enter camera name"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Manufacturer/Plantilla</InputLabel>
                <Select
                  value={formData.manufacturer}
                  onChange={handleChange("manufacturer")}
                  label="Manufacturer/Plantilla"
                >
                  {manufacturers.map((mfg) => (
                    <MenuItem key={mfg} value={mfg}>
                      {mfg}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Protocol</InputLabel>
                <Select
                  value={formData.protocol}
                  onChange={handleChange("protocol")}
                  label="Protocol"
                >
                  <MenuItem value="RTSP">RTSP</MenuItem>
                  <MenuItem value="RTMP">RTMP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Server</InputLabel>
                <Select
                  value={formData.server}
                  onChange={handleChange("server")}
                  label="Server"
                >
                  <MenuItem value="FlynetES-01">FlynetES-01</MenuItem>
                  <MenuItem value="FlynetES-02">FlynetES-02</MenuItem>
                  <MenuItem value="FlynetES-03">FlynetES-03</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1: // Connection (only for RTSP)
        if (formData.protocol === "RTMP") {
          // Skip this step for RTMP
          return null;
        }
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="RTSP URL"
                value={formData.rtspUrl}
                onChange={handleChange("rtspUrl")}
                placeholder="rtsp://username:password@192.168.1.100:554/stream"
                helperText="Enter the complete RTSP URL or fill individual fields below"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Or enter connection details individually:
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={handleChange("username")}
                placeholder="admin"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange("password")}
                placeholder="Enter password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Host/IP Address"
                value={formData.host}
                onChange={handleChange("host")}
                placeholder="192.168.1.100 or camera.domain.com"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Port"
                value={formData.port}
                onChange={handleChange("port")}
                placeholder="554"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component={Link}
                to="/app/rtsps"
                target="_blank"
                fullWidth
                sx={{ textTransform: 'none' }}
              >
                📋 View RTSP Address Templates
              </Button>
            </Grid>
          </Grid>
        );

      case 2: // Plan
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Storage Plan
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>
                Number of days: {formData.storageDays} days
              </Typography>
              <Slider
                value={formData.storageDays}
                onChange={(e, value) => setFormData({ ...formData, storageDays: value })}
                min={1}
                max={365}
                marks={[
                  { value: 1, label: '1' },
                  { value: 30, label: '30' },
                  { value: 90, label: '90' },
                  { value: 180, label: '180' },
                  { value: 365, label: '365' },
                ]}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Pre-Alarm Recording
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>
                Pre-alarm seconds: {formData.preAlarmSeconds}s
              </Typography>
              <Slider
                value={formData.preAlarmSeconds}
                onChange={(e, value) => setFormData({ ...formData, preAlarmSeconds: value })}
                min={0}
                max={30}
                marks={[
                  { value: 0, label: '0s' },
                  { value: 5, label: '5s' },
                  { value: 10, label: '10s' },
                  { value: 20, label: '20s' },
                  { value: 30, label: '30s' },
                ]}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Camera Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={handleChange("type")}
                  label="Camera Type"
                >
                  <MenuItem value="RTSP">RTSP</MenuItem>
                  <MenuItem value="RTMP">RTMP</MenuItem>
                  <MenuItem value="PPA">PPA</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 3: // Location
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={handleChange("address")}
                placeholder="Enter camera address"
              />
            </Grid>
            <Grid item xs={12}>
              <MapLocationPicker
                initialLat={formData.latitude}
                initialLng={formData.longitude}
                onLocationChange={handleLocationChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Latitude"
                value={formData.latitude}
                onChange={handleChange("latitude")}
                type="number"
                inputProps={{ step: "0.000001" }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Longitude"
                value={formData.longitude}
                onChange={handleChange("longitude")}
                type="number"
                inputProps={{ step: "0.000001" }}
              />
            </Grid>
          </Grid>
        );

      default:
        return 'Unknown step';
    }
  };

  if (fetchingCamera) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Skip Connection step for RTMP in stepper display
  const displaySteps = formData.protocol === "RTMP" 
    ? steps.filter(s => s !== 'Connection')
    : steps;
  
  const displayActiveStep = formData.protocol === "RTMP" && activeStep > 0
    ? activeStep - 1
    : activeStep;

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <HomeIcon sx={{ fontSize: 20, color: "text.secondary" }} />
        <Typography variant="body2" color="text.secondary">
          /
        </Typography>
        <Link to="/app/cameras" style={{ textDecoration: "none" }}>
          <Typography variant="body2" sx={{ color: "primary.main", cursor: "pointer" }}>
            Cameras
          </Typography>
        </Link>
        <Typography variant="body2" color="text.secondary">
          /
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEditMode ? "Edit Camera" : "Register Camera"}
        </Typography>
      </Box>

      {/* Page Title */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <CameraEnhanceIcon sx={{ fontSize: 32, color: "primary.main" }} />
        <Typography variant="h5" fontWeight={600}>
          {isEditMode ? "Edit Camera" : "Register Camera"}
        </Typography>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={displayActiveStep} alternativeLabel>
          {displaySteps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Form Content */}
      <Paper sx={{ p: 3, mb: 3 }}>
        {renderStepContent(activeStep)}
      </Paper>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
        >
          Back
        </Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/app/cameras")}
          >
            Cancel
          </Button>
          {activeStep === displaySteps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : (isEditMode ? "Update Camera" : "Create Camera")}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Next Step
            </Button>
          )}
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
