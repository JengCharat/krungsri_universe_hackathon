import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function TripList() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTrips() {
      try {
        const response = await axios.get("/api/trips");
        setTrips(response.data);
        setLoading(false);
      } catch (err) {
        setError("ไม่สามารถดึงข้อมูลทริปได้");
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>รายการทริปทั้งหมด</h2>
      {trips.length === 0 ? (
        <p>ยังไม่มีทริป</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {trips.map((trip) => (
            <li
              key={trip.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 15,
                marginBottom: 10,
                cursor: "pointer",
              }}
              onClick={() => navigate(`/trip/${trip.id}`)}
            >
              <h3>{trip.name}</h3>
              <p>
                วันที่:{" "}
                {trip.start_date
                  ? new Date(trip.start_date).toLocaleDateString()
                  : "-"}{" "}
                ถึง{" "}
                {trip.end_date
                  ? new Date(trip.end_date).toLocaleDateString()
                  : "-"}
              </p>
              <p>จำนวนสถานที่: {trip.tourist_attractions?.length || 0}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
