// src/App.jsx (UPDATED FOR CORRECT FILE NAME AND LOGIN-FIRST LOGIC)
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";

// Pages
import MyCameras from "./pages/MyCameras.jsx";
import MyPatrols from "./pages/MyPatrols.jsx";
import MyMosaics from "./pages/MyMosaics.jsx";
import MyAlarms from "./pages/MyAlarms.jsx";
import MyVideos from "./pages/MyVideos.jsx";
import SmartMosaics from "./pages/SmartMosaics.jsx";

import Cameras from "./pages/Cameras.jsx";
import CamerasRegister from "./pages/CamerasRegister.jsx";
import CameraView from "./pages/CameraView.jsx";
import Alarms from "./pages/Alarms.jsx";
import AlarmsRegister from "./pages/AlarmsRegister.jsx";
import Groups from "./pages/Groups.jsx";
import GroupsRegister from "./pages/GroupsRegister.jsx";
import Users from "./pages/Users.jsx";
import UsersRegister from "./pages/UsersRegister.jsx";
import Permissions from "./pages/Permissions.jsx";
import PermissionsRegister from "./pages/PermissionsRegister.jsx";
import Mosaics from "./pages/Mosaics.jsx";
import MosaicsRegister from "./pages/MosaicsRegister.jsx";
import Patrols from "./pages/Patrols.jsx";
import PatrolsRegister from "./pages/PatrolsRegister.jsx";

import Access from "./pages/Access.jsx";
import Reports from "./pages/Reports.jsx";
import Platform from "./pages/Platform.jsx";
import ActivityLog from "./pages/ActivityLog.jsx";
import NotificationCenter from "./pages/NotificationCenter.jsx";

import ConsumptionCalculator from "./pages/ConsumptionCalculator.jsx";
import RTSPs from "./pages/RTSPs.jsx";

import Login from "./pages/Login.jsx"; // ⭐ RENAMED IMPORT TO LOGIN.JSX
import Profile from "./pages/Profile.jsx";
import RequireAuth from "./components/auth/RequireAuth.jsx";


export default function App() {
  return (
    <Routes>
      
      {/* 1. PUBLIC ROUTE (Initial Load) */}
      {/* The root path "/" should now point directly to the Login page */}
      <Route path="/" element={<Login />} />
      
      {/* 2. PROTECTED ROUTES: Wrapped by MainLayout (e.g., accessed after login) */}
      {/* All routes under /app require authentication */}
      <Route 
        path="/app" 
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        {/* Default authenticated route redirects to the starting dashboard page */}
        <Route index element={<Navigate to="my-cameras" replace />} />
        
        {/* User-facing features (e.g., /app/my-cameras) */}
        <Route path="my-cameras" element={<MyCameras />} />
        <Route path="my-patrols" element={<MyPatrols />} />
        <Route path="my-mosaics" element={<MyMosaics />} />
        <Route path="my-alarms" element={<MyAlarms />} />
        <Route path="my-videos" element={<MyVideos />} />
        <Route path="smart-mosaic" element={<SmartMosaics />} />

        {/* Administration/Register features */}
        <Route path="cameras" element={<Cameras />} />
        <Route path="cameras/register" element={<CamerasRegister />} />
        <Route path="cameras/view/:id" element={<CameraView />} />
        <Route path="alarms" element={<Alarms />} />
        <Route path="alarms/register" element={<AlarmsRegister />} />
        <Route path="groups" element={<Groups />} />
        <Route path="groups/register" element={<GroupsRegister />} />
        <Route path="users" element={<Users />} />
        <Route path="users/register" element={<UsersRegister />} />
        <Route path="permissions" element={<Permissions />} />
        <Route path="permissions/register" element={<PermissionsRegister />} />
        <Route path="mosaics" element={<Mosaics />} />
        <Route path="mosaics/register" element={<MosaicsRegister />} /> 
        <Route path="patrols" element={<Patrols />} />
        <Route path="patrols/register" element={<PatrolsRegister />} />
        
        {/* Settings/Info features */}
        <Route path="access" element={<Access />} />
        <Route path="reports" element={<Reports />} />
        <Route path="platform" element={<Platform />} />
        <Route path="activity-log" element={<ActivityLog />} />
        <Route path="notification-center" element={<NotificationCenter />} />
        <Route path="consumption" element={<ConsumptionCalculator />} />
        <Route path="rtsps" element={<RTSPs />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* 3. FALLBACK: Redirect any unknown URL to the Login page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}