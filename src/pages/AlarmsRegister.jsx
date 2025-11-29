// src/pages/AlarmsRegister.jsx
import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  InputAdornment, 
  Chip, 
} from "@mui/material";

// Icons
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline"; 
import SearchIcon from "@mui/icons-material/Search"; 
import HomeIcon from "@mui/icons-material/Home"; // ⭐ ADDED Icon
import AlarmOnIcon from "@mui/icons-material/AlarmOn"; // ⭐ ADDED Icon

import { useNavigate, Link as RouterLink } from "react-router-dom"; // Renamed Link to RouterLink for clarity

// Helper Component for Tabs
function TabPanel({ children, value, index }) {
  return (
    <Box role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} sx={{ pt: 2 }}>
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

export default function AlarmsRegister() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [searchLeft, setSearchLeft] = useState("");
  const [searchRight, setSearchRight] = useState("");
  const [pickedUsers, setPickedUsers] = useState([]); 
  const [pickedCameras, setPickedCameras] = useState([]);

  // Placeholder data for Users and Cameras (unchanged)
  const leftUserList = [
    { id: 1, name: "Administrator", email: "alexgomez@flynet.sv" },
    { id: 2, name: "Operator", email: "operator@flynet.sv" },
    { id: 3, name: "Supervisor", email: "sup@flynet.sv" },
    { id: 4, name: "Maintenance", email: "maintain@flynet.sv" },
    { id: 5, name: "Guest User", email: "guest@flynet.sv" },
  ];

  const leftCameraList = [
    { id: 101, name: "Camera - Lobby 1", location: "Building A" },
    { id: 102, name: "Camera - Parking E", location: "Exterior" },
    { id: 103, name: "Camera - Warehouse 5", location: "North Zone" },
    { id: 104, name: "Camera - Office 301", location: "Floor 3" },
  ];

  // --- Handlers (unchanged) ---
  function addToPickedUsers(item) {
    if (!pickedUsers.find((p) => p.id === item.id)) setPickedUsers((s) => [...s, item]);
  }

  function removePickedUsers(id) {
    setPickedUsers((s) => s.filter((p) => p.id !== id));
  }
  
  function addToPickedCameras(item) {
    if (!pickedCameras.find((p) => p.id === item.id)) setPickedCameras((s) => [...s, item]);
  }

  function removePickedCameras(id) {
    setPickedCameras((s) => s.filter((p) => p.id !== id));
  }

  // --- Filter Functions (unchanged) ---
  const filteredUsers = leftUserList
    .filter((l) => !pickedUsers.find(p => p.id === l.id)) 
    .filter((l) => l.name.toLowerCase().includes(searchLeft.toLowerCase()) || 
                     l.email.toLowerCase().includes(searchLeft.toLowerCase()));
                     
  const filteredCameras = leftCameraList
    .filter((l) => !pickedCameras.find(p => p.id === l.id)) 
    .filter((l) => l.name.toLowerCase().includes(searchLeft.toLowerCase()) || 
                     l.location.toLowerCase().includes(searchLeft.toLowerCase()));
                     
  const filteredPickedUsers = pickedUsers
    .filter((p) => p.name.toLowerCase().includes(searchRight.toLowerCase()) ||
                     p.email.toLowerCase().includes(searchRight.toLowerCase()));
                     
  const filteredPickedCameras = pickedCameras
    .filter((p) => p.name.toLowerCase().includes(searchRight.toLowerCase()) ||
                     p.location.toLowerCase().includes(searchRight.toLowerCase()));
                     
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      
      {/* Title + breadcrumb */}
      <Grid container alignItems="center" justifyContent="space-between" mb={2}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Alarms
            <Typography component="span" sx={{ ml: 1, color: "text.secondary", fontSize: 14 }}>
              Register
            </Typography>
          </Typography>
        </Grid>

        <Grid item>
          {/* ⭐ BREADCRUMB IMPLEMENTATION WITH /app LINKS AND ICONS */}
          <Box sx={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
            {/* 1. Home Link */}
            <RouterLink to="/app" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
                Home
              </Box>
            </RouterLink>
            
            <Typography component="span" sx={{ mx: 0.5, color: 'text.secondary' }}>&gt;</Typography>
            
            {/* 2. Alarms Link */}
            <RouterLink to="/app/alarms" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                <AlarmOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                Alarms
              </Box>
            </RouterLink>
            
            <Typography component="span" sx={{ mx: 0.5, color: 'text.secondary' }}>&gt;</Typography>
            
            {/* 3. Register (Active Page) */}
            <Typography component="span" sx={{ color: 'text.primary', fontWeight: 600, fontSize: 14 }}>
              Register
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      <Paper elevation={0} sx={{ borderRadius: 2, p: 3 }}>
        
        {/* Basic header inputs */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField label="Name" placeholder="Enter a name" fullWidth size="small" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Description" placeholder="Insert a description" fullWidth size="small" />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="primary" indicatorColor="primary">
            <Tab label="Users" />
            <Tab label="Cameras" />
          </Tabs>
          
          <Divider />

          {/* --- USERS TAB CONTENT --- */}
          <TabPanel value={tab} index={0}>
            <Grid container spacing={3}>
              
              {/* Available Users List */}
              <Grid item xs={12} md={5}>
                <Typography variant="h6" gutterBottom>Available Users</Typography>
                <TextField
                  placeholder="Search available users..."
                  fullWidth
                  size="small"
                  value={searchLeft}
                  onChange={(e) => setSearchLeft(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ mt: 2, borderRadius: 1, border: "1px solid #e6e9ee", p: 1, maxHeight: 300, overflowY: 'auto' }}>
                  <List dense disablePadding>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((l) => (
                        <ListItem key={l.id} secondaryAction={
                          <IconButton edge="end" onClick={() => addToPickedUsers(l)} size="small" aria-label="add user">
                            <AddCircleOutlineIcon color="primary" />
                          </IconButton>
                        }>
                          <ListItemText 
                                primary={<Typography variant="body1" sx={{ fontWeight: 500 }}>{l.name}</Typography>} 
                                secondary={l.email} 
                            />
                        </ListItem>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                        {leftUserList.length === 0 ? "No users available." : "No matching users found."}
                      </Typography>
                    )}
                  </List>
                </Box>
              </Grid>

              {/* Transfer Center (Visual placeholder) */}
              <Grid item xs={12} md={2} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Box 
                    sx={{ 
                        display: "flex", 
                        flexDirection: { xs: 'row', md: 'column' }, 
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: '#f5f5f5' 
                    }} 
                >
                    <Box sx={{ width: 36, height: 36, borderRadius: 1, background: "#0d6efd" }} title="Transfer left to right" />
                  <Box sx={{ width: 36, height: 36, borderRadius: 1, background: "#0d6efd" }} title="Transfer right to left" />
                </Box>
              </Grid>

              {/* Picked Users List */}
              <Grid item xs={12} md={5}>
                <Typography variant="h6" gutterBottom>Selected Users</Typography>
                <TextField
                  placeholder="Search selected users..."
                  fullWidth
                  size="small"
                  value={searchRight}
                  onChange={(e) => setSearchRight(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ mt: 2, borderRadius: 1, border: "1px solid #e6e9ee", p: 1, maxHeight: 300, overflowY: 'auto' }}>
                  <List dense disablePadding>
                    {filteredPickedUsers.length > 0 ? (
                      filteredPickedUsers.map((p) => (
                        <ListItem 
                            key={p.id} 
                            secondaryAction={
                            <Chip 
                                label="Remove" 
                                size="small" 
                                onClick={() => removePickedUsers(p.id)}
                                onDelete={() => removePickedUsers(p.id)}
                                icon={<RemoveCircleOutlineIcon />}
                                color="error"
                                variant="outlined"
                            />
                          }
                        >
                          <ListItemText 
                                primary={<Typography variant="body1" sx={{ fontWeight: 500 }}>{p.name}</Typography>} 
                                secondary={p.email} 
                            />
                        </ListItem>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                        No users selected yet.
                      </Typography>
                    )}
                  </List>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* --- CAMERAS TAB CONTENT --- */}
          <TabPanel value={tab} index={1}>
            <Grid container spacing={3}>
              
              {/* Available Cameras List */}
              <Grid item xs={12} md={5}>
                <Typography variant="h6" gutterBottom>Available Cameras</Typography>
                <TextField 
                    placeholder="Search available cameras..." 
                    fullWidth 
                    size="small" 
                    value={searchLeft}
                    onChange={(e) => setSearchLeft(e.target.value)}
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                        ),
                    }}
                />
                <Box sx={{ mt: 2, borderRadius: 1, border: "1px solid #e6e9ee", p: 1, maxHeight: 300, overflowY: 'auto' }}>
                    <List dense disablePadding>
                    {filteredCameras.length > 0 ? (
                        filteredCameras.map((c) => (
                            <ListItem key={c.id} secondaryAction={
                                <IconButton edge="end" onClick={() => addToPickedCameras(c)} size="small" aria-label="add camera">
                                    <AddCircleOutlineIcon color="primary" />
                                </IconButton>
                            }>
                                <ListItemText 
                                    primary={<Typography variant="body1" sx={{ fontWeight: 500 }}>{c.name}</Typography>} 
                                    secondary={c.location} 
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                            No cameras available.
                        </Typography>
                    )}
                    </List>
                </Box>
              </Grid>

              {/* Transfer Center (Visual placeholder) */}
              <Grid item xs={12} md={2} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Box 
                    sx={{ 
                        display: "flex", 
                        flexDirection: { xs: 'row', md: 'column' }, 
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: '#f5f5f5' 
                    }} 
                >
                    <Box sx={{ width: 36, height: 36, borderRadius: 1, background: "#0d6efd" }} title="Transfer left to right" />
                  <Box sx={{ width: 36, height: 36, borderRadius: 1, background: "#0d6efd" }} title="Transfer right to left" />
                </Box>
              </Grid>

              {/* Picked Cameras List */}
              <Grid item xs={12} md={5}>
                <Typography variant="h6" gutterBottom>Selected Cameras</Typography>
                <TextField 
                    placeholder="Search selected cameras..." 
                    fullWidth 
                    size="small"
                    value={searchRight}
                  onChange={(e) => setSearchRight(e.target.value)} 
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                        ),
                    }}
                />
                <Box sx={{ mt: 2, borderRadius: 1, border: "1px solid #e6e9ee", p: 1, minHeight: 160, maxHeight: 300, overflowY: 'auto' }}>
                  <List dense disablePadding>
                    {filteredPickedCameras.length > 0 ? (
                        filteredPickedCameras.map((p) => (
                            <ListItem 
                                key={p.id} 
                                secondaryAction={
                                    <Chip 
                                        label="Remove" 
                                        size="small" 
                                        onClick={() => removePickedCameras(p.id)}
                                        onDelete={() => removePickedCameras(p.id)}
                                        icon={<RemoveCircleOutlineIcon />}
                                        color="error"
                                        variant="outlined"
                                    />
                                }
                            >
                                <ListItemText 
                                    primary={<Typography variant="body1" sx={{ fontWeight: 500 }}>{p.name}</Typography>} 
                                    secondary={p.location} 
                                />
                            </ListItem>
                        ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                        No cameras selected yet.
                      </Typography>
                    )}
                  </List>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button 
                variant="contained" 
                color="error" 
                // Navigation to /app/alarms
                onClick={() => navigate('/app/alarms')}
            >
            Cancel
          </Button>

          <Button 
                variant="contained" 
                color="primary" 
                onClick={() => {
                    console.log("Saving Alarm with Users:", pickedUsers, "and Cameras:", pickedCameras);
                    alert("Alarm saved (placeholder)");
                    navigate('/app/alarms'); // Redirect on success
                }}
            >
            Save
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}