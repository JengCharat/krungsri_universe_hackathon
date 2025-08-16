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

  <div className="flex flex-col h-screen w-screen py-8 px-4 md:px-12">
    {/* Header + Radius controls */}
    <div className="w-full h-[300px] bg-white flex flex-col justify-center px-4 md:px-12 py-5 mt-12">
      {/* Top row */}
      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex items-center gap-4 text-blue-800 bg-blue-200 px-5 py-3 rounded-full text-lg font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
          </svg>
          ที่เที่ยวใกล้ฉัน
        </div>

        <div className="text-lg text-green-900 bg-green-200 px-5 py-3 rounded-full font-bold">
          ระยะรัศมี: {radiusKm.toFixed(1)} กม.
        </div>
      </div> 

      {/* Title */}
      <h1 className="text-6xl font-extrabold text-slate-900 mb-4 mt-5">
        สถานที่เที่ยวใกล้ฉัน
      </h1>

      {/* Sub note */}
      <p className="text-2xl text-slate-700 mb-6">
        ปรับระยะเพื่อดูพื้นที่ใกล้เคียงให้อ่านง่ายและชัดเจน
      </p>

      {/* Slider */}
      <div className="flex flex-col items-center gap-3 px-2 md:px-0">
        <input
          type="range"
          min="0.1"
          max="20"
          step="0.1"
          value={radiusKm}
          onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
          className="w-full accent-indigo-400"
        />
        <div className="flex justify-between w-full text-2xl text-slate-700 px-3">
          <span>0.1 กม.</span>
          <span className="font-extrabold">{radiusKm.toFixed(1)} กม.</span>
          <span>20 กม.</span>
        </div>
      </div>
    </div>

    {/* Map */}
    <div className="flex-1 mt-4 mb-12">
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
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <span className="text-2xl font-bold mb-4">
                    มีสถานที่ท่องเที่ยว {count} แห่ง
                  </span>
                  <button
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold py-4 px-8 rounded-2xl w-full max-w-xs text-3xl shadow-2xl"
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
