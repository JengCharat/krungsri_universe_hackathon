import React, { useEffect, useState } from "react";
import axios from "axios";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";

// หน้าแสดงกลุ่มแชททั้งหมด
function AllChatGroups() {
  const [chatGroups, setChatGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchChatGroups() {
      try {
        const res = await axios.get("/api/chat-groups", {
          headers: { Authorization: `Bearer ${window.userToken}` },
          withCredentials: true,
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
          <li key={group.id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "15px", marginBottom: "15px" }}>
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

// หน้าแชท
function ChatPage({ userToken }) {
  const { id: chatGroupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/chat-groups/${chatGroupId}/messages`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [chatGroupId, userToken]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await axios.post(
        `/api/chat-groups/${chatGroupId}/messages`,
        { message: text },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      setText("");
      fetchMessages();
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  return (
    <div>
      <div style={{ height: 300, overflowY: "scroll", border: "1px solid #ccc" }}>
        {messages.map(msg => (
          <div key={msg.id}>
            <strong>{msg.user?.name}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message" />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

const container2 = document.getElementById("all_chat");
const root = createRoot(container2);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/all_chat" element={<AllChatGroups />} />
      <Route path="/chat-group/:id" element={<ChatPage userToken={window.userToken} />} />
    </Routes>
  </BrowserRouter>
);
