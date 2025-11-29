// src/pages/Permissions.jsx
import React, { useMemo, useState } from "react";
import {
  Box, Grid, Typography, Paper, Button, TextField, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tooltip, Pagination, Stack, Switch, Chip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HomeIcon from "@mui/icons-material/Home"; // ⭐ ADDED Icon
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import VpnKeyIcon from "@mui/icons-material/VpnKey"; // ⭐ ADDED Icon for Permissions
import { useNavigate, Link } from "react-router-dom"; // ⭐ ADDED Link

const sample = Array.from({ length: 18 }).map((_, i) => ({
  id: i + 1,
  name: `Permission ${i + 1}`,
  capacity: 2 + (i % 5),
  cameras: 1 + (i % 4),
  users: 1 + (i % 6),
  active: i % 4 !== 0,
}));

export default function Permissions() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [rows] = useState(sample);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(r => !q || r.name.toLowerCase().includes(q));
  }, [rows, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <Box sx={{ p: 3 }}>
      {/* Title + breadcrumb */}
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Permissions
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
                <LockOpenRoundedIcon fontSize="small" sx={{ mr: 0.5 }} />
                Permissions
            </Typography>
          </Typography>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        {/* toolbar */}
        <Grid container spacing={2} alignItems="center" mb={1}>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ textTransform: "none", borderRadius: 2, bgcolor: "#f6f7f9" }}
              onClick={() => navigate("/app/permissions/register")}
            >
              Add
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              placeholder="Search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              size="small"
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton size="small">
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={3} sx={{ display: "flex", justifyContent: { md: "flex-end" } }}>
            <Button variant="outlined" sx={{ textTransform: "none", borderRadius: 3, mr: 1 }}>
              Column
            </Button>
            <Button variant="outlined" sx={{ textTransform: "none", borderRadius: 3 }}>
              Order
            </Button>
          </Grid>
        </Grid>

        {/* table */}
        <TableContainer sx={{ mt: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Capacity</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Cameras</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Users</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Active</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {pageRows.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>
                    <Chip label=" " size="small" sx={{ width: 28, height: 28 }} />
                  </TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.capacity}</TableCell>
                  <TableCell>{r.cameras}</TableCell>
                  <TableCell>{r.users}</TableCell>
                  <TableCell>
                    <Switch checked={r.active} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => navigate(`/permissions/register?edit=${r.id}`)}>
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {pageRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No results found!</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Pagination count={pageCount} page={page} onChange={(_, p) => setPage(p)} shape="rounded" />
        </Box>
      </Paper>
    </Box>
  );
}