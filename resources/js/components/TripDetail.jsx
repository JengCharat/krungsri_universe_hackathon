// TripDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function TripDetail() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);

  // ดึงข้อมูล trip รายละเอียด
  useEffect(() => {
    async function fetchTrip() {
      try {
        const res = await axios.get(`/api/trips/${tripId}`, {
          headers: {
            Authorization: `Bearer ${window.userToken}`,
          },
        });
        setTrip(res.data);
      } catch (err) {
        console.error("Error fetching trip:", err);
        setError("ไม่สามารถโหลดข้อมูลทริปได้");
      } finally {
        setLoading(false);
      }
    }
    fetchTrip();
  }, [tripId]);

  const handleJoinTrip = async () => {
    setJoining(true);
    setError(null);
    try {
      await axios.post(
        `/api/trips/${tripId}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${window.userToken}` },
        }
      );
      alert("เข้าร่วมทริปสำเร็จ!");
    } catch (err) {
      console.error("Error joining trip:", err);
      setError(err.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!trip) return <p>ไม่พบข้อมูลทริป</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{trip.name}</h2>
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
        <strong>สถานที่ท่องเที่ยว:</strong>
      </p>
      <ul>
        {trip.tourist_attractions?.map((attraction) => (
          <li key={attraction.id}>
            <h1>descriptions: {attraction.description}</h1>
            <h1>openat {attraction.open_time}</h1>
          </li>
        ))}
      </ul>

      <button onClick={() => navigate(-1)} style={{ marginRight: "10px" }}>
        กลับ
      </button>
      <button onClick={handleJoinTrip} disabled={joining}>
        {joining ? "กำลังเข้าร่วม..." : "Join Trip"}
      </button>
    </div>
  );
}
