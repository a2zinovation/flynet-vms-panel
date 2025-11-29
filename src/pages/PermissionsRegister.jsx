// src/pages/PermissionsRegister.jsx
import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Switch,
  Button,
  Paper,
  IconButton,
  Divider,
  InputAdornment,
  Tooltip,
  // Added List components used in renderUsersPicker
  List, 
  ListItem,
  ListItemText,
  Card,
  CardContent,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom"; 
import SearchIcon from "@mui/icons-material/Search";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import HomeIcon from "@mui/icons-material/Home"; 
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import VpnKeyIcon from "@mui/icons-material/VpnKey"; 
import AddIcon from "@mui/icons-material/Add"; // ⭐ RE-ADDED AddIcon
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"; // ⭐ RE-ADDED Arrow Icon

const ALL_TABS = [
  "Users",
  "Manage users",
  "Cameras",
  "Groups",
  "Mosaics",
  "Patrols",
  "Alarms",
  "Videos",
  "Monitoring",
  "Permissions",
  "Platform",
  "Web",
  "Mobile",
  "Notification",
  "Comments",
];

// Sample data structure for the lists
const sampleItems = [
    { id: 1, name: "Administrator", email: "alexgomez@flynet.sv" },
    { id: 2, name: "Administrator 2", email: "victorh@flynet.sv" },
    { id: 3, name: "Administrator 3", email: "edwinlino@flynet.sv" },
];

function ToggleRow({ label, value, onChange }) {
  return (
    <Grid container alignItems="center" spacing={1} sx={{ mb: 1 }}>
      <Grid item xs={7} sm={6}>
        <Typography>{label}</Typography>
      </Grid>
      <Grid item xs={5} sm={6} sx={{ textAlign: { xs: "left", sm: "right" } }}>
        <Tooltip title={value ? "Enabled" : "Disabled"}>
          <IconButton
            onClick={() => onChange(!value)}
            size="small"
            sx={{
              borderRadius: 3,
              background: "#f0f0f0",
              width: 50,
              height: 30,
              "&:hover": { background: "#e8e8e8" },
            }}
          >
            {value ? <ToggleOnIcon sx={{ color: "#16a34a" }} /> : <ToggleOffIcon />}
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
}

export default function PermissionsRegister() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [selectedTab, setSelectedTab] = useState("Users");

  // State for the item picker (Users tab)
  const [availableItems, setAvailableItems] = useState(sampleItems);
  const [pickedItems, setPickedItems] = useState([]);
  const [searchLeft, setSearchLeft] = useState("");
  const [searchRight, setSearchRight] = useState("");


  function handleAddPick(item) {
    // Move item from available to picked
    setAvailableItems(prev => prev.filter(i => i.id !== item.id));
    setPickedItems(prev => [...prev, item]);
  }

  function handleRemovePick(itemId) {
    // Move item from picked back to available
    const itemToRemove = pickedItems.find(i => i.id === itemId);
    if (itemToRemove) {
        setPickedItems(prev => prev.filter(i => i.id !== itemId));
        setAvailableItems(prev => [...prev, itemToRemove].sort((a,b) => a.id - b.id)); // Simple re-sort
    }
  }


  // Example state for toggles (grouped by tab)
  const [toggles, setToggles] = useState({
    "Manage users": { add: false, edit: false, del: false },
    Cameras: { add: false, edit: false, del: false, export: false },
    Groups: { add: false, edit: false, del: false },
    Mosaics: { my: false, add: false, edit: false, del: false },
    Patrols: { my: false, add: false, edit: false, order: false },
    Alarms: { my: false, add: false, edit: false, del: false },
    Videos: { my: false },
    Monitoring: { enable: false },
    Permissions: { add: false, edit: false, del: false },
    Platform: { customize: false, accessMgmt: false, activityLog: false, viewChange: false, layer3: false },
    Web: { access: false },
    Mobile: { access: false, panic: false },
    Notification: { panic: false, offline: false, analytical: false, sendPlatform: false },
    Comments: { text: "" },
  });

  function setToggle(tab, key, val) {
    setToggles((t) => ({ ...t, [tab]: { ...(t[tab] || {}), [key]: val } }));
  }

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

  // ----- per-tab content renderers -----
  function renderUsersPicker() {
    
    const filteredAvailable = availableItems.filter(u => 
        u.name.toLowerCase().includes(searchLeft.trim().toLowerCase()) || 
        u.email.toLowerCase().includes(searchLeft.trim().toLowerCase())
    );
    const filteredPicked = pickedItems.filter(p => 
        p.name.toLowerCase().includes(searchRight.trim().toLowerCase()) ||
        p.email.toLowerCase().includes(searchRight.trim().toLowerCase())
    );

    return (
      <Grid container spacing={3}>
        {/* Left list (Available items) */}
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            placeholder="Search..."
            size="small"
            value={searchLeft}
            onChange={(e) => setSearchLeft(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
            sx={{ mb: 2 }}
          />
          
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 1 }}>
                <List sx={{ maxHeight: 250, overflow: 'auto' }}>
                    {filteredAvailable.map((u) => (
                        <ListItem
                            key={u.id}
                            secondaryAction={
                                <IconButton edge="end" aria-label="add" onClick={() => handleAddPick(u)}>
                                    {/* ⭐ ADDED: The original Plus Icon */}
                                    <AddIcon sx={{ color: "#0f5fe7" }} /> 
                                </IconButton>
                            }
                            sx={{ py: 0.5 }}
                        >
                            <ListItemText
                                primary={<Typography sx={{ fontWeight: 700 }}>{u.name}</Typography>}
                                secondary={<Typography variant="caption">{u.email}</Typography>}
                            />
                        </ListItem>
                    ))}

                    {filteredAvailable.length === 0 && (
                        <ListItem>
                            <ListItemText primary="No items found" />
                        </ListItem>
                    )}
                </List>
            </CardContent>
          </Card>
        </Grid>

        {/* center stacked blue boxes (Option A) */}
        <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ width: 48, height: 36, bgcolor: "#0f73ff", borderRadius: 2 }} />
            <Box sx={{ width: 48, height: 36, bgcolor: "#0f73ff", borderRadius: 2 }} />
          </Box>
        </Grid>

        {/* right picks (Picked items) */}
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            placeholder="Search..."
            size="small"
            value={searchRight}
            onChange={(e) => setSearchRight(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
            sx={{ mb: 2 }}
          />
          
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 1 }}>
                {filteredPicked.length === 0 ? (
                  <Box sx={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography color="text.secondary">No picks yet</Typography>
                  </Box>
                ) : (
                    <List sx={{ maxHeight: 250, overflow: 'auto' }}>
                      {filteredPicked.map((p) => (
                          <ListItem
                              key={p.id}
                              secondaryAction={
                                <IconButton edge="end" onClick={() => handleRemovePick(p.id)}>
                                    {/* ⭐ ADDED: The original reverse arrow icon */}
                                    <ArrowForwardIosIcon sx={{ transform: "rotate(180deg)", fontSize: 18 }} />
                                </IconButton>
                              }
                              sx={{ py: 0.5 }}
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
    );
  }

  function renderToggleGridFor(tabKey) {
    const tab = toggles[tabKey] || {};
    // create two-column layout for toggles
    const items = Object.keys(tab).filter(k => k !== "text");
    // Map pretty labels based on key
    const pretty = {
      add: "Add",
      edit: "Edit",
      del: "Delete",
      export: "Enable Report Export",
      my: "My mosaics",
      order: "Order patrols",
      accessMgmt: "Access management",
      activityLog: "Activity Log",
      viewChange: "View changelog",
      customize: "Customize",
      layer3: "3rd Layer Management",
      access: "Platform access",
      panic: "Send panic alerts",
      offline: "Offline camera",
      analytical: "Analytical",
      sendPlatform: "Send notification (Platform)",
      enable: "Monitoring",
    };

    return (
      <Grid container spacing={2}>
        {items.length === 0 && (
          <Grid item xs={12}>
            <Typography color="text.secondary">No options</Typography>
          </Grid>
        )}
        {items.map((k, idx) => (
          <Grid item xs={12} sm={6} key={k}>
            <ToggleRow
              label={pretty[k] || k}
              value={!!tab[k]}
              onChange={(v) => setToggle(tabKey, k, v)}
            />
          </Grid>
        ))}

        {/* Comments special area */}
        {tabKey === "Comments" && (
          <Grid item xs={12}>
            <TextField
              placeholder="Insert a observation..."
              fullWidth
              multiline
              minRows={4}
              value={tab.text || ""}
              onChange={(e) => setToggle("Comments", "text", e.target.value)}
            />
          </Grid>
        )}
      </Grid>
    );
  }

  // Main content switch
  function renderContentFor(tabName) {
    if (tabName === "Users") return renderUsersPicker();
    // For other tabs, show toggles with appropriate keys
    if (ALL_TABS.includes(tabName)) {
      return renderToggleGridFor(tabName);
    }
    return <Typography>No content</Typography>;
  }

  // ----- layout -----
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Permissions <Typography component="span" sx={{ color: "text.secondary", ml: 1 }}>Register</Typography>
          </Typography>
        </Grid>

        {/* breadcrumb on right (Figma) */}
        <Grid item>
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
            
            {/* LINK: Permissions */}
            <RouterLink to="/app/permissions" style={crumbLinkStyle}>
              <Box sx={crumbTextStyle}>
                <LockOpenRoundedIcon fontSize="small" sx={{ mr: 0.5 }} />
                Permissions
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

      <Paper elevation={0} sx={{ borderRadius: 2, p: 3 }}>
        {/* Top row: name, default permission and active switch */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              placeholder="Enter a name."
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>

          <Grid item xs={6} sm={2} md={2}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2">Default permission</Typography>
              <Switch checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
            </Box>
          </Grid>

          <Grid item xs={6} sm={3} md={3} sx={{ textAlign: { xs: "left", md: "right" } }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2">Active</Typography>
              <Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2, borderStyle: "dashed" }} />

        {/* Tab row - auto-wrap */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mb: 2,
            // make the tab row visually close to Figma: light icons and small paddings
            "& > button": {
              textTransform: "none",
              borderRadius: 2,
              px: 2,
              py: 1,
              bgcolor: "transparent",
            },
          }}
        >
          {ALL_TABS.map((t) => {
            const active = t === selectedTab;
            return (
              <Button
                key={t}
                onClick={() => setSelectedTab(t)}
                variant={active ? "contained" : "outlined"}
                size="medium"
                sx={{
                  borderColor: active ? "#0f73ff" : "#e6e9ee",
                  bgcolor: active ? "#f6f9ff" : "transparent",
                  color: active ? "primary.main" : "text.primary",
                  minWidth: 120,
                }}
              >
                {t}
              </Button>
            );
          })}
        </Box>

        {/* content area (this is where you asked to adjust from minHeight:200) */}
        <Box
          sx={{
            minHeight: 260,
            p: { xs: 1, md: 2 },
            mt: 1,
          }}
        >
          {/* Render content for the selected tab */}
          {renderContentFor(selectedTab)}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Footer actions: Cancel left, Save right */}
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Button 
                variant="contained" 
                color="error" 
                sx={{ textTransform: "none", px: 3 }}
                onClick={() => navigate('/permissions')}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            <Button 
                variant="contained" 
                color="primary" 
                sx={{ textTransform: "none", px: 3, bgcolor: "#14345c" }}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}