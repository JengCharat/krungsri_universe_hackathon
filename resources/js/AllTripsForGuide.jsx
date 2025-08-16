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
    <div className="flex flex-col h-screen w-screen bg-white text-slate-900 px-4 md:px-12 mt-12">
  {/* Header */}
  <div className="w-full h-[300px] bg-white flex flex-col justify-center px-6 md:px-12 py-5 relative overflow-hidden sticky top-0 z-10">
    {/* Decorative blobs */}
    <div className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full bg-indigo-100/30 blur-2xl"></div>
    <div className="pointer-events-none absolute -bottom-12 -left-10 w-32 h-32 rounded-full bg-emerald-100/30 blur-2xl"></div>

    {/* Top row */}
    <div className="flex items-center justify-between mb-4">
      <div className="inline-flex items-center gap-4 text-blue-800 bg-blue-200 px-5 py-3 rounded-full text-lg font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
        </svg>
              ทริปที่ต้องการไกด์หรือคนขับรถ
      </div>
    </div>

    <h1 className="text-6xl font-extrabold text-slate-900 mb-4 mt-5">
      ทริปที่ต้องการไกด์หรือคนขับรถ
    </h1>

    <p className="text-2xl text-slate-700 mb-6">
      ดูและจัดการทริปที่ต้องการไกด์หรือคนขับรถทั้งหมด
    </p>
  </div>


 <div className="flex flex-col items-center px-6 py-10">
  {trips.length === 0 ? (
    <p className="text-3xl text-center">
      ไม่มีทริปที่ต้องการไกด์หรือคนขับรถในขณะนี้
    </p>
  ) : (
    <div className="flex flex-col gap-10 w-full items-center">
      {trips.map((trip) => (
        <div
          key={trip.id}
           className="border border-gray-300 rounded-3xl p-8 shadow-lg bg-white w-full max-w-4xl text-center"
                >
          <h3 className="text-2xl md:text-6xl font-bold text-slate-900 text-center mb-2">{trip.name}</h3>
           <div className="w-full flex flex-col gap-4 text-slate-700 text-2xl md:text-4xl mb-6 text-start">
          <p><strong>วันที่เริ่ม:</strong> {trip.start_date || "ไม่ระบุ"}</p>
          <p><strong>เงื่อนไข:</strong> {trip.conditions || "-"}</p>
          <p><strong>จำนวนคนที่ต้องการ:</strong> {trip.max_people}</p>
          <p><strong>ต้องการไกด์:</strong> {trip.needs_guide ? "ใช่" : "ไม่ใช่"}</p>
          <p><strong>ต้องการคนขับรถ:</strong> {trip.needs_driver ? "ใช่" : "ไม่ใช่"}</p>
</div>
          {/* Action Buttons */}
                  <div className="flex flex-col gap-6 w-full justify-center mt-4">
            <button
              onClick={() => navigate(`/trip/${trip.id}`)}
              className="flex-1 px-8 py-5 bg-blue-600 text-white rounded-3xl font-semibold shadow hover:bg-blue-700 transition transform hover:scale-105 text-4xl"
                >
              ดูรายละเอียด
            </button>
            <button
              onClick={() => handleJoinTrip(trip.id)}
              disabled={joining === trip.id}
                className="flex-1 px-8 py-5 bg-green-600 text-white rounded-3xl font-semibold shadow hover:bg-green-700 transition transform hover:scale-105 text-4xl"
                >
              {joining === trip.id ? "⏳ กำลังเข้าร่วม..." : "เข้าร่วมทริป"}
            </button>
            <button
              onClick={() => handleOfferPrice(trip.id)}
              disabled={joining === trip.id}
              className="flex-1 px-8 py-5 bg-red-600 text-white rounded-3xl font-semibold shadow hover:bg-red-700 transition transform hover:scale-105 text-4xl"
                >
              {joining === trip.id ? "💬 กำลังส่งราคา..." : "เสนอราคา"}
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
</div>

  );
}
