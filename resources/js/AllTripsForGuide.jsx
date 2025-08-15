import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AllTripsForGuide() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTrips() {
      try {
        const res = await axios.get("/api/trips/guide", {
          headers: { Authorization: `Bearer ${window.userToken}` },
        });
        setTrips(res.data);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("ไม่สามารถโหลดข้อมูลทริปได้ กรุณาลองใหม่อีกครั้ง");
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
        { headers: { Authorization: `Bearer ${window.userToken}` } }
      );
      alert("เข้าร่วมทริปสำเร็จ! คุณสามารถติดต่อผู้จัดทริปเพื่อยืนยันได้");
    } catch (err) {
      console.error("Error joining trip:", err);
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการเข้าร่วมทริป");
    } finally {
      setJoining(null);
    }
  };

  const handleOfferPrice = async (tripId) => {
    const priceStr = prompt("กรุณาใส่ราคาที่ต้องการเสนอ (บาท):");
    if (priceStr === null) return;
    const price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) {
      alert("กรุณาใส่ราคาที่ถูกต้อง (ตัวเลขมากกว่า 0)");
      return;
    }

    setJoining(tripId);
    setError(null);

    try {
      await axios.post(
        `/api/trip-guides`,
        { trip_id: tripId, price },
        { headers: { Authorization: `Bearer ${window.userToken}` } }
      );
      alert("เสนอราคาเรียบร้อยแล้ว! กรุณารอการอนุมัติจากเจ้าของทริป");
    } catch (err) {
      console.error("Error offering price:", err);
      setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการเสนอราคา");
    } finally {
      setJoining(null);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>กำลังโหลดข้อมูล...</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📅 ทริปที่ต้องการไกด์หรือคนขับรถ</h2>
      {trips.length === 0 ? (
        <p>ไม่มีทริปที่ต้องการไกด์หรือคนขับรถในขณะนี้</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {trips.map((trip) => (
            <div
              key={trip.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3>{trip.name}</h3>
              <p>📆 วันที่เริ่ม: {trip.start_date || "ไม่ระบุ"}</p>
              <p>📝 เงื่อนไข: {trip.conditions || "-"}</p>
              <p>👥 จำนวนคนที่ต้องการ: {trip.max_people}</p>
              <p>🧭 ต้องการไกด์: {trip.needs_guide ? "ใช่" : "ไม่ใช่"}</p>
              <p>🚗 ต้องการคนขับรถ: {trip.needs_driver ? "ใช่" : "ไม่ใช่"}</p>

              <div style={{ marginTop: "15px" }}>
                <button onClick={() => navigate(`/trip/${trip.id}`)} style={{ marginRight: "10px" }}>
                  ดูรายละเอียด
                </button>
                <button
                  onClick={() => handleJoinTrip(trip.id)}
                  disabled={joining === trip.id}
                  style={{ marginRight: "10px" }}
                >
                  {joining === trip.id ? "⏳ กำลังเข้าร่วม..." : "เข้าร่วมทริป"}
                </button>
                <button onClick={() => handleOfferPrice(trip.id)} disabled={joining === trip.id}>
                  {joining === trip.id ? "💬 กำลังส่งราคา..." : "เสนอราคา"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
