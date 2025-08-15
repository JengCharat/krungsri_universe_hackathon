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

  const scale = 1.45; // ขยายฟอนต์ 45%

  useEffect(() => {
    async function fetchTrip() {
      try {
        const res = await axios.get(`/api/my-trips/${tripId}`, {
          headers: { Authorization: `Bearer ${window.userToken}` },
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

  if (loading)
    return (
      <p className="text-center" style={{ fontSize: `${20 * scale}px` }}>
        กำลังโหลดข้อมูล...
      </p>
    );
  if (error)
    return (
      <p
        className="text-center text-red-600"
        style={{ fontSize: `${20 * scale}px` }}
      >
        {error}
      </p>
    );
  if (!trip)
    return (
      <p className="text-center" style={{ fontSize: `${20 * scale}px` }}>
        ไม่พบข้อมูลทริป
      </p>
    );

  return (
    <div className="flex flex-col items-center p-8 space-y-6 max-w-3xl mx-auto bg-white rounded-3xl shadow-lg">
      <h2 className="font-extrabold text-center" style={{ fontSize: `${32 * scale}px` }}>
        {trip.name}
      </h2>

      <div className="flex flex-col items-center space-y-2 text-center">
        <p style={{ fontSize: `${24 * scale}px` }}>
          <strong>วันที่เริ่ม:</strong> {trip.start_date || "ไม่ระบุ"}
        </p>
        <p style={{ fontSize: `${24 * scale}px` }}>
          <strong>เงื่อนไข:</strong> {trip.conditions || "-"}
        </p>
        <p style={{ fontSize: `${24 * scale}px` }}>
          <strong>จำนวนคนที่ต้องการ:</strong> {trip.max_people}
        </p>
      </div>

      <div className="w-full">
        <h3 className="text-center font-semibold mb-2" style={{ fontSize: `${26 * scale}px` }}>
          สถานที่ท่องเที่ยว
        </h3>
        {trip.tourist_attractions?.length > 0 ? (
          <ul className="space-y-3">
            {trip.tourist_attractions.map((attraction) => (
              <li
                key={attraction.id}
                className="bg-gray-100 rounded-2xl p-4 shadow text-center"
                style={{ fontSize: `${22 * scale}px` }}
              >
                <p><strong>คำอธิบาย:</strong> {attraction.description || "-"}</p>
                <p><strong>เวลาเปิด:</strong> {attraction.open_time || "-"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center" style={{ fontSize: `${22 * scale}px` }}>ยังไม่มีข้อมูลสถานที่ท่องเที่ยว</p>
        )}
      </div>

      <div className="w-full">
        <h3 className="text-center font-semibold mb-2" style={{ fontSize: `${26 * scale}px` }}>
          รายการไกด์ที่เสนอราคา
        </h3>
        {trip.trip_guides && trip.trip_guides.length > 0 ? (
          <table className="w-full text-center border-collapse border border-gray-300" style={{ fontSize: `${22 * scale}px` }}>
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-2">ชื่อไกด์</th>
                <th className="p-2">อีเมล</th>
                <th className="p-2">ราคาเสนอ (บาท)</th>
                <th className="p-2">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {trip.trip_guides.map(({ id, guide, price, status }) => (
                <tr key={id} className="border-b border-gray-300">
                  <td className="p-2">{guide?.name || "-"}</td>
                  <td className="p-2">{guide?.email || "-"}</td>
                  <td className="p-2">{price}</td>
                  <td className="p-2">{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center" style={{ fontSize: `${22 * scale}px` }}>ยังไม่มีไกด์เสนอราคา</p>
        )}
      </div>

      <button
        onClick={() => navigate(-1)}
        className="px-8 py-4 bg-blue-500 text-white rounded-3xl font-bold shadow-lg hover:bg-blue-600 transition transform hover:scale-105"
        style={{ fontSize: `${22 * scale}px` }}
      >
        กลับ
      </button>
    </div>
  );
}
