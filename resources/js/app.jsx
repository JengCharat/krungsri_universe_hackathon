import { createRoot } from 'react-dom/client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App({ chatGroupId, userToken }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // ฟังก์ชันดึงข้อความ
  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `/api/chat-groups/${chatGroupId}/messages`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // เรียกทุก 3 วินาที
  useEffect(() => {
    fetchMessages(); // โหลดครั้งแรก
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [chatGroupId, userToken]);

  // ส่งข้อความ
  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await axios.post(
        `/api/chat-groups/${chatGroupId}/messages`,
        { message: text },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      setText("");
      fetchMessages(); // โหลดใหม่หลังส่ง
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

      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

// รับค่าจาก Blade ผ่าน window
const container = document.getElementById("app");
const root = createRoot(container);
root.render(
  <App chatGroupId={window.chatGroupId} userToken={window.userToken} />
);
