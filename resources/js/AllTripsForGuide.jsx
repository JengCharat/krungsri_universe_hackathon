import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
export default function AllTripsForGuide() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTrips() {
      try {
        // ดึงข้อมูลทริปที่ต้องการไกด์หรือคนขับรถเท่านั้น
        const res = await axios.get('/api/trips/guide');
                setTrips(res.data);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("ไม่สามารถโหลดข้อมูลทริปได้");
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
      await axios.post(
        `/api/trips/${tripId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${window.userToken}`,
          },
        }
      );
      alert("เข้าร่วมทริปสำเร็จ!");
    } catch (err) {
      console.error("Error joining trip:", err);
      setError(err.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setJoining(null);
    }
  };

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>ทริปที่ต้องการไกด์หรือคนขับรถ</h2>
      {trips.length === 0 ? (
        <p>ไม่มีทริปที่ต้องการไกด์หรือคนขับรถในระบบ</p>
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
              <p>
                <strong>ต้องการไกด์:</strong> {trip.needs_guide ? "ใช่" : "ไม่ใช่"}
              </p>
              <p>
                <strong>ต้องการคนขับรถ:</strong> {trip.needs_driver ? "ใช่" : "ไม่ใช่"}
              </p>

              <button
                onClick={() => navigate(`/trip/${trip.id}`)}
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


const container = document.getElementById("all_trip_for_guide");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/all_trip_for_guide" element={<AllTripsForGuide />} />
      {/* <Route path="/trip/:tripId" element={<TripDetail />} /> */}
    </Routes>
  </BrowserRouter>
);
