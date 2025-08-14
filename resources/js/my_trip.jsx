// resources/js/MyTrips.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  axios.defaults.headers.common["Authorization"] = `Bearer ${window.userToken}`;

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get("/api/my-trips");
        setTrips(res.data);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError(err.response?.data?.message || "ไม่สามารถโหลดข้อมูลทริปของคุณได้");
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

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

  if (loading) return <p style={{ padding: 20, fontSize: 18 }}>กำลังโหลดข้อมูล...</p>;
  if (error) return <p style={{ color: "red", padding: 20, fontSize: 18 }}>{error}</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "420px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "26px", marginBottom: "20px", textAlign: "center" }}>ทริปของฉัน</h2>
      {trips.length === 0 ? (
        <p style={{ fontSize: 18, textAlign: "center" }}>คุณยังไม่ได้สร้างหรือเข้าร่วมทริปใดๆ</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {trips.map((trip) => (
            <div
              key={trip.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                background: "#fff",
              }}
            >
              <h3 style={{ fontSize: "22px", marginBottom: "12px" }}>{trip.name}</h3>
              <p style={{ fontSize: 16 }}><strong>วันที่เริ่ม:</strong> {trip.start_date || "-"}</p>
              <p style={{ fontSize: 16 }}><strong>เงื่อนไข:</strong> {trip.conditions || "-"}</p>
              <p style={{ fontSize: 16 }}><strong>จำนวนคนที่ต้องการ:</strong> {trip.max_people}</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
                <button
                  onClick={() => navigate(`/my-trips/${trip.id}`)}
                  style={{
                    padding: "16px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    borderRadius: "12px",
                    border: "none",
                    background: "linear-gradient(90deg, #007bff, #00c6ff)",
                    color: "#fff",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  ดูรายละเอียด
                </button>

                <button
                  onClick={() => handleJoinTrip(trip.id)}
                  disabled={joining === trip.id}
                  style={{
                    padding: "16px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    borderRadius: "12px",
                    border: "none",
                    background: "#28a745",
                    color: "#fff",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {joining === trip.id ? "กำลังเข้าร่วม..." : "เข้าร่วมทริป"}
                </button>

                <button
                  onClick={() => handleEndTrip(trip.id)}
                  style={{
                    padding: "16px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    borderRadius: "12px",
                    border: "none",
                    background: "#e74c3c",
                    color: "#fff",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  ยืนยันจบทริป
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
