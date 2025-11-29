// src/pages/Cameras.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ⭐ ADDED Link
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
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import WifiRoundedIcon from '@mui/icons-material/WifiRounded';
import WifiOffRoundedIcon from '@mui/icons-material/WifiOffRounded';
import PermScanWifiOutlinedIcon from '@mui/icons-material/PermScanWifiOutlined';
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import HomeIcon from "@mui/icons-material/Home"; // ⭐ ADDED Icon

const sampleRows = Array.from({ length: 23 }).map((_, i) => ({
  id: i + 1,
  name: `Leonel Antonio Lizama Nolasco ${i + 1}`,
  type: "PPA",
  analytical: Math.random() > 0.5 ? "✓" : "✕",
  host: `${7 + (i % 3)} days`,
  storage: `${47 + (i % 5)} GB`,
  resolution: "1280 x 720",
  status: i % 7 === 0 ? "unstable" : i % 3 === 0 ? "offline" : "online",
  comments: "",
}));

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
  // table state
  const [rows] = useState(sampleRows);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [orderBy, setOrderBy] = useState("name");
  const [orderDir, setOrderDir] = useState("asc");
  const navigate = useNavigate();

  // derived filtered+sorted rows
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let data = rows.filter(
      (r) =>
        !q ||
        r.name.toLowerCase().includes(q) ||
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
                label="Enabled"
                value="203"
                bg="#33ABFD"
                icon={<CheckRoundedIcon sx={{ color: "#ffffffff" }} />}
              />
            </Grid>
            <Grid item minWidth={200} boxShadow={1}  xs={6} sm={3} md={2} sx={{ borderRadius: '16px' }}>
              <StatCard
                label="Disabled"
                value="0"
                bg="#65696B"
                size="medium"
                icon={<VideocamOffOutlinedIcon sx={{ color: "#ffffffff" }} />}
              />
            </Grid>
            <Grid item minWidth={200} boxShadow={1}  xs={6} sm={3} md={2} sx={{ borderRadius: '16px' }}>
              <StatCard
                label="Online"
                value="170"
                bg="#33ABFD"
                icon={<WifiRoundedIcon sx={{ color: "#ffffff" }} />}
              />
            </Grid>
            <Grid item minWidth={200} boxShadow={1}  xs={6} sm={3} md={2} sx={{ borderRadius: '16px' }}>
              <StatCard
                label="Offline"
                value="30"
                bg="#65696B"
                icon={<WifiOffRoundedIcon sx={{ color: "#ffffff" }} />}
              />
            </Grid>
            <Grid item minWidth={200} boxShadow={1}  xs={6} sm={3} md={2} sx={{ borderRadius: '16px' }}>
              <StatCard
                label="Unstable"
                value="1"
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
              {pageRows.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FiberManualRecordIcon
                        sx={{ fontSize: 12, color: r.status === "online" ? "#28A745" : "#FF8A65" }}
                      />
                      <Typography>{r.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>{r.analytical}</TableCell>
                  <TableCell>{r.host}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    {r.status === "online" ? (
                      <CheckCircleIcon sx={{ color: "#28A745" }} />
                    ) : (
                      <Typography color="text.secondary">{r.status}</Typography>
                    )}
                  </TableCell>
                  <TableCell>{r.comments}</TableCell>
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
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
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