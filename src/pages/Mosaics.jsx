// src/pages/Mosaics.jsx
import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment, // Necessary for TextField icon
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
// ⭐ Ensure both useNavigate and Link are imported correctly:
import { useNavigate, Link } from "react-router-dom"; 

const mockData = [
  { type: "Cameras", name: "Alpha Group", capacity: 2, cameras: 2, users: 2, active: true },
  { type: "Cameras", name: "Clínicas Integradas", capacity: 4, cameras: 3, users: 3, active: true },
  { type: "Cameras", name: "FLYNET SAN MIGUEL BODEGAS", capacity: 6, cameras: 6, users: 4, active: true },
];

export default function Mosaics() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  return (
    <Box p={4}>

      {/* Title + Breadcrumb */}
      <Grid container alignItems="center" justifyContent="space-between" mb={2}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Mosaics
          </Typography>
        </Grid>
        <Grid item>
          {/* UPDATED BREADCRUMB WITH LINK */}
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            
            {/* LINK: Home */}
            <Link 
              to="/app" 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit',
                display: 'flex', 
                alignItems: 'center',
                fontSize: 14 // Match surrounding typography size
              }}
            >
              <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
              Home
            </Link>
            
            {/* Separator and Current Page */}
            <Typography component="span" variant="body2" sx={{ mx: 0.5, color: 'text.secondary', fontSize: 14 }}>
                &gt;
            </Typography>
            
            <Typography component="span" variant="body2" sx={{ color: 'text.primary', fontWeight: 600, display: 'flex', alignItems: 'center', fontSize: 14 }}>
                <DashboardRoundedIcon fontSize="small" sx={{ mr: 0.5 }} />
                Mosaics
            </Typography>
          </Typography>
        </Grid>
      </Grid>
      
      {/* Add + Search */}
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        mb={3}
        sx={{ width: "100%" }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            textTransform: "none",
            background: "#F2F4F7",
            color: "#000",
            borderRadius: "8px",
            boxShadow: "none",
            "&:hover": { background: "#E5E7EB" }
          }}
          onClick={() => navigate("/app/mosaics/register")}
        >
          Add
        </Button>

        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 300,
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: "#98A2B3" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                background: "#fff",
              },
            }}
          />
        </Box>
      </Box>

      {/* TABLE */}
      <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Capacity</strong></TableCell>
              <TableCell><strong>Cameras</strong></TableCell>
              <TableCell><strong>Users</strong></TableCell>
              <TableCell><strong>Active</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {mockData.map((row, index) => (
              <TableRow key={index} hover sx={{ "&:hover": { background: "#F9FAFB" } }}>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.capacity}</TableCell>
                <TableCell>{row.cameras}</TableCell>
                <TableCell>{row.users}</TableCell>
                <TableCell>
                  {row.active ? "✔️" : "❌"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

    </Box>
  );
}