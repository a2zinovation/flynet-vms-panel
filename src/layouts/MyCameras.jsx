import React from "react";

export default function MyCameras() {
  return (
    <div className="page-card">
      <h2>My Cameras</h2>

      <div style={{display:"flex", gap:16, marginTop:16}}>
        <div style={{flex:"0 0 300px"}}>
          <div className="panel">
            <input placeholder="Search cameras..." style={{width:"100%", padding:10}}/>
            <div style={{marginTop:12}}>
              <ul className="list-compact">
                <li>Camera 1 — Lobby</li>
                <li>Camera 2 — Entrance</li>
                <li>Camera 3 — Warehouse</li>
                <li>Camera 4 — Parking</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{flex:1}}>
          <div className="panel">
            <div className="placeholder-camera">
              <div className="placeholder-overlay">Live view placeholder</div>
            </div>
            <div style={{marginTop:12}}>Selected camera details / controls go here.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
