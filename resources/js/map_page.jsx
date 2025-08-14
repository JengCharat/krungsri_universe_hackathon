// TouristAttractionMapMobile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function clusterAttractions(attractions, maxDistanceMeters = 100) {
  const clusters = [];
  for (const attr of attractions) {
    const lat = parseFloat(attr.latitude);
    const lon = parseFloat(attr.longitude);
    let foundCluster = null;
    for (const cluster of clusters) {
      const dist = getDistanceKm(lat, lon, cluster.centroidLat, cluster.centroidLon);
      if (dist * 1000 <= maxDistanceMeters) {
        foundCluster = cluster;
        break;
      }
    }
    if (foundCluster) {
      foundCluster.members.push(attr);
      const total = foundCluster.members.length;
      foundCluster.centroidLat =
        (foundCluster.centroidLat * (total - 1) + lat) / total;
      foundCluster.centroidLon =
        (foundCluster.centroidLon * (total - 1) + lon) / total;
    } else {
      clusters.push({ centroidLat: lat, centroidLon: lon, members: [attr] });
    }
  }
  return clusters;
}

function createClusterIcon(count) {
  const intensity = Math.min(255, count * 30);
  const color = `rgb(${intensity}, 0, 0)`;
  return new L.DivIcon({
    html: `<div style="
      background-color: ${color};
      width: 120px;
      height: 120px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-weight: bold;
      border: 4px solid white;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
      font-size: 32px;
      transition: transform 0.2s;
    ">${count}</div>`,
    className: "",
    iconSize: [120, 120],
    iconAnchor: [60, 120],
  });
}

function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function TouristAttractionMapMobile() {
  const [markers, setMarkers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [radiusKm, setRadiusKm] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/tourist-attractions")
      .then(res => setMarkers(res.data))
      .catch(err => console.error("Error fetching markers:", err));
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        err => console.error("ไม่สามารถดึงตำแหน่งได้:", err)
      );
    }
  }, []);

  const filteredMarkers = userLocation
    ? markers.filter(m => {
        const dist = getDistanceKm(
          userLocation[0],
          userLocation[1],
          parseFloat(m.latitude),
          parseFloat(m.longitude)
        );
        return dist <= radiusKm;
      })
    : markers;

  const clusters = clusterAttractions(filteredMarkers);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Mobile-friendly control */}
      <div style={{
        padding: "20px",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 1000,
        boxShadow: "0 4px 16px rgba(0,0,0,0.3)"
      }}>
        <label style={{ fontSize: "50px", fontWeight: "bold", marginBottom: "16px" }}>
          ระยะรัศมี: {radiusKm} กม.
        </label>
        <input
          type="range"
          min="1"
          max="200"
          value={radiusKm}
          onChange={(e) => setRadiusKm(Number(e.target.value))}
          style={{
            width: "95%",
            height: "32px", // track สูงขึ้น
            borderRadius: "16px",
            accentColor: "#007bff",
            cursor: "pointer",
            WebkitAppearance: "none",
            background: "#ddd",
          }}
        />

        <style>
        {`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 40px;
          width: 40px;
          background: #007bff;
          border-radius: 50%;
          border: 3px solid #fff;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          margin-top: -6px; /* ปรับให้ thumb อยู่ตรงกลาง track */
        }

        input[type="range"]::-moz-range-thumb {
          height: 40px;
          width: 40px;
          background: #007bff;
          border-radius: 50%;
          border: 3px solid #fff;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        input[type="range"]::-ms-thumb {
          height: 40px;
          width: 40px;
          background: #007bff;
          border-radius: 50%;
          border: 3px solid #fff;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        `}
        </style>

      </div>

      {/* Map */}
      <div style={{ flex: 1 }}>
        <MapContainer
          center={userLocation || [13.7367, 100.5231]}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {userLocation && <MapUpdater center={userLocation} zoom={14} />}
          {userLocation && (
            <Circle
              center={userLocation}
              radius={radiusKm * 1000}
              pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.15 }}
            />
          )}

          {clusters.map((cluster, idx) => {
            const count = cluster.members.length;
            return (
              <Marker
                key={idx}
                position={[cluster.centroidLat, cluster.centroidLon]}
                icon={createClusterIcon(count)}
              >
                <Popup>
                <style>
                {`
                /* ขยายปุ่มปิด popup ให้ใหญ่และกดง่าย */
                .leaflet-popup-close-button {
                  width: 50px !important;
                  height: 50px !important;
                  font-size: 24px !important;
                  line-height: 40px !important;
                  top: 8px !important;
                  right: 8px !important;
                  color: #fff !important;
                  background: #007bff !important;
                  border-radius: 50% !important;
                  text-align: center !important;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
                }
                .leaflet-popup-close-button:hover {
                  background: #00c6ff !important;
                }
                `}
                </style>
                  <div style={{
                    fontSize: "50px",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "50px"
                  }}>
                    มีสถานที่ท่องเที่ยว {count} แห่ง
                    <br />
                    <button
                      style={{
                        marginTop: "16px",
                        padding: "18px 30px",
                        fontSize: "30px",
                        fontWeight: "bold",
                        background: "linear-gradient(90deg, #007bff, #00c6ff)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "12px",
                        cursor: "pointer",
                        width: "100%",
                        maxWidth: "280px",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
                        transition: "transform 0.2s, box-shadow 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.45)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.35)";
                      }}
                      onClick={() =>
                        navigate(`/attraction/${cluster.members[0].id}`, {
                          state: { details: cluster.members },
                        })
                      }
                    >
                      ดูทั้งหมด
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
