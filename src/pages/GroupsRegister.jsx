// src/pages/GroupsRegister.jsx
import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Tabs,
  Tab,
  Switch,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import HomeIcon from "@mui/icons-material/Home"; // ⭐ ADDED Icon
import GroupIcon from "@mui/icons-material/Group"; // ⭐ ADDED Icon
import { useNavigate, Link as RouterLink } from "react-router-dom";

/**
 * GroupsRegister.jsx
 * - Figma-like layout
 * - Tabs: Users, Cameras, Permissions, Notifications, Comments
 * - Left: selectable list with + icons
 * - Center: stacked blue boxes (Option A) exactly like Figma
 * - Right: picks box
 * - Save / Cancel buttons
 */

const sampleUsers = [
  { id: 1, name: "Administrator", email: "alexgomez@flynet.sv" },
  { id: 2, name: "Administrator", email: "alexgomez2@flynet.sv" },
  { id: 3, name: "Administrator", email: "alexgomez3@flynet.sv" },
];

// Define base styles for breadcrumb elements
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
};
const crumbActiveStyle = {
  color: 'text.primary',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
};

export default function GroupsRegister() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [name, setName] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [isExternalDefault, setIsExternalDefault] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [users] = useState(sampleUsers);
  const [picks, setPicks] = useState([]);
  const [searchLeft, setSearchLeft] = useState("");
  const [searchRight, setSearchRight] = useState("");
  const [comments, setComments] = useState("");

  function handleAddPick(user) {
    if (!picks.find((p) => p.id === user.id)) {
      setPicks((s) => [...s, user]);
    }
  }

  function handleRemovePick(userId) {
    setPicks((s) => s.filter((p) => p.id !== userId));
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header + breadcrumb */}
      <Grid container alignItems="center" justifyContent="space-between" mb={2}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Groups{" "}
            <Typography component="span" variant="subtitle2" sx={{ color: "text.secondary", ml: 1 }}>
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
            
            {/* LINK: Groups */}
            <RouterLink to="/app/groups" style={crumbLinkStyle}>
              <Box sx={crumbTextStyle}>
                <GroupIcon fontSize="small" sx={{ mr: 0.5 }} />
                Groups
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

      {/* Main rounded card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          border: "1px solid rgba(47,63,86,0.06)",
          position: "relative",
        }}
      >
        <Grid container spacing={3}>
          {/* Top row: group name + switches */}
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Enter a name"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
              sx={{ "& .MuiInputBase-root": { borderRadius: 3 } }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Grid container spacing={1} justifyContent="flex-end" alignItems="center">
              <Grid item>
                <Typography variant="body2">Default</Typography>
                <Switch checked={isDefault} onChange={() => setIsDefault((s) => !s)} />
              </Grid>
              <Grid item>
                <Typography variant="body2">External default</Typography>
                <Switch checked={isExternalDefault} onChange={() => setIsExternalDefault((s) => !s)} />
              </Grid>
              <Grid item>
                <Typography variant="body2">Active</Typography>
                <Switch checked={isActive} onChange={() => setIsActive((s) => !s)} color="success" />
              </Grid>
            </Grid>
          </Grid>

          {/* Tabs area */}
          <Grid item xs={12}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                "& .MuiTabs-flexContainer": { gap: 2 },
                mb: 2,
              }}
            >
              <Tab label="Users" />
              <Tab label="Cameras" />
              <Tab label="Permissions" />
              <Tab label="Notifications" />
              <Tab label="Comments" />
            </Tabs>

            <Divider sx={{ mb: 2 }} />

            {/* Tab panels - keep layout consistent for each tab */}
            <Box>
              {tab === 0 && (
                // USERS tab (default view)
                <Grid container spacing={3}>
                  {/* Left list */}
                  <Grid item xs={12} md={5}>
                    <TextField
                      placeholder="Search.."
                      size="small"
                      value={searchLeft}
                      onChange={(e) => setSearchLeft(e.target.value)}
                      fullWidth
                      sx={{ mb: 1, "& .MuiInputBase-root": { borderRadius: 2 } }}
                    />

                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ p: 1 }}>
                        <List>
                          {users
                            .filter((u) => u.name.toLowerCase().includes(searchLeft.trim().toLowerCase()))
                            .map((u) => (
                              <ListItem
                                key={u.id}
                                secondaryAction={
                                  <IconButton edge="end" aria-label="add" onClick={() => handleAddPick(u)}>
                                    <AddIcon sx={{ color: "#0f5fe7" }} />
                                  </IconButton>
                                }
                                sx={{ py: 1.5 }}
                              >
                                <ListItemText
                                  primary={<Typography sx={{ fontWeight: 700 }}>{u.name}</Typography>}
                                  secondary={<Typography variant="caption">{u.email}</Typography>}
                                />
                              </ListItem>
                            ))}

                          {users.filter((u) => u.name.toLowerCase().includes(searchLeft.trim().toLowerCase()))
                            .length === 0 && (
                            <ListItem>
                              <ListItemText primary="No users" />
                            </ListItem>
                          )}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* center stacked blue boxes (Option A) */}
                  <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {/* stacked boxes exactly like Figma */}
                      <Box sx={{ width: 44, height: 36, bgcolor: "#0f5fe7", borderRadius: 1 }} />
                      <Box sx={{ width: 44, height: 36, bgcolor: "#0f5fe7", borderRadius: 1 }} />
                    </Box>
                  </Grid>

                  {/* right picks */}
                  <Grid item xs={12} md={5}>
                    <TextField
                      placeholder="Search.."
                      size="small"
                      value={searchRight}
                      onChange={(e) => setSearchRight(e.target.value)}
                      fullWidth
                      sx={{ mb: 1, "& .MuiInputBase-root": { borderRadius: 2 } }}
                    />

                    <Card variant="outlined" sx={{ borderRadius: 2, minHeight: 180 }}>
                      <CardContent sx={{ p: 1 }}>
                        {picks.length === 0 ? (
                          <Box sx={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography color="text.secondary">No picks yet</Typography>
                          </Box>
                        ) : (
                          <List>
                            {picks
                              .filter((p) => p.name.toLowerCase().includes(searchRight.trim().toLowerCase()))
                              .map((p) => (
                                <ListItem
                                  key={p.id}
                                  secondaryAction={
                                    <IconButton edge="end" onClick={() => handleRemovePick(p.id)}>
                                      <ArrowForwardIosIcon sx={{ transform: "rotate(180deg)", fontSize: 18 }} />
                                    </IconButton>
                                  }
                                  sx={{ py: 1.5 }}
                                >
                                  <ListItemText
                                    primary={<Typography sx={{ fontWeight: 700 }}>{p.name}</Typography>}
                                    secondary={<Typography variant="caption">{p.email}</Typography>}
                                  />
                                </ListItem>
                              ))}
                          </List>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {tab === 1 && (
                // Cameras tab placeholder (structure only, implement details later)
                <Grid container spacing={3}>
                  {/* Left list */}
                  <Grid item xs={12} md={5}>
                    <TextField
                      placeholder="Search.."
                      size="small"
                      value={searchLeft}
                      onChange={(e) => setSearchLeft(e.target.value)}
                      fullWidth
                      sx={{ mb: 1, "& .MuiInputBase-root": { borderRadius: 2 } }}
                    />

                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ p: 1 }}>
                        <List>
                          <ListItem>
                            <ListItemText primary="Camera A (Placeholder)" secondary="Location: Zone 1" />
                            <IconButton edge="end" aria-label="add" onClick={() => handleAddPick({ id: 101, name: "Camera A", email: "Zone 1" })}>
                              <AddIcon sx={{ color: "#0f5fe7" }} />
                            </IconButton>
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="Camera B (Placeholder)" secondary="Location: Zone 2" />
                            <IconButton edge="end" aria-label="add" onClick={() => handleAddPick({ id: 102, name: "Camera B", email: "Zone 2" })}>
                              <AddIcon sx={{ color: "#0f5fe7" }} />
                            </IconButton>
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* center stacked blue boxes (Option A) */}
                  <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {/* stacked boxes exactly like Figma */}
                      <Box sx={{ width: 44, height: 36, bgcolor: "#0f5fe7", borderRadius: 1 }} />
                      <Box sx={{ width: 44, height: 36, bgcolor: "#0f5fe7", borderRadius: 1 }} />
                    </Box>
                  </Grid>

                  {/* right picks */}
                  <Grid item xs={12} md={5}>
                    <TextField
                      placeholder="Search.."
                      size="small"
                      value={searchRight}
                      onChange={(e) => setSearchRight(e.target.value)}
                      fullWidth
                      sx={{ mb: 1, "& .MuiInputBase-root": { borderRadius: 2 } }}
                    />

                    <Card variant="outlined" sx={{ borderRadius: 2, minHeight: 180 }}>
                      <CardContent sx={{ p: 1 }}>
                        {picks.filter(p => p.id > 100).length === 0 ? (
                          <Box sx={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography color="text.secondary">No camera picks yet</Typography>
                          </Box>
                        ) : (
                          <List>
                            {picks
                              .filter((p) => p.id > 100 && p.name.toLowerCase().includes(searchRight.trim().toLowerCase()))
                              .map((p) => (
                                <ListItem
                                  key={p.id}
                                  secondaryAction={
                                    <IconButton edge="end" onClick={() => handleRemovePick(p.id)}>
                                      <ArrowForwardIosIcon sx={{ transform: "rotate(180deg)", fontSize: 18 }} />
                                    </IconButton>
                                  }
                                  sx={{ py: 1.5 }}
                                >
                                  <ListItemText
                                    primary={<Typography sx={{ fontWeight: 700 }}>{p.name}</Typography>}
                                    secondary={<Typography variant="caption">{p.email}</Typography>}
                                  />
                                </ListItem>
                              ))}
                          </List>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {tab === 2 && (
                // Permissions tab: replicate the toggle rows style from Figma
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1 }}>
                      <Typography>Send panic alerts</Typography>
                      <Switch />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1 }}>
                      <Typography>Enable chat</Typography>
                      <Switch />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1 }}>
                      <Typography>View recordings</Typography>
                      <Switch />
                    </Box>
                  </Grid>
                </Grid>
              )}

              {tab === 3 && (
                // Notifications tab example toggles
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1 }}>
                      <Typography>Panic alerts</Typography>
                      <Switch />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1 }}>
                      <Typography>Offline camera</Typography>
                      <Switch />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1 }}>
                      <Typography>Analytical</Typography>
                      <Switch />
                    </Box>
                    
                  </Grid>
                </Grid>
              )}

              {tab === 4 && (
                // Comments tab
                <Box>
                  <TextField
                    multiline
                    minRows={4}
                    placeholder="Insert an observation"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    fullWidth
                    sx={{ "& .MuiInputBase-root": { borderRadius: 2 } }}
                  />
                </Box>
              )}
            </Box>

            {/* footer action buttons */}
            <Grid container alignItems="center" justifyContent="space-between" sx={{ mt: 4 }}>
              <Grid item>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    // cancel -> go back to groups list
                    navigate("/groups");
                  }}
                  sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
                >
                  Cancel
                </Button>
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    // Save operation placeholder
                    // TODO: call API to save group
                    console.log({
                      name,
                      isDefault,
                      isExternalDefault,
                      isActive,
                      tab,
                      picks,
                      comments,
                    });
                    // navigate back to groups list after save
                    navigate("/groups");
                  }}
                  sx={{ textTransform: "none", borderRadius: 2, px: 3, bgcolor: "#14345c" }}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}