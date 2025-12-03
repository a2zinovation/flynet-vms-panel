import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { Box, TextField, Button, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map events
function LocationMarker({ position, onPositionChange }) {
  const [draggable, setDraggable] = useState(true);
  const markerRef = useRef(null);

  useMapEvents({
    click(e) {
      onPositionChange(e.latlng);
    },
  });

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const newPos = marker.getLatLng();
        onPositionChange(newPos);
      }
    },
  };

  return position ? (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  ) : null;
}

// Component to update map center
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function MapLocationPicker({ initialLat, initialLng, onLocationChange }) {
  const [position, setPosition] = useState({ lat: initialLat || 40.7128, lng: initialLng || -74.0060 });
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (initialLat && initialLng) {
      setPosition({ lat: initialLat, lng: initialLng });
    }
  }, [initialLat, initialLng]);

  const handlePositionChange = (newPos) => {
    const lat = typeof newPos.lat === 'function' ? newPos.lat() : newPos.lat;
    const lng = typeof newPos.lng === 'function' ? newPos.lng() : newPos.lng;
    
    setPosition({ lat, lng });
    
    // Reverse geocode to get address
    reverseGeocode(lat, lng);
    
    // Notify parent
    onLocationChange(lat, lng, '');
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      const data = await response.json();
      if (data && data.display_name) {
        onLocationChange(lat, lng, data.display_name);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);
        
        setPosition({ lat: newLat, lng: newLng });
        onLocationChange(newLat, newLng, display_name);
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Error searching for location. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setPosition(newPos);
          handlePositionChange(newPos);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get current location. Please ensure location permissions are enabled.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box>
      {/* Search Bar */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search for an address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={searching}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
        <Button
          variant="outlined"
          onClick={handleCurrentLocation}
          startIcon={<MyLocationIcon />}
          sx={{ minWidth: 'auto', px: 2 }}
          title="Use current location"
        >
        </Button>
      </Box>

      {/* Map */}
      <Paper elevation={2} sx={{ height: 400, overflow: 'hidden', borderRadius: 2 }}>
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            position={position}
            onPositionChange={handlePositionChange}
          />
          <ChangeView center={[position.lat, position.lng]} />
        </MapContainer>
      </Paper>

      <Box sx={{ mt: 1 }}>
        <small style={{ color: '#666' }}>
          Click on the map or drag the marker to set the camera location
        </small>
      </Box>
    </Box>
  );
}
