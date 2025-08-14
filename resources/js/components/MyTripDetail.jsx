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

  if (loading)
    return <p className="p-5 text-lg text-center">กำลังโหลดข้อมูล...</p>;
  if (error)
    return <p className="p-5 text-lg text-red-600 text-center">{error}</p>;
  if (!trip)
    return <p className="p-5 text-lg text-center">ไม่พบข้อมูลทริป</p>;

  const selectedGuide = trip.tripGuides?.find((g) => g.status === "selected");
  const guidesToShow = selectedGuide ? [selectedGuide] : trip.tripGuides || [];

  return (
    <div className="max-w-md mx-auto p-5 font-sans space-y-6">
      <h2 className="text-2xl font-bold text-center">{trip.name}</h2>

      <div className="text-lg space-y-1">
        <p><strong>วันที่เริ่ม:</strong> {trip.start_date || "ไม่ระบุ"}</p>
        <p><strong>เงื่อนไข:</strong> {trip.conditions || "-"}</p>
        <p><strong>จำนวนคนที่ต้องการ:</strong> {trip.max_people}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">สถานที่ท่องเที่ยว</h3>
        {trip.touristAttractions && trip.touristAttractions.length > 0 ? (
          <ul className="space-y-3">
            {trip.touristAttractions.map((attraction) => (
              <li key={attraction.id} className="p-3 bg-gray-100 rounded-lg shadow-sm">
                <p><strong>คำอธิบาย:</strong> {attraction.description || "-"}</p>
                <p><strong>เวลาเปิด:</strong> {attraction.open_time || "-"}</p>
                {attraction.address && <p><strong>ที่อยู่:</strong> {attraction.address}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p>ยังไม่มีข้อมูลสถานที่ท่องเที่ยว</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">รายการไกด์ที่เสนอราคา</h3>
        {guidesToShow.length > 0 ? (
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-2 text-left">ชื่อไกด์</th>
                <th className="p-2 text-left">อีเมล</th>
                <th className="p-2 text-left">ราคาเสนอ (บาท)</th>
                <th className="p-2 text-left">สถานะ</th>
                <th className="p-2 text-left">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {guidesToShow.map(({ id, guide, price, status, guide_id }) => (
                <tr key={id} className="border-b border-gray-300">
                  <td className="p-2">{guide?.name || "-"}</td>
                  <td className="p-2">{guide?.email || "-"}</td>
                  <td className="p-2">{price}</td>
                  <td className="p-2">{status}</td>
                  <td className="p-2">
                    {status === "selected" ? (
                      <span className="text-green-600 font-bold">✅ ไกด์ที่ถูกเลือก</span>
                    ) : (
                      <button
                        onClick={() => chooseGuide(guide_id)}
                        className="px-4 py-2 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 transition"
                      >
                        เลือกไกด์คนนี้
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>ยังไม่มีไกด์เสนอราคา</p>
        )}
      </div>

      <button
        onClick={() => navigate(-1)}
        className="w-full max-w-xs mx-auto block px-6 py-4 text-lg font-bold text-white rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
      >
        กลับ
      </button>
    </div>
  );
}
