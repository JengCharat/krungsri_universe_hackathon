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
        const res = await axios.get(`/api/trips/${tripId}`, {
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

  const isOwner = trip.created_by === window.userId;

  return (
    <div className="flex flex-col h-screen w-screen bg-white text-slate-900 px-4 md:px-12 mt-12">
      {/* Header */}
      <div className="w-full h-[300px] bg-white flex flex-col justify-center px-6 md:px-12 py-5 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full bg-indigo-100/30 blur-2xl"></div>
        <div className="pointer-events-none absolute -bottom-12 -left-10 w-32 h-32 rounded-full bg-emerald-100/30 blur-2xl"></div>

        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-4 text-blue-800 bg-blue-200 px-5 py-3 rounded-full text-lg font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
            </svg>
            รายละเอียด
          </div>
        </div>

        <h1 className="text-6xl font-extrabold text-slate-900 mb-4 mt-5">รายละเอียดทริป</h1>
        <p className="text-2xl text-slate-700 mb-6">รายละเอียดเพิ่มเติมเกี่ยวกับทริปนี้</p>
      </div>

      {/* Card รายละเอียดทริป */}
      <div className="flex-1 overflow-auto flex flex-col items-center gap-8 w-full max-w-5xl mx-auto py-4">
        <div className="w-full bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl p-8 md:p-10 shadow-lg flex flex-col space-y-8 text-2xl md:text-3xl items-start">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900">{trip.name}</h1>

          <div className="flex flex-col items-start space-y-6">
            <p><strong>วันที่เริ่ม:</strong> {trip.start_date || "-"}</p>
            <p><strong>เงื่อนไข:</strong> {trip.conditions || "-"}</p>
            <p><strong>จำนวนคนที่ต้องการ:</strong> {trip.max_people}</p>
          </div>

          {/* สถานที่ท่องเที่ยว */}
          <div className="flex flex-col items-start w-full">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">สถานที่ท่องเที่ยว</h3>
            {trip.tourist_attractions && trip.tourist_attractions.length > 0 ? (
              <ul className="flex flex-col items-start gap-6 w-full">
                {trip.tourist_attractions.map((attraction) => (
                  <li key={attraction.id} className="p-6 md:p-8 bg-gray-100 rounded-3xl shadow-md w-full text-left text-2xl md:text-3xl">
                    <p><strong>คำอธิบาย:</strong> {attraction.description || "-"}</p>
                    <p><strong>เวลาเปิด:</strong> {attraction.open_time || "-"}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-left text-2xl md:text-3xl">ยังไม่มีข้อมูลสถานที่ท่องเที่ยว</p>
            )}
          </div>

          {/* รายการไกด์ (เฉพาะเจ้าของทริป) */}
          {isOwner && (
            <div className="w-full flex flex-col items-center">
              <h3 className="text-4xl md:text-4xl font-bold mb-6 mt-12">รายการไกด์ที่เสนอราคา</h3>
              {trip.trip_guides && trip.trip_guides.length > 0 ? (
                <table className="border-collapse border border-gray-300 text-left w-full md:max-w-5xl text-2xl md:text-3xl">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="p-4">ชื่อไกด์</th>
                      <th className="p-4">อีเมล</th>
                      <th className="p-4">ราคาเสนอ (บาท)</th>
                      <th className="p-4">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trip.trip_guides.map(({ id, guide, price, status }) => (
                      <tr key={id} className="border-b border-gray-300">
                        <td className="p-4">{guide?.name || "-"}</td>
                        <td className="p-4">{guide?.email || "-"}</td>
                        <td className="p-4">{price}</td>
                        <td className="p-4">{status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-left text-2xl md:text-3xl">ยังไม่มีไกด์เสนอราคา</p>
              )}
            </div>
          )}
        </div>

        {/* ปุ่มกลับ */}
        <button
          onClick={() => navigate(-1)}
          className=" px-10 py-6 md:px-12 md:py-7 text-white rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-400 font-extrabold shadow-xl transform transition-transform hover:scale-110 hover:shadow-2xl text-2xl md:text-3xl mt-6"
        >
          กลับ
        </button>
      </div>
    </div>
  );
}
