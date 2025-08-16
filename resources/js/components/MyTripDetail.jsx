import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyTripDetail() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  // กำหนด state เริ่มต้น
  const [trip, setTrip] = useState({
    tripGuides: [],
    touristAttractions: [],
    users: [],
  });
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  axios.defaults.headers.common["Authorization"] = `Bearer ${window.userToken}`;

  // ฟังก์ชันโหลดข้อมูลทริป
  useEffect(() => {
    async function fetchTrip() {
      try {
        const res = await axios.get(`/api/my-trips/${tripId}`);
        const data = res.data;

        setTrip({
          ...data.trip,
          tripGuides: data.tripGuides || [],
          touristAttractions: data.trip?.touristAttractions || [],
          users: data.trip?.users || [],
        });
        setIsOwner(data.is_owner || false);
      } catch (err) {
        console.error("Error fetching trip:", err);
        setError(err.response?.data?.message || "ไม่สามารถโหลดข้อมูลทริปได้");
      } finally {
        setLoading(false);
      }
    }

    fetchTrip();
  }, [tripId]);

  // ฟังก์ชันเลือกไกด์
  async function chooseGuide(guideId) {
    if (!window.confirm("ยืนยันการเลือกไกด์คนนี้?")) return;

    try {
      await axios.post(`/api/my-trips/${tripId}/choose-guide/${guideId}`);
      alert("เลือกไกด์เรียบร้อย");

      // รีเฟรชข้อมูลทริปหลังเลือกไกด์
      const res = await axios.get(`/api/my-trips/${tripId}`);
      setTrip({
        ...res.data.trip,
        tripGuides: res.data.tripGuides || [],
        touristAttractions: res.data.trip?.touristAttractions || [],
        users: res.data.trip?.users || [],
      });
      setIsOwner(res.data.is_owner || false);
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

  // หาไกด์ที่ถูกเลือกแล้ว
  const selectedGuide = trip.tripGuides.find(g => g.status === "selected");
  const guidesToShow = isOwner
    ? selectedGuide
      ? [selectedGuide]
      : trip.tripGuides || []
    : [];

  return (
    <div className="flex flex-col h-screen w-screen bg-white text-slate-900 px-4 md:px-12 mt-12">
      {/* Header */}
      <div className="w-full h-[300px] bg-white flex flex-col justify-center px-6 md:px-12 py-5 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full bg-indigo-100/30 blur-2xl"></div>
        <div className="pointer-events-none absolute -bottom-12 -left-10 w-32 h-32 rounded-full bg-emerald-100/30 blur-2xl"></div>
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-4 text-blue-800 bg-blue-200 px-5 py-3 rounded-full text-lg font-bold">
            รายละเอียด
          </div>
        </div>
        <h1 className="text-6xl font-extrabold text-slate-900 mb-4 mt-5">รายละเอียดทริปของฉัน</h1>
        <p className="text-2xl text-slate-700 mb-6">รายละเอียดเพิ่มเติมเกี่ยวกับทริปนี้</p>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto flex flex-col items-center gap-8 w-full max-w-5xl mx-auto py-4">
        {/* ข้อมูลทริป */}
        <div className="w-full bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl p-8 md:p-10 shadow-lg flex flex-col space-y-8 text-2xl md:text-3xl items-start">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 text-center">{trip.name}</h1>
          <div className="flex flex-col items-start space-y-6">
            <p><strong>วันที่เริ่ม:</strong> {trip.start_date || "-"}</p>
            <p><strong>เงื่อนไข:</strong> {trip.conditions || "-"}</p>
            <p><strong>จำนวนคนที่ต้องการ:</strong> {trip.max_people}</p>
          </div>

          {/* สถานที่ท่องเที่ยว */}
          <div className="flex flex-col items-start w-full">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">สถานที่ท่องเที่ยว</h3>
            {trip.touristAttractions.length > 0 ? (
              <ul className="flex flex-col items-center gap-6 w-full">
                {trip.touristAttractions.map((attraction) => (
                  <li key={attraction.id} className="p-6 md:p-8 bg-gray-100 rounded-3xl shadow-md w-full max-w-4xl text-center text-2xl md:text-3xl">
                    <p><strong>คำอธิบาย:</strong> {attraction.description || "-"}</p>
                    <p><strong>เวลาเปิด:</strong> {attraction.open_time || "-"}</p>
                    {attraction.address && <p><strong>ที่อยู่:</strong> {attraction.address}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-2xl md:text-3xl">ยังไม่มีข้อมูลสถานที่ท่องเที่ยว</p>
            )}
          </div>

          {/* สมาชิกทริป */}
          <div className="w-full mt-12">
            <h3 className="text-4xl md:text-4xl font-bold mb-6">สมาชิกในทริป</h3>
            {trip.users.length > 0 ? (
              <ul className="flex flex-col gap-4 text-2xl md:text-3xl">
                {trip.users.map((user) => (
                  <li key={user.id} className="p-4 bg-gray-200 rounded-xl shadow">
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-2xl md:text-3xl">ยังไม่มีสมาชิกในทริป</p>
            )}
          </div>

          {/* รายการไกด์ (เจ้าของเท่านั้น) */}
          {isOwner && (
            <div className="w-full flex flex-col items-center mt-12">
              <h3 className="text-4xl md:text-4xl font-bold mb-6">รายการไกด์ที่เสนอราคา</h3>
              {guidesToShow.length > 0 ? (
                <table className="border-collapse border border-gray-300 text-center w-full md:max-w-5xl text-2xl md:text-3xl">
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
                        <td className="p-4">{price || "-"}</td>
                        <td className="p-4">{status}</td>
                        <td className="p-4">
                          {status === "selected" ? (
                            <span className="text-green-600 font-bold text-2xl">✅ ไกด์ที่ถูกเลือก</span>
                          ) : (
                            <button
                              onClick={() => chooseGuide(guide_id)}
                              className="px-6 py-4 md:px-8 md:py-5 text-white bg-blue-500 rounded-3xl shadow-lg hover:bg-blue-600 transition font-extrabold text-2xl md:text-3xl"
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
                <p className="text-center text-2xl md:text-3xl">ยังไม่มีไกด์เสนอราคา</p>
              )}
            </div>
          )}
        </div>

        {/* ปุ่มกลับ */}
        <button
          onClick={() => navigate(-1)}
          className="px-10 py-6 md:px-12 md:py-7 text-white rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-400 font-extrabold shadow-xl transform transition-transform hover:scale-110 hover:shadow-2xl text-2xl md:text-3xl mt-6"
        >
          กลับ
        </button>
      </div>
    </div>
  );
}
