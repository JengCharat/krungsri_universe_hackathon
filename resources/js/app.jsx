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

// ---------- Bottom Navigation ----------
function BottomNav() {
  const location = useLocation();
  const navItems = [
    { path: "/test", label: "Map", icon: "🗺️" },
    { path: "/all_trip", label: "All Trips", icon: "🚌" },
    { path: "/my-trips", label: "My Trips", icon: "🧳" },
    { path: "/upload", label: "Upload", icon: "📤" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "60px",
        background: "#fff",
        borderTop: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            textDecoration: "none",
            color: location.pathname.startsWith(item.path) ? "#007bff" : "#555",
            fontSize: "14px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "20px" }}>{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </div>
  );
}

// ---------- Main App ----------
function App() {
  return (
    <Router>
      <div style={{ paddingBottom: "60px" }}>
        <Routes>
          <Route path="/test" element={<TouristAttractionMap />} />
          <Route path="/attraction/:id" element={<TouristDetail />} />
          <Route path="/all_trip" element={<AllTrips />} />
          <Route path="/trip/:tripId" element={<TripDetail />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/my-trips/:tripId" element={<MyTripDetail />} />
          <Route path="/upload" element={<UploadTouristAttractionForm />} />
          <Route path="/profile" element={<div style={{ padding: 20 }}>Profile Page</div>} />
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
    <App chatGroupId={window.chatGroupId} userToken={window.userToken} />
  </ErrorBoundary>
);


// import { createRoot } from 'react-dom/client';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
//
// function App({ chatGroupId, userToken }) {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//
//   // ฟังก์ชันดึงข้อความ
//   const fetchMessages = async () => {
//     try {
//       const res = await axios.get(
//         `/api/chat-groups/${chatGroupId}/messages`,
//         { headers: { Authorization: `Bearer ${userToken}` } }
//       );
//       setMessages(res.data);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     }
//   };
//
//   // เรียกทุก 3 วินาที
//   useEffect(() => {
//     fetchMessages(); // โหลดครั้งแรก
//     const interval = setInterval(fetchMessages, 3000);
//     return () => clearInterval(interval);
//   }, [chatGroupId, userToken]);
//
//   // ส่งข้อความ
//   const sendMessage = async () => {
//     if (!text.trim()) return;
//     try {
//       await axios.post(
//         `/api/chat-groups/${chatGroupId}/messages`,
//         { message: text },
//         { headers: { Authorization: `Bearer ${userToken}` } }
//       );
//       setText("");
//       fetchMessages(); // โหลดใหม่หลังส่ง
//     } catch (err) {
//       console.error("Send error:", err);
//     }
//   };
//
//   return (
//     <div>
//       <div style={{ height: 300, overflowY: "scroll", border: "1px solid #ccc" }}>
//         {messages.map(msg => (
//           <div key={msg.id}>
//             <strong>{msg.user?.name}</strong>: {msg.message}
//           </div>
//         ))}
//       </div>
//
//       <input
//         value={text}
//         onChange={e => setText(e.target.value)}
//         placeholder="Type a message"
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// }
//
// // รับค่าจาก Blade ผ่าน window
// const container = document.getElementById("app");
// const root = createRoot(container);
// root.render(
//   <App chatGroupId={window.chatGroupId} userToken={window.userToken} />
// );






// import { createRoot } from 'react-dom/client';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
//
// function App({ chatGroupId, userToken }) {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//
//   // ฟังก์ชันดึงข้อความ
//   const fetchMessages = async () => {
//     try {
//       const res = await axios.get(
//         `/api/chat-groups/${chatGroupId}/messages`,
//         { headers: { Authorization: `Bearer ${userToken}` } }
//       );
//       setMessages(res.data);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     }
//   };
//
//   // เรียกทุก 3 วินาที
//   useEffect(() => {
//     fetchMessages(); // โหลดครั้งแรก
//     const interval = setInterval(fetchMessages, 3000);
//     return () => clearInterval(interval);
//   }, [chatGroupId, userToken]);
//
//   // ส่งข้อความ
//   const sendMessage = async () => {
//     if (!text.trim()) return;
//     try {
//       await axios.post(
//         `/api/chat-groups/${chatGroupId}/messages`,
//         { message: text },
//         { headers: { Authorization: `Bearer ${userToken}` } }
//       );
//       setText("");
//       fetchMessages(); // โหลดใหม่หลังส่ง
//     } catch (err) {
//       console.error("Send error:", err);
//     }
//   };
//
//   return (
//     <div>
//       <div style={{ height: 300, overflowY: "scroll", border: "1px solid #ccc" }}>
//         {messages.map(msg => (
//           <div key={msg.id}>
//             <strong>{msg.user?.name}</strong>: {msg.message}
//           </div>
//         ))}
//       </div>
//
//       <input
//         value={text}
//         onChange={e => setText(e.target.value)}
//         placeholder="Type a message"
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// }
//
// // รับค่าจาก Blade ผ่าน window
// const container = document.getElementById("app");
// const root = createRoot(container);
// root.render(
//   <App chatGroupId={window.chatGroupId} userToken={window.userToken} />
// );
