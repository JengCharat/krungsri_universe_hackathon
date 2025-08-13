// resources/js/my_trip.jsxmytr
import React, { useEffect, useState } from "react";
import axios from "axios";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import MyTripDetail from "./components/MyTripDetail";

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ตั้งค่า Authorization header สำหรับทุก request
  axios.defaults.headers.common["Authorization"] = `Bearer ${window.userToken}`;

  // โหลดข้อมูลทริป
  useEffect(() => {
    async function fetchTrips() {
      try {
        const res = await axios.get("/api/my-trips");
        setTrips(res.data);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError(err.response?.data?.message || "ไม่สามารถโหลดข้อมูลทริปของคุณได้");
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  // เข้าร่วมทริป
  const handleJoinTrip = async (tripId) => {
    setJoining(tripId);
    setError(null);
    try {
      await axios.post(`/api/trips/${tripId}/join`);
      alert("เข้าร่วมทริปสำเร็จ!");
      const res = await axios.get("/api/my-trips");
      setTrips(res.data);
    } catch (err) {
      console.error("Error joining trip:", err);
      setError(err.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setJoining(null);
    }
  };

  // ยืนยันจบทริป
        // ยืนยันจบทริป
        const handleEndTrip = async (tripId) => {
          if (!window.confirm("ยืนยันการจบทริปนี้หรือไม่?")) return;
          try {
            const res = await axios.post(`/api/trips/${tripId}/confirm-end`);
            alert(res.data?.message || "คุณได้ยืนยันจบทริปแล้ว");
            const tripsRes = await axios.get("/api/my-trips");
            setTrips(tripsRes.data);
          } catch (err) {
            console.error("Error confirming end:", err);
            alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
          }
        };

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>ทริปของฉัน</h2>
      {trips.length === 0 ? (
        <p>คุณยังไม่ได้สร้างหรือเข้าร่วมทริปใดๆ</p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {trips.map((trip) => (
            <div
              key={trip.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "15px",
              }}
            >
              <h3>{trip.name}</h3>
              <p><strong>วันที่เริ่ม:</strong> {trip.start_date || "-"}</p>
              <p><strong>เงื่อนไข:</strong> {trip.conditions || "-"}</p>
              <p><strong>จำนวนคนที่ต้องการ:</strong> {trip.max_people}</p>

              <button
                onClick={() => navigate(`/my-trips/${trip.id}`)}
                style={{ marginRight: "10px" }}
              >
                ดูรายละเอียด
              </button>

              <button
                onClick={() => handleJoinTrip(trip.id)}
                disabled={joining === trip.id}
                style={{ marginRight: "10px" }}
              >
                {joining === trip.id ? "กำลังเข้าร่วม..." : "เข้าร่วมทริป"}
              </button>

              <button
                onClick={() => handleEndTrip(trip.id)}
                style={{ backgroundColor: "#e74c3c", color: "white" }}
              >
                ยืนยันจบทริป
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Render พร้อม Router
const container = document.getElementById("my_trips");
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/my-trips" element={<MyTrips />} />
      <Route path="/my-trips/:tripId" element={<MyTripDetail />} />
    </Routes>
  </BrowserRouter>
);
