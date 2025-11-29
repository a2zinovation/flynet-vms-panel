// src/pages/Users.jsx
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
  Tooltip,
  Pagination,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home"; // ⭐ ADDED Icon
import { useNavigate, Link } from "react-router-dom"; // ⭐ ADDED Link

const createSample = (n = 14) =>
  Array.from({ length: n }).map((_, i) => ({
    id: i + 1,
    name: `Administrador ${i + 1}`,
    email: `alexgomez${i + 1}@flynet.sv`,
    recovery: "-",
    lastUpdate: "20/10/2025 11:35",
    active: i % 3 !== 0,
  }));

export default function Users() {
  const navigate = useNavigate();
  const [rows] = useState(createSample(24));
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
        (r.email && r.email.toLowerCase().includes(q))
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
      {/* header row: title + breadcrumb (right) */}
      <Grid container alignItems="center" justifyContent="space-between" mb={2}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Users
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
                <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
                Users
            </Typography>
          </Typography>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center" mb={1}>
          <Grid item xs={12} md={3}>
            <Button
              onClick={() => navigate("/app/users/register")}
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

        <Box sx={{ height: 12 }} />

        <TableContainer sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, cursor: "pointer" }} onClick={() => handleSort("name")}>
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Recovery code</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Last update</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Active</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {pageRows.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PersonIcon sx={{ color: "#1F3A5E" }} />
                      <Typography>{r.name}</Typography>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography>{r.email}</Typography>
                      {/* verified mark */}
                      <Box
                        sx={{
                          ml: 1,
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          background: "#E9F9F1",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#16A34A",
                          fontSize: 12,
                        }}
                      >
                        ✓
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>{r.recovery}</TableCell>
                  <TableCell>{r.lastUpdate}</TableCell>
                  <TableCell>
                    {r.active ? <CheckCircleIcon sx={{ color: "#28A745" }} /> : <Typography color="text.secondary">✕</Typography>}
                  </TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Edit">
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Settings">
                        <IconButton size="small">
                          <SettingsIcon />
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

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Displaying {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} to{" "}
            {Math.min(page * perPage, filtered.length)} of {filtered.length} results
          </Typography>
          <Pagination count={pageCount} page={page} onChange={(_, p) => setPage(p)} color="primary" shape="rounded" />
        </Box>
      </Paper>
    </Box>
  );
}