// src/pages/RTSPs.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Breadcrumbs,
  Link as MuiLink,
  TextField,
  Grid,
  IconButton,
  Card,
  InputAdornment,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import { Link as RouterLink } from "react-router-dom"; 

// Define the fields with their placeholder text and descriptive helper text
const FIELDS_DATA = [
  { label: "User", helper: "User to access the camera (Ex.: admin)" },
  { label: "Password", helper: "Password of the user to access the camera (Ex.: 123456)" },
  { label: "Domain", helper: "Network IP address or DDNS (Ex.: my-camera.ddns.com.br or 123.456.78.9)" },
  { label: "Port", helper: "RTSP port configured on the camera (the default port is 554 on most cameras)" },
  { label: "Manufacturer", helper: "Filter the camera manufacturer's name." },
];

export default function RTSPs() {
  const [inputValues, setInputValues] = useState({
    User: 'USER', 
    Password: 'PASSWORD', 
    Domain: 'DOMAIN', 
    Port: 'PORT', 
    Manufacturer: '',
  });

  const handleInputChange = (e, label) => {
    // Retain the static placeholder values for the URL if the field is empty
    const value = e.target.value.trim() || label.toUpperCase();
    setInputValues({ ...inputValues, [label]: value });
  };

  const rtspUrl = `rtsp://${inputValues.User}:${inputValues.Password}@${inputValues.Domain}:${inputValues.Port}/profile0`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rtspUrl);
  };
  
  // Custom component to handle the specific input structure (Input on left, Description on right)
  const InputRowFidelity = ({ field }) => {
    return (
        <Grid container alignItems="center" spacing={3} sx={{ mb: 1 }}>
            {/* Column 1: Input Field */}
            <Grid item xs={12} sm={4} md={3}>
                <TextField
                    fullWidth
                    size="small"
                    label={field.label}
                    placeholder={field.label}
                    value={field.label === 'Manufacturer' ? inputValues.Manufacturer : undefined}
                    onChange={(e) => handleInputChange(e, field.label)}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            background: "#F7F8FA",
                            minWidth: 140, // Ensure fields are wide enough on large screens
                        },
                        "& .MuiInputLabel-root": {
                            fontSize: 14,
                        },
                    }}
                    // If it's a URL component, it should not have a label when using the dynamic value,
                    // but since the Figma design shows a label, we keep it for fidelity.
                    InputLabelProps={{ shrink: field.label !== 'Manufacturer' }}
                />
            </Grid>

            {/* Column 2: Description/Helper Text (RIGHT ALIGNED - Figma Fidelity) */}
            <Grid item xs={12} sm={8} md={9}>
                <Typography sx={{ fontSize: 14, color: "#6C7A91" }}>
                    {field.helper}
                </Typography>
            </Grid>
        </Grid>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* HEADER + BREADCRUMB */}
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Grid item>
          <Typography sx={{ fontSize: 26, fontWeight: 700, color: '#0C1B33' }}>
            RTSPs address list
          </Typography>
        </Grid>

        <Grid item>
          <Breadcrumbs
            separator={<ChevronRightIcon fontSize="small" sx={{ color: '#6C7A91' }} />}
            aria-label="breadcrumb"
          >
            {/* Link: Home */}
            <MuiLink
                component={RouterLink}
                to="/app"
                underline="hover"
                color="inherit"
                sx={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: 13, color: '#6C7A91', textDecoration: 'none' }}
            >
              <HomeIcon fontSize="small" /> Home
            </MuiLink>

            {/* Link: Help */}
            <MuiLink 
                component={RouterLink}
                to="/help" // Placeholder link
                underline="hover" 
                color="inherit"
                sx={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: 13, color: '#6C7A91', textDecoration: 'none' }}
            >
              <LiveTvIcon fontSize="small" sx={{ mr: 0.5 }} />
              help
            </MuiLink>

            {/* Current Page: RTSPs address list */}
            <Typography sx={{ color: '#0C1B33', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LiveTvIcon fontSize="small" />
                RTSPs address list
            </Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>

      {/* MAIN CARD */}
      <Card
        elevation={0}
        sx={{
          mt: 1, 
          p: 3,
          borderRadius: "14px",
          background: "#fff",
          border: "1px solid #E6E8EC",
        }}
      >
        {/* DESCRIPTION */}
        <Typography sx={{ fontSize: 14, color: "#4A5773", mb: 3, lineHeight: 1.7 }}>
          Check below for a list of the most popular RTSP addresses on the
          market.  
          <br />
          <br />
          Fill in the fields and then copy the link, according to the
          manufacturer's brand. Use it when registering a new camera on the
          platform.
        </Typography>

        {/* INPUTS AND DESCRIPTIONS (Fidelity matched layout) */}
        <Box sx={{ mb: 3 }}>
          {FIELDS_DATA.map((field) => (
            <InputRowFidelity field={field} key={field.label} />
          ))}
        </Box>
        
        {/* MANUFACTURER SECTION (Tenda) */}
        <Box sx={{ mt: 3 }}>
          <Typography sx={{ fontWeight: 700, mb: 0.5, color: '#0C1B33' }}>Tenda</Typography>
          <Typography sx={{ color: "#4A5773", fontSize: 14, mb: 1 }}>
            IT7-L PCS
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: 'space-between',
              gap: 2,
              background: "#F1F3F5",
              px: 2,
              py: 1.5,
              borderRadius: "10px",
              border: "1px solid #E0E3E7",
              width: 'fit-content' // Keeps the box contained, as in the Figma screenshot
            }}
          >
            <Typography sx={{ fontSize: 15, fontWeight: 500, color: '#333' }}>
              {/* Dynamically generated RTSP URL based on input */}
              {rtspUrl}
            </Typography>

            <IconButton size="small" onClick={handleCopy} sx={{ flexShrink: 0, color: '#0C1B33' }}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ height: 40 }} />
      </Card>
    </Container>
  );
}