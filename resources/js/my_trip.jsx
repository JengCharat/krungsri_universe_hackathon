import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("ongoing");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  axios.defaults.headers.common["Authorization"] = `Bearer ${window.userToken}`;

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get("/api/my-trips");
        setTrips(res.data.trips || res.data);
        setRole(res.data.role || "user");
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError(err.response?.data?.message || "ไม่สามารถโหลดข้อมูลทริปของคุณได้");
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
      await axios.post(`/api/trips/${tripId}/join`);
      alert("เข้าร่วมทริปสำเร็จ!");
      const res = await axios.get("/api/my-trips");
      setTrips(res.data.trips || res.data);
    } catch (err) {
      console.error("Error joining trip:", err);
      setError(err.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setJoining(null);
    }
  };

  const handleEndTrip = async (tripId) => {
    if (!window.confirm("ยืนยันการจบทริปนี้หรือไม่?")) return;
    try {
      await axios.post(`/api/trips/${tripId}/confirm-end`);
      const tripsRes = await axios.get("/api/my-trips");
      setTrips(tripsRes.data.trips || tripsRes.data);
    } catch (err) {
      console.error("Error confirming end:", err);
      alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  if (loading)
    return <p style={{ padding: 20, fontSize: 28, textAlign: "center" }}>กำลังโหลดข้อมูล...</p>;
  if (error)
    return <p style={{ color: "red", padding: 20, fontSize: 28, textAlign: "center" }}>{error}</p>;

  const filteredTrips = trips.filter((t) => t.status === tab);
  const getTrip = (item) => (role === "guide" ? item.trip : item);

  return (
    <div className="flex flex-col h-screen w-screen bg-white text-slate-900 px-4 md:px-12 mt-6">
      {/* Header */}
      <div className="w-full h-auto bg-white flex flex-col justify-center px-6 md:px-12 py-5 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full bg-indigo-100/30 blur-2xl"></div>
        <div className="pointer-events-none absolute -bottom-12 -left-10 w-32 h-32 rounded-full bg-emerald-100/30 blur-2xl"></div>

        <div className="flex items-center justify-between mb-4 mt-12">
          <div className="inline-flex items-center gap-4 text-[#7f4534ff] bg-[#fecb00] px-5 py-3 rounded-full text-3xl font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
            </svg>
            ทริปของฉัน
          </div>
        </div>

        <h1 className="text-6xl font-extrabold text-slate-900 mb-4 mt-5">ทริปของฉัน</h1>
        <p className="text-2xl text-slate-700 mb-6">ทริปทั้งหมดของฉัน</p>

        <div className="flex gap-4 items-center justify-center m-auto">
          {role === "guide"
            ? ["pending", "selected", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setTab(status)}
                  className={`px-10 py-4 rounded-2xl text-3xl font-bold text-white ${
                    tab === status ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-400 hover:bg-gray-500"
                  } transition-colors`}
                >
                  {status === "pending"
                    ? "กำลังพิจารณา"
                    : status === "selected"
                    ? "ยืนยันแล้ว"
                    : "ปฏิเสธ"}
                </button>
              ))
            : ["ongoing", "ended"].map((status) => (
                <button
                  key={status}
                  onClick={() => setTab(status)}
                  className={`px-10 py-4 rounded-2xl text-3xl font-bold text-white ${
                    tab === status ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-400 hover:bg-gray-500"
                  } transition-colors`}
                >
                  {status === "ongoing" ? "ยังไม่จบ" : "จบแล้ว"}
                </button>
              ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto flex flex-col items-center gap-6 w-full max-w-6xl mx-auto py-6 mt-12">
        {filteredTrips.length === 0 ? (
          <p className="text-center text-3xl md:text-2xl text-slate-700">ไม่มีทริปสำหรับสถานะนี้</p>
        ) : (
          filteredTrips.map((item) => {
            const trip = getTrip(item);
            const isDanger = trip.is_danger;

            return (
              <div
                key={trip.id}
                className={`w-full rounded-3xl p-6 md:p-12 shadow-md flex flex-col space-y-6 mb-20 ${
                  isDanger ? "border-4 border-red-600" : "bg-gradient-to-r from-blue-50 to-blue-75"
                }`}
              >
                <h3 className="text-2xl md:text-6xl font-bold text-slate-900 text-center mb-2">
                  {trip.name}
                </h3>

                <div className="w-full flex flex-col gap-4 text-slate-700 text-2xl md:text-4xl mb-6">
                  <p><strong>วันที่เริ่ม:</strong> {trip.start_date || "-"}</p>
                  <p><strong>เงื่อนไข:</strong> {trip.conditions || "-"}</p>
                  <p><strong>จำนวนคนที่ต้องการ:</strong> {trip.max_people}</p>
                </div>

                <div className="flex flex-col gap-6 w-full justify-center mt-4">
                  <button
                    onClick={() => navigate(`/my-trips/${trip.id}`)}
                    className="flex-1 px-8 py-5 bg-gray-500 text-white rounded-3xl font-semibold shadow hover:bg-gray-400 transition transform hover:scale-105 text-4xl"
                  >
                    ดูรายละเอียด
                  </button>

                  {role === "user" && (
                    <>
                      <button
                        onClick={() => handleJoinTrip(trip.id)}
                        disabled={joining === trip.id}
                        className="flex-1 px-8 py-5 bg-[#fecb00] text-[#7f4534ff] rounded-3xl font-semibold shadow hover:bg-yellow-700 transition transform hover:scale-105 disabled:opacity-50 text-4xl"
                      >
                        {joining === trip.id ? "กำลังเข้าร่วม..." : "เข้าร่วมทริป"}
                      </button>

                      <button
                        onClick={() => handleEndTrip(trip.id)}
                        className="flex-1 px-8 py-5 bg-red-600 text-white rounded-3xl font-semibold shadow hover:bg-red-700 transition transform hover:scale-105 text-4xl"
                      >
                        ยืนยันจบทริป
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
