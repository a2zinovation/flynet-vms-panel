// src/pages/Patrols.jsx
import React, { useMemo, useState } from "react";
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
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home"; // ⭐ ADDED Icon
import MovieCreationRoundedIcon from '@mui/icons-material/MovieCreationRounded';
import SecurityIcon from "@mui/icons-material/Security"; // ⭐ ADDED Icon for Patrols
import { useNavigate, Link } from "react-router-dom"; // ⭐ ADDED Link

/*
  Patrols list page
  - Search, sort (by name), pagination
  - Add button navigates to /patrols/register
  - Minimal styling to match Figma spacing and pills
*/

const sampleRows = [
  // small sample, you can replace with real data/fetch
  { id: 1, name: "flynet", users: 0, mosaics: 18, patrolTime: "30 Seconds", active: true },
  { id: 2, name: "Flynet", users: 3, mosaics: 14, patrolTime: "30 Seconds", active: true },
  { id: 3, name: "Hotel King Palace", users: 4, mosaics: 4, patrolTime: "30 Seconds", active: true },
  { id: 4, name: "Testing", users: 0, mosaics: 2, patrolTime: "30 Seconds", active: true },
  { id: 5, name: "Testing 2", users: 0, mosaics: 0, patrolTime: "30 Seconds", active: true },
  { id: 6, name: "todas las camaras", users: 1, mosaics: 6, patrolTime: "30 Seconds", active: true },
];

export default function Patrols() {
  const navigate = useNavigate();

  const [rows] = useState(sampleRows);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [orderBy, setOrderBy] = useState("name");
  const [orderDir, setOrderDir] = useState("asc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let data = rows.filter(
      (r) =>
        !q ||
        r.name.toLowerCase().includes(q) ||
        String(r.users).includes(q) ||
        String(r.mosaics).includes(q)
    );

    data = data.sort((a, b) => {
      const av = (a[orderBy] || "").toString().toLowerCase();
      const bv = (b[orderBy] || "").toString().toLowerCase();
      if (av < bv) return orderDir === "asc" ? -1 : 1;
      if (av > bv) return orderDir === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [rows, query, orderBy, orderDir]);

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
      {/* Title + breadcrumb area */}
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Patrols
          </Typography>
        </Grid>
        <Grid item sx={{ color: "text.secondary" }}>
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
                <MovieCreationRoundedIcon fontSize="small" sx={{ mr: 0.5 }} />
                Patrols
            </Typography>
          </Typography>
        </Grid>
      </Grid>

      {/* toolbar area (Add + Search + Column/Order pills) */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => navigate("/app/patrols/register")}
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
              placeholder="Search"
              size="small"
              fullWidth
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
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
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", md: "flex-end" },
              gap: 1,
            }}
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

        <Box sx={{ height: 12 }} />

        {/* table */}
        <TableContainer sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, cursor: "pointer" }} onClick={() => handleSort("name")}>
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: 700, width: 120 }} onClick={() => handleSort("users")}>
                  Users
                </TableCell>
                <TableCell sx={{ fontWeight: 700, width: 120 }} onClick={() => handleSort("mosaics")}>
                  Mosaics
                </TableCell>
                <TableCell sx={{ fontWeight: 700, width: 140 }}>Patrol time</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 100 }}>Active</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, width: 160 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {pageRows.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>
                    <Typography>{r.name}</Typography>
                  </TableCell>
                  <TableCell>{r.users}</TableCell>
                  <TableCell>{r.mosaics}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>{r.patrolTime}</Typography>
                  </TableCell>
                  <TableCell>
                    {r.active ? <CheckCircleIcon sx={{ color: "#28a745" }} /> : <Typography color="text.secondary">—</Typography>}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => navigate(`/patrols/register` /* ideally edit id */)}>
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
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No results found!</Typography>
                  </TableCell>
                </TableRow>
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
    </Box>
  );
}