// src/pages/MyCameras.jsx
import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// quick icon fix for leaflet default marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/node_modules/leaflet/dist/images/marker-icon-2x.png",
  iconUrl: "/node_modules/leaflet/dist/images/marker-icon.png",
  shadowUrl: "/node_modules/leaflet/dist/images/marker-shadow.png",
});

const sampleCameras = [
  { id: 1, name: "Cam 1", lat: 37.7749, lng: -122.4194, thumb: "/public/assets/VMS-images/map-placeholder.png" },
  { id: 2, name: "Cam 2", lat: 37.7849, lng: -122.4094, thumb: "/public/assets/VMS-images/map-placeholder.png" },
  { id: 3, name: "Cam 3", lat: 37.7649, lng: -122.4294, thumb: "/public/assets/VMS-images/map-placeholder.png" },
];

export default function MyCameras() {
  return (
    <div className="my-cameras-page">
      <div className="map-area">
        <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{ height: "460px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {sampleCameras.map((c) => (
            <Marker key={c.id} position={[c.lat, c.lng]} />
          ))}
        </MapContainer>
      </div>

      <aside className="right-panel">
        <div className="panel-header">
          <h3>3 Cameras</h3>
          <div className="search"><input placeholder="Search" /></div>
        </div>

        <div className="camera-list">
          {sampleCameras.map((c) => (
            <div key={c.id} className="camera-item">
              <img src={c.thumb} alt={c.name} />
              <div className="camera-meta">
                <div className="name">{c.name}</div>
                <div className="addr">Flynet Security CAM 1.05 street</div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
