import React, { useEffect, useState } from "react";
import axios from "axios";
import { createRoot } from "react-dom/client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// แก้ไข default marker icon path ให้โหลดจาก CDN
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function TouristAttractionMap() {
  const [markers, setMarkers] = useState([]);

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
          <Popup>{description || "No description"}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

const container = document.getElementById("map");
const root = createRoot(container);
root.render(<TouristAttractionMap />);
