import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function TouristDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  // สมมติว่ามีข้อมูลมาแบบ array ผ่าน state (จาก Map)
  // ถ้าไม่มี ก็ดึง id แบบเดิม (กรณีคลิกจาก list ปกติ)
  const passedDetails = location.state?.details || null;

  const [details, setDetails] = useState(passedDetails);
  const { id } = useParams();

  useEffect(() => {
    if (!passedDetails) {
      // กรณีโหลดเข้ามาโดยตรงด้วย id เดียว
      async function fetchDetail() {
        try {
          const response = await axios.get(`/api/tourist-attractions/${id}`);
          setDetails([response.data]); // เก็บเป็น array
        } catch (error) {
          console.error("Error fetching detail:", error);
        }
      }
      fetchDetail();
    }
  }, [id, passedDetails]);

  if (!details) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>⬅ กลับ</button>

      {/* แสดงแต่ละโพสต์ในกลุ่ม */}
      {details.map((detail) => (
        <div key={detail.id} style={{ marginBottom: "40px", borderBottom: "1px solid #ccc", paddingBottom: "20px" }}>
          <h2>{detail.description}</h2>

          {detail.image && (
            <div>
              <img
                src={detail.image.startsWith("http") ? detail.image : "/uploads/" + detail.image}
                alt={detail.description}
                style={{ maxWidth: "100%", height: "auto", marginBottom: "10px" }}
              />
            </div>
          )}

          {/* รูปเพิ่มเติม */}
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
                    borderRadius: "8px",
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
      ))}
    </div>
  );
}
