import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function TouristDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const passedDetails = location.state?.details || null;
  const [details, setDetails] = useState(passedDetails);
  const { id } = useParams();

  // สเตทฟอร์มสร้าง trip
  const [tripName, setTripName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [conditions, setConditions] = useState("");
  const [maxPeople, setMaxPeople] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!passedDetails) {
      async function fetchDetail() {
        try {
          const response = await axios.get(`/api/tourist-attractions/${id}`);
          setDetails([response.data]);
        } catch (error) {
          console.error("Error fetching detail:", error);
        }
      }
      fetchDetail();
    }
  }, [id, passedDetails]);

  if (!details) return <p>Loading...</p>;

  const allImages = details.flatMap((detail) => {
    const mainImage = detail.image
      ? [detail.image.startsWith("http") ? detail.image : "/uploads/" + detail.image]
      : [];
    const additionalImages = detail.images
      ? detail.images.map((img) => "/uploads/" + img.image_path)
      : [];
    return [...mainImage, ...additionalImages];
  });

  // ฟังก์ชันส่งข้อมูลสร้าง Trip
const handleCreateTrip = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const res = await axios.post(
      "/trips_uploads",
      {
        name: tripName,
        start_date: startDate || null,
        conditions,
        max_people: maxPeople,
        tourist_attraction_id: id,
      },
      {
        headers: {
          Authorization: `Bearer ${window.userToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    setLoading(false);
    navigate(`/trip/${res.data.id}`); // redirect ไปหน้า Trip Detail
  } catch (err) {
    setLoading(false);
    setError(err.response?.data?.message || "เกิดข้อผิดพลาด");
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>⬅ กลับ</button>

      {details.map((detail) => (
        <div
          key={detail.id}
          style={{
            marginBottom: "40px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "20px",
          }}
        >
          <h2>{detail.description}</h2>
          <p>
            <strong>เปิด:</strong> {detail.open_time}
          </p>
          <p>
            <strong>ปิด:</strong> {detail.close_time}
          </p>
          <p>
            <strong>ค่าเข้า:</strong> {detail.entry_fee} บาท
          </p>
          <p>
            <strong>หมวดหมู่:</strong> {detail.tag}
          </p>
          <p>
            <strong>ติดต่อ:</strong> {detail.contact_info}
          </p>
        </div>
      ))}

      {allImages.length > 0 && (
        <div>
          <h3>รูปภาพทั้งหมด</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {allImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Attraction Image ${i + 1}`}
                style={{
                  width: "200px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ฟอร์มสร้าง Trip */}
      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h3>สร้าง Trip ใหม่โดยใช้สถานที่นี้</h3>
        <form onSubmit={handleCreateTrip}>
          <label>
            ชื่อทริป:
            <input
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              required
              style={{ marginLeft: 10 }}
            />
          </label>
          <br />
          <label>
            วันที่เริ่มต้น:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ marginLeft: 10 }}
            />
          </label>
          <br />
          <label>
            เงื่อนไข (เช่น ไม่ต้องการไปกับคนสูบบุหรี่):
            <textarea
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              style={{ marginLeft: 10, width: "100%", height: "60px" }}
            />
          </label>
          <br />
          <label>
            จำนวนคนที่ต้องการ:
            <input
              type="number"
              min="1"
              value={maxPeople}
              onChange={(e) => setMaxPeople(Number(e.target.value))}
              style={{ marginLeft: 10 }}
            />
          </label>
          <br />
          <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
            {loading ? "กำลังสร้าง..." : "สร้าง Trip"}
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
