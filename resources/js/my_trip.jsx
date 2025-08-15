// resources/js/MyTrips.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("ongoing"); // "ongoing" หรือ "ended"
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

  if (loading)
    return <p style={{ padding: 20, fontSize: 28, textAlign: "center" }}>กำลังโหลดข้อมูล...</p>;
  if (error)
    return <p style={{ color: "red", padding: 20, fontSize: 28, textAlign: "center" }}>{error}</p>;

  // แยกทริปตาม status
  const filteredTrips = trips.filter(trip => trip.status === tab);

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2 style={{ fontSize: "48px", marginBottom: "30px", textAlign: "center" }}>ทริปของฉัน</h2>

      {/* Tab เลือกสถานะ */}
      <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginBottom: "30px" }}>
        <button
          onClick={() => setTab("ongoing")}
          style={{
            padding: "10px 20px",
            fontSize: 24,
            fontWeight: tab === "ongoing" ? "bold" : "normal",
            background: tab === "ongoing" ? "#007bff" : "#ccc",
            color: "#fff",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          ยังไม่จบ
        </button>
        <button
          onClick={() => setTab("ended")}
          style={{
            padding: "10px 20px",
            fontSize: 24,
            fontWeight: tab === "ended" ? "bold" : "normal",
            background: tab === "ended" ? "#28a745" : "#ccc",
            color: "#fff",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          จบแล้ว
        </button>
      </div>

      {filteredTrips.length === 0 ? (
        <p style={{ fontSize: 32, textAlign: "center" }}>ไม่มีทริปสำหรับสถานะนี้</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "30px", width: "100%", alignItems: "center" }}>
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "20px",
                padding: "30px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                background: "#fff",
                width: "95vw",
                maxWidth: "800px",
                textAlign: "center",
              }}
            >
              <h3 style={{ fontSize: "40px", marginBottom: "20px" }}>{trip.name}</h3>
              <p style={{ fontSize: 32, margin: "10px 0" }}><strong>วันที่เริ่ม:</strong> {trip.start_date || "-"}</p>
              <p style={{ fontSize: 32, margin: "10px 0" }}><strong>เงื่อนไข:</strong> {trip.conditions || "-"}</p>
              <p style={{ fontSize: 32, margin: "10px 0" }}><strong>จำนวนคนที่ต้องการ:</strong> {trip.max_people}</p>

              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                marginTop: "25px",
                flexWrap: "wrap"
              }}>
                <button
                  onClick={() => navigate(`/my-trips/${trip.id}`)}
                  style={{
                    padding: "20px 30px",
                    fontSize: "28px",
                    fontWeight: "bold",
                    borderRadius: "16px",
                    border: "none",
                    background: "linear-gradient(90deg, #007bff, #00c6ff)",
                    color: "#fff",
                    cursor: "pointer",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  ดูรายละเอียด
                </button>

                {tab === "ongoing" && (
                  <>
                    <button
                      onClick={() => handleJoinTrip(trip.id)}
                      disabled={joining === trip.id}
                      style={{
                        padding: "20px 30px",
                        fontSize: "28px",
                        fontWeight: "bold",
                        borderRadius: "16px",
                        border: "none",
                        background: "#28a745",
                        color: "#fff",
                        cursor: "pointer",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
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
                        padding: "20px 30px",
                        fontSize: "28px",
                        fontWeight: "bold",
                        borderRadius: "16px",
                        border: "none",
                        background: "#e74c3c",
                        color: "#fff",
                        cursor: "pointer",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                        transition: "transform 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      ยืนยันจบทริป
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
