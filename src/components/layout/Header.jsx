// src/components/layout/Header.jsx (FINAL FIX: Stable Header with Logout Dialog)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../../context/AuthContext";
import { notificationService } from "../../services/notifications";

// Import MUI components
import { 
  Box, 
  Button, 
  Typography, 
  Popover,
  Dialog, 
  DialogContent,
  Avatar,
  Badge
} from "@mui/material";

// Import MUI Icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; 
import MenuIcon from '@mui/icons-material/Menu'; 
import WarningAmberIcon from '@mui/icons-material/WarningAmber'; 


const LANGS = [
  { code: "pt-BR", label: "PT-BR", flag: "/assets/flags/br.png" },
  { code: "en-US", label: "EN-US", flag: "/assets/flags/us.png" },
  { code: "es", label: "ES", flag: "/assets/flags/es.png" },
];

export default function Header() {
  const navigate = useNavigate(); 
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null); 
  const [selectedLang, setSelectedLang] = useState(LANGS[1]); 
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Get profile picture URL from user data
  const profilePicture = user?.profile_picture || null;
  const userName = user?.name || "User";

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await notificationService.getUnreadCount();
        setUnreadCount(response.count || 0);
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    };

    if (user) {
      fetchUnreadCount();
      // Poll every 30 seconds for updates
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]); 

  // --- Navigation & Language Handlers ---

  const handleLangClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLangClose = () => {
    setAnchorEl(null);
  };

  const handleLangSelect = (lang) => {
    setSelectedLang(lang);
    handleLangClose();
  };
  
  // ⭐ 1. Function to open the confirmation dialog
  const handleSignOutClick = () => {
      setIsLogoutDialogOpen(true);
  };

  // ⭐ 2. Function executed upon confirmation (Logout and redirect)
  const handleConfirmLogout = async () => {
      setIsLogoutDialogOpen(false);
      await logout();
      navigate("/"); 
  };
  
  // ⭐ 3. Function to cancel the logout
  const handleCancelLogout = () => {
      setIsLogoutDialogOpen(false);
  };  // Note: The original simple handleSignOut has been replaced by handleSignOutClick

  const open = Boolean(anchorEl);
  const id = open ? "language-popover" : undefined;

  // --- Styles ---
  const styles = {
    // .vms-header
    header: {
      height: "72px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px 18px",
      borderBottom: "1px solid #f2f5f8",
      background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
    },
    // .header-right
    headerRight: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    // .icon-btn
    iconButton: {
      minWidth: 0,
      padding: 0,
      color: "inherit",
      fontSize: "18px",
      "&:hover": { background: "transparent" },
    },
    // .lang-btn
    langButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      background: "#fff",
      borderRadius: "20px",
      padding: "6px 12px",
      border: "1px solid #e6eef5",
      textTransform: "none",
      color: "inherit",
      "&:hover": {
        background: "#f8f8f8",
        borderColor: "#d0d9e2",
      },
    },
    // .flag
    flag: {
      width: "20px",
      height: "14px",
      objectFit: "cover",
      borderRadius: "2px",
    },
    // .lang-dropdown (Popover content style)
    langDropdown: {
      "& .MuiPaper-root": {
        border: "1px solid #e6eef5",
        borderRadius: "10px",
        boxShadow: "0 8px 22px rgba(10,30,50,0.12)",
        padding: "6px",
        minWidth: "140px",
      },
    },
    langItem: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "8px 10px",
      borderRadius: "8px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#f5f7fa",
      },
    },

    // .signout-btn
    signoutButton: {
      minWidth: "36px",
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      backgroundColor: "#ff5a4d",
      color: "#fff",
      padding: 0,
      "&:hover": {
        backgroundColor: "#e04c40",
      },
    },
    logoutIcon: {
      fontSize: "18px",
    },
    // Dialog styles
    dialogContent: {
      textAlign: "center",
      padding: "30px 40px !important",
    },
    warningIcon: {
      fontSize: "4.5rem",
      color: "#F9A825",
    },
    warningTitle: {
      fontWeight: 700,
      fontSize: "1.5rem",
      marginTop: "10px",
      color: "#333",
    },
    dialogText: {
      marginTop: "8px",
      color: "#555",
      marginBottom: "20px",
    },
    confirmButton: {
      bgcolor: "#000",
      color: "#fff",
      "&:hover": { bgcolor: "#111" },
      px: 4,
      py: 1.2,
      textTransform: "none",
      borderRadius: "6px",
    },
    cancelButton: {
      bgcolor: "#F0F0F0",
      color: "#333",
      "&:hover": { bgcolor: "#E0E0E0" },
      px: 4,
      py: 1.2,
      textTransform: "none",
      borderRadius: "6px",
      marginRight: "10px",
    },
  };

  return (
    <Box component="header" sx={styles.header}>
      {/* HEADER LEFT (Empty, as requested) */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* The logo Box is intentionally commented out in the prompt */}
      </Box>

      {/* HEADER RIGHT */}
      <Box sx={styles.headerRight}>
        {/* LANGUAGE SELECTOR */}
        <Box sx={{ position: 'relative' }}>
          <Button
            aria-describedby={id}
            onClick={handleLangClick}
            sx={styles.langButton}
          >
            <img src={selectedLang.flag} alt={selectedLang.label} style={styles.flag} />
            <Typography variant="body2" component="span" sx={{ fontSize: '14px' }}>
              {selectedLang.label}
            </Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: '16px' }} />
          </Button>

          {/* Popover content */}
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleLangClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={styles.langDropdown}
            // Add slight offset to match original position (top: 64px, right: 18px)
            PaperProps={{ sx: { marginTop: '10px', marginRight: '-18px' } }}
          >
            <Box>
              {LANGS.map((l) => (
                <Box
                  key={l.code}
                  sx={styles.langItem}
                  onClick={() => handleLangSelect(l)}
                >
                  <img src={l.flag} alt={l.label} style={styles.flag} />
                  <Typography variant="body2">{l.label}</Typography>
                </Box>
              ))}
            </Box>
          </Popover>
          
        </Box>

        {/* NOTIFICATIONS BUTTON */}
        <Button
          sx={styles.iconButton}
          title="Notifications"
          onClick={() => navigate("/app/notification-center")}
        >
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <NotificationsIcon />
          </Badge>
        </Button>        {/* PROFILE BUTTON */}
        <Button 
          sx={{ 
            ...styles.iconButton,
            padding: 0,
            minWidth: 0,
          }} 
          title="Profile"
          onClick={() => navigate("/app/profile")} 
        >
          {profilePicture ? (
            <Avatar
              src={profilePicture}
              alt={userName}
              sx={{
                width: 36,
                height: 36,
                border: "2px solid #e6eef5",
                cursor: "pointer",
                transition: "border-color 0.2s",
                "&:hover": {
                  borderColor: "#3366ff",
                },
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <AccountCircleIcon sx={{ fontSize: 36 }} />
          )}
        </Button>        {/* SIGN OUT BUTTON (Opens Dialog) */}
        <Button
          sx={styles.signoutButton}
          title="Sign out"
          onClick={handleSignOutClick}
        >
          <LogoutIcon sx={styles.logoutIcon} />
        </Button>
      </Box>

      {/* LOGOUT CONFIRMATION DIALOG (MODAL) */}
      <Dialog
        open={isLogoutDialogOpen}
        onClose={handleCancelLogout}
        maxWidth="xs"
        PaperProps={{
            sx: { borderRadius: '12px', width: '100%' }
        }}
      >
        <DialogContent sx={styles.dialogContent}>
          
          {/* Warning Icon */}
          <WarningAmberIcon sx={styles.warningIcon} />
          
          {/* Title */}
          <Typography sx={styles.warningTitle}>
            Warning!
          </Typography>
          
          {/* Confirmation Text */}
          <Typography sx={styles.dialogText}>
            Do you really want to log out?
          </Typography>
          
          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
            <Button 
                onClick={handleCancelLogout} 
                variant="contained" 
                sx={styles.cancelButton}
            >
                Cancel
            </Button>
            <Button 
                onClick={handleConfirmLogout} 
                variant="contained" 
                sx={styles.confirmButton}
            >
                Confirm
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}