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
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-10 space-y-8">
        <h1
          className="text-center font-extrabold"
          style={{ fontSize: `${30 * scale}px` }}
        >
          Upload Tourist Attraction
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name */}
          <div>
            <label className="block font-bold mb-2" style={{ fontSize: `${18 * scale}px` }}>
              Attraction Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Eiffel Tower"
              className="w-full px-5 py-3 rounded-3xl bg-gray-100 focus:ring-2 focus:ring-blue-400 shadow-inner"
              style={{ fontSize: `${16 * scale}px` }}
            />
          </div>

          {/* Tag */}
          <div>
            <label className="block font-bold mb-2" style={{ fontSize: `${18 * scale}px` }}>
              Category
            </label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-5 py-3 rounded-3xl bg-gray-100 focus:ring-2 focus:ring-blue-400 shadow-inner"
              style={{ fontSize: `${16 * scale}px` }}
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
            <label className="block font-bold mb-2" style={{ fontSize: `${18 * scale}px` }}>
              Entrance Fee (THB)
            </label>
            <input
              type="number"
              value={entranceFee}
              onChange={(e) => setEntranceFee(e.target.value)}
              placeholder="0"
              className="w-full px-5 py-3 rounded-3xl bg-gray-100 focus:ring-2 focus:ring-blue-400 shadow-inner"
              style={{ fontSize: `${16 * scale}px` }}
            />
          </div>

          {/* Open/Close Time */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-bold mb-2" style={{ fontSize: `${18 * scale}px` }}>
                Open Time
              </label>
              <input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="w-full px-5 py-3 rounded-3xl bg-gray-100 focus:ring-2 focus:ring-blue-400 shadow-inner"
                style={{ fontSize: `${16 * scale}px` }}
              />
            </div>
            <div>
              <label className="block font-bold mb-2" style={{ fontSize: `${18 * scale}px` }}>
                Close Time
              </label>
              <input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="w-full px-5 py-3 rounded-3xl bg-gray-100 focus:ring-2 focus:ring-blue-400 shadow-inner"
                style={{ fontSize: `${16 * scale}px` }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold mb-2" style={{ fontSize: `${18 * scale}px` }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              placeholder="A famous landmark located in..."
              className="w-full px-5 py-3 rounded-3xl bg-gray-100 focus:ring-2 focus:ring-blue-400 resize-none shadow-inner"
              style={{ fontSize: `${16 * scale}px` }}
            />
          </div>

          {/* Upload Images */}
          <div>
            <label className="block font-bold mb-2" style={{ fontSize: `${18 * scale}px` }}>
              Upload Images
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="mb-3 block w-full"
              style={{ fontSize: `${16 * scale}px` }}
            />
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="w-full h-32 object-cover rounded-3xl shadow-lg"
                />
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block font-bold mb-2" style={{ fontSize: `${18 * scale}px` }}>
              Location
            </label>
            <div className="w-full h-80 rounded-3xl overflow-hidden shadow-lg">
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
                      className="px-6 py-4 bg-white border rounded-3xl font-bold hover:bg-gray-50 shadow-md transition transform hover:scale-105"
                      style={{ fontSize: `${16 * scale}px` }}
                    >
                      Get Location
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
            <div className="text-center pt-6">
              <button
                type="submit"
                className="px-16 py-6 bg-blue-500 text-white font-extrabold rounded-3xl hover:bg-blue-600 shadow-2xl text-4xl transition transform hover:scale-105"
              >
                Upload Attraction
              </button>
            </div>
        </form>

        {message && (
          <div
            className={`mt-8 text-center p-5 rounded-3xl ${
              message.startsWith("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
            style={{ fontSize: `${16 * scale}px` }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadTouristAttractionForm;
