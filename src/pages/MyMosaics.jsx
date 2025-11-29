// src/pages/MyMosaics.jsx
import React from "react";
// Import MUI components
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment, 
} from "@mui/material";

// Import MUI icons for the breadcrumb
import HomeIcon from "@mui/icons-material/Home";
import CameraEnhanceIcon from "@mui/icons-material/CameraEnhance";
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
// Renaming Link to RouterLink for clarity in JSX
import { Link as RouterLink } from "react-router-dom"; 

export default function MyMosaics() {
  // Define styles for key elements using the MUI `sx` prop, based on pageStyles.css
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
      alignItems: "center", // Align items vertically in the breadcrumb
    },

    // .crumb (Styles for the visual link container)
    crumb: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      color: "#6c7a91",
      textDecoration: "none",
      fontSize: "13px",
      "&:hover": {
        color: "#0c1b33", // Darker on hover
      },
    },
    // .crumb.active
    crumbActive: {
      color: "#0c1b33",
      fontWeight: 600,
      cursor: "default",
      display: "flex", // Ensure active crumb also aligns icon if present
      alignItems: "center",
      fontSize: "13px",
    },

    // .crumb-sep
    crumbSeparator: {
      color: "#6c7a91",
    },

    // .patrols-box
    patrolsBox: {
      background: "white",
      borderRadius: "10px",
      padding: "18px",
      marginTop: "20px",
      border: "1px solid #dce3ed",
    },

    // .patrols-header
    patrolsHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },

    // .search-box / .search-box input
    searchInput: {
      // Base styling for the TextField wrapper
      "& .MuiOutlinedInput-root": {
        padding: 0, // Reset default padding
        borderRadius: "8px",
        height: "36px", // Set specific height
        width: "220px",
        fontSize: "14px",
        "& fieldset": {
          borderColor: "#c8d2e0",
        },
        "&:hover fieldset": {
          borderColor: "#c8d2e0",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#c8d2e0", // Keep border consistent on focus
        },
        // Adjusting padding inside the input field to match CSS
        "& .MuiInputBase-input": {
          padding: "8px 35px 8px 12px", // Matches CSS padding `8px 35px 8px 12px`
        },
      },
    },

    // .search-icon (applied to InputAdornment)
    searchIcon: {
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#4a5773",
      pointerEvents: "none", // Ensures the click goes to the input field
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
        {/* Using component="h1" to retain semantic HTML structure */}
        <Typography variant="body1" component="h1" sx={styles.pageTitle}>
          My Mosaics
        </Typography>
        <Typography variant="body2" component="span" sx={styles.pageSubtitle}>
          Views
        </Typography>
      </Box>

      {/* TOP RIGHT BREADCRUMB */}
      <Box sx={styles.breadcrumbWrapper}>
        
        {/* Crumb: Home (Link to /app) */}
        <RouterLink to="/app" style={{ textDecoration: 'none' }}>
          <Box sx={styles.crumb}>
            <HomeIcon sx={{ fontSize: 13, mr: 0.5 }} />
            Home
          </Box>
        </RouterLink>

        {/* Separator */}
        <Typography component="span" variant="body2" sx={styles.crumbSeparator}>
          ›
        </Typography>

        {/* Crumb: My Mosaics (Link to /app/my-mosaics) */}
        <RouterLink to="/app/my-mosaics" style={{ textDecoration: 'none' }}>
          <Box sx={styles.crumb}>
            <GridViewRoundedIcon sx={{ fontSize: 13, mr: 0.5 }} />
            My Mosaics
          </Box>
        </RouterLink>

        {/* Separator */}
        <Typography component="span" variant="body2" sx={styles.crumbSeparator}>
          ›
        </Typography>

        {/* Active Crumb: Views */}
        <Typography component="span" variant="body2" sx={styles.crumbActive}>
          <VisibilityIcon sx={{ fontSize: 13, mr: 0.5 }} />
          Views
        </Typography>
      </Box>

      {/* MAIN WHITE BOX */}
      <Paper sx={styles.patrolsBox} elevation={0}>
        <Box sx={styles.patrolsHeader}>
          {/* Patrols Count */}
          <Typography variant="body1" component="strong" sx={{ fontWeight: 600, color: '#0c1b33', fontSize: '16px' }}>
            0 Patrols
          </Typography>

          {/* SEARCH INPUT - Using MUI TextField with an EndAdornment for the icon */}
          <TextField
            placeholder="Search"
            variant="outlined"
            size="small"
            sx={styles.searchInput}
            InputProps={{
              // InputProps is used to customize the input element itself
              endAdornment: (
                <InputAdornment position="end" sx={styles.searchIcon}>
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