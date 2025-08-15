import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyTripDetail() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  axios.defaults.headers.common["Authorization"] = `Bearer ${window.userToken}`;

  useEffect(() => {
    async function fetchTrip() {
      try {
        const res = await axios.get(`/api/my-trips/${tripId}`);
        const data = res.data;

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

  async function chooseGuide(guideId) {
    if (!window.confirm("ยืนยันการเลือกไกด์คนนี้?")) return;

    try {
      await axios.post(`/api/my-trips/${tripId}/choose-guide/${guideId}`);
      alert("เลือกไกด์เรียบร้อย");
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
    return <p className="p-8 text-center text-4xl">กำลังโหลดข้อมูล...</p>;
  if (error)
    return <p className="p-8 text-center text-red-600 text-4xl">{error}</p>;
  if (!trip)
    return <p className="p-8 text-center text-4xl">ไม่พบข้อมูลทริป</p>;

  const selectedGuide = trip.tripGuides?.find((g) => g.status === "selected");
  const guidesToShow = selectedGuide ? [selectedGuide] : trip.tripGuides || [];

  const scale = 1.45;

  return (
    <div className="max-w-4xl mx-auto p-8 flex flex-col items-center space-y-8 text-center">
      <h2 className="font-extrabold" style={{ fontSize: `${32 * scale}px` }}>
        {trip.name}
      </h2>

      <div className="flex flex-col items-center space-y-4" style={{ fontSize: `${28 * scale}px` }}>
        <p><strong>วันที่เริ่ม:</strong> {trip.start_date || "ไม่ระบุ"}</p>
        <p><strong>เงื่อนไข:</strong> {trip.conditions || "-"}</p>
        <p><strong>จำนวนคนที่ต้องการ:</strong> {trip.max_people}</p>
      </div>

      <div className="w-full flex flex-col items-center">
        <h3 className="font-extrabold mb-4" style={{ fontSize: `${28 * scale}px` }}>
          สถานที่ท่องเที่ยว
        </h3>
        {trip.touristAttractions && trip.touristAttractions.length > 0 ? (
          <ul className="flex flex-col items-center gap-6 w-full">
            {trip.touristAttractions.map((attraction) => (
              <li
                key={attraction.id}
                className="p-6 bg-gray-100 rounded-3xl shadow-md w-full max-w-3xl"
                style={{ fontSize: `${24 * scale}px` }}
              >
                <p className="text-center"><strong>คำอธิบาย:</strong> {attraction.description || "-"}</p>
                <p className="text-center"><strong>เวลาเปิด:</strong> {attraction.open_time || "-"}</p>
                {attraction.address && <p className="text-center"><strong>ที่อยู่:</strong> {attraction.address}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center" style={{ fontSize: `${24 * scale}px` }}>ยังไม่มีข้อมูลสถานที่ท่องเที่ยว</p>
        )}
      </div>

      <div className="w-full flex flex-col items-center">
        <h3 className="font-extrabold mb-4" style={{ fontSize: `${28 * scale}px` }}>
          รายการไกด์ที่เสนอราคา
        </h3>
        {guidesToShow.length > 0 ? (
          <table className="border-collapse border border-gray-300 text-center" style={{ fontSize: `${24 * scale}px`, maxWidth: "90%" }}>
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4">ชื่อไกด์</th>
                <th className="p-4">อีเมล</th>
                <th className="p-4">ราคาเสนอ (บาท)</th>
                <th className="p-4">สถานะ</th>
                <th className="p-4">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {guidesToShow.map(({ id, guide, price, status, guide_id }) => (
                <tr key={id} className="border-b border-gray-300">
                  <td className="p-4">{guide?.name || "-"}</td>
                  <td className="p-4">{guide?.email || "-"}</td>
                  <td className="p-4">{price}</td>
                  <td className="p-4">{status}</td>
                  <td className="p-4">
                    {status === "selected" ? (
                      <span className="text-green-600 font-bold">✅ ไกด์ที่ถูกเลือก</span>
                    ) : (
                      <button
                        onClick={() => chooseGuide(guide_id)}
                        className="px-6 py-4 text-white bg-blue-500 rounded-3xl shadow hover:bg-blue-600 transition font-extrabold text-2xl"
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
          <p className="text-center" style={{ fontSize: `${24 * scale}px` }}>ยังไม่มีไกด์เสนอราคา</p>
        )}
      </div>

      <button
        onClick={() => navigate(-1)}
        className="px-8 py-6 text-white rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-400 font-extrabold shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
        style={{ fontSize: `${28 * scale}px` }}
      >
        กลับ
      </button>
    </div>
  );
}
