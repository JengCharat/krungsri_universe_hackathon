import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatarFile: null,
    avatarPreview: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // ตั้งค่า default header JWT ถ้ามี
    if (window.userToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${window.userToken}`;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/profile", {
          withCredentials: true, // ใช้ cookie session สำหรับ Sanctum
        });
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

  const handleEditClick = () => {
    setFormData({
      name: user.name,
      email: user.email,
      avatarFile: null,
      avatarPreview: user.profile_photo_path
        ? `/storage/avatars/${user.profile_photo_path}`
        : "/default-avatar.png",
    });
    setEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = new FormData();
      updateData.append("name", formData.name);
      updateData.append("email", formData.email);
      if (formData.avatarFile) {
        updateData.append("avatar", formData.avatarFile);
      }

      const response = await axios.post("/api/profile", updateData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setUser(response.data.user);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading profile...</p>;
  if (error) return <p style={{ padding: 20, color: "red" }}>{error}</p>;

  const avatarUrl = editing
    ? formData.avatarPreview
    : user.profile_photo_path
    ? `/storage/avatars/${user.profile_photo_path}`
    : "/default-avatar.png";

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
          src={avatarUrl}
          alt="Avatar"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {!editing ? (
        <>
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
            onClick={handleEditClick}
          >
            <FaEdit /> Edit Profile
          </button>
        </>
      ) : (
        <div
          style={{
            marginTop: 20,
            textAlign: "left",
            maxWidth: 400,
            margin: "20px auto",
          }}
        >
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={{ width: "100%", padding: 8, marginTop: 4, marginBottom: 12 }}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{ width: "100%", padding: 8, marginTop: 4, marginBottom: 12 }}
            />
          </label>
          <label>
            Avatar:
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "block", marginTop: 4, marginBottom: 12 }}
            />
          </label>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={handleSave}
              disabled={saving}
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
            >
              <FaSave /> {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#f87171",
                color: "#fff",
                padding: "8px 16px",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
