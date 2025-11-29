// src/pages/SmartMosaics.jsx
import React from "react";
// Import Router Link for navigation
import { Link } from "react-router-dom"; 

// Import MUI components
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment, // Used for search icon
} from "@mui/material";

// Import MUI icons for the breadcrumb and search
import HomeIcon from "@mui/icons-material/Home";
import GpsFixedIcon from "@mui/icons-material/GpsFixed"; // Icon for Smart Mosaics
import SearchIcon from "@mui/icons-material/Search";

export default function SmartMosaics() {
  // Define styles based on pageStyles.css (reused from previous conversions)
  const styles = {
    // .page-wrapper
    pageWrapper: {
      padding: "18px 30px",
      position: "relative",
      width: "100%",
    },

    // .page-header
    pageHeader: {
      display: "flex",
      alignItems: "baseline",
      gap: "10px",
      marginBottom: "10px",
    },

    // .page-title
    pageTitle: {
      fontSize: "26px",
      fontWeight: 700,
      margin: 0,
      color: "#0c1b33",
    },

    // .page-subtitle
    pageSubtitle: {
      fontSize: "14px",
      color: "#6c7a91",
    },

    // .breadcrumb-wrapper
    breadcrumbWrapper: {
      position: "absolute",
      top: "20px",
      right: "40px",
      display: "flex",
      gap: "6px",
      fontSize: "13px",
      color: "#6c7a91",
      alignItems: "center",
    },

    // .crumb (Base style for links)
    crumb: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      color: "#6c7a91",
      textDecoration: "none",
      fontSize: "13px",
      "&:hover": {
        color: "#0c1b33",
      },
    },

    // .crumb.active (Style for the final, non-linked element)
    crumbActive: {
      color: "#0c1b33",
      fontWeight: 600,
      cursor: "default",
      display: "flex",
      alignItems: "center",
      fontSize: "13px",
    },

    // .crumb-sep
    crumbSeparator: {
      color: "#6c7a91",
      margin: "0 6px",
    },

    // .patrols-box (MAIN WHITE BOX - reused name from original)
    patrolsBox: {
      background: "white",
      borderRadius: "10px",
      padding: "18px",
      marginTop: "20px",
      border: "1px solid #dce3ed",
    },

    // .patrols-header (Content header inside the white box)
    patrolsHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },

    // Strong text for "0 Patrols"
    patrolsCount: {
        fontWeight: 600,
        color: '#0c1b33',
        fontSize: '16px'
    },

    // .search-box / .search-box input
    searchInput: {
      "& .MuiOutlinedInput-root": {
        padding: 0,
        borderRadius: "8px",
        height: "36px",
        width: "220px",
        fontSize: "14px",
        "& fieldset": {
          borderColor: "#c8d2e0",
        },
        "& .MuiInputBase-input": {
          padding: "8px 35px 8px 12px", // Matches CSS padding
        },
      },
    },

    // .search-icon (Applied to InputAdornment)
    searchIconAdornment: {
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#4a5773",
      pointerEvents: "none",
    },

    // .no-results
    noResults: {
      textAlign: "center",
      padding: "40px 0",
      color: "#6c7a91",
      fontSize: "14px",
    },
  };

  return (
    <Box sx={styles.pageWrapper}>
      {/* PAGE TITLE + SMALL TEXT */}
      <Box sx={styles.pageHeader}>
        <Typography variant="body1" component="h1" sx={styles.pageTitle}>
          Smart Mosaics
        </Typography>
        <Typography variant="body2" component="span" sx={styles.pageSubtitle}>
          Views
        </Typography>
      </Box>

      {/* TOP RIGHT BREADCRUMB */}
      <Box sx={styles.breadcrumbWrapper}>
        {/* Crumb: Home (Linked) */}
        <Link to="/app" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box sx={styles.crumb}>
            <HomeIcon sx={{ fontSize: 13, mr: 0.5 }} />
            Home
          </Box>
        </Link>

        {/* Separator */}
        <Typography variant="body2" sx={styles.crumbSeparator}>
          ›
        </Typography>

        {/* Active Crumb: Smart Mosaics (Static, final crumb) */}
        <Typography variant="body2" sx={styles.crumbActive}>
          <GpsFixedIcon sx={{ fontSize: 13, mr: 0.5 }} />
          Smart Mosaics
        </Typography>
        
        {/* The "views" part was commented out in the original, so we omit it here */}
        
      </Box>

      {/* MAIN WHITE BOX */}
      <Paper sx={styles.patrolsBox} elevation={0}>
        <Box sx={styles.patrolsHeader}>
          {/* Patrols Count */}
          <Typography variant="body1" component="strong" sx={styles.patrolsCount}>
            0 Patrols
          </Typography>

          {/* SEARCH INPUT */}
          <TextField
            placeholder="Search"
            variant="outlined"
            size="small"
            sx={styles.searchInput}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={styles.searchIconAdornment}>
                  <SearchIcon sx={{ fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* EMPTY STATE */}
        <Box sx={styles.noResults}>
          <Typography variant="body2" sx={{ color: "inherit", fontSize: "inherit" }}>
            No results found!
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}