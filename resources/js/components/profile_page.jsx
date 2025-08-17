import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ตั้งค่า default header JWT
    axios.defaults.headers.common["Authorization"] = `Bearer ${window.userToken}`;

    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/profile"); // ไม่ต้องส่ง headers ซ้ำ
        setUser(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading profile...</p>;
  if (error) return <p style={{ padding: 20, color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <div
        style={{
          width: 120,
          height: 120,
          margin: "0 auto",
          borderRadius: "50%",
          overflow: "hidden",
          border: "4px solid #fecb00",
        }}
      >
        <img
          src={user.avatarUrl || "/default-avatar.png"}
          alt="Avatar"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <h2 style={{ marginTop: 16, fontSize: 28, fontWeight: 600 }}>
        {user.name}
      </h2>
      <p style={{ color: "#6b7280", margin: "8px 0" }}>{user.email}</p>
      <p style={{ color: "#6b7280", marginBottom: 16 }}>Role: {user.role}</p>

      <button
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          backgroundColor: "#37a6ff",
          color: "#fff",
          padding: "8px 16px",
          border: "none",
          borderRadius: 8,
          fontWeight: 600,
          cursor: "pointer",
        }}
        onClick={() => alert("Edit profile clicked!")}
      >
        <FaEdit /> Edit Profile
      </button>
    </div>
  );
}
