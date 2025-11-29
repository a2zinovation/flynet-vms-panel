// src/pages/MosaicsRegister.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Switch,
  Paper,
  Grid, // Added Grid for header layout
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom"; // ⭐ ADDED Link
import HomeIcon from "@mui/icons-material/Home"; // ⭐ ADDED Icon
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined"; // ⭐ ADDED Icon for Mosaics
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Used for the "Basic data" checkmark
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';

export default function MosaicsRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    type: "Cameras",
    cameras: "1 Camera",
    active: true,
  });

  const numberOptions = [
    "1 Camera",
    "2 Cameras",
    "3 Cameras",
    "4 Cameras",
    "6 Cameras",
    "9 Cameras",
  ];

  const crumbLinkStyle = {
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
  };
  const crumbTextStyle = {
    color: 'text.secondary',
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
  };
  const crumbActiveStyle = {
    color: 'text.primary',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
  };

  return (
    <Box p={4}>

      {/* Title + Breadcrumb */}
      <Grid container alignItems="center" justifyContent="space-between" mb={2}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Mosaics{" "}
            <Typography component="span" sx={{ color: "#98A2B3", fontSize: 16 }}>
              Register
            </Typography>
          </Typography>
        </Grid>

        <Grid item>
          {/* ⭐ UPDATED BREADCRUMB TO INCLUDE LINKS AND ICONS */}
          <Typography variant="body2" sx={crumbTextStyle}>
            
            {/* LINK: Home */}
            <RouterLink to="/app" style={crumbLinkStyle}>
              <Box sx={crumbTextStyle}>
                <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
                Home
              </Box>
            </RouterLink>
            
            {/* Separator */}
            <Typography component="span" variant="body2" sx={{ mx: 0.5, color: 'text.secondary' }}>
                &gt;
            </Typography>
            
            {/* LINK: Mosaics */}
            <RouterLink to="/app/mosaics" style={crumbLinkStyle}>
              <Box sx={crumbTextStyle}>
                <DashboardRoundedIcon fontSize="small" sx={{ mr: 0.5 }} />
                Mosaics
              </Box>
            </RouterLink>

            {/* Separator and Current Page */}
            <Typography component="span" variant="body2" sx={{ mx: 0.5, color: 'text.secondary' }}>
                &gt;
            </Typography>
            
            <Typography component="span" variant="body2" sx={crumbActiveStyle}>
                Register
            </Typography>
          </Typography>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 3, borderRadius: "12px" }}>

        {/* BASIC DATA TAB UI (fixed, no switch needed) */}
        <Box borderBottom="2px solid #E5E7EB" pb={2} mb={3}>
          <Typography
            sx={{
              borderBottom: "3px solid #1A73E8",
              display: "inline-flex",
              alignItems: 'center',
              pb: 1,
              fontWeight: 600,
              color: "#1A73E8" // Ensure blue color for active tab
            }}
          >
            <CheckCircleOutlineIcon sx={{ mr: 0.5, fontSize: 18 }} /> Basic data
          </Typography>
        </Box>

        {/* FORM GRID */}
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>

          {/* Name */}
          <Box>
            <Typography fontWeight={600} mb={1}>Name</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter a name."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              sx={{ background: "#fff" }}
            />
          </Box>

          {/* Type Dropdown */}
          <Box>
            <Typography fontWeight={600} mb={1}>Type</Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              sx={{ background: "#fff" }}
            >
              <MenuItem value="Cameras">Cameras</MenuItem>
              <MenuItem value="Plates">Plates</MenuItem>
            </TextField>
          </Box>

        </Box>

        {/* CAMERAS SECTION */}
        <Box mt={3}>
          <Typography fontWeight={600} mb={1}>Number of cameras</Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={form.cameras}
            onChange={(e) => setForm({ ...form, cameras: e.target.value })}
            sx={{ background: "#fff", maxWidth: 300 }}
          >
            {numberOptions.map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* AVAILABLE IN ICONS */}
        <Box mt={3}>
          <Typography fontWeight={600} mb={1}>Available in</Typography>
          <Box display="flex" gap={2} alignItems="center">
            {/* Note: In a pure MUI solution, images should be replaced with MUI icons or Box placeholders */}
            <Box component="img" src="/assets/icons/display.svg" width={40} />
            <Box component="img" src="/assets/icons/tablet.svg" width={40} />
            <Box component="img" src="/assets/icons/mobile.svg" width={40} />
          </Box>
        </Box>

        {/* ACTIVE SWITCH */}
        <Box mt={4} display="flex" justifyContent="flex-end">
          <FormControlLabel
            control={
              <Switch
                checked={form.active}
                onChange={() => setForm({ ...form, active: !form.active })}
              />
            }
            label="Active"
          />
        </Box>

        {/* BUTTONS */}
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            variant="contained"
            sx={{
              background: "#E74C3C",
              "&:hover": { background: "#D84332" },
              textTransform: "none",
            }}
            onClick={() => navigate("/mosaics")}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            sx={{
              background: "#1A73E8",
              "&:hover": { background: "#1669C1" },
              textTransform: "none",
            }}
          >
            Save
          </Button>
        </Box>

      </Paper>
    </Box>
  );
}