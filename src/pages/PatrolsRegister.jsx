// src/pages/PatrolsRegister.jsx
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
  Switch,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom"; // ⭐ ADDED Link
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home"; // ⭐ ADDED Icon
import MovieCreationRoundedIcon from '@mui/icons-material/MovieCreationRounded';
import SecurityIcon from "@mui/icons-material/Security"; // ⭐ ADDED Icon

/*
  Patrols Register page (Add/Edit)
  - Top fields: Name | Patrol time | Active switch
  - Tabs: Users, Mosaics (we implement Users fully as Figma)
  - Dual-list (Users -> Picks) with stacked blue box controls
  - Cancel navigates back
*/

function DualList({
  leftItems,
  rightItems,
  setLeftItems,
  setRightItems,
}) {
  // Basic move handlers
  const moveOneRight = (idx) => {
    const item = leftItems[idx];
    setLeftItems((l) => l.filter((_, i) => i !== idx));
    setRightItems((r) => [...r, item]);
  };

  const moveOneLeft = (idx) => {
    const item = rightItems[idx];
    setRightItems((r) => r.filter((_, i) => i !== idx));
    setLeftItems((l) => [...l, item]);
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={5}>
        <TextField placeholder="Search" size="small" fullWidth />
        <Box sx={{ mt: 1 }}>
          <Paper elevation={0} sx={{ borderRadius: 2 }}>
            <List dense>
              {leftItems.map((it, i) => (
                <React.Fragment key={it.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" size="small" onClick={() => moveOneRight(i)}>
                        <ArrowForwardIcon sx={{ color: "#0a84ff" }} />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={it.title} secondary={it.subtitle} />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
              {leftItems.length === 0 && (
                <ListItem>
                  <ListItemText primary="No users" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Box>
      </Grid>

      <Grid item xs={12} md={2} sx={{ textAlign: "center" }}>
        {/* stacked blue boxes (Figma look) */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
          <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "#0a84ff" }} />
          <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "#0a84ff" }} />
        </Box>
      </Grid>

      <Grid item xs={12} md={5}>
        <TextField placeholder="Search" size="small" fullWidth />
        <Box sx={{ mt: 1 }}>
          <Paper elevation={0} sx={{ borderRadius: 2 }}>
            <List dense>
              {rightItems.map((it, i) => (
                <React.Fragment key={it.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" size="small" onClick={() => moveOneLeft(i)}>
                        <ArrowBackIcon sx={{ color: "#0a84ff" }} />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={it.title} secondary={it.subtitle} />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
              {rightItems.length === 0 && (
                <ListItem>
                  <ListItemText primary="No picks yet" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
}

export default function PatrolsRegister() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  // form state
  const [name, setName] = useState("");
  const [patrolTime, setPatrolTime] = useState(30);
  const [active, setActive] = useState(true);

  // sample users list
  const [leftUsers, setLeftUsers] = useState([
    { id: "u1", title: "Administrador", subtitle: "alexgomez@flynet.sv" },
    { id: "u2", title: "Victor Hernandez", subtitle: "victorh@flynet.sv" },
    { id: "u3", title: "Edwin Palacios", subtitle: "edwinlino@flynet.sv" },
    { id: "u4", title: "Zayra Gomez", subtitle: "zayragomez@flynet.sv" },
  ]);
  const [rightUsers, setRightUsers] = useState([]);

  function handleSave() {
    // TODO: wire to API
    console.info("Save patrol:", { name, patrolTime, active, picks: rightUsers });
    navigate(-1); // go back after save (or navigate("/patrols"))
  }

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
            Patrols <Typography component="span" sx={{ color: "text.secondary", ml: 1 }}>Register</Typography>
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
            
            {/* LINK: Patrols */}
            <RouterLink to="/app/patrols" style={crumbLinkStyle}>
              <Box sx={crumbTextStyle}>
                <MovieCreationRoundedIcon fontSize="small" sx={{ mr: 0.5 }} />
                Patrols
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
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              placeholder="Enter a name."
              fullWidth
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>

          <Grid item xs={8} md={3}>
            <TextField
              placeholder="Patrol time"
              type="number"
              size="small"
              fullWidth
              value={patrolTime}
              onChange={(e) => setPatrolTime(Number(e.target.value))}
            />
          </Grid>

          <Grid item xs={4} md={3} sx={{ textAlign: { xs: "left", md: "right" } }}>
            <FormControlLabel
              control={<Switch checked={active} onChange={(e) => setActive(e.target.checked)} />}
              label="Active"
            />
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ mt: 3 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="standard" sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tab label="Users" />
            <Tab label="Mosaics" />
          </Tabs>
        </Box>

        {/* content area */}
        <Box sx={{ minHeight: 200, mt: 3 }}>
          {tab === 0 && (
            <DualList
              leftItems={leftUsers}
              rightItems={rightUsers}
              setLeftItems={setLeftUsers}
              setRightItems={setRightUsers}
            />
          )}

          {tab === 1 && (
            <Box>
              {/* Placeholder for mosaics selection UI (keeps consistent with Figma) */}
              <TextField placeholder="Search mosaics..." size="small" fullWidth />
              <Box sx={{ mt: 2, height: 160, borderRadius: 2, border: "1px dashed #e6e9ee", p: 2 }}>
                <Typography color="text.secondary">Mosaics UI (to be implemented) — shows list / picks similar to Users tab</Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={6}>
            <Button variant="contained" color="error" sx={{ textTransform: "none" }} onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            <Button variant="contained" onClick={handleSave} sx={{ textTransform: "none", bgcolor: "#2b3e66" }}>
              Save
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}