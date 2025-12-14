// src/pages/MyCameras.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { cameraService } from "../services/cameras";
import { authService } from "../services/auth";
import { Box, TextField, Typography, CircularProgress, Alert, Chip, InputAdornment } from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam';
import SearchIcon from '@mui/icons-material/Search';
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const WORLD_DEFAULT = { lat: 20, lng: 0, name: "World" };

export default function MyCameras() {
  const navigate = useNavigate();
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [businessLocation, setBusinessLocation] = useState(WORLD_DEFAULT);
  const geocodeCache = useRef({});

  const geocodeLocation = async (query) => {
    if (!query) return null;
    if (geocodeCache.current[query]) return geocodeCache.current[query];

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
      const response = await fetch(url, {
        headers: { "Accept-Language": "en" },
      });
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const loc = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          name: data[0].display_name,
        };
        geocodeCache.current[query] = loc;
        return loc;
      }
    } catch (err) {
      console.warn("Geocoding failed for", query, err);
    }
    return null;
  };

  const resolveBusinessLocation = async (business) => {
    if (!business) return WORLD_DEFAULT;

    const city = business.city?.trim();
    const state = business.state?.trim();
    const country = business.country?.trim();
    const countryCode = business.country_code?.trim();

    const queryOrder = [
      [city, country].filter(Boolean).join(", "),
      [city, countryCode].filter(Boolean).join(", "),
      [state, country].filter(Boolean).join(", "),
      country,
      countryCode,
    ].filter((q) => q && q.length > 0);

    for (const query of queryOrder) {
      const location = await geocodeLocation(query);
      if (location) return location;
    }

    return WORLD_DEFAULT;
  };

  useEffect(() => {
    fetchCamerasAndLocation();
  }, []);

  const fetchCamerasAndLocation = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch cameras
      const cameraResponse = await cameraService.getAll();
      let cameraData = [];
      
      if (cameraResponse.data && Array.isArray(cameraResponse.data)) {
        cameraData = cameraResponse.data;
      } else if (cameraResponse.data && cameraResponse.data.data && Array.isArray(cameraResponse.data.data)) {
        cameraData = cameraResponse.data.data;
      } else if (Array.isArray(cameraResponse)) {
        cameraData = cameraResponse;
      }
      
      setCameras(cameraData);
      
      // Fetch business profile for location and geocode dynamically
      try {
        const userData = await authService.getProfile();
        const business = userData?.business;

        if (business) {
          const location = await resolveBusinessLocation(business);
          setBusinessLocation(location);
        } else {
          setBusinessLocation(WORLD_DEFAULT);
        }
      } catch (profileErr) {
        console.warn("Could not fetch business location:", profileErr);
        setBusinessLocation(WORLD_DEFAULT);
      }
    } catch (err) {
      console.error("Error fetching cameras:", err);
      setError(err.message || "Failed to load cameras");
      setCameras([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter cameras with valid coordinates
  const camerasWithLocation = useMemo(() => {
    return cameras.filter(c => 
      c.latitude && 
      c.longitude && 
      !isNaN(parseFloat(c.latitude)) && 
      !isNaN(parseFloat(c.longitude))
    );
  }, [cameras]);

  // Filter cameras by search query
  const filteredCameras = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return camerasWithLocation;
    
    return camerasWithLocation.filter(c => 
      c.name?.toLowerCase().includes(query) ||
      c.address?.toLowerCase().includes(query) ||
      c.manufacturer?.toLowerCase().includes(query)
    );
  }, [camerasWithLocation, searchQuery]);

  // Calculate map center from cameras or use business location
  const mapCenter = useMemo(() => {
    if (filteredCameras.length === 0) {
      // Use business location as default
      return [businessLocation.lat, businessLocation.lng];
    }
    
    const lat = filteredCameras.reduce((sum, c) => sum + parseFloat(c.latitude), 0) / filteredCameras.length;
    const lng = filteredCameras.reduce((sum, c) => sum + parseFloat(c.longitude), 0) / filteredCameras.length;
    
    return [lat, lng];
  }, [filteredCameras, businessLocation]);

  return (
    <div className="my-cameras-page">
      <div className="map-area">
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '460px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : (
          <MapContainer 
            center={mapCenter} 
            zoom={filteredCameras.length > 0 ? 13 : 5} 
            style={{ height: "460px", width: "100%" }}
            key={mapCenter.join(',')} // Force re-render when center changes
          >
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredCameras.map((camera) => (
              <Marker 
                key={camera.id} 
                position={[parseFloat(camera.latitude), parseFloat(camera.longitude)]}
              >
                <Popup>
                  <Box sx={{ minWidth: 150 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {camera.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {camera.address || 'No address'}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      <Chip 
                        label={camera.status === 'active' ? 'Active' : 'Inactive'} 
                        size="small" 
                        color={camera.status === 'active' ? 'success' : 'default'}
                      />
                      {camera.protocol && (
                        <Chip label={camera.protocol} size="small" variant="outlined" />
                      )}
                    </Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        mt: 1, 
                        display: 'block', 
                        color: 'primary.main', 
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={() => navigate(`/app/cameras/view/${camera.id}`)}
                    >
                      View Stream →
                    </Typography>
                  </Box>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      <aside className="right-panel">
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1f2d3d" }}>
              {loading ? "..." : `${filteredCameras.length} Camera${filteredCameras.length !== 1 ? "s" : ""}`}
            </Typography>
            <TextField
              size="small"
              placeholder="Search cameras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: 220,
                background: "#fff",
                borderRadius: "10px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            />
          </Box>

          <Box className="camera-list" sx={{ display: "grid", gap: 1.5 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress size={24} />
              </Box>
            ) : filteredCameras.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center", border: "1px dashed #d7dde5", borderRadius: "12px", background: "#f9fbfd" }}>
                <VideocamIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {searchQuery ? "No cameras match your search" : `No cameras in ${businessLocation.name}`}
                </Typography>
                {cameras.length > 0 && !searchQuery && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                    {cameras.length} camera(s) without location data
                  </Typography>
                )}
              </Box>
            ) : (
              filteredCameras.map((camera) => (
                <Box
                  key={camera.id}
                  onClick={() => navigate(`/app/cameras/view/${camera.id}`)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    border: "1px solid #e5e9ef",
                    borderRadius: "12px",
                    background: "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                    cursor: "pointer",
                    transition: "border-color 120ms ease, transform 120ms ease",
                    "&:hover": {
                      borderColor: "#1976d2",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="/assets/VMS-images/map-placeholder.png"
                    alt={camera.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
                    }}
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: "10px",
                      objectFit: "cover",
                      background: "#f4f6f8",
                      border: "1px solid #eaeff5",
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1f2d3d", lineHeight: 1.2 }} noWrap>
                      {camera.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }} noWrap>
                      {camera.address || `${camera.manufacturer || "Camera"} • ${camera.protocol || "RTSP"}`}
                    </Typography>
                    <Box sx={{ mt: 0.8, display: "flex", gap: 0.7, flexWrap: "wrap" }}>
                      <Chip
                        label={camera.status === "active" ? "Active" : "Inactive"}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.7rem",
                          bgcolor: camera.status === "active" ? "#7AE79A" : "#65696B",
                          color: "#fff",
                        }}
                      />
                      {camera.resolution && (
                        <Chip
                          label={camera.resolution}
                          size="small"
                          variant="outlined"
                          sx={{ height: 20, fontSize: "0.7rem" }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </aside>
    </div>
  );
}
