// src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from "react";
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
  CircularProgress,
  Alert,
  Snackbar,
  Avatar,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth";

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
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

export default function Profile() {
  const { user: authUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    newPasswordConfirmation: "",
  });
  const [profileData, setProfileData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      // authService.getProfile() returns clean user data (extracts from wrapped response)
      const userData = await authService.getProfile();

      setProfileData(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        currentPassword: "",
        newPassword: "",
        newPasswordConfirmation: "",
      });
      setIsVerified(userData.email_verified_at !== null);
      
      // Set profile image if available
      if (userData.profile_picture) {
        setProfileImagePreview(userData.profile_picture);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message || "Failed to load profile");
      
      // Fallback to auth context user
      if (authUser) {
        setFormData({
          name: authUser.name || "",
          email: authUser.email || "",
          currentPassword: "",
          newPassword: "",
          newPasswordConfirmation: "",
        });
        setIsVerified(authUser.email_verified_at !== null);
        if (authUser.profile_picture) {
          setProfileImagePreview(authUser.profile_picture);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setSnackbar({ open: true, message: "Please select an image file", severity: "error" });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({ open: true, message: "Image size must be less than 5MB", severity: "error" });
        return;
      }
      
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      // Validate passwords if changing
      if (formData.newPassword || formData.newPasswordConfirmation) {
        if (!formData.currentPassword) {
          setSnackbar({ open: true, message: "Current password is required to change password", severity: "error" });
          return;
        }
        
        if (formData.newPassword !== formData.newPasswordConfirmation) {
          setSnackbar({ open: true, message: "New passwords do not match", severity: "error" });
          return;
        }
        
        if (formData.newPassword.length < 8) {
          setSnackbar({ open: true, message: "New password must be at least 8 characters", severity: "error" });
          return;
        }
        
        // Check password complexity
        const hasLowercase = /[a-z]/.test(formData.newPassword);
        const hasUppercase = /[A-Z]/.test(formData.newPassword);
        const hasDigit = /\d/.test(formData.newPassword);
        
        if (!hasLowercase || !hasUppercase || !hasDigit) {
          setSnackbar({ 
            open: true, 
            message: "Password must contain at least one lowercase letter, one uppercase letter, and one digit", 
            severity: "error" 
          });
          return;
        }
        
        if (formData.currentPassword === formData.newPassword) {
          setSnackbar({ open: true, message: "New password must be different from current password", severity: "error" });
          return;
        }
      }

      setSaving(true);
      
      // Use FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      
      if (profileImage) {
        formDataToSend.append('profile_picture', profileImage);
      }
      
      if (formData.newPassword) {
        formDataToSend.append('current_password', formData.currentPassword);
        formDataToSend.append('new_password', formData.newPassword);
        formDataToSend.append('new_password_confirmation', formData.newPasswordConfirmation);
      }

      // Update auth service to handle FormData
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://api.pinkdreams.store/api'}/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Accept': 'application/json',
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      setSnackbar({ open: true, message: "Profile updated successfully", severity: "success" });
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        newPasswordConfirmation: "",
      }));
      
      // Clear image file
      setProfileImage(null);
      
      // Refresh profile data
      await fetchProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
      setSnackbar({ 
        open: true, 
        message: err.message || "Failed to update profile", 
        severity: "error" 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      // TODO: Implement resend verification email endpoint
      setSnackbar({ open: true, message: "Verification email sent!", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to send verification email", severity: "error" });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

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
              {/* Profile Picture Section */}
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={profileImagePreview}
                    alt={formData.name}
                    sx={{
                      width: 120,
                      height: 120,
                      border: "4px solid #f0f0f0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    {!profileImagePreview && formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: "#3366ff",
                      color: "#fff",
                      width: 36,
                      height: 36,
                      "&:hover": {
                        bgcolor: "#254bcc",
                      },
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <PhotoCameraIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
                  Click camera icon to upload
                </Typography>
              </Box>

              <Stack spacing={1}>
                {/* Name and Status */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon sx={{ color: "#333" }} />
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {formData.name || "User"}
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
                    {formData.email || "No email"}
                  </Typography>
                </Box>

                {/* Document/Company */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <DescriptionIcon sx={{ color: "#666" }} />
                  <Typography variant="body2" color="text.secondary">
                    {profileData?.business?.name || authUser?.business?.name || "FLYNET"}
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
                    onClick={handleResendVerification}
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

              {/* Email (Full Width - Read Only) */}
              <Grid item xs={12}>
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

              {/* Password Change Section */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Change Password
                </Typography>
              </Grid>

              {/* Current Password */}
              <Grid item xs={12}>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>
                  Current Password
                </Typography>
                <TextField
                  fullWidth
                  name="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  size="small"
                  placeholder="Enter current password"
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>

              {/* New Password */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>
                  New Password
                </Typography>
                <TextField
                  fullWidth
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange}
                  size="small"
                  placeholder="Enter new password"
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    ),
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                  Min 8 characters, 1 uppercase, 1 lowercase, 1 digit
                </Typography>
              </Grid>

              {/* Confirm New Password */}
              <Grid item xs={12} sm={6}>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>
                  Confirm New Password
                </Typography>
                <TextField
                  fullWidth
                  name="newPasswordConfirmation"
                  type={showPassword ? "text" : "password"}
                  value={formData.newPasswordConfirmation}
                  onChange={handleChange}
                  size="small"
                  placeholder="Confirm new password"
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
                disabled={saving}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  bgcolor: "#3366ff",
                  "&:hover": { bgcolor: "#254bcc" },
                }}
              >
                {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Error Alert */}
      {error && (
        <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError("")}>
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}