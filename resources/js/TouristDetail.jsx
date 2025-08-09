import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function TouristDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const passedDetails = location.state?.details || null;
  const [details, setDetails] = useState(passedDetails);
  const { id } = useParams();

  useEffect(() => {
    if (!passedDetails) {
      async function fetchDetail() {
        try {
          const response = await axios.get(`/api/tourist-attractions/${id}`);
          setDetails([response.data]); // เก็บเป็น array เพื่อให้ consistent กับ passedDetails
        } catch (error) {
          console.error("Error fetching detail:", error);
        }
      }
      fetchDetail();
    }
  }, [id, passedDetails]);

  if (!details) return <p>Loading...</p>;

  // รวมรูปภาพทั้งหมดจาก details ทุกโพสต์ มาเป็น array เดียว
  const allImages = details.flatMap(detail => {
    const mainImage = detail.image
      ? [detail.image.startsWith("http") ? detail.image : "/uploads/" + detail.image]
      : [];
    const additionalImages = detail.images
      ? detail.images.map(img => "/uploads/" + img.image_path)
      : [];
    return [...mainImage, ...additionalImages];
  });

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>⬅ กลับ</button>

      {/* แสดงรายละเอียดแต่ละโพสต์ */}
      {details.map((detail) => (
        <div key={detail.id} style={{ marginBottom: "40px", borderBottom: "1px solid #ccc", paddingBottom: "20px" }}>
          <h2>{detail.description}</h2>
          <p><strong>เปิด:</strong> {detail.open_time}</p>
          <p><strong>ปิด:</strong> {detail.close_time}</p>
          <p><strong>ค่าเข้า:</strong> {detail.entry_fee} บาท</p>
          <p><strong>หมวดหมู่:</strong> {detail.tag}</p>
          <p><strong>ติดต่อ:</strong> {detail.contact_info}</p>
        </div>
      ))}

      {/* แสดงรูปภาพทั้งหมดรวมกัน */}
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
    </div>
  );
}
