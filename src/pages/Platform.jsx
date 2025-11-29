// src/pages/Platform.jsx
import React, { useState } from "react";
import {
  Box,
  Grid,
  Container,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Card,
  CardContent,
  TextField,
  Switch,
  Button,
  Tabs,
  Tab,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest"; // ⭐ ADDED Icon

// ⭐ Import Link from React Router
import { Link as RouterLink } from "react-router-dom"; 

/**
 * Platform page
 * - Tabbed register-like UI with fields for Settings, Colors, Images, Application(User),
 * Terms and conditions, Integration.
 *
 * Notes:
 * - This is a UI implementation that matches Figma spacing and structure.
 * - Hook this up to your API / state management as needed.
 */

function TabPanel({ children, value, index, ...rest }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...rest}>
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export default function Platform() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("md"));

  // top-level form state (example defaults)
  const [tab, setTab] = useState(0);
  const [platformName, setPlatformName] = useState("Flynet Security");
  const [pageTitle, setPageTitle] = useState("Seguridad en Tus Manos");
  const [defaultReplyEmail, setDefaultReplyEmail] = useState("info@flynet.sv");
  const [contactEmail, setContactEmail] = useState("alexgomez@flynet.sv");
  const [timeZone, setTimeZone] = useState("America/El_Salvador");
  const [platformLang, setPlatformLang] = useState("es");
  const [description, setDescription] = useState(
    "Monitoreo 24/7 con tecnologia avanzada para protección continua..."
  );

  // toggles
  const [expireVideos, setExpireVideos] = useState(false);
  const [expireDays, setExpireDays] = useState(90);
  const [externalUsers, setExternalUsers] = useState(false);
  const [accessProtection, setAccessProtection] = useState(false);

  // colors preview (simple)
  const [headerColor, setHeaderColor] = useState("rgb(0,150,252)");
  const [buttonColor, setButtonColor] = useState("rgb(0,150,252)");
  const [menuColor, setMenuColor] = useState("rgb(25,25,25)");
  const [loginBg, setLoginBg] = useState("rgb(25,25,25)");
  const [loginTextColor, setLoginTextColor] = useState("rgb(255,255,255)");

  // integration state
  const [integrationProvider, setIntegrationProvider] = useState("Helios");
  const [integrationToken, setIntegrationToken] = useState("");

  // images placeholders
  const [previewImageUrl, setPreviewImageUrl] = useState(""); // store uploaded preview urls if needed
  const [logoUrl, setLogoUrl] = useState("");
  const [watermarkUrl, setWatermarkUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");

  function handleTabChange(_, v) {
    setTab(v);
  }

  function handleSave() {
    // TODO: wire to API
    const payload = {
      platformName,
      pageTitle,
      defaultReplyEmail,
      contactEmail,
      timeZone,
      platformLang,
      description,
      expireVideos,
      expireDays,
      externalUsers,
      accessProtection,
      colors: { headerColor, buttonColor, menuColor, loginBg, loginTextColor },
      integration: { integrationProvider, integrationToken },
      images: { previewImageUrl, logoUrl, watermarkUrl, faviconUrl },
    };
    console.log("SAVE PLATFORM:", payload);
    alert("Save clicked — check console for payload (wire to API)");
  }

  function handleCancel() {
    // simple reset or navigation as required
    window.history.back();
  }

  // small util UI pieces
  const SectionCard = ({ children }) => (
    <Box
      sx={{
        borderRadius: 2,
        bgcolor: "transparent",
      }}
    >
      <Paper elevation={0} sx={{ borderRadius: 2, p: { xs: 1.5, md: 2 } }}>
        {children}
      </Paper>
    </Box>
  );

  const FilePlaceholder = ({ label, url, onUpload }) => {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{label}</Typography>
        <Box
          sx={{
            border: "2px dashed #bfcbdc",
            borderRadius: 1,
            minHeight: 84,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 1,
            bgcolor: url ? "transparent" : "rgba(15, 23, 42, 0.02)",
            position: "relative",
          }}
        >
          {url ? (
            <Box component="img" src={url} alt={label} sx={{ maxHeight: 84, maxWidth: "100%" }} />
          ) : (
            <Typography color="text.secondary">Drop image or click to upload (placeholder)</Typography>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const objectUrl = URL.createObjectURL(f);
              onUpload(objectUrl, f);
            }}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              cursor: "pointer",
            }}
          />
        </Box>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* header & breadcrumb */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Platform
          </Typography>
        </Grid>

        <Grid item>
          <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />} aria-label="breadcrumb">
            
            {/* ⭐ LINK: Home */}
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
            
            {/* Current Page: Platform */}
            <Typography color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5, fontWeight: 600, color: 'text.primary' }}>
                <SettingsSuggestIcon fontSize="small" />
                Platform
            </Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>

      {/* main card area */}
      <Card elevation={0} sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          {/* top row fields */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                label="Platform Name"
                fullWidth
                size="small"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Page title"
                fullWidth
                size="small"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography sx={{ fontSize: 14 }}>Active</Typography>
                <Switch defaultChecked color="success" />
              </Box>
            </Grid>

            {/* second row top */}
            <Grid item xs={12} md={4}>
              <TextField
                label="Default reply email"
                fullWidth
                size="small"
                value={defaultReplyEmail}
                onChange={(e) => setDefaultReplyEmail(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Contact email"
                fullWidth
                size="small"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </Grid>

            <Grid item xs={8} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="tz-label">Time zone</InputLabel>
                <Select
                  labelId="tz-label"
                  label="Time zone"
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                >
                  <MenuItem value="America/El_Salvador">America/El_Salvador</MenuItem>
                  <MenuItem value="UTC">UTC</MenuItem>
                  <MenuItem value="America/New_York">America/New_York</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={4} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="lang-label">Platform language</InputLabel>
                <Select
                  labelId="lang-label"
                  label="Platform language"
                  value={platformLang}
                  onChange={(e) => setPlatformLang(e.target.value)}
                >
                  <MenuItem value="es">ES</MenuItem>
                  <MenuItem value="en">EN</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* description */}
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Platform description in login"
              multiline
              minRows={2}
              size="small"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              inputProps={{ maxLength: 150 }}
              helperText={`${description.length}/150`}
            />
          </Box>

          {/* Tabs */}
          <Box sx={{ mt: 3 }}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant={isSm ? "scrollable" : "scrollable"}
              scrollButtons="auto"
              sx={{
                "& .MuiTabs-indicator": { height: 3, borderRadius: 2 },
                mb: 1,
              }}
            >
              <Tab label="Settings" />
              <Tab label="Colors" />
              <Tab label="Images" />
              <Tab label="Application (User)" />
              <Tab label="Terms and conditions" />
              <Tab label="Integration" />
            </Tabs>

            {/* content area */}
            <Box sx={{ minHeight: 200 }}>
              <TabPanel value={tab} index={0}>
                {/* Settings tab content */}
                <SectionCard>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography sx={{ fontWeight: 600, mb: 1 }}>Expire my videos</Typography>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Switch
                              checked={expireVideos}
                              onChange={(e) => setExpireVideos(e.target.checked)}
                            />
                            <Typography color="text.secondary">Active</Typography>
                            <TextField
                              size="small"
                              type="number"
                              sx={{ width: 120 }}
                              value={expireDays}
                              onChange={(e) => setExpireDays(Number(e.target.value))}
                              disabled={!expireVideos}
                            />
                            <Typography color="text.secondary">days</Typography>
                          </Stack>
                        </Box>

                        <Box>
                          <Typography sx={{ fontWeight: 600, mb: 1 }}>Permissions</Typography>
                          <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Switch
                                checked={externalUsers}
                                onChange={(e) => setExternalUsers(e.target.checked)}
                              />
                              <Typography>External users</Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Switch
                                checked={accessProtection}
                                onChange={(e) => setAccessProtection(e.target.checked)}
                              />
                              <Typography>Access Protection</Typography>
                            </Stack>
                          </Stack>
                        </Box>

                        <Box>
                          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Service code</Typography>
                          <Box
                            sx={{
                              mt: 1,
                              p: 1.5,
                              bgcolor: "#f5f7fa",
                              borderRadius: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                              fa115ca2-d2ab-4632-ae90-37f53917652c
                            </Typography>
                            <Button size="small" variant="outlined">
                              Copy
                            </Button>
                          </Box>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      {/* empty right column for spacing or other settings */}
                    </Grid>
                  </Grid>
                </SectionCard>
              </TabPanel>

              <TabPanel value={tab} index={1}>
                {/* Colors tab */}
                <SectionCard>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={2}>
                        <TextField
                          label="Header text"
                          size="small"
                          value={headerColor}
                          onChange={(e) => setHeaderColor(e.target.value)}
                        />
                        <TextField
                          label="Header"
                          size="small"
                          value={headerColor}
                          onChange={(e) => setHeaderColor(e.target.value)}
                        />
                        <TextField
                          label="Buttons"
                          size="small"
                          value={buttonColor}
                          onChange={(e) => setButtonColor(e.target.value)}
                        />
                        <TextField
                          label="Menu text"
                          size="small"
                          value={loginTextColor}
                          onChange={(e) => setLoginTextColor(e.target.value)}
                        />
                        <TextField
                          label="Menu"
                          size="small"
                          value={menuColor}
                          onChange={(e) => setMenuColor(e.target.value)}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={2}>
                        <TextField
                          label="Login background"
                          size="small"
                          value={loginBg}
                          onChange={(e) => setLoginBg(e.target.value)}
                        />
                        <TextField
                          label="Login text"
                          size="small"
                          value={loginTextColor}
                          onChange={(e) => setLoginTextColor(e.target.value)}
                        />

                        <Box sx={{ mt: 1 }}>
                          <Typography sx={{ fontWeight: 600, mb: 1 }}>Preview</Typography>
                          <Stack direction="row" spacing={1} sx={{ overflowX: "auto" }}>
                            {/* small preview boxes */}
                            <Box
                              sx={{
                                width: 120,
                                height: 80,
                                borderRadius: 1,
                                bgcolor: headerColor,
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                              }}
                            >
                              Header
                            </Box>
                            <Box
                              sx={{
                                width: 120,
                                height: 80,
                                borderRadius: 1,
                                bgcolor: loginBg,
                                color: loginTextColor,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                              }}
                            >
                              Login
                            </Box>
                            <Box
                              sx={{
                                width: 120,
                                height: 80,
                                borderRadius: 1,
                                bgcolor: buttonColor,
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                              }}
                            >
                              Button
                            </Box>
                          </Stack>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </SectionCard>
              </TabPanel>

              <TabPanel value={tab} index={2}>
                {/* Images tab */}
                <SectionCard>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={7}>
                      <FilePlaceholder
                        label="Default Advertising"
                        url={previewImageUrl}
                        onUpload={(url) => setPreviewImageUrl(url)}
                      />
                      <Box sx={{ mt: 1 }}>
                        <TextField fullWidth size="small" placeholder="https://flynet.sv/" />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <Box sx={{ display: "grid", gap: 2 }}>
                        <FilePlaceholder label="Watermark (max 125x70)" url={watermarkUrl} onUpload={(u) => setWatermarkUrl(u)} />
                        <FilePlaceholder label="Logo (max 1440x332)" url={logoUrl} onUpload={(u) => setLogoUrl(u)} />
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <FilePlaceholder label="Favicon (64x64)" url={faviconUrl} onUpload={(u) => setFaviconUrl(u)} />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </SectionCard>
              </TabPanel>

              <TabPanel value={tab} index={3}>
                {/* Application (User) */}
                <SectionCard>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography sx={{ mb: 1, fontWeight: 600 }}>Theme (Preview)</Typography>
                      <Box
                        sx={{
                          borderRadius: 2,
                          border: "1px solid #e6eef6",
                          p: 2,
                          minHeight: 220,
                          bgcolor: "#fff",
                        }}
                      >
                        {/* a mock mobile preview placeholder */}
                        <Box sx={{ width: 220, height: 420, bgcolor: "#f5f7fa", borderRadius: 2 }} />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography sx={{ mb: 1, fontWeight: 600 }}>App Logo (Dark/Light)</Typography>

                      <Box sx={{ display: "grid", gap: 2 }}>
                        <FilePlaceholder label="App Logo (Dark mode)" url={logoUrl} onUpload={(u) => setLogoUrl(u)} />
                        <FilePlaceholder label="App Logo (Light mode)" url={logoUrl} onUpload={(u) => setLogoUrl(u)} />
                      </Box>
                    </Grid>
                  </Grid>
                </SectionCard>
              </TabPanel>

              <TabPanel value={tab} index={4}>
                {/* Terms and conditions tab */}
                <SectionCard>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography sx={{ fontWeight: 600, mb: 1 }}>Active</Typography>
                          <Switch />
                        </Box>
                        <Box>
                          <TextField fullWidth multiline minRows={4} placeholder="Terms & conditions text..." />
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </SectionCard>
              </TabPanel>

              <TabPanel value={tab} index={5}>
                {/* Integration tab */}
                <SectionCard>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="int-label">Integration</InputLabel>
                        <Select
                          labelId="int-label"
                          label="Integration"
                          value={integrationProvider}
                          onChange={(e) => setIntegrationProvider(e.target.value)}
                        >
                          <MenuItem value="Helios">Helios</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Integration token"
                        value={integrationToken}
                        onChange={(e) => setIntegrationToken(e.target.value)}
                      />
                      <Button variant="outlined" onClick={() => alert("Add token (example)")}>
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                </SectionCard>
              </TabPanel>
            </Box>
          </Box>

          {/* action row bottom */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
            <Button color="error" variant="contained" onClick={handleCancel} sx={{ borderRadius: 2 }}>
              Cancel
            </Button>

            <Button variant="contained" onClick={handleSave} sx={{ borderRadius: 2 }}>
              Save
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}