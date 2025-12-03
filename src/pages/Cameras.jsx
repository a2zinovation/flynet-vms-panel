// src/pages/Cameras.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { cameraService } from "../services/cameras";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Pagination,
  Stack,
  CircularProgress,
  Alert,
  Snackbar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import SaveIcon from '@mui/icons-material/Save';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import WifiRoundedIcon from '@mui/icons-material/WifiRounded';
import WifiOffRoundedIcon from '@mui/icons-material/WifiOffRounded';
import PermScanWifiOutlinedIcon from '@mui/icons-material/PermScanWifiOutlined';
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import HomeIcon from "@mui/icons-material/Home"; // ⭐ ADDED Icon

// Sample data removed - will fetch from API

function StatCard({ label, value, bg = "#E8F6FF", icon }) {
  return (
    <Card elevation={0} sx={{ borderRadius: 2 }}>
      <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 1.5,
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "none",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Cameras() {
  const navigate = useNavigate();
  
  // API state
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
    unstable: 0,
  });
  
  // Table state
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [orderBy, setOrderBy] = useState("name");
  const [orderDir, setOrderDir] = useState("asc");
  
  // Snackbar for delete/action feedback
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  // Action menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  
  // Inline comment editing
  const [editingComment, setEditingComment] = useState(null);
  const [commentValue, setCommentValue] = useState("");
  
  // Migrate server dialog
  const [migrateDialogOpen, setMigrateDialogOpen] = useState(false);
  const [migrateServer, setMigrateServer] = useState("FlynetES-01");

  // Fetch cameras and stats on mount
  useEffect(() => {
    fetchCameras();
    fetchStats();
  }, []);

  const fetchCameras = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await cameraService.getAll();
      
      // Handle different response structures
      if (response.data) {
        setCameras(Array.isArray(response.data) ? response.data : []);
      } else if (Array.isArray(response)) {
        setCameras(response);
      } else {
        setCameras([]);
      }
    } catch (err) {
      console.error("Error fetching cameras:", err);
      setError(err.message || "Failed to load cameras");
      setCameras([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await cameraService.getStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
      // Don't show error for stats, use defaults
    }
  };

  const handleMenuOpen = (event, camera) => {
    setAnchorEl(event.currentTarget);
    setSelectedCamera(camera);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCamera(null);
  };

  const handleViewStream = (camera) => {
    // Navigate to camera stream view
    navigate(`/app/cameras/view/${camera.id}`);
    handleMenuClose();
  };

  const handleMigrateServer = () => {
    setMigrateDialogOpen(true);
    handleMenuClose();
  };

  const handleMigrateConfirm = async () => {
    try {
      // Call API to migrate server
      await cameraService.update(selectedCamera.id, { server: migrateServer });
      setSnackbar({ open: true, message: "Camera migrated successfully", severity: "success" });
      fetchCameras();
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Migration failed", severity: "error" });
    } finally {
      setMigrateDialogOpen(false);
      setSelectedCamera(null);
    }
  };

  const handleCommentEdit = (camera) => {
    setEditingComment(camera.id);
    setCommentValue(camera.comments || "");
  };

  const handleCommentSave = async (cameraId) => {
    try {
      await cameraService.update(cameraId, { comments: commentValue });
      setSnackbar({ open: true, message: "Comment updated", severity: "success" });
      fetchCameras();
      setEditingComment(null);
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to update comment", severity: "error" });
    }
  };

  const handleCommentCancel = () => {
    setEditingComment(null);
    setCommentValue("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this camera?")) {
      return;
    }

    try {
      await cameraService.delete(id);
      setSnackbar({ open: true, message: "Camera deleted successfully", severity: "success" });
      fetchCameras(); // Reload list
      fetchStats(); // Update stats
    } catch (err) {
      console.error("Error deleting camera:", err);
      setSnackbar({ open: true, message: err.message || "Failed to delete camera", severity: "error" });
    }
  };

  const handleEdit = (camera) => {
    navigate(`/app/cameras/register?id=${camera.id}`);
  };

  // derived filtered+sorted rows
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let data = cameras.filter(
      (r) =>
        !q ||
        (r.name && r.name.toLowerCase().includes(q)) ||
        r.type.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );

    data = data.sort((a, b) => {
      let av = a[orderBy];
      let bv = b[orderBy];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return orderDir === "asc" ? -1 : 1;
      if (av > bv) return orderDir === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [cameras, query, orderBy, orderDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

  function handleSort(field) {
    if (orderBy === field) setOrderDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setOrderBy(field);
      setOrderDir("asc");
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Error display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* header row: title + breadcrumb */}
      <Grid container alignItems="center" justifyContent="space-between" mb={2}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Cameras
          </Typography>
        </Grid>
        <Grid item>
          {/* ⭐ UPDATED BREADCRUMB TO INCLUDE LINK */}
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            {/* LINK: Home */}
            <Link 
              to="/app" 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit', // Inherit from parent Typography
                display: 'flex', 
                alignItems: 'center' 
              }}
            >
              <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
              Home
            </Link>
            
            {/* Separator and Current Page */}
            <Typography component="span" variant="body2" sx={{ mx: 0.5, color: 'text.secondary' }}>
                &gt;
            </Typography>
            
            <Typography component="span" variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                Cameras
            </Typography>
          </Typography>
        </Grid>
      </Grid>

      {/* stats cards */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={25}>
          <Grid container spacing={0.5}>
            <Grid item  minWidth={200} boxShadow={1}  xs={6} sm={3} md={2} sx={{ borderRadius: '16px' }}>
              <StatCard
                label="Total"
                value={loading ? "..." : stats.total || cameras.length}
                bg="#33ABFD"
                icon={<CheckRoundedIcon sx={{ color: "#ffffffff" }} />}
              />
            </Grid>
            <Grid item minWidth={200} boxShadow={1}  xs={6} sm={3} md={2} sx={{ borderRadius: '16px' }}>
              <StatCard
                label="Disabled"
                value={loading ? "..." : stats.disabled || 0}
                bg="#65696B"
                size="medium"
                icon={<VideocamOffOutlinedIcon sx={{ color: "#ffffffff" }} />}
              />
            </Grid>
            <Grid item minWidth={200} boxShadow={1}  xs={6} sm={3} md={2} sx={{ borderRadius: '16px' }}>
              <StatCard
                label="Online"
                value={loading ? "..." : stats.online || 0}
                bg="#7AE79A"
                icon={<WifiRoundedIcon sx={{ color: "#ffffff" }} />}
              />
            </Grid>
            <Grid item minWidth={200} boxShadow={1}  xs={6} sm={3} md={2} sx={{ borderRadius: '16px' }}>
              <StatCard
                label="Offline"
                value={loading ? "..." : stats.offline || 0}
                bg="#65696B"
                icon={<WifiOffRoundedIcon sx={{ color: "#ffffff" }} />}
              />
            </Grid>
            <Grid item minWidth={200} boxShadow={1}  xs={6} sm={3} md={2} sx={{ borderRadius: '16px' }}>
              <StatCard
                label="Unstable"
                value={loading ? "..." : stats.unstable || 0}
                bg="#33ABFD"
                icon={<PermScanWifiOutlinedIcon sx={{ color: "#ffffff" }} />}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* toolbar: add, search, column/order pills */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mt: 1,
          borderRadius: 2,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <Button
              className="add-btn" onClick={() => navigate("/app/cameras/register")}
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                bgcolor: "#f6f7f9",
                borderColor: "#e6e9ee",
              }}
            >
              Add
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search"
              fullWidth
              size="small"
              InputProps={{
                endAdornment: (
                  <IconButton size="small" sx={{ mr: 0.5 }}>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={3}
            sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" }, gap: 1 }}
          >
            <Button
              variant="outlined"
              startIcon={<ViewColumnIcon />}
              sx={{ textTransform: "none", borderRadius: 3 }}
            >
              Column
            </Button>

            <Button
              variant="outlined"
              startIcon={<SwapVertIcon />}
              sx={{ textTransform: "none", borderRadius: 3 }}
              onClick={() => setOrderDir((d) => (d === "asc" ? "desc" : "asc"))}
            >
              Order
            </Button>
          </Grid>
        </Grid>

        {/* tiny spacer */}
        <Box sx={{ height: 12 }} />

        {/* table */}
        <TableContainer sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: 700, cursor: "pointer" }}
                  onClick={() => handleSort("name")}
                >
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }} onClick={() => handleSort("type")}>
                  Type
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Analytical</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Host</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Storage</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Resolution</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Comments</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">
                      {query ? "No cameras match your search" : "No cameras found. Click 'Add' to create one."}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <FiberManualRecordIcon
                          sx={{ fontSize: 12, color: r.status === "online" ? "#28A745" : "#FF8A65" }}
                        />
                        <Typography>{r.name || "Unnamed"}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{r.type || "-"}</TableCell>
                    <TableCell>{r.analytical || "-"}</TableCell>
                    <TableCell>{r.host || "-"}</TableCell>
                    <TableCell>
                      {r.storage && (
                        <Box
                          sx={{
                            display: "inline-block",
                            px: 1.2,
                            py: 0.2,
                            borderRadius: 4,
                            background: "#f4f6f9",
                            fontSize: 12,
                          }}
                        >
                          {r.storage}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {r.resolution && (
                        <Box
                          sx={{
                            display: "inline-block",
                            px: 1.2,
                            py: 0.2,
                            borderRadius: 4,
                            background: "#2f2f2f",
                            color: "#fff",
                            fontSize: 12,
                          }}
                        >
                          {r.resolution}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {r.status === "online" ? (
                        <CheckCircleIcon sx={{ color: "#28A745" }} />
                      ) : (
                        <Typography color="text.secondary">{r.status || "unknown"}</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingComment === r.id ? (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <TextField
                            size="small"
                            value={commentValue}
                            onChange={(e) => setCommentValue(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') handleCommentSave(r.id);
                              if (e.key === 'Escape') handleCommentCancel();
                            }}
                            autoFocus
                            sx={{ minWidth: 200 }}
                          />
                          <IconButton size="small" color="primary" onClick={() => handleCommentSave(r.id)}>
                            <SaveIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Box
                          onClick={() => handleCommentEdit(r)}
                          sx={{ cursor: 'pointer', minHeight: 24, '&:hover': { bgcolor: '#f5f5f5' }, px: 1, borderRadius: 1 }}
                        >
                          <Typography variant="body2">{r.comments || "Click to add comment"}</Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, r)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* pagination */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
            shape="rounded"
          />
        </Box>
      </Paper>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleViewStream(selectedCamera); }}>
          <PlayArrowIcon sx={{ mr: 1, fontSize: 20 }} />
          View Stream
        </MenuItem>
        <MenuItem onClick={() => { handleEdit(selectedCamera); handleMenuClose(); }}>
          <EditIcon sx={{ mr: 1, fontSize: 20 }} />
          Edit Camera
        </MenuItem>
        <MenuItem onClick={handleMigrateServer}>
          <MoveUpIcon sx={{ mr: 1, fontSize: 20 }} />
          Migrate Server
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); }}>
          <SettingsIcon sx={{ mr: 1, fontSize: 20 }} />
          Settings
        </MenuItem>
        <MenuItem 
          onClick={() => { 
            handleDelete(selectedCamera?.id); 
            handleMenuClose(); 
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          Delete Camera
        </MenuItem>
      </Menu>

      {/* Migrate Server Dialog */}
      <Dialog open={migrateDialogOpen} onClose={() => setMigrateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Migrate Camera to Another Server</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select the target server for camera: <strong>{selectedCamera?.name}</strong>
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Target Server</InputLabel>
            <Select
              value={migrateServer}
              onChange={(e) => setMigrateServer(e.target.value)}
              label="Target Server"
            >
              <MenuItem value="FlynetES-01">FlynetES-01</MenuItem>
              <MenuItem value="FlynetES-02">FlynetES-02</MenuItem>
              <MenuItem value="FlynetES-03">FlynetES-03</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMigrateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleMigrateConfirm} variant="contained">
            Migrate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}