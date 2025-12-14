// src/components/Sidebar/Sidebar.jsx (FINAL OPTIMIZATION: Perfect Icon/Logo Horizontal Alignment)
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../../AppProvider.jsx";

// MUI Components
import { Box, IconButton, Typography, Divider, styled } from "@mui/material";

// MUI Icons
import MenuIcon from "@mui/icons-material/Menu"; 

// --- Styled Component to apply base sidebar layout and collapse logic ---
// Prevent forwarding the custom `collapsed` prop to the DOM to avoid React warnings
const SidebarContainer = styled(Box, {
        shouldForwardProp: (prop) => prop !== "collapsed",
})(({ theme, collapsed }) => ({
  width: collapsed ? '68px' : '260px',
  minWidth: collapsed ? '68px' : '260px',
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1100, 
  backgroundColor: '#fff',
  borderRight: '1px solid #e0e0e0',
  transition: 'width 0.2s ease-in-out, min-width 0.2s ease-in-out',
  overflowX: 'hidden', 
  overflowY: 'auto',
  padding: '16px 0',
  boxShadow: '0 0 10px rgba(0,0,0,0.05)',
}));

// --- Styles for NavLink to replicate sidebar-menu styles ---
const NavItemStyle = {
  display: 'flex',
  alignItems: 'center',
  // Left padding of 18px anchors the icon visually
  padding: '12px 18px',
  textDecoration: 'none',
  color: '#333',
  fontSize: '14px',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
  '&.active': {
    color: '#007bff', 
    backgroundColor: '#f0faff',
    fontWeight: 600,
  },
};

// --- Custom Icon Component to use the Figma asset paths ---
const CustomIcon = ({ src }) => (
    <Box
        component="img"
        src={src}
        alt="Nav Icon"
        sx={{
            width: '20px',
            height: '20px',
            objectFit: 'contain',
            marginRight: '12px',
        }}
    />
);

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useContext(AppContext);

  const logoSrc = sidebarCollapsed ? '/assets/short-logo.png' : '/assets/flynet-logo.png';

  return (
    <SidebarContainer component="aside" collapsed={sidebarCollapsed}>
      
      {/* LOGO + HAMBURGER */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: sidebarCollapsed ? 'flex-end' : 'space-between', 
          alignItems: 'center', 
          padding: '0 10px', 
          height: '40px',
          mb: 2,
        }}
      >
        {/* LOGO CONTAINER */}
        <Box sx={{
            position: sidebarCollapsed ? 'absolute' : 'static',
            // ⭐ FINAL FIX: Set left anchor to 18px (matching the NavLink padding)
            left: sidebarCollapsed ? '18px' : 0, 
            top: sidebarCollapsed ? '16px' : 'auto', 
            transition: 'width 0.2s ease-in-out',
        }}>
          <Box 
            component="img"
            src={logoSrc}
            alt="Flynet Logo"
            sx={{
                width: sidebarCollapsed ? '28px' : '120px', 
                height: 'auto',
                objectFit: 'contain',
                transition: 'width 0.2s ease-in-out',
            }}
          />
        </Box>


        {/* HAMBURGER BUTTON */}
        <IconButton 
          onClick={toggleSidebar}
          size="small"
          sx={{ 
            color: '#555', 
            transform: sidebarCollapsed ? 'rotate(180deg)' : 'none', 
            transition: 'transform 0.2s ease-in-out, margin-top 0.2s ease-in-out',
            marginTop: sidebarCollapsed ? '50px' : '0', 
            zIndex: 1200, 
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* NAVIGATION */}
      <Box component="nav" sx={{ display: 'flex', flexDirection: 'column' }}>

        {/* --- MAIN USER SECTION (6 items) --- */}
        <NavLink to="/app/my-cameras" style={NavItemStyle} end>
          <CustomIcon src="/assets/icons/home-b.svg" />
          <Typography sx={{ display: sidebarCollapsed ? 'none' : 'block' }}>My Cameras</Typography>
        </NavLink>

        <NavLink to="/app/my-patrols" style={NavItemStyle}>
          <CustomIcon src="/assets/icons/my-patrol.svg" />
          <Typography sx={{ display: sidebarCollapsed ? 'none' : 'block' }}>My patrols</Typography>
        </NavLink>

        <NavLink to="/app/my-mosaics" style={NavItemStyle}>
          <CustomIcon src="/assets/icons/mosaic.svg" />
          <Typography sx={{ display: sidebarCollapsed ? 'none' : 'block' }}>My mosaics</Typography>
        </NavLink>

        <NavLink to="/app/my-alarms" style={NavItemStyle}>
          <CustomIcon src="/assets/icons/alarm.svg" />
          <Typography sx={{ display: sidebarCollapsed ? 'none' : 'block' }}>My Alarms</Typography>
        </NavLink>

        <NavLink to="/app/my-videos" style={NavItemStyle}>
          <CustomIcon src="/assets/icons/video.svg" />
          <Typography sx={{ display: sidebarCollapsed ? 'none' : 'block' }}>My videos</Typography>
        </NavLink>

        <NavLink to="/app/smart-mosaic" style={NavItemStyle}>
          <CustomIcon src="/assets/icons/smart.svg" />
          <Typography sx={{ display: sidebarCollapsed ? 'none' : 'block' }}>Smart mosaic</Typography>
        </NavLink>

        <Divider sx={{ my: 1, mx: sidebarCollapsed ? 0 : 2 }} />

        {/* --- MANAGEMENT SECTION (7 items) --- */}
        <NavLink to="/app/cameras" style={NavItemStyle}>
          <CustomIcon src="/assets/icons/camera.svg" />
          <Typography sx={{ display: sidebarCollapsed ? 'none' : 'block' }}>Cameras</Typography>
        </NavLink>

        <NavLink to="/app/alarms" style={NavItemStyle}>
          <CustomIcon src="/assets/icons/alarm-2.svg" />
          <Typography sx={{ display: sidebarCollapsed ? 'none' : 'block' }}>Alarms</Typography>
        </NavLink>

        <NavLink to="/app/groups" style={NavItemStyle}>
          <CustomIcon src="/assets/icons/groups.svg" />
          <Typography sx={{ display: sidebarCollapsed ? 'none' : 'block' }}>Groups</Typography>
        </NavLink>

        <NavLink to="/app/users" style={NavItemStyle}>
          <CustomIcon src="/assets/icons/users.svg" />
          <Typography sx={{ display: sidebarCollapsed ? 'none' : 'block' }}>Users</Typography>
        </NavLink>

        <NavLink to="/app/permissions" style={NavItemStyle}>
          <CustomIcon src="/assets/icons/lock.svg" />
          <Typography sx={{ display: sidebarCollapsed ? 'none' : 'block' }}>Permissions</Typography>
        </NavLink>

        <NavLink to="/app/mosaics" style={NavItemStyle}>
          <CustomIcon src="/assets/icons/mosaic-2.svg" />
          <Typography sx={{ display: sidebarCollapsed ? 'none' : 'block' }}>Mosaics</Typography>
        </NavLink>

        <NavLink to="/app/patrols" style={NavItemStyle}>
          <CustomIcon src="/assets/icons/patrol.svg" />
          <Typography sx={{ display: sidebarCollapsed ? 'none' : 'block' }}>Patrols</Typography>
        </NavLink>
        
        <Divider sx={{ my: 1, mx: sidebarCollapsed ? 0 : 2 }} />
        
        {/* --- BOTTOM SECTION (5 items) --- */}
        <NavLink to="/app/access" style={NavItemStyle}>
          <CustomIcon src="/assets/icons/access.svg" />
          <Typography sx={{ display: sidebarCollapsed ? 'none' : 'block' }}>Access</Typography>
        </NavLink>

        <NavLink to="/app/reports" style={NavItemStyle}>
          <CustomIcon src="/assets/icons/report.svg" />
          <Typography sx={{ display: sidebarCollapsed ? 'none' : 'block' }}>Reports</Typography>
        </NavLink>

        <NavLink to="/app/platform" style={NavItemStyle}>
          <CustomIcon src="/assets/icons/platform.svg" />
          <Typography sx={{ display: sidebarCollapsed ? 'none' : 'block' }}>Platform</Typography>
        </NavLink>

        <NavLink to="/app/activity-log" style={NavItemStyle}>
          <CustomIcon src="/assets/icons/log.svg" />
          <Typography sx={{ display: sidebarCollapsed ? 'none' : 'block' }}>Activity log</Typography>
        </NavLink>

        <NavLink to="/app/notification-center" style={NavItemStyle}>
          <CustomIcon src="/assets/icons/notification.svg" />
          <Typography sx={{ display: sidebarCollapsed ? 'none' : 'block' }}>Notification center</Typography>
        </NavLink>

        <Divider sx={{ my: 1, mx: sidebarCollapsed ? 0 : 2 }} />

        {/* --- UTILITIES SECTION (2 items) --- */}
        <NavLink to="/app/consumption" style={NavItemStyle}>
          <CustomIcon src="/assets/icons/calculator.svg" />
          <Typography sx={{ display: sidebarCollapsed ? 'none' : 'block' }}>Consumption calculator</Typography>
        </NavLink>

        <NavLink to="/app/rtsps" style={NavItemStyle}>
          <CustomIcon src="/assets/icons/list.svg" />
          <Typography sx={{ display: sidebarCollapsed ? 'none' : 'block' }}>RTSPs address list</Typography>
        </NavLink>
      </Box>
    </SidebarContainer>
  );
}