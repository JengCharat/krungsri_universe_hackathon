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
    <div className="flex flex-col items-center p-8 space-y-8">
      <h2 className="font-extrabold text-center" style={{ fontSize: `${32 * scale}px` }}>
        รายการ Trip ทั้งหมด
      </h2>

      {trips.length === 0 ? (
        <p className="text-center" style={{ fontSize: `${24 * scale}px` }}>
          ไม่มีทริปในระบบ
        </p>
      ) : (
        <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="w-full max-w-3xl bg-white rounded-3xl p-8 shadow-lg flex flex-col items-center space-y-4"
            >
              <h3 className="font-bold text-center" style={{ fontSize: `${28 * scale}px` }}>
                {trip.name}
              </h3>
              <p style={{ fontSize: `${24 * scale}px` }}>
                <strong>วันที่เริ่ม:</strong> {trip.start_date || "ไม่ระบุ"}
              </p>
              <p style={{ fontSize: `${24 * scale}px` }}>
                <strong>เงื่อนไข:</strong> {trip.conditions || "-"}
              </p>
              <p style={{ fontSize: `${24 * scale}px` }}>
                <strong>จำนวนคนที่ต้องการ:</strong> {trip.max_people}
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate(`/trip/${trip.id}`)}
                  className="px-6 py-4 bg-blue-500 text-white rounded-3xl font-bold shadow-lg hover:bg-blue-600 transition transform hover:scale-105"
                  style={{ fontSize: `${24 * scale}px` }}
                >
                  ดูรายละเอียด
                </button>
                <button
                  onClick={() => handleJoinTrip(trip.id)}
                  disabled={joining === trip.id}
                  className="px-6 py-4 bg-green-500 text-white rounded-3xl font-bold shadow-lg hover:bg-green-600 transition transform hover:scale-105 disabled:opacity-50"
                  style={{ fontSize: `${24 * scale}px` }}
                >
                  {joining === trip.id ? "กำลังเข้าร่วม..." : "เข้าร่วมทริป"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
