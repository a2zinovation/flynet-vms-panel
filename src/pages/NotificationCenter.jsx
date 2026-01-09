// src/pages/NotificationCenter.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Grid,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  TextField,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Divider,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Autocomplete,
  InputAdornment,
  Pagination,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import DraftsIcon from "@mui/icons-material/Drafts";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SendIcon from "@mui/icons-material/Send";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";

import { Link as RouterLink } from "react-router-dom";
import { notificationService } from "../services/notifications";
import { useAuth } from "../context/AuthContext";

export default function NotificationCenter() {
  const { user } = useAuth();
  const isBusinessAdmin = user?.role === "Business Admin";

  // Tab state: 0 = Received, 1 = Send Notification, 2 = Sent History
  const [tabValue, setTabValue] = useState(0);

  // Received Notifications State
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    search: "",
    page: 1,
    per_page: 10,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);

  // Send Notification State
  const [sendForm, setSendForm] = useState({
    subject: "",
    message: "",
    recipient_type: "business_users",
    recipient_ids: [],
    notification_type: "info",
    send_email: false,
  });
  const [availableUsers, setAvailableUsers] = useState([]);
  const [sendLoading, setSendLoading] = useState(false);

  // Sent History State
  const [sentMessages, setSentMessages] = useState([]);
  const [sentLoading, setSentLoading] = useState(false);
  const [sentFilters, setSentFilters] = useState({
    search: "",
    recipient_type: "all",
    page: 1,
    per_page: 10,
  });
  const [sentTotalPages, setSentTotalPages] = useState(1);

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // ========== FETCH RECEIVED NOTIFICATIONS ==========
  useEffect(() => {
    if (tabValue === 0) {
      fetchNotifications();
    }
  }, [tabValue, filters]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = {
        status: filters.status !== "all" ? filters.status : undefined,
        type: filters.type !== "all" ? filters.type : undefined,
        search: filters.search || undefined,
        page: filters.page,
        per_page: filters.per_page,
      };

      const response = await notificationService.getAll(params);
      setNotifications(response.data || []);
      setTotalPages(response.last_page || 1);
      setUnreadCount(response.unread_count || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      showSnackbar("Failed to load notifications", "error");
    } finally {
      setLoading(false);
    }
  };

  // ========== FETCH SENT MESSAGES ==========
  useEffect(() => {
    if (tabValue === 2 && isBusinessAdmin) {
      fetchSentMessages();
    }
  }, [tabValue, sentFilters]);

  const fetchSentMessages = async () => {
    setSentLoading(true);
    try {
      const params = {
        search: sentFilters.search || undefined,
        recipient_type: sentFilters.recipient_type !== "all" ? sentFilters.recipient_type : undefined,
        page: sentFilters.page,
        per_page: sentFilters.per_page,
      };

      const response = await notificationService.getSentMessages(params);
      setSentMessages(response.data || []);
      setSentTotalPages(response.last_page || 1);
    } catch (error) {
      console.error("Failed to fetch sent messages:", error);
      showSnackbar("Failed to load sent messages", "error");
    } finally {
      setSentLoading(false);
    }
  };

  // ========== FETCH USERS FOR SEND FORM ==========
  useEffect(() => {
    if (tabValue === 1 && isBusinessAdmin) {
      fetchUsers();
    }
  }, [tabValue]);

  const fetchUsers = async () => {
    try {
      const response = await notificationService.getUsersForNotification();
      setAvailableUsers(response || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // ========== NOTIFICATION ACTIONS ==========
  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
      showSnackbar("Marked as read", "success");
    } catch (error) {
      showSnackbar("Failed to mark as read", "error");
    }
  };

  const handleMarkAsUnread = async (id) => {
    try {
      await notificationService.markAsUnread(id);
      fetchNotifications();
      showSnackbar("Marked as unread", "success");
    } catch (error) {
      showSnackbar("Failed to mark as unread", "error");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
      showSnackbar("All marked as read", "success");
    } catch (error) {
      showSnackbar("Failed to mark all as read", "error");
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await notificationService.delete(id);
      fetchNotifications();
      showSnackbar("Notification deleted", "success");
    } catch (error) {
      showSnackbar("Failed to delete notification", "error");
    }
  };

  const handleDeleteAllRead = async () => {
    try {
      await notificationService.deleteAllRead();
      fetchNotifications();
      showSnackbar("All read notifications deleted", "success");
    } catch (error) {
      showSnackbar("Failed to delete read notifications", "error");
    }
  };

  const handleViewDetails = async (notification) => {
    setSelectedNotif(notification);
    setDetailDialog(true);
    if (notification.status === "unread") {
      handleMarkAsRead(notification.id);
    }
  };

  // ========== SEND NOTIFICATION ==========
  const handleSendNotification = async () => {
    if (!sendForm.subject || !sendForm.message) {
      showSnackbar("Please fill in subject and message", "warning");
      return;
    }

    if (sendForm.recipient_type === "specific" && sendForm.recipient_ids.length === 0) {
      showSnackbar("Please select at least one recipient", "warning");
      return;
    }

    setSendLoading(true);
    try {
      await notificationService.send(sendForm);
      showSnackbar("Notification sent successfully", "success");
      setSendForm({
        subject: "",
        message: "",
        recipient_type: "business_users",
        recipient_ids: [],
        notification_type: "info",
        send_email: false,
      });
      setTabValue(2); // Switch to sent history
    } catch (error) {
      showSnackbar("Failed to send notification", "error");
    } finally {
      setSendLoading(false);
    }
  };

  // ========== HELPERS ==========
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "warning":
        return <WarningIcon sx={{ color: "#FFA726" }} />;
      case "alert":
        return <ErrorIcon sx={{ color: "#EF5350" }} />;
      case "system":
        return <SettingsIcon sx={{ color: "#42A5F5" }} />;
      default:
        return <InfoIcon sx={{ color: "#66BB6A" }} />;
    }
  };

  const handleMenuOpen = (event, notification) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotif(notification);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // ========== RENDER TABS ==========
  const renderReceivedNotifications = () => (
    <Box>
      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search notifications..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="unread">Unread</MenuItem>
              <MenuItem value="read">Read</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.type}
              label="Type"
              onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="info">Info</MenuItem>
              <MenuItem value="warning">Warning</MenuItem>
              <MenuItem value="alert">Alert</MenuItem>
              <MenuItem value="system">System</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleMarkAllAsRead}
            sx={{ height: "100%" }}
          >
            Mark All Read
          </Button>
        </Grid>
      </Grid>

      {/* Unread Count Badge */}
      {unreadCount > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          You have {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
        </Alert>
      )}

      {/* Notifications List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : notifications.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <NotificationsActiveIcon sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No notifications found
          </Typography>
        </Box>
      ) : (
        <Box>
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              sx={{
                mb: 2,
                p: 2,
                cursor: "pointer",
                backgroundColor: notif.status === "unread" ? "#f5f9ff" : "#fff",
                border: notif.status === "unread" ? "1px solid #d0e3ff" : "1px solid #e0e0e0",
                "&:hover": { boxShadow: 2 },
              }}
              onClick={() => handleViewDetails(notif)}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={1}>
                  {getNotificationIcon(notif.type)}
                </Grid>
                <Grid item xs={9}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: notif.status === "unread" ? 700 : 400 }}>
                      {notif.subject}
                    </Typography>
                    <Chip
                      label={notif.type}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: 11,
                        textTransform: "capitalize",
                      }}
                    />
                    {notif.status === "unread" && (
                      <Chip label="NEW" size="small" color="primary" sx={{ height: 20, fontSize: 11 }} />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {stripHtml(notif.message).substring(0, 100)}
                    {stripHtml(notif.message).length > 100 ? "..." : ""}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {new Date(notif.created_at).toLocaleString()} • From: {notif.sender?.first_name} {notif.sender?.last_name}
                  </Typography>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: "right" }}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuOpen(e, notif);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Card>
          ))}

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={filters.page}
              onChange={(e, page) => setFilters({ ...filters, page })}
              color="primary"
            />
          </Box>
        </Box>
      )}

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {selectedNotif?.status === "unread" ? (
          <MenuItem
            onClick={() => {
              handleMarkAsRead(selectedNotif.id);
              handleMenuClose();
            }}
          >
            <DraftsIcon sx={{ mr: 1 }} /> Mark as Read
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              handleMarkAsUnread(selectedNotif.id);
              handleMenuClose();
            }}
          >
            <MailOutlineIcon sx={{ mr: 1 }} /> Mark as Unread
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleDeleteNotification(selectedNotif.id);
            handleMenuClose();
          }}
        >
          <DeleteOutlineIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Detail Dialog */}
      <Dialog open={detailDialog} onClose={() => setDetailDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {selectedNotif && getNotificationIcon(selectedNotif.type)}
            {selectedNotif?.subject}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
            {stripHtml(selectedNotif?.message)}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary">
            From: {selectedNotif?.sender?.first_name} {selectedNotif?.sender?.last_name} ({selectedNotif?.sender?.email})
          </Typography>
          <br />
          <Typography variant="caption" color="text.secondary">
            Received: {selectedNotif?.created_at && new Date(selectedNotif.created_at).toLocaleString()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  const renderSendNotification = () => (
    <Box>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Compose Notification
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Subject"
              required
              value={sendForm.subject}
              onChange={(e) => setSendForm({ ...sendForm, subject: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Message"
              required
              multiline
              rows={6}
              value={sendForm.message}
              onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Recipient Type</InputLabel>
              <Select
                value={sendForm.recipient_type}
                label="Recipient Type"
                onChange={(e) =>
                  setSendForm({ ...sendForm, recipient_type: e.target.value, recipient_ids: [] })
                }
              >
                <MenuItem value="business_users">All Business Users</MenuItem>
                <MenuItem value="specific">Specific Users</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Notification Type</InputLabel>
              <Select
                value={sendForm.notification_type}
                label="Notification Type"
                onChange={(e) => setSendForm({ ...sendForm, notification_type: e.target.value })}
              >
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="alert">Alert</MenuItem>
                <MenuItem value="system">System</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {sendForm.recipient_type === "specific" && (
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={availableUsers}
                getOptionLabel={(option) => `${option.first_name} ${option.last_name} (${option.email})`}
                value={availableUsers.filter((u) => sendForm.recipient_ids.includes(u.id))}
                onChange={(e, newValue) =>
                  setSendForm({ ...sendForm, recipient_ids: newValue.map((v) => v.id) })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Select Recipients" placeholder="Search users..." />
                )}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setSendForm({
                    subject: "",
                    message: "",
                    recipient_type: "business_users",
                    recipient_ids: [],
                    notification_type: "info",
                    send_email: false,
                  });
                }}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                startIcon={sendLoading ? <CircularProgress size={20} /> : <SendIcon />}
                onClick={handleSendNotification}
                disabled={sendLoading}
              >
                Send Notification
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );

  const renderSentHistory = () => (
    <Box>
      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search sent messages..."
            value={sentFilters.search}
            onChange={(e) => setSentFilters({ ...sentFilters, search: e.target.value, page: 1 })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Recipient Type</InputLabel>
            <Select
              value={sentFilters.recipient_type}
              label="Recipient Type"
              onChange={(e) => setSentFilters({ ...sentFilters, recipient_type: e.target.value, page: 1 })}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="business_users">Business Users</MenuItem>
              <MenuItem value="specific">Specific Users</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Sent Messages List */}
      {sentLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : sentMessages.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <HistoryIcon sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No sent messages found
          </Typography>
        </Box>
      ) : (
        <Box>
          {sentMessages.map((msg) => (
            <Card key={msg.id} sx={{ mb: 2, p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {msg.subject}
                    </Typography>
                    <Chip
                      label={`${msg.recipients_count} recipients`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {stripHtml(msg.message).substring(0, 150)}
                    {stripHtml(msg.message).length > 150 ? "..." : ""}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Chip label={msg.notification_type} size="small" sx={{ textTransform: "capitalize" }} />
                    <Chip
                      label={msg.recipient_type.replace("_", " ")}
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    />
                    <Typography variant="caption" color="text.disabled">
                      {new Date(msg.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          ))}

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={sentTotalPages}
              page={sentFilters.page}
              onChange={(e, page) => setSentFilters({ ...sentFilters, page })}
              color="primary"
            />
          </Box>
        </Box>
      )}
    </Box>
  );

  // ========== MAIN RENDER ==========
  return (
    <Box sx={{ p: 3 }}>
      {/* Header + Breadcrumb */}
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Notification Center
        </Typography>

        <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />}>
          <MuiLink component={RouterLink} to="/app" underline="hover" color="inherit" sx={{ display: "flex", alignItems: "center" }}>
            <HomeIcon sx={{ fontSize: 18, mr: 0.5 }} />
            Home
          </MuiLink>
          <Typography sx={{ display: "flex", alignItems: "center", fontWeight: 600 }}>
            <NotificationsActiveIcon sx={{ fontSize: 18, mr: 0.5 }} />
            Notification Center
          </Typography>
        </Breadcrumbs>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Received" />
          {isBusinessAdmin && <Tab label="Send Notification" />}
          {isBusinessAdmin && <Tab label="Sent History" />}
        </Tabs>
      </Box>

      {/* Tab Content */}
      {tabValue === 0 && renderReceivedNotifications()}
      {tabValue === 1 && isBusinessAdmin && renderSendNotification()}
      {tabValue === 2 && isBusinessAdmin && renderSentHistory()}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
