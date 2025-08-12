// MyTrips.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import MyTripDetail from "./components/MyTripDetail";
export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ตั้งค่า Authorization header สำหรับทุก request (ถ้าต้องการ)
  axios.defaults.headers.common['Authorization'] = `Bearer ${window.userToken}`;

  useEffect(() => {
    async function fetchTrips() {
      try {
        const res = await axios.get("/api/my-trips");
        setTrips(res.data);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError(
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "ไม่สามารถโหลดข้อมูลทริปของคุณได้"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  const handleJoinTrip = async (tripId) => {
    setJoining(tripId);
    setError(null);
    try {
      await axios.post(`/api/trips/${tripId}/join`, {});
      alert("เข้าร่วมทริปสำเร็จ!");
    } catch (err) {
      console.error("Error joining trip:", err);
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "เกิดข้อผิดพลาด"
      );
    } finally {
      setJoining(null);
    }
  };

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>ทริปที่ฉันสร้าง</h2>
      {trips.length === 0 ? (
        <p>คุณยังไม่ได้สร้างทริปใดๆ</p>
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
              <p>
                <strong>วันที่เริ่ม:</strong> {trip.start_date || "ไม่ระบุ"}
              </p>
              <p>
                <strong>เงื่อนไข:</strong> {trip.conditions || "-"}
              </p>
              <p>
                <strong>จำนวนคนที่ต้องการ:</strong> {trip.max_people}
              </p>

              <button
                onClick={() => navigate(`/my-trips/${trip.id}`)}
                style={{ marginRight: "10px" }}
              >
                ดูรายละเอียด
              </button>
              <button
                onClick={() => handleJoinTrip(trip.id)}
                disabled={joining === trip.id}
              >
                {joining === trip.id ? "กำลังเข้าร่วม..." : "Join Trip"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
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
