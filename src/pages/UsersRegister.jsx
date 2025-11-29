// src/pages/UsersRegister.jsx
import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  ToggleButton,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom"; // ⭐ ADDED RouterLink
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home"; // ⭐ ADDED Icon
import PersonIcon from "@mui/icons-material/Person"; // ⭐ ADDED Icon

function DualList({ leftItems, setLeftItems, rightItems, setRightItems }) {
  const [leftQuery, setLeftQuery] = useState("");
  const [rightQuery, setRightQuery] = useState("");

  function addItem(item) {
    setLeftItems(leftItems.filter((i) => i.id !== item.id));
    setRightItems([item, ...rightItems]);
  }
  function removeItem(item) {
    setRightItems(rightItems.filter((i) => i.id !== item.id));
    setLeftItems([item, ...leftItems]);
  }

  return (
    <Grid container spacing={2} alignItems="flex-start">
      <Grid item xs={5}>
        <TextField fullWidth placeholder="Search.." size="small" value={leftQuery} onChange={(e) => setLeftQuery(e.target.value)} />
        <Paper variant="outlined" sx={{ mt: 1, p: 1, minHeight: 200 }}>
          <List dense>
            {leftItems.filter(i => i.name.toLowerCase().includes(leftQuery.toLowerCase())).map((it) => (
              <ListItem key={it.id} secondaryAction={
                <IconButton edge="end" size="small" onClick={() => addItem(it)}>
                  <AddIcon sx={{ color: "#0A64D6" }} />
                </IconButton>
              }>
                <ListItemText primary={it.name} secondary={it.meta} />
              </ListItem>
            ))}
            {leftItems.length === 0 && <Typography color="text.secondary" align="center">No items</Typography>}
          </List>
        </Paper>
      </Grid>

      <Grid item xs={2} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ display: "grid", gap: 2 }}>
          <Box sx={{ width: 44, height: 44, bgcolor: "#0A64D6", borderRadius: 1 }} />
          <Box sx={{ width: 44, height: 44, bgcolor: "#0A64D6", borderRadius: 1 }} />
        </Box>
      </Grid>

      <Grid item xs={5}>
        <TextField fullWidth placeholder="Search.." size="small" value={rightQuery} onChange={(e) => setRightQuery(e.target.value)} />
        <Paper variant="outlined" sx={{ mt: 1, p: 1, minHeight: 200 }}>
          <List dense>
            {rightItems.filter(i => i.name.toLowerCase().includes(rightQuery.toLowerCase())).map((it) => (
              <ListItem key={it.id} secondaryAction={
                <IconButton edge="end" size="small" onClick={() => removeItem(it)}>
                  <Typography sx={{ color: "#0A64D6", fontWeight: 700 }}>−</Typography>
                </IconButton>
              }>
                <ListItemText primary={it.name} secondary={it.meta} />
              </ListItem>
            ))}
            {rightItems.length === 0 && <Typography color="text.secondary" align="center">No picks yet</Typography>}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default function UsersRegister() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  // sample lists used by dual components (groups/permissions/mosaics/patrols)
  const sample = [
    { id: 1, name: "Administrator", meta: "alexgomez@flynet.sv" },
    { id: 2, name: "Administrator 2", meta: "admin2@flynet.sv" },
    { id: 3, name: "Administrator 3", meta: "admin3@flynet.sv" },
    { id: 4, name: "Administrator 4", meta: "admin4@flynet.sv" },
  ];

  const [leftGroups, setLeftGroups] = useState(sample);
  const [rightGroups, setRightGroups] = useState([]);

  const [leftPerms, setLeftPerms] = useState(sample);
  const [rightPerms, setRightPerms] = useState([]);

  const [leftMosaics, setLeftMosaics] = useState(sample);
  const [rightMosaics, setRightMosaics] = useState([]);

  const [leftPatrols, setLeftPatrols] = useState(sample);
  const [rightPatrols, setRightPatrols] = useState([]);

  // Base styles for breadcrumb elements
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

  return (
    <Box sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Users <Typography component="span" sx={{ fontSize: 14, color: "text.secondary", ml: 1 }}>Register</Typography>
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
            
            {/* LINK: Users */}
            <RouterLink to="/app/users" style={crumbLinkStyle}>
              <Box sx={crumbTextStyle}>
                <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
                Users
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

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField fullWidth placeholder="Enter a name" size="small" label="Name" />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth placeholder="Insert email" size="small" label="Email" />
          </Grid>

          <Grid item xs={12} md={4} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <TextField fullWidth placeholder="Optional" size="small" label="Password" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField fullWidth placeholder="Optional" size="small" label="Confirm password" />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} indicatorColor="primary" textColor="primary" sx={{ mb: 2 }}>
              <Tab label="Physical person" />
              <Tab label="Groups" />
              <Tab label="Permissions" />
              <Tab label="Mosaics" />
              <Tab label="Patrols" />
            </Tabs>

            {/* TAB PANES */}
            {tab === 0 && (
              <Box>
                {/* simple inputs for physical person */}
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Phone" placeholder="" size="small" />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label="SSN" placeholder="" size="small" />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label="CPF" placeholder="" size="small" />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Postal Code" placeholder="" size="small" />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label="State" placeholder="" size="small" />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth label="City" placeholder="" size="small" />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField fullWidth label="Comments" placeholder="Insert an observation..." multiline rows={3} />
                  </Grid>
                </Grid>
              </Box>
            )}

            {tab === 1 && (
              <Box>
                <DualList
                  leftItems={leftGroups}
                  setLeftItems={setLeftGroups}
                  rightItems={rightGroups}
                  setRightItems={setRightGroups}
                />
              </Box>
            )}

            {tab === 2 && (
              <Box>
                <DualList
                  leftItems={leftPerms}
                  setLeftItems={setLeftPerms}
                  rightItems={rightPerms}
                  setRightItems={setRightPerms}
                />
              </Box>
            )}

            {tab === 3 && (
              <Box>
                <DualList
                  leftItems={leftMosaics}
                  setLeftItems={setLeftMosaics}
                  rightItems={rightMosaics}
                  setRightItems={setRightMosaics}
                />
              </Box>
            )}

            {tab === 4 && (
              <Box>
                <DualList
                  leftItems={leftPatrols}
                  setLeftItems={setLeftPatrols}
                  rightItems={rightPatrols}
                  setRightItems={setRightPatrols}
                />
              </Box>
            )}
          </Grid>
        </Grid>

        {/* bottom actions area */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button variant="contained" color="error" onClick={() => navigate(-1)} sx={{ px: 3 }}>
            Cancel
          </Button>

          <Button variant="contained" onClick={() => navigate("/users")} sx={{ px: 3, background: "#2B4769" }}>
            Save
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}