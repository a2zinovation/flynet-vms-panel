// src/pages/MyVideos.jsx
import React from "react";
// Import Router Link for navigation
import { Link } from "react-router-dom"; 

// Import MUI components
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Grid,
} from "@mui/material";

// Import MUI Icons
import HomeIcon from "@mui/icons-material/Home";
import VideocamIcon from "@mui/icons-material/Videocam";
import SearchIcon from "@mui/icons-material/Search";

export default function MyVideos() {
  // Define styles based on pageStyles.css (specifically for video layout)
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

    // .page-title (using h2 equivalent style)
    pageTitle: {
      fontSize: "26px",
      fontWeight: 700,
      margin: 0,
      color: "#0c1b33",
    },

    // .views-label / .page-subtitle
    pageSubtitle: {
      fontSize: "14px",
      color: "#6c7a91",
    },

    // .breadcrumb-wrapper / .breadcrumb
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
    // Breadcrumb Crumb/Link style
    crumb: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      color: '#6c7a91',
      textDecoration: 'none',
      fontSize: '13px',
      '&:hover': {
        color: '#0c1b33',
      },
    },
    // Separator style
    crumbSeparator: {
      margin: "0 6px",
      color: "#6c7a91",
    },
    // Active crumb style
    crumbActive: {
      color: '#0c1b33',
      fontWeight: 600,
      fontSize: '13px',
    },

    // .myvideos-container / .my-videos-wrapper
    videosContainer: {
      display: "flex",
      gap: "20px",
      marginTop: "10px",
    },

    // .video-main / .video-preview-box (LEFT side)
    videoMain: {
      flex: 1, // Takes up remaining space
      background: "#fff",
      borderRadius: "12px",
      padding: "10px",
      border: "1px solid #d9e2ec",
      position: 'relative', // Necessary for the overlay
    },

    // .video-player / .video-preview-img
    videoPlayer: {
      width: "100%",
      height: "auto",
      borderRadius: "10px",
      objectFit: "cover",
      display: 'block', // Prevents extra space below the video tag
      minHeight: '300px', // Ensure it has visible height
    },

    // .video-overlay
    videoOverlay: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      color: 'white',
      padding: '4px 8px',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: '4px',
      display: 'flex',
      gap: 10,
      fontSize: '12px',
    },

    // .video-sidebar / .videos-list-panel (RIGHT side)
    videoSidebar: {
      width: "380px",
      background: "#fff",
      padding: "15px",
      border: "1px solid #d9e2ec",
      borderRadius: "12px",
    },

    // .video-sidebar-header / .videos-list-header
    sidebarHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "15px",
    },

    // .video-count
    videoCount: {
      fontSize: "16px",
      fontWeight: 600,
      color: '#0c1b33',
    },

    // .video-search / .search-box
    videoSearch: {
      flex: 1,
      margin: "0 10px",
      position: 'relative', // Ensure search icon is positioned correctly
    },

    // .search-input (TextField styling)
    searchInput: {
      width: "100%",
      "& .MuiOutlinedInput-root": {
        padding: 0,
        borderRadius: "8px",
        height: "36px",
        fontSize: "14px",
        "& fieldset": {
          borderColor: "#d9e2ec",
        },
        "& .MuiInputBase-input": {
          padding: "8px 30px 8px 12px", // Matches CSS padding
        },
      },
    },

    // .video-items / .video-list
    videoItems: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },

    // .video-item
    videoItem: {
      display: "flex",
      gap: "10px",
      cursor: "pointer",
      padding: '4px', // Slight padding for hover effect visibility if added
      borderRadius: '8px',
      '&:hover': {
        backgroundColor: '#f9f9f9',
      },
    },

    // .video-thumb / img
    videoThumb: {
      width: "120px",
      height: "70px",
      borderRadius: "8px",
      objectFit: "cover",
    },

    // .video-item-text / .video-info
    videoItemText: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    videoItemTitle: { // p tag style
      margin: 0,
      fontSize: "14px",
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#0c1b33',
    },
    videoItemSubtitle: { // small tag style
      fontSize: "12px",
      color: "#6b7280",
      lineHeight: 1.3,
    },
  };

  // Static list data for mapping
  const videoList = [
    { id: 1, title: "Flynet Security", subtitle: "CAM 1.03 street..", thumb: "/assets/VMS-images/sample-video-1.jpg" },
    { id: 2, title: "Flynet Security", subtitle: "CAM 1.03 street..", thumb: "/assets/VMS-images/sample-video-2.jpg" },
  ];

  return (
    <Box sx={styles.pageWrapper}>
      {/* PAGE TITLE + SMALL TEXT */}
      <Box sx={styles.pageHeader}>
        <Typography variant="h4" component="h2" sx={styles.pageTitle}>
          My videos{" "}
          <Typography variant="body2" component="span" sx={styles.pageSubtitle}>
            Views
          </Typography>
        </Typography>

        {/* TOP RIGHT BREADCRUMB */}
        <Box sx={styles.breadcrumbWrapper}>
          {/* 1. Crumb: Home (Linked) - Using the requested Link structure */}
          <Link to="/app" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            <Box sx={styles.crumb}>
              <HomeIcon sx={{ fontSize: 13, mr: 0.5 }} />
              Home
            </Box>
          </Link>

          {/* Separator */}
          <Typography variant="body2" sx={styles.crumbSeparator}>
            &gt;
          </Typography>

          {/* 2. Crumb: My Videos (Linked) */}
          <Link to="/app/my-videos" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            <Box sx={styles.crumb}>
              <VideocamIcon sx={{ fontSize: 13, mr: 0.5 }} />
              My videos
            </Box>
          </Link>

          {/* Separator */}
          <Typography variant="body2" sx={styles.crumbSeparator}>
            &gt;
          </Typography>

          {/* 3. Active Crumb: views (Static) */}
          <Typography variant="body2" sx={styles.crumbActive}>
            Views
          </Typography>
        </Box>
      </Box>

      {/* MAIN CONTENT CONTAINER */}
      <Box sx={styles.videosContainer}>

        {/* LEFT SIDE — MAIN LIVE STREAM */}
        <Paper sx={styles.videoMain} elevation={0}>
          {/* Video Player */}
          <Box
            component="video"
            sx={styles.videoPlayer}
            controls
            autoPlay
            muted
            playsInline
            src="" // Placeholder for video source
            poster="/assets/VMS-images/sample-video-big.jpg"
          />

          {/* Overlay info (timestamp, camera id, etc) */}
          <Box sx={styles.videoOverlay}>
            <Typography variant="caption" component="span">00:16:55:04</Typography>
            <Typography variant="caption" component="span">CAM 04: POS 33.8.69</Typography>
          </Box>
        </Paper>

        {/* RIGHT SIDE — LIST OF CAMERA VIDEO PREVIEWS */}
        <Paper sx={styles.videoSidebar} elevation={0}>
          <Box sx={styles.sidebarHeader}>
            <Typography variant="body1" component="h4" sx={styles.videoCount}>
              {videoList.length} Videos
            </Typography>
            
            {/* SEARCH INPUT */}
            <Box sx={styles.videoSearch}>
              <TextField
                placeholder="Search"
                variant="outlined"
                size="small"
                sx={styles.searchInput}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#4a5773' }}>
                      <SearchIcon sx={{ fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          {/* VIDEO ITEMS LIST */}
          <Box sx={styles.videoItems}>
            {videoList.map((item) => (
              <Box key={item.id} sx={styles.videoItem}>
                <Box
                  component="img"
                  src={item.thumb}
                  alt="Video thumbnail"
                  sx={styles.videoThumb}
                />
                <Box sx={styles.videoItemText}>
                  <Typography variant="body2" sx={styles.videoItemTitle}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" component="small" sx={styles.videoItemSubtitle}>
                    {item.subtitle}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}