import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// แก้ปัญหา Marker icon ไม่ขึ้นใน Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapComponent({ title, LOGO }) {
  const menuItems = [
    { label: "LOGIN", link: "#" },
    { label: "REGISTER", link: "#" },
  ];

  // กำหนดตำแหน่งเริ่มต้น (พิกัด lat, lng)
  const position = [13.7563, 100.5018]; // Bangkok

  return (
    <div>
      {/* Navbar */}
      <div className="navbar flex justify-between p-6 bg-white shadow">
        <div className="logo">
          <h1 className="text-red-600">LOGO</h1>
          <h1 className="text-blue-700">title: {title}</h1>
          <h1 className="text-blue-700">LOGO: {LOGO}</h1>
        </div>
        <div className="item-list ">
          <ul className="flex">
            {menuItems.map((item, index) => (
              <li key={index} className="px-3">
                <a href={item.link}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Leaflet Map */}
      <div style={{ height: "500px", width: "100%" }}>
        <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={position}>
            <Popup>
              Bangkok, Thailand <br /> Default marker.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
