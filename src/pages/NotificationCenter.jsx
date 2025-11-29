// src/pages/NotificationCenter.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Grid,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  TextField,
  IconButton,
  Modal,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive"; // ⭐ ADDED Icon

// ⭐ Import Link from React Router
import { Link as RouterLink } from "react-router-dom"; 


// ------------------------------------------
// Dummy Data for dual selector
// ------------------------------------------
const dummyUsers = [
  { id: 1, name: "Administrador", email: "ctesting@flynet.sv" },
  { id: 2, name: "Victor Hernandez", email: "ctesting@flynet.sv" },
  { id: 3, name: "Edwin palacios", email: "ctesting@flynet.sv" },
];

// Define base styles for breadcrumb elements
const crumbLinkStyle = {
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
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


// ------------------------------------------
// MAIN COMPONENT
// ------------------------------------------
export default function NotificationCenter() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sendMode, setSendMode] = useState(false);

  const [availableUsers, setAvailableUsers] = useState(dummyUsers);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Move user → right
  const moveRight = (user) => {
    setAvailableUsers((prev) => prev.filter((u) => u.id !== user.id));
    setSelectedUsers((prev) => [...prev, user]);
  };

  // Move user ← left
  const moveLeft = (user) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id));
    setAvailableUsers((prev) => [...prev, user]);
  };

  // ------------------------------------------
  // DEFAULT NOTIFICATION CENTER VIEW
  // ------------------------------------------
  const renderDefaultView = () => (
    <Box sx={{ p: 3 }}>
      {/* Header + Breadcrumb */}
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Notification center
        </Typography>

        <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />}>
          {/* LINK: Home */}
          <MuiLink
            component={RouterLink}
            to="/app"
            underline="hover"
            color="inherit"
            sx={crumbLinkStyle}
          >
            <HomeIcon sx={{ fontSize: 18, mr: 0.5 }} />
            Home
          </MuiLink>
          
          {/* Current Page: Notification center */}
          <Typography sx={crumbActiveStyle}>
            <NotificationsActiveIcon sx={{ fontSize: 18, mr: 0.5 }} />
            Notification center
          </Typography>
        </Breadcrumbs>
      </Grid>

      {/* Top right buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}>
        <Button
          startIcon={<FilterAltIcon />}
          onClick={() => setFiltersOpen(true)}
          variant="text"
          sx={{ textTransform: "none" }}
        >
          Filters
        </Button>

        <Button
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            py: 1,
          }}
          onClick={() => setSendMode(true)}
        >
          Send Notification
        </Button>
      </Box>

      <Box sx={{ mt: 10, textAlign: "center" }}>
        <Typography sx={{ opacity: 0.6 }}>No notification</Typography>
      </Box>

      {/* Filters Modal */}
      {renderFiltersModal()}
    </Box>
  );

  // ------------------------------------------
  // FILTERS MODAL (Matches your Figma)
  // ------------------------------------------
  const renderFiltersModal = () => (
    <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)}>
      <Box
        sx={{
          width: 600,
          bgcolor: "#fff",
          borderRadius: 2,
          p: 3,
          mx: "auto",
          mt: "8%",
          boxShadow: 4,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            <FilterAltIcon sx={{ mr: 1 }} />
            Filters
          </Typography>
          <IconButton onClick={() => setFiltersOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <TextField label="Event" fullWidth sx={{ mb: 2 }} />
        <TextField label="Status" fullWidth sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              type="datetime-local"
              label="Start"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="datetime-local"
              label="End"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Box textAlign="right" mt={3}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#0a97ff",
              textTransform: "none",
              px: 4,
              py: 1,
              borderRadius: 10,
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  // ------------------------------------------
  // SEND NOTIFICATION VIEW
  // ------------------------------------------
  const renderSendNotification = () => (
    <Box sx={{ p: 3 }}>
      {/* Header + Breadcrumb */}
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Send Notification
        </Typography>

        <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />}>
          {/* LINK: Home */}
          <MuiLink
            component={RouterLink}
            to="/app"
            underline="hover"
            color="inherit"
            sx={crumbLinkStyle}
          >
            <HomeIcon sx={{ fontSize: 18, mr: 0.5 }} />
            Home
          </MuiLink>

          {/* LINK: Notification center */}
          <MuiLink
            component={RouterLink}
            to="/app/notification-center"
            underline="hover"
            color="inherit"
            sx={crumbLinkStyle}
          >
            <NotificationsActiveIcon sx={{ fontSize: 18, mr: 0.5 }} />
            Notification center
          </MuiLink>
          
          {/* Current Page: Send Notification */}
          <Typography sx={crumbActiveStyle}>
            Send Notification
          </Typography>
        </Breadcrumbs>
      </Grid>

      {/* Form */}
      <Box
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 3,
          bgcolor: "#fff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        {/* ROW 1 - Title + Link */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label="Enter a title" fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Optional" fullWidth />
          </Grid>
        </Grid>

        {/* DESCRIPTION */}
        <TextField
          label="Insert a description"
          fullWidth
          multiline
          rows={4}
          sx={{ mt: 3 }}
        />

        {/* Send to + Platforms */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField label="Users" fullWidth />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography sx={{ fontSize: 14, mb: 1 }}>Platforms</Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControlLabel control={<Checkbox />} label="Mobile" />
              <FormControlLabel control={<Checkbox />} label="Web" />
            </Box>
          </Grid>
        </Grid>

        {/* Dual list selector */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          {/* Left list */}
          <Grid item xs={12} md={5}>
            <Typography sx={{ fontWeight: 600 }}>Send to</Typography>
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: 2,
                p: 1,
                height: 250,
                overflowY: "auto",
              }}
            >
              {availableUsers.map((u) => (
                <Card
                  key={u.id}
                  elevation={0}
                  sx={{ p: 1.5, mb: 1, cursor: "pointer", border: '1px solid #eee' }}
                  onClick={() => moveRight(u)}
                >
                  <Typography sx={{ fontWeight: 700 }}>{u.name}</Typography>
                  <Typography sx={{ fontSize: 12 }}>{u.email}</Typography>
                </Card>
              ))}
            </Box>
          </Grid>

          {/* Middle arrows */}
          <Grid
            item
            xs={12}
            md={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <IconButton color="primary">
              <ArrowForwardIosIcon />
            </IconButton>
            <IconButton color="primary">
              <ArrowBackIosNewIcon />
            </IconButton>
          </Grid>

          {/* Right list */}
          <Grid item xs={12} md={5}>
            <Typography sx={{ fontWeight: 600 }}>Send to</Typography>
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: 2,
                p: 1,
                height: 250,
                overflowY: "auto",
              }}
            >
              {selectedUsers.map((u) => (
                <Card
                  key={u.id}
                  elevation={0}
                  sx={{ p: 1.5, mb: 1, cursor: "pointer", border: '1px solid #eee' }}
                  onClick={() => moveLeft(u)}
                >
                  <Typography sx={{ fontWeight: 700 }}>{u.name}</Typography>
                  <Typography sx={{ fontSize: 12 }}>{u.email}</Typography>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Bottom buttons */}
        <Box
          sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
        >
          <Button
            variant="contained"
            color="error"
            sx={{ textTransform: "none", px: 4 }}
            onClick={() => setSendMode(false)}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            sx={{
              bgcolor: "#0a97ff",
              textTransform: "none",
              px: 4,
              borderRadius: 10,
            }}
          >
            Send notification
          </Button>
        </Box>
      </Box>
    </Box>
  );

  // ------------------------------------------
  // RENDER
  // ------------------------------------------
  return sendMode ? renderSendNotification() : renderDefaultView();
}