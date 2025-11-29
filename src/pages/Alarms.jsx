// src/pages/Alarms.jsx
import React, { useState, useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Stack,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HomeIcon from "@mui/icons-material/Home"; // ⭐ ADDED Icon
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive"; // Icon for Alarms
import { useNavigate, Link } from "react-router-dom"; // ⭐ ADDED Link

const sampleRows = []; // empty to show "No results found!" per Figma
// You can later populate sampleRows with real data

export default function Alarms() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sampleRows;
    return sampleRows.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        (r.cameras || []).some((c) => c.toLowerCase().includes(q))
    );
  }, [query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <Box className="page-root" sx={{ p: { xs: 2, md: 3 } }}>
      {/* Title + breadcrumb right-aligned */}
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
          {/* ⭐ UPDATED BREADCRUMB TO INCLUDE LINK */}
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            
            {/* LINK: Home */}
            <Link 
              to="/app" 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit',
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
            
            <Typography component="span" variant="body2" sx={{ color: 'text.primary', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <NotificationsActiveIcon fontSize="small" sx={{ mr: 0.5 }} />
                Alarms
            </Typography>
          </Typography>
        </Grid>
      </Grid>

      {/* Toolbar & container card */}
      <Paper elevation={0} sx={{ borderRadius: 2, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => navigate("/app/alarms/register")}
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

          <Grid item xs={12} md={3} sx={{ textAlign: { xs: "left", md: "right" } }}>
            {/* If Figma has other small controls, add here */}
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <TableContainer sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Cameras</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Users</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {pageRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">No results found!</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  pageRows.map((r) => (
                    <TableRow key={r.id} hover>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{(r.cameras || []).join(", ")}</TableCell>
                      <TableCell>{(r.users || []).join(", ")}</TableCell>
                      <TableCell>{r.description}</TableCell>
                      <TableCell>{r.status}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View">
                            <IconButton size="small">
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small">
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Displaying {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} to{" "}
              {Math.min(filtered.length, page * perPage)} of {filtered.length} results
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Pagination count={pageCount} page={page} onChange={(_, p) => setPage(p)} shape="rounded" />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}