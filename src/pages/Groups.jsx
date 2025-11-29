// src/pages/Groups.jsx
import React, { useMemo, useState } from "react";
import {
  Box, Grid, Typography, Paper, Button, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Pagination, Stack, Tooltip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HomeIcon from "@mui/icons-material/Home"; // ⭐ ADDED Icon
import GroupIcon from "@mui/icons-material/Group"; // ⭐ ADDED Icon for Groups
import { useNavigate, Link } from "react-router-dom"; // ⭐ ADDED Link

const sample = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: `Leonel Antonio Lizama Nolasco ${i + 1}`,
  cameras: "PPA",
  users: Math.floor(Math.random() * 8) + 1,
  isDefault: Math.random() > 0.6,
  active: Math.random() > 0.2,
}));

export default function Groups() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sample.filter(
      (r) => !q || r.name.toLowerCase().includes(q) || String(r.cameras).toLowerCase().includes(q)
    );
  }, [query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <Box sx={{ p: 3 }}>
      {/* header row: title + breadcrumb */}
      <Grid container alignItems="center" justifyContent="space-between" mb={2}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Groups</Typography>
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
                <GroupIcon fontSize="small" sx={{ mr: 0.5 }} />
                Groups
            </Typography>
          </Typography>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ textTransform: "none", borderRadius: 2, bgcolor: "#f6f7f9", borderColor: "#e6e9ee" }}
              onClick={() => navigate("/app/groups/register")}
            >
              Add
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              placeholder="Search"
              size="small"
              fullWidth
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
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
            <Button variant="contained" sx={{ textTransform: "none", bgcolor: "#f4f6f9" }}>
              Generate report
            </Button>
          </Grid>

          {/* table */}
          <Grid item xs={12}>
            <TableContainer sx={{ mt: 1, borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Cameras</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Users</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Default</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Active</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Comments</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {pageRows.map((r) => (
                    <TableRow key={r.id} hover>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.cameras}</TableCell>
                      <TableCell>{r.users}</TableCell>
                      <TableCell>{r.isDefault ? "✓" : "✕"}</TableCell>
                      <TableCell>{r.active ? "✓" : "✕"}</TableCell>
                      <TableCell />
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => navigate(`/groups/register?edit=${r.id}`)}>
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
                  ))}

                  {pageRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">No results found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Pagination count={pageCount} page={page} onChange={(_, p) => setPage(p)} shape="rounded" />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}