import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogContent,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";

// Icons
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Define possible views
const VIEWS = {
  EMAIL_PASSWORD: "email_password",
  QR_CODE: "qr_code",
};

// --- Styles object to match the Figma design (unchanged from prior version) ---
const styles = {
  pageContainer: {
    height: "100vh",
    display: "flex",
    overflow: "hidden",
  },
  leftPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#08132A", 
    color: "#fff",
    padding: "40px",
    position: "relative",
    backgroundImage: `url("/assets/background-pattern.png")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  logo: {
    fontSize: "3.5rem",
    fontWeight: 700,
    marginBottom: "10px",
  },
  tagline: {
    maxWidth: "400px",
    textAlign: "center",
    fontSize: "0.9rem",
    color: "#A0B0C0",
  },
  rightPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "40px",
  },
  contentBox: {
    width: "100%",
    maxWidth: "380px",
    textAlign: "center",
  },
  welcomeText: {
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: "20px",
    color: "#182046",
  },
  qrCodeButton: {
    width: "100%",
    textTransform: "none",
    padding: "10px 0",
    marginBottom: "20px",
    border: "1px solid #E0E0E0",
    color: "#555",
    "&:hover": {
      backgroundColor: "#f5f5f5",
      borderColor: "#d0d0d0",
    },
  },
  textField: {
    marginBottom: "20px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      paddingRight: 0,
    },
  },
  loginButton: {
    width: "100%",
    textTransform: "none",
    backgroundColor: "#182046",
    color: "#fff",
    padding: "12px",
    borderRadius: "8px",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "#20285a",
    },
  },
  forgotPasswordLink: {
    marginTop: "10px",
    display: "block",
    color: "#404040",
    textDecoration: "none",
    fontSize: "0.85rem",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  dialogTitle: {
    fontWeight: 600,
    fontSize: "1.2rem",
    marginBottom: "10px",
    color: "#333",
  },
  dialogCancelButton: {
    bgcolor: '#F0F0F0',
    color: '#333',
    '&:hover': { bgcolor: '#E0E0E0' },
    px: 4,
    py: 1,
    textTransform: 'none',
    borderRadius: '6px',
    marginRight: '10px',
  },
  dialogConfirmButton: {
    bgcolor: '#182046', 
    color: '#fff',
    '&:hover': { bgcolor: '#20285a' },
    px: 4,
    py: 1,
    textTransform: 'none',
    borderRadius: '6px',
  },
  qrCodeBox: {
    padding: '30px',
    textAlign: 'center',
    marginBottom: '20px',
  },
  qrCodeImage: {
    width: '150px',
    height: '150px',
    objectFit: 'contain',
    margin: '20px auto',
    border: '1px solid #E0E0E0', 
    padding: '10px',
  },
  qrTimer: {
    fontWeight: 600,
    fontSize: '1rem',
    margin: '10px 0',
    color: '#E04C40', 
  },
  qrInfo: {
    fontSize: '0.85rem',
    color: '#555',
    marginBottom: '30px',
  },
  qrDividerText: {
    color: '#888',
    fontSize: '0.8rem',
    margin: '20px 0',
  }
};

// --- Component Implementations ---

function EmailPasswordView({ onForgotPassword, onViewChange }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(email, password);
      
      // Check standardized response format
      if (!result.success) {
        setError(result.message || "Invalid credentials");
      } else {
        // Navigate to app on successful login
        navigate("/app");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={styles.contentBox}>
      <Typography variant="h1" sx={styles.welcomeText}>
        Welcome VMS Business!
      </Typography>

      <Button
        variant="outlined"
        startIcon={<QrCodeScannerIcon />}
        sx={styles.qrCodeButton}
        onClick={() => onViewChange(VIEWS.QR_CODE)}
        disabled={loading}
      >
        Log in with QR code
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={styles.textField}
        placeholder="Enter your email"
        disabled={loading}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleLogin();
          }
        }}
      />

      <TextField
        fullWidth
        label="Password"
        variant="outlined"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={styles.textField}
        placeholder="Enter your password"
        disabled={loading}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleLogin();
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                size="small"
                disabled={loading}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant="contained"
        sx={styles.loginButton}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
      </Button>

      <Typography
        component="a"
        sx={styles.forgotPasswordLink}
        onClick={onForgotPassword}
      >
        Forgot Password?
      </Typography>
    </Box>
  );
}

function QRCodeView({ onViewChange }) {
    // const [timer, setTimer] = useState(60); // Timer logic skipped for brevity
    return (
        <Box sx={styles.contentBox}>
            <Typography variant="h1" sx={styles.welcomeText}>
                Scan the QR code
            </Typography>
            
            <Typography sx={styles.qrInfo}>
                Use the app on your phone to scan the code below and access your account.
            </Typography>

            <Box sx={styles.qrCodeBox}>
                <Box
                    component="img"
                    src="/assets/qr-code-placeholder.png" 
                    alt="QR Code"
                    sx={styles.qrCodeImage}
                />
            </Box>
            
            <Typography sx={styles.qrTimer}>
                Expires in 01:00
            </Typography>

            <Typography sx={{fontSize: '0.9rem', color: '#333', mb: 1}}>
                Menu &gt; setting &gt; scan QR Code
            </Typography>
            
            <Divider sx={{ my: 2 }}>
                <Typography sx={styles.qrDividerText}>
                    Or log in with Email and Password
                </Typography>
            </Divider>


            <Button
                variant="contained"
                sx={styles.loginButton}
                onClick={() => onViewChange(VIEWS.EMAIL_PASSWORD)}
            >
                Login with Email and Pasword
            </Button>
        </Box>
    );
}


// --- Main Component (Exported as Login) ---
export default function Login() {
  const [view, setView] = useState(VIEWS.EMAIL_PASSWORD);
  const [isForgotDialogOpen, setIsForgotDialogOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState(""); 
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotError, setForgotError] = useState("");

  // --- Handlers ---
  const handleForgotOpen = () => {
    setForgotEmail("");
    setForgotSuccess("");
    setForgotError("");
    setIsForgotDialogOpen(true);
  };
  
  const handleForgotClose = () => {
    setIsForgotDialogOpen(false);
    setForgotSuccess("");
    setForgotError("");
  };

  const handleForgotConfirm = async () => {
    setForgotError("");
    setForgotSuccess("");
    
    if (!forgotEmail) {
      setForgotError("Please enter your email address");
      return;
    }

    setForgotLoading(true);
    
    try {
      const { authService } = await import("../services/auth");
      const result = await authService.requestPasswordReset(forgotEmail);
      
      if (result.success) {
        setForgotSuccess(result.message || "Password reset email sent successfully!");
        setTimeout(() => {
          handleForgotClose();
        }, 2000);
      } else {
        setForgotError(result.message || "Failed to send reset email");
      }
    } catch (error) {
      setForgotError("An error occurred. Please try again.");
      console.error("Password reset error:", error);
    } finally {
      setForgotLoading(false);
    }
  };

  const renderRightPanelContent = () => {
    switch (view) {
      case VIEWS.EMAIL_PASSWORD:
        return (
          <EmailPasswordView
            onForgotPassword={handleForgotOpen}
            onViewChange={setView}
          />
        );
      case VIEWS.QR_CODE:
        return <QRCodeView onViewChange={setView} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={styles.pageContainer}>
      {/* Left Panel (Dark Blue) */}
      <Box sx={styles.leftPanel}>
        <Box
          component="img"
          src="/assets/flynet-logo-light.png" 
          alt="flynet logo"
          sx={{ width: '200px', height: 'auto', objectFit: 'contain', mb: 4 }}
        />
        <Typography sx={styles.tagline}>
          24/7 monitoring with advanced technology for continuous protection. Trust us for complete surveillance and total peace of mind
        </Typography>
      </Box>

      {/* Right Panel (Content) */}
      <Box sx={styles.rightPanel}>
        {renderRightPanelContent()}
      </Box>

      {/* --- Forgot Password Dialog --- */}
      <Dialog
        open={isForgotDialogOpen}
        onClose={handleForgotClose}
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: "12px", width: "100%" },
        }}
      >
        <DialogContent sx={{ padding: "30px 40px" }}>
          <Typography sx={styles.dialogTitle}>
            Forgot your password?
          </Typography>

          {forgotSuccess && (
            <Alert severity="success" sx={{ my: 2 }}>
              {forgotSuccess}
            </Alert>
          )}

          {forgotError && (
            <Alert severity="error" sx={{ my: 2 }}>
              {forgotError}
            </Alert>
          )}

          <TextField
            fullWidth
            variant="outlined"
            label="Email"
            placeholder="Enter your email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            disabled={forgotLoading}
            sx={{ my: 2 }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
            <Button
              onClick={handleForgotClose}
              variant="contained"
              sx={styles.dialogCancelButton}
              disabled={forgotLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleForgotConfirm}
              variant="contained"
              sx={styles.dialogConfirmButton}
              disabled={forgotLoading}
            >
              {forgotLoading ? <CircularProgress size={20} color="inherit" /> : "Confirm"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}