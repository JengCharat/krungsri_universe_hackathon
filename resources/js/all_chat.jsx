
import React, { useEffect, useState } from "react";
import axios from "axios";
import { createRoot } from "react-dom/client";
import { useNavigate } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

export default function AllChatGroups() {
  const [chatGroups, setChatGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchChatGroups() {
      try {
        const res = await axios.get("/api/chat-groups", {
          headers: {
            Authorization: `Bearer ${window.userToken}`, // ถ้าใช้ token
          },
          withCredentials: true, // ถ้าต้องการส่ง cookie
        });
        setChatGroups(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "ไม่สามารถโหลดข้อมูลกลุ่มแชทได้");
      } finally {
        setLoading(false);
      }
    }
    fetchChatGroups();
  }, []);

  if (loading) return <p>กำลังโหลดข้อมูลกลุ่มแชท...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (chatGroups.length === 0) return <p>คุณยังไม่มีสมาชิกในกลุ่มแชทใดๆ</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>กลุ่มแชททั้งหมดที่คุณเป็นสมาชิก</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {chatGroups.map((group) => (
          <li
            key={group.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <h3>{group.name}</h3>
            <p>{group.description || "ไม่มีคำอธิบาย"}</p>
            <button onClick={() => navigate(`/chat-group/${group.id}`)}>
              เข้าไปดูแชท
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const container2 = document.getElementById("all_chat");
const root = createRoot(container2);
root.render(
  <BrowserRouter>
    <AllChatGroups />
  </BrowserRouter>
);
