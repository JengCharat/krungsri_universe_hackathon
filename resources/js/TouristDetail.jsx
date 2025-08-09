// TouristDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function TouristDetail() {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDetail() {
      try {
        const response = await axios.get(`/api/tourist-attractions/${id}`);
        setDetail(response.data);
      } catch (error) {
        console.error("Error fetching detail:", error);
      }
    }
    fetchDetail();
  }, [id]);

  if (!detail) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>⬅ กลับ</button>
      <h2>{detail.description}</h2>

      {/* รูปหลัก (ถ้ามี) */}
      {detail.image && (
        <div>
          <img
            src={detail.image}
            alt={detail.description}
            style={{ maxWidth: "100%", height: "auto", marginBottom: "10px" }}
          />
        </div>
      )}

      {/* แสดงรูปทั้งหมดจาก tourist_attraction_images */}
      {detail.images && detail.images.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {detail.images.map((img) => (
            <img
              key={img.id}
              src={"/uploads/" + img.image_path}
              alt="Attraction"
              style={{
                width: "200px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "8px"
              }}
            />
          ))}
        </div>
      )}

      <p><strong>เปิด:</strong> {detail.open_time}</p>
      <p><strong>ปิด:</strong> {detail.close_time}</p>
      <p><strong>ค่าเข้า:</strong> {detail.entrance_fee} บาท</p>
      <p><strong>หมวดหมู่:</strong> {detail.tag}</p>
      <p><strong>ติดต่อ:</strong> {detail.contact_info}</p>
    </div>
  );
}
