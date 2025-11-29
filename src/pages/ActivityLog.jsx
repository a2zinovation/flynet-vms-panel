// src/pages/ActivityLog.jsx
import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  TextField,
  Button,
  Breadcrumbs,
  Link as MuiLink, 
  Divider,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// ⭐ Import Link from React Router
import { Link as RouterLink } from "react-router-dom"; 

// Dummy logs
const logs = [
  {
    date: "October 23, 2025",
    items: [
      {
        time: "1:03 PM",
        user: "Maria Marquez",
        text: "abrió la cámara 728479 - Casa de Maria Bianca Marquez Cabrera Cam1.3 en la aplicación móvil.",
        ago: "6 minutes ago",
      },
    ],
  },
  {
    date: "October 22, 2025",
    items: [
      {
        time: "12:57 PM",
        user: "Maria Marquez",
        text: "abrió la cámara 728479 - Casa de Maria Bianca Marquez Cabrera Cam1.3 en la aplicación móvil.",
        ago: "12 minutes ago",
      },
      {
        time: "12:56 PM",
        user: "DEMO FULL",
        text: "descargué el video 297360 - 4th .",
        ago: "12 minutes ago",
      },
      {
        time: "12:56 PM",
        user: "Maynor Alberto Tejada",
        text: "abrió la cámara 732574 - Casa de Maynor Tejada Cam 1.1 en la aplicación móvil.",
        ago: "13 minutes ago",
      },
    ],
  },
];

export default function ActivityLog() {
  const [openFilters, setOpenFilters] = useState(false);

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER + BREADCRUMB */}
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Activity log
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />}>
            
            {/* ⭐ UPDATED HOME LINK TO /app */}
            <MuiLink
              component={RouterLink} 
              to="/app" // Base route for the application
              underline="hover"
              color="inherit"
              sx={{ display: "flex", alignItems: "center", gap: 0.5, textDecoration: 'none' }}
            >
              <HomeIcon fontSize="small" />
              Home
            </MuiLink>
            
            {/* Current Page: Activity log */}
            <Typography color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AccessTimeIcon fontSize="small" />
                Activity log
            </Typography>
          </Breadcrumbs>

          <Button
            onClick={() => setOpenFilters(true)}
            startIcon={<FilterAltIcon />}
            sx={{
              textTransform: "none",
              color: "#000",
              fontWeight: 600,
            }}
          >
            Filters
          </Button>
        </Box>
      </Grid>

      {/* LOG LIST */}
      {logs.map((day, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Box
            sx={{
              bgcolor: "#007bff",
              color: "white",
              px: 2,
              py: 0.6,
              width: "fit-content",
              borderRadius: "16px",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {day.date}
          </Box>

          {day.items.map((item, i) => (
            <Card
              key={i}
              elevation={0}
              sx={{
                mt: 1,
                p: 1.5,
                borderRadius: 2,
                boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CameraAltIcon sx={{ color: "#555" }} />

                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      {item.time} • <span style={{ color: "#007bff" }}>{item.user}</span>{" "}
                      {item.text}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTimeIcon sx={{ fontSize: 18, color: "#666" }} />
                  <Typography sx={{ fontSize: 13, color: "#666" }}>{item.ago}</Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ))}

      {/* FULLSCREEN FILTER MODAL (FIXED) */}
      {openFilters && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(3px)",
            zIndex: 2000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 620,
              bgcolor: "white",
              borderRadius: 2,
              p: 3,
              boxShadow: "0px 8px 32px rgba(0,0,0,0.25)",
              position: "relative",
            }}
          >
            {/* MODAL HEADER */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: 18,
                  color: "#007bff",
                  flexGrow: 1,
                }}
              >
                Filters
              </Typography>

              <IconButton onClick={() => setOpenFilters(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* FIELDS */}
            <Grid container spacing={2}>
              {["Groups", "Users", "Action", "Cameras"].map((label) => (
                <Grid item xs={12} key={label}>
                  <TextField
                    fullWidth
                    label={label}
                    placeholder="Search"
                    size="small"
                    variant="outlined"
                  />
                </Grid>
              ))}

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Start"
                  size="small"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="End"
                  size="small"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* SAVE BUTTON */}
            <Box sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                onClick={() => setOpenFilters(false)}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  bgcolor: "#007bff",
                  px: 4,
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}