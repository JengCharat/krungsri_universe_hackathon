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
    
    <div className="flex flex-col h-screen w-screen bg-white text-slate-900 px-4 md:px-12 mt-6">
      {/* Header */}
      <div className="w-full h-[300px] bg-white flex flex-col justify-center px-6 md:px-12 py-5 relative overflow-hidden">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full bg-indigo-100/30 blur-2xl"></div>
        <div className="pointer-events-none absolute -bottom-12 -left-10 w-32 h-32 rounded-full bg-emerald-100/30 blur-2xl"></div>

        {/* Title */}
        <div className="flex items-center justify-between mb-4 mt-12">
          <div className="inline-flex items-center gap-4 text-[#7f4534ff] bg-[#fecb00] px-5 py-3 rounded-full text-3xl font-bold">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
        </svg>
        โปรไฟล์ของฉัน
          </div>
        </div>

        <h1 className="text-6xl font-extrabold text-slate-900 mb-4 mt-5">โปรไฟล์</h1>
        <p className="text-2xl text-slate-700 mb-6">จัดการข้อมูลส่วนตัวของคุณ</p>
      </div>


    <div className="flex justify-center py-10">
  <div className="w-full bg-gradient-to-r from-blue-50 to-blue-75 rounded-3xl p-8 shadow-lg flex flex-col items-center space-y-6">
    
    {/* Avatar */}
    <div className="w-52 h-52 rounded-full border-6 border-[#fecb00] overflow-hidden shadow-lg">
  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
</div>

{!editing ? (
  <>
    <h2 className="text-6xl font-extrabold text-slate-900">{user.name}</h2>
    <p className="text-4xl text-slate-700">{user.first_name} {user.last_name}</p>
    <p className="text-4xl text-slate-700">{user.email}</p>
    <p className="text-4xl text-slate-700">{user.phone}</p>
    <p className="text-4xl text-slate-700">{user.social_media}</p>
    <p className="text-4xl text-slate-700">{user.description}</p>
    <p className="text-4xl text-slate-700">Role: {user.role}</p>

    <button
      onClick={handleEditClick}
      className="w-full px-10 py-6 bg-[#fecb00] text-[#7f4534ff] rounded-3xl font-semibold shadow hover:bg-yellow-600 transition transform hover:scale-105 text-4xl"
    >
      Edit Profile
    </button>
  </>

    ) : (
      <div className="w-full flex flex-col gap-6">
  <label className="text-3xl font-semibold text-slate-800">
    Name:
    <input
      name="name"
      value={formData.name}
      onChange={handleInputChange}
      className="w-full mt-3 mb-6 p-5 rounded-2xl border border-gray-300 focus:border-yellow-500 focus:ring focus:ring-yellow-300 text-3xl"
    />
  </label>
  <label className="text-3xl font-semibold text-slate-800">
    First Name:
    <input
      name="first_name"
      value={formData.first_name}
      onChange={handleInputChange}
      className="w-full mt-3 mb-6 p-5 rounded-2xl border border-gray-300 focus:border-yellow-500 focus:ring focus:ring-yellow-300 text-3xl"
    />
  </label>
  <label className="text-3xl font-semibold text-slate-800">
    Last Name:
    <input
      name="last_name"
      value={formData.last_name}
      onChange={handleInputChange}
      className="w-full mt-3 mb-6 p-5 rounded-2xl border border-gray-300 focus:border-yellow-500 focus:ring focus:ring-yellow-300 text-3xl"
    />
  </label>
  <label className="text-3xl font-semibold text-slate-800">
    Email:
    <input
      name="email"
      value={formData.email}
      onChange={handleInputChange}
      className="w-full mt-3 mb-6 p-5 rounded-2xl border border-gray-300 focus:border-yellow-500 focus:ring focus:ring-yellow-300 text-3xl"
    />
  </label>
  <label className="text-3xl font-semibold text-slate-800">
    Phone:
    <input
      name="phone"
      value={formData.phone}
      onChange={handleInputChange}
      className="w-full mt-3 mb-6 p-5 rounded-2xl border border-gray-300 focus:border-yellow-500 focus:ring focus:ring-yellow-300 text-3xl"
    />
  </label>
  <label className="text-3xl font-semibold text-slate-800">
    Social Media:
    <input
      name="social_media"
      value={formData.social_media}
      onChange={handleInputChange}
      className="w-full mt-3 mb-6 p-5 rounded-2xl border border-gray-300 focus:border-yellow-500 focus:ring focus:ring-yellow-300 text-3xl"
    />
  </label>
  <label className="text-3xl font-semibold text-slate-800">
    Description:
    <textarea
      name="description"
      value={formData.description}
      onChange={handleInputChange}
      className="w-full mt-3 mb-6 p-5 rounded-2xl border border-gray-300 focus:border-yellow-500 focus:ring focus:ring-yellow-300 text-3xl h-36"
    />
  </label>
  <label className="text-3xl font-semibold text-slate-800">
    Avatar:
    <input
      type="file"
      accept="image/*"
      onChange={handleAvatarChange}
      className="block mt-3 mb-6"
    />
  </label>

  <div className="flex flex-col md:flex-row gap-6">
    <button
      onClick={handleSave}
      disabled={saving}
      className="flex-1 flex items-center justify-center gap-3 px-10 py-6 bg-[#fecb00] text-[#7f4534ff] rounded-3xl font-semibold shadow hover:bg-yellow-500 transition transform hover:scale-105 text-3xl"
    >
      <FaSave /> {saving ? "Saving..." : "Save"}
    </button>
    <button
      onClick={handleCancel}
      className="flex-1 flex items-center justify-center gap-3 px-10 py-6 bg-[#f87171] text-white rounded-3xl font-semibold shadow hover:bg-red-500 transition transform hover:scale-105 text-3xl"
    >
      <FaTimes /> Cancel
    </button>
  </div>
</div>

    )}
  </div>
</div>

</div>

  );
}

