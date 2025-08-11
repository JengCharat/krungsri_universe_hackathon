import { createRoot } from 'react-dom/client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ChatPage({ userToken }) {
  const { id } = useParams(); // ดึง id จาก URL
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/chat-groups/${id}/messages`, {
        headers: { Authorization: `Bearer ${userToken}` }
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
  }, [id, userToken]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await axios.post(`/api/chat-groups/${id}/messages`,
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

export default ChatPage;
