// src/components/CamerasRegisterModal.jsx
import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid
} from "@mui/material";

export default function CamerasRegisterModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    type: "RTSP",
    host: "7 days",
    storage: "47 GB",
    resolution: "1280 x 720",
    status: "OK"
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleSave() {
    if (!form.name) return alert("Please enter a name");
    onSave(form);
    setForm({ name: "", type: "RTSP", host: "7 days", storage: "47 GB", resolution: "1280 x 720", status: "OK" });
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Register Camera</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Type" name="type" value={form.type} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Host / Retention" name="host" value={form.host} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Storage" name="storage" value={form.storage} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Resolution" name="resolution" value={form.resolution} onChange={handleChange} fullWidth />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
