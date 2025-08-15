import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// ---------- หน้าแสดงกลุ่มแชททั้งหมด ----------
export function AllChatGroups() {
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

  if (loading)
    return <p className="p-5 text-center text-lg">กำลังโหลดข้อมูลกลุ่มแชท...</p>;
  if (error) return <p className="p-5 text-center text-red-600">{error}</p>;
  if (chatGroups.length === 0)
    return <p className="p-5 text-center">คุณยังไม่มีสมาชิกในกลุ่มแชทใดๆ</p>;

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4">กลุ่มแชททั้งหมดที่คุณเป็นสมาชิก</h2>
      <ul className="space-y-3">
        {chatGroups.map((group) => (
          <li
            key={group.id}
            className="border border-gray-300 rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer bg-white"
            onClick={() => navigate(`/chat-group/${group.id}`)}
          >
            <h3 className="text-lg font-semibold">{group.name}</h3>
            <p className="text-gray-600">{group.description || "ไม่มีคำอธิบาย"}</p>
            <div className="mt-3 flex justify-end">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold">
                เข้าไปดูแชท
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- หน้าแชท ----------
export function ChatPage({ userToken }) {
  const { id: chatGroupId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/chat-groups/${chatGroupId}/messages`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setMessages(res.data);
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 1000);
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
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-600 text-white p-4 shadow">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 bg-blue-500 rounded-lg hover:bg-blue-700 transition"
        >
          กลับ
        </button>
        <h2 className="text-xl font-bold">Chat Group {chatGroupId}</h2>
        <div className="w-16"></div> {/* Spacer */}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{ scrollbarWidth: "thin" }}
      >
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">ยังไม่มีข้อความ</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user?.id === window.userId;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg break-words ${
                    isMe
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <span className="font-semibold">{msg.user?.name}</span>
                  <p>{msg.message}</p>
                  <span className="text-xs text-gray-400 block mt-1 text-right">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="flex p-3 border-t border-gray-300 bg-white space-x-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="พิมพ์ข้อความ..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition"
        >
          ส่ง
        </button>
      </div>
    </div>
  );
}
