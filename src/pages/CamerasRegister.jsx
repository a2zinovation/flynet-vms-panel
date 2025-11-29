import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import { Link } from "react-router-dom";

import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Paper,
} from "@mui/material";

export default function CamerasRegister() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Top: Title + Breadcrumb */}
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Cameras{" "}
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              Register
            </Typography>
          </Typography>
        </Grid>

        <Grid item>
          <Typography variant="body2" color="text.secondary">
            <Link to="/app" style={{ textDecoration: "none", color: "#0A2A4A" }}><HomeIcon fontSize="small" />Home</Link>
             &nbsp;&gt;&nbsp; <Link to="/app/cameras" style={{ textDecoration: "none", color: "#0A2A4A" }}><CameraEnhanceIcon fontSize="small" />cameras</Link> &nbsp;&gt;&nbsp; Register
          </Typography>
        </Grid>
      </Grid>

      {/* White main panel */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
        }}
      >
        {/* Basic Data Tab Title */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 700,
              borderBottom: "2px solid #1E4F7B",
              display: "inline-block",
              pb: 1,
            }}
          >
            ✓ Basic data
          </Typography>
        </Box>

        {/* Form fields */}
        <Grid container spacing={3}>
          {/* USERS */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              Users
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter a name."
              size="small"
            />
          </Grid>

          {/* MANUFACTURER */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              Manufacturer/plantilla
            </Typography>

            <TextField fullWidth select size="small" defaultValue="RTSP Generic">
              <MenuItem value="RTSP Generic">RTSP Generic</MenuItem>
              <MenuItem value="Hikvision">Hikvision</MenuItem>
              <MenuItem value="Dahua">Dahua</MenuItem>
            </TextField>
          </Grid>

          {/* PROTOCOL */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              Protocol
            </Typography>
            <TextField fullWidth select size="small" defaultValue="RTSP">
              <MenuItem value="RTSP">RTSP</MenuItem>
              <MenuItem value="Onvif">Onvif</MenuItem>
            </TextField>
          </Grid>

          {/* SERVER */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              Server
            </Typography>

            <TextField fullWidth select size="small" defaultValue="">
              <MenuItem value="">Select Server</MenuItem>
              <MenuItem value="Server A">Server A</MenuItem>
              <MenuItem value="Server B">Server B</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* FOOTER BUTTONS — EXACT FIGMA LAYOUT */}
        <Grid container alignItems="center" mt={6}>
          {/* LEFT: Cancel Button */}
          <Grid item xs={6}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#E74C3C",
                color: "#fff",
                px: 4,
                textTransform: "none",
                borderRadius: 2,
                "&:hover": { backgroundColor: "#c0392b" },
              }}
            >
              Cancel
            </Button>
          </Grid>

          {/* RIGHT: Save Button */}
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1E4F7B",
                color: "#fff",
                px: 4,
                textTransform: "none",
                borderRadius: 2,
                "&:hover": { backgroundColor: "#163d5d" },
              }}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
