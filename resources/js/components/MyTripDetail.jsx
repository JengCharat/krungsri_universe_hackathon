// MyTripDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyTripDetail() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ตั้งค่า Authorization header
  axios.defaults.headers.common["Authorization"] = `Bearer ${window.userToken}`;

  // โหลดข้อมูลทริป
  useEffect(() => {
    async function fetchTrip() {
      try {
        const res = await axios.get(`/api/my-trips/${tripId}`);
        const data = res.data;

        // แปลง trip_guides → tripGuides
        if (data.trip_guides) {
          data.tripGuides = data.trip_guides;
          delete data.trip_guides;
        }

        setTrip(data);
      } catch (err) {
        console.error("Error fetching trip:", err);
        setError(err.response?.data?.message || "ไม่สามารถโหลดข้อมูลทริปได้");
      } finally {
        setLoading(false);
      }
    }
    fetchTrip();
  }, [tripId]);

  // เลือกไกด์
  async function chooseGuide(guideId) {
    if (!window.confirm("ยืนยันการเลือกไกด์คนนี้?")) return;

    try {
      await axios.post(`/api/my-trips/${tripId}/choose-guide/${guideId}`);
      alert("เลือกไกด์เรียบร้อย");
      // โหลดข้อมูลใหม่หลังเลือกไกด์
      const res = await axios.get(`/api/my-trips/${tripId}`);
      const data = res.data;
      if (data.trip_guides) {
        data.tripGuides = data.trip_guides;
        delete data.trip_guides;
      }
      setTrip(data);
    } catch (err) {
      alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  }

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
        {trip.touristAttractions?.map((attraction) => (
          <li key={attraction.id}>
            <div>คำอธิบาย: {attraction.description || "-"}</div>
            <div>เวลาเปิด: {attraction.open_time || "-"}</div>
          </li>
        ))}
      </ul>

      <h3>รายการไกด์ที่เสนอราคา</h3>
      {trip.tripGuides && trip.tripGuides.length > 0 ? (
        <table
          border="1"
          cellPadding="5"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>ชื่อไกด์</th>
              <th>อีเมล</th>
              <th>ราคาเสนอ (บาท)</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {trip.tripGuides.map(({ id, guide, price, status, guide_id }) => (
              <tr key={id}>
                <td>{guide?.name || "-"}</td>
                <td>{guide?.email || "-"}</td>
                <td>{price}</td>
                <td>{status}</td>
                <td>
                  {status !== "accepted" ? (
                    <button onClick={() => chooseGuide(guide_id)}>
                      เลือกไกด์คนนี้
                    </button>
                  ) : (
                    <span style={{ color: "green" }}>✅ เลือกแล้ว</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>ยังไม่มีไกด์เสนอราคา</p>
      )}

      <button onClick={() => navigate(-1)} style={{ marginTop: "20px" }}>
        กลับ
      </button>
    </div>
  );
}
