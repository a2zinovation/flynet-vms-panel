// src/pages/Access.jsx
import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyIcon from "@mui/icons-material/Key"; 

import { Link as RouterLink } from "react-router-dom"; 

const topKPIs = [
  { id: "total", title: "Total", value: 275 },
  { id: "customers", title: "Customers", value: 3 },
  { id: "remaining", title: "Remaining", value: 69 },
  { id: "used", title: "Used", value: 203 },
];

const smallCards = [
  { id: "cameras", title: "Cameras", value: "203 / 272", subtitle: "In use / Total" },
  { id: "prealarm", title: "Pre Alarm", value: "0 / 0", subtitle: "In use / Total" },
  { id: "analytical", title: "Analytical", value: "0 / 0", subtitle: "In use / Total" },
  { id: "lpr", title: "LPR", value: "0 / 0", subtitle: "In use / Total" },
  { id: "lpr_on_board", title: "LPR on board", value: "0 / 0", subtitle: "In use / Total" },
  { id: "live", title: "Live", value: "0 / 0", subtitle: "In use / Total" },
];

/* -------------------------- BIG BLUE KPI CARD -------------------------- */
/* EXACT Figma: bright blue, 20px rounded corners, heavy bold numbers,
   perfect center alignment, soft white drop shadow. */

function BigKpiCard({ title, value }) {
  return (
    <Card
      elevation={0}
      sx={{
        background: "#0094FF",
        borderRadius: "20px",
        height: 140,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0px 8px 18px rgba(0,0,0,0.12)",
      }}
    >
      <CardContent
        sx={{
          textAlign: "center",
          p: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 700,
            color: "#fff",
            mb: 1,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: 40,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

/* ------------------------- SMALL METRIC CARD --------------------------- */
/* EXACT Figma: 
   - top grey header bar (#D7DCE4)
   - bottom white content area
   - rounded corners 18px
   - very soft drop shadow
   - perfect spacing above and below */

function SmallMetricCard({ title, value, subtitle }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: "0px 6px 14px rgba(0,0,0,0.08)",
      }}
    >
      {/* Top header strip */}
      <Box
        sx={{
          background: "#D7DCE4",
          py: 1.3,
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 600 }}>{title}</Typography>
      </Box>

      {/* Body */}
      <Box
        sx={{
          background: "#F8F9FB",
          py: 2.5,
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: 26, fontWeight: 700 }}>{value}</Typography>
        <Typography sx={{ fontSize: 13, color: "#888" }}>{subtitle}</Typography>
      </Box>
    </Card>
  );
}

/* ------------------------------ MAIN PAGE ------------------------------ */

export default function Access() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Title + Breadcrumb */}
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Access
        </Typography>

        <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />}>
          
          {/* ⭐ UPDATED LINK TO USE /app */}
          <MuiLink
            component={RouterLink}
            to="/app" // Changed from / to /app
            underline="hover"
            color="inherit"
            sx={{ display: "flex", alignItems: "center", gap: 0.5, textDecoration: 'none' }}
          >
            <HomeIcon fontSize="small" /> Home
          </MuiLink>

          {/* Current Page: Access */}
          <Typography color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5, fontWeight: 600, color: 'text.primary' }}>
            <KeyIcon fontSize="small" />
            Access
          </Typography>
        </Breadcrumbs>
      </Grid>

      {/* Cards Container */}
      <Box>
        {/* TOP BLUE KPI CARDS */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {topKPIs.map((item) => (
            <Grid key={item.id} item xs={12} sm={6} md={3}>
              <BigKpiCard title={item.title} value={item.value} />
            </Grid>
          ))}
        </Grid>

        {/* SMALL METRIC CARDS */}
        <Grid container spacing={3}>
          {smallCards.map((item) => (
            <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
            <SmallMetricCard
              title={item.title}
              value={item.value}
              subtitle={item.subtitle}
            />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}