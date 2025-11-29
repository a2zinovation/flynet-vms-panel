// src/layouts/MainLayout.jsx (MUI Conversion)
import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
// ⭐ Import Box component from MUI
import { Box } from "@mui/material"; 
import Sidebar from "../components/layout/Sidebar.jsx";
import Header from "../components/layout/Header.jsx";
import { AppContext } from "../AppProvider.jsx";

// Define Sidebar widths for dynamic margin calculation
const SIDEBAR_EXPANDED_WIDTH = '260px';
const SIDEBAR_COLLAPSED_WIDTH = '68px';
const HEADER_HEIGHT = '72px'; // Assuming your Header is 72px tall based on previous code

export default function MainLayout() {
  const { sidebarCollapsed } = useContext(AppContext);

  // Determine the dynamic left margin based on the sidebar state
  const dynamicMargin = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  return (
    // The top-level Box can still be the app-root container
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F8F9FB' }}>
      
      {/* Sidebar is fixed and positioned left: 0 (Fixed elements go outside the flow) */}
      <Sidebar />
      
      {/* This Box replaces the original 'main-area' div.
        It uses marginLeft to push the content away from the fixed Sidebar.
      */}
      <Box 
        component="main" 
        sx={{
          // Pushes the main area horizontally away from the sidebar
          marginLeft: dynamicMargin,
          
          // Width recalculates to prevent scrollbar when sidebar width changes
          width: `calc(100% - ${dynamicMargin})`, 
          
          // Smooth transition for the shifting effect
          transition: 'margin-left 0.2s ease-in-out, width 0.2s ease-in-out',
          
          // Layout: Header on top, then page content below
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        {/* Header - Stays at the top of the main area */}
        <Header />
        
        {/* This Box replaces 'page-content' div. 
          The padding inside your pages (like p={3}) will give the final spacing. 
        */}
        <Box 
            className="page-content" 
            sx={{ flexGrow: 1, minHeight: 0 }}
        >
          {/* Renders the currently selected route component */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}