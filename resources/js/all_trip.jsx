// AllTrips.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AllTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const scale = 1.45; // ขยายฟอนต์ 45%

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get("/api/trips");
        setTrips(res.data);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("ไม่สามารถโหลดข้อมูลทริปได้");
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
      setJoining(null);
    }
  };

  if (loading)
    return (
      <p className="text-center" style={{ padding: "20px", fontSize: `${20 * scale}px` }}>
        กำลังโหลดข้อมูล...
      </p>
    );
  if (error)
    return (
      <p
        className="text-center text-red-600"
        style={{ padding: "20px", fontSize: `${20 * scale}px` }}
      >
        {error}
      </p>
    );

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
        ทริปทั้งหมด
      </div>
    </div>

    <h1 className="text-6xl font-extrabold text-slate-900 mb-4 mt-5">
      ทริปทั้งหมด
    </h1>
    <p className="text-2xl text-slate-700 mb-6">
      สำรวจทริปทั้งหมด ค้นหา กรอง และเรียงตามที่ต้องการ
    </p>
  </div>

  {/* Trip List */}
  <div className="flex-1 overflow-auto flex flex-col items-center gap-6 w-full max-w-6xl mx-auto py-6">
    {trips.length === 0 ? (
      <p className="text-center text-xl md:text-2xl text-slate-700">
        ไม่มีทริปในระบบ
      </p>
    ) : (
      trips.map((trip) => (
        <div
          key={trip.id}
          className="w-full bg-gradient-to-r from-blue-50 to-blue-75 rounded-3xl p-6 md:p-12 shadow-md flex flex-col space-y-6 mb-20"
        >
          {/* Trip Name */}
          <h3 className="text-2xl md:text-6xl font-bold text-slate-900 text-center mb-2">
            {trip.name}
          </h3>

          {/* Trip Info */}
          <div className="w-full flex flex-col gap-4 text-slate-700 text-2xl md:text-4xl mb-6">
            <p>
              <strong>วันที่เริ่ม:</strong> {trip.start_date || "ไม่ระบุ"}
            </p>
            <p>
              <strong>เงื่อนไข:</strong> {trip.conditions || "-"}
            </p>
            <p>
              <strong>จำนวนคนที่ต้องการ:</strong> {trip.max_people}
            </p>
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
              className="flex-1 px-8 py-5 bg-green-600 text-white rounded-3xl font-semibold shadow hover:bg-green-700 transition transform hover:scale-105 disabled:opacity-50 text-4xl"
            >
              {joining === trip.id ? "กำลังเข้าร่วม..." : "เข้าร่วมทริป"}
            </button>
          </div>
        </div>
      ))
    )}
  </div>
</div>

);

}
