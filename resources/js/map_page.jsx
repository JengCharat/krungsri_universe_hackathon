// TouristAttractionMap.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function TouristAttractionMap() {
  const [markers, setMarkers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMarkers() {
      try {
        const response = await axios.get("/api/tourist-attractions");
        setMarkers(response.data);
      } catch (error) {
        console.error("Error fetching markers:", error);
      }
    }
    fetchMarkers();
  }, []);

  return (
    <MapContainer
      center={[13.7367, 100.5231]}
      zoom={6}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers.map(({ id, latitude, longitude, description }) => (
        <Marker
          key={id}
          position={[parseFloat(latitude), parseFloat(longitude)]}
        >
          <Popup>
            {description || "No description"} <br />
            <button
              style={{ color: "blue", textDecoration: "underline", cursor: "pointer", background: "none", border: "none" }}
              onClick={() => navigate(`/attraction/${id}`)}
            >
              ดูรายละเอียด
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
