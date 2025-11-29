// src/pages/ConsumptionCalculator.jsx

import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CalculateIcon from "@mui/icons-material/Calculate"; // ⭐ ADDED Icon
import { Link as RouterLink } from "react-router-dom"; // ⭐ ADDED Link

const RESOLUTIONS = [
  { label: "VGA 375Kbps", value: 375 },
  { label: "HD 720p 512Kbps", value: 512 },
  { label: "HD 720p 1Mbps", value: 1000 },
  { label: "1080p 2Mbps", value: 2000 },
  { label: "4K 8Mbps", value: 8000 },
];

export default function ConsumptionCalculator() {
  const [desc, setDesc] = useState("");
  const [resolution, setResolution] = useState(375);
  const [cameras, setCameras] = useState("");
  const [days, setDays] = useState("");
  // Note: Storage field is disabled, so its initial state of "0 MB" is fine.
  const [storage, setStorage] = useState("0 MB"); 

  const [rows, setRows] = useState([]);

  // ----------- Add Row -----------
  const handleAdd = () => {
    if (!desc || !cameras || !days) return;

    // Convert kbps to Mbps (for upload)
    const uploadMbps = (resolution * Number(cameras)) / 1000; 
    
    // Calculate storage needed in Megabytes (MB)
    // Formula: (Kbps * seconds * days) / 8 (bits->bytes) / 1024 / 1024 (bytes->MB)
    const storageNeededMB =
        ((resolution * Number(cameras) * 60 * 60 * 24 * Number(days)) / 8 / 1024 / 1024).toFixed(2); 

    const row = {
      id: Date.now(),
      desc,
      resolution,
      cameras: Number(cameras),
      days: Number(days),
      uploadMbps: uploadMbps, 
      storageNeeded: storageNeededMB, 
    };

    setRows([...rows, row]);
  };

  // ----------- Delete Row -----------
  const handleDelete = (id) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  // ----------- Export CSV -----------
  const exportCSV = () => {
    const header = [
      "Description,Resolution (Kbps),Cameras,Days,Upload (Mbps),Storage (MB)",
    ];

    const body = rows.map(
      (r) =>
        `${r.desc},${r.resolution},${r.cameras},${r.days},${r.uploadMbps.toFixed(2)},${r.storageNeeded}`
    );

    const csvContent = [...header, ...body].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "consumption-calculator.csv";
    document.body.appendChild(a); // Append link to document
    a.click();
    document.body.removeChild(a); // Clean up the DOM
    URL.revokeObjectURL(url); // Clean up the URL object
  };

  // ----------- Totals -----------
  const totalUpload = rows.reduce((a, b) => a + Number(b.uploadMbps), 0);
  const totalStorage = rows.reduce((a, b) => a + Number(b.storageNeeded), 0);

  return (
    <Box p={3}>
      {/* ----------------- Page Header + Breadcrumb ----------------- */}
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" fontWeight={700}>
          Consumption calculator
        </Typography>

        <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />}>
          
          {/* ⭐ LINK: Home */}
          <MuiLink
            component={RouterLink}
            to="/app"
            underline="hover"
            color="inherit"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <HomeIcon fontSize="small" /> Home
          </MuiLink>
          
          {/* Current Page: Consumption calculator */}
          <Typography color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5, fontWeight: 600, color: 'text.primary' }}>
            <CalculateIcon fontSize="small" />
            Consumption calculator
          </Typography>
        </Breadcrumbs>
      </Grid>

      {/* ----------------- Input Panel ----------------- */}
      <Card sx={{ borderRadius: 2, mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Insert a description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                select
                label="Resolution"
                value={resolution}
                onChange={(e) => setResolution(Number(e.target.value))}
              >
                {RESOLUTIONS.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Number of cameras"
                type="number"
                value={cameras}
                onChange={(e) => setCameras(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Number of days"
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Storage"
                value={storage}
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={1} display="flex" justifyContent="end">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ bgcolor: "#e9e9e9", color: "#000", textTransform: "none" }}
                onClick={handleAdd}
                disabled={!desc || !cameras || !days}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ----------------- Export CSV ----------------- */}
      <Box display="flex" justifyContent="flex-end" mb={1}>
        <Button
          size="small"
          onClick={exportCSV}
          startIcon={<FileDownloadIcon />}
          sx={{
            textTransform: "none",
            border: "1px solid #cbd5e1",
            color: "#06c",
          }}
          disabled={rows.length === 0}
        >
          Export CSV
        </Button>
      </Box>

      {/* ----------------- Table ----------------- */}
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Resolution (Kbps)</TableCell>
                <TableCell>Number of cameras</TableCell>
                <TableCell>Number of days</TableCell>
                <TableCell>Upload (Client)</TableCell>
                <TableCell>Storage needed</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No items added
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.desc}</TableCell>
                    <TableCell>{row.resolution}</TableCell>
                    <TableCell>{row.cameras}</TableCell>
                    <TableCell>{row.days}</TableCell>
                    <TableCell>{row.uploadMbps.toFixed(2)} Mbps</TableCell>
                    <TableCell>{row.storageNeeded} MB</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDelete(row.id)}>
                        <DeleteIcon sx={{ color: "#f44336" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ----------------- Totals ----------------- */}
      <Box mt={2} display="flex" justifyContent="flex-end" gap={4} pr={1}>
        <Typography color="text.secondary">
          Download: <b>{totalUpload.toFixed(2)} Mbps</b>
        </Typography>
        <Typography color="text.secondary">
          Total storage: <b>{totalStorage.toFixed(2)} MB</b>
        </Typography>
      </Box>
    </Box>
  );
}