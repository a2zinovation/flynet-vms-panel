// src/pages/Reports.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// --------------------------
// API VERSION CONSTANT
// --------------------------
const API_VERSION = "v1";
const API_URL = `/api/${API_VERSION}/reports`;

export default function Reports() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------------------
  // FETCH REPORTS
  // --------------------------
  const fetchReports = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      setRows(data?.reports || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* ---------------- HEADER ---------------- */}
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Reports
        </Typography>

        <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />}>
          <MuiLink
            underline="hover"
            color="inherit"
            href="/app"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <HomeIcon fontSize="small" /> Home
          </MuiLink>

          <Typography color="text.secondary">Reports</Typography>
        </Breadcrumbs>
      </Grid>

      {/* ---------------- TABLE CARD ---------------- */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          mt: 1,
          background: "#ffffff",
          boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
        }}
      >
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#F5F6FA" }}>
                <TableCell sx={headStyle}>ID</TableCell>
                <TableCell sx={headStyle}>Name</TableCell>
                <TableCell sx={headStyle}>Type</TableCell>
                <TableCell sx={headStyle}>Date</TableCell>
                <TableCell sx={headStyle}>Status</TableCell>
                <TableCell sx={headStyle}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    No results found!
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((item, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.status}</TableCell>

                    <TableCell>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>

                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Label */}
        <Box sx={{ px: 2, py: 1, fontSize: 13, color: "#777" }}>
          Displaying {rows.length} of {rows.length} results
        </Box>
      </Card>
    </Box>
  );
}

// --------------------------
// TABLE HEADER STYLE
// --------------------------
const headStyle = {
  fontWeight: 700,
  color: "#3A3A3A",
  fontSize: 14,
};

