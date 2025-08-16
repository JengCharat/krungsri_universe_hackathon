import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const UploadTouristAttractionForm = () => {
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [entranceFee, setEntranceFee] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [location, setLocation] = useState({ latitude: "", longitude: "" });

  const scale = 2.5; // ขยายฟอนต์

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !tag || !location.latitude || !location.longitude) {
      setMessage("Error: Please fill all required fields.");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("tag", tag);
    formData.append("entrance_fee", entranceFee);
    formData.append("open_time", openTime);
    formData.append("close_time", closeTime);
    formData.append("lat", location.latitude);
    formData.append("long", location.longitude);
    images.forEach((image) => formData.append("images[]", image));

    try {
      await axios.post("/tourist-attractions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setMessage("Tourist attraction created successfully!");
      setImages([]);
      setName("");
      setDescription("");
      setTag("");
      setEntranceFee("");
      setOpenTime("");
      setCloseTime("");
      setLocation({ latitude: "", longitude: "" });
    } catch (error) {
      setMessage(
        "Error: " + (error.response?.data?.message || "Server error")
      );
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      setMessage("Error: You can upload a maximum of 5 images.");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setMessage("Location retrieved successfully.");
        },
        () => setMessage("Error: Unable to retrieve location.")
      );
    }
  };

  return (
<div className="flex flex-col h-screen w-screen bg-white text-slate-900 px-4 md:px-12 mt-12">
  {/* Header */}
  <div className="flex-none w-full h-[300px] flex flex-col justify-center px-6 md:px-12 py-5 relative overflow-hidden sticky top-0 z-10">
    {/* Decorative blobs */}
    <div className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full bg-indigo-100/30 blur-2xl"></div>
    <div className="pointer-events-none absolute -bottom-12 -left-10 w-32 h-32 rounded-full bg-emerald-100/30 blur-2xl"></div>

    <div className="flex items-center justify-between mb-4">
      <div className="inline-flex items-center gap-4 text-blue-800 bg-blue-200 px-5 py-3 rounded-full text-lg font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
        </svg>
        อัปโหลดสถานที่ท่องเที่ยวใหม่
      </div>
    </div>

    <h1 className="text-6xl font-extrabold text-slate-900 mb-4 mt-5">
      อัปโหลดสถานที่ท่องเที่ยวใหม่
    </h1>
    <p className="text-2xl text-slate-700 mb-6">
      แชร์ที่เที่ยวเจ๋ง ๆ ของคุณ
    </p>
  </div>

  {/* Form */}
  <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full max-w-4xl mx-auto py-6">
    {/* Card wrapper for inputs */}
    <div className="bg-gradient-to-r from-blue-50 to-blue-75 bg-white p-8 rounded-3xl shadow-md space-y-6">
      {/* Name */}
      <div>
        <label className="block font-bold mb-2 text-4xl">ชื่อสถานที่</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Eiffel Tower"
          className="w-full px-5 py-4 rounded-2xl bg-gray-100 focus:ring-2 focus:ring-blue-400 shadow-inner text-2xl"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block font-bold mb-2 text-4xl">หมวดหมู่</label>
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="w-full px-5 py-4 rounded-2xl bg-gray-100 focus:ring-2 focus:ring-blue-400 shadow-inner text-2xl"
        >
          <option value="">Select a category</option>
          <option value="nature">Nature</option>
          <option value="historical">Historical</option>
          <option value="cultural">Cultural</option>
          <option value="shopping">Shopping</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Entrance Fee */}
      <div>
        <label className="block font-bold mb-2 text-4xl">ค่าเข้า (บาท)</label>
        <input
          type="number"
          value={entranceFee}
          onChange={(e) => setEntranceFee(e.target.value)}
          placeholder="0"
          className="w-full px-5 py-4 rounded-2xl bg-gray-100 focus:ring-2 focus:ring-blue-400 shadow-inner text-2xl"
        />
      </div>

      {/* Open/Close Time */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block font-bold mb-2 text-4xl">เวลาเปิด</label>
          <input
            type="time"
            value={openTime}
            onChange={(e) => setOpenTime(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-gray-100 focus:ring-2 focus:ring-blue-400 shadow-inner text-2xl"
          />
        </div>
        <div>
          <label className="block font-bold mb-2 text-4xl">เวลาปิด</label>
          <input
            type="time"
            value={closeTime}
            onChange={(e) => setCloseTime(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-gray-100 focus:ring-2 focus:ring-blue-400 shadow-inner text-2xl"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block font-bold mb-2 text-4xl">รายละเอียดเพิ่มเติม</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="5"
          placeholder="A famous landmark located in..."
          className="w-full px-5 py-4 rounded-2xl bg-gray-100 focus:ring-2 focus:ring-blue-400 shadow-inner resize-none text-2xl"
        />
      </div>

      {/* Upload Images */}
      <div>
        <label className="block font-bold mb-2 text-4xl">อัปโหลดรูปภาพ</label>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="mb-4 block w-full text-2xl"
        />
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {images.map((img, i) => (
            <img
              key={i}
              src={URL.createObjectURL(img)}
              alt="preview"
              className="w-full h-32 object-cover rounded-2xl shadow-md"
            />
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block font-bold mb-2 text-4xl">ตำแหน่ง</label>
        <div className="w-full h-80 rounded-3xl overflow-hidden shadow-md">
          {location.latitude && location.longitude ? (
            <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={16}
              className="w-full h-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[location.latitude, location.longitude]}>
                <Popup>{name}</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="bg-gray-100 flex items-center justify-center h-full text-center text-gray-500">
              <div>
                <p className="text-2xl mb-3">Please get your current location</p>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="px-6 py-4 bg-white border rounded-2xl font-bold hover:bg-gray-50 shadow-md transition transform hover:scale-105 text-2xl"
                >
                  รับตำแหน่ง
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Submit */}
    <div className="text-center mt-6">
      <button
        type="submit"
        className="w-full px-8 py-5 bg-blue-600 text-white rounded-3xl font-semibold shadow hover:bg-blue-700 transition transform hover:scale-105 text-4xl"
      >
        อัปโหลด
      </button>
    </div>

    </div>

    
    {/* Message */}
    {message && (
      <div
        className={`mt-8 text-center p-5 rounded-3xl ${
          message.startsWith("Error")
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700"
        } text-xl`}
      >
        {message}
      </div>
    )}
  </form>
</div>


  );
};

export default UploadTouristAttractionForm;
