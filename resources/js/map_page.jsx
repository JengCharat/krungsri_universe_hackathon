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
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-weight: bold;
      border: 2px solid white;
      box-shadow: 0 0 5px rgba(0,0,0,0.5);
    ">${count}</div>`,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
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
  const [radiusKm, setRadiusKm] = useState(1);
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
        padding: "10px",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 1000
      }}>
        <label style={{ fontSize: "14px", fontWeight: "bold" }}>
          ระยะรัศมี: {radiusKm} กม.
        </label>
        <input
          type="range"
          min="1"
          max="200"
          value={radiusKm}
          onChange={(e) => setRadiusKm(Number(e.target.value))}
          style={{ width: "90%" }}
        />
      </div>

      {/* Map fullscreen */}
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
              pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.1 }}
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
                  <div style={{ fontSize: "14px" }}>
                    มีสถานที่ท่องเที่ยว {count} แห่ง
                    <br />
                    <button
                      style={{
                        marginTop: "5px",
                        padding: "6px 10px",
                        fontSize: "14px",
                        background: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px"
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
