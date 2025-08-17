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
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    social_media: "",
    description: "",
    avatarFile: null,
    avatarPreview: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (window.userToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${window.userToken}`;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/profile", { withCredentials: true });
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
      name: user.name || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
      social_media: user.social_media || "",
      description: user.description || "",
      avatarFile: null,
      avatarPreview: user.profile_photo_path
        ? `/storage/avatars/${user.profile_photo_path}`
        : "/default-avatar.png",
    });
    setEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleCancel = () => setEditing(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = new FormData();
      updateData.append("name", formData.name);
      updateData.append("first_name", formData.first_name);
      updateData.append("last_name", formData.last_name);
      updateData.append("email", formData.email);
      updateData.append("phone", formData.phone);
      updateData.append("social_media", formData.social_media);
      updateData.append("description", formData.description);
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
      <div style={{
        width: 120, height: 120, margin: "0 auto",
        borderRadius: "50%", overflow: "hidden", border: "4px solid #fecb00",
      }}>
        <img src={avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {!editing ? (
        <>
          <h2 style={{ marginTop: 16, fontSize: 28, fontWeight: 600 }}>{user.name}</h2>
          <p>{user.first_name} {user.last_name}</p>
          <p>{user.email}</p>
          <p>{user.phone}</p>
          <p>{user.social_media}</p>
          <p>{user.description}</p>
          <p>Role: {user.role}</p>
          <button onClick={handleEditClick} style={buttonStyle("#37a6ff")}>
            <FaEdit /> Edit Profile
          </button>
        </>
      ) : (
        <div style={{ marginTop: 20, textAlign: "left", maxWidth: 400, margin: "20px auto" }}>
          <label>Name:<input name="name" value={formData.name} onChange={handleInputChange} style={inputStyle} /></label>
          <label>First Name:<input name="first_name" value={formData.first_name} onChange={handleInputChange} style={inputStyle} /></label>
          <label>Last Name:<input name="last_name" value={formData.last_name} onChange={handleInputChange} style={inputStyle} /></label>
          <label>Email:<input name="email" value={formData.email} onChange={handleInputChange} style={inputStyle} /></label>
          <label>Phone:<input name="phone" value={formData.phone} onChange={handleInputChange} style={inputStyle} /></label>
          <label>Social Media:<input name="social_media" value={formData.social_media} onChange={handleInputChange} style={inputStyle} /></label>
          <label>Description:<textarea name="description" value={formData.description} onChange={handleInputChange} style={{ ...inputStyle, height: 80 }} /></label>
          <label>Avatar:<input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "block", marginTop: 4, marginBottom: 12 }} /></label>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={handleSave} disabled={saving} style={buttonStyle("#37a6ff")}>
              <FaSave /> {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={handleCancel} style={buttonStyle("#f87171")}>
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const inputStyle = { width: "100%", padding: 8, marginTop: 4, marginBottom: 12 };
const buttonStyle = (bg) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  backgroundColor: bg,
  color: "#fff",
  padding: "8px 16px",
  border: "none",
  borderRadius: 8,
  fontWeight: 600,
  cursor: "pointer",
});
