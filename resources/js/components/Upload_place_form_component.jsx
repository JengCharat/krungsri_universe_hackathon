import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon path
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !tag || !location.latitude || !location.longitude) {
            setMessage("Error: Please fill all required fields.");
            return;
        }

        const formData = new FormData();

        // formData.append("posted_by", 1);
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
            const response = await axios.post("/tourist-attractions", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            console.log("Response:", response.data);
            setMessage("Tourist attraction created successfully!");

            // Reset form
            setImages([]);
            setName("");
            setDescription("");
            setTag("");
            setEntranceFee("");
            setOpenTime("");
            setCloseTime("");
            setLocation({ latitude: "", longitude: "" });
        } catch (error) {
            console.error("Error:", error);
            setMessage(
                "Error: " + (error.response?.data?.message || "Server error"),
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
                () => setMessage("Error: Unable to retrieve location."),
            );
        }
    };

    return (
        <div className="bg-white min-h-screen py-10 font-sans">
            <div className="container mx-auto max-w-2xl">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Upload Tourist Attraction
                </h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Attraction Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            // required
                            placeholder="Eiffel Tower"
                            className="w-full px-4 py-2 bg-gray-100 rounded-md"
                        />
                    </div>

                    {/* Tag */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Category
                        </label>
                        <select
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            // required
                            className="w-full px-4 py-2 bg-gray-100 rounded-md"
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
                        <label className="block text-sm font-medium mb-1">
                            Entrance Fee (THB)
                        </label>
                        <input
                            type="number"
                            value={entranceFee}
                            onChange={(e) => setEntranceFee(e.target.value)}
                            placeholder="0"
                            className="w-full px-4 py-2 bg-gray-100 rounded-md"
                        />
                    </div>

                    {/* Open/Close Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Open Time
                            </label>
                            <input
                                type="time"
                                value={openTime}
                                onChange={(e) => setOpenTime(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-100 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Close Time
                            </label>
                            <input
                                type="time"
                                value={closeTime}
                                onChange={(e) => setCloseTime(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-100 rounded-md"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            // required
                            placeholder="A famous landmark located in..."
                            className="w-full px-4 py-2 bg-gray-100 rounded-md resize-none"
                        />
                    </div>

                    {/* Upload Image */}
                    <div>
                        <label className="block text-sm font-medium mb-4">
                            Upload Image
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            multiple
                            className="mb-4"
                        />
                        <div className="grid grid-cols-5 gap-4">
                            {images.map((img, i) => (
                                <img
                                    key={i}
                                    src={URL.createObjectURL(img)}
                                    alt="preview"
                                    className="w-full h-24 object-cover rounded"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Location
                        </label>
                        <div className="w-full h-60 rounded-lg overflow-hidden">
                            {location.latitude && location.longitude ? (
                                <MapContainer
                                    center={[
                                        location.latitude,
                                        location.longitude,
                                    ]}
                                    zoom={16}
                                    className="w-full h-full"
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker
                                        position={[
                                            location.latitude,
                                            location.longitude,
                                        ]}
                                    >
                                        <Popup>{name}</Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <div className="bg-gray-100 flex items-center justify-center h-full text-center text-gray-500">
                                    <div>
                                        <p>Please get your current location</p>
                                        <button
                                            type="button"
                                            onClick={handleGetLocation}
                                            className="mt-2 px-4 py-2 bg-white border rounded-md text-sm"
                                        >
                                            Get Location Here
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="text-center pt-4">
                        <button
                            type="submit"
                            className="px-10 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
                        >
                            Upload Attraction
                        </button>
                    </div>
                </form>

                {message && (
                    <div
                        className={`mt-6 text-center p-3 rounded-md ${message.startsWith("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadTouristAttractionForm;
