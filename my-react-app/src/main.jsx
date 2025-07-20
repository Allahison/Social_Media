// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Context
import { UserProvider } from "./context/UserContext";

// Pages
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import VideosPage from "./pages/Videos/VideosPage";
import GamingPage from "./pages/Gaming/GamingPage";
import GroupsPage from "./pages/GroupsPage/GroupsPage";
import StorePage from "./pages/Marketplace/StorePage";
import UserProfilePage from "./pages/UserProfilePage";
import SetupProfilePage from './pages/SetupProfilePage';
import OtherUserProfilePage from './pages/OtherUserProfilePage';
import { FollowProvider } from './context/FollowContext';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <FollowProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/gaming" element={<GamingPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/profile/:id" element={<UserProfilePage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/setup-profile" element={<SetupProfilePage />} />
<Route path="/user/:id" element={<OtherUserProfilePage />} />

        </Routes>
        </FollowProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
