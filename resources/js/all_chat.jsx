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
    return <p className="p-5 text-center text-xl">กำลังโหลดข้อมูลกลุ่มแชท...</p>;
  if (error) return <p className="p-5 text-center text-red-600">{error}</p>;
  if (chatGroups.length === 0)
    return <p className="p-5 text-center text-xl">คุณยังไม่มีสมาชิกในกลุ่มแชทใดๆ</p>;

  return (
     <div className="flex flex-col h-screen w-screen bg-white text-slate-900 px-4 md:px-12 mt-12">
      {/* Header */}
      <div className="flex-w-full h-[300px] bg-white flex flex-col justify-center px-6 md:px-12 py-5 relative overflow-hidden sticky top-0 z-10 w-full bg-white flex flex-col justify-center px-6 md:px-12 py-5 sticky top-0 z-10 ">
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-4 text-blue-800 bg-blue-200 px-5 py-3 rounded-full text-lg font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
            </svg>
            กลุ่มแชททั้งหมด
          </div>
        </div>

      <h1 className="text-6xl font-extrabold text-slate-900 mb-4 mt-5">กลุ่มแชททั้งหมด</h1>
      <p className="text-2xl text-slate-700 mb-6">
          พูดคุยกับเพื่อนร่วมทริปของคุณ
        </p>
        </div>

      <ul className="flex-1 overflow-auto flex flex-col items-center gap-6 w-full py-6">
  {chatGroups.map((group) => (
    <li
      key={group.id}
     className="w-full max-w-4xl bg-gradient-to-r from-blue-50 to-blue-75 rounded-3xl p-6 md:p-12 shadow-md flex flex-col space-y-6"
      onClick={() => navigate(`/chat-group/${group.id}`)}
    >
      <div>
        <h3 className="text-5xl md:text-6xl font-extrabold text-blue-800">{group.name}</h3>
        <p className="text-3xl md:text-4xl text-gray-700 mt-2 line-clamp-2">
          {group.description || "ไม่มีคำอธิบาย"}
        </p>
      </div>
      <div className="mt-4 flex justify-end">
        <button  className="mt-6 flex-1 px-8 py-5 bg-green-600 text-white rounded-3xl font-semibold shadow hover:bg-green-700 transition transform hover:scale-105 text-4xl">
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
      <div className="flex items-center justify-between bg-blue-600 text-white p-10 shadow">
        <button
          onClick={() => navigate(-1)}
          className="px-10 py-6 bg-blue-500 rounded-3xl hover:bg-blue-700 transition text-4xl font-extrabold"
        >
          กลับ
        </button>
        <h2 className="font-extrabold text-7xl">Chat Group {chatGroupId}</h2>
        <div className="w-28"></div> {/* Spacer */}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-10 space-y-8"
        style={{ scrollbarWidth: "thin" }}
      >
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center mt-10 text-5xl">ยังไม่มีข้อความ</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user?.id === window.userId;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-16 py-10 break-words rounded-3xl max-w-[80%] text-4xl
                    ${isMe
                      ? "bg-blue-500 text-white rounded-br-none self-end"
                      : "bg-gray-200 text-gray-900 rounded-bl-none self-start"}`
                  }
                >
                  {!isMe && (
                    <span className="font-extrabold text-4xl">{msg.user?.name}</span>
                  )}
                  <p className={`mt-5 text-5xl ${isMe ? "text-white" : "text-gray-900"}`}>
                    {msg.message}
                  </p>
                  <span className="text-xl text-gray-400 block mt-4 text-right">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="flex p-8 border-t border-gray-300 bg-white space-x-6">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="พิมพ์ข้อความ..."
          className="flex-1 px-12 py-6 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-4xl"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-12 py-6 bg-blue-500 text-white rounded-3xl hover:bg-blue-600 font-extrabold text-4xl transition"
        >
          ส่ง
        </button>
      </div>
    </div>
  );
}
