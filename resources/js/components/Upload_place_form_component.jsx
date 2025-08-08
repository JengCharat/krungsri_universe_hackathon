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

// --- SVG Icons for UI ---
const UploadIcon = () => (
    <svg
        className="w-10 h-10 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
        />
    </svg>
);

const PlusIcon = () => (
    <svg
        className="w-6 h-6 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
    </svg>
);

// --- Main Form Component ---
const UploadPlaceForm = () => {
    const [images, setImages] = useState([]);
    const [message, setMessage] = useState("");
    const [itemName, setItemName] = useState("");
    const [itemDetail, setItemDetail] = useState("");
    const [itemCategory, setItemCategory] = useState("");
    const [itemColor, setItemColor] = useState("");
    const [location, setLocation] = useState({ latitude: "", longitude: "" });
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [point, setPoints] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !itemColor ||
            !itemCategory ||
            !isConfirmed ||
            !location.latitude ||
            !location.longitude
        ) {
            setMessage(
                "Error: All required fields must be filled and location confirmed.",
            );
            return;
        }

        const formData = new FormData();
        formData.append("item_name", itemName);
        formData.append("item_detail", itemDetail);
        formData.append("item_catagory", itemCategory);
        formData.append("item_color", itemColor);
        formData.append("latitude", location.latitude);
        formData.append("longitude", location.longitude);
        if (point) formData.append("point", Number(point));
        images.forEach((image) => formData.append(`images[]`, image));

        try {
            const response = await axios.post("/posts/lost", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            console.log("Response:", response.data);
            setMessage("Post created successfully!");

            // Reset form
            setImages([]);
            setItemName("");
            setItemCategory("");
            setItemDetail("");
            setItemColor("");
            setLocation({ latitude: "", longitude: "" });
            setIsConfirmed(false);
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
        setImages((prevImages) => [...prevImages, ...files]);
    };

    const removeImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setMessage("Location retrieved successfully.");
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setMessage("Error: Unable to retrieve location.");
                },
            );
        } else {
            setMessage("Error: Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className="bg-white min-h-screen py-10 font-sans">
            <div className="container mx-auto max-w-2xl">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Upload new place
                </h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label>
                            <h1>Point</h1>
                        </label>
                        <input
                            type="number"
                            value={point}
                            onChange={(e) => setPoints(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-100 rounded-md"
                        />

                        <label className="block text-sm font-medium text-gray-600 mt-4 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            required
                            placeholder="IPhone 16 Black"
                            className="w-full px-4 py-2 bg-gray-100 rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Category
                        </label>
                        <select
                            value={itemCategory}
                            onChange={(e) => setItemCategory(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-gray-100 rounded-md"
                        >
                            <option value="">Select a category</option>
                            <option value="electronic_devices">
                                Electronic devices
                            </option>
                            <option value="key">Key</option>
                            <option value="card">Card</option>
                            <option value="bags">Bags & Wallets</option>
                            <option value="others">Others</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Color
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {[
                                "red",
                                "yellow",
                                "white",
                                "pink",
                                "blue",
                                "purple",
                                "orange",
                            ].map((color) => (
                                <label
                                    key={color}
                                    className="flex items-center cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="color"
                                        value={color}
                                        checked={itemColor === color}
                                        onChange={(e) =>
                                            setItemColor(e.target.value)
                                        }
                                        className="sr-only"
                                    />
                                    <div
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${itemColor === color ? "border-gray-500 scale-110" : "border-transparent"}`}
                                        style={{
                                            backgroundColor: color,
                                            boxShadow:
                                                color === "white"
                                                    ? "inset 0 0 0 1px #ccc"
                                                    : "none",
                                        }}
                                    ></div>
                                    <span className="ml-2 text-sm capitalize">
                                        {color}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Description
                        </label>
                        <textarea
                            value={itemDetail}
                            onChange={(e) => setItemDetail(e.target.value)}
                            required
                            rows="4"
                            placeholder="IPhone 16 black, found at BTS Siam..."
                            className="w-full px-4 py-2 bg-gray-100 rounded-md resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-4">
                            Upload Image
                        </label>
                        <div className="flex items-start gap-6">
                            <div className="w-2/5">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="w-full h-40 bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200"
                                >
                                    <UploadIcon />
                                </label>
                            </div>
                            <div className="w-3/5 text-sm text-gray-500 mt-2">
                                <p>The first image will be the thumbnail.</p>
                                <p className="mt-2">Max 5 images allowed.</p>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-5 gap-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="relative w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center"
                                >
                                    {images[index] ? (
                                        <>
                                            <img
                                                src={URL.createObjectURL(
                                                    images[index],
                                                )}
                                                alt="preview"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeImage(index)
                                                }
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                                            >
                                                &times;
                                            </button>
                                        </>
                                    ) : (
                                        <PlusIcon />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- Location Section --- */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
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
                                    scrollWheelZoom={false}
                                    className="w-full h-full"
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                                    />
                                    <Marker
                                        position={[
                                            location.latitude,
                                            location.longitude,
                                        ]}
                                    >
                                        <Popup>Current Location</Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <div className="bg-gray-100 flex items-center justify-center h-full text-center text-gray-500">
                                    <div>
                                        <p>Please get your current location</p>
                                        <button
                                            type="button"
                                            onClick={handleGetLocation}
                                            className="mt-2 px-4 py-2 bg-white border rounded-md text-sm hover:bg-gray-50"
                                        >
                                            Get Location Here
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- Confirmation Section --- */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="confirmation"
                            checked={isConfirmed}
                            onChange={(e) => setIsConfirmed(e.target.checked)}
                            className="h-5 w-5 text-gray-800"
                        />
                        <label
                            htmlFor="confirmation"
                            className="ml-3 text-sm text-gray-600"
                        >
                            I confirm I found the item and will wait for the
                            rightful owner.
                        </label>
                    </div>

                    {/* --- Submit Button --- */}
                    <div className="text-center pt-4">
                        <button
                            type="submit"
                            disabled={!isConfirmed}
                            className="px-10 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                            Report Lost
                        </button>
                    </div>
                </form>

                {/* --- Message Display --- */}
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

export default UploadPlaceForm;
