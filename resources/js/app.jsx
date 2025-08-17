// App.jsx
import '../css/app.css';
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

import TouristAttractionMap from "./map_page";
import TouristDetail from "./TouristDetail";
import UploadTouristAttractionForm from "./components/Upload_place_form_component";
import AllTrips from "./all_trip";
import TripDetail from "./components/TripDetail";
import MyTrips from "./my_trip";
import MyTripDetail from "./components/MyTripDetail";
import { AllChatGroups, ChatPage } from './all_chat'; // import ทั้งสองหน้า
import { FaMapMarkedAlt, FaBus, FaSuitcaseRolling, FaComments, FaUpload, FaUser } from 'react-icons/fa';
import AllTripsForGuide from './AllTripsForGuide';
import ProfilePage from './components/profile_page';
// ---------- Error Boundary ----------
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: "red" }}>
          Something went wrong: {this.state.error?.message}
        </div>
      );
    }
    return this.props.children;
  }
}
function BottomNav() {
  const location = useLocation();
  const navItems = [
    { path: "/test", label: "Map", icon: <FaMapMarkedAlt /> },
    { path: "/all_trip", label: "All Trips", icon: <FaBus /> },
    { path: "/my-trips", label: "My Trips", icon: <FaSuitcaseRolling /> },
    { path: "/all_chat", label: "Chat", icon: <FaComments /> },
    { path: "/upload", label: "Upload", icon: <FaUpload /> },
    { path: "/profile", label: "Profile", icon: <FaUser /> },
  ];

  const containerStyle = {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: "160px",
     backgroundColor: "#fecb00",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 1000,
    paddingBottom: "env(safe-area-inset-bottom)",
    boxShadow: "0 -6px 24px rgba(0,0,0,0.08)",
  };

  const linkBaseStyle = {
    textDecoration: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    padding: "8px 10px",
    borderRadius: "12px",
    transition: "all 160ms ease",
    fontWeight: 600,
  };

  const iconStyle = { fontSize: "60px", lineHeight: 1 };
  const labelStyle = { fontSize: "25px", letterSpacing: "0.2px" };

  return (
    <div style={containerStyle}>
      {navItems.map((item) => {
        const active =
          location.pathname === item.path ||
          location.pathname.startsWith(item.path + "/");
        const color = active ? "#7f4534ff" : "#6b7280";
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...linkBaseStyle,
              color,
              background: active ? "rgba(37,99,235,0.08)" : "transparent",
            }}
          >
            <span style={iconStyle}>{item.icon}</span>
            <span style={labelStyle}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}


// ---------- Main App ----------
function App() {
  return (
    <Router>
      <div style={{ paddingBottom: "160px" }}> {/* ปรับให้เท่ากับความสูง BottomNav */}
        <Routes>
          <Route path="/test" element={<TouristAttractionMap />} />
          <Route path="/attraction/:id" element={<TouristDetail />} />
        <Route
            path="/all_trip"
            element={userRole === "guide" ? <AllTripsForGuide /> : <AllTrips />}
          />
          <Route path="/trip/:tripId" element={<TripDetail />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/my-trips/:tripId" element={<MyTripDetail />} />
          <Route path="/all_chat" element={<AllChatGroups userToken={window.userToken} />} />
          <Route path="/chat-group/:id" element={<ChatPage userToken={window.userToken} />} />
          <Route path="/upload" element={<UploadTouristAttractionForm />} />
            <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
      <BottomNav />
    </Router>
  );
}

// ---------- Render with ErrorBoundary ----------
const container = document.getElementById("app");
const root = createRoot(container);
root.render(
  <ErrorBoundary>
    <App chatGroupId={window.chatGroupId} userToken={window.userToken} userRole={window.userRole} />

  </ErrorBoundary>
);
