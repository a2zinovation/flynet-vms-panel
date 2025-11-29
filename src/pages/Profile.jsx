// src/pages/Profile.jsx
import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  Breadcrumbs,
  Link as MuiLink,
  Card,
  CardContent,
  Divider,
  Stack,
  IconButton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

// MUI Icons
import HomeIcon from "@mui/icons-material/Home";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person"; // User icon in card
import MailOutlineIcon from "@mui/icons-material/MailOutline"; // Email icon in card
import DescriptionIcon from "@mui/icons-material/Description"; // Document icon in card
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import WarningAmberIcon from "@mui/icons-material/WarningAmber"; // Warning icon
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"; // Status dot

export default function Profile() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "DEMO FULL",
    email: "test@gmail.com",
    newPassword: "",
    confirmPassword: "",
  });
  const [isVerified, setIsVerified] = useState(false); // Assume user is unverified initially

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Add validation and API call logic here
    console.log("Saving Profile:", formData);
    alert("Profile saved (API call placeholder)");
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER + BREADCRUMB */}
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Profile
          </Typography>
        </Grid>
        <Grid item>
          <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />}>
            <MuiLink
              component={RouterLink}
              to="/app"
              underline="hover"
              color="inherit"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <HomeIcon fontSize="small" />
              Home
            </MuiLink>
            <Typography
              color="text.secondary"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              <AccountCircleIcon fontSize="small" />
              Profile
            </Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>

      {/* MAIN CONTENT AREA: PROFILE CARD (LEFT) & SETTINGS (RIGHT) */}
      <Grid container spacing={3}>
        {/* LEFT PANEL: Profile Card with Verification Alert */}
        <Grid item xs={12} md={4}>
          <Card
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "#fff",
              border: "1px solid #eee",
            }}
          >
            <CardContent>
              <Stack spacing={1}>
                {/* Name and Status */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon sx={{ color: "#333" }} />
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    FULL DEMO
                  </Typography>
                  <FiberManualRecordIcon
                    sx={{
                      fontSize: 10,
                      color: isVerified ? "#34D399" : "#FBBF24", // Green/Yellow dot
                    }}
                  />
                </Box>

                {/* Email */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <MailOutlineIcon sx={{ color: "#666" }} />
                  <Typography variant="body2" color="text.secondary">
                    test@gmail.com
                  </Typography>
                </Box>

                {/* Document/Company */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <DescriptionIcon sx={{ color: "#666" }} />
                  <Typography variant="body2" color="text.secondary">
                    FLYNET
                  </Typography>
                </Box>
              </Stack>

              {/* Verification Alert Box (Figma Style) */}
              {!isVerified && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 1.5,
                    bgcolor: "#FFFBEB", // Light yellow background
                    border: "1px solid #FCD34D", // Yellow border
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#F59E0B", // Dark yellow text/icon
                      mb: 1,
                    }}
                  >
                    <WarningAmberIcon sx={{ mr: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Check your email and follow the instructions to verify your
                      account.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 1,
                      bgcolor: "#F59E0B",
                      "&:hover": { bgcolor: "#D97706" },
                      textTransform: "none",
                    }}
                    // Placeholder action to resend email
                    onClick={() => alert("Verification email resent!")}
                  >
                    Send verification email
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT PANEL: Settings/Form Area */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" mb={3} sx={{ fontWeight: 700 }}>
            Settings
          </Typography>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: "1px solid #eee" }}>
            <Grid container spacing={3}>
              {/* Name (Full Width) */}
              <Grid item xs={12}>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>Name</Typography>
                <TextField
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  size="small"
                  placeholder="Enter your name"
                />
              </Grid>

              {/* Email (Left Column) */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>E-mail</Typography>
                <TextField
                  fullWidth
                  name="email"
                  value={formData.email}
                  disabled
                  size="small"
                  placeholder="Your email"
                />
              </Grid>

              {/* New Password (Right Column) */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>
                  Confirm password
                </Typography>
                <TextField
                  fullWidth
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  size="small"
                  placeholder="New Password"
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>

              {/* Empty space matching Email field */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>E-mail</Typography>
                <TextField
                  fullWidth
                  name="email2"
                  value={formData.email}
                  disabled
                  size="small"
                  placeholder="Repeat email"
                />
              </Grid>

              {/* Confirm Password (Right Column) */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>
                  Confirm password
                </Typography>
                <TextField
                  fullWidth
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  size="small"
                  placeholder="Confirm New Password"
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* Save Button (Bottom Right) */}
            <Box sx={{ textAlign: "right", mt: 4 }}>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  bgcolor: "#3366ff", // Assuming a clean blue color for Save
                  "&:hover": { bgcolor: "#254bcc" },
                }}
              >
                Save
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}