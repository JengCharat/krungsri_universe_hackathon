// TouristAttractionMap.jsx
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

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -28],
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
      width: 30px;
      height: 30px;
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
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
}

function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function TouristAttractionMap() {
  const [markers, setMarkers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [radiusKm, setRadiusKm] = useState(1);
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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.error("ไม่สามารถดึงตำแหน่งได้:", err)
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
    <div>
      <div style={{ marginBottom: "10px" }}>
        <label>
          ระยะรัศมี: {radiusKm} กม.
          <input
            type="range"
            min="1"
            max="200"
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            style={{ width: "200px", marginLeft: "10px" }}
          />
        </label>
      </div>

      <MapContainer
        center={[13.7367, 100.5231]}
        zoom={14}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {userLocation && <MapUpdater center={userLocation} zoom={14} />}

        {userLocation && (
          <>
            {/* <Marker position={userLocation} icon={userIcon}> */}
            {/*   <Popup>คุณอยู่ที่นี่</Popup> */}
            {/* </Marker> */}
            <Circle
              center={userLocation}
              radius={radiusKm * 1000}
              pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.1 }}
            />
          </>
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

<button
          onClick={() => navigate("/trips")}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          ดูทริปทั้งหมด
        </button>
                <div>
                  มีสถานที่ท่องเที่ยว {count} แห่งในบริเวณนี้
                  <br />
                  <button
                    onClick={() =>
                      navigate(`/attraction/${cluster.members[0].id}`, {
                        state: { details: cluster.members },
                      })
                    }
                  >
                    ดูรายละเอียดทั้งหมด
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
